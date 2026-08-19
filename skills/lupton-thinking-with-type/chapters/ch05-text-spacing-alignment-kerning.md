# Chapter 5: Text — Columns, Lines, and Spacing

## Core Idea
Spacing is the invisible architecture of typography. How designers control micro-space (kerning, tracking) and macro-space (leading, paragraph indents, column margins, ragging) directly dictates whether a page or screen feels inviting, readable, and structured or chaotic and tiring.

## Frameworks Introduced
- **The Four Alignment Archetypes**:
  - When to use: Choosing paragraph text alignment based on medium and tone:
    1. *Flush Left / Ragged Right*: Natural reading rhythm; consistent word spacing; comfortable organic rag. Default choice for web and screens.
    2. *Justified*: Clean geometric edges on both sides; requires careful hyphenation to avoid gaping holes ("rivers"). Standard for print books and newspapers.
    3. *Flush Right / Ragged Left*: Creates visual tension; good for short captions, sidebars, or marginalia. Unsuitable for long copy.
    4. *Centered*: Formal, symmetrical, static. Best for invitations, title pages, and short headlines ($<3$ lines).
- **The Spacing Hierarchy Rules**:
  - When to use: Setting up paragraph styles and typographic rules:
    - *Indents vs. Spacing Rule*: **Never use both a paragraph indent and paragraph space-below simultaneously**. Use an indent ($1\times$ to $1.5\times$ body size) OR a line space, never both.
    - *Tracking Rule*: Track Small Caps, All-Caps headlines, and tiny caption text LOOSELY ($+20$ to $+50$ units). **Never track lowercase body copy loosely**.
    - *Kerning Rule*: Apply Optical Kerning or manual pair adjustments for display headlines ($>24\text{pt}$); rely on Metric Kerning for body text.

## Key Concepts
- **Line Measure (Line Length)**: The horizontal width of a text column. Optimal range is **55–75 characters per line** for print, and **45–65 characters** for digital screens.
- **Leading (Line Height)**: The vertical distance from the baseline of one line of text to the baseline of the next.
- **Kerning**: The adjustment of space between two specific adjacent character shapes to achieve optical optical uniformity (e.g., `AV`, `To`, `Wa`).
- **Tracking (Letter-spacing)**: Adjusting the uniform space across a range of characters.
- **Widow**: A single word or short hyphenated syllable left isolated at the end of a paragraph.
- **Orphan**: The single opening line of a paragraph left stranded at the bottom of a page or column.
- **Rivers**: Ugly vertical streaks of white space running through justified text columns caused by bad word spacing.

## Mental Models
- **Spacing as Liquid Volume**: Text is liquid poured into a container. If the container (line measure) is too wide, the reader gets lost returning to the next line. If too narrow, the text breaks awkwardly.
- **The Rag as a Silhouette**: A good rag on flush-left text should look like a soft, organic, gentle wave—never an aggressive saw-tooth or a giant wedge.

## Anti-patterns
- **Double Indent + Space Below**: Adding an indent AND a full line break between paragraphs, creating redundant white gaps.
- **Extreme Line Widths**: Running body text across an entire 1920px widescreen monitor without a `max-width` limit ($>120$ characters per line).
- **Loosely Tracked Lowercase**: Increasing letter-spacing on lowercase body text, destroying word shape contours and ruining legibility.

## Reference Tables

### Spacing & Alignment Production Metrics

| Parameter | Recommended Value (Print) | Recommended Value (Digital Screen) | Red Flag / Smell |
| :--- | :--- | :--- | :--- |
| **Line Measure** | 55–75 characters per line | 45–65 characters per line | $>85$ or $<35$ characters |
| **Body Leading** | $120\% \text{ to } 140\%$ of font size | $140\% \text{ to } 160\%$ of font size | Text baselines touching or $>200\%$ |
| **Headline Leading** | $100\% \text{ to } 110\%$ (Solid leading) | $110\% \text{ to } 120\%$ | Gaping vertical distance in multi-line titles |
| **Paragraph Indent** | $1\times$ to $1.5\times$ body font size (e.g., 10pt–15pt) | $1\times$ body size or $0$ (use margin-bottom instead) | Huge indents ($>30\text{pt}$) |
| **Tracking Caps** | $+20 \text{ to } +50 \text{ thousandths of an em}$ | `letter-spacing: 0.05em` | Un-tracked dense All-Caps headlines |

## Worked Example

### Fixing a Bad Rag and Eliminating a Runt Word
1. **Problem**: A flush-left paragraph ends with the single word "it." on its own line (a runt/widow), and line 3 sticks out far past line 4, creating an ugly saw-tooth shape.
2. **Fix 1 (Tracking)**: Apply a subtle tracking adjustment ($-10$ units) to the paragraph. The word "it." pulls back onto the preceding line.
3. **Fix 2 (Soft Return)**: Insert a soft return (`Shift + Enter`) before a preposition earlier in the paragraph to break the line naturally and smooth the rag outline.

## Key Takeaways
1. Line length must be constrained (45–65 chars for screen) to ensure comfortable reading sweeps.
2. Never combine paragraph indents with paragraph spacing.
3. Track uppercase and small caps loosely; keep lowercase body tracking untouched.
4. Eliminate widows, orphans, runts, and justified text "rivers" through manual proofing or CSS `text-wrap: pretty / balance`.

## Connects To
- **Ch 02**: Aligning leading to the baseline grid.
- **Ch 06**: Using vertical spacing to reinforce structural hierarchy.
