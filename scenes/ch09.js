/* Ch.9：女性生殖週期（物種比較、E2 雙相回饋與 GnRH 自體預敏、子宮內膜螺旋動脈與子宮頸黏液） */
(function () {
  /* ===== 場景①：四類動物卵巢週期比較（Table 9.1, Figs 9.1–9.2） ===== */
  let S1 = null, SP1 = 'human';
  const CYC_DATA = {
    human: ['人類 Human（28 天）', 28, 14, '排卵在 Day 14，黃體期 14 天；黃體同時產 P₄、E₂ 與 Inhibin A 強烈壓低 LH/FSH，故下一批濾泡直到溶黃體才展開腔狀擴張（Fig 9.1a）。'],
    pig: ['豬／牛（19–21 天「壓縮重疊型」）', 21, 5, '黃體期 LH/FSH 維持較高基礎值，使下一批腔狀濾泡早在「前一週期黃體期」便已擴張，溶黃體後僅需 2–6 天即可排卵（Fig 9.1b）。'],
    rat_alone: ['大鼠／小鼠（獨處 4–5 天）', 5, 2, '無交配刺激時缺少 PRL 潮湧，黃體僅短暫存活 2–3 天（主產 20α-OHP），使牠們每 4–5 天即可再次排卵受孕（Fig 9.2）。'],
    rat_mate: ['大鼠（交配刺激假孕 13–14 天）', 14, 2, '交配機械刺激子宮頸 → 感覺神經上傳腦幹/下視丘 → 每天 2 次 <b>PRL 潮湧</b>維持黃體長達 11–12 天（假孕，Fig 9.2）。'],
    rabbit: ['兔（誘發／反射排卵型，Box 9.1）', 14, 1, '獨處時無黃體期，卵巢連續存在多波腔狀濾泡（持續發情）；唯有交配刺激子宮頸才透過神經反射於 10–12 小時內誘發 LH 潮湧排卵！']
  };
  SCENES.push({
    name: '① 物種卵巢週期',
    title: '人、豬/牛（壓縮型）、鼠（假孕）與兔（誘發排卵）週期比較（Figs 9.1–9.2）',
    camera: { pos: [0, 1.5, 20], target: [0, 0, 0], fit: [10.4, 6.2] },
    controls: [{ label: '🔍 全週期軸', fn() { flyHome(); } }],
    desc: `
<p>哺乳動物的卵巢週期雖皆由「濾泡期（E₂）→ 排卵 → 黃體期（P₄）」組成，但因不同物種孕期與生態策略差異，演化出四種典型節奏（Ch.9 p.152–155, Table 9.1, Figs 9.1–9.2）。</p>
<details open><summary>為何大鼠與兔子大幅縮短週期？</summary><ul>
<li><b>人</b>：全濾泡＋全黃體＝1 週期（28 天）。</li>
<li><b>豬／牛</b>：把腔狀擴張「塞進（telescoped）」上一個黃體期內（共 21 天）。</li>
<li><b>大鼠／小鼠（孕期僅 21 天）</b>：只有交配後誘發垂體 PRL 潮湧才展開 11–12 天黃體期，否則 4–5 天重排一次。</li>
<li><b>兔／貓／雪貂</b>：完全刪除自發性排卵與黃體期，直到交配才「誘發排卵（induced ovulation）」（Box 9.1）。</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.9 p.152–155（Table 9.1, Figs 9.1–9.2, Box 9.1）</p>`,
    build() {
      S1 = { t: 0, play: true };
      const [, total, ovDay, descTxt] = CYC_DATA[SP1];
      const O = '濾泡與黃體時間軌跡', N = '神經反射（鼠/兔）';
      // 3D 時間軌道環（x = -7.5 .. +7.5 代表兩次連續週期或當前週期）
      const rail = cyl([-7.5, 1.8, 0], [7.5, 1.8, 0], 0.1, 0x3b5a78);
      addRoot(rail);
      // 顯示 5 顆代表濾泡與黃體演變（從左到右隨週期進度）
      const fol1 = ell([-5.5, 1.8, 0.2], [0.45, 0.45, 0.45], 0x90d8ff);
      const fol2 = ell([-2.2, 1.8, 0.2], [0.85, 0.85, 0.8], 0xff90c0);
      const ovM = ell([0, 1.8, 0.4], [1.25, 1.25, 1.1], 0xffd479);
      const clM = ell([3.8, 1.8, 0.2], [1.1, 0.95, 0.9], SP1 === 'rabbit' ? 0x556677 : 0xf2c84a, SP1 === 'rabbit' ? 0.25 : 0.95);
      const nextF = ell([3.8, 3.6, 0.2], [0.72, 0.72, 0.65], SP1 === 'pig' ? 0xff90c0 : 0x445566, SP1 === 'pig' ? 0.9 : 0.25);
      reg(O, '早期腔狀濾泡群', 'Early antral cohort', '從不依賴激素的腔前濾泡持續補充而來。', [fol1, fol2], { anchor: [-4.2, 3.1, 0.5] });
      reg(O, '排卵前優勢濾泡／排卵點', 'Preovulatory / Ovulation', SP1 === 'rabbit' ? '兔無自發 LH 潮湧，腔狀濾泡維持待命直到交配刺激！' : `第 ${ovDay} 天排卵。`, ovM, { anchor: [0, 3.4, 0.6] });
      reg(O, SP1 === 'rabbit' ? '無自發黃體（交配後才產生）' : '黃體（分泌 P₄）', 'Corpus luteum phase', descTxt, clM, { anchor: [4.2, 0.4, 0.6] });
      reg(O, '上一黃體期重疊擴張濾泡（牛/豬特徵）', 'Telescoped luteal antral growth', SP1 === 'pig' ? '在豬／牛／羊／馬，黃體期即同步擴張下一代腔狀濾泡（Fig 9.1b）。' : '在人類，黃體期 E₂+P₄+Inhibin A 壓低 FSH/LH，抑制此階段擴張。', nextF, { anchor: [4.2, 4.7, 0.5] });

      // 下方：子宮頸感覺神經反射迴路（大鼠/兔亮起）
      const isReflex = SP1 === 'rat_mate' || SP1 === 'rabbit';
      const cvx = ell([-5.0, -2.5, 0], [0.9, 0.7, 0.7], isReflex ? 0xff70a0 : 0x556677, isReflex ? 0.9 : 0.35);
      const cns = ell([0, -2.5, 0], [1.4, 0.95, 0.95], isReflex ? 0x50d0ff : 0x556677, isReflex ? 0.9 : 0.35);
      const pitOut = ell([5.0, -2.5, 0], [1.1, 0.85, 0.85], isReflex ? 0x46d16a : 0x556677, isReflex ? 0.9 : 0.35);
      const nArc = arcArrow([[-4.0, -2.3, 0], [-1.5, -2.3, 0]], isReflex ? C_STIM : 0x445566, 0.06);
      const pArc = arcArrow([[1.5, -2.3, 0], [3.8, -2.3, 0]], isReflex ? 0xffd479 : 0x445566, 0.06);
      reg(N, '交配陰道／子宮頸機械刺激', 'Coital cervical stimulus', '大鼠（誘發 PRL 潮湧維持黃體）與兔（誘發 GnRH/LH 潮湧排卵）共用的感覺輸入機制。', [cvx, cns, pitOut, ...nArc, ...pArc], { anchor: [0, -4.0, 0.6] });

      S1.cursor = ell([-7.5, 1.8, 0.8], [0.24, 0.24, 0.24], 0xffffff); CUR.root.add(S1.cursor);
      S1.fRef = isReflex ? flowOn(nArc.curve, 10, 0.12, 0x7dff8a, 0x104010, 0.35, 0.04) : null;
      if (S1.fRef) CUR.root.add(S1.fRef);

      textSprite(CYC_DATA[SP1][0], [0, 5.1, 0], 0.4, '#ffd479');

      const dt = dtClock();
      CUR.tick = () => {
        const d = S1.play ? dt() : 0; S1.t += d;
        const u = (S1.t * 0.16) % 1;
        S1.cursor.position.x = -7.5 + u * 15.0;
        if (S1.fRef) S1.fRef.run(d);
      };
    },
    panel(box) {
      selectBox(box, '物種／情境比較（Table 9.1）', Object.keys(CYC_DATA).map(k => [k, CYC_DATA[k][0]]), v => { SP1 = v; reloadKeep(); }).value = SP1;
      note(box, CYC_DATA[SP1][3], 'big');
      checkbox(box, '播放週期掃描動畫', true, v => S1.play = v);
    }
  });

  /* ===== 場景②：E₂ 雙相回饋、GnRH 自體預敏與 LH 脈衝頻率（Figs 9.4–9.12） ===== */
  let S2 = null, PHASE2 = 'surge';
  const PH2 = {
    early: ['早期濾泡期（低 E₂ 負回饋）', '低～中濃度 E₂ 快速抑制弓狀核 KISS1 與垂體（4–6h）；Inhibin B 選擇性壓抑 FSH；LH 呈現高頻低振幅脈衝（約每小時 1 次，Fig 9.10a）。', 0.25, 0.1, true, false],
    surge: ['排卵前高 E₂（持續 36–48h 正回饋潮湧）', '高濃度 E₂ 誘發 AVPV/視前區 GnRH 脈衝暴衝，並搭配垂體 <b>GnRH 自體預敏</b>（顆粒移向胞膜）引發巨大 LH/FSH 潮湧（Fig 9.4, 9.9, 9.11）！', 1.0, 0.08, false, true],
    luteal: ['黃體期（高 P₄ 鎖死正回饋＋低頻高振幅）', '高濃度 P₄ 減慢 GnRH 脈衝頻率（間隔拉長達 6 小時！Fig 9.10d）並<b>徹底阻斷 E₂ 正回饋</b>；Inhibin A 壓抑 FSH。', 0.55, 1.0, true, false]
  };
  SCENES.push({
    name: '② 雙相回饋與自體預敏',
    title: 'E₂ 正負雙相回饋、GnRH 自我預敏與脈衝頻率調控（Figs 9.4–9.12）',
    camera: { pos: [0, 0.5, 20], target: [0, 0, 0], fit: [10.4, 6.4] },
    controls: [{ label: '🔍 全軸', fn() { flyHome(); } }],
    desc: `
<p>女性 HPG 軸最奧妙處在於：同一個激素 <b>E₂</b> 依濃度與持續時間展現相反的負／正回饋，而 <b>P₄</b> 則在黃體期關閉正回饋開關（Ch.9 p.154–163, Figs 9.4–9.12）。</p>
<details open><summary>下視丘與垂體雙層調節（Boxes 9.2–9.3）</summary><ul>
<li><b>GnRH 自我預敏（Self-priming，Fig 9.9）</b>：E₂ 增加垂體促性腺細胞 GnRH 受體並使分泌顆粒移近質膜，讓連續脈衝產生數倍放大效應。</li>
<li><b>間接神經網</b>：GnRH 神經元幾乎不表現 ERα/PR，而是靠弓狀核（負回饋）與視前區/AVPV（正回饋）之 <b>Kisspeptin、GABA（抑）、β-內啡肽（抑）與麩胺酸（促）</b>整合（Box 9.3）。</li>
<li><b>跨物種差異（Box 9.4）</b>：靈長類男性大腦<b>未</b>被胎兒雄性素去勢化正回饋，去勢男猴仍可出現 E₂ 誘導的 LH 潮湧（Fig 9.13）。</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.9 p.154–164（Figs 9.4–9.13, Boxes 9.2–9.4）</p>`,
    build() {
      S2 = { t: 0, play: true };
      const [ttl, txt, e2k, p4k, isNeg, isPos] = PH2[PHASE2];
      const H = '下視丘（ARC vs POA/AVPV）', P = '垂體自體預敏與性腺', FB = '回饋切換';
      const arc = ell([-2.2, 3.6, 0], [1.4, 0.85, 0.9], isNeg ? 0xff7070 : 0x7090b0);
      const avpv = ell([2.2, 3.6, 0], [1.4, 0.85, 0.9], isPos ? 0x46d16a : 0x506878);
      const pit = ell([0, 0.4, 0], [1.6, 1.0, 1.0], 0xd88a80);
      // 垂體內預敏分泌顆粒（E2 高時移近邊緣）
      const granPts = [];
      for (let i = 0; i < 12; i++) {
        const a = i / 12 * Math.PI * 2, r = isPos ? 1.15 : 0.45;
        granPts.push(V(Math.cos(a) * r * 1.1, 0.4 + Math.sin(a) * r * 0.7, 0.65));
      }
      const granD = dots(granPts, 0.14, 0xffd43a);
      const ov = ell([0, -3.5, 0], [1.8, 1.1, 1.0], 0xf4a0c0, 0.85);
      const fol = ell([1.0, -3.1, 0.6], [0.55 + 0.3 * e2k, 0.55 + 0.3 * e2k, 0.55], isPos ? 0xffd479 : 0xff90c0);
      const cl = ell([-1.0, -3.1, 0.6], [0.75 * p4k + 0.15, 0.75 * p4k + 0.15, 0.6], 0xf2c84a, p4k > 0.3 ? 0.95 : 0.2);

      reg(H, '弓狀核 ARC（低 E₂／P₄ 負回饋中心）', 'Arcuate nucleus (Negative feedback)', '介導低濃度 E₂ 與高 P₄ 對 GnRH 脈衝振幅與頻率的負回饋壓制（Figs 9.10, 9.12）。', arc, { anchor: [-4.2, 4.1, 0.5] });
      reg(H, '視前區／AVPV（高 E₂ 正回饋中心）', 'POA / AVPV (Positive feedback surge)', '承受高濃度 E₂ 持續 36–48h 刺激後大量釋放 GnRH 脈衝觸發排卵潮湧（Box 9.3）。', avpv, { anchor: [4.2, 4.1, 0.5] });
      reg(P, '腦垂腺前葉與顆粒「自我預敏」', 'Anterior pituitary & GnRH self-priming', '黃點為儲存 LH 之分泌顆粒；高 E₂ 時顆粒移至質膜邊緣，使次波 GnRH 爆發超強反應（Fig 9.9）。', [pit, granD], { anchor: [-2.6, 0.4, 0.7] });
      reg(P, '卵巢（優勢濾泡 E₂ / 黃體 P₄ & Inhibin A）', 'Ovary (E₂, P₄ & Inhibins)', '濾泡產 E₂ 與 Inhibin B；黃體產 P₄、E₂ 與 Inhibin A。', [ov, fol, cl], { anchor: [0, -5.0, 0.6] });

      const cGn = arcArrow([[0, 2.9, 0.2], [0, 1.5, 0.2]], isPos ? 0x46d16a : 0x7dff8a, 0.08);
      const cLH = arcArrow([[-1.2, -0.3, 0.2], [-2.2, -1.6, 0.2], [-1.3, -2.9, 0.2]], 0x4aa8ff, isPos ? 0.1 : 0.06);
      const cNeg = arcArrow([[1.5, -2.8, 0.3], [3.6, -0.5, 0.3], [3.4, 2.5, 0.3], [0, 3.8, 0.3]], isNeg ? C_INH : C_STIM, 0.07, { inhibit: isNeg });
      reg(FB, isNeg ? '負回饋（壓低 GnRH 脈衝／阻正回饋）' : '正回饋（E₂ 潮湧觸發 GnRH/LH 潮湧）', 'Feedback pathway', txt, cNeg, { anchor: [4.6, 0.5, 0.6] });
      addRoot([...cGn, ...cLH]);

      S2.fGn = puffer(cGn.curve, 22, 0.12, 0x7dff8a, 0x104010, 0.65, 0.06);
      S2.fLH = flowOn(cLH.curve, 16, isPos ? 0.18 : 0.11, 0x4aa8ff, 0x002050, isPos ? 0.55 : (p4k > 0.5 ? 0.12 : 0.28), 0.05);
      S2.fFB = flowOn(cNeg.curve, 14, 0.12, p4k > 0.5 ? 0xf2c84a : 0xff70b0, 0x401020, 0.26, 0.04);
      CUR.root.add(S2.fGn, S2.fLH, S2.fFB);

      textSprite(ttl, [0, 5.2, 0], 0.4, '#ffd479');

      let lastP = -1;
      const dt = dtClock();
      CUR.tick = () => {
        const d = S2.play ? dt() : 0; S2.t += d;
        S2.fGn.run(d); S2.fLH.run(d); S2.fFB.run(d);
        const freq = isPos ? 3.2 : p4k > 0.5 ? 0.5 : 1.4;
        const step = Math.floor(S2.t * freq);
        if (step !== lastP) { lastP = step; S2.fGn.emit(isPos ? 12 : p4k > 0.5 ? 9 : 4); }
      };
    },
    panel(box) {
      seg(box, '月經週期回饋相', [['early', '早濾泡期'], ['surge', '排卵前潮湧'], ['luteal', '黃體期']], PHASE2, v => { PHASE2 = v; reloadKeep(); });
      const ch = mkCanvas(box, 290, 145);
      plot(ch, {
        title: 'Fig 9.7 人類 28 天月經週期荷爾蒙曲線',
        x: [1, 28], y: [0, 1.05], xt: [1, 7, 14, 21, 28], xl: '週期天數 (Day 14 = 排卵)',
        bands: [{ x0: 1, x1: 5, col: 'rgba(255,90,90,0.2)', label: '月經' }],
        vl: [{ x: PHASE2 === 'early' ? 5 : PHASE2 === 'surge' ? 14 : 22, col: '#ffffff', label: '當前' }],
        series: [
          { f: d => 0.12 + 0.72 * Math.exp(-Math.pow((d - 14) / 1.1, 2)), col: '#4aa8ff', label: 'LH', w: 2.2 },
          { f: d => 0.14 + 0.65 * Math.exp(-Math.pow((d - 13) / 1.6, 2)) + 0.32 * Math.exp(-Math.pow((d - 22) / 3.5, 2)), col: '#ff70b0', label: 'E₂', w: 2 },
          { f: d => 0.06 + 0.85 * Math.exp(-Math.pow((d - 21.5) / 3.2, 2)), col: '#ffd43a', label: 'P₄', w: 2 },
          { f: d => 0.25 + 0.25 * Math.exp(-Math.pow((d - 4) / 2.2, 2)) + 0.3 * Math.exp(-Math.pow((d - 14) / 1.2, 2)), col: '#46d16a', label: 'FSH', w: 1.8 }
        ]
      });
      note(box, PH2[PHASE2][1], 'big');
      checkbox(box, '播放脈衝與自體預敏', true, v => S2.play = v);
    }
  });

  /* ===== 場景③：子宮內膜、螺旋動脈、肌層蠕動與子宮頸黏液（Figs 9.15–9.17） ===== */
  let S3 = null, DAY3 = 13;
  SCENES.push({
    name: '③ 內膜與子宮頸黏液',
    title: '28 天內膜腺體／螺旋動脈重塑與子宮頸黏液流變（Figs 9.15–9.17）',
    camera: { pos: [0, 0.5, 20], target: [0, 0, 0], fit: [10.4, 6.4] },
    controls: [
      { label: '🔍 全部', fn() { flyHome(); } },
      { label: '🔍 左：內膜與螺旋動脈', fn() { flyFit([-4.5, 0, 0], [5.0, 4.4]); } },
      { label: '🔍 右：子宮頸黏液網與精子', fn() { flyFit([4.8, 0, 0], [4.6, 4.4]); } }
    ],
    desc: `
<p>卵巢類固醇周期同步驅動輸卵管纖毛、子宮內膜／螺旋動脈、子宮肌層蠕動方向與子宮頸黏液通道網（Ch.9 p.165–170, Figs 9.15–9.17）。</p>
<details open><summary>關鍵時序變化</summary><ul>
<li><b>月經期（Day 1–5）</b>：P₄ 撤退 → 螺旋動脈收縮與細胞凋亡，內膜功能層脫落出血（人類/猿猴）。</li>
<li><b>增生期（Day 6–14, E₂）</b>：基底層再生、E₂ 誘導助孕素受體（PR）、子宮肌層<b>向底端蠕動助運精</b>；子宮頸表現 <b>Muc5B/Muc4</b> 水性凝膠網，<b>牽絲度與羊齒結晶</b>達最高！</li>
<li><b>分泌期（Day 15–28, P₄）</b>：螺旋動脈盤曲、腺體扭曲分泌富含醣蛋白養分、基礎體溫升高 0.5°C、子宮肌安靜、子宮頸黏液變稠形成免疫／精子障壁。</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.9 p.165–170（Figs 9.15–9.18）</p>`,
    build() {
      S3 = { t: 0, play: true };
      const EN = '子宮內膜層與螺旋動脈（左，Fig 9.15）', CX = '子宮頸黏液滲透網（右，Fig 9.17）';
      const isMens = DAY3 <= 5, isProlif = DAY3 > 5 && DAY3 <= 14, isOv = DAY3 >= 12 && DAY3 <= 15;
      // 內膜厚度 0.8 (月經) → 3.4 (增生末) → 4.6 (分泌中末)
      const thick = isMens ? 0.9 : isProlif ? 1.2 + (DAY3 - 5) / 9 * 2.1 : 3.3 + Math.sin(Math.min(1, (DAY3 - 14) / 10) * Math.PI * 0.6) * 1.4;
      const myo = tissueSlab([-4.6, -4.1, 0], [8.0, 0.9, 3.0], 0xb84a50, 0.92, { wave: 0.06, seed: 1.2 });
      const basalis = tissueSlab([-4.6, -3.3, 0], [8.0, 0.7, 3.0], 0xc86a78, 0.92, { wave: 0.07, seed: 2.3 });
      const funct = tissueSlab([-4.6, -2.95 + thick / 2, 0], [8.0, thick, 2.9], isMens ? 0x983040 : (isProlif ? 0xe88098 : 0xf29ab0), isMens ? 0.52 : 0.66, { wave: isMens ? 0.14 : 0.09, topOnly: true, seed: 3.5 });
      reg(EN, '子宮肌層與內膜基底層', 'Myometrium & stratum basalis', isProlif ? 'E₂ 主導：肌層興奮性上升，出現「由子宮頸朝向子宮底（cervico-fundal）」蠕動助運精！' : 'P₄ 主導：肌層保持安靜利於著床（肌底極少脫落）。', [myo, basalis], { anchor: [-8.6, -4.1, 0.6] });
      reg(EN, `內膜功能層（厚 ${thick.toFixed(1)} 單位）`, 'Stratum functionalis', isMens ? 'P₄ 撤退引起細胞凋亡與動脈痙攣，功能層崩解隨經血排出。' : isProlif ? '增生期：基質水腫與細胞分裂增厚，並大量合成助孕素受體（PR）。' : '分泌期：分泌醣蛋白養分與基質細胞肥大（脫膜前準備）。', funct, { anchor: [-8.4, -1.5, 0.6] });

      // 3 條腺體 + 3 條螺旋動脈
      const glMs = [], artMs = [];
      for (let i = 0; i < 3; i++) {
        const x = -7.0 + i * 2.4;
        const gPts = [];
        for (let k = 0; k <= 18; k++) {
          const u = k / 18, y = -3.0 + u * thick;
          const wig = isProlif ? 0.08 * Math.sin(u * 12) : (!isMens ? 0.38 * Math.sin(u * 20) : 0);
          gPts.push(V(x + wig, y, 0.5));
        }
        glMs.push(ttube(gPts, 0.14, 0xffe090, 0.9, { organic: false }));
        const aPts = [];
        for (let k = 0; k <= 24; k++) {
          const u = k / 24, y = -3.6 + u * (thick + 0.45);
          const rad = isMens ? 0.08 : isProlif ? 0.14 : 0.34;
          aPts.push(V(x + 0.9 + Math.cos(u * 22) * rad, y, 0.6 + Math.sin(u * 22) * rad));
        }
        artMs.push(ttube(aPts, isMens ? 0.04 : 0.09, 0xff4040, 0.92, { organic: false }));
      }
      reg(EN, '子宮內膜腺體（直管 → 扭曲分泌）', 'Endometrial glands', isProlif ? 'E₂ 期為直管分泌稀薄蛋白質液。' : 'P₄ 分泌期高度盤曲並分泌豐富肝醣／胺基酸營養（Fig 9.16）。', glMs, { anchor: [-7.0, 1.5, 0.6] });
      reg(EN, '螺旋動脈（Spiral arteries）', 'Spiral arteries', isMens ? 'P₄ 撤退引發螺旋動脈劇烈收縮缺血，隨後局部破裂與凝血控制出血。' : '在分泌期高度盤旋伸展至內膜表層準備供養著床胚胎。', artMs, { anchor: [-3.0, 1.5, 0.6] });

      // 右側：子宮頸黏液微結構（Muc5B 平行水性通道 vs 致密交叉網）與穿透精子
      const mucLines = [];
      for (let i = 0; i < 7; i++) {
        const y = -2.0 + i * 0.7;
        if (isOv) mucLines.push(cyl([2.0, y, 0], [8.2, y, 0], 0.06, 0x70e8ff, 0.7));
        else {
          mucLines.push(cyl([2.0, y, 0], [8.2, y + (i % 2 ? 0.9 : -0.9), 0], 0.09, 0xc8a0d8, 0.78));
          mucLines.push(cyl([2.4 + i * 0.8, -2.5, 0], [2.4 + i * 0.8, 2.5, 0], 0.08, 0xc8a0d8, 0.65));
        }
      }
      reg(CX, isOv ? '排卵期 Muc5B 水性平行通道' : '黃體／非排卵期稠密交叉黏液網', 'Cervical mucin meshwork',
        isOv ? '高 E₂ 誘發水性 Muc5B/Muc4 排列成平行隧道：牽絲度（spinnbarkeit）與羊齒結晶（ferning）最高，精子極易游過！（Fig 9.17）'
          : 'P₄ 主導下黏液量驟減、網孔緊密交叉，有效阻擋精子與病原體（亦為黃體素避孕藥核心機轉！）。',
        mucLines, { anchor: [5.2, 3.2, 0.5] });

      S3.sperms = [];
      const _spHG = spermHeadGeo(0.5, 0.26, 0.14);
      for (let i = 0; i < 5; i++) {
        const g = new THREE.Group();
        const hd = new THREE.Mesh(_spHG, mat(0xf6f2e8, 0.96)); hd.rotation.y = Math.PI;
        const tl = ttube([V(-0.22, 0, 0), V(-0.52, 0.08, 0.02), V(-0.82, -0.07, -0.02), V(-1.12, 0.05, 0)], [0.038, 0.015], 0xd0e2f2, 0.94, { organic: false, seg: 14, radial: 8 });
        g.add(hd, tl);
        g.position.set(2.5, -1.6 + i * 0.8, 0.4);
        CUR.root.add(g);
        S3.sperms.push(g);
      }
      reg(CX, '測試穿過黏液之精子', 'Penetrating spermatozoa', isOv ? '順利高速沿水性隧道游向子宮腔！' : '被交聯致密黏蛋白網卡住阻絕於陰道端！', S3.sperms.flatMap(g => g.children), { anchor: [2.5, -2.8, 0.5] });

      const phaseLbl = isMens ? `Day ${DAY3}：月經期（剝落出血）` : isProlif ? `Day ${DAY3}：增生期（E₂ 主導${isOv ? ' · 排卵窗口！' : ''}）` : `Day ${DAY3}：分泌期（P₄ 主導 · 基礎體溫↑）`;
      textSprite(phaseLbl, [0, 4.8, 0], 0.4, '#ffd479');

      const dt = dtClock();
      CUR.tick = () => {
        const d = S3.play ? dt() : 0; S3.t += d;
        S3.sperms.forEach((g, i) => {
          if (isOv) g.position.x = 2.5 + ((S3.t * 2.2 + i * 0.8) % 5.6);
          else g.position.x = 2.6 + Math.sin(S3.t * 6 + i) * 0.12;
        });
      };
    },
    panel(box) {
      slider(box, '月經週期天數 (Day 1–28)', 1, 28, DAY3, 1, v => { DAY3 = v; reloadKeep(); });
      btnRow(box, [
        ['🩸 Day 3 月經', () => { DAY3 = 3; reloadKeep(); }],
        ['💎 Day 13 排卵前 E₂', () => { DAY3 = 13; reloadKeep(); }],
        ['🌾 Day 22 黃體分泌', () => { DAY3 = 22; reloadKeep(); }]
      ]);
      const ch = mkCanvas(box, 290, 125);
      plot(ch, {
        title: 'Fig 9.17 子宮頸黏液特性與基礎體溫 (BBT)',
        x: [1, 28], y: [0, 1.05], xt: [1, 7, 14, 21, 28],
        vl: [{ x: DAY3, col: '#ffffff', label: 'D' + DAY3 }],
        series: [
          { f: d => 0.1 + 0.85 * Math.exp(-Math.pow((d - 13.5) / 1.8, 2)), col: '#70e8ff', label: '牽絲度/穿透', w: 2.2 },
          { f: d => d < 14.5 ? 0.25 : 0.25 + 0.55 * smooth((d - 14.5) / 2.5), col: '#ff8080', label: '基礎體溫 BBT', w: 2 }
        ]
      });
      checkbox(box, '播放精子穿透動畫', true, v => S3.play = v);
    }
  });

  /* ===== 場景④：哺乳類雌性生殖系統整體（母牛全貌，含寫實紋理與透視模式） ===== */
  (function () {
    const { TEX, ell, blob, tube, ttube, ribbon, lathe, vesselMesh, ring } = ANAT;
    SCENES.push({
      name: '④ 雌性解剖（母牛全貌）',
      title: '哺乳類雌性生殖系統比較解剖（以母牛為代表，左為尾側、右為頭側）',
      camera: { pos: [-0.3, 4.6, 9.0], target: [-0.5, -0.1, 0], fit: [3.2, 2.2] },
      controls: [
        { label: '🩸 顯示／隱藏 血管·淋巴·神經', fn() { const on = !CUR.parts.find(p => p.grp === '血管·淋巴·神經').visible; setGrpVisible(p => p.grp === '血管·淋巴·神經', on); } },
        { label: '🎗 顯示／隱藏 闊韌帶系膜', fn() { const on = !CUR.parts.find(p => p.grp === '韌帶').visible; setGrpVisible(p => p.grp === '韌帶', on); } },
        { label: '🔭 俯視（背側觀）', fn() { flyTo([-0.4, 11, 0.6], [-0.4, 0, 0]); } },
        { label: '🔭 斜側觀復位', fn() { flyHome(); } }
      ],
      desc: `
<p>左側為<b>尾側</b>（外陰），右側為<b>頭側</b>，上為背側（比例約 1 單位 ≈ 16 cm）。外陰至子宮頸、雙分子宮角、闊韌帶與血管淋巴神經皆可勾選開關。</p>
<p>預設為<b>寫實外觀</b>（器官壁不透明、表面佈滿漿膜血管與系膜脂肪）；勾選右上方<b>「透視模式（看內部構造）」</b>或直接點選內部構造（如肉阜、子宮頸圓環），系統即自動切換半透明透視！</p>
<p class="src">雷弟生物學 3D 比較解剖整合（詳見本頁 ⑥子宮壁 與 <a href="ch08.html#4">Ch.08 ⑤卵巢全剖面</a>）</p>`,
      build() {
        const SIDES = [1, -1];
        const G1 = '外生殖器（女陰）', G2 = '陰道與子宮頸', G3 = '子宮', G4 = '輸卵管與卵巢', G5 = '韌帶', G6 = '鄰近器官', G7 = '血管·淋巴·神經';

        reg(G1, '大陰唇', 'Labia majora', '女陰兩側有色素與毛髮的皮膚皺褶，保護前庭。',
          SIDES.map(s => blob([-3.3, -0.06, s * 0.12], [0.11, 0.36, 0.1], 0x7d5b5a, 1, { amp: 0.12, freq: 5, seed: s * 3 })), { anchor: [-3.3, 0.2, 0.15] });
        reg(G1, '小陰唇', 'Labia minora', '大陰唇內側黏膜皺褶（家畜較不明顯）。',
          SIDES.map(s => blob([-3.22, -0.08, s * 0.05], [0.06, 0.26, 0.025], 0xd77d8a, 1, { amp: 0.15, freq: 6, seed: 9 + s })), { anchor: [-3.2, -0.05, 0.06] });
        reg(G1, '陰蒂', 'Clitoris', '位於腹側聯合內與陰莖同源之勃起組織。', blob([-3.2, -0.36, 0], [0.05, 0.04, 0.045], 0xc0405f, 1, { amp: 0.1 }));
        reg(G1, '陰戶前庭', 'Vulvar vestibule', '泌尿生殖共同通道，底壁有外尿道口與尿道下憩室。',
          ttube([[-3.15, -0.05, 0], [-2.8, -0.02, 0], [-2.45, 0, 0]], 0.2, 0xd8959a, 0.4, { wob: 0.05, seed: 2 }), { wall: true });
        reg(G1, '外尿道口', 'External urethral orifice', '界定前庭與陰道分界。', ring(V(-2.45, -0.19, 0), V(0, 1, 0), 0.04, 0.015, 0x6a3030), { inner: true });
        reg(G1, '大前庭腺（巴多林氏腺）', "Bartholin's gland", '發情時分泌黏液潤滑通道，與雄性尿道球腺同源。',
          SIDES.flatMap(s => [blob([-2.72, -0.1, s * 0.27], [0.1, 0.07, 0.06], 0xe8c6b8, 1, { amp: 0.18, freq: 7, seed: s }), tube([[-2.72, -0.12, s * 0.23], [-2.85, -0.12, s * 0.15]], 0.012, 0xe8c6b8)]),
          { anchor: [-2.72, -0.05, 0.3] });
        const LV = [], rr = rnd(5);
        for (let k = 0; k < 9; k++) LV.push(ell([-3.05 + rr() * 0.35, -0.19 + rr() * 0.03, (rr() - 0.5) * 0.24], [0.022, 0.022, 0.022], 0xeed2c6));
        reg(G1, '小前庭腺（尿道旁腺）', "Skene's gland", '分布前庭黏膜的小型黏液腺。', LV, { anchor: [-2.9, -0.2, 0.1], inner: true });

        const vag = ttube([[-2.45, 0, 0], [-1.6, 0.02, 0], [-0.78, 0.04, 0]], 0.3, 0xe5a9ab, 0.3, { wob: 0.04, seed: 4 });
        vag.scale.y = 0.86;
        reg(G2, '陰道', 'Vagina', '交接器官與產道（母牛 25–30 cm，反芻獸上皮不角化）。', vag, { anchor: [-1.7, 0.3, 0.1], wall: true });
        reg(G2, '陰道穹窿', 'Fornix vaginae', '突入陰道之子宮頸周圍環狀凹弧。', ring(V(-0.85, 0.04, 0), V(1, 0, 0), 0.24, 0.045, 0xd98c9a, 0.85), { anchor: [-0.85, 0.3, 0.1], inner: true });
        reg(G2, '陰道後括約肌', 'Caudal sphincter', '位於陰道與前庭交界處。', ring(V(-2.45, 0, 0), V(1, 0, 0), 0.3, 0.03, 0xb85a5a));
        reg(G2, '前括約肌（母牛）', 'Cranial sphincter (cow)', '母牛特有的前括約肌。', ring(V(-2.2, 0.01, 0), V(1, 0, 0), 0.29, 0.025, 0xc46a6a));
        const cxRf = t => 0.235 + 0.008 * Math.sin(t * Math.PI * 4) * Math.sin(t * Math.PI);
        reg(G2, '子宮頸', 'Cervix', '厚壁僵硬如軟骨（8–10 cm），含黏液保護胎兒（詳見 Ch.10 ⑦子宮頸比較）。',
          [ttube([[-0.8, 0.04, 0], [-0.4, 0.05, 0], [0.0, 0.06, 0]], cxRf, 0xe6c6c6, 0.45, { wob: 0.03, seed: 5 }),
           lathe([[0.2, 0], [0.19, -0.05], [0.15, -0.1], [0.06, -0.13], [0.03, -0.12]], 0xe2bcc0, 0.6, [-0.8, 0.04, 0], [1, 0, 0])], { wall: true });
        reg(G2, '子宮頸圓環（牛常為 4 個）', 'Annular rings', '橫列 4 環互相嵌合封鎖管道，構成精子障壁（AI 需通過此處）。',
          [-0.66, -0.47, -0.28, -0.1].map(x => ring(V(x, 0.05, 0), V(1, 0, 0), 0.1, 0.05, 0xb05a72)), { anchor: [-0.4, 0.05, 0.14], inner: true });
        reg(G2, '子宮頸管', 'Cervical canal', '除發情受孕窗口與分娩外緊閉之曲折管道。', tube([[-0.92, 0.04, 0], [-0.4, 0.05, 0], [0.02, 0.06, 0]], 0.022, 0xfff0f4), { anchor: [-0.2, 0.06, 0], inner: true });
        reg(G2, '子宮頸外口', 'External os', '子宮頸通入陰道之開口。', ring(V(-0.925, 0.04, 0), V(1, 0, 0), 0.035, 0.016, 0x7a3048), { inner: true });

        const UC = 0xcf7480;
        const body = ttube([[0.0, 0.06, 0], [0.3, 0.07, 0], [0.62, 0.08, 0]], 0.26, UC, 0.55, { wob: 0.04, seed: 6 });
        reg(G3, '子宮體', 'Corpus uteri', '兩角在近子宮體處癒合使外貌較實際為大（假子宮體）。',
          [body, ...ANAT.surfVessels(body, { side: V(0, 1, 0), count: 5, spread: 1.8, vr: 0.008, seed: 3 })], { anchor: [0.3, 0.3, 0.1], wall: true });
        const HP = s => [[0.4, 0.07, s * 0.09], [0.75, 0.09, s * 0.12], [1.08, 0.08, s * 0.15], [1.45, 0.02, s * 0.25], [1.8, -0.2, s * 0.4], [1.92, -0.6, s * 0.55],
          [1.72, -0.95, s * 0.66], [1.36, -1.05, s * 0.73], [1.08, -0.86, s * 0.79], [1.02, -0.55, s * 0.85]];
        const hornRf = t => 0.17 - 0.1 * t;
        const horns = SIDES.map(s => ttube(HP(s), hornRf, UC, 0.55, { wob: 0.05, wobF: 2.5, seed: 7 + s, seg: 220 }));
        const HV = [];
        horns.forEach((h, k) => HV.push(...ANAT.surfVessels(h, { side: V(0, 0.75, SIDES[k] * 0.65), t0: 0.18, count: 13, spread: 2.0, vr: 0.0075, seed: 20 + k })));
        reg(G3, '子宮角', 'Cornua uteri', '雙分子宮角型呈綿羊角狀捲曲（處女牛一整圈，經產牛半圈）。', [...horns, ...HV], { anchor: [1.92, -0.6, 0.55], wall: true });
        reg(G3, '角間韌帶', 'Intercornual ligament', '連接兩子宮角癒合處分歧點。',
          ribbon([[1.05, 0.14, 0.13], [1.25, 0.1, 0.2], [1.42, 0.04, 0.24]], [[1.05, 0.14, -0.13], [1.25, 0.1, -0.2], [1.42, 0.04, -0.24]], 0xefd6cc, 0.6, 4, 0.03), { anchor: [1.2, 0.16, 0] });
        reg(G3, '子宮內中隔', 'Velum uteri (septum)', '分隔癒合處左右子宮腔之內中隔。', ribbon([[0.62, -0.1, 0], [1.1, -0.06, 0]], [[0.62, 0.24, 0], [1.1, 0.22, 0]], 0xf6c8d6, 0.6), { anchor: [0.85, 0.08, 0], inner: true });
        const CAR = [];
        horns.forEach(h => {
          const c = h.userData.curve, fr = c.computeFrenetFrames(40, false);
          for (let i = 2; i < 38; i += 3) for (let k = 0; k < 4; k++) {
            const t = i / 40, a = k * Math.PI / 2 + i * 0.5, r = hornRf(t) * 0.6;
            const p = c.getPointAt(t).addScaledVector(fr.normals[i], Math.cos(a) * r).addScaledVector(fr.binormals[i], Math.sin(a) * r);
            CAR.push(ell(p.toArray(), [0.032, 0.026, 0.032], 0xb5404f));
          }
        });
        reg(G3, '肉阜', 'Caruncles', '反芻獸非腺體洋菇狀突起（牛 70–120 個），妊娠時與絨毛葉結合成胎盤瘤（見本頁 ⑥子宮壁）。', CAR, { anchor: [1.45, 0.02, 0.32], inner: true });

        const OVC = s => [1.2, 0.06, s * 1.42], IST = [], AMP = [], INF = [], FIM = [], OST = [], UTJ = [], OVA = [];
        SIDES.forEach(s => {
          UTJ.push(blob([1.02, -0.5, s * 0.86], [0.05, 0.05, 0.05], 0xd78a92, 1, { amp: 0.1 }));
          const ib = new THREE.CatmullRomCurve3(PV([[1.02, -0.48, s * 0.86], [1.08, -0.33, s * 0.97], [1.22, -0.2, s * 1.07]]));
          IST.push(tube(helixAlong(ib, 0.035, 5, 0, 160), 0.017, 0xf0cdbd, 1, 2));
          const ab = new THREE.CatmullRomCurve3(PV([[1.22, -0.2, s * 1.07], [1.45, -0.16, s * 1.2], [1.57, 0.03, s * 1.27], [1.48, 0.2, s * 1.3]]));
          AMP.push(tube(helixAlong(ab, 0.05, 3.5, 1, 160), 0.028, 0xf2d2c0, 1, 2));
          const fc = V(1.4, 0.24, s * 1.36), dir = V(...OVC(s)).sub(fc).normalize();
          INF.push(lathe([[0.03, 0], [0.06, 0.05], [0.11, 0.1], [0.15, 0.13]], 0xf4cfc0, 0.75, fc.toArray(), dir.toArray()));
          const q = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), dir);
          for (let k = 0; k < 14; k++) {
            const a = k / 14 * Math.PI * 2, rim = V(Math.cos(a) * 0.15, 0.13, Math.sin(a) * 0.15).applyQuaternion(q).add(fc);
            const rl = 0.2 + 0.04 * Math.sin(k * 3), tip = V(Math.cos(a + 0.1) * rl, 0.18 + 0.03 * Math.cos(k * 2), Math.sin(a + 0.1) * rl).applyQuaternion(q).add(fc);
            FIM.push(ttube([rim, rim.clone().lerp(tip, 0.5).add(V(0, 0.015 * Math.sin(k * 2), 0)), tip], [0.014, 0.006], 0xf0aa9a));
          }
          OST.push(ring(fc.clone().addScaledVector(dir, 0.02), dir, 0.03, 0.01, 0x7a4038));
          OVA.push(blob(OVC(s), [0.19, 0.12, 0.11], 0xeee0d2, 1, { amp: 0.07, freq: 3, seed: 30 + s }));
          const rf = rnd(40 + s);
          for (let k = 0; k < 4; k++) {
            const d = V(rf() - 0.5, rf() * 0.8 + 0.1, s * (0.4 + rf() * 0.5)).normalize(), r = 0.025 + rf() * 0.02;
            OVA.push(ell([OVC(s)[0] + d.x * 0.19, OVC(s)[1] + d.y * 0.12, OVC(s)[2] + d.z * 0.11], [r, r, r], 0xd8e8ef, 0.6));
          }
        });
        reg(G4, '宮管接合', 'Uterotubal junction', '母牛此處形成「扭結」阻止胚提前進入，E₂ 下降時拉直。', UTJ, { anchor: [1.02, -0.5, 0.86] });
        reg(G4, '輸卵管峽部', 'Isthmus tubae uterinae', '較短壁厚，精子貯存庫（詳見 Ch.10 ⑥輸卵管）。', IST, { anchor: [1.1, -0.32, 0.98] });
        reg(G4, '輸卵管壺部', 'Ampulla tubae uterinae', '約占半長，受精作用發生部位。', AMP, { anchor: [1.5, -0.05, 1.25] });
        reg(G4, '漏斗（輸卵管漏斗）', 'Infundibulum', '排卵時主動「撿取」卵團，不完全包覆牛羊卵巢。', INF, { anchor: [1.4, 0.3, 1.36] });
        reg(G4, '輸卵管繖', 'Fimbriae tubae uterinae', '漏斗邊緣指狀皺褶。', FIM, { anchor: [1.3, 0.38, 1.3] });
        reg(G4, '輸卵管腹口', 'Ostium abdominale', '漏斗中央出口。', OST);
        reg(G4, '卵巢', 'Ovary', '牛羊杏仁形（3.5×2.5×1.5 cm），皮質在外表面突出濾泡與黃體。', OVA, { anchor: [1.2, 0, 1.55] });
        const gf = ell([1.07, 0.13, 1.5], [0.075, 0.075, 0.075], 0xd2e4ec, 0.55); gf.material.map = TEX.vnet;
        reg(G4, '成熟濾泡', 'Graafian follicle', '母牛排卵前直徑達 12–19 mm，表面富含微血管。', gf);
        reg(G4, '黃體', 'Corpus luteum', '分泌 P₄，牛馬含葉黃素呈橘黃色並常呈冠狀突出。',
          [blob([1.31, 0.1, -1.5], [0.09, 0.085, 0.075], 0xe8901c, 1, { amp: 0.1, freq: 4, seed: 51 }), blob([1.36, 0.15, -1.57], [0.045, 0.04, 0.04], 0xd9781a, 1, { amp: 0.12, seed: 52 })]);

        const MESO = [], MESOS = [], MESOV = [], ROUND = [], MV = [], MVv = [], FAT = [];
        SIDES.forEach(s => {
          const A = [[-0.7, 0.2, s * 0.18], [-0.3, 0.22, s * 0.2], [0.3, 0.3, s * 0.24], [0.9, 0.24, s * 0.22], [1.45, 0.14, s * 0.36], [1.8, -0.08, s * 0.5], [1.92, -0.5, s * 0.6]];
          const B = [[-0.7, 0.65, s * 0.95], [-0.3, 0.68, s * 1.0], [0.3, 0.7, s * 1.05], [0.9, 0.7, s * 1.08], [1.45, 0.68, s * 1.12], [1.8, 0.62, s * 1.15], [2.0, 0.55, s * 1.18]];
          MESO.push(ribbon(A, B, 0xf3ddd3, 0.28, 8, 0.07));
          const trunkC = new THREE.CatmullRomCurve3(A.map((a, i) => V(...a).lerp(V(...B[i]), 0.45))), rv = rnd(60 + s);
          MV.push({ pts: helixAlong(trunkC, 0.018, 16, s, 240), r: [0.016, 0.011] });
          MVv.push({ pts: trunkC.getPoints(60).map(p => p.add(V(0.02, 0.03, s * 0.012))), r: [0.024, 0.017] });
          for (let k = 0; k < 9; k++) {
            const f = (k + 0.3 + rv() * 0.4) / 9, T = trunkC.getPointAt(f), i = Math.min(A.length - 2, Math.floor(f * (A.length - 1))), u = f * (A.length - 1) - i;
            const E = V(...A[i]).lerp(V(...A[i + 1]), u).add(V((rv() - 0.5) * 0.06, 0, 0));
            const M1 = T.clone().lerp(E, 0.33).add(V((rv() - 0.5) * 0.07, 0, 0)), M2 = T.clone().lerp(E, 0.66).add(V((rv() - 0.5) * 0.07, 0, 0));
            MV.push({ pts: [T, M1, M2, E], r: [0.009, 0.004] });
            MVv.push({ pts: [T, M1, M2, E].map((p, j) => p.clone().add(V(0.025, 0.012 * (1 - j / 3), 0))), r: [0.012, 0.005] });
            if (k % 2 === 0) FAT.push(blob(T.clone().lerp(E, 0.2 + rv() * 0.2).toArray(), [0.06 + rv() * 0.04, 0.03, 0.022], 0xe8c25e, 0.95, { amp: 0.3, freq: 5, seed: k + s * 10 }));
          }
          MESOS.push(ribbon([[1.05, -0.45, s * 0.9], [1.22, -0.2, s * 1.07], [1.45, -0.14, s * 1.2], [1.57, 0.03, s * 1.27]], [[1.08, 0, s * 1.4], [1.15, 0.05, s * 1.42], [1.28, 0.06, s * 1.43], [1.38, 0.08, s * 1.42]], 0xf4e2d8, 0.3, 6, 0.03));
          MESOV.push(ribbon([[1.05, 0.12, s * 1.38], [1.2, 0.16, s * 1.38], [1.35, 0.12, s * 1.38]], [[1.05, 0.66, s * 1.22], [1.2, 0.68, s * 1.24], [1.4, 0.66, s * 1.25]], 0xf0dcd2, 0.32, 6, 0.03));
          ROUND.push(ttube([[1.65, -0.92, s * 0.66], [1.3, -1.25, s * 0.95], [0.7, -1.45, s * 1.15], [0.2, -1.55, s * 1.2]], 0.024, 0xe6c6bc, 1, { wob: 0.15, seed: s }));
        });
        reg(G5, '子宮系膜', 'Mesometrium', '闊韌帶最大部分，內含子宮動靜脈與脂肪；牛羊附著腸骨背外側使子宮捲如羊角。',
          [...MESO, vesselMesh(MV, 0xa3202c), vesselMesh(MVv, 0x5e2a5e), ...FAT], { anchor: [0.3, 0.55, 0.9] });
        reg(G5, '輸卵管系膜', 'Mesosalpinx', '支持輸卵管並形成物種差異之卵巢囊。', MESOS, { anchor: [1.3, -0.1, 1.25] });
        reg(G5, '卵巢系膜', 'Mesovarium', '支持卵巢（連續成腹股溝韌帶，與雄性睪丸引帶同源）。', MESOV, { anchor: [1.2, 0.5, 1.25] });
        reg(G5, '子宮圓韌帶', 'Round ligament of uterus', '走入腹股溝區維持子宮位置。', ROUND, { anchor: [0.7, -1.45, 1.15] });

        reg(G6, '直腸', 'Rectum', '背側比鄰，供臨床經直腸觸診卵巢與子宮。',
          ttube([[-3.35, 0.68, 0], [-2.2, 0.7, 0], [-0.5, 0.85, 0], [1.0, 0.98, 0], [2.4, 1.12, 0.15]], 0.24, 0xc4a090, 0.22, { wob: 0.08, seed: 12 }), { anchor: [-2.2, 0.95, 0] });
        reg(G6, '肛門', 'Anus', '陰門背側開口。', ring(V(-3.36, 0.68, 0), V(1, 0, 0), 0.12, 0.04, 0x6e4e36));
        reg(G6, '膀胱', 'Urinary bladder', '位於生殖道腹側。', blob([-0.7, -0.78, 0], [0.62, 0.4, 0.46], 0xf0d9b4, 0.35, { amp: 0.04 }));
        reg(G6, '尿道', 'Urethra', '走向前庭外尿道口。', tube([[-1.25, -0.62, 0], [-1.7, -0.5, 0], [-2.15, -0.34, 0], [-2.45, -0.21, 0]], 0.035, 0xf1dca0));

        const H = { hidden: true };
        reg(G7, '主動脈', 'Aorta', '卵巢動脈直接起源處。', tube([[-0.8, 1.38, 0], [1.0, 1.42, 0], [2.8, 1.48, 0]], 0.07, 0xd03030), Object.assign({ anchor: [0.5, 1.42, 0] }, H));
        const IIA = [], UA = [], OA = [], OV = [], VA = [];
        SIDES.forEach(s => {
          IIA.push(tube([[-0.8, 1.38, 0], [-1.2, 1.18, s * 0.35], [-1.8, 0.92, s * 0.45]], 0.045, 0xd03030));
          UA.push(tube([[-1.2, 1.18, s * 0.35], [-0.5, 0.82, s * 0.75], [0.3, 0.5, s * 0.62], [0.95, 0.3, s * 0.42], [1.55, 0.06, s * 0.42], [1.86, -0.35, s * 0.56], [1.8, -0.8, s * 0.64]], 0.03, 0xe03a3a));
          VA.push(tube([[-1.8, 0.92, s * 0.45], [-2.0, 0.5, s * 0.38], [-1.85, 0.25, s * 0.3], [-1.4, 0.2, s * 0.28]], 0.022, 0xe85050));
          const ob = new THREE.CatmullRomCurve3(PV([[2.4, 1.44, s * 0.06], [2.15, 1.15, s * 0.5], [1.8, 0.7, s * 1.05], [1.3, 0.2, s * 1.38]]));
          OA.push(tube(helixAlong(ob, 0.06, 7, 0, 260), 0.016, 0xff4040, 1, 2), tube([[1.6, 0.42, s * 1.2], [1.4, 0, s * 1.05], [1.15, -0.4, s * 0.92]], 0.015, 0xff4040));
          OV.push(tube([[2.55, 1.3, s * 0.12], [2.15, 1.15, s * 0.5], [1.8, 0.7, s * 1.05], [1.3, 0.2, s * 1.38]], 0.045, 0x4a6fd8));
        });
        reg(G7, '內腸骨動脈', 'Internal iliac artery', '子宮與陰道動脈主要來源（馬子宮動脈例外源於外腸骨動脈）。', IIA, Object.assign({ anchor: [-1.2, 1.18, 0.35] }, H));
        reg(G7, '子宮動脈', 'Uterine artery', '生殖道最大動脈；妊娠直腸觸診呈特徵性血流顫動（fremitus）。', UA, Object.assign({ anchor: [0.3, 0.5, 0.62] }, H));
        reg(G7, '卵巢動脈', 'Ovarian artery', '高度迂曲纏繞卵巢靜脈表面接收局部 PGF₂α 逆流交換。', OA, Object.assign({ anchor: [1.8, 0.75, 1.1] }, H));
        reg(G7, '卵巢靜脈', 'Ovarian vein', '輸送子宮 PGF₂α 至卵巢動脈溶解同側黃體（對照 Ch.8 ④實驗）。', OV, Object.assign({ anchor: [2.15, 1.15, 0.5] }, H));
        reg(G7, '陰道動脈', 'Vaginal artery', '供應陰道與前庭。', VA, Object.assign({ anchor: [-2.0, 0.5, 0.38] }, H));
        reg(G7, '主動脈淋巴結', 'Aortic lymph nodes', '排流卵巢與生殖道上段淋巴。',
          [ell([1.7, 1.32, 0.14], [0.07, 0.05, 0.05], 0x5fbf6a), ell([2.1, 1.35, -0.14], [0.07, 0.05, 0.05], 0x5fbf6a)], Object.assign({ anchor: [1.9, 1.33, 0.14] }, H));
        reg(G7, '薦腸骨淋巴結', 'Sacroiliac lymph nodes', '骨盆腔淋巴排流站（觸診臨床指標）。', SIDES.map(s => ell([-1.35, 1.12, s * 0.48], [0.08, 0.06, 0.06], 0x5fbf6a)), Object.assign({ anchor: [-1.35, 1.12, 0.48] }, H));
        const NP = [], UVP = [];
        SIDES.forEach(s => {
          const nb = new THREE.CatmullRomCurve3(PV([[2.3, 1.36, s * 0.12], [2.1, 1.1, s * 0.52], [1.75, 0.68, s * 1.07]]));
          NP.push(tube(helixAlong(nb, 0.1, 4, 2, 120), 0.009, 0xf2e04a, 1, 2), tube(helixAlong(nb, 0.1, 4, 4.5, 120), 0.009, 0xf2e04a, 1, 2));
          for (let k = 0; k < 5; k++) UVP.push(tube([[-1.7, 0.75, s * 0.42], [-1.35 + k * 0.12, 0.4 - k * 0.03, s * (0.36 - k * 0.01)], [-1.2 + k * 0.2, 0.12, s * 0.24]], 0.008, 0xf2e04a));
        });
        reg(G7, '卵巢神經叢', 'Ovarian plexus', 'T10–T11 交感縮血管＋副交感神經。', NP, Object.assign({ anchor: [2.1, 1.1, 0.6] }, H));
        reg(G7, '子宮陰道神經叢', 'Uterovaginal plexus', '支配子宮、子宮頸與陰道自律神經。', UVP, Object.assign({ anchor: [-1.35, 0.4, 0.36] }, H));
      }
    });
  })();

  /* ===== 場景⑤：哺乳類子宮四種型式比較（整合比較大體解剖） ===== */
  (function () {
    const { TEX, ell, blob, tube, ttube, ribbon, lathe, surfVessels, ring, cyl } = ANAT;
    const TYPE_VIEWS = [
      { pos: [0, 0.0, 18.5], target: [0, -0.6, 0], fit: [9.8, 4.6] },
      { pos: [-7.2, 0.2, 6.8], target: [-7.2, -0.4, 0], fit: [2.5, 2.5] },
      { pos: [-3.6, 0.2, 6.8], target: [-3.6, -0.4, 0], fit: [2.5, 2.5] },
      { pos: [0, 0.2, 6.8], target: [0, -0.4, 0], fit: [2.5, 2.5] },
      { pos: [3.6, 0.2, 6.8], target: [3.6, -0.4, 0], fit: [2.5, 2.5] },
      { pos: [7.2, 0.2, 6.8], target: [7.2, -0.4, 0], fit: [2.5, 2.5] }
    ];
    function typeFocus(k) {
      CUR.parts.forEach(p => p.label = k === 0 ? !!p.isTitle : (p.model === k));
      flyTo(window.camFit ? camFit(TYPE_VIEWS[k]) : TYPE_VIEWS[k].pos, TYPE_VIEWS[k].target);
    }
    SCENES.push({
      name: '⑤ 哺乳類子宮四型式',
      title: '哺乳類子宮的四種演化癒合型式比較（腹側觀）',
      camera: TYPE_VIEWS[0],
      controls: [
        { label: '🔍 全部並列（只標型式）', fn() { typeFocus(0); } },
        { label: '1 雙子宮（兔、鼠）', fn() { typeFocus(1); } },
        { label: '2a 雙分子宮角型（豬）', fn() { typeFocus(2); } },
        { label: '2b 雙分子宮角型（牛、羊）', fn() { typeFocus(3); } },
        { label: '3 雙分子宮型（馬）', fn() { typeFocus(4); } },
        { label: '4 單式子宮（人、靈長類）', fn() { typeFocus(5); } }
      ],
      desc: `
<p>由左到右展示哺乳類左右苗勒氏管（Müllerian ducts）從未癒合到完全癒合的演化光譜：</p>
<table>
  <tr><th>型式</th><th>核心構造差異</th><th>代表動物</th></tr>
  <tr><td><b>雙子宮 duplex</b></td><td>無子宮體，二子宮角各自帶獨立子宮頸（×2）</td><td>小鼠、大鼠、兔、豚鼠</td></tr>
  <tr><td><b>雙分子宮角 bicornis</b></td><td>子宮體小、子宮角極發達，單個子宮頸</td><td>豬（腸褶長角）、牛羊（羊角盤曲＋假子宮體）、犬貓</td></tr>
  <tr><td><b>雙分子宮 bipartitus</b></td><td>子宮體顯著，兩側角短且由短中隔隔開呈 T/Y 形</td><td>馬</td></tr>
  <tr><td><b>單式 simplex</b></td><td>完全癒合成單一梨形子宮體，無子宮角</td><td>人類與其他靈長類</td></tr>
</table>
<p class="src">雷弟生物學 3D 比較解剖整合（勾選「透視模式」可透視深色子宮腔與中隔分化！）</p>`,
      build() {
        const W = 0xcf7480, LUM = 0x7a1838, CX = 0xe2c0c2, VG = 0xe5a9ab, OV = 0xeee0d2, TB = 0xf0cdbd;
        let sd = 1;
        const tt = (pts, rf, col, o, opt = {}) => ttube(pts, rf, col, o, Object.assign({ wob: 0.04, seed: sd++ }, opt));
        const X = [0, -7.2, -3.6, 0, 3.6, 7.2];
        const off = (k, p) => [p[0] + X[k], p[1], p[2] || 0];
        const offs = (k, arr) => arr.map(p => off(k, p));
        const R = (k, grp, zh, en, info, meshes, opt = {}) => {
          if (opt.wall === undefined) opt.wall = /子宮角|子宮體|子宮頸|陰道|癒合部|子宮底/.test(zh) && !/外口/.test(zh);
          if (opt.inner === undefined) opt.inner = /子宮腔|中隔（短）|外口/.test(zh);
          const p = reg(grp, zh, en, info, meshes, opt); p.model = k; p.label = false; return p;
        };
        const title = (k, grp, zh, en, info, anchor) => {
          const p = reg(grp, zh, en, info, ell(off(k, anchor), [0.09, 0.09, 0.09], 0xffd479), { anchor: off(k, anchor) });
          p.model = k; p.isTitle = true; p.label = true; return p;
        };
        const vagina = (k, y1 = -1.45, y0 = -2.35) => tt(offs(k, [[0, y0, 0], [0, y1, 0]]), 0.3, VG, 0.3);
        const ovTube = (k, s, from, ov) => {
          const c = new THREE.CatmullRomCurve3(PV(offs(k, [from, [(from[0] + ov[0]) / 2 + s * 0.12, (from[1] + ov[1]) / 2 + 0.15, 0.05], [ov[0] - s * 0.05, ov[1] + 0.2, 0.1]])));
          return tube(helixAlong(c, 0.04, 5, 0, 140), 0.02, TB, 1, 2);
        };
        const SIDES = [1, -1];

        let G = '1 雙子宮 uterus duplex（兔）';
        title(1, G, '雙子宮（兔、鼠）', 'Uterus duplex', '無子宮體，二子宮角完全分離並各自具子宮頸管開口入陰道。', [0, -2.75, 0]);
        textSprite('雙子宮', off(1, [0, -3.35, 0]), 0.75, '#ffd479', 'uterus duplex｜兔、鼠');
        const dU = [], dL = [], dC = [], dO = [], dT = [], dV = [];
        SIDES.forEach(s => {
          const P = [[s * 0.15, -1.0, 0], [s * 0.35, -0.3, 0], [s * 0.62, 0.4, 0], [s * 0.82, 0.95, 0]];
          dU.push(tt(offs(1, P), [0.15, 0.1], W, 0.4)); dL.push(tt(offs(1, P), [0.06, 0.04], LUM, 1));
          dC.push(tt(offs(1, [[s * 0.14, -1.6, 0], [s * 0.15, -1.0, 0]]), 0.1, CX, 0.6), tt(offs(1, [[s * 0.14, -1.62, 0], [s * 0.15, -0.98, 0]]), 0.025, LUM));
          dV.push(ring(V(...off(1, [s * 0.14, -1.62, 0])), V(0, 1, 0), 0.05, 0.018, 0x6a2040));
          dO.push(blob(off(1, [s * 1.05, 1.3, 0]), [0.14, 0.09, 0.09], OV, 1, { amp: 0.08, freq: 3 }));
          dT.push(ovTube(1, s, [s * 0.82, 0.98, 0], [s * 1.05, 1.3, 0]));
        });
        R(1, G, '子宮角（左右完全分離）', 'Cornua uteri (separate)', '兩側完全分離沒有子宮體。', dU, { anchor: off(1, [0.62, 0.4, 0]) });
        R(1, G, '子宮腔（兩個獨立）', 'Uterine lumen ×2', '互不相通的雙子宮腔。', dL, { anchor: off(1, [-0.35, -0.3, 0]) });
        R(1, G, '子宮頸 ×2', 'Two cervices', '雙子宮特徵：兩個獨立子宮頸管。', dC, { anchor: off(1, [0.15, -1.3, 0]) });
        R(1, G, '子宮頸外口 ×2', 'Two external os', '各自開口入陰道。', dV, { anchor: off(1, [-0.14, -1.62, 0]) });
        R(1, G, '陰道（單一）', 'Vagina', '陰道單一。', vagina(1, -1.55), { anchor: off(1, [0.25, -2.0, 0]) });
        R(1, G, '輸卵管', 'Oviduct', '連接角端與卵巢。', dT, { anchor: off(1, [0.95, 1.2, 0]) });
        R(1, G, '卵巢', 'Ovary', '鼠、大鼠卵巢受卵巢囊完全包圍。', dO, { anchor: off(1, [-1.05, 1.3, 0]) });

        G = '2a 雙分子宮角型 uterus bicornis（豬）';
        title(2, G, '雙分子宮角型（豬）', 'Uterus bicornis (sow)', '子宮體很短，子宮角極長屈曲如小腸以容納多胎；單一長螺旋子宮頸。', [0, -2.75, 0]);
        textSprite('雙分子宮角型（豬）', off(2, [0, -3.35, 0]), 0.75, '#ffd479', 'uterus bicornis｜豬、狗、貓');
        R(2, G, '子宮體（很短）', 'Corpus uteri (short)', '豬子宮體僅 ~5 cm。', [tt(offs(2, [[0, -0.95, 0], [0, -0.68, 0]]), 0.2, W, 0.4), tt(offs(2, [[0, -0.97, 0], [0, -0.66, 0]]), 0.08, LUM)], { anchor: off(2, [0, -0.8, 0]) });
        const pH = [], pL = [], pO = [], pT = [];
        SIDES.forEach(s => {
          const P = [];
          for (let i = 0; i <= 40; i++) { const t = i / 40; P.push([s * (0.18 + 0.55 * t + 0.28 * Math.sin(t * 14)), -0.68 + 1.75 * t, 0.35 * Math.cos(t * 14)]); }
          pH.push(tt(offs(2, P), [0.12, 0.09], W, 0.45, { seg: 400 })); pL.push(tt(offs(2, P), 0.04, LUM, 1, { seg: 400 }));
          const tip = P[P.length - 1];
          for (let j = 0; j < 9; j++) pO.push(ell(off(2, [tip[0] + s * 0.3 + Math.cos(j * 2.1) * 0.1, tip[1] + 0.32 + Math.sin(j * 1.7) * 0.1, Math.sin(j * 2.9) * 0.08]), [0.06, 0.06, 0.06], j % 3 ? 0xd9eaf5 : 0xf2a0a0));
          pT.push(ovTube(2, s, tip, [tip[0] + s * 0.3, tip[1] + 0.3, 0]));
        });
        R(2, G, '子宮角（長而摺疊屈曲）', 'Cornua uteri (convoluted)', '可達 1–1.5 m 如腸管般盤繞。', pH, { anchor: off(2, [0.6, 0.3, 0.3]) });
        R(2, G, '子宮腔', 'Uterine lumen', '於短小子宮體匯合。', pL, { anchor: off(2, [-0.5, 0, 0]) });
        R(2, G, '子宮頸（單一、長）', 'Cervix (single, long)', '呈螺旋狀圓環與公豬螺旋陰莖配合（無精子障礙）。',
          [tt(offs(2, [[0, -1.75, 0], [0, -0.95, 0]]), 0.15, CX, 0.55), tube(helixAlong(new THREE.LineCurve3(V(...off(2, [0, -1.72, 0])), V(...off(2, [0, -0.98, 0]))), 0.07, 5, 0, 200), 0.025, 0x9a4468, 1, 2)], { anchor: off(2, [0, -1.35, 0]) });
        R(2, G, '陰道', 'Vagina', '單一陰道。', vagina(2, -1.75, -2.4), { anchor: off(2, [0.25, -2.1, 0]) });
        R(2, G, '卵巢（葡萄串狀）', 'Ovary (grape-like)', '多濾泡多黃體突出如葡萄串。', pO, { anchor: off(2, [-1.3, 1.45, 0]) });
        R(2, G, '輸卵管', 'Oviduct', '宮管接合防止多精入卵。', pT, { anchor: off(2, [1.1, 1.2, 0]) });

        G = '2b 雙分子宮角型 uterus bicornis（牛、羊）';
        title(3, G, '雙分子宮角型（牛、羊）', 'Uterus bicornis (cow, ewe)', '近子宮體處癒合（假子宮體）＋羊角狀捲曲子宮角＋4 圓環子宮頸。', [0, -2.75, 0]);
        textSprite('雙分子宮角型（牛）', off(3, [0, -3.35, 0]), 0.75, '#ffd479', 'uterus bicornis｜反芻獸');
        R(3, G, '子宮體（實際很小）', 'Corpus uteri', '子宮頸前方短段才是真子宮體。', [tt(offs(3, [[0, -0.95, 0], [0, -0.75, 0]]), 0.24, W, 0.4), tt(offs(3, [[0, -0.97, 0], [0, -0.74, 0]]), 0.09, LUM)], { anchor: off(3, [0, -0.85, 0]) });
        const cH = [], cL = [], cO = [], cT = [];
        SIDES.forEach(s => {
          const P = [[s * 0.07, -0.78, 0], [s * 0.1, -0.35, 0], [s * 0.22, 0.05, 0], [s * 0.5, 0.35, -0.08], [s * 0.85, 0.3, -0.28], [1.0, 0, -0.45], [0.88, -0.3, -0.52], [0.66, -0.25, -0.46]];
          cH.push(tt(offs(3, P), [0.14, 0.07], W, 0.45)); cL.push(tt(offs(3, P), [0.05, 0.03], LUM));
          cO.push(blob(off(3, [s * 0.75, 0.2, -0.75]), [0.15, 0.09, 0.09], OV, 1, { amp: 0.08, freq: 3 }));
          cT.push(ovTube(3, s, [s * 0.66, -0.25, -0.46], [s * 0.75, 0.05, -0.75]));
        });
        R(3, G, '子宮角（羊角狀捲曲）', 'Cornua uteri', '具有綿羊角狀螺旋彎曲。', cH, { anchor: off(3, [0.95, 0.1, -0.4]) });
        R(3, G, '癒合部（假子宮體）＋中隔', 'Fused horns + velum uteri', '外觀癒合、內部仍以子宮內中隔分腔。',
          [ell(off(3, [0, -0.42, 0]), [0.27, 0.42, 0.18], W, 0.25), ribbon(offs(3, [[0, -0.75, -0.12], [0, -0.05, -0.1]]), offs(3, [[0, -0.75, 0.12], [0, -0.05, 0.1]]), 0xf6c8d6, 0.7)], { anchor: off(3, [-0.25, -0.4, 0]) });
        R(3, G, '角間韌帶', 'Intercornual ligament', '固定分歧點使外觀如羊角。', cyl(off(3, [-0.2, 0.07, 0.05]), off(3, [0.2, 0.07, 0.05]), 0.03, 0xc58cb0), { anchor: off(3, [0, 0.1, 0.08]) });
        R(3, G, '子宮腔', 'Uterine lumen', '至真子宮體始匯合。', cL, { anchor: off(3, [-0.5, 0.35, -0.08]) });
        R(3, G, '子宮頸（4 個圓環）', 'Cervix with annular rings', '4 個橫列圓環嵌合形成精子障壁。', [tt(offs(3, [[0, -1.55, 0], [0, -0.95, 0]]), 0.17, CX, 0.5), ...[-1.45, -1.3, -1.15, -1.02].map(y => ring(V(...off(3, [0, y, 0])), V(0, 1, 0), 0.08, 0.04, 0x9a4468))], { anchor: off(3, [0, -1.25, 0]) });
        R(3, G, '陰道', 'Vagina', '反芻獸陰道不角化。', vagina(3, -1.55), { anchor: off(3, [0.25, -2.0, 0]) });
        R(3, G, '卵巢（杏仁狀）', 'Ovary (almond-shaped)', '牛羊杏仁形卵巢。', cO, { anchor: off(3, [-0.75, 0.2, -0.75]) });
        R(3, G, '輸卵管', 'Oviduct', '宮管接合有扭結調控。', cT, { anchor: off(3, [0.75, -0.2, -0.65]) });

        G = '3 雙分子宮 uterus bipartitus（馬）';
        title(4, G, '雙分子宮型（馬）', 'Uterus bipartitus (mare)', '子宮體大而顯著，僅前端具短中隔分出較短子宮角呈 T/Y 字形。', [0, -2.75, 0]);
        textSprite('雙分子宮型（馬）', off(4, [0, -3.35, 0]), 0.75, '#ffd479', 'uterus bipartitus｜馬');
        R(4, G, '子宮體（大而顯著）', 'Corpus uteri (large)', '約占馬子宮一半體積。', [tt(offs(4, [[0, -1.0, 0], [0, -0.4, 0], [0, 0.12, 0]]), 0.34, W, 0.4), tt(offs(4, [[0, -1.02, 0], [0, 0, 0]]), 0.17, LUM)], { anchor: off(4, [0.3, -0.5, 0]) });
        R(4, G, '中隔（短）', 'Short septum', '短段中隔不完全隔開兩側角。', ribbon(offs(4, [[0, 0, -0.13], [0, 0.22, -0.1]]), offs(4, [[0, 0, 0.13], [0, 0.22, 0.1]]), 0xf6c8d6, 0.85), { anchor: off(4, [0, 0.12, 0]) });
        const mH = [], mL = [], mO = [], mT = [];
        SIDES.forEach(s => {
          const P = [[s * 0.1, 0.05, 0], [s * 0.45, 0.25, 0], [s * 0.85, 0.35, 0], [s * 1.15, 0.5, 0]];
          mH.push(tt(offs(4, P), [0.2, 0.11], W, 0.45)); mL.push(tt(offs(4, P), [0.08, 0.04], LUM));
          mO.push(blob(off(4, [s * 1.35, 0.95, 0]), [0.22, 0.14, 0.13], OV, 1, { amp: 0.08, freq: 3 }), ell(off(4, [s * 1.35, 0.83, 0.1]), [0.06, 0.03, 0.04], 0x5a3a3a));
          mT.push(ovTube(4, s, [s * 1.15, 0.52, 0], [s * 1.33, 0.82, 0]));
        });
        R(4, G, '子宮角（較短，向兩側）', 'Cornua uteri (short)', '向兩側平展。', mH, { anchor: off(4, [0.85, 0.35, 0]) });
        R(4, G, '子宮腔', 'Uterine lumen', '大腔室於中隔後匯合。', mL, { anchor: off(4, [-0.6, 0.25, 0]) });
        R(4, G, '子宮頸（短、縱褶突入陰道）', 'Cervix (longitudinal folds)', '縱行皺摺顯著且深突入陰道，無精子障壁。',
          [tt(offs(4, [[0, -1.4, 0], [0, -1.0, 0]]), 0.17, CX, 0.5), ...[0, 1, 2, 3, 4, 5].map(j => { const a = j / 6 * Math.PI * 2; return tube(offs(4, [[Math.cos(a) * 0.09, -1.75, Math.sin(a) * 0.09], [Math.cos(a) * 0.09, -1.4, Math.sin(a) * 0.09], [Math.cos(a) * 0.08, -1.02, Math.sin(a) * 0.08]]), 0.028, 0x9a4468); })], { anchor: off(4, [0, -1.25, 0]) });
        R(4, G, '陰道', 'Vagina', '單一陰道。', vagina(4, -1.4), { anchor: off(4, [0.25, -2.0, 0]) });
        R(4, G, '卵巢（豆形）＋排卵窩', 'Ovary + ovulation fossa', '豆形卵巢僅自排卵窩排卵。', mO, { anchor: off(4, [1.35, 1.05, 0]) });
        R(4, G, '輸卵管', 'Oviduct', '卵巢囊僅包圍排卵窩。', mT, { anchor: off(4, [-1.25, 0.7, 0]) });

        G = '4 單式子宮 uterus simplex（人）';
        title(5, G, '單式子宮（人、靈長類）', 'Uterus simplex', '完全癒合為單一梨形子宮體，無子宮角。', [0, -2.75, 0]);
        textSprite('單式子宮', off(5, [0, -3.35, 0]), 0.75, '#ffd479', 'uterus simplex｜人、靈長類');
        const hBody = lathe([[0, -1.0], [0.2, -1.0], [0.28, -0.7], [0.42, -0.2], [0.5, 0.15], [0.45, 0.4], [0.25, 0.55], [0, 0.58]], W, 0.4, off(5, [0, 0, 0]));
        hBody.material.map = TEX.vnet;
        R(5, G, '子宮體（梨形）', 'Corpus uteri (pear-shaped)', '梨形單一腔室，內膜分功能層與基底層（見本頁 ⑥子宮壁）。', hBody, { anchor: off(5, [0.45, -0.3, 0]) });
        const hCav = lathe([[0, -0.95], [0.05, -0.95], [0.12, -0.5], [0.3, 0.2], [0.32, 0.36], [0, 0.4]], LUM, 1, off(5, [0, 0, 0])); hCav.scale.z = 0.25;
        R(5, G, '子宮腔（倒三角形）', 'Uterine cavity', '冠狀剖面呈倒三角形。', hCav, { anchor: off(5, [0, -0.2, 0]) });
        R(5, G, '子宮底', 'Fundus uteri', '輸卵管連線以上之圓頂。', ell(off(5, [0, 0.52, 0]), [0.3, 0.08, 0.25], 0xd8708e, 0.8), { anchor: off(5, [0, 0.6, 0]) });
        const hT = [], hO = [], hF = [];
        SIDES.forEach(s => {
          hT.push(tube(offs(5, [[s * 0.42, 0.35, 0], [s * 0.75, 0.42, 0], [s * 1.05, 0.38, 0.05], [s * 1.25, 0.15, 0.1]]), 0.04, TB));
          for (let j = 0; j < 7; j++) hF.push(tube(offs(5, [[s * 1.25, 0.15, 0.1], [s * (1.3 + 0.08 * Math.cos(j)), 0 - j * 0.02, 0.1 + 0.1 * Math.sin(j * 1.3)]]), 0.012, 0xf4a87c));
          hO.push(blob(off(5, [s * 0.95, -0.05, -0.05]), [0.2, 0.11, 0.1], OV, 1, { amp: 0.08, freq: 3 }), cyl(off(5, [s * 0.45, 0.15, -0.03]), off(5, [s * 0.78, -0.02, -0.05]), 0.02, 0xc58cb0));
        });
        R(5, G, '輸卵管', 'Fallopian tube', '直接自子宮底兩側伸出。', hT, { anchor: off(5, [0.8, 0.45, 0]) });
        R(5, G, '輸卵管繖', 'Fimbriae', '指狀皺褶接卵。', hF, { anchor: off(5, [-1.32, 0, 0.1]) });
        R(5, G, '卵巢（＋卵巢固有韌帶）', 'Ovary + ovarian ligament', '以卵巢固有韌帶連於子宮底側角。', hO, { anchor: off(5, [0.95, -0.15, 0]) });
        R(5, G, '子宮頸（內／外子宮頸）', 'Cervix', '分柱狀內子宮頸與複層鱗狀外子宮頸（詳見 Ch.10 ⑦子宮頸）。', tt(offs(5, [[0, -1.5, 0], [0, -0.98, 0]]), 0.17, CX, 0.5), { anchor: off(5, [0, -1.25, 0]) });
        R(5, G, '陰道', 'Vagina', '複層鱗狀上皮。', vagina(5, -1.5), { anchor: off(5, [0.25, -2.0, 0]) });

        CUR.parts.filter(p => p.model && /子宮角|子宮體/.test(p.zh)).forEach((p, k) => {
          p.meshes.slice().forEach(m => {
            if (!m.userData.rf || m.material.userData.hex !== W) return;
            const L = m.userData.curve.getLength();
            surfVessels(m, { side: V(0, 0, -1), count: Math.max(2, Math.round(L / 0.22)), spread: 2.0, vr: 0.008, seed: 70 + k }).forEach(v => { v.userData.part = p; p.meshes.push(v); CUR.root.add(v); });
          });
        });
      }
    });
  })();

  /* ===== 場景⑥：子宮壁三層比較（家畜內膜、反芻類肉阜/胎盤瘤、靈長類月經機能層） ===== */
  (function () {
    const { ell, tube, lathe, box, cyl } = ANAT;
    SCENES.push({
      name: '⑥ 子宮壁分層與週期',
      title: '子宮壁解剖比較：家畜壁分層、肉阜／胎盤瘤與靈長類月經內膜',
      camera: { pos: [0.6, 3.2, 10.5], target: [0.6, 0.7, 0], fit: [7.6, 3.6] },
      controls: [
        { label: '🔁 家畜內膜：發情期 ⇄ 動情間期後期', fn() { window._uState && window._uState(); } },
        { label: '🔁 絨毛葉：結合 ⇄ 分開', fn() { window._cotToggle && window._cotToggle(); } },
        { label: '🔁 靈長類：月經（功能層脫落）⇄ 增生', fn() { window._mensToggle && window._mensToggle(); } },
        { label: '🔍 全圖總覽', fn() { flyHome(); } },
        { label: '🔍 子宮壁分層', fn() { flyTo([-3.0, 2.0, 5.2], [-3.0, 1.0, 0]); } },
        { label: '🔍 肉阜／胎盤瘤', fn() { flyTo([0.6, 2.2, 4.8], [0.6, 0.9, 0]); } },
        { label: '🔍 靈長類內膜', fn() { flyTo([4.3, 2.0, 5.0], [4.3, 1.0, 0]); } }
      ],
      desc: `
<p>比較三大子宮組織結構（外膜 → 縱肌／血管層／環肌 → 內膜）：<b>左</b>為家畜發情/間期切換（含母牛 metrorrhagia 與犬週期差異）；<b>中</b>為反芻獸洋菇狀<b>肉阜</b>與胎兒絨毛葉構成<b>胎盤瘤（placentome）</b>；<b>右</b>為靈長類具螺旋動脈之功能層月經脫落機制。</p>
<p class="src">雷弟生物學 3D 比較解剖整合（搭配肌纖維束平滑肌貼圖與螺旋動脈）</p>`,
      build() {
        const SE = 0xf2e6d8, ML = 0xc9765c, MC = 0xb0563f, VL = 0xd88690, SM = 0xdc98a2, LP = 0xedb2ba, EP = 0xf4e3a0, GL = 0x9c5aae;
        const G1 = '子宮壁分層（家畜）', G2 = '反芻獸肉阜與胎盤瘤', G3 = '靈長類子宮內膜';
        const W = 2.6, Dp = 1.4;

        const AX = -3.0, Lb = (y0, y1, col, o = 1, ex = {}) => box([AX, (y0 + y1) / 2, 0], [W, y1 - y0, Dp], col, o, ex);
        reg(G1, '子宮外膜', 'Perimetrium', '最外層漿膜（腹膜）與中皮。', Lb(0, 0.06, SE), { anchor: [AX + 1.3, 0.03, 0.7] });
        reg(G1, '縱行肌層（外層）', 'Longitudinal muscle', '子宮肌膜外層平滑肌。', Lb(0.06, 0.4, ML, 1, { tex: 'fiber', bump: 2 }), { anchor: [AX + 1.3, 0.23, 0.7] });
        const VES = [Lb(0.4, 0.62, VL)];
        [-0.9, -0.3, 0.3, 0.9].forEach((x, k) => VES.push(cyl([AX + x, 0.51, -0.72], [AX + x, 0.51, 0.72], 0.07, k % 2 ? 0x4a6fd8 : 0xd03030)));
        reg(G1, '血管層', 'Stratum vasculare', '含重要子宮動靜脈分枝。', VES, { anchor: [AX + 1.3, 0.51, 0.7] });
        reg(G1, '環狀肌層（內層）', 'Circular muscle', '懷孕時肌細胞數目與體積劇增並於分娩強烈收縮。', Lb(0.62, 1.0, MC, 1, { tex: 'fiberV', bump: 2 }), { anchor: [AX + 1.3, 0.81, 0.7] });
        const ENDO = [], sub = Lb(1.0, 1.2, SM), lp = Lb(1.2, 1.95, LP, 0.45), ep = Lb(1.95, 2.0, EP);
        ENDO.push(lp, ep);
        reg(G1, '黏膜下層', 'Submucosa', '緻密不規則結締組織，子宮腺遠端深入處。', sub, { anchor: [AX + 1.3, 1.1, 0.7] });
        reg(G1, '固有層', 'Lamina propria', '水腫增厚並於母牛發情時呈微量固有層出血 (metrorrhagia)。', lp, { anchor: [AX + 1.3, 1.55, 0.7] });
        reg(G1, '子宮內膜上皮', 'Endometrial epithelium', '單層柱狀纖毛與分泌細胞。', ep, { anchor: [AX + 1.3, 1.98, 0.7] });
        const GLS = [], rg = rnd(31);
        for (let k = 0; k < 9; k++) {
          const x0 = AX - 1.1 + k * 0.27, z0 = (rg() - 0.5) * 0.9, pts = [];
          for (let i = 0; i <= 16; i++) { const t = i / 16; pts.push([x0 + 0.05 * Math.sin(t * 14 + k), 1.98 - t * 0.88, z0 + 0.05 * Math.cos(t * 14 + k)]); }
          GLS.push(tube(pts, 0.03, GL));
          const e = pts[16];
          GLS.push(tube([[e[0], e[1] + 0.12, e[2]], [e[0] + 0.1, e[1] - 0.02, e[2] + 0.04], [e[0] + 0.13, e[1] - 0.1, e[2]]], 0.025, GL));
          GLS.push(tube([[e[0], e[1] + 0.2, e[2]], [e[0] - 0.1, e[1] + 0.05, e[2] - 0.03], [e[0] - 0.12, e[1] - 0.04, e[2]]], 0.025, GL));
        }
        ENDO.push(...GLS);
        reg(G1, '子宮腺', 'Uterine glands', '單分枝管狀腺，分泌「子宮乳」滋養早期胚。', GLS, { anchor: [AX - 1.0, 1.5, 0.5] });
        const HEM = [], rh = rnd(41);
        for (let k = 0; k < 14; k++) HEM.push(ell([AX + (rh() - 0.5) * 2.3, 1.3 + rh() * 0.6, (rh() - 0.5) * 1.2], [0.035, 0.035, 0.035], 0xc01020));
        const hemP = reg(G1, '固有層出血（發情時）', 'Metrorrhagia', '母牛發情時微量出血（非機能層脫落之月經）。', HEM, { anchor: [AX + 0.6, 1.6, 0.6] });
        ENDO.push(...HEM);
        textSprite('子宮腔', [AX, 2.45, 0], 0.26, '#8fd0ff');
        textSprite('家畜子宮壁分層', [AX, 2.85, 0], 0.32);
        ENDO.forEach(m => m.userData.y0 = m.position.y);
        let estrus = true;
        window._uState = () => {
          estrus = !estrus; const k = estrus ? 1 : 0.55;
          ENDO.forEach(m => { m.position.y = 1.2 + (m.userData.y0 - 1.2) * k; m.scale.y = k; });
          ep.position.y = 1.2 + (ep.userData.y0 - 1.2) * k; ep.scale.y = 1;
          hemP.visible = estrus; rebuildList(); refresh();
          select(hemP.visible ? hemP : CUR.parts.find(p => p.zh === '子宮腺'));
          $('info').insertAdjacentHTML('afterbegin', `<div class="g" style="background:#7a5a10">目前：${estrus ? '發情期（內膜增厚充血＋微量出血）' : '動情間期後期（黃體萎縮 → 內膜萎縮、腺體縮短）'}</div>`);
        };

        const BX = 0.6;
        reg(G2, '肉阜間區內膜', 'Intercaruncular endometrium', '含正常子宮腺的平滑內膜區。',
          [box([BX, 0.3, 0], [W, 0.6, Dp], LP, 0.6), ...[-1.0, -0.75, 0.75, 1.0].map(x => tube([[BX + x, 0.58, 0.2], [BX + x + 0.04, 0.35, 0.15], [BX + x, 0.12, 0.2]], 0.03, GL))], { anchor: [BX - 1.1, 0.3, 0.7] });
        const car = lathe([[0, 0.55], [0.3, 0.55], [0.3, 0.75], [0.62, 0.88], [0.7, 1.05], [0.6, 1.18], [0, 1.22]], 0xc0405a, 1, [BX, 0, 0]);
        const CRY = [];
        for (let k = 0; k < 18; k++) { const a = k * 2.4, r = 0.12 + (k % 6) * 0.08; CRY.push(ell([BX + Math.cos(a) * r, 1.2 - r * 0.25, Math.sin(a) * r], [0.035, 0.03, 0.035], 0x4a1020)); }
        reg(G2, '肉阜', 'Caruncle', '反芻獸高度血管化且無腺體之洋菇狀突起（牛 70–120 個，馬豬缺如）。', car, { anchor: [BX + 0.6, 0.85, 0.3] });
        reg(G2, '肉阜隱窩', 'Caruncular crypts', '容納胎盤絨毛葉的海綿狀表面凹穴。', CRY, { anchor: [BX - 0.3, 1.2, 0.3] });
        const COT = [], rcz = rnd(51), chor = box([BX, 1.55, 0], [W, 0.06, Dp], 0x9a7ac8, 0.85), cap = lathe([[0, 1.5], [0.75, 1.5], [0.72, 1.35], [0.6, 1.25], [0, 1.22]], 0x8a5ab8, 0.5, [BX, 0, 0]);
        COT.push(cap);
        for (let k = 0; k < 16; k++) {
          const a = k * 2.4, r = 0.1 + (k % 5) * 0.11, x = BX + Math.cos(a) * r, z = Math.sin(a) * r;
          COT.push(tube([[x, 1.5, z], [x + (rcz() - 0.5) * 0.06, 1.3, z], [x, 1.1 - (0.3 - r * 0.3), z]], 0.022, 0x6a3a98));
        }
        reg(G2, '絨毛膜', 'Chorion', '胎盤最外層胎膜。', chor, { anchor: [BX - 1.1, 1.55, 0.7] });
        reg(G2, '絨毛葉', 'Cotyledon', '指狀侵入母體肉阜隱窩嵌合交換物質。', COT, { anchor: [BX + 0.75, 1.45, 0.2] });
        reg(G2, '胎盤瘤', 'Placentome', '胎兒絨毛葉＋母體肉阜＝反芻獸子葉型交換單元。', ell([BX, 1.05, 0], [0.95, 0.65, 0.95], 0xffd479, 0.1), { anchor: [BX - 0.9, 1.05, 0.3] });
        textSprite('反芻獸：肉阜＋絨毛葉＝胎盤瘤', [BX, 2.45, 0], 0.3);
        let apart = false;
        window._cotToggle = () => {
          apart = !apart; const dy = apart ? 0.75 : 0;
          [chor, ...COT].forEach(m => { if (m.userData.b === undefined) m.userData.b = m.position.y; m.position.y = m.userData.b + dy; });
        };

        const CX = 4.3, Lc = (y0, y1, col, o = 1, ex = {}) => box([CX, (y0 + y1) / 2, 0], [W, y1 - y0, Dp], col, o, ex);
        reg(G3, '子宮肌層', 'Myometrium', '平滑肌基底支撐。', Lc(0, 0.4, MC, 1, { tex: 'fiber', bump: 2 }), { anchor: [CX + 1.3, 0.2, 0.7] });
        reg(G3, '基底層', 'Stratum basalis', '經期不脫落，負責再生修復上層功能層。', Lc(0.4, 0.72, 0xe0909a), { anchor: [CX + 1.3, 0.56, 0.7] });
        const spong = Lc(0.72, 1.55, 0xf2b0bc, 0.5), comp = Lc(1.55, 1.95, 0xf8c8d0, 0.75), epc = Lc(1.95, 2.0, EP);
        const PG = [], SA = [], rp = rnd(61);
        for (let k = 0; k < 7; k++) {
          const x0 = CX - 1.05 + k * 0.35, z0 = (rp() - 0.5) * 0.8, pts = [];
          for (let i = 0; i <= 20; i++) { const t = i / 20, y = 1.98 - t * 1.4, amp = y < 1.55 ? 0.08 : 0.01; pts.push([x0 + amp * Math.sin(t * 30), y, z0 + amp * Math.cos(t * 30)]); }
          PG.push(tube(pts, 0.03, GL));
        }
        for (let k = 0; k < 4; k++) {
          const x0 = CX - 0.9 + k * 0.6;
          SA.push(tube(helixAlong(new THREE.LineCurve3(V(x0 + 0.15, 0.4, 0.3), V(x0 + 0.15, 1.85, 0.3)), 0.06, 7, k, 160), 0.02, 0xd02828, 1, 2));
        }
        reg(G3, '功能層：緊密層', 'Stratum functionalis – compactum', '緊密基質，較直腺管口。', comp, { anchor: [CX + 1.3, 1.75, 0.7] });
        reg(G3, '功能層：海綿層', 'Stratum functionalis – spongiosum', '高度扭曲膨大腺體所在。', spong, { anchor: [CX + 1.3, 1.15, 0.7] });
        reg(G3, '上皮', 'Epithelium', '單層柱狀上皮。', epc, { anchor: [CX + 1.3, 1.98, 0.7] });
        reg(G3, '子宮腺（靈長類）', 'Uterine glands', '分泌期扭曲達高峰。', PG, { anchor: [CX - 1.05, 1.2, 0.3] });
        reg(G3, '螺旋動脈', 'Spiral arteries', 'P₄ 撤退時收縮缺血引發功能層脫落出血。', SA, { anchor: [CX + 0.35, 1.5, 0.35] });
        const BLD = [], rb = rnd(71);
        for (let k = 0; k < 16; k++) BLD.push(ell([CX + (rb() - 0.5) * 2.3, 0.78 + rb() * 0.12, (rb() - 0.5) * 1.2], [0.08, 0.05, 0.08], 0x9a0a1a));
        const bloodP = reg(G3, '經血（脫落的功能層）', 'Menstrual flow', '功能層缺血崩解經陰道排出；基底層隨後再生。', BLD, { anchor: [CX + 0.8, 0.85, 0.6], hidden: true });
        textSprite('靈長類內膜：功能層＋基底層', [CX, 2.45, 0], 0.3);
        let mens = false;
        window._mensToggle = () => {
          mens = !mens;
          const f = p => ['功能層：緊密層', '功能層：海綿層', '上皮', '子宮腺（靈長類）', '螺旋動脈'].includes(p.zh);
          CUR.parts.forEach(p => { if (f(p)) p.visible = !mens; });
          bloodP.visible = mens; rebuildList(); refresh(); select(mens ? bloodP : CUR.parts.find(p => p.zh === '基底層'));
        };
      }
    });
  })();
})();
