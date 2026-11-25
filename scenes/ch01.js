/* Ch.1：什麼是生殖（有絲/減數分裂、卵大小與親代印記、下視丘-腦垂腺軸、類固醇與受體機制） */
(function () {
  /* ===== 場景①：有絲分裂 vs 減數分裂（Fig 1.1） ===== */
  let S1 = null, ST1 = 2;
  const ST1_TEXT = [
    ['1. 間期 DNA 複製（2n, 4C）', '兩對同源染色體（藍＝父源、紅＝母源；大、小各一對）皆複製為兩條姐妹染色分體，並複製中心粒。'],
    ['2. 前期／聯會與互換（Prophase I）', '<b>有絲分裂</b>不聯會；<b>減數分裂 I</b> 經歷細紐、偶線、<b>粗絲期（pachytene）聯會形成四分體與互換（chiasmata）</b>、雙線／終變期，同源染色體互換片段！'],
    ['3. 中期／後期 I 分離', '<b>有絲分裂</b>姐妹染色分體分離 → 維持二倍體 2n；<b>減數分裂 I</b> 同源染色體（各帶重組後的姐妹分體）移向兩極！'],
    ['4. 減數分裂 II → 四個獨特單倍體', '<b>有絲分裂</b>產生 <b>2 個遺傳完全相同</b>的二倍體子細胞；<b>減數分裂</b>經第二次分裂（分開姐妹染色分體）產生 <b>4 個基因各自獨特</b>的單倍體（1n）配子！']
  ];
  SCENES.push({
    name: '① 有絲 vs 減數分裂',
    title: '有絲分裂（體細胞繁殖）vs 減數分裂（配子遺傳重組，Fig 1.1）',
    camera: { pos: [0, 0.5, 22], target: [0, 0, 0], fit: [11.5, 6.8] },
    controls: [
      { label: '🔍 全部對照', fn() { flyHome(); } },
      { label: '🔍 左側：有絲分裂', fn() { flyFit([-5.2, 0, 0], [5.2, 5.2]); } },
      { label: '🔍 右側：減數分裂', fn() { flyFit([5.2, 0, 0], [5.8, 5.4]); } }
    ],
    desc: `
<p>哺乳動物行<b>有性生殖</b>：體細胞以<b>有絲分裂（mitosis）</b>複製完全相同的 2n 細胞（人類 23 對＝46 條）；生殖細胞經<b>減數分裂（meiosis）</b>減半為單倍體（1n = 23）並透過互換重組基因（Ch.1 p.4–6, Fig 1.1）。</p>
<details open><summary>關鍵差異（Fig 1.1）</summary><ul>
<li><b>減數前期 I（Prophase I）</b>：細紐期（leptotene）→ 偶線期（zygotene 同源配對）→ <b>粗絲期（pachytene 聯會與交叉互換 chiasmata）</b>→ 雙線／終變期。</li>
<li><b>減數分裂 I</b>：分離<b>同源染色體</b>（減半倍數）。</li>
<li><b>減數分裂 II</b>：分離<b>姐妹染色分體</b> → 共產生 4 個基因各異的單倍體配子。</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.1 p.4–6（Fig 1.1）</p>`,
    build() {
      S1 = { t: 0, play: true };
      const M = '有絲分裂（左側）', ME = '減數分裂（右側）';
      textSprite('有絲分裂 Mitosis (2n → 2×2n 相同)', [-5.4, 5.6, 0], 0.42, '#8fd0ff');
      textSprite('減數分裂 Meiosis (2n → 4×1n 重組)', [5.4, 5.6, 0], 0.42, '#ffd479');

      // 分隔線
      addRoot(cyl([0, -5.5, 0], [0, 5.5, 0], 0.04, 0x3b5a78, 0.7));

      // 輔助：畫一條染色體或雙分體（含可切換互換色段）
      function mkChrom(pos, col, recombCol, doubled = true, scale = 1) {
        return chromMesh(pos, col, recombCol, doubled, scale);
      }

      // 左側：有絲分裂細胞（parent 1 個 → 2 個子細胞）
      S1.mitShell = [
        cellShell([-5.4, 0, 0], [3.6, 3.6, 2.6], 0x70b8ff, 0.18, 1.3),
        cellShell([-7.2, -0.2, 0], [2.2, 2.2, 1.8], 0x70b8ff, 0.18, 1.3),
        cellShell([-3.6, -0.2, 0], [2.2, 2.2, 1.8], 0x70b8ff, 0.18, 1.3)
      ];
      reg(M, '體細胞核／紡錘體外框', 'Mitotic cell & spindle', '有絲分裂前後期核膜溶解、形成赤道板紡錘體，後期姐妹染色分體分向兩極。', S1.mitShell, { anchor: [-5.4, 3.9, 0.5] });

      // 4條染色體（大藍、大紅、小藍、小紅）
      S1.mChrom = [
        mkChrom([-6.0, 0.8, 0], 0x4aa8ff, 0x4aa8ff, true, 1.0),
        mkChrom([-4.8, 0.8, 0], 0xff6b7a, 0xff6b7a, true, 1.0),
        mkChrom([-6.0, -0.8, 0], 0x70c8ff, 0x70c8ff, true, 0.72),
        mkChrom([-4.8, -0.8, 0], 0xff9aa8, 0xff9aa8, true, 0.72)
      ];
      S1.mSplit = [
        mkChrom([-7.6, 0.4, 0], 0x4aa8ff, null, false, 0.9),
        mkChrom([-6.8, 0.4, 0], 0xff6b7a, null, false, 0.9),
        mkChrom([-7.6, -0.6, 0], 0x70c8ff, null, false, 0.65),
        mkChrom([-6.8, -0.6, 0], 0xff9aa8, null, false, 0.65),
        mkChrom([-4.0, 0.4, 0], 0x4aa8ff, null, false, 0.9),
        mkChrom([-3.2, 0.4, 0], 0xff6b7a, null, false, 0.9),
        mkChrom([-4.0, -0.6, 0], 0x70c8ff, null, false, 0.65),
        mkChrom([-3.2, -0.6, 0], 0xff9aa8, null, false, 0.65)
      ];
      reg(M, '雙倍體同源染色體（2n=4 示意）', 'Diploid sister chromatids', '有絲分裂不發生同源聯會與互換，姐妹染色分體分離後產生兩個與母細胞完全相同的 2n 子細胞。', [...S1.mChrom.flatMap(c => c.ms), ...S1.mSplit.flatMap(c => c.ms)], { anchor: [-7.6, -2.5, 0.5] });

      // 右側：減數分裂（母細胞 → 4個單倍體子細胞）
      S1.meiShell = [
        cellShell([5.4, 0, 0], [3.8, 3.8, 2.6], 0xffb860, 0.18, 1.3),
        cellShell([3.2, 2.2, 0], [1.9, 1.9, 1.6], 0xffb860, 0.2, 1.3),
        cellShell([7.6, 2.2, 0], [1.9, 1.9, 1.6], 0xffb860, 0.2, 1.3),
        cellShell([2.6, -2.2, 0], [1.65, 1.65, 1.4], 0x70e890, 0.22, 1.3),
        cellShell([4.5, -2.2, 0], [1.65, 1.65, 1.4], 0x70e890, 0.22, 1.3),
        cellShell([6.4, -2.2, 0], [1.65, 1.65, 1.4], 0x70e890, 0.22, 1.3),
        cellShell([8.3, -2.2, 0], [1.65, 1.65, 1.4], 0x70e890, 0.22, 1.3)
      ];
      reg(ME, '生殖母細胞／次級／單倍體配子', 'Meiotic cells (2n → 4×1n)', '減數分裂 I 分離同源染色體得 2 個次級細胞；減數分裂 II 分離染色分體得 4 個基因獨特的 1n 配子。', S1.meiShell, { anchor: [5.4, 4.0, 0.5] });

      S1.tetrad = [
        mkChrom([5.15, 0.9, 0], 0x4aa8ff, 0xff6b7a, true, 1.0),
        mkChrom([5.65, 0.9, 0], 0xff6b7a, 0x4aa8ff, true, 1.0),
        mkChrom([5.15, -0.9, 0], 0x70c8ff, 0xff9aa8, true, 0.72),
        mkChrom([5.65, -0.9, 0], 0xff9aa8, 0x70c8ff, true, 0.72)
      ];
      S1.chiasma = [ell([5.4, 0.55, 0.15], [0.22, 0.22, 0.22], 0xffd43a), ell([5.4, -1.2, 0.15], [0.18, 0.18, 0.18], 0xffd43a)];
      reg(ME, '四分體與交叉互換（Chiasmata）', 'Tetrad & crossing-over (pachytene)', '粗絲期（pachytene）同源染色體聯會，在 chiasmata 處交換 DNA 片段（藍紅嵌合），大幅提升子代遺傳多樣性。', [...S1.tetrad.flatMap(c => c.ms), ...S1.chiasma], { anchor: [6.8, 0.8, 0.5] });

      // 4 個單倍體子細胞內的染色體（各帶不同重組與隨機分配組合）
      const hapPos = [[2.6, -2.2], [4.5, -2.2], [6.4, -2.2], [8.3, -2.2]];
      const hapCols = [[0x4aa8ff, 0x70c8ff], [0x4aa8ff, 0xff9aa8], [0xff6b7a, 0x70c8ff], [0xff6b7a, 0xff9aa8]];
      const hapRec = [[0x4aa8ff, 0x70c8ff], [0xff6b7a, 0xff9aa8], [0x4aa8ff, 0xff9aa8], [0xff6b7a, 0x70c8ff]];
      S1.hap = [];
      hapPos.forEach(([x, y], i) => {
        S1.hap.push(mkChrom([x - 0.3, y, 0], hapCols[i][0], hapRec[i][0], false, 0.75));
        S1.hap.push(mkChrom([x + 0.3, y - 0.1, 0], hapCols[i][1], hapRec[i][1], false, 0.58));
      });
      reg(ME, '四個獨特單倍體（1n）配子', '4 genetically unique haploid cells', '受精時兩個 1n 配子結合恢復二倍體 2n 合子，使族群基因庫在環境變動下保持多樣性與適應力。', S1.hap.flatMap(c => c.ms), { anchor: [5.4, -4.1, 0.5] });

      const dt = dtClock();
      CUR.tick = () => {
        const d = dt(); if (S1.play) S1.t += d;
        const st = ST1;
        S1.mitShell[0].visible = st <= 2;
        S1.mitShell[1].visible = S1.mitShell[2].visible = st === 3;
        S1.mChrom.forEach((c, i) => {
          c.g.visible = st <= 2;
          const wobble = Math.sin(S1.t * 2 + i) * 0.08;
          if (st === 0) c.g.position.set(i % 2 ? -4.5 : -6.3, i < 2 ? 0.9 : -0.9, wobble);
          else if (st === 1) c.g.position.set(i % 2 ? -4.7 : -6.1, i < 2 ? 0.8 : -0.8, 0);
          else if (st === 2) c.g.position.set(-5.4 + (i - 1.5) * 0.9, wobble, 0);
        });
        S1.mSplit.forEach(c => c.g.visible = st === 3);

        S1.meiShell[0].visible = st <= 1;
        S1.meiShell[1].visible = S1.meiShell[2].visible = st === 2;
        S1.meiShell[3].visible = S1.meiShell[4].visible = S1.meiShell[5].visible = S1.meiShell[6].visible = st === 3;
        S1.tetrad.forEach((c, i) => {
          c.g.visible = st <= 2;
          if (st === 0) c.g.position.set(i % 2 ? 6.5 : 4.3, i < 2 ? 1.0 : -1.0, 0);
          else if (st === 1) c.g.position.set(i % 2 ? 5.65 : 5.15, i < 2 ? 0.9 : -0.9, 0);
          else if (st === 2) c.g.position.set(i % 2 ? 7.6 : 3.2, i < 2 ? 2.6 : 1.7, 0);
        });
        S1.chiasma.forEach(c => { c.visible = st === 1; c.scale.setScalar(1 + 0.15 * Math.sin(S1.t * 4)); });
        S1.hap.forEach(c => c.g.visible = st === 3);
      };
    },
    panel(box) {
      const info = note(box, '', 'big');
      const sl = slider(box, '分裂階段', 0, ST1_TEXT.length - 1, ST1, 1, v => {
        ST1 = v; info.innerHTML = `<b>${ST1_TEXT[v][0]}</b><br>${ST1_TEXT[v][1]}`;
      });
      btnRow(box, [['◀ 上一步', () => { ST1 = Math.max(0, ST1 - 1); sl.value = ST1; sl.oninput(); }], ['下一步 ▶', () => { ST1 = Math.min(ST1_TEXT.length - 1, ST1 + 1); sl.value = ST1; sl.oninput(); }]]);
      sl.oninput();
      checkbox(box, '動畫微動', true, v => S1.play = v);
    }
  });

  /* ===== 場景②：卵細胞策略與表觀遺傳印記（Figs 1.3, 1.5–1.7） ===== */
  let S2 = null, EPI = 'open';
  SCENES.push({
    name: '② 卵策略與印記',
    title: '胎生小卵策略（Fig 1.3）與表觀遺傳染色質調控（Figs 1.5–1.7）',
    camera: { pos: [0, 0.5, 20], target: [0, 0, 0], fit: [10.8, 6.4] },
    controls: [
      { label: '🔍 全部對照', fn() { flyHome(); } },
      { label: '🔍 左：卵大小比較', fn() { flyFit([-5.2, 0.2, 0], [4.6, 4.2]); } },
      { label: '🔍 右：CpG 甲基化與組蛋白', fn() { flyFit([4.8, 0, 0], [5.4, 4.4]); } }
    ],
    desc: `
<p>哺乳動物採<b>體內受精＋胎生（viviparity）</b>：不須儲備大量卵黃供幼體獨立覓食，故卵子微小（人／鼠／象皆約 <b>70–90 µm</b>），且早期卵裂緩慢（24 小時才 2 細胞）；蛙卵約 <b>1500 µm</b>（Fig 1.3）。</p>
<details open><summary>為何哺乳動物不能單性生殖？（Figs 1.6–1.7）</summary><ul>
<li><b>SCNT 複製（Dolly 羊）</b>證實成年體細胞核具有全部基因，差異在於<b>表觀遺傳（epigenetics）</b>：</li>
<li><b>1. DNA CpG 甲基化</b>：胞嘧啶加上甲基團（-CH₃）後阻斷轉錄機器接近啟動子（STOP）。</li>
<li><b>2. 組蛋白（Histone）乙醯化（Ac）與甲基化（me）</b>：調控核小體鬆緊（開放型 euchromatin ＝ GO vs 緊密異染色質 ＝ STOP）。</li>
<li><b>親代印記</b>：約 100–200 個基因依精子／卵子包裝性別而留下不同印記，故胚胎必須同時擁有父源與母源基因組。</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.1 p.6–11（Figs 1.2, 1.3, 1.5–1.7）</p>`,
    build() {
      S2 = { t: 0, play: true };
      const EG = '卵大小與策略（左，Fig 1.3）', EP = '表觀遺傳印記（右，Fig 1.7）';
      // 左：蛙卵 vs 哺乳類卵（比例縮放呈現巨大懸殊）
      const frog = ell([-6.0, 1.2, 0], [2.4, 2.4, 2.2], 0x5d8c6a, 0.88);
      const frogTop = shell(2.42, [1, 1, 0.92], 0x2c363f, 0.9, 0, Math.PI * 2, 0, Math.PI * 0.42);
      frogTop.position.set(-6.0, 1.2, 0);
      reg(EG, '青蛙卵（~1500 µm）', 'Frog oocyte (oviparous)', '體外受精、卵生：必須攜帶大量卵黃供獨立發育；受精後 24 小時即發育為游泳的蝌蚪！', [frog, frogTop], { anchor: [-6.0, 4.0, 0.5] });

      const mam = ell([-2.6, 1.2, 0], [0.22, 0.22, 0.22], 0xffd479);
      const mamRing = ring(V(-2.6, 1.2, 0), V(0, 0, 1), 0.55, 0.03, 0x9fd3ff);
      reg(EG, '哺乳類卵（人／鼠／象 ~70–90 µm）', 'Mammalian oocyte (viviparous)', '體內受精＋胎生：卵極小且人類卵子在胎兒期峰值約 700 萬顆後大量凋亡（Fig 1.2）；受精 24 小時僅分裂為 2 細胞。', [mam, mamRing], { anchor: [-2.6, 2.3, 0.5] });

      // 左下：人類卵生殖細胞數量曲線模型條（胎兒6月 700萬 → 出生 1-200萬 → 停經）
      const ageBars = [
        ['受精', 0.2, -4.4, 0x60a0e0],
        ['胎兒 6 月 (700萬)', 2.4, -3.5, 0xff9ad0],
        ['出生 (100–200萬)', 0.9, -2.6, 0xffc070],
        ['青春期 (40萬)', 0.45, -1.7, 0x70d8a0]
      ];
      const bMeshes = ageBars.map(([lb, h, x, c]) => box([x, -3.4 + h / 2, 0], [0.55, h, 0.55], c));
      reg(EG, '女性卵巢生殖細胞庫存遞減（Fig 1.2）', 'Ovarian germ cell pool decline', '胎兒期有絲分裂達高峰（約 700 萬），出生前後大量閉鎖凋亡，僅約 400 顆排卵，35 歲後生育力急降（Fig 1.4）。', bMeshes, { anchor: [-3.5, -4.2, 0.6] });

      // 右：表觀遺傳（組蛋白核小體 + DNA 雙螺旋 + CpG 甲基基團 + RNA 聚合酶）
      S2.epGroup = new THREE.Group(); S2.epGroup.position.set(4.8, 0.4, 0); CUR.root.add(S2.epGroup);
      const hist = [], dnaPts = [], mePts = [], acPts = [];
      for (let k = 0; k < 4; k++) {
        const x = (k - 1.5) * (EPI === 'open' ? 2.2 : 1.15);
        const y = Math.sin(k * 1.4) * (EPI === 'open' ? 0.9 : 0.25);
        const z = Math.cos(k * 1.1) * 0.4;
        hist.push(ell([x, y, z], [0.62, 0.48, 0.62], 0xd8a848));
        // DNA 纏繞圈
        for (let a = 0; a <= 12; a++) {
          const th = a / 12 * Math.PI * 2;
          dnaPts.push(V(x + Math.cos(th) * 0.72, y + (a / 12 - 0.5) * 0.42, z + Math.sin(th) * 0.72));
        }
        acPts.push(V(x, y + 0.65, z), V(x + 0.35, y - 0.62, z));
        mePts.push(V(x - 0.45, y + 0.55, z + 0.4), V(x + 0.45, y + 0.4, z - 0.4));
      }
      const dnaCurve = ttube(dnaPts, 0.08, 0x5aa8ff, 1, { organic: false });
      const histM = hist;
      const acM = dots(acPts, 0.17, 0x46d16a);
      const meM = dots(mePts, 0.19, 0xff4a4a);
      S2.pol = ell([0, 1.9, 0.8], [0.85, 0.58, 0.6], 0x70e8ff, 0.88);
      attachPart(reg(EP, '核心組蛋白（核小體八聚體）', 'Core histones', 'DNA 纏繞組蛋白形成核小體；組蛋白變體與修飾決定鬆散（GO）或緊縮（STOP）。', histM, { anchor: [0, -1.5, 0.6] }), S2.epGroup);
      attachPart(reg(EP, 'DNA 與 CpG 島', 'DNA & CpG island', '鹼基序列本身未改，但調控可遺傳性表現開關。', dnaCurve, { anchor: [2.2, 0, 0.6] }), S2.epGroup);
      attachPart(reg(EP, '組蛋白乙醯化（Ac — 開放轉錄）', 'Histone acetylation (Active)', '乙醯化中和正電，使染色質鬆開（euchromatin），轉錄機器得以進入（GO）。', acM, { anchor: [-2.2, 1.3, 0.5] }), S2.epGroup);
      attachPart(reg(EP, 'CpG 胞嘧啶甲基化（Me — 抑制沉默）', 'DNA methylation (Repressed)', '甲基團直接標記 CpG 胞嘧啶，阻斷轉錄因子與 RNA 聚合酶結合，造成親代印記沉默（STOP）。', meM, { anchor: [2.2, 1.4, 0.5] }), S2.epGroup);
      attachPart(reg(EP, '轉錄機器（RNA Pol II）', 'Transcriptional machinery', '僅在開放型常染色質且無 CpG 甲基化阻礙時進行轉錄。', S2.pol, { anchor: [0, 2.7, 0.8] }), S2.epGroup);
      acM.visible = EPI === 'open';
      meM.visible = EPI === 'closed';
      S2.pol.visible = EPI === 'open';
      textSprite(EPI === 'open' ? '常染色質 Euchromatin：GO（基因表現）' : '異染色質＋甲基化：STOP（基因印記沉默）', [4.8, 3.8, 0], 0.38, EPI === 'open' ? '#7dff8a' : '#ff8a8a');

      const dt = dtClock();
      CUR.tick = () => {
        const d = dt(); if (S2.play) S2.t += d;
        if (EPI === 'open') S2.pol.position.x = Math.sin(S2.t * 1.4) * 2.4;
        S2.epGroup.rotation.y = Math.sin(S2.t * 0.4) * 0.18;
        updateAnchors();
      };
    },
    panel(box) {
      seg(box, '染色質／印記狀態（Fig 1.7）', [['open', '開放＋乙醯化 (GO)'], ['closed', '緊密＋CpG 甲基化 (STOP)']], EPI, v => { EPI = v; reloadKeep(); });
      checkbox(box, '播放分子轉錄動畫', true, v => S2.play = v);
    }
  });

  /* ===== 場景③：下視丘與腦垂腺解剖連結（Figs 1.9–1.12） ===== */
  let S3 = null;
  SCENES.push({
    name: '③ 下視丘–腦垂腺軸',
    title: '腦矢狀切面、下視丘核團與腦垂腺雙路徑（Figs 1.9–1.12）',
    camera: { pos: [0, 0.6, 20], target: [0, 0.4, 0], fit: [9.8, 7.2] },
    controls: [
      { label: '🔍 全覽', fn() { flyHome(); } },
      { label: '🔍 門脈系統（前葉）', fn() { flyFit([-0.5, -1.8, 0], [4.5, 3.4]); } },
      { label: '🔍 神經束（後葉）', fn() { flyFit([1.6, -1.6, 0], [4.5, 3.4]); } }
    ],
    desc: `
<p>腦部透過<b>下視丘（hypothalamus）</b>與<b>腦垂腺（pituitary）</b>整合同調內分泌與生殖行為（Ch.1 p.12–16, Figs 1.9–1.12）。</p>
<details open><summary>兩條連結路徑（Figs 1.10, 1.12）</summary><ol>
<li><b>血管門脈路徑 → 前葉（Adenohypophysis）</b>：<b>小細胞神經元（parvocellular）</b>位於弓狀核（ARC）與視前區–前下視丘（POA–AHA），分泌 <b>GnRH</b> 與 <b>TIDA 多巴胺（PIF）</b>至正中隆起（median eminence）外側柵欄區微血管網，經<b>長門脈靜脈</b>送至前葉促性腺細胞（LH/FSH）與泌乳細胞（PRL）。</li>
<li><b>直接神經束 → 後葉（Neurohypophysis）</b>：<b>大細胞神經元（magnocellular）</b>位於視上核（SON）與室旁核（PVN），軸突經漏斗柄（infundibulum）形成<b>下視丘–腦垂腺神經束</b>直達後葉釋出<b>催產素（OT）</b>與血管加壓素。</li></ol></details>
<p class="src">Essential Reproduction 7e Ch.1 p.12–16（Figs 1.9–1.13）</p>`,
    build() {
      S3 = { t: 0, play: true };
      const BR = '腦與松果體', HY = '下視丘核團', PT = '腦垂腺與連結';
      // 矢狀切腦輪廓、視丘與松果體
      const cortex = shell(5.4, [1.25, 0.92, 0.42], 0xd8c4b4, 0.22, Math.PI * 0.5, Math.PI, 0, Math.PI * 0.72);
      cortex.position.set(0.2, 2.2, -0.5);
      const thal = ell([0.6, 3.3, -0.2], [2.2, 1.3, 1.0], 0xc8a898, 0.42);
      const pineal = ell([3.4, 3.2, 0], [0.42, 0.34, 0.34], 0xffd060);
      const optCh = ell([-2.9, 1.4, 0.3], [0.5, 0.32, 0.4], 0xe8e0c8);
      const mamB = ell([1.8, 1.1, 0], [0.4, 0.35, 0.35], 0xd8b8a8);
      reg(BR, '視丘與大腦矢狀輪廓', 'Thalamus & cerebral cortex', '下視丘位於視丘下方、第三腦室底部與兩側壁，前方為終板、後方止於乳頭體後平面（Fig 1.9–1.10）。', [cortex, thal], { anchor: [-2.8, 5.2, 0.5] });
      reg(BR, '松果體（分泌褪黑素）', 'Pineal gland (Melatonin)', '附著於上視丘（habenula），依日照長短調節季節性生殖節律（Ch.1 Fig 1.9, Ch.3 Box 3.3）。', pineal, { anchor: [4.2, 3.6, 0.4] });
      reg(BR, '視交叉與乳頭體', 'Optic chiasm & mammillary body', '視交叉為下視丘前界地標，視網膜光訊號經視下視丘徑傳至視交叉上核（SCN）。', [optCh, mamB], { anchor: [-3.8, 1.4, 0.4] });

      // 下視丘主要生殖核團
      const hypoBox = ell([-0.4, 1.9, 0], [2.6, 1.1, 1.2], 0xe8a0b8, 0.25);
      const poa = ell([-1.8, 2.1, 0.4], [0.55, 0.45, 0.45], 0x50d0ff);
      const scn = ell([-2.3, 1.6, 0.45], [0.35, 0.3, 0.35], 0x70ff90);
      const pvn = ell([-0.5, 2.6, 0.45], [0.52, 0.42, 0.42], 0xff8ad8);
      const son = ell([-1.2, 1.6, 0.7], [0.42, 0.34, 0.38], 0xffa0c8);
      const arc = ell([0.1, 1.25, 0.45], [0.52, 0.38, 0.42], 0x90a8ff);
      reg(HY, '視前區–前下視丘（GnRH）', 'POA–AHA (parvocellular GnRH)', '含主要 GnRH 神經元群，投射至正中隆起外側柵欄區（Fig 1.10, 1.13）。', [poa, hypoBox], { anchor: [-2.4, 2.8, 0.5] });
      reg(HY, '視交叉上核（生物時鐘）', 'Suprachiasmatic nucleus (SCN)', '內源性 24 小時晝夜節律起搏器，受光暗訊號校正（Fig 1.11a, Box 3.3）。', scn, { anchor: [-3.4, 2.0, 0.5] });
      reg(HY, '室旁核與視上核（大細胞 OT）', 'PVN & SON (magnocellular)', '合成催產素（與 neurophysin）與血管加壓素，軸突直達腦垂腺後葉（Fig 1.12a）。', [pvn, son], { anchor: [-0.4, 3.4, 0.6] });
      reg(HY, '弓狀核（GnRH＋TIDA 多巴胺）', 'Arcuate nucleus (ARC)', '含小細胞 GnRH、Kisspeptin 與分泌 PIF（多巴胺）之 TIDA 神經元（Figs 1.11b, 1.13b）。', arc, { anchor: [1.3, 1.7, 0.5] });

      // 漏斗柄、正中隆起、門脈與前後葉
      const stalk = ttube([[-0.1, 0.9, 0], [0.0, -0.4, 0], [0.1, -1.6, 0]], [0.55, 0.35, 0.42], 0xe2c0d0, 0.42, { organic: false });
      const ap = ell([-0.9, -2.5, 0.1], [1.15, 0.95, 0.95], 0xd87a70, 0.82);
      const pp = ell([0.9, -2.5, 0.1], [0.85, 0.85, 0.85], 0xc898d8, 0.82);
      reg(PT, '腦垂腺前葉（腺垂腺）', 'Anterior pituitary (Adenohypophysis)', '含促性腺細胞（分泌 LH/FSH）與泌乳細胞（分泌 PRL）；無直接腦神經支配，全賴門脈血管（Fig 1.10）。', [ap, stalk], { anchor: [-2.4, -2.6, 0.6] });
      reg(PT, '腦垂腺後葉（神經垂腺）', 'Posterior pituitary (Neurohypophysis)', '由腦延伸形成，儲存並胞吐釋放來自 SON/PVN 軸突末梢的催產素與血管加壓素。', pp, { anchor: [2.4, -2.6, 0.6] });

      // 門脈（紅）與大細胞神經束（紫綠）
      const portalPts = [[-0.5, 0.7, 0.35], [-0.45, -0.3, 0.4], [-0.7, -1.4, 0.45], [-0.95, -2.35, 0.5]];
      const tractPts = [[-0.5, 2.5, 0.4], [-0.1, 1.0, 0.25], [0.35, -0.5, 0.25], [0.85, -2.4, 0.35]];
      const portalM = ttube(portalPts, 0.11, 0xff4a4a, 0.95, { organic: false });
      const tractM = ttube(tractPts, 0.09, 0xff8ad8, 0.95, { organic: false });
      reg(PT, '下視丘–腦垂腺門脈血管', 'Hypothalamo–hypophyseal portal system', '上腦垂腺動脈 → 正中隆起初級微血管網 → 長門脈靜脈 → 前葉次級微血管網（傳送 GnRH 與多巴胺）。', portalM, { anchor: [-2.2, -0.5, 0.6] });
      reg(PT, '下視丘–腦垂腺神經束', 'Hypothalamo–hypophyseal tract', 'SON/PVN 大細胞軸突直接沿漏斗柄通往後葉微血管釋放催產素（Fig 1.12a）。', tractM, { anchor: [2.1, -0.2, 0.5] });

      S3.fGnrh = flowOn(portalM.userData.curve, 16, 0.11, 0x7dff8a, 0x104010, 0.28, 0.06); CUR.root.add(S3.fGnrh);
      S3.fOT = flowOn(tractM.userData.curve, 14, 0.11, 0xff90e0, 0x400030, 0.22, 0.05); CUR.root.add(S3.fOT);

      const dt = dtClock();
      CUR.tick = () => {
        const d = S3.play ? dt() : 0; S3.t += d;
        S3.fGnrh.run(d); S3.fOT.run(d);
      };
    },
    panel(box) {
      checkbox(box, '播放軸突與門脈輸送', true, v => S3.play = v);
      note(box, '<b style="color:#7dff8a">綠球</b>：GnRH / 多巴胺經門脈至前葉<br><b style="color:#ff90e0">粉球</b>：OT 經神經束軸突直達後葉');
    }
  });

  /* ===== 場景④：類固醇骨架、受體五型與半衰期（Figs 1.14–1.16, Tables 1.1–1.6） ===== */
  let S4 = null, STKEY = 'chol';
  SCENES.push({
    name: '④ 類固醇與受體',
    title: '類固醇化學演化（C27→C21→C19→C18）與受體五類傳訊（Figs 1.14–1.16）',
    camera: { pos: [0, 0.5, 21], target: [0, 0, 0], fit: [11.2, 6.6] },
    controls: [
      { label: '🔍 全部', fn() { flyHome(); } },
      { label: '🔍 左：3D 類固醇分子', fn() { flyFit([-5.2, 0, 0], [5.0, 4.2]); } },
      { label: '🔍 右：受體訊息五路徑', fn() { flyFit([4.8, 0, 0], [5.4, 4.6]); } }
    ],
    desc: `
<p>性類固醇皆衍生自<b>膽固醇（C27）</b>，由內粒線體膜切去 6 碳支鏈成 <b>Pregnenolone（C21）</b>（速率決定步驟），再經<b>助孕素（C21）→ 雄性素（C19）→ 雌性素（C18，A 環芳香化）</b>逐代轉化（Figs 1.14–1.15）。</p>
<details open><summary>五類受體與第二傳訊（Fig 1.16）</summary><ol>
<li><b>胞內核受體</b>（性類固醇）：脫離 HSP90 → 磷酸化並結合 DNA 反應元件（SRE）。</li>
<li><b>雙聚化激素受體 → JAK-STAT</b>（PRL, PL, LIF, Leptin）。</li>
<li><b>受體激酶</b>：EGF/IGF（酪胺酸激酶）與 TGFβ 超家族（AMH, 活化素, BMP → 絲/蘇胺酸激酶 → <b>Smad</b>）。</li>
<li><b>GPCR</b>（LH, FSH, CG, GnRH, OT）：偶聯 Gs/AC→<b>cAMP</b> 或 Gq/PLCβ→<b>IP₃/DAG/Ca²⁺</b>。</li>
<li><b>直接 PLC-γ</b>（如 EGF）。</li></ol></details>
<p class="src">Essential Reproduction 7e Ch.1 p.16–27（Figs 1.14–1.16, Tables 1.1–1.6）</p>`,
    build() {
      S4 = { t: 0, play: true };
      const ML = '3D 性類固醇家族（左）', RC = '細胞受體五路徑（右）';
      S4.molG = new THREE.Group(); S4.molG.position.set(-5.2, 0.4, 0); CUR.root.add(S4.molG);
      const ms = steroidMeshes(STKEY, { s: 0.9, ar: 1.1 });
      const infoSt = STEROIDS[STKEY];
      attachPart(reg(ML, infoSt.zh, infoSt.en, '灰＝碳、紅＝氧（双鍵＝酮基；單鍵＝羥基）。切換右側下拉選單比較 C27 膽固醇 → C21 助孕酮 → C19 睪固酮/DHT → C18 雌素二醇（芳香化 A 環）。', ms, { anchor: [0, -2.8, 0.8] }), S4.molG);

      // 右側：細胞膜片段 + 5 種受體代表柱
      const bil = bilayer(8.8, 2.2, [], 0.8, 0.72, { seed: 9 });
      bil.heads.position.x = 5.0; bil.tails.position.x = 5.0;
      reg(RC, '目標細胞膜磷脂雙層', 'Plasma membrane bilayer', '脂溶性類固醇可直接擴散穿過磷脂雙層；胜肽與醣蛋白（LH/FSH/PRL/AMH）須結合膜表面受體（Fig 1.16）。', [bil.heads, bil.tails], { anchor: [9.2, 1.8, 0.6] });

      const nuc = cellShell([5.0, -3.4, 0], [3.6, 1.8, 1.8], 0x8a6ad0, 0.25, 1.5);
      reg(RC, '細胞核與 SRE/TF 轉錄目標', 'Nucleus (SRE / Transcription factors)', '所有路徑最終透過磷酸化轉錄因子、Smad 或核受體–SRE 改變細胞基因表現。', nuc, { anchor: [8.4, -3.5, 0.5] });

      const rDefs = [
        ['1. 核內類固醇受體 (SRE)', 'Intracellular steroid receptor', [2.1, -2.9, 0.3], 0xffb84a, '脂溶性類固醇進入核內結合受體，釋出 HSP90 後結合 SRE（ARE/ERE/PRE）。'],
        ['2. 雙聚激酶受體 (JAK-STAT)', 'Cytokine receptor (PRL/Leptin)', [3.0, 0.8, 0.2], 0xb07ae0, 'PRL、PL、Leptin、LIF 交聯兩條受體鏈，活化 JAK-STAT 激酶級聯。'],
        ['3. TGFβ/RTK 激酶受體 (Smad)', 'Receptor kinase (AMH/IGF/EGF)', [5.0, 0.8, 0.2], 0x46d16a, 'EGF/IGF 為酪胺酸激酶；AMH/活化素/BMP 為兩組 II+I 型絲蘇胺酸激酶 → Smad。'],
        ['4. GPCR (LH/FSH/GnRH/OT)', 'G-protein coupled receptor', [7.0, 0.8, 0.2], 0x4aa8ff, '7 次穿膜受體活化 Gs/AC（cAMP）或 Gq/PLCβ（IP₃/DAG/PKC/Ca²⁺）。']
      ];
      rDefs.forEach(([zh, en, pos, col, inf], idx) => {
        const m = idx === 0 ? ell(pos, [0.55, 0.38, 0.45], col) : helixBundle(pos, idx === 3 ? 7 : 2, idx === 3 ? 0.45 : 0.28, col, 2.7, 0.16);
        reg(RC, zh, en, inf, m, { anchor: [pos[0], idx === 0 ? -4.2 : 2.8, 0.4] });
      });

      const dt = dtClock();
      CUR.tick = () => {
        const d = dt(); if (S4.play) S4.t += d;
        S4.molG.rotation.y = S4.t * 0.45;
        S4.molG.rotation.x = Math.sin(S4.t * 0.3) * 0.25;
        updateAnchors();
      };
    },
    panel(box) {
      selectBox(box, '類固醇家族成員', [
        ['chol', '膽固醇 Cholesterol (C27)'],
        ['preg', '孕烯醇酮 Pregnenolone (C21)'],
        ['P4', '助孕酮 Progesterone (C21, 100%)'],
        ['DHEA', 'DHEA (C19 Δ5 路徑)'],
        ['T', '睪固酮 Testosterone (C19, 50%)'],
        ['DHT', '二氫睪固酮 DHT (C19, 100%)'],
        ['E2', '雌素二醇 E₂ (C18 芳香 A 環, 100%)'],
        ['E1', '雌素酮 E₁ (C18, 1%)'],
        ['E3', '雌素三醇 E₃ (C18, 10%)']
      ], v => { STKEY = v; reloadKeep(); }).value = STKEY;
      const ch = mkCanvas(box, 290, 145);
      plot(ch, {
        title: '表 1.6 血中半衰期比較 (對數尺度參考)',
        x: [0, 4], y: [0, 1.1], xt: [0.5, 1.5, 2.5, 3.5],
        fmtX: v => ['類固醇', 'LH', 'FSH', 'hCG'][Math.round(v - 0.5)] || '',
        yt: [0, 0.5, 1], fmtY: v => v === 0 ? '0' : v === 0.5 ? '3h' : '24h',
        series: [{ pts: [[0.5, 0.02], [1.5, 0.08], [2.5, 0.55], [3.5, 1.0]], col: '#ffd479', w: 2 }],
        pts: [
          { x: 0.5, y: 0.02, col: '#ff8080', r: 5, label: '2–3m' },
          { x: 1.5, y: 0.08, col: '#4aa8ff', r: 5, label: '30m' },
          { x: 2.5, y: 0.55, col: '#46d16a', r: 5, label: '3–4h' },
          { x: 3.5, y: 1.0, col: '#ffd479', r: 5, label: '~24h' }
        ],
        legend: false
      });
      checkbox(box, '自動旋轉類固醇分子', true, v => S4.play = v);
    }
  });
})();
