/* Ch.17：三產程/brachystasis與子宮頸重塑、Ferguson反射、羊HPA計時器 vs 人類胎盤CRH與功能撤退P4 */
(function () {
  /* ===== 場景①：子宮縮短滯留（Brachystasis）與子宮頸重塑四期（Figs 17.1–17.4） ===== */
  let S1 = null, STG1 = 1; // 0:孕末穩態 | 1:第一產程子宮頸重塑與回縮環 | 2:第二產程仰伸娩出
  const STG1_DATA = [
    ['0. 孕末靜止期（P₄ 鎖定平滑肌・堅硬閉鎖子宮頸）', '子宮頸富含規則排列的膠原蛋白束維持高剛性支撐胎兒；上段與下段肌層在 P₄ 與 PGI₂ 抑制下幾乎不協調強烈收縮（僅含少量 connexin，p.287–289）。'],
    ['1. 第一產程（Brachystasis 回縮環升起 ＋ 玻尿酸水化擴張）', '宮縮壓達 50–100 mmHg！上部肌細胞<b>收縮後放鬆不回原長（Brachystasis）</b>逐步變厚並把被動下段與成熟子宮頸（高→低 MW <b>玻尿酸 HA + MMPs</b>）向上拉開成連續產道（p.285–288）！'],
    ['2. 第二產程（骨盆出口狹窄通過與仰伸娩出，Fig 17.1, 17.3）', '人類雙足直立使骨盆出口極緊密吻合胎頭（不像黑猩猩寬鬆），胎頭經屈曲→內轉→仰伸貼近恥骨聯合滑出陰道，通常於 1 小時內結束（第 3 產程隨後娩出胎盤）。']
  ];
  SCENES.push({
    name: '① 宮縮滯留與頸重塑',
    title: 'Brachystasis 生理回縮環、玻尿酸 HA 切斷擴張與窄骨盆娩出（Figs 17.1–17.4）',
    camera: { pos: [0, 0.8, 19], target: [0, 0, 0], fit: [9.8, 6.2] },
    controls: [{ label: '🔍 妊娠子宮骨盆剖面', fn() { flyHome(); } }],
    desc: `
<p>把一個原本堅韌承重 3 公斤多胎兒九個月的子宮頸「瞬間變成寬 10 公分的柔軟產道」，靠兩大巧思：細胞外間質重組與上段肌層<b>「縮短滯留（Brachystasis）」</b>的棘輪效應！（Ch.17 p.284–289, Figs 17.1–17.4）</p>
<details open><summary>分娩力學與生化重點</summary><ul>
<li><b>上段變厚、下段被動上拉</b>：上部收縮肌細胞從不回到原本全長（Brachystasis），在上下交界形成可觸摸的<b>生理性回縮環（Retraction ring）</b>！</li>
<li><b>玻尿酸（HA）尺寸切換</b>：成熟期積高 MW HA；擴張期<b>玻尿酸酶 ↑</b>切為低 MW HA 吸水變極度柔韌，搭配 <b>PGE₂ / NO / Relaxin / IL-8</b> 分散膠原！</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.17 p.284–289（Figs 17.1–17.4, Box 17.2）</p>`,
    build() {
      S1 = { t: 0, play: true };
      const UT = '上段收縮肌層（Brachystasis）', CX = '下段與子宮頸（GAG/HA/MMP 重塑）', FT = '胎兒與緊密人類骨盆入口';

      // 上段子宮體（隨 STG1 變厚縮窄） vs 被動下段 + 子宮頸（隨 STG1 拉高擴寬）
      const topThick = STG1 === 0 ? 0.35 : (STG1 === 1 ? 0.58 : 0.72);
      const topW = STG1 === 0 ? 3.2 : (STG1 === 1 ? 2.85 : 2.55);
      const utTop = shell(1, [topW, 3.6 - STG1 * 0.4, 2.3], 0xd85860, 0.36, 0.55, Math.PI * 1.6);
      utTop.position.set(0, 1.4 + STG1 * 0.2, 0);
      const retRing = ring([0, -0.3 + STG1 * 0.75, 0], [0, 1, 0], topW * 0.85, topThick * 0.25, STG1 >= 1 ? 0xffd43a : 0x806070);
      reg(UT, STG1 >= 1 ? '上段子宮底肌層（Brachystasis 變厚＋黃色回縮環）' : '靜止膨大子宮體', 'Upper myometrium & Retraction ring',
        STG1 >= 1 ? '上段每次收縮後放鬆並不恢復原本全長（Brachystasis），推動生理性回縮環不斷上移縮小腔室容積（p.285）。' : '懷孕晚期子宮肌細胞肥大十倍（50→500μm）等待啟動。',
        [utTop, retRing], { anchor: [-3.8, 3.2, 0.8] });

      // 子宮頸與骨盆出口環 (STG1=0 窄厚 0.35; STG1=1 寬薄 1.25; STG1=2 全開 1.75)
      const cxInR = STG1 === 0 ? 0.22 : (STG1 === 1 ? 1.15 : 1.75);
      const cxOutR = cxInR + (STG1 === 0 ? 0.95 : 0.42);
      const cervix = annulus(cxOutR, cxInR, 1.35 - STG1 * 0.45, STG1 === 0 ? 0xe090a0 : 0xff70a0, 0.78, -0.65);
      cervix.rotation.x = Math.PI / 2;
      cervix.position.set(0, -1.5 + STG1 * 0.45, 0);
      const pelv = ring([0, -2.9, 0], [0, 1, 0], 2.25, 0.28, 0xeef2f7); // 骨盆入口 (與黑猩猩比較，緊貼胎頭!)
      const vag = annulus(1.75, 1.45, 1.8, 0xd05878, 0.34, -0.9);
      vag.rotation.x = Math.PI / 2; vag.position.set(0, -3.5, 0);
      reg(CX, STG1 === 0 ? '高膠原剛性閉合子宮頸' : '成熟與擴張中子宮頸（玻尿酸酶＋PGE₂＋MMPs）', 'Cervix remodelling & Pelvic aperture',
        'IL-6/IL-8 吸引單核球、PGE₂＋NO 加上高→低 MW 玻尿酸水化使膠原分散順從，並配合白色人類骨盆出口密切引導胎頭娩出（Fig 17.1）。',
        [cervix, pelv, vag], { anchor: [3.4, -1.8, 0.8] });

      // 胎兒（頭朝下從 y=1.3 -> y=0.2 -> y=-2.8 娩出！）
      const fY = STG1 === 0 ? 0.85 : (STG1 === 1 ? 0.15 : -2.25);
      const fHead = ell([0, fY - 1.15, 0], [1.22, 1.32, 1.15], 0xf2b8a0, 0.96);
      const fBody = ell([0, fY + 0.65, 0], [1.35, 1.65, 1.25], 0xf2b8a0, 0.92);
      const cord = ttube([V(0, fY + 0.5, 0.6), V(1.1, fY + 1.4, 0.6), V(1.4, 2.8, 0.3)], 0.14, 0x45c49e, 0.9, { organic: false });
      const plac = ell([1.2, 3.2, -0.5], [1.4, 0.65, 1.1], 0xd83050, 0.9);
      reg(FT, `胎兒（頭位${STG1 === 2 ? '正滑出骨盆底擴張外伸' : '向下推進'}）& 頂部胎盤`, 'Fetus & Placenta',
        '胎頭雙頂徑緊貼骨盆開口（Fig 17.1），必須屈曲對齊最小徑線並隨產程內旋轉、伸展娩出（Fig 17.3）。',
        [fHead, fBody, cord, plac], { anchor: [-3.5, -1.0, 0.9] });

      S1.fHead = fHead; S1.fBody = fBody;
      textSprite(STG1_DATA[STG1][0], [0, 5.1, 0], 0.34, '#ffd479');

      const dt = dtClock();
      CUR.tick = () => {
        const d = S1.play ? dt() : 0; S1.t += d;
        if (STG1 >= 1) {
          const push = Math.max(0, Math.sin(S1.t * 2.4)) * 0.18;
          fHead.position.y = (fY - 1.15) - push;
          fBody.position.y = (fY + 0.65) - push * 0.7;
        }
      };
    },
    panel(box) {
      seg(box, '分娩力學三階段', [[0, '0.孕末靜止'], [1, '1.第一產程(Brachystasis)'], [2, '2.第二產程(娩出)']], STG1, v => { STG1 = v; reloadKeep(); });
      note(box, STG1_DATA[STG1][1], 'big');
      checkbox(box, '播放宮縮推進脈動', true, v => S1.play = v);
    }
  });

  /* ===== 場景②：Ferguson 反射、PG/催產素正回饋與 PGI2 保護性舒張（Fig 17.5） ===== */
  let S2 = null, LAB2 = true;
  SCENES.push({
    name: '② Ferguson正回饋',
    title: '子宮頸撐張→PVN/SON 催產素、PLA₂–PGF₂α 與 PGI₂ 間歇保護（Fig 17.5）',
    camera: { pos: [0, 0.8, 19.5], target: [0, 0, 0], fit: [10.4, 6.2] },
    controls: [{ label: '🔍 腦－脊髓－子宮全環', fn() { flyHome(); } }],
    desc: `
<p>一旦跨過門檻，分娩便進入猛烈的<b>正回饋循環</b>直到把胎兒與胎盤完全清空；關鍵引擎就是 <b>Ferguson 神經內分泌反射</b>、類固醇切換的 <b>PLA₂–PG 合成</b>，與間歇保護胎兒供血的 <b>PGI₂</b>（Ch.17 p.289–290, Fig 17.5）。</p>
<details open><summary>雙源催產素＋三種前列腺素精細平衡</summary><ul>
<li><b>Afferent 上傳路徑（Fig 17.5）</b>：子宮頸與陰道牽張感測 → 脊髓背角 → <b>前外側柱（anterolateral columns）</b> → 腦幹＋內側前腦束 → 下視丘 <b>PVN &amp; SON</b> 脈衝釋放垂體後葉催產素。</li>
<li><b>本地脫膜催產素</b>：受高 E₂ 與宮縮刺激於產時暴升（比擇期剖腹產高 4 倍！）。</li>
<li><b>PGs 分工</b>：<b>PGF₂α &amp; PGE₂</b> 降閾值、開 Ca²⁺、催熟子宮頸；<b>PGI₂</b> 反而舒張下段確保宮縮間血液再灌流。</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.17 p.289–291（Fig 17.5）</p>`,
    build() {
      S2 = { t: 0, play: true };
      const BR = '下視丘 PVN/SON 與垂體後葉（Oxytocin）', SP = '脊髓前外側柱上傳感覺神經', UT = '子宮肌層 Connexin・OTR 與脫膜 PGs';

      const hyp = ell([0, 3.8, 0], [2.2, 1.0, 1.0], LAB2 ? 0xf97316 : 0x507090, 0.9);
      const pvn = ell([-0.7, 3.8, 0.7], [0.45, 0.35, 0.35], 0xffd43a);
      const son = ell([0.7, 3.8, 0.7], [0.45, 0.35, 0.35], 0xffd43a);
      const postPit = ell([0, 2.2, 0.3], [0.65, 0.6, 0.6], LAB2 ? 0x46d16a : 0x607080, 0.95);
      reg(BR, '視室旁核 (PVN)／視上核 (SON) → 垂體後葉釋放催產素', 'PVN / SON & Posterior Pituitary',
        '大細胞神經元軸突直達垂體後葉，隨產程第二期脈衝頻率與幅度急劇攀升；<b>高 E₂ 或低 P₄ 下子宮撐張大幅提升肌層 OTR 受體與脫膜催產素產量！</b>',
        [hyp, pvn, son, postPit], { anchor: [2.8, 3.6, 0.8] });

      // 左側脊髓上傳路線（子宮頸撐張 -> 背角 -> 前外側柱 -> 腦幹 -> MFB -> PVN/SON）
      const cord = box([-4.6, 0.2, 0], [0.95, 5.4, 0.95], 0xc8d8e8, 0.45);
      const cAff = arcArrow([[-1.4, -3.5, 0.3], [-4.4, -2.5, 0.3], [-4.6, 1.8, 0.3], [-1.5, 3.7, 0.3]], LAB2 ? 0x38bdf8 : 0x445566, 0.07);
      reg(SP, '子宮頸牽張上傳神經（脊髓前外側柱→內側前腦束）', 'Ferguson Reflex Afferent Limb',
        '陰道及子宮頸機械性擴張刺激傳入纖維，經同側與對側前外側柱（anterolateral columns）上傳至下視丘（Fig 17.5）。',
        [cord, ...cAff], { anchor: [-5.5, 1.2, 0.9] });

      // 下方子宮與連接蛋白 Connexin 網＋PGs
      const ut = shell(1, [2.6, 2.3, 1.8], LAB2 ? 0xe05060 : 0x7090b0, 0.48, 0.5, Math.PI * 1.6);
      ut.position.set(0, -2.2, 0);
      const cxPts = [V(-1.3, -1.6, 1.2), V(0, -1.5, 1.4), V(1.3, -1.6, 1.2), V(-0.9, -2.6, 1.3), V(0.9, -2.6, 1.3)];
      const connex = dots(cxPts, LAB2 ? 0.16 : 0.06, LAB2 ? 0x46d16a : 0x607080);
      const cvxRing = ring([0, -4.1, 0], [0, 1, 0], LAB2 ? 1.2 : 0.45, 0.18, 0xffd43a);
      const cEff = arcArrow([[0.7, 2.0, 0.3], [3.8, 0.2, 0.3], [2.4, -2.1, 0.3]], LAB2 ? C_STIM : C_INH, 0.08, { inhibit: !LAB2 });
      reg(UT, LAB2 ? '產時：OTR + Connexin↑ + PLA₂釋PGF₂α/PGE₂（強縮）' : '孕期靜止：高 P₄ 鎖定 PLA₂ 並壓低 OTR 與 Connexin', 'Myometrial Gap junctions, OTR & PGs',
        '高 P₄ 穩定胞膜不釋放 PLA₂（無足夠花生四烯酸產 PG）；臨產轉為「功能性高 E₂/低 P₄」後，OTR、Connexin（綠點）與 PGF₂α/PGE₂ 聯手發動同步鈣波收縮！',
        [ut, connex, cvxRing, ...cEff], { anchor: [4.2, -2.2, 0.9] });

      S2.fUp = flowOn(cAff.curve, 14, 0.12, 0x38bdf8, 0x103050, LAB2 ? 0.42 : 0.04, 0.03);
      S2.fDn = flowOn(cEff.curve, 16, 0.13, 0x46d16a, 0x104010, LAB2 ? 0.45 : 0.04, 0.03);
      CUR.root.add(S2.fUp, S2.fDn);

      textSprite(LAB2 ? '產時正回饋啟動（Ferguson 反射高速奔馳！）' : '孕期靜止維持（P₄ 鎖住 PLA₂ 與 OTR）', [0, 5.1, 0], 0.35, '#ffd479');

      const dt = dtClock();
      CUR.tick = () => {
        const d = S2.play ? dt() : 0; S2.t += d;
        S2.fUp.run(d); S2.fDn.run(d);
        if (LAB2) { const w = 1 - 0.08 * Math.max(0, Math.sin(S2.t * 3)); ut.scale.set(2.6 * w, 2.3 * (2 - w), 1.8 * w); }
      };
    },
    panel(box) {
      seg(box, '分娩內分泌狀態切換', [[false, '孕期靜止 (P₄鎮定)'], [true, '臨產正回饋 (OT+PG↑)']], LAB2, v => { LAB2 = v; reloadKeep(); });
      note(box, '<b>對比記憶（p.289）：</b>PGF₂α＋PGE₂ 降閾值促收縮；<b>PGI₂（前列環素）</b>舒張平滑肌確保胎盤血流不致被壓斷；<b>RU486</b> 拮抗 P₄ 可誘產人類分娩！', 'big');
      checkbox(box, '播放神經－激素雙向環流', true, v => S2.play = v);
    }
  });

  /* ===== 場景③：綿羊胎兒皮質醇換軌酶 vs 人類胎盤 CRH 與受體撤退（Fig 17.6, Box 17.3） ===== */
  let S3 = null, SP3 = 'sheep'; // sheep | human
  const SP3_TXT = {
    sheep: ['綿羊經典：胎兒下視丘 CRH→ACTH→皮質醇把胎盤 P₄ 變質為雌激素！（Fig 17.6）', '胎兒皮質醇催升胎盤 <b>PGE₂</b> → 激活胎盤 <b>17α-羥化酶 &amp; C17–20 裂解酶</b> → 原本源源產出的 <b>P₄ 改道合成雄烯二酮→雌激素</b>！母血 P₄ 斷崖崩跌、E₂:P₄ 大漲，準時引動分娩（Box 17.3）。'],
    human: ['人類／大猿：母血 P₄ 不降！仰賴「胎盤 CRH 指數暴衝」＋「子宮 PR-B→PR-A/C 功能撤退」', '① 只有人類與大猿之<b>胎盤大量合成 CRH</b>（末期結合蛋白 CRH-BP 下滑使游離 CRH 飆升並激發胎兒 DHEAS／皮質醇形成正回饋）；② 子宮局部「<b>活化型 PR-B</b> 相對抑制型 <b>PR-A/C</b> 降低」且 5β-還原酶↓ → 解鎖 ERα，子宮在局部看見高 E₂/低 P₄（p.291–292）！']
  };
  SCENES.push({
    name: '③ 綿羊vs人類定時器',
    title: '綿羊胎兒皮質醇倒轉 P₄→E₂（Fig 17.6）vs 人類胎盤 CRH 與 PR 受體亞型切換',
    camera: { pos: [0, 0.8, 19.5], target: [0, 0, 0], fit: [10.4, 6.2] },
    controls: [{ label: '🔍 生化開關總覽', fn() { flyHome(); } }],
    desc: `
<p>教科書最易考的一組物種警訊對照：<b>誰按下分娩的開始鍵？</b>大多數哺乳類（以綿羊為經典）由「胎兒皮質醇把胎盤 P₄ 轉產雌激素」；人類卻不見母血 P₄ 下降，而是靠<b>「胎盤 CRH」</b>與子宮肌層 <b>「功能性助孕素撤退」</b>！（Ch.17 p.291–292, Fig 17.6, Box 17.3）</p>
<details open><summary>綿羊 vs 山羊 vs 人類三者關鍵差別</summary><ul>
<li><b>綿羊（Fig 17.6）</b>：胎兒皮質醇 → 胎盤 <b>PGE₂ ↑</b> → <b>17α-OHase + C17–20 lyase</b> → <b>P₄ 轉成 E₂</b>（血 P₄ 暴跌！）。</li>
<li><b>山羊（Box 17.3）</b>：依賴黃體，故皮質醇誘胎盤芳化 DHEA 生 E₂ → PGF₂α 溶黃體降 P₄。</li>
<li><b>人類</b>：胎盤無誘導式 17α-OHase！靠 <b>胎盤 CRH↑ / CRH-BP↓</b> ＋子宮局部 <b>PR-B : PR-A/C ↓</b> 讓子宮盲化於 P₄！</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.17 p.291–293（Fig 17.6, Box 17.3）</p>`,
    build() {
      S3 = { t: 0, play: true };
      const FT = '胎兒 HPA 軸 / DHEAS', PL = '胎盤酵素／胎盤 CRH 工廠', UT = '子宮肌層類固醇比例感應';

      const fBrain = ell([-5.2, 2.4, 0], [1.2, 0.8, 0.8], 0x38bdf8, 0.92);
      const fAdr = ell([-5.2, -1.6, 0], [1.2, 0.95, 0.8], 0xffd43a, 0.95);
      const fArr = arcArrow([[-5.2, 1.5, 0.3], [-5.2, -0.5, 0.3]], C_STIM, 0.06);
      reg(FT, SP3 === 'sheep' ? '綿羊胎兒 PVN CRH → ACTH → 皮質醇暴衝（主計時器）' : '人類胎兒腎上腺「胎兒帶」產 DHEAS 與皮質醇', 'Fetal HPA / Adrenal',
        SP3 === 'sheep' ? '切除綿羊胎兒腦垂腺、腎上腺或破壞 PVN 會讓妊娠無限期延長！注射 ACTH 或地塞米松則立即早產！' : '無腦或先天無腎上腺人類胎兒仍可能在正常範圍內出生，證實胎兒皮質醇並非人類唯一開關。',
        [fBrain, fAdr, ...fArr], { anchor: [-5.5, 3.7, 0.8] });

      // 中間：胎盤酵素轉向 vs 人類 CRH 指數放大環
      const plBox = box([0, 0.4, 0], [3.8, 5.4, 2.0], 0xf97316, 0.38);
      const plNode1 = ell([0, 1.8, 0.3], [1.1, 0.7, 0.7], SP3 === 'sheep' ? 0x45c49e : 0xff70c0, 0.95);
      const plNode2 = ell([0, -1.2, 0.3], [1.2, 0.75, 0.7], 0xffd43a, 0.95);
      reg(PL, SP3 === 'sheep' ? '羊胎盤 PGE₂ 活化 17α-OHase/Lyase（P₄→E₂）' : '人與大猿特異「胎盤 CRH↑＋CRH-BP↓」正回饋', 'Placental enzymatic conversion vs Placental CRH',
        SP3 === 'sheep' ? '原本產出P₄的胎盤被皮質醇＋PGE₂強迫加開 17α-羥化與 C17–20 裂解酶，全速改產 E₂（Fig 17.6）！' : '胎盤產 CRH 刺激胎兒產皮質醇與 DHEAS，而皮質醇反過來<b>更加刺激胎盤 CRH 生產</b>（罕見正回饋！）。',
        [plBox, plNode1, plNode2], { anchor: [0, 3.8, 0.8] });

      // 右側：子宮受體狀態（PR-B vs PR-A/C 與 E₂:P₄）
      const utBox = box([5.4, 0.4, 0], [3.6, 5.4, 2.0], 0xe05060, 0.42);
      const prB = ell([5.4, 1.8, 0.3], [0.85, 0.55, 0.55], SP3 === 'sheep' ? 0x556677 : 0x556677, 0.35);
      const erA = ell([5.4, -1.2, 0.3], [1.2, 0.75, 0.7], 0x46d16a, 0.96);
      reg(UT, SP3 === 'sheep' ? '血漿 E₂ 暴升・P₄ 暴跌 → 子宮強收縮' : '子宮 PR-B↓ / PR-A,C↑（對血中 P₄ 產生抗拒盲化 → ERα 升！）', 'Uterine steroid perception',
        SP3_TXT[SP3][1], [utBox, prB, erA], { anchor: [5.4, 3.8, 0.8] });

      const c1 = arcArrow([[-4.0, -1.4, 0.3], [-1.3, -1.2, 0.3]], 0xffd43a, 0.06);
      const c2 = arcArrow([[1.3, 1.0, 0.3], [4.1, -0.8, 0.3]], 0x46d16a, 0.06);
      addRoot([...c1, ...c2]);
      S3.f1 = flowOn(c1.curve, 10, 0.12, 0xffd43a, 0x302000, 0.34, 0.03);
      S3.f2 = flowOn(c2.curve, 10, 0.12, 0x46d16a, 0x103010, 0.36, 0.03);
      CUR.root.add(S3.f1, S3.f2);

      textSprite(SP3_TXT[SP3][0], [0, 5.1, 0], 0.33, '#ffd479');

      const dt = dtClock();
      CUR.tick = () => {
        const d = S3.play ? dt() : 0; S3.t += d;
        S3.f1.run(d); S3.f2.run(d);
      };
    },
    panel(box) {
      seg(box, '分娩定時物種比較（Fig 17.6）', [['sheep', '綿羊 (HPA→P₄轉E₂)'], ['human', '人類 (CRH+受體撤退)']], SP3, v => { SP3 = v; reloadKeep(); });
      note(box, SP3_TXT[SP3][1], 'big');
      checkbox(box, '播放激素計時路徑', true, v => S3.play = v);
    }
  });
})();
