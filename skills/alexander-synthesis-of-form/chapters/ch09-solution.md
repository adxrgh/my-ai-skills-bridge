# Chapter 9: Solution

## Core Idea
Decompose the signed interaction graph into nested subsets with minimal cross-coupling. The resulting tree is a structural description of the problem and a scaffold for constructive diagrams, not a classification or final answer.

## Frameworks Introduced
- **Minimum-coupling partition**
  - When to use: a set contains too many interacting variables for direct synthesis.
  - How: consider candidate bipartitions; compare the links cut by each against internal links and balance; choose the split with least disruptive cross-interaction; recurse.
- **Strongest useful decomposition**
  - Seek the greatest independence between subproblems that still permits them to be synthesized as a unified form.
- **Functional-to-physical correspondence**
  - For each requirement set, derive a constructive diagram; compose those diagrams so the physical hierarchy mirrors the functional hierarchy.

## Key Concepts
- **Partition**: disjoint subsets whose union is the parent set.
- **Cross-coupling**: interaction links that pass between proposed subsets.
- **Tree of sets**: the recursive hierarchy created by decomposition.
- **Functional hierarchy**: nested organization of interacting requirements.
- **Physical hierarchy**: nested components and patterns of the realized form.

## Mental Models
- A decomposition is good when teams can make progress inside branches without constant renegotiation across branches.
- Surprising neighbors in a set are evidence to investigate, not errors to rename away.
- The tree reallocates attention; the diagram creates the physical answer.

## Anti-patterns
- **Balanced-cut obsession**: chooses equal-sized branches despite strong cross-links.
- **Semantic relabeling**: replaces extensional sets with familiar conceptual buckets.
- **Tree literalism**: assumes every functional branch must become a separately visible object.
- **One-pass decomposition**: fails to revisit variables or links when diagrams expose missing relations.

## Worked Example
The one-hole kettle groups requirements formerly assigned to three components. Their common physical center suggests one wide spout for filling, pouring, boil warning, and access, while eliminating a lid that could spill scalding water. The solution is not read directly from the graph; the graph places the right forces together so a new component can be perceived.

## Key Takeaways
1. Minimize interaction cut across branches, not merely the number of items per branch.
2. Preserve sets extensionally until their physical implications are understood.
3. Translate every significant set into a constructive diagram.
4. Iterate when physical synthesis reveals that the problem map was incomplete.

## Connects To
- **Ch 7**: supplies the diagram-based realization process.
- **Appendix 2**: gives the mathematical rationale for decomposition.

