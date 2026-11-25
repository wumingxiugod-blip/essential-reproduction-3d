/* kit_extra.js：高解析度互動圖表 plot()、分段按鈕 seg() 與幾何插值小工具 */
const toV = p => (p.isVector3 ? p.clone() : V(p[0], p[1], p[2] || 0));
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const smooth = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };

function keyf(t, ks) {
  if (t <= ks[0][0]) return ks[0][1];
  for (let i = 1; i < ks.length; i++) if (t <= ks[i][0]) { const [a, va] = ks[i - 1], [b, vb] = ks[i]; return lerp(va, vb, smooth((t - a) / (b - a))); }
  return ks[ks.length - 1][1];
}
function addTo(g, ms) { [].concat(ms).forEach(m => g.add(m)); return ms; }
function setOpacity(ms, o) {
  [].concat(ms).forEach(m => { if (!m.material) return; m.material.userData.baseO = o; m.material.opacity = o; m.material.transparent = o < 1; m.material.depthWrite = o >= 0.9; });
}
function sph(p, r, col, o = 1) { return ell(toV(p).toArray(), [r, r, r], col, o); }
function arrow3(a, b, r, col, o = 1, head = 2.5) {
  const A = toV(a), B = toV(b), d = B.clone().sub(A), L = d.length(), u = d.clone().normalize();
  const hl = Math.min(L * 0.45, r * head * 2.2);
  const mid = A.clone().addScaledVector(u, L - hl);
  const m1 = cyl(A.toArray(), mid.toArray(), r, col, o), m2 = cone(mid.toArray(), B.toArray(), r * head, col, o);
  m2.material = m1.material;
  return [m1, m2];
}
function flatText(txt, pos, h = 1, color = '#ffffff', opt = {}) {
  const cv = document.createElement('canvas'), ctx = cv.getContext('2d');
  const F = 64; ctx.font = (opt.bold === false ? '' : 'bold ') + F + 'px "Microsoft JhengHei",sans-serif';
  const w = ctx.measureText(txt).width; cv.width = Math.ceil(w + 20); cv.height = Math.ceil(F * 1.3);
  ctx.font = (opt.bold === false ? '' : 'bold ') + F + 'px "Microsoft JhengHei",sans-serif'; ctx.fillStyle = color; ctx.textBaseline = 'middle'; ctx.fillText(txt, 10, cv.height / 2);
  const tex = new THREE.CanvasTexture(cv); tex.encoding = THREE.sRGBEncoding;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(h * cv.width / cv.height, h), new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide, depthWrite: false, toneMapped: false }));
  m.position.set(...toV(pos).toArray());
  return m;
}
function seg(box, label, opts, val, on) {
  const w = document.createElement('div');
  if (label) { const t = document.createElement('div'); t.className = 'note'; t.innerHTML = label; w.appendChild(t); }
  const row = document.createElement('div'); row.className = 'seg'; w.appendChild(row);
  const btns = opts.map(([v, t]) => {
    const b = document.createElement('button'); b.innerHTML = t; b.onclick = () => { set(v); on(v); }; row.appendChild(b); return [v, b];
  });
  const set = v => btns.forEach(([x, b]) => b.classList.toggle('on', x === v));
  set(val); box.appendChild(w);
  return { set, el: w };
}
function mkCanvas(box, w = 290, h = 190) {
  const cv = document.createElement('canvas'); const k = 2;
  cv.width = w * k; cv.height = h * k; cv._w = w; cv._h = h; cv._k = k;
  cv.style.aspectRatio = w + ' / ' + h; box.appendChild(cv); return cv;
}
function niceTicks(a, b, n = 5) {
  const span = b - a, step0 = span / n, mag = Math.pow(10, Math.floor(Math.log10(step0)));
  const st = [1, 2, 2.5, 5, 10].map(x => x * mag).find(x => span / x <= n) || mag * 10;
  const out = []; for (let v = Math.ceil(a / st - 1e-9) * st; v <= b + 1e-9; v += st) out.push(+v.toFixed(10)); return out;
}
function plot(cv, o) {
  const ctx = cv.getContext('2d'), k = cv._k || 1, W = cv._w || cv.width, H = cv._h || cv.height;
  ctx.setTransform(k, 0, 0, k, 0, 0);
  const L = o.padL || 40, R = 10, T = o.title ? 20 : 10, B = 30, w = W - L - R, h = H - T - B;
  const [x0, x1] = o.x, [y0, y1] = o.y;
  const X = x => L + (x - x0) / (x1 - x0) * w, Y = y => T + (1 - (y - y0) / (y1 - y0)) * h;
  ctx.fillStyle = '#0a1420'; ctx.fillRect(0, 0, W, H);
  ctx.font = '10.5px "Microsoft JhengHei",sans-serif';
  if (o.title) { ctx.fillStyle = '#ffd479'; ctx.fillText(o.title, L, 13); }
  (o.bands || []).forEach(b => { ctx.fillStyle = b.col; ctx.fillRect(X(b.x0), T, X(b.x1) - X(b.x0), h); if (b.label) { ctx.fillStyle = '#cfe3f5'; ctx.fillText(b.label, X(b.x0) + 3, T + 11); } });
  const xt = o.xt || niceTicks(x0, x1, 5), yt = o.yt || niceTicks(y0, y1, 4);
  ctx.strokeStyle = '#1d3349'; ctx.lineWidth = 1; ctx.fillStyle = '#8aa3b8';
  xt.forEach(v => { ctx.beginPath(); ctx.moveTo(X(v), T); ctx.lineTo(X(v), T + h); ctx.stroke(); const s = o.fmtX ? o.fmtX(v) : String(v); ctx.fillText(s, X(v) - ctx.measureText(s).width / 2, T + h + 12); });
  yt.forEach(v => { ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(L + w, Y(v)); ctx.stroke(); const s = o.fmtY ? o.fmtY(v) : String(v); ctx.fillText(s, L - 4 - ctx.measureText(s).width, Y(v) + 3.5); });
  ctx.strokeStyle = '#3b5a78'; ctx.strokeRect(L, T, w, h);
  if (x0 < 0 && x1 > 0) { ctx.strokeStyle = '#5b7a98'; ctx.beginPath(); ctx.moveTo(X(0), T); ctx.lineTo(X(0), T + h); ctx.stroke(); }
  if (y0 < 0 && y1 > 0) { ctx.strokeStyle = '#5b7a98'; ctx.beginPath(); ctx.moveTo(L, Y(0)); ctx.lineTo(L + w, Y(0)); ctx.stroke(); }
  ctx.fillStyle = '#9fb6c8';
  if (o.xl) ctx.fillText(o.xl, L + w / 2 - ctx.measureText(o.xl).width / 2, H - 4);
  if (o.yl) { ctx.save(); ctx.translate(10, T + h / 2 + ctx.measureText(o.yl).width / 2); ctx.rotate(-Math.PI / 2); ctx.fillText(o.yl, 0, 0); ctx.restore(); }
  ctx.save(); ctx.beginPath(); ctx.rect(L, T, w, h); ctx.clip();
  (o.fill || []).forEach(f => {
    ctx.fillStyle = f.col; ctx.beginPath(); const n = 200;
    for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n; ctx[i ? 'lineTo' : 'moveTo'](X(x), Y(f.f(x))); }
    for (let i = n; i >= 0; i--) { const x = x0 + (x1 - x0) * i / n; ctx.lineTo(X(x), Y(f.g ? f.g(x) : y0)); }
    ctx.fill();
  });
  (o.series || []).forEach(s => {
    ctx.strokeStyle = s.col || '#fff'; ctx.lineWidth = s.w || 2; ctx.setLineDash(s.dash || []); ctx.beginPath();
    if (s.pts) s.pts.forEach((p, i) => ctx[i ? 'lineTo' : 'moveTo'](X(p[0]), Y(p[1])));
    else { const n = s.n || 300; let pen = false; for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n, y = s.f(x); if (!isFinite(y)) { pen = false; continue; } ctx[pen ? 'lineTo' : 'moveTo'](X(x), Y(y)); pen = true; } }
    ctx.stroke(); ctx.setLineDash([]);
  });
  (o.vl || []).forEach(v => { ctx.strokeStyle = v.col || '#ffd479'; ctx.setLineDash(v.dash || [4, 3]); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X(v.x), T); ctx.lineTo(X(v.x), T + h); ctx.stroke(); ctx.setLineDash([]); if (v.label) { ctx.fillStyle = v.col || '#ffd479'; ctx.fillText(v.label, Math.min(X(v.x) + 3, L + w - ctx.measureText(v.label).width - 2), T + (v.ly || 11)); } });
  (o.hl || []).forEach(v => { ctx.strokeStyle = v.col || '#ffd479'; ctx.setLineDash(v.dash || [4, 3]); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(L, Y(v.y)); ctx.lineTo(L + w, Y(v.y)); ctx.stroke(); ctx.setLineDash([]); if (v.label) { ctx.fillStyle = v.col || '#ffd479'; ctx.fillText(v.label, L + (v.lx || 4), Y(v.y) - 3); } });
  ctx.restore();
  (o.pts || []).forEach(p => { if (p.x < x0 || p.x > x1 || p.y < y0 || p.y > y1) return; ctx.beginPath(); ctx.arc(X(p.x), Y(p.y), p.r || 4, 0, 7); ctx.fillStyle = p.col || '#ffd479'; ctx.fill(); if (p.label) { ctx.fillStyle = p.lc || p.col || '#ffd479'; ctx.fillText(p.label, X(p.x) + 6, Y(p.y) - 5); } });
  if (o.legend !== false) {
    const ls = (o.series || []).filter(s => s.label); let lx = L + 6, ly = T + 12;
    ls.forEach(s => { ctx.fillStyle = s.col || '#fff'; ctx.fillRect(lx, ly - 6, 10, 3); ctx.fillStyle = '#cfe3f5'; ctx.fillText(s.label, lx + 14, ly - 1); ly += 13; });
  }
  return { X, Y };
}
