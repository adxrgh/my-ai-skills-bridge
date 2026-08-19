---
name: font-craft
description: >-
  Typography-only craft skill distilled from "The Non-Designer's Design Book" (写给大家看的设计书):
  identify the six type categories, diagnose font conflict by similarity, and fix type with the six contrasts
  (size, weight, structure, shape, direction, color), the font-pairing playbook, and the typography hygiene
  checklist — with a Chinese (宋体/黑体) adaptation layer. Use when asked to choose, pair, size, kern, or fix
  fonts — 选字体、配字体、字体搭配、字距、行距、衬线、无衬线、大标题用什么字体、typography、font pairing, or when a
  page's fonts look wrong but layout is fine. NOT for layout principles (CRAP), color schemes, or full projects
  — those belong to robin-williams-design.
---

# font-craft

Typography-only craft skill: take any text or page and turn its fonts into a deliberate, readable, intentional system.

## When to use
- 选字体、配字体、字体搭配、字距调整、行距、大标题用什么字体
- Choosing, pairing, sizing, kerning, or fixing typefaces
- Diagnosing why a font combination "feels wrong"
- Setting body/heading type systems (HTML/CSS, org export, slides, flyers, resumes, cards)
- 中英混排、中文排版微调

**NOT for**: layout structure (the CRAP principles), color, or whole-project design — use `robin-williams-design`. If the ask mixes layout and type, route to `robin-williams-design` and let this skill only handle the fonts.

## The core judgment
Fonts on one page relate in exactly one of three ways:
1. **协调 Harmonious** — one family, little variation. Safe, formal, usually dull.
2. **冲突 Conflicting** — similar-but-not-same. Reads as a mistake. **Always wrong.**
3. **对比 Contrasting** — very different. The goal.

When a pairing feels off, **hunt the similarities, not the differences**: same category? close size (12 vs 14pt)? close weight (regular vs semibold)? both ALL CAPS? both script/italic? Naming the shared axis IS the diagnosis — the fix is to contrast that specific axis.

## Workflow (诊断 → 处方 → 落地)
1. **读现状** — identify each font's category (Oldstyle / Modern / Slab / Sans / Script / Decorative), weight, size, shape (caps, roman/italic).
2. **找相似** — list what the fonts share. Same category → forbidden (Robin's rule). Timid size/weight gaps → conflict, not contrast.
3. **开处方** — two different categories + at least one strong contrast axis (usually 2–3 combined). Serif + sans is the baseline; or one family with a true black weight.
4. **给参数** — concrete numbers: size gap ~2× (not 1.2×), weights 400 vs 700/900 (not 500), leading, tracking, kerning notes, punctuation fixes.
5. **落地** — emit the actual CSS / HTML / org values. State the reason for each choice in one clause.

## Core content (full detail in `reference.md`)
- **Six categories** + the three identification features (serif, stress, thick/thin transition)
- **Three relationships** + similarity diagnosis
- **Six type contrasts**: size, weight, structure, shape, direction, color
- **Robin's rule**: never put two fonts from the same category on one page
- **Pairing playbook**: serif+sans baseline; same-category → one family with a weight range; script pairs with a different-structure roman
- **Hygiene checklist**: one space; curly quotes / 9-shaped apostrophes; hyphen vs en/em dash; no ALL-CAPS emphasis; no default underlines; kern large type; no widows/orphans; 1em indent (indent OR paragraph space); first paragraph never indented; styled punctuation; bullets not hyphens
- **Chinese adaptation layer**: 宋体 = Oldstyle role, 黑体 = Sans role; CJK punctuation; 中英混排; font stacks

## Files
- `cover.png` — typographic cover poster (1200×1600, black & white).
- `reference.md` — full typography reference: categories, relations, contrast axes, pairing playbook, hygiene checklist, Chinese layer, boundaries.

## Source
Distilled from Robin Williams, *The Non-Designer's Design Book, Fourth Edition* (Chinese edition: 写给大家看的设计书), chapters 9–12 and patterns.md. Sibling of `robin-williams-design`; that skill keeps the layout principles, color, and project receipts.
