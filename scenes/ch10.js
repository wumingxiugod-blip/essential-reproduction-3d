/* Ch.10：精子成熟、勃起血液動力學與配子雙向運輸 */
(function () {
  /* ===== 場景①：輸出小管吸收與副睪成熟（Figs 10.1–10.2, Table 10.1） ===== */
  let S1 = null, MODE1 = 'norm', STAGE1 = 0.7;
  const M1_TXT = {
    norm: ['正常生精與副睪輸送', '輸出小管（ERα 依賴）吸收 &gt;90% 賽托利液體，濃縮精子 <b>100 倍</b>；副睪耗時 5–11 天完成細胞質滴脫落、雙硫鍵交聯與 EPPIN 包被（p.176–177）。'],
    era: ['輸出小管結紮 / ERα 剔除（遺傳性結紮）', '輸出小管無法吸收液體 → 液體回堵使生精小管劇烈膨脹（「blow up」）導致<b>壓力性無精症</b>，副睪因缺 ABP 雄激素退化！'],
    vas: ['輸精管結紮（Vasectomy）', '90% 液體已於輸出小管吸收完畢，<b>生精小管無壓力萎縮</b>；滯留精子堆積於副睪尾並被巨噬細胞吞噬或經管壁滲漏清除（p.177）。']
  };
  SCENES.push({
    name: '① 輸出管與副睪成熟',
    title: '睪丸輸出小管液體吸收（>90% ERα依賴）與副睪成熟（Figs 10.1–10.2）',
    camera: { pos: [0, 1.0, 19.5], target: [0, 0, 0], fit: [10.2, 6.2] },
    controls: [
      { label: '🔍 全構造', fn() { flyHome(); } },
      { label: '🔍 左：睪丸與輸出小管', fn() { flyFit([-4.0, 0, 0], [5.2, 4.5]); } },
      { label: '🔍 右：精子成熟變化', fn() { flyFit([5.2, 0, 0], [4.4, 4.2]); } }
    ],
    desc: `
<p>離開生精小管的精子還「不會真正受精也不會主動前向游動」，必須在男方排出道完成關鍵濃縮與成熟（Ch.10 p.176–178, Figs 10.1–10.2, Table 10.1）。</p>
<details open><summary>為何兩個結紮位置結果天差地遠？</summary><ul>
<li><b>輸出小管（10–20 條，ERα 依賴）</b>：吸收 <b>&gt;90%</b> 液體 → 若受阻（或 ERα KO），睪丸內壓暴增壓壞生精上皮！</li>
<li><b>副睪（頭→體→尾，5–11 天）</b>：受輸入液＋淋巴的 <b>ABP-T → DHT</b>（5α-還原酶）驅動，濃縮 <b>100 倍</b>並透過 <b>epididymosomes</b> 加上受精蛋白與 <b>EPPIN</b> 保護套。</li>
<li><b>輸精管結紮</b>：液體早已被吸收，睪丸安全無壓力萎縮。</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.10 p.176–178（Figs 10.1–10.2, Table 10.1）</p>`,
    build() {
      S1 = { t: 0, play: true };
      const T = '睪丸實質與睪丸網', E = '輸出小管（ERα 吸收 >90% 液）', P = '副睪頭/體/尾與輸精管', SP = '單隻精子成熟對比';
      const swell = MODE1 === 'era' ? 1.38 : 1.0;
      const tCut = shell(1, [2.7 * swell, 3.6 * swell, 2.4 * swell], 0xd8a888, 0.25, 0.45, Math.PI * 1.65);
      tCut.position.set(-5.6, -1.0, 0);
      const lobules = [];
      for (let i = 0; i < 6; i++) {
        const y = -2.8 + i * 0.72, r = (MODE1 === 'era' ? 0.34 : 0.21);
        const pts = [];
        for (let k = 0; k <= 14; k++) { const u = k / 14; pts.push(V(-7.4 + u * 2.7, y + Math.sin(u * 10 + i) * 0.16, 0.4 * Math.cos(u * 6 + i))); }
        lobules.push(ttube(pts, r, MODE1 === 'era' ? 0xff7070 : 0xeec888, 0.92, { organic: false }));
      }
      const rete = ell([-3.9, -0.5, 0.2], [0.55 * swell, 1.9 * swell, 0.75 * swell], 0x70b8ff, 0.75);
      reg(T, MODE1 === 'era' ? '生精小管與睪丸網（高壓回堵腫脹！）' : '生精小管與睪丸網（Rete testis）', 'Seminiferous tubules & Rete testis',
        MODE1 === 'era' ? '輸出小管阻塞或缺 ERα → 賽托利細胞液無法被吸收，小管內壓急升引發壓力性無精症（pressure atrophy）。' : '賽托利細胞缺緊密血睪障壁，睪丸網內僅靠擴散進行離子微調平衡。',
        [tCut, ...lobules, rete], { anchor: [-5.8, -4.4, 0.8] });

      // 輸出小管 6條模擬 10-20條連接頭端
      const effs = [];
      for (let i = 0; i < 4; i++) {
        const y0 = -1.6 + i * 0.75;
        effs.push(ttube([V(-3.4, y0, 0.2), V(-2.3, y0 + 0.65, 0.35), V(-1.4, 1.7 + i * 0.25, 0.2)], [0.16 * swell, 0.1], MODE1 === 'era' ? 0xff5050 : 0x60e0d0, 0.9, { organic: false }));
      }
      // ERα 結紮環（只在 era 模式顯示）
      const lig1 = MODE1 === 'era' ? ring([-2.3, 0.1, 0.2], [0.7, 0.5, 0], 1.15, 0.12, 0xff2222) : null;
      if (lig1) effs.push(lig1);
      reg(E, '輸出小管 Vasa efferentia（約 10–20 條）', 'Vasa efferentia (Oestrogen ERα absorption)',
        '約 1 天通路上經高纖毛柱狀上皮微胞飲吸收 <b>&gt;90%</b> 液體（需高濃度 E₂ 與 ERα），同時導入含 <b>ABP-睪固酮（30–60 ng/ml）</b>的液體滋養副睪。',
        effs, { anchor: [-2.4, 3.0, 0.7] });

      // 副睪 頭 -> 體 -> 尾 -> 輸精管
      const epiCol = MODE1 === 'era' ? 0x8899aa : 0xd890a8;
      const caput = ell([-1.2, 2.3, 0.2], [1.05, 0.85, 0.85], epiCol, MODE1 === 'era' ? 0.5 : 0.88);
      const epiPts = [V(-1.0, 2.1, 0.2), V(-0.1, 0.6, 0.3), V(0.3, -1.6, 0.2), V(-0.4, -3.5, 0.2), V(-2.0, -3.8, -0.3), V(-1.6, -1.8, -0.4), V(1.3, 2.5, -0.2)];
      const epiTube = ttube(epiPts, [0.42, 0.34, 0.44, 0.2], epiCol, 0.88, { organic: false });
      const caudaB = ell([-0.4, -3.5, 0.2], [0.9 * (MODE1 === 'vas' ? 1.25 : 1), 0.75 * (MODE1 === 'vas' ? 1.25 : 1), 0.85], MODE1 === 'vas' ? 0xffb84d : epiCol, 0.9);
      const vasLig = MODE1 === 'vas' ? ring([-1.8, -2.8, -0.35], [0.2, 0.95, 0.1], 0.36, 0.1, 0xff3333) : null;
      const epArr = [caput, epiTube, caudaB];
      if (vasLig) epArr.push(vasLig);
      reg(P, '副睪頭/體/尾與輸精管（Vas deferens）', 'Epididymis (Caput/Corpus/Cauda) & Vas',
        MODE1 === 'vas' ? '輸精管結紮處阻塞，但前方輸出小管已吸收水分，因此僅副睪尾累積精子由巨噬細胞清除，不影響生精！' : '副睪經歷起始→中→終段（5–11 天），將精子濃縮 100 倍並賦予受精與游泳潛能；尾段及輸精管作為儲存庫。',
        epArr, { anchor: [0.8, -3.8, 0.9] });

      // 右側：放大精子比較（隨 STAGE1 0=未成熟頭段 -> 1=成熟尾段變化）
      const mCol = STAGE1 > 0.5 ? 0x60f0c8 : 0xaab8c8;
      const sHead = ell([5.4, 2.3, 0], [0.55 - STAGE1 * 0.1, 0.8 - STAGE1 * 0.08, 0.32 - STAGE1 * 0.06], mCol, 0.95);
      const acroCap = ell([5.4, 2.8, 0.06], [0.48, 0.36, 0.3], 0xffd479, 0.88);
      const eppinCoat = dots([V(5.0, 2.4, 0.35), V(5.8, 2.4, 0.35), V(5.4, 3.05, 0.32), V(5.4, 1.9, 0.35)], 0.11, 0x4db8e8, STAGE1 > 0.35 ? 0.95 : 0.1);
      // 細胞質滴隨 STAGE1 滑下中段並於 STAGE1>0.85 脫落消失
      const dropY = 1.45 - STAGE1 * 2.6;
      const cyDrop = ell([5.75, dropY, 0.15], [0.32, 0.32, 0.32], 0xffa8a8, STAGE1 > 0.85 ? 0.08 : 0.85);
      const midP = cyl([5.4, 1.5, 0], [5.4, -0.3, 0], 0.18, 0x50d890, 0.92);
      const tailGrp = new THREE.Group();
      const tailM = cyl([5.4, -0.3, 0], [5.4, -3.5, 0], 0.075, STAGE1 > 0.5 ? 0xffd43a : 0x8899aa, 0.95);
      tailGrp.add(tailM);
      CUR.root.add(tailGrp);
      reg(SP, `精子成熟模型（Day ${Math.round(STAGE1 * 11)}）`, 'Spermatozoon Maturation Changes',
        '隨副睪推進：①核緻密化與頂體塑形；②<b>細胞質滴下移脫落</b>；③表面 GPI 醣蛋白與 <b>EPPIN</b> 保護層（藍珠）累積（唾液酸↑負電↑）；④鞭毛外緻密纖維 <b>S–S 雙硫鍵↑</b> 更強韌、cAMP↑！',
        [sHead, acroCap, eppinCoat, cyDrop, midP, tailM], { anchor: [7.6, 0.2, 0.6] });

      const flowC = new THREE.CatmullRomCurve3(epiPts);
      S1.flow = flowOn(flowC, MODE1 === 'norm' ? 24 : 8, 0.11, 0xe8f6ff, 0x204060, MODE1 === 'norm' ? 0.26 : 0.04, 0.06);
      CUR.root.add(S1.flow);

      textSprite(M1_TXT[MODE1][0], [0, 4.9, 0], 0.4, '#ffd479');

      const dt = dtClock();
      CUR.tick = () => {
        const d = S1.play ? dt() : 0; S1.t += d;
        S1.flow.run(d);
        if (STAGE1 > 0.4) {
          tailM.rotation.z = Math.sin(S1.t * 8) * (0.04 + 0.1 * STAGE1);
        }
      };
    },
    panel(box) {
      seg(box, '手術／遺傳模型', [['norm', '正常輸送'], ['era', 'ERα KO／輸出小管結紮'], ['vas', '輸精管結紮']], MODE1, v => { MODE1 = v; reloadKeep(); });
      slider(box, '副睪成熟天數 (0→11 d)', 0, 1, STAGE1, 0.05, v => { STAGE1 = v; reloadKeep(); });
      note(box, M1_TXT[MODE1][1], 'big');
      checkbox(box, '播放液流與尾鞭擺動', true, v => S1.play = v);
    }
  });

  /* ===== 場景②：陰莖與陰蒂勃起血液動力學＋藥理開關（Box 10.1, Figs 10.4–10.5） ===== */
  let S2 = null, TURGOR2 = 0.9, RX2 = 'norm';
  const RX2_INFO = {
    norm: '正常反應：骨盆副交感 + 剪應力 → <b>nNOS / eNOS 釋放 NO</b> → cGMP 舒張海綿動脈與小樑，充血脹大後壓扁白膜下靜脈叢。',
    pde5: '<b>PDE5 抑制劑（Sildenafil / Tadalafil）</b>：抑制磷酸二酯酶-5 分解 <b>cGMP</b>，放大 NO 血管舒張效應治療勃起障礙（需注意延長引起缺血性陰莖異常勃起風險）。',
    diab: '<b>糖尿病／內皮與神經受損（nNOS/eNOS ↓）</b>：NO 生成減少導致動脈與小樑無法充分擴張，白膜下靜脈無法被壓閉，形成靜脈漏／勃起困難。',
    alpha: '<b>α-交感神經阻斷劑</b>：<b>不影響勃起</b>（甚至降低交感肌張力而助勃起），但阻斷輸精管與儲精囊平滑肌排精引起<b>「乾性高潮」</b>（p.180–182）。'
  };
  SCENES.push({
    name: '② 勃起血液動力與藥理',
    title: '海綿體動脈擴張、白膜下靜脈壓閉與 NO–cGMP–PDE5 機轉（Box 10.1, Fig 10.4）',
    camera: { pos: [0, 1.2, 18.5], target: [0, 0, 0], fit: [9.8, 6.2] },
    controls: [{ label: '🔍 橫切面全貌', fn() { flyHome(); } }],
    desc: `
<p>人類陰莖（與女性陰蒂）勃起完全由<b>血液動力學</b>完成：將海綿體竇從「低容積、低壓力」瞬轉為「高容積、高壓力」系統（Ch.10 p.180–182, Box 10.1, Fig 10.4b）。</p>
<details open><summary>為何白膜（Tunica albuginea）與尿道海綿體設計不同？</summary><ul>
<li><b>陰莖海綿體（2 條）</b>：外包極堅韌纖維白膜（撕裂即不能保壓），膨脹時把<b>白膜下靜脈叢壓在白膜內側</b>封死流出通道！</li>
<li><b>尿道海綿體（1 條）</b>：同樣充血但<b>壓力顯著較低</b>，確保中間的尿道保持暢通以利射精通過。</li>
<li><b>分子啟動與維持</b>：神經型 <b>nNOS</b> 先行啟動；大量血流剪應力刺激血管內皮 <b>eNOS</b> 接力放大維持！</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.10 p.180–183（Box 10.1, Figs 10.4–10.5）</p>`,
    build() {
      S2 = { t: 0, play: true };
      const kNO = RX2 === 'diab' ? 0.35 : (RX2 === 'pde5' ? 1.2 : 1.0);
      const eScale = 0.62 + 0.42 * clamp(TURGOR2 * kNO, 0.05, 1.08);
      const CC = '成對陰莖海綿體與白膜', CS = '尿道海綿體與尿道', VS = '海綿動脈、分流與白膜下靜脈';

      // 外皮與堅韌白膜（截面圖：呈現完整 3D 短圓柱剖面）
      const skin = annulus(4.15, 3.85, 2.2, 0xd8a890, 0.25, -1.1);
      const tunicaL = annulus(1.85 * eScale, 1.65 * eScale, 2.5, 0xf2f4f8, 0.82, -1.25);
      tunicaL.position.set(-1.7, 0.95, 0);
      const tunicaR = annulus(1.85 * eScale, 1.65 * eScale, 2.5, 0xf2f4f8, 0.82, -1.25);
      tunicaR.position.set(1.7, 0.95, 0);
      // 充血竇空間（隨 TURGOR 變紅且擴大）
      const sinCol = TURGOR2 * kNO > 0.55 ? 0xd83048 : 0x7a3848;
      const sinusL = disc(1.63 * eScale, 2.4, sinCol, 0.82, -1.7, 0.95, -1.2);
      const sinusR = disc(1.63 * eScale, 2.4, sinCol, 0.82, 1.7, 0.95, -1.2);
      reg(CC, '陰莖海綿體竇與纖維白膜（Corpora cavernosa）', 'Corpora cavernosa & Fibrous tunica',
        '小樑平滑肌舒張使海綿體竇大量充血膨脹，頂住外圍堅韌白膜產生極高靜水壓；白膜撕裂則無法鎖壓導致勃起障礙（Fig 10.4b）。',
        [skin, tunicaL, tunicaR, sinusL, sinusR], { anchor: [-3.9, 2.3, 0.9] });

      // 尿道海綿體與中央尿道
      const csScale = 0.82 + 0.2 * clamp(TURGOR2 * kNO, 0, 1);
      const spg = annulus(1.35 * csScale, 0.55, 2.5, 0xb85868, 0.78, -1.25);
      spg.position.set(0, -1.9, 0);
      const urth = annulus(0.55, 0.36, 2.6, 0xffe0b8, 0.92, -1.3);
      urth.position.set(0, -1.9, 0);
      const emTag = RX2 === 'alpha' ? 0x607080 : 0x70f0a0;
      const urGlow = disc(0.35, 2.55, emTag, RX2 === 'alpha' ? 0.18 : 0.5, 0, -1.9, -1.27);
      reg(CS, '尿道海綿體與陰莖部尿道（壓力較低！）', 'Corpus spongiosum & Penile urethra',
        RX2 === 'alpha' ? 'α-阻斷劑阻斷下腹交感排精（NA + ATP），尿道內缺精液排出形成「乾性高潮」！' : '尿道海綿體亦充血但不若上方海綿體高壓，以免壓扁尿道阻斷精液射出（Box 10.1）。',
        [spg, urth, urGlow], { anchor: [0, -3.7, 0.8] });

      // 內部海綿深動脈（擴張 vs 收縮）+ 背深靜脈／白膜下靜脈叢（壓扁！）
      const artR = 0.14 + 0.24 * clamp(TURGOR2 * kNO, 0, 1);
      const profL = cyl([-1.7, 0.95, -1.35], [-1.7, 0.95, 1.35], artR, 0xff3b3b, 0.98);
      const profR = cyl([1.7, 0.95, -1.35], [1.7, 0.95, 1.35], artR, 0xff3b3b, 0.98);
      // 壓扁指標：高壓時白膜下靜脈叢半徑大幅縮小
      const veinR = Math.max(0.04, 0.30 * (1 - 0.85 * clamp(TURGOR2 * kNO, 0, 1)));
      const deepDorsalV = cyl([0, 3.15, -1.35], [0, 3.15, 1.35], veinR * 1.2, 0x3b7bff, 0.95);
      const subV1 = cyl([-3.15, 1.5, -1.2], [-3.15, 1.5, 1.2], veinR, 0x3b7bff, 0.95);
      const subV2 = cyl([3.15, 1.5, -1.2], [3.15, 1.5, 1.2], veinR, 0x3b7bff, 0.95);
      const dArtL = cyl([-0.7, 3.15, -1.35], [-0.7, 3.15, 1.35], 0.13, 0xff6060);
      const dArtR = cyl([0.7, 3.15, -1.35], [0.7, 3.15, 1.35], 0.13, 0xff6060);
      reg(VS, '海綿深動脈（擴張↑）與白膜下靜脈叢（被壓閉↓）', 'Profunda arteries & Sub-tunical veins',
        '高壓使靜脈回流近乎歸零：動脈血流入↑而通過流出↓。若勃起持續過久（缺血性陰莖異常勃起 priapism）會危及組織供氧！',
        [profL, profR, deepDorsalV, subV1, subV2, dArtL, dArtR], { anchor: [4.0, 2.8, 0.9] });

      // NO -> cGMP 神經血管訊號流
      const nArc = arcArrow([[-4.5, -2.5, 0.5], [-2.5, -0.5, 0.5], [-1.7, 0.85, 0.9]], 0x70f0a0, 0.06);
      addRoot(nArc);
      S2.fNO = flowOn(nArc.curve, 12, 0.11, 0x60ffa8, 0x104020, 0.35 * clamp(TURGOR2 * kNO, 0.1, 1.2), 0.04);
      CUR.root.add(S2.fNO);

      const stLabel = TURGOR2 * kNO > 0.72 ? '堅硬勃起（NO/cGMP↑ · 靜脈壓閉）' : TURGOR2 * kNO > 0.35 ? '腫脹過渡（Tumescence）' : '鬆弛態（交感張力高 · AV 分流旁路）';
      textSprite(stLabel, [0, 4.9, 0], 0.38, '#ffd479');

      const dt = dtClock();
      CUR.tick = () => {
        const d = S2.play ? dt() : 0; S2.t += d;
        S2.fNO.run(d);
      };
    },
    panel(box) {
      slider(box, '骨盆副交感／NO 刺激強度', 0, 1, TURGOR2, 0.05, v => { TURGOR2 = v; reloadKeep(); });
      seg(box, '藥理／臨床狀態', [['norm', '正常'], ['pde5', 'PDE5i (Viagra)'], ['diab', '糖尿病 NOS↓'], ['alpha', 'α-阻斷劑']], RX2, v => { RX2 = v; reloadKeep(); });
      note(box, RX2_INFO[RX2], 'big');
      checkbox(box, '播放 NO-cGMP 傳導流', true, v => S2.play = v);
    }
  });

  /* ===== 場景③：雌性生殖道與配子雙向運輸（Fig 10.6, Table 10.2–10.3） ===== */
  let S3 = null, STEP3 = 0.75, DEPO3 = 'human';
  SCENES.push({
    name: '③ 雌道雙向運輸',
    title: '陰道→子宮頸隱窩→UTJ→峽部貯存與輸卵管傘拾卵（Fig 10.6, Table 10.3）',
    camera: { pos: [0, 0.6, 20], target: [0, 0, 0], fit: [10.4, 6.4] },
    controls: [
      { label: '🔍 全程總覽', fn() { flyHome(); } },
      { label: '🔍 下段：陰道與子宮頸隱窩', fn() { flyFit([0, -2.5, 0], [4.5, 3.6]); } },
      { label: '🔍 上段：UTJ/峽部與壺腹部受精點', fn() { flyFit([4.2, 2.2, 0], [4.8, 3.4]); } }
    ],
    desc: `
<p>人類男性每次產出數以億計的精子，歷經 30–40 公分（超過精子身長 10 萬倍）的雙重生殖道淘汰後，最終僅數十至數百隻能抵達輸卵管與卵子相遇（<b>&lt; 1/1,000,000</b>）（Ch.10 p.176, 184–186, Fig 10.6）。</p>
<details open><summary>雙向運輸的四個關鍵關卡</summary><ul>
<li><b>① 陰道＆凝塊屏障</b>：人精液形成凝塊抵禦酸性陰道（pH 5.7）並於 20–60 分溶離；<b>&gt;99%</b> 精子仍由陰道漏出；成功入子宮頸隱窩可活 <b>28–48 h</b>。</li>
<li><b>② 子宮輸卵管接合部（UTJ）</b>：間歇括約肌篩選；缺表面蛋白 <b>ADAM1</b> 者雖可正常游泳卻無法穿越！</li>
<li><b>③ 峽部上皮貯庫</b>：精子先黏附休眠，直到排卵時卵／卵丘釋放誘導訊號（<b>嗅覺受體 + 小分子醛/P4?</b>）提高 cAMP/Ca²⁺ 展開超活化向<b>壺腹—峽部交界處（AIJ）</b>移動。</li>
<li><b>④ 輸卵管傘主動拾卵</b>：纖毛與 <b>ICC 節律蠕動</b>將卵巢排入腹腔的卵丘卵團送入 AIJ（人卵存活 <b>6–24 h</b>）。</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.10 p.184–186（Fig 10.6, Tables 10.2–10.3）</p>`,
    build() {
      S3 = { t: 0, play: true };
      const VG = '陰道、凝塊與子宮頸隱窩', UT = '子宮腔與子宮輸卵管接合部（UTJ）', OD = '輸卵管峽部→壺腹（AIJ 受精點）與卵巢';

      // 陰道 (pH 5.7) & 子宮頸
      const vag = annulus(1.3, 0.9, 2.6, 0xd86888, 0.5, -4.6);
      vag.rotation.x = Math.PI / 2; vag.position.set(0, -3.3, 0);
      const coag = ell([0, -3.1, 0], [0.72, 0.65, 0.72], 0xffeec0, DEPO3 === 'human' ? 0.85 : 0.2);
      const cvx = annulus(0.95, 0.35, 1.5, 0xe87890, 0.72, -1.95);
      cvx.rotation.x = Math.PI / 2; cvx.position.set(0, -1.2, 0);
      // 隱窩口袋示意
      const crypts = [ell([-0.68, -1.15, 0.2], [0.28, 0.45, 0.28], 0x90e0ff, 0.75), ell([0.68, -1.15, 0.2], [0.28, 0.45, 0.28], 0x90e0ff, 0.75)];
      reg(VG, DEPO3 === 'human' ? '陰道凝塊與子宮頸隱窩貯庫' : '直接子宮頸／子宮沉積（豬／馬／鼠）', 'Vagina, Coagulum & Cervical crypts',
        DEPO3 === 'human' ? '人類/牛/羊於陰道沉積：超過 99% 精子隨外漏流失；存活進子宮頸隱窩者受黏液滋養並過濾畸形精子（28–48 h）。' : '豬（150–500 ml）/馬（30–300 ml）/犬/鼠於交配時直接射入子宮頸或子宮內。',
        [vag, coag, cvx, ...crypts], { anchor: [-2.8, -2.5, 0.8] });

      // 子宮體剖面 + 兩側輸卵管（著重右側高細節放大）
      const utBody = shell(1, [2.1, 2.0, 1.2], 0xe27080, 0.34, 0.35, Math.PI * 1.7);
      utBody.position.set(0, 1.1, 0);
      const endoIn = shell(1, [1.55, 1.5, 0.9], 0xff9eb0, 0.45, 0.4, Math.PI * 1.6);
      endoIn.position.set(0, 1.05, 0);
      const utjR = ring([1.75, 2.0, 0], [0.95, 0.3, 0], 0.36, 0.11, 0xffd479);
      const utjL = ring([-1.75, 2.0, 0], [-0.95, 0.3, 0], 0.36, 0.11, 0xffd479);
      reg(UT, '子宮腔與 UTJ 括約肌關卡（ADAM1 檢驗點）', 'Uterus & Uterotubal junction (UTJ)',
        '交配後 2–7 小時第一批活精子可抵輸卵管；<b>UTJ 括約肌</b>只允許具正常表面蛋白 <b>ADAM1</b> 且交互作用合格的精子通過！',
        [utBody, endoIn, utjR, utjL], { anchor: [-3.3, 1.9, 0.8] });

      // 右側輸卵管：峽部 -> AIJ -> 壺腹 -> 輸卵管傘 -> 腹腔開口 -> 卵巢
      const ovPathR = [V(1.75, 2.0, 0), V(3.3, 2.5, 0), V(4.8, 3.3, 0), V(6.4, 3.2, 0.2), V(7.3, 1.8, 0.3), V(6.7, 0.6, 0.2)];
      const tubeR = ttube(ovPathR, [0.22, 0.26, 0.42, 0.56, 0.45, 0.72], 0xf0a0b4, 0.45, { organic: false });
      const tubeL = ttube([V(-1.75, 2.0, 0), V(-3.3, 2.5, 0), V(-4.8, 3.3, 0), V(-6.4, 3.2, 0.2), V(-7.0, 1.5, 0.2)], [0.22, 0.28, 0.45, 0.6], 0xf0a0b4, 0.38, { organic: false });
      // 卵巢 + 排卵點
      const ovR = ell([5.4, 0.2, 0], [1.1, 0.75, 0.7], 0xf6c080, 0.9);
      const ovL = ell([-5.2, 0.2, 0], [1.1, 0.75, 0.7], 0xf6c080, 0.75);
      // 傘指
      const fimb = [];
      for (let i = 0; i < 5; i++) fimb.push(cone([6.8, 0.6, 0.2], [6.0 + Math.cos(i * 1.2) * 0.65, 0.05 + Math.sin(i * 1.2) * 0.45, 0.25], 0.14, 0xff8098, 0.9));
      const aijMark = ring([4.8, 3.3, 0], [0.95, 0.25, 0], 0.52, 0.09, 0x46d16a);
      reg(OD, '峽部貯存庫、AIJ 受精位點與輸卵管傘', 'Isthmus, Ampullary–Isthmic Junction & Fimbria',
        '受精發生於<b>壺腹—峽部交界處（AIJ，綠環）</b>：精子從峽部受化學趨化訊號吸引游出，與被輸卵管傘從腹腔拾入且靠纖毛/ICC 推進的卵丘卵團會合！',
        [tubeR, tubeL, ovR, ovL, ...fimb, aijMark], { anchor: [7.6, 3.6, 0.8] });

      // 追蹤精子群（藍白點）與排出的卵丘卵團（黃珠）沿 STEP3 移動到 AIJ
      const spCurve = new THREE.CatmullRomCurve3([V(0, -3.5, 0), V(0, -1.2, 0), V(0.5, 1.3, 0), V(1.8, 2.0, 0), V(3.3, 2.5, 0), V(4.8, 3.3, 0)]);
      const ovCurve = new THREE.CatmullRomCurve3([V(5.6, 0.5, 0.1), V(6.7, 0.7, 0.2), V(7.3, 1.8, 0.3), V(6.4, 3.2, 0.2), V(4.8, 3.3, 0)]);
      const spPos = spCurve.getPoint(STEP3);
      const ovPos = ovCurve.getPoint(STEP3);
      S3.spermSwarm = dots([spPos, spPos.clone().add(V(0.18, 0.1, 0.1)), spPos.clone().add(V(-0.15, -0.08, 0.1))], 0.13, 0x90e8ff);
      S3.egg = ell(ovPos.toArray(), [0.32, 0.32, 0.32], 0xffd43a, 0.95);
      S3.cumulus = ell(ovPos.toArray(), [0.55, 0.55, 0.55], 0xffe898, 0.38);
      CUR.root.add(S3.spermSwarm, S3.egg, S3.cumulus);

      S3.fSp = flowOn(spCurve, 18, 0.08, 0x90e8ff, 0x103050, 0.18, 0.05);
      S3.fOv = flowOn(ovCurve, 8, 0.11, 0xffd479, 0x403000, 0.14, 0.03);
      CUR.root.add(S3.fSp, S3.fOv);

      textSprite(STEP3 > 0.85 ? '抵達 AIJ 會合點！（精子數百隻 vs 單卵）' : '雙向運輸推進中…', [0, 5.1, 0], 0.38, '#ffd479');

      const dt = dtClock();
      CUR.tick = () => {
        const d = S3.play ? dt() : 0; S3.t += d;
        S3.fSp.run(d); S3.fOv.run(d);
      };
    },
    panel(box) {
      slider(box, '配子向 AIJ 會合進度', 0, 1, STEP3, 0.05, v => { STEP3 = v; reloadKeep(); });
      seg(box, '交配沉積物種比較', [['human', '人/牛/羊（陰道頸口）'], ['pig', '豬/馬/鼠（子宮內）']], DEPO3, v => { DEPO3 = v; reloadKeep(); });
      const cv = mkCanvas(box, 290, 155);
      plot(cv, {
        title: 'Table 10.3 配子於雌性生殖道存活時間（小時）',
        x: [0, 7], y: [0, 125], xt: [1, 2, 3, 4, 5, 6], yt: [0, 30, 60, 90, 120],
        fmtX: v => ['', '人', '牛', '羊', '馬', '豬', '鼠'][v] || '',
        xl: '物種（藍：精子存活上限；黃：卵子存活上限）',
        series: [
          { pts: [[1, 48], [2, 48], [3, 48], [4, 120], [5, 50], [6, 12]], col: '#4db8e8', label: '精子存活上限 (h)', w: 2.5 },
          { pts: [[1, 24], [2, 12], [3, 25], [4, 8], [5, 10], [6, 15]], col: '#ffd43a', label: '卵子存活上限 (h)', w: 2.5 }
        ]
      });
      note(box, '<b>Table 10.2 分節射精：</b>前列腺（酸性磷酸酶，人 2470 U/ml）→ 輸精管（精子）→ 儲精囊（果糖 8–37 mM）。', 'big');
      checkbox(box, '播放粒子運輸流', true, v => S3.play = v);
    }
  });

  /* ===== 場景④：陰莖橫切面逐層剝開解剖（整合比較大體解剖） ===== */
  SCENES.push({
    name: '④ 陰莖橫切（逐層剝開）',
    title: '陰莖橫切面層次構造（由外而內逐層剝開）',
    camera: { pos: [2.6, 2.2, 4.2], target: [0, 0, 0], fit: [1.8, 1.5] },
    controls: [{ label: '🔍 橫切剖面復位', fn() { flyHome(); } }],
    desc: `
<p>自外而內逐層剝開：<b>皮膚 → 淺陰莖筋膜（Colles 筋膜）→ 疏鬆結締組織 → 深陰莖筋膜（Buck 筋膜）→ 白膜（Tunica albuginea）</b>，內部並列三條勃起柱：背側成對<b>陰莖海綿體</b>與腹側圍繞尿道之<b>尿道海綿體</b>（銜接本頁 ②勃起血液動力模型）。</p>
<p class="src">雷弟生物學 3D 比較解剖整合（對應 Essential Reproduction Ch.10 Box 10.1）</p>`,
    build() {
      const layers = [
        ['皮膚', 'Skin', 1.0, 0.94, 0xe3b79a, 0.0, '最外層皮膚（游離部另覆包皮）。'],
        ['淺陰莖筋膜（Colles 筋膜）', "Superficial fascia (Colles' fascia)", 0.93, 0.87, 0xd9a0a0, 0.25, '皮下第一層筋膜。'],
        ['疏鬆結締組織', 'Loose connective tissue', 0.86, 0.80, 0xf1e6c8, 0.5, '使淺深層筋膜間可滑動。'],
        ['深陰莖筋膜（Buck 筋膜）', "Deep fascia (Buck's fascia)", 0.79, 0.73, 0xc9d6e8, 0.75, '緊貼白膜包被勃起柱之堅韌筋膜。'],
        ['白膜', 'Tunica albuginea', 0.72, 0.67, 0xfafafa, 1.0, '緻密纖維膜限制海綿體充血過度擴張，維持勃起高壓硬度並壓閉白膜下靜脈叢。']
      ];
      layers.forEach(l => {
        reg('包被層次（由外而內）', l[0], l[1], l[6], annulus(l[2], l[3], 1.6 - 1.2 + l[5], l[4], 1, -1.0), { anchor: [l[2] * 0.7, l[2] * 0.7, l[5] - 0.7] });
      });
      reg('勃起組織', '中隔／海綿體間結締組織', 'Septum / trabecular tissue', '白膜向內形成中隔並伸出含平滑肌之小樑支架。', disc(0.67, 2.2, 0xe8d3c5, 1, 0, 0, -1.0), { anchor: [0, 0.05, 1.1] });
      const Z0 = -1.0, LEN = 2.3, cc = [-1, 1].map(s => disc(0.31, LEN, 0xc8404a, 1, s * 0.32, 0.2, Z0));
      reg('勃起組織', '陰莖海綿體（左右各一）', 'Corpus cavernosum penis', '背側成對高壓勃起組織（肉食類遠端特化成陰莖骨 os penis）。', cc, { anchor: [-0.32, 0.2, 1.3] });
      const rr = rnd(11), dg = new THREE.CircleGeometry(1, 12), instM = new THREE.InstancedMesh(dg, mat(0x7a1520, 1), 80), mtx = new THREE.Matrix4();
      for (let i = 0; i < 80; i++) {
        const s = i < 40 ? -1 : 1, a = rr() * 6.28, rd = Math.sqrt(rr()) * 0.26, r = 0.03 + rr() * 0.03;
        mtx.compose(V(s * 0.32 + Math.cos(a) * rd, 0.2 + Math.sin(a) * rd, Z0 + LEN + 0.002), new THREE.Quaternion(), V(r, r, 1));
        instM.setMatrixAt(i, mtx);
      }
      instM.instanceMatrix.needsUpdate = true; instM.frustumCulled = false;
      reg('勃起組織', '海綿窩（血液空間）', 'Cavernous sinusoids', '肌肉海綿型血液竇寬大；彈性纖維型結締組織較厚實。', instM, { anchor: [0.32, 0.2, Z0 + LEN + 0.02] });
      reg('勃起組織', '尿道海綿體', 'Corpus spongiosum', '腹側圍繞尿道（勃起壓力較低以免壓扁尿道影響射精）。', disc(0.27, LEN, 0x8e5a9e, 1, 0, -0.42, Z0), { anchor: [0, -0.5, 1.3] });
      const urMesh = annulus(0.1, 0.055, LEN + 0.05, 0xffd35c, 1, Z0); urMesh.position.y = -0.42;
      reg('勃起組織', '尿道', 'Urethra', '尿液與精液最後共同通道，分布尿道腺。', urMesh, { anchor: [0.1, -0.42, 1.4] });
      reg('勃起組織', '尿道腔', 'Urethral lumen', '管腔中央通道。', disc(0.055, LEN + 0.02, 0x3a2a10, 1, 0, -0.42, Z0), { anchor: [0, -0.42, Z0 + LEN + 0.05], nolabel: true });
    }
  });

  /* ===== 場景⑤：雄禽交接器官的三種類型（比較生殖生理與交配機制） ===== */
  SCENES.push({
    name: '⑤ 雄禽交接器官三型',
    title: '雄禽交接器官比較（97% 無插入型 vs 非插入型 vs 鴨鵝螺旋插入型）',
    camera: { pos: [0, 3.0, 11.0], target: [0.0, 0.3, 0.5], fit: [4.5, 2.6] },
    controls: [{ label: '🔍 三型並列比較', fn() { flyHome(); } }],
    desc: `
<p>不同於哺乳動物陰莖（兼負排尿並以血液充血勃起），禽類交接器<b>不兼排尿</b>且由泄殖腔旁血管體產生<b>淋巴液</b>推動勃起！97% 鳥類沒有插入型陰莖，僅 3%（如雁鴨、平胸鳥類）具螺旋插入型陰莖。</p>
<p class="src">雷弟生物學 3D 比較解剖整合（搭配 Ch.07 ⑤雄禽整體構造閱讀）</p>`,
    build() {
      const XA = -2.9, XB = 0, XC = 2.9;
      const vent = x => ring(V(x, 0, 0), V(0, 0, 1), 0.5, 0.09, 0xd4707a);
      const G1 = '(一) 缺乏陰莖：泄殖腔接吻';
      reg(G1, '外翻泄殖腔（泄殖腔口）', 'Everted cloaca (cloacal kiss)', '鸚鵡、燕雀、鴿與猛禽藉外翻泄殖腔緊貼雌禽傳遞精液。', [vent(XA), ell([XA, 0, 0.12], [0.4, 0.4, 0.22], 0xe88a92, 0.8)], { anchor: [XA + 0.4, 0.35, 0.2] });
      reg(G1, '輸精管乳頭（開口）', 'Papillae of ductus deferens', '精液直接排出。', [cone([XA - 0.15, 0.02, 0.2], [XA - 0.15, 0.02, 0.45], 0.06, 0xf2f0d0), cone([XA + 0.15, 0.02, 0.2], [XA + 0.15, 0.02, 0.45], 0.06, 0xf2f0d0)], { anchor: [XA, 0.02, 0.45] });
      const G2 = '(二) 非插入型陰莖：雞／火雞／鵪鶉';
      reg(G2, '泄殖腔口', 'Vent', '腹唇具短小非插入型突起（剛孵出時大小亦作為雛雞雌雄鑑別依據）。', [vent(XB), ell([XB, 0.05, 0.1], [0.38, 0.36, 0.2], 0xe88a92, 0.7)], { anchor: [XB + 0.45, 0.3, 0.1] });
      reg(G2, '輸精管乳頭', 'Papillae of ductus deferens', '射精沿正中溝流入雌鳥輸卵管。', [cone([XB - 0.15, 0.1, 0.2], [XB - 0.15, 0.1, 0.4], 0.05, 0xf2f0d0), cone([XB + 0.15, 0.1, 0.2], [XB + 0.15, 0.1, 0.4], 0.05, 0xf2f0d0)], { anchor: [XB + 0.15, 0.2, 0.4] });
      reg(G2, '側陰莖體', 'Lateral phallic bodies', '由淋巴液充脹變腫脹但不能伸出插入。', [ell([XB - 0.14, -0.44, 0.2], [0.1, 0.1, 0.14], 0xf8f0e0), ell([XB + 0.14, -0.44, 0.2], [0.1, 0.1, 0.14], 0xf8f0e0)], { anchor: [XB + 0.3, -0.5, 0.25] });
      reg(G2, '陰莖正中溝', 'Median groove', '引導精液向下流經之溝槽。', cyl([XB, -0.4, 0.14], [XB, -0.45, 0.32], 0.02, 0x4a2a2a), { anchor: [XB, -0.62, 0.3] });
      reg(G2, '腫脹的淋巴皺褶', 'Lymphatic fold', '灌注淋巴液推動腹唇突起。', ell([XB, -0.3, 0.05], [0.28, 0.13, 0.12], 0xbfd8f0, 0.45), { anchor: [XB - 0.45, -0.3, 0.05] });
      const G3 = '(三) 插入型陰莖：鵝／鴨／平胸鳥類';
      const base = [XC, -0.2, 0.15], apex = [XC, 1.5, 1.5], axis = lineCurve(base, apex), turns = 2.5, R = 0.3;
      reg(G3, '泄殖腔口', 'Vent', '陰莖勃起伸出泄殖腔腹側。', vent(XC), { anchor: [XC + 0.55, -0.1, 0] });
      reg(G3, '皮下囊（粗囊）', 'Cutaneous sac', '鵝陰莖逆時針盤旋約 2.5 圈成雙 U 形結構。', tube(helixAlong(axis, R, turns, 0, 260), 0.105, 0xe8b88a, 1, 2), { anchor: [XC + 0.45, 0.7, 0.9] });
      reg(G3, '腺體囊（細囊）', 'Glandular sac', '尖端具開口排出類精漿分泌物。', tube(helixAlong(axis, R, turns, Math.PI, 260), 0.06, 0x6fa0d8, 1, 2), { anchor: [XC - 0.4, 0.9, 1.1] });
      reg(G3, '螺旋溝／陰莖摺縫', 'Phallic flexure', '射精時精液沿螺旋溝直入雌鳥泄殖腔。', tube(helixAlong(axis, R, turns, Math.PI / 2, 260), 0.03, 0x3a2418, 1, 2), { anchor: [XC, 0.5, 0.75] });
      reg(G3, '軟骨體', 'Cartilaginous body', '基部支持構造（全長勃起可達 8–10 cm）。', ell([XC, -0.22, 0.12], [0.28, 0.18, 0.2], 0xf5f5f0), { anchor: [XC - 0.3, -0.3, 0.1] });
      reg(G3, '陰莖懸韌帶', 'Suspensorium phalli', '固定於泄殖腔壁之韌帶。', [cyl([XC - 0.2, -0.3, 0.05], [XC - 0.65, -0.1, -0.1], 0.03, 0xe0d3b0), cyl([XC + 0.2, -0.3, 0.05], [XC + 0.65, -0.1, -0.1], 0.03, 0xe0d3b0)], { anchor: [XC - 0.65, -0.15, -0.1] });
      const pouch = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.0, 24, 1, true), mat(0x9fc5e8, 0.14));
      pouch.position.set(XC, 0.15, 0.4); pouch.quaternion.setFromUnitVectors(V(0, 1, 0), V(0, 0.6, 0.8));
      reg(G3, '陰莖袋', 'Phallic pouch', '未勃起時將陰莖反轉收藏於腹膜袋內。', pouch, { anchor: [XC + 0.55, 0, 0.5] });
      const RD = [];
      for (let i = 1; i < 14; i++) {
        const t = i / 14, p = axis.getPointAt(t), a = Math.PI * 2 * t * turns, fr = axis.computeFrenetFrames(2, false);
        const rad = fr.normals[0].clone().multiplyScalar(Math.cos(a)).addScaledVector(fr.binormals[0], Math.sin(a));
        const pt = p.clone().addScaledVector(rad, R + 0.1), Tt = axis.getTangentAt(t);
        const rCone = cone(pt.toArray(), pt.clone().addScaledVector(Tt, -0.14).addScaledVector(rad, 0.03).toArray(), 0.03, 0xf2ead8);
        rCone.quaternion.setFromUnitVectors(V(0, 1, 0), Tt.clone().multiplyScalar(-1).addScaledVector(rad, 0.2).normalize());
        RD.push(rCone);
      }
      reg(G3, '陰莖脊', 'Phallic ridges', '朝向基部之倒棘幫助交配固定。', RD, { anchor: [XC + 0.45, 0.2, 0.55] });
      reg(G3, '尖端（腺囊開口）', 'Apex', '末端腺囊開口釋放分泌物。', [ell(apex, [0.1, 0.1, 0.1], 0xe0a0a0), ring(V(...apex), V(0, 0.6, 0.8), 0.06, 0.02, 0x4a2a2a)], { anchor: [XC + 0.15, 1.6, 1.55] });
    }
  });

  /* ===== 場景⑥：輸卵管分段、組織切面、上皮細胞與四種物種卵巢囊比較（整合比較大體解剖） ===== */
  (function () {
    const { mat, ell, tube, ttube, lathe, box, shell, ring, annulus } = ANAT;
    SCENES.push({
      name: '⑥ 輸卵管與卵巢囊',
      title: '輸卵管解剖：漏斗→壺部→峽部→UTJ、切面上皮與四型卵巢囊',
      camera: { pos: [-0.2, -0.3, 13], target: [-0.2, -0.4, 0], fit: [7.8, 3.8] },
      controls: [
        { label: '🔍 全圖總覽', fn() { flyHome(); } },
        { label: '🔍 分段＋橫切面', fn() { flyTo([-2.4, 0.5, 7], [-2.4, 0.5, 0]); } },
        { label: '🔍 上皮細胞', fn() { flyTo([-3.0, -2.4, 4.2], [-3.0, -2.6, 0]); } },
        { label: '🔍 卵巢囊物種型式', fn() { flyTo([3.4, 0.4, 6], [3.4, 0.3, 0]); } }
      ],
      desc: `
<p>補足本頁 ③雌道雙向運輸的微細組織學對比：上左比較<b>漏斗 → 壺部（受精、黏膜最發達分枝）→ 峽部（貯精、肌層最厚）→ 宮管接合（UTJ）</b>；下方比對濾泡期（纖毛細胞多）vs 黃體期（分泌細胞多）上皮與四類物種卵巢囊。</p>
<p class="src">雷弟生物學 3D 比較解剖整合（對應 Essential Reproduction Ch.10 p.185 輸卵管運輸）</p>`,
      build() {
        const Y = 1.4, TB = 0xf0cdbd, MU = 0xc97a5c, MC = 0xb0563f, ML = 0xc9765c, SE = 0xf6eedc, EP = 0xfff2a8;
        const G1 = '輸卵管分段', G2 = '管壁橫切面', G3 = '上皮細胞', G4 = '卵巢囊型式';
        const foldRod = (x0, x1, rIn, n, depth, branch, col) => {
          const s = new THREE.Shape(), N = 240;
          for (let i = 0; i <= N; i++) {
            const t = i / N * Math.PI * 2;
            const f = Math.pow(Math.max(0, Math.cos(n * t)), 2) + branch * Math.pow(Math.max(0, Math.cos(n * 3 * t + 0.6)), 4);
            const r = rIn * (1 - depth) + rIn * depth * Math.min(1, f);
            const p = [Math.cos(t) * r, Math.sin(t) * r];
            i ? s.lineTo(...p) : s.moveTo(...p);
          }
          const g = new THREE.ExtrudeGeometry(s, { depth: x1 - x0, bevelEnabled: false, curveSegments: 4 });
          const m = new THREE.Mesh(g, mat(col, 0.95)); m.rotation.y = Math.PI / 2; m.position.set(x0, Y, 0); return m;
        };

        const fc = V(-4.65, Y, 0), dir = V(-1, 0, 0), FIM = [], q = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), dir);
        for (let k = 0; k < 16; k++) {
          const a = k / 16 * Math.PI * 2, rim = V(Math.cos(a) * 0.55, 0.45, Math.sin(a) * 0.55).applyQuaternion(q).add(fc);
          const tip = V(Math.cos(a + 0.15) * 0.78, 0.7, Math.sin(a + 0.15) * 0.78).applyQuaternion(q).add(fc);
          FIM.push(tube([rim, rim.clone().lerp(tip, 0.5).add(V(0, 0.03 * Math.sin(k * 3), 0)), tip], 0.035, 0xf4a87c));
        }
        reg(G1, '漏斗（輸卵管漏斗）', 'Infundibulum', '近端漏斗拾取卵（包含對側腹腔排出的卵）。', lathe([[0.13, 0], [0.2, 0.12], [0.38, 0.32], [0.55, 0.45]], 0xf7c890, 0.6, fc.toArray(), dir.toArray()), { anchor: [-4.8, Y + 0.45, 0] });
        reg(G1, '輸卵管繖', 'Fimbriae', '邊緣不規則指狀皺褶。', FIM, { anchor: [-5.3, Y - 0.6, 0] });
        reg(G1, '輸卵管腹口', 'Ostium abdominale', '通入輸卵管管腔。', ring(V(-4.66, Y, 0), dir, 0.13, 0.025, 0x6a3a2a), { anchor: [-4.66, Y, 0.15] });
        reg(G1, '輸卵管壺部', 'Ampulla', '約占半長，受精發生處，黏膜皺褶分枝最多。', [ttube([[-4.6, Y, 0], [-3.4, Y + 0.04, 0], [-2.2, Y, 0]], 0.3, TB, 0.3), foldRod(-4.55, -2.25, 0.25, 6, 0.75, 0.8, 0xf2a8a0)], { anchor: [-3.4, Y + 0.32, 0] });
        reg(G1, '輸卵管峽部', 'Isthmus', '較短、管壁肌層最厚、精子貯存調控區。', [ttube([[-2.2, Y, 0], [-1.4, Y, 0], [-0.62, Y, 0]], t => 0.3 - 0.12 * Math.min(1, t * 4), 0xe9b860, 0.55), foldRod(-2.15, -0.65, 0.1, 4, 0.6, 0, 0xf2a8a0)], { anchor: [-1.4, Y + 0.22, 0] });
        reg(G1, '宮管接合', 'Uterotubal junction (UTJ)', '豬具指狀瓣防多精入卵，牛羊呈扭結調節早期胚入宮。', ring(V(-0.5, Y, 0), V(1, 0, 0), 0.17, 0.06, 0xd4708a), { anchor: [-0.5, Y + 0.25, 0] });
        reg(G1, '子宮角（尖端）', 'Uterine horn (tip)', '連接峽部進入子宮。', ttube([[-0.42, Y, 0], [0.2, Y, 0], [0.75, Y, 0]], [0.18, 0.38], 0xcf7480, 0.5), { anchor: [0.3, Y + 0.35, 0] });
        const zygZP = shell(0.13, [1, 1, 1], 0xffffff, 0.45, 0, Math.PI * 2); zygZP.position.set(-3.2, Y, 0);
        reg(G1, '合子（受精卵）', 'Zygote', '進入子宮前駐留輸卵管約 1–2 天（兔卵外獲得多醣包膜）。', [ell([-3.2, Y, 0], [0.1, 0.1, 0.1], 0xfbefb0), zygZP], { anchor: [-3.2, Y - 0.1, 0.12] });
        textSprite('卵巢端 →→→→→ 子宮端', [-2.3, Y + 0.85, 0], 0.26, '#8fd0ff');

        const section = (cx, cy, R, mT, n, depth, branch, name) => {
          const rm = R - 0.05 - mT, m = {}, at = mesh => { mesh.position.set(cx, cy, 0); return mesh; };
          m.serosa = at(annulus(R, R - 0.05, 0.05, SE));
          m.lon = at(annulus(R - 0.05, R - 0.05 - mT * 0.4, 0.06, ML));
          m.cir = at(annulus(R - 0.05 - mT * 0.4, rm, 0.06, MC));
          const s = new THREE.Shape(); s.absarc(0, 0, rm, 0, Math.PI * 2, false);
          const pts = [], N = 300;
          for (let i = 0; i < N; i++) {
            const t = i / N * Math.PI * 2, f = Math.pow(Math.max(0, Math.cos(n * t)), 2) + branch * Math.pow(Math.max(0, Math.cos(n * 3 * t + 0.6)), 4);
            const r = rm * (0.93 - depth * Math.min(1, f)); pts.push(new THREE.Vector2(Math.cos(t) * r, Math.sin(t) * r));
          }
          s.holes.push(new THREE.Path(pts));
          m.muc = at(new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.07, bevelEnabled: false, curveSegments: 48 }), mat(0xf2a8a0)));
          m.epi = ttube(pts.map(p => [cx + p.x, cy + p.y, 0.075]), 0.012, EP, 1, { closed: true, cap: false, radial: 6, seg: 400 });
          textSprite(name, [cx, cy - R - 0.25, 0], 0.24);
          return m;
        };
        const S1 = section(-4.6, -0.35, 0.55, 0.06, 5, 0.45, 0, '漏斗部切面');
        const S2 = section(-3.2, -0.35, 0.75, 0.1, 7, 0.75, 1.0, '壺部切面');
        const S3 = section(-1.5, -0.35, 0.55, 0.22, 5, 0.5, 0, '峽部切面');
        const S = [S1, S2, S3];
        reg(G2, '漿膜', 'Serosa', '最外層單層方形中皮＋薄結締組織。', S.map(s => s.serosa), { anchor: [-3.2, 0.4, 0.05] });
        reg(G2, '縱行肌層（外）', 'Longitudinal muscle', '平滑肌外層。', S.map(s => s.lon), { anchor: [-1.0, -0.5, 0.06] });
        reg(G2, '環行／螺旋肌層（內）', 'Circular muscle', '肌層厚度往峽部方向遞增助蠕動推進配子。', S.map(s => s.cir), { anchor: [-1.85, -0.1, 0.06] });
        reg(G2, '黏膜皺褶（固有層）', 'Mucosal folds', '壺部皺褶最顯著分枝以擴大受精微環境。', S.map(s => s.muc), { anchor: [-2.9, -0.05, 0.07] });
        reg(G2, '黏膜上皮', 'Epithelium', '單層柱狀（不含杯狀細胞）。', S.map(s => s.epi), { anchor: [-4.4, -0.35, 0.08] });

        const Y0 = -2.75, cells = 'CSCPCCSCSPCSC', CIL = [], SEC = [], PEG = [], CIN = [], SGR = [];
        let x = -4.9;
        for (const t of cells) {
          if (t === 'C') {
            const w = 0.26, h = 0.78; CIL.push(box([x + w / 2, Y0 + h / 2, 0], [w * 0.96, h, 0.3], 0xbfe0f0));
            CIN.push(ell([x + w / 2, Y0 + h * 0.5, 0.1], [0.08, 0.1, 0.08], 0xd8ccf0));
            for (let k = 0; k < 6; k++) CIL.push(cyl([x + 0.03 + k * 0.04, Y0 + h, 0.05 - (k % 2) * 0.1], [x + 0.03 + k * 0.04 + 0.02 * Math.sin(k), Y0 + h + 0.22, 0.05 - (k % 2) * 0.1], 0.006, 0xffffff));
            x += w;
          } else if (t === 'S') {
            const w = 0.17, h = 0.82; SEC.push(box([x + w / 2, Y0 + h / 2, 0], [w * 0.96, h, 0.3], 0xf0d0a0));
            SEC.push(ell([x + w / 2, Y0 + h * 0.35, 0.1], [0.06, 0.09, 0.06], 0x7a4fa0));
            for (let k = 0; k < 5; k++) SGR.push(ell([x + 0.04 + (k % 3) * 0.045, Y0 + h - 0.06 - Math.floor(k / 3) * 0.06, 0.12], [0.022, 0.022, 0.022], 0xc0508a));
            x += w;
          } else {
            const w = 0.07, h = 0.76; PEG.push(box([x + w / 2, Y0 + h / 2, 0], [w * 0.96, h, 0.3], 0x8a6aa8));
            PEG.push(ell([x + w / 2, Y0 + h * 0.45, 0.1], [0.03, 0.12, 0.05], 0x40285a));
            x += w;
          }
        }
        const xm = (-4.9 + x) / 2, ww = x + 4.9;
        reg(G3, '纖毛細胞', 'Ciliated cell', '濾泡期豐富（將液體掃向子宮）；漏斗端比例最高。', [...CIL, ...CIN], { anchor: [-4.77, Y0 + 0.95, 0] });
        reg(G3, '分泌性細胞', 'Secretory cell', '黃體期增多（壺部約占 50%），促精子獲能並營養受精卵。', [...SEC, ...SGR], { anchor: [-4.55, Y0 + 0.82, 0] });
        reg(G3, '插入細胞', 'Peg (intercalary) cell', '分泌性細胞先驅／耗盡態。', PEG, { anchor: [-4.1, Y0 + 0.5, 0.16] });
        reg(G3, '基底膜', 'Basement membrane', '上皮支持膜。', box([xm, Y0 - 0.02, 0], [ww, 0.04, 0.32], 0xffffff), { anchor: [xm + 1.0, Y0 - 0.02, 0.16] });
        reg(G3, '固有層', 'Lamina propria', '結締組織基質（無其他腺體與杯狀細胞）。', box([xm, Y0 - 0.3, 0], [ww, 0.52, 0.32], 0xf2b8b0, 0.9), { anchor: [xm, Y0 - 0.35, 0.16] });
        textSprite('↑ 管腔（纖毛掃向子宮）', [x + 1.5, Y0 + 0.9, 0], 0.22, '#8fd0ff');

        const OVC = 0xf2e2c8, BU = 0x8fc7e0;
        const mini = (cx, cy, name, en, info, bursa) => {
          const ov = ell([cx, cy, 0], [0.32, 0.22, 0.22], OVC);
          const tubeM = tube([[cx - 0.5, cy + 0.45, 0], [cx - 0.1, cy + 0.6, 0.1], [cx + 0.5, cy + 0.55, 0], [cx + 0.7, cy + 0.1, 0]], 0.05, TB);
          reg(G4, name, en, info, [ov, tubeM, ...bursa], { anchor: [cx, cy - 0.45, 0] });
          textSprite(name, [cx, cy - 0.85, 0], 0.22);
        };
        const bShell = (cx, cy, ts, tl, ps, pl, o = 0.35) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.48, 32, 20, ps, pl, ts, tl), mat(BU, o)); m.position.set(cx, cy, 0); m.scale.set(1, 0.85, 0.85); return m; };
        mini(2.5, 1.2, '牛、兔、綿羊：不包圍', 'No ovarian bursa covering', '漏斗僅貼近卵巢而不覆蓋。', [lathe([[0.06, 0], [0.12, 0.08], [0.24, 0.18]], 0xf7c890, 0.8, [2.08, 1.5, 0], [0.4, -1, 0])]);
        mini(4.4, 1.2, '豬：發達、開放', 'Sow: well-developed open bursa', '開放但寬大囊膜包覆大半卵巢。', [bShell(4.4, 1.2, 0.9, Math.PI - 0.9, 0, Math.PI * 2)]);
        mini(2.5, -0.85, '犬、狐、水貂：有裂隙', 'Dog / fox / mink: slit', '具僅容許卵巢進出的裂縫。', [bShell(2.5, -0.85, 0, Math.PI, 0.35, Math.PI * 2 - 0.7)]);
        mini(4.4, -0.85, '小鼠、鼠：幾乎封閉', 'Mouse / rat: closed bursa', '僅極小開孔以保存排卵後積液（馬則僅窄囊包圍排卵窩）。', [bShell(4.4, -0.85, 0.22, Math.PI - 0.22, 0, Math.PI * 2, 0.45)]);
      }
    });
  })();

  /* ===== 場景⑦：子宮頸與陰道縱切物種比較（整合比較大體解剖） ===== */
  (function () {
    const { tube, ttube, lathe, halfRing, halfCyl, ring } = ANAT;
    SCENES.push({
      name: '⑦ 子宮頸物種縱切',
      title: '子宮頸與陰道縱切面比較（牛／豬／馬／犬／人精子屏障 vs 通道差異）',
      camera: { pos: [0, 0.2, 15.5], target: [0, -0.3, 0], fit: [8.6, 4.2] },
      controls: [
        { label: '🟡 母牛：顯示／隱藏 子宮頸栓（懷孕）', fn() { const p = CUR.parts.find(p => p.zh === '子宮頸栓（懷孕）'); p.visible = !p.visible; rebuildList(); refresh(); if (p.visible) select(p); } },
        { label: '🔍 五物種並列全覽', fn() { flyHome(); } },
        { label: '🔍 牛（四嵌合圓環）', fn() { flyTo([-5, 0, 5.5], [-5, -0.3, 0]); } },
        { label: '🔍 豬（螺旋配合公豬）', fn() { flyTo([-2.5, 0, 5.5], [-2.5, -0.3, 0]); } },
        { label: '🔍 馬（縱褶花瓣突出）', fn() { flyTo([0, 0, 5.5], [0, -0.3, 0]); } },
        { label: '🔍 狗（單一皺褶）', fn() { flyTo([2.5, 0, 5.5], [2.5, -0.3, 0]); } },
        { label: '🔍 人（SCJ 移行區）', fn() { flyTo([5, 0, 5.5], [5, -0.3, 0]); } }
      ],
      desc: `
<p>對照本頁 Table 10.3「射精部位差異」背後之解剖關鍵——比較<b>牛羊（4 嵌合圓環＝精子障礙）</b>、<b>豬（螺旋枕配合公豬螺旋陰莖＝無障礙）</b>、<b>馬（短管顯著縱褶＝無障礙）</b>、<b>犬（單皺褶＝黏連與障礙）</b>與<b>人（內外子宮頸鱗狀柱狀交接處 SCJ）</b>。</p>
<p class="src">雷弟生物學 3D 比較解剖整合（下方按鈕可顯示母牛懷孕子宮頸栓與逐一近距觀察各物種）</p>`,
      build() {
        const CXC = 0xe2c0c2, MUC = 0xeab0bc, RG = 0xb05a72, VG = 0xe5a9ab, UT = 0xcf7480;
        const vag = (x, y1 = -0.8) => [halfCyl([x, 0, 0], 0.62, 0.62, -2.2, y1, VG, 0.6)];
        const uter = (x, y0) => [halfCyl([x, 0, 0], 0.5, 0.6, y0, y0 + 0.7, UT, 0.45)];
        const title = (x, t, s) => textSprite(t, [x, -2.75, 0], 0.62, '#ffd479', s);

        let X = -5, G = '牛（反芻獸）';
        title(X, '母牛', '圓環4個・嵌合');
        reg(G, '子宮頸壁（牛）', 'Cervical wall', '厚壁僵硬富含膠原彈性結締組織，含大量分泌杯狀細胞。', [halfCyl([X, 0, 0], 0.45, 0.45, -0.8, 0.8, CXC, 0.7), halfCyl([X, 0, 0], 0.32, 0.32, -0.8, 0.8, MUC, 0.9)], { anchor: [X + 0.45, 0.2, 0] });
        reg(G, '圓環（4 個，互相嵌合）', 'Annular rings ×4', '互相嵌合緊鎖管腔（為天然精子障壁，人工授精須穿入此處）。', [-0.55, -0.18, 0.18, 0.55].map((y, k) => halfRing([X + (k % 2 ? 0.05 : -0.05), y, 0], 0.22, 0.1, RG)), { anchor: [X - 0.35, 0.18, 0] });
        const LR = [];
        for (let k = 0; k < 5; k++) { const a = Math.PI + (k + 0.5) / 5 * Math.PI, zx = X + Math.cos(a) * 0.3, zz = -Math.abs(Math.sin(a)) * 0.3; LR.push(tube([[zx, -0.75, zz], [zx, 0.75, zz]], 0.025, 0xb85a80)); }
        reg(G, '縱脊（黏膜皺褶）', 'Longitudinal ridges', '顯著擴大黏膜隱窩貯精與分泌表面積。', LR, { anchor: [X + 0.25, -0.4, -0.2] });
        const canal = []; for (let i = 0; i <= 24; i++) { const t = i / 24; canal.push([X + 0.07 * Math.sin(t * Math.PI * 8), -0.95 + t * 1.85, 0]); }
        reg(G, '子宮頸管（曲折）', 'Cervical canal', '平日緊閉之蜿蜒路徑。', tube(canal, 0.02, 0xfff0f4), { anchor: [X, 0.75, 0.05] });
        reg(G, '子宮頸栓（懷孕）', 'Cervical plug', '懷孕期黏液變稠硬化鎖閉防菌（分娩前數日液化）。', ttube([[X, -0.9, 0], [X, 0, 0], [X, 0.85, 0]], 0.13, 0xf7e27a, 0.75), { anchor: [X + 0.1, -0.1, 0.15], hidden: true });
        reg(G, '子宮頸陰道部＋外口', 'Portio vaginalis + external os', '向陰道腔突出。', [lathe([[0.42, 0], [0.4, -0.15], [0.3, -0.3], [0.08, -0.35], [0.04, -0.3]], CXC, 0.8, [X, -0.8, 0]), ring(V(X, -1.13, 0), V(0, 1, 0), 0.05, 0.02, 0x5a1a30)], { anchor: [X + 0.35, -1.0, 0.1] });
        reg(G, '陰道穹窿', 'Fornix vaginae', '突入部周圍凹弧。', halfRing([X, -0.85, 0], 0.53, 0.06, 0xd77a94), { anchor: [X - 0.55, -0.85, 0] });
        reg(G, '陰道（牛）', 'Vagina', '反芻獸陰道上皮不角化。', vag(X, -0.8), { anchor: [X + 0.6, -1.7, 0] });
        reg(G, '子宮體（牛）', 'Uterine body', '假子宮體前方區域。', uter(X, 0.8), { anchor: [X + 0.6, 1.25, 0] });

        X = -2.5; G = '豬';
        title(X, '母豬', '長・螺旋圓環');
        reg(G, '子宮頸壁（豬，很長）', 'Cervical wall (long)', '直接接續陰道（無陰道穹窿），交配直接宮內射精（150–500 ml）。', [halfCyl([X, 0, 0], 0.4, 0.4, -1.4, 1.0, CXC, 0.7), halfCyl([X, 0, 0], 0.3, 0.3, -1.4, 1.0, MUC, 0.9)], { anchor: [X + 0.4, 0.5, 0] });
        reg(G, '螺旋狀圓環（子宮頸枕）', 'Spiral annular rings (pulvini)', '交錯枕狀螺旋鎖扣與公豬螺旋狀陰莖尖吻合鎖定。', tube(helixAlong(new THREE.LineCurve3(V(X, -1.3, 0), V(X, 0.9, 0)), 0.2, 5, 0, 300), 0.08, RG, 1, 2), { anchor: [X - 0.3, -0.2, 0.1] });
        reg(G, '陰道（豬）', 'Vagina', '單一陰道。', [halfCyl([X, 0, 0], 0.55, 0.42, -2.2, -1.4, VG, 0.35)], { anchor: [X + 0.55, -1.85, 0] });
        reg(G, '子宮體（豬）', 'Uterine body (short)', '短小子宮體。', uter(X, 1.0), { anchor: [X + 0.6, 1.4, 0] });

        X = 0; G = '馬';
        title(X, '母馬', '短・縱褶突入陰道');
        reg(G, '子宮頸壁（馬，短）', 'Cervical wall (short)', '鬆軟且短，無精子運輸障礙（精液直入子宮）。', [halfCyl([X, 0, 0], 0.4, 0.4, -0.5, 0.5, CXC, 0.7), halfCyl([X, 0, 0], 0.3, 0.3, -0.5, 0.5, MUC, 0.9)], { anchor: [X + 0.4, 0.2, 0] });
        const MF = []; for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2, r = 0.16; MF.push(tube([[X + Math.cos(a) * r, 0.45, Math.sin(a) * r], [X + Math.cos(a) * r, -0.5, Math.sin(a) * r], [X + Math.cos(a) * r * 1.4, -0.95, Math.sin(a) * r * 1.4], [X + Math.cos(a) * r * 1.5, -1.25, Math.sin(a) * r * 1.5]], 0.045, RG)); }
        reg(G, '縱行黏膜皺摺（突入陰道）', 'Longitudinal folds', '花瓣狀顯著深垂入陰道穹窿。', MF, { anchor: [X - 0.3, -1.1, 0.2] });
        reg(G, '陰道穹窿（馬）', 'Fornix vaginae', '深度明顯。', halfRing([X, -0.55, 0], 0.5, 0.06, 0xd77a94), { anchor: [X + 0.55, -0.55, 0] });
        reg(G, '陰道（馬）', 'Vagina', '單一陰道。', vag(X, -0.5), { anchor: [X + 0.6, -1.7, 0] });
        reg(G, '子宮體（馬）', 'Uterine body (large)', '大型子宮體。', uter(X, 0.5), { anchor: [X + 0.6, 0.95, 0] });

        X = 2.5; G = '狗、貓';
        title(X, '母狗', '短・平滑・單一皺褶');
        reg(G, '子宮頸壁（狗，短）', 'Cervical wall', '內襯複層鱗狀上皮，具單皺褶但斜開口對精子具選擇性屏障。', [halfCyl([X, 0, 0], 0.36, 0.36, -0.4, 0.4, CXC, 0.7), halfCyl([X, 0, 0], 0.26, 0.26, -0.4, 0.4, 0xf6d0da, 0.9)], { anchor: [X + 0.36, 0.1, 0] });
        reg(G, '單一黏膜皺褶', 'Single mucosal fold', '只具單一顯著皺褶。', tube([[X, 0.38, -0.24], [X, 0, -0.18], [X, -0.38, -0.24]], 0.05, RG), { anchor: [X - 0.15, 0, -0.15] });
        reg(G, '陰道（狗）', 'Vagina (dog)', '發情期陰道表層角化（陰道抹片判定動情期核心）。', vag(X, -0.4), { anchor: [X + 0.6, -1.5, 0] });
        reg(G, '子宮體（狗）', 'Uterine body', '接雙角子宮。', uter(X, 0.4), { anchor: [X + 0.6, 0.85, 0] });

        X = 5; G = '人';
        title(X, '人', '內子宮頸／外子宮頸');
        reg(G, '內子宮頸', 'Endocervix', '單層高柱狀分泌黏液細胞（受 E₂/P₄ 調控 Muc5B）。', [halfCyl([X, 0, 0], 0.42, 0.42, -0.6, 0.7, CXC, 0.65), halfCyl([X, 0, 0], 0.2, 0.2, -0.6, 0.7, 0xd0607a, 0.95)], { anchor: [X + 0.42, 0.3, 0] });
        const CG = [], rq = rnd(81);
        for (let k = 0; k < 9; k++) {
          const y = -0.45 + k * 0.13, a = Math.PI * (1.15 + rq() * 0.7), r0 = 0.2, r1 = 0.36;
          const p0 = [X + Math.cos(a) * r0, y, -Math.abs(Math.sin(a)) * r0], p1 = [X + Math.cos(a) * r1, y - 0.05, -Math.abs(Math.sin(a)) * r1];
          CG.push(tube([p0, p1], 0.022, 0xb070c0), tube([p1, [p1[0] + 0.03, p1[1] + 0.06, p1[2] - 0.02]], 0.018, 0xb070c0));
        }
        reg(G, '子宮頸腺（內子宮頸隱窩）', 'Endocervical crypts', '精子避開陰道酸性環境之主要貯存庫（可存活 28–48 小時！）。', CG, { anchor: [X - 0.35, 0.1, -0.2] });
        reg(G, '外子宮頸', 'Ectocervix', '面對陰道側覆複層非角化鱗狀上皮。', lathe([[0.42, 0], [0.42, -0.15], [0.32, -0.32], [0.1, -0.4], [0.05, -0.36]], 0xf2c4cc, 0.85, [X, -0.6, 0]), { anchor: [X + 0.4, -0.85, 0.1] });
        reg(G, '鱗狀柱狀交接處', 'Squamocolumnar junction (SCJ)', '柱狀上皮與鱗狀上皮移行轉化區（隨年齡/荷爾蒙移位）。', ring(V(X, -0.99, 0), V(0, 1, 0), 0.07, 0.022, 0xffd400), { anchor: [X - 0.15, -1.0, 0.1] });
        reg(G, '子宮頸內口', 'Internal os', '通向梨形子宮腔之內口。', halfRing([X, 0.7, 0], 0.2, 0.04, 0x6a2040), { anchor: [X - 0.2, 0.7, 0] });
        reg(G, '陰道（人）', 'Vagina (human)', '複層鱗狀上皮＋陰道乳酸菌維持酸性 (pH ~4.0–5.7)。', vag(X, -0.6), { anchor: [X + 0.6, -1.6, 0] });
        reg(G, '子宮體（人）', 'Uterine body', '單式子宮。', uter(X, 0.7), { anchor: [X + 0.6, 1.15, 0] });
      }
    });
  })();
})();
