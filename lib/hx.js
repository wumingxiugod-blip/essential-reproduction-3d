/* 第四章「調節生殖的化學訊息」專用工具：箭頭、抑制符號、流動粒子、球棍分子、類固醇骨架、胜肽珠鏈、圖表
   載入順序：core.js → util.js → realism.js → hx.js → scene_*.js → main.js */

// InstancedMesh 的實例散佈各處，關閉視錐剔除以免整組消失（r128 只用幾何的包圍球判斷）
(function () { const _d = dots; window.dots = function () { const m = _d.apply(this, arguments); m.frustumCulled = false; return m; }; })();

const HIDE = new THREE.Vector3(0, -999, 0);
const P3 = p => (p && p.isVector3) ? p.clone() : V(p[0], p[1], p[2] || 0);
function addRoot(ms) { [].concat(ms).forEach(m => CUR.root.add(m)); return ms; }

// 兩點間單位圓柱的矩陣（供合併幾何）
function segMtx(a, b) {
  const d = b.clone().sub(a), L = d.length() || 1e-6;
  return M4().compose(a.clone().add(b).multiplyScalar(0.5), new THREE.Quaternion().setFromUnitVectors(_Y, d.multiplyScalar(1 / L)), V(1, L, 1));
}

/* ---------- 箭頭 ---------- */
// 直線箭頭（回傳 [桿, 頭]，未加入場景）
function arrowM(a, b, col, r = 0.07, o = 1) {
  const A = P3(a), B = P3(b), d = B.clone().sub(A), L = d.length(); d.normalize();
  const hl = Math.min(L * 0.4, r * 5.5), m = B.clone().addScaledVector(d, -hl);
  const s = cylM(A, m, r, mat(col, o), 10);
  const c = new THREE.Mesh(new THREE.ConeGeometry(r * 2.6, hl, 16), mat(col, o));
  c.position.copy(m).addScaledVector(d, hl / 2); c.quaternion.setFromUnitVectors(_Y, d);
  return [s, c];
}
// 曲線箭頭；opt.inhibit → T 形端（抑制）；opt.dash → 虛線
function arcArrow(pts, col, r = 0.06, opt = {}) {
  const P = pts.map(P3), o = opt.o || 1;
  const cv = new THREE.CatmullRomCurve3(P, false, 'centripetal'), L = cv.getLength();
  const hl = opt.inhibit ? r * 1.2 : Math.min(L * 0.3, r * 5.5), te = 1 - hl / L;
  const sub = []; for (let i = 0; i <= 48; i++) sub.push(cv.getPointAt(te * i / 48));
  const sc = new THREE.CatmullRomCurve3(sub), out = [];
  if (opt.dash) {
    const n = Math.max(3, Math.floor(L * te / (r * 6))), items = [];
    for (let i = 0; i < n; i++) items.push([new THREE.CylinderGeometry(r, r, 1, 8), segMtx(sc.getPointAt(i / n), sc.getPointAt(Math.min(1, (i + 0.55) / n)))]);
    out.push(new THREE.Mesh(mergeGeo(items), mat(col, o)));
  } else out.push(new THREE.Mesh(new THREE.TubeGeometry(sc, 64, r, 8, false), mat(col, o)));
  const dir = cv.getTangentAt(1);
  let h;
  if (opt.inhibit) { h = new THREE.Mesh(new THREE.CylinderGeometry(r * 4.2, r * 4.2, r * 1.6, 24), mat(col, o)); h.position.copy(cv.getPointAt(1)); }
  else { h = new THREE.Mesh(new THREE.ConeGeometry(r * 2.6, hl, 16), mat(col, o)); h.position.copy(cv.getPointAt(te)).addScaledVector(dir, hl / 2); }
  h.quaternion.setFromUnitVectors(_Y, dir); out.push(h);
  out.curve = cv; out[0].userData.curve = cv;
  return out;
}
const C_STIM = 0x46d16a, C_INH = 0xff4a4a;

/* ---------- 粒子 ---------- */
// 沿曲線持續流動的粒子
function flowOn(curve, n, r, col, emis, speed = 0.2, jit = 0) {
  const m = particles(n, r, col, emis); m.frustumCulled = false;
  const rr = rnd(n * 13 + 7), off = new Array(n).fill(0).map(() => V(rr() - 0.5, rr() - 0.5, rr() - 0.5).multiplyScalar(jit * 2));
  m.u = 0; m.on = true; m.curve = curve; m.speed = speed;
  m.run = d => {
    m.u += d * m.speed;
    for (let i = 0; i < n; i++) { const k = (m.u + i / n) % 1; m.setP(i, m.on ? m.curve.getPointAt(k).add(off[i]) : HIDE); }
    m.instanceMatrix.needsUpdate = true;
  };
  return m;
}
// 一陣一陣釋放（脈衝）的粒子：emit(k) 釋出 k 顆，沿曲線 dur 秒走完
function puffer(curve, n, r, col, emis, dur = 2, jit = 0.15) {
  const m = particles(n, r, col, emis); m.frustumCulled = false;
  const rr = rnd(n * 7 + 3); m.items = []; m.curve = curve; m.dur = dur;
  m.emit = (k = 6) => { for (let i = 0; i < k; i++) m.items.push({ s: -i * 0.05, off: V(rr() - 0.5, rr() - 0.5, rr() - 0.5).multiplyScalar(jit * 2) }); };
  m.run = d => {
    m.items.forEach(it => it.s += d / m.dur); m.items = m.items.filter(it => it.s < 1);
    for (let i = 0; i < n; i++) { const it = m.items[i]; m.setP(i, it && it.s >= 0 ? m.curve.getPointAt(it.s).add(it.off) : HIDE); }
    m.instanceMatrix.needsUpdate = true;
  };
  return m;
}
// 隨機平滑曲線（微血管叢）：在橢球內隨機遊走
function tangle(c, rad, n, seed, steps = 7) {
  const rr = rnd(seed), out = [];
  for (let i = 0; i < n; i++) {
    const p = []; let x = (rr() - 0.5) * 1.6, y = (rr() - 0.5) * 1.6, z = (rr() - 0.5) * 1.6;
    for (let k = 0; k < steps; k++) {
      x = Math.max(-1, Math.min(1, x + (rr() - 0.5) * 0.9)); y = Math.max(-1, Math.min(1, y + (rr() - 0.5) * 0.9)); z = Math.max(-1, Math.min(1, z + (rr() - 0.5) * 0.9));
      p.push(V(c[0] + x * rad[0], c[1] + y * rad[1], c[2] + z * rad[2]));
    }
    out.push(p);
  }
  return out;
}
function glow(ms, hex) { [].concat(ms).forEach(m => m.material && m.material.emissive && m.material.emissive.setHex(hex)); }
// 依 0~1 強度設定自發光（不影響選取高亮的基準色）
function glowK(ms, col, k) { const c = new THREE.Color(col).multiplyScalar(k); [].concat(ms).forEach(m => m.material.emissive.copy(c)); }

/* ---------- 球棍分子 ---------- */
const ELC = { C: 0x8f9aa6, O: 0xff3b3b, N: 0x3f7bff, S: 0xffd43a, P: 0xff9a2a, H: 0xeeeeee };
const ELR = { C: 0.2, O: 0.23, N: 0.23, S: 0.27, P: 0.27, H: 0.13 };
// atoms: [[x,y,z,'C'],...]；bonds: [[i,j,鍵級]]；回傳網格陣列（未加入場景），out.P 為原子座標
function molMeshes(atoms, bonds, opt = {}) {
  const s = opt.s || 1, o = opt.o || 1;
  let P = atoms.map(a => V(a[0], a[1], a[2] || 0));
  if (opt.center !== false) { const c = V(0, 0, 0); P.forEach(p => c.add(p)); c.multiplyScalar(1 / P.length); P.forEach(p => p.sub(c)); }
  P = P.map(p => p.multiplyScalar(s));
  const groups = {}; atoms.forEach((a, i) => (groups[a[3]] = groups[a[3]] || []).push(i));
  const out = [];
  Object.keys(groups).forEach(el => out.push(dots(groups[el].map(i => P[i]), (ELR[el] || 0.2) * s * (opt.ar || 1), (el === 'C' && opt.col) ? opt.col : ELC[el], o, 16)));
  const items = [], br = (opt.br || 0.065) * s;
  bonds.forEach(([i, j, ord]) => {
    const a = P[i], b = P[j];
    if (ord === 2) {
      const d = b.clone().sub(a).normalize(); let n = d.clone().cross(V(0, 0, 1)); if (n.lengthSq() < 1e-3) n = d.clone().cross(V(1, 0, 0));
      n.normalize().multiplyScalar(br * 1.5);
      [1, -1].forEach(sg => items.push([new THREE.CylinderGeometry(br * 0.72, br * 0.72, 1, 8), segMtx(a.clone().addScaledVector(n, sg), b.clone().addScaledVector(n, sg))]));
    } else items.push([new THREE.CylinderGeometry(br, br, 1, 8), segMtx(a, b)]);
  });
  if (items.length) out.push(new THREE.Mesh(mergeGeo(items), mat(opt.bc || 0xcfd6dd, o)));
  out.P = P; return out;
}

/* ---------- 類固醇骨架（環 A B C D、碳 1–27） ---------- */
const STC = {
  1: [0, 1], 2: [-0.866, 0.5], 3: [-0.866, -0.5], 4: [0, -1], 5: [0.866, -0.5], 10: [0.866, 0.5],
  6: [1.732, -1], 7: [2.598, -0.5], 8: [2.598, 0.5], 9: [1.732, 1],
  11: [1.732, 2], 12: [2.598, 2.5], 13: [3.464, 2], 14: [3.464, 1],
  15: [4.415, 0.691], 16: [5.003, 1.5], 17: [4.415, 2.309]
};
const SPZ = { 1: 1, 5: 1, 3: 1, 9: 1, 7: 1, 12: 1, 14: 1, 2: -1, 4: -1, 10: -1, 6: -1, 8: -1, 11: -1, 13: -1, 15: -0.6, 16: 0.8, 17: -0.3 };
/* o: { ar 芳香 A 環, arB 芳香 B 環, d4, d5, d7 雙鍵, o3:'keto'|'ohb'|'oha'|'ome', o17:'ohb'|'oha'|'keto'|'acetyl'|'side',
        c20:'keto'|'oh', oh17a, oh16a, nor19(無 C19) } */
function steroid(o = {}) {
  const A = [], B = [], ix = {};
  const ad = (k, x, y, z, el = 'C') => { ix[k] = A.length; A.push([x, y, z, el]); return ix[k]; };
  for (let k = 1; k <= 17; k++) {
    let z = (SPZ[k] || 0) * 0.13;
    if (o.ar && [1, 2, 3, 4, 5, 10].includes(k)) z = 0;
    if (o.arB && [5, 6, 7, 8, 9, 10].includes(k)) z = 0;
    ad(k, STC[k][0], STC[k][1], z);
  }
  const rb = [[1, 2], [2, 3], [3, 4], [4, 5], [5, 10], [10, 1], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [9, 11], [11, 12], [12, 13], [13, 14], [14, 8], [13, 17], [17, 16], [16, 15], [15, 14]];
  const dbl = new Set();
  if (o.ar) ['1-2', '3-4', '5-10'].forEach(s => dbl.add(s));
  if (o.arB) ['6-7', '8-9'].forEach(s => dbl.add(s));
  if (o.d4) dbl.add('4-5'); if (o.d5) dbl.add('5-6'); if (o.d7) dbl.add('7-8');
  rb.forEach(([a, b]) => B.push([ix[a], ix[b], dbl.has(a + '-' + b) ? 2 : 1]));
  if (!o.ar && !o.nor19) { ad(19, 0.95, 0.72, 0.95); B.push([ix[10], ix[19], 1]); }
  ad(18, 3.55, 2.25, 0.95); B.push([ix[13], ix[18], 1]);
  // C3 取代基
  if (o.o3 === 'keto') { ad('O3', -1.74, -1.0, 0, 'O'); B.push([ix[3], ix.O3, 2]); }
  else if (o.o3 === 'oha') { ad('O3', -1.62, -0.95, -0.5, 'O'); B.push([ix[3], ix.O3, 1]); }
  else if (o.o3 === 'ome') { ad('O3', -1.62, -0.95, 0.2, 'O'); B.push([ix[3], ix.O3, 1]); ad('CM', -2.45, -0.45, 0.25); B.push([ix.O3, ix.CM, 1]); }
  else if (o.o3) { ad('O3', -1.62, -0.95, 0.42, 'O'); B.push([ix[3], ix.O3, 1]); }
  // C17 取代基
  if (o.o17 === 'ohb') { ad('O17', 4.72, 3.18, 0.55, 'O'); B.push([ix[17], ix.O17, 1]); }
  else if (o.o17 === 'oha') { ad('O17', 4.72, 3.1, -0.7, 'O'); B.push([ix[17], ix.O17, 1]); }
  else if (o.o17 === 'keto') { ad('O17', 4.75, 3.25, -0.05, 'O'); B.push([ix[17], ix.O17, 2]); }
  else if (o.o17 === 'acetyl' || o.o17 === 'side') {
    ad(20, 4.75, 3.25, 0.45); B.push([ix[17], ix[20], 1]);
    ad(21, 4.0, 3.85, 0.65); B.push([ix[20], ix[21], 1]);
    if (o.o17 === 'acetyl') { ad('O20', 5.62, 3.62, 0.35, 'O'); B.push([ix[20], ix.O20, o.c20 === 'oh' ? 1 : 2]); }
    else {
      [[22, 5.65, 3.6, 0.35], [23, 6.5, 3.1, 0.4], [24, 7.4, 3.45, 0.35], [25, 8.25, 2.95, 0.4], [26, 9.15, 3.3, 0.4], [27, 8.25, 2.0, 0.4]]
        .forEach(([k, x, y, z]) => ad(k, x, y, z));
      [[20, 22], [22, 23], [23, 24], [24, 25], [25, 26], [25, 27]].forEach(([a, b]) => B.push([ix[a], ix[b], 1]));
    }
  }
  if (o.oh17a) { ad('O17a', 4.55, 2.6, -1.0, 'O'); B.push([ix[17], ix.O17a, 1]); }
  if (o.oh16a) { ad('O16', 5.9, 1.55, -0.5, 'O'); B.push([ix[16], ix.O16, 1]); }
  return { atoms: A, bonds: B, ix };
}
const STEROIDS = {
  chol: { zh: '膽固醇', en: 'Cholesterol', o: { d5: true, o3: 'ohb', o17: 'side' } },
  preg: { zh: '孕烯醇酮', en: 'Pregnenolone', o: { d5: true, o3: 'ohb', o17: 'acetyl' } },
  P4: { zh: '助孕酮', en: 'Progesterone (P₄)', o: { d4: true, o3: 'keto', o17: 'acetyl' } },
  OHP17: { zh: '17α-羥助孕酮', en: '17α-Hydroxyprogesterone', o: { d4: true, o3: 'keto', o17: 'acetyl', oh17a: true } },
  OHP20: { zh: '20α-羥助孕酮', en: '20α-Hydroxyprogesterone', o: { d4: true, o3: 'keto', o17: 'acetyl', c20: 'oh' } },
  DHEA: { zh: '脫氫表雄固酮', en: 'DHEA', o: { d5: true, o3: 'ohb', o17: 'keto' } },
  A5: { zh: '雄烯二醇', en: 'Androstenediol (A₅)', o: { d5: true, o3: 'ohb', o17: 'ohb' } },
  A4: { zh: '雄烯二酮', en: 'Androstenedione (A₄)', o: { d4: true, o3: 'keto', o17: 'keto' } },
  T: { zh: '睪固酮', en: 'Testosterone', o: { d4: true, o3: 'keto', o17: 'ohb' } },
  DHT: { zh: '雙氫睪固酮', en: 'Dihydrotestosterone (DHT)', o: { o3: 'keto', o17: 'ohb' } },
  ADT: { zh: '雄固酮', en: 'Androsterone', o: { o3: 'oha', o17: 'keto' } },
  E2: { zh: '雌素二醇-17β', en: 'Estradiol-17β (E₂)', o: { ar: true, o3: 'ohb', o17: 'ohb' } },
  E2a: { zh: '雌素二醇-17α', en: 'Estradiol-17α', o: { ar: true, o3: 'ohb', o17: 'oha' } },
  E1: { zh: '雌素酮', en: 'Estrone (E₁)', o: { ar: true, o3: 'ohb', o17: 'keto' } },
  E3: { zh: '雌素三醇', en: 'Estriol (E₃)', o: { ar: true, o3: 'ohb', o17: 'ohb', oh16a: true } },
  EQN: { zh: '馬烯雌酮', en: 'Equilin', o: { ar: true, d7: true, o3: 'ohb', o17: 'keto' } },
  EQL: { zh: '馬萘雌酮', en: 'Equilenin', o: { ar: true, arB: true, o3: 'ohb', o17: 'keto' } }
};
function steroidMeshes(key, opt = {}) { const s = steroid(STEROIDS[key].o); return molMeshes(s.atoms, s.bonds, opt); }

/* ---------- 胜肽珠鏈 ---------- */
const AA_COL = {
  Cys: 0xffd43a, Tyr: 0x6fd06a, Ile: 0x4fa3ff, Gln: 0xff8ad8, Asn: 0xff9f6a, Pro: 0xb08cff, Leu: 0x3fd0c8, Gly: 0xd6d6d6,
  Phe: 0x2fc08a, Arg: 0x3f5cff, Lys: 0x7a8cff, His: 0x9ad0ff, Trp: 0x1f9a60, Ser: 0xff7f7f, pGlu: 0xffb04a, Thr: 0xff9090, NH2: 0xffffff
};
// names: 胺基酸名稱陣列；pts: 各珠中心座標
function beadChain(names, pts, r = 0.42) {
  const P = pts.map(P3), beads = names.map((n, i) => ell(P[i].toArray(), [r, r, r], AA_COL[n] || 0xcccccc));
  const items = []; for (let i = 0; i < P.length - 1; i++) items.push([new THREE.CylinderGeometry(r * 0.22, r * 0.22, 1, 8), segMtx(P[i], P[i + 1])]);
  const stick = new THREE.Mesh(mergeGeo(items), mat(0xe8e8e8));
  return { beads, stick, P };
}

/* ---------- 醣蛋白（α/β 次單位 + 醣鏈） ---------- */
function glycoprotein(c, colA, colB, opt = {}) {
  const s = opt.s || 1, cx = c[0], cy = c[1], cz = c[2] || 0;
  const a = ell([cx - 0.75 * s, cy, cz], [1.0 * s, 1.25 * s, 0.9 * s], colA), b = ell([cx + 0.75 * s, cy + 0.1 * s, cz], [1.05 * s, 1.4 * s, 0.95 * s], colB);
  // 醣鏈：分枝的小六角珠
  const rr = rnd(opt.seed || 5), pts = [], n = opt.sugars || 4;
  for (let i = 0; i < n; i++) {
    const side = i % 2 ? 1 : -1, base = V(cx + side * (0.9 + rr() * 0.6) * s, cy + (rr() - 0.3) * 1.6 * s, cz + (rr() - 0.5) * 1.4 * s);
    const dir = V(side * 0.6, 0.6 + rr() * 0.4, (rr() - 0.5) * 0.6).normalize();
    let p = base.clone(); for (let k = 0; k < 3; k++) { p = p.clone().addScaledVector(dir, 0.38 * s); pts.push(p); }
    pts.push(p.clone().add(V(0.3 * s * side, 0.25 * s, 0.2 * s)), p.clone().add(V(-0.1 * s * side, 0.35 * s, -0.25 * s)));
  }
  const sug = dots(pts, 0.17 * s, opt.sugCol || 0x9fe3ff, 1, 6);
  return { a, b, sug, pts };
}

/* ---------- 簡易神經元 ---------- */
function neuronM(c, col, opt = {}) {
  const s = opt.s || 1, rr = rnd(opt.seed || 3), C = V(...c), out = [ell(c, [0.55 * s, 0.5 * s, 0.5 * s], col)];
  const n = opt.dend || 5;
  for (let i = 0; i < n; i++) {
    const a = i / n * Math.PI * 2 + rr(), d = V(Math.cos(a), Math.sin(a) * 0.8, (rr() - 0.5) * 0.8).normalize();
    out.push(ttube([C, C.clone().addScaledVector(d, 0.8 * s), C.clone().addScaledVector(d, 1.3 * s).add(V(0, (rr() - 0.5) * 0.4 * s, 0))], [0.12 * s, 0.03 * s], col, 1, { organic: false }));
  }
  return out;
}

/* ---------- 圖表（右側面板） ---------- */
function chartBox(box, h = 140) {
  const c = document.createElement('canvas'); c.width = 600; c.height = h * 2; c.style.height = h + 'px'; box.appendChild(c);
  return { c, g: c.getContext('2d'), W: 600, H: h * 2 };
}
// series: [{ f: x(0..1)=>y(0..1), col, label, w }]；opt: { cursor, xl, yl, grid }
function drawChart(ch, series, opt = {}) {
  const { g, W, H } = ch, L = 50, R = W - 12, T = 16, Bm = H - 34;
  g.clearRect(0, 0, W, H); g.fillStyle = '#0a1420'; g.fillRect(0, 0, W, H);
  g.strokeStyle = '#2c4560'; g.lineWidth = 1;
  for (let i = 0; i <= 4; i++) { const y = T + (Bm - T) * i / 4; g.beginPath(); g.moveTo(L, y); g.lineTo(R, y); g.stroke(); }
  g.strokeStyle = '#6a87a3'; g.beginPath(); g.moveTo(L, T); g.lineTo(L, Bm); g.lineTo(R, Bm); g.stroke();
  g.font = '20px "Microsoft JhengHei",sans-serif'; g.fillStyle = '#9fb6c8';
  if (opt.xl) g.fillText(opt.xl, L + 4, H - 8);
  if (opt.yl) { g.save(); g.translate(18, (T + Bm) / 2 + 30); g.rotate(-Math.PI / 2); g.fillText(opt.yl, 0, 0); g.restore(); }
  if (opt.marks) opt.marks.forEach(([x, t]) => { const X = L + (R - L) * x; g.strokeStyle = '#ffd47955'; g.setLineDash([6, 6]); g.beginPath(); g.moveTo(X, T); g.lineTo(X, Bm); g.stroke(); g.setLineDash([]); g.fillStyle = '#ffd479'; g.fillText(t, X + 3, T + 18); });
  if (opt.thr !== undefined) { const Y = Bm - (Bm - T) * opt.thr; g.strokeStyle = '#ff808088'; g.setLineDash([8, 6]); g.beginPath(); g.moveTo(L, Y); g.lineTo(R, Y); g.stroke(); g.setLineDash([]); g.fillStyle = '#ff9a9a'; g.fillText(opt.thrL || '閾值', R - 70, Y - 6); }
  let lx = L + 8;
  series.forEach(s => {
    g.strokeStyle = s.col; g.lineWidth = s.w || 3; g.beginPath();
    for (let i = 0; i <= 300; i++) { const x = i / 300, y = Math.max(0, Math.min(1.05, s.f(x))), X = L + (R - L) * x, Y = Bm - (Bm - T) * y; i ? g.lineTo(X, Y) : g.moveTo(X, Y); }
    g.stroke();
    if (s.label) { g.fillStyle = s.col; g.fillText(s.label, lx, T + 20 + (opt.marks ? 22 : 0)); lx += g.measureText(s.label).width + 18; }
  });
  if (opt.cursor !== undefined) { const X = L + (R - L) * opt.cursor; g.strokeStyle = '#ffffffaa'; g.lineWidth = 2; g.beginPath(); g.moveTo(X, T); g.lineTo(X, Bm); g.stroke(); }
}
// 水平長條（數值 0..1）
function drawBars(ch, bars) {
  const { g, W, H } = ch; g.clearRect(0, 0, W, H); g.fillStyle = '#0a1420'; g.fillRect(0, 0, W, H);
  const n = bars.length, h = (H - 10) / n; g.font = '22px "Microsoft JhengHei",sans-serif';
  bars.forEach((b, i) => {
    const y = 5 + i * h; g.fillStyle = '#c4d4e2'; g.fillText(b.label, 8, y + h * 0.62);
    g.fillStyle = '#1f3a55'; g.fillRect(170, y + h * 0.2, W - 190, h * 0.6);
    g.fillStyle = b.col; g.fillRect(170, y + h * 0.2, (W - 190) * Math.max(0, Math.min(1, b.v)), h * 0.6);
    if (b.txt) { g.fillStyle = '#fff'; g.fillText(b.txt, 178, y + h * 0.62); }
  });
}
// 下拉選單
function selectBox(box, label, opts, on) {
  const w = document.createElement('label'); const s = document.createElement('select');
  opts.forEach(([v, t]) => { const o = document.createElement('option'); o.value = v; o.textContent = t; s.appendChild(o); });
  s.onchange = () => on(s.value); w.append(label + '：', s); box.appendChild(w); return s;
}
// 讓 text sprite 跟隨位置
function follow(sp, p, dy = 0.7) { sp.position.copy(p); sp.position.y += dy; }
// 細胞剖面殼（前方開窗）
function cellShell(c, sc, col, o = 0.22, cut = 1.1) {
  const m = shell(1, sc, col, o, Math.PI / 2 + cut / 2, Math.PI * 2 - cut);
  m.position.set(c[0], c[1], c[2] || 0); return m;
}
// 平台（分區底座）
function platform(c, r, col, o = 0.5) { const m = disc(r, 0.15, col, o); m.rotation.x = -Math.PI / 2; m.position.set(c[0], c[1], c[2] || 0); return m; }

/* ---------- 鏡頭自動取景：camera.fit = [半寬, 半高]（世界座標） ---------- */
function camFit(c) {
  if (!c.fit) return c.pos;
  const dir = V(...c.pos).sub(V(...c.target)).normalize(), t = Math.tan(camera.fov * Math.PI / 360);
  const need = Math.max(c.fit[1] / t, c.fit[0] / (t * camera.aspect));
  return V(...c.target).addScaledVector(dir, need).toArray();
}
function flyHome() { const c = SCENES[curIdx].camera; flyTo(camFit(c), c.target); }
// 以「半寬、半高」取景飛到某處
function flyFit(target, half, dir = [0, 0.25, 1]) { flyTo(camFit({ pos: V(...target).add(V(...dir)).toArray(), target, fit: half }), target); }

/* ---------- 文字看板（加半透明底板，較易閱讀） ---------- */
window.textSprite = function (txt, pos, h = 0.3, color = '#ffd479', sub) {
  const cv = document.createElement('canvas'), ctx = cv.getContext('2d'), F = 64, bg = h >= 0.38;
  const f1 = 'bold ' + F + 'px "Microsoft JhengHei","PingFang TC",sans-serif', f2 = Math.round(F * 0.56) + 'px "Microsoft JhengHei","PingFang TC",sans-serif';
  ctx.font = f1; const w1 = ctx.measureText(txt).width; let w2 = 0; if (sub) { ctx.font = f2; w2 = ctx.measureText(sub).width; }
  cv.width = Math.ceil(Math.max(w1, w2) + 40); cv.height = Math.ceil(sub ? F * 2.1 : F * 1.4);
  if (bg) {
    const r = 18, W = cv.width, H = cv.height; ctx.fillStyle = 'rgba(8,18,32,0.62)'; ctx.strokeStyle = 'rgba(140,180,220,0.35)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(r, 2); ctx.lineTo(W - r, 2); ctx.quadraticCurveTo(W - 2, 2, W - 2, r); ctx.lineTo(W - 2, H - r); ctx.quadraticCurveTo(W - 2, H - 2, W - r, H - 2);
    ctx.lineTo(r, H - 2); ctx.quadraticCurveTo(2, H - 2, 2, H - r); ctx.lineTo(2, r); ctx.quadraticCurveTo(2, 2, r, 2); ctx.fill(); ctx.stroke();
  }
  ctx.textBaseline = 'top'; ctx.font = f1; ctx.fillStyle = color;
  if (!bg) { ctx.lineWidth = 8; ctx.strokeStyle = 'rgba(0,0,0,0.75)'; ctx.strokeText(txt, 20, 10); }
  ctx.fillText(txt, 20, 10);
  if (sub) { ctx.font = f2; ctx.fillStyle = '#a8dcff'; ctx.fillText(sub, 20, F * 1.3); }
  const tex = new THREE.CanvasTexture(cv); tex.encoding = THREE.sRGBEncoding; tex.anisotropy = 4;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false, toneMapped: false }));
  sp.scale.set(h * cv.width / cv.height, h, 1); sp.position.set(pos[0], pos[1], pos[2] || 0); sp.renderOrder = 10;
  CUR.root.add(sp); return sp;
};

/* ---------- 貼在平面上的文字（節點名牌） ---------- */
function labelPlane(t1, t2, w, h, pos, o = {}) {
  const K = 160, cv = document.createElement('canvas'); cv.width = Math.round(K * w); cv.height = Math.round(K * h);
  const g = cv.getContext('2d'); g.textAlign = 'center'; g.textBaseline = 'middle';
  let fs = Math.round(cv.height * (t2 ? 0.44 : 0.58));
  do { g.font = 'bold ' + fs + 'px "Microsoft JhengHei","PingFang TC",sans-serif'; } while (g.measureText(t1).width > cv.width * 0.92 && --fs > 8);
  g.fillStyle = o.c1 || '#ffffff'; g.fillText(t1, cv.width / 2, cv.height * (t2 ? 0.37 : 0.52));
  if (t2) { let f2 = Math.round(cv.height * 0.25); do { g.font = f2 + 'px "Segoe UI",sans-serif'; } while (g.measureText(t2).width > cv.width * 0.92 && --f2 > 6); g.fillStyle = o.c2 || '#d8ecff'; g.fillText(t2, cv.width / 2, cv.height * 0.77); }
  const tex = new THREE.CanvasTexture(cv); tex.encoding = THREE.sRGBEncoding; tex.anisotropy = 8;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false, depthWrite: false }));
  m.position.set(pos[0], pos[1], pos[2] || 0); m.renderOrder = 5; CUR.root.add(m); return m;
}
