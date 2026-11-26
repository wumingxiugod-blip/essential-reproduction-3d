/* Ch.8：卵形成、濾泡發育、兩細胞類固醇合作、排卵減數重啟與逆流溶黃體（Figs 8.1–8.7） */
(function () {
  /* ===== 場景①：卵巢剖面與濾泡發育全階梯（Figs 8.1–8.3, Table 8.1） ===== */
  let S1 = null, STG1 = 3;
  const FSTG = [
    ['1. 原始濾泡（Primordial，20 µm）', '單層扁平顆粒細胞包圍停頓在核網期（GV）之初級卵母細胞，外圍為基底膜（membrana propria）；由 AMH 煞車避免庫存過早耗竭（Box 8.1）。'],
    ['2. 腔前／初級濾泡（Preantral，200–400 µm）', '不依賴 FSH（靠 GDF-9/BMP-15/SCF）！卵母細胞增至終尺寸 60–120 µm 並分泌<b>透明帶 ZP</b>；顆粒細胞伸出突起穿透 ZP 與卵膜形成<b>間隙連接</b>；外層聚集成內／外濾泡膜（theca）。'],
    ['3. 腔狀濾泡（Antral，2–10 mm）', '受 <b>FSH/LH 救援</b>免於閉鎖；黏多醣液滴匯合為濾泡腔，分出壁顆粒細胞與包圍卵子的<b>卵丘（cumulus oophorus）</b>；PAPP-A 釋放 IGF 選出單一優勢濾泡（人類）。'],
    ['4. 排卵前優勢濾泡（Preovulatory，20–25 mm）', '壁顆粒細胞在 FSH+E₂ 下新表現 <b>LH-R</b>，突起向卵巢表面形成<b>排卵口（stigma）</b>，準備在 LH 潮湧下排卵。'],
    ['5. 黃體（Corpus luteum）與白體', '排卵後塌陷並血管入侵，顆粒細胞肥大成<b>大黃體細胞</b>（P₄、催產素、抑制素 A），內膜細胞成<b>小黃體細胞</b>；未受精後萎縮成纖維性白體（corpus albicans）。']
  ];
  SCENES.push({
    name: '① 卵巢與濾泡階段',
    title: '卵巢縱剖全貌（Fig 8.1）與濾泡發育五階段細節（Figs 8.2–8.3）',
    camera: { pos: [0, 0.5, 20], target: [0, 0, 0], fit: [10.8, 6.4] },
    controls: [
      { label: '🔍 全部', fn() { flyHome(); } },
      { label: '🔍 左：卵巢皮質／髓質與輸卵管', fn() { flyFit([-5.2, 0, 0], [4.8, 4.4]); } },
      { label: '🔍 右：單一濾泡微構造放大', fn() { flyFit([4.8, 0, 0], [4.8, 4.4]); } }
    ],
    desc: `
<p>人類單一濾泡從原始庫存走到排卵前可歷時數月，最終 <b>&gt;99.9%</b> 在各階段因缺乏刺激或IGF競爭失敗而閉鎖死亡（Ch.8 p.134–138, Figs 8.1–8.3）。</p>
<details open><summary>卵巢空間構造與微環境（Figs 8.1–8.3）</summary><ul>
<li><b>卵巢門（Hilus）</b>：經卵巢繫膜（mesovarium）輸入血管與神經至髓質；表面覆蓋體腔上皮（沒有腹膜遮蓋）。</li>
<li><b>無血管顆粒層</b>：基底膜阻斷血管進入顆粒層，卵母細胞靠顆粒突起穿透<b>透明帶（ZP）</b>形成間隙連接輸送胺基酸與核苷酸。</li>
<li><b>輸卵管繖（Fimbria）</b>：具纖毛捕捉排入腹腔的卵丘–卵母細胞複合體。</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.8 p.134–138（Figs 8.1–8.3, Table 8.1–8.2）</p>`,
    build() {
      S1 = { t: 0, play: true };
      const OV = '卵巢縱剖（左，Fig 8.1）', FC = '目前階段放大（右，Fig 8.3）';
      // 左：剖半卵巢 + 卵巢血管 + 輸卵管繖
      const ovBody = shell(3.2, [1.3, 0.88, 0.72], 0xe8b098, 0.32, Math.PI * 0.45, Math.PI * 1.15);
      ovBody.position.set(-5.2, -0.4, 0);
      const ovFolRing = [
        ell([-7.8, -0.5, 0.3], [0.22, 0.22, 0.22], 0x70b8ff),
        ell([-6.8, 0.8, 0.3], [0.45, 0.45, 0.4], 0xf090b8),
        ell([-5.2, 1.5, 0.3], [0.85, 0.85, 0.65], 0x90d8ff, 0.7),
        ell([-3.2, 1.1, 0.4], [1.25, 1.2, 0.9], 0xffd479, 0.75),
        ell([-3.0, -1.6, 0.3], [1.05, 0.95, 0.8], 0xf2c84a),
        ell([-5.2, -2.1, 0.3], [0.65, 0.55, 0.5], 0xe8ecf0)
      ];
      const ovVess = ttube([[-5.4, -3.5, -0.4], [-5.2, -2.1, -0.2], [-5.2, -0.6, 0]], 0.22, 0xd83a3a, 0.85, { organic: false });
      const fimb = ttube([[-1.6, 2.2, 0.4], [-2.5, 2.8, 0.3], [-4.5, 3.6, 0], [-6.8, 3.0, 0]], [0.55, 0.36, 0.22, 0.26], 0xe87a90, 0.75, { organic: false });
      reg(OV, '卵巢皮質／髓質＋血管門', 'Ovary cortex, medulla & hilus', '從左順時針展示原始 → 初級 → 腔狀 → 排卵前優勢濾泡 → 黃體 → 白體（Fig 8.1b）。', [ovBody, ovVess], { anchor: [-5.2, -3.6, 0.6] });
      reg(OV, '各期濾泡與黃體分佈', 'Developing follicles, CL & corpus albicans', '黃體為黃色摺疊內分泌構造，隨後退化為白色疤痕（白體）。', ovFolRing, { anchor: [-7.8, 2.0, 0.5] });
      reg(OV, '輸卵管繖部與壺腹部', 'Fimbria & ostium of oviduct', '繖部纖毛掃取由卵巢表面排卵口釋出的卵丘–卵細胞團進入輸卵管。', fimb, { anchor: [-6.8, 3.9, 0.5] });

      // 右：放大單一濾泡結構（中心 [4.8, 0.2, 0]）
      const fg = new THREE.Group(); fg.position.set(4.8, 0.2, 0); CUR.root.add(fg);
      const isCL = STG1 === 4;
      if (!isCL) {
        const sc = [1.0, 1.5, 2.2, 2.75][STG1];
        const theca = cellShell([0, 0, 0], [sc * 1.16, sc * 1.16, sc * 0.95], 0xd88a4a, 0.38, 1.5);
        const bm = cellShell([0, 0, 0], [sc * 1.04, sc * 1.04, sc * 0.85], 0xf0e0c0, 0.28, 1.5);
        const gran = cellShell([0, 0, 0], [sc * 0.96, sc * 0.96, sc * 0.78], 0xf4a0c0, 0.55, 1.5);
        const ooPos = STG1 >= 2 ? [-sc * 0.35, -sc * 0.25, 0.1] : [0, 0, 0];
        const ooSz = STG1 === 0 ? 0.42 : 0.72;
        const oo = ell(ooPos, [ooSz, ooSz, ooSz], 0xffe47a);
        const zp = STG1 >= 1 ? cellShell(ooPos, [ooSz + 0.14, ooSz + 0.14, ooSz + 0.14], 0x80d8ff, 0.45, 1.2) : null;
        const gv = ell([ooPos[0] + 0.15, ooPos[1] + 0.15, ooPos[2] + 0.2], [ooSz * 0.35, ooSz * 0.35, ooSz * 0.35], 0x9a6ad0);
        const ant = STG1 >= 2 ? ell([sc * 0.22, sc * 0.2, 0], [sc * 0.62, sc * 0.58, sc * 0.45], 0x9fd8ff, 0.35) : null;
        if (STG1 >= 1) attachPart(reg(FC, '內／外濾泡膜（具血管，LH 受體）', 'Theca interna & externa', '富含微血管與平滑肌，受 LH 刺激產出雄性素供顆粒細胞芳香化（Fig 8.3c）。', [theca, bm], { anchor: [0, sc * 1.25, 0.6] }), fg);
        else attachPart(reg(FC, '固有膜（Membrana propria）', 'Membrana propria', '圍繞原始濾泡的基底膜，隔離基質血管。', bm, { anchor: [0, 1.3, 0.5] }), fg);
        attachPart(reg(FC, STG1 >= 2 ? '壁顆粒細胞＋卵丘' : '顆粒細胞（無血管）', 'Granulosa & cumulus cells', '以穿過透明帶的胞質突起與卵母細胞間隙連接；無血管侵入！', gran, { anchor: [sc * 0.9, -sc * 0.8, 0.6] }), fg);
        const ooGroup = zp ? [oo, zp, gv] : [oo, gv];
        attachPart(reg(FC, '初級卵母細胞（核網期 GV）＋透明帶', 'Oocyte (GV) & Zona pellucida', '分泌 ZP 醣蛋白形成透明帶，減數前期 I 停頓直到 LH 潮湧（Fig 8.3b–d）。', ooGroup, { anchor: [-sc * 0.9, -0.8, 0.7] }), fg);
        if (ant) attachPart(reg(FC, '濾泡腔（Antrum，黏多醣濾泡液）', 'Follicular antrum', '濾泡後期體積增大主要源自濾泡液劇增（排卵前直徑達 20–25 mm）。', ant, { anchor: [sc * 0.8, sc * 0.8, 0.6] }), fg);
      } else {
        const cap = cellShell([0, 0, 0], [2.5, 2.4, 1.9], 0xd88a4a, 0.35, 1.5);
        const bigL = dots([V(-0.9, 0.8, 0.2), V(0.8, 0.9, 0.2), V(-0.6, -0.7, 0.3), V(0.9, -0.6, 0.2), V(0, 0.2, 0.4), V(-1.2, 0, 0)], 0.55, 0xf2c84a);
        const smlL = dots([V(-1.7, 0.9, 0.2), V(1.6, 1.0, 0.2), V(1.7, -0.9, 0.2), V(-1.6, -1.0, 0.2)], 0.28, 0xe88a4a);
        const vessels = ttube([[-1.8, -1.5, 0], [-0.4, -0.3, 0.2], [0.5, 0.6, 0.1], [1.6, 1.3, 0]], 0.1, 0xff4040, 0.9, { organic: false });
        attachPart(reg(FC, '大黃體細胞（源自顆粒細胞）', 'Large luteal cells (P₄, OT, Inhibin A)', '原顆粒細胞肥大並含黃體色素 lutein，大量製造助孕素、催產素與抑制素 A。', [bigL, cap], { anchor: [0, 2.6, 0.6] }), fg);
        attachPart(reg(FC, '小黃體細胞與入侵微血管', 'Small luteal cells & invading vessels', '基底膜崩解後血管長入原無血管區（體內血管最豐富的組織之一），與來自膜內層之小黃體細胞合作分泌。', [smlL, vessels], { anchor: [2.2, -1.4, 0.6] }), fg);
      }
      textSprite(FSTG[STG1][0], [4.8, 4.3, 0], 0.36, '#ffd479');
    },
    panel(box) {
      const info = note(box, '', 'big');
      const sl = slider(box, '濾泡／黃體階段', 0, 4, STG1, 1, v => { STG1 = v; reloadKeep(); });
      btnRow(box, [['◀ 上一步', () => { STG1 = Math.max(0, STG1 - 1); sl.value = STG1; reloadKeep(); }], ['下一步 ▶', () => { STG1 = Math.min(4, STG1 + 1); sl.value = STG1; reloadKeep(); }]]);
      info.innerHTML = `<b>${FSTG[STG1][0]}</b><br>${FSTG[STG1][1]}`;
    }
  });

  /* ===== 場景②：兩細胞–兩促性腺激素與排卵前P₄切換（Fig 8.4, Box 8.3） ===== */
  let S2 = null, PHASE2 = 'antral'; // 'antral' vs 'preov'
  SCENES.push({
    name: '② 兩細胞類固醇合作',
    title: '兩細胞–兩促性腺激素合作（Fig 8.4）與排卵前轉產助孕素',
    camera: { pos: [0, 0.4, 19], target: [0, 0, 0], fit: [9.8, 6.2] },
    controls: [{ label: '🔍 全貌', fn() { flyHome(); } }],
    desc: `
<p>腔狀濾泡中，<b>濾泡膜內層</b>與<b>顆粒細胞</b>隔著基底膜分工合作製造大量雌素二醇 E₂，待 LH 潮湧來臨再轉向助孕素 P₄（Ch.8 p.139–144, Fig 8.4）。</p>
<details open><summary>腔狀期 vs 排卵前期（Fig 8.4）</summary><ul>
<li><b>腔狀期（產 E₂）</b>：膜內層（<b>LH-R</b>）將膽固醇轉為雄烯二酮／睪固酮 → 穿過基底膜入顆粒層（<b>FSH-R</b>）→ 經<b>芳香酶</b>轉為 <b>E₂</b>（PAPP-A 釋放 IGF 放大訊號！）。</li>
<li><b>排卵前期（產 P₄）</b>：FSH+E₂ 誘導外層顆粒細胞長出 <b>LH-R</b>；LH 潮湧使顆粒層停止分裂並關閉芳香酶，改直接大量合成<b>助孕素 P₄</b>（RU486 阻斷即停排卵）。</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.8 p.139–144（Fig 8.4, Box 8.3）</p>`,
    build() {
      S2 = { t: 0, play: true };
      const TH = '濾泡膜內層（上方，有血管）', GR = '壁顆粒細胞（下方，無血管）';
      const isPre = PHASE2 === 'preov';
      // 血管 + 膜內層 + 基底膜 + 顆粒層
      const bvTube = ttube([V(-6.5, 4.4, 0), V(-2.0, 4.55, 0.1), V(2.5, 4.35, -0.05), V(6.5, 4.45, 0)], 0.42, 0xd83a48, 0.46, { organic: false, radial: 18 });
      const bvRbc = rbcDiscs([-4.8, -2.6, -0.4, 1.8, 4.0].map((x, i) => V(x, 4.42 + Math.sin(i) * 0.08, 0.05)), 0.2, 0xe82838, 0.96);
      const bv = [bvTube, bvRbc];
      const theca = [tissueSlab([0, 2.2, 0], [11.5, 2.7, 2.7], 0xd88a4a, 0.26, { wave: 0.08, seed: 1.4 }), ...epitheliumRow({ x0: -5.2, x1: 5.2, y: 2.2, z0: -0.9, z1: 0.9, h: 1.15, nx: 7, nz: 2, col: 0xd88a4a, nucCol: 0x7c3e18, o: 0.45 })];
      const bm = tissueSlab([0, 0.2, 0], [12.0, 0.3, 3.0], 0xf0e0c0, 0.9, { wave: 0.06, freq: 1.5, seed: 2.2 });
      const gran = [tissueSlab([0, -2.3, 0], [11.5, 3.5, 2.7], 0xf4a0c0, 0.26, { wave: 0.09, seed: 3.1 }), ...epitheliumRow({ x0: -5.2, x1: 5.2, y: -2.1, z0: -0.9, z1: 0.9, h: 1.65, nx: 8, nz: 2, col: 0xf4a0c0, nucCol: 0x8e2e5c, o: 0.48 })];
      reg(TH, '微血管網（LH / FSH 與膽固醇來源）', 'Thecal capillary bed', '膜內層富含血管，基底膜徹底阻擋血管進入顆粒層。', bv, { anchor: [-5.2, 5.1, 0.5] });
      reg(TH, '濾泡膜內層細胞（具 LH-R）', 'Theca interna cell (LH-R)', 'LH 刺激乙酸／膽固醇 → 孕烯醇酮 → 雄烯二酮（A₄）與睪固酮（T），少部分產 E₂。', theca, { anchor: [5.0, 3.4, 0.6] });
      reg(TH, '濾泡基底膜（Membrana propria）', 'Basement membrane', '雄性素可脂溶自由擴散穿過進入顆粒層；血管與大分子不能穿透。', bm, { anchor: [-5.5, 0.3, 0.6] });
      reg(GR, isPre ? '壁顆粒細胞（新獲 LH-R → 轉產 P₄）' : '壁顆粒細胞（FSH-R → 芳香酶產 E₂）', 'Mural granulosa cell',
        isPre ? 'LH 潮湧使顆粒細胞停止分裂並關閉芳香酶，改以新表現的 LH-R 大量合成並釋放助孕素 P₄（Fig 8.4 右）。'
          : '無法自行合成雄性素，全靠將膜層來的雄性素芳香化為 E₂（且受 PAPP-A/IGF 正向促進）。',
        gran, { anchor: [5.0, -3.9, 0.6] });

      // 分子流動箭頭
      const aAndr = arcArrow([[-1.2, 2.2, 0.4], [-1.2, 0.2, 0.4], [-1.2, -1.6, 0.4]], 0x46d16a, 0.08);
      const aE2 = arcArrow([[0.5, -2.2, 0.4], [2.8, -2.2, 0.4], [4.2, 2.0, 0.4], [4.2, 4.3, 0.4]], isPre ? 0x556677 : 0xff70b0, 0.08);
      const aP4 = arcArrow([[-2.8, -2.6, 0.4], [-4.5, -2.6, 0.4], [-4.5, 3.8, 0.4]], isPre ? 0xffd43a : 0x556677, 0.09);
      reg(TH, '雄性素穿梭（A₄ / T：膜層 → 顆粒層）', 'Androgen shuttle across BM', '膜層供給顆粒層作為芳香化受質，並同時刺激顆粒細胞增生與芳香酶表現。', aAndr, { anchor: [-2.6, 1.1, 0.5] });
      reg(GR, '雌素二醇 E₂ 輸出（腔狀期主產物）', 'Oestradiol-17β export', '優勢濾泡在排卵前促成 E₂ 暴衝潮湧，進而透過正回饋觸發垂體 LH 潮湧。', aE2, { anchor: [4.8, -0.5, 0.5] });
      reg(GR, '助孕素 P₄ 切換（排卵前與黃體主產物）', 'Preovulatory P₄ switch', '排卵前急劇上升：抑制較小競爭濾泡、啟動排卵蛋白酶，並推動黃體期轉型（Fig 8.4）。', aP4, { anchor: [-5.5, -1.5, 0.5] });

      S2.fA = flowOn(aAndr.curve, 10, 0.13, 0x7dff8a, 0x104010, isPre ? 0.05 : 0.28, 0.04);
      S2.fE = flowOn(aE2.curve, 12, 0.13, 0xff80c0, 0x400020, isPre ? 0.05 : 0.3, 0.04);
      S2.fP = flowOn(aP4.curve, 12, 0.14, 0xffd43a, 0x403000, isPre ? 0.32 : 0.04, 0.04);
      CUR.root.add(S2.fA, S2.fE, S2.fP);

      textSprite(isPre ? 'LH 潮湧後：停止芳香化 → 爆衝分泌 P₄' : '腔狀優勢期：LH(膜) + FSH(顆粒) 協同狂產 E₂', [0, -5.1, 0], 0.38, '#ffd479');

      const dt = dtClock();
      CUR.tick = () => {
        const d = S2.play ? dt() : 0;
        S2.fA.run(d); S2.fE.run(d); S2.fP.run(d);
      };
    },
    panel(box) {
      seg(box, '濾泡內分泌時期', [['antral', '腔狀生長期 (產 E₂)'], ['preov', 'LH 潮湧後排卵前 (產 P₄)']], PHASE2, v => { PHASE2 = v; reloadKeep(); });
      checkbox(box, '播放類固醇穿梭動畫', true, v => S2.play = v);
    }
  });

  /* ===== 場景③：卵母細胞減數分裂恢復、GVBD 與排卵口破裂（Fig 8.5） ===== */
  let S3 = null, ST3 = 2, SP3 = 'most';
  const OV_STEPS = [
    ['1. 排卵前停頓於核網期（Dictyate GV）', '卵丘細胞突起穿過透明帶維持間隙連接與高 cAMP，使染色體維持在第一次減數前期生發泡（GV）內（可長達 50 年）。'],
    ['2. LH 潮湧 → 突起撤回與 GVBD（3–12 小時）', 'LH 經卵丘降低 cAMP 並切斷接觸形成圍卵腔隙；核膜破裂（GVBD）、出現第一紡錘體；高基氏器製造之<b>皮質顆粒</b>移向卵膜下。'],
    ['3. 第一極體排出＋MII 停頓（多數哺乳類排卵期）', '極度不均等胞質分裂保存養分於次級卵母細胞、丟棄 <b>PB1</b>；隨即受細胞靜止因子（CSF）停頓於<b>第二次減數中期（MII）</b>；卵排破濾泡壁排卵口（<b>stigma</b>，MMP/膠原酶分解）。'],
    ['4. 狗與狐例外：MI/初級卵母時期即排卵', '狗與狐在尚未完成第一次減數分裂前即被排入輸卵管，直到排出後才完成減數分裂 I！']
  ];
  SCENES.push({
    name: '③ 減數重啟與排卵口',
    title: 'LH 潮湧引發 GVBD、PB1、MII 停頓與 Stigma 排卵（Fig 8.5）',
    camera: { pos: [0, 0.3, 16.5], target: [0, 0, 0], fit: [7.8, 5.4] },
    controls: [{ label: '🔍 卵與卵丘特寫', fn() { flyHome(); } }],
    desc: `
<p>LH 不能直接結合卵母細胞，必須透過<b>卵丘顆粒細胞（cumulus cells）</b>撤回胞質突起並解除抑制訊號，同時以蛋白酶 <b>MMPs / 胞漿素（plasmin）</b>溶解濾泡壁 <b>stigma</b> 排卵（Ch.8 p.141–144, Fig 8.5）。</p>
<p class="src">Essential Reproduction 7e Ch.8 p.141–144（Fig 8.5）</p>`,
    build() {
      S3 = { t: 0, play: true };
      const O = '卵母細胞減數裝置（Fig 8.5）', C = '卵丘、透明帶與排卵壁';
      const oo = ell([0, 0, 0], [2.4, 2.4, 2.2], 0xffe688, 0.65);
      const zp = cellShell([0, 0, 0], [2.75, 2.75, 2.55], 0x80d8ff, 0.35, 1.4);
      const cum = dots([V(-3.1, 1.2, 0.2), V(-3.3, -0.8, 0.3), V(-1.4, 3.1, 0.2), V(1.6, 3.0, 0.2), V(3.2, -0.5, 0.2), V(0, -3.2, 0.3)], 0.52, 0xf4a0c0, 0.85);
      const gap = ST3 === 0 ? dots([V(-2.5, 0.9, 0.2), V(-2.5, -0.6, 0.2), V(0, -2.5, 0.2), V(2.4, -0.3, 0.2)], 0.14, 0x46d16a) : null;
      reg(O, '卵母細胞質與卵膜', 'Ooplasm & oolemma', '於極體區域上方缺乏微絨毛與皮質顆粒，保留極度不均等分裂優勢。', oo, { anchor: [-2.8, -2.2, 0.6] });
      reg(C, '透明帶與擴張卵丘細胞（分泌玻尿酸）', 'Zona pellucida & cumulus cells', ST3 === 0 ? '突起穿過透明帶以間隙連接輸送 cAMP 抑制減數分裂（綠點）。' : '受 LH 與卵母 GDF-9 協同誘導分泌玻尿酸黏液基質並撤回突起（形成圍卵腔）。', gap ? [zp, cum, gap] : [zp, cum], { anchor: [3.2, 2.4, 0.6] });

      // 核／紡錘體／PB1／皮質顆粒
      if (ST3 === 0 || ST3 === 3) {
        const gv = ell([0.3, 0.4, 0.3], [0.95, 0.95, 0.9], 0x9a6ad0, 0.72);
        reg(O, ST3 === 3 ? '狗／狐初級卵母核（排卵時尚未排 PB1）' : '生發泡 GV（核網期停頓）', 'Germinal vesicle (Dictyate)', ST3 === 3 ? '狗與狐例外於減數分裂 I 尚未完成前即排卵，受精前後才恢復！' : '染色體停於第一次減數前期（雙帶期）等待 LH 潮湧。', gv, { anchor: [0.4, 1.6, 0.8] });
      } else {
        const sp1 = [...chromMesh([0.78, 0.95, 0.5], 0xff5080, 0xff5080, true, 0.65).ms, ...chromMesh([1.22, 0.95, 0.5], 0x40a0ff, 0x40a0ff, true, 0.65).ms,
          capsule([0.1, 0.95, 0.5], [1.9, 0.95, 0.5], 0.03, 0xffd479, 0.7)];
        const cg = dots([V(-1.9, 0.6, 0.8), V(-1.7, -1.0, 0.8), V(-0.6, -1.9, 0.7), V(1.2, -1.7, 0.7)], 0.15, 0x46d16a);
        reg(O, ST3 === 1 ? '第一減數紡錘體（GVBD 後）' : '第二中期紡錘體（MII ＋ CSF 停頓）', 'Meiotic spindle & cortical granules', '皮質顆粒（綠）移至卵膜下準備受精後防止多精入卵；紡錘體無中心粒，僅由 PCM 組織。', [...sp1, cg], { anchor: [-1.8, -1.6, 0.8] });
        if (ST3 === 2) {
          const pb1 = ell([2.15, 1.35, 0.4], [0.42, 0.42, 0.42], 0xd8a8ff);
          reg(O, '第一極體（PB1，位於圍卵腔）', 'First polar body', '僅帶走半數染色體與極微細胞質，隨後退化。', pb1, { anchor: [2.8, 1.5, 0.6] });
        }
      }
      textSprite(OV_STEPS[ST3][0], [0, 4.1, 0], 0.36, '#ffd479');
    },
    panel(box) {
      const info = note(box, '', 'big');
      const sl = slider(box, '減數重啟與排卵時期', 0, 3, ST3, 1, v => { ST3 = v; reloadKeep(); });
      btnRow(box, [['◀ 上一步', () => { ST3 = Math.max(0, ST3 - 1); sl.value = ST3; reloadKeep(); }], ['下一步 ▶', () => { ST3 = Math.min(3, ST3 + 1); sl.value = ST3; reloadKeep(); }]]);
      info.innerHTML = `<b>${OV_STEPS[ST3][0]}</b><br>${OV_STEPS[ST3][1]}`;
    }
  });

  /* ===== 場景④：綿羊子宮–卵巢逆流溶黃體經典實驗（Figs 8.6–8.7, Box 8.4） ===== */
  let S4 = null, EXP4 = 'intact';
  const EXP_TAB = {
    intact: ['完整子宮角（左卵巢具黃體）', '黃體期後段 P₄ 自身受體下調 → OT 受體表現 → 黃體 OT 促左側子宮內膜分泌 <b>PGF₂α</b> → 經左側子宮靜脈逆流至左卵巢動脈 → 引起 Endothelin-1 血管收縮與<b>左黃體退化（溶黃體）</b>！', true, true, false],
    ipsi_cut: ['切除「同側（左）」子宮角（Fig 8.6b）', '左子宮內膜來源消失 → <b>左黃體不會退化（壽命大幅延長）</b>！證明溶黃體因子來自同側子宮且不經過體循環（肺臟會單次清除 PGF₂α）。', false, true, false],
    contra_cut: ['切除「對側（右）」子宮角（Fig 8.6c）', '保留左側子宮角 → PGF₂α 照常經局部逆流血管送達左卵巢 → <b>左黃體如期退化</b>。', true, false, false],
    clamp: ['結紮同側子宮–卵巢間血管（Fig 8.6d）', '即使保留完整子宮，阻斷局部靜脈–動脈逆流血管交換後，PGF₂α 無法繞過肺部直接抵達卵巢 → <b>左黃體不退化</b>！', true, true, true]
  };
  SCENES.push({
    name: '④ 逆流溶黃體實驗',
    title: '綿羊雙角子宮與子宮靜脈→卵巢動脈逆流溶黃體機制（Fig 8.6, Box 8.4）',
    camera: { pos: [0, 0.3, 19], target: [0, 0, 0], fit: [9.4, 6.2] },
    controls: [{ label: '🔍 全貌', fn() { flyHome(); } }],
    desc: `
<p>在羊、牛、豬等非靈長類哺乳動物，未懷孕時黃體並非自然死亡，而是被子宮分泌的 <b>PGF₂α</b> 主動摧毀；高等靈長類（人）則不依賴子宮 PGF₂α（Ch.8 p.145–146, Fig 8.6）。</p>
<details open><summary>Box 8.4 PGF₂α–催產素–內皮素雙重正回饋</summary><ul>
<li><b>PGF₂α 半衰期極短</b>（3–10 分鐘，經過肺臟單次循環即完全失活），必須靠緊貼的<b>子宮靜脈 → 卵巢動脈逆流轉運</b>直接送入同側黃體！</li>
<li><b>時序控制</b>：長期高 P₄ 下調內膜 PR → 解除對 OT 受體的抑制 → 黃體 OT 促 PGF₂α、PGF₂α 反促更多 OT 與血管收縮素 <b>Endothelin-1</b>。</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.8 p.145–148（Figs 8.6–8.7, Table 8.3, Box 8.4）</p>`,
    build() {
      S4 = { t: 0, play: true };
      const [title, txt, hasL, hasR, clamped] = EXP_TAB[EXP4];
      const regresses = hasL && !clamped;
      const U = '綿羊雙角子宮與卵巢', VSC = '局部逆流血管交換';
      const body = lathe([[0.5, -3.5], [0.85, -1.8], [1.1, 0]], 0xd87a80, 0.72, [0, 0, 0]);
      const hL = hasL ? ttube([[0, -0.2, 0], [-1.8, 0.8, 0.2], [-3.4, 2.2, 0], [-4.2, 1.5, -0.2]], [0.9, 0.75, 0.5, 0.28], 0xd87a80, 0.78, { organic: false }) : null;
      const hR = hasR ? ttube([[0, -0.2, 0], [1.8, 0.8, 0.2], [3.4, 2.2, 0], [4.2, 1.5, -0.2]], [0.9, 0.75, 0.5, 0.28], 0xd87a80, 0.78, { organic: false }) : null;
      const ovL = ell([-5.2, 0.2, 0], [0.85, 0.65, 0.65], 0xe8b098, 0.8);
      const clL = ell([-5.2, 0.7, 0.3], [0.58, 0.55, 0.52], regresses ? 0x605850 : 0xf2c84a);
      const ovR = ell([5.2, 0.2, 0], [0.85, 0.65, 0.65], 0xe8b098, 0.8);
      reg(U, '子宮體與保留子宮角', 'Bicornuate sheep uterus', '綿羊為雙角子宮；切除單側子宮角可視同移除該側局部 PGF₂α 來源（Fig 8.6）。', [body, ...(hL ? [hL] : []), ...(hR ? [hR] : [])], { anchor: [0, -3.4, 0.6] });
      reg(U, regresses ? '左卵巢黃體（退化中 ❌）' : '左卵巢黃體（存活維持 ✓）', 'Left ovary & Corpus luteum', txt, [ovL, clL], { anchor: [-6.6, 1.0, 0.6] });
      reg(U, '右卵巢', 'Right ovary', '無活動性黃體之對側卵巢。', ovR, { anchor: [6.4, 0.4, 0.5] });

      // 左側子宮靜脈 + 盤繞卵巢動脈（逆流交換）
      const uvCurve = new THREE.CatmullRomCurve3(PV([[-2.6, 0.6, 0.2], [-3.5, -0.6, 0.2], [-4.5, -1.8, 0.2], [-5.2, -3.4, 0.2]]));
      const uv = ttube(uvCurve.getPoints(30), 0.16, 0x3b82f6, 0.78, { organic: false });
      const oaPts = helixAlong(lineCurve([-4.5, -3.0, 0.2], [-5.1, -0.3, 0.2]), 0.38, 4, 0, 120);
      const oa = ttube(oaPts, 0.1, 0xff4a4a, 0.92, { organic: false });
      reg(VSC, '同側子宮靜脈 ↔ 卵巢動脈逆流網', 'Uterine vein → ovarian artery countercurrent',
        clamped ? '<b>血管已夾閉結紮！</b>PGF₂α 無法從子宮靜脈轉移到卵巢動脈。' : 'PGF₂α 經濃度梯度由子宮靜脈擴散進入緊貼纏繞的卵巢動脈，避開肺部滅活直達同側黃體！',
        [uv, oa], { anchor: [-6.2, -2.5, 0.6] });

      if (clamped) {
        const clampBar = box([-4.4, -1.4, 0.3], [1.6, 0.25, 0.4], 0xff4040);
        reg(VSC, '血管結紮夾（阻斷逆流）', 'Vascular clamp', '阻斷局部血管後黃體得以維持功能（Fig 8.6d）。', clampBar, { anchor: [-3.2, -1.4, 0.5] });
      }
      if (regresses) {
        S4.fPG = flowOn(new THREE.CatmullRomCurve3(PV([[-2.6, 0.6, 0.2], [-3.8, -1.0, 0.2], [-4.8, -0.8, 0.2], [-5.2, 0.5, 0.3]])), 14, 0.12, 0x70ff90, 0x104010, 0.32, 0.04);
        CUR.root.add(S4.fPG);
      }
      textSprite(title, [0, 4.3, 0], 0.38, regresses ? '#ff8a8a' : '#7dff8a');

      const dt = dtClock();
      CUR.tick = () => {
        const d = S4.play ? dt() : 0; S4.t += d;
        if (S4.fPG) S4.fPG.run(d);
      };
    },
    panel(box) {
      selectBox(box, 'Fig 8.6 實驗操作選擇', [
        ['intact', 'a. 完整對照組（左黃體如期退化）'],
        ['ipsi_cut', 'b. 切除同側（左）子宮角（黃體延長）'],
        ['contra_cut', 'c. 切除對側（右）子宮角（黃體退化）'],
        ['clamp', 'd. 結紮子宮–卵巢血管（黃體延長）']
      ], v => { EXP4 = v; reloadKeep(); }).value = EXP4;
      note(box, EXP_TAB[EXP4][1], 'big');
      checkbox(box, '播放 PGF₂α 逆流轉移動畫', true, v => S4.play = v);
    }
  });

  /* ===== 場景⑤：卵巢縱切①→⑩發育、格蕾斐濾泡放大與物種卵巢外形（整合比較大體解剖） ===== */
  (function () {
    const { TEX, mat, ell, blob, tube, ribbon, annulus, disc, shell } = ANAT;
    SCENES.push({
      name: '⑤ 卵巢全剖面與外形',
      title: '卵巢切面：濾泡發育 ①→⑩、格蕾斐濾泡放大與物種卵巢外形',
      camera: { pos: [1.0, -0.2, 12.5], target: [1.0, -0.4, 0], fit: [6.4, 3.6] },
      controls: [
        { label: '🔍 卵巢全覽', fn() { flyHome(); } },
        { label: '🔍 卵巢縱切面', fn() { flyTo([-1.2, 0.3, 7.5], [-1.2, 0.3, 0]); } },
        { label: '🔍 格蕾斐濾泡放大', fn() { flyTo([4.3, 0.3, 6], [4.3, 0.3, 0]); } },
        { label: '🔍 物種卵巢外形', fn() { flyTo([-0.6, -1.0, 6.5], [-0.6, -2.7, 0]); } }
      ],
      desc: `
<p>左：卵巢縱切面（依 <b>①→⑩</b> 呈馬蹄循環排列）；右：成熟格蕾斐濾泡放大剖面；下方：<b>牛羊杏仁形、馬豆形（具排卵窩）與豬葡萄串狀</b>卵巢比較。</p>
<table>
  <tr><th>階段</th><th>重點（對照本頁 ①–③ 分子機轉）</th></tr>
  <tr><td>①原始→②初級</td><td>扁平→單層方形濾泡細胞，出現透明帶與 FSH-R（不依賴性腺素）</td></tr>
  <tr><td>③次級→④三級</td><td>多層顆粒細胞＋內外濾泡膜；形成濾泡腔與內膜 LH-R（FSH 依賴）</td></tr>
  <tr><td>⑤格蕾斐→⑦血體→⑧黃體→⑨白體</td><td>LH 峰排卵後血體→大小黃體細胞→退化白體；馬黃體埋於基質</td></tr>
  <tr><td>⑩閉鎖濾泡</td><td>可於各期發生，家畜以三級濾泡最常見（基膜增厚成玻璃狀膜）</td></tr>
</table>
<p class="src">雷弟生物學 3D 比較解剖整合（搭配溼潤組織紋理，牛 12–19 mm／馬 25–70 mm／豬 8–12 mm）</p>`,
      build() {
        const CX = -1.2, CY = 0.3, SX = 2.3, SY = 1.5, SZ = 1.15;
        const E = (deg, f) => { const a = deg * Math.PI / 180; return [CX + SX * f * Math.cos(a), CY + SY * f * Math.sin(a), 0]; };
        const flat = (m, sx, sy) => { m.scale.set(sx, sy, 1); m.position.set(CX, CY, -0.015); return m; };
        const back = (r, col, o, c) => { const m = shell(r, [1, 1, 1], col, o, Math.PI, Math.PI); m.position.set(...c); return m; };
        const G1 = '卵巢一般構造', G2 = '濾泡發育', G3 = '排卵後的變化', G4 = '格蕾斐濾泡放大', G5 = '物種卵巢外形';
        const OOC = 0xfbefb0, ZP = 0xffffff, FC = 0xf0a070, GR = 0xf2c36b, TI = 0xe0956a, TE = 0xc77a6a, ANT = 0x9fd6ff;

        const ovShell = shell(1, [SX, SY, SZ], 0xf2e2c8, 0.35, Math.PI, Math.PI); ovShell.position.set(CX, CY, 0);
        reg(G1, '生殖上皮', 'Germinal epithelium', '覆蓋白膜外的單層鱗狀中皮（位於卵巢表面，有別於睪丸曲細精管內）。',
          [ovShell, flat(annulus(1, 0.985, 0.03, 0xfff4dc), SX, SY)], { anchor: E(140, 1.0) });
        reg(G1, '白膜', 'Tunica albuginea', '卵巢表面緻密結締組織被膜。', flat(annulus(0.985, 0.94, 0.025, 0xfafafa), SX, SY), { anchor: E(165, 0.96) });
        reg(G1, '皮質', 'Cortex', '含各發育階段濾泡與黃體（馬為少見例外：皮質在內、髓質在外！）。',
          flat(annulus(0.94, 0.55, 0.02, 0xdcb79c), SX, SY), { anchor: E(-170, 0.7) });
        reg(G1, '髓質', 'Medulla', '含彈性結締組織、神經與迂曲血管。', flat(disc(0.55, 0.02, 0xc7837a), SX, SY), { anchor: [CX - 0.4, CY + 0.1, 0] });
        const VS = [];
        [[-0.5, 0xd03030], [-0.2, 0x4a6fd8], [0.15, 0xd03030], [0.45, 0x4a6fd8]].forEach(([dx, c], k) => {
          const base = new THREE.CatmullRomCurve3(PV([[CX + dx * 0.4, CY - SY - 0.5, 0.06], [CX + dx * 0.5, CY - SY + 0.3, 0.06], [CX + dx * 1.6, CY - 0.1, 0.06], [CX + dx * 2.6, CY + 0.35, 0.05]]));
          VS.push(tube(helixAlong(base, 0.05, 6, k, 160), 0.022, c, 1, 2));
        });
        reg(G1, '髓質血管', 'Medullary vessels', '經卵巢門進入的高度迂曲動靜脈。', VS, { anchor: [CX + 0.6, CY - 0.4, 0.06] });
        reg(G1, '卵巢門', 'Hilus ovarii', '卵巢附著於卵巢系膜之血管神經門戶。',
          [ell([CX, CY - SY + 0.02, 0], [0.35, 0.12, 0.2], 0xc9a0a0, 0.8), ribbon([[CX - 0.35, CY - SY, 0], [CX + 0.35, CY - SY, 0]], [[CX - 0.5, CY - SY - 0.6, -0.05], [CX + 0.5, CY - SY - 0.6, -0.05]], 0x9be0b0, 0.35)],
          { anchor: [CX, CY - SY - 0.05, 0.1] });

        const PR = [];
        [[178, 0.9], [188, 0.89], [198, 0.88], [170, 0.87], [207, 0.87], [183, 0.84]].forEach(([d, f]) => {
          const c = E(d, f); PR.push(ell(c, [0.05, 0.05, 0.05], OOC), back(0.075, FC, 0.8, c));
        });
        reg(G2, '① 原始濾泡', 'Primordial follicle', '出生即存在，停於第一次減數分裂前期之初級卵母細胞外包單層扁平濾泡細胞。', PR, { anchor: E(188, 0.88) });
        let c = E(152, 0.8);
        reg(G2, '② 初級濾泡', 'Primary follicle', '單層方形濾泡細胞；開始分泌透明帶並表現 FSH 受體。', [ell(c, [0.075, 0.075, 0.075], OOC), back(0.09, ZP, 0.6, c), back(0.13, FC, 0.85, c)], { anchor: c });
        c = E(124, 0.74);
        reg(G2, '③ 次級濾泡', 'Secondary follicle', '多層顆粒細胞＋內外濾泡膜分化。', [ell(c, [0.09, 0.09, 0.09], OOC), back(0.11, ZP, 0.6, c), back(0.21, GR, 0.9, c), back(0.25, TI, 0.7, c)], { anchor: c });
        c = E(93, 0.66);
        const TA = [ell(c, [0.09, 0.09, 0.09], OOC), back(0.11, ZP, 0.6, c), back(0.3, GR, 0.9, c), back(0.35, TI, 0.7, c)];
        [[0.15, 0.08], [-0.13, 0.12], [0.05, -0.17], [-0.16, -0.08]].forEach(([dx, dy]) => TA.push(ell([c[0] + dx, c[1] + dy, 0.02], [0.06, 0.05, 0.03], ANT, 0.7)));
        reg(G2, '④ 三級濾泡', 'Tertiary (antral) follicle', '形成含玻尿酸與蛋白醣之濾泡腔，內膜表現 LH-R，依賴 FSH 發育。', TA, { anchor: c });
        c = E(52, 0.86);
        reg(G2, '⑤ 格蕾斐濾泡', 'Graafian (mature) follicle', '凸出於卵巢表面的成熟水泡狀濾泡（右側為放大剖面）。',
          [back(0.5, TE, 0.6, c), back(0.46, TI, 0.75, c), back(0.42, GR, 0.95, c), ell(c, [0.36, 0.36, 0.2], ANT, 0.3), ell([c[0] - 0.18, c[1] - 0.2, 0], [0.16, 0.12, 0.12], GR), ell([c[0] - 0.12, c[1] - 0.12, 0.07], [0.07, 0.07, 0.07], OOC)], { anchor: [c[0] + 0.3, c[1] + 0.35, 0] });

        c = E(12, 0.93);
        const ovum = [c[0] + 0.62, c[1] + 0.25, 0.25];
        const zpOv = shell(0.1, [1, 1, 1], ZP, 0.5, 0, Math.PI * 2); zpOv.position.set(...ovum);
        const OVL = [back(0.38, TE, 0.6, c), back(0.34, GR, 0.9, c), ell(ovum, [0.08, 0.08, 0.08], OOC), zpOv];
        for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; OVL.push(ell([ovum[0] + Math.cos(a) * 0.14, ovum[1] + Math.sin(a) * 0.14, ovum[2]], [0.03, 0.03, 0.03], GR)); }
        reg(G3, '⑥ 排卵（濾泡破裂）', 'Ovulation', 'LH 高峰後破裂釋出含透明帶與放射冠之卵團。', OVL, { anchor: ovum });
        c = E(-22, 0.8);
        reg(G3, '⑦ 血體', 'Corpus hemorrhagicum', '排卵後充滿血液凝塊之早期腔室（豬之血體顯著較牛羊大）。', [back(0.3, GR, 0.9, c), ell(c, [0.24, 0.24, 0.12], 0x8a1020)], { anchor: c });
        c = E(-52, 0.82);
        const CL = [ell(c, [0.42, 0.42, 0.25], 0xf2a51a)];
        for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; CL.push(tube([[c[0], c[1], 0.26], [c[0] + Math.cos(a) * 0.38, c[1] + Math.sin(a) * 0.38, 0.1]], 0.012, 0xc0503a)); }
        reg(G3, '⑧ 黃體', 'Corpus luteum', '大黃體細胞源自粒性細胞、小黃體細胞源自膜細胞，分泌 P₄（牛馬含葉黃素呈黃色；豬綿羊呈肉色）。', CL, { anchor: [c[0] + 0.3, c[1] - 0.25, 0.2] });
        c = E(-122, 0.78);
        const caG = new THREE.SphereGeometry(0.2, 24, 16), pa = caG.attributes.position, rq = rnd(3);
        for (let i = 0; i < pa.count; i++) { const k = 0.8 + rq() * 0.35; pa.setXYZ(i, pa.getX(i) * k, pa.getY(i) * k, pa.getZ(i) * k * 0.6); }
        caG.computeVertexNormals(); const ca = new THREE.Mesh(caG, mat(0xf2f0ea)); ca.position.set(...c);
        reg(G3, '⑨ 白體', 'Corpus albicans', '溶黃體後纖維母細胞與巨噬細胞侵入形成白色緻密瘢痕結節。', ca, { anchor: c });
        c = E(-152, 0.72);
        const atG = new THREE.SphereGeometry(0.2, 32, 20), pb = atG.attributes.position;
        for (let i = 0; i < pb.count; i++) { const x = pb.getX(i), y = pb.getY(i), z = pb.getZ(i), k = 1 + 0.15 * Math.sin(x * 40) * Math.cos(y * 40); pb.setXYZ(i, x * k, y * k, z * k); }
        atG.computeVertexNormals(); const at = new THREE.Mesh(atG, mat(0xe8e0b8, 0.6)); at.position.set(...c);
        reg(G2, '⑩ 閉鎖濾泡', 'Atretic follicle', '卵母細胞自溶、透明帶皺褶、顆粒細胞凋亡，基膜增厚成玻璃狀膜。', [at, ell(c, [0.07, 0.06, 0.06], 0xb8a060)], { anchor: c });
        reg(G2, '無卵濾泡／黃體化濾泡', 'Anovular / luteinizing follicle', '鳥類無濾泡腔亦不形成黃體；哺乳類未破裂先黃體化亦見於少數情況。',
          [back(0.14, GR, 0.9, E(-178, 0.76)), ell(E(-178, 0.76), [0.1, 0.1, 0.05], 0xf5c060, 0.8)], { anchor: E(-178, 0.76) });

        const D = [4.3, 0.3, 0], dz = (x, y, z) => [D[0] + x, D[1] + y, D[2] + z];
        const flatR = (ro, ri, col) => { const m = annulus(ro, ri, 0.02, col); m.position.set(D[0], D[1], -0.01); return m; };
        reg(G4, '濾泡外膜', 'Theca externa', '最外層結締組織支持層。', [back(1.6, TE, 0.55, D), flatR(1.6, 1.46, TE)], { anchor: dz(-1.25, 1.0, 0) });
        const CAP = [], rc = rnd(11);
        for (let k = 0; k < 9; k++) {
          const th = 0.4 + rc() * 2.3, ph0 = Math.PI + rc() * 0.3, pts = [];
          for (let i = 0; i <= 20; i++) { const ph = ph0 + i / 20 * (Math.PI - 0.6); pts.push(dz(1.47 * Math.sin(th) * Math.cos(ph), 1.47 * Math.cos(th), 1.47 * Math.sin(th) * Math.sin(ph))); }
          CAP.push(tube(pts, 0.012, 0xd02828));
        }
        reg(G4, '微血管網', 'Capillary network', '位於濾泡內、外膜間（次級濾泡起出現，供應營養與運送類固醇）。', CAP, { anchor: dz(0.9, 1.15, -0.4) });
        reg(G4, '濾泡內膜', 'Theca interna', '表現 LH 受體製造雄性素前驅物；排卵後形成小型黃體細胞。', [back(1.46, TI, 0.75, D), flatR(1.46, 1.37, TI)], { anchor: dz(1.3, 0.6, 0) });
        reg(G4, '基底膜', 'Basement membrane', '阻隔血管進入顆粒層。', [back(1.37, 0xffffff, 0.5, D), flatR(1.37, 1.34, 0xffffff)], { anchor: dz(1.25, -0.55, 0) });
        reg(G4, '粒性細胞層', 'Membrana granulosa', '無血管；具 FSH-R 轉雄性素為 E₂（排卵後形成大型黃體細胞）。', [back(1.34, GR, 0.95, D), flatR(1.34, 1.12, GR)], { anchor: dz(-1.1, -0.65, 0) });
        reg(G4, '濾泡腔（濾泡液）', 'Antrum (liquor folliculi)', '富含玻尿酸與 E₂ 之清澈腔液。', ell(D, [1.1, 1.1, 0.6], ANT, 0.18), { anchor: dz(0.35, 0.45, 0) });
        reg(G4, '卵丘', 'Cumulus oophorus', '包圍卵母細胞向腔突出的顆粒細胞群。', ell(dz(-0.6, -0.65, -0.2), [0.6, 0.45, 0.4], 0xf5cd7a), { anchor: dz(-0.75, -0.8, 0.1) });
        const COR = [];
        for (let k = 0; k < 22; k++) { const a = k / 22 * Math.PI * 2; COR.push(ell(dz(-0.45 + Math.cos(a) * 0.34, -0.38 + Math.sin(a) * 0.34, 0.12), [0.06, 0.05, 0.05], 0xf7b84a)); }
        reg(G4, '放射冠', 'Corona radiata', '貼附透明帶呈放射排列隨卵排出的顆粒細胞層。', COR, { anchor: dz(-0.45, -0.02, 0.12) });
        reg(G4, '透明帶', 'Zona pellucida', '初級濾泡起形成之醣蛋白被殼。', ell(dz(-0.45, -0.38, 0.12), [0.27, 0.27, 0.27], ZP, 0.45), { anchor: dz(-0.2, -0.38, 0.3) });
        reg(G4, '卵母細胞', 'Oocyte', '濾泡腔形成時已達成熟終體積。', ell(dz(-0.45, -0.38, 0.12), [0.2, 0.2, 0.2], OOC), { anchor: dz(-0.45, -0.38, 0.32) });
        textSprite('格蕾斐濾泡（剖面放大）', dz(0, 2.0, 0), 0.38);

        const Y = -2.75;
        reg(G5, '牛、綿羊：杏仁形', 'Cow / ewe: almond-shaped', '牛羊卵巢呈杏仁形，黃體常以冠（crown）狀突向表面。',
          [blob([-2.9, Y, 0], [0.55, 0.32, 0.3], 0xeee0d2, 1, { amp: 0.06, freq: 3, seed: 3 }), blob([-2.6, Y + 0.25, 0.08], [0.2, 0.2, 0.18], 0xe8901c, 1, { amp: 0.1, freq: 4 }), ell([-3.15, Y + 0.12, 0.18], [0.14, 0.14, 0.14], 0xd2e4ec, 0.6)], { anchor: [-2.9, Y - 0.3, 0.2] });
        reg(G5, '馬：豆形（排卵窩）', 'Mare: bean-shaped (ovulation fossa)', '馬卵巢腹緣具排卵窩，所有排卵僅能由此凹痕發生，皮質內陷且黃體埋置內部。',
          [blob([-0.6, Y, 0], [0.75, 0.45, 0.38], 0xeadbd0, 1, { amp: 0.05, freq: 2.5, seed: 8 }), ell([-0.6, Y - 0.38, 0.05], [0.22, 0.12, 0.25], 0x6a4040)], { anchor: [-0.6, Y - 0.45, 0.2] });
        const SOW = [], rs = rnd(21);
        for (let k = 0; k < 16; k++) SOW.push(k % 3 === 0 ? blob([1.8 + (rs() - 0.5) * 0.9, Y + (rs() - 0.5) * 0.6, (rs() - 0.5) * 0.5], [0.15, 0.15, 0.15], 0xd77a6a, 1, { amp: 0.1, seed: k }) : ell([1.8 + (rs() - 0.5) * 0.9, Y + (rs() - 0.5) * 0.6, (rs() - 0.5) * 0.5], [0.15, 0.15, 0.15], 0xcfe2ec, 0.7));
        SOW.forEach(m => { if (m.material.opacity < 1) m.material.map = TEX.vnet; });
        reg(G5, '豬：葡萄串狀', 'Sow: cluster of grapes', '每次 10–25 顆多排卵使豬卵巢布滿凸起濾泡與大型血體/黃體如葡萄串。', SOW, { anchor: [1.8, Y - 0.35, 0.2] });
      }
    });
  })();

  /* ===== 場景⑥：鳥類（母雞）生殖系統與 24h 蛋形成動畫（整合比較大體解剖） ===== */
  (function () {
    const { TEX, ell, blob, tube, ttube, ribbon, lathe, surfVessels, cyl, shell, ring, fbm3 } = ANAT;
    SCENES.push({
      name: '⑥ 雌禽(母雞)與造蛋',
      title: '鳥類雌性生殖系統（產蛋母雞左側觀、排卵階層 F1–F6 與 24h 造蛋）',
      camera: { pos: [-0.6, 1.2, 9.5], target: [-0.6, 0.0, 0], fit: [3.6, 2.3] },
      controls: [
        { label: '▶ 蛋的形成動畫（排卵→產蛋）', fn() { window._eggPlay && window._eggPlay(); } },
        { label: '🦅 切換：奇異鳥／鷹類（兩側卵巢有功能）', fn() { window._bothOv && window._bothOv(); } },
        { label: '🔍 全貌復位', fn() { flyHome(); } },
        { label: '🔍 卵巢濾泡階層', fn() { flyTo([1.8, 0.5, 4.2], [1.8, 0.3, 0.3]); } },
        { label: '🔍 殼腺～泄殖腔', fn() { flyTo([-2.8, 0.2, 4], [-2.8, -0.1, 0.2]); } },
        { label: '🔍 背側觀（右側退化）', fn() { flyTo([-0.6, 8.5, 1.5], [-0.6, 0, 0]); } }
      ],
      desc: `
<p><b>大部分鳥類僅發育左側卵巢與左側輸卵管</b>，右側胚胎期退化（少數如奇異鳥 kiwi 與鷹類具兩側卵巢但常僅左管有效）。鳥類濾泡<b>無濾泡腔、不形成黃體</b>！</p>
<table>
  <tr><th>輸卵管分區</th><th>長度／時間</th><th>核心功能</th></tr>
  <tr><td>漏斗部 Infundibulum</td><td>15–30 分</td><td><b>受精處所</b>＋繫帶濃蛋白</td></tr>
  <tr><td>蛋白分泌部 Magnum</td><td>32–34 cm / ~3h</td><td>分泌 <b>80% 以上卵白</b></td></tr>
  <tr><td>峽部 Isthmus</td><td>~10 cm / ~1.5h</td><td>分泌內外蛋殼膜</td></tr>
  <tr><td>殼腺 Shell gland</td><td>~11 cm / ~20h</td><td>膨脹加水(15 g)＋<b>鈣化蛋殼</b>＋色素</td></tr>
  <tr><td>子宮陰道精子儲存細管</td><td>25,000 條</td><td>配種一次可受精產蛋達 <b>2–4 週</b></td></tr>
</table>
<p class="src">雷弟生物學 3D 比較解剖整合（勾選右側「透視模式」可直接透視殼腺內正在鈣化中的蛋）</p>`,
      build() {
        const G1 = '卵巢（左側）', G2 = '輸卵管（左側）', G3 = '退化的右側', G4 = '泄殖腔與鄰近器官';
        const YK = 0xf5c400, OV = [1.7, 0.6, 0.15], OVa = V(...OV);

        reg(G1, '卵巢基質', 'Ovarian stroma', '藉卵巢系膜附著體壁，嵌入無濾泡腔之黃色卵黃濾泡階層。',
          [ell(OV, [0.38, 0.26, 0.24], 0xf0dcc0), ribbon([[OV[0] - 0.3, OV[1] + 0.2, OV[2] - 0.1], [OV[0] + 0.3, OV[1] + 0.2, OV[2] - 0.1]], [[OV[0] - 0.4, OV[1] + 0.55, -0.05], [OV[0] + 0.4, OV[1] + 0.55, -0.05]], 0x9be0b0, 0.35)],
          { anchor: [OV[0], OV[1] + 0.3, OV[2] + 0.1] });
        const HF = [['F1', 0.36, [0.45, -1, 0.65]], ['F2', 0.31, [-0.7, -1, 0.55]], ['F3', 0.27, [1, 0.15, 0.8]], ['F4', 0.23, [-1, 0.35, 0.75]], ['F5', 0.19, [0.25, 0.9, 0.9]], ['F6', 0.16, [-0.25, -0.2, 1]]];
        const FP = {};
        HF.forEach(([n, r, d]) => {
          const dir = V(...d).normalize(), c = OVa.clone().addScaledVector(dir, 0.22 + r + 0.06);
          FP[n] = { c, r };
          const ms = [ell(c.toArray(), [r, r, r], YK), cyl(OVa.clone().addScaledVector(dir, 0.2).toArray(), c.clone().addScaledVector(dir, -r * 0.9).toArray(), 0.035, 0xf0c8a0)];
          const rr = rnd(n.charCodeAt(1));
          for (let k = 0; k < 4; k++) {
            const pts = [], ax = V(rr() - 0.5, rr() - 0.5, rr() - 0.5).normalize(), b = V(0, 1, 0).cross(ax).normalize();
            for (let i = 0; i <= 14; i++) { const a = i / 14 * 2.2 + k; pts.push(c.clone().addScaledVector(ax, Math.cos(a) * r * 1.01).addScaledVector(b, Math.sin(a) * r * 1.01)); }
            ms.push(tube(pts, 0.006, 0xc03020));
          }
          ms[0].material.map = TEX.vnet;
          const info = n === 'F1' ? '最大、下一個將破裂排卵的優勢黃卵黃濾泡。' : '黃卵黃濾泡階層之一（肝臟合成卵黃前驅物運入，無濾泡腔）。';
          reg(G1, '高階濾泡 ' + n, 'Hierarchical yellow follicle ' + n, info, ms, { anchor: c.clone().addScaledVector(dir, r * 0.5).toArray() });
        });
        const f1 = FP.F1, sg = new THREE.TorusGeometry(f1.r * 1.01, 0.022, 8, 24, 1.6); sg.rotateZ(-0.8);
        const stig = new THREE.Mesh(sg, ANAT.mat(0xfff6c8)); stig.position.copy(f1.c); stig.rotation.y = -Math.PI / 2 + 0.5;
        reg(G1, '泡裂徑', 'Stigma', '大濾泡壁缺乏血管之淺色無血裂帶（對應人類 Ch.8 排卵口 stigma）。', stig, { anchor: f1.c.clone().add(V(0.2, 0.2, f1.r)).toArray() });
        const SY = [], LW = [], SW = [], rs = rnd(91);
        const onOv = r => { const d = V(rs() - 0.5, rs() - 0.5, rs() * 0.8 + 0.1).normalize(); return OVa.clone().add(V(d.x * 0.38, d.y * 0.26, d.z * 0.24)).addScaledVector(d, r * 0.5).toArray(); };
        for (let k = 0; k < 7; k++) SY.push(ell(onOv(0.07), [0.07, 0.07, 0.07], 0xf7d84a));
        for (let k = 0; k < 12; k++) LW.push(ell(onOv(0.035), [0.035, 0.035, 0.035], 0xf8f4ea));
        for (let k = 0; k < 26; k++) SW.push(ell(onOv(0.015), [0.016, 0.016, 0.016], 0xffffff));
        reg(G1, '小黃濾泡（5–10 mm）', 'Small yellow follicles', '依序補充進入 F1–F6 階層庫。', SY, { anchor: SY[0].position.toArray() });
        reg(G1, '大白濾泡（2–4 mm）', 'Large white follicles', '含白色卵黃之中小型濾泡。', LW, { anchor: LW[0].position.toArray() });
        reg(G1, '小白濾泡（<1 mm）', 'Small white follicles', '濾泡閉鎖主要發生於此類數千顆小濾泡。', SW, { anchor: SW[0].position.toArray() });
        const pof = new THREE.Mesh(new THREE.SphereGeometry(0.15, 24, 16, 0, Math.PI * 2, 0.9, Math.PI - 0.9), ANAT.mat(0xe8a0a0, 0.9));
        pof.position.set(OV[0] - 0.3, OV[1] + 0.35, OV[2] + 0.35); pof.rotation.x = -0.6;
        reg(G1, '排卵後濾泡', 'Postovulatory follicle', '排卵後 5 日內凋亡吸收——鳥類不形成黃體！', pof, { anchor: [OV[0] - 0.3, OV[1] + 0.45, OV[2] + 0.4] });
        const atG = new THREE.SphereGeometry(0.08, 20, 14), pa = atG.attributes.position;
        for (let i = 0; i < pa.count; i++) { const k = 1 + 0.2 * Math.sin(pa.getX(i) * 90) * Math.cos(pa.getY(i) * 90); pa.setXYZ(i, pa.getX(i) * k, pa.getY(i) * k, pa.getZ(i) * k); }
        atG.computeVertexNormals(); const atr = new THREE.Mesh(atG, ANAT.mat(0xd8c890)); atr.position.set(OV[0] + 0.35, OV[1] + 0.3, OV[2] + 0.25);
        reg(G1, '閉鎖濾泡', 'Atretic follicle', '多見於小濾泡；遇逆境突然停產時高階濾泡亦會退化閉鎖。', atr);
        reg(G1, '濾泡壁層次（說明）', 'Follicle wall layers', '內而外：卵黃周層 → 顆粒細胞 → 基底膜 → 濾泡內膜 → 濾泡外膜（具血管）。',
          (() => { const g = []; const c = FP.F2.c, r = FP.F2.r; [[1.0, 0xfff3b0], [1.04, 0xf2c36b], [1.08, 0xe0956a], [1.12, 0xc77a6a]].forEach(([k, col]) => { const m = shell(r * k, [1, 1, 1], col, 0.9, Math.PI * 0.35, Math.PI * 0.3, 0.6, 0.9); m.position.copy(c); g.push(m); }); return g; })(),
          { anchor: FP.F2.c.clone().add(V(0, -0.2, FP.F2.r)).toArray() });

        const inf = V(1.25, -0.55, 0.55), infDir = f1.c.clone().sub(inf).normalize();
        const FIM = [], q = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), infDir);
        for (let k = 0; k < 12; k++) {
          const a = k / 12 * Math.PI * 2, rim = V(Math.cos(a) * 0.3, 0.3, Math.sin(a) * 0.3).applyQuaternion(q).add(inf);
          const tip = V(Math.cos(a) * 0.4, 0.42, Math.sin(a) * 0.4).applyQuaternion(q).add(inf);
          FIM.push(ttube([rim, rim.clone().lerp(tip, 0.5).add(V(0, 0.03 * Math.sin(k * 2.3), 0.03 * Math.cos(k * 1.7))), tip], [0.028, 0.01], 0xf2b4a6, 1, { wob: 0.2, seed: k }));
        }
        reg(G2, '漏斗部：繖部', 'Infundibulum – fimbriated part', '吞噬卵黃並為鳥類受精場所。',
          [lathe([[0.07, 0], [0.12, 0.1], [0.22, 0.22], [0.3, 0.3]], 0xf7c8b0, 0.6, inf.toArray(), infDir.toArray()), ...FIM],
          { anchor: inf.clone().addScaledVector(infDir, 0.3).add(V(0, 0, 0.3)).toArray() });
        const neck = [inf.toArray(), [1.15, -0.8, 0.55], [1.0, -0.9, 0.55]];
        reg(G2, '漏斗部：管狀部', 'Infundibulum – tubular part', '分泌圍繞卵黃之濃稠蛋白繫帶層。', tube(neck, 0.09, 0xf5d8c0), { anchor: [1.12, -0.85, 0.65] });
        const mBase = new THREE.CatmullRomCurve3(PV([[1.0, -0.9, 0.55], [0.3, -1.0, 0.6], [-0.4, -0.95, 0.6], [-0.95, -0.7, 0.55]]));
        const mFr = mBase.computeFrenetFrames(360, false), magPts = [];
        for (let i = 0; i <= 360; i++) {
          const t = i / 360, e = Math.sin(Math.PI * t);
          const dy = e * (0.24 * Math.sin(t * 29) + 0.12 * fbm3(t * 7, 1, 2)), dz = e * (0.26 * Math.cos(t * 17 + 0.7) + 0.12 * fbm3(t * 7, 5, 1));
          magPts.push(mBase.getPointAt(t).addScaledVector(mFr.normals[i], dy).addScaledVector(mFr.binormals[i], dz));
        }
        magPts[0] = V(1.0, -0.9, 0.55); magPts[magPts.length - 1] = V(-0.95, -0.7, 0.55);
        reg(G2, '蛋白分泌部', 'Magnum (32–34 cm)', '高度盤曲厚壁管狀腺分泌 80% 以上卵白。', (() => { const m = ttube(magPts, 0.13, 0xf3ece4, 1, { wob: 0.06, seg: 700, radial: 18 }); return [m, ...surfVessels(m, { side: V(0, 1, 0), count: 26, spread: 1.6, vr: 0.006, seed: 5 })]; })(), { anchor: [0.1, -1.15, 0.9] });
        reg(G2, '峽部透明區', 'Translucent zone', '不含管狀腺之分隔透明環。', ring(V(-0.97, -0.69, 0.55), V(-1, 0.35, 0), 0.13, 0.04, 0xd8f0ff, 0.8), { anchor: [-0.97, -0.55, 0.65] });
        const isth = [[-0.98, -0.68, 0.55], [-1.3, -0.5, 0.5], [-1.62, -0.38, 0.45]];
        reg(G2, '峽部', 'Isthmus (~10 cm)', '分泌形成內外蛋殼膜，遠端啟動鈣化核成核。', ttube(isth, 0.11, 0xe8c8a8), { anchor: [-1.3, -0.35, 0.55] });
        const SGc = [-2.15, -0.38, 0.42];
        reg(G2, '殼腺（子宮）', 'Shell gland (uterus)', '停留 ~20h：膨脹加水約 15 g 並沉積碳酸鈣蛋殼與色素（勾選「透視模式」可透視內部蛋）。', blob(SGc, [0.58, 0.44, 0.42], 0xd48c8c, 0.4, { amp: 0.05 }), { anchor: [-2.15, 0.08, 0.42], wall: true, wallO: 0.72 });
        const eggP = reg(G2, '蛋（殼腺內）', 'Egg in shell gland', '殼腺中完成鈣化之雞蛋。', [ell(SGc, [0.4, 0.29, 0.29], 0xd9a066)], { anchor: [SGc[0] - 0.2, SGc[1] - 0.15, SGc[2] + 0.3], inner: true });
        const UVJ = V(-2.74, -0.28, 0.38);
        const SST = [ring(UVJ, V(1, 0.1, 0), 0.11, 0.045, 0xb04060)];
        for (let k = 0; k < 14; k++) { const a = k / 14 * Math.PI * 2; SST.push(tube([UVJ.clone().add(V(0, Math.cos(a) * 0.08, Math.sin(a) * 0.08)), UVJ.clone().add(V(-0.02, Math.cos(a) * 0.17, Math.sin(a) * 0.17))], 0.012, 0x70b8ff)); }
        reg(G2, '子宮陰道括約肌', 'Uterovaginal sphincter', '分隔殼腺與陰道之括約肌。', SST[0], { anchor: [UVJ.x, UVJ.y - 0.18, UVJ.z + 0.1] });
        reg(G2, '精子儲存細管', 'Sperm storage tubules', '約 25,000 個管狀腺，庇護精子使單次受精可持續 2–4 週。', SST.slice(1), { anchor: [UVJ.x, UVJ.y + 0.2, UVJ.z + 0.1] });
        const vagP = [UVJ.toArray(), [-2.92, -0.05, 0.33], [-3.1, -0.28, 0.25], [-3.28, -0.02, 0.15], [-3.45, 0.02, 0.06]];
        reg(G2, '陰道', 'Vagina (~10 cm)', 'S 形肌壁收縮經外翻陰道排出蛋（不接觸糞便）。', tube(vagP, 0.08, 0xe0a0b0), { anchor: [-3.1, -0.4, 0.3] });

        const rOv = reg(G3, '右卵巢（退化）', 'Right ovary (regressed)', '多數鳥類右卵巢於胚胎期退化。', ell([1.7, 0.6, -0.32], [0.16, 0.05, 0.06], 0xbdb5a8), { anchor: [1.7, 0.66, -0.35] });
        reg(G3, '右輸卵管殘跡', 'Vestigial right oviduct', '右側僅餘泄殖腔旁囊狀殘跡。',
          [tube([[-3.45, 0.05, -0.15], [-3.15, 0.1, -0.3], [-2.9, 0.12, -0.35]], 0.04, 0xc8a8b0), ell([-2.85, 0.12, -0.36], [0.08, 0.06, 0.06], 0xc8a8b0, 0.8)], { anchor: [-3.0, 0.15, -0.35] });
        const ROF = [];
        [[0.24, [0.3, -1, -0.6]], [0.2, [-0.6, -0.6, -0.8]], [0.15, [0.6, 0.4, -0.9]], [0.11, [-0.4, 0.5, -1]]].forEach(([r, d]) => {
          const dir = V(...d).normalize(), c = V(1.7, 0.6, -0.4).addScaledVector(dir, 0.2 + r); ROF.push(ell(c.toArray(), [r, r, r], YK));
        });
        ROF.push(ell([1.7, 0.6, -0.4], [0.3, 0.2, 0.18], 0xf0dcc0));
        const rFun = reg(G3, '右卵巢（具功能：奇異鳥、鷹類）', 'Functional right ovary', '少數物種雙側卵巢皆有功能，但多半仍僅左側輸卵管暢通。', ROF, { anchor: [1.7, 0.2, -0.8], hidden: true });
        const dropEgg = ell([1.7, -0.1, -0.7], [0.12, 0.12, 0.12], YK, 0.9);
        const rDrop = reg(G3, '右側排出的卵（落入腹腔）', 'Ovum from right ovary', '右卵落入腹腔再行吸收。', dropEgg, { anchor: [1.7, -0.3, -0.7], hidden: true });

        reg(G4, '泄殖腔', 'Cloaca', '尿道、消化道與生殖道共同腔室。', ell([-3.62, 0.05, 0], [0.36, 0.3, 0.3], 0xb98aa8, 0.4), { anchor: [-3.62, 0.38, 0.1] });
        reg(G4, '泄殖腔口', 'Vent', '產蛋時陰道外翻清潔產出。', ring(V(-3.98, 0.02, 0), V(1, 0, 0), 0.1, 0.035, 0x6a3a50));
        reg(G4, '結腸／直腸', 'Colon / rectum', '開口入糞道。', ttube([[1.2, 0.05, -0.15], [0, 0.15, -0.15], [-2.0, 0.25, -0.1], [-3.4, 0.12, -0.02]], 0.12, 0x7a8a5a, 0.35), { anchor: [-1.0, 0.3, -0.1] });
        reg(G4, '腎臟', 'Kidneys', '背側三葉腎臟。', [1, -1].flatMap(s => [[0.95, 0.42], [0.25, 0.32], [-0.45, 0.4]].map(([x, l], k) => blob([x, 0.95, s * 0.28], [l, 0.17, 0.17], 0x7a3a30, 1, { amp: 0.12, freq: 4, seed: k + s * 5 }))), { anchor: [0.2, 1.1, 0.28] });
        reg(G4, '輸尿管', 'Ureters', '腎臟至尿殖室。', [1, -1].map(s => tube([[-0.9, 0.9, s * 0.28], [-2.5, 0.6, s * 0.2], [-3.45, 0.15, s * 0.05]], 0.016, 0xf3e6a0)), { anchor: [-2.3, 0.62, 0.22] });

        let both = false, dropT = 0;
        window._bothOv = () => { both = !both; rOv.visible = !both; rFun.visible = both; rDrop.visible = both; dropT = 0; rebuildList(); refresh(); select(both ? rFun : rOv); };

        const eggG = new THREE.Group(); CUR.root.add(eggG); eggG.visible = false;
        const yolk = ell([0, 0, 0], [0.14, 0.14, 0.14], YK), alb = ell([0, 0, 0], [1, 1, 1], 0xffffff, 0.35), memb = ell([0, 0, 0], [1, 1, 1], 0xf5f0e0, 0.55), shl = ell([0, 0, 0], [1, 1, 1], 0xd9a066, 1);
        eggG.add(yolk, alb, memb, shl);
        const segs = [
          { n: '排卵', c: new THREE.CatmullRomCurve3([f1.c.clone(), f1.c.clone().lerp(inf, 0.5), inf.clone()]), w: 0.06, t: 'F1 沿<b>泡裂徑</b>破裂被繖部吞入。' },
          { n: '漏斗部', c: new THREE.CatmullRomCurve3(PV(neck)), w: 0.07, t: '漏斗部（15–30 分）：受精＋分泌濃稠繫帶蛋白。' },
          { n: '蛋白分泌部', c: new THREE.CatmullRomCurve3(magPts), w: 0.3, t: '蛋白分泌部（~3h）：分泌 80% 以上卵白。' },
          { n: '峽部', c: new THREE.CatmullRomCurve3(PV(isth)), w: 0.12, t: '峽部（~1.5h）：沉積內外蛋殼膜。' },
          { n: '殼腺', c: new THREE.CatmullRomCurve3([V(...isth[2]), V(...SGc), V(...SGc).add(V(-0.25, 0.02, 0)), UVJ.clone()]), w: 0.35, t: '殼腺（~20h）：加水膨脹並鈣化蛋殼與沉積色素。' },
          { n: '陰道', c: new THREE.CatmullRomCurve3(PV([...vagP, [-3.95, 0.02, 0.0], [-4.4, -0.1, 0.0]])), w: 0.1, t: '陰道（數分）：外翻產出乾淨蛋殼！' }
        ];
        let playing = false, t0 = 0, lastSeg = -1; const DUR = 22000;
        window._eggPlay = () => { playing = true; t0 = performance.now(); lastSeg = -1; eggG.visible = true; eggP.visible = false; rebuildList(); refresh(); };
        CUR.tick = dtS => {
          if (both && rDrop.visible) {
            dropT = (dropT + (dtS || 0.016) * 0.36) % 1;
            dropEgg.position.y = -0.1 - dropT * 1.3;
            dropEgg.material.opacity = 0.9 * (1 - dropT);
            dropEgg.scale.setScalar(0.12 * (1 - dropT * 0.6));
          }
          if (!playing) return;
          const u = (performance.now() - t0) / DUR;
          if (u >= 1) { playing = false; eggG.visible = false; eggP.visible = true; rebuildList(); refresh(); $('info').insertAdjacentHTML('afterbegin', '<div class="g" style="background:#2f7f3f">✅ 產蛋完成（全程約 24–26 小時）</div>'); return; }
          let acc = 0, i = 0; while (i < segs.length - 1 && u > acc + segs[i].w) { acc += segs[i].w; i++; }
          const k = Math.min(1, (u - acc) / segs[i].w), S = segs[i];
          eggG.position.copy(S.c.getPointAt(k));
          const albK = i < 2 ? 0 : i === 2 ? k : 1, memK = i < 3 ? 0 : i === 3 ? k : 1, shK = i < 4 ? 0 : i === 4 ? Math.max(0, (k - 0.3) / 0.6) : 1;
          alb.visible = albK > 0; alb.scale.set(0.14 + 0.24 * albK, 0.14 + 0.15 * albK, 0.14 + 0.15 * albK);
          memb.visible = memK > 0; memb.scale.set(0.39, 0.3, 0.3); memb.material.opacity = 0.55 * memK;
          shl.visible = shK > 0; shl.scale.set(0.41, 0.31, 0.31); shl.material.opacity = Math.min(1, shK); shl.material.transparent = shK < 1;
          if (i !== lastSeg) { lastSeg = i; $('info').innerHTML = `<h3>🥚 ${S.n}</h3><div class="en">Egg formation ${i + 1}/${segs.length}</div><div class="t">${S.t}</div>`; }
        };
      }
    });
  })();
})();
