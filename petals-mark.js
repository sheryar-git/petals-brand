/*
 * petals-mark.js — the Petals mark
 *
 *      ╲  │  ╱
 *       ╲ │ ╱
 *  ─── ─── ─── ─── ─── ─── ───       Woven Star W-V.
 *       ╱ │ ╲                       Eight bars from center.
 *      ╱  │  ╲                      Visual edge = frame edge.
 *
 * Stroke weight steps down as size grows so rendered stroke stays
 * ~1.5px at any display size. Under 20px, the geometry shifts: butt
 * caps + wider center gap so the cross stays legible at micro sizes.
 *
 * One function. One file. Imported everywhere.
 *
 *   import { petalsMarkSVG } from './petals-mark.js';
 *
 *   // raw SVG string (innerHTML, brand assets)
 *   element.innerHTML = petalsMarkSVG(32);
 *   element.innerHTML = petalsMarkSVG(200, { color: '#ffffff' });
 *
 *   // React component → see PetalsMark.jsx
 *   <PetalsMark size={10} />
 */

/* ── Geometry
 * viewBox: 200×200, center 100,100.
 *
 * Large (>=20px) — woven interlock, round caps.
 *   horizontal:  full width, continuous
 *   verticals:   split at 76/124 (gap = 48 units)
 *   diagonals:   split at 83/117 (gap ≈ 48 units diagonal)
 *
 * Small (<20px) — simplified, butt caps, wider gap.
 *   verticals:   split at 66/134 (gap = 68)
 *   diagonals:   split at 73/127 (gap ≈ 76 diagonal)
 *   Keeps the center gap at 3+ rendered pixels even at 10px display.
 */

const PATHS_LARGE = [
  'M2 100H198',        // horizontal (continuous)
  'M100 2V76',         // vertical top
  'M100 124V198',      // vertical bottom
  'M31 31L83 83',      // diagonal top-left
  'M117 117L169 169',  // diagonal bottom-right
  'M169 31L117 83',    // diagonal top-right
  'M83 117L31 169',    // diagonal bottom-left
];

const PATHS_SMALL = [
  'M2 100H198',        // horizontal (continuous)
  'M100 2V66',         // vertical top — wider gap
  'M100 134V198',      // vertical bottom
  'M31 31L73 73',      // diagonal top-left — wider gap
  'M127 127L169 169',  // diagonal bottom-right
  'M169 31L127 73',    // diagonal top-right
  'M73 127L31 169',    // diagonal bottom-left
];

/**
 * Stroke width for a given display size (in 200x200 viewBox units).
 */
export function petalsMarkStroke(displayPx) {
  if (displayPx >= 200) return 4;
  if (displayPx >= 100) return 5;
  if (displayPx >= 60)  return 7;
  if (displayPx >= 40)  return 9;
  if (displayPx >= 28)  return 12;
  if (displayPx >= 20)  return 16;
  return 20;
}

/**
 * Whether to use simplified small-size geometry.
 */
function isSmall(displayPx) { return displayPx < 20; }

/**
 * The mark as an SVG string. For direct DOM insertion or asset generation.
 */
export function petalsMarkSVG(displayPx, opts = {}) {
  const color = opts.color || 'currentColor';
  const sw = petalsMarkStroke(displayPx);
  const small = isSmall(displayPx);
  const paths = small ? PATHS_SMALL : PATHS_LARGE;
  const cap = small ? 'butt' : 'round';

  return `<svg width="${displayPx}" height="${displayPx}" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">`
    + paths.map(d => `<path d="${d}" stroke="${color}" stroke-width="${sw}" stroke-linecap="${cap}"/>`).join('')
    + `</svg>`;
}

/**
 * Path data + stroke props for React components.
 */
export function petalsMarkPaths(displayPx, color = 'currentColor') {
  const sw = petalsMarkStroke(displayPx);
  const small = isSmall(displayPx);
  const paths = small ? PATHS_SMALL : PATHS_LARGE;
  const cap = small ? 'butt' : 'round';

  return paths.map((d, i) => ({
    key: `mark-${i}`,
    d,
    stroke: color,
    strokeWidth: sw,
    strokeLinecap: cap,
  }));
}
