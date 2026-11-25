/* Ch.12：著床前分裂與緊實化、著床窗口分子對話、比較胎盤介面與母體辨識 */
(function () {
  /* ===== 場景①：分裂、緊實化、囊胚孵化與同卵雙胞胎時序（Figs 12.1–12.4, Table 12.1） ===== */
  let S1 = null, DAY1 = 4.5, TWIN1 = 'single'; // single | t1 | t3 | t4
  SCENES.push({
    name: '① 緊實化與囊胚孵化',
    title: '從卵裂→極化緊實化→囊胚腔形成與同卵雙胞胎分化時刻（Figs 12.1–12.4）',
    camera: { pos: [0, 0.8, 19.5], target: [0, 0, 0], fit: [10.0, 6.2] },
    controls: [{ label: '🔍 胚胎全剖面', fn() { flyHome(); } }],
    desc: `
<p>受精卵經輸卵管卵裂（無淨成長，僅降低胞質/核比）進入子宮後展開 <b>緊實化（Compaction）</b> 與第一場命運分化：決定誰成為胚外支持組織 <b>滋養層（Trophoblast）</b>，誰成為未來發育為胎兒的 <b>多能胚層（Pluriblast / ICM）</b>（Ch.12 p.207–211, Figs 12.1–12.4）。</p>
<details open><summary>雙層保護與第一場細胞極性抉擇</summary><ul>
<li><b>透明帶（Zona pellucida）雙重使命</b>：① 緊實化前防止分裂球散裂成「同卵雙胞胎」；② 防止兩個體黏合成單一「嵌合體（chimaera）」。</li>
<li><b>8→16 細胞極化分裂</b>：外層繼承頂端微絨毛與緊密連接 → 表現 <b>Cdx2 / Eomes</b> 成滋養層；內層無外露面 → 表現 <b>Oct 3/4 / Nanog（與 GATA6 下胚層）</b>成 ICM。</li>
<li><b>基因接管時間（Table 12.1）</b>：鼠 2-細胞｜豬 4-細胞｜<b>人 4–8-細胞</b>｜兔/羊/牛 8–16-細胞。</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.12 p.207–212（Figs 12.1–12.4, Tables 12.1–12.2）</p>`,
    build() {
      S1 = { t: 0, play: true };
      const Z = '透明帶（Hatching 脫出控制）', BL = '分裂球與緊實化極性', DV = '囊胚腔、滋養層與內細胞團（ICM）';
      const isHatch = DAY1 >= 5.7, isBlast = DAY1 >= 4.4, isComp = DAY1 >= 3.0;
      const zpGap = isHatch ? 1.15 : 0.65;

      // 厚壁透明帶剖面殼（有真實壁厚切緣）
      const zp = thickShell(1, [3.4, 3.4, 3.4], 0x90d8ff, isHatch ? 0.28 : 0.38, zpGap, Math.PI * 2 - zpGap, 0.085);
      if (isHatch) zp.position.set(-1.35, 0, 0);
      reg(Z, isHatch ? '變薄裂開之透明帶（Hatching）' : '完整包裹之透明帶（防分散與防嵌合）', 'Zona pellucida',
        isHatch ? 'HB-EGF 與滋養層/子宮分泌之蛋白酶溶解透明帶讓囊胚孵出以便貼附內膜！' : '在緊實化形成緊密連接之前，防止分裂球散落成同卵雙胞胎或鄰近胚胎黏合成嵌合體（p.209）。',
        zp, { anchor: [-3.9, 3.1, 0.9] });

      const emOff = isHatch ? [1.15, 0, 0] : [0, 0, 0];
      const cellMs = [];
      if (TWIN1 === 'single') {
        if (DAY1 < 2.2) { // 2-cell or 4-cell（含細胞核）
          const n = DAY1 < 1.5 ? 2 : 4;
          for (let i = 0; i < n; i++) {
            const a = i / n * Math.PI * 2;
            const cx = emOff[0] + Math.cos(a) * 1.12, cy = emOff[1] + Math.sin(a) * 1.12;
            cellMs.push(ell([cx, cy, 0], [1.14, 1.14, 1.08], 0xe890b0, 0.86));
            cellMs.push(ell([cx, cy, 0.05], [0.44, 0.44, 0.42], 0x823664, 0.96));
          }
          reg(BL, `${n}-細胞分裂球（尚未緊實化）`, `${n}-cell blastomeres`, '細胞呈現放射狀對稱圓球形，彼此間尚未形成閉鎖型緊密連接。此時分裂即產雙絨毛雙胞胎。', cellMs, { anchor: [2.8, 2.2, 0.8] });
        } else if (!isBlast) { // 8-16 compacted morula
          const n = 14;
          for (let i = 0; i < n; i++) {
            const th = Math.acos(1 - 2 * (i + 0.5) / n), ph = Math.PI * (1 + Math.sqrt(5)) * i;
            const r = isComp ? 1.48 : 1.78;
            const cx = emOff[0] + r * Math.sin(th) * Math.cos(ph), cy = emOff[1] + r * Math.cos(th), cz = r * Math.sin(th) * Math.sin(ph);
            const inner = isComp && i < 4;
            cellMs.push(ell([cx * (inner ? 0.55 : 1), cy * (inner ? 0.55 : 1), cz * (inner ? 0.55 : 1)], isComp ? [0.98, 0.94, 0.86] : [0.76, 0.76, 0.76], inner ? 0x4db8e8 : 0xf28ea8, 0.92));
          }
          reg(BL, isComp ? '緊實化桑椹胚（極化＋Zonular 緊密連接）' : '未緊實化 8 細胞胚', 'Compacted Morula',
            isComp ? '細胞最大化貼合變成楔形上皮化（基底核、頂端微絨毛與內體）；內外分裂建立滋養層 vs 多能胚層！' : '緊實化前的 8 細胞胚。',
            cellMs, { anchor: [3.1, 2.3, 0.8] });
        } else { // Blastocyst (4.5 - 6.5)：厚壁滋養層剖面＋滋養層細胞核列＋極化雙層 ICM
          const troph = thickShell(1, [2.72, 2.66, 2.45], 0xe56b92, 0.68, 0.65, Math.PI * 1.62, 0.14);
          troph.position.set(...emOff);
          // 沿滋養層壁分布的扁平上皮細胞核
          const tNucPts = [];
          for (let i = 0; i < 16; i++) {
            const ph = 0.85 + (i / 15) * (Math.PI * 1.45);
            const th = 0.6 + ((i * 7) % 5) * 0.45;
            tNucPts.push(V(emOff[0] - Math.cos(ph) * Math.sin(th) * 2.52, emOff[1] + Math.cos(th) * 2.46, Math.sin(ph) * Math.sin(th) * 2.26));
          }
          const tNucs = dots(tNucPts, 0.16, 0x8e244c, 0.96, 12);
          const cav = ell([emOff[0], emOff[1] - 0.35, 0], [2.15, 1.85, 1.8], 0x50b8ff, 0.24);
          // ICM：上方多能上胚層（藍）＋下方覆蓋囊胚腔頂的下胚層（金）
          const icmMs = [];
          for (let i = 0; i < 7; i++) {
            const a = i / 7 * Math.PI * 2;
            const r = i === 0 ? 0 : 0.72;
            icmMs.push(ell([emOff[0] + Math.cos(a) * r, emOff[1] + 1.52 + (i === 0 ? 0.16 : 0), Math.sin(a) * r * 0.75], [0.54, 0.48, 0.48], 0x4db8e8, 0.96));
          }
          for (let i = 0; i < 5; i++) {
            const x = emOff[0] + (i - 2) * 0.46;
            icmMs.push(ell([x, emOff[1] + 0.92, (i % 2 ? 0.18 : -0.18)], [0.36, 0.22, 0.36], 0xffd43a, 0.96));
          }
          reg(DV, '外圈滋養層（Trophoblast: Cdx2+ / Eomes+）', 'Trophoblast & Blastocoelic cavity',
            '占胚體 &gt;95% 的胚外細胞群，Zonular 緊密連接阻止鈉離子與水分滲漏而撐大囊胚腔，日後形成絨毛膜與胎盤（Fig 12.2）。',
            [troph, tNucs, cav], { anchor: [-3.5, -2.5, 0.9] });
          reg(DV, '內細胞團 Pluriblast（上胚層 Oct3/4+Nanog [藍]／下胚層 GATA6 [金]）', 'Inner Cell Mass (Epiblast & Hypoblast)',
            '僅上胚層（Epiblast）發育為真正的胎兒本體，下胚層（Hypoblast）則形成卵黃囊支持胚外結構。',
            icmMs, { anchor: [3.2, 2.5, 0.9] });
        }
      } else { // 同卵雙胞胎分化時刻演示（Fig 12.4，全面厚壁剖面）
        const tConfig = {
          t1: ['緊實化前分裂（40%）：各自雙絨毛雙羊膜', 0xe56b92],
          t3: ['囊胚 ICM 分裂（60%）：單絨毛雙羊膜（輸血風險！）', 0xe56b92],
          t4: ['胚盤極晚分裂（<2%）：單絨毛單羊膜／連體風險', 0xf09a4a]
        }[TWIN1];
        if (TWIN1 === 't1') {
          const ch1 = thickShell(1, [1.85, 2.0, 1.7], tConfig[1], 0.56, 0.55, Math.PI * 1.6, 0.12); ch1.position.set(-2.15, 0, 0);
          const ch2 = thickShell(1, [1.85, 2.0, 1.7], tConfig[1], 0.56, 0.55, Math.PI * 1.6, 0.12); ch2.position.set(2.15, 0, 0);
          const e1 = ell([-2.15, 0.45, 0], [0.72, 0.62, 0.58], 0x4db8e8, 0.96);
          const e2 = ell([2.15, 0.45, 0], [0.72, 0.62, 0.58], 0x4db8e8, 0.96);
          reg(DV, tConfig[0], 'Type 1/2 Dichorionic Diamniotic', '極早分裂產生兩顆獨立胚胎，各有絨毛膜與羊膜（半數後來融成雙絨毛胎盤但罕有血管吻合）。', [ch1, ch2, e1, e2], { anchor: [0, 3.2, 0.8] });
        } else {
          const chShared = thickShell(1, [3.45, 2.55, 2.15], 0xe56b92, 0.48, 0.55, Math.PI * 1.62, 0.12);
          const am1 = thickShell(1, [1.28, 1.28, 1.18], 0x70e8ff, 0.32, 0.5, Math.PI * 1.65, 0.08);
          am1.position.set(TWIN1 === 't4' ? 0 : -1.28, 0.2, 0);
          if (TWIN1 === 't4') am1.scale.set(1.9, 1.4, 1.25);
          const ms = [chShared, am1];
          if (TWIN1 === 't3') {
            const am2 = thickShell(1, [1.28, 1.28, 1.18], 0x70e8ff, 0.32, 0.5, Math.PI * 1.65, 0.08);
            am2.position.set(1.28, 0.2, 0);
            ms.push(am2);
          }
          const e1 = ell([TWIN1 === 't4' ? -0.52 : -1.28, 0.2, 0.1], [0.64, 0.58, 0.52], 0x4db8e8, 0.96);
          const e2 = ell([TWIN1 === 't4' ? 0.52 : 1.28, 0.2, 0.1], [0.64, 0.58, 0.52], 0x4db8e8, 0.96);
          ms.push(e1, e2);
          if (TWIN1 === 't3') {
            ms.push(ttube([V(-1.25, -0.4, 0.15), V(-0.6, -1.55, 0.25), V(0.6, -1.55, 0.25), V(1.25, -0.4, 0.15)], 0.11, 0xff4040, 0.96, { organic: false }));
          }
          reg(DV, tConfig[0], TWIN1 === 't3' ? 'Type 3 Monochorionic Diamniotic' : 'Type 4/5 Monochorionic Monoamniotic',
            TWIN1 === 't3' ? '紅血管示「單一胎盤血管吻合」：占同卵雙胞胎 60%，易發生雙胎輸血症候群（一胎過大、一胎發育受阻）。' : '極晚於胚盤期才分裂（&lt;2%），共用同一羊膜與絨毛膜，分離不完全將造成連體嬰（Type 5）。',
            ms, { anchor: [0, 3.4, 0.8] });
        }
      }

      const stLbl = TWIN1 !== 'single' ? '同卵雙胞胎膜系分類（Fig 12.4）' : `人類受精後第 ${DAY1.toFixed(1)} 天（${DAY1 < 3 ? '卵裂' : DAY1 < 4.4 ? '緊實化' : DAY1 < 5.7 ? '囊胚入宮' : '破透明帶孵出'}）`;
      textSprite(stLbl, [0, 4.9, 0], 0.38, '#ffd479');

      const dt = dtClock();
      CUR.tick = () => {
        const d = S1.play ? dt() : 0; S1.t += d;
        CUR.root.rotation.y = Math.sin(S1.t * 0.45) * 0.18;
      };
    },
    panel(box) {
      slider(box, '發育天數 (Day 1.5 → 6.5)', 1.2, 6.5, DAY1, 0.2, v => { TWIN1 = 'single'; DAY1 = v; reloadKeep(); });
      seg(box, '發育模式 / 同卵雙胞胎時刻（Fig 12.4）', [['single', '單一概念體'], ['t1', '雙絨毛(40%)'], ['t3', '單絨毛雙羊(60%)'], ['t4', '胚盤晚裂(<2%)']], TWIN1, v => { TWIN1 = v; reloadKeep(); });
      note(box, '<b>Table 12.1 胚胎基因接管期：</b>鼠 2-cell｜豬 4-cell｜人 4–8-cell｜羊/牛/兔 8–16-cell。', 'big');
      checkbox(box, '微幅立體轉動', true, v => S1.play = v);
    }
  });

  /* ===== 場景②：著床窗口與雙向分子對話（Figs 12.5, 12.8–12.9, Box 12.3） ===== */
  let S2 = null, WIN2 = 'receptive'; // pre | receptive | invasion | diapause
  const W2_INFO = {
    pre: ['前接受期（Pre-receptive，厚 Muc1「走開」阻壁）', '子宮內膜長滿長微絨毛、高負表面電位與厚實 <b>Muc1</b> 醣萼，上皮 <b>PR</b> 尚存在而封鎖腺體分泌，囊胚無法貼附（Fig 12.5b）。'],
    receptive: ['接受窗口（Receptive：P₄ 背景＋E₂ 開鎖！）', '上皮 PR 下調＋卵巢 <b>E₂（合併 Hmx3）</b>促腺體分泌 <b>LIF</b> → 結合上皮 <b>LIFRα:gp130 → Jak → Stat3</b> → 分泌 <b>HB-EGF</b> 結合囊胚 EGFR/HSPG；同時 <b>Muc1</b> 被清除、<b>胞飲突（pinopodes）</b>吸收管腔液促進閉合貼附（Figs 12.5c, 12.8）！'],
    invasion: ['侵入與脫膜（Invasion & Decidualization）', '人／鼠囊胚溶解上皮侵蝕基質，融合出<b>合胞滋養層（Syncytiotrophoblast）</b>與血竇；<b>PLA₂ → Cox2 → PGI₂ → PPARδ</b> 促水腫、聚倍體脫膜細胞、<b>MMP vs TIMP</b> 制衡與 <b>VEGF/PlGF/IL-11</b> 血管新生（Fig 12.5e, 12.9）！'],
    diapause: ['延遲著床／胚胎滯育（Diapause，Box 12.3）', '缺乏打開窗口的 <b>E₂ 高峰</b>（例如哺乳大鼠吸吮抑制 E₂ 屬「兼性延遲」，或歐洲麅 7–隔年 1 月屬「專性滯育」）：囊胚停留在低代謝休眠自由懸浮狀態，直到補入單劑 E₂ 即刻喚醒著床！']
  };
  SCENES.push({
    name: '② 著床窗口分子對話',
    title: 'Muc1、LIF–Stat3、HB-EGF 與脫膜侵入反應（Figs 12.5, 12.8–12.9）',
    camera: { pos: [0, 0.8, 19.5], target: [0, 0, 0], fit: [10.0, 6.2] },
    controls: [{ label: '🔍 著床介面全圖', fn() { flyHome(); } }],
    desc: `
<p>自由囊胚長大到一定程度後擴散交換已不敷需求，必須在極狹窄的 <b>著床窗口（Window of implantation）</b> 透過精妙雙向分子語言與子宮內膜對接（Ch.12 p.213–220, Figs 12.5, 12.8–12.9）。</p>
<details open><summary>從「走開」→「來這裡」→「克制侵入」</summary><ul>
<li><b>「走開」訊號關閉</b>：清除阻絕細胞貼附的跨膜黏蛋白 <b>Muc1</b> 醣萼，胞飲突縮窄管腔。</li>
<li><b>「來這裡」訊號</b>：腺體受 E₂+Hmx3 誘導分泌 <b>LIF</b> → 活化上皮 <b>Jak–Stat3</b> → 引導囊胚鄰近上皮產生 <b>HB-EGF</b> 促進脫出與結合。</li>
<li><b>「促侵入 vs 節制」</b>：<b>MMPs＋Cox2/PGI₂/VEGF</b> 推入基質；母體 <b>TIMPs＋脫膜＋IL-11</b> 防止過度侵蝕！</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.12 p.213–220（Figs 12.5, 12.8–12.9, Box 12.3）</p>`,
    build() {
      S2 = { t: 0, play: true };
      const BL = '囊胚（細胞/合胞滋養層＋ICM）', EP = '子宮管腔上皮與 Muc1/LIF–Stat3', ST = '內膜腺體、脫膜細胞與新生血管';

      // 獨立柱狀子宮管腔上皮細胞列（含基底核；侵入期中央破開讓囊胚沉入）
      const epY = WIN2 === 'invasion' ? -0.42 : -0.48;
      const epRows = epitheliumRow({
        x0: -5.4, x1: 5.4, y: epY, z0: -1.25, z1: 1.25, h: 0.86, nx: 14, nz: 3,
        col: 0xe8889a, nucCol: 0x703874, o: 0.88,
        skip: WIN2 === 'invasion' ? cx => Math.abs(cx) < 1.85 : null
      });
      // Muc1 跨膜醣萼刷狀層（小直立纖毛柱）
      const mucMs = [];
      for (let i = -8; i <= 8; i++) {
        if ((WIN2 === 'receptive' && Math.abs(i) < 4) || (WIN2 === 'invasion' && Math.abs(i) < 5)) continue;
        const hM = (WIN2 === 'pre' || WIN2 === 'diapause') ? 0.42 : 0.16;
        mucMs.push(capsule([i * 0.58, epY + 0.42, 0.65], [i * 0.58, epY + 0.42 + hM, 0.65], 0.055, 0xff5a7e, (WIN2 === 'pre' || WIN2 === 'diapause') ? 0.95 : 0.42));
      }
      // 蘑菇狀胞飲突（receptive 期中央隆起吸收管腔液）
      const pino = [];
      if (WIN2 === 'receptive') {
        for (let i = -3; i <= 3; i++) {
          pino.push(ell([i * 0.72, epY + 0.62, 0.1], [0.3, 0.24, 0.28], 0xffd479, 0.94));
          pino.push(capsule([i * 0.72, epY + 0.36, 0.1], [i * 0.72, epY + 0.55, 0.1], 0.12, 0xf2b858, 0.94));
        }
      }
      reg(EP, WIN2 === 'pre' ? '覆蓋厚 Muc1「走開」醣萼之管腔上皮' : '去除 Muc1＋升起胞飲突＋表現 HB-EGF', 'Endometrial luminal epithelium',
        W2_INFO[WIN2][1], [...epRows, ...mucMs, ...pino], { anchor: [-4.6, -0.4, 0.9] });

      // 波浪狀有機子宮內膜基質、捲曲腺體（LIF 來源）與螺旋新生血管
      const stroma = tissueSlab([0, -2.95, 0], [11.2, 4.0, 2.7], WIN2 === 'invasion' ? 0xd05872 : 0xb05872, 0.36, { wave: 0.09, freq: 1.0, seed: 3.3 });
      const glandL = ttube([V(-4.3, -4.5, 0.2), V(-3.8, -3.4, 0.45), V(-4.4, -2.3, 0.1), V(-3.9, -1.3, 0.35), V(-4.2, -0.65, 0.2)], [0.34, 0.24], 0xffe090, 0.92, { organic: false });
      const glandR = ttube([V(4.3, -4.5, 0.2), V(3.8, -3.4, 0.45), V(4.4, -2.3, 0.1), V(3.9, -1.3, 0.35), V(4.2, -0.65, 0.2)], [0.34, 0.24], 0xffe090, 0.92, { organic: false });
      const vesMs = [];
      for (let i = 0; i < (WIN2 === 'invasion' ? 4 : 2); i++) {
        const vx = -2.4 + i * 1.6;
        const axis = new THREE.CatmullRomCurve3([V(vx, -4.4, 0.45), V(vx + (vx > 0 ? -0.45 : 0.45), -1.85, 0.45)]);
        vesMs.push(ttube(helixAlong(axis, 0.16, 4.5, i * 1.2, 80), WIN2 === 'invasion' ? 0.11 : 0.075, 0xff3b4a, 0.94, { organic: false }));
      }
      const stArr = [stroma, glandL, glandR, ...vesMs];
      if (WIN2 === 'invasion') {
        // 肥大聚倍體脫膜細胞＋母血竇紅血球
        [[-1.85, -2.15, 0.65], [1.85, -2.15, 0.65], [-2.45, -2.95, 0.55], [2.45, -2.95, 0.55]].forEach(p => {
          stArr.push(ell(p, [0.36, 0.3, 0.3], 0xffb8d0, 0.92));
          stArr.push(ell([p[0], p[1], p[2] + 0.06], [0.16, 0.14, 0.14], 0x8a3a6a, 0.96));
        });
        stArr.push(rbcDiscs([V(-0.9, -2.35, 0.55), V(0.85, -2.4, 0.55), V(0, -2.8, 0.6), V(-0.4, -2.1, 0.65), V(0.45, -2.15, 0.65)], 0.15, 0xe82838, 0.96));
      }
      reg(ST, '分泌 LIF 之子宮腺體與基質脫膜反應（Cox2 / PGI₂ / VEGF）', 'Glands (LIF), Decidua & Angiogenesis',
        '受 E₂+Hmx3 刺激的腺體分泌 LIF（綠箭頭），透過 Jak–Stat3 開啟窗口；侵入後水腫與 Cox2–PGI₂–PPARδ 引導脫膜與微血管長入形成血竇（lacunae）。',
        stArr, { anchor: [4.8, -3.3, 0.9] });

      // 厚壁囊胚（侵入期長出指狀合胞滋養層絨毛深入基質）
      const bY = WIN2 === 'pre' || WIN2 === 'diapause' ? 2.4 : (WIN2 === 'receptive' ? 1.2 : -1.15);
      const blShell = thickShell(1, [1.55, 1.45, 1.35], 0xe56b92, 0.72, 0.5, Math.PI * 1.65, 0.14);
      blShell.position.set(0, bY, 0);
      const blIcm = [
        ell([-0.28, bY + 0.45, 0.1], [0.46, 0.38, 0.4], 0x4db8e8, 0.96),
        ell([0.28, bY + 0.45, 0.1], [0.46, 0.38, 0.4], 0x4db8e8, 0.96),
        ell([0, bY + 0.12, 0.12], [0.55, 0.2, 0.36], 0xffd43a, 0.96)
      ];
      const blArr = [blShell, ...blIcm];
      if (WIN2 === 'invasion') {
        // 指狀侵蝕合胞滋養層絨毛
        const roots = [
          [V(-0.9, -1.7, 0.1), V(-1.45, -2.4, 0.25), V(-1.85, -3.05, 0.1)],
          [V(-0.35, -2.0, 0.15), V(-0.55, -2.85, 0.3), V(-0.8, -3.4, 0.15)],
          [V(0.35, -2.0, 0.15), V(0.55, -2.85, 0.25), V(0.85, -3.35, 0.1)],
          [V(0.9, -1.7, 0.1), V(1.45, -2.4, 0.25), V(1.85, -3.0, 0.15)]
        ];
        roots.forEach(pts => blArr.push(ttube(pts, [0.42, 0.16], 0xff789c, 0.84)));
      }
      if (WIN2 === 'pre' || WIN2 === 'diapause') {
        const zp2 = thickShell(1, [1.9, 1.8, 1.7], 0x90d8ff, 0.3, 0.5, Math.PI * 1.65, 0.08);
        zp2.position.set(0, bY, 0);
        blArr.push(zp2);
      }
      reg(BL, WIN2 === 'invasion' ? '侵入性胚胎（合胞滋養層深入基質）' : '囊胚（表現 EGFR + HSPG 受體）', 'Blastocyst / Syncytiotrophoblast',
        W2_INFO[WIN2][1], blArr, { anchor: [2.8, bY + 1.2, 0.9] });

      // LIF (腺體->上皮) & HB-EGF (上皮->囊胚) 訊號箭頭
      const cLIF = arcArrow([[-4.0, -1.6, 0.55], [-2.5, -0.45, 0.65]], C_STIM, 0.06);
      const cHB = arcArrow([[-1.6, epY + 0.4, 0.55], [-0.9, bY - 0.5, 0.55]], 0xffd43a, 0.06);
      addRoot([...cLIF, ...cHB]);
      S2.fL = flowOn(cLIF.curve, 8, 0.1, 0x46d16a, 0x104010, WIN2 === 'pre' || WIN2 === 'diapause' ? 0.04 : 0.32, 0.03);
      S2.fH = flowOn(cHB.curve, 8, 0.1, 0xffd43a, 0x403000, WIN2 === 'pre' || WIN2 === 'diapause' ? 0.04 : 0.35, 0.03);
      CUR.root.add(S2.fL, S2.fH);

      textSprite(W2_INFO[WIN2][0], [0, 4.9, 0], 0.38, '#ffd479');

      const dt = dtClock();
      CUR.tick = () => {
        const d = S2.play ? dt() : 0; S2.t += d;
        S2.fL.run(d); S2.fH.run(d);
      };
    },
    panel(box) {
      seg(box, '子宮接受狀態切換', [['pre', '前接受(Muc1)'], ['receptive', '接受窗(LIF+EGF)'], ['invasion', '侵入脫膜'], ['diapause', '滯育(缺E₂)']], WIN2, v => { WIN2 = v; reloadKeep(); });
      note(box, W2_INFO[WIN2][1], 'big');
      checkbox(box, '播放 LIF / HB-EGF 分子對話', true, v => S2.play = v);
    }
  });

  /* ===== 場景③：比較胎盤分層介面與母體妊娠辨識（Figs 12.6–12.7, 12.10, Table 12.3） ===== */
  let S3 = null, SP3 = 'human';
  const SP3_DATA = {
    human: ['人類：單層血絨毛＋圓盤狀＋hCG 護黃體', 1, 0, true, '<b>Haemomonochorial（侵入・間質・圓盤狀）：</b>母血管被侵蝕使<b>合胞滋養層直接泡在母血</b>（僅 1 層絨毛膜滋養層！）。<br><b>母體辨識（Fig 12.10）：</b>受精 D6–7 分泌 <b>hCG</b> 結合黃體 LH 受體延長 P₄ 壽命。'],
    rat: ['大/小鼠：三層血絨毛＋偏心＋假孕 PRL', 3, 0, true, '<b>Haemotrichorial（侵入・偏心・圓盤狀）：</b>胎兒微血管與母血之間存在<b>三層滋養層細胞</b>（inner, middle, outer）。大鼠交配靠 PRL 潮湧展開約 12 天假孕協助過渡。'],
    dog: ['犬／貓：內皮絨毛＋環帶狀（Zonary）', 1, 1, true, '<b>Endotheliochorial（侵入・偏心・環帶腰封狀）：</b>滋養層破壞了子宮上皮與基質，但停留在<b>保留完整的母體微血管內皮</b>外側。'],
    cow: ['牛／羊：融合上皮絨毛＋子宮阜（約 90 顆）＋IFN-τ', 1, 3, false, '<b>Synepitheliochorial（非侵入・中央・子葉型）：</b>胎兒<b>雙核細胞（binucleate）</b>融合母體上皮形成合胞體，僅於子宮阜連結。<br><b>母體辨識：</b>囊胚分泌 <b>IFN-τ (TP-1)</b> 誘導 <b>IRF-2 關閉催產素受體</b>阻斷 PGF₂α 溶黃體！'],
    pig: ['豬／馬：上皮絨毛＋彌散狀（D12 長 1000mm！）＋E₂ 轉道', 1, 2, false, '<b>Epitheliochorial（非侵入・中央・彌散型）：</b>保留完整母體子宮上皮、基底膜與內皮（層數最多但交換效率仍優！）；豬囊胚 D6 2mm → D12 暴長至 <b>1000 mm</b>。<br><b>母體辨識：</b>豬胚胎 D11–13/15–30 分泌 <b>E₂</b> 將 PGF₂α 由血液內分泌<b>改道至宮腔外分泌</b>（馬另有胎杯）。']
  };
  SCENES.push({
    name: '③ 比較胎盤與妊娠辨識',
    title: '6 型胎盤微結構分層、巨觀造型與 hCG / IFN-τ / E₂ 訊號（Figs 12.6–12.7, Table 12.3）',
    camera: { pos: [0, 0.8, 19.5], target: [0, 0, 0], fit: [10.4, 6.2] },
    controls: [
      { label: '🔍 雙側全覽', fn() { flyHome(); } },
      { label: '🔍 左：微結構分層（Fig 12.7）', fn() { flyFit([-4.4, 0, 0], [4.6, 4.4]); } },
      { label: '🔍 右：胎盤形狀與荷爾蒙辨識', fn() { flyFit([4.6, 0, 0], [4.6, 4.4]); } }
    ],
    desc: `
<p>著床深度直接決定成熟胎盤「分隔母血與胎血的組織層數」與巨觀附著形狀（Figs 12.6–12.7, Table 12.3）；同時胚胎必須送出<b>長距離訊號</b>阻止黃體退化（Ch.12 p.215–222, Fig 12.10）。</p>
<details open><summary>母體黃體救援的物種三分天下</summary><ul>
<li><b>靈長類</b>：分泌親黃體激素 <b>hCG</b>（可被抗體中和阻斷）。</li>
<li><b>反芻類（牛羊）</b>：分泌 <b>IFN-τ（TP-1）</b>壓抑子宮催產素受體，取消 PGF₂α 脈衝。</li>
<li><b>豬</b>：分泌雙波 <b>E₂</b>，把 PGF₂α 改道排入子宮腔破壞。</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.12 p.215–222（Figs 12.6–12.7, 12.10, Table 12.3）</p>`,
    build() {
      S3 = { t: 0, play: true };
      const [ttl, trophLayers, matLayers, , infoHtml] = SP3_DATA[SP3];
      const L = '左側：組織學屏障層疊（Fig 12.7）', R = '右側：巨觀胎盤型態與長距妊娠訊號';

      // 左側：波浪有機母血池＋雙凹紅血球＋帶細胞核的波浪細胞層＋胎兒微血管
      const matPool = tissueSlab([-4.4, 3.35, 0], [6.2, 1.05, 2.2], 0xcc2838, 0.42, { wave: 0.08, freq: 1.3, seed: 1.1 });
      const matRbcs = rbcDiscs([V(-6.2, 3.35, 0.3), V(-4.9, 3.45, -0.2), V(-3.5, 3.25, 0.35), V(-2.2, 3.4, 0.1), V(-5.5, 3.2, -0.35), V(-2.9, 3.5, -0.25)], 0.24, 0xff4252, 0.96);
      const fetCap = ttube([V(-7.4, -3.35, 0), V(-4.4, -3.22, 0.1), V(-1.4, -3.35, 0)], 0.46, 0x4db8e8, 0.48, { organic: false, radial: 20 });
      const fetRbcs = rbcDiscs([V(-6.4, -3.32, 0.02), V(-4.8, -3.25, 0.08), V(-3.2, -3.28, 0.04), V(-2.0, -3.34, 0.02)], 0.19, 0xd83258, 0.96);
      const layersMs = [matPool, matRbcs, fetCap, fetRbcs];

      const addCellLayer = (y, h, col, nucCol, seed, binuc = false) => {
        layersMs.push(tissueSlab([-4.4, y, 0], [6.2, h, 2.15], col, 0.82, { wave: 0.06, freq: 1.5, seed }));
        const nPts = [];
        for (let i = 0; i < 6; i++) {
          const x = -6.7 + i * 0.92;
          if (binuc) { nPts.push(V(x - 0.11, y, 0.45), V(x + 0.11, y, 0.45)); }
          else nPts.push(V(x, y, 0.45));
        }
        layersMs.push(dots(nPts, 0.11, nucCol, 0.96, 10));
      };

      let curY = 2.25;
      if (matLayers >= 1) { addCellLayer(curY, 0.44, 0xff8080, 0x8a2434, 2.2); curY -= 0.64; }
      if (matLayers >= 2) { addCellLayer(curY, 0.56, matLayers === 3 ? 0xe090d8 : 0xf0b080, 0x6b2f6c, 3.4, matLayers === 3); curY -= 0.72; }
      for (let k = 0; k < trophLayers; k++) {
        addCellLayer(curY - k * 0.64, 0.48, 0xe56b92, 0x7c1f48, 4.5 + k);
      }
      reg(L, `母胎介面：${trophLayers} 層滋養層 ＋ ${matLayers === 0 ? '無母體層（直泡母血）' : matLayers === 1 ? '母體血管內皮' : matLayers === 3 ? '雙核細胞融合合胞上皮+內皮' : '完整母體上皮+基底膜+內皮'}`, 'Placental tissue layers (Fig 12.7)',
        infoHtml, layersMs, { anchor: [-4.4, 0.5, 0.9] });

      // 右側上：立體胎盤巨觀形狀 (Fig 12.6)
      const sac = ell([4.6, 1.85, 0], [2.4, 1.55, 1.4], 0xffe4b8, 0.48);
      const macMs = [sac];
      if (SP3 === 'human' || SP3 === 'rat') {
        // 圓盤狀胎盤（帶微厚圓盤與臍帶血管）
        const discP = lathe([[0.01, -0.22], [1.45, -0.18], [1.62, 0], [1.45, 0.22], [0.01, 0.28]], 0xd83050, 0.95, [4.6, 3.12, 0], [0, 1, 0], 36);
        const cord = ttube([V(4.6, 3.0, 0), V(4.85, 2.45, 0.25), V(4.45, 1.95, 0.1)], 0.11, 0x80c8ff, 0.95, { organic: false });
        macMs.push(discP, cord);
      } else if (SP3 === 'dog') {
        // 環帶腰封狀（貼合卵形囊腰部的真實 3D 環帶）
        const bandProf = [];
        for (let i = 0; i <= 12; i++) {
          const t = (i / 12 - 0.5) * 1.45;
          const r = 1.62 * Math.sqrt(Math.max(0.2, 1 - (t / 2.45) * (t / 2.45)));
          bandProf.push([r, t]);
        }
        const zn = lathe(bandProf, 0xd83050, 0.92, [4.6, 1.85, 0], [1, 0, 0], 36);
        zn.scale.set(1, 0.96, 0.92);
        macMs.push(zn);
      } else if (SP3 === 'cow') {
        // 子葉型（圓頂鈕扣狀子宮阜 placentomes）
        for (let i = 0; i < 10; i++) {
          const th = Math.acos(1 - 2 * (i + 0.5) / 10), ph = Math.PI * (1 + Math.sqrt(5)) * i;
          const p = V(4.6 + Math.sin(th) * Math.cos(ph) * 2.35, 1.85 + Math.cos(th) * 1.5, Math.sin(th) * Math.sin(ph) * 1.35);
          const btnM = ell(p.toArray(), [0.36, 0.26, 0.34], 0xd83050, 0.96);
          macMs.push(btnM);
        }
      } else {
        // 彌散型（均勻分布絨毛凸點）
        const vPts = [];
        for (let i = 0; i < 36; i++) {
          const th = Math.acos(1 - 2 * (i + 0.5) / 36), ph = Math.PI * (1 + Math.sqrt(5)) * i;
          vPts.push(V(4.6 + Math.sin(th) * Math.cos(ph) * 2.42, 1.85 + Math.cos(th) * 1.56, Math.sin(th) * Math.sin(ph) * 1.42));
        }
        macMs.push(dots(vPts, 0.16, 0xd83050, 0.95, 10));
      }

      // 右側下：長距離辨識路徑（概念體 -> 黃體 or 子宮 PGF2a 阻斷）
      const concB = ell([2.2, -2.5, 0], [0.78, 0.56, 0.56], 0xe56b92, 0.95);
      const targetO = ell([7.0, -2.5, 0], [0.96, 0.72, 0.72], SP3 === 'human' ? 0xffd43a : 0x46d16a, 0.95);
      const sigCol = SP3 === 'human' ? C_STIM : C_INH;
      const sigArc = arcArrow([[3.0, -2.3, 0.2], [6.0, -2.3, 0.2]], sigCol, 0.07, { inhibit: SP3 === 'cow' || SP3 === 'pig' });
      macMs.push(concB, targetO, ...sigArc);
      reg(R, '胎盤巨觀形狀（Fig 12.6）與母體辨識訊號', 'Placental morphology & Pregnancy recognition',
        SP3 === 'human' ? '綠點流：<b>hCG</b> 由血液直達卵巢黃體 LH 受體延長孕酮輸出！' : SP3 === 'cow' ? '紅阻斷：<b>IFN-τ</b> 關閉子宮催產素受體 → 停產溶黃體 PGF₂α！' : '豬雙波 <b>E₂</b> 使 PGF₂α 改道排入宮腔降解！',
        macMs, { anchor: [4.6, -4.1, 0.9] });

      S3.fSig = flowOn(sigArc.curve, 12, 0.12, SP3 === 'human' ? 0x46d16a : 0xff7070, 0x201010, 0.34, 0.04);
      CUR.root.add(S3.fSig);

      textSprite(ttl, [0, 5.0, 0], 0.36, '#ffd479');

      const dt = dtClock();
      CUR.tick = () => {
        const d = S3.play ? dt() : 0; S3.t += d;
        S3.fSig.run(d);
      };
    },
    panel(box) {
      selectBox(box, '物種／胎盤型態比較', Object.keys(SP3_DATA).map(k => [k, SP3_DATA[k][0].split('：')[0]]), v => { SP3 = v; reloadKeep(); }).value = SP3;
      const cv = mkCanvas(box, 290, 140);
      plot(cv, {
        title: 'Fig 12.10 受精週期 P₄ & CG vs 抗-CG 抗體效應',
        x: [0, 42], y: [0, 1.05], xt: [0, 14, 28, 42], xl: '天數（Day 14 = 排卵）',
        vl: [{ x: 14, col: '#46d16a', label: '排卵' }, { x: 28, col: '#ff8080', label: '非孕退化日' }],
        series: [
          { f: d => d < 14 ? 0.08 : (d < 25 ? 0.08 + 0.72 * Math.sin((d - 14) / 14 * Math.PI) : 0.08 + 0.7 * (1 - (d - 25) / 17) * 0.2 + 0.72), col: '#ffd43a', label: 'P₄ (正常懷孕 hCG 救援)', w: 2.3 },
          { f: d => d < 14 ? 0.08 : (d < 28 ? 0.08 + 0.72 * Math.sin((d - 14) / 14 * Math.PI) : 0.08), col: '#ff5050', label: 'P₄ (未孕或抗-CG中和)', dash: [4, 3], w: 2 },
          { f: d => d < 20 ? 0.02 : 0.02 + 0.88 * (1 - Math.exp(-(d - 20) / 5)), col: '#e56b92', label: 'hCG', w: 2 }
        ]
      });
      note(box, SP3_DATA[SP3][4], 'big');
      checkbox(box, '播放荷爾蒙／辨識訊號流', true, v => S3.play = v);
    }
  });
})();
