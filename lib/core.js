/* 共用工具：材質、幾何輔助函式、構造註冊 */
const SCENES = [];
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const PV = arr => arr.map(p => new THREE.Vector3(p[0], p[1], p[2] || 0));
const CUR = { parts: [], root: null, dt: 0.016 };

function mat(c, o = 1, extra = {}) {
  const m = new THREE.MeshStandardMaterial(Object.assign({
    color: c, roughness: 0.55, metalness: 0.0, transparent: o < 1, opacity: o,
    depthWrite: o >= 0.9, side: THREE.DoubleSide
  }, extra));
  m.userData.hex = typeof c === 'number' ? c : null;
  return m;
}
const _sph = new THREE.SphereGeometry(1, 32, 22); _sph.userData.shared = true;
// 橢球
function ell(pos, sc, col, o = 1) {
  const m = new THREE.Mesh(_sph, mat(col, o));
  m.position.set(pos[0], pos[1], pos[2] || 0);
  m.scale.set(sc[0], sc[1], sc[2]);
  return m;
}
// 沿點列的管子（Catmull-Rom）
function tube(pts, r, col, o = 1, segMul = 10) {
  const p = (pts[0] && pts[0].isVector3) ? pts : PV(pts);
  const curve = new THREE.CatmullRomCurve3(p, false, 'centripetal');
  const g = new THREE.TubeGeometry(curve, Math.max(12, p.length * segMul), r, 10, false);
  const m = new THREE.Mesh(g, mat(col, o));
  m.userData.curve = curve;
  return m;
}
// 沿曲線外圍的螺旋點列（用於動脈纏繞、附睪迂曲等）
function helixAlong(curve, rad, turns, phase = 0, n = 300) {
  const frames = curve.computeFrenetFrames(n, false);
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, p = curve.getPointAt(t);
    const a = phase + t * turns * Math.PI * 2;
    pts.push(p.clone().addScaledVector(frames.normals[i], Math.cos(a) * rad)
      .addScaledVector(frames.binormals[i], Math.sin(a) * rad));
  }
  return pts;
}
function lineCurve(a, b) { return new THREE.LineCurve3(V(...a), V(...b)); }
// 環形（括約肌）
function ring(pos, tangent, R, r, col, o = 1) {
  const P = pos.isVector3 ? pos : V(...pos), T = tangent.isVector3 ? tangent : V(...tangent);
  const m = new THREE.Mesh(new THREE.TorusGeometry(R, r, 12, 32), mat(col, o));
  m.position.copy(P);
  m.quaternion.setFromUnitVectors(V(0, 0, 1), T.clone().normalize());
  return m;
}
// 圓環柱（沿 +z 擠出）
function annulus(ro, ri, len, col, o = 1, z0 = 0) {
  const s = new THREE.Shape(); s.absarc(0, 0, ro, 0, Math.PI * 2, false);
  if (ri > 0) { const h = new THREE.Path(); h.absarc(0, 0, ri, 0, Math.PI * 2, true); s.holes.push(h); }
  const g = new THREE.ExtrudeGeometry(s, { depth: len, bevelEnabled: false, curveSegments: 48 });
  const m = new THREE.Mesh(g, mat(col, o)); m.position.z = z0; return m;
}
// 實心圓柱（沿 +z）
function disc(r, len, col, o = 1, x = 0, y = 0, z0 = 0) {
  const m = annulus(r, 0, len, col, o, z0); m.position.x = x; m.position.y = y; return m;
}
// 兩點間圓柱
function cyl(a, b, r, col, o = 1) {
  const A = V(...a), B = V(...b), d = B.clone().sub(A);
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, d.length(), 16), mat(col, o));
  m.position.copy(A.clone().add(B).multiplyScalar(0.5));
  m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize());
  return m;
}
function cone(a, b, r, col, o = 1) { // 底在 a、尖在 b
  const A = V(...a), B = V(...b), d = B.clone().sub(A);
  const m = new THREE.Mesh(new THREE.ConeGeometry(r, d.length(), 16), mat(col, o));
  m.position.copy(A.clone().add(B).multiplyScalar(0.5));
  m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize());
  return m;
}
// 部分球殼（開窗剖面用）
function shell(r, sc, col, o, phiStart, phiLen, thStart = 0, thLen = Math.PI) {
  const g = new THREE.SphereGeometry(r, 48, 32, phiStart, phiLen, thStart, thLen);
  const m = new THREE.Mesh(g, mat(col, o)); m.scale.set(sc[0], sc[1], sc[2]); return m;
}
function rnd(seed) { // 可重現亂數
  let s = seed || 1;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

/**
 * 註冊一個解剖構造
 * @param grp 分組名稱  zh 中文名  en 英文名  info 功能說明(HTML)
 * @param meshes Mesh 或陣列  opt {anchor:[x,y,z], hidden, nolabel}
 */
function reg(grp, zh, en, info, meshes, opt = {}) {
  meshes = [].concat(meshes);
  const part = { grp, zh, en, info, meshes, visible: !opt.hidden, label: !opt.nolabel, anchor: null };
  meshes.forEach(m => { m.userData.part = part; if (!m.parent) CUR.root.add(m); });
  if (opt.anchor) part.anchor = V(...opt.anchor);
  else {
    const b = new THREE.Box3().setFromObject(meshes[0]);
    part.anchor = b.getCenter(new THREE.Vector3());
  }
  CUR.parts.push(part);
  return part;
}

/* ===== 管狀／曲面／文字擴充工具 ===== */
// 漸細管：rf 可為數字、[起,迄] 或 t=>半徑；opt {cap, seg, radial, closed}
function ttube(pts, rf, col, o = 1, opt = {}) {
  const p = (pts[0] && pts[0].isVector3) ? pts : PV(pts);
  const curve = new THREE.CatmullRomCurve3(p, !!opt.closed, 'centripetal');
  const n = opt.seg || Math.max(32, p.length * 16), rs = opt.radial || 16;
  const R = typeof rf === 'number' ? () => rf : (Array.isArray(rf) ? t => rf[0] + (rf[1] - rf[0]) * t : rf);
  const fr = curve.computeFrenetFrames(n, !!opt.closed);
  const pos = [], idx = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, c = curve.getPointAt(t), r = R(t);
    for (let j = 0; j <= rs; j++) {
      const a = j / rs * Math.PI * 2;
      const v = c.clone().addScaledVector(fr.normals[i], Math.cos(a) * r).addScaledVector(fr.binormals[i], Math.sin(a) * r);
      pos.push(v.x, v.y, v.z);
    }
  }
  for (let i = 0; i < n; i++) for (let j = 0; j < rs; j++) {
    const a = i * (rs + 1) + j, b = a + rs + 1;
    idx.push(a, b, a + 1, b, b + 1, a + 1);
  }
  if (opt.cap !== false) {
    [0, n].forEach(i => {
      const c = curve.getPointAt(i / n), ci = pos.length / 3;
      pos.push(c.x, c.y, c.z);
      for (let j = 0; j < rs; j++) idx.push(ci, i * (rs + 1) + j, i * (rs + 1) + j + 1);
    });
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx); g.computeVertexNormals();
  const m = new THREE.Mesh(g, mat(col, o));
  m.userData.curve = curve;
  return m;
}
// 兩條點列之間的薄膜（韌帶、系膜）
function ribbon(A, B, col, o = 0.3, rows = 6) {
  A = A.map(p => p.isVector3 ? p : V(...p)); B = B.map(p => p.isVector3 ? p : V(...p));
  const pos = [], idx = [], n = A.length;
  for (let i = 0; i < n; i++) for (let k = 0; k <= rows; k++) {
    const v = A[i].clone().lerp(B[i], k / rows); pos.push(v.x, v.y, v.z);
  }
  for (let i = 0; i < n - 1; i++) for (let k = 0; k < rows; k++) {
    const a = i * (rows + 1) + k, b = a + rows + 1;
    idx.push(a, b, a + 1, b, b + 1, a + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx); g.computeVertexNormals();
  return new THREE.Mesh(g, mat(col, o));
}
// 旋轉體：profile [[半徑, 高]...]，沿 +y 建立後轉向 dir
function lathe(profile, col, o = 1, pos = [0, 0, 0], dir = [0, 1, 0], seg = 40) {
  const g = new THREE.LatheGeometry(profile.map(p => new THREE.Vector2(p[0], p[1])), seg);
  const m = new THREE.Mesh(g, mat(col, o));
  m.position.set(...pos);
  m.quaternion.setFromUnitVectors(V(0, 1, 0), V(...dir).normalize());
  return m;
}
// 箱子
function box(c, s, col, o = 1) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(s[0], s[1], s[2]), mat(col, o));
  m.position.set(c[0], c[1], c[2]); return m;
}
// 半個環（只取背側 z<0 半圈），沿 y 軸環繞
function halfRing(c, R, r, col, o = 1) {
  const m = new THREE.Mesh(new THREE.TorusGeometry(R, r, 10, 28, Math.PI), mat(col, o));
  m.position.set(...c); m.rotation.x = -Math.PI / 2; return m;
}
// 半圓柱殼（背側半圈），沿 y 軸，y0→y1
function halfCyl(c, r0, r1, y0, y1, col, o = 1) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r0, y1 - y0, 32, 1, true, Math.PI / 2, Math.PI), mat(col, o));
  m.material.emissive.setHex(col).multiplyScalar(0.35);
  m.position.set(c[0], (y0 + y1) / 2, c[2] || 0); return m;
}
// 文字看板（非可點選構造）
function textSprite(txt, pos, h = 0.3, color = '#ffd479', sub) {
  const cv = document.createElement('canvas'), ctx = cv.getContext('2d');
  const F = 56; ctx.font = 'bold ' + F + 'px "Microsoft JhengHei",sans-serif';
  const w1 = ctx.measureText(txt).width; let w2 = 0;
  if (sub) { ctx.font = (F * 0.6) + 'px sans-serif'; w2 = ctx.measureText(sub).width; }
  cv.width = Math.ceil(Math.max(w1, w2) + 30); cv.height = sub ? F * 1.9 : F * 1.25;
  ctx.font = 'bold ' + F + 'px "Microsoft JhengHei",sans-serif'; ctx.fillStyle = color; ctx.textBaseline = 'top';
  ctx.fillText(txt, 15, 6);
  if (sub) { ctx.font = (F * 0.6) + 'px sans-serif'; ctx.fillStyle = '#8fd0ff'; ctx.fillText(sub, 15, F * 1.15); }
  const tex = new THREE.CanvasTexture(cv);
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
  sp.scale.set(h * cv.width / cv.height, h, 1); sp.position.set(...pos); sp.renderOrder = 10;
  CUR.root.add(sp); return sp;
}
// 將構造群組切換顯示
function setGrpVisible(test, on) { CUR.parts.forEach(p => { if (test(p)) p.visible = on; }); rebuildList(); refresh(); }
