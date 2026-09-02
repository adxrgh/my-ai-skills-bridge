# Analysis and reading-plan schemas

All model-authored JSON is validated. Additional fields are allowed, but source prose and equivalent quote fields are forbidden.

## Per-batch analysis

```json
{
  "schema_version": 1,
  "source_sha256": "<from batch>",
  "batch_id": "<from batch>",
  "chapter_id": "<from batch>",
  "summary": "Continuous account of the reasoning in this batch",
  "claims": ["Atomic claim or qualification"],
  "argument_before": "Reasoning state entering the batch",
  "argument_after": "Reasoning state leaving the batch",
  "facts": [
    {
      "fact_id": "f-<batch>-01",
      "description": "Atomic supported proposition",
      "first_supported_block_id": "b-...",
      "orientation_safe": false
    }
  ],
  "candidate_windows": [
    {
      "window_id": "w-<batch>-01",
      "start_block_id": "b-...",
      "end_block_id": "b-...",
      "decisive_block_id": "b-...",
      "kind": "argument",
      "argument_importance": 4,
      "text_irreplaceability": 5,
      "reason": "Why the source formulation remains worth reading"
    }
  ]
}
```

Fact support and decisive window blocks must be selectable in that batch. Window bounds may use visible context. IDs must be globally unique. Never add `quote`, `original_text`, `source_text`, `raw_text`, or equivalent fields.

## Reducer reading plan

```json
{
  "schema_version": 1,
  "source_sha256": "<from catalog>",
  "book_map": {
    "display_title": "Optional full title when source metadata omits a subtitle",
    "central_thesis": "The book's central claim",
    "problem": "The assumption or condition it challenges",
    "key_terms": ["Term: concise orientation"],
    "sections": [{"name": "Argument stage", "move": "What this stage establishes", "support_fact_ids": ["f-..."]}],
    "support_fact_ids": ["f-..."]
  },
  "units": [
    {
      "unit_id": "u-01",
      "name": "Natural argument-unit name",
      "source_chapter_ids": ["chapter-..."],
      "start_block_id": "b-...",
      "end_block_id": "b-...",
      "segments": [
        {"type": "overview", "text": "Connected compressed reasoning", "through_block_id": "b-...", "support_fact_ids": ["f-..."]},
        {"type": "source_window", "window_id": "w-...", "lead_in": "Why enter this passage", "lead_in_support_fact_ids": ["f-..."], "takeaway": "What it establishes", "takeaway_support_fact_ids": ["f-..."]}
      ],
      "why_it_matters": "Consequence for understanding or practice",
      "why_support_fact_ids": ["f-..."]
    }
  ],
  "review_map": {
    "argument_backbone": ["Decisive reasoning nodes"],
    "myths_and_revisions": ["Myth -> revision"],
    "key_concepts": ["Concept -> role"],
    "evidence_and_cases": ["Evidence or case -> what it supports"],
    "practice_implications": ["Implication for decisions or conduct"],
    "limits_and_open_questions": ["Qualification, limit, or open question"],
    "reread_map": {"must_read": ["window ID: reason"], "worth_rereading": ["window ID: reason"], "representative_voice": ["window ID: reason"]}
  }
}
```

Order units and segments by source position. Overviews and source windows must cover every indexed block continuously. Opening-map support facts must be `orientation_safe`.
