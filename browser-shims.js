<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>TSL — Trust Signature Layer</title>
<meta name="description" content="Verify any TSL proof with real cryptography, in your browser. No faked checkmarks.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Spline+Sans+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/tokens.css">
<link rel="stylesheet" href="/css/app.css">
<!-- the verifyTSL bundle reads process.env.* (mainnet fixture guards). Shim it for the browser. -->
<script>window.process = window.process || { env: {} };</script>
</head>
<body>
  <header class="topbar">
    <div class="shell" style="display:flex;align-items:center;gap:18px;width:100%">
      <a class="brand" href="#/verify">
        <span class="mark"></span>
        <span>TSL <small>Trust Signature Layer</small></span>
      </a>
      <nav class="tabs">
        <a data-nav="verify"   href="#/verify">Verify</a>
        <a data-nav="network"  href="#/network">Network</a>
        <a data-nav="passport" href="#/passport">Passport</a>
        <a data-nav="agents"   href="#/agents">Agents</a>
      </nav>
      <span class="spacer"></span>
      <span id="modebadge" class="modebadge demo" title="Real cryptographic verification runs in your browser.">
        <span class="led"></span><span class="t">checking…</span>
      </span>
    </div>
  </header>

  <main>
    <div class="shell">
      <div id="view"></div>
    </div>
  </main>

  <footer class="foot">
    <div class="shell">
      <div class="warn">DEV PREVIEW — not production, not audited.</div>
      <div style="margin-top:8px">
        Every verification on this page is performed by the real <code>verifyTSL</code> engine, compiled to run in your browser.
        No checkmark is faked. &nbsp;·&nbsp; <a href="#/verify">Verify a proof</a>
      </div>
    </div>
  </footer>

  <div id="toasts"></div>

  <!-- the REAL verifier (esbuild bundle of verifyTSL) -->
  <script type="module" src="/verifier.bundle.js"></script>

  <!-- app (classic scripts, build on window.TSL) -->
  <script src="/js/config.js"></script>
  <script src="/js/lexicon.js"></script>
  <script src="/js/components.js"></script>
  <script src="/js/fixtures.js"></script>
  <script src="/js/verify-core.js"></script>
  <script src="/js/graph.js"></script>
  <script src="/js/router.js"></script>
  <script src="/js/views/verify.js"></script>
  <script src="/js/views/proof.js"></script>
  <script src="/js/views/passport.js"></script>
  <script src="/js/views/network.js"></script>
  <script src="/js/views/agents.js"></script>
  <script src="/js/app.js"></script>
</body>
</html>
