# font-craft reference

Full typography reference. Source: *The Non-Designer's Design Book* (写给大家看的设计书), ch9–12 + patterns.md.
The Chinese adaptation layer is general CJK practice, not verbatim book content.

## 1. The Six Categories (六类别)

Identify by three features: **serifs (衬线)**, **stress (强调线 — line through the thinnest parts of curves: diagonal vs vertical)**, **thick/thin transition (粗细过渡: moderate / severe / none)**.

| Category | Identify by | Use for | Anti-pattern |
|---|---|---|---|
| **Oldstyle 旧式体** | angled serifs, diagonal stress, moderate transition | body text — "invisible", best for long reading | — |
| **Modern 现代体** | thin horizontal serifs, vertical stress, severe transition | large display only | body text → glare, thin strokes vanish |
| **Slab serif 粗衬线体** | heavy uniform strokes, little transition (Clarendon/Egyptian) | heavy display, children's books | long body → page looks dark |
| **Sans serif 无衬线体** | no serifs, monoweight | headings/UI; body with wide leading | Helvetica/Arial/Verdana are screen fonts — weak for print; no black weight |
| **Script 手写体** | handwritten | tiny amounts, never ALL CAPS, never long passages | overuse = nausea ("cheesecake") |
| **Decorative 花体** | instantly recognizable | special occasions, tiny amounts | whole pages/books in one |

Note: a sans with slight serif-like transition (e.g. Optima) is a hybrid — hard to combine; use with care.

## 2. Three Relationships (三关系)

| Relation | What it is | Verdict |
|---|---|---|
| Harmonious 协调 | one family, little variation | acceptable when deliberate (weddings, formal) — usually dull |
| Conflicting 冲突 | similar-but-not-same fonts | **never** — reads as an accident |
| Contrasting 对比 | very different fonts | the goal |

**Similarity diagnosis** — when a pairing feels wrong, check the shared axes:
- same category (structure)? → forbidden
- size gap tiny (12 vs 14pt)? → conflict
- weight gap tiny (regular vs semibold)? → conflict
- both ALL CAPS? both roman? both italic? both script? → shape conflict
- competing focal points (bigger-but-thinner vs smaller-but-bolder)? → both fight for attention

Name the similarity → the fix is to contrast that axis.

## 3. The Six Type Contrasts (六对比)

| Axis | Make it strong | Pitfall |
|---|---|---|
| **Size 大小** | 20→30pt, not 12→14pt; small-on-huge also works; lowercase lets you set text much larger than caps (20pt caps → 30pt lowercase) | too-close sizes = conflict |
| **Weight 粗细** | regular vs a true black/heavy; bold key phrases to fix gray text pages | semibold = looks like a mistake |
| **Structure 结构** | two different categories (serif + sans = classic) | two fonts from the same category |
| **Shape 形状** | caps vs lowercase; roman vs italic (italic is redrawn, not slanted) | two scripts, two italics, or script+italic |
| **Direction 方向** | horizontal text lines vs tall narrow columns | angled type without a stated reason, or in a corner |
| **Color 颜色** | warm (red/orange) advances — tiny amounts; cool recedes — needs volume | equal warm/cool; too many warm elements |

Most good layouts combine ≥2 axes. Type also has "color" in the blackness sense: thin + open spacing = light; heavy + compressed = dark — control via tracking, leading, structure.

## 4. Robin's Rule + Pairing Playbook

**Robin's rule**: never put two fonts from the same category on one page. Same category = unavoidable similarity = conflict.

Playbook (in priority order):
1. Pick two fonts from **two different categories**.
2. Serif + sans is the time-tested baseline.
3. Structure contrast alone is weak — reinforce with size and/or weight.
4. Rich combo: two categories + caps-vs-lowercase + roman-vs-italic + size + weight.
5. Two sans on one page? Use different members of **one** sans family (e.g. Condensed Ultra Light + Heavy + Regular Italic).
6. Own a true black weight — computer defaults are too weak for contrast.
7. Script/italic pairs with a **roman of different structure** (optionally heavier).

Worked examples: Bodoni (Modern) + Clarendon (Slab) ✓; two flowing scripts ✗ → swap one for a different-structure roman.

## 5. Typography Hygiene (排版卫生 — amateur tells)

- One space after punctuation — never two.
- Curly quotes "66/99"; apostrophes are the 9-shape, not the foot mark.
- Hyphen `-` joins; en dash `–` = ranges (7–12); em dash `—` = breaks; **never `--`**.
- No ALL-CAPS for emphasis — we read by word shape; caps forces letter-by-letter reading.
- No default underlines — use italic/bold/size/color.
- Kern large type manually (visual, not mathematical — round letters look smaller than square ones).
- No widows (<7 chars at paragraph end) / orphans (stray line at top of next column).
- Paragraph indent 1em (≈2 spaces), and **indent OR paragraph spacing — never both**.
- First paragraph after a title/subhead is never indented.
- Punctuation after styled text takes the same style (colon after a bold word is bold).
- Lists use bullets/ornaments, not hyphens.
- Text in boxes: generous, even spacing on all sides.

## 6. Chinese Adaptation Layer (中文适配)

- **Role mapping**: 宋体 (serif) = Oldstyle role → body text; 黑体 (sans) = Sans role → headings. CJK has no practical Modern/Slab/Script equivalents — don't force them.
- **Contrast axes that work in Chinese**: 宋体 vs 黑体 (structure), size, weight, spacing. Two similar CJK faces (中宋 vs 宋体) = conflict, same trap as the book.
- **CJK glyphs run visually larger** than Latin at equal pt — in 中英混排, size the Latin slightly up/down for optical matching.
- **CJK punctuation**: quotes 「」 or ""; 破折号 —— (two em); 省略号 …… (six dots). Latin text uses half-width punctuation.
- **Font stacks (CSS)**: Latin face first, CJK face second: `font-family: "Source Serif 4", "Songti SC", serif;` / `"Inter", "PingFang SC", sans-serif;` (or 微软雅黑/Noto Sans SC).
- **Spacing**: Chinese headings often need letter-spacing tuned (slight negative or small positive); body line-height 1.5–1.8 common (Latin 1.4–1.6).
- Honest boundary: the book is a Latin typography system. The CJK layer above is general practice + experience, not book content — verify against CJK-specific references for serious print work.

## 7. Landing Parameters (落地样例)

```css
/* body */
font-family: "Source Serif 4", "Songti SC", serif;
font-size: 1rem; font-weight: 400; line-height: 1.7;

/* h1 — 2.5× body, different category, true black */
font-family: "Inter", "PingFang SC", sans-serif;
font-size: 2.5rem; font-weight: 800; letter-spacing: -0.01em;
```

Rules of thumb: heading/body size gap ~2× minimum; weight gap 400→700/900; one focal size per page; if everything is big, nothing is.

## 8. Boundaries

- Layout (CRAP), color, and whole projects → `robin-williams-design`.
- This skill guarantees "not wrong / readable", not beauty — taste ceiling is the user's.
- It provides the framework and a prescription, never the final decision.
