# Grid & Layout Design Cheatsheet

A decision-making cheat sheet for layout design, grid selection, column math, baseline rules, and optical adjustments.

---

## 1. Quick Grid Selection Heuristic

| Content Type | Recommended Grid Archetype | Key Advantage | Typical Columns / Modules |
| :--- | :--- | :--- | :--- |
| **Novels, Essays, Long Narrative** | Single-Column (Manuscript) | Uninterrupted reading flow | 1 Column + wide margins |
| **Newspapers, Magazines, Blogs** | Multi-Column Grid | Flexible text wrapping, sidebars | 3, 4, or 6 Columns |
| **Complex Web Sites, Dashboards** | 12-Column Grid | Factorable into 2, 3, 4, 6 zones | 12 Columns |
| **Catalogs, Schedules, Data Sheets** | Modular Grid | Tabular spatial zone placement | 4x4, 6x8, or 12x16 Modules |
| **Multi-Lingual, Image-Heavy Books** | Compound Grid | Overlaid 3-col + 4-col systems | 12 Overlaid sub-columns |
| **Branding Posters, Event Invites** | Hierarchic or Radial Grid | Focal emphasis, expressive impact | Custom non-uniform zones |

---

## 2. Core Column & Baseline Math

### Optimal Line Measure
- **Optimal Character Count**: **55 to 75 characters per line** (including spaces).
- **Optimal Word Count**: **10 to 12 words per line**.
- *Too Wide (> 85 chars)*: Reader loses place when sweeping back to the next baseline.
- *Too Narrow (< 40 chars)*: Awkward hyphenation, bad rag, or gaping word spaces in justified text.

### The Column Math Formula
$$\text{Live Area Width} = (N \times \text{Column Width}) + ((N - 1) \times \text{Gutter Width})$$
$$\text{Column Width} = \frac{\text{Live Area Width} - ((N - 1) \times \text{Gutter Width})}{N}$$

### Baseline Grid Calculation Rules
1. **Set Baseline Grid = Body Text Leading** (e.g., 10pt type on 14pt leading $\rightarrow$ **14pt Baseline Grid**).
2. **Headlines**: Set headline leading to an exact integer multiple of baseline leading (e.g., $28\text{pt leading} = 2 \times 14\text{pt}$).
3. **Paragraph Space Before/After**: Set to exact baseline multiples (e.g., $14\text{pt space before}$, $0\text{pt space after}$).
4. **Image Heights**: Ensure image heights snap to baseline multiples ($N \times 14\text{pt}$).

---

## 3. Margin & Format Rules of Thumb

- **Villard's Canon Proportions**: Page Margins Ratio = **Top 2 : Inside 3 : Outside 4 : Bottom 5** (or Fibonacci **2 : 3 : 5 : 8**).
- **Thumb Space Rule**: Bottom margin should always be the largest margin on print formats to allow user thumb holding without obscuring text.
- **Gutter Sizing Rule**: Gutter width must be wider than word spacing within columns, but narrower than outer margins (typically **1.5× to 2× body text leading**).

---

## 4. Optical Adjustment Checklist

- [ ] **Hanging Punctuation**: Push quotation marks, hyphens, and bullet points outside the column grid edge so the text margin appears optically straight.
- [ ] **Rounded Letterforms**: Extend rounded letters (O, C, Q) and diagonal points (A, V, W) slightly beyond grid baselines and column edges.
- [ ] **Optical Center**: Position focal elements slightly **above** the exact geometric center (geometric center looks low to the human eye).
- [ ] **Visual Weight Balancing**: Dark, solid image blocks exert heavier visual weight than light text blocks—compensate by giving heavy images more surrounding white space.

---

## 5. Deconstruction Usability Rules (The 80/20 Rule)

1. **Maintain 80% Structure / 20% Violation**: A grid violation is effective only when the surrounding layout clearly demonstrates strict grid alignment.
2. **Always Provide an Anchor Point**: Ensure every experimental page has 1 obvious starting visual node (oversized number or dominant headline).
3. **Isolate Critical Logistics**: Place essential information (dates, venue, pricing, contact links) inside a clean, high-contrast, un-distorted safety zone.
4. **Use Numbered Breadcrumbs**: When disrupting horizontal reading lines, connect fragmented text blocks with numbered steps (01 $\rightarrow$ 02 $\rightarrow$ 03).
