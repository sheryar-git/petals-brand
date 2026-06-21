// ════════════════════════════════════════════════════════════════════════
// brand-values.js — THE EMIT LAYER
// ════════════════════════════════════════════════════════════════════════
//
// This is the source NON-CSS surfaces import. CSS surfaces read petals-tokens.css
// (or call applyTheme); but emails, Netlify-function-generated HTML, and a Stripe
// checkout sheet can't read CSS variables — they need RESOLVED values: literal hex
// strings and px numbers, baked at send/render time.
//
// getBrandValues(surface) returns exactly those: a small, plain object of the
// values the post-sale touchpoints actually use (the audit's value list), not a
// dump of every token. Change a value here — or the token/theme it derives from —
// and re-deploy → every email and function-rendered page re-emits with it. One
// edit, every receipt.
//
//   import { getBrandValues } from '../../branding/tokens/brand-values.js';
//   const b = getBrandValues('transactional');
//   `<body style="background:${b.colors.bg};color:${b.colors.text}">`
//   `<h1 style="font-size:${b.type.heading}px">`
//
// ── SINGLE SOURCE, no duplicated hex ──
// 'nightshade' / 'kinari' colors are DERIVED from themeEngine.js (the OKLCH
// generator) — we do not re-type their hex here. 'transactional' is the cream
// receipt surface, which has no themeEngine representation; its values live in
// petals-tokens.css :root[data-surface="transactional"] and are mirrored here as
// the one literal palette (kept byte-identical to that CSS block by hand).
//
// The accent is the brand purple #7868D4 on EVERY surface — the one purple.
//
// Dependency: culori, via themeEngine.js (only for the derived themes). Resolves
// from the consumer's node_modules (the website / each instrument already ship it);
// Netlify bundles it into the function. 'transactional' needs no culori — and to
// keep it that way, themeEngine is imported LAZILY (dynamic import, only on the
// nightshade/kinari branch). So the transactional path stays synchronous and never
// drags culori; that's why getBrandValues() is sync and getThemedBrandValues() —
// the themed path — is async.

// ── The brand purple — the one accent, every surface. White reads on it. ──
const BRAND_ACCENT = '#7868D4';
const ACCENT_TEXT  = '#FFFFFF';

// ── Transactional (cream receipt) — the one literal palette. ──
// Mirrors petals-tokens.css :root[data-surface="transactional"]. No themeEngine
// source exists for cream; this is its home in JS. Keep in sync with the CSS block.
const TRANSACTIONAL_COLORS = {
  accent:     BRAND_ACCENT,
  accentText: ACCENT_TEXT,
  bg:         '#F4F2EE',   // cream paper
  surface:    '#FFFFFF',   // card lifted off the paper
  text:       '#2A2A2A',   // ink
  textDim:    '#7C7A88',   // secondary
  textMuted:  '#A8A6B0',   // quietest
  separator:  '#D4D2CC',   // hairline rule
};

/** Pull the eight receipt colors from a themeEngine theme (nightshade / kinari). */
async function colorsFromTheme(name) {
  // Lazy: only the themed surfaces pull themeEngine (and through it, culori).
  const { getThemeConfig } = await import('./themeEngine.js');
  const t = getThemeConfig(name);
  return {
    accent:     BRAND_ACCENT,         // the one purple — not the theme's dark/cream-tuned accent
    accentText: ACCENT_TEXT,          // white on purple, both surfaces
    bg:         t['--bg'],
    surface:    t['--surface'],
    text:       t['--text'],
    textDim:    t['--text-dim'],
    textMuted:  t['--text-muted'],
    separator:  t['--border'],        // the theme's hairline = its border
  };
}

// ── Type — email-relevant sizes in px (emails need literal px, not the UI ramp).
// Drawn from the brand display scale where it maps: heading = brand-compact (10),
// scaled up for email body legibility (email runs larger than 7px synth chrome —
// these are read on a phone at arm's length, not a 45cm panel). label = brand-
// compact 10px. One small ladder the touchpoints share.
const TYPE = {
  heading: 20,   // order title / receipt heading
  body:    14,   // line items, paragraph copy
  label:   10,   // section labels, fine print (= --fs-brand-compact)
};

/** Assemble the returned shape from a resolved color set. */
function pack(surface, colors) {
  return {
    surface,
    colors,
    // The petals mark renders in the accent (its stroke = the brand purple).
    mark: { color: colors.accent, strokeColor: colors.accent },
    type: { ...TYPE },
  };
}

/**
 * Resolved brand values for the TRANSACTIONAL (cream receipt) surface.
 * Synchronous: a literal palette, no themeEngine, no culori. This is the path
 * every live touchpoint uses (receipt emails, download page, success screen,
 * the Stripe sheet). For nightshade/kinari, use getThemedBrandValues().
 *
 * @param {'transactional'} [surface='transactional']
 * @returns {{
 *   surface: string,
 *   colors: { accent:string, accentText:string, bg:string, surface:string,
 *             text:string, textDim:string, textMuted:string, separator:string },
 *   mark:   { color:string, strokeColor:string },
 *   type:   { heading:number, body:number, label:number },
 * }}
 */
export function getBrandValues(surface = 'transactional') {
  if (surface !== 'transactional') {
    throw new Error(
      `getBrandValues('${surface}') is sync and transactional-only. ` +
      `For themed surfaces use: await getThemedBrandValues('${surface}').`,
    );
  }
  return pack(surface, { ...TRANSACTIONAL_COLORS });
}

/**
 * Resolved brand values for a THEMED surface (nightshade / kinari).
 * Async: lazily loads themeEngine (and culori) only when actually called, so
 * the transactional path stays culori-free.
 *
 * @param {'nightshade'|'kinari'} surface
 * @returns {Promise<ReturnType<typeof getBrandValues>>}
 */
export async function getThemedBrandValues(surface) {
  return pack(surface, await colorsFromTheme(surface));
}
