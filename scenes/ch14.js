/* Ch.14：胎兒生長/棕色脂肪/羊水循環、胎盤五型運輸、雙重波爾效應與膽紅素排除 */
(function () {
  /* ===== 場景①：胎兒生長、5區棕色脂肪、羊水動力循環（Figs 14.1–14.2, Box 14.1） ===== */
  let S1 = null, WK1 = 32, AF_MODE = 'norm'; // norm | potter | atresia
  const AF_INFO = {
    norm: '正常羊水循環（每 3 小時完全更新水分！）：腎臟排尿 26 ml/h (40w) + 肺泡液分泌 ↔ 胎兒吞嚥 120 ml/h (28w) + 羊膜雙向交換（Box 14.1）。',
    potter: '<b>腎發育不全（Potter’s syndrome）：</b>缺乏中後期最重要的胎尿輸入來源 → 嚴重<b>羊水過少（Oligohydramnios）</b>。',
    atresia: '<b>食道閉鎖／無腦兒：</b>無法進行正常的羊水吞嚥清除（原本高達 120 ml/h）→ 液體累積成<b>羊水過多（Polyhydramnios）</b>。'
  };
  SCENES.push({
    name: '① 胎兒生長與羊水/棕脂',
    title: '30–36w 生長峰、5區棕色脂肪生熱與羊水動力循環（Figs 14.1–14.2, Box 14.1）',
    camera: { pos: [0, 0.8, 19], target: [0, 0, 0], fit: [9.8, 6.2] },
    controls: [{ label: '🔍 羊膜腔與胎兒全覽', fn() { flyHome(); } }],
    desc: `
<p>進入第二、三孕期，胎兒轉入爆發性生長與器官功能儲備（例如為出生斷臍後的低溫與斷奶期準備好<b>棕色脂肪</b>與<b>肝臟肝醣</b>）（Ch.14 p.246–248, 251–252, Figs 14.1–14.2, Box 14.1）。</p>
<details open><summary>三個極易考的生理數字與解剖位置</summary><ul>
<li><b>30–36 週</b>：胎兒生長速度頂峰；第 32 週後轉為「細胞肥大（cell size）」為主；35 週蛋白達 300g 峰；38 週脂肪超越蛋白質。</li>
<li><b>棕色脂肪 5 大熱庫</b>：肩胛間菱形、頸血管周、腋下、縱隔、腎與腎上腺周（非顫抖性生熱！）。</li>
<li><b>羊水週轉</b>：每 <b>3 小時</b>水分全換一次；20w 450ml（34w 停止淨增加）；尿液 26 ml/h vs 吞嚥 120 ml/h。</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.14 p.246–252（Figs 14.1–14.2, Box 14.1, Table 14.2）</p>`,
    build() {
      S1 = { t: 0, play: true };
      const AM = '羊膜囊與羊水容量狀態', FT = '發育胎兒與 IGF1/IGF2 控制', BF = '五大棕色脂肪非顫抖生熱庫';
      const u = clamp((WK1 - 8) / 32, 0.05, 1.0);
      const amScale = AF_MODE === 'potter' ? 0.72 : (AF_MODE === 'atresia' ? 1.24 : 1.0);
      const amS = (2.6 + 1.45 * u) * amScale;
      const amnion = shell(1, [amS * 1.15, amS, amS * 0.9], AF_MODE === 'norm' ? 0x70d8ff : (AF_MODE === 'potter' ? 0xff7070 : 0x50ffa0), AF_MODE === 'atresia' ? 0.34 : 0.22, 0.5, Math.PI * 1.65);
      const plac = ell([-3.8, 2.8, -0.5], [1.6, 1.2, 1.0], 0xd83050, 0.9);
      const cord = ttube([V(-3.2, 2.3, 0), V(-1.6, 1.1, 0.5), V(0.1, -0.5, 0.5)], [0.22, 0.16], 0x45c49e, 0.92, { organic: false });
      reg(AM, AF_MODE === 'norm' ? `第 ${WK1} 週正常羊膜腔（約 ${WK1 < 20 ? Math.round(15 + (WK1 - 8) * 36) : 450} ml）` : (AF_MODE === 'potter' ? '羊水過少（腎缺損無胎尿）' : '羊水過多（食道閉鎖無吞嚥）'), 'Amniotic sac & fluid',
        AF_INFO[AF_MODE], [amnion, plac, cord], { anchor: [-4.6, 3.8, 0.8] });

      // 簡易解剖位置精確的捲曲胎兒模型（頭在下或頭上，採坐立微捲曲便於標出 5 區棕色脂肪）
      const fSc = 0.45 + 0.65 * u;
      const head = ell([0.1, 1.6 * fSc, 0.1], [0.95 * fSc, 1.05 * fSc, 0.9 * fSc], 0xf2b8a0, 0.88);
      const torso = ell([0, -0.15 * fSc, 0], [0.9 * fSc, 1.35 * fSc, 0.78 * fSc], 0xf2b8a0, 0.85);
      const subFat = WK1 >= 34 ? ell([0, -0.15 * fSc, 0], [1.05 * fSc, 1.45 * fSc, 0.9 * fSc], 0xffe898, 0.35) : null;
      const fMs = [head, torso]; if (subFat) fMs.push(subFat);
      reg(FT, `胎兒（約 ${(0.1 + 3.3 * Math.pow(u, 2.2)).toFixed(1)} kg${WK1 >= 38 ? '・脂肪已多於蛋白！' : ''}）`, 'Fetus & Growth axis',
        '<b>胎兒 IGF1</b> 感測血糖與胰島素直接促進生長（不靠垂體 GH！）；<b>IGF2</b> 刺激胎盤。足月時心臟高肝醣抗缺氧，大腦零肝醣極依賴血糖。',
        fMs, { anchor: [2.8, 1.8, 0.8] });

      // 五區棕色脂肪！
      const bfPts = [
        [0, 0.55 * fSc, -0.68 * fSc], // 1. 肩胛間菱形
        [-0.38 * fSc, 0.95 * fSc, 0.28 * fSc], [0.38 * fSc, 0.95 * fSc, 0.28 * fSc], // 2. 頸血管周
        [-0.85 * fSc, 0.55 * fSc, 0.1 * fSc], [0.85 * fSc, 0.55 * fSc, 0.1 * fSc], // 3. 腋下
        [0.05 * fSc, 0.42 * fSc, 0.48 * fSc], // 4. 縱隔
        [-0.45 * fSc, -0.65 * fSc, -0.3 * fSc], [0.45 * fSc, -0.65 * fSc, -0.3 * fSc] // 5. 腎/腎上腺周
      ];
      const bfMs = bfPts.map((p, i) => ell(p, [i === 0 ? 0.38 * fSc : 0.22 * fSc, 0.22 * fSc, 0.18 * fSc], 0xa0522d, 0.96));
      reg(BF, '5 處棕色脂肪熱庫（肩胛・頸・腋・縱隔・腎周）', 'Brown adipose tissue (Non-shivering thermogenesis)',
        '富含多房脂滴與大量粒線體，透過非顫抖性生熱在出生瞬間保護新生兒避免失溫（Ch.14 p.252）。',
        bfMs, { anchor: [2.9, -1.3, 0.9] });

      // 羊水吞嚥 vs 尿液進出流箭頭
      const cSwallow = arcArrow([[2.4, 2.0, 0.5], [0.8, 1.4, 0.7], [0.2, 0.2, 0.7]], 0x70e8ff, 0.05);
      const cUrine = arcArrow([[0.1, -1.1 * fSc, 0.5], [0.6, -2.1 * fSc, 0.5], [2.0, -2.5, 0.5]], 0xffd43a, 0.05);
      addRoot([...cSwallow, ...cUrine]);
      S1.fSw = flowOn(cSwallow.curve, 8, 0.09, 0x70e8ff, 0x103040, AF_MODE === 'atresia' ? 0.02 : 0.3, 0.03);
      S1.fUr = flowOn(cUrine.curve, 8, 0.09, 0xffd43a, 0x403000, AF_MODE === 'potter' ? 0.02 : 0.28, 0.03);
      CUR.root.add(S1.fSw, S1.fUr);

      textSprite(`懷孕第 ${WK1} 週（羊水循環模式：${AF_MODE === 'norm' ? '平衡' : AF_MODE === 'potter' ? '少羊水' : '多羊水'}）`, [0, 5.0, 0], 0.35, '#ffd479');

      const dt = dtClock();
      CUR.tick = () => {
        const d = S1.play ? dt() : 0; S1.t += d;
        S1.fSw.run(d); S1.fUr.run(d);
        CUR.root.rotation.y = Math.sin(S1.t * 0.4) * 0.16;
      };
    },
    panel(box) {
      slider(box, '妊娠週數 (Week 8 → 40)', 8, 40, WK1, 2, v => { WK1 = v; reloadKeep(); });
      seg(box, '羊水循環病理（Box 14.1）', [['norm', '正常平衡'], ['potter', '腎缺損(少)'], ['atresia', '食道閉鎖(多)']], AF_MODE, v => { AF_MODE = v; reloadKeep(); });
      const cv = mkCanvas(box, 290, 152);
      plot(cv, {
        title: 'Fig 14.2a 產前→產後體重增加速率 (kg/year)',
        x: [12, 48], y: [0, 6], xt: [12, 20, 32, 40, 48], xl: '週齡（40w = 出生，30–36w 達高峰）',
        vl: [{ x: 40, col: '#ff7070', label: '出生(40w)', ly: 12 }, { x: WK1, col: '#ffffff', label: '現在', ly: 24 }],
        series: [{ f: w => w < 40 ? 0.2 + 4.8 * Math.exp(-Math.pow((w - 34) / 7.5, 2)) : (w < 43 ? 2.2 + (w - 40) * 1.1 : 5.5 - (w - 43) * 0.1), col: '#7c8cf8', label: '生長速率 (kg/yr)', w: 2.3 }]
      });
      note(box, AF_INFO[AF_MODE], 'big');
      checkbox(box, '播放循環與轉動', true, v => S1.play = v);
    }
  });

  /* ===== 場景②：胎盤跨膜障壁薄化與 5 型運輸機制（Figs 14.3–14.4） ===== */
  let S2 = null, TERM2 = true, MECH2 = 'glucose';
  const MECH2_DATA = {
    diff: ['1. 簡單擴散（O₂, CO₂, 尿素, 水, 游離固醇）', 'O₂/CO₂ 與脂溶性游離固醇直接跨膜，水與 Na⁺ 兼走細胞旁（paracellular）滲透；<b>胎盤本身耗去 40–60% 全單位 O₂ 與血糖</b>！CO₂ 擴散常數是 O₂ 20 倍（p.248–250）。'],
    glucose: ['2. 促進擴散（D-Glucose 雙側載體＋hPL 母體胰島素阻抗）', '胎兒缺低氧下糖質新生能力！全靠母血濃差經合胞滋養層兩端載體（0.6 mmol/min/g，僅 >20 mmol/L 飽和）；<b>hPL</b> 造成母親對胰島素不敏感（改燒脂肪）將血糖留給胎兒（p.250–252）。'],
    active: ['3. ATP 主動運輸（胺基酸, Fe²⁺, Ca²⁺ 21g）', '<b>P₄ 抑母肝去胺</b>節省氮源並主動泵入胎兒（胎血 AA &gt; 母血）；<b>游離鐵為母體 2–3 倍</b>（300mg）；<b>Mg²⁺-ATPase</b> 鈣泵 80% 於第 3 孕期送入 21 g 鈣（母 PTH 不過胎盤！）。'],
    lcpufa: ['4. 選擇性 LCPUFA 運輸（DHA > AA > ALA > LA）', '由早期貯脂轉向後期 <b>hPL 脂解</b>＋胎盤脂酶與選擇性 FABP 輸送：第 3 孕期胎血 <b>LCPUFA 達母親 2–14 倍</b>專供腦與視網膜生長（p.252–253）。'],
    igg: ['5. 受體胞吞（FcRn 轉運 IgG 免疫球蛋白）', '巨分子中<b>唯獨 IgG</b> 能從第 13 週起單方向穿過人合胞滋養層建立新生兒被動免疫！（鼠兔靠卵黃囊，牛羊豬則全靠產後初乳）']
  };
  SCENES.push({
    name: '② 胎盤 5 型跨膜運輸',
    title: '早/晚期障壁薄化 (10→1–2μm) 與 5 種轉運通路（Figs 14.3–14.4）',
    camera: { pos: [0, 0.8, 19.5], target: [0, 0, 0], fit: [10.4, 6.2] },
    controls: [{ label: '🔍 胎盤屏障剖面全貌', fn() { flyHome(); } }],
    desc: `
<p>人類絨毛發育從早期直徑 150–200 μm、10 μm 厚障壁，演化到足月變細為 40 μm 且胎兒微血管向外頂凹使合胞滋養層薄化至僅 <b>1–2 μm</b>；不同分子依極性與大小採用截然不同的過關策略（Ch.14 p.248–255, Figs 14.3–14.4）。</p>
<details open><summary>不可忽視的五大重點機轉</summary><ul>
<li><b>擴散 vs 主動</b>：非極性氣體看<b>血流量</b>大於厚度；極性 AA、Ca²⁺、Fe 靠幫浦逆濃度濃縮至胎兒側高于母親！</li>
<li><b>母體代謝屈從於胎兒</b>：早期 P₄ 囤母脂、後期 <b>hPL</b> 分解脂肪並創造母親胰島素阻抗留出葡萄糖；P₄ 同時代謝煞車母肝去胺留下胺基酸。</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.14 p.248–255（Figs 14.3–14.4）</p>`,
    build() {
      S2 = { t: 0, play: true };
      const MT = '母體絨毛間隙（高血糖／O₂／AA）', SB = '合胞滋養層屏障（早10μm → 足月1–2μm）', FC = '胎兒微血管內皮（偏心頂貼！）';
      const th = TERM2 ? 0.95 : 2.3; // 障壁幾何厚度對比
      const matB = box([0, 3.6, 0], [10.2, 1.3, 2.6], 0xd83048, 0.72);
      reg(MT, '母體血池（絨毛間隙）', 'Maternal intervillous blood', '含有 90 mmHg O₂、母體血糖、游離脂肪酸（孕後期 hPL 動員）、胺基酸與母體 IgG。', matB, { anchor: [-5.2, 3.7, 0.8] });

      const syncTop = 1.6, syncBot = 1.6 - th;
      const sync = box([0, (syncTop + syncBot) / 2, 0], [10.2, th, 2.5], 0xe56b92, 0.42);
      // 載體蛋白雙側門通道 + 受體胞吞囊泡示意
      const gates = [];
      const gateCol = { diff: 0x90e8ff, glucose: 0xffd43a, active: 0x46d16a, lcpufa: 0xf09a4a, igg: 0xd080ff }[MECH2];
      [-3.0, 0, 3.0].forEach(gx => {
        gates.push(cyl([gx, syncTop + 0.15, 0.6], [gx, syncBot - 0.15, 0.6], MECH2 === 'igg' ? 0.34 : 0.22, gateCol, 0.92));
      });
      reg(SB, TERM2 ? '足月超薄合胞滋養層（僅 1–2 μm！）＋雙極載體' : '懷孕早期厚實滋養層（~10 μm 距離且大量自耗 O₂/糖）', 'Syncytiotrophoblast barrier',
        MECH2_DATA[MECH2][1], [sync, ...gates], { anchor: [5.4, (syncTop + syncBot) / 2, 0.8] });

      // 胎兒微血管（足月頂貼上移縮短距離，早期遠離偏中心）
      const fcY = syncBot - (TERM2 ? 0.6 : 1.6);
      const fetCap = cyl([-5.0, fcY, 0], [5.0, fcY, 0], 0.95, 0x4db8e8, 0.85);
      reg(FC, TERM2 ? '偏心頂貼上移之胎兒微血管（極大化擴散率）' : '早期中央位胎兒微血管', 'Fetal capillary',
        TERM2 ? '終末絨毛縮細為 40 μm 且胎兒微血管頂向滋養層外側，距離縮短為早期的 1/5–1/10！' : '早期終末絨毛直徑 150–200 μm，代謝交換效率受厚距限制。',
        fetCap, { anchor: [-5.2, fcY, 0.8] });

      // 分子穿流箭頭
      const trCurve = new THREE.CatmullRomCurve3([V(0, 3.6, 0.7), V(0, (syncTop + syncBot) / 2, 0.7), V(0, fcY, 0.7)]);
      const trArr = arcArrow([[0, 3.2, 0.7], [0, fcY + 0.8, 0.7]], gateCol, 0.07);
      addRoot(trArr);
      S2.flow = flowOn(trCurve, 12, 0.15, gateCol, 0x102030, MECH2 === 'igg' ? 0.16 : 0.34, 0.04);
      CUR.root.add(S2.flow);

      textSprite(MECH2_DATA[MECH2][0], [0, 5.0, 0], 0.34, '#ffd479');

      const dt = dtClock();
      CUR.tick = () => {
        const d = S2.play ? dt() : 0; S2.t += d;
        S2.flow.run(d);
      };
    },
    panel(box) {
      seg(box, '絨毛成熟階段（障壁厚度）', [[false, '早期(10μm)'], [true, '足月(1–2μm)']], TERM2, v => { TERM2 = v; reloadKeep(); });
      selectBox(box, '選擇物質與運輸類型（Fig 14.3）', Object.keys(MECH2_DATA).map(k => [k, MECH2_DATA[k][0].split('（')[0]]), v => { MECH2 = v; reloadKeep(); }).value = MECH2;
      note(box, MECH2_DATA[MECH2][1], 'big');
      checkbox(box, '播放物質跨膜轉運動畫', true, v => S2.play = v);
    }
  });

  /* ===== 場景③：HbF 雙重波爾效應與母肝膽紅素結合排除（Figs 14.5–14.6, Table 14.1） ===== */
  let S3 = null, BOHR3 = true;
  SCENES.push({
    name: '③ 雙波爾效應與膽紅素',
    title: 'HbF 氧親和＋雙重波爾效應 (左) 與胎兒膽紅素經母肝排除 (右)（Figs 14.5–14.6）',
    camera: { pos: [0, 0.8, 19.5], target: [0, 0, 0], fit: [10.4, 6.2] },
    controls: [
      { label: '🔍 雙側機制全覽', fn() { flyHome(); } },
      { label: '🔍 左：HbA vs HbF 雙波爾搶氧', fn() { flyFit([-4.8, 0, 0], [4.6, 4.4]); } },
      { label: '🔍 右：膽紅素經母肝結合排泄', fn() { flyFit([4.8, 0, 0], [4.6, 4.4]); } }
    ],
    desc: `
<p>胎兒在低氧（P<sub>O₂</sub> 僅 15–30 mmHg）與缺乏肝臟代謝酶的條件下如何滿足驚人氧需求並排出溶血有毒副產物 <b>膽紅素（Bilirubin）</b>？（Ch.14 p.249–250, 254–255, Figs 14.5–14.6, Table 14.1）</p>
<details open><summary>兩個跨物種都極考驗的胎盤巧思</summary><ul>
<li><b>左側：HbF（α₂γ₂）對 2,3-DPG 免疫 ＋ 雙重波爾效應（額外 +10% 氧轉移！）</b>：胎兒吐給母親的 CO₂ 讓母側 pH 下降促 HbA 撒手丟氧；胎側排出 CO₂ 後 pH 上升（7.26→7.35）讓 HbF 親和力再拉高緊抓氧氣！</li>
<li><b>右側：膽紅素（Fig 14.6）</b>：胎兒肝臟臨產前缺 UDP-葡萄糖醛酸轉移酶，未結合脂溶性膽紅素擴散入母血，由<b>母肝轉成極性結合物</b>（不能穿回胎盤！）入母膽汁清除。</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.14 p.249–250, 254–255（Figs 14.5–14.6, Table 14.1）</p>`,
    build() {
      S3 = { t: 0, play: true };
      const BH = '左側：母 HbA (α₂β₂) vs 胎 HbF (α₂γ₂)', BL = '右側：胎兒膽紅素經母肝結合排泄';

      // 左側：HbA (帶 2,3-DPG 黃球) 釋 O2 -> 過障壁 -> HbF (不吃 DPG，雙 γ 鏈)
      const hbA = [ell([-6.8, 2.2, 0.3], [0.55, 0.5, 0.45], 0xd84040), ell([-5.8, 2.2, 0.3], [0.55, 0.5, 0.45], 0xd84040),
        ell([-6.8, 1.3, -0.2], [0.55, 0.5, 0.45], 0xf08060), ell([-5.8, 1.3, -0.2], [0.55, 0.5, 0.45], 0xf08060)];
      const dpg = ell([-6.3, 1.75, 0.1], [0.32, 0.32, 0.32], 0xffd43a, 0.96); // DPG 鎖在兩條 β 鏈間！
      const hbF = [ell([-3.8, -2.0, 0.3], [0.55, 0.5, 0.45], 0x4db8e8), ell([-2.8, -2.0, 0.3], [0.55, 0.5, 0.45], 0x4db8e8),
        ell([-3.8, -2.9, -0.2], [0.55, 0.5, 0.45], 0x45c49e), ell([-2.8, -2.9, -0.2], [0.55, 0.5, 0.45], 0x45c49e)];
      const wallL = box([-4.8, 0, 0], [5.0, 0.38, 1.6], 0xe56b92, 0.65);

      const cO2 = arcArrow([[-5.8, 1.4, 0.5], [-3.8, -1.6, 0.5]], 0x70e8ff, 0.06);
      const cCO2 = arcArrow([[-2.8, -1.6, 0.5], [-4.8, 1.4, 0.5]], 0xa8b8c8, 0.05);
      reg(BH, '母體 HbA（受 2,3-DPG 與低 pH 壓低氧親和）↔ 胎兒 HbF（α₂γ₂）', 'Double Bohr Effect & HbF',
        BOHR3 ? '<b>雙波爾開啟</b>：胎兒排出之 CO₂ 酸化母血（pH↓7.2）逼使 HbA 鬆手釋氧；自身鹼化（pH↑7.4）使 HbF 高速抓氧，在僅 30 mmHg 下達 13 vol.% 飽滿攜氧！' : '純靜態平衡（未計入 CO₂ 雙邊 pH 波動效應）。',
        [...hbA, dpg, ...hbF, wallL, ...cO2, ...cCO2], { anchor: [-5.0, -4.1, 0.9] });

      // 右側：胎兒骨髓/血球破壞 -> 脂溶未結合膽紅素 (橘) 穿過胎盤 -> 母體血清白蛋白載送 -> 母體肝臟 (UDPGT) 加上藍極性葡萄糖醛酸 -> 排出膽汁！
      const fetMar = ell([3.2, -2.6, 0.2], [1.1, 0.75, 0.7], 0xf08060, 0.92);
      const wallR = box([5.2, 0, 0], [5.0, 0.38, 1.6], 0xe56b92, 0.65);
      const matLiv = ell([6.8, 2.3, 0.2], [1.3, 0.9, 0.8], 0x904028, 0.92);
      const bileOut = ell([6.8, 4.1, 0.2], [0.6, 0.4, 0.4], 0x46d16a, 0.92);
      const cBil = arcArrow([[3.5, -1.8, 0.4], [4.8, 0.0, 0.4], [6.2, 1.6, 0.4]], 0xffa830, 0.06);
      const cBile = arcArrow([[6.8, 3.2, 0.4], [6.8, 3.8, 0.4]], 0x46d16a, 0.06);
      reg(BL, '脂溶性未結合膽紅素穿胎盤 → 母肝 UDPGT 轉極性排膽汁', 'Placental Bilirubin Clearance (Fig 14.6)',
        '結合後之「膽紅素葡萄糖醛酸苷（極性水溶）」<b>無法穿回胎盤</b>；早產兒或過晚剪臍帶紅血球分解過猛易因胎肝尚未成熟產生生理性黃疸甚至核黃疸（p.254–255）！',
        [fetMar, wallR, matLiv, bileOut, ...cBil, ...cBile], { anchor: [5.0, -4.1, 0.9] });

      S3.fO = flowOn(cO2.curve, 10, 0.11, 0x70e8ff, 0x104050, BOHR3 ? 0.38 : 0.2, 0.03);
      S3.fC = flowOn(cCO2.curve, 8, 0.1, 0xc8d8e8, 0x202020, BOHR3 ? 0.32 : 0.16, 0.03);
      S3.fB = flowOn(cBil.curve, 10, 0.12, 0xffa830, 0x402000, 0.3, 0.03);
      CUR.root.add(S3.fO, S3.fC, S3.fB);

      textSprite('O₂ 雙波爾奪氧（左）  vs  膽紅素母肝解毒（右）', [0, 5.0, 0], 0.35, '#ffd479');

      const dt = dtClock();
      CUR.tick = () => {
        const d = S3.play ? dt() : 0; S3.t += d;
        S3.fO.run(d); S3.fC.run(d); S3.fB.run(d);
      };
    },
    panel(box) {
      checkbox(box, '開啟胎盤雙重波爾效應 (CO₂ pH 移位)', BOHR3, v => { BOHR3 = v; reloadKeep(); });
      const cv = mkCanvas(box, 290, 150);
      const dShift = BOHR3 ? 5 : 0;
      plot(cv, {
        title: 'Fig 14.5 HbF vs HbA 氧解離曲線與雙重波爾移位',
        x: [0, 100], y: [0, 19], xt: [0, 20, 40, 60, 80, 100], xl: '氧分壓 Po₂ (mmHg，母動脈90 / 臍靜30)',
        vl: [{ x: 30, col: '#4db8e8', label: '臍靜脈30' }, { x: 90, col: '#ff7070', label: '母動脈90' }],
        series: [
          { f: p => 17.5 * Math.pow(p, 2.3) / (Math.pow(17 - dShift, 2.3) + Math.pow(p, 2.3)), col: '#4db8e8', label: BOHR3 ? '胎 HbF (pH↑7.35-7.40)' : '胎 HbF (基礎)', w: 2.5 },
          { f: p => 14.8 * Math.pow(p, 2.5) / (Math.pow(27 + dShift, 2.5) + Math.pow(p, 2.5)), col: '#ff5050', label: BOHR3 ? '母 HbA (pH↓7.20)' : '母 HbA (pH7.4)', w: 2.3 }
        ]
      });
      note(box, 'Table 14.1：母動脈 P<sub>O2</sub> 90 → 14 vol.%；臍靜脈僅 30 mmHg 卻已含 13 vol.%！', 'big');
      checkbox(box, '播放氣體與膽紅素清除流', true, v => S3.play = v);
    }
  });
})();
