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
      const bv = cyl([-6.5, 4.4, 0], [6.5, 4.4, 0], 0.36, 0xd83a3a, 0.85);
      const theca = box([0, 2.2, 0], [11.5, 2.8, 2.8], 0xd88a4a, 0.25);
      const bm = box([0, 0.2, 0], [12.0, 0.28, 3.0], 0xf0e0c0, 0.85);
      const gran = box([0, -2.3, 0], [11.5, 3.6, 2.8], 0xf4a0c0, 0.25);
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
        const sp1 = [ell([0.8, 0.9, 0.5], [0.18, 0.45, 0.18], 0xff5080), ell([1.15, 0.9, 0.5], [0.18, 0.45, 0.18], 0x40a0ff)];
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
})();
