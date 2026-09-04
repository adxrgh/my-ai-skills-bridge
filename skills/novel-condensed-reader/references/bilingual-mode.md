# Bilingual condensed mode

Use this mode when the reader wants the selected source-language windows shown with a translation. It adapts the useful architecture of `translate-book`—resumable jobs, glossary identity, neighboring context, and manifest validation—without adopting its translated-only output as the source of alignment.

## Boundary

- The canonical corpus and `window_id` remain the only authority for extracted source text.
- Translation is model-authored text stored separately and labeled as translation.
- Default scope is the windows already selected by the faithful condensed-reading plan. Do not translate the whole source unless the user explicitly asks for a complete bilingual book.
- Keep copyrighted bilingual artifacts private unless the user has publication rights.

## Workflow

1. Complete the faithful analysis and `reading-plan.json` first.
2. Run:

   ```bash
   python3 scripts/novel_condense.py translation-jobs \
     --workdir <private-workdir> \
     --plan <reading-plan.json> \
     --target-language zh
   ```

   This creates `translation-jobs.<lang>.json`, deterministic source job files, a preserved `translation-glossary.<lang>.json`, and one expected output path per selected window.

3. Before translating, edit the glossary only when consistent names or recurring terms require it, then rerun `translation-jobs`. A glossary change changes each job hash, so stale translations become pending rather than being silently reused.
4. For each pending job, read its `source_file` and glossary. Translate only `source_text`; use `previous_context` and `next_context` only to resolve voice, entities, and pronouns. Write the declared `output_file` with this schema:

   ```json
   {
     "schema_version": 1,
     "source_sha256": "<from job>",
     "window_id": "<from job>",
     "target_language": "zh",
     "job_sha256": "<from translation-jobs manifest>",
     "translation": "Translated window text only"
   }
   ```

   Preserve paragraph and dialogue boundaries when natural. Do not copy neighboring context into the translation. Never add commentary inside `translation`.

5. Rerun `translation-jobs` to confirm all jobs report `complete`, then compile:

   ```bash
   python3 scripts/novel_condense.py compile-translations \
     --workdir <private-workdir> \
     --jobs <translation-jobs.lang.json>
   ```

6. Render with `--translations <translation-map.lang.json>`. Bilingual windows are displayed as `原文` followed by a clearly labeled target-language translation. The normal bridge and content-bearing enter/exit headings remain unchanged.
7. Run `verify`. Completion requires every original source span to match the canonical corpus and every displayed translation to match the compiled translation map.

## Quality checks

- Names, places, recurring objects, and key terms follow the glossary consistently.
- The translation preserves speaker changes and paragraph rhythm well enough for comparison with the source.
- No source paragraph is silently omitted or merged beyond recognition.
- Machine IDs, hashes, and provenance metadata remain outside reader-facing prose.
