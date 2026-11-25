function reloadKeep() {
  const p = camera.position.clone(), t = controls.target.clone();
  loadScene(curIdx); camera.position.copy(p); controls.target.copy(t); controls.update();
}
// 在 extra 面板加入滑桿：回傳 input
function slider(box, label, min, max, val, step, on) {
  const w = document.createElement('label'); w.className = 'sl';
  const b = document.createElement('b'); const inp = document.createElement('input');
  Object.assign(inp, { type: 'range', min, max, value: val, step });
  w.append(label + '：', b, inp); box.appendChild(w);
  const f = () => { b.textContent = inp.value; on(+inp.value); };
  inp.oninput = f; b.textContent = val;
  return inp;
}
function checkbox(box, label, val, on) {
  const w = document.createElement('label'); const c = document.createElement('input');
  c.type = 'checkbox'; c.checked = val; c.onchange = () => on(c.checked);
  w.append(c, ' ' + label); box.appendChild(w); return c;
}
function note(box, html, cls = 'note') { const d = document.createElement('div'); d.className = cls; d.innerHTML = html; box.appendChild(d); return d; }
function partBy(zh) { return CUR.parts.find(p => p.zh === zh); }
function togglePart(zh, on) { const p = partBy(zh); if (!p) return; p.visible = on === undefined ? !p.visible : on; rebuildList(); refresh(); return p; }
// 讓構造跟著某個 Group 移動：meshes 已用 grp 的區域座標建立，anchor 也是區域座標
function attachPart(p, grp) { p._grp = grp; p._loc = p.anchor.clone(); p.meshes.forEach(m => grp.add(m)); return p; }
function updateAnchors() { CUR.parts.forEach(p => { if (p._grp) { p._grp.updateMatrixWorld(); p.anchor.copy(p._loc).applyMatrix4(p._grp.matrixWorld); } }); }

/* ===== 肌肉模型額外工具 ===== */
(function () {
  const st = document.createElement('style');
  st.textContent = '#extra .steps{display:flex;flex-direction:column;gap:3px;font-size:12px;line-height:1.4}' +
    '#extra .steps div{padding:3px 6px;border-radius:4px;background:#14263a;border:1px solid #2c4560;color:#b8c8d8}' +
    '#extra .steps div.on{background:#5a430c;border-color:#ffd479;color:#fff}' +
    '#extra .rd{font-size:12.5px;line-height:1.6;background:#0a1420;border:1px solid #2c4560;border-radius:6px;padding:4px 8px}' +
    '#extra .rd b{color:#ffd479}#extra .row2{display:flex;gap:4px;flex-wrap:wrap}#extra .row2 button{flex:1}';
  document.head.appendChild(st);
})();

// 肌節橫紋貼圖：一個肌節（Z→Z）畫在畫布垂直方向；沿圓柱長軸重複
function stripeTex(rep, pal) {
  pal = Object.assign({ I: '#f2d2cc', A: '#8e3330', H: '#b65650', Z: '#2a0c0c' }, pal || {});
  const cv = document.createElement('canvas'); cv.width = 4; cv.height = 256;
  const c = cv.getContext('2d'), H = 256, f = (a, b, col) => { c.fillStyle = col; c.fillRect(0, a * H, 4, (b - a) * H); };
  f(0, 1, pal.I); f(0.18, 0.82, pal.A); f(0.42, 0.58, pal.H); f(0.493, 0.507, pal.Z);
  f(0, 0.014, pal.Z); f(0.986, 1, pal.Z);
  const t = new THREE.CanvasTexture(cv);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1, rep); t.magFilter = THREE.LinearFilter;
  t.anisotropy = 4;
  return t;
}
// 帶貼圖材質
function tmat(tex, o = 1, extra = {}) { return mat(0xffffff, o, Object.assign({ map: tex }, extra)); }
// 兩點間圓柱（可指定材質）；回傳 mesh
function cylM(a, b, r, m, seg = 16, open = false) {
  const A = a.isVector3 ? a : V(...a), B = b.isVector3 ? b : V(...b), d = B.clone().sub(A);
  const ms = new THREE.Mesh(new THREE.CylinderGeometry(r, r, d.length(), seg, 1, open), m);
  ms.position.copy(A.clone().add(B).multiplyScalar(0.5));
  ms.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize());
  return ms;
}
// 把單位圓柱（高 1、沿 y）擺到 a→b
const _Y = new THREE.Vector3(0, 1, 0);
function setCyl(m, a, b, r) {
  const d = b.clone().sub(a), L = d.length();
  m.position.copy(a).add(b).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(_Y, d.multiplyScalar(1 / (L || 1)));
  m.scale.set(r, L, r);
}
// 合併多個幾何（各自帶變換矩陣）成一個 BufferGeometry
function mergeGeo(items) {
  const pos = [], nor = [];
  items.forEach(([g, m]) => {
    const gg = (g.index ? g.toNonIndexed() : g.clone()); if (m) gg.applyMatrix4(m);
    pos.push(...gg.attributes.position.array); nor.push(...gg.attributes.normal.array); gg.dispose();
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  return g;
}
const M4 = () => new THREE.Matrix4();
// 由「位置、朝向（把 +y 轉到 dir）、縮放」得到矩陣
function mtx(p, dir, s) {
  const q = new THREE.Quaternion();
  if (dir) q.setFromUnitVectors(_Y, V(...dir).normalize());
  return M4().compose(V(...p), q, s ? V(...s) : V(1, 1, 1));
}
// 虛線（非構造，僅示意放大關係）
function dash(a, b, col = 0x8fb8dd) {
  const g = new THREE.BufferGeometry().setFromPoints([V(...a), V(...b)]);
  const l = new THREE.Line(g, new THREE.LineDashedMaterial({ color: col, dashSize: 0.6, gapSize: 0.4, transparent: true, opacity: 0.7 }));
  l.computeLineDistances(); CUR.root.add(l); return l;
}
// 大量小球（InstancedMesh）；pts 為 Vector3 陣列；回傳 mesh（可再更新 setP）
function dots(pts, r, col, o = 1, seg = 10) {
  const g = new THREE.SphereGeometry(1, seg, Math.max(6, seg - 3));
  const m = new THREE.InstancedMesh(g, mat(col, o), Math.max(1, pts.length));
  const d = new THREE.Object3D();
  m.setP = (i, p, s = r) => { d.position.copy(p); d.scale.setScalar(s); d.updateMatrix(); m.setMatrixAt(i, d.matrix); };
  pts.forEach((p, i) => m.setP(i, p));
  m.count = pts.length; m.instanceMatrix.needsUpdate = true;
  return m;
}
// 實例化網格（任意幾何、矩陣陣列）
function inst(g, mats, col, o = 1) {
  const m = new THREE.InstancedMesh(g, mat(col, o), Math.max(1, mats.length));
  mats.forEach((x, i) => m.setMatrixAt(i, x)); m.count = mats.length; m.instanceMatrix.needsUpdate = true;
  return m;
}
// 步驟清單面板：回傳 set(i) 以高亮
function stepList(box, arr) {
  const d = document.createElement('div'); d.className = 'steps'; box.appendChild(d);
  const els = arr.map(t => { const e = document.createElement('div'); e.innerHTML = t; d.appendChild(e); return e; });
  return i => els.forEach((e, k) => e.classList.toggle('on', k === i));
}
function btn(box, label, fn) { const b = document.createElement('button'); b.innerHTML = label; b.onclick = fn; box.appendChild(b); return b; }
function btnRow(box, list) { const r = document.createElement('div'); r.className = 'row2'; box.appendChild(r); return list.map(([l, f]) => btn(r, l, f)); }
const clamp01 = x => Math.max(0, Math.min(1, x));
const ease = x => { x = clamp01(x); return x * x * (3 - 2 * x); };
// 每幀時間差（秒）
function dtClock() { let last = performance.now(); return () => { const n = performance.now(), d = Math.min(0.05, (n - last) / 1000); last = n; return d; }; }
// 沿折線（Vector3 陣列）依弧長比例取點
function alongPath(pts, t) {
  const L = []; let tot = 0;
  for (let i = 1; i < pts.length; i++) { tot += pts[i].distanceTo(pts[i - 1]); L.push(tot); }
  let s = clamp01(t) * tot;
  for (let i = 1; i < pts.length; i++) {
    if (s <= L[i - 1] || i === pts.length - 1) { const a = i > 1 ? L[i - 2] : 0, k = (s - a) / ((L[i - 1] - a) || 1); return pts[i - 1].clone().lerp(pts[i], clamp01(k)); }
  }
  return pts[pts.length - 1].clone();
}

/* ===== 細胞膜模型工具 ===== */
const C_HEAD = 0xffb060, C_TAIL = 0xf4e6c0, C_OUT = 0x9fd8ff;
// 磷脂雙層：x∈[-W/2,W/2]、z∈[-D/2,D/2]，膜中心 y=y0；holes: [{x,z,r}] 留給蛋白質
function bilayer(W, D, holes = [], y0 = 0, sp = 0.62, opt = {}) {
  const hp = [], tm = [], hg = new THREE.SphereGeometry(0.27, 10, 7), tg = new THREE.CylinderGeometry(0.06, 0.06, 0.82, 5);
  const o = new THREE.Object3D(), r = rnd(opt.seed || 1);
  for (let x = -W / 2; x <= W / 2 + 1e-6; x += sp) for (let z = -D / 2; z <= D / 2 + 1e-6; z += sp) {
    if (holes.some(h => Math.hypot(x - h.x, z - h.z) < h.r)) continue;
    [1, -1].forEach(s => {
      const jx = x + (r() - 0.5) * 0.12, jz = z + (r() - 0.5) * 0.12;
      hp.push(V(jx, y0 + s * 1.05, jz));
      [-0.1, 0.1].forEach(dx => { o.position.set(jx + dx, y0 + s * 0.5, jz); o.rotation.set(0, 0, (r() - 0.5) * 0.25); o.scale.set(1, 1, 1); o.updateMatrix(); tm.push(o.matrix.clone()); });
    });
  }
  const heads = new THREE.InstancedMesh(hg, mat(opt.head || C_HEAD), hp.length);
  hp.forEach((p, i) => { o.position.copy(p); o.rotation.set(0, 0, 0); o.updateMatrix(); heads.setMatrixAt(i, o.matrix); });
  const tails = new THREE.InstancedMesh(tg, mat(opt.tail || C_TAIL), tm.length);
  tm.forEach((m, i) => tails.setMatrixAt(i, m));
  return { heads, tails };
}
// 跨膜蛋白：n 根α螺旋圓柱圍成一圈（channel=true 時中央留孔）
function helixBundle(c, n, R, col, h = 3.2, r = 0.42, o = 1) {
  const items = [];
  for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; items.push([new THREE.CylinderGeometry(r, r, h, 12), mtx([c[0] + Math.cos(a) * R, c[1], c[2] + Math.sin(a) * R])]); }
  return new THREE.Mesh(mergeGeo(items), mat(col, o));
}
// 粒子群：每個粒子有 {path:[Vector3...], dur, t0}，依時間沿路徑移動並循環
function particles(n, r, col, emis) {
  const m = dots(new Array(n).fill(0).map(() => V(0, -999, 0)), r, col, 1, 8);
  if (emis) m.material.emissive.setHex(emis);
  return m;
}
// 熱運動：在盒子內隨機遊走的粒子
function brownian(n, r, col, bx, seed = 2) {
  const rr = rnd(seed), P = [], Vv = [];
  for (let i = 0; i < n; i++) { P.push(V(bx[0] + rr() * (bx[1] - bx[0]), bx[2] + rr() * (bx[3] - bx[2]), bx[4] + rr() * (bx[5] - bx[4]))); Vv.push(V(rr() - 0.5, rr() - 0.5, rr() - 0.5).multiplyScalar(1.6)); }
  const m = dots(P, r, col, 1, 8);
  m.step = d => {
    P.forEach((p, i) => {
      const v = Vv[i]; v.x += (rr() - 0.5) * d * 6; v.y += (rr() - 0.5) * d * 6; v.z += (rr() - 0.5) * d * 6; v.clampLength(0, 2);
      p.addScaledVector(v, d);
      if (p.x < bx[0] || p.x > bx[1]) v.x *= -1; if (p.y < bx[2] || p.y > bx[3]) v.y *= -1; if (p.z < bx[4] || p.z > bx[5]) v.z *= -1;
      p.x = Math.min(bx[1], Math.max(bx[0], p.x)); p.y = Math.min(bx[3], Math.max(bx[2], p.y)); p.z = Math.min(bx[5], Math.max(bx[4], p.z));
      m.setP(i, p);
    });
    m.instanceMatrix.needsUpdate = true;
  };
  return m;
}
