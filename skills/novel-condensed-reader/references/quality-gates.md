# Quality gates

Run deterministic verification first. Then review the reading artifact without looking at scores.

## Deterministic gates

- Every corpus block appears in exactly one batch's `selectable_block_ids`.
- Every declared batch has one valid analysis file.
- Every fact and window ID is unique and resolves to the indexed source.
- Window bounds are ordered, local to their batch plus context, and have a selectable decisive block.
- Reading-plan facts obey their reveal boundary.
- Every rendered original window exactly matches its canonical source span and recorded SHA-256.
- No model-authored JSON contains a source-text field or a long copied-source match.

## Reading gates

1. Remove every original window mentally. Does the remaining overview still communicate the complete plot, choices, relationships, and consequential information? If not, strengthen the overview.
2. Restore the windows. Do they provide voice, scene presence, rhythm, psychology, imagery, or form that the overview cannot? If not, remove them.
3. Is any window present only because its plot event is important? Replace it with overview.
4. Was excellent plot-light writing omitted? Revisit the matching faithful batch and add a candidate only when its text irreplaceability is truly 4 or 5.
5. Does the reader always know who is present, where they are, what changed, and why the narrative arrived here?
6. Does any bridge, opening map, or unit overview reveal information before the novel does? Repair fact references and rerender.

Do not expose this checklist, internal scores, or fact IDs inside the final reading prose.
