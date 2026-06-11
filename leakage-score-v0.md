/* ====================================================================
   TSL network graph — interactive canvas force layout.
   Usability: drag any node to rearrange (physics follow), click a node
   to trace the trust path from "you", hover for a tooltip, scroll to
   zoom, drag empty space to pan, double-click to re-center. The layout
   cools down and settles instead of jittering forever; any interaction
   gently re-heats it. Pointer events → mouse + touch both work.
   ==================================================================== */
(function (T) {
  'use strict';

  var COL = { trusted: '#3E8E5A', medium: '#C75B39', caution: '#BE822A', risk: '#C2412D', you: '#241D17' };

  T.makeGraph = function (canvas, spec) {
    var ctx = canvas.getContext('2d'), DPR = Math.min(2, window.devicePixelRatio || 1);
    var W = 0, H = 0, nodes = spec.nodes, edges = spec.edges, raf = 0;
    var hl = null;                 // {nodes:{}, edges:{}} when a path is traced
    var hover = null;              // hovered node
    var drag = null;               // {node, dx, dy} while dragging a node
    var pan = null;                // {x0,y0,ox0,oy0} while panning
    var attackNode = null, ashen = {};
    var alpha = 1;                 // simulation heat — cools to rest
    var view = { scale: 1, ox: 0, oy: 0 };
    var clickCb = null;
    var byId = {};
    nodes.forEach(function (n) { byId[n.id] = n; });

    function resize() {
      var r = canvas.getBoundingClientRect();
      W = r.width; H = r.height || 380;
      canvas.width = W * DPR; canvas.height = H * DPR;
    }
    resize(); window.addEventListener('resize', resize);
    canvas.style.touchAction = 'none';

    // initial ring placement
    nodes.forEach(function (n, i) {
      var a = (i / nodes.length) * Math.PI * 2;
      n.x = W / 2 + Math.cos(a) * Math.min(W, H) * 0.28;
      n.y = H / 2 + Math.sin(a) * Math.min(W, H) * 0.28;
      n.vx = 0; n.vy = 0; n.fx = null; n.fy = null;
    });

    /* ---------- tooltip ---------- */
    var tip = document.createElement('div');
    tip.style.cssText = 'position:absolute;pointer-events:none;z-index:5;background:var(--text);color:#F6EEE2;font:500 12px var(--font-body);padding:6px 11px;border-radius:8px;box-shadow:var(--shadow-lift);opacity:0;transition:opacity .15s;white-space:nowrap;transform:translate(-50%,-130%)';
    if (canvas.parentElement) { canvas.parentElement.style.position = 'relative'; canvas.parentElement.appendChild(tip); }
    var BAND_WORD = { trusted: 'trusted', medium: 'building trust', caution: 'caution', risk: 'hostile', you: 'this is you' };
    function showTip(n) {
      var deg = 0; edges.forEach(function (e) { if (e.a === n.id || e.b === n.id) deg++; });
      tip.textContent = (n.label || n.id) + ' · ' + (ashen[n.id] ? 'neutralized' : (BAND_WORD[n.band] || n.band)) + (n.you ? '' : ' · ' + deg + ' connection' + (deg === 1 ? '' : 's'));
      var p = w2s(n.x, n.y);
      tip.style.left = p.x + 'px'; tip.style.top = p.y + 'px'; tip.style.opacity = '1';
    }
    function hideTip() { tip.style.opacity = '0'; }

    /* ---------- coordinate transforms ---------- */
    function w2s(x, y) { return { x: x * view.scale + view.ox, y: y * view.scale + view.oy }; } // world → screen (CSS px)
    function s2w(x, y) { return { x: (x - view.ox) / view.scale, y: (y - view.oy) / view.scale }; }
    function pos(ev) { var r = canvas.getBoundingClientRect(); return { x: ev.clientX - r.left, y: ev.clientY - r.top }; }
    function pick(sx, sy) {
      var w = s2w(sx, sy), best = null, bestD = Infinity;
      nodes.forEach(function (n) {
        var dx = n.x - w.x, dy = n.y - w.y, d = Math.sqrt(dx * dx + dy * dy);
        var r = (n.you ? 11 : 8) + 8 / view.scale;
        if (d < r && d < bestD) { best = n; bestD = d; }
      });
      return best;
    }

    /* ---------- physics (cooling) ---------- */
    function step() {
      if (alpha < 0.004) return;
      var i, j, a, b, dx, dy, d2, d, f, ux, uy;
      for (i = 0; i < nodes.length; i++) for (j = i + 1; j < nodes.length; j++) {
        a = nodes[i]; b = nodes[j];
        dx = a.x - b.x; dy = a.y - b.y; d2 = dx * dx + dy * dy + 0.01; d = Math.sqrt(d2);
        f = (2600 / d2) * alpha; if (d < 40) f *= 2; // extra push when overlapping
        ux = dx / d; uy = dy / d;
        a.vx += ux * f; a.vy += uy * f; b.vx -= ux * f; b.vy -= uy * f;
      }
      edges.forEach(function (e) {
        var a = byId[e.a], b = byId[e.b]; if (!a || !b) return;
        var dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx * dx + dy * dy) + 0.01;
        var k = (d - 96) * 0.02 * alpha, ux = dx / d, uy = dy / d;
        a.vx += ux * k; a.vy += uy * k; b.vx -= ux * k; b.vy -= uy * k;
      });
      nodes.forEach(function (n) {
        if (n.fx != null) { n.x = n.fx; n.y = n.fy; n.vx = 0; n.vy = 0; return; }
        n.vx += (W / 2 - n.x) * 0.0022 * alpha;
        n.vy += (H / 2 - n.y) * 0.0022 * alpha;
        n.vx *= 0.85; n.vy *= 0.85;
        n.x += n.vx; n.y += n.vy;
        n.x = Math.max(24, Math.min(W - 24, n.x));
        n.y = Math.max(24, Math.min(H - 24, n.y));
      });
      alpha *= 0.992;
    }
    function reheat(v) { alpha = Math.max(alpha, v || 0.5); }

    /* ---------- draw ---------- */
    function draw() {
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.setTransform(DPR * view.scale, 0, 0, DPR * view.scale, DPR * view.ox, DPR * view.oy);
      var dimming = !!hl;

      edges.forEach(function (e) {
        var a = byId[e.a], b = byId[e.b]; if (!a || !b) return;
        var on = hl && hl.edges[e.a + '|' + e.b];
        var dead = ashen[e.a] || ashen[e.b];
        var nearHover = hover && (e.a === hover.id || e.b === hover.id);
        ctx.strokeStyle = dead ? 'rgba(194,65,45,0.20)'
          : on ? 'rgba(199,91,57,0.95)'
          : nearHover ? 'rgba(45,33,24,0.34)'
          : dimming ? 'rgba(45,33,24,0.06)' : 'rgba(45,33,24,0.14)';
        ctx.lineWidth = (on ? 2.4 : nearHover ? 1.8 : 1.1) / view.scale;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      });

      nodes.forEach(function (n) {
        var col = ashen[n.id] ? '#B4A28C' : (COL[n.band] || '#C75B39');
        var on = hl && hl.nodes[n.id];
        var isHover = hover === n;
        var r = n.you ? 9 : 6.5;
        var faded = dimming && !on && !isHover;

        if (isHover || on || n.id === attackNode) {
          ctx.beginPath(); ctx.arc(n.x, n.y, r + 7, 0, 7);
          ctx.fillStyle = n.id === attackNode ? 'rgba(194,65,45,0.15)' : 'rgba(199,91,57,0.15)';
          ctx.fill();
        }
        ctx.globalAlpha = faded ? 0.3 : 1;
        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, 7);
        ctx.fillStyle = col; ctx.fill();
        ctx.lineWidth = 2 / view.scale; ctx.strokeStyle = '#FCF8F1'; ctx.stroke();

        // labels: always visible — that is what makes it usable
        ctx.fillStyle = isHover || on ? '#241D17' : '#7A6B59';
        ctx.font = (isHover || on ? '600 ' : '500 ') + (11.5 / Math.sqrt(view.scale)) + 'px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(n.label || n.id, n.x, n.y + r + 14 / view.scale);
        ctx.globalAlpha = 1;
      });
    }
    var lastTick = 0;
    function tick() { step(); draw(); }
    function loop() { lastTick = performance.now(); tick(); raf = requestAnimationFrame(loop); }
    loop();
    // rAF stalls in hidden/throttled tabs — keep the simulation alive at a
    // low rate so the layout is never frozen mid-gesture
    var watchdog = setInterval(function () {
      if (performance.now() - lastTick > 120) { lastTick = performance.now(); tick(); }
    }, 100);

    /* ---------- interactions ---------- */
    var downAt = null, moved = false;
    var touches = {}, touchCount = 0, pinch = null; // two-finger pinch zoom
    function touchList() { var o = []; for (var k in touches) o.push(touches[k]); return o; }
    function startPinch() {
      var ts = touchList(); if (ts.length < 2) return;
      if (drag) { drag.node.fx = null; drag.node.fy = null; drag = null; }
      pan = null; hideTip();
      var mid = { x: (ts[0].x + ts[1].x) / 2, y: (ts[0].y + ts[1].y) / 2 };
      pinch = { d0: Math.hypot(ts[0].x - ts[1].x, ts[0].y - ts[1].y) || 1, scale0: view.scale, world0: s2w(mid.x, mid.y) };
    }
    canvas.addEventListener('pointerdown', function (ev) {
      var p = pos(ev);
      touches[ev.pointerId] = p; touchCount++;
      if (touchCount >= 2) { startPinch(); try { canvas.setPointerCapture(ev.pointerId); } catch (e) {} ev.preventDefault(); return; }
      var n = pick(p.x, p.y);
      downAt = p; moved = false;
      if (n) {
        var w = s2w(p.x, p.y);
        drag = { node: n, dx: n.x - w.x, dy: n.y - w.y };
        n.fx = n.x; n.fy = n.y;
        canvas.style.cursor = 'grabbing';
        reheat(0.35);
      } else {
        pan = { x0: p.x, y0: p.y, ox0: view.ox, oy0: view.oy };
        canvas.style.cursor = 'grabbing';
      }
      try { canvas.setPointerCapture(ev.pointerId); } catch (e) { /* synthetic events */ }
      ev.preventDefault();
    });
    canvas.addEventListener('pointermove', function (ev) {
      var p = pos(ev);
      if (touches[ev.pointerId]) touches[ev.pointerId] = p;
      if (pinch) {
        var ts = touchList(); if (ts.length < 2) return;
        var d = Math.hypot(ts[0].x - ts[1].x, ts[0].y - ts[1].y) || 1;
        var mid = { x: (ts[0].x + ts[1].x) / 2, y: (ts[0].y + ts[1].y) / 2 };
        view.scale = Math.max(0.5, Math.min(3, pinch.scale0 * (d / pinch.d0)));
        // keep the world point that started under the fingers under them
        view.ox = mid.x - pinch.world0.x * view.scale;
        view.oy = mid.y - pinch.world0.y * view.scale;
        return;
      }
      if (downAt && (Math.abs(p.x - downAt.x) > 3 || Math.abs(p.y - downAt.y) > 3)) moved = true;
      if (drag) {
        var w = s2w(p.x, p.y);
        drag.node.fx = w.x + drag.dx; drag.node.fy = w.y + drag.dy;
        reheat(0.3); showTip(drag.node);
        return;
      }
      if (pan) {
        view.ox = pan.ox0 + (p.x - pan.x0);
        view.oy = pan.oy0 + (p.y - pan.y0);
        hideTip();
        return;
      }
      var n = pick(p.x, p.y);
      if (n !== hover) { hover = n; canvas.style.cursor = n ? 'pointer' : 'grab'; }
      if (n) showTip(n); else hideTip();
    });
    function clearTouch(ev) {
      if (touches[ev.pointerId]) { delete touches[ev.pointerId]; touchCount = Math.max(0, touchCount - 1); }
      if (touchCount < 2) pinch = null;
    }
    function release(ev) {
      clearTouch(ev);
      if (pinch) return;
      if (drag) { drag.node.fx = null; drag.node.fy = null; reheat(0.25); }
      var wasNode = drag && drag.node;
      drag = null; pan = null;
      canvas.style.cursor = hover ? 'pointer' : 'grab';
      // a press that never moved = a click → trace the trust path
      if (!moved && wasNode && clickCb) clickCb(wasNode);
      else if (!moved && !wasNode && downAt) { hl = null; if (clickCb) clickCb(null); }
      downAt = null;
    }
    canvas.addEventListener('pointerup', release);
    canvas.addEventListener('pointercancel', function (ev) { clearTouch(ev); drag = null; pan = null; downAt = null; });
    canvas.addEventListener('pointerleave', function () { if (!drag && !pan) { hover = null; hideTip(); } });

    canvas.addEventListener('wheel', function (ev) {
      ev.preventDefault();
      var p = pos(ev);
      var factor = ev.deltaY < 0 ? 1.12 : 1 / 1.12;
      var ns = Math.max(0.5, Math.min(3, view.scale * factor));
      // zoom around the cursor
      view.ox = p.x - (p.x - view.ox) * (ns / view.scale);
      view.oy = p.y - (p.y - view.oy) * (ns / view.scale);
      view.scale = ns;
      hideTip();
    }, { passive: false });

    canvas.addEventListener('dblclick', function () {
      view.scale = 1; view.ox = 0; view.oy = 0; reheat(0.4); hideTip();
    });
    canvas.style.cursor = 'grab';

    /* ---------- graph queries ---------- */
    function neighbors(id) { var o = []; edges.forEach(function (e) { if (e.a === id) o.push(e.b); else if (e.b === id) o.push(e.a); }); return o; }
    function bfs(from, to) {
      var q = [[from]], seen = {}; seen[from] = 1;
      while (q.length) {
        var path = q.shift(), last = path[path.length - 1];
        if (last === to) return path;
        neighbors(last).forEach(function (n) { if (!seen[n] && !ashen[n]) { seen[n] = 1; q.push(path.concat([n])); } });
      }
      return null;
    }

    return {
      nodes: nodes,
      onNodeClick: function (cb) { clickCb = cb; },
      tracePath: function (from, to) {
        var path = bfs(from, to);
        hl = null;
        if (!path) return null;
        hl = { nodes: {}, edges: {} };
        path.forEach(function (id) { hl.nodes[id] = 1; });
        for (var i = 0; i < path.length - 1; i++) { hl.edges[path[i] + '|' + path[i + 1]] = 1; hl.edges[path[i + 1] + '|' + path[i]] = 1; }
        return path.map(function (id) { return (byId[id] && byId[id].label) || id; });
      },
      clear: function () { hl = null; attackNode = null; },
      attack: function () {
        var imp = { id: '_imp', label: 'impostor', band: 'risk', x: 30, y: H / 2, vx: 0, vy: 0, fx: null, fy: null };
        nodes.push(imp); byId['_imp'] = imp; attackNode = '_imp';
        reheat(0.6);
        setTimeout(function () { ashen['_imp'] = 1; }, 1400);
        return imp;
      },
      destroy: function () { cancelAnimationFrame(raf); clearInterval(watchdog); window.removeEventListener('resize', resize); tip.remove(); }
    };
  };

  // demo topology — labelled as illustrative
  T.demoTopology = function () {
    var nodes = [
      { id: 'you', label: 'you', band: 'you', you: true },
      { id: 'a', label: 'alice', band: 'trusted' }, { id: 'b', label: 'bank', band: 'trusted' },
      { id: 'c', label: 'carol', band: 'trusted' }, { id: 'd', label: 'dave', band: 'medium' },
      { id: 'e', label: 'erin', band: 'medium' }, { id: 'f', label: 'frank', band: 'caution' },
      { id: 'g', label: 'grace', band: 'trusted' }, { id: 'h', label: 'heidi', band: 'medium' }
    ];
    var edges = [
      { a: 'you', b: 'a' }, { a: 'you', b: 'c' }, { a: 'a', b: 'b' }, { a: 'a', b: 'g' },
      { a: 'c', b: 'd' }, { a: 'c', b: 'g' }, { a: 'd', b: 'e' }, { a: 'g', b: 'b' },
      { a: 'e', b: 'h' }, { a: 'b', b: 'h' }, { a: 'f', b: 'd' }
    ];
    return { nodes: nodes, edges: edges };
  };

})(window.TSL);
