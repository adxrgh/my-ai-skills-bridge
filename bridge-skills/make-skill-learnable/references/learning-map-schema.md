# Learning Map Contract

Create `references/learning-map.json` inside the converted Skill. JSON is used so the map can be parsed and validated with a standard runtime and no additional package.

## Top-level shape

```json
{
  "schema_version": 1,
  "skill": "typography",
  "skill_revision": "source revision, version, or stable content hash",
  "outcomes": [
    "What a learner should ultimately be able to do"
  ],
  "nodes": []
}
```

`skill_revision` lets a host detect when learner evidence was recorded against an older capability graph. Do not discard old evidence automatically after a revision; mark it for reassessment when the affected node changed.

## Node shape

```json
{
  "id": "hierarchy-diagnosis",
  "title": "Diagnose typographic hierarchy",
  "stage": "core",
  "capability": "Given an unfamiliar interface, identify the primary typographic hierarchy conflict, explain its cause, and propose a correction consistent with the content goal.",
  "prerequisites": ["contrast-relationships"],
  "source_anchors": [
    {
      "file": "references/hierarchy.md",
      "concept": "typographic contrast"
    }
  ],
  "weaknesses": [
    "Treats font size as the only hierarchy variable",
    "Judges prominence without considering content priority"
  ],
  "mastery": {
    "0": "Cannot identify a relevant variable or relationship.",
    "1": "Recognizes the terminology but cannot explain causality.",
    "2": "Explains how at least two variables affect hierarchy.",
    "3": "Correctly diagnoses and repairs a familiar interface with justification.",
    "4": "Transfers the reasoning to unfamiliar content, constraints, and device context."
  },
  "diagnose": {
    "prompt_pattern": "Present an interface with competing heading and body emphasis. Ask which relationship the learner would inspect first and why.",
    "signals": {
      "strong": ["connects visual prominence to content priority"],
      "weak": ["names a variable without explaining its effect"]
    }
  },
  "challenge": {
    "task_pattern": "Present a new interface where font size is not the main cause. Require diagnosis, prediction, correction, and justification.",
    "novelty_constraints": [
      "Do not reuse the diagnostic example",
      "Change either medium, content goal, or operating constraint"
    ]
  }
}
```

## Authoring rules

- IDs remain stable across revisions. Rename an ID only when the capability identity changes.
- `stage` is one of `prerequisite`, `core`, `advanced`, or `application`.
- Source paths are relative to the target Skill and must remain inside it.
- Source anchors support a capability; they are not copied textbook content.
- Levels 0–4 mean Unknown, Familiar, Understand, Apply, and Transfer.
- Levels 2, 3, and 4 must require meaningfully different evidence.
- Level 4 always uses an unfamiliar problem. More polished repetition of a known example is not Transfer.
- Prompt patterns generate fresh questions. Avoid fixed question banks that make recall indistinguishable from answer memorization.
- Use empty prerequisites only for true entry nodes.
- Record uncertainty outside the map when the source cannot support a reliable node or mastery rubric.
