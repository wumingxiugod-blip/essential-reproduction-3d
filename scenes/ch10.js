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
})();
