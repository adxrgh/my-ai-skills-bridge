#!/usr/bin/env python3
"""Deterministic compiler and renderer for nonfiction-condensed-reader.

The sibling novel-condensed-reader supplies canonical indexing primitives. This
module owns the nonfiction analysis schema, argument-order validation, rendering,
and provenance profile. Model-authored JSON never carries source prose.
"""

from __future__ import annotations

import argparse
import importlib.util
import json
import re
import subprocess
import sys
import zipfile
from pathlib import Path
from typing import Any, Iterable, Sequence


SCHEMA_VERSION = 1
PROFILE = "nonfiction-faithful"
WINDOW_KINDS = {"definition", "argument", "evidence", "case-study", "method", "voice"}


def load_core() -> Any:
    skills_root = Path(__file__).resolve().parents[2]
    core_path = skills_root / "novel-condensed-reader" / "scripts" / "novel_condense.py"
    if not core_path.is_file():
        raise RuntimeError(
            "nonfiction-condensed-reader requires the sibling novel-condensed-reader "
            f"deterministic core: {core_path}"
        )
    spec = importlib.util.spec_from_file_location("nonfiction_condensed_core", core_path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"cannot load deterministic condensed-reader core: {core_path}")
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


core = load_core()
CondenseError = core.CondenseError


def require_fields(payload: dict[str, Any], fields: Iterable[str], context: str) -> None:
    core.require_fields(payload, fields, context)


def validate_batch_analysis(
    payload: dict[str, Any],
    batch: dict[str, Any],
    manifest: dict[str, Any],
    canonical: str,
    block_by_id: dict[str, dict[str, Any]],
    workdir: Path,
) -> None:
    core.reject_forbidden_keys(payload)
    core.reject_copied_prose(payload, canonical)
    require_fields(
        payload,
        [
            "schema_version",
            "source_sha256",
            "batch_id",
            "chapter_id",
            "summary",
            "claims",
            "facts",
            "candidate_windows",
        ],
        f"analysis {batch['batch_id']}",
    )
    if payload["schema_version"] != SCHEMA_VERSION:
        raise CondenseError(f"analysis {batch['batch_id']} has unsupported schema version")
    if payload["source_sha256"] != manifest["source"]["sha256"]:
        raise CondenseError(f"analysis {batch['batch_id']} source hash mismatch")
    if payload["batch_id"] != batch["batch_id"] or payload["chapter_id"] != batch["chapter_id"]:
        raise CondenseError(f"analysis identity mismatch for {batch['batch_id']}")
    if not isinstance(payload["summary"], str) or not payload["summary"].strip():
        raise CondenseError(f"analysis {batch['batch_id']} summary must be non-empty text")
    if not isinstance(payload["claims"], list) or not all(isinstance(item, str) for item in payload["claims"]):
        raise CondenseError(f"analysis {batch['batch_id']} claims must be a list of text")
    if not isinstance(payload["facts"], list) or not isinstance(payload["candidate_windows"], list):
        raise CondenseError(f"analysis {batch['batch_id']} facts and candidate_windows must be lists")

    selectable = set(batch["selectable_block_ids"])
    visible_payload = core.read_json(workdir / batch["file"])
    visible = {block["id"] for block in visible_payload["blocks"]}
    for fact in payload["facts"]:
        if not isinstance(fact, dict):
            raise CondenseError("fact entries must be objects")
        require_fields(fact, ["fact_id", "description", "first_supported_block_id", "orientation_safe"], "fact")
        if not isinstance(fact["description"], str) or not fact["description"].strip():
            raise CondenseError(f"fact {fact.get('fact_id')} description must be non-empty text")
        if not isinstance(fact["orientation_safe"], bool):
            raise CondenseError(f"fact {fact['fact_id']} orientation_safe must be boolean")
        if fact["first_supported_block_id"] not in selectable:
            raise CondenseError(f"fact {fact['fact_id']} must first be supported inside selectable blocks")

    for window in payload["candidate_windows"]:
        if not isinstance(window, dict):
            raise CondenseError("candidate window entries must be objects")
        require_fields(
            window,
            [
                "window_id",
                "start_block_id",
                "end_block_id",
                "decisive_block_id",
                "kind",
                "argument_importance",
                "text_irreplaceability",
                "reason",
            ],
            "candidate window",
        )
        if window["kind"] not in WINDOW_KINDS:
            raise CondenseError(f"window {window['window_id']} has invalid nonfiction kind")
        importance = window["argument_importance"]
        if not isinstance(importance, int) or not 0 <= importance <= 5:
            raise CondenseError(f"window {window['window_id']} argument importance must be 0..5")
        if window["text_irreplaceability"] not in {4, 5}:
            raise CondenseError(f"window {window['window_id']} text irreplaceability must be 4 or 5")
        start_id = window["start_block_id"]
        end_id = window["end_block_id"]
        if start_id not in visible or end_id not in visible:
            raise CondenseError(f"window {window['window_id']} must stay inside its batch plus context")
        if start_id not in block_by_id or end_id not in block_by_id:
            raise CondenseError(f"window {window['window_id']} references unknown blocks")
        if block_by_id[start_id]["order"] > block_by_id[end_id]["order"]:
            raise CondenseError(f"window {window['window_id']} has reversed bounds")
        if window["decisive_block_id"] not in selectable:
            raise CondenseError(f"window {window['window_id']} decisive block must be selectable in this batch")


def compile_analysis(workdir: Path) -> dict[str, Any]:
    workdir = workdir.expanduser().resolve()
    manifest, canonical, blocks, chapters = core.load_workdir(workdir)
    batch_index = core.read_json(workdir / "batch-index.json")
    if batch_index.get("source_sha256") != manifest["source"]["sha256"]:
        raise CondenseError("batch index source hash mismatch")
    block_by_id = {block["id"]: block for block in blocks}
    facts: list[dict[str, Any]] = []
    windows: list[dict[str, Any]] = []
    chapter_cards: list[dict[str, Any]] = []
    fact_ids: set[str] = set()
    window_ids: set[str] = set()
    for batch in batch_index["batches"]:
        payload = core.read_json(workdir / batch["analysis_file"])
        validate_batch_analysis(payload, batch, manifest, canonical, block_by_id, workdir)
        for fact in payload["facts"]:
            if fact["fact_id"] in fact_ids:
                raise CondenseError(f"duplicate fact id: {fact['fact_id']}")
            fact_ids.add(fact["fact_id"])
            facts.append({**fact, "batch_id": batch["batch_id"], "chapter_id": batch["chapter_id"]})
        for window in payload["candidate_windows"]:
            if window["window_id"] in window_ids:
                raise CondenseError(f"duplicate window id: {window['window_id']}")
            window_ids.add(window["window_id"])
            windows.append({**window, "batch_id": batch["batch_id"], "chapter_id": batch["chapter_id"]})
        chapter_cards.append(
            {
                "batch_id": batch["batch_id"],
                "chapter_id": batch["chapter_id"],
                "summary": payload["summary"],
                "claims": payload["claims"],
                "argument_before": payload.get("argument_before", ""),
                "argument_after": payload.get("argument_after", ""),
                "fact_ids": [fact["fact_id"] for fact in payload["facts"]],
                "candidate_window_ids": [window["window_id"] for window in payload["candidate_windows"]],
            }
        )
    catalog = {
        "schema_version": SCHEMA_VERSION,
        "profile": PROFILE,
        "source_sha256": manifest["source"]["sha256"],
        "title": manifest["title"],
        "coverage": {
            "required_batches": batch_index["batch_count"],
            "analyzed_batches": len(chapter_cards),
            "covered_blocks": batch_index["covered_block_count"],
        },
        "chapters": chapters,
        "chapter_cards": chapter_cards,
        "facts": facts,
        "candidate_windows": windows,
    }
    core.write_json_atomic(workdir / "analysis-catalog.json", catalog)
    validation = {
        "ok": True,
        "profile": PROFILE,
        "source_sha256": manifest["source"]["sha256"],
        "batches": len(chapter_cards),
        "covered_blocks": batch_index["covered_block_count"],
        "facts": len(facts),
        "candidate_windows": len(windows),
    }
    core.write_json_atomic(workdir / "analysis-validation.json", validation)
    return catalog


def fact_ids_from(value: Any, field: str) -> list[str]:
    ids = value.get(field, []) if isinstance(value, dict) else []
    if not isinstance(ids, list) or not all(isinstance(item, str) for item in ids):
        raise CondenseError(f"{field} must be a list of fact IDs")
    return ids


def validate_fact_refs(
    ids: Sequence[str],
    facts: dict[str, dict[str, Any]],
    block_by_id: dict[str, dict[str, Any]],
    max_order: int,
    context: str,
    orientation_safe_only: bool = False,
) -> None:
    for fact_id in ids:
        fact = facts.get(fact_id)
        if fact is None:
            raise CondenseError(f"{context} references unknown fact: {fact_id}")
        if orientation_safe_only and not bool(fact.get("orientation_safe")):
            raise CondenseError(f"{context} uses a fact not marked orientation-safe: {fact_id}")
        support_id = fact["first_supported_block_id"]
        if block_by_id[support_id]["order"] > max_order:
            raise CondenseError(f"{context} uses fact {fact_id} before its source support")


def validate_reading_plan(
    plan: dict[str, Any],
    catalog: dict[str, Any],
    manifest: dict[str, Any],
    canonical: str,
    blocks: list[dict[str, Any]],
) -> None:
    core.reject_forbidden_keys(plan)
    core.reject_copied_prose(plan, canonical)
    require_fields(plan, ["schema_version", "source_sha256", "book_map", "units", "review_map"], "reading plan")
    if plan["schema_version"] != SCHEMA_VERSION:
        raise CondenseError("reading plan has unsupported schema version")
    if plan["source_sha256"] != manifest["source"]["sha256"]:
        raise CondenseError("reading plan source hash mismatch")
    block_by_id = {block["id"]: block for block in blocks}
    facts = {fact["fact_id"]: fact for fact in catalog["facts"]}
    windows = {window["window_id"]: window for window in catalog["candidate_windows"]}
    last_order = blocks[-1]["order"]

    book_map = plan["book_map"]
    require_fields(book_map, ["central_thesis", "problem", "key_terms", "sections", "support_fact_ids"], "book_map")
    validate_fact_refs(
        fact_ids_from(book_map, "support_fact_ids"), facts, block_by_id, last_order, "book_map", True
    )
    if not isinstance(book_map["sections"], list):
        raise CondenseError("book_map sections must be a list")
    for section in book_map["sections"]:
        require_fields(section, ["name", "move", "support_fact_ids"], "book_map section")
        validate_fact_refs(
            fact_ids_from(section, "support_fact_ids"), facts, block_by_id, last_order, "book_map section", True
        )

    review = plan["review_map"]
    require_fields(
        review,
        [
            "argument_backbone",
            "myths_and_revisions",
            "key_concepts",
            "evidence_and_cases",
            "practice_implications",
            "limits_and_open_questions",
            "reread_map",
        ],
        "review_map",
    )

    used_windows: set[str] = set()
    previous_unit_end = -1
    for unit in plan["units"]:
        require_fields(
            unit,
            [
                "unit_id",
                "name",
                "source_chapter_ids",
                "start_block_id",
                "end_block_id",
                "segments",
                "why_it_matters",
                "why_support_fact_ids",
            ],
            "argument unit",
        )
        if unit["start_block_id"] not in block_by_id or unit["end_block_id"] not in block_by_id:
            raise CondenseError(f"unit {unit['unit_id']} references unknown bounds")
        unit_start = block_by_id[unit["start_block_id"]]["order"]
        unit_end = block_by_id[unit["end_block_id"]]["order"]
        if unit_start > unit_end or unit_start != previous_unit_end + 1:
            raise CondenseError(f"unit {unit['unit_id']} is reversed, overlapping, or leaves a source gap")
        previous_unit_end = unit_end
        if not isinstance(unit["segments"], list) or not unit["segments"]:
            raise CondenseError(f"unit {unit['unit_id']} must contain at least one segment")
        validate_fact_refs(
            fact_ids_from(unit, "why_support_fact_ids"), facts, block_by_id, unit_end, f"unit {unit['unit_id']} why"
        )
        segment_cursor = unit_start - 1
        for segment in unit["segments"]:
            segment_type = segment.get("type")
            if segment_type == "overview":
                require_fields(segment, ["type", "text", "through_block_id", "support_fact_ids"], "overview segment")
                through_id = segment["through_block_id"]
                if through_id not in block_by_id:
                    raise CondenseError("overview segment references unknown through_block_id")
                through_order = block_by_id[through_id]["order"]
                if through_order <= segment_cursor or through_order > unit_end:
                    raise CondenseError("overview segment is outside argument order")
                validate_fact_refs(
                    fact_ids_from(segment, "support_fact_ids"),
                    facts,
                    block_by_id,
                    through_order,
                    f"unit {unit['unit_id']} overview",
                )
                segment_cursor = through_order
            elif segment_type == "source_window":
                require_fields(
                    segment,
                    [
                        "type",
                        "window_id",
                        "lead_in",
                        "lead_in_support_fact_ids",
                        "takeaway",
                        "takeaway_support_fact_ids",
                    ],
                    "source window segment",
                )
                window = windows.get(segment["window_id"])
                if window is None:
                    raise CondenseError(f"unknown candidate window: {segment['window_id']}")
                if segment["window_id"] in used_windows:
                    raise CondenseError(f"window reused more than once: {segment['window_id']}")
                used_windows.add(segment["window_id"])
                start_order = block_by_id[window["start_block_id"]]["order"]
                end_order = block_by_id[window["end_block_id"]]["order"]
                if start_order != segment_cursor + 1 or start_order < unit_start or end_order > unit_end:
                    raise CondenseError(f"window {segment['window_id']} is outside unit order")
                validate_fact_refs(
                    fact_ids_from(segment, "lead_in_support_fact_ids"),
                    facts,
                    block_by_id,
                    max(unit_start - 1, start_order - 1),
                    f"window {segment['window_id']} lead-in",
                )
                validate_fact_refs(
                    fact_ids_from(segment, "takeaway_support_fact_ids"),
                    facts,
                    block_by_id,
                    end_order,
                    f"window {segment['window_id']} takeaway",
                )
                segment_cursor = end_order
            else:
                raise CondenseError(f"unknown segment type: {segment_type}")
        if segment_cursor != unit_end:
            raise CondenseError(f"unit {unit['unit_id']} segments do not cover its complete source range")
    if not plan["units"] or previous_unit_end != last_order:
        raise CondenseError("argument units do not cover the complete indexed source")


def markdown_list(items: Sequence[Any]) -> str:
    return "\n".join(f"- {item}" for item in items) if items else "- （无）"


def render_reading(workdir: Path, plan_path: Path, output_path: Path | None = None) -> dict[str, Any]:
    workdir = workdir.expanduser().resolve()
    manifest, canonical, blocks, _chapters = core.load_workdir(workdir)
    catalog = core.read_json(workdir / "analysis-catalog.json")
    plan = core.read_json(plan_path)
    validate_reading_plan(plan, catalog, manifest, canonical, blocks)
    block_by_id = {block["id"]: block for block in blocks}
    window_by_id = {window["window_id"]: window for window in catalog["candidate_windows"]}
    source_token = manifest["source"]["sha256"][:12]

    book_map = plan["book_map"]
    display_title = str(book_map.get("display_title") or manifest["title"]).strip()
    lines: list[str] = [f"# {display_title}：结构化浓缩阅读版", "", "## 全书论证地图", ""]
    lines.extend([f"中心主张：{book_map['central_thesis']}", "", f"要处理的问题：{book_map['problem']}", ""])
    if book_map.get("key_terms"):
        lines.extend(["关键概念：", "", markdown_list(book_map["key_terms"]), ""])
    if book_map.get("sections"):
        lines.extend(["论证阶段：", ""])
        for section in book_map["sections"]:
            lines.append(f"- {section['name']}：{section['move']}")
        lines.append("")

    provenance_windows: list[dict[str, Any]] = []
    provenance_units: list[dict[str, Any]] = []
    for unit in plan["units"]:
        lines.extend([f"## 【{unit['name']}】", "", "### 核心论证", ""])
        provenance_units.append(
            {
                "unit_id": unit["unit_id"],
                "source_chapter_ids": unit["source_chapter_ids"],
                "start_block_id": unit["start_block_id"],
                "end_block_id": unit["end_block_id"],
            }
        )
        for segment in unit["segments"]:
            if segment["type"] == "overview":
                lines.extend([segment["text"].strip(), ""])
                continue
            window = window_by_id[segment["window_id"]]
            start = block_by_id[window["start_block_id"]]
            end = block_by_id[window["end_block_id"]]
            passage = canonical[int(start["char_start"]) : int(end["char_end"])]
            passage_hash = core.sha256_text(passage)
            marker = f"{source_token}:{segment['window_id']}"
            lines.extend(
                [
                    segment["lead_in"].strip(),
                    "",
                    "### 【进入原文】",
                    "",
                    f"<!-- ORIGINAL_WINDOW_START {marker} -->",
                    passage,
                    f"<!-- ORIGINAL_WINDOW_END {marker} -->",
                    "",
                    "### 【回到论证】",
                    "",
                    segment["takeaway"].strip(),
                    "",
                ]
            )
            provenance_windows.append(
                {
                    "window_id": segment["window_id"],
                    "marker": marker,
                    "start_block_id": start["id"],
                    "end_block_id": end["id"],
                    "start_locator": start["locator"],
                    "end_locator": end["locator"],
                    "quote_sha256": passage_hash,
                    "character_count": len(passage),
                    "kind": window["kind"],
                    "argument_importance": window["argument_importance"],
                    "text_irreplaceability": window["text_irreplaceability"],
                }
            )
        lines.extend(["### 为什么重要", "", unit["why_it_matters"].strip(), ""])

    review = plan["review_map"]
    lines.extend(["## 全书综合地图", ""])
    for title, key in (
        ("论证骨架", "argument_backbone"),
        ("迷思与修正", "myths_and_revisions"),
        ("关键概念", "key_concepts"),
        ("证据与案例", "evidence_and_cases"),
        ("实践影响", "practice_implications"),
        ("限制与开放问题", "limits_and_open_questions"),
    ):
        values = review.get(key, [])
        if values:
            lines.extend([f"### {title}", "", markdown_list(values), ""])
    reread = review.get("reread_map", {})
    if reread:
        lines.extend(["### 原文重读地图", ""])
        for label, key in (
            ("必读", "must_read"),
            ("值得重读", "worth_rereading"),
            ("代表作者声音", "representative_voice"),
        ):
            values = reread.get(key, [])
            if values:
                lines.extend([f"{label}：", "", markdown_list(values), ""])

    rendered = "\n".join(lines).rstrip() + "\n"
    output_path = (output_path or (workdir / "reading.md")).expanduser().resolve()
    core.write_bytes_atomic(output_path, rendered.encode("utf-8"))
    provenance = {
        "schema_version": SCHEMA_VERSION,
        "profile": PROFILE,
        "source": manifest["source"],
        "reading_path": str(output_path),
        "reading_sha256": core.sha256_text(rendered),
        "units": provenance_units,
        "windows": provenance_windows,
    }
    provenance_path = workdir / "provenance.json"
    core.write_json_atomic(provenance_path, provenance)
    verification = verify_render(workdir, output_path, provenance_path)
    return {"output": str(output_path), "provenance": str(provenance_path), "verification": verification}


def verify_render(workdir: Path, reading_path: Path, provenance_path: Path | None = None) -> dict[str, Any]:
    result = core.verify_render(workdir, reading_path, provenance_path)
    result["profile"] = PROFILE
    core.write_json_atomic(workdir.expanduser().resolve() / "verification.json", result)
    return result


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Index and render verifiable condensed nonfiction editions")
    subparsers = parser.add_subparsers(dest="command", required=True)
    ingest_parser = subparsers.add_parser("ingest")
    ingest_parser.add_argument("--source", required=True, type=Path)
    ingest_parser.add_argument("--workdir", required=True, type=Path)
    batches_parser = subparsers.add_parser("batches")
    batches_parser.add_argument("--workdir", required=True, type=Path)
    batches_parser.add_argument("--max-chars", type=int, default=24_000)
    batches_parser.add_argument("--context-blocks", type=int, default=2)
    compile_parser = subparsers.add_parser("compile")
    compile_parser.add_argument("--workdir", required=True, type=Path)
    render_parser = subparsers.add_parser("render")
    render_parser.add_argument("--workdir", required=True, type=Path)
    render_parser.add_argument("--plan", required=True, type=Path)
    render_parser.add_argument("--output", type=Path)
    verify_parser = subparsers.add_parser("verify")
    verify_parser.add_argument("--workdir", required=True, type=Path)
    verify_parser.add_argument("--reading", type=Path)
    verify_parser.add_argument("--provenance", type=Path)
    chapter_parser = subparsers.add_parser("show-chapter")
    chapter_parser.add_argument("--workdir", required=True, type=Path)
    chapter_parser.add_argument("--chapter-id", required=True)
    return parser


def main(argv: Sequence[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    try:
        if args.command == "ingest":
            result = core.ingest(args.source, args.workdir)
        elif args.command == "batches":
            if args.max_chars < 1_000:
                raise CondenseError("--max-chars must be at least 1000")
            result = core.create_batches(args.workdir, args.max_chars, args.context_blocks)
        elif args.command == "compile":
            result = compile_analysis(args.workdir)
        elif args.command == "render":
            result = render_reading(args.workdir, args.plan, args.output)
        elif args.command == "verify":
            reading = args.reading or (args.workdir / "reading.md")
            result = verify_render(args.workdir, reading, args.provenance)
        elif args.command == "show-chapter":
            sys.stdout.write(core.show_chapter(args.workdir, args.chapter_id))
            return 0
        else:
            raise CondenseError(f"unknown command: {args.command}")
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 0
    except (CondenseError, RuntimeError, OSError, zipfile.BadZipFile, subprocess.TimeoutExpired) as exc:
        print(json.dumps({"ok": False, "error": str(exc)}, ensure_ascii=False), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
