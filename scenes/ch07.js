/* Ch.7：雄性內分泌與生殖腺調節（Δ5路徑與三出口、抑制素/活化素與HPG負回饋、雄性骨盆與附屬腺） */
(function () {
  /* ===== 場景①：Leydig Δ5 合成、三條輸出與 Sertoli 雙激素協同（Fig 7.1） ===== */
  let S1 = null, LH_LVL = 1.0, FSH_LVL = 1.0;
  SCENES.push({
    name: '① Leydig Δ⁵ 與 Sertoli 協同',
    title: '睪丸 Δ⁵ 類固醇合成、三出口與 Sertoli AR/FSH-R 協同（Fig 7.1）',
    camera: { pos: [0, 0.5, 20], target: [0, 0, 0], fit: [10.4, 6.4] },
    controls: [
      { label: '🔍 全部', fn() { flyHome(); } },
      { label: '🔍 左：Leydig Δ⁵ 工廠', fn() { flyFit([-4.8, 0, 0], [4.6, 4.4]); } },
      { label: '🔍 右：Sertoli 細胞內部', fn() { flyFit([4.8, 0, 0], [4.6, 4.4]); } }
    ],
    desc: `
<p>人類睪丸間質 <b>Leydig 細胞</b>受 LH 刺激，主要走 <b>Δ⁵ 路徑</b>每日製造 4–10 mg <b>睪固酮（T）</b>，並經三條途徑離開睪丸（Ch.7 p.123–126, Fig 7.1）。</p>
<details open><summary>三條出口與 Sertoli 協同（Fig 7.1）</summary><ul>
<li><b>三條出口</b>：① <b>血液（17 ml/min）</b>、② <b>淋巴（0.2 ml/min）</b>送往附屬腺、③ <b>管腔液（外分泌）</b>與 Sertoli 分泌之 <b>ABP</b> 結合送至副睪。</li>
<li><b>Sertoli 細胞</b>：含 <b>5α-還原酶</b>將 T 轉為更強效之 <b>DHT</b>；成熟期人類雌激素主要直接由 Leydig 產出。</li>
<li><b>反相振盪協同</b>：FSH 促 Sertoli 表現 <b>AR</b>，雄性素回頭促 <b>FSH-R</b>（與 300+ 蛋白如 ABP、轉鐵蛋白、GDNF、CREMτ），兩者缺一不可。</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.7 p.123–126（Fig 7.1）</p>`,
    build() {
      S1 = { t: 0, play: true };
      const L = '來狄吉細胞（Δ⁵ 優勢路徑）', S = '塞透力氏細胞（DHT＋ABP）', EX = '三條輸出路線';
      const leyBox = cellShell([-4.8, 0.2, 0], [4.0, 4.4, 3.0], 0xff9a3a, 0.22, 1.5);
      const serBox = cellShell([4.6, 0.2, 0], [4.2, 4.6, 3.2], 0x5aa8ff, 0.2, 1.5);
      reg(L, '來狄吉細胞（含 LH 受體＋平滑內質網）', 'Leydig cell (LH-R)', '全睪丸僅 Leydig 表現 LH-R（PRL 與抑制素可協同增強 LH 效應）；LH 結合後 60 秒內 cAMP 上升，20–30 分鐘 T 分泌大增。', leyBox, { anchor: [-8.0, 3.5, 0.6] });
      reg(S, '塞透力氏細胞（基底側具 FSH-R）', 'Sertoli cell (FSH-R & AR)', '生精細胞無 AR，全靠 Sertoli 表現 AR（維持 BTB、細胞黏附、排精）並與 FSH 協同。', serBox, { anchor: [8.0, 3.6, 0.6] });

      // Δ5 階梯點列
      const d5Names = ['膽固醇 Cholesterol', '孕烯醇酮 Pregnenolone', '17α-OH-Preg', 'DHEA', '雄烯二醇 Androstenediol', '睪固酮 Testosterone'];
      const d5Nodes = d5Names.map((nm, i) => ell([-5.4, 3.2 - i * 1.1, 0.3], [0.42, 0.26, 0.3], i === 5 ? 0xffd43a : 0xffaa60));
      reg(L, 'Δ⁵ 主合成路徑（人為優勢）', 'Δ5 steroidogenic pathway', '膽固醇 → 孕烯醇酮 → 17α-OH-Preg → DHEA → 雄烯二醇 → <b>睪固酮（T）</b>（少部分走 Δ⁴ 經助孕酮→A₄→T）。', d5Nodes, { anchor: [-6.8, -0.5, 0.6] });

      // Sertoli 內部：5α-reductase -> DHT, AR, ABP, Aromatase -> E2
      const dhtM = ell([3.6, 0.5, 0.3], [0.45, 0.45, 0.45], 0xffb84a);
      const abpM = ell([5.8, 1.4, 0.3], [0.5, 0.38, 0.4], 0x70e8ff);
      const arM = ell([4.6, -1.2, 0.3], [0.55, 0.4, 0.4], 0x46d16a);
      reg(S, '5α-還原酶 → 二氫睪固酮 (DHT)', '5α-reductase → DHT', '將流入的 T 轉為親和力更高的 DHT 結合胞內 AR（在成熟人間質則可直接產 E₂）。', dhtM, { anchor: [2.2, 1.2, 0.6] });
      reg(S, '雄性素結合蛋白（ABP）', 'Androgen-binding protein', '受 FSH 與 T 誘導合成，攜帶高濃度雄性素進入曲細精管液流向副睪。', abpM, { anchor: [7.4, 1.8, 0.6] });
      reg(S, '核內 AR ↔ FSH-R 協同互補', 'Sertoli AR & FSH-R synergy', 'FSH 促進 AR 生成、T 維持 FSH-R；兩者在生精上皮週期呈現互補反相振盪。', arM, { anchor: [6.5, -1.6, 0.6] });

      // 三出口管線 + 催產素
      const rBlood = arcArrow([[-4.8, -2.5, 0.3], [-6.8, -4.4, 0.3], [-8.8, -4.4, 0.3]], 0xff4a4a, 0.08);
      const rLymph = arcArrow([[-4.0, -2.5, 0.3], [-4.0, -4.6, 0.3], [-1.8, -5.2, 0.3]], 0x70d880, 0.06);
      const rTub = arcArrow([[-4.2, -1.8, 0.3], [0.0, -0.8, 0.3], [3.0, 0.4, 0.3]], 0xffd43a, 0.07);
      const rLumen = arcArrow([[6.0, 1.8, 0.3], [8.6, 3.2, 0.3]], 0x70e8ff, 0.07);
      reg(EX, '出口① 血液（17 ml/min）', 'Blood export (17 ml/min)', '佔最大宗，負責負回饋腦垂腺/下視丘與全身同化作用。', rBlood, { anchor: [-8.6, -5.4, 0.4] });
      reg(EX, '出口② 淋巴（0.2 ml/min）', 'Lymphatic export (0.2 ml/min)', '輸送高濃度雄性素與 Leydig 催產素至鄰近輸出管與附屬腺。', rLymph, { anchor: [-2.0, -6.0, 0.4] });
      reg(EX, '出口③ 管腔液（ABP 結合 → 副睪）', 'Tubular fluid (+ABP → epididymis)', '脂溶性 T 自由跨膜入管內，濃度高出血漿 25–100 倍，由 ABP 運往副睪！', [...rTub, ...rLumen], { anchor: [8.6, 3.8, 0.4] });

      S1.fT = flowOn(rTub.curve, 14, 0.13, 0xffd43a, 0x403000, 0.25 * LH_LVL + 0.05, 0.05);
      S1.fB = flowOn(rBlood.curve, 10, 0.12, 0xff6060, 0x400000, 0.25 * LH_LVL + 0.05, 0.04);
      S1.fL = flowOn(rLumen.curve, 12, 0.12, 0x70e8ff, 0x003040, 0.25 * FSH_LVL + 0.05, 0.04);
      CUR.root.add(S1.fT, S1.fB, S1.fL);

      const dt = dtClock();
      CUR.tick = () => {
        const d = S1.play ? dt() : 0;
        S1.fT.run(d); S1.fB.run(d); S1.fL.run(d);
      };
    },
    panel(box) {
      slider(box, 'LH 訊號（驅動 Leydig Δ⁵）', 0.1, 1.5, LH_LVL, 0.1, v => { LH_LVL = v; reloadKeep(); });
      slider(box, 'FSH 訊號（驅動 Sertoli AR/ABP）', 0.1, 1.5, FSH_LVL, 0.1, v => { FSH_LVL = v; reloadKeep(); });
      checkbox(box, '播放激素輸送動畫', true, v => S1.play = v);
    }
  });

  /* ===== 場景②：抑制素/活化素雙聚體與 HPG 負回饋（Figs 7.2–7.4） ===== */
  let S2 = null, CAST2 = false;
  SCENES.push({
    name: '② 抑制素與負回饋',
    title: '抑制素／活化素雙聚體組裝（Fig 7.2）與去勢 vs 完整雄性負回饋（Figs 7.3–7.4）',
    camera: { pos: [0, 0.5, 20], target: [0, 0, 0], fit: [10.4, 6.4] },
    controls: [
      { label: '🔍 全部', fn() { flyHome(); } },
      { label: '🔍 左：雙聚體次單位組裝', fn() { flyFit([-5.2, 0, 0], [4.5, 4.4]); } },
      { label: '🔍 右：雄性 HPG 脈衝回饋', fn() { flyFit([4.6, 0, 0], [4.8, 4.6]); } }
    ],
    desc: `
<p>Sertoli 細胞利用三個基因產出 <b>抑制素（Inhibin A/B）</b> 與 <b>活化素（Activin A/B/AB）</b>，在雄性與垂體間構成精密負回饋（Ch.7 p.124–127, Figs 7.2–7.4）。</p>
<details open><summary>關鍵組裝與回饋機制</summary><ul>
<li><b>雙聚體結構（Fig 7.2）</b>：α 次單位專屬於<b>抑制素</b>（Inhibin A = α+βA；人類男性主型為 <b>Inhibin B = α+βB</b>）；兩條 β 鏈組成<b>活化素</b>（AA, BB, AB）；<b>Follistatin</b> 可螯合活化素抑制其活性。</li>
<li><b>負回饋分工（Figs 7.3–7.4）</b>：去勢移除睪固酮與抑制素後，GnRH 與 LH/FSH 脈衝頻率與振幅皆劇增；<b>睪固酮</b>主要抑制下視丘 GnRH 脈衝（→ 降 LH），<b>抑制素 B</b> 則作用於腦垂腺選擇性抑制 <b>FSH</b>。</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.7 p.124–127（Figs 7.2–7.4）</p>`,
    build() {
      S2 = { t: 0, play: true };
      const DM = '抑制素／活化素組合（Fig 7.2）', AX = '雄性 HPG 負回饋（Figs 7.3–7.4）';
      // 左側三種雙聚體展示
      const mkDimer = (y, c1, c2, l1, l2) => {
        const a = ell([-6.0, y, 0], [0.72, 0.52, 0.52], c1);
        const b = ell([-4.4, y, 0], [0.72, 0.52, 0.52], c2);
        const ss = [cyl([-5.3, y + 0.14, 0], [-5.1, y + 0.14, 0], 0.07, 0xffd43a), cyl([-5.3, y - 0.14, 0], [-5.1, y - 0.14, 0], 0.07, 0xffd43a)];
        return [a, b, ...ss];
      };
      reg(DM, '抑制素 B（α + βB，人類男性主型）', 'Inhibin B (α–βB dimer)', 'Sertoli 分泌之約 32 kDa 雙聚體（α 鏈結合 βB 鏈），選擇性抑制前葉 FSH 分泌。', mkDimer(2.6, 0x5aa8ff, 0x46d16a), { anchor: [-7.2, 2.8, 0.5] });
      reg(DM, '活化素 A / B / AB（β + β 雙聚體）', 'Activins (βA/βB dimers)', '由兩條 β 鏈以雙硫鍵結合，功能與抑制素相反（可促進 FSH 與旁分泌調控）；α 鏈會搶奪 β 鏈達成平衡。', mkDimer(0.2, 0x46d16a, 0xffb84a), { anchor: [-7.2, 0.2, 0.5] });
      const fol = [ell([-5.2, -2.4, 0], [1.1, 0.75, 0.85], 0xb07ae0, 0.48), ...mkDimer(-2.4, 0x46d16a, 0x46d16a)];
      reg(DM, '濾泡抑素螯合活化素（Follistatin）', 'Follistatin–Activin complex', '高親和力結合蛋白，結合活化素使其無法與受體交互作用。', fol, { anchor: [-7.2, -2.4, 0.5] });

      // 右側：HPG 脈衝軸（隨 CAST2 改變脈衝速度）
      const hyp = ell([4.6, 4.0, 0], [2.2, 0.9, 1.0], 0xe8a0b8, 0.7);
      const pit = ell([4.6, 1.2, 0], [1.3, 0.85, 0.9], 0xd88a80);
      const tes = ell([4.6, -2.8, 0], [1.3, 1.7, 1.1], CAST2 ? 0x505a68 : 0x5aa8ff, CAST2 ? 0.22 : 0.92);
      reg(AX, '下視丘 GnRH 脈衝產生器', 'Hypothalamic GnRH pulse generator', CAST2 ? '去勢後失去睪固酮負回饋，GnRH 脈衝頻率與振幅大幅暴衝！' : '正常雄性維持穩定脈衝釋放至垂體門脈。', hyp, { anchor: [7.2, 4.2, 0.5] });
      reg(AX, '腦垂腺前葉（LH / FSH）', 'Anterior pituitary (LH & FSH)', '脈衝式釋放 LH 與 FSH；同時受抑制素 B（針對 FSH）與雄性素負回饋調控。', pit, { anchor: [7.0, 1.2, 0.5] });
      reg(AX, CAST2 ? '去勢／失去性腺（無 T 與抑制素）' : '睪丸（分泌 T ⊣ GnRH/LH，Inhibin ⊣ FSH）', 'Testis feedback source', CAST2 ? '移除睪丸導致循環 T 與抑制素 B 消失，血中 LH 與 FSH 脈衝顯著升高（Fig 7.3）。' : 'Leydig T 負回饋下視丘與垂體；Sertoli Inhibin B 選擇性抑制 FSH。', tes, { anchor: [7.2, -2.8, 0.5] });

      const cGn = arcArrow([[4.6, 3.0, 0], [4.6, 2.1, 0]], 0x7dff8a, 0.06);
      const cGon = arcArrow([[3.6, 0.8, 0], [3.2, -1.0, 0], [3.6, -2.2, 0]], 0x4aa8ff, 0.06);
      const cNegT = arcArrow([[5.9, -2.0, 0], [7.2, 1.0, 0], [6.4, 3.6, 0]], CAST2 ? 0x445566 : C_INH, 0.065, { inhibit: true });
      const cNegI = arcArrow([[5.4, -1.6, -0.6], [6.1, -0.2, -0.6], [5.7, 1.1, -0.6]], CAST2 ? 0x445566 : 0xb070ff, 0.055, { inhibit: true });
      reg(AX, '睪固酮負回饋路徑（⊣ GnRH/LH）', 'Testosterone negative feedback', '降低 GnRH 脈衝頻率與振幅，主導抑制 LH（亦部分抑 FSH）。', cNegT, { anchor: [7.9, 2.2, 0.5] });
      reg(AX, '抑制素 B 負回饋路徑（⊣ FSH）', 'Inhibin B selective FSH inhibition', '僅作用於腦垂腺前葉降低促性腺細胞對 GnRH 刺激分泌 FSH 之反應。', cNegI, { anchor: [6.8, -0.6, -0.4] });
      addRoot([...cGn, ...cGon]);

      S2.fGn = puffer(cGn.curve, 20, 0.13, 0x7dff8a, 0x104010, 0.7, 0.08);
      S2.fLH = puffer(cGon.curve, 20, 0.13, 0x4aa8ff, 0x002050, 1.0, 0.1);
      CUR.root.add(S2.fGn, S2.fLH);

      let lastP = -1;
      const dt = dtClock();
      CUR.tick = () => {
        const d = S2.play ? dt() : 0; S2.t += d;
        S2.fGn.run(d); S2.fLH.run(d);
        const rate = CAST2 ? 2.4 : 0.85;
        const step = Math.floor(S2.t * rate);
        if (step !== lastP) { lastP = step; S2.fGn.emit(CAST2 ? 10 : 5); S2.fLH.emit(CAST2 ? 12 : 6); }
      };
    },
    panel(box) {
      checkbox(box, '模擬去勢（移除 T 與抑制素，Fig 7.3）', CAST2, v => { CAST2 = v; reloadKeep(); });
      const ch = mkCanvas(box, 290, 145);
      const freq = CAST2 ? 22 : 8, base = CAST2 ? 7.5 : 1.5, amp = CAST2 ? 6.5 : 2.5;
      plot(ch, {
        title: `Fig 7.3 血中 LH 脈衝（${CAST2 ? '去勢高頻高值' : '完整正常雄性'}）`,
        x: [0, 6], y: [0, 16], xl: '小時 (Hours)', yl: 'LH (ng/ml)',
        series: [{ f: x => base + amp * Math.pow(Math.max(0, Math.sin(x * freq)), 6), col: CAST2 ? '#ff7070' : '#4aa8ff', w: 2 }],
        legend: false
      });
      checkbox(box, '播放脈衝動畫', true, v => S2.play = v);
    }
  });

  /* ===== 場景③：雄性骨盆與附屬生殖腺物種差異（Figs 7.5–7.6, Table 7.1） ===== */
  let S3 = null, SP3 = 'human', CAST3 = false;
  const GL_TAB = {
    human: ['人類 Human', 1.0, 0.75, 0.45, 0.25, '前列腺發達 (+++)、儲精囊中等 (++)、壺腹 (+)、尿道球腺 (±)。'],
    bull: ['牛 Bull', 0.4, 1.35, 0.8, 0.25, '儲精囊極發達 (+++) 與壺腹 (++) 明顯，前列腺較小 (+)。'],
    dog: ['狗 Dog', 1.25, 0.0, 0.0, 0.0, '僅具發達的前列腺 (+++)，完全缺乏儲精囊、壺腹與尿道球腺！'],
    boar: ['豬 Boar', 0.75, 1.45, 0.0, 1.2, '缺乏壺腹 (−)，但具巨大儲精囊 (+++) 與極長大尿道球腺 (++)，產出凝膠栓與海量精液。'],
    ram: ['綿羊 Ram', 0.75, 0.55, 0.8, 0.95, '具雙側壺腹 (++)、中等儲精囊 (+) 與較明顯尿道球腺 (++)。']
  };
  SCENES.push({
    name: '③ 雄性附屬腺體',
    title: '人類雄性骨盆矢狀解剖與物種附屬生殖腺比較（Figs 7.5–7.6, Table 7.1）',
    camera: { pos: [-11, 2.5, 14], target: [0, 0, 0], fit: [7.5, 6.2] },
    controls: [
      { label: '🔍 側面矢狀觀', fn() { flyHome(); } },
      { label: '🔍 後視解剖觀', fn() { flyTo([0, 1.5, -16], [0, 0, 0]); } }
    ],
    desc: `
<p>雄性附屬生殖腺製造<b>精漿（seminal plasma）</b>並具高 <b>AR 與 5α-還原酶</b>活性；去勢後上皮矮化萎縮（Fig 7.6），但補回雄性素（＋泌乳素協同）即可恢復大小與分泌（Ch.7 p.127–129）。</p>
<details open><summary>附屬生殖腺與物種比較（Table 7.1）</summary><ul>
<li><b>儲精囊（Seminal vesicle）</b>：製造鹼性果糖液體（牛/豬 +++，人 ++，<b>犬無</b>）。</li>
<li><b>前列腺（Prostate）</b>：包圍尿道起始部（人/犬 +++，牛 +）。</li>
<li><b>壺腹（Ampulla）</b>：輸精管膨大端（牛/馬/羊 ++，人 +，<b>犬/豬無</b>）。</li>
<li><b>尿道球腺（Bulbourethral / Cowper's）</b>：潤滑尿道／產生凝膠（豬/羊 ++，<b>犬無</b>）。</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.7 p.127–129（Figs 7.5–7.6, Table 7.1）</p>`,
    build() {
      S3 = { t: 0 };
      const [, pSc, svSc, amSc, bgSc, spTxt] = GL_TAB[SP3];
      const shrink = CAST3 ? 0.45 : 1.0;
      const UR = '泌尿與骨盆基準', GL = '雄性附屬生殖腺（DHT 依賴）', EX = '排精道與陰莖';

      const blad = ell([0, 2.6, 1.0], [1.7, 1.4, 1.5], 0xe8b878, 0.35);
      const pubis = box([0, 1.0, 2.8], [1.4, 1.1, 0.9], 0xeadcbc, 0.65);
      const rect = ttube([[0, 4.2, -2.5], [0, 0.5, -2.2], [0, -3.5, -2.6]], 0.9, 0xb87068, 0.3);
      reg(UR, '膀胱、恥骨與直腸地標', 'Urinary bladder, pubis & rectum', '直腸緊貼前列腺與儲精囊後方，獸醫／臨床可經直腸觸診評估（Fig 7.5a）。', [blad, pubis, rect], { anchor: [0, 3.8, -2.2] });

      const vas = [
        ttube([[-1.4, -3.6, 0.2], [-1.7, 0.2, 0.6], [-1.3, 3.5, 0.5], [-0.4, 1.8, -0.3]], 0.12, 0x3b82f6, 0.92, { organic: false }),
        ttube([[1.4, -3.6, 0.2], [1.7, 0.2, 0.6], [1.3, 3.5, 0.5], [0.4, 1.8, -0.3]], 0.12, 0x3b82f6, 0.92, { organic: false })
      ];
      const tes = [ell([-1.3, -3.9, 0.5], [0.55, 0.78, 0.55], 0x5aa8ff, CAST3 ? 0.2 : 0.9), ell([1.3, -3.9, 0.5], [0.55, 0.78, 0.55], 0x5aa8ff, CAST3 ? 0.2 : 0.9)];
      const ure = ttube([[0, 1.5, 0.8], [0, -0.4, 0.6], [0, -1.5, 1.4], [0, -2.3, 3.6], [0, -3.6, 4.3]], 0.14, 0x90d8ff, 0.85, { organic: false });
      const pen = ttube([[0, -1.4, 1.4], [0, -2.3, 3.6], [0, -3.6, 4.3]], [0.55, 0.5, 0.58], 0xd88888, 0.45, { organic: false });
      reg(EX, '睪丸與輸精管（從陰囊繞過膀胱）', 'Testes & vas deferens', '輸精管將精子從副睪尾輸送至尿道前列腺部。', [...vas, ...tes], { anchor: [-1.8, -3.8, 0.8] });
      reg(EX, '尿道與陰莖', 'Urethra & penis', '泌尿與射精共同終端通道，穿過前列腺、尿生殖膈與陰莖海綿體（Fig 7.5a）。', [ure, pen], { anchor: [0, -3.0, 4.5] });

      // 4 個受 DHT 調節的附屬腺（依物種及去勢狀態縮放）
      const pros = ell([0, 0.9, 0.6], [1.05 * pSc * shrink, 0.85 * pSc * shrink, 0.95 * pSc * shrink], 0xff9a4a);
      reg(GL, `前列腺（${SP3}）`, 'Prostate gland', '富含 5α-還原酶與 AR（加上催乳素協同），製造微酸性或鹼性精漿液與前列腺素。', pros, { anchor: [1.8, 0.9, 0.8] });

      if (svSc > 0) {
        const sv = [ell([-1.1, 2.0, -0.6], [0.42 * svSc * shrink, 0.9 * svSc * shrink, 0.35 * svSc * shrink], 0x46d16a), ell([1.1, 2.0, -0.6], [0.42 * svSc * shrink, 0.9 * svSc * shrink, 0.35 * svSc * shrink], 0x46d16a)];
        reg(GL, '儲精囊（牛/豬最發達，犬無）', 'Seminal vesicles', '位於膀胱後外側，分泌大量含果糖、檸檬酸與前列腺素之精漿液。', sv, { anchor: [-2.2, 2.2, -0.6] });
      }
      if (amSc > 0) {
        const amp = [ell([-0.55, 1.75, -0.35], [0.22 * amSc * shrink, 0.45 * amSc * shrink, 0.22 * amSc * shrink], 0xffe060), ell([0.55, 1.75, -0.35], [0.22 * amSc * shrink, 0.45 * amSc * shrink, 0.22 * amSc * shrink], 0xffe060)];
        reg(GL, '輸精管壺腹（牛/羊/馬/人具，豬/犬無）', 'Ampulla of vas deferens', '輸精管末端腺體性膨大處，具局部儲存與分泌功能。', amp, { anchor: [1.4, 2.0, -0.4] });
      }
      if (bgSc > 0) {
        const bg = [ell([-0.42, -0.4, 0.35], [0.25 * bgSc * shrink, 0.32 * bgSc * shrink, 0.25 * bgSc * shrink], 0xc084fc), ell([0.42, -0.4, 0.35], [0.25 * bgSc * shrink, 0.32 * bgSc * shrink, 0.25 * bgSc * shrink], 0xc084fc)];
        reg(GL, '尿道球腺／考珀氏腺（豬最發達，犬無）', 'Bulbourethral (Cowper\'s) glands', '位於膜部尿道旁，射精前分泌透明黏液沖洗潤滑尿道，在豬還負責形成凝固栓塞（Table 7.1）。', bg, { anchor: [1.8, -0.5, 0.4] });
      }
      textSprite(CAST3 ? '去勢 18 天：缺乏 DHT → 腺體上皮萎縮、腔室縮小 (Fig 7.6b)' : `${GL_TAB[SP3][0]} 附屬生殖腺配置 (Table 7.1)`, [0, 5.1, 0], 0.38, CAST3 ? '#ff8a8a' : '#ffd479');
    },
    panel(box) {
      selectBox(box, '物種（Table 7.1）', Object.keys(GL_TAB).map(k => [k, GL_TAB[k][0]]), v => { SP3 = v; reloadKeep(); }).value = SP3;
      checkbox(box, '模擬去勢萎縮（Fig 7.6b）', CAST3, v => { CAST3 = v; reloadKeep(); });
      note(box, GL_TAB[SP3][5], 'big');
    }
  });
})();
