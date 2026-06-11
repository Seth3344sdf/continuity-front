/* ====================================================================
   TSL config — backend service URLs + LIVE/DEMO auto-detection.
   The real verification ALWAYS runs in-browser via window.TSLWebVerifier
   (the esbuild bundle). LIVE mode additionally consults the services
   below; if they are unreachable we fall back to DEMO FIXTURES.
   ==================================================================== */
window.TSL = window.TSL || {};
(function (T) {
  'use strict';
  T.config = {
    // one small config object — point these at your running services
    resolverBase:  'http://localhost:8082',   // resolver-node   GET /v1/identity/:trustId, /v1/revocation/:trustId
    verifierBase:  'http://localhost:8083',    // verifier-api    POST /v1/verify
    scoringBase:   'http://localhost:8084',    // scoring-provider GET /v1/assessments/v2/:assessmentId
    healthTimeoutMs: 1200
  };
  // mode: 'live' once a backend responds, else 'demo'. Starts unknown.
  T.mode = 'demo';

  function ping(url) {
    return new Promise(function (resolve) {
      var ctrl = new AbortController(); var t = setTimeout(function () { ctrl.abort(); }, T.config.healthTimeoutMs);
      fetch(url, { signal: ctrl.signal, mode: 'cors' })
        .then(function (r) { clearTimeout(t); resolve(r.ok || r.status === 404 || r.status === 405); })
        .catch(function () { clearTimeout(t); resolve(false); });
    });
  }
  // probe the verifier-api; reachable → LIVE. Always resolves; never blocks the UI.
  T.detectMode = function () {
    return ping(T.config.verifierBase + '/health')
      .then(function (ok) { return ok ? ping(T.config.resolverBase + '/health').then(function (o2) { return ok || o2; }) : false; })
      .catch(function () { return false; })
      .then(function (live) { T.mode = live ? 'live' : 'demo'; return T.mode; });
  };
})(window.TSL);
