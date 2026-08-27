# Chapter 8: Definitions

## Core Idea
The method depends less on sophisticated mathematics than on disciplined judgment in defining variables and their pairwise interactions. Bad variables produce a precise but irrelevant decomposition.

## Frameworks Introduced
- **Misfit-variable construction**
  - How: collect failures from users, policy, technical knowledge, observation, and currently implicit successes; state each as a relation that can go wrong; normalize items to comparable scope.
- **Pairwise interaction coding**
  - For each pair `(x_i, x_j)`, ask whether action to eliminate one predictably changes the likelihood of the other.
  - Mark conflict when the effects oppose, concurrence when they reinforce, and no link when interaction is negligible or unknown.
- **Scope normalization**
  - Split variables that dominate many minor ones; merge variables that are merely alternate wording of one failure.

## Key Concepts
- **Exhaustiveness**: sufficient coverage of salient ways the ensemble can fail, not a metaphysically complete list.
- **Relevance**: a variable concerns the form-context relation and can influence design.
- **Scope**: the breadth or significance of a variable.
- **Signed graph**: variables as vertices and positive/negative interactions as links.
- **Interaction coefficient**: an estimate of conflict, concurrence, or independence.

## Mental Models
- The quality ceiling of the decomposition is the quality of the variable set.
- Separate evidence from confidence: an absent edge may mean independence or ignorance.
- Phrase a variable so a reviewer could point to evidence that it is active.

## Anti-patterns
- **Mixed granularity**: combines civilization-scale goals with tiny component details.
- **Solution language**: writes “provide a courtyard” instead of the failure the courtyard might resolve.
- **Stakeholder wish aggregation**: copies requests without converting them to ensemble relations.
- **Forced edges**: invents an interaction because two items share a topic.
- **False completeness**: treats the first list as final.

## Worked Example
For a kettle, “too small” and “occupies too much space” conflict: increasing capacity improves one and harms the other. “Cannot withstand boiling temperature” and “corrodes in steam” may concur because a material choice can improve both. “Heats fast enough” should be unpacked into mechanisms such as one-way heat transmission and low thermal capacity when those distinctions change interactions.

## Key Takeaways
1. Derive variables from potential failures, even when presenting them later as positive needs.
2. Keep variables at roughly equal scope.
3. Code only interactions with a defensible physical or causal basis.
4. Revisit the inventory when decomposition yields incoherent or dominated sets.

## Connects To
- **Ch 2**: establishes the negative definition of fit.
- **Ch 6**: turns variables and links into the program.
- **Appendix 1**: shows a 141-variable inventory in practice.

