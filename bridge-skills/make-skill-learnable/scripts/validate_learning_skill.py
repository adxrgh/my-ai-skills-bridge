#!/usr/bin/env python3
"""Validate the structural contract of a converted learning Skill."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any


ALLOWED_STAGES = {"prerequisite", "core", "advanced", "application"}
MASTERY_LEVELS = {str(level) for level in range(5)}


def load_map(path: Path, errors: list[str]) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        errors.append(f"missing learning map: {path}")
        return {}
    except json.JSONDecodeError as exc:
        errors.append(f"invalid JSON in {path}: {exc}")
        return {}
    if not isinstance(value, dict):
        errors.append("learning map root must be an object")
        return {}
    return value


def validate_source_anchor(
    root: Path, node_id: str, anchor: Any, errors: list[str]
) -> None:
    if not isinstance(anchor, dict) or not isinstance(anchor.get("file"), str):
        errors.append(f"node {node_id}: each source anchor needs a file")
        return
    candidate = (root / anchor["file"]).resolve()
    try:
        candidate.relative_to(root)
    except ValueError:
        errors.append(f"node {node_id}: source anchor escapes Skill: {anchor['file']}")
        return
    if not candidate.is_file():
        errors.append(f"node {node_id}: missing source anchor: {anchor['file']}")


def find_cycle(prerequisites: dict[str, list[str]]) -> list[str] | None:
    visiting: set[str] = set()
    visited: set[str] = set()
    stack: list[str] = []

    def visit(node_id: str) -> list[str] | None:
        if node_id in visiting:
            start = stack.index(node_id)
            return stack[start:] + [node_id]
        if node_id in visited:
            return None
        visiting.add(node_id)
        stack.append(node_id)
        for dependency in prerequisites.get(node_id, []):
            cycle = visit(dependency)
            if cycle:
                return cycle
        stack.pop()
        visiting.remove(node_id)
        visited.add(node_id)
        return None

    for node_id in prerequisites:
        cycle = visit(node_id)
        if cycle:
            return cycle
    return None


def validate(root: Path) -> list[str]:
    errors: list[str] = []
    root = root.resolve()
    skill_file = root / "SKILL.md"
    map_file = root / "references" / "learning-map.json"
    runtime_file = root / "references" / "learning-runtime.md"

    if not skill_file.is_file():
        errors.append(f"missing SKILL.md: {skill_file}")
        skill_text = ""
    else:
        skill_text = skill_file.read_text(encoding="utf-8")
    if "references/learning-map.json" not in skill_text:
        errors.append("SKILL.md does not route learning mode to references/learning-map.json")
    if "references/learning-runtime.md" not in skill_text:
        errors.append("SKILL.md does not route learning mode to references/learning-runtime.md")
    if not runtime_file.is_file():
        errors.append(f"missing learning runtime: {runtime_file}")

    data = load_map(map_file, errors)
    if not data:
        return errors
    if data.get("schema_version") != 1:
        errors.append("schema_version must be 1")
    if not isinstance(data.get("skill"), str) or not data["skill"].strip():
        errors.append("skill must be a non-empty string")
    if "skill_revision" not in data:
        errors.append("skill_revision is required")
    outcomes = data.get("outcomes")
    if not isinstance(outcomes, list) or not outcomes:
        errors.append("outcomes must be a non-empty list")

    nodes = data.get("nodes")
    if not isinstance(nodes, list) or not nodes:
        errors.append("nodes must be a non-empty list")
        return errors

    node_ids: set[str] = set()
    prerequisites: dict[str, list[str]] = {}
    for index, node in enumerate(nodes):
        label = f"node[{index}]"
        if not isinstance(node, dict):
            errors.append(f"{label}: must be an object")
            continue
        node_id = node.get("id")
        if not isinstance(node_id, str) or not node_id.strip():
            errors.append(f"{label}: id must be a non-empty string")
            continue
        label = f"node {node_id}"
        if node_id in node_ids:
            errors.append(f"{label}: duplicate id")
        node_ids.add(node_id)
        if node.get("stage") not in ALLOWED_STAGES:
            errors.append(f"{label}: invalid stage {node.get('stage')!r}")
        if not isinstance(node.get("capability"), str) or not node["capability"].strip():
            errors.append(f"{label}: capability must be a non-empty string")

        deps = node.get("prerequisites")
        if not isinstance(deps, list) or not all(isinstance(dep, str) for dep in deps):
            errors.append(f"{label}: prerequisites must be a string list")
            deps = []
        prerequisites[node_id] = deps

        anchors = node.get("source_anchors")
        if not isinstance(anchors, list) or not anchors:
            errors.append(f"{label}: source_anchors must be a non-empty list")
        else:
            for anchor in anchors:
                validate_source_anchor(root, node_id, anchor, errors)

        weaknesses = node.get("weaknesses")
        if not isinstance(weaknesses, list) or not weaknesses:
            errors.append(f"{label}: weaknesses must be a non-empty list")

        mastery = node.get("mastery")
        if not isinstance(mastery, dict) or set(mastery) != MASTERY_LEVELS:
            errors.append(f"{label}: mastery must define exactly levels 0 through 4")
        elif any(not isinstance(mastery[level], str) or not mastery[level].strip() for level in MASTERY_LEVELS):
            errors.append(f"{label}: every mastery level needs observable evidence")
        elif len({mastery["2"], mastery["3"], mastery["4"]}) != 3:
            errors.append(f"{label}: Understand, Apply, and Transfer evidence must differ")

        diagnose = node.get("diagnose")
        if not isinstance(diagnose, dict) or not isinstance(diagnose.get("prompt_pattern"), str):
            errors.append(f"{label}: diagnose.prompt_pattern is required")
        challenge = node.get("challenge")
        if not isinstance(challenge, dict) or not isinstance(challenge.get("task_pattern"), str):
            errors.append(f"{label}: challenge.task_pattern is required")
        elif not isinstance(challenge.get("novelty_constraints"), list) or not challenge["novelty_constraints"]:
            errors.append(f"{label}: challenge.novelty_constraints must be non-empty")

    for node_id, deps in prerequisites.items():
        for dependency in deps:
            if dependency not in node_ids:
                errors.append(f"node {node_id}: unknown prerequisite {dependency}")
            if dependency == node_id:
                errors.append(f"node {node_id}: cannot depend on itself")

    cycle = find_cycle(prerequisites)
    if cycle:
        errors.append(f"prerequisite cycle: {' -> '.join(cycle)}")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("skill", type=Path, help="Converted Skill directory")
    args = parser.parse_args()
    errors = validate(args.skill)
    if errors:
        print(f"FAIL: {len(errors)} error(s)", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        return 1
    print(f"PASS: learning Skill structure is valid: {args.skill.resolve()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
