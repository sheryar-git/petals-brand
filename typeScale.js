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
