/* 寫實化：色彩管理、環境光、陰影、實體材質（濕潤光澤、表面凹凸、斑駁、邊緣透光）與有機形狀擾動
   載入順序：core.js → util.js → realism.js → scene_*.js → main.js */
(function () {
  const P = window.REAL_PROFILE || 'tissue';

  /* ---------- JS 端雜訊（用於形狀擾動） ---------- */
  function hash3(x, y, z) { let h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return h - Math.floor(h); }
  function vnoise(x, y, z) {
    const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
    let xf = x - xi, yf = y - yi, zf = z - zi;
    xf = xf * xf * (3 - 2 * xf); yf = yf * yf * (3 - 2 * yf); zf = zf * zf * (3 - 2 * zf);
    const L = (a, b, t) => a + (b - a) * t, h = (i, j, k) => hash3(xi + i, yi + j, zi + k);
    return L(L(L(h(0, 0, 0), h(1, 0, 0), xf), L(h(0, 1, 0), h(1, 1, 0), xf), yf), L(L(h(0, 0, 1), h(1, 0, 1), xf), L(h(0, 1, 1), h(1, 1, 1), xf), yf), zf);
  }
  const fbm = (x, y, z) => 0.6 * vnoise(x, y, z) + 0.28 * vnoise(x * 2.1 + 5.2, y * 2.1, z * 2.1) + 0.12 * vnoise(x * 4.3, y * 4.3 + 1.7, z * 4.3);
  window.noise3 = fbm;
  // 沿法線擾動頂點（保留原法線以免接縫；細節交給著色器的凹凸）
  window.organic = function (g, amp, freq, seed = 0) {
    const p = g.attributes.position, n = g.attributes.normal; if (!p || !n) return g;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i), d = (fbm(x * freq + seed, y * freq, z * freq) - 0.5) * 2 * amp;
      p.setXYZ(i, x + n.getX(i) * d, y + n.getY(i) * d, z + n.getZ(i) * d);
    }
    p.needsUpdate = true; g.computeBoundingSphere(); g.computeBoundingBox(); return g;
  };

  /* ---------- 材質分類 ---------- */
  const set = a => new Set(a);
  const BONEC = set([0xeadcbc, 0xe6d8b8, 0xe6d4ae, 0xd8c49a, 0xe2cfa6, 0xcdb48a, 0xd9c49a, 0xf2e6c8, 0xe0cda6, 0xb8a070, 0xe6dcc6]);
  const CARTC = set([0xbfe3f0, 0xe8f0f4, 0x9fc8f0, 0x7f9fb8, 0xcfe8f2]);
  const MUSC = set([0xb84a42, 0xc4554e, 0xb8433f, 0xa8423b, 0xd88a80]);
  const FIBC = set([0xf4f1ea, 0xf2efe6, 0xf6f6f0, 0xf6f2ea, 0xf4efe2, 0xf2eee2]);
  const BASE = {
    tissue: { r: 0.42, cc: 0.35, ccr: 0.3, bump: 0.028, mot: 0.16, rim: 0.22, rp: 2.6 },
    bone: { r: 0.5, cc: 0.25, ccr: 0.35, bump: 0.03, mot: 0.16, rim: 0.18, rp: 2.6 },
    molecule: { r: 0.36, cc: 0.45, ccr: 0.25, bump: 0.012, mot: 0.08, rim: 0.2, rp: 2.4 }
  }[P] || { r: 0.42, cc: 0.35, ccr: 0.3, bump: 0.045, mot: 0.16, rim: 0.22, rp: 2.6 };
  function profile(c, o, extra) {
    let q = Object.assign({}, BASE);
    if (BONEC.has(c)) q = { r: 0.66, cc: 0.1, ccr: 0.5, bump: 0.022, mot: 0.13, rim: 0.08, rp: 3 };
    else if (CARTC.has(c)) q = { r: 0.2, cc: 0.9, ccr: 0.12, bump: 0.012, mot: 0.06, rim: 0.3, rp: 2.2 };
    else if (MUSC.has(c)) q = { r: 0.52, cc: 0.16, ccr: 0.4, bump: 0.035, mot: 0.2, rim: 0.16, rp: 2.6, env: 0.45 };
    else if (FIBC.has(c)) q = { r: 0.32, cc: 0.55, ccr: 0.25, bump: 0.03, mot: 0.08, rim: 0.12, rp: 2.6 };
    if (o < 0.9) Object.assign(q, { r: 0.18, cc: 0.6, ccr: 0.1, bump: 0.0, mot: 0.05, rim: 0.3, rp: 2.2, edge: 1.7 });
    if (extra && extra.map) Object.assign(q, { bump: q.bump * 0.6, mot: q.mot * 0.6 });
    return q;
  }

  /* ---------- 著色器擴充 ---------- */
  const GLSL_PARS = `
varying vec3 vObjPos;
uniform float uBump, uNScale, uMottle, uRimP, uEdgeA;
uniform vec3 uRim;
float rh3(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float vn3(vec3 x){ vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(rh3(i), rh3(i + vec3(1,0,0)), f.x), mix(rh3(i + vec3(0,1,0)), rh3(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(rh3(i + vec3(0,0,1)), rh3(i + vec3(1,0,1)), f.x), mix(rh3(i + vec3(0,1,1)), rh3(i + vec3(1,1,1)), f.x), f.y), f.z); }
float fb3(vec3 p){ return 0.55 * vn3(p) + 0.3 * vn3(p * 2.03 + 7.1) + 0.15 * vn3(p * 4.11 + 3.7); }
vec3 perturbR(vec3 sp, vec3 sn, vec2 dH, float fd){
  vec3 sx = dFdx(sp), sy = dFdy(sp), r1 = cross(sy, sn), r2 = cross(sn, sx);
  float det = dot(sx, r1) * fd; vec3 g = sign(det) * (dH.x * r1 + dH.y * r2);
  return normalize(abs(det) * sn - g); }
`;
  function patch(m, q) {
    m.userData.q = q;
    m.onBeforeCompile = sh => {
      Object.assign(sh.uniforms, { uBump: { value: q.bump }, uNScale: { value: q.ns || 2.2 }, uMottle: { value: q.mot }, uRimP: { value: q.rp }, uEdgeA: { value: q.edge || 1.0 }, uRim: { value: m.userData.rimCol } });
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vObjPos;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvObjPos = transformed;');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\n' + GLSL_PARS)
        .replace('#include <color_fragment>', '#include <color_fragment>\nfloat nB = fb3(vObjPos * uNScale);\ndiffuseColor.rgb *= 1.0 + uMottle * (nB - 0.5) * 2.0;')
        .replace('#include <normal_fragment_maps>', '#include <normal_fragment_maps>\nfloat hB = fb3(vObjPos * uNScale * 2.7 + 11.0);\nnormal = perturbR(-vViewPosition, normal, vec2(dFdx(hB), dFdy(hB)) * uBump, faceDirection);\nfloat fres = pow(1.0 - abs(dot(normal, normalize(vViewPosition))), uRimP);')
        .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += uRim * fres;\ndiffuseColor.a = mix(diffuseColor.a, min(1.0, diffuseColor.a * uEdgeA), fres);');
    };
    m.customProgramCacheKey = () => 'real1';
    m.extensions = m.extensions || {}; m.extensions.derivatives = true;
  }

  /* ---------- 覆寫材質工廠 ---------- */
  window.mat = function (c, o = 1, extra = {}) {
    const q = profile(c, o, extra);
    if (extra.map) extra.map.encoding = THREE.sRGBEncoding;
    const m = new THREE.MeshPhysicalMaterial(Object.assign({
      color: c, roughness: q.r, metalness: 0, clearcoat: q.cc, clearcoatRoughness: q.ccr, envMapIntensity: q.env || 0.6,
      transparent: o < 1, opacity: o, depthWrite: o >= 0.9, side: THREE.DoubleSide
    }, extra));
    m.userData.hex = typeof c === 'number' ? c : null;
    m.color.convertSRGBToLinear();
    m.userData.rimCol = m.color.clone().multiplyScalar(q.rim).lerp(new THREE.Color(0.9, 0.45, 0.35).multiplyScalar(q.rim * 0.35), 0.3);
    patch(m, q);
    return m;
  };
  // 文字看板：不做色調映射
  const _ts = window.textSprite;
  window.textSprite = function () { const sp = _ts.apply(this, arguments); sp.material.map.encoding = THREE.sRGBEncoding; sp.material.toneMapped = false; sp.material.needsUpdate = true; return sp; };
  // 有機的橢球：預先做幾種擾動過的球
  const VAR = [0, 1, 2, 3, 4, 5].map(k => { const g = organic(new THREE.SphereGeometry(1, 40, 28), 0.055, 1.7, k * 9.3); g.userData.shared = true; return g; });
  let vk = 0;
  window.ell = function (pos, sc, col, o = 1) {
    const m = new THREE.Mesh(VAR[vk++ % VAR.length], mat(col, o));
    m.position.set(pos[0], pos[1], pos[2] || 0); m.scale.set(sc[0], sc[1], sc[2]); return m;
  };
  // 漸細管、旋轉體：依尺寸加一點起伏
  const _tt = window.ttube;
  window.ttube = function (pts, rf, col, o = 1, opt = {}) {
    const m = _tt(pts, rf, col, o, opt);
    if (opt.organic === false) return m;
    const r = typeof rf === 'number' ? rf : Array.isArray(rf) ? (rf[0] + rf[1]) / 2 : rf(0.5);
    if (r > 0.09) organic(m.geometry, r * 0.13, 1.4 / r, r * 7);
    return m;
  };
  const _la = window.lathe;
  window.lathe = function (profileArr, col, o = 1, pos, dir, seg) {
    const m = _la(profileArr, col, o, pos, dir, seg);
    const R = Math.max(...profileArr.map(p => p[0]));
    if (R > 0.3) organic(m.geometry, R * 0.035, 1.1 / R, R * 3);
    return m;
  };

  /* ---------- 環境光與渲染器 ---------- */
  // 攝影棚式環境光：上方暖白柔光箱、側面冷光、下方暗（等距柱狀投影的畫布）
  function envTexture() {
    const cv = document.createElement('canvas'); cv.width = 512; cv.height = 256; const c = cv.getContext('2d');
    const g = c.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, '#fff6ea'); g.addColorStop(0.45, '#8a96a8'); g.addColorStop(0.55, '#5a6474'); g.addColorStop(1, '#10141c');
    c.fillStyle = g; c.fillRect(0, 0, 512, 256);
    [[96, 60, 70, 'rgba(255,250,240,0.95)'], [330, 90, 50, 'rgba(220,230,255,0.6)'], [470, 70, 40, 'rgba(255,235,220,0.5)']].forEach(([x, y, r, col]) => {
      const rg = c.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, col); rg.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = rg; c.fillRect(x - r, y - r, 2 * r, 2 * r);
    });
    const t = new THREE.CanvasTexture(cv); t.mapping = THREE.EquirectangularReflectionMapping; t.encoding = THREE.sRGBEncoding; return t;
  }
  window.realismSetup = function (renderer, scene, lights) {
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 0.98;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromEquirectangular(envTexture()).texture; pm.dispose();
    scene.children.filter(o => o.isLight).forEach(l => scene.remove(l));
    scene.add(new THREE.HemisphereLight(0xfff4ea, 0x1a2230, 0.35));
    const key = new THREE.DirectionalLight(0xfff1e0, 1.9); key.position.set(6, 11, 8); key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.03; key.shadow.radius = 4;
    scene.add(key); scene.add(key.target);
    const fill = new THREE.DirectionalLight(0x9ab8ff, 0.45); fill.position.set(-8, 3, -5); scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffe2d0, 0.7); rim.position.set(-2, 6, -10); scene.add(rim);
    window.REAL_KEY = key;
  };
  // 每次載入場景後：設定陰影投射與陰影相機範圍
  window.realismScene = function (root) {
    const box = new THREE.Box3();
    root.traverse(o => {
      if (!o.isMesh) return;
      const m = o.material, solid = m && m.opacity >= 0.9 && !o.isSprite;
      o.castShadow = !!solid; o.receiveShadow = true;
      if (solid && o.geometry) { o.geometry.computeBoundingBox && !o.geometry.boundingBox && o.geometry.computeBoundingBox(); }
    });
    box.setFromObject(root);
    if (box.isEmpty() || !window.REAL_KEY) return;
    const c = box.getCenter(new THREE.Vector3()), r = box.getSize(new THREE.Vector3()).length() / 2;
    const k = window.REAL_KEY, dir = new THREE.Vector3(6, 11, 8).normalize();
    k.position.copy(c).addScaledVector(dir, r * 2); k.target.position.copy(c); k.target.updateMatrixWorld();
    const sc = k.shadow.camera; sc.left = -r; sc.right = r; sc.top = r; sc.bottom = -r; sc.near = 0.1; sc.far = r * 4; sc.updateProjectionMatrix();
  };
  // 背景：柔和的暗角漸層
  const st = document.createElement('style');
  st.textContent = '#cv{background:radial-gradient(ellipse at 50% 38%,#2a3f57 0%,#14243a 48%,#070d16 100%)}';
  document.head.appendChild(st);
})();
