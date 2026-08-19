# Editorial Design Quick Reference & Decision Cheatsheet

A decision-making cheat sheet for grid selection, column math, font pairing, cover design, and print vs. digital production rules.

---

## 1. Quick Grid & Format Selection Heuristic

| Publication Type | Recommended Grid Archetype | Key Advantage | Typical Columns / Modules |
| :--- | :--- | :--- | :--- |
| **Daily Newspaper (Broadsheet)** | Multi-Column Dense Grid | Maximum news density & fast scanning | 8 to 10 Columns |
| **Tabloid / Compact Paper** | Standard 4–5 Column Grid | Commuter portability & bold headlines | 4 to 5 Columns |
| **Consumer Magazine (A4/US Letter)**| 6-Column or 12-Column Grid | High flexibility for text + images | 6 or 12 Columns |
| **Independent Zine / Art Title** | 1–3 Column Asymmetric Grid | Niche aesthetic & expressive white space| 2 or 3 Wide Columns |
| **Digital Tablet / App Edition** | Dynamic Liquid Responsive Grid | Fluid adaptation across portrait/landscape| 1, 2, or 3 Columns (Liquid) |
| **Mobile Web Article** | Single-Column Responsive Flow | Optimized vertical scroll on screens | 1 Column (320px–480px text container) |

---

## 2. Core Column & Baseline Math Formulas

### Optimal Line Measure
- **Optimal Character Count (Print)**: **55 to 75 characters per line** (including spaces).
- **Optimal Character Count (Digital Screen)**: **45 to 65 characters per line**.
- *Too Wide (> 80 chars)*: Reader loses place when sweeping back to the next baseline.
- *Too Narrow (< 40 chars)*: Awkward hyphenation, bad ragging, or gaping word spaces in justified text.

### The Column Math Formula
$$\text{Live Area Width} = (N \times \text{Column Width}) + ((N - 1) \times \text{Gutter Width})$$
$$\text{Column Width} = \frac{\text{Live Area Width} - ((N - 1) \times \text{Gutter Width})}{N}$$

### Baseline Grid Calculation Rules
1. **Baseline Grid = Body Text Leading** (e.g., 9.5pt type on 13.5pt leading $\rightarrow$ **13.5pt Baseline Grid**).
2. **Headline Leading**: Set headline leading to exact integer multiples of baseline leading ($27\text{pt leading} = 2 \times 13.5\text{pt}$).
3. **Space Before Subheads**: Set to exact baseline multiples ($13.5\text{pt}$ or $27\text{pt}$).
4. **Image Heights**: Ensure image box heights snap strictly to baseline multiples ($N \times 13.5\text{pt}$).

---

## 3. Decision Trees & Rule Decision Logic

### Cover Strategy Decision Tree
```
Is the publication sold on newsstands / retail shelves?
├── YES ──> Use NEWSSTAND COVER PATTERN:
│           ├── High-contrast Masthead in top 20% zone
│           ├── Hero portrait with prominent eye contact
│           ├── Bold Main Cover Line + 3–5 Secondary Cover Lines along flanks
│           └── Barcode, Price, Date in utility corner
└── NO  ──> Is it for direct subscribers / special collector issues?
            └── Use SUBSCRIBER COVER PATTERN:
                ├── Full-bleed pristine artwork (100% cover)
                ├── Minimal Masthead & single Main Cover Line
                └── Remove all flashes, secondary lines, and front barcodes
```

### Font Pairing Decision Rules
1. **Rule of Contrast**: Pair a high-contrast Serif display headline font with a clean, low-contrast Sans-serif body font (or vice versa).
2. **Super-Family Default**: When in doubt, use a single typographic super-family containing both Serif and Sans-serif cuts (e.g., *Meta Serif + Meta Sans*, *Freight Text + Freight Sans*).
3. **Maximum Font Rule**: Limit any single publication issue to **maximum 2 font families** (1 for body copy, 1 for display/headings). Vary weight and size for hierarchy.

---

## 4. Thresholds, Defaults & Rules of Thumb

- **Thumb Space Margin Rule**: Bottom margin must always be the largest margin on print formats (minimum **20mm–25mm**) to allow holding without obscuring text.
- **Spine Safety Clearance**: Keep all critical text, captions, and face features at least **15mm clear** of the spine fold in perfect-bound magazines.
- **Subhead Frequency Rule**: Place 1 subhead every **150 to 200 words** in long body copy to maintain scanning legibility.
- **Print Resolution Threshold**: All print images must be **300 dpi at 100% scale** in CMYK color space.
- **Digital Screen Image Threshold**: Web/App images should be **144 ppi (2x retina)** or **300 ppi** in sRGB / Display P3 color space.

---

## 5. Tells & Smells (Layout Red Flags)

| Visual Smell / Red Flag | Root Cause | Immediate Fix |
| :--- | :--- | :--- |
| **Horizontal line drift across columns** | Body copy not locked to baseline grid | Lock body paragraph styles to Master Baseline Grid |
| **Muddy, dark photos in print** | RGB images sent to print press | Convert images to CMYK and adjust curves for dot gain |
| **Text swallowed in spine fold** | Margin too narrow along inside spine | Increase inside margin to minimum 18mm–20mm |
| **Reader loses place when scanning** | Line measure > 85 characters wide | Increase column count or widen side margins |
| **Blurry, fuzzy text on digital screen** | Non-integer pixel coordinates (e.g. 14.3px) | Snap all box boundaries & font offsets to whole pixels |
| **Widows / Orphans in copy** | Poor paragraph tracking & hyphenation | Manually adjust line tracking (-1 to -3) or soft returns |
