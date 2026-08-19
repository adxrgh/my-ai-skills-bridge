# Typographic Quick Decision Cheatsheet

A decision-making reference guide for font pairing, line measures, spacing math, layout grids, and typographic error diagnosis.

---

## 1. Quick Decision Rules

- **Indents vs. Spacing**: NEVER use both a paragraph indent AND space-below simultaneously. Use an indent ($1\times$ body size) OR line space (`1em`), never both.
- **Tracking Rule**: Track All-Caps, Small Caps, and tiny captions LOOSELY ($+20$ to $+50$ units). NEVER track lowercase body text loosely.
- **Type Family Limit**: Limit a single project to **maximum 2–3 font families**. Prefer a single Super-Family (Serif + Sans cuts) whenever possible.
- **Numerals Selection**: Use **Oldstyle Proportional** for prose body copy; use **Tabular Lining** for financial data and tables.
- **Smart Quotes**: Always replace typewriter straight primes (`" "`, `' '`) with curved smart quotes (`“ ”`, `‘ ’`).
- **Screen Line Length**: Keep digital text containers bounded between **45 and 65 characters per line** (`max-width: 36ch–42ch`).

---

## 2. Thresholds, Defaults & Rules of Thumb

| Dimension / Metric | Recommended Default (Print) | Recommended Default (Digital Screen) | Critical Threshold |
| :--- | :--- | :--- | :--- |
| **Body Line Measure** | 55–75 characters / line | 45–65 characters / line | Red flag if $>85$ or $<35$ chars |
| **Body Leading (Line Height)** | $120\% \text{ to } 130\%$ | $140\% \text{ to } 160\%$ (`line-height: 1.5`) | Red flag if $<120\%$ (crashes) |
| **Headline Leading** | $100\% \text{ to } 110\%$ (Solid) | $110\% \text{ to } 120\%$ | Red flag if $>130\%$ (gaping gaps) |
| **WCAG Color Contrast** | N/A (CMYK inks) | $4.5:1$ (Normal text), $3.0:1$ (Large) | Fail if $<3.0:1$ for body copy |
| **Paragraph Indent** | $1\times \text{ to } 1.5\times$ body size | $0$ (prefer `margin-bottom: 1em`) | Fail if indent $>30\text{pt}$ |
| **Column Gutters** | 4mm–6mm | 16px–24px | Red flag if $<8\text{px}$ (text merges) |

---

## 3. Font Pairing Decision Matrix

```
What is the primary content tone & medium?
├── Deep Prose / Book Reading
│   └── Pair Humanist Serif (Sabon, Garamond) + Humanist Sans (Frutiger, Gill Sans)
├── Modern Corporate / SaaS Interface
│   └── Pair Neo-Grotesque Sans (Inter, SF Pro) + Neutral Serif (Georgia)
├── High-Impact Fashion / Editorial Luxury
│   └── Pair Modern Didone (Bodoni) + Clean Geometric Sans (Futura)
└── Global Multilingual System (Latin + CJK)
    └── Pair Latin Sans (Inter) + Chinese Heiti (PingFang / Noto Sans) at 0.92x scale
```

---

## 4. Tells & Smells (Typographic Red Flags & Fixes)

| Visual Smell / Red Flag | Root Cause | Immediate Fix |
| :--- | :--- | :--- |
| **Horizontal line drift across columns** | Body text not locked to baseline grid | Lock paragraph styles to Master Baseline Grid |
| **Wobbly numbers in financial columns** | Proportional numbers used in data table | Change font feature to `tabular-nums lining-nums` |
| **Widows & Runts (1 word on last line)** | Poor paragraph tracking or bad line breaks | Adjust tracking by $-5$ to $-10$ units or add soft return |
| **Rivers (white streaks in text)** | Justified text without proper hyphenation | Switch to Flush Left / Ragged Right or adjust hyphenation |
| **Blurry text on screen** | Non-integer pixel font coordinates | Snap box boundaries and font sizes to whole pixels |
| **Dumb primes in quote marks** | Software default straight quotes | Enable Smart Quotes / use proper HTML entities (`&ldquo;`) |
| **Pseudo-Italic distortion** | Mechanically slanted Roman font | Install and select true designed Italic font file |
