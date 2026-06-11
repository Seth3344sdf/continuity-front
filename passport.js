/* ====================================================================
   TSL web-verifier — app styles. Warm editorial / paper instrument.
   ==================================================================== */
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:var(--bg);color:var(--text);font-family:var(--font-body);font-size:var(--fs-body);-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;line-height:1.58}
body{min-height:100vh;background:
  radial-gradient(1100px 560px at 82% -10%, rgba(199,91,57,0.07), transparent 62%),
  radial-gradient(820px 480px at 4% 104%, rgba(62,142,90,0.06), transparent 60%),
  var(--bg)}
a{color:inherit;text-decoration:none}
code,.mono{font-family:var(--font-mono)}
.muted{color:var(--muted)} .faint{color:var(--faint)}
::selection{background:rgba(199,91,57,0.20)}
h1,h2,h3{font-family:var(--font-display);font-weight:560;font-optical-sizing:auto}

/* ---------- shell ---------- */
.shell{max-width:1020px;margin:0 auto;padding:0 26px}
.topbar{display:flex;align-items:center;gap:18px;height:70px;border-bottom:1px solid var(--hairline);position:sticky;top:0;z-index:30;
  background:linear-gradient(180deg, rgba(244,236,223,0.94), rgba(244,236,223,0.74));backdrop-filter:blur(12px) saturate(1.1)}
.brand{display:flex;align-items:center;gap:11px;font-family:var(--font-display);font-weight:600;letter-spacing:-0.01em;font-size:18px}
.brand .mark{width:26px;height:26px;border-radius:7px;position:relative;background:
  radial-gradient(120% 120% at 30% 20%, #E08A5A, var(--accent));box-shadow:inset 0 1px 0 rgba(255,255,255,0.4), var(--shadow-sm)}
.brand .mark::before,.brand .mark::after{content:"";position:absolute;width:7px;height:7px;border:1.5px solid rgba(255,250,244,0.85)}
.brand .mark::before{top:4px;left:4px;border-right:none;border-bottom:none}
.brand .mark::after{bottom:4px;right:4px;border-left:none;border-top:none}
.brand small{color:var(--faint);font-family:var(--font-mono);font-weight:400;font-size:10.5px;letter-spacing:.14em;text-transform:uppercase}
nav.tabs{display:flex;gap:2px;margin-left:8px}
nav.tabs a{padding:8px 14px;border-radius:9px;color:var(--muted);font-size:14.5px;transition:color var(--t-fast),background var(--t-fast);position:relative}
nav.tabs a:hover{color:var(--text);background:rgba(45,33,24,0.045)}
nav.tabs a.on{color:var(--accent-deep)}
nav.tabs a.on::after{content:"";position:absolute;left:14px;right:14px;bottom:3px;height:2px;background:var(--accent);border-radius:2px}
.spacer{flex:1}

/* mode badge LIVE / DEMO FIXTURES */
.modebadge{display:flex;align-items:center;gap:7px;font-family:var(--font-mono);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;
  padding:6px 12px;border-radius:var(--r-pill);border:1px solid var(--hairline-strong);color:var(--muted);background:var(--surface)}
.modebadge .led{width:7px;height:7px;border-radius:50%;background:var(--faint)}
.modebadge.live{color:var(--trust);border-color:rgba(62,142,90,0.4);background:var(--trust-soft)} .modebadge.live .led{background:var(--trust);animation:pulse 2s infinite}
.modebadge.demo{color:var(--accent-deep);border-color:rgba(199,91,57,0.32);background:var(--accent-soft)} .modebadge.demo .led{background:var(--accent)}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}

/* ---------- view container ---------- */
main{padding:46px 0 84px}
.view-in{animation:viewIn .44s var(--ease)}
@keyframes viewIn{from{opacity:0;transform:translateY(9px)}to{opacity:1;transform:none}}
.hero-h{font-family:var(--font-display);font-size:var(--fs-display);font-weight:560;letter-spacing:-0.018em;line-height:1.04}
@media(max-width:620px){.hero-h{font-size:34px}}
.lede{color:var(--muted);font-size:17px;line-height:1.6;max-width:60ch;margin-top:14px}
.lede code,.hero-h code{font-family:var(--font-mono);font-size:0.88em;background:var(--surface-2);padding:1px 6px;border-radius:6px}

/* ---------- cards ---------- */
.card{background:var(--surface);border:1px solid var(--hairline);border-radius:var(--r-card);padding:24px;position:relative;box-shadow:var(--shadow-card)}
.card+.card{margin-top:18px}
.card h2{font-size:var(--fs-h2);font-weight:560;letter-spacing:-0.01em}
.card--bracket::before,.card--bracket::after{content:"";position:absolute;width:14px;height:14px;border:1.5px solid var(--accent);opacity:.5;pointer-events:none}
.card--bracket::before{top:12px;left:12px;border-right:none;border-bottom:none;border-radius:3px 0 0 0}
.card--bracket::after{bottom:12px;right:12px;border-left:none;border-top:none;border-radius:0 0 3px 0}
/* tinted band cards */
.card.band-risk,.card.band-revoked_or_compromised,.card.band-high_risk,.card.band-cryptographic_failure{border-color:rgba(194,65,45,0.32);background:linear-gradient(180deg,var(--risk-soft),var(--surface) 70%)}
.card.band-trusted,.card.band-likely_trusted{border-color:rgba(62,142,90,0.3);background:linear-gradient(180deg,var(--trust-soft),var(--surface) 72%)}
.card.band-caution{border-color:rgba(190,130,42,0.32);background:linear-gradient(180deg,var(--caution-soft),var(--surface) 72%)}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:18px}
@media(max-width:760px){.grid2{grid-template-columns:1fr}.shell{padding:0 18px}nav.tabs a{padding:8px 10px}}

/* ---------- inputs / buttons ---------- */
textarea,input[type=text]{width:100%;background:#FFFDF9;border:1px solid var(--hairline-strong);border-radius:var(--r-input);color:var(--text);
  font-family:var(--font-mono);font-size:13px;padding:13px 14px;resize:vertical;transition:border var(--t-fast),box-shadow var(--t-fast)}
textarea::placeholder,input::placeholder{color:var(--faint)}
textarea:focus,input:focus{outline:none;border-color:var(--accent);box-shadow:var(--ring-focus)}
textarea{min-height:118px;line-height:1.55}
.btn{display:inline-flex;align-items:center;gap:8px;font-family:var(--font-body);font-size:14.5px;font-weight:600;cursor:pointer;
  padding:11px 19px;border-radius:var(--r-input);border:1px solid transparent;background:var(--accent);color:#FFF6EF;
  box-shadow:var(--shadow-sm);transition:transform var(--t-fast),background var(--t-fast),box-shadow var(--t-fast)}
.btn:hover{background:var(--accent-deep);box-shadow:var(--shadow-card)}
.btn:active{transform:translateY(1px)}
.btn--secondary{background:var(--surface);border-color:var(--hairline-strong);color:var(--text);box-shadow:var(--shadow-sm)}
.btn--secondary:hover{background:var(--surface-2);border-color:var(--accent);color:var(--accent-deep)}
.btn--danger{background:var(--risk);color:#FFF3F0}
.btn--danger:hover{background:#A4341F}
.btn--sm{padding:7px 13px;font-size:13px}
.btn[disabled]{opacity:.5;cursor:not-allowed}
.btnrow{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px;align-items:center}

/* chips */
.chips{display:flex;flex-wrap:wrap;gap:9px;margin-top:16px}
.chip{font-family:var(--font-body);font-size:13.5px;font-weight:500;padding:9px 15px;border-radius:var(--r-pill);border:1px solid var(--hairline-strong);color:var(--text);cursor:pointer;
  background:var(--surface);box-shadow:var(--shadow-sm);transition:all var(--t-fast)}
.chip:hover{border-color:var(--accent);color:var(--accent-deep);transform:translateY(-1px);box-shadow:var(--shadow-card)}
.chip .led{display:inline-block;width:6px;height:6px;border-radius:50%;margin-right:8px;vertical-align:middle;background:var(--trust)}
.chip.bad .led{background:var(--risk)}

/* ---------- hero verdict ---------- */
.verdict{display:flex;gap:30px;align-items:center}
@media(max-width:620px){.verdict{flex-direction:column;text-align:center;gap:18px}}
.verdict__body{flex:1;min-width:0}
.verdict__head{font-family:var(--font-display);font-size:25px;font-weight:560;letter-spacing:-0.012em;line-height:1.18}
.band-trusted .verdict__head,.band-likely_trusted .verdict__head{color:#2F6F47}
.verdict.band-risk .verdict__head{color:var(--accent-deep)}
.card.band-risk .verdict__head,.card.band-revoked_or_compromised .verdict__head{color:#9A3320}
.verdict__sub{color:var(--muted);margin-top:9px;font-size:15.5px;line-height:1.55}

/* ring */
.ring-wrap{position:relative;display:grid;place-items:center;flex:none}
.ring-wrap svg{transform:rotate(-90deg)}
.ring-num{position:absolute;inset:0;display:grid;place-items:center;text-align:center;font-family:var(--font-display)}
.ring-num b{font-size:var(--rs,34px);font-weight:560;color:var(--band);line-height:1}
.ring-num span{display:block;font-family:var(--font-mono);font-size:10.5px;color:var(--faint);margin-top:3px;letter-spacing:.04em}

/* band tag */
.band-tag{display:inline-flex;align-items:center;gap:7px;font-family:var(--font-mono);font-size:11.5px;letter-spacing:.02em;
  padding:5px 12px;border-radius:var(--r-pill);border:1px solid color-mix(in srgb,var(--band) 38%, transparent);color:color-mix(in srgb,var(--band) 78%, #2b1d12);background:color-mix(in srgb,var(--band) 13%, var(--surface))}
.band-tag .led{width:7px;height:7px;border-radius:50%;background:var(--band)}
.avatar{display:inline-block;border-radius:50%;background:color-mix(in srgb,var(--band) 26%, var(--surface));border:1.5px solid var(--band);vertical-align:middle}

/* ---------- check rows ---------- */
.checks{margin-top:10px}
.check{display:flex;align-items:center;gap:13px;padding:12px 2px;border-bottom:1px solid var(--hairline);font-size:14.5px}
.check:last-child{border-bottom:none}
.check .ck{width:9px;height:9px;border-radius:50%;flex:none;background:var(--faint);transition:background var(--t-med)}
.check .ctx{flex:1}
.check .cmark{font-family:var(--font-mono);font-size:13px;color:var(--faint)}
.check.pass .ck{background:var(--trust)} .check.pass .cmark{color:var(--trust)}
.check.fail .ck{background:var(--risk)} .check.fail .cmark{color:var(--risk)} .check.fail .ctx{color:#9A3320}
.check.pending-ok .ck,.check.pending-no .ck{animation:blink 1s infinite}
@keyframes blink{50%{opacity:.3}}

/* ---------- intercept strip ---------- */
.intercept{margin-top:18px;border:1px solid rgba(194,65,45,0.3);border-radius:13px;padding:16px 17px;background:var(--risk-soft);position:relative;overflow:hidden}
.intercept.contained{border-color:rgba(62,142,90,0.34);background:var(--trust-soft)}
.instep{display:flex;align-items:baseline;gap:13px;padding:6px 0;opacity:0;transform:translateX(-8px);transition:opacity .35s var(--ease),transform .35s var(--ease)}
.instep.on{opacity:1;transform:none}
.instep.pulse .led{animation:ledpulse .46s var(--ease)}
@keyframes ledpulse{0%{transform:scale(1)}40%{transform:scale(1.8)}100%{transform:scale(1)}}
.instep .k{display:flex;align-items:center;gap:8px;font-family:var(--font-mono);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--risk);width:132px;flex:none}
.instep .k .led{width:7px;height:7px;border-radius:50%;background:var(--risk)}
.instep .t{color:var(--text);font-size:14px}
.intercept__tag{margin-top:11px;display:inline-flex;align-items:center;gap:8px;font-family:var(--font-mono);font-size:10.5px;letter-spacing:.1em;
  text-transform:uppercase;color:#2F6F47;opacity:0;transform:translateY(4px);transition:all .4s var(--ease)}
.intercept__tag.show{opacity:1;transform:none}
.intercept__tag .led{width:7px;height:7px;border-radius:50%;background:var(--trust)}

/* ---------- continuity thread ---------- */
.thread{width:100%}
.thread svg{width:100%;display:block}
.thread .seg{stroke:var(--accent);stroke-width:2.5;stroke-linecap:round}
.thread .seg.draw{stroke-dasharray:var(--len);stroke-dashoffset:var(--len);animation:draw .9s var(--ease) forwards}
@keyframes draw{to{stroke-dashoffset:0}}

/* mini graph */
.minigraph{display:flex;align-items:center;gap:18px;margin-top:10px}
.minigraph svg{flex:none}
.minigraph .cap{color:var(--muted);font-size:14px;line-height:1.5}

/* copy field */
.copyfield{display:flex;align-items:center;gap:10px;background:#FFFDF9;border:1px solid var(--hairline-strong);border-radius:var(--r-input);padding:8px 10px;margin-top:10px}
.copyfield code{flex:1;font-size:12px;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

/* key/value list */
.kv{display:grid;grid-template-columns:auto 1fr;gap:9px 18px;font-size:14px;margin-top:8px}
.kv dt{color:var(--faint);font-family:var(--font-mono);font-size:11.5px;padding-top:2px}
.kv dd{color:var(--text);word-break:break-word}
.codeblk{font-family:var(--font-mono);font-size:11.5px;color:var(--muted);background:#FBF4EA;border:1px solid var(--hairline);border-radius:10px;padding:13px;white-space:pre-wrap;word-break:break-word;max-height:240px;overflow:auto;margin-top:11px}

.reasons{margin-top:14px;display:flex;flex-direction:column;gap:9px}
.reason{display:flex;gap:11px;align-items:flex-start;font-size:14px;color:var(--muted)}
.reason .d{margin-top:7px;width:6px;height:6px;border-radius:50%;flex:none;background:var(--caution)}
.reason.good .d{background:var(--trust)}

/* eyebrow / dividers */
.eyebrow{font-family:var(--font-mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--accent-deep)}
.divider{height:1px;background:var(--hairline);margin:20px 0}

/* ---------- toast / modal ---------- */
#toasts{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;gap:8px;z-index:80;align-items:center}
.toast{display:flex;align-items:center;gap:9px;background:var(--text);color:#F6EEE2;border-radius:var(--r-pill);
  padding:11px 18px;font-size:13.5px;box-shadow:var(--shadow-lift);animation:toastIn .26s var(--ease)}
.toast.out{animation:toastOut .22s var(--ease) forwards}
.toast .dot{width:7px;height:7px;border-radius:50%;background:#E8A06A}
@keyframes toastIn{from{opacity:0;transform:translateY(8px)}}
@keyframes toastOut{to{opacity:0;transform:translateY(8px)}}
.scrim{position:fixed;inset:0;background:rgba(45,33,24,0.42);backdrop-filter:blur(3px);z-index:70;display:grid;place-items:center;padding:20px;animation:fade .2s var(--ease)}
@keyframes fade{from{opacity:0}}
.modal{background:var(--surface);border:1px solid var(--hairline-strong);border-radius:var(--r-card);
  padding:26px;max-width:480px;width:100%;box-shadow:var(--shadow-lift);animation:modalIn .26s var(--ease)}
@keyframes modalIn{from{opacity:0;transform:translateY(10px) scale(.98)}}
.modal h2{margin-bottom:10px;font-family:var(--font-display)} .modal p{color:var(--muted);font-size:14.5px}
.modal__row{display:flex;gap:10px;justify-content:flex-end;margin-top:22px}

/* ---------- footer ---------- */
footer.foot{border-top:1px solid var(--hairline);padding:26px;text-align:center;color:var(--faint);font-size:12.5px}
footer.foot .warn{color:var(--accent-deep);font-family:var(--font-mono);letter-spacing:.04em;font-size:11px}
footer.foot a{color:var(--muted);text-decoration:underline;text-underline-offset:2px}
footer.foot code{font-family:var(--font-mono)}

/* network canvas */
.graphwrap{position:relative;border:1px solid var(--hairline);border-radius:var(--r-card);overflow:hidden;background:#FBF4E9;box-shadow:var(--shadow-sm)}
.graphwrap canvas{display:block;width:100%}
.graph-hud{position:absolute;top:13px;left:14px;font-family:var(--font-mono);font-size:10.5px;letter-spacing:.06em;color:var(--faint);pointer-events:none}
.legend{display:flex;gap:16px;flex-wrap:wrap;margin-top:14px;font-size:13px;color:var(--muted)}
.legend span{display:inline-flex;align-items:center;gap:7px}
.legend i{width:9px;height:9px;border-radius:50%;display:inline-block}

/* spinner */
.spin{width:15px;height:15px;border:2px solid rgba(45,33,24,0.15);border-top-color:var(--accent);border-radius:50%;animation:sp .7s linear infinite;display:inline-block;vertical-align:middle}
@keyframes sp{to{transform:rotate(360deg)}}

@media(prefers-reduced-motion:reduce){*{animation-duration:.001ms!important;transition-duration:.001ms!important}}
