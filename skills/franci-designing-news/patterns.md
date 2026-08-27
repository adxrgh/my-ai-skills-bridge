# News Design Patterns & Infographic Recipes

Practical techniques, layout patterns, and design recipes from *Designing News* by Francesco Franci.

---

## Pattern 1: The Franchi Double-Page Data Spread (IL Method)
**When to use**: Designing high-impact, data-driven feature spreads for magazines, annual reports, or long-form digital features.
**How**:
1. **Hero Macro Anchor**: Place a large, stylized central diagram or map in the center of the spread depicting the overarching system or core phenomenon.
2. **Micro Satellite Callouts**: Position 4 to 6 satellite sub-charts (bar graphs, timelines, network nodes) around the central anchor to detail specific sub-topics.
3. **Unified Palette**: Set all labels, captions, and metrics in 1 crisp Sans-serif font family (`8pt / 10pt` size). Use bold numbers (`14pt–18pt`) for data metrics.
4. **Semantic Color Coding**: Assign 2 to 3 distinct colors (e.g., Navy = Public Sector, Gold = Private Sector) and maintain strict color consistency across all sub-charts.
5. **Macro/Micro Balance**: Ensure the spread delivers a 3-second high-level takeaway (macro) while rewarding 5-minute deep inspection (micro).

---

## Pattern 2: Deconstructing Long Text into Modular Story Architecture
**When to use**: Editing and laying out long investigative news stories ($>1,500$ words).
**How**:
1. **Extract Timeline**: Pull chronological milestones out of body text into a dedicated **Vertical Timeline Sidebar**.
2. **Extract Key Metrics**: Highlight 3 core numerical statistics as **Big Data Callouts** (`36pt–48pt` bold numbers + 2-line labels).
3. **Diagram Process**: Convert complex legal, technical, or financial procedures into a 4-step **Flowchart Diagram**.
4. **Assemble Layout**: Place main text in a clean 2-column or 3-column block; position Big Data Callouts and Timeline in sidebars to create scannable entry points.

---

## Pattern 3: Designing a Publication Redesign Framework
**When to use**: Executing a major overhaul of a newspaper, magazine, or news website.
**How**:
1. **Audit Brand Equity**: Identify 2-3 sacred visual assets (e.g., masthead lettering, brand color, section name) to preserve.
2. **Rebuild Grid**: Replace rigid 3-column layouts with a flexible **6-column or 12-column master grid** supporting multi-span columns.
3. **Commission / Curate Bespoke Type**: Select or commission 2 complementary super-families (1 high-impact Display, 1 robust Text font with lining/tabular numbers).
4. **Build Master Page Furniture**: Standardize headers, category tags (Kickers), folios, bylines, and caption templates.
5. **Stress Test Templates**: Test grid templates against worst-case raw text (ultra-long headlines, bad photos) before going live.

---

## Pattern 4: Semantic Color Coding for Data Graphics
**When to use**: Designing multi-chart infographics or data visualizations.
**How**:
1. Define a strict semantic palette where every hue represents a single variable or category.
2. Limit accent hues to 2 or 3 colors; use neutral greys (`#e0e0e0`, `#757575`) for background grid lines and non-active data.
3. Maintain color assignment across all charts in the publication (e.g., if Blue = Imports on Chart 1, Blue MUST mean Imports on Chart 2, 3, and 4).
4. Include a clear, compact **Legend Key** at the top left of the graphic.

---

## Pattern 5: Multi-Speed Cross-Platform News Delivery Stream
**When to use**: Architecting news publication workflow across mobile, web, tablet, and print.
**How**:
1. **Breaking Layer (Mobile Alert)**: Push a 50-word bulletin + 1 big stat callout + live timeline map.
2. **Real-Time Web Layer (Desktop)**: Publish a 500-word article with interactive charts, video clips, and live comment feeds.
3. **Armchair Deep Layer (Tablet / Print)**: Deliver a multi-page curated spread with bespoke infographics, photo essays, and deep analytical context.

---

## Pattern 6: Designing Scrollytelling Digital Features
**When to use**: Creating immersive, interactive digital news features (Snow Fall style).
**How**:
1. Keep main article copy in a clean, single-column container (`max-width: 680px`, `18px` font size, `1.6` line-height).
2. Use scroll-position triggers (`IntersectionObserver`) to play background video loops or animate charts as the user scrolls into view.
3. Embed interactive 3D maps or audio profiles inline within natural narrative breaks.
4. Ensure all media components degrade gracefully into static images on low-bandwidth or legacy devices.
