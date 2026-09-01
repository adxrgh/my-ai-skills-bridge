# Analysis and reading-plan schemas

The deterministic script performs strict validation. Additional fields are allowed when useful, but source prose is forbidden in every model-authored JSON file.

## Per-batch analysis

Write one file at the `analysis_file` path declared by `batch-index.json`:

```json
{
  "schema_version": 1,
  "source_sha256": "<from batch>",
  "batch_id": "<from batch>",
  "chapter_id": "<from batch>",
  "summary": "Continuous account of this batch",
  "characters": ["Name: current role or relationship"],
  "state_before": "State entering the batch",
  "state_after": "State leaving the batch",
  "facts": [
    {
      "fact_id": "f-<batch>-01",
      "description": "One atomic fact",
      "first_revealed_block_id": "b-...",
      "spoiler_safe": false
    }
  ],
  "candidate_windows": [
    {
      "window_id": "w-<batch>-01",
      "start_block_id": "b-...",
      "end_block_id": "b-...",
      "decisive_block_id": "b-...",
      "kind": "character",
      "plot_importance": 3,
      "text_irreplaceability": 5,
      "reason": "Why the writing remains worth reading after summary"
    }
  ]
}
```

`first_revealed_block_id` and `decisive_block_id` must be selectable in that batch. A window may include visible context blocks. Candidate windows require `text_irreplaceability` 4 or 5.

Use globally unique fact and window IDs. Do not add `quote`, `original_text`, `source_text`, `raw_text`, or any equivalent field.

## Reducer reading plan

After `compile`, read `analysis-catalog.json`, not the raw corpus:

```json
{
  "schema_version": 1,
  "source_sha256": "<from catalog>",
  "book_map": {
    "core_story": "Spoiler-safe sentence",
    "core_conflict": "Spoiler-safe conflict",
    "characters": ["Spoiler-safe relationship"],
    "stages": [
      {
        "name": "Stage name",
        "change": "Spoiler-safe fundamental change",
        "support_fact_ids": ["f-..."]
      }
    ],
    "support_fact_ids": ["f-..."]
  },
  "units": [
    {
      "unit_id": "u-01",
      "name": "Natural story-unit name",
      "start_block_id": "b-...",
      "end_block_id": "b-...",
      "segments": [
        {
          "type": "overview",
          "text": "Compressed continuous narration",
          "through_block_id": "b-...",
          "support_fact_ids": ["f-..."]
        },
        {
          "type": "window",
          "window_id": "w-...",
          "bridge": "One to three sentences entering the scene",
          "bridge_support_fact_ids": ["f-..."],
          "after": "One to three sentences identifying the change or detail",
          "after_support_fact_ids": ["f-..."]
        }
      ],
      "why_important": "Short role in the complete book",
      "why_support_fact_ids": ["f-..."]
    }
  ],
  "review_map": {
    "story_backbone": ["10-20 decisive nodes"],
    "character_arcs": ["Start to change to end"],
    "relationship_changes": ["Consequential relationship changes"],
    "themes": ["Core themes"],
    "imagery": ["Recurring imagery and change"],
    "foreshadowing": ["Earlier detail and later payoff"],
    "reread_map": {
      "must_read": ["window ID: reason"],
      "worth_rereading": ["window ID: reason"],
      "representative_style": ["window ID: reason"]
    }
  }
}
```

Order units and segments by source position. An overview cannot pass a later window and then return. Opening-map facts must be marked `spoiler_safe`; unit prose cannot cite facts first revealed after its declared boundary.
