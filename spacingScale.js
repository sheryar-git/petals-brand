// ════════════════════════════════════════════════════════════════════════
// SPACING SCALE — the relational model behind the --sp-* ladder
// ════════════════════════════════════════════════════════════════════════
//
// petals.fm spacing is a 5px grid: every gap, margin, and padding is a
// multiple of 5. The ladder in petals-tokens.css —
//
//   --sp-1   5px      --sp-4  20px
//   --sp-2  10px      --sp-5  25px
//   --sp-3  15px      --sp-6  30px
//
// is a pure LINEAR scale: one unit (5px) multiplied by the step index.
//
//   sp(n) = UNIT · n        UNIT = 5px,  n = 1..6
//
// This is the whole model. One number — UNIT — defines the grid; the ladder
// is its integer multiples. Move UNIT and the grid re-pitches in balance.
//
// ── ADDITIVE-ONLY (Phase 0) ──────────────────────────────────────────────
// This module REPRODUCES the current --sp-* values exactly. It is NOT yet
// wired into petals-tokens.css — the static --sp-* tokens remain the live
// authority. This file proves the relational model matches today's grid.
// Wiring the scale output into the live tokens is Phase 1.

/** The grid unit. The single number the whole spacing ladder derives from. */
export const SPACING_UNIT = 5; // px

/** Step indices that map 1:1 onto the live --sp-1 .. --sp-6 ladder. */
export const SPACING_STEPS = [1, 2, 3, 4, 5, 6];

/**
 * One spacing value from its step index.
 * @param {number} n  step index (1 = --sp-1 = 5px)
 * @returns {number}  pixels (integer on the 5px grid)
 */
export function space(n) {
  return SPACING_UNIT * n;
}

/**
 * The full ladder as a { '--sp-N': 'Npx' } map.
 * Calibrated to reproduce the current petals-tokens.css --sp-* values EXACTLY:
 *   --sp-1:5px  --sp-2:10px  --sp-3:15px  --sp-4:20px  --sp-5:25px  --sp-6:30px
 * @returns {Record<string, string>}
 */
export function spacingLadder() {
  const ladder = {};
  for (const n of SPACING_STEPS) {
    ladder[`--sp-${n}`] = `${space(n)}px`;
  }
  return ladder;
}

// ════════════════════════════════════════════════════════════════════════
// SITE SPACING — the website rhythm (Phase 1a, build-time codegen source)
// ════════════════════════════════════════════════════════════════════════
//
// The website breathes at φ, not on the synth's pure-linear 5px multiples.
// Its spacing is a FIBONACCI ladder on the 5px atom: each step is the next
// Fibonacci number × 5px, so adjacent steps grow at ≈φ (snapped to the grid).
//
//   Fibonacci [1,2,3,5,8,13,21] × 5  =  5,10,15,25,40,65,105
//
// Reproduces the spec §4 ladder EXACTLY. Namespaced `--sp-site-N` so it never
// collides with the synth's `--sp-1..6` (linear, 5..30px). Same 5px atom →
// the two systems lock; a Folium embed beside body copy shares the rhythm.

/** Fibonacci multipliers on the 5px atom — the site rhythm's source sequence. */
export const SITE_FIB = [1, 2, 3, 5, 8, 13, 21];

/**
 * One site spacing value from its step index (1-based).
 * @param {number} n  step (1 = --sp-site-1 = 5px)
 * @returns {number}  pixels (integer on the 5px grid)
 */
export function siteSpace(n) {
  return SITE_FIB[n - 1] * SPACING_UNIT;
}

/**
 * The site spacing ladder as a { '--sp-site-N': 'Npx' } map.
 * Reproduces the spec §4 values EXACTLY:
 *   5, 10, 15, 25, 40, 65, 105
 * @returns {Record<string, string>}
 */
export function spacingScale() {
  const ladder = {};
  for (let n = 1; n <= SITE_FIB.length; n++) {
    ladder[`--sp-site-${n}`] = `${siteSpace(n)}px`;
  }
  return ladder;
}
