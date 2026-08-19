# Typographic Patterns & Layout Techniques

A catalog of practical techniques, design patterns, and step-by-step methods from *Thinking with Type* (3rd Edition) by Ellen Lupton.

---

## Pattern 1: Setting Accessible Body Text & Line Measure
**When to use**: Designing long-form reading layouts for books, articles, or screen reading interfaces.
**How**:
1. Choose a font with a high x-height ($>60\%$ of cap height) and open counters (e.g., Georgia, Noto Sans, Charter, SF Pro).
2. Set base font size to **16px** (screen) or **9.5pt–10.5pt** (print).
3. Set line measure (width) to deliver **55–75 characters per line** (print) or **45–65 characters** (digital). Limit `max-width` to `36ch–42ch` in CSS.
4. Set line height (leading) to **140%–160%** of font size (`line-height: 1.5` in CSS).
5. Align text **Flush Left / Ragged Right** (`text-align: left`).

---

## Pattern 2: Financial & Data Table Formatting
**When to use**: Presenting numbers, prices, statistics, or multi-column data grids.
**How**:
1. Activate **Tabular Lining Numerals** using font features (`font-variant-numeric: tabular-nums lining-nums;`).
2. Align number columns **Flush Right** so dollar amounts and decimals align vertically.
3. Align text labels **Flush Left**.
4. Use subtle horizontal rules or alternating light grey row fills (`#f8f9fa`) instead of heavy vertical box borders.
5. Set table text 1 step smaller than body copy (e.g., 13px/14px).

---

## Pattern 3: Multi-Script Optical Harmonization
**When to use**: Designing bilingual or multilingual interfaces (e.g., English + Chinese/Japanese/Korean or Arabic).
**How**:
1. Pair fonts of matching formal archetypes (e.g., Latin Sans + Chinese Heiti + Arabic Kufic).
2. Reduce the non-Latin CJK font size by **5% to 10%** (`font-size: 0.92em`) relative to Latin so CJK square modules match Latin capital height visually.
3. Increase non-Latin line height slightly (`line-height: 1.6`) to accommodate dense multi-stroke glyphs.
4. Verify overall grey value (text color density) across adjacent columns.

---

## Pattern 4: Building a Mathematical Type Scale
**When to use**: Defining heading sizes and typographic hierarchy for a design system.
**How**:
1. Pick a base body font size (e.g., `16px`).
2. Pick a scale multiplier ratio:
   - *1.200 (Minor Third)*: Compact, dense UI.
   - *1.250 (Major Third)*: Versatile default for websites and blogs.
   - *1.414 (Augmented Fourth)*: High-impact editorial contrast.
3. Multiply sequentially to generate step sizes: `13px` (Caption), `16px` (Body), `20px` (Lead), `25px` (H3), `31px` (H2), `39px` (H1), `49px` (Hero).
4. Lock all heading line heights to integer multiples of the base 8px/4px grid (`24px`, `32px`, `40px`, `48px`).

---

## Pattern 5: 12-Column Responsive Grid with Baseline Lock
**When to use**: Architecting responsive web applications or multi-page publication spreads.
**How**:
1. Set live container width (e.g., `1200px`) and 12 columns with a fixed gutter (e.g., `24px`).
2. Assign column spans: Main content = 8 columns (`792px`); Sidebar = 4 columns (`384px`).
3. Set global baseline increment to body line-height (e.g., `24px`).
4. Snap all image box heights, card paddings, and heading margins to integer multiples of `24px` (`margin-bottom: 24px`, `height: 240px`).

---

## Pattern 6: Layered Editorial Hierarchy
**When to use**: Structuring magazine features, news portals, or deep article pages.
**How**:
1. Place a **Kicker** (Category Tag) in small bold uppercase (`12px Bold`, accent color) at top.
2. Follow with the **Main Headline** (`39px Bold`, $1.1\times$ leading).
3. Insert a **Deck (Stand-first)** (`20px Medium/Italic`, $1.4\times$ leading) summarizing the hook.
4. Break main body copy every 200 words with a **Subhead** (`25px Bold`, space-before = 32px, space-after = 8px).
5. Anchor middle page with a large **Pull Quote** (`28px Italic`, centered or spanning 2 columns).

---

## Pattern 7: Rag Smoothing & Widow Elimination
**When to use**: Final proofing pass on paragraphs before publication.
**How**:
1. Inspect paragraph endings for **Widows** (isolated single words) or **Runts**.
2. Apply `text-wrap: pretty` or `text-wrap: balance` in CSS for headlines.
3. For print/InDesign, adjust paragraph tracking by **$-5$ to $-10$ units** to pull a widow up onto the preceding line.
4. Insert a **Soft Return** (`Shift + Enter`) before prepositions or conjunctions near line ends to smooth saw-tooth rags into gentle curves.
