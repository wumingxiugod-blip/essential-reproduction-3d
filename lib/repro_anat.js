/* lib/repro_anat.js：比較大體解剖寫實幾何與程序化組織紋理（隔離命名空間 ANAT，保留濕潤組織清漆質感與漿膜血管系統） */
window.ANAT = (function () {
  function rnd(seed) {
    let s = seed || 1;
    return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  }

  /* ===== 雜訊（-1..1，專供比較解剖 blob / tubeGeo / ttube 起伏使用） ===== */
  const _P = new Uint8Array(512);
  (() => {
    const r = rnd(1234), p = [...Array(256).keys()];
    for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
    for (let i = 0; i < 512; i++) _P[i] = p[i & 255];
  })();
  const _h = (x, y, z) => _P[_P[_P[x & 255] + (y & 255)] + (z & 255)] / 255;
  const _sm = t => t * t * (3 - 2 * t), _lp = (a, b, t) => a + (b - a) * t;
  function noise3(x, y, z) {
    const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
    const u = _sm(x - xi), v = _sm(y - yi), w = _sm(z - zi);
    const c = (a, b, d) => _h(xi + a, yi + b, zi + d);
    return _lp(_lp(_lp(c(0, 0, 0), c(1, 0, 0), u), _lp(c(0, 1, 0), c(1, 1, 0), u), v),
      _lp(_lp(c(0, 0, 1), c(1, 0, 1), u), _lp(c(0, 1, 1), c(1, 1, 1), u), v), w) * 2 - 1;
  }
  function fbm3(x, y, z, oct = 4) {
    let a = 0.5, f = 1, s = 0;
    for (let i = 0; i < oct; i++) { s += a * noise3(x * f, y * f, z * f); a *= 0.5; f *= 2.03; }
    return s;
  }
  function noise2p(x, y, P, layer) {
    const xi = Math.floor(x), yi = Math.floor(y), u = _sm(x - xi), v = _sm(y - yi);
    const c = (a, b) => _h(((xi + a) % P + P) % P, ((yi + b) % P + P) % P, layer);
    return _lp(_lp(c(0, 0), c(1, 0), u), _lp(c(0, 1), c(1, 1), u), v);
  }

  /* ===== 程序化組織紋理（共用不隨場景切換釋放） ===== */
  const TEX = {};
  (function makeTextures() {
    const N = 512, mk = () => { const c = document.createElement('canvas'); c.width = c.height = N; return c; };
    const cCol = mk(), cBump = mk(), cNet = mk();
    const xc = cCol.getContext('2d'), xb = cBump.getContext('2d'), xn = cNet.getContext('2d');
    const dc = xc.createImageData(N, N), db = xb.createImageData(N, N), dn = xn.createImageData(N, N);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const u = x / N, v = y / N;
      let h = 0, a = 0.5, P = 8;
      for (let o = 0; o < 5; o++) { h += a * noise2p(u * P, v * P, P, o); a *= 0.5; P *= 2; }
      const pore = noise2p(u * 96, v * 96, 96, 9);
      const m = noise2p(u * 5, v * 5, 5, 7), m2 = noise2p(u * 14, v * 14, 14, 8);
      const i = (y * N + x) * 4;
      const b = 128 + (h - 0.5) * 210 - Math.max(0, pore - 0.72) * 260;
      db.data[i] = db.data[i + 1] = db.data[i + 2] = Math.max(0, Math.min(255, b)); db.data[i + 3] = 255;
      const k = 1 - 0.1 * m - 0.07 * m2 - 0.05 * (h - 0.5);
      dc.data[i] = 255 * k; dc.data[i + 1] = 255 * (k - 0.035 * m); dc.data[i + 2] = 255 * (k - 0.03 * m2); dc.data[i + 3] = 255;
      const kn = 1 - 0.06 * m2;
      dn.data[i] = 255 * kn; dn.data[i + 1] = 250 * kn; dn.data[i + 2] = 245 * kn; dn.data[i + 3] = 255;
    }
    xc.putImageData(dc, 0, 0); xb.putImageData(db, 0, 0); xn.putImageData(dn, 0, 0);
    const vessels = (ctxs, seed, count, w0, steps) => {
      const r = rnd(seed);
      const walk = (x, y, ang, w, n, depth) => {
        const pts = [[x, y]];
        for (let s = 0; s < n; s++) {
          ang += (r() - 0.5) * 0.7; x += Math.cos(ang) * 7; y += Math.sin(ang) * 7; pts.push([x, y]);
          if (depth < 3 && r() < 0.08) walk(x, y, ang + (r() < 0.5 ? 1 : -1) * (0.5 + r() * 0.7), w * 0.65, n * 0.55 | 0, depth + 1);
        }
        ctxs.forEach(([ctx, style, wm]) => {
          ctx.strokeStyle = style; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
          for (let ox = -1; ox <= 1; ox++) for (let oy = -1; oy <= 1; oy++) {
            ctx.lineWidth = w * wm; ctx.beginPath();
            pts.forEach(([px, py], j) => j ? ctx.lineTo(px + ox * N, py + oy * N) : ctx.moveTo(px + ox * N, py + oy * N));
            ctx.stroke();
          }
        });
      };
      for (let k = 0; k < count; k++) walk(r() * N, r() * N, r() * 6.3, w0 * (0.6 + r() * 0.6), steps, 0);
    };
    vessels([[xc, 'rgba(150,25,35,0.16)', 1], [xb, 'rgba(255,255,255,0.22)', 1.4]], 11, 16, 2.2, 55);
    vessels([[xn, 'rgba(165,20,28,0.62)', 1]], 23, 12, 4.5, 60);
    vessels([[xn, 'rgba(120,30,90,0.35)', 1]], 37, 8, 3.0, 50);
    const tx = (c, srgb) => {
      const t = new THREE.CanvasTexture(c);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      if (srgb) t.encoding = THREE.sRGBEncoding;
      t.anisotropy = 4;
      t.userData = { shared: true };
      return t;
    };
    TEX.color = tx(cCol, true); TEX.bump = tx(cBump, false); TEX.vnet = tx(cNet, true);
    const cF = mk(), xf = cF.getContext('2d'), df = xf.createImageData(N, N);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const u = x / N, v = y / N, i = (y * N + x) * 4;
      const f = 0.6 * noise2p(u * 3, v * 70, 70, 12) + 0.3 * noise2p(u * 7, v * 150, 150, 13) + 0.1 * noise2p(u * 20, v * 20, 20, 14);
      const k = 0.72 + 0.28 * f;
      df.data[i] = 255 * k; df.data[i + 1] = 245 * k; df.data[i + 2] = 240 * k; df.data[i + 3] = 255;
    }
    xf.putImageData(df, 0, 0);
    TEX.fiber = tx(cF, true);
    TEX.fiberV = TEX.fiber.clone();
    TEX.fiberV.needsUpdate = true;
    TEX.fiberV.center.set(0.5, 0.5);
    TEX.fiberV.rotation = Math.PI / 2;
    TEX.fiberV.userData = { shared: true };
  })();

  function mat(c, o = 1, extra = {}) {
    const e = Object.assign({}, extra), texKey = e.tex || 'color', bump = e.bump !== undefined ? e.bump : 1;
    delete e.tex; delete e.bump;
    const m = new THREE.MeshPhysicalMaterial(Object.assign({
      color: c, roughness: 0.45, metalness: 0.0, clearcoat: 0.5, clearcoatRoughness: 0.3,
      transparent: o < 1, opacity: o, depthWrite: o >= 0.9, side: THREE.DoubleSide,
      map: texKey === 'none' ? null : TEX[texKey],
      bumpMap: bump ? (/fiber/.test(texKey) ? TEX[texKey] : TEX.bump) : null,
      bumpScale: 0.006 * bump, envMapIntensity: 0.85
    }, e));
    m.color.convertSRGBToLinear();
    m.userData.hex = c;
    return m;
  }

  function scaleUV(g, sx, sy) {
    const uv = g.attributes.uv;
    if (!uv) return g;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * sx, uv.getY(i) * sy);
    uv.needsUpdate = true;
    return g;
  }
  const _sph = scaleUV(new THREE.SphereGeometry(1, 40, 28), 3, 2);
  _sph.userData.shared = true;

  function ell(pos, sc, col, o = 1) {
    const m = new THREE.Mesh(_sph, mat(col, o));
    m.position.set(pos[0], pos[1], pos[2] || 0);
    m.scale.set(sc[0], sc[1], sc[2]);
    return m;
  }
  function blob(pos, sc, col, o = 1, opt = {}) {
    const g = new THREE.SphereGeometry(1, 64, 44), p = g.attributes.position;
    const amp = opt.amp !== undefined ? opt.amp : 0.06, f = opt.freq || 2.2, sd = opt.seed || 1;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i), d = 1 + amp * fbm3(x * f + sd, y * f, z * f - sd, 3);
      p.setXYZ(i, x * d, y * d, z * d);
    }
    g.computeVertexNormals();
    const avg = (sc[0] + sc[1] + sc[2]) / 3;
    scaleUV(g, Math.max(1, Math.round(2 * Math.PI * avg / 0.45)), Math.max(1, Math.round(Math.PI * avg / 0.45)));
    const m = new THREE.Mesh(g, mat(col, o, Object.assign({ tex: opt.tex }, opt.extra || {})));
    m.position.set(pos[0], pos[1], pos[2] || 0);
    m.scale.set(sc[0], sc[1], sc[2]);
    return m;
  }
  function tube(pts, r, col, o = 1, segMul = 10) {
    const p = (pts[0] && pts[0].isVector3) ? pts : PV(pts);
    const curve = new THREE.CatmullRomCurve3(p, false, 'centripetal');
    const g = new THREE.TubeGeometry(curve, Math.max(12, Math.round(p.length * segMul)), r, 10, false);
    scaleUV(g, Math.max(1, curve.getLength() / 0.45), Math.max(1, Math.round(2 * Math.PI * r / 0.45)));
    const m = new THREE.Mesh(g, mat(col, o));
    m.userData.curve = curve;
    return m;
  }
  function ring(pos, tangent, R, r, col, o = 1) {
    const P = pos.isVector3 ? pos : V(...pos), T = tangent.isVector3 ? tangent : V(...tangent);
    const m = new THREE.Mesh(new THREE.TorusGeometry(R, r, 12, 32), mat(col, o));
    m.position.copy(P);
    m.quaternion.setFromUnitVectors(V(0, 0, 1), T.clone().normalize());
    return m;
  }
  function annulus(ro, ri, len, col, o = 1, z0 = 0) {
    const s = new THREE.Shape(); s.absarc(0, 0, ro, 0, Math.PI * 2, false);
    if (ri > 0) { const h = new THREE.Path(); h.absarc(0, 0, ri, 0, Math.PI * 2, true); s.holes.push(h); }
    const g = new THREE.ExtrudeGeometry(s, { depth: len, bevelEnabled: false, curveSegments: 48 });
    scaleUV(g, 1.5, 1.5);
    const m = new THREE.Mesh(g, mat(col, o)); m.position.z = z0; return m;
  }
  function disc(r, len, col, o = 1, x = 0, y = 0, z0 = 0) {
    const m = annulus(r, 0, len, col, o, z0); m.position.x = x; m.position.y = y; return m;
  }
  function cyl(a, b, r, col, o = 1) {
    const A = V(...a), B = V(...b), d = B.clone().sub(A);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, d.length(), 16), mat(col, o));
    m.position.copy(A.clone().add(B).multiplyScalar(0.5));
    m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize());
    return m;
  }
  function cone(a, b, r, col, o = 1) {
    const A = V(...a), B = V(...b), d = B.clone().sub(A);
    const m = new THREE.Mesh(new THREE.ConeGeometry(r, d.length(), 16), mat(col, o));
    m.position.copy(A.clone().add(B).multiplyScalar(0.5));
    m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize());
    return m;
  }
  function shell(r, sc, col, o, phiStart, phiLen, thStart = 0, thLen = Math.PI) {
    const g = new THREE.SphereGeometry(r, 48, 32, phiStart, phiLen, thStart, thLen);
    scaleUV(g, Math.max(1, Math.round(r * 6)), Math.max(1, Math.round(r * 3)));
    const m = new THREE.Mesh(g, mat(col, o)); m.scale.set(sc[0], sc[1], sc[2]); return m;
  }
  function tubeGeo(pts, rf, opt = {}) {
    const p = (pts[0] && pts[0].isVector3) ? pts : PV(pts);
    const curve = new THREE.CatmullRomCurve3(p, !!opt.closed, 'centripetal');
    const n = opt.seg || Math.max(32, p.length * 16), rs = opt.radial || 16;
    const R = typeof rf === 'number' ? () => rf : (Array.isArray(rf) ? t => rf[0] + (rf[1] - rf[0]) * t : rf);
    const fr = curve.computeFrenetFrames(n, !!opt.closed);
    const L = curve.getLength(), wob = opt.wob || 0, wf = opt.wobF || 3, sd = opt.seed || 0;
    let rAvg = 0; for (let i = 0; i <= 8; i++) rAvg += R(i / 8) / 9;
    const kv = Math.max(1, Math.round(2 * Math.PI * rAvg / 0.45));
    const pos = [], uv = [], idx = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, c = curve.getPointAt(t), r0 = R(t);
      for (let j = 0; j <= rs; j++) {
        const a = j / rs * Math.PI * 2;
        const r = wob ? r0 * (1 + wob * fbm3(t * L * wf + sd, Math.cos(a) * 1.3, Math.sin(a) * 1.3 + sd, 3)) : r0;
        const v = c.clone().addScaledVector(fr.normals[i], Math.cos(a) * r).addScaledVector(fr.binormals[i], Math.sin(a) * r);
        pos.push(v.x, v.y, v.z); uv.push(t * L / 0.45, j / rs * kv);
      }
    }
    for (let i = 0; i < n; i++) for (let j = 0; j < rs; j++) {
      const a = i * (rs + 1) + j, b = a + rs + 1;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
    if (opt.cap !== false && !opt.closed) {
      [0, n].forEach(i => {
        const c = curve.getPointAt(i / n), ci = pos.length / 3;
        pos.push(c.x, c.y, c.z); uv.push(0, 0);
        for (let j = 0; j < rs; j++) idx.push(ci, i * (rs + 1) + j, i * (rs + 1) + j + 1);
      });
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx); g.computeVertexNormals();
    g.userData.curve = curve; g.userData.rf = R; g.userData.frames = fr; g.userData.n = n;
    return g;
  }
  function ttube(pts, rf, col, o = 1, opt = {}) {
    const g = tubeGeo(pts, rf, opt);
    const m = new THREE.Mesh(g, mat(col, o, opt.mat || {}));
    m.userData.curve = g.userData.curve; m.userData.rf = g.userData.rf; m.userData.frames = g.userData.frames; m.userData.n = g.userData.n;
    return m;
  }
  function mergeGeos(list) {
    const pos = [], nor = [], uv = [], idx = []; let off = 0;
    list.forEach(g => {
      const p = g.attributes.position, n = g.attributes.normal, u = g.attributes.uv;
      for (let i = 0; i < p.count; i++) { pos.push(p.getX(i), p.getY(i), p.getZ(i)); nor.push(n.getX(i), n.getY(i), n.getZ(i)); uv.push(u ? u.getX(i) : 0, u ? u.getY(i) : 0); }
      if (g.index) for (let i = 0; i < g.index.count; i++) idx.push(g.index.getX(i) + off);
      else for (let i = 0; i < p.count; i++) idx.push(i + off);
      off += p.count; g.dispose();
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx); return g;
  }
  function vesselMesh(paths, col, extra = {}) {
    const g = mergeGeos(paths.filter(v => v.pts.length > 1).map(v => tubeGeo(v.pts, v.r, { radial: 6, seg: Math.max(8, v.pts.length * 3) })));
    return new THREE.Mesh(g, mat(col, 1, Object.assign({ roughness: 0.35, clearcoat: 0.8, bump: 0 }, extra)));
  }
  function surfVessels(host, opt = {}) {
    const c = host.userData.curve, R = host.userData.rf, fr = host.userData.frames, n = host.userData.n;
    const side = (opt.side || V(0, 1, 0)).clone().normalize(), rr = rnd(opt.seed || 7);
    const t0 = opt.t0 !== undefined ? opt.t0 : 0.04, t1 = opt.t1 !== undefined ? opt.t1 : 0.96, cnt = opt.count || 10, spread = opt.spread || 2.4, vr = opt.vr || 0.012;
    const at = (t, a, lift) => {
      t = Math.max(0, Math.min(1, t)); const i = Math.round(t * n), r = R(t) + lift;
      return c.getPointAt(t).addScaledVector(fr.normals[i], Math.cos(a) * r).addScaledVector(fr.binormals[i], Math.sin(a) * r);
    };
    const a0At = t => { const i = Math.round(Math.max(0, Math.min(1, t)) * n); return Math.atan2(side.dot(fr.binormals[i]), side.dot(fr.normals[i])); };
    const art = [], vein = [];
    const path = (t, a0, dir, Lr, lift, ph, dt, m) => {
      const pts = [];
      for (let j = 0; j <= m; j++) {
        const s = j / m;
        pts.push(at(t + dt * s + 0.012 * Math.sin(s * 11 + ph) + 0.006 * Math.sin(s * 23 + ph * 2), a0 + dir * s * Lr + 0.05 * Math.sin(s * 7 + ph), lift));
      }
      return pts;
    };
    for (let k = 0; k < cnt; k++) {
      const t = t0 + (t1 - t0) * (k + 0.15 + rr() * 0.7) / cnt, a0 = a0At(t), w = vr * (0.6 + rr() * 0.8);
      [1, -1].forEach(dir => {
        if (rr() < 0.15) return;
        const Lr = spread * (0.45 + rr() * 0.55), ph = rr() * 6, dt = (rr() - 0.5) * 0.05;
        art.push({ pts: path(t, a0, dir, Lr, w * 0.5, ph, dt, 20), r: [w, w * 0.15] });
        if (opt.veins !== false && rr() < 0.8) vein.push({ pts: path(t + 0.01, a0 + 0.05, dir, Lr * 0.9, w * 0.6, ph + 1.3, dt, 20), r: [w * 1.25, w * 0.2] });
        for (let b = 0; b < 2; b++) {
          const sb = 0.25 + rr() * 0.4, bt = (rr() < 0.5 ? 1 : -1) * (0.02 + rr() * 0.03), bp = [];
          for (let j = 0; j <= 10; j++) { const u = j / 10, s = sb + u * 0.5; bp.push(at(t + dt * s + bt * u + 0.008 * Math.sin(u * 9 + ph), a0 + dir * s * Lr * (0.9 + 0.2 * u), w * 0.4)); }
          art.push({ pts: bp, r: [w * 0.55, w * 0.1] });
        }
      });
    }
    const out = [vesselMesh(art, opt.col || 0xa3202c)];
    if (vein.length) out.push(vesselMesh(vein, opt.vcol || 0x5e2a5e));
    return out;
  }
  function ribbon(A, B, col, o = 0.3, rows = 6, sag = 0) {
    A = A.map(p => p.isVector3 ? p : V(...p)); B = B.map(p => p.isVector3 ? p : V(...p));
    const pos = [], uv = [], idx = [], n = A.length;
    let lenA = 0; for (let i = 1; i < n; i++) lenA += A[i].distanceTo(A[i - 1]);
    const ku = Math.max(1, lenA / 0.45), kv = Math.max(1, A[0].distanceTo(B[0]) / 0.45);
    for (let i = 0; i < n; i++) {
      const tA = A[Math.min(n - 1, i + 1)].clone().sub(A[Math.max(0, i - 1)]), nrm = tA.clone().cross(B[i].clone().sub(A[i])).normalize();
      for (let k = 0; k <= rows; k++) {
        const s = k / rows, v = A[i].clone().lerp(B[i], s).addScaledVector(nrm, sag * Math.sin(Math.PI * s) * Math.sin(Math.PI * (i + 0.5) / n));
        pos.push(v.x, v.y, v.z); uv.push(i / (n - 1) * ku, s * kv);
      }
    }
    for (let i = 0; i < n - 1; i++) for (let k = 0; k < rows; k++) {
      const a = i * (rows + 1) + k, b = a + rows + 1;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx); g.computeVertexNormals();
    return new THREE.Mesh(g, mat(col, o, { clearcoat: 0.9, clearcoatRoughness: 0.15, roughness: 0.3 }));
  }
  function lathe(profile, col, o = 1, pos = [0, 0, 0], dir = [0, 1, 0], seg = 40) {
    const g = new THREE.LatheGeometry(profile.map(p => new THREE.Vector2(p[0], p[1])), seg);
    scaleUV(g, 3, 1.5);
    const m = new THREE.Mesh(g, mat(col, o));
    m.position.set(...pos);
    m.quaternion.setFromUnitVectors(V(0, 1, 0), V(...dir).normalize());
    return m;
  }
  function box(c, s, col, o = 1, extra = {}) {
    const g = new THREE.BoxGeometry(s[0], s[1], s[2]);
    scaleUV(g, Math.max(1, Math.max(s[0], s[2]) / 0.45), Math.max(1, Math.max(s[1], s[2]) / 0.45));
    const m = new THREE.Mesh(g, mat(col, o, extra));
    m.position.set(c[0], c[1], c[2] || 0); return m;
  }
  function halfRing(c, R, r, col, o = 1) {
    const m = new THREE.Mesh(new THREE.TorusGeometry(R, r, 10, 28, Math.PI), mat(col, o));
    m.position.set(...c); m.rotation.x = -Math.PI / 2; return m;
  }
  function halfCyl(c, r0, r1, y0, y1, col, o = 1) {
    const g = new THREE.CylinderGeometry(r1, r0, y1 - y0, 40, 8, true, Math.PI / 2, Math.PI);
    scaleUV(g, 2, Math.max(1, (y1 - y0) / 0.45));
    const m = new THREE.Mesh(g, mat(col, o));
    m.material.emissive.setHex(col).convertSRGBToLinear().multiplyScalar(0.3);
    m.position.set(c[0], (y0 + y1) / 2, c[2] || 0); return m;
  }
  return { TEX, mat, ell, blob, tube, tubeGeo, ttube, mergeGeos, vesselMesh, surfVessels, ribbon, lathe, box, halfRing, halfCyl, shell, ring, annulus, disc, cyl, cone, fbm3, scaleUV };
})();
