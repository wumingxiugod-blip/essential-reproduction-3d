/* 共用工具：材質、進階生物幾何原語、構造註冊 */
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
  const g = new THREE.TubeGeometry(curve, Math.max(12, p.length * segMul), r, 14, false);
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
  const m = new THREE.Mesh(new THREE.TorusGeometry(R, r, 16, 40), mat(col, o));
  m.position.copy(P);
  m.quaternion.setFromUnitVectors(V(0, 0, 1), T.clone().normalize());
  return m;
}
// 圓環柱（沿 +z 擠出，帶微倒角）
function annulus(ro, ri, len, col, o = 1, z0 = 0) {
  const s = new THREE.Shape(); s.absarc(0, 0, ro, 0, Math.PI * 2, false);
  if (ri > 0) { const h = new THREE.Path(); h.absarc(0, 0, ri, 0, Math.PI * 2, true); s.holes.push(h); }
  const bv = Math.min(len * 0.14, (ro - ri) * 0.18, 0.08);
  const g = new THREE.ExtrudeGeometry(s, {
    depth: Math.max(0.01, len - bv * 2),
    bevelEnabled: bv > 0.008, bevelThickness: bv, bevelSize: bv, bevelSegments: 3, curveSegments: 48
  });
  const m = new THREE.Mesh(g, mat(col, o)); m.position.z = z0 + (bv > 0.008 ? bv : 0); return m;
}
// 實心圓柱（沿 +z）
function disc(r, len, col, o = 1, x = 0, y = 0, z0 = 0) {
  const m = annulus(r, 0, len, col, o, z0); m.position.x = x; m.position.y = y; return m;
}
// 兩點間圓柱
function cyl(a, b, r, col, o = 1) {
  const A = V(...a), B = V(...b), d = B.clone().sub(A);
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, d.length(), 18), mat(col, o));
  m.position.copy(A.clone().add(B).multiplyScalar(0.5));
  m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize());
  return m;
}
function cone(a, b, r, col, o = 1) { // 底在 a、尖在 b
  const A = V(...a), B = V(...b), d = B.clone().sub(A);
  const m = new THREE.Mesh(new THREE.ConeGeometry(r, d.length(), 18), mat(col, o));
  m.position.copy(A.clone().add(B).multiplyScalar(0.5));
  m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize());
  return m;
}
// 圓頭膠囊體（Three.js r128 相容：LatheGeometry 一體成型無接縫）
function capsuleGeo(r, len, seg = 20) {
  const half = Math.max(0, len / 2 - r);
  const pts = [];
  const capN = 8;
  for (let i = 0; i <= capN; i++) {
    const a = -Math.PI / 2 + (i / capN) * (Math.PI / 2);
    pts.push(new THREE.Vector2(Math.max(0.0001, Math.cos(a) * r), -half + Math.sin(a) * r));
  }
  for (let i = 0; i <= capN; i++) {
    const a = (i / capN) * (Math.PI / 2);
    pts.push(new THREE.Vector2(Math.max(0.0001, Math.cos(a) * r), half + Math.sin(a) * r));
  }
  return new THREE.LatheGeometry(pts, seg);
}
function capsule(a, b, r, col, o = 1) {
  const A = (a && a.isVector3) ? a : V(...a), B = (b && b.isVector3) ? b : V(...b);
  const d = B.clone().sub(A), L = d.length();
  const m = new THREE.Mesh(capsuleGeo(r, Math.max(L, r * 2), 20), mat(col, o));
  m.position.copy(A.clone().add(B).multiplyScalar(0.5));
  if (L > 1e-5) m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize());
  return m;
}

// 部分球殼（開窗剖面用：開窗時自動給予真實壁厚，告別薄紙感）
function shell(r, sc, col, o, phiStart, phiLen, thStart = 0, thLen = Math.PI) {
  if (phiLen !== undefined && phiLen < Math.PI * 1.98 && thStart === 0 && thLen >= Math.PI - 0.05) {
    return thickShell(r, sc, col, o, phiStart, phiLen, Math.min(0.1, r * 0.09), { uSeg: 40, vSeg: 24 });
  }
  const g = new THREE.SphereGeometry(r, 48, 32, phiStart, phiLen, thStart, thLen);
  const m = new THREE.Mesh(g, mat(col, o)); m.scale.set(sc[0], sc[1], sc[2]); return m;
}
// 有真實壁厚的開窗剖面球殼（內外雙層＋切口封邊）
function thickShell(r, sc, col, o = 1, phiStart = 0.5, phiLen = Math.PI * 1.65, wall = 0.14, opt = {}) {
  const thStart = opt.thStart !== undefined ? opt.thStart : 0.001;
  const thLen = opt.thLen !== undefined ? opt.thLen : Math.PI - 0.002;
  const uSeg = opt.uSeg || 48, vSeg = opt.vSeg || 28;
  const rOut = r, rIn = Math.max(0.05, r - wall);
  const pos = [], idx = [];
  const pushGrid = (rad, flip) => {
    const base = pos.length / 3;
    for (let iv = 0; iv <= vSeg; iv++) {
      const th = thStart + (iv / vSeg) * thLen;
      const sinT = Math.sin(th), cosT = Math.cos(th);
      for (let iu = 0; iu <= uSeg; iu++) {
        const ph = phiStart + (iu / uSeg) * phiLen;
        pos.push(-rad * Math.cos(ph) * sinT, rad * cosT, rad * Math.sin(ph) * sinT);
      }
    }
    for (let iv = 0; iv < vSeg; iv++) {
      for (let iu = 0; iu < uSeg; iu++) {
        const a = base + iv * (uSeg + 1) + iu;
        const b = a + uSeg + 1;
        if (!flip) idx.push(a, b, a + 1, b, b + 1, a + 1);
        else idx.push(a, a + 1, b, b, a + 1, b + 1);
      }
    }
    return base;
  };
  const bOut = pushGrid(rOut, false);
  const bIn = pushGrid(rIn, true);
  // 縫合兩條經線切口（iu = 0 與 iu = uSeg）
  if (phiLen < Math.PI * 1.999) {
    const stitchMeridian = (iu, flip) => {
      const base = pos.length / 3;
      const ph = phiStart + (iu / uSeg) * phiLen;
      const cP = Math.cos(ph), sP = Math.sin(ph);
      for (let iv = 0; iv <= vSeg; iv++) {
        const th = thStart + (iv / vSeg) * thLen;
        const sinT = Math.sin(th), cosT = Math.cos(th);
        pos.push(-rOut * cP * sinT, rOut * cosT, rOut * sP * sinT);
        pos.push(-rIn * cP * sinT, rIn * cosT, rIn * sP * sinT);
      }
      for (let iv = 0; iv < vSeg; iv++) {
        const a = base + iv * 2, b = a + 2;
        if (!flip) idx.push(a, a + 1, b, b, a + 1, b + 1);
        else idx.push(a, b, a + 1, b, b + 1, a + 1);
      }
    };
    stitchMeridian(0, false);
    stitchMeridian(uSeg, true);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  const m = new THREE.Mesh(g, mat(col, o));
  m.scale.set(sc[0], sc[1], sc[2]);
  return m;
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
  const part = {
    grp, zh, en, info, meshes, visible: !opt.hidden, label: !opt.nolabel, anchor: null,
    wall: !!opt.wall, wallO: opt.wallO !== undefined ? opt.wallO : 1, inner: !!opt.inner
  };
  meshes.forEach(m => { m.userData.part = part; if (!m.parent) CUR.root.add(m); });
  if (opt.anchor) part.anchor = V(...opt.anchor);
  else {
    const b = new THREE.Box3().setFromObject(meshes[0]);
    part.anchor = b.getCenter(new THREE.Vector3());
  }
  CUR.parts.push(part);
  return part;
}

/* ===== 管狀／曲面／生物造型擴充工具 ===== */
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
// 倒角圓角方塊幾何（自動消除 90° 硬邊積木感）
function roundedBoxGeo(w, h, d, radius) {
  const r = Math.min(radius !== undefined ? radius : Math.min(w, h, d) * 0.16, w * 0.42, h * 0.42, d * 0.42);
  if (r < 0.015) return new THREE.BoxGeometry(w, h, d);
  const x = -w / 2 + r, y = -h / 2 + r, W = w - r * 2, H = h - r * 2;
  const s = new THREE.Shape();
  s.moveTo(x, y - r);
  s.lineTo(x + W, y - r);
  s.quadraticCurveTo(x + W + r, y - r, x + W + r, y);
  s.lineTo(x + W + r, y + H);
  s.quadraticCurveTo(x + W + r, y + H + r, x + W, y + H + r);
  s.lineTo(x, y + H + r);
  s.quadraticCurveTo(x - r, y + H + r, x - r, y + H);
  s.lineTo(x - r, y);
  s.quadraticCurveTo(x - r, y - r, x, y - r);
  const depth = Math.max(0.01, d - r * 2);
  const g = new THREE.ExtrudeGeometry(s, {
    depth, bevelEnabled: true, bevelThickness: r, bevelSize: r, bevelSegments: 3, curveSegments: 6
  });
  g.translate(0, 0, -depth / 2);
  g.computeVertexNormals();
  return g;
}
// 箱子（預設升級為倒角圓角有機塊）
function box(c, s, col, o = 1, opt = {}) {
  const g = opt.sharp ? new THREE.BoxGeometry(s[0], s[1], s[2]) : roundedBoxGeo(s[0], s[1], s[2], opt.r);
  const m = new THREE.Mesh(g, mat(col, o));
  m.position.set(c[0], c[1], c[2] || 0); return m;
}
// 有機組織切片層（細分頂面波浪起伏＋柔和圓角，適合基質、基底膜、內膜層）
function tissueSlab(c, s, col, o = 1, opt = {}) {
  const [w, h, d] = s;
  const g = new THREE.BoxGeometry(w, h, d, opt.sx || 24, opt.sy || 6, opt.sz || 10);
  const p = g.attributes.position;
  const wave = opt.wave !== undefined ? opt.wave : Math.min(h * 0.16, 0.14);
  const freq = opt.freq || 1.2, seed = opt.seed || 1.7;
  const rEdge = Math.min(w, h, d) * (opt.round !== undefined ? opt.round : 0.18);
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    // 柔化外緣角落
    const nx = x / (w / 2 || 1), ny = y / (h / 2 || 1), nz = z / (d / 2 || 1);
    const corner = Math.max(0, (nx * nx + ny * ny + nz * nz) - 1.35);
    if (corner > 0) {
      const shrink = 1 - Math.min(0.14, corner * 0.075);
      x *= shrink; y *= shrink; z *= shrink;
    }
    // 頂／底表層有機起伏
    if (wave > 0) {
      const und = (Math.sin(x * freq + seed) * Math.cos(z * freq * 0.8 + seed * 0.7) + 0.45 * Math.sin(x * freq * 2.1 - z * freq)) * wave;
      if (!opt.flatBottom || y > 0) y += und * (opt.topOnly ? Math.max(0, ny) : 1);
    }
    p.setXYZ(i, x, y, z);
  }
  p.needsUpdate = true;
  g.computeVertexNormals();
  const m = new THREE.Mesh(g, mat(col, o));
  m.position.set(c[0], c[1], c[2] || 0);
  return m;
}
// 雙凹圓盤紅血球（InstancedMesh）
function rbcDiscs(pts, r = 0.18, col = 0xe83b4a, o = 1) {
  const prof = [];
  const N = 16;
  for (let i = 0; i <= N; i++) {
    const t = i / N; // 0..1 對應角 -PI/2..PI/2
    const u = Math.sin(t * Math.PI); // 徑向 0..1..0
    const rad = Math.max(0.001, u * r);
    // 經典紅血球雙凹輪廓
    const thick = r * (0.14 + 0.34 * u * u - 0.18 * Math.pow(u, 4)) * (t < 0.5 ? -1 : 1);
    prof.push(new THREE.Vector2(rad, thick));
  }
  const g = new THREE.LatheGeometry(prof, 18);
  const m = new THREE.InstancedMesh(g, mat(col, o), Math.max(1, pts.length));
  const d = new THREE.Object3D(), rr = rnd(pts.length * 19 + 3);
  pts.forEach((pt, i) => {
    d.position.copy(pt.isVector3 ? pt : V(...pt));
    d.rotation.set(Math.PI / 2 + (rr() - 0.5) * 0.7, (rr() - 0.5) * 0.7, (rr() - 0.5) * 0.7);
    d.scale.setScalar(1); d.updateMatrix(); m.setMatrixAt(i, d.matrix);
  });
  m.count = pts.length; m.instanceMatrix.needsUpdate = true; m.frustumCulled = false;
  return m;
}
// 柱狀上皮細胞列（獨立圓角柱狀細胞＋基底核＋可選微絨毛／胞飲突）
function epitheliumRow(opt) {
  const x0 = opt.x0, x1 = opt.x1, y = opt.y, z0 = opt.z0 !== undefined ? opt.z0 : -0.9, z1 = opt.z1 !== undefined ? opt.z1 : 0.9;
  const h = opt.h || 0.82, nx = opt.nx || 10, nz = opt.nz || 3;
  const gap = opt.gap || 0.04, col = opt.col || 0xe8889a, nucCol = opt.nucCol || 0x5c4a9c, o = opt.o !== undefined ? opt.o : 0.88;
  const cw = (x1 - x0) / nx - gap, cd = (z1 - z0) / nz - gap;
  const cellGeo = roundedBoxGeo(cw, h, cd, Math.min(cw, h, cd) * 0.28);
  const nucGeo = new THREE.SphereGeometry(Math.min(cw, cd) * 0.28, 12, 10);
  const matsC = [], matsN = [], dum = new THREE.Object3D();
  for (let ix = 0; ix < nx; ix++) {
    const cx = x0 + (ix + 0.5) * ((x1 - x0) / nx);
    if (opt.skip && opt.skip(cx, ix)) continue;
    for (let iz = 0; iz < nz; iz++) {
      const cz = z0 + (iz + 0.5) * ((z1 - z0) / nz);
      dum.position.set(cx, y, cz); dum.scale.set(1, 1, 1); dum.rotation.set(0, 0, 0); dum.updateMatrix();
      matsC.push(dum.matrix.clone());
      dum.position.set(cx, y - h * 0.18, cz); dum.scale.set(1, 1.35, 1); dum.updateMatrix();
      matsN.push(dum.matrix.clone());
    }
  }
  const cells = new THREE.InstancedMesh(cellGeo, mat(col, o), Math.max(1, matsC.length));
  matsC.forEach((mt, i) => cells.setMatrixAt(i, mt));
  cells.count = matsC.length; cells.instanceMatrix.needsUpdate = true; cells.frustumCulled = false;
  const nucs = new THREE.InstancedMesh(nucGeo, mat(nucCol, 0.95), Math.max(1, matsN.length));
  matsN.forEach((mt, i) => nucs.setMatrixAt(i, mt));
  nucs.count = matsN.length; nucs.instanceMatrix.needsUpdate = true; nucs.frustumCulled = false;
  return [cells, nucs];
}
// 哺乳動物扁平梨形／匙形精子頭部幾何（中心在原點，前端朝 -X，後端植入窩朝 +X）
function spermHeadGeo(len = 2.3, width = 1.35, thick = 0.48) {
  const g = new THREE.SphereGeometry(1, 36, 24);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    // x in [-1, 1]: -1 = 前端頂體尖端, +1 = 後端植入窩
    const t = (x + 1) * 0.5; // 0 (front) -> 1 (rear)
    // 寬度輪廓：前尖、中前寬、後端收窄呈匙形
    const wProf = Math.pow(Math.sin(Math.pow(t, 0.72) * Math.PI), 0.78);
    // 厚度輪廓：前端扁薄如刃、中後端略厚容納濃縮核
    const zProf = (0.35 + 0.85 * Math.pow(t, 0.9)) * Math.sin(t * Math.PI);
    const sx = x * (len * 0.5);
    let sy = y * (width * 0.5) * (0.25 + 0.78 * wProf) / Math.max(0.2, Math.sqrt(Math.max(0.04, 1 - x * x)));
    let sz = z * (thick * 0.5) * (0.22 + 0.85 * zProf) / Math.max(0.2, Math.sqrt(Math.max(0.04, 1 - x * x)));
    // 限制極點平滑收斂
    const rYZ = Math.sqrt(y * y + z * z);
    sy = rYZ > 1e-4 ? (y / rYZ) * Math.min(Math.abs(sy), width * 0.52) : 0;
    sz = rYZ > 1e-4 ? (z / rYZ) * Math.min(Math.abs(sz), thick * 0.55) : 0;
    // 後端植入窩微凹
    const fossa = t > 0.88 ? -0.14 * Math.pow((t - 0.88) / 0.12, 2) * (1 - rYZ) : 0;
    p.setXYZ(i, sx + fossa, sy, sz);
  }
  p.needsUpdate = true;
  g.computeVertexNormals();
  return g;
}
// 貼合扁平精子頭前 2/3 的頂體帽幾何
function spermAcrosomeGeo(len = 2.42, width = 1.44, thick = 0.54, cutT = 0.62) {
  const uSeg = 32, vSeg = 22;
  const pos = [], idx = [];
  const evalPt = (t, ang, scale) => {
    const x = (t * 2 - 1) * (len * 0.5);
    const wProf = Math.pow(Math.sin(Math.pow(Math.max(0.001, Math.min(0.999, t)), 0.72) * Math.PI), 0.78);
    const zProf = (0.35 + 0.85 * Math.pow(t, 0.9)) * Math.sin(t * Math.PI);
    const ry = (width * 0.5) * (0.04 + 0.96 * wProf) * scale;
    const rz = (thick * 0.5) * (0.04 + 0.96 * zProf) * scale;
    return [x, Math.cos(ang) * ry, Math.sin(ang) * rz];
  };
  const pushLayer = (scale, flip) => {
    const base = pos.length / 3;
    for (let iv = 0; iv <= vSeg; iv++) {
      const t = 0.002 + (iv / vSeg) * (cutT - 0.002);
      for (let iu = 0; iu <= uSeg; iu++) {
        const ang = (iu / uSeg) * Math.PI * 2;
        pos.push(...evalPt(t, ang, scale));
      }
    }
    for (let iv = 0; iv < vSeg; iv++) {
      for (let iu = 0; iu < uSeg; iu++) {
        const a = base + iv * (uSeg + 1) + iu, b = a + uSeg + 1;
        if (!flip) idx.push(a, a + 1, b, b, a + 1, b + 1);
        else idx.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
  };
  pushLayer(1.06, false);
  pushLayer(0.94, true);
  // 縫合後緣切口
  const rimBase = pos.length / 3;
  for (let iu = 0; iu <= uSeg; iu++) {
    const ang = (iu / uSeg) * Math.PI * 2;
    pos.push(...evalPt(cutT, ang, 1.06));
    pos.push(...evalPt(cutT, ang, 0.94));
  }
  for (let iu = 0; iu < uSeg; iu++) {
    const a = rimBase + iu * 2, b = a + 2;
    idx.push(a, b, a + 1, b, b + 1, a + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}
// 連續漸細波動鞭毛（每幀直接更新頂點，消除節段斷裂感）
function waveTail(x0, y0, z0, len, r0, r1, col, o = 0.95, segs = 40, radial = 12) {
  const pos = new Float32Array((segs + 1) * (radial + 1) * 3);
  const idx = [];
  for (let i = 0; i < segs; i++) for (let j = 0; j < radial; j++) {
    const a = i * (radial + 1) + j, b = a + radial + 1;
    idx.push(a, b, a + 1, b, b + 1, a + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setIndex(idx);
  const m = new THREE.Mesh(g, mat(col, o));
  m.updateWave = (phase, amp = 0.42, freq = 7.5) => {
    const arr = g.attributes.position.array;
    for (let i = 0; i <= segs; i++) {
      const f = i / segs;
      const cx = x0 + f * len;
      const a = amp * Math.pow(f, 1.25);
      const cy = y0 + Math.sin(phase - f * freq) * a;
      const cz = z0 + Math.cos(phase - f * freq) * a * 0.12;
      const dy = -Math.cos(phase - f * freq) * freq * a / len;
      const tx = 1, ty = dy;
      const inv = 1 / Math.hypot(tx, ty);
      const nx = -ty * inv, ny = tx * inv;
      const r = r0 + (r1 - r0) * f;
      for (let j = 0; j <= radial; j++) {
        const ang = (j / radial) * Math.PI * 2;
        const ca = Math.cos(ang) * r, sa = Math.sin(ang) * r;
        const k = (i * (radial + 1) + j) * 3;
        arr[k] = cx + nx * ca;
        arr[k + 1] = cy + ny * ca;
        arr[k + 2] = cz + sa;
      }
    }
    g.attributes.position.needsUpdate = true;
    g.computeVertexNormals();
  };
  m.updateWave(0, 0.35);
  return m;
}
// 雕塑化柱狀 Sertoli 細胞（寬基底腳＋側壁細胞凹槽＋頂端葉突）
function sertoliColumn(side, col, o = 0.28) {
  // side = -1 (左) 或 +1 (右)；內側面靠近 x=0 有凹槽托住生殖細胞
  const s = new THREE.Shape();
  const sgn = side;
  const pts = [
    [sgn * 4.5, -3.55],
    [sgn * 4.4, -1.8],
    [sgn * 4.2, 0.6],
    [sgn * 3.8, 3.3],
    [sgn * 2.5, 4.1],
    [sgn * 1.4, 3.85],
    [sgn * 0.95, 2.7],  // 頂端精細胞凹槽
    [sgn * 1.35, 1.8],
    [sgn * 0.72, 0.7],  // 初級精母細胞凹槽
    [sgn * 1.15, -0.4],
    [sgn * 0.55, -1.55], // BTB 腰部內凸
    [sgn * 1.15, -2.55], // 精原細胞基底凹槽
    [sgn * 0.65, -3.55]
  ];
  if (sgn < 0) pts.reverse();
  s.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1], cur = pts[i];
    const mx = (prev[0] + cur[0]) * 0.5, my = (prev[1] + cur[1]) * 0.5;
    s.quadraticCurveTo(prev[0], prev[1], mx, my);
  }
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, {
    depth: 2.8, bevelEnabled: true, bevelThickness: 0.38, bevelSize: 0.32, bevelSegments: 4, curveSegments: 10
  });
  g.translate(0, 0, -1.4);
  g.computeVertexNormals();
  return new THREE.Mesh(g, mat(col, o));
}


// 立體微彎 X 型染色體／單染色分體（含圓頭端粒、收腰著絲點與互換節段）
function chromMesh(pos, col, recombCol, doubled = true, scale = 1) {
  const g = new THREE.Group(); g.position.set(pos[0], pos[1], pos[2] || 0); g.scale.setScalar(scale);
  const ms = [];
  const mkChromatid = (sgn, cTop, cBot) => {
    const dx = doubled ? sgn * 0.14 : 0;
    const pTop = [V(dx * 0.45, 0.03, 0), V(dx * 1.15, 0.28, 0.03 * sgn), V(dx * 1.35, 0.56, 0)];
    const pBot = [V(dx * 0.45, -0.03, 0), V(dx * 1.15, -0.28, -0.03 * sgn), V(dx * 1.35, -0.56, 0)];
    const u = ttube(pTop, [0.068, 0.088], cTop, 0.96, { organic: false, seg: 14, radial: 12 });
    const l = ttube(pBot, [0.068, 0.088], cBot || cTop, 0.96, { organic: false, seg: 14, radial: 12 });
    // 圓潤端粒帽
    const t1 = ell(pTop[2].toArray(), [0.088, 0.088, 0.088], cTop, 0.96);
    const t2 = ell(pBot[2].toArray(), [0.088, 0.088, 0.088], cBot || cTop, 0.96);
    g.add(u, l, t1, t2);
    ms.push(u, l, t1, t2);
  };
  mkChromatid(-1, col, col);
  if (doubled) mkChromatid(1, col, recombCol || col);
  const cen = ell([0, 0, 0], [doubled ? 0.14 : 0.1, 0.1, 0.12], 0xf8f4e8, 0.98);
  g.add(cen); ms.push(cen);
  CUR.root.add(g);
  return { g, ms };
}

// 捲曲胎兒立體雕塑輪廓（頭顱、弓背軀幹、屈曲四肢，scale 控制大小）
function fetusMesh(pos, scale = 1, col = 0xf4b6a6, o = 0.94) {
  const g = new THREE.Group(); g.position.set(pos[0], pos[1], pos[2] || 0); g.scale.setScalar(scale);
  const ms = [];
  const head = ell([-0.15, 0.95, 0.05], [0.62, 0.68, 0.58], col, o);
  const jaw = ell([0.22, 0.68, 0.05], [0.28, 0.24, 0.3], col, o);
  const torso = ttube([V(-0.22, 0.42, 0), V(-0.48, -0.05, 0), V(-0.35, -0.68, 0), V(0.08, -1.02, 0)], [0.46, 0.38], col, o, { seg: 20, radial: 16 });
  const armL = ttube([V(-0.15, 0.22, 0.36), V(0.28, 0.08, 0.34), V(0.38, 0.38, 0.2)], [0.14, 0.1], col, o, { organic: false, seg: 12, radial: 10 });
  const armR = ttube([V(-0.15, 0.22, -0.36), V(0.28, 0.08, -0.34), V(0.38, 0.38, -0.2)], [0.14, 0.1], col, o, { organic: false, seg: 12, radial: 10 });
  const legL = ttube([V(-0.08, -0.88, 0.26), V(0.42, -0.7, 0.32), V(0.26, -0.28, 0.22)], [0.17, 0.11], col, o, { organic: false, seg: 12, radial: 10 });
  const legR = ttube([V(-0.08, -0.88, -0.26), V(0.42, -0.7, -0.32), V(0.26, -0.28, -0.22)], [0.17, 0.11], col, o, { organic: false, seg: 12, radial: 10 });
  [head, jaw, torso, armL, armR, legL, legR].forEach(m => { g.add(m); ms.push(m); });
  CUR.root.add(g);
  return { g, ms };
}

// 半個環（只取背側 z<0 半圈），沿 y 軸環繞
function halfRing(c, R, r, col, o = 1) {
  const m = new THREE.Mesh(new THREE.TorusGeometry(R, r, 12, 32, Math.PI), mat(col, o));
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
