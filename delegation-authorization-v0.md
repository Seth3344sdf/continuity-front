/* ====================================================================
   TSL shared components — score ring, band tag, check row (from real
   checks{}), intercept strip, continuity thread, mini graph, toast,
   modal. Reused across all views so every identity looks identical.
   ==================================================================== */
(function (T) {
  'use strict';
  T.reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var NS = 'http://www.w3.org/2000/svg';

  T.el = function (tag, attrs, html) { var e = document.createElement(tag); if (attrs) for (var k in attrs) { if (k === 'class') e.className = attrs[k]; else if (k === 'html') e.innerHTML = attrs[k]; else e.setAttribute(k, attrs[k]); } if (html != null) e.innerHTML = html; return e; };
  T.h = function (s) { var d = document.createElement('div'); d.innerHTML = s.trim(); return d.firstElementChild; };
  T.esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  function svg(t, a) { var e = document.createElementNS(NS, t); for (var k in a) e.setAttribute(k, a[k]); return e; }

  T.toast = function (msg) { var host = document.getElementById('toasts'); if (!host) return; var t = T.el('div', { class: 'toast' }, '<span class="dot"></span>' + T.esc(msg)); host.appendChild(t); setTimeout(function () { t.classList.add('out'); setTimeout(function () { t.remove(); }, 220); }, 2600); };
  T.copy = function (text, msg) { try { navigator.clipboard.writeText(text); } catch (e) { var ta = T.el('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (_) {} ta.remove(); } T.toast(msg || 'Copied'); };

  T.modal = function (node) { var scrim = T.el('div', { class: 'scrim' }); var box = T.el('div', { class: 'modal' }); box.appendChild(node); scrim.appendChild(box); function close() { scrim.remove(); document.removeEventListener('keydown', onKey); } function onKey(e) { if (e.key === 'Escape') close(); } scrim.addEventListener('click', function (e) { if (e.target === scrim) close(); }); document.addEventListener('keydown', onKey); document.body.appendChild(scrim); return { close: close, el: box }; };
  T.confirm = function (o) { return new Promise(function (res) { var n = T.el('div'); n.innerHTML = '<h2>' + T.esc(o.title) + '</h2><p>' + T.esc(o.body) + '</p><div class="modal__row"><button class="btn btn--secondary" data-no>Cancel</button><button class="btn ' + (o.danger ? 'btn--danger' : '') + '" data-yes>' + T.esc(o.confirm || 'Confirm') + '</button></div>'; var m = T.modal(n); n.querySelector('[data-no]').onclick = function () { m.close(); res(false); }; n.querySelector('[data-yes]').onclick = function () { m.close(); res(true); }; }); };

  T.avatar = function (band, size) { var e = T.el('span', { class: 'avatar band-' + (band || 'medium_trust') }); var s = size || 20; e.style.width = s + 'px'; e.style.height = s + 'px'; return e; };

  /* band tag with LED — band is a TrustAssessmentV2.label or risk_label */
  T.bandTag = function (band, labelText) { var e = T.el('span', { class: 'band-tag band-' + band }, '<span class="led"></span>' + T.esc(labelText)); return e; };

  /* score ring — score is 0..100 (score_bps/100). null → "verification only" */
  T.scoreRing = function (score, band, size) {
    size = size || 118; var stroke = size >= 110 ? 9 : 7, r = (size - stroke) / 2 - 1, c = 2 * Math.PI * r;
    var wrap = T.el('div', { class: 'ring-wrap band-' + band }); wrap.style.width = size + 'px'; wrap.style.height = size + 'px';
    var s = svg('svg', { width: size, height: size, viewBox: '0 0 ' + size + ' ' + size });
    s.appendChild(svg('circle', { cx: size / 2, cy: size / 2, r: r, fill: 'none', stroke: 'rgba(45,33,24,0.10)', 'stroke-width': stroke }));
    var fg = svg('circle', { cx: size / 2, cy: size / 2, r: r, fill: 'none', stroke: 'var(--band)', 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-dasharray': c, 'stroke-dashoffset': score == null ? c : c }); s.appendChild(fg);
    wrap.appendChild(s);
    var num = T.el('div', { class: 'ring-num' }); num.style.setProperty('--rs', (size >= 110 ? 36 : 28) + 'px');
    if (score == null) { num.innerHTML = '<b style="font-size:16px">verification<br>only</b>'; }
    else { num.innerHTML = '<b>0</b><span>/ 100</span>'; }
    wrap.appendChild(num);
    if (score != null) {
      var b = num.querySelector('b');
      function set() { fg.style.transition = T.reduced ? 'none' : 'stroke-dashoffset .95s var(--ease)'; fg.setAttribute('stroke-dashoffset', c * (1 - score / 100)); }
      if (T.reduced) { b.textContent = (Math.round(score * 10) / 10); set(); }
      else { requestAnimationFrame(function () { requestAnimationFrame(set); }); countUp(b, score, 950); }
    }
    return wrap;
  };
  function countUp(el, target, dur) { var t0 = null; function f(t) { if (t0 === null) t0 = t; var p = Math.min(1, (t - t0) / dur); var v = (1 - Math.pow(1 - p, 3)) * target; el.textContent = (Math.round(v * 10) / 10); if (p < 1) requestAnimationFrame(f); else el.textContent = (Math.round(target * 10) / 10); } requestAnimationFrame(f); }

  /* check row — bound to a REAL VerificationChecks entry */
  T.checkRow = function (key, pass, delay) {
    var row = T.el('div', { class: 'check' }, '<span class="ck"></span><span class="ctx">' + T.esc(T.checkText(key, pass)) + '</span><span class="cmark">…</span>');
    row.classList.add(pass ? 'pending-ok' : 'pending-no');
    setTimeout(function () { row.classList.remove('pending-ok', 'pending-no'); row.classList.add(pass ? 'pass' : 'fail'); row.querySelector('.cmark').textContent = pass ? '✓' : '✕'; }, T.reduced ? 0 : (delay || 0));
    return row;
  };

  /* intercept strip — bound to a real failed check */
  T.interceptStrip = function (steps) {
    var wrap = T.el('div', { class: 'intercept' });
    var rows = steps.map(function (s) { var st = T.el('div', { class: 'instep' }, '<div class="k"><span class="led"></span>' + T.esc(s.k) + '</div><div class="t">' + T.esc(s.t) + '</div>'); wrap.appendChild(st); return st; });
    var tag = T.el('div', { class: 'intercept__tag' }, '<span class="led"></span>contained'); wrap.appendChild(tag);
    if (T.reduced) { rows.forEach(function (r) { r.classList.add('on'); }); wrap.classList.add('contained'); tag.classList.add('show'); }
    else { rows.forEach(function (r, i) { setTimeout(function () { r.classList.add('on', 'pulse'); setTimeout(function () { r.classList.remove('pulse'); }, 460); }, 240 + i * 500); }); setTimeout(function () { wrap.classList.add('contained'); tag.classList.add('show'); }, 240 + rows.length * 500 + 200); }
    return wrap;
  };

  /* continuity thread — events: [{x:0..1, k:'created'|'event'|'receipt'|'break'|'recovery'|'milestone', l}] */
  T.thread = function (events, opts) {
    opts = opts || {}; var hero = !!opts.hero, w = opts.w || 560, h = hero ? 92 : 30, midY = h / 2, padX = 14;
    var wrap = T.el('div', { class: 'thread' }); var s = svg('svg', { viewBox: '0 0 ' + w + ' ' + h, preserveAspectRatio: 'none' }); s.style.height = h + 'px';
    events = (events || []).slice().sort(function (a, b) { return a.x - b.x; });
    var maxX = events.length ? events[events.length - 1].x : 0;
    function px(x) { return padX + x * (w - padX * 2); }
    var col = { created: '#C75B39', event: '#C75B39', receipt: '#3E8E5A', milestone: '#C75B39', recovery: '#3E8E5A', break: '#C2412D' };
    function seg(x1, x2, color) { var l = svg('line', { x1: x1, y1: midY, x2: x2, y2: midY, class: 'seg' + (T.reduced ? '' : ' draw') }); if (color) l.setAttribute('stroke', color); l.style.setProperty('--len', Math.abs(x2 - x1)); s.appendChild(l); }
    var brk = events.filter(function (e) { return e.k === 'break'; })[0], rec = events.filter(function (e) { return e.k === 'recovery'; })[0];
    if (brk) { var bx = px(brk.x), g = 7, rx = rec ? px(rec.x) : bx + g; seg(px(0), bx - g); seg(rx, px(maxX), rec ? '#3E8E5A' : null); s.appendChild(svg('line', { x1: bx - g, y1: midY - 5, x2: bx - g, y2: midY + 5, stroke: '#C2412D', 'stroke-width': 1.5 })); if (rec) s.appendChild(svg('line', { x1: bx - g, y1: midY, x2: rx, y2: midY, stroke: 'rgba(62,142,90,0.4)', 'stroke-width': 1.5, 'stroke-dasharray': '2 3' })); }
    else seg(px(0), maxX ? px(maxX) : px(0.04));
    if (maxX < 1) s.appendChild(svg('line', { x1: px(maxX), y1: midY, x2: px(1), y2: midY, stroke: 'rgba(45,33,24,0.10)', 'stroke-width': 1.5, 'stroke-dasharray': '2 5' }));
    events.forEach(function (ev, i) { var cx = px(ev.x), rr = hero ? (ev.k === 'milestone' ? 5 : 4) : 3, k = svg('circle', { cx: cx, cy: midY, r: rr, class: 'knot' }); k.setAttribute('fill', col[ev.k] || '#C75B39'); if (!T.reduced) { k.style.opacity = 0; k.style.transition = 'opacity .4s var(--ease)'; setTimeout(function () { k.style.opacity = 1; }, 220 + i * 90); } if (hero && ev.l) { var ti = svg('title'); ti.textContent = ev.l; k.appendChild(ti); k.style.cursor = 'help'; } s.appendChild(k); });
    wrap.appendChild(s); return wrap;
  };

  /* mini connection graph from real counterparties */
  T.miniGraph = function (kind) {
    var spec = { trusted: { n: 7, col: '#3E8E5A', dense: true, cap: 'a strong, interconnected web' }, thin: { n: 3, col: '#BE822A', dense: false, cap: 'only a few light connections' }, fake: { n: 2, col: '#C2412D', dense: false, cap: 'isolated, linked only to other fakes' }, none: { n: 0, col: '#A2917D', dense: false, cap: 'no two-way connections on record' } }[kind] || { n: 4, col: '#C75B39', dense: true, cap: '' };
    var W = 150, Hh = 90, cx = W / 2, cy = Hh / 2, R = 30, pts = [], s = svg('svg', { width: W, height: Hh, viewBox: '0 0 ' + W + ' ' + Hh });
    for (var i = 0; i < spec.n; i++) { var a = (i / spec.n) * Math.PI * 2 - Math.PI / 2; pts.push({ x: cx + Math.cos(a) * R * (0.7 + Math.random() * 0.5), y: cy + Math.sin(a) * R * (0.7 + Math.random() * 0.5) }); }
    function line(x1, y1, x2, y2, d) { var l = svg('line', { x1: x1, y1: y1, x2: x2, y2: y2, stroke: spec.col, 'stroke-width': 1, opacity: 0 }); s.appendChild(l); setTimeout(function () { l.setAttribute('opacity', 0.5); l.style.transition = 'opacity .4s'; }, T.reduced ? 0 : d); }
    function dot(x, y, r, col, d) { var c = svg('circle', { cx: x, cy: y, r: r, fill: col }); c.style.opacity = 0; s.appendChild(c); setTimeout(function () { c.style.transition = 'opacity .4s var(--ease)'; c.style.opacity = 1; }, T.reduced ? 0 : d); }
    pts.forEach(function (p, i) { line(cx, cy, p.x, p.y, 120 + i * 60); });
    if (spec.dense) for (var j = 0; j < pts.length; j++) if (Math.random() > 0.45) line(pts[j].x, pts[j].y, pts[(j + 1) % pts.length].x, pts[(j + 1) % pts.length].y, 300 + j * 50);
    pts.forEach(function (p, i) { dot(p.x, p.y, 3, spec.col, 160 + i * 60); }); dot(cx, cy, 6, '#241D17', 60);
    return { svg: s, cap: spec.cap };
  };

  T.copyField = function (text, short) { var f = T.el('div', { class: 'copyfield' }, '<code>' + T.esc(short || text) + '</code>'); var b = T.el('button', { class: 'btn btn--secondary btn--sm' }, 'Copy'); b.onclick = function () { T.copy(text, 'Copied'); }; f.appendChild(b); return f; };

})(window.TSL);
