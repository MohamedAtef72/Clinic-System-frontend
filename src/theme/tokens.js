/**
 * Shared design tokens for the Clinic System UI.
 * Single source of truth — import these instead of declaring per-file constants.
 */

// ── Brand palette ────────────────────────────────────────────────────────────
export const GOLD       = "#b8972a";
export const GOLD_DARK  = "#96791e";
export const GOLD_LIGHT = "#f5edcc";
export const GOLD_BG    = "#fdf8ec";

// ── Text ─────────────────────────────────────────────────────────────────────
export const TEXT_DARK  = "#1a1a2e";
export const TEXT_MID   = "#4a4a6a";

// ── Navbar ───────────────────────────────────────────────────────────────────
export const NAV_BG         = "rgba(255,255,255,0.97)";
export const NAV_BG_SCROLLED = "#ffffff";

// ── Surfaces ─────────────────────────────────────────────────────────────────
export const PAGE_BG   = "#f9f8f5";
export const CARD_BG   = "#ffffff";
export const INPUT_BG  = "#fafafa";

// ── Borders ──────────────────────────────────────────────────────────────────
/** Standard gold-tinted border (e.g. cards, inputs on hover) */
export const BORDER_GOLD       = "rgba(184,151,42,0.25)";
/** Faint gold border (e.g. section dividers, panels) */
export const BORDER_GOLD_FAINT = "rgba(184,151,42,0.15)";

// ── Status colours ───────────────────────────────────────────────────────────
export const SUCCESS = "#22c55e";
export const ERROR   = "#ef4444";
export const WARNING = "#f59e0b";

// ── Shadows ──────────────────────────────────────────────────────────────────
export const SHADOW_SM = "0 4px 20px rgba(0,0,0,0.04)";
export const SHADOW_MD = "0 8px 30px rgba(0,0,0,0.08)";
export const SHADOW_LG = "0 20px 60px rgba(0,0,0,0.12)";

// ── Border-radius multipliers (MUI spacing units) ─────────────────────────────
/** Use as: sx={{ borderRadius: RADIUS_SM }} */
export const RADIUS_SM = 2;
export const RADIUS_MD = 3;
export const RADIUS_LG = 4;

