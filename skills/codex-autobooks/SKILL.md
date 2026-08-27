---
name: codex-autobooks
description: Download a requested book or convert an existing local book into a verified Agent Skill through the canonical Codex AutoBooks pipeline. Use for AutoBooks book retrieval, queue status, and book-to-skill conversion; do not use the legacy OpenClaw or NotebookLM path.
---

# Codex AutoBooks

Use `/Users/bob/autobooks/scripts/codex_autobooks_entry.py` as the only AutoBooks entry.

## Route the request

- A request only to find or download a book uses `mode: "download"`.
- A request to turn an existing local book into a skill uses `mode: "process"` and `source_files`.
- A request to download and turn a book into a skill uses `mode: "full"`.
- A request about an earlier AutoBooks request uses `mode: "status"` with its `request_id`.

Before a real `process` or `full` run, ensure the user explicitly approved converting the whole book and its potentially substantial token use. A request that explicitly asks to create/generate a skill is approval; a download-only request is not. Pass `conversion_confirmed: true` only when that approval exists.

## Call the entry

Pass one JSON object and inspect the one-line JSON response:

```bash
python3 /Users/bob/autobooks/scripts/codex_autobooks_entry.py --request-json '<JSON>'
```

Use absolute paths for `source_files`. Default to text content, study depth, and the combined application/mental-model/chapter-reference purpose. Let the entry default to `stacks-queue`, `wait_for_completion: true`, `existing_skill_policy: "rename"`, and `~/.agents/skills` unless the user specifies otherwise.

Do not invoke `openclaw_autobooks_entry.py`, `autobooks_pipeline.py`, `stacks_auto_upload_worker.py`, or any NotebookLM command. NotebookLM is not a fallback.

## Interpret completion

Only report conversion complete when all of these are true:

- top-level `ok` is true;
- `terminal` is true;
- `processing.status` is `processed` or `already-processed`;
- `processing.artifact_dir` identifies the generated skill.

For download-only work, `queued`, `background`, `downloaded`, or `done` can be successful without a processing result. Preserve the returned `request_id` for status checks.

If `terminal` is false, report that the download is queued and do not claim the skill exists. If generation or scanning fails, report the returned error and leave the source file intact.
