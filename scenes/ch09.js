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
      const myo = box([-4.6, -4.1, 0], [8.0, 0.9, 3.0], 0xb84a50, 0.9);
      const basalis = box([-4.6, -3.3, 0], [8.0, 0.7, 3.0], 0xc86a78, 0.92);
      const funct = box([-4.6, -2.95 + thick / 2, 0], [8.0, thick, 2.9], isMens ? 0x983040 : (isProlif ? 0xe88098 : 0xf29ab0), isMens ? 0.55 : 0.72);
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
      for (let i = 0; i < 5; i++) {
        const g = new THREE.Group();
        g.add(ell([0, 0, 0], [0.24, 0.13, 0.13], 0xffffff), cyl([-0.24, 0, 0], [-0.95, 0, 0], 0.035, 0xd8e0e8));
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
})();
