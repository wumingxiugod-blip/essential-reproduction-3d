/* Ch.18：乳腺腺泡與 P4 煞車解除、PRL(PIF↓/VIP↑)與MER雙反射、初乳/成熟乳/HIV權衡 */
(function () {
  /* ===== 場景①：乳腺葉／腺泡超微結構與孕末 P₄ 撤退發乳（Figs 18.1–18.5, Box 18.2） ===== */
  let S1 = null, L_ST1 = 'lact'; // preg | lact | wean
  const L1_TXT = {
    preg: ['懷孕中後期：高 P₄ + E₂ 鎖住已經熟成的腺泡（禁止泌乳！）', '孕第 4 個月末腺泡上皮已備齊製造能力且血中 <b>PRL 持續攀升</b>，但超高濃度的 <b>胎盤 P₄ 與 E₂ 使乳腺上皮對 PRL 不反應</b>（頂多僅極少初乳，Fig 18.5）！'],
    lact: ['分娩後：P₄/E₂ 斷崖暴跌解除煞車 → 高 PRL 引爆泌乳！', '胎盤排出後類固醇劇降，PRL 全面驅動：① 高基氏體合成 <b>乳蛋白＋乳糖（α-乳白蛋白+半乳糖基轉移酶）</b>經胞吐釋出；② 平滑內質網 <b>乳脂球經頂漿分泌</b>掐入腺泡腔，由<b>肌上皮細胞籃</b>擠進導管！'],
    wean: ['斷奶停餵（~3 個月退化 Involution）：乳汁淤積機械壓迫萎縮！', '停餵時真正壓下分泌的主因不是血 PRL 下滑，而是<b>乳汁滯留撐爆腺泡壓扁微血管造成缺氧與細胞脫落</b>！腺泡回退為雙層非分泌管（產後脂肪組織仍較孕前略厚，p.305）。']
  };
  SCENES.push({
    name: '① 腺泡構造與P4煞車',
    title: '乳腺腺泡胞吐/頂漿雙途徑、物種乳管與 P₄ 撤退開關（Figs 18.1–18.5）',
    camera: { pos: [0, 0.8, 19.5], target: [0, 0, 0], fit: [10.4, 6.2] },
    controls: [
      { label: '🔍 腺泡與乳房全覽', fn() { flyHome(); } },
      { label: '🔍 右：單顆腺泡細胞機轉', fn() { flyFit([3.6, 0, 0], [5.0, 4.4]); } }
    ],
    desc: `
<p>這可能是人類內分泌最劇烈的「開門」設計之一：胎盤整個孕期用超高 P₄ 幫母親造好 <b>15–20 葉乳腺腺泡</b>卻同時用同一顆 P₄「鎖死閥門不准分泌」，直到分娩胎盤脫出那一刻瞬間開閘！（Ch.18 p.298–302, 305, Figs 18.1–18.5）</p>
<details open><summary>必記雙排分泌途徑與肌上皮籃（Fig 18.4）</summary><ul>
<li><b>胞吐途徑（水相）</b>：基部 RER 合成酪蛋白與 <b>α-乳白蛋白</b>，至高基氏體組成「乳糖合成酶」造<b>乳糖</b>，打包小囊泡向頂端胞吐。</li>
<li><b>頂漿分泌（油相 Apocrine）</b>：脂肪微滴直接頂出頂膜、失去微絨毛後連膜掐斷進入腺泡腔！</li>
<li><b>肌上皮細胞籃（Myoepithelial cells）</b>：包夾在腺泡外與基底膜內，受<b>催產素</b>刺激擠出乳汁入 <b>15–20 條獨立輸乳竇（人類特徵，Box 18.2）</b>。</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.18 p.298–306（Figs 18.1–18.5, Table 18.1, Box 18.2）</p>`,
    build() {
      S1 = { t: 0, play: true };
      const BR = '左側：人類乳房 15–20 葉輸乳竇解剖', AL = '右側：放大的分泌腺泡與肌上皮籃（Figs 18.3–18.4）';

      // 左側：乳房解剖剖面 + 葡萄串狀腺泡小葉群 + 膨大輸乳竇 + 乳暈與乳頭（Fig 18.1）
      const breastS = shell(1, [2.9, 3.3, 2.3], 0xf0c8b8, 0.24, 0.45, Math.PI * 1.65);
      breastS.position.set(-4.8, 0, 0);
      const lobes = [];
      const lobCol = L_ST1 === 'lact' ? 0xffe488 : (L_ST1 === 'wean' ? 0x9aa4b2 : 0xe890a8);
      for (let i = 0; i < 6; i++) {
        const ly = -2.0 + i * 0.8;
        const lx = -6.05 + Math.abs(i - 2.5) * 0.24;
        // 葡萄串狀腺泡小葉
        const acPts = [V(lx, ly, 0.15), V(lx - 0.28, ly + 0.18, 0.28), V(lx - 0.26, ly - 0.18, 0.02), V(lx + 0.12, ly + 0.24, -0.05), V(lx + 0.12, ly - 0.22, 0.25)];
        lobes.push(dots(acPts, L_ST1 === 'lact' ? 0.24 : 0.19, lobCol, 0.92));
        // 輸乳管→乳暈下膨大輸乳竇→乳頭獨立細管
        lobes.push(ttube([V(lx + 0.35, ly, 0.14), V(-3.8, ly * 0.46, 0.14), V(-2.95, ly * 0.2, 0.08), V(-2.05, ly * 0.07, 0)], [0.08, 0.14, 0.24, 0.06], L_ST1 === 'lact' ? 0xffe090 : 0xd8a8b8, 0.88, { organic: false }));
      }
      const areola = ring([-2.22, 0, 0], [1, 0, 0], 0.72, 0.16, 0xb8685c, 0.88);
      const nip = ell([-1.92, 0, 0], [0.46, 0.36, 0.36], 0xc07060);
      reg(BR, '15–20 葉葡萄串狀腺泡小葉、輸乳竇與乳暈乳頭（Fig 18.1）', 'Human mammary lobes, alveoli & lactiferous sinuses',
        '各葉腺泡小葉匯入輸乳管，於乳暈下膨大為<b>輸乳竇（貯存小室）</b>再獨立開口於乳頭（反芻牛羊則合併匯入巨大乳腺池與乳頭池）。',
        [breastS, ...lobes, areola, nip], { anchor: [-5.5, 3.4, 0.8] });

      // 右側：單顆放大腺泡剖面（基底微血管 + 基底膜 + 肌上皮條 + 立方分泌上皮 + 頂端胞吐/頂漿微滴！）
      const alvX = 3.8, alvY = 0;
      const bm = shell(1, [3.1, 3.1, 2.3], 0xd8a8b8, 0.28, 0.55, Math.PI * 1.6);
      bm.position.set(alvX, alvY, 0);
      const myoMs = [];
      for (let i = 0; i < 6; i++) {
        const a = -1.25 + i * 0.5;
        const p0 = V(alvX + Math.cos(a - 0.18) * 2.85, alvY + Math.sin(a - 0.18) * 2.85, -0.65);
        const p1 = V(alvX + Math.cos(a) * 2.98, alvY + Math.sin(a) * 2.98, 0.1);
        const p2 = V(alvX + Math.cos(a + 0.18) * 2.85, alvY + Math.sin(a + 0.18) * 2.85, 0.85);
        myoMs.push(ttube([p0, p1, p2], [0.09, 0.14, 0.09], 0xf06070, 0.94, { organic: false }));
      }
      // 一圈 9 顆帶基底核的立方分泌上皮細胞 + 腔內乳汁微滴
      const epCells = [], droplets = [];
      for (let i = 0; i < 9; i++) {
        const a = i / 9 * Math.PI * 1.55 + 0.78;
        const r = 2.22;
        const cx = alvX + Math.cos(a) * r, cy = alvY + Math.sin(a) * r;
        const cCol = L_ST1 === 'preg' ? 0xc890b0 : (L_ST1 === 'lact' ? 0xf6c860 : 0x708090);
        const cell = ell([cx, cy, 0], [0.56, 0.48, 0.52], cCol, L_ST1 === 'wean' ? 0.45 : 0.9);
        cell.rotation.z = a;
        const nuc = ell([alvX + Math.cos(a) * (r + 0.16), alvY + Math.sin(a) * (r + 0.16), 0.12], [0.2, 0.2, 0.2], 0x5c3474, 0.96);
        // 頂端微絨毛與頂漿分泌凸出脂滴（Fig 18.4）
        const mv = capsule([alvX + Math.cos(a) * (r - 0.48), alvY + Math.sin(a) * (r - 0.48), 0.08], [alvX + Math.cos(a) * (r - 0.68), alvY + Math.sin(a) * (r - 0.68), 0.08], 0.035, 0xffe4b8, 0.85);
        epCells.push(cell, nuc, mv);
        if (L_ST1 === 'lact' && i % 2 === 0) {
          epCells.push(ell([alvX + Math.cos(a) * (r - 0.56), alvY + Math.sin(a) * (r - 0.56), 0.12], [0.24, 0.24, 0.24], 0xffe060, 0.95));
        }
      }
      const nDrop = L_ST1 === 'lact' ? 14 : (L_ST1 === 'wean' ? 18 : 2);
      for (let i = 0; i < nDrop; i++) {
        const a = i * 2.4, rad = 0.3 + (i % 4) * 0.28;
        droplets.push(ell([alvX + Math.cos(a) * rad, alvY + Math.sin(a) * rad, (i % 2 ? 0.3 : -0.3)], [0.22, 0.22, 0.22], i % 2 ? 0xffef90 : 0xffffff, L_ST1 === 'wean' ? 0.55 : 0.95));
      }
      const capRing = ring([alvX, alvY, 0], [0, 0, 1], 3.45, 0.12, L_ST1 === 'wean' ? 0x557090 : 0xff3b3b);
      reg(AL, L_ST1 === 'preg' ? '高 P₄ 煞車鎖定腺泡上皮' : (L_ST1 === 'lact' ? '高 PRL 泌乳＋肌上皮籃（紅條）擠乳' : '乳汁漲滿壓扁微血管（紅圈暗化）造成萎縮'), 'Alveolus ultrastructure (Figs 18.3–18.4)',
        L1_TXT[L_ST1][1], [bm, ...myoMs, ...epCells, ...droplets, capRing], { anchor: [6.8, -2.5, 0.9] });

      S1.myoMs = myoMs; S1.droplets = droplets;
      textSprite(L1_TXT[L_ST1][0], [0, 5.0, 0], 0.33, '#ffd479');

      const dt = dtClock();
      CUR.tick = () => {
        const d = S1.play ? dt() : 0; S1.t += d;
        if (L_ST1 === 'lact') {
          const sq = 1 - 0.08 * Math.max(0, Math.sin(S1.t * 4));
          S1.myoMs.forEach(m => m.scale.set(sq, sq, 1));
        }
      };
    },
    panel(box) {
      seg(box, '乳腺內分泌／機械狀態', [['preg', '孕末(P₄煞車)'], ['lact', '產後泌乳(PRL↑)'], ['wean', '斷奶漲壓萎縮']], L_ST1, v => { L_ST1 = v; reloadKeep(); });
      const cv = mkCanvas(box, 290, 140);
      plot(cv, {
        title: 'Fig 18.5 分娩前後類固醇驟降解除 PRL 抑制',
        x: [-12, 16], y: [0, 1.05], xt: [-12, -6, 0, 6, 12], xl: '週數（0 = 分娩）',
        vl: [{ x: 0, col: '#ff7070', label: '分娩(開閘)' }],
        series: [
          { f: w => w < 0 ? 0.1 + 0.85 * Math.pow((w + 12) / 12, 1.5) : 0.04, col: '#ff70c0', label: 'P₄ & E₂ (產後驟降)', w: 2.3 },
          { f: w => w < 0 ? 0.15 + 0.72 * Math.pow((w + 12) / 12, 1.2) : 0.45 + 0.38 * Math.sin(w * 3.1) * 0.3, col: '#e8b84b', label: '泌乳素 PRL (親餵脈衝)', w: 2.3 },
          { f: w => w < 0 ? 0.02 : Math.min(0.95, 0.25 + w * 0.12), col: '#4db8e8', label: '乳汁產量', w: 2.1 }
        ]
      });
      note(box, L1_TXT[L_ST1][1], 'big');
      checkbox(box, '播放肌上皮收縮擠乳', true, v => S1.play = v);
    }
  });

  /* ===== 場景②：造乳 PRL（PIF↓/VIP↑）vs 排乳反射 MER（催產素＋壓力阻斷）（Figs 18.6–18.7） ===== */
  let S2 = null, CUE2 = 'suckle'; // suckle | cry | stress | bromo
  const C2_TXT = {
    suckle: ['真實吸吮乳頭：同時發動「PRL 造乳」＋「催產素排乳 MER」雙路！', '感覺訊號經前外側柱雙路上行：① 抑制弓狀核 <b>TIDA 多巴胺 (PIF↓)</b>＋升 <b>VIP↑</b> 令垂體前葉脈衝分泌 <b>PRL</b>（「邊吃邊點下一餐」）；② 經中腦誘發 <b>PVN/SON 垂體後葉催產素</b>擠壓腺泡排乳（Figs 18.6–18.7）！'],
    cry: ['條件刺激（聽見嬰兒哭聲 / 擠奶桶聲）：只啟動「催產素 MER」！', '注意考試超高頻陷阱：聽覺／視覺心理刺激僅能透過中樞啟動<b>後葉催產素（會漏奶）</b>，卻<b>不能驅動垂體前葉分泌 PRL</b>（PRL 幾乎完全必須靠物理吸吮乳頭才釋放，p.303）！'],
    stress: ['焦慮、產後疼痛或壓力：交感腎上腺素直接鎖死排乳反射（MER）！', '媽媽越焦慮越緊張，交感神經興奮並釋放腎上腺素使乳腺血管收縮、無法把足夠催產素送達肌上皮細胞（同時中樞抑制分泌），導致「有奶卻擠不出來」（p.304）！'],
    bromo: ['多巴胺 D₂ 致效劑（Bromocriptine / Cabergoline）抑制泌乳！', '臨床欲退奶時（如 HIV 帶原或未哺餵母乳），給予 D₂ 致效劑強力模擬 <b>PIF（多巴胺）</b>鎖死垂體前葉，血漿 PRL 暴跌立即關掉乳汁合成！（亦為泌乳素瘤首選治療，p.305, 348）']
  };
  SCENES.push({
    name: '② PRL與MER雙神經反射',
    title: '吸吮雙線軸：TIDA 多巴胺↓/VIP↑→PRL vs 條件刺激催產素 MER（Figs 18.6–18.7）',
    camera: { pos: [0, 0.8, 19.5], target: [0, 0, 0], fit: [10.4, 6.2] },
    controls: [{ label: '🔍 雙腦神經反射全環', fn() { flyHome(); } }],
    desc: `
<p>哺乳成功必須同時運轉「工廠生產線（垂體前葉 <b>PRL</b>）」與「物流泵出線（垂體後葉 <b>Oxytocin</b>）」兩套完全獨立的神經內分泌反射，兩者在條件刺激與藥物敏感性上截然不同！（Ch.18 p.302–304, Figs 18.6–18.7）</p>
<details open><summary>兩條路徑的對比必考清單</summary><ul>
<li><b>造乳軸（PRL，左前葉線）</b>：只認真實吸吮 → 抑 <b>TIDA 多巴胺（PIF）</b>＋昇 <b>VIP</b> → 前葉 PRL → 造乳且抑 GnRH（泌乳無月經）；<b>D₂ 致效劑</b>可一刀切斷！</li>
<li><b>排乳軸（MER，右後葉線）</b>：可被<b>哭聲／性交宮頸擴張</b>條件誘發 → 中腦 → <b>PVN/SON</b> → 後葉催產素 → 肌上皮噴乳；極怕<b>壓力／腎上腺素</b>阻斷！</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.18 p.302–305（Figs 18.6–18.7）</p>`,
    build() {
      S2 = { t: 0, play: true };
      const isPRLOn = CUE2 === 'suckle', isMEROn = CUE2 === 'suckle' || CUE2 === 'cry';
      const HY = '弓狀核 TIDA (PIF↓) vs PVN/SON', PT = '垂體前葉 PRL (左) 與後葉 Oxytocin (右)', BR = '吸吮感覺上傳與乳房標靶';

      // 下視丘雙核 + 垂體前後葉
      const arc = ell([-2.2, 3.6, 0], [1.4, 0.85, 0.9], isPRLOn ? 0xe8b84b : (CUE2 === 'bromo' ? 0xff4040 : 0x556677), 0.92);
      const pvn = ell([2.2, 3.6, 0], [1.4, 0.85, 0.9], isMEROn ? 0x45c49e : (CUE2 === 'stress' ? 0xff5050 : 0x556677), 0.92);
      const antPit = ell([-2.0, 0.7, 0], [1.3, 0.9, 0.9], isPRLOn ? 0xe8b84b : 0x556677, 0.92);
      const postPit = ell([2.0, 0.7, 0], [1.2, 0.9, 0.9], isMEROn ? 0x45c49e : 0x556677, 0.92);
      reg(HY, '左：弓狀核 TIDA(多巴胺↓)+VIP↑ ｜ 右：PVN/SON 催產素核', 'Hypothalamic TIDA/VIP vs PVN/SON', C2_TXT[CUE2][1],
        [arc, pvn], { anchor: [0, 4.9, 0.8] });
      reg(PT, '左：垂體前葉 (PRL) ｜ 右：垂體後葉 (Oxytocin)', 'Anterior (PRL) & Posterior (OT) Pituitary',
        CUE2 === 'bromo' ? '<b>Bromocriptine (D₂ 致效劑)</b> 直接綁定垂體前葉 D₂ 受體強烈抑止 PRL 分泌！' : '前葉受門脈去多巴胺+VIP激發產 PRL；後葉透過神經軸突直放催產素。',
        [antPit, postPit], { anchor: [0, -0.5, 0.9] });

      // 乳房（含乳暈、乳頭、放射狀輸乳管）＋左側脊髓灰白質切片＋吸吮示意（Figs 18.6–18.7）
      const breast = [
        ell([0, -3.15, 0], [2.35, 1.32, 1.25], 0xf0c8b8, 0.55),
        ring([0, -4.15, 0.72], [0, -0.6, 0.8], 0.58, 0.12, 0xb8685c, 0.9),
        ell([0, -4.28, 0.88], [0.32, 0.28, 0.34], 0xc07060, 0.96),
        ...[-1.1, 0, 1.1].map(dx => ttube([V(dx, -2.65, 0.15), V(dx * 0.45, -3.45, 0.48), V(0, -4.18, 0.8)], [0.16, 0.14, 0.06], 0xffe090, 0.88, { organic: false }))
      ];
      const cordS2 = [
        ell([-4.8, -1.0, 0.15], [1.05, 0.72, 0.26], 0xd8e4f0, 0.72),
        ell([-5.12, -1.0, 0.34], [0.2, 0.42, 0.12], 0x8090a8, 0.95),
        ell([-4.48, -1.0, 0.34], [0.2, 0.42, 0.12], 0x8090a8, 0.95),
        box([-4.8, -1.0, 0.34], [0.48, 0.16, 0.12], 0x8090a8, 0.95)
      ];
      const cAff = arcArrow([[-1.2, -3.3, 0.3], [-4.8, -1.0, 0.3], [-4.8, 2.2, 0.3], [-2.5, 3.6, 0.3]], CUE2 === 'suckle' ? 0x38bdf8 : 0x445566, 0.06);
      const cPRL = arcArrow([[-2.0, -0.2, 0.3], [-1.3, -2.2, 0.3]], isPRLOn ? 0xe8b84b : C_INH, 0.07, { inhibit: CUE2 === 'bromo' });
      const cOT = arcArrow([[2.0, -0.2, 0.3], [1.3, -2.2, 0.3]], isMEROn ? 0x45c49e : C_INH, 0.07, { inhibit: CUE2 === 'stress' });
      reg(BR, '乳頭感測上傳（經脊髓背角與前外側柱）與雙荷爾蒙標靶', 'Nipple stimulation, spinal cord & Milk/Ejection targets', C2_TXT[CUE2][1],
        [...breast, ...cordS2, ...cAff, ...cPRL, ...cOT], { anchor: [3.2, -3.4, 0.9] });

      S2.fAf = flowOn(cAff.curve, 12, 0.11, 0x38bdf8, 0x103050, CUE2 === 'suckle' ? 0.38 : 0.02, 0.03);
      S2.fP = flowOn(cPRL.curve, 12, 0.12, 0xe8b84b, 0x403000, isPRLOn ? 0.35 : 0.02, 0.03);
      S2.fO = flowOn(cOT.curve, 12, 0.12, 0x45c49e, 0x103020, isMEROn ? 0.38 : 0.02, 0.03);
      CUR.root.add(S2.fAf, S2.fP, S2.fO);

      textSprite(C2_TXT[CUE2][0], [0, 5.1, 0], 0.33, '#ffd479');

      const dt = dtClock();
      CUR.tick = () => {
        const d = S2.play ? dt() : 0; S2.t += d;
        S2.fAf.run(d); S2.fP.run(d); S2.fO.run(d);
      };
    },
    panel(box) {
      seg(box, '神經刺激／阻斷情境（Figs 18.6–18.7）', [['suckle', '親餵吸吮'], ['cry', '嬰兒哭聲(條件)'], ['stress', '壓力腎上腺素'], ['bromo', 'D₂藥抑乳']], CUE2, v => { CUE2 = v; reloadKeep(); });
      note(box, C2_TXT[CUE2][1], 'big');
      checkbox(box, '播放神經－激素傳導流', true, v => S2.play = v);
    }
  });

  /* ===== 場景③：初乳 vs 成熟乳組成、腸道 TLR 免疫與 HIV 傳染（Table 18.2, Box 18.1） ===== */
  let S3 = null, MILK3 = 'mature'; // colostrum | mature | hiv
  SCENES.push({
    name: '③ 乳汁成分與HIV權衡',
    title: '初乳 (IgG/蛋白↑) vs 成熟乳 (乳糖/脂肪) 與 HIV 垂直途徑分析（Table 18.2, Box 18.1）',
    camera: { pos: [0, 0.8, 19], target: [0, 0, 0], fit: [9.8, 6.0] },
    controls: [{ label: '🔍 乳汁微粒與免疫池', fn() { flyHome(); } }],
    desc: `
<p>人類母乳會精準隨嬰兒消化與免疫階段自動改變配方，從第 1 週高抗體低熱量的<b>初乳（Colostrum）</b>逐步過渡為供能壯腦的<b>成熟乳（Mature milk）</b>；同時須科學審視 <b>HIV 垂直傳染三途徑</b>與母乳益處的權衡（Ch.18 p.305–307, Table 18.2, Box 18.1）。</p>
<details open><summary>不可混淆的初乳 vs 成熟乳與 HIV 檢驗關鍵</summary><ul>
<li><b>初乳（≤40 ml/d）</b>：蛋白・IgG・礦物質・脂溶性維生素（A/D/E/K）比成熟乳<b>高</b>；乳糖・脂肪・水溶性 B/C 維生素則較<b>低</b>。</li>
<li><b>成熟乳（65 kcal/100 ml）</b>：~90 g% 水、~7 g% 乳糖（培植雙歧桿菌＋髓鞘化）、高度乳化脂滴、調節腸道 <b>TLR</b> 避免過度發炎壞死！</li>
<li><b>HIV 檢驗陷阱</b>：所有 HIV+ 母所生新生兒出生皆測得抗體陽性（母源 IgG！），若無親餵須待 <b>6 個月</b>後方能分出真主動感染（主發生於產時出血＋哺乳）。</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.18 p.305–307（Box 18.1, Table 18.2）</p>`,
    build() {
      S3 = { t: 0, play: true };
      const MK = '乳汁微觀顆粒池', IM = '新生兒腸道先天免疫 TLR 平衡與 HIV 考量';
      const pool = ell([-3.5, 0, 0], [3.6, 3.2, 2.4], MILK3 === 'colostrum' ? 0xf5d040 : (MILK3 === 'mature' ? 0xf8f8ff : 0xff6080), 0.25);

      const partsMs = [pool];
      // 依模式顯示蛋白質/IgG(綠大球)、乳化脂肪滴(黃橘)、乳糖分子(青小珠)或 HIV 顆粒(紫紅刺球)
      const nIg = MILK3 === 'colostrum' ? 16 : 5;
      const nFat = MILK3 === 'mature' ? 18 : 6;
      for (let i = 0; i < nIg; i++) {
        const a = i * 2.1, r = 0.6 + (i % 4) * 0.55;
        partsMs.push(ell([-3.5 + Math.cos(a) * r, Math.sin(a * 1.4) * r * 0.85, (i % 3 - 1) * 0.7], [0.24, 0.24, 0.24], 0x45c49e, 0.95));
      }
      for (let i = 0; i < nFat; i++) {
        const a = i * 1.7 + 0.5, r = 0.5 + (i % 5) * 0.45;
        partsMs.push(ell([-3.5 + Math.sin(a) * r, Math.cos(a * 1.2) * r * 0.85, (i % 2 ? 0.6 : -0.6)], [0.26, 0.26, 0.26], 0xffd43a, 0.92));
      }
      if (MILK3 === 'hiv') {
        for (let i = 0; i < 9; i++) {
          const a = i * 2.4;
          partsMs.push(ell([-3.5 + Math.cos(a) * 1.6, Math.sin(a * 1.3) * 1.2, 0.9], [0.22, 0.22, 0.22], 0xff2840, 0.98));
        }
      }
      reg(MK, MILK3 === 'colostrum' ? '初乳（高 IgG・乳鐵蛋白・維生素 A/D/E/K；低脂糖）' : (MILK3 === 'mature' ? '成熟乳（~7 g% 乳糖・微乳化脂球・65 kcal/100 ml）' : '未治療 HIV+ 母乳內含游離／細胞內病毒（瓶餵降半風險）'), 'Milk micro-components',
        MILK3 === 'colostrum' ? '第 1 週每日僅 ≤40 ml 的黃稠初乳：以免疫保護（IgG、溶菌酶、乳鐵蛋白）與脂肪攜帶脂溶維生素為重心。' : '2–3 週後乳糖與乳脂全面提升供給高速腦發育；乳化脂肪幾乎可 100% 吸收且高含 DHA（Box 18.1）。',
        partsMs, { anchor: [-3.5, 3.8, 0.9] });

      // 右側：新生兒無菌腸道面對第一次微生物與抗原挑戰
      const gutWall = box([4.2, -1.5, 0], [5.4, 1.4, 2.2], 0xe8889a, 0.78);
      const lactoB = dots([V(2.5, -0.5, 0.4), V(3.6, -0.4, -0.3), V(4.8, -0.5, 0.5), V(5.9, -0.4, -0.2)], 0.16, 0x38bdf8); // Lactobacillus bifidus
      const tlrRec = dots([V(2.4, -0.9, 0.9), V(4.2, -0.9, 0.9), V(6.0, -0.9, 0.9)], 0.14, 0x45c49e);
      reg(IM, '新生兒無菌腸道・乳糖培植雙歧桿菌（藍）與 TLR 免疫調節', 'Sterile neonatal gut, Bifidus flora & TLR balance',
        MILK3 === 'hiv' ? '無抗反轉錄病毒藥下：東非未治療垂直傳染約 25–35%（歐洲 15–20%）；瓶餵減半傳染但需權衡貧困地區腹瀉死亡風險（p.306–307）！' : '母乳活性因子與乳糖養殖乳酸菌並選擇性調節腸上皮 TLR 先天免疫，大幅降壞死性腸炎與牛奶蛋白過敏（Box 18.1）。',
        [gutWall, lactoB, tlrRec], { anchor: [4.2, 0.5, 0.9] });

      textSprite(MILK3 === 'colostrum' ? '第 1 週：高抗體初乳' : MILK3 === 'mature' ? '第 3+ 週：成熟母乳 (65 kcal/100ml)' : 'HIV 垂直傳染途徑與 6 月複檢邏輯', [0, 5.0, 0], 0.35, '#ffd479');

      const dt = dtClock();
      CUR.tick = () => {
        const d = S3.play ? dt() : 0; S3.t += d;
        CUR.root.rotation.y = Math.sin(S3.t * 0.45) * 0.14;
      };
    },
    panel(box) {
      seg(box, '成分與臨床情境切換', [['colostrum', '初乳(≤40ml)'], ['mature', '成熟乳(Table 18.2)'], ['hiv', 'HIV垂直權衡']], MILK3, v => { MILK3 = v; reloadKeep(); });
      const ch = chartBox(box, 128);
      drawBars(ch, [
        { label: '水份(90%)', v: 0.9, col: '#38bdf8', txt: '成熟乳 ~90 g%' },
        { label: '乳糖(7%)', v: MILK3 === 'colostrum' ? 0.32 : 0.72, col: '#e8b84b', txt: MILK3 === 'colostrum' ? '較低' : '~7 g% (養乳酸菌)' },
        { label: 'IgG/蛋白', v: MILK3 === 'colostrum' ? 0.95 : 0.35, col: '#45c49e', txt: MILK3 === 'colostrum' ? '極高(免疫防線)' : '成熟較降' },
        { label: '乳脂熱量', v: MILK3 === 'colostrum' ? 0.3 : 0.85, col: '#f09a4a', txt: MILK3 === 'colostrum' ? '較低' : '65 kcal/100ml' }
      ]);
      note(box, 'WHO / UNICEF 建議<b>純母乳哺餵 6 個月</b>最佳（Box 18.1）；注意帶原母胎生出 100% 帶母 IgG 抗體須 6 月複驗確認（p.307）。', 'big');
      checkbox(box, '微幅立體觀察', true, v => S3.play = v);
    }
  });
})();
