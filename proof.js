/* ====================================================================
   TSL web-verifier — design tokens. Warm editorial / paper instrument.
   Cream canvas, warm ink, terracotta accent. Crafted, not clinical.
   ==================================================================== */
:root {
  /* surfaces — warm paper, cards lift slightly lighter */
  --bg:#F4ECDF;
  --surface:#FCF8F1; --surface-2:#F3E8D8; --surface-3:#EFE2CF;
  --hairline:rgba(45,33,24,0.10); --hairline-strong:rgba(45,33,24,0.16);

  /* ink */
  --text:#241D17; --muted:#6E6052; --faint:#A2917D;

  /* accent + signal colors (all warmed) */
  --accent:#C75B39; --accent-deep:#A8431F; --accent-soft:rgba(199,91,57,0.12);
  --trust:#3E8E5A; --trust-soft:rgba(62,142,90,0.12);
  --caution:#BE822A; --caution-soft:rgba(190,130,42,0.14);
  --risk:#C2412D; --risk-soft:rgba(194,65,45,0.12);

  /* type */
  --font-display:"Fraunces", Georgia, "Times New Roman", serif;
  --font-body:"Plus Jakarta Sans", system-ui, -apple-system, sans-serif;
  --font-mono:"Spline Sans Mono", "IBM Plex Mono", ui-monospace, Menlo, monospace;
  --fs-display:46px; --fs-h1:30px; --fs-h2:20px; --fs-body:15.5px; --fs-small:13.5px; --fs-micro:11.5px;

  --r-input:11px; --r-card:16px; --r-pill:999px;
  --ease:cubic-bezier(0.22,1,0.36,1); --t-fast:170ms; --t-med:240ms; --t-slow:340ms;

  /* warm, soft shadows instead of neon glows */
  --shadow-sm:0 1px 2px rgba(45,33,24,0.05);
  --shadow-card:0 1px 2px rgba(45,33,24,0.05), 0 10px 30px -16px rgba(45,33,24,0.30);
  --shadow-lift:0 2px 4px rgba(45,33,24,0.06), 0 20px 44px -20px rgba(45,33,24,0.34);
  --ring-focus:0 0 0 3px rgba(199,91,57,0.22);

  /* back-compat aliases (older refs) → warm accent so nothing breaks */
  --cyan:var(--accent); --cyan-dim:var(--accent-deep);
  --hairline-cyan:rgba(199,91,57,0.18);
  --glow-cyan:var(--ring-focus); --glow-soft:0 6px 20px -8px rgba(199,91,57,0.45);
}
/* trust-band → --band */
.band-trusted,.band-likely_trusted{--band:var(--trust)}
.band-medium_trust{--band:var(--accent)}
.band-unknown_caution,.band-insufficient_evidence,.band-unsettled_or_unproven,.band-settlement_missing,.band-delegation_missing{--band:var(--caution)}
.band-suspicious,.band-high_risk,.band-cryptographic_failure,.band-revoked_or_compromised{--band:var(--risk)}
.band-not_assessed{--band:var(--accent)}
