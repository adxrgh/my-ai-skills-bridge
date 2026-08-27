# News Design & Infographics Quick Decision Cheatsheet

Quick reference decision rules, layout metrics, infographic selection guidelines, and redesign red flags from *Designing News* by Francesco Franci.

---

## 1. Quick Decision Rules

- **Designer Role**: Treat editorial designers as information architects and co-journalists, NOT drawing-board stylists.
- **Redesign Principle**: A redesign MUST solve underlying information architecture and workflow problems; NEVER execute a superficial facelift.
- **Infographic Rule**: Use infographics to explain *how* and *why* things work, NOT just *how much* money was spent.
- **Semantic Color Rule**: Use color strictly to categorize or quantify data; NEVER use decorative or arbitrary rainbow colors.
- **Data Spread Layout**: Combine 1 central Macro graphic with 4–6 Micro satellite charts; set all data text in crisp `8pt–10pt` sans-serif.
- **Cross-Platform Rule**: Anchor core brand elements (masthead, primary typefaces), but fluidize grid columns and font sizes per screen size.

---

## 2. Thresholds, Defaults & Rules of Thumb

| Parameter / Metric | Recommended Value (Print) | Recommended Value (Digital Web/App) | Red Flag / Smell |
| :--- | :--- | :--- | :--- |
| **Grid System** | 6-Column or 12-Column Master Grid | Fluid 12-Column Responsive Grid | Rigid 2-column or non-responsive layout |
| **Infographic Text Size** | $7.5\text{pt} \text{ to } 9.5\text{pt}$ crisp sans-serif | $12\text{px} \text{ to } 14\text{px}$ clean sans-serif | Unreadable $<6\text{pt}$ or giant $18\text{px}$ chart labels |
| **Big Data Callouts** | $36\text{pt} \text{ to } 60\text{pt}$ bold numerals | $32\text{px} \text{ to } 48\text{px}$ bold numerals | Un-emphasized numbers buried in body prose |
| **Headline / Body Ratio** | $2.5\times \text{ to } 4.0\times$ body size | $2.0\times \text{ to } 3.5\times$ body size | Headline size too close to body size ($<1.5\times$) |
| **Infographic Accent Colors** | 2 to 3 semantic hues max | 2 to 3 semantic hues max | $>5$ arbitrary rainbow colors without legend |

---

## 3. Infographic Archetype Selection Matrix

```
What journalistic question does the story answer?
├── How much / Quantitative Comparison?
│   └── Bar Chart, Treemap, or Big Data Callout
├── How does it change over time?
│   └── Line Graph or Chronological Timeline
├── Who is connected to whom / Network?
│   └── Node-Link Relational Network Diagram
├── How does the system / process work?
│   └── Sequential Flowchart Diagram or Anatomical Cutaway
└── Where is it happening / Spatial distribution?
    └── Cartographic Choropleth Map or Spatial Flow Map
```

---

## 4. Tells & Smells (News Design Red Flags & Fixes)

| Visual Smell / Red Flag | Root Cause | Immediate Fix |
| :--- | :--- | :--- |
| **Wall of monolithic text** | Lack of modular storytelling architecture | Extract timeline, data callouts, and subheads to create entry points |
| **Chartjunk (3D effects, drop shadows)** | Decorative illustration mindset | Remove 3D effects and drop shadows; flatten geometry to pure data |
| **Inconsistent chart color meanings** | Arbitrary color assignment across graphics | Define a semantic color palette and enforce strict color consistency |
| **Siloed text-then-design workflow** | Designers excluded from story planning | Embed art directors and designers in initial story brainstorming |
| **Alienated legacy readership** | Throwing away masthead equity in redesign | Preserve core masthead DNA while modernizing spatial grids & fonts |
| **Unreadable mobile chart labels** | Shrinking desktop print charts as images | Rebuild chart as responsive SVG/CSS HTML module |
