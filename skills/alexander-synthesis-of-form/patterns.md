# Patterns

## Misfit-First Brief
**When to use**: The brief contains aspirations, feature requests, or vague qualities.

**How**:
1. Define form and context.
2. Rewrite each concern as an observable relation that could fail.
3. Add failures exposed by current use, outside obligations, and implicit successes.
4. Select the salient finite set; record omissions and uncertainty.

**Trade-offs**: Produces testable criteria but can overfocus on known failures and neglect genuinely generative possibilities.

## Equal-Scope Variable Pass
**When to use**: Some requirements dominate the graph or others appear redundant.

**How**: Split broad goals into causally distinct misfits; merge synonyms; remove solution language; check that no variable contains another entire subproblem.

**Trade-offs**: Comparability improves decomposition, but exact equality is unattainable and requires judgment.

## Signed Interaction Interview
**When to use**: Converting a variable inventory into a problem graph.

**How**: For each plausible pair, ask: “If we act to eliminate A, does that predictably help B, hinder B, or leave B essentially unchanged?” Record sign, rationale, evidence, and confidence.

**Trade-offs**: Pairwise coding is inspectable but misses some higher-order effects and can be expensive for large inventories.

## Minimum-Coupling Split
**When to use**: A problem set is too large for direct synthesis.

**How**: Propose partitions; compare cross-boundary dependencies with internal coherence and balance; choose the least disruptive split; recursively repeat.

**Trade-offs**: Makes parallel progress possible but can falsely stabilize around incomplete or biased interaction data.

## Extensional Naming Delay
**When to use**: A derived cluster seems odd or invites a familiar topical label.

**How**: Keep the set identified by member variables; inspect shared physical consequences; name it only after a constructive diagram exists.

**Trade-offs**: Preserves discovery but makes communication temporarily less fluent.

## Constructive Diagram
**When to use**: Translating one coherent set into a physical idea.

**How**:
1. Draw only relations required by the set.
2. Include enough physical specificity to satisfy them.
3. Remove any characteristic not justified by the set.
4. Test the diagram against every member variable.

**Trade-offs**: Prevents premature styling but requires skilled physical intuition; diagrams can still embody unnoticed assumptions.

## Bottom-Up Realization, Top-Down Reconciliation
**When to use**: Combining diagrams into a whole.

**How**: Synthesize small coherent sets; combine siblings; inspect new boundary conflicts; reconcile at the parent; propagate necessary revisions downward; repeat upward.

**Trade-offs**: Protects local integrity, yet too-rigid adherence to the tree can obstruct cross-scale discoveries.

## Pattern-Unit Audit
**When to use**: Reviewing a proposed component or module.

**How**: Ask what larger pattern it serves as a unit, what smaller units it organizes as a pattern, and whether both interfaces preserve fit.

**Trade-offs**: Reveals cross-scale consequences but can encourage infinite decomposition unless stopped at the decision-relevant scale.

## Implicit-Success Inventory
**When to use**: Redesigning a functioning legacy system or social environment.

**How**: Identify conditions currently satisfied without being requested; trace what maintains them; encode their loss as potential misfits before changing the form.

**Trade-offs**: Protects accumulated fit but may preserve harmful traditions unless paired with explicit ethical review.

## Interaction-Map Revision Loop
**When to use**: A cluster will not yield a coherent diagram, or synthesis exposes repeated cross-boundary conflict.

**How**: Return to the variable definitions and links; add missing interactions; split or merge scopes; recompute or manually revise the hierarchy; attempt diagrams again.

**Trade-offs**: Keeps the map corrigible but can become endless; use evidence and explicit stopping criteria.

