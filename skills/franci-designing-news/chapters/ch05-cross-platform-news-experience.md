# Chapter 5: Cross-Platform News Experience

## Core Idea
Modern news organizations must deliver a unified brand experience across **print, desktop web, mobile feeds, and tablet applications**. Designing cross-platform news requires adapting layout mechanics to screen orientation, touch interaction, and fluid responsive grid systems.

## Frameworks Introduced
- **The Tri-Screen News Convergence Model**:
  - When to use: Architecting news publishing across physical print and digital screen platforms.
  - How: Adapt typography and layout mechanics per medium:
    1. *Print Edition*: Fixed spatial format, high-resolution physical spreads, tactile pacing, deep weekend reading.
    2. *Desktop & Web*: Continuous vertical scroll, responsive grid breakpoints, instant engagement, real-time analytics.
    3. *Tablet & Mobile Apps*: Touch interactivity, motion/video integration, dual-orientation shifts (portrait single-column vs. landscape multi-column), scannable card feeds.
- **The Liquid Responsive Grid Framework**:
  - When to use: Designing web and app interfaces for news articles.
  - How: Build fluid grid structures that adapt across screen breakpoints:
    - *Desktop ($>1200\text{px}$)*: 12-column grid allowing sidebars, data callouts, and multi-column article layouts.
    - *Tablet ($768\text{px}\text{--}1024\text{px}$)*: 4-to-8 column grid with collapsible sidebars and touch-friendly cards.
    - *Mobile ($<480\text{px}$)*: Single-column fluid stream with vertical media stacks and high-contrast typography.

## Key Concepts
- **Responsive Web Design**: Building web layouts that automatically adjust font sizes, margins, and column counts to fit any screen size.
- **Touch Interactivity**: Designing UI elements (swipe galleries, expandable charts, video overlays) optimized for finger gestures rather than mouse clicks.
- **Orientation Shift**: Layouts that dynamically reconfigure when a user rotates a tablet from portrait (vertical single-column) to landscape (horizontal multi-column).
- **Multimedia Integration**: Seamlessly blending text, photo galleries, video clips, and interactive data visualisations into a single narrative flow (pioneered by NYT's *Snow Fall*).

## Mental Models
- **Anchor the Brand, Fluidize the Grid**: Anchor core brand elements (masthead, primary typefaces, tone of voice) across all outputs, but let the layout flow fluidly per screen size.
- **The Commute vs. Armchair Context**: Mobile apps serve fast, scannable updates during commutes; tablets and print serve immersive long-form reading in the armchair.

## Anti-patterns
- **The PDF Mirror**: Uploading raw print page PDFs onto tablet apps or web pages without optimizing typography or interactive navigation.
- **Unresponsive Static Widths**: Hardcoding pixel widths for desktop screens, forcing mobile users to zoom and scroll horizontally.
- **Gimmicky Interactivity**: Adding swipe transitions or video loops that slow down page loading without enhancing story comprehension.

## Reference Tables

### Cross-Platform Technical & UX Matrix

| Platform | Primary Interaction | Typical Grid | Typographic Priority | Multimedia Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Print Edition** | Tactile page flip | Fixed 6 or 12 Column | High-precision baseline grid lock | High-res photography & custom graphics |
| **Desktop Web** | Mouse / Scroll wheel | Fluid 12 Column | High contrast screen fonts, $1.5\times$ line-height | Interactive charts, video, live feeds |
| **Mobile App** | Vertical thumb scroll | 1 Fluid Column | Large touch targets, $16\text{px}+$ body | Short video, audio clips, push alerts |
| **Tablet / iPad** | Touch swipe / Pinch | Dual (Portrait 1-col / Landscape 2–3 col) | Generous margins, rich optical sizes | Embedded video, interactive infographics |

## Worked Example

### Deconstructing NYT's "Snow Fall" Multimedia Feature Architecture
1. **Seamless Narrative Flow**: Text is set in a single clean column. As the user scrolls, high-definition video backgrounds (avalanche simulations) play automatically in sync with the narrative position.
2. **Interactive Flyover Maps**: 3D topographic maps allow readers to pinch-zoom and rotate the mountain terrain where the avalanche occurred.
3. **Embedded Audio Profiles**: Tapping a survivor's portrait plays an inline audio interview clip without redirecting away from the article page.
4. **Takeaway**: Multimedia elements must serve as natural narrative milestones, not intrusive pop-up distractions.

## Key Takeaways
1. Cross-platform news design unifies brand identity across print, web, mobile, and tablet.
2. Responsive grids adapt column counts and typography fluidly per screen width.
3. Optimize tablet news apps for touch gestures and dual-orientation shifts.
4. Multimedia integration (video, audio, data-viz) should feel like a seamless narrative flow.

## Connects To
- **Ch 03**: Redesigning news organizations for cross-platform workflows.
- **Ch 06**: Detailed case studies of *Snow Fall*, *Zeit Online*, and *Reuters*.
