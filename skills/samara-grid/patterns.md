# Layout Patterns & Grid Configurations

Practical reference catalog of layout patterns, grid configurations, and deconstruction techniques extracted from *Making and Breaking the Grid*.

---

## 1. Grid Construction Patterns

### The 12-Column Versatility Pattern
- **When to use**: Web design, multi-device layouts, magazines, annual reports needing high structural versatility.
- **How**: Divide live width into 12 equal columns.
- **Span Combinations**:
  - Full width: 12 columns (1 x 100%)
  - Halves: 6 + 6 columns (2 x 50%)
  - Thirds: 4 + 4 + 4 columns (3 x 33.3%)
  - Quarters: 3 + 3 + 3 + 3 columns (4 x 25%)
  - Asymmetric 2/3 + 1/3: 8 + 4 columns
  - Asymmetric 3/4 + 1/4: 9 + 3 columns
- **Trade-offs**: Requires disciplined spatial zone grouping to avoid micro-column clutter.

### The Compound Overlay Pattern (3-Column over 4-Column)
- **When to use**: Multi-lingual publications, image-heavy catalogs, art monographs.
- **How**: Overlay a 3-column grid (broad text columns) with a 4-column grid (flexible image/caption columns).
- **Resulting Sub-divisions**: Yields 12 sub-column alignment points across the page spread.
- **Trade-offs**: Highest layout flexibility; requires locking primary text to one system to avoid visual confusion.

### The Graph Paper Micro-Modular Pattern
- **When to use**: Financial prospectuses, technical data sheets, architectural catalogs, complex schedule grids.
- **How**: Establish an 8x12 or 12x16 matrix of small, uniform spatial modules separated by narrow 10pt–12pt gutters.
- **Application**: Group modules into custom rectangular spatial zones for tables, charts, text callouts, and technical diagrams.
- **Trade-offs**: Excellent for dense data; can feel mechanical if negative space modules are not intentionally reserved.

### The Baseline Grid Lock Pattern
- **When to use**: All multi-column text layouts to ensure clean horizontal alignment across columns.
- **How**:
  1. Set master baseline grid equal to body text leading (e.g., 12pt).
  2. Headline line height = 2x or 3x leading (24pt or 36pt).
  3. Space before subheads = 2x leading (24pt); space after = 1x leading (12pt).
  4. Images and horizontal rules snap strictly to baseline grid lines.
- **Trade-offs**: Eliminates horizontal drift across columns; requires precise typographic math when changing font sizes.

---

## 2. Page & Spread Dynamics Patterns

### Compression & Expansion Pacing
- **When to use**: Editorial features, long-form books, magazines, digital long-scroll experiences.
- **How**:
  - *Phase 1 (Expansion)*: Full-bleed image + generous white space + 1 dominant headline (low text density).
  - *Phase 2 (Compression)*: 3-column or 4-column dense text layout + baseline grid lock (high text density).
  - *Phase 3 (Climax)*: Large pull quote + overlapping image + strategic grid violation.
- **Trade-offs**: Prevents reader fatigue; requires careful content planning across multi-page spreads.

### Spatial Belt Flowline Pattern
- **When to use**: Multi-page catalogs, magazines, corporate reports containing repeating metadata and imagery.
- **How**: Draw a prominent horizontal flowlines across all pages at 33% and 66% page height.
- **Application**: Lock image tops, section titles, and pull quotes to these belts across consecutive pages.
- **Trade-offs**: Unifies disparate content across spreads; can become repetitive if applied without variation.

---

## 3. Grid Deconstruction Patterns

### The Column Splicing Technique
- **When to use**: Avant-garde editorial, music posters, feature spreads exploring disruption or decay.
- **How**:
  1. Build a standard 2-column or 3-column text grid.
  2. Draw horizontal slice vectors across the layout.
  3. Dislocate alternate horizontal slices 20px–60px left or right.
  4. Insert numbered step markers (01, 02) at slice gaps to preserve reading sequence.
- **Trade-offs**: Creates dramatic visual energy; body text within each slice must remain legible.

### Image-as-Source Contour Alignment
- **When to use**: Artist monographs, fashion features, sports publications with strong silhouetted photography.
- **How**:
  1. Trace key structural contour lines or perspective vectors from a background photograph.
  2. Use these vector lines as baseline angles or column boundary guides for text blocks.
  3. Wrap or slant body text along the photographic contour, making type act as a negative space counterform.
- **Trade-offs**: Deeply integrates imagery and typography; requires custom optical adjustments for text rags.

### The Anchor-and-Path Usability Pattern
- **When to use**: Experimental, non-grid, or deconstructed layouts where user orientation is at risk.
- **How**:
  1. Place 1 oversized, high-contrast element (Anchor Point) at top-left or focal center.
  2. Connect layout elements with numbered breadcrumbs (01 -> 02 -> 03) or thin vector lines (Path).
  3. Isolate critical logistics text (dates, venue, contact info) inside a clean, high-contrast box (Isolating Sanctuary).
- **Trade-offs**: Guarantees usability in radical layouts; prevents user disorientation.
