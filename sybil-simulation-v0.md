/* ====================================================================
   TSL hash router — #/verify #/network #/passport #/agents #/p/<payload>
   ==================================================================== */
(function (T) {
  'use strict';
  T.routes = {};
  T.route = function (name, fn) { T.routes[name] = fn; };

  function parse() {
    var h = location.hash.replace(/^#\/?/, '');
    if (!h) return { name: 'verify', arg: null };
    if (h.indexOf('p/') === 0) return { name: 'proof', arg: decodeURIComponent(h.slice(2)) };
    var seg = h.split('/');
    return { name: seg[0], arg: seg[1] ? decodeURIComponent(seg[1]) : null };
  }

  T.go = function (hash) { if (location.hash === hash) T.render(); else location.hash = hash; };

  T.render = function () {
    var r = parse(), fn = T.routes[r.name] || T.routes.verify;
    var root = document.getElementById('view');
    if (!root) return;
    // nav active state
    var links = document.querySelectorAll('[data-nav]');
    for (var i = 0; i < links.length; i++) links[i].classList.toggle('on', links[i].getAttribute('data-nav') === r.name);
    root.classList.remove('view-in');
    root.innerHTML = '';
    try { fn(root, r.arg); } catch (e) { root.appendChild(T.h('<div class="card"><h2>Something went wrong</h2><p class="muted">' + T.esc(e && e.message || e) + '</p></div>')); }
    // re-trigger entrance animation
    void root.offsetWidth; root.classList.add('view-in');
    window.scrollTo(0, 0);
  };

  window.addEventListener('hashchange', T.render);
  T.start = function () { T.render(); };
})(window.TSL);
