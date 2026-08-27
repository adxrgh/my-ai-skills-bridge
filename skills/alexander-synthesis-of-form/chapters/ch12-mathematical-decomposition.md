# Appendix 2: Mathematical Treatment of Decomposition

## Core Idea
The formal problem is to partition a finite signed graph of binary stochastic variables so that information transfer between subsystems is minimized. The mathematics justifies the search for near-independent subproblems while exposing simplifying assumptions.

## Frameworks Introduced
- **Signed interaction graph `G`**
  - Vertices `M(G)` are misfit variables; links `L(G)` represent pairwise dependencies and carry positive or negative signs.
- **Full subgraph**
  - For any subset `S` of variables, include every link whose two endpoints lie in `S`; this defines the subsystem on `S`.
- **Minimum information-transfer decomposition**
  - Compare partitions by how much dependency crosses between their subsets, with normalization to prevent trivial or grossly unbalanced cuts.
- **Recursive bipartition**
  - Select the least-coupled split, then repeat within each child until reaching terminal sets.

## Key Concepts
- **Binary stochastic variable**: a variable taking fit/misfit values with stated probabilities.
- **State**: one assignment of zeros and ones across a system.
- **Link sign**: indicates concurrence or conflict, though both transmit dependence.
- **Cut**: links whose endpoints fall in different subsets.
- **Information transfer**: statistical dependence across a proposed subsystem boundary.
- **Equal-scope assumption**: variables are normalized enough to share a common probability model.

## Reference Table

| Formal object | Design interpretation |
|---|---|
| Vertex | Potential misfit |
| Positive link | Correcting one tends to help the other |
| Negative link | Correcting one tends to hinder the other |
| Full subgraph | Candidate coherent subproblem |
| Sparse cut | Comparatively independent boundary |
| Recursive tree | Design program |

## Worked Example
Given candidate variable subsets, count and weight internal and crossing dependencies rather than grouping by labels. A split with few crossing links allows each side to change with limited disturbance to the other. Repeat this logic within each side. In contemporary terms, this resembles signed graph partitioning or community detection, but Alexander's objective is functional decomposition for synthesis, not merely descriptive clustering.

## Assumptions and Failure Modes
- Pairwise links may miss higher-order interactions.
- Equal state probabilities and equal variable scope simplify the mathematics but rarely hold exactly.
- Interaction estimates contain judgment and uncertainty.
- A mathematically clean cut can still be physically unhelpful; constructive diagrams remain the test.
- Formula OCR in the source PDF is imperfect; consult the original appendix for exact derivations.

## Key Takeaways
1. The formal objective is minimum dependency across subsystem boundaries.
2. Normalize variable scope before trusting the partition.
3. Treat the computation as an attention-organizing aid, not an oracle.
4. Validate every derived group through physical synthesis and evidence.

## Connects To
- **Ch 3**: explains why subsystem independence reduces adaptation time.
- **Ch 9**: uses the partition recursively to form the program tree.

