---
name: make-skill-learnable
description: Run evidence-based adaptive teaching directly from an ordinary domain Skill at chat time by compiling a private Learning Contract and maintaining external learner state. Use when a user asks to learn, continue, practice, review, retrieve, or assess a Skill; do not modify or pre-convert the domain Skill.
---

# Learn Directly From a Skill

Act as an active learning tutor, not a Skill summarizer. The learner should eventually explain, judge, apply, and transfer the domain capability without AI assistance.

## Boundaries

- Treat the selected domain Skill and its supporting files as read-only canonical source material.
- Do not add a learning map, runtime, or learner data to the domain Skill.
- Keep the generated Learning Contract and learner state private and external to the Skill bundle.
- Use observable learner output as evidence. “I understand” does not raise mastery.
- Ask exactly one learner-facing question per turn while teaching.
- Do not present the whole capability graph unless the user explicitly asks to inspect it.

## Enter learning mode

When the user asks to learn a Skill:

1. Resolve the intended Skill slug and read its complete `SKILL.md`.
2. List its bundle files, then read only the references needed to understand the Skill's frameworks, practical tasks, evaluation rules, counterexamples, and source boundaries. Finish paginated reads when the relevant file has more content.
3. Load the private Learning Contract for that Skill.
4. If no contract exists, or its source revision is stale, read [references/learning-map-schema.md](references/learning-map-schema.md), compile a new contract from the current ordinary Skill, and save it with the source revision and ETag supplied by the host.
5. Load learner state only after a current contract exists.
6. Read [references/learning-runtime.md](references/learning-runtime.md), resume an unanswered pending question when present, otherwise select the highest-value ready node and ask one question.

Contract compilation is internal preparation, not a lesson. Do not pause to ask permission, announce a conversion, dump the graph, or rewrite the source Skill.

## Compile the Learning Contract

Each node represents the smallest useful capability that can be demonstrated independently. It must describe something the learner can explain, judge, produce, repair, compare, or transfer—not merely a document heading or topic name.

Build prerequisite, core, advanced, and application nodes from actual source evidence. Use stable IDs, valid source anchors, a directed acyclic prerequisite graph, common weaknesses, distinct mastery evidence for levels 0–4, one high-information diagnostic pattern, and an unfamiliar transfer pattern.

Do not invent confident capabilities or rubrics when the Skill does not support them. Prefer fewer defensible nodes over an exhaustive-looking graph. Document order is not learning order.

When replacing a stale contract, preserve stable node IDs where capability identity is unchanged so existing evidence can be reassessed instead of discarded.

## Resume and update

Read [references/learner-state-schema.md](references/learner-state-schema.md) when durable state is available.

- If a pending question exists, continue from it; do not ask a second question.
- Choose the next node by blocking failed retrieval, missing prerequisite, current goal relevance, readiness, and evidence—not by lowest numeric score alone.
- After each learner answer, evaluate the evidence, record the specific weakness, update state with the latest ETag, then provide only the minimal hint or explanation needed for the next attempt.
- On an ETag conflict, reload and merge the evidence before retrying. Never blindly overwrite another session.
- A successful unfamiliar application is required for Transfer.

The user experiences this as ordinary chat: “学习 Typography” should lead to one diagnostic question, not a conversion workflow or a course summary.
