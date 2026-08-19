# Chapter 7: Multiplicity of Scripts

## Core Idea
Global typography demands multi-script fluency. Pairing Latin typography with non-Latin scripts (Arabic, Chinese, Korean, Japanese, Indic, African scripts) requires **optical harmonization** rather than mechanical point-size equality, respecting each script's unique cultural history, stroke mechanics, and spatial gravity.

## Frameworks Introduced
- **The Multi-Script Optical Harmonization Model**:
  - When to use: Designing bilingual/multilingual publications, global websites, or multi-region apps.
  - How: Harmonize scripts across three visual dimensions:
    1. *Optical Scale Matching*: Adjust point size so Latin cap-height or x-height visually matches the bounding box of CJK scripts or the top-hanging line of Indic scripts.
    2. *Stroke Weight & Texture Balance*: Match grey value (color density). Complex multi-stroke characters (e.g., Chinese `龘` or `繁`) need slightly lighter stem weights than Latin to avoid dark blobs.
    3. *Style Equivalence Pairing*: Pair script archetypes based on formal identity (e.g., Latin Serif $\leftrightarrow$ Chinese Mingti/Songti; Latin Sans $\leftrightarrow$ Chinese Heiti; Latin Humanist $\leftrightarrow$ Arabic Naskh; Latin Geometric $\leftrightarrow$ Arabic Kufic).
- **The Global Script Classification & Pairing Map**:
  - *Arabic*: Naskh (traditional calligraphic flow) vs. Kufic (geometric, structured) vs. Ruq'ah (casual, compact).
  - *Chinese*: Mingti / Songti (衬线体 - Serif counterpart) vs. Heiti (黑体 - Sans counterpart) vs. Kaiti (楷体 - Script/Calligraphic).
  - *Japanese*: Mincho (明朝体 - Serif) vs. Gothic (角ゴシック - Sans) vs. Kana (流线假名).
  - *Korean*: Myeongjo (Serif) vs. Sans (Gothic) vs. Display Hangul.
  - *Indic*: Devanagari, Gurmukhi, Bengali, Tamil systems sharing top-line or hanging alignment principles.

## Key Concepts
- **Optical Harmonization**: Scaling and tuning two different script fonts so they appear identical in visual size and weight when printed side by side.
- **Grey Value (Text Texture)**: The overall visual tone of a block of text created by stroke weight, counters, and letter spacing.
- **Mingti / Songti (宋体/明体)**: Chinese typeface classification featuring horizontal thin strokes, thick vertical stems, and small triangular serifs.
- **Heiti (黑体)**: Chinese sans-serif equivalent featuring uniform stroke width and square terminals.
- **Kigelia**: A groundbreaking multi-script typeface family engineered to support multiple African writing systems (Adlam, Vai, N'Ko, Tifinagh, Osmanya, Ge'ez).

## Mental Models
- **Harmonization as Dialogue, Not Assimilation**: Do not force non-Latin scripts to behave like Latin letters. Respect each script's natural structure while building visual harmony.
- **The Density Filter**: High-density Chinese or Devanagari glyphs naturally look darker than Latin text; compensate by softening the font weight or widening line-height.

## Anti-patterns
- **Mechanical Point-Size Equivalence**: Setting 16pt Helvetica next to 16pt Heiti without scaling; Chinese will look drastically larger and heavier due to its square bounding box.
- **Cultural Type Style Mis-pairing**: Pairing a ultra-formal Latin Didone with a casual, informal Arabic script.
- **Disregarding Vertical Orientation**: Forcing traditional Japanese or Chinese text into horizontal columns when vertical layout (Tate-gumi) is culturally preferred.

## Reference Tables

### Multi-Script Formal Pairing & Scaling Playbook

| Script Family | Latin Equivalent Archetype | CJK Equivalent | Arabic Equivalent | Indic Equivalent | Scaling Adjustment |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Serif / Traditional** | Garamond / Sabon / Georgia | Mingti / Songti / Mincho | Naskh | Devanagari Traditional | Reduce non-Latin by $5\%\text{--}10\%$ point size |
| **Sans-serif / Clean** | Helvetica / SF Pro / Inter | Heiti / Gothic | Kufic / Modern Sans | Devanagari Modern | Reduce non-Latin by $5\%\text{--}8\%$ point size |
| **Geometric / Display** | Futura / Avant Garde | Geometric Modular | Geometric Kufic | Geometric Devanagari | Align cap height to bounding box |
| **Script / Calligraphic** | Bickham Script / Zapfino | Kaiti (楷体) | Thuluth / Diwani | Calligraphic Devanagari | Maintain natural fluid line-height ($>180\%$) |

## Worked Example

### Harmonizing a Bilingual English-Chinese UI Card
1. **Initial Setup**: Latin text set in `Inter 16px Regular`. Chinese text set in `PingFang SC 16px Regular`.
2. **Issue**: PingFang SC looks visibly larger, darker, and crowded next to Inter because Chinese characters occupy a $100\%$ square bounding box.
3. **Adjustment 1 (Scale)**: Reduce Chinese font size to `14.5px` or `15px` (`font-size: 0.92em`), matching the visual height of Inter's capital letters.
4. **Adjustment 2 (Line Height)**: Increase line-height on Chinese body text from `22px` to `24px` (`1.6x`), allowing dense multi-stroke characters to breathe.
5. **Result**: Both scripts achieve identical grey value and visual balance in the interface.

## Key Takeaways
1. Global typography requires understanding the unique structural logic of diverse writing systems.
2. Never rely on mechanical point sizes when combining Latin and non-Latin scripts.
3. Pair typefaces by matching formal archetypes (Serif $\leftrightarrow$ Mingti $\leftrightarrow$ Naskh).
4. Balance text texture and line height to compensate for stroke density differences.

## Connects To
- **Ch 02**: Structural metrics of non-Latin writing systems.
- **Ch 06**: Building inclusive, multi-lingual typographic hierarchies.
