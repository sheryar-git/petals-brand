# Petals — design tokens

```
        ╲   │   ╱
         ╲  │  ╱
   ─── ─── ─── ─── ─── ─── ───
         ╱  │  ╲
        ╱   │   ╲
```

The source of truth for color, type, spacing, motion, and the mark.

CSS lives in `petals-tokens.css`. The mark generator lives in `petals-mark.js`. This file is the why — that one's the law.

Petals is the brand. petals.fm is the domain. Don't confuse them.

## Architecture

```
petals-tokens.css          ← shared rules
  ├── instrument/style.css ← extends (knob sizes, canvas, themes)
  ├── website/styles       ← extends (page layout, responsive)
  └── social/ad templates  ← extends (format sizing)
```

## Font

Berkeley Mono Variable. Nothing else. Weights 400 and 700 only.

## Type scales

### UI scale (inside instruments)

| Size | Role |
|------|------|
| 10px | Instrument name, section headers (ceiling) |
| 9px | Primary values, readouts |
| 8px | Secondary text, section labels |
| 7px | Tertiary labels, fine print (floor) |

### Brand scale (website, assets, ads)

| Size | Role |
|------|------|
| 32px | Hero brand name |
| 20px | Standard brand name |
| 10px | Compact brand name (same as UI ceiling) |

Brand scale applies to PETALS and the tagline only. Everything else uses the UI or page scale.

### Page scale (website body chrome)

For body, nav, footer at desktop reading distance (~70cm). Different from the instrument UI scale (panel distance ~45cm) and from the lockup tiers (display sizes). Use only on brand surfaces.

| Token | Size | Role |
|-------|------|------|
| `--fs-page-strong` | 15px | Footer column heads, emphasized body |
| `--fs-page-body` | 12px | Body, nav links, footer columns |
| `--fs-page-secondary` | 11px | Small nav text, mobile breakpoints |

## Letter-spacing

Contextual, not formulaic. Wider for brand display, tighter for data.

### Brand / title tier

| Size | Spacing | Context |
|------|---------|---------|
| 32px | 10px | Hero PETALS |
| 20px | 5px | Standard PETALS |
| 10px | 5px | Instrument title, compact brand |
| 9px | 3px | Card name (bold, tight) |
| 8px | 5px | Sub-brand |

### Label tier

| Size | Spacing | Context |
|------|---------|---------|
| 8px | 4px | Section titles on brand surfaces |
| 8px | 2.5px | Section labels inside instruments |
| 7px | 2px | Small uppercase labels |
| 7px | 1.5px | Param labels |
| 7px | 1px | Spec cells, param names |

### Value tier

| Size | Spacing | Context |
|------|---------|---------|
| 8px | 0.5px | Preset items, readouts |
| 7px | 0.5px | Fine values |
| 7px | 0px | Raw data (hex codes) |

## Lockup system

Mark + text where **the mark's height equals the text's cap height.**

### Font metrics (Berkeley Mono Variable, OS/2 table)

```
unitsPerEm:   1000
sCapHeight:    680
cap ratio:     0.680
```

### Lockup tiers

Sizes chosen so `fontSize × 0.68` lands on a canonical mark size. Only pairs with under 0.25px error qualify.

| Tier | Font | Cap height | Mark | Error | Use |
|------|------|-----------|------|-------|-----|
| Grand | 66px | 44.88 | 45px | 0.12 | Splash pages |
| Display | 59px | 40.12 | 40px | 0.12 | Website heroes |
| Hero | 44px | 29.92 | 30px | 0.08 | Buy sections, page heroes |
| Subhead | 37px | 25.16 | 25px | 0.16 | Section headers |
| Standard | 22px | 14.96 | 15px | 0.04 | Nav, footer brand |
| Compact | 15px | 10.20 | 10px | 0.20 | Small branding, captions |
| Micro | 10px | 6.80 | 7px | 0.20 | Instrument headers |

### Usage

Set BOTH font-size and Mark `size` from the same tier. No mixing.

```html
<div class="lockup lockup-display lockup-vertical">
  <Mark size={40} />
  <span class="lockup-text">PETALS</span>
</div>
```

### Letter-spacing per tier

| Tier | ls | text-indent |
|------|----|-------------|
| Grand | 20px | 20px |
| Display | 15px | 15px |
| Hero | 12px | 12px |
| Subhead | 10px | 10px |
| Standard | 5px | 5px |
| Compact | 5px | 5px |

`text-indent` matches `letter-spacing` so tracked uppercase text sits optically centered.

### Lockup gap

| Orientation | Compact / Standard | Hero+ |
|------------|-----------------|-------|
| Horizontal | 5px | 10px |
| Vertical | 10px | 15px |

### Tagline color

- Brand surfaces: `--text-dim`
- Inside instruments: `--text-muted` (brand recedes behind product)

### Legacy brand classes (non-lockup contexts)

```
Hero:     PETALS 32px ls:10px
Standard: PETALS 20px ls:5px
Compact:  [product] 10px ls:5px
```

## Woven Star mark

Stroke weight steps down as the mark gets bigger. Goal: ~1.5px rendered stroke at any size.

| Display | stroke (in 200×200 viewBox) |
|--------|------|
| 200px+ | 4 |
| 100px+ | 5 |
| 60px+ | 7 |
| 40px+ | 9 |
| 28px+ | 12 |
| 20px+ | 16 |
| <20px | 20 |

Below 20px: butt linecaps + wider center gap for clarity. See `petals-mark.js`.

## Surface variants

Default is **Nightshade** (instruments lean here, violet dusk). Two named variants override surface / border / text via root attribute selectors.

### Light mode — `:root[data-dir="light"]`

The Kinari palette. Cream paper, ink, pigments. The instrument feels printed, not lit. Active = pressed ink, not glow.

### Website surface — `:root[data-surface="website"]`

The "gallery wall." Cooler and flatter than Nightshade. The wall the work hangs on, not the work itself. Applied via `data-surface="website"` on `<html>` in the website's `Base.astro`. Combines with `data-dir="light"` for the light-mode website (cascade order matters; specificity is equal).

Overrides surface / border / text only. Accents inherit from Nightshade so the brand purple stays the same on every surface.

| Token | Hex |
|-------|-----|
| `--bg` | #0C0B10 |
| `--surface` | #14131A |
| `--surface-up` | #1C1B22 |
| `--groove` | #08080C |
| `--groove-edge` | #201F28 |
| `--control` | #1C1B24 |
| `--control-edge` | #28272E |
| `--border-light` | #28272E |
| `--border` | #1C1B22 |
| `--border-dim` | #121118 |
| `--text` | #C8C6D0 |
| `--text-dim` | #7C7A88 |
| `--text-muted` | #4C4A58 |

### Surface overlay (theme-aware translucent)

| Token | Value | Use |
|-------|-------|-----|
| `--surface-overlay` | `color-mix(in srgb, var(--surface) 85%, transparent)` | Sticky bars, dropdowns over content. Follows `--surface` across themes. |

## Color — Nightshade

### Surfaces

| Token | Hex |
|-------|-----|
| `--bg` | #060608 |
| `--surface` | #0c0c12 |
| `--surface-up` | #111118 |

### Borders

| Token | Hex |
|-------|-----|
| `--border` | #242430 |
| `--border-dim` | #16161e |

### Text

| Token | Hex | Use |
|-------|-----|-----|
| `--text` | #c0c0d4 | Primary |
| `--text-dim` | #8484a0 | Secondary, taglines |
| `--text-muted` | #5c5c78 | Tertiary, section labels |

### Accents

| Token | Hex | Name |
|-------|-----|------|
| `--accent` | #7868D4 | Purple |
| `--accent2` | #58C8A0 | Jade |
| `--accent3` | #C8688A | Rose |
| `--accent4` | #8CB0D4 | Powder blue |
| `--accent5` | #3C9058 | Sage |

Each has a `-dim` variant. Some have `-glow`.

`--danger`: #ff4444

## Spacing

5px base. Every spacing value is a multiple of 5.

5 · 10 · 15 · 20 · 25 · 30

### Optical offsets (sub-grid exception)

For the rare cases where the 5px grid breaks visual flow. Use sparingly. Always comment the optical reason.

| Token | Value | Use |
|-------|-------|-----|
| `--optical-tight` | 2.5px | Label hugging knob from below |

## Section containers

```css
background: var(--surface);
border: 1px solid var(--border-dim);
padding: 10px;
```

Labels: 8px, ls:2.5px, uppercase, `--text-muted`, weight 400.

## Borders + radius

1px width. `--border` or `--border-dim`.

Radius: 0px default · 2px interactive · 4px max. No pills.

## Transitions

How things move is part of the brand. Fast at the control level, slower at the state level.

### Control feedback (tenths of a second)

| Token | Value | Use |
|-------|-------|-----|
| `--tr-instant` | 0.05s | LEDs, limiter, immediate feedback |
| `--tr-fast` | 0.1s | Hover, active snap-back |
| `--tr-tick` | 0.1s | Progress, scrub (same as `--tr-fast`, named for intent) |
| `--tr-normal` | 0.12s | Standard control transitions — the Petals feel |
| `--tr-gentle` | 0.15s | Border focus, soft reveals |
| `--tr-slow` | 0.25s | Value display, phyllotaxis |
| `--tr-breath` | 0.3s | Theme-level shifts, garden glow |

### Page-level entry (seconds)

A different category from control feedback. Use only on page section entry / exit, never on interactive controls.

| Token | Value | Use |
|-------|-------|-----|
| `--tr-entry-fast` | 0.6s | Card fade-in |
| `--tr-entry-normal` | 0.8s | Hero entry |
| `--tr-entry-slow` | 1.0s | Delayed reveals |

### Easing

| Token | Value | Use |
|-------|-------|-----|
| `--ease` | `ease` | Default |
| `--ease-out` | `ease-out` | Snap-to-rest |
| `--ease-linear` | `linear` | Frame-tied motion (progress, scrub) |
| `--ease-entry` | `cubic-bezier(0.16, 1, 0.3, 1)` | easeOutExpo for page entry |

Usage: `transition: color var(--tr-normal) var(--ease);` for controls. `transition: opacity var(--tr-entry-normal) var(--ease-entry);` for page entry.

## Alpha

Semantic state opacity. Animation keyframes use raw values — they're points on a curve, not states.

| Token | Value | Use |
|-------|-------|-----|
| `--alpha-grain` | 0.05 | Grain texture, scan lines |
| `--alpha-disabled` | 0.30 | Inactive / disabled |
| `--alpha-inactive` | 0.50 | Mid-state, deemphasized |
| `--alpha-hover` | 0.60 | Hover, soft emphasis |
| `--alpha-emphasis` | 0.80 | Primary emphasis |
| `--alpha-strong` | 0.90 | Near-solid |

## Accent roles

Purple is the brand. The others are system indicators.

| Token | Color | Role | Surfaces |
|-------|-------|------|----------|
| `--accent` | Purple #7868D4 | Brand primary. Active, focus, LFO1 | All |
| `--accent2` | Jade #58C8A0 | LFO2, complementary mod | Instruments only |
| `--accent3` | Rose #C8688A | Danger / destructive | Instruments only |
| `--accent4` | Powder #8CB0D4 | Lock / info, ratio lock, garden | Instruments only |
| `--accent5` | Sage #3C9058 | MTS-ESP source | Instruments only |

Brand surfaces (website, socials, ads) show `--accent` only.

### CTA + product accents

Different category from the 5 system accents — these mean money, not signal flow. They live on the website, not inside instruments.

| Token | Color | Role |
|-------|-------|------|
| `--accent-cta` | #578859 (moss) | Buy-button green. Not jade, not sage. Money green. |
| `--accent-cta-dim` | #3A6B3D | Light-theme variant |
| `--product-folium-cta` | #c9a86c (warm cream) | Folium's CTA color on website surfaces |

Future products: `--product-<name>-cta`.

## Accent stripe

Brand fingerprint. 2px bar with all five accent colors. Always Nightshade hex (never theme-variable). Lives on contact cards, instrument footers, social assets.

```
#7868D4 · #58C8A0 · #C8688A · #8CB0D4 · #3C9058
```

## Mark module

`petals-mark.js` — one function, one file, imported everywhere.

```javascript
import { petalsMarkSVG, petalsMarkStroke } from './petals-mark.js';

// raw SVG string (innerHTML, brand assets)
element.innerHTML = petalsMarkSVG(32);

// React component: see PetalsMark.jsx in each instrument
```

## Font rendering

```css
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
text-rendering: optimizeLegibility;
```

## Instrument-level (not in here)

Knob hierarchy · canvas size · slider/bar dimensions · theme variants · voice viz · MTS-ESP prismatic palette · modulation routing UI.
