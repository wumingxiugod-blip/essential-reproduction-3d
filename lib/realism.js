/* 醫學插畫風視覺系統：乾淨柔霧 PBR、柔和輪廓光、柔陰影與有機形狀雕塑
   載入順序：core.js → util.js → realism.js → scene_*.js → main.js */
(function () {
  const P = window.REAL_PROFILE || 'tissue';

  /* ---------- 平滑 3D 雜訊（用於有機形狀雕塑） ---------- */
  function hash3(x, y, z) { let h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return h - Math.floor(h); }
  function vnoise(x, y, z) {
    const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
    let xf = x - xi, yf = y - yi, zf = z - zi;
    xf = xf * xf * (3 - 2 * xf); yf = yf * yf * (3 - 2 * yf); zf = zf * zf * (3 - 2 * zf);
    const L = (a, b, t) => a + (b - a) * t, h = (i, j, k) => hash3(xi + i, yi + j, zi + k);
    return L(L(L(h(0, 0, 0), h(1, 0, 0), xf), L(h(0, 1, 0), h(1, 1, 0), xf), yf), L(L(h(0, 0, 1), h(1, 0, 1), xf), L(h(0, 1, 1), h(1, 1, 1), xf), yf), zf);
  }
  const fbm = (x, y, z) => 0.65 * vnoise(x, y, z) + 0.35 * vnoise(x * 2.0 + 4.1, y * 2.0, z * 2.0);
  window.noise3 = fbm;

  // 沿法線平滑雕塑頂點並重算法線（讓光影真實反映有機輪廓）
  window.organic = function (g, amp, freq, seed = 0, recompute = true) {
    const p = g.attributes.position, n = g.attributes.normal; if (!p || !n) return g;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      const d = (fbm(x * freq + seed, y * freq, z * freq) - 0.5) * 2 * amp;
      p.setXYZ(i, x + n.getX(i) * d, y + n.getY(i) * d, z + n.getZ(i) * d);
    }
    p.needsUpdate = true;
    if (recompute) g.computeVertexNormals();
    g.computeBoundingSphere(); g.computeBoundingBox();
    return g;
  };

  /* ---------- 簡潔醫學插畫風材質分類（無油亮 clearcoat 與重雜訊） ---------- */
  const set = a => new Set(a);
  const BONEC = set([0xeadcbc, 0xe6d8b8, 0xe6d4ae, 0xd8c49a, 0xe2cfa6, 0xcdb48a, 0xd9c49a, 0xf2e6c8, 0xe0cda6, 0xb8a070, 0xe6dcc6]);
  const CARTC = set([0xbfe3f0, 0xe8f0f4, 0x9fc8f0, 0x7f9fb8, 0xcfe8f2]);
  const BASE = {
    tissue: { r: 0.58, rim: 0.24, rp: 2.5, env: 0.42 },
    bone: { r: 0.68, rim: 0.16, rp: 2.8, env: 0.35 },
    molecule: { r: 0.42, rim: 0.22, rp: 2.3, env: 0.5 }
  }[P] || { r: 0.58, rim: 0.24, rp: 2.5, env: 0.42 };

  function profile(c, o) {
    let q = Object.assign({}, BASE);
    if (BONEC.has(c)) q = { r: 0.72, rim: 0.14, rp: 2.8, env: 0.32 };
    else if (CARTC.has(c)) q = { r: 0.38, rim: 0.28, rp: 2.2, env: 0.5 };
    if (o < 0.9) Object.assign(q, { r: 0.32, rim: 0.34, rp: 2.1, edge: 1.85, env: 0.45 });
    return q;
  }

  /* ---------- 輕量 Fresnel 輪廓光著色器（凸顯 3D 形狀邊界，不加表面雜訊） ---------- */
  const GLSL_RIM = `
uniform float uRimP, uEdgeA;
uniform vec3 uRim;
`;
  function patch(m, q) {
    m.userData.q = q;
    m.onBeforeCompile = sh => {
      Object.assign(sh.uniforms, {
        uRimP: { value: q.rp },
        uEdgeA: { value: q.edge || 1.0 },
        uRim: { value: m.userData.rimCol }
      });
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', '#include <common>\n' + GLSL_RIM)
        .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
float fres = pow(1.0 - abs(dot(normal, normalize(vViewPosition))), uRimP);
totalEmissiveRadiance += uRim * fres;
diffuseColor.a = mix(diffuseColor.a, min(1.0, diffuseColor.a * uEdgeA), fres);`);
    };
    m.customProgramCacheKey = () => 'med_clean_v2';
  }

  /* ---------- 覆寫材質工廠（簡潔 MeshStandardMaterial） ---------- */
  window.mat = function (c, o = 1, extra = {}) {
    const q = profile(c, o);
    if (extra.map) extra.map.encoding = THREE.sRGBEncoding;
    const m = new THREE.MeshStandardMaterial(Object.assign({
      color: c,
      roughness: q.r,
      metalness: 0.0,
      envMapIntensity: q.env,
      transparent: o < 1,
      opacity: o,
      depthWrite: o >= 0.9,
      side: THREE.DoubleSide
    }, extra));
    m.userData.hex = typeof c === 'number' ? c : null;
    m.color.convertSRGBToLinear();
    // 柔和亮白偏暖的輪廓光，讓重疊器官與細胞層次分明
    m.userData.rimCol = m.color.clone().lerp(new THREE.Color(0.85, 0.92, 1.0), 0.38).multiplyScalar(q.rim);
    patch(m, q);
    return m;
  };

  // 文字看板：不做色調映射
  const _ts = window.textSprite;
  window.textSprite = function () {
    const sp = _ts.apply(this, arguments);
    sp.material.map.encoding = THREE.sRGBEncoding;
    sp.material.toneMapped = false;
    sp.material.needsUpdate = true;
    return sp;
  };

  // 有機橢球：以光滑低頻雕塑並重算法線，避免生硬正球體
  const VAR = [0, 1, 2, 3, 4, 5].map(k => {
    const g = organic(new THREE.SphereGeometry(1, 36, 26), 0.075, 1.35, k * 11.7, true);
    g.userData.shared = true;
    return g;
  });
  let vk = 0;
  window.ell = function (pos, sc, col, o = 1) {
    const m = new THREE.Mesh(VAR[vk++ % VAR.length], mat(col, o));
    m.position.set(pos[0], pos[1], pos[2] || 0);
    m.scale.set(sc[0], sc[1], sc[2]);
    return m;
  };

  // 漸細管、旋轉體：自然低頻起伏
  const _tt = window.ttube;
  window.ttube = function (pts, rf, col, o = 1, opt = {}) {
    const m = _tt(pts, rf, col, o, opt);
    if (opt.organic === false) return m;
    const r = typeof rf === 'number' ? rf : Array.isArray(rf) ? (rf[0] + rf[1]) / 2 : rf(0.5);
    if (r > 0.09) organic(m.geometry, r * 0.11, 1.2 / r, r * 7, true);
    return m;
  };
  const _la = window.lathe;
  window.lathe = function (profileArr, col, o = 1, pos, dir, seg) {
    const m = _la(profileArr, col, o, pos, dir, seg);
    const R = Math.max(...profileArr.map(p => p[0]));
    if (R > 0.35) organic(m.geometry, R * 0.03, 1.0 / R, R * 3, true);
    return m;
  };

  /* ---------- 乾淨三點棚拍光照與渲染器 ---------- */
  function envTexture() {
    const cv = document.createElement('canvas'); cv.width = 256; cv.height = 128; const c = cv.getContext('2d');
    const g = c.createLinearGradient(0, 0, 0, 128);
    g.addColorStop(0, '#eef4fb'); g.addColorStop(0.5, '#6a7c92'); g.addColorStop(1, '#182230');
    c.fillStyle = g; c.fillRect(0, 0, 256, 128);
    const t = new THREE.CanvasTexture(cv);
    t.mapping = THREE.EquirectangularReflectionMapping;
    t.encoding = THREE.sRGBEncoding;
    return t;
  }

  window.realismSetup = function (renderer, scene) {
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.04;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const pm = new THREE.PMREMGenerator(renderer);
    scene.environment = pm.fromEquirectangular(envTexture()).texture;
    pm.dispose();
    scene.children.filter(o => o.isLight).forEach(l => scene.remove(l));
    scene.add(new THREE.HemisphereLight(0xf6f9ff, 0x1e2c40, 0.55));
    const key = new THREE.DirectionalLight(0xfff6eb, 1.65);
    key.position.set(6, 11, 9);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.bias = -0.0005;
    key.shadow.normalBias = 0.035;
    key.shadow.radius = 4;
    scene.add(key); scene.add(key.target);
    const fill = new THREE.DirectionalLight(0xa4c4ff, 0.58);
    fill.position.set(-8, 4, 4);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffe8d6, 0.72);
    rim.position.set(-2, 7, -10);
    scene.add(rim);
    window.REAL_KEY = key;
  };

  window.realismScene = function (root) {
    const box3 = new THREE.Box3();
    root.traverse(o => {
      if (!o.isMesh) return;
      const m = o.material, solid = m && m.opacity >= 0.9 && !o.isSprite;
      o.castShadow = !!solid;
      o.receiveShadow = true;
      if (solid && o.geometry && o.geometry.computeBoundingBox && !o.geometry.boundingBox) {
        o.geometry.computeBoundingBox();
      }
    });
    box3.setFromObject(root);
    if (box3.isEmpty() || !window.REAL_KEY) return;
    const c = box3.getCenter(new THREE.Vector3()), r = box3.getSize(new THREE.Vector3()).length() / 2;
    const k = window.REAL_KEY, dir = new THREE.Vector3(6, 11, 9).normalize();
    k.position.copy(c).addScaledVector(dir, r * 2);
    k.target.position.copy(c);
    k.target.updateMatrixWorld();
    const sc = k.shadow.camera;
    sc.left = -r; sc.right = r; sc.top = r; sc.bottom = -r; sc.near = 0.1; sc.far = r * 4;
    sc.updateProjectionMatrix();
  };

  const st = document.createElement('style');
  st.textContent = '#cv{background:radial-gradient(ellipse at 50% 40%,#243850 0%,#122033 52%,#08101c 100%)}';
  document.head.appendChild(st);
})();
