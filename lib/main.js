/* 主程式：章節導覽、3D 場景管理、寫實光照、標籤引線、圖表放大、重點整理與自我測驗 */
let renderer, scene3, camera, controls, curIdx = -1, selected = null, labelEls = [], XRAY = false;
const $ = id => document.getElementById(id);
let cvBox;
const CH = (typeof CHAPTER !== 'undefined' && CHAPTER) || window.CHAPTER || { no: 0, zh: '', en: '' };
const CHAPTER_ORDER = [1, 2, 3, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 21];
const pad2 = n => String(n).padStart(2, '0');

function buildShell() {
  const pos = CHAPTER_ORDER.indexOf(CH.no);
  const prev = pos > 0 ? 'ch' + pad2(CHAPTER_ORDER[pos - 1]) + '.html' : 'index.html';
  const next = (pos >= 0 && pos < CHAPTER_ORDER.length - 1) ? 'ch' + pad2(CHAPTER_ORDER[pos + 1]) + '.html' : 'index.html';
  document.title = 'Ch' + CH.no + ' ' + CH.zh + '｜動物繁殖 3D';
  if (CH.color) document.documentElement.style.setProperty('--ch', CH.color);
  document.body.insertAdjacentHTML('afterbegin', `
<div id="top">
  <a id="home" href="index.html" title="回到目錄">⌂</a>
  <a class="nav" href="${prev}" title="上一章">‹</a>
  <h1 title="${CH.zh}｜${CH.en}"><span class="no">CH ${pad2(CH.no)}</span><span class="zh">${CH.zh}</span><small>${CH.en}</small></h1>
  <a class="nav" id="next" href="${next}" title="下一章">›</a>
  <div id="tabs"></div>
  <div id="dbtn" title="顯示／隱藏說明">☰ 說明</div>
  <div id="wbtn" title="隱藏／顯示左右面板">⛶ 面板</div>
</div>
<div id="left"><div id="desc"></div><h2>結構清單（勾選＝顯示，點名稱＝選取）</h2><div id="plist"></div></div>
<div id="cv"><div id="leaders"><svg width="100%" height="100%" id="svg"></svg></div><div id="labels"></div></div>
<div id="right"><div id="ctrl">
  <label>標籤：<select id="lm"><option value="all">全部顯示</option><option value="sel">僅選取項目</option><option value="none">隱藏</option></select></label>
  <label id="xrayWrap" title="勾選＝器官壁半透明，可看見內部構造；不勾＝寫實外觀" hidden><input type="checkbox" id="xray"> 透視模式（看內部構造）</label>
  <label><input type="checkbox" id="iso"> 孤立選取（其餘淡化）</label>
  <label><input type="checkbox" id="rot"> 自動旋轉</label>
  <div id="extra"></div>
  <div class="btns"><button id="reset">重設視角</button><button id="showall">全部顯示</button></div>
</div>
<div id="info"><div class="hint">👆 點擊 3D 模型或標籤／清單，即可查看結構名稱與說明。<br>左鍵拖曳旋轉、滾輪縮放、右鍵平移。</div></div></div>
<div id="sum" hidden></div>
<div id="tip"></div><div id="err"></div><div id="busy">⏳ 建立模型中…</div>`);
  cvBox = $('cv');
  const top = $('top');
  const syncTop = () => document.documentElement.style.setProperty('--toph', top.offsetHeight + 'px');
  syncTop();
  if (window.ResizeObserver) new ResizeObserver(syncTop).observe(top);
  else addEventListener('resize', syncTop);
}

function revealTab(t) {
  const box = $('tabs');
  if (!t || box.scrollWidth <= box.clientWidth) return;
  const l = t.offsetLeft - box.offsetLeft, r = l + t.offsetWidth, pad = 140;
  if (l < box.scrollLeft) box.scrollLeft = l - 8;
  else if (r > box.scrollLeft + box.clientWidth - pad) box.scrollLeft = r - box.clientWidth + pad;
}

function init() {
  buildShell();
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  cvBox.insertBefore(renderer.domElement, cvBox.firstChild);
  scene3 = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(40, 1, 0.1, 4000);
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = 0.1; controls.autoRotateSpeed = 1.2;
  scene3.add(new THREE.HemisphereLight(0xffffff, 0x445566, 0.85));
  const d1 = new THREE.DirectionalLight(0xffffff, 0.85); d1.position.set(4, 6, 5); scene3.add(d1);
  const d2 = new THREE.DirectionalLight(0x99bbff, 0.45); d2.position.set(-5, 2, -4); scene3.add(d2);
  if (window.realismSetup) realismSetup(renderer, scene3);
  addEventListener('resize', resize);
  if (window.ResizeObserver) new ResizeObserver(resize).observe(cvBox);
  resize();

  const tabs = $('tabs');
  SCENES.forEach((s, i) => {
    const b = document.createElement('div'); b.className = 'tab'; b.textContent = s.name;
    b.onclick = () => go(i); tabs.appendChild(b);
  });
  if (CH.summary || CH.quiz) {
    const b = document.createElement('div'); b.className = 'tab sumtab'; b.textContent = '📝 重點＋測驗';
    b.onclick = () => showSummary(true); tabs.appendChild(b);
  }
  $('lm').onchange = refresh; $('iso').onchange = refresh;
  $('xray').onchange = () => { XRAY = $('xray').checked; refresh(); };
  $('rot').onchange = () => controls.autoRotate = $('rot').checked;
  $('reset').onclick = resetCam;
  $('wbtn').onclick = () => { document.body.classList.toggle('wide'); resize(); };
  $('dbtn').onclick = () => document.body.classList.toggle('desc-open');
  if (/wide/.test(location.search)) { document.body.classList.add('wide'); resize(); }
  setupChartZoom();
  $('showall').onclick = () => { CUR.parts.forEach(p => p.visible = true); rebuildList(); refresh(); };

  const ray = new THREE.Raycaster(), mouse = new THREE.Vector2();
  let down = null, lastMove = 0;
  const el = renderer.domElement;
  function pick(ev) {
    const r = el.getBoundingClientRect();
    mouse.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(mouse, camera);
    const hits = ray.intersectObjects(CUR.root.children, true)
      .filter(h => h.object.userData.part && h.object.userData.part.visible && visibleDeep(h.object));
    if (!hits.length) return null;
    const solid = hits.find(h => {
      const mat = h.object.material;
      return mat && (mat.userData.effO !== undefined ? mat.userData.effO : mat.userData.baseO) >= 0.5;
    });
    return (solid || hits[0]).object.userData.part;
  }
  el.addEventListener('pointerdown', e => down = [e.clientX, e.clientY]);
  el.addEventListener('pointerup', e => {
    if (down && Math.hypot(e.clientX - down[0], e.clientY - down[1]) < 5) select(pick(e));
    down = null;
  });
  el.addEventListener('pointermove', e => {
    if (e.buttons) { $('tip').style.display = 'none'; return; }
    const now = performance.now(); if (now - lastMove < 60) return; lastMove = now;
    const p = pick(e), t = $('tip');
    if (p) { t.textContent = p.zh; t.style.display = 'block'; t.style.left = e.clientX + 12 + 'px'; t.style.top = e.clientY + 12 + 'px'; el.style.cursor = 'pointer'; }
    else { t.style.display = 'none'; el.style.cursor = 'default'; }
  });
  addEventListener('hashchange', fromHash);
  fromHash();
  let last = performance.now();
  (function loop() {
    requestAnimationFrame(loop);
    const now = performance.now(); CUR.dt = Math.min(0.1, (now - last) / 1000); last = now;
    stepFly(); controls.update();
    if (CUR.tick) { try { CUR.tick(CUR.dt); } catch (e) { CUR.tick = null; showErr(e); } }
    renderer.render(scene3, camera); updateLabels();
  })();
}
function visibleDeep(o) { while (o) { if (!o.visible) return false; o = o.parent; } return true; }
function showErr(e) { $('err').textContent = '⚠ ' + (e && e.message || e); console.error(e); }

function fromHash() {
  const h = location.hash.slice(1);
  if (h === 'sum') { if (curIdx < 0 && SCENES.length) loadScene(0); showSummary(true, true); return; }
  if (!SCENES.length) return;
  const i = Math.min(SCENES.length - 1, Math.max(0, parseInt(h || '0', 10) || 0));
  if (i !== curIdx || !$('sum').hidden) go(i, true);
}
function go(i, noHash) {
  showSummary(false, true);
  const busy = $('busy'); busy.style.display = 'block';
  setTimeout(() => { loadScene(i); busy.style.display = 'none'; }, 30);
  if (!noHash) history.replaceState(null, '', '#' + i);
}

function resize() {
  const w = cvBox.clientWidth, h = cvBox.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix();
  fitZoom();
}

function loadScene(i) {
  closeZoom(true);
  if (CUR.root) {
    scene3.remove(CUR.root);
    CUR.root.traverse(o => {
      if (o.geometry && !o.geometry.userData.shared) o.geometry.dispose();
      if (o.material && o.material.map && !(o.material.map.userData && o.material.map.userData.shared)) o.material.map.dispose();
    });
  }
  curIdx = i; selected = null; CUR.parts = []; CUR.tick = null; fly = null;
  CUR.root = new THREE.Group(); scene3.add(CUR.root);
  const sc = SCENES[i];
  $('extra').innerHTML = ''; $('err').textContent = '';
  try { sc.build(); } catch (e) { showErr(e); }
  CUR.parts.forEach(p => p.meshes.forEach(m => {
    if (!m.material) return;
    m.material.userData.baseO = m.material.opacity;
    m.material.userData.baseC = m.material.emissive ? m.material.emissive.getHex() : 0;
  }));
  const hasXray = CUR.parts.some(p => p.wall || p.inner) || sc.xray !== undefined;
  const xw = $('xrayWrap');
  if (xw) {
    xw.hidden = !hasXray;
    XRAY = hasXray ? !!sc.xray : false;
    $('xray').checked = XRAY;
  }
  [...$('tabs').children].forEach((t, k) => t.classList.toggle('on', k === i));
  revealTab($('tabs').children[i]);
  $('desc').innerHTML = '<h2>' + sc.title + '</h2>' + sc.desc;
  if (sc.controls) sc.controls.forEach(c => {
    const b = document.createElement('button'); b.textContent = c.label; b.onclick = c.fn; $('extra').appendChild(b);
  });
  try { if (sc.panel) sc.panel($('extra')); } catch (e) { showErr(e); }
  rebuildList(); resetCam(); refresh();
  if (window.realismScene) realismScene(CUR.root);
  $('info').innerHTML = '<div class="hint">👆 點擊 3D 模型或標籤／清單，即可查看結構名稱與說明。</div>';
  $('labels').innerHTML = ''; $('svg').innerHTML = ''; labelEls = [];
  CUR.parts.forEach(p => {
    const d = document.createElement('div'); d.className = 'lab';
    d.innerHTML = p.zh + '<small>' + p.en + '</small>';
    d.onclick = () => select(p);
    $('labels').appendChild(d);
    const ln = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    ln.setAttribute('stroke', '#7fb6e8'); ln.setAttribute('stroke-width', '1'); ln.setAttribute('stroke-opacity', '.75');
    $('svg').appendChild(ln);
    labelEls.push({ p, d, ln });
  });
}

let fly = null;
function flyTo(pos, target, ms = 700) {
  fly = { p0: camera.position.clone(), t0: controls.target.clone(), p1: V(...pos), t1: V(...target), s: performance.now(), ms };
}
function stepFly() {
  if (!fly) return;
  let k = Math.min(1, (performance.now() - fly.s) / fly.ms); k = k * k * (3 - 2 * k);
  camera.position.lerpVectors(fly.p0, fly.p1, k); controls.target.lerpVectors(fly.t0, fly.t1, k);
  if (k >= 1) fly = null;
}

function resetCam() {
  fly = null;
  const c = SCENES[curIdx].camera;
  camera.position.set(...(window.camFit ? camFit(c) : c.pos));
  controls.target.set(...c.target); controls.update();
}

function rebuildList() {
  const box = $('plist'); box.innerHTML = '';
  let lastG = null;
  CUR.parts.forEach(p => {
    if (p.grp !== lastG) { const g = document.createElement('div'); g.className = 'grp'; g.textContent = p.grp; box.appendChild(g); lastG = p.grp; }
    const r = document.createElement('div'); r.className = 'row'; p.row = r;
    const cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = p.visible;
    cb.onclick = e => { e.stopPropagation(); p.visible = cb.checked; refresh(); };
    const sw = document.createElement('div'); sw.className = 'sw';
    const m0 = p.meshes[0] && p.meshes[0].material;
    sw.style.background = m0 ? (m0.userData.hex != null ? '#' + m0.userData.hex.toString(16).padStart(6, '0') : (m0.color ? '#' + m0.color.getHexString() : '#888')) : '#888';
    const n = document.createElement('span'); n.className = 'n'; n.textContent = p.zh;
    r.append(cb, sw, n); r.onclick = () => select(p); box.appendChild(r);
  });
}

function select(p) {
  selected = p;
  if (p) {
    $('info').innerHTML = '<h3>' + p.zh + '</h3><div class="en">' + p.en + '</div><span class="g">' + p.grp + '</span><div class="t">' + p.info + '</div>';
    if (!p.visible) { p.visible = true; rebuildList(); }
    if (p.inner && !XRAY && $('xrayWrap') && !$('xrayWrap').hidden) { XRAY = true; $('xray').checked = true; }
  }
  refresh();
}

function refresh() {
  const iso = $('iso').checked;
  CUR.parts.forEach(p => {
    p.meshes.forEach(m => {
      m.visible = p.visible;
      if (!m.material || !m.material.emissive) return;
      const base = (!XRAY && p.wall) ? p.wallO : m.material.userData.baseO, isSel = p === selected;
      m.material.emissive.setHex(isSel ? 0x7a4a00 : m.material.userData.baseC);
      if (iso && selected && !isSel) { m.material.transparent = true; m.material.opacity = Math.min(base, 0.1); m.material.depthWrite = false; }
      else { m.material.opacity = base; m.material.transparent = base < 1; m.material.depthWrite = base >= 0.9; }
      m.material.userData.effO = m.material.opacity;
      if (p.wall) { m.castShadow = m.material.opacity >= 0.6; m.receiveShadow = m.material.opacity >= 0.6; }
    });
    if (p.row) { p.row.classList.toggle('sel', p === selected); p.row.firstChild.checked = p.visible; }
  });
}

const _v = new THREE.Vector3();
function updateLabels() {
  if (!SCENES[curIdx]) return;
  const w = cvBox.clientWidth, h = cvBox.clientHeight, mode = $('lm').value;
  const hasXray = $('xrayWrap') && !$('xrayWrap').hidden;
  const items = [];
  labelEls.forEach(L => {
    const p = L.p;
    let show = p.visible && p.label && (mode === 'all' || (mode === 'sel' && p === selected)) && (!hasXray || XRAY || !p.inner || p === selected);
    if (show) {
      _v.copy(p.anchor).project(camera);
      if (_v.z > 1) show = false;
      else L.s = { x: (_v.x * 0.5 + 0.5) * w, y: (-_v.y * 0.5 + 0.5) * h };
    }
    L.show = show;
    L.d.style.display = show ? 'block' : 'none';
    L.ln.style.display = show ? 'block' : 'none';
    L.d.classList.toggle('sel', p === selected);
    if (show) items.push(L);
  });
  const cols = { L: items.filter(L => L.s.x < w / 2), R: items.filter(L => L.s.x >= w / 2) };
  if (!SCENES[curIdx].noBalance) {
    while (cols.L.length - cols.R.length > 2) { cols.L.sort((a, b) => a.s.x - b.s.x); cols.R.push(cols.L.pop()); }
    while (cols.R.length - cols.L.length > 2) { cols.R.sort((a, b) => a.s.x - b.s.x); cols.L.push(cols.R.shift()); }
  }
  const room = (h - 12) / Math.max(1, cols.L.length, cols.R.length);
  const compact = room < 30;
  $('labels').classList.toggle('compact', compact);
  const GAP = Math.min(compact ? 20 : 30, room);
  ['L', 'R'].forEach(side => {
    const col = cols[side].sort((a, b) => a.s.y - b.s.y);
    let prev = -1e9;
    col.forEach(L => { L.hh = (L.d.offsetHeight || 28) / 2; L.y = Math.max(5, L.s.y - L.hh, prev + GAP); prev = L.y; });
    let next = h - 5;
    for (let i = col.length - 1; i >= 0; i--) { col[i].y = Math.min(col[i].y, next - GAP); next = col[i].y; }
    col.forEach(L => {
      const lw = L.d.offsetWidth || 90;
      const x = side === 'L' ? 6 : w - lw - 6;
      L.d.style.left = x + 'px'; L.d.style.top = L.y + 'px';
      L.ln.setAttribute('x1', L.s.x); L.ln.setAttribute('y1', L.s.y);
      L.ln.setAttribute('x2', side === 'L' ? x + lw : x); L.ln.setAttribute('y2', L.y + L.hh);
    });
  });
}

if (typeof plot === 'function') {
  const _plot = plot;
  plot = function (cv, o) { cv._last = o; return _plot(cv, o); };
}
let zoomed = null;
const zoomable = cv => cv && !cv.onclick && cv.style.cursor !== 'crosshair' && cv.width > 60 && cv.height > 40;
function setupChartZoom() {
  $('extra').addEventListener('click', e => {
    const cv = e.target.closest('canvas');
    if (zoomable(cv)) openZoom(cv);
  });
  $('extra').addEventListener('mouseover', e => {
    const cv = e.target.closest('canvas');
    if (zoomable(cv) && !cv.title) { cv.classList.add('zoomable'); cv.title = '點擊放大'; }
  });
  addEventListener('keydown', e => { if (e.key === 'Escape' && zoomed) closeZoom(); });
}
function redrawAt(cv, k) {
  if (!cv._last || !cv._w) return;
  k = Math.max(1, Math.min(6, k));
  if (cv._k === k) return;
  cv._k = k; cv.width = cv._w * k; cv.height = cv._h * k;
  try { plot(cv, cv._last); } catch (e) { showErr(e); }
}
function openZoom(cv) {
  closeZoom();
  const ar = (cv._w && cv._h) ? cv._w / cv._h : cv.width / cv.height;
  const ph = document.createElement('div'); ph.className = 'zoomph';
  ph.style.aspectRatio = String(ar); ph.innerHTML = '🔍 圖表已放大<br><small>點此或按 Esc 還原</small>';
  ph.onclick = () => closeZoom();
  cv.replaceWith(ph);
  const box = document.createElement('div'); box.id = 'zoom';
  box.innerHTML = '<div class="zbox"><button class="zx" title="關閉（Esc）">✕</button></div>';
  box.firstChild.prepend(cv);
  box.onclick = e => { if (e.target === box || e.target.classList.contains('zx')) closeZoom(); };
  cvBox.appendChild(box);
  zoomed = { cv, ph, box, ar, k0: cv._k };
  cv.classList.remove('zoomable'); cv.title = '';
  fitZoom();
}
function fitZoom() {
  if (!zoomed) return;
  const { cv, ar } = zoomed, W = cvBox.clientWidth - 40, H = cvBox.clientHeight - 40;
  const w = Math.max(120, Math.min(W, H * ar, 1100));
  cv.style.width = w + 'px'; cv.style.height = (w / ar) + 'px';
  if (cv._w) redrawAt(cv, Math.ceil(w / cv._w * Math.min(devicePixelRatio || 1, 2)));
}
function closeZoom(drop) {
  if (!zoomed) return;
  const { cv, ph, box, k0 } = zoomed; zoomed = null;
  box.remove();
  cv.style.width = cv.style.height = '';
  if (!drop) {
    if (k0) redrawAt(cv, k0);
    if (ph.isConnected) ph.replaceWith(cv);
    cv.title = '';
  }
}

function showSummary(on, noHash) {
  const S = $('sum');
  if (!on) { if (!S.hidden) { S.hidden = true; document.body.classList.remove('sum-on'); } return; }
  if (!S.dataset.built) buildSummary(S);
  S.hidden = false; document.body.classList.add('sum-on');
  [...$('tabs').children].forEach(t => t.classList.toggle('on', t.classList.contains('sumtab')));
  if (!noHash) history.replaceState(null, '', '#sum');
}
function optionOrder(o) {
  const idx = o.map((_, i) => i);
  if (o.every(t => /^\s*[−-]?[\d.]+/.test(t))) return idx;
  const last = idx.filter(i => /以上|皆是|皆非|兩者皆|都是|都不是/.test(o[i]));
  const rest = idx.filter(i => !last.includes(i));
  for (let i = rest.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [rest[i], rest[j]] = [rest[j], rest[i]]; }
  return rest.concat(last);
}
function buildSummary(S) {
  S.dataset.built = 1;
  const q = CH.quiz || [];
  S.innerHTML = `<div class="sumwrap">
    <section class="col"><h2>📌 本章重點（${CH.zh}）</h2><div class="sumtxt">${CH.summary || ''}</div></section>
    <section class="col"><h2>✏️ 自我測驗 <span id="score"></span></h2><ol class="quiz" id="quiz"></ol>
    <button id="qreset" class="qbtn">重新作答</button></section></div>`;
  const ol = $('quiz');
  let ans = {};
  const score = () => {
    const n = Object.keys(ans).length, ok = Object.values(ans).filter(Boolean).length;
    $('score').textContent = n ? `（已答 ${n}/${q.length}，答對 ${ok}）` : `（共 ${q.length} 題）`;
  };
  const render = () => {
    ol.innerHTML = ''; ans = {};
    q.forEach((it, qi) => {
      const li = document.createElement('li');
      li.innerHTML = `<div class="qq">${it.q}</div>`;
      const opts = document.createElement('div'); opts.className = 'opts';
      const ex = document.createElement('div'); ex.className = 'ex'; ex.hidden = true;
      const order = optionOrder(it.o), pos = order.indexOf(it.a);
      order.forEach((oi, k) => {
        const t = it.o[oi];
        const b = document.createElement('button'); b.className = 'opt';
        b.innerHTML = '<b>' + 'ABCDE'[k] + '</b> ' + t;
        b.onclick = () => {
          if (qi in ans) return;
          ans[qi] = oi === it.a;
          [...opts.children].forEach((c, j) => { c.classList.add(j === pos ? 'ok' : (j === k ? 'no' : 'dim')); });
          ex.hidden = false; ex.innerHTML = (oi === it.a ? '✅ 正確！' : '❌ 正確答案是 ' + 'ABCDE'[pos] + '。') + ' ' + (it.e || '');
          score();
        };
        opts.appendChild(b);
      });
      li.append(opts, ex); ol.appendChild(li);
    });
    score();
  };
  $('qreset').onclick = render;
  render();
}

window.addEventListener('DOMContentLoaded', () => {
  try { init(); } catch (e) { const d = document.getElementById('err') || document.body; d.textContent = '初始化失敗：' + e.message; console.error(e); }
});
