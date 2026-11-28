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

      // 膀胱（含輸尿管匯入三角區）+ 弧形恥骨聯合 + 直腸（Fig 7.5）
      const blad = ell([0, 2.6, 1.0], [1.75, 1.45, 1.5], 0xe8b878, 0.36);
      const ureters = [-1, 1].map(s => ttube([[s * 1.35, 4.7, 0.2], [s * 1.05, 3.5, 0.45], [s * 0.72, 2.35, 0.55]], 0.1, 0xd8a868, 0.85, { organic: false }));
      const pubis = [
        ttube([[-1.55, 0.8, 2.25], [-0.55, 1.08, 2.85], [0, 1.12, 2.95], [0.55, 1.08, 2.85], [1.55, 0.8, 2.25]], [0.32, 0.42, 0.46, 0.42, 0.32], 0xeadcbc, 0.72, { organic: false }),
        ell([0, 1.1, 2.95], [0.16, 0.45, 0.38], 0xd0c0a0, 0.85)
      ];
      const rect = ttube([[0, 4.3, -2.55], [0, 1.6, -2.15], [0, -0.6, -2.3], [0, -3.5, -2.65]], [0.85, 0.95, 0.88, 0.75], 0xb87068, 0.3, { organic: false });
      reg(UR, '膀胱（含輸尿管）、恥骨聯合與直腸地標', 'Urinary bladder, ureters, pubis & rectum', '直腸緊貼前列腺與儲精囊後方，獸醫／臨床可經直腸觸診評估（Fig 7.5a）。', [blad, ...ureters, ...pubis, rect], { anchor: [0, 3.8, -2.2] });

      // 雙側睪丸 + 盤繞副睪 + 輸精管
      const vas = [
        ttube([[-1.45, -3.55, 0.25], [-1.75, 0.2, 0.6], [-1.3, 3.55, 0.5], [-0.42, 1.85, -0.32]], 0.11, 0x3b82f6, 0.92, { organic: false }),
        ttube([[1.45, -3.55, 0.25], [1.75, 0.2, 0.6], [1.3, 3.55, 0.5], [0.42, 1.85, -0.32]], 0.11, 0x3b82f6, 0.92, { organic: false })
      ];
      const tes = [];
      [-1, 1].forEach(s => {
        tes.push(ell([s * 1.3, -3.9, 0.5], [0.55, 0.78, 0.55], 0x5aa8ff, CAST3 ? 0.2 : 0.9));
        // 附睪頭→體→尾緊貼睪丸後外側
        const epPath = new THREE.CatmullRomCurve3(PV([[s * 1.35, -3.15, 0.45], [s * 1.72, -3.55, 0.2], [s * 1.68, -4.35, 0.22], [s * 1.45, -4.55, 0.28]]));
        tes.push(ttube(helixAlong(epPath, 0.11, 6, 0, 56), 0.065, 0xd890a8, CAST3 ? 0.35 : 0.88, { organic: false, radial: 8 }));
      });
      const ure = ttube([[0, 1.55, 0.8], [0, -0.4, 0.6], [0, -1.5, 1.4], [0, -2.3, 3.6], [0, -3.65, 4.35]], 0.14, 0x90d8ff, 0.88, { organic: false });
      const pen = [
        ttube([[0, -1.4, 1.4], [0, -2.25, 3.45], [0, -3.25, 4.1]], [0.58, 0.52, 0.48], 0xd88888, 0.48, { organic: false }),
        // 龜頭與冠狀溝
        ell([0, -3.62, 4.32], [0.54, 0.62, 0.56], 0xe07884, 0.68),
        ring([0, -3.22, 4.08], [0, -0.82, 0.57], 0.54, 0.09, 0xd06878, 0.72)
      ];
      reg(EX, '睪丸、盤繞副睪與輸精管', 'Testes, epididymis & vas deferens', '輸精管將精子從副睪尾輸送至尿道前列腺部。', [...vas, ...tes], { anchor: [-1.8, -3.8, 0.8] });
      reg(EX, '尿道與陰莖（含陰莖頭與冠狀溝）', 'Urethra & penis', '泌尿與射精共同終端通道，穿過前列腺、尿生殖膈與陰莖海綿體（Fig 7.5a）。', [ure, ...pen], { anchor: [0, -3.0, 4.5] });

      // 4 個受 DHT 調節的附屬腺（依物種及去勢狀態縮放，精細化葉狀/分節造型）
      const ps = pSc * shrink;
      const pros = [
        ell([-0.38 * ps, 0.9, 0.58], [0.76 * ps, 0.84 * ps, 0.86 * ps], 0xff9a4a, 0.92),
        ell([0.38 * ps, 0.9, 0.58], [0.76 * ps, 0.84 * ps, 0.86 * ps], 0xff9a4a, 0.92),
        ell([0, 0.96, 0.82], [0.58 * ps, 0.62 * ps, 0.55 * ps], 0xf58a3a, 0.88)
      ];
      reg(GL, `前列腺（栗狀雙葉，${SP3}）`, 'Prostate gland', '富含 5α-還原酶與 AR（加上催乳素協同），包繞尿道起始部製造微酸性或鹼性精漿液與前列腺素。', pros, { anchor: [1.8, 0.9, 0.8] });

      if (svSc > 0) {
        const svs = svSc * shrink;
        const sv = [];
        [-1, 1].forEach(s => {
          const svAxis = new THREE.CatmullRomCurve3(PV([[s * 0.45, 1.35, -0.25], [s * (0.95 + 0.25 * svs), 1.95, -0.55], [s * (1.25 + 0.35 * svs), 2.55, -0.68]]));
          sv.push(ttube(helixAlong(svAxis, 0.18 * svs, 4, s > 0 ? 0 : Math.PI, 48), 0.22 * svs, 0x46d16a, 0.92, { organic: false, radial: 10 }));
          for (let k = 0; k < 4; k++) {
            const pt = svAxis.getPoint(0.2 + k * 0.25);
            sv.push(ell([pt.x + s * 0.12 * svs, pt.y, pt.z - 0.1 * svs], [0.24 * svs, 0.26 * svs, 0.22 * svs], 0x52de78, 0.9));
          }
        });
        reg(GL, '儲精囊（分葉盤繞腺囊，牛/豬最發達，犬無）', 'Seminal vesicles', '位於膀胱後外側，呈盤繞分葉狀，分泌大量含果糖、檸檬酸與前列腺素之精漿液（Fig 7.5b）。', sv, { anchor: [-2.2, 2.2, -0.6] });
      }
      if (amSc > 0) {
        const ams = amSc * shrink;
        const amp = [];
        [-1, 1].forEach(s => {
          for (let k = 0; k < 3; k++) {
            const frac = k / 2;
            const r = (0.18 + 0.08 * Math.sin(frac * Math.PI)) * ams;
            amp.push(ell([s * (0.42 + frac * 0.24), 1.48 + frac * 0.62, -0.28 - frac * 0.1], [r, r * 1.25, r], 0xffe060, 0.94));
          }
        });
        reg(GL, '輸精管壺腹（念珠狀膨大，牛/羊/馬/人具，豬/犬無）', 'Ampulla of vas deferens', '輸精管末端腺體性膨大處，具局部儲存與分泌功能（Fig 7.5b）。', amp, { anchor: [1.4, 2.0, -0.4] });
      }
      if (bgSc > 0) {
        const bgs = bgSc * shrink;
        const bg = [];
        [-1, 1].forEach(s => {
          bg.push(ell([s * 0.45, -0.42, 0.35], [0.25 * bgs, 0.32 * bgs, 0.25 * bgs], 0xc084fc, 0.94));
          bg.push(ttube([[s * 0.42, -0.5, 0.38], [s * 0.15, -0.82, 0.62], [0, -0.95, 0.72]], 0.045, 0xd0a0ff, 0.88, { organic: false }));
        });
        reg(GL, '尿道球腺／考珀氏腺（含排泄管，豬最發達，犬無）', 'Bulbourethral (Cowper\'s) glands', '位於膜部尿道旁，射精前經細導管分泌透明黏液沖洗潤滑尿道，在豬還負責形成凝固栓塞（Table 7.1）。', bg, { anchor: [1.8, -0.5, 0.4] });
      }
      textSprite(CAST3 ? '去勢 18 天：缺乏 DHT → 腺體上皮萎縮、腔室縮小 (Fig 7.6b)' : `${GL_TAB[SP3][0]} 附屬生殖腺配置 (Table 7.1)`, [0, 5.1, 0], 0.38, CAST3 ? '#ff8a8a' : '#ffd479');
    },
    panel(box) {
      selectBox(box, '物種（Table 7.1）', Object.keys(GL_TAB).map(k => [k, GL_TAB[k][0]]), v => { SP3 = v; reloadKeep(); }).value = SP3;
      checkbox(box, '模擬去勢萎縮（Fig 7.6b）', CAST3, v => { CAST3 = v; reloadKeep(); });
      note(box, GL_TAB[SP3][5], 'big');
    }
  });

  /* ===== 場景④：哺乳類雄性生殖系統比較解剖（以公牛為代表，整合比較大體解剖） ===== */
  SCENES.push({
    name: '④ 哺乳類解剖（公牛）',
    title: '哺乳類雄性生殖系統比較解剖（側面示意，以公牛為代表）',
    camera: { pos: [-0.2, 0.4, 8.6], target: [0.1, 0.45, 0], fit: [3.4, 2.7] },
    controls: [{ label: '🔍 公牛全貌', fn() { flyHome(); } }],
    desc: `
<p>模型左側為<b>尾側</b>、右側為<b>頭側</b>，上為背側；左右成對構造皆已繪出。比較家畜（反芻類、豬）之<b>彈性纖維型陰莖（具 S 狀屈曲）</b>與人、馬、犬之<b>肌肉海綿型陰莖</b>，以及 Table 7.1 四對輔性腺物種差異。</p>
<details open><summary>物種差異重點</summary><table>
  <tr><th>陰莖型式</th><td>彈性纖維型：反芻獸、豬（S 狀屈曲，後拉肌發達）<br>肌肉海綿型：人、馬、肉食獸（勃起時變長變粗）</td></tr>
  <tr><th>輔性腺</th><td>犬、貓：無囊腺，攝護腺發達<br>公牛、公豬：囊腺大，攝護腺本體小<br>公豬：無輸精管壺；尿道球腺豬最發達、犬缺乏</td></tr>
  <tr><th>陰莖頭</th><td>豬：螺旋狀；馬/羊：尿道突；牛：龜頭帽；犬：陰莖頭球＋陰莖骨</td></tr>
</table></details>
<p class="src">雷弟生物學 3D 比較解剖整合（對應 Essential Reproduction Ch.7 Table 7.1）</p>`,
    build() {
      const SIDES = [1, -1];
      const PP = [[0.50, 1.40, 0], [0.25, 1.18, 0], [-0.15, 0.97, 0], [-0.55, 0.78, 0], [-0.95, 0.50, 0], [-1.05, 0.05, 0],
        [-0.95, -0.35, 0], [-0.65, -0.55, 0], [-0.40, -0.30, 0], [-0.15, -0.55, 0], [0.4, -0.65, 0], [1.5, -0.7, 0], [2.7, -0.7, 0]];
      const curve = new THREE.CatmullRomCurve3(PV(PP), false, 'centripetal');
      const N = 600, sp = curve.getSpacedPoints(N);
      const near = (x, y) => { let b = 0, bd = 1e9; sp.forEach((p, i) => { const d = (p.x - x) ** 2 + (p.y - y) ** 2; if (d < bd) { bd = d; b = i; } }); return b; };
      const segPts = (a, b, off) => { const pts = []; for (let i = a; i < b; i += 4) pts.push(sp[i].clone()); pts.push(sp[b].clone()); if (off) pts.forEach(p => p.add(V(...off))); return pts; };
      const i1 = near(0.05, 1.08), i2 = near(-0.30, 0.88), i3 = near(-0.85, 0.62), i4 = near(-1.04, 0.20);
      const iPre = near(1.2, -0.7), iFree = near(2.7, -0.7);
      const tg = i => sp[Math.min(N, i + 3)].clone().sub(sp[Math.max(0, i - 3)]);

      reg('尿道與膀胱', '膀胱', 'Urinary bladder', '儲存尿液。膀胱頸向後接尿道，雄性尿道是<b>尿液與精液最後的共同通道</b>。', ell([0.65, 1.85, 0], [0.55, 0.5, 0.45], 0xe8c27a, 0.7));
      reg('尿道與膀胱', '內尿道括約肌', 'Internal urethral sphincter', '位於膀胱頸／攝護腺前尿道外圍之平滑肌，射精時收縮<b>阻止精液逆流入膀胱</b>。',
        ring(sp[near(0.40, 1.31)], tg(near(0.40, 1.31)), 0.075, 0.025, 0xd96a6a), { anchor: [0.4, 1.31, 0.08] });
      reg('尿道與膀胱', '攝護腺前尿道', 'Pre-prostatic urethra', '膀胱頸延伸到攝護腺的一小段尿道；上皮為變移上皮。', tube(segPts(0, i1), 0.04, 0xffe36e));
      reg('尿道與膀胱', '攝護腺尿道', 'Prostatic urethra', '通過攝護腺的部分，中段膨大處為精阜，有射精管與攝護腺導管開口。', tube(segPts(i1, i2), 0.04, 0xffb347));
      reg('尿道與膀胱', '膜性尿道', 'Membranous urethra', '起自攝護腺尖端至陰莖球部，外圍有外尿道括約肌（橫紋肌）。', tube(segPts(i2, i3), 0.04, 0xffe36e));
      reg('尿道與膀胱', '球部尿道', 'Bulbar urethra', '尿道在坐骨弓彎曲的部分；尿道球腺導管注入此處。', tube(segPts(i3, i4), 0.042, 0xff9a3c));
      reg('尿道與膀胱', '陰莖尿道（海綿體部）', 'Penile / spongy urethra', '外圍包有尿道海綿體；分佈尿道腺（Littre 氏腺）分泌黏液。', tube(segPts(i4, iFree), 0.035, 0xffe36e), { anchor: [0.9, -0.7, 0] });
      reg('尿道與膀胱', '外尿道括約肌', 'External urethral sphincter', '圍繞膜性尿道的橫紋肌，受意志控制排尿。',
        ring(sp[near(-0.62, 0.74)], tg(near(-0.62, 0.74)), 0.075, 0.028, 0xc0392b), { anchor: [-0.62, 0.74, 0.08] });

      const prosPos = sp[near(-0.15, 0.97)];
      reg('輔性腺', '攝護腺（本體）', 'Prostate gland (corpus prostatae)', '圍繞尿道的複管泡腺；牛、豬本體小，犬非常發達。', ell([prosPos.x, prosPos.y, 0], [0.2, 0.14, 0.17], 0xe07b6a, 0.6));
      reg('輔性腺', '攝護腺分部', 'Pars disseminata prostatae', '攝護腺瀰散部分，散佈於骨盆部尿道壁內。', tube(segPts(i2, near(-0.72, 0.70)), 0.07, 0xf0a090, 0.45), { anchor: [-0.5, 0.82, 0.07] });
      const colPos = sp[near(-0.10, 1.0)];
      reg('輔性腺', '精阜', 'Colliculus seminalis', '攝護腺尿道背側壁隆起，射精管開口於其兩側裂孔。', ell([colPos.x, colPos.y + 0.03, 0], [0.04, 0.03, 0.04], 0xfff0a0), { anchor: [colPos.x, colPos.y + 0.05, 0] });
      const A = [], VG = [], EJ = [], BG = [], BGD = [];
      SIDES.forEach(s => {
        A.push(tube([[0.30, 1.30, s * 0.15], [0.15, 1.2, s * 0.11], [0.05, 1.1, s * 0.08]], 0.052, 0x9fd18b));
        EJ.push(tube([[0.05, 1.1, s * 0.08], [-0.10, 1.0, 0]], 0.022, 0xd9d97a));
        const rr = rnd(7 + s);
        for (let k = 0; k < 7; k++) VG.push(ell([0.04 + (rr() - 0.5) * 0.18, 1.2 + (rr() - 0.5) * 0.16, s * (0.32 + (rr() - 0.5) * 0.14)], [0.065, 0.065, 0.065], 0xd9a05b));
        VG.push(tube([[0.02, 1.16, s * 0.28], [0.05, 1.1, s * 0.09]], 0.018, 0xd9a05b));
        BG.push(ell([-0.72, 0.84, s * 0.17], [0.09, 0.09, 0.09], 0x7fb8d9));
        BGD.push(tube([[-0.72, 0.8, s * 0.15], [-0.88, 0.62, 0.0]], 0.014, 0x7fb8d9));
      });
      reg('輔性腺', '輸精管壺', 'Ampulla ductus deferentis', '馬、牛、綿羊發育良好；豬與貓無。與囊腺排出管匯合成射精管。', A);
      reg('輔性腺', '囊腺（儲精囊腺）', 'Vesicular gland', '分葉狀複管泡腺，分泌果糖與檸檬酸（牛、豬發達，犬貓缺如）。', VG, { anchor: [0.04, 1.28, 0.34] });
      reg('輔性腺', '射精管', 'Ejaculatory duct', '穿過攝護腺於精阜兩側開口入尿道。', EJ, { anchor: [-0.02, 1.07, 0.05] });
      reg('輔性腺', '尿道球腺（Cowper 氏腺）', 'Bulbourethral gland', '開口於球部尿道，分泌清澈黏液沖洗尿道（豬最發達，犬缺乏）。', BG, { anchor: [-0.72, 0.9, 0.17] });
      BGD.forEach(m => { m.userData.part = null; CUR.root.add(m); });

      reg('陰莖與包皮', '坐骨弓', 'Ischial arch', '骨盆底後緣骨弓，陰莖腳附著於此。', cyl([-0.92, 0.5, -0.38], [-0.92, 0.5, 0.38], 0.045, 0xe9e2cf), { anchor: [-0.92, 0.5, 0.38] });
      const CR = [], CRM = [];
      SIDES.forEach(s => {
        const pts = [[-1.04, 0.12, s * 0.04], [-0.99, 0.35, s * 0.17], [-0.92, 0.5, s * 0.3]];
        CR.push(tube(pts, 0.055, 0xc23b4d)); CRM.push(tube(pts, 0.082, 0xb04040, 0.4));
      });
      reg('陰莖與包皮', '陰莖腳', 'Crus penis', '陰莖海綿體左右分枝固定於坐骨弓（pizzle eye）。', CR, { anchor: [-0.99, 0.35, 0.17] });
      reg('肌肉', '坐骨海綿肌', 'Ischiocavernosus muscle', '成對橫紋肌，壓迫陰莖腳協助維持勃起。', CRM, { anchor: [-0.95, 0.43, 0.24] });
      const ib = near(-1.02, 0.30);
      reg('陰莖與包皮', '陰莖球', 'Bulb of penis', '尿道海綿體近端膨大部。', ell([sp[ib].x, sp[ib].y, 0], [0.11, 0.17, 0.11], 0x8e5a9e));
      const ib2 = near(-1.04, 0.14);
      reg('肌肉', '球海綿肌', 'Bulbospongiosus muscle', '單一橫紋肌覆蓋陰莖球與腹側，協助排空射精並助勃起。', ell([sp[ib2].x - 0.01, sp[ib2].y, 0], [0.17, 0.3, 0.17], 0xc0504d, 0.4), { anchor: [-1.2, 0.14, 0.1] });
      reg('陰莖與包皮', '陰莖體（白膜與筋膜）', 'Penile body (tunica albuginea / fasciae)', '彈性纖維型陰莖結締組織比例高，未勃起亦相當堅硬，大部分收藏於 S 狀屈曲。', tube(segPts(i4, iFree - 12), 0.1, 0xf2c9b8, 0.28), { anchor: [0.9, -0.55, 0] });
      reg('陰莖與包皮', '陰莖海綿體', 'Corpus cavernosum penis', '背側成對勃起組織（詳見 Ch.10 ④陰莖橫切）。', tube(segPts(i4, iFree - 40, [0, 0.035, 0]), 0.055, 0xd9534f, 0.95), { anchor: [0.4, -0.6, 0] });
      reg('陰莖與包皮', '尿道海綿體', 'Corpus spongiosum', '腹側圍繞尿道並於末端膨大成陰莖頭。', tube(segPts(i4, iFree - 8, [0, -0.03, 0]), 0.05, 0x8e5a9e, 0.95), { anchor: [1.3, -0.74, 0] });
      reg('陰莖與包皮', 'S 狀屈曲', 'Sigmoid flexure', '反芻獸、豬彈性纖維型陰莖在兩股之間的 S 形屈曲；勃起時伸直推出（無需明顯脹大）。', ell([-0.62, -0.5, 0], [0.05, 0.05, 0.05], 0xffee00, 1), { anchor: [-0.65, -0.55, 0.12] });
      const tip = sp[iFree];
      reg('陰莖與包皮', '陰莖頭', 'Glans penis', '公牛、公綿羊為盔帽狀龜頭帽；馬有尿道突；公豬呈螺旋狀無陰莖頭；犬有陰莖頭球。', cone([tip.x - 0.18, tip.y, 0], [tip.x + 0.1, tip.y, 0], 0.075, 0xe58fa0), { anchor: [tip.x, tip.y + 0.1, 0] });
      reg('陰莖與包皮', '包皮', 'Prepuce', '環繞游離端的皮膚皺褶；馬呈雙重皺褶，公豬背側有積存分泌物之憩室。', [tube(segPts(iPre, iFree), 0.17, 0xe9b090, 0.22), ring(V(tip.x + 0.1, tip.y, 0), V(1, 0, 0), 0.17, 0.03, 0xd49a7c)], { anchor: [2.2, -0.52, 0] });
      const stp = sp[near(-0.2, -0.56)], RT = [];
      SIDES.forEach(s => RT.push(tube([[-1.0, 2.35, s * 0.1], [-1.35, 1.8, s * 0.14], [-1.4, 1.0, s * 0.14], [-1.25, 0.1, s * 0.14], [-0.85, -0.7, s * 0.1], [stp.x, stp.y - 0.08, s * 0.06]], 0.032, 0xe8d8c8)));
      reg('肌肉', '陰莖後拉肌', 'Retractor penis muscle', '起自第 1–2 尾椎腹面之平滑肌，勃起時鬆弛伸長，射精後收縮將陰莖拉回形成 S 屈曲。', RT, { anchor: [-1.4, 1.2, 0.16] });
      reg('參考構造', '直腸與肛門', 'Rectum & anus', '定位參考；陰莖後拉肌行經提肛肌與直腸間。',
        [tube([[1.6, 2.55, 0], [0.5, 2.5, 0], [-0.7, 2.2, 0], [-1.5, 1.72, 0]], 0.12, 0x9c7a5b, 0.3), ring(V(-1.55, 1.68, 0), V(0.6, 0.5, 0), 0.1, 0.03, 0x7a5a3b)], { anchor: [0.2, 2.5, 0] });

      const T = [], EH = [], EB = [], ET = [], VAS = [], CORD = [], ART = [], PAM = [], VEIN = [], CREM = [];
      SIDES.forEach(s => {
        const c = [-1.7, -0.85, s * 0.3];
        T.push(ell(c, [0.27, 0.5, 0.24], 0xf4e4c1));
        EH.push(ell([c[0] + 0.02, c[1] + 0.5, c[2]], [0.11, 0.1, 0.1], 0xd8a47f));
        EB.push(tube([[c[0] - 0.03, c[1] + 0.45, c[2]], [c[0] - 0.2, c[1] + 0.3, c[2]], [c[0] - 0.28, c[1], c[2]], [c[0] - 0.24, c[1] - 0.35, c[2]], [c[0] - 0.1, c[1] - 0.5, c[2]]], 0.05, 0xd8a47f));
        ET.push(ell([c[0] - 0.05, c[1] - 0.55, c[2]], [0.1, 0.09, 0.1], 0xc98d68));
        const R = [-0.95, 0.2, s * 0.3], T0 = [c[0] - 0.1, c[1] + 0.62, c[2]];
        const axis = new THREE.LineCurve3(V(...T0), V(...R)), ax = t => axis.getPoint(t).toArray();
        VAS.push(tube([[c[0] - 0.05, c[1] - 0.55, c[2]], [c[0] - 0.33, c[1] - 0.38, c[2]], [c[0] - 0.38, c[1] + 0.05, c[2]], [c[0] - 0.28, c[1] + 0.5, c[2]], ax(0.04), ax(0.5), ax(1), [-0.75, 0.75, s * 0.28], [-0.35, 1.15, s * 0.22], [0.3, 1.3, s * 0.15]], 0.022, 0xffffff));
        CORD.push(tube([T0, R], 0.1, 0xf0e6d8, 0.3));
        CREM.push(tube([ax(0.02), ax(0.95)], 0.125, 0xc0504d, 0.22));
        ART.push(tube(helixAlong(axis, 0.03, 9, 0, 160), 0.012, 0xe02020), tube([R, [-1.0, 0.9, s * 0.38], [-0.6, 1.7, s * 0.38], [-0.2, 2.15, s * 0.38]], 0.014, 0xe02020));
        PAM.push(tube(helixAlong(axis, 0.065, 7, 1.0, 160), 0.014, 0x3b6fe0), tube(helixAlong(axis, 0.065, 7, 4.1, 160), 0.014, 0x3b6fe0));
        VEIN.push(tube([R, [-1.1, 0.9, s * 0.45], [-0.7, 1.7, s * 0.45], [-0.3, 2.15, s * 0.45]], 0.02, 0x3b6fe0));
      });
      reg('睪丸與附睪', '睪丸', 'Testis', '位於陰囊中，生精需較體溫低環境；未下降者稱隱睪症。', T, { anchor: [-1.7, -0.7, 0.3] });
      reg('睪丸與附睪', '附睪頭', 'Caput epididymidis', '輸出小管約占頭部 1/3 體積。', EH, { anchor: [-1.68, -0.28, 0.3] });
      reg('睪丸與附睪', '附睪體', 'Corpus epididymidis', '極度迂曲單管，負責精子成熟與運輸。', EB, { anchor: [-1.98, -0.85, 0.3] });
      reg('睪丸與附睪', '附睪尾', 'Cauda epididymidis', '精子貯存主要處所，延續為輸精管。', ET, { anchor: [-1.75, -1.4, 0.3] });
      reg('睪丸與附睪', '輸精管', 'Vas (ductus) deferens', '肌層厚實，蠕動輸送精子入骨盆並膨大為輸精管壺。', VAS, { anchor: [-0.55, 0.98, 0.3] });
      reg('精索與血管', '精索', 'Spermatic cord', '含輸精管、血管、神經、淋巴與筋膜。', CORD, { anchor: [-1.4, -0.05, 0.3] });
      reg('精索與血管', '提睪肌', 'Cremaster muscle', '衍生自內腹斜肌之橫紋肌，協助調節溫度與促進蔓狀叢血流。', CREM, { anchor: [-1.55, -0.1, 0.4] });
      reg('精索與血管', '睪丸動脈', 'Testicular artery', '極為迂曲被蔓狀靜脈叢包圍行逆流降溫。', ART, { anchor: [-1.25, 0.12, 0.3] });
      reg('精索與血管', '蔓狀靜脈叢', 'Pampiniform venous plexus', '與睪丸動脈緊密纏繞之靜脈網。', PAM, { anchor: [-1.5, -0.1, 0.22] });
      reg('精索與血管', '睪丸靜脈', 'Testicular vein', '右側入下腔靜脈、左側入左腎靜脈。', VEIN, { anchor: [-0.7, 1.7, 0.45] });
      const scM = ell([-1.75, -0.8, 0], [0.62, 0.85, 0.72], 0xe8b9a0, 0.2);
      const sepM = new THREE.Mesh(new THREE.CircleGeometry(1, 40), mat(0xc0504d, 0.35)); sepM.position.set(-1.75, -0.8, 0); sepM.scale.set(0.6, 0.83, 1);
      reg('陰囊', '陰囊', 'Scrotum', '保護睪丸並提供較低溫環境以利生精（詳見 Ch.3 ⑤陰囊與被膜層次）。', scM, { anchor: [-2.3, -1.0, 0.5] });
      reg('陰囊', '陰囊中隔', 'Scrotal septum', '由肉膜正中形成，分隔左右兩室。', sepM, { anchor: [-1.75, -1.55, 0] });
    }
  });

  /* ===== 場景⑤：雄禽生殖系統比較解剖（鳥類背面觀，整合比較大體解剖） ===== */
  SCENES.push({
    name: '⑤ 雄禽生殖解剖（鳥類）',
    title: '雄禽生殖系統比較解剖（背面觀示意，左為尾側）',
    camera: { pos: [-0.3, 6.0, 4.8], target: [-0.3, -0.05, 0], fit: [2.6, 2.0] },
    controls: [
      { label: '🔄 切換睪丸：性活動期／非活動期', fn() { window._active = !window._active; window._applyTestis && window._applyTestis(); } },
      { label: '🔍 背面全覽', fn() { flyHome(); } }
    ],
    desc: `
<p>雄禽成對<b>睪丸、附睪、輸精管</b>與一個<b>交接器</b>全部位於<b>腹腔內</b>。<b>無輔性腺</b>（無囊腺、攝護腺、尿道球腺），故精液體積小，主要由泄殖腔旁血管體與背肛室腺貢獻精漿。</p>
<p>睪丸位於<b>腎臟前葉腹前端</b>（無陰囊下降，無縱隔與小葉），左略大於右；性活動期變為飽滿<b>乳白色</b>。交接器官三型比較詳見 <a href="ch10.html#4">Ch.10「⑤ 雄禽交接器官三型」</a>。</p>
<p class="src">雷弟生物學 3D 比較解剖整合（對比哺乳類雄性附屬腺與體溫調節）</p>`,
    build() {
      const S = [1, -1];
      window._active = false;
      const act = () => window._active ? 0xfaf6ea : 0xd2a86a;
      const KID = [];
      S.forEach(s => [[0.75, 0.45, 0.22], [-0.05, 0.4, 0.2], [-0.85, 0.45, 0.2]].forEach(k => KID.push(ell([k[0], -0.04, s * 0.5], [k[1], 0.13, k[2]], 0x9a4a3a, 0.85))));
      reg('參考構造', '腎臟（前、中、後葉）', 'Kidney', '睪丸位於腎臟前葉腹前端；輸精管沿輸尿管行進至泄殖腔。', KID, { anchor: [-0.05, 0.1, 0.5] });
      reg('參考構造', '主動脈', 'Aorta', '睪丸內側緊鄰主動脈與後腔靜脈。', tube([[1.6, 0.14, 0], [-1.7, 0.14, 0]], 0.04, 0xe03030), { anchor: [0.2, 0.18, 0] });
      reg('參考構造', '後腔靜脈', 'Caudal vena cava', '與主動脈並行，緊鄰睪丸內側。', tube([[1.6, 0.04, 0], [-1.7, 0.04, 0]], 0.055, 0x3b6fe0), { anchor: [-0.7, 0.04, 0] });
      reg('參考構造', '直腸／結腸', 'Rectum / colon', '消化道末端開口於泄殖腔糞道。', tube([[1.2, -0.3, 0], [0.2, -0.28, 0], [-0.9, -0.25, 0], [-1.5, -0.12, 0]], 0.055, 0x9c7a5b, 0.55), { anchor: [-0.4, -0.27, 0] });
      const TE = [], EP = [], DD = [], UR = [], RC = [], PA = [], PV = [];
      S.forEach(s => {
        TE.push(ell([1.08, -0.15, s * 0.34], s > 0 ? [0.36, 0.18, 0.18] : [0.3, 0.15, 0.15], act()));
        EP.push(ell([0.98, -0.06, s * 0.21], [0.11, 0.05, 0.05], 0xc98d68));
        const pts = [], n = 28;
        for (let i = 0; i <= n; i++) { const u = i / n, x = 0.92 - u * 2.62, sg = i % 2 ? 1 : -1; pts.push([x, -0.06 + sg * 0.018, s * (0.21 - 0.09 * u + sg * 0.03)]); }
        DD.push(tube(pts, 0.014, 0xffffff, 1, 6));
        UR.push(tube([[0.6, -0.1, s * 0.4], [-0.5, -0.1, s * 0.31], [-1.3, -0.09, s * 0.2], [-1.78, -0.05, s * 0.09]], 0.022, 0xe6d88a, 0.8));
        RC.push(ell([-1.68, -0.03, s * 0.115], [0.1, 0.04, 0.04], 0xb7d9a8));
        PA.push(cone([-1.74, -0.02, s * 0.1], [-1.8, 0.0, s * 0.055], 0.025, 0xb7d9a8));
        PV.push(ell([-1.66, -0.1, s * 0.24], [0.1, 0.06, 0.06], 0xe06a8a));
      });
      const teP = reg('睪丸與管道', '睪丸', 'Testis', '成對（左略大於右）豆狀，無縱隔與小葉，全部位於腹腔體內高溫環境仍可生精。', TE, { anchor: [1.2, -0.15, 0.4] });
      window._applyTestis = () => {
        TE.forEach(m => {
          m.material.color.setHex(act());
          if (m.material.color.convertSRGBToLinear) m.material.color.convertSRGBToLinear();
        });
        select(teP);
        $('info').insertAdjacentHTML('afterbegin', `<div class="g" style="background:#7a5a10">目前狀態：${window._active ? '性活動期（乳白色、充實膨大）' : '性休止期（淡棕／黃色）'}</div>`);
      };
      reg('睪丸與管道', '附睪', 'Epididymis', '鳥類附睪甚小位於睪丸背內側（輸出小管分近端皺褶與遠端平直區）。', EP, { anchor: [0.98, -0.02, 0.25] });
      reg('睪丸與管道', '輸精管', 'Ductus deferens', '極迂曲呈鋸齒狀，為鳥類精子主要成熟處所（無蔓狀靜脈叢）。', DD, { anchor: [-0.3, -0.02, 0.18] });
      reg('參考構造', '輸尿管', 'Ureter', '沿腎臟行進與輸精管共同開口入尿殖室。', UR, { anchor: [-0.6, -0.1, 0.33] });
      reg('睪丸與管道', '貯精器', 'Receptaculum ductus deferentis', '進入泄殖腔前變寬形成貯精器。', RC, { anchor: [-1.68, 0.02, 0.15] });
      reg('睪丸與管道', '輸精管乳頭', 'Papilla of ductus deferens', '貯精器末端突入尿殖室背壁之射精乳頭。', PA, { anchor: [-1.78, 0.02, 0.07] });
      reg('泄殖腔與輔助生殖器', '糞道', 'Coprodeum', '泄殖腔最前腔室，接收直腸糞便。', ell([-1.55, 0, 0], [0.22, 0.17, 0.17], 0xd9a08a, 0.55), { anchor: [-1.5, 0.15, 0] });
      reg('泄殖腔與輔助生殖器', '尿殖室', 'Urodeum', '泄殖腔中腔，輸精管與輸尿管開口於背壁。', ell([-1.82, 0, 0], [0.2, 0.17, 0.17], 0xe3b09a, 0.55), { anchor: [-1.82, 0.16, 0] });
      reg('泄殖腔與輔助生殖器', '肛室', 'Proctodeum', '泄殖腔末端腔室通往泄殖腔口。', [ell([-2.07, 0, 0], [0.18, 0.15, 0.15], 0xeab9a4, 0.55), ring(V(-2.26, 0, 0), V(1, 0, 0), 0.12, 0.03, 0xd0707a)], { anchor: [-2.15, 0.15, 0] });
      reg('泄殖腔與輔助生殖器', '泄殖腔旁血管體', 'Paracloacal vascular body', '性興奮時將動脈血超過濾成淋巴液腫脹推動交接器（鳥類靠淋巴液而非血液勃起！）。', PV, { anchor: [-1.66, -0.12, 0.28] });
      const LF = []; S.forEach(s => LF.push(ell([-2.07, -0.13, s * 0.07], [0.13, 0.04, 0.05], 0xbfd8f0, 0.9)));
      reg('泄殖腔與輔助生殖器', '淋巴皺褶', 'Lymphatic fold', '肛室腹側接受淋巴液充脹推動陰莖外翻／勃起。', LF, { anchor: [-2.07, -0.17, 0.12] });
      reg('泄殖腔與輔助生殖器', '背肛室腺', 'Dorsal proctodeal gland', '分泌精漿成分補償無輔性腺的鳥類生殖道。', ell([-2.07, 0.16, 0], [0.12, 0.05, 0.1], 0x8fbf6a), { anchor: [-2.07, 0.22, 0] });
    }
  });
})();
