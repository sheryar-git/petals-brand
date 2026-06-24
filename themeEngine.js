// ════════════════════════════════════════════════════════════════════════
// THEME ENGINE — how color and brightness work
// ════════════════════════════════════════════════════════════════════════
//
// Every color is generated in OKLCH (via culori). Two layers are kept
// separate on purpose: the HUE RECIPE (which colors — fixed, the brand) and
// the BRIGHTNESS SYSTEM (how light/dark — relational, a handful of knobs).
//
// ── HUE RECIPE (fixed — this is the brand identity) ──────────────────────
// One anchor: #7868D4 (murasaki 藤, the brand purple, h287). The six mod-
// source dyes are harmonic rotations off it — traditional Japanese pigments:
//   murasaki 藤  h287  anchor             · LFO 1
//   matcha  若竹 h142  split-comp green    · LFO 2
//   kihada  黄檗 h82   split-comp ochre    · ENV 1
//   beni    紅   h47   triadic rust        · ENV 2
//   hanada  縹   h257  analogous −30 indigo· Motion 1 / lock
//   nezumi  藍鼠 h257  analogous, greyed   · Motion 2 / MTS (quietest)
// These hues + their per-dye chroma are DESIGN DNA. They do NOT track
// brightness or the field — changing them changes the brand. (The one-anchor
// generator, where every hue derives from a single number, is petals-color.js
// in petals-brand; this file holds the resolved values.)
//
// Color is reserved for MEANING: a dye names a mod source or a section.
// Chrome and controls are NEUTRAL — interaction is a luminance lift toward the
// ceiling (bone on dark, ink on light), never a hue. Purple is held for the
// anchor + the murasaki source only.
//
// ── BRIGHTNESS SYSTEM (relational — the knobs) ───────────────────────────
// Per theme, every lightness is an ADDITIVE OFFSET from one of three anchors.
// Additive, NOT a ratio: OKLCH L is perceptually linear, so a fixed ΔL is a
// constant perceived step at any darkness (a ratio would collapse the gaps as
// the floor nears black). Move an anchor → everything tied to it tracks, in
// balance, no hand-fixing:
//
//   NS_FLOOR    the dark field       → surfaces · controls · bevels · dim+muted text
//   NS_CEIL     the bright pole      → interaction/glow · primary + value text
//   NS_SIGNAL   the color brightness → the 6 dyes (per-dye offsets kept) · section tints
//
// FIELD TEMPERATURE is two more knobs: NS_SURFACE_H (field hue) + NS_SURFACE_C
// (saturation — low = grey, high = tinted). NS_TEXT_H is LINKED to
// NS_SURFACE_H, so text leans into the field automatically: change the bg
// colour and the text follows, no warm-on-cool mud.
//
// So the whole dark theme = NS_FLOOR + NS_CEIL + NS_SIGNAL + NS_SURFACE_H/C +
// the hue recipe. "Darker", "more contrast", "louder headers", "warmer field"
// are each ONE number. Amiga mirrors it with KI_* on an inverted axis (the
// floor is the bright paper, the ceiling is the dark ink).
//
// Intentionally NOT relational (deliberate constants): danger (semantic red —
// rides signal for L, keeps its hue), grain opacity + machined-shadow alphas
// (per-theme hand-tuning), and the hue recipe above.
//
// ── THEMES ───────────────────────────────────────────────────────────────
// Petals at Night (dark): a tinted-graphite field on the murasaki→hanada arc
//   (NS_SURFACE_H ~268), dyes quietly luminous on it.
// Amiga (light): warm raw-silk "Amiga 500" washi, the same dyes deepened to
//   read as ink on cream.
//
// History: replaced the gundam/cyberpunk neon in the 2026-06-18 natural-dye
// reset; the relational floor/ceiling/signal system + field-hue linking landed
// 2026-06-20.

import { formatHex } from 'culori';

/** OKLCH → hex via culori. The single source of truth for color generation. */
function oklchHex(l, c, h) {
  return formatHex({ mode: 'oklch', l, c, h });
}

/** OKLCH → rgba string for glow/shadow use. */
function oklchRgba(l, c, h, a) {
  const hex = oklchHex(l, c, h);
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// ── Nightshade dye specs — natural pigments, quietly luminous on ink ──
//
// Each dye at its own { l, c, h }. Restrained chroma — these are dyes, not
// LEDs. Purple holds the brand hue/chroma (h287, C0.150) at a dark-theme
// lifted L so it reads unmistakably as #7868D4's voice. matcha (green) is
// lifted most (green is perceptually dark, needs L to sit beside the others);
// nezumi (mouse-grey indigo) is the quietest, near-neutral.
//
// Per-dye { l, c, h }. Dim variant = L − NS_DIM_DROP, C × NS_DIM_C_RATIO.
const NS_DIM_DROP = 0.13;     // dim lightness drop
const NS_DIM_C_RATIO = 0.62;  // dim chroma multiplier

// The two bright anchors (the floor is the dark one, see NS_FLOOR below).
const NS_CEIL   = 0.965;  // bright pole — interaction/glow + primary text ride this
const NS_SIGNAL = 0.660;  // meaning-color brightness — the dye family + tints ride this
                          // (each dye keeps its own perceptual offset from NS_SIGNAL)

const NS_ACCENTS = {
  // L = NS_SIGNAL + per-dye perceptual offset (green/ochre sit higher on purpose).
  // Move NS_SIGNAL and the whole family brightens/dims together, balance preserved.
  murasaki: { l: NS_SIGNAL - 0.020, c: 0.150, h: 287 },  // 藤 fuji — brand anchor · LFO 1
  matcha:   { l: NS_SIGNAL + 0.040, c: 0.095, h: 142 },  // 若竹 bamboo green · LFO 2
  kihada:   { l: NS_SIGNAL + 0.085, c: 0.095, h: 82 },   // 黄檗 cork-bark ochre · ENV 1
  beni:     { l: NS_SIGNAL + 0.005, c: 0.125, h: 47 },   // 紅 safflower → triadic rust (h47) · ENV 2
  hanada:   { l: NS_SIGNAL - 0.005, c: 0.110, h: 257 },  // 縹 plant indigo (analogous −30) · Motion 1
  nezumi:   { l: NS_SIGNAL - 0.005, c: 0.035, h: 257 },  // 藍鼠 mouse-grey indigo (analogous, greyed) · Motion 2
};

// ── Nightshade surface specs — 褐 KACHI, deep INDIGO-BLACK ──
// Kachi ("victory color"): a traditional very-dark Japanese indigo. A cool
// blue undertone (hue 255) at LOW chroma (0.016) — it reads as a near-black
// with a blue SOUL, not a blue panel. The OPPOSITE of the prior warm
// sumi-brown (which went brown off hue 70). An indigo-black ladder bg →
// panel → raised, all L-only moves on one hue so the field reads as a single
// body of ink. Pairs with the hanada + matcha plant dyes — one indigo world.
// ΔL ≈ 0.05 so panels lift cleanly at fractional .scale-root zoom. Head
// recess is a deliberate deep (not a void) so it reads as machined recess.
//
// ── SURFACE FAMILY SWAP — one-line change ──
// To re-temper the whole dark surface body, swap NS_SURFACE_H / NS_SURFACE_C
// to one of these documented alternates (the L ladder below stays as-is):
//   KACHI  褐  indigo-black  H 255  C 0.016   ← APPLIED (blue soul)
//   SUMI   墨  neutral black H  any C 0.004   (pure near-black, no temp)
//   MURASAKI 紫 purple-black H 287  C 0.014   (wisteria-black, brand-tinted)
const NS_SURFACE_H = 268;    // cool-violet-grey — on the murasaki→hanada arc (anchor 287 → indigo 257)
const NS_SURFACE_C = 0.014;  // low chroma — reads as a tinted graphite, not blue

// FLOOR-ANCHORED ladder: set NS_FLOOR (the bg darkness), everything above is a
// fixed ΔL offset from it. The whole stack tracks the floor, so the panel-lift
// balance holds at any darkness. Additive offsets, not a ratio — OKLCH L is
// perceptually linear, so a fixed ΔL is a constant perceived lift whether the
// floor is near-black or grey. (A ratio would collapse the gaps toward black.)
const NS_FLOOR = 0.100;   // bg darkness — the one knob
const NS_SURFACES = {
  bg:          { l: NS_FLOOR },          // floor
  surface:     { l: NS_FLOOR + 0.055 },  // panel — lifts off the floor
  surfaceUp:   { l: NS_FLOOR + 0.105 },  // raised element / hover
  surfaceHead: { l: NS_FLOOR - 0.020 },  // header strip recess — below the floor
  surfaceBase: { l: NS_FLOOR - 0.020 },  // base plate strip
};

// Borders — directional light. Top brightens, bottom darkens so panel
// edges read as a true bevel under the warm-ink ladder.
const NS_BORDERS = {
  light: { l: NS_FLOOR + 0.185 },  // top edge catches light — original bevel contrast restored
  mid:   { l: NS_FLOOR + 0.105 },  // sides — tracks surface
  dim:   { l: NS_FLOOR + 0.025 },  // bottom edge — recedes nearly into the floor
};

// Controls — groove tracks the recess, control tracks surface-up so the
// pressed-vs-raised metaphor stays at parity with the surface ladder.
const NS_CONTROLS = {
  groove:      { l: NS_FLOOR - 0.010 },  // dark recess — tracks the floor
  grooveEdge:  { l: NS_FLOOR + 0.165 },  // rim of groove — sharper outline
  control:     { l: NS_FLOOR + 0.105 },  // interactive surface — = surface-up
  controlEdge: { l: NS_FLOOR + 0.205 },  // rim catch
};

// Text — cool bone / silver. ONE cool temperature (h255, near-zero chroma)
// re-tuned to AGREE with the kachi indigo surfaces — no warm-on-cool mud, no
// dinginess. The chromatic-adaptation rule: neutral text leans INTO the field
// hue (255), so the ramp reads as clean cool bone at rest on the indigo-black
// instead of fighting it warm. Interaction stays neutral (cool bone, no hue).
const NS_TEXT_H = NS_SURFACE_H;  // text + interaction lean INTO the field hue — change the bg color and they follow
const NS_TEXT_C = 0.005;

// ── Karakami dye specs — same pigments, deepened to read on washi ──
//
// Karakami inherits the natural-dye family, lowered in L (darker = alive on
// the cream field, bg L 0.87) and tuned in chroma so each dye sits beautiful
// and legible on raw silk. Purple holds the brand hue/chroma at the light
// anchor L. matcha/kihada carry a touch more chroma than Nightshade so the
// green and ochre don't wash out on cream. Per-dye { l, c, h }.
// Dim variant = L − KI_DIM_DROP, C × NS_DIM_C_RATIO.
const KI_DIM_DROP = 0.10;

// Amiga's three anchors (declared before KI_ACCENTS, which rides KI_SIGNAL).
const KI_FLOOR    = 0.870;  // paper brightness — the floor (light theme: brightest)
const KI_CEIL     = 0.220;  // ink pole — interaction + primary text (light: darkest = most present)
const KI_SIGNAL   = 0.490;  // dye-family brightness on cream
const KI_SURFACE_H = 77;    // field hue — surfaces, borders, text + interaction all lean into it

const KI_ACCENTS = {
  // L = KI_SIGNAL + per-dye perceptual offset (mirrors Nightshade, deepened for cream).
  murasaki: { l: KI_SIGNAL - 0.015, c: 0.140, h: 287 },  // 藤 fuji-iro anchor · LFO 1
  matcha:   { l: KI_SIGNAL + 0.010, c: 0.092, h: 142 },  // 若竹 bamboo green · LFO 2
  kihada:   { l: KI_SIGNAL + 0.050, c: 0.090, h: 82 },   // 黄檗 cork-bark ochre · ENV 1
  beni:     { l: KI_SIGNAL - 0.003, c: 0.115, h: 47 },   // 紅 safflower → triadic rust (h47) · ENV 2
  hanada:   { l: KI_SIGNAL - 0.020, c: 0.100, h: 257 },  // 縹 plant indigo (analogous −30) · Motion 1
  nezumi:   { l: KI_SIGNAL - 0.020, c: 0.040, h: 257 },  // 藍鼠 mouse-grey indigo (analogous, greyed) · Motion 2
};

// ── Section tint specs — per-theme lightness, shared hues ──
//
// The section header tints Sher loves — kept. Each section's header carries
// its own hue at one shared L within a theme ("colored pencils, same
// sharpness"). The hues are harmonized to the natural-dye family so the
// headers and the mod-source colors read as one pigment world. Restrained
// chroma — these tint a header strip, they do not shout.
const NS_TINT_C = 0.115;
const KI_TINT_C = 0.110;
const TINT_HUES = {
  input: 142, oscillator: 287, envelope: 82, seedling: 150,
  scope: 268, sequencer: 18, filter: 28, reverb: 248,
  output: 250, morph: 287, master: 250, eq: 248,
};

function makeTints(l, chroma) {
  const tints = {};
  for (const [name, h] of Object.entries(TINT_HUES)) {
    tints[`--tint-${name}`] = oklchHex(l, chroma, h);
  }
  return tints;
}

const NIGHTSHADE = {
  name: 'nightshade',
  label: 'Petals at Night',
  dir: 'dark',

  // Surfaces — kachi indigo-black field. One cool hue (255), the ink body.
  '--bg':           oklchHex(NS_SURFACES.bg.l,          NS_SURFACE_C, NS_SURFACE_H),
  '--surface':      oklchHex(NS_SURFACES.surface.l,     NS_SURFACE_C, NS_SURFACE_H),
  '--surface-up':   oklchHex(NS_SURFACES.surfaceUp.l,   NS_SURFACE_C, NS_SURFACE_H),
  '--surface-head': oklchHex(NS_SURFACES.surfaceHead.l, NS_SURFACE_C, NS_SURFACE_H),
  '--surface-base': oklchHex(NS_SURFACES.surfaceBase.l, NS_SURFACE_C, NS_SURFACE_H),

  // Borders — cool graphite, directional light
  '--border-light': oklchHex(NS_BORDERS.light.l, NS_SURFACE_C, NS_SURFACE_H),
  '--border':       oklchHex(NS_BORDERS.mid.l,   NS_SURFACE_C, NS_SURFACE_H),
  '--border-dim':   oklchHex(NS_BORDERS.dim.l,   NS_SURFACE_C, NS_SURFACE_H),

  // Controls — groove recedes, control lifts
  '--groove':       oklchHex(NS_CONTROLS.groove.l,      NS_SURFACE_C, NS_SURFACE_H),
  '--groove-edge':  oklchHex(NS_CONTROLS.grooveEdge.l,  NS_SURFACE_C, NS_SURFACE_H),
  '--control':      oklchHex(NS_CONTROLS.control.l,     NS_SURFACE_C, NS_SURFACE_H),
  '--control-edge': oklchHex(NS_CONTROLS.controlEdge.l, NS_SURFACE_C, NS_SURFACE_H),

  // Text — four-tier ramp, ONE cool bone/silver temperature (h255) that agrees
  // with the kachi indigo surfaces. Nothing fights the field.
  //   --text        primary — param names, hero values, active labels
  //   --text-value  value   — stateless value words at rest
  //   --text-dim    second  — secondary info, units, idle controls
  //   --text-muted  chrome  — 7px section/param labels, inactive (state idle)
  // Primary + value are CEILING-anchored (fixed bright) — always readable at any
  // floor darkness. Dim + muted are FLOOR-relative — they hold a constant quiet
  // step above the surface, so chrome stays recessed instead of creeping louder
  // as the floor goes blacker.
  '--text':       oklchHex(NS_CEIL - 0.065, NS_TEXT_C, NS_TEXT_H),  // ceiling-relative — bright bone
  '--text-value': oklchHex(NS_CEIL - 0.205, NS_TEXT_C, NS_TEXT_H),  // ceiling-relative — ivory value words
  '--text-dim':   oklchHex(NS_FLOOR + 0.470, NS_TEXT_C, NS_TEXT_H),  // floor-relative — secondary
  '--text-muted': oklchHex(NS_FLOOR + 0.350, NS_TEXT_C, NS_TEXT_H),  // floor-relative — quiet chrome

  // ── Natural-dye family — color for MEANING (mod sources / sections) ──

  // Purple — 藤 fuji, wisteria. Brand anchor + murasaki mod source. The ONE
  // place purple lives. NOT the active/interaction color.
  '--accent':      oklchHex(NS_ACCENTS.murasaki.l, NS_ACCENTS.murasaki.c, NS_ACCENTS.murasaki.h),
  '--accent-dim':  oklchHex(NS_ACCENTS.murasaki.l - NS_DIM_DROP, NS_ACCENTS.murasaki.c * NS_DIM_C_RATIO, NS_ACCENTS.murasaki.h),
  '--accent-glow': oklchRgba(NS_ACCENTS.murasaki.l, NS_ACCENTS.murasaki.c, NS_ACCENTS.murasaki.h, 0.12),

  // Green — 若竹 wakatake, bamboo. LFO 2 (Sher's fix: LFO2 is green now).
  '--accent2':      oklchHex(NS_ACCENTS.matcha.l, NS_ACCENTS.matcha.c, NS_ACCENTS.matcha.h),
  '--accent2-dim':  oklchHex(NS_ACCENTS.matcha.l - NS_DIM_DROP, NS_ACCENTS.matcha.c * NS_DIM_C_RATIO, NS_ACCENTS.matcha.h),
  '--accent2-glow': oklchRgba(NS_ACCENTS.matcha.l, NS_ACCENTS.matcha.c, NS_ACCENTS.matcha.h, 0.10),

  // Indigo — 縹 hanada, plant dye. Lock / Motion 1 (cool quiet structure).
  '--accent4':      oklchHex(NS_ACCENTS.hanada.l, NS_ACCENTS.hanada.c, NS_ACCENTS.hanada.h),
  '--accent4-dim':  oklchHex(NS_ACCENTS.hanada.l - NS_DIM_DROP, NS_ACCENTS.hanada.c * NS_DIM_C_RATIO, NS_ACCENTS.hanada.h),
  '--accent4-glow': oklchRgba(NS_ACCENTS.hanada.l, NS_ACCENTS.hanada.c, NS_ACCENTS.hanada.h, 0.08),

  // Mod-source ENV tokens — ENV 1 = kihada ochre (green moved OFF env),
  // ENV 2 = beni madder.
  '--accent-env1':     oklchHex(NS_ACCENTS.kihada.l, NS_ACCENTS.kihada.c, NS_ACCENTS.kihada.h),
  '--accent-env1-dim': oklchHex(NS_ACCENTS.kihada.l - NS_DIM_DROP, NS_ACCENTS.kihada.c * NS_DIM_C_RATIO, NS_ACCENTS.kihada.h),
  '--accent-env2':     oklchHex(NS_ACCENTS.beni.l, NS_ACCENTS.beni.c, NS_ACCENTS.beni.h),
  '--accent-env2-dim': oklchHex(NS_ACCENTS.beni.l - NS_DIM_DROP, NS_ACCENTS.beni.c * NS_DIM_C_RATIO, NS_ACCENTS.beni.h),

  // Beni — 紅·柿 safflower / persimmon. ENV 2.
  '--accent3':     oklchHex(NS_ACCENTS.beni.l, NS_ACCENTS.beni.c, NS_ACCENTS.beni.h),
  '--accent3-dim': oklchHex(NS_ACCENTS.beni.l - NS_DIM_DROP, NS_ACCENTS.beni.c * NS_DIM_C_RATIO, NS_ACCENTS.beni.h),

  // Nezumi — 藍鼠 mouse-grey indigo. MTS / Motion 2 (quietest, near-neutral).
  '--accent5':      oklchHex(NS_ACCENTS.nezumi.l, NS_ACCENTS.nezumi.c, NS_ACCENTS.nezumi.h),
  '--accent5-dim':  oklchHex(NS_ACCENTS.nezumi.l - NS_DIM_DROP, NS_ACCENTS.nezumi.c * NS_DIM_C_RATIO, NS_ACCENTS.nezumi.h),
  '--accent5-glow': oklchRgba(NS_ACCENTS.nezumi.l, NS_ACCENTS.nezumi.c, NS_ACCENTS.nezumi.h, 0.06),

  // ── Interaction — NEUTRAL. "You are touching this" = a bright bone lift,
  // NOT a purple glow. The categorical signal is LUMINANCE, not hue. Chrome
  // and controls never turn purple. This is the core fix.
  '--glow-white':      oklchHex(NS_CEIL, 0.004, NS_TEXT_H),  // bright bone/ivory
  '--glow-white-soft': oklchRgba(NS_CEIL, 0.004, NS_TEXT_H, 0.06),
  '--glow-white-med':  oklchRgba(NS_CEIL, 0.004, NS_TEXT_H, 0.10),
  '--glow-white-hot':  oklchRgba(NS_CEIL, 0.004, NS_TEXT_H, 0.14),
  '--active':          oklchHex(NS_CEIL, 0.004, NS_TEXT_H),  // neutral bone, not purple

  '--danger': oklchHex(NS_SIGNAL - 0.025, 0.165, 22),  // rides the signal level; hue/chroma stay the alarm red

  // ── State grammar — semantic role aliases (the coverage contract) ──
  // Clickable controls ride a NEUTRAL value ladder, never a hue:
  //   idle      muted bone     present but quiet (chrome label)
  //   hover     text bone      pointer affordance lift
  //   active    bright bone    engaged / on / playing — luminance, not purple
  //   selected  bright bone    chosen of a set (= active)
  //   locked    hanada indigo  constrained to a scale (MEANING, so colored)
  '--state-idle':     'var(--text-muted)',
  '--state-hover':    'var(--text)',
  '--state-active':   'var(--active)',
  '--state-selected': 'var(--active)',
  '--state-locked':   'var(--accent4)',

  // ── Modulation source-color tokens — color = which source (MEANING) ──
  '--mod1':     'var(--accent)',      // LFO1 — murasaki purple
  '--mod1-dim': 'var(--accent-dim)',
  '--mod2':     'var(--accent2)',     // LFO2 — matcha green
  '--mod2-dim': 'var(--accent2-dim)',
  '--mod-env1': 'var(--accent-env1)', // ENV1 — kihada ochre
  '--mod-env2': 'var(--accent-env2)', // ENV2 — beni madder
  '--mod-mot1': 'var(--accent4)',     // Motion1 — hanada indigo
  '--mod-mot2': 'var(--accent5)',     // Motion2 — nezumi grey-indigo
  '--lock':     'var(--accent4)',     // constrained/locked — hanada indigo
  '--lock-dim': 'var(--accent4-dim)',
  '--ext':      'var(--accent5)',     // external connection (MTS-ESP) — nezumi
  '--ext-dim':  'var(--accent5-dim)',

  // Section tints — natural-dye hues at L 0.58, restrained chroma. The loved
  // header tints, harmonized to the pigment family.
  ...makeTints(NS_SIGNAL - 0.060, NS_TINT_C),

  // Glow shadows — subtle halation, per-dye
  '--glow-accent':  `0 0 4px ${oklchRgba(NS_ACCENTS.murasaki.l, NS_ACCENTS.murasaki.c, NS_ACCENTS.murasaki.h, 0.12)}`,
  '--glow-accent2': `0 0 4px ${oklchRgba(NS_ACCENTS.matcha.l, NS_ACCENTS.matcha.c, NS_ACCENTS.matcha.h, 0.08)}`,
  '--glow-accent4': `0 0 4px ${oklchRgba(NS_ACCENTS.hanada.l, NS_ACCENTS.hanada.c, NS_ACCENTS.hanada.h, 0.08)}`,
  '--glow-accent5': `0 0 4px ${oklchRgba(NS_ACCENTS.nezumi.l, NS_ACCENTS.nezumi.c, NS_ACCENTS.nezumi.h, 0.06)}`,

  // Shadows — ambient occlusion at milled edges.
  // Tight, asymmetric, directional (light from above).
  '--shadow-panel': 'inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.30), 0 1px 0 rgba(0,0,0,0.45), 0 2px 5px rgba(0,0,0,0.18)',
  '--shadow-float': '0 4px 12px rgba(0, 0, 0, 0.5)',
  // Faceplate clip allowance below a panel shadow (2+5 px reach). Theme-agnostic.
  '--shadow-reserve': '7px',

  // Grain — anodized metal.
  // 2026-06-12 tier-2 — panel grain pulled down (0.20 → 0.14) so 7 px
  // text strips read cleaner across small-control modules (env header,
  // seq TIME tier). Wing + body keep their material identity — those are
  // the "anodised metal" surfaces a user reads at distance, not close-up.
  // Control + display tweaked one notch each in the same direction.
  '--grain-body-opacity':    '0.62',   // body — organic tile, noise felt
  '--grain-panel-opacity':   '0.40',   // panel — organic tooth, felt
  '--grain-wing-opacity':    '0.30',   // wing (unchanged)
  '--grain-control-opacity': '0.16',   // control
  '--grain-display-opacity': '0.05',   // display
  '--grain-base-opacity':    '0.55',   // base (unchanged)
};

// FLOOR-ANCHORED, inverted axis: surfaces lift UP from KI_FLOOR (+ΔL), recess +
// ink go DOWN (−ΔL). Anchors (KI_FLOOR/KI_CEIL/KI_SIGNAL) declared above, before
// KI_ACCENTS. Same additive-offset model as Nightshade, mirrored for a light field.
const KINARI = {
  name: 'kinari',
  label: 'Amiga',
  dir: 'light',

  // Surfaces — 生成 kinari, raw silk / kraft. Warm earth h=62, chroma 0.018.
  // The loved "Amiga 500" washi character — warm raw-silk, refined through the
  // natural-dye reset (surfaces + accents + neutral interaction evolved with
  // the dark theme; Sher approved both on the live UI). Visible warmth, not
  // bleached, not yellow. Sibling of Nightshade through the shared recipe.
  '--bg':           oklchHex(KI_FLOOR,         0.018, KI_SURFACE_H),  // raw kraft floor
  '--surface':      oklchHex(KI_FLOOR + 0.030, 0.018, KI_SURFACE_H),  // panel — lifts off the body
  '--surface-up':   oklchHex(KI_FLOOR + 0.075, 0.018, KI_SURFACE_H),  // raised element / hover
  '--surface-head': oklchHex(KI_FLOOR - 0.060, 0.018, KI_SURFACE_H),  // header recess — below the floor
  '--surface-base': oklchHex(KI_FLOOR - 0.110, 0.018, KI_SURFACE_H),  // base plate strip

  // Borders — warm graphite pencil on kraft. Ride the floor.
  '--border-light': oklchHex(KI_FLOOR - 0.130, 0.012, KI_SURFACE_H),   // top edge
  '--border':       oklchHex(KI_FLOOR - 0.210, 0.014, KI_SURFACE_H),   // sides
  '--border-dim':   oklchHex(KI_FLOOR - 0.310, 0.012, KI_SURFACE_H),   // bottom

  // Controls — pressed and raised paper, floor-anchored
  '--groove':       oklchHex(KI_FLOOR - 0.060, 0.018, KI_SURFACE_H),  // indent in paper
  '--groove-edge':  oklchHex(KI_FLOOR - 0.210, 0.014, KI_SURFACE_H),  // rim shadow
  '--control':      oklchHex(KI_FLOOR + 0.075, 0.018, KI_SURFACE_H),  // raised button (= surface-up)
  '--control-edge': oklchHex(KI_FLOOR - 0.130, 0.012, KI_SURFACE_H),  // button edge

  // Text — walnut ink on kraft, always warm. Inverted light axis (alive =
  // darker). Four-tier ramp parallels Nightshade.
  '--text':       oklchHex(KI_CEIL + 0.060, 0.016, KI_SURFACE_H),   // ceiling-relative — dark walnut
  '--text-value': oklchHex(KI_CEIL + 0.140, 0.014, KI_SURFACE_H),   // ceiling-relative — deep walnut
  '--text-dim':   oklchHex(KI_FLOOR - 0.400, 0.012, KI_SURFACE_H),  // floor-relative — medium brown
  '--text-muted': oklchHex(KI_FLOOR - 0.370, 0.012, KI_SURFACE_H),  // floor-relative — faded chrome

  // ── Natural-dye family — same pigments, deepened on cream ──

  // Purple — 藤色 fuji-iro, wisteria ink. Brand anchor + murasaki source.
  '--accent':      oklchHex(KI_ACCENTS.murasaki.l, KI_ACCENTS.murasaki.c, KI_ACCENTS.murasaki.h),
  '--accent-dim':  oklchHex(KI_ACCENTS.murasaki.l - KI_DIM_DROP, KI_ACCENTS.murasaki.c * NS_DIM_C_RATIO, KI_ACCENTS.murasaki.h),
  '--accent-glow': oklchRgba(KI_ACCENTS.murasaki.l, KI_ACCENTS.murasaki.c, KI_ACCENTS.murasaki.h, 0.12),

  // Green — 若竹 wakatake, bamboo dye. LFO 2.
  '--accent2':      oklchHex(KI_ACCENTS.matcha.l, KI_ACCENTS.matcha.c, KI_ACCENTS.matcha.h),
  '--accent2-dim':  oklchHex(KI_ACCENTS.matcha.l - KI_DIM_DROP, KI_ACCENTS.matcha.c * NS_DIM_C_RATIO, KI_ACCENTS.matcha.h),
  '--accent2-glow': oklchRgba(KI_ACCENTS.matcha.l, KI_ACCENTS.matcha.c, KI_ACCENTS.matcha.h, 0.10),

  // Indigo — 縹 hanada, plant dye. Lock / Motion 1.
  '--accent4':      oklchHex(KI_ACCENTS.hanada.l, KI_ACCENTS.hanada.c, KI_ACCENTS.hanada.h),
  '--accent4-dim':  oklchHex(KI_ACCENTS.hanada.l - KI_DIM_DROP, KI_ACCENTS.hanada.c * NS_DIM_C_RATIO, KI_ACCENTS.hanada.h),
  '--accent4-glow': oklchRgba(KI_ACCENTS.hanada.l, KI_ACCENTS.hanada.c, KI_ACCENTS.hanada.h, 0.08),

  // Mod-source ENV tokens — ENV 1 = kihada ochre, ENV 2 = beni madder.
  '--accent-env1':     oklchHex(KI_ACCENTS.kihada.l, KI_ACCENTS.kihada.c, KI_ACCENTS.kihada.h),
  '--accent-env1-dim': oklchHex(KI_ACCENTS.kihada.l - KI_DIM_DROP, KI_ACCENTS.kihada.c * NS_DIM_C_RATIO, KI_ACCENTS.kihada.h),
  '--accent-env2':     oklchHex(KI_ACCENTS.beni.l, KI_ACCENTS.beni.c, KI_ACCENTS.beni.h),
  '--accent-env2-dim': oklchHex(KI_ACCENTS.beni.l - KI_DIM_DROP, KI_ACCENTS.beni.c * NS_DIM_C_RATIO, KI_ACCENTS.beni.h),

  // Beni — 紅·柿 safflower / persimmon. ENV 2.
  '--accent3':     oklchHex(KI_ACCENTS.beni.l, KI_ACCENTS.beni.c, KI_ACCENTS.beni.h),
  '--accent3-dim': oklchHex(KI_ACCENTS.beni.l - KI_DIM_DROP, KI_ACCENTS.beni.c * NS_DIM_C_RATIO, KI_ACCENTS.beni.h),

  // Nezumi — 藍鼠 mouse-grey indigo. MTS / Motion 2 (quietest).
  '--accent5':      oklchHex(KI_ACCENTS.nezumi.l, KI_ACCENTS.nezumi.c, KI_ACCENTS.nezumi.h),
  '--accent5-dim':  oklchHex(KI_ACCENTS.nezumi.l - KI_DIM_DROP, KI_ACCENTS.nezumi.c * NS_DIM_C_RATIO, KI_ACCENTS.nezumi.h),
  '--accent5-glow': oklchRgba(KI_ACCENTS.nezumi.l, KI_ACCENTS.nezumi.c, KI_ACCENTS.nezumi.h, 0.06),

  // ── Interaction — NEUTRAL, inverted axis. On cream, "engaged" = a DARK
  // ink, not a purple wax seal. Touching a control darkens it toward the
  // walnut-ink floor; it does not turn purple. Luminance carries the state.
  '--glow-white':      oklchHex(KI_CEIL, 0.006, KI_SURFACE_H),  // dark walnut ink
  '--glow-white-soft': oklchRgba(KI_CEIL, 0.006, KI_SURFACE_H, 0.06),
  '--glow-white-med':  oklchRgba(KI_CEIL, 0.006, KI_SURFACE_H, 0.10),
  '--glow-white-hot':  oklchRgba(KI_CEIL, 0.006, KI_SURFACE_H, 0.16),
  '--active':          oklchHex(KI_CEIL, 0.006, KI_SURFACE_H),  // neutral dark ink, not purple

  '--danger': oklchHex(KI_SIGNAL + 0.010, 0.155, 25),  // rides the signal level; hue/chroma stay the alarm red

  // ── State grammar — semantic role aliases (same contract as Nightshade) ──
  '--state-idle':     'var(--text-muted)',
  '--state-hover':    'var(--text)',
  '--state-active':   'var(--active)',
  '--state-selected': 'var(--active)',
  '--state-locked':   'var(--accent4)',

  // ── Modulation source-color tokens (same aliases as Nightshade) ──
  '--mod1':     'var(--accent)',
  '--mod1-dim': 'var(--accent-dim)',
  '--mod2':     'var(--accent2)',
  '--mod2-dim': 'var(--accent2-dim)',
  '--mod-env1': 'var(--accent-env1)',
  '--mod-env2': 'var(--accent-env2)',
  '--mod-mot1': 'var(--accent4)',
  '--mod-mot2': 'var(--accent5)',
  '--lock':     'var(--accent4)',
  '--lock-dim': 'var(--accent4-dim)',
  '--ext':      'var(--accent5)',
  '--ext-dim':  'var(--accent5-dim)',

  // Section tints — natural-dye hues at L 0.50, restrained chroma. The loved
  // header tints, harmonized to the pigment family.
  ...makeTints(KI_SIGNAL + 0.010, KI_TINT_C),

  // Glow shadows — warm halation
  '--glow-accent':  `0 0 6px ${oklchRgba(KI_ACCENTS.murasaki.l, KI_ACCENTS.murasaki.c, KI_ACCENTS.murasaki.h, 0.12)}`,
  '--glow-accent2': `0 0 6px ${oklchRgba(KI_ACCENTS.matcha.l, KI_ACCENTS.matcha.c, KI_ACCENTS.matcha.h, 0.10)}`,
  '--glow-accent4': `0 0 6px ${oklchRgba(KI_ACCENTS.hanada.l, KI_ACCENTS.hanada.c, KI_ACCENTS.hanada.h, 0.08)}`,
  '--glow-accent5': `0 0 6px ${oklchRgba(KI_ACCENTS.nezumi.l, KI_ACCENTS.nezumi.c, KI_ACCENTS.nezumi.h, 0.06)}`,

  // Shadows — gentler on porcelain. Naturally visible on light surfaces.
  '--shadow-panel': 'inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(0,0,0,0.06), 0 1px 0 rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.05)',
  '--shadow-float': '0 4px 16px rgba(0, 0, 0, 0.10)',
  // Faceplate clip allowance — lockstep with Nightshade (theme-agnostic 7px).
  '--shadow-reserve': '7px',

  // Grain — porcelain micro-texture. Lighter = less grain.
  // 2026-06-12 tier-2 — panel + control + display all eased one notch so
  // 7 px text reads cleaner on the lifted bg. Wing + body keep the
  // kraft-paper identity.
  '--grain-body-opacity':    '0.10',   // body (unchanged)
  '--grain-panel-opacity':   '0.04',   // panel
  '--grain-wing-opacity':    '0.08',   // wing (unchanged)
  '--grain-control-opacity': '0.02',   // control
  '--grain-display-opacity': '0.01',   // display
  '--grain-base-opacity':    '0.20',   // base (unchanged)
};

// ── Ratio garden palette — generated, the murasaki→hanada dye arc ──
//
// The RatioGarden colors EACH ratio by its HEIGHT in the scale (low→high,
// t=0..1, supplied by the data contract's ascending order) AND by its integer
// RANK (`index`) in that order. One generated family, anchored to the brand
// purple, sweeping through the cool natural-dye world as the ratio climbs —
// the same OKLCH recipe that makes every other Petals color. No hardcoded hex.
//
// THE GOAL: each ratio (up to 8 mapped at once) must read as a DISTINCT color
// from its neighbors at a glance — these exact colors paint the garden dots,
// the sequencer ratio-lane bars, and the oscillator drag dot, all at small
// sizes. Distinctness from a chroma-only fade is too weak at dot scale, so the
// recipe separates neighbors on THREE axes at once:
//   • HUE — a 54° arc, murasaki h293 (unison, the brand purple line) →
//     hanada plant-indigo h239 (highest). A controlled sweep through the cool
//     dye world (murasaki → hanada), never reaching teal/green. Each step is
//     its own hue, yet the whole set reads as one family orbiting the purple.
//   • CHROMA — full+vivid at unison (C 0.150 NS), easing to a softer-but-still
//     saturated indigo up high (C 0.095). The garden is the focal dye, not a
//     quiet header tint — it stays luminous, it does not drain to neutral.
//   • LIGHTNESS — a monotone lift (faded-high ratios stay legible) PLUS a
//     ±zig SAWTOOTH keyed to the rank parity. Adjacent ranks land on opposite
//     L phases, so even where two hues are close the dots separate on
//     lightness. The sawtooth is what makes neighbors pop at 2px.
//
// Measured (culori ΔE2000, every scale size N=3..20): worst-case min neighbor
// ΔE ≈ 8.8 NS / 9.0 KI (well above the ~5 "obvious at a glance" line); all
// colors in-gamut; distance from the #7868D4 anchor stays ≤29.5 NS / 19.5 KI
// (a purple→indigo span — in total brand harmony, no foreign hue).
//
// ease = t^0.92 keeps the arc near-linear so the per-step hue gaps stay even.
// Karakami runs the deepened (inverted) L axis like every other dye, so the
// dyes read as ink on cream. lBase rides the SIGNAL anchor — move NS_SIGNAL /
// KI_SIGNAL and the whole ratio family tracks, in balance, like every dye.
const RATIO_HUE_START = 293;   // murasaki — the brand purple line (unison)
const RATIO_HUE_SPAN  = 54;    // arc toward hanada plant-indigo (h239) up high

const NS_RATIO = {
  cPeak: 0.150, cFloor: 0.095,  // chroma: rich purple at unison → saturated indigo up high
  lBase: NS_SIGNAL - 0.060, lLift: 0.140,  // rides the signal level; lifts as the ratio climbs
  zig: 0.060,                              // ±L sawtooth by rank parity — pops neighbors at dot scale
  dimDrop: 0.150, dimCRatio: 0.55,         // unselected petals: darker, less chroma
};
const KI_RATIO = {
  cPeak: 0.140, cFloor: 0.090,
  lBase: KI_SIGNAL + 0.010, lLift: 0.100,  // rides the signal level — deepened axis on cream
  zig: 0.050,
  dimDrop: 0.120, dimCRatio: 0.55,
};

/**
 * Generate one ratio color from its height + rank in the scale.
 *
 * CONSUMER API — the per-ratio color authority. The garden dots, the seq
 * ratio-lane bars, and the osc drag dot all read their color from here, keyed
 * to a ratio's height. Call with the ratio's ascending-rank `index` and its
 * normalized height `t = index / (count - 1)`. Same (t, index) → same color,
 * so a ratio keeps its color across every surface and across a scale rebuild.
 *
 * @param {number} t          0 = lowest/unison ratio, 1 = highest ratio
 * @param {string} themeName  'nightshade' | 'kinari'
 * @param {number} [index=0]  integer rank in ascending order (drives the L sawtooth)
 * @returns {{ bright: string, dim: string }} hex pair (selected / idle)
 */
export function ratioColor(t, themeName, index = 0) {
  const spec = themeName === 'kinari' ? KI_RATIO : NS_RATIO;
  const clamped = Math.max(0, Math.min(1, t));
  const ease = Math.pow(clamped, 0.92);

  const h = RATIO_HUE_START - ease * RATIO_HUE_SPAN;
  const c = spec.cPeak - ease * (spec.cPeak - spec.cFloor);
  const zig = (index % 2 === 0) ? -spec.zig : spec.zig;
  const l = spec.lBase + ease * spec.lLift + zig;

  return {
    bright: oklchHex(l, c, h),
    dim: oklchHex(l - spec.dimDrop, c * spec.dimCRatio, h),
  };
}

// ── Theme registry ──

export const THEMES = [NIGHTSHADE, KINARI];

/**
 * Apply a theme to the DOM by setting CSS custom properties on :root.
 */
export function applyTheme(themeName) {
  const theme = THEMES.find(t => t.name === themeName) || THEMES[0];
  const root = document.documentElement;

  root.setAttribute('data-dir', theme.dir);

  for (const [prop, value] of Object.entries(theme)) {
    if (prop.startsWith('--')) {
      root.style.setProperty(prop, value);
    }
  }

  return theme;
}

/**
 * Cycle to the next theme.
 */
export function nextTheme(current) {
  const idx = THEMES.findIndex(t => t.name === current);
  return THEMES[(idx + 1) % THEMES.length].name;
}

/**
 * Get theme config by name.
 */
export function getThemeConfig(name) {
  return THEMES.find(t => t.name === name) || THEMES[0];
}
