# Chapter 2: Letter — Anatomy and Scripts

## Core Idea
Typography requires a precise vocabulary to analyze letterform structure. While Latin typography is built around horizontal guidelines (baseline, x-height, cap height), non-Latin scripts operate on distinct structural principles—such as top hanging lines, square bounding boxes, contextual cursive connections, or syllabic block assemblies.

## Frameworks Introduced
- **The Latin Typographic Line Matrix**:
  - When to use: Setting font metrics, line spacing, and vertical alignments.
  - How: Measure letter elements against five reference guidelines:
    1. *Baseline*: The invisible horizontal line on which characters sit.
    2. *X-Height*: The height of main lowercase body letters (excluding ascenders/descenders).
    3. *Cap Height*: The height of capital letters above the baseline.
    4. *Ascender Line*: The maximum height of lowercase tall stems (`b`, `d`, `f`, `h`, `k`, `l`, `t`).
    5. *Descender Line*: The maximum depth of strokes dropping below baseline (`g`, `j`, `p`, `q`, `y`).
- **Global Script Architectural Framework**:
  - When to use: Designing multi-script publications or international UI systems.
  - How: Map each script to its defining structural orientation:
    - *Latin / Cyrillic / Greek*: Baseline-sitting, dual-case, left-to-right.
    - *Arabic*: Connected cursive, contextual glyph forms (initial, medial, final, isolated), right-to-left.
    - *Chinese (Hanzi)*: Logographic, uniform square bounding box (方块字), internal visual balance.
    - *Korean (Hangul)*: Syllabic blocks assembled into a square module from alphabetic letters.
    - *Japanese*: Tri-script system (Kanji + Hiragana + Katakana) aligned inside uniform square modules.
    - *Indic (Devanagari)*: Top-hanging baseline (Shirorekha / headstroke), left-to-right.

## Key Concepts
- **X-Height**: The distance from baseline to the top of lowercase `x`. Determines a typeface's apparent visual size and legibility at small scale.
- **Counter**: The enclosed or partially enclosed negative space inside letters (`o`, `e`, `b`, `a`).
- **Serif**: The decorative stroke or flare projecting from the ends of a character's main stems.
- **Shirorekha (Headstroke)**: The continuous top hanging horizontal line in Devanagari (Indic) script.
- **Hangul Syllabic Block**: The square container grouping consonants and vowels into a single pronounceable syllable in Korean.
- **Contextual Form**: In cursive scripts like Arabic, character shapes change depending on whether they appear at the start, middle, end, or isolated in a word.

## Mental Models
- **X-Height as Visual Volume**: Two 12pt fonts can look drastically different in size if one has a larger x-height.
- **Negative Space as Structural Skeleton**: The shape of the counter (internal white space) defines the letter's identity as much as the printed stroke.

## Anti-patterns
- **Matching Scripts by Point Size Alone**: Pairing Latin and Chinese/Arabic at the exact same point size without adjusting for optical scale differences (e.g., Chinese square modules usually look larger than Latin lowercase).
- **Clipping Descenders**: Setting line-height (`leading`) tighter than the descender line, causing overlapping text crashes.

## Reference Tables

### Comparative Multi-Script Typography Matrix

| Script | Primary Alignment Rule | Case System | Structural Unit | Direction | Key Anatomical Metric |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Latin** | Bottom Baseline | Uppercase / Lowercase | Individual Glyph | Left-to-Right | X-Height & Cap Height |
| **Arabic** | Continuous Baseline Connection | Unicase (Contextual forms) | Cursive Word Stream | Right-to-Left | Tooth Height & Descender Loop |
| **Chinese** | Center / Bounding Box | Unicase | Square Module (方块) | LTR / Vertical | Stroke Density & Gravity Center |
| **Korean** | Center Bounding Box | Unicase | Syllabic Module | LTR / Vertical | Initial-Medial-Final Assembly |
| **Indic** | Top Hanging Line (Shirorekha) | Unicase | Syllables & Ligatures | Left-to-Right | Headstroke & Hanging Stem |

## Worked Example

### Calculating X-Height Ratio for Screen Legibility
1. Take a 16px body font setup.
2. Measure font A (e.g., Futura): X-Height = `8px` ($50\%$ ratio). Looks small, needs larger size or wider line height for screen reading.
3. Measure font B (e.g., Georgia / Noto Sans): X-Height = `11px` ($68.75\%$ ratio). Appears significantly larger, crisp, and readable at small pixel sizes.
4. **Rule**: Prefer fonts with large x-heights ($>60\%$ of cap height) for dense text and small-screen reading.

## Key Takeaways
1. Anatomical terminology provides precise diagnostic tools for choosing and pairing typefaces.
2. A typeface's visual size is governed by its x-height, not its declared point size.
3. Non-Latin typography follows diverse structural mechanics (hanging tops, square boxes, cursive flows).
4. Multi-script design requires optical harmonization rather than mechanical point-size equivalence.

## Connects To
- **Ch 01**: Historical origin of anatomical stroke angles.
- **Ch 03**: Applying anatomical features to classify type families.
