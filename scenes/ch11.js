/* Ch.11：獲能與頂體反應、Ca2+振盪與阻止多精入卵、MII重啟與單性/SCNT */
(function () {
  /* ===== 場景①：精子獲能與頂體反應超微結構切換（Fig 11.1, Boxes 11.1–11.3） ===== */
  let S1 = null, ST1 = 1; // 0:未獲能 1:獲能中 2:ZP結合 3:頂體反應
  const ST1_DATA = [
    ['0. 剛射出之未獲能精子', '表面覆蓋副睪 <b>EPPIN</b> 與精漿醣蛋白、膜富含膽固醇且穩定，F-actin 尚未大量聚合，鞭毛為規律波動。此時對透明帶無法反應（Box 11.1）。'],
    ['1. 獲能中（雌道峽部→壺腹）', '外膜脫去醣蛋白與<b>膽固醇外流</b>形成流動性脂質蛋白筏；<b>HCO₃⁻ 進入</b>鹼化胞質 → Ca²⁺↑ → <b>cAMP → PKA → Tyr 磷酸化</b>；同時 <b>PI4K 促 F-actin 聚合</b>於雙膜之間防過早融合，尾呈現<b>鞭打式超活化（whiplash）</b>！'],
    ['2. 透明帶三維辨識（ZP3+ZP2 / ZP3+ZP4）', '脂質蛋白筏集中 <b>GalT1、Selectin、ZP3R(SP56) 與 Zonadhesin（物種專一！）</b>，結合透明帶糖鏈（如 SLe<sup>x</sup>）；先鋒精子釋放玻尿酸酶清開卵丘 hyaluronan。'],
    ['3. 頂體反應（Acrosome Reaction）', '更大規模 Ca²⁺↑ ＋ <b>PI3K→PIP₃</b> 活化，由鈣活化切斷蛋白<b>解聚 F-actin</b> → 質膜與外頂體膜多點融合囊泡化（脫落 ZP3 受體），暴露內頂體膜 <b>Acrosin</b> 5–20 分穿破透明帶並暴露赤道 <b>Izumo1</b>（Box 11.2）！']
  ];
  SCENES.push({
    name: '① 獲能與頂體反應',
    title: '膜膽固醇外流、F-actin 雙相開關與頂體融合囊泡化（Fig 11.1, Boxes 11.1–11.3）',
    camera: { pos: [0, 0.8, 18.5], target: [0, 0, 0], fit: [9.8, 6.0] },
    controls: [{ label: '🔍 精頭剖面全覽', fn() { flyHome(); } }],
    desc: `
<p>受精是耗時數小時的連續改造工程：精子必須在雌道完成<b>獲能（Capacitation）</b>進入亞穩態，遇到卵丘／透明帶時方能觸發不可逆的<b>頂體反應（Acrosome reaction）</b>（Ch.11 p.190–194, Fig 11.1, Boxes 11.1–11.3）。</p>
<details open><summary>雙層膜之間為何先建 F-actin 再拆 F-actin？</summary><ul>
<li><b>獲能時</b>：脫膽固醇使質膜不穩，但 <b>PI4K → F-actin</b> 像安全插銷把質膜與外頂體膜隔開！</li>
<li><b>結合 ZP3 時</b>：Ca²⁺ 暴衝＋<b>PI3K → PIP₃</b> 解聚 F-actin → 兩膜融合胞吐頂體酶（Acrosin），並同步在赤道部曝光融合分子 <b>Izumo1</b>！</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.11 p.190–194（Fig 11.1, Boxes 11.1–11.3）</p>`,
    build() {
      S1 = { t: 0, play: true };
      const H = '精頭與透明帶接觸介面', M = '膜囊泡與 F-actin 柵欄', T = '鞭毛動態';
      // 透明帶纖維網路（頂部弧）
      const zpFibs = [];
      for (let i = -3; i <= 3; i++) zpFibs.push(cyl([i * 1.1, 3.6 + Math.abs(i) * 0.08, -0.5], [i * 1.1, 3.6 + Math.abs(i) * 0.08, 0.5], 0.16, 0x90d0ff, 0.72));
      const zpCross = cyl([-3.8, 3.65, 0], [3.8, 3.65, 0], 0.2, 0xc8e8ff, 0.65);
      // 扁平梨形精核 + 貼合內頂體膜 + 外頂體帽 + 質膜（直立朝向透明帶）
      const nuc = new THREE.Mesh(spermHeadGeo(4.2, 2.75, 1.35), mat(0x5578a8, 0.96));
      nuc.position.set(0, -0.15, 0); nuc.rotation.z = -Math.PI / 2;
      const iam = new THREE.Mesh(spermAcrosomeGeo(4.45, 2.95, 1.5, 0.64), mat(0xf08a30, 0.82));
      iam.position.set(0, -0.05, 0); iam.rotation.z = -Math.PI / 2;
      const oam = new THREE.Mesh(spermAcrosomeGeo(4.85, 3.25, 1.68, 0.64), mat(0xffd479, ST1 === 3 ? 0.16 : 0.46));
      oam.position.set(0, 0.02, 0); oam.rotation.z = -Math.PI / 2;
      const pmCol = ST1 === 0 ? 0xa0b4c8 : (ST1 >= 2 ? 0x60f0c8 : 0x70d0f0);
      const pm = new THREE.Mesh(spermHeadGeo(5.2, 3.55, 1.9), mat(pmCol, ST1 === 3 ? 0.2 : 0.32));
      pm.position.set(0, -0.05, 0); pm.rotation.z = -Math.PI / 2;

      // 赤道與後端 Izumo1 (ST1=3 時露出紅綠亮珠！)
      const izPts = [];
      for (let i = 0; i < 10; i++) {
        const a = i / 10 * Math.PI * 2;
        izPts.push(V(Math.cos(a) * 1.85, -0.65, Math.sin(a) * 1.05));
      }
      const izu = dots(izPts, ST1 === 3 ? 0.17 : 0.11, ST1 === 3 ? 0x46d16a : 0x507060, ST1 === 3 ? 0.98 : 0.35);

      // 獲能表面 Rafts / GalT1 (ST1=1,2 集結前端) vs EPPIN coating (ST1=0)
      const capPts = [];
      for (let i = 0; i < 8; i++) capPts.push(V(-1.3 + i * 0.37, 2.55 - Math.abs(i - 3.5) * 0.12, 0.85));
      const coatD = dots(capPts, 0.14, ST1 === 0 ? 0xff7070 : (ST1 === 3 ? 0xffd479 : 0x50ffa0), 0.95);

      reg(H, '精頭核、內外頂體膜與透明帶（ZP3/2/4）', 'Acrosomal membranes & Zona Pellucida', ST1_DATA[ST1][1],
        [nuc, iam, oam, pm, izu, coatD, zpCross, ...zpFibs], { anchor: [-3.4, 2.2, 0.9] });

      // F-actin 柵欄（ST1=1,2 最厚實；ST1=3 解聚破裂！）
      const actPts = [];
      for (let i = 0; i < 14; i++) {
        const th = -0.6 + i / 13 * 1.2;
        actPts.push(V(Math.sin(th) * 2.02, 1.45 + Math.cos(th) * 1.4, 0.9));
      }
      const actBar = dots(actPts, ST1 === 1 || ST1 === 2 ? 0.13 : 0.04, 0xff9f40, ST1 === 1 || ST1 === 2 ? 0.95 : 0.15);
      // 囊泡化胞吐液滴（ST1=3）
      const vesMs = [];
      if (ST1 === 3) {
        for (let i = 0; i < 10; i++) {
          const a = -1.1 + i * 0.24;
          vesMs.push(ell([Math.sin(a) * 2.45, 2.2 + Math.cos(a) * 1.4, (i % 2 ? 0.5 : -0.5)], [0.22, 0.22, 0.22], 0xffd479, 0.9));
        }
      }
      reg(M, ST1 === 3 ? '頂體囊泡化（脫落 ZP3 受體，釋 Acrosin）' : 'PI4K 聚合之 F-actin 安全阻隔網', 'F-actin barrier & Vesiculation',
        ST1 === 3 ? '高 Ca²⁺ 切斷 F-actin，質膜與外頂體膜融合形成混合囊泡逸出酵素，暴露內膜 Acrosin 與赤道 Izumo1。' : '在獲能過程中阻隔「已不穩定化之外膜」提早與頂體融合。',
        [actBar, ...vesMs], { anchor: [3.2, 2.0, 0.9] });

      // 螺旋粒線體中段＋連續滑順波動鞭毛
      const midp = ttube(helixAlong(lineCurve([0, -2.15, 0], [0, -3.35, 0]), 0.2, 6, 0, 120), 0.095, 0x50d890, 0.96, { organic: false });
      const wTail = waveTail(0, 0, 0, 3.0, 0.11, 0.035, 0xd8e4f0, 0.96, 28, 12);
      wTail.rotation.z = -Math.PI / 2; wTail.position.set(0, -3.3, 0);
      reg(T, ST1 >= 1 ? '超活化鞭打擺動（Whiplash）' : '一般規律波動', 'Flagellar motility',
        '細胞質鈣離子上升直接刺激軸絲改變鞭毛擺幅為不對稱高力道鞭打，推動精子切過黏稠卵丘與透明帶。',
        [midp, wTail], { anchor: [1.6, -4.1, 0.6] });

      textSprite(ST1_DATA[ST1][0], [0, 4.9, 0], 0.38, '#ffd479');

      const dt = dtClock();
      CUR.tick = () => {
        const d = S1.play ? dt() : 0; S1.t += d;
        wTail.updateWave(S1.t * (ST1 === 0 ? 5 : 9.5), ST1 === 0 ? 0.16 : 0.55, 6.2);
      };
    },
    panel(box) {
      seg(box, '精卵交互階段（點按切換 3D）', [[0, '0.未獲能'], [1, '1.獲能中'], [2, '2.ZP結合'], [3, '3.頂體反應']], ST1, v => { ST1 = v; reloadKeep(); });
      note(box, ST1_DATA[ST1][1], 'big');
      checkbox(box, '播放鞭毛與動態', true, v => S1.play = v);
    }
  });

  /* ===== 場景②：精卵融合、PLCζ Ca2+振盪與皮質反應阻斷多精入卵（Figs 11.2–11.4） ===== */
  let S2 = null, PHASE2 = 2; // 0:切向結合融合 1:PLCζ鈣波橫掃 2:皮質反應硬化透明帶
  SCENES.push({
    name: '② 鈣波與防多精入卵',
    title: 'Izumo1–CD9 融合、PLCζ 引發 Ca²⁺ 振盪與皮質透明帶反應（Figs 11.2–11.4）',
    camera: { pos: [0, 0.8, 19.5], target: [0, 0, 0], fit: [10.2, 6.2] },
    controls: [
      { label: '🔍 卵母細胞全剖面', fn() { flyHome(); } },
      { label: '🔍 入精結合放大處', fn() { flyFit([-2.8, 0.3, 0], [3.6, 3.2]); } }
    ],
    desc: `
<p>精子融合入卵後啟動持續數小時的 <b>Ca²⁺ 振盪（spikes）</b>，並立刻觸發 <b>皮質反應（Cortical reaction）</b>與 <b>透明帶反應（Zona reaction）</b>以建立雙倍體並防止多精入卵（Ch.11 p.194–197, Figs 11.2–11.4）。</p>
<details open><summary>為何只准一隻精子融合（Block to polyspermy）？</summary><ul>
<li><b>融合複合物</b>：精子赤道部 <b>Izumo1</b> + 卵膜 <b>CD9/CD81 + GPI 蛋白</b>（在遠離 MII 紡錘體處融合）。</li>
<li><b>PLCζ → IP₃ + DAG</b>：融合後 1–5 分起引發由入精點掃過全卵的 Ca²⁺ 首波（2–3 min），接續每 3–15 min 脈衝。</li>
<li><b>皮質顆粒三重防線</b>：CaMKII 動員＋Synaptotagmin 融合釋出：① 蛋白酶切 <b>ZP2</b>；② <b>β-hexosaminidase B</b> 切 ZP3 糖基；③ 酪胺酸交聯硬化透明帶（+ 卵膜抗再結合）！</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.11 p.194–197（Figs 11.2–11.4）</p>`,
    build() {
      S2 = { t: 0, play: true };
      const O = '透明帶（ZP1/2/3）與卵周隙', M = '卵膜（Oolemma）與「紡錘體盲區」', CA = 'PLCζ、鈣波與皮質顆粒釋放';
      // 透明帶外環 + 外圍卵丘殘留
      const zpCol = PHASE2 === 2 ? 0xffb84d : 0x70c8ff;
      const zp = shell(1, [4.6, 4.4, 3.6], zpCol, PHASE2 === 2 ? 0.42 : 0.25, 0.5, Math.PI * 1.6);
      // 外側阻擋的多餘精子（PHASE2=2 時彈開）
      const extraSps = [
        ell([-4.9 - (PHASE2 === 2 ? 0.6 : 0), 2.1, 0.3], [0.38, 0.2, 0.18], PHASE2 === 2 ? 0x607080 : 0xffffff),
        ell([4.8 + (PHASE2 === 2 ? 0.6 : 0), -1.8, 0.3], [0.38, 0.2, 0.18], PHASE2 === 2 ? 0x607080 : 0xffffff)
      ];
      reg(O, PHASE2 === 2 ? '硬化之透明帶（ZP2 截切、ZP3 去糖、Tyr 交聯）' : '透明帶（Zona pellucida）與卵周隙', 'Zona Pellucida & Perivitelline space',
        PHASE2 === 2 ? '皮質顆粒胞吐觸發「透明帶反應」：無法再與第二隻精子結合或被蛋白酶穿破，防止雄核性三倍體！' : '卵周隙位於透明帶與卵膜之間；頂體反應後精子橫躺於此等候結合。',
        [zp, ...extraSps], { anchor: [-5.1, 3.3, 0.9] });

      // 卵質與卵膜 + 頂端 MII 紡錘體免融合區 + 第一極體
      const ooMem = shell(1, [3.65, 3.5, 2.8], 0xe8a0b8, 0.38, 0.5, Math.PI * 1.6);
      const spSpin = ell([0.1, 2.7, 0.2], [0.95, 0.55, 0.55], 0xffd43a, 0.92);
      const noBindArc = ell([0.1, 3.45, 0.2], [1.45, 0.22, 0.7], 0xff6080, 0.55); // 無 CD9/Integrin 區域
      const pb1 = ell([0.8, 4.05, 0.2], [0.42, 0.36, 0.36], 0xffb0c8, 0.92);
      reg(M, 'MII 紡錘體與上方「無融合蛋白盲區」', 'MII spindle & Integrin/CD9-free dome',
        '排出的第一極體旁即為 MII 紡錘體；該上方質膜<b>刻意缺乏整合素、CD9 與微絨毛</b>，防止精子從此進入干擾極體分離（p.198）。',
        [ooMem, spSpin, noBindArc, pb1], { anchor: [1.5, 4.4, 0.8] });

      // 主融合精子（扁平梨形頭＋波浪鞭毛）
      const sHead = new THREE.Mesh(spermHeadGeo(0.95, 0.48, 0.24), mat(0x50ffb0, 0.98));
      sHead.position.set(-3.75, 0.1, 0.4); sHead.rotation.y = Math.PI;
      const sTail = ttube([V(-4.15, 0.06, 0.4), V(-4.75, -0.15, 0.45), V(-5.35, -0.42, 0.35), V(-5.95, -0.25, 0.4)], [0.06, 0.02], 0xd8e4f0, 0.95, { organic: false, seg: 18, radial: 10 });
      // PLCζ 鈣波環從 [-3.4, 0.1] 掃過
      const waveX = PHASE2 === 0 ? -3.0 : (PHASE2 === 1 ? 0.0 : 2.5);
      const waveRing = ell([waveX, 0.1, 0.2], [0.35, 3.1 - Math.abs(waveX) * 0.35, 2.2 - Math.abs(waveX) * 0.25], 0xffd43a, PHASE2 >= 1 ? 0.45 : 0.12);
      // 皮質顆粒（於卵周隙 vs 胞膜下）
      const cgPts = [];
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 1.4 + 1.1;
        const rad = PHASE2 === 2 ? 4.05 : 3.25;
        cgPts.push(V(Math.cos(a) * rad, Math.sin(a) * rad * 0.95, 0.5));
      }
      const cGran = dots(cgPts, 0.15, PHASE2 === 2 ? 0x60f0ff : 0xff70e0, 0.95);
      reg(CA, PHASE2 === 1 ? 'PLCζ → IP₃ 誘發掃掠型 Ca²⁺ 波' : '皮質顆粒（Cortical granules）胞吐', 'PLCζ Ca²⁺ wave & Cortical granules',
        '融合輸入 <b>PLCζ</b>，透過 <b>CaMKII＋Synaptotagmin</b> 驅動皮質顆粒與卵膜融合釋出至卵周隙（PHASE 2 藍珠）。',
        [sHead, sTail, waveRing, cGran], { anchor: [-4.4, -3.5, 0.9] });

      S2.wave = waveRing;
      textSprite(['0. Izumo1–CD9 切向融合', '1. PLCζ 觸發全域 Ca²⁺ 波', '2. 皮質反應釋放與透明帶硬化'][PHASE2], [0, 5.2, 0], 0.38, '#ffd479');

      const dt = dtClock();
      CUR.tick = () => {
        const d = S2.play ? dt() : 0; S2.t += d;
        if (PHASE2 === 1) {
          const u = (S2.t * 0.5) % 1;
          S2.wave.position.x = -3.2 + u * 6.4;
          const sc = Math.max(0.25, Math.sin(u * Math.PI));
          S2.wave.scale.set(0.35, 3.1 * sc, 2.2 * sc);
        }
      };
    },
    panel(box) {
      seg(box, '激活步驟切換', [[0, '0.精卵融合'], [1, '1.PLCζ 鈣波'], [2, '2.皮質透明帶硬化']], PHASE2, v => { PHASE2 = v; reloadKeep(); });
      const cv = mkCanvas(box, 290, 145);
      plot(cv, {
        title: 'Fig 11.3 受精後卵內 [Ca²⁺]i 振盪波形 (nM)',
        x: [0, 110], y: [0, 520], xt: [0, 20, 40, 60, 80, 100], xl: '時間（分鐘，12 min 時精卵融合）',
        vl: [{ x: 12, col: '#46d16a', label: '融合' }],
        series: [{
          f: t => t < 12 ? 45 : (t < 16 ? 45 + 440 * Math.exp(-Math.pow((t - 13.5) / 0.85, 2)) : 50 + 210 * Math.max(0, Math.cos((t - 24) * 0.39) > 0.72 ? Math.pow((Math.cos((t - 24) * 0.39) - 0.72) / 0.28, 1.5) : 0)),
          col: '#ffd43a', label: '[Ca²⁺]i (nM)', w: 2.2
        }]
      });
      note(box, 'PLCζ 切割 PIP₂ → <b>IP₃</b>（釋 Ca²⁺ 阻斷多精＋解 MII 停滯）＋ <b>DAG</b>（活化 PKC）。', 'big');
      checkbox(box, '播放 Ca²⁺ 掃掠動畫', true, v => S2.play = v);
    }
  });

  /* ===== 場景③：減數重啟、合核、單性生殖與 SCNT（Figs 11.5–11.6, Table 11.1, Box 11.6） ===== */
  let S3 = null, EXP3 = 'normal';
  const E3_INFO = {
    normal: ['正常合核 Syngamy（18–24 小時）', 'Ca²⁺ → CaMKII → <b>Emi2 (CSF) 降解</b> → APC/C 分解 <b>Cyclin B (MPF 瓦解)</b> → 排出<b>第二極體</b>！卵質穀胱甘肽將精核魚精蛋白換成組蛋白形成較大的雄原核；精子中心粒組裝第一紡錘體，但<b>粒線體 100% 來自卵子</b>（p.197–198）。'],
    partheno: ['單性生殖（Parthenogenesis）為何必敗？', '酒精／電擊雖可誘發 Ca²⁺ 並排出第二極體啟動分裂，但因：①（非囓齒類）缺精子帶入之<b>中心粒</b>；② 更根本者——全哺乳類存在約 <b>100 個親源銘印基因</b>，純母系基因組缺乏父源表現之胎盤／生長促進基因（Box 11.6），無法存活至足月！'],
    scnt: ['體細胞核轉殖（SCNT 複製動物，Fig 11.6）', '以電脈衝將 <b>G₀ 靜止體細胞核</b>融入去核 MII 卵質雖可成體，但絕大多數在胚胎／胎期死亡或伴隨<b>胎盤過大與過胖症</b>，主因卵質未能完全抹除<b>發育期／親源表觀銘印</b>＋體細胞帶入異源粒線體造成相容問題（p.201–202）。']
  };
  SCENES.push({
    name: '③ 合核、單性生殖與SCNT',
    title: 'MPF 瓦解、雌雄原核資產差異、親源銘印與 SCNT（Figs 11.5–11.6, Table 11.1）',
    camera: { pos: [0, 0.8, 19], target: [0, 0, 0], fit: [10.0, 6.0] },
    controls: [{ label: '🔍 胚胎剖析全覽', fn() { flyHome(); } }],
    desc: `
<p>受精後 4–7 小時形成雌雄雙原核，並於 18–24 小時破膜匯合於第一有絲分裂紡錘體完成<b>合核（Syngamy）</b>。對比單性生殖與 SCNT 可深刻揭示「為什麼哺乳動物必須行有性生殖」（Ch.11 p.197–202, Figs 11.5–11.6）。</p>
<details open><summary>為何兩個基因組不能互換替代？</summary><ul>
<li><b>親源衝突假說（Parental conflict）</b>：約 100 個銘印基因（多位於胎盤表現）讓父源基因趨於促生長、母源基因節制生長；雙母核（單性）或雙父核皆失衡失敗！</li>
<li><b>人 15q11–q13 病理</b>：缺父源基因 → <b>Prader–Willi</b>（肌張力低、肥胖）；缺母源基因 → <b>Angelman</b>（歡樂抽搐）。</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.11 p.197–202（Figs 11.5–11.6, Boxes 11.5–11.6, Table 11.1）</p>`,
    build() {
      S3 = { t: 0, play: true };
      const Z = '受精卵細胞架構與極體', P = '原核／捐贈核與粒線體分布', MP = 'MPF–CSF 分子開關';
      const egg = shell(1, [3.8, 3.6, 2.8], 0xffe4b8, 0.28, 0.5, Math.PI * 1.6);
      const pb1 = ell([-0.5, 4.0, 0], [0.4, 0.34, 0.34], 0xff90a8, 0.9);
      const pb2 = ell([0.6, 3.9, 0], [0.36, 0.3, 0.3], 0xffb0c8, EXP3 === 'scnt' ? 0.15 : 0.92); // SCNT 去除了 MII 紡錘體
      reg(Z, EXP3 === 'scnt' ? '去核 MII 卵母細胞胞質（含母源粒線體）' : '受精卵質與雙極體（Polar bodies 1 & 2）', 'Zygote & Polar bodies', E3_INFO[EXP3][1],
        [egg, pb1, pb2], { anchor: [-4.2, 3.3, 0.8] });

      // 雙原核 vs G0核
      const pnF = ell([-1.1, 0.2, 0.2], [0.95, 0.95, 0.85], 0xff80a8, EXP3 === 'scnt' ? 0.15 : 0.92);
      const pnM = ell([1.2, 0.2, 0.2], [1.22, 1.15, 0.95], EXP3 === 'normal' ? 0x4db8e8 : (EXP3 === 'partheno' ? 0xff80a8 : 0xb080ff), 0.92);
      const cent = EXP3 === 'partheno' ? ell([2.2, 1.1, 0.3], [0.22, 0.22, 0.22], 0x445566, 0.2) : ell([2.2, 1.1, 0.3], [0.24, 0.34, 0.24], 0x46d16a, 0.98);
      // 粒線體（金：卵子母系；紫：SCNT體細胞異源粒線體殘留！）
      const mtPts = [V(-2.2, -1.5, 0.6), V(-1.4, -2.0, -0.5), V(0.5, -2.2, 0.7), V(2.0, -1.6, 0.4), V(-2.3, 1.2, 0.5)];
      const mtEgg = dots(mtPts, 0.18, 0xffd43a);
      const mtSom = EXP3 === 'scnt' ? dots([V(1.9, 0.8, 0.8), V(1.6, -0.6, 0.8)], 0.18, 0xd060ff) : dots([V(0, 0, 0)], 0.01, 0x000000, 0.0);
      if (EXP3 !== 'scnt') mtSom.visible = false;

      reg(P, EXP3 === 'normal' ? '母源雌原核（粉）與較大父源雄原核（藍）＋中心粒（綠）' : EXP3 === 'partheno' ? '雙套純母源基因（缺父源銘印＋非囓齒類缺中心粒）' : 'G₀ 體細胞核＋異源粒線體混合（紫點）', 'Pronuclei & Centriole / Mitochondria',
        E3_INFO[EXP3][1], [pnF, pnM, cent, mtEgg, mtSom], { anchor: [0, -3.5, 0.8] });

      // 右上方小模組：MPF (cdk1 + cyclin B) <-> CSF (Emi2)
      const csf = ell([5.2, 2.2, 0], [0.65, 0.45, 0.45], EXP3 === 'scnt' ? 0x607080 : 0xff6060, 0.9);
      const mpf = ell([5.2, 0.3, 0], [0.9, 0.55, 0.5], 0xffd43a, 0.9);
      const inhL = arcArrow([[5.2, 1.65, 0], [5.2, 0.95, 0]], C_INH, 0.05, { inhibit: true });
      reg(MP, 'MPF（cdk1+cyclin B）與 CSF（Emi2）解鎖機制', 'MPF & CSF degradation cascade',
        '正常受精或人工 Ca²⁺ 脈衝（如電擊/乙醇）透過 CaMKII → Plx1 降解 Emi2，使 APC/C 分解 Cyclin B 解除 MII 停滯（Fig 11.5, Box 11.5）。',
        [csf, mpf, ...inhL], { anchor: [5.4, 3.1, 0.7] });

      textSprite(E3_INFO[EXP3][0], [0, 5.0, 0], 0.38, '#ffd479');

      const dt = dtClock();
      CUR.tick = () => {
        const d = S3.play ? dt() : 0; S3.t += d;
        const w = 0.08 * Math.sin(S3.t * 2.2);
        pnF.position.x = -1.1 + w; pnM.position.x = 1.2 - w;
      };
    },
    panel(box) {
      seg(box, '三種胚胎建構模式', [['normal', '正常受精'], ['partheno', '單性生殖'], ['scnt', 'SCNT 複製']], EXP3, v => { EXP3 = v; reloadKeep(); });
      const cv = mkCanvas(box, 290, 150);
      plot(cv, {
        title: 'Table 11.1 自然流產胎兒染色體異常率 (/100)',
        x: [0, 6], y: [0, 42], xt: [1, 2, 3, 4, 5],
        fmtX: v => ['', '體三倍', '整體三倍', 'X單套', '四倍', '重排'][v] || '',
        xl: '異常類別（括號表存活至出生%）',
        series: [
          { pts: [[1, 30], [2, 13.5], [3, 10], [4, 4], [5, 2.5]], col: '#f09a4a', label: '占流產數 (/100)', w: 2.8 },
          { pts: [[1, 3], [2, 0.01], [3, 0.8], [4, 0.01], [5, 35]], col: '#4db8e8', label: '存活出生率 (%)', w: 2.5 }
        ]
      });
      note(box, E3_INFO[EXP3][1], 'big');
      checkbox(box, '播放原核趨近動畫', true, v => S3.play = v);
    }
  });
})();
