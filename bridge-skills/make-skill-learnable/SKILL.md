---
name: make-skill-learnable
description: Transform an existing domain Skill into an adaptive learning Skill by adding an evidence-based competency graph, learning-mode routing, a teaching runtime, and an external learner-state contract. Use when a user asks to make a Skill teachable, learnable, reviewable, or capable of tracking mastery; do not use merely to teach from an already-converted Skill.
---

# Make Skill Learnable

Convert a domain Skill from a knowledge or application reference into a Skill that can diagnose, teach, challenge, retrieve, and evaluate learning. Preserve the target Skill's canonical knowledge and its existing non-learning behavior.

## Required inputs

- A target Skill directory containing `SKILL.md`.
- The user's requested mode: analyze/propose, or apply the conversion.

Infer apply mode only from an explicit request to convert, modify, or make the target Skill learnable. Analysis, review, or proposal requests do not authorize file changes. Do not install, replace, or publish a converted Skill unless separately requested.

## Non-negotiable boundaries

- Treat the target Skill as canonical domain material. Do not silently rewrite its facts, source text, provenance, or application rules.
- Add a learning layer; do not replace normal lookup, application, review, or production workflows.
- Keep learner-specific state outside the Skill directory. Installed Skills may be shared, versioned, or read-only.
- Award mastery only from observable learner output. A claim such as "I understand" is not evidence.
- Ask exactly one learner-facing question per turn while teaching.
- Do not turn headings into a curriculum mechanically. Learning nodes describe capabilities that can be demonstrated.
- Preserve existing invocation policy, dependencies, UI metadata, permissions, and unrelated files.

## Conversion workflow

### 1. Inspect the target

Read the complete target `SKILL.md`, then follow only the references needed to understand its frameworks, methods, practical tasks, rubrics, and source boundaries. Inventory existing modes and files before proposing edits.

Identify:

- what the Skill already helps a user do;
- which material is canonical and where it lives;
- observable tasks a competent practitioner can perform;
- prerequisites between those tasks;
- existing evaluation rules, counterexamples, and common failure modes;
- claims that are ambiguous or unsupported by the source.

Do not manufacture confident learning criteria for unsupported material. Record uncertainty in the conversion report.

### 2. Compile observable capabilities

Read [references/learning-map-schema.md](references/learning-map-schema.md) before producing the map.

Create `references/learning-map.json` in the target Skill. Each node must be the smallest useful capability that can be independently diagnosed and practiced. Express it as something the learner can explain, judge, produce, repair, compare, or transfer—not merely a topic name.

Every node needs:

- a stable ID and one capability statement;
- a stage: `prerequisite`, `core`, `advanced`, or `application`;
- prerequisite node IDs;
- source anchors relative to the target Skill;
- common weaknesses or misconceptions;
- distinct evidence for mastery levels 0 through 4;
- a diagnostic prompt pattern;
- an unfamiliar transfer challenge pattern.

Build a directed acyclic graph. Document order is not learning order unless actual dependencies require it.

### 3. Add learning-mode routing

Patch the target `SKILL.md` narrowly. Preserve its frontmatter and existing body, then add a learning route that activates for requests to learn, continue, practice, review, retrieve, or assess mastery.

The route must instruct the runtime to:

1. Read `references/learning-map.json` and `references/learning-runtime.md`.
2. Load external learner state when the host provides it.
3. Resume a pending question when one exists; otherwise select one highest-value node.
4. Ask exactly one question and wait for learner output.
5. Update mastery only from evidence in the answer.

Normal application requests must continue through the Skill's original path.

### 4. Install the learning runtime

Copy [references/learning-runtime.md](references/learning-runtime.md) into the target Skill as `references/learning-runtime.md`. Keep it self-contained and retain its `protocol_version` so future conversions can migrate it deliberately.

Read [references/learner-state-schema.md](references/learner-state-schema.md) when the host needs durable progress. Generate an adapter or state file only when the user's system and authorized storage location are known. Never guess a private or global storage destination.

### 5. Validate

Run:

```bash
python3 scripts/validate_learning_skill.py /absolute/path/to/target-skill
```

Resolve `scripts/validate_learning_skill.py` relative to this meta Skill. The validator checks structural invariants; it does not prove teaching quality.

Also inspect behavior with four scenarios when the conversion is substantial:

- novice with a missing prerequisite;
- learner who can explain but not apply;
- advanced learner who should receive an unfamiliar transfer challenge;
- returning learner with a pending question and existing evidence.

For each scenario, verify that the Skill asks one question, does not dump the curriculum, and does not overwrite normal application behavior. Independent agent testing is optional and requires user or applicable instruction authorization.

## Node selection policy

Choose the next node by this order:

1. failed or stale retrieval that blocks the learner's current goal;
2. missing prerequisite on the readiness boundary;
3. unmastered node most relevant to the learner's goal;
4. a transfer challenge for a node already at Apply;
5. the next dependency-ready node.

Do not simply choose the lowest score or the next item in the file. Skip a node when current evidence already demonstrates Transfer.

## Completion report

Report separately:

- target and mode;
- files added or changed;
- preserved original behaviors;
- number of nodes and dependency edges;
- structural validation result;
- behavioral scenarios actually exercised;
- uncertain mappings and remaining host integration, especially learner-state persistence.

Do not claim the target is installed, behaviorally validated, or capable of durable resume unless each was actually verified.
