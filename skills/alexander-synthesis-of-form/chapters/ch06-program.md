# Chapter 6: The Program

## Core Idea
A design program should be a complete structural description of the problem, expressed as requirements and their interactions, and decomposed into a hierarchy of nearly independent subsets. It organizes synthesis without specifying a form.

## Frameworks Introduced
- **Program as a hierarchy of requirement sets**
  - When to use: before synthesizing a complex form.
  - How: define a set `M` of equal-scope misfit variables; record pairwise conflict or concurrence; partition `M` to minimize coupling between subsets; repeat recursively to singleton variables.
- **Four conditions of a useful program**
  1. It permits a sufficiently wide range of alternative solutions.
  2. It expresses all solution criteria in one symbolism.
  3. Its subsets are disjoint and collectively exhaustive at each split.
  4. Decomposition continues until terminal one-variable sets.
- **Extensional definition**
  - Define a subsystem by the variables it contains, not by an intuitive category name.

## Key Concepts
- **Program**: a representation of the problem's functional structure.
- **Set `M`**: the complete selected collection of misfit variables.
- **Hierarchy**: nested partitions in which children are disjoint and their union is the parent.
- **Conflict**: reducing one misfit tends to worsen another.
- **Concurrence**: reducing one misfit tends to reduce another.
- **Independence**: no marked interaction is evident.

## Mental Models
- The program is a map of forces, not a miniature solution.
- A good split maximizes integrity within branches while minimizing information crossing between them.
- Keep the variable inventory and physical proposal separate long enough for unexpected groupings to emerge.

## Anti-patterns
- **Brief as prose only**: hides scope, overlap, and interaction.
- **Solution-seeded requirements**: encodes preferred components before the program is derived.
- **Named buckets first**: forces variables into familiar themes before examining their links.
- **Overlapping branches**: makes the same variable independently authoritative in multiple subproblems.

## Worked Example
For a kettle, variables can express failures involving heating speed, heat retention, filling, pouring, corrosion, cleaning, manufacturing, and safety. The program does not begin with handle, lid, and spout. It begins with the failures and their relations; component ideas appear only when related variable sets are translated into constructive diagrams.

## Key Takeaways
1. Represent the problem before representing the solution.
2. Keep variables comparable in scope.
3. Make every partition exhaustive and non-overlapping.
4. Let interaction structure, not vocabulary, decide the hierarchy.

## Connects To
- **Ch 7**: explains the realization and use of the hierarchy.
- **Ch 8**: supplies rules for defining variables and interactions.
- **Appendix 2**: formalizes minimum-coupling decomposition.

