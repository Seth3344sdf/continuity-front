/* ====================================================================
   TSL boot — wait for the real verifier bundle, detect LIVE/DEMO,
   set the mode badge, start the router.
   ==================================================================== */
(function (T) {
  'use strict';

  function setBadge(mode) {
    var b = document.getElementById('modebadge'); if (!b) return;
    b.classList.remove('live', 'demo');
    if (mode === 'live') { b.classList.add('live'); b.querySelector('.t').textContent = 'LIVE'; b.title = 'Backend services reachable. Verification still runs in your browser; results are cross-checked against the live verifier-api.'; }
    else { b.classList.add('demo'); b.querySelector('.t').textContent = 'DEMO FIXTURES'; b.title = 'No backend detected. Real cryptographic verification runs in your browser against bundled fixtures.'; }
  }

  function waitForVerifier(cb) {
    if (T.verifierReady()) return cb(true);
    var tries = 0;
    var iv = setInterval(function () {
      if (T.verifierReady()) { clearInterval(iv); cb(true); }
      else if (++tries > 120) { clearInterval(iv); cb(false); } // ~6s
    }, 50);
  }

  // a clean shared link lands at /p/<payload> (server-routed to index.html).
  // convert it to the hash route the SPA understands, before first render.
  function bridgePathProof() {
    var m = location.pathname.indexOf('/p/');
    if (m !== -1 && !location.hash) {
      var payload = location.pathname.slice(m + 3);
      if (payload) { try { history.replaceState(null, '', '/'); } catch (e) {} location.hash = '#/p/' + payload; }
    }
  }

  function boot() {
    bridgePathProof();
    waitForVerifier(function (ok) {
      T.verifierLoaded = ok;
      if (!ok) console.warn('TSL: verifier.bundle.js did not expose window.TSLWebVerifier');
      T.start(); // render immediately; verification chips/inputs will report if unready
      // detect backend in the background; update badge when known
      setBadge('demo');
      T.detectMode().then(function (mode) { setBadge(mode); }).catch(function () { setBadge('demo'); });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window.TSL);
