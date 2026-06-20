// ════════════════════════════════════════════════════════════════════════
// TYPE SCALE — the relational model behind the --fs-* ladders
// ════════════════════════════════════════════════════════════════════════
//
// petals.fm runs THREE type ladders (see petals-tokens.css → Type). Each is
// a small, closed set of integer-px sizes read at a fixed distance. This
// module is the relational generator that REPRODUCES each ladder exactly,
// so the static --fs-* tokens and a relational scale model are one and the
// same set of numbers.
//
// ── UI scale (inside instruments) — panel distance ~45cm ──────────────────
// 10 / 9 / 8 / 7px. This is an ARITHMETIC ladder, not a geometric modular
// scale: adjacent steps differ by a constant 1px, NOT a constant ratio
// (8/7 = 1.143 but 10/9 = 1.111 — the ratios drift, the step does not). At a
// 7px floor and 3px of range, an arithmetic step is the honest model — every
// size lands on an integer px (no rounding, no sub-pixel hinting fuzz at the
// floor). Calibrated as:
//
//   fs(i) = UI_BASE + UI_STEP · i        UI_BASE = 7px, UI_STEP = 1px
//                                        i = 0 (label) .. 3 (header)
//
//   i=0  --fs-label      7px
//   i=1  --fs-secondary  8px
//   i=2  --fs-value      9px
//   i=3  --fs-header    10px
//
// Move UI_BASE (the floor) and the whole UI ladder shifts together; the gaps
// hold. One number re-pitches the instrument type.
//
// ── Brand scale (PETALS + tagline) — display ──────────────────────────────
// 32 / 20 / 10px. Named display anchors, not a stepped ladder (the hero,
// standard, and compact tiers are chosen for the mark lockup, not generated).
// Held as explicit anchors so the relational module covers the full system.
//
// ── Page scale (website body chrome) — desktop ~70cm ──────────────────────
// 15 / 12 / 11px. Likewise explicit anchors (strong / body / secondary).
//
// ── WEIGHT ────────────────────────────────────────────────────────────────
// Berkeley Mono ships one weight across every petals.fm surface: 400. There
// is exactly one weight token (--fw-normal: 400). It is here so weight is a
// named token, not a magic literal scattered through component CSS.
//
// ── ADDITIVE-ONLY (Phase 0) ───────────────────────────────────────────────
// This module REPRODUCES the current petals-tokens.css --fs-* values exactly.
// It is NOT yet wired into the live tokens — the static --fs-* tokens remain
// the authority. Wiring scale output into the live tokens is Phase 1.

// ── UI scale (instruments) ──
/** Floor of the instrument UI ladder — the single number it derives from. */
export const UI_BASE = 7;  // px (--fs-label)
/** Constant arithmetic step between adjacent UI sizes. */
export const UI_STEP = 1;  // px

/** UI ladder step indices → the live --fs-* token names. */
export const UI_STEPS = [
  { i: 0, token: '--fs-label' },
  { i: 1, token: '--fs-secondary' },
  { i: 2, token: '--fs-value' },
  { i: 3, token: '--fs-header' },
];

/**
 * One UI font size from its step index.
 * @param {number} i  0 = label (7px) .. 3 = header (10px)
 * @returns {number}  pixels (integer)
 */
export function uiSize(i) {
  return UI_BASE + UI_STEP * i;
}

// ── Brand scale (display anchors) ──
export const BRAND_SCALE = {
  '--fs-brand-hero':     32,
  '--fs-brand-standard': 20,
  '--fs-brand-compact':  10,
};

// ── Page scale (website chrome anchors) ──
export const PAGE_SCALE = {
  '--fs-page-strong':    15,
  '--fs-page-body':      12,
  '--fs-page-secondary': 11,
};

// ── Weight ──
/** The one Berkeley Mono weight used everywhere. */
export const FONT_WEIGHT_NORMAL = 400;

/**
 * The UI type ladder as a { '--fs-*': 'Npx' } map.
 * Calibrated to reproduce the current petals-tokens.css UI values EXACTLY:
 *   --fs-label:7px  --fs-secondary:8px  --fs-value:9px  --fs-header:10px
 * @returns {Record<string, string>}
 */
export function uiTypeLadder() {
  const ladder = {};
  for (const { i, token } of UI_STEPS) {
    ladder[token] = `${uiSize(i)}px`;
  }
  return ladder;
}

/**
 * The weight token map. Reproduces the single live weight (400).
 * @returns {Record<string, string>}
 */
export function weightTokens() {
  return { '--fw-normal': String(FONT_WEIGHT_NORMAL) };
}

// ════════════════════════════════════════════════════════════════════════
// SITE SCALE — the website type system (Phase 1a, build-time codegen source)
// ════════════════════════════════════════════════════════════════════════
//
// The website runs a SEPARATE, geometric type ladder from the instrument UI.
// Where the UI ladder is arithmetic (7..10px, +1px steps, read at 45cm), the
// site ladder is GEOMETRIC — a modular scale built from the harmonic-lock
// constants in the site spec: base 16px, ratio √φ = 1.272 (two type steps =
// one φ leap, so type breathes at the golden proportion at half resolution).
//
//   siteFontSize(i) = round( SITE_BASE · SITE_RATIO^i )    i = step from body
//
// Integer-snapped, this reproduces the spec §2 ladder EXACTLY:
//   caption 10 · label 13 · body 16 · lead 20 · h3 26 · h2 33 · h1 42 · display 53
//
// The site tokens are namespaced `--fs-site-*` so they NEVER collide with the
// instrument `--fs-*` tokens (notably the synth's --fs-label = 7px). gen-scale-
// tokens.mjs emits the generated block; this module is its source of truth.

/** Base of the site type ladder — `body` sits here. */
export const SITE_BASE = 16;   // px (--fs-site-body)
/** Modular-scale ratio: √φ. Two type steps == one golden (φ) leap. */
export const SITE_RATIO = 1.272;

// Step index is measured from `body` (i = 0). Negative = smaller than body.
// `hero` is a fluid clamp, not a fixed step — it is held as an explicit anchor.
export const SITE_TYPE_STEPS = [
  { token: '--fs-site-caption', i: -2 },
  { token: '--fs-site-label',   i: -1 },
  { token: '--fs-site-body',    i:  0 },
  { token: '--fs-site-lead',    i:  1 },
  { token: '--fs-site-h3',      i:  2 },
  { token: '--fs-site-h2',      i:  3 },
  { token: '--fs-site-h1',      i:  4 },
  { token: '--fs-site-display', i:  5 },
];

/** Fluid hero anchor — the one big moment. Not on the stepped ladder. */
export const SITE_HERO_CLAMP = 'clamp(42px, 8vw, 68px)';

/**
 * One site font size from its step index, integer-snapped.
 * @param {number} i  step from body (0 = body = 16px)
 * @returns {number}  pixels (integer)
 */
export function siteFontSize(i) {
  return Math.round(SITE_BASE * Math.pow(SITE_RATIO, i));
}

/**
 * Line-height per site tier — relational, tightens as size grows (optical law).
 * Keyed by the bare tier name (no `--fs-site-` prefix). Emitted as `--lh-site-*`.
 */
export const SITE_LINE_HEIGHT = {
  caption: '1.6',
  label:   '1.6',
  body:    '1.6',
  lead:    '1.6',
  h3:      '1.25',
  h2:      '1.25',
  h1:      '1.12',
  display: '1.12',
  hero:    '1.0',
};

/**
 * Letter-spacing per site tier — relational curve, tighter as size grows.
 * Emitted as `--ls-site-*`. (The PETALS wordmark keeps its own lockup tracking,
 * NOT on this curve — those are the existing --ls-brand-* / --ls-lockup tokens.)
 */
export const SITE_LETTER_SPACING = {
  hero:    '-0.02em',
  display: '-0.02em',
  h1:      '-0.01em',
  h2:      '-0.01em',
  h3:      '0',
  lead:    '0',
  body:    '0',
  label:   '0.12em',   // wide-tracked UPPERCASE technical label — pure Petals
  caption: '0.04em',
};

/**
 * Site weight tokens (variable Berkeley Mono) — three weights max.
 * Emitted as `--fw-*`. These are NEW names; the synth's --fw-normal is untouched.
 */
export const SITE_WEIGHTS = {
  '--fw-body':    400,
  '--fw-label':   500,
  '--fw-heading': 600,
  '--fw-display': 700,
};

/**
 * The site type ladder as a { '--fs-site-*': value } map.
 * Stepped tiers are integer px; `hero` is the fluid clamp anchor.
 * @returns {Record<string, string>}
 */
export function typeScale() {
  const ladder = {};
  for (const { token, i } of SITE_TYPE_STEPS) {
    ladder[token] = `${siteFontSize(i)}px`;
  }
  ladder['--fs-site-hero'] = SITE_HERO_CLAMP;
  return ladder;
}
