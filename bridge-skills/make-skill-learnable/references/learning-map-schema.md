# Dynamic Learning Contract

Compile this JSON at chat time from the selected ordinary Skill, then store it in the host's private Learning Contract endpoint. Never write it into or modify the source Skill.

## Top-level shape

```json
{
  "schema_version": 1,
  "skill": "typography",
  "source_revision": "exact source revision returned by the host",
  "outcomes": [
    "What a learner should ultimately be able to do"
  ],
  "nodes": []
}
```

`source_revision` binds the contract to the exact ordinary Skill bundle read by the tutor. If it changes, regenerate the contract while preserving stable node IDs for unchanged capabilities. Do not discard learner evidence automatically; reassess nodes whose capability or rubric changed.

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
- Source paths are relative to the ordinary Skill and must name readable files returned by the host.
- Source anchors support a capability; they are not copied textbook content.
- Levels 0–4 mean Unknown, Familiar, Understand, Apply, and Transfer.
- Levels 2, 3, and 4 must require meaningfully different evidence.
- Level 4 always uses an unfamiliar problem. More polished repetition of a known example is not Transfer.
- Prompt patterns generate fresh questions. Avoid fixed question banks that make recall indistinguishable from answer memorization.
- Use empty prerequisites only for true entry nodes.
- Omit a node when the source cannot support a reliable capability or mastery rubric; do not fill gaps with invented authority.
