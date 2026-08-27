# External Learner State Contract

Learner state belongs to the host system, not the installed Skill. The host chooses the authorized database or file location and keys state by learner identity plus Skill identity.

## Suggested shape

```json
{
  "schema_version": 1,
  "learner_id": "host-defined identifier",
  "skill": "typography",
  "skill_revision": "source_revision used by the current Learning Contract",
  "session": {
    "current_node": "hierarchy-diagnosis",
    "phase": "challenge",
    "pending_question": {
      "question_id": "host-generated stable identifier",
      "prompt_summary": "Diagnosis of hierarchy under constrained screen width",
      "asked_at": "2026-08-27T10:00:00+08:00"
    }
  },
  "nodes": {
    "hierarchy-diagnosis": {
      "mastery": 3,
      "evidence": [
        {
          "kind": "application",
          "result": "pass",
          "response_summary": "Diagnosed weight and spacing conflict and justified the repair.",
          "recorded_at": "2026-08-27T10:05:00+08:00"
        }
      ],
      "weaknesses": ["overweights font size"],
      "last_retrieved_at": null,
      "next_review_at": null
    }
  },
  "suggested_next": "responsive-hierarchy",
  "updated_at": "2026-08-27T10:05:00+08:00"
}
```

## Update rules

- Preserve evidence; do not store only the current score.
- Summaries should contain the reasoning signal used for evaluation, not unnecessary verbatim personal content.
- A pass at Understand cannot establish Apply or Transfer.
- A failed retrieval adds contrary evidence. Re-estimate mastery from the evidence set rather than mechanically decrementing every failure.
- Save a pending question before waiting for the learner when interruption-safe resume matters.
- On resume, do not ask a second question if an unanswered pending question exists.
- If the Learning Contract source revision changed, retain unaffected evidence and reassess nodes whose capability or rubric changed.
- Do not expose internal numeric mastery mechanically unless the user asks for it. Prefer a capability-oriented summary with evidence and next focus.

If durable storage is unavailable, maintain session state in conversation and state plainly that cross-session resume is not yet guaranteed.
