# Reading-edition contract

The result must remain readable from beginning to end as a condensed novel, not an analysis report.

## Opening map

Keep it brief: one-sentence core story, core conflict, principal people/relationships, natural stages, and the fundamental change in each stage. The map may use only facts marked `spoiler_safe` by the faithful pass. Do not disclose an answer, identity, reversal, or outcome merely because the reducer knows the whole book.

## Story units

Regroup source chapters when action, relationships, time, place, conflict, or theme creates a more natural unit. Preserve source chapter IDs as location metadata, but do not let mechanical chapter numbering control the reading structure.

Use continuous, compressed prose for events, choices, relationship changes, and consequential information. Remove repetitive action, routine transitions, and details that do not change understanding. The prose should still feel like forward movement through the story.

Each unit ends with a short `why_important`. If the significance depends on an unrevealed answer, say only `这里值得记住。`

## Progressive revelation

Every model-authored statement cites fact IDs internally. Before an original window, a bridge may cite only facts revealed before that window. After it, the note may cite facts revealed by the window's end. An overview's `through_block_id` defines its information boundary.

Each original window uses a content-bearing pair of headings: an `enter_title` that tells the reader what scene or question they are entering without spoiling it, and an `exit_title` that names the change or realization just completed. The titles must work as navigation when skimmed without the surrounding prose; structural labels alone are not sufficient.

## Rhythm

Do not target a fixed excerpt percentage. Let narrative density determine compression. The intended rhythm is fast, fast, slow, original window, fast, rather than uniform chapter summaries.

## Closing map

After the complete reading, provide a concise story backbone, character arcs, relationship changes, themes, imagery, foreshadowing/payoff, and a rereading map divided into must-read, worth-rereading, and representative-style windows.

Keep scores, fact IDs, source coordinates, and validation details out of the reading prose; they belong in JSON sidecars.
