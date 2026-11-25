/* Ch.2：性別決定與生殖道分化（PGC遷徙與性腺分化、SRY-SOX9切換、內生殖道雙管、外生殖器分化） */
(function () {
  /* ===== 場景①：三波細胞與性腺分化（Figs 2.2–2.4） ===== */
  let S1 = null, SEX1 = 'XY', WK1 = 2; // 0:3週PGC, 1:5週無差別, 2:8-20週分化
  SCENES.push({
    name: '① 性腺原基分化',
    title: '三波細胞遷徙與雙潛能性腺分化為睪丸／卵巢（Figs 2.2–2.4）',
    camera: { pos: [0, 0.5, 20], target: [0, 0, 0], fit: [10.8, 6.4] },
    controls: [
      { label: '🔍 全部', fn() { flyHome(); } },
      { label: '🔍 左：3週胚 PGC 遷徙', fn() { flyFit([-5.6, 0, 0], [4.5, 4.2]); } },
      { label: '🔍 右：性腺剖面分化', fn() { flyFit([4.4, 0, 0], [5.4, 4.4]); } }
    ],
    desc: `
<p>性腺原基（genital ridge）於胚胎 <b>3.5–4.5 週</b>形成於背主動脈兩側，並由<b>三波遷徙細胞</b>構築為睪丸或卵巢（Ch.2 p.37–41, Figs 2.2–2.4）。</p>
<details open><summary>三波細胞來源與命運</summary><ol>
<li><b>PGCs（第 3→6 週）</b>：源自卵黃囊近尿囊基部（BMP4 → <i>fragilis/Stella</i>），沿後腸腸繫膜阿米巴運動進入生殖嵴；<b>不表現 Sry</b>。</li>
<li><b>原始性索（體腔上皮）</b>：<b>唯一表現 Sry 的細胞</b>。XY 深入髓質包圍 PGCs 成<b>睪丸索（前塞透力氏細胞）</b>＋表層形成纖維性<b>白膜</b>；XX 停留皮質形成<b>原始濾泡（顆粒細胞）</b>，卵原細胞進入第一次減數分裂並停頓於<b>核網期（dictyate）</b>。</li>
<li><b>中腎細胞（FGF9 招募）</b>：形成睪丸血管、<b>來狄吉細胞</b>、<b>肌樣細胞</b>與<b>睪丸網（rete testis）</b>（連通輸精小管到吳爾夫氏管）；女性則成血管與濾泡膜（theca），髓質索退化，無管腔連通。</li></ol></details>
<p class="src">Essential Reproduction 7e Ch.2 p.37–42（Figs 2.2–2.4）</p>`,
    build() {
      S1 = { t: 0, play: true };
      const EM = '3 週胚與 PGC 遷徙（左）', GN = '性腺橫切分化（右）';
      // 左：3-4 週胚胎示意（羊膜、卵黃囊、後腸、尿囊、生殖嵴）
      const body = ttube([[-7.2, 2.2, 0], [-6.6, 3.3, 0], [-4.8, 3.0, 0], [-4.3, 1.0, 0], [-5.2, -1.6, 0], [-6.6, -2.5, 0]], [0.65, 1.15, 1.3, 1.25, 0.95, 0.55], 0xe8c8a8, 0.32);
      const yolk = ell([-7.1, -0.8, 0.2], [1.25, 1.25, 1.1], 0xffd479, 0.45);
      const gut = ttube([[-5.8, 2.1, 0], [-5.3, 0.4, 0], [-5.6, -1.4, 0]], 0.22, 0xc87a58, 0.75, { organic: false });
      const ridgeL = ell([-4.7, 0.5, 0.1], [0.42, 1.1, 0.4], 0x90d8ff, 0.85);
      const migPts = [V(-7.1, -1.5, 0.4), V(-6.4, -1.6, 0.4), V(-5.6, -1.2, 0.4), V(-5.2, -0.3, 0.35), V(-4.7, 0.5, 0.3)];
      const migPath = ttube(migPts, 0.05, 0x46d16a, 0.85, { organic: false });
      reg(EM, '卵黃囊與尿囊基部', 'Yolk sac & allantois base', '約第 3 週在此出現約 100 顆由 BMP4 誘導形成的 PGCs（表現 <i>fragilis</i> 與 <i>Stella</i>）。', [yolk, body], { anchor: [-8.0, -0.8, 0.6] });
      reg(EM, '後腸腸繫膜遷徙路徑', 'Hindgut migratory route', 'PGCs 經後腸結締組織與腸繫膜，於第 6 週完成阿米巴移動抵達生殖嵴（生殖嵴會分泌化學趨化物質）。', [gut, migPath], { anchor: [-6.4, -2.4, 0.6] });
      reg(EM, '生殖嵴原基', 'Genital ridge primordium', '位於中腎與背主動脈兩側的體腔間葉原基（3.5–4.5 週）。', ridgeL, { anchor: [-3.4, 0.6, 0.6] });

      S1.pgcs = particles(14, 0.14, 0xffff70, 0x606000); CUR.root.add(S1.pgcs);
      S1.migC = migPath.userData.curve;

      // 右：性腺剖面（依 WK1 與 SEX1 改變）
      const gonOuter = shell(3.1, [1.1, 1.25, 0.8], SEX1 === 'XY' && WK1 === 2 ? 0xf4f1ea : 0xe8b0c8, 0.35, Math.PI * 0.45, Math.PI * 1.1);
      gonOuter.position.set(4.8, 0.2, 0);
      reg(GN, SEX1 === 'XY' && WK1 === 2 ? '白膜（Tunica albuginea）與表皮' : '生殖（體腔）上皮', 'Tunica albuginea / Coelomic epithelium',
        SEX1 === 'XY' ? '在 SRY/SOX9 下，雄性性索與上皮之間形成厚實纖維性白膜，將睪丸索隔離於髓質（Fig 2.3a）。' : '雌性無 SRY，體腔上皮不退離反而向皮質凝集包圍卵原細胞形成原始濾泡（Fig 2.3c）。',
        gonOuter, { anchor: [4.8, 4.1, 0.6] });

      // 性索／睪丸索／原始濾泡 + 中腎管／睪丸網
      const cords = [];
      const germDots = [];
      if (WK1 === 0) {
        for (let i = 0; i < 4; i++) cords.push(cyl([2.4, -0.6 + i * 0.5, 0], [3.6, -0.6 + i * 0.5, 0], 0.14, 0x90b0d8, 0.6));
        reg(GN, '尚未遷入之原始性腺原基', 'Early ridge mesenchyme (3 wks)', 'PGCs 尚在往生殖嵴遷徙中，性別尚未分化。', cords, { anchor: [4.8, 0.2, 0.6] });
      } else if (WK1 === 1) {
        for (let i = 0; i < 5; i++) {
          cords.push(ttube([[2.4, -1.2 + i * 0.65, 0], [4.2, -1.0 + i * 0.55, 0], [5.8, -0.8 + i * 0.45, 0]], 0.16, 0xa8c4e8, 0.75, { organic: false }));
          germDots.push(V(4.6, -0.9 + i * 0.5, 0.25), V(5.4, -0.8 + i * 0.45, 0.25));
        }
        reg(GN, '無差別性腺（5 週）', 'Indifferent gonad (week 5)', '男女外觀完全無法區分：同時具有體腔上皮性索、進駐的 PGCs 以及鄰近的吳爾夫氏與穆勒氏管（Fig 2.2d）。', [...cords, dots(germDots, 0.17, 0xffe060)], { anchor: [5.0, -3.4, 0.6] });
      } else if (SEX1 === 'XY') {
        // 馬蹄形精索 + 連通睪丸網 + 輸出小管 → 吳爾夫氏管
        for (let i = 0; i < 4; i++) {
          const y = -1.6 + i * 1.1;
          cords.push(ttube([[3.4, y + 0.15, 0], [5.4, y + 0.4, 0.4], [6.5, y, 0], [5.4, y - 0.4, -0.3], [3.4, y - 0.15, 0]], 0.22, 0x70b8ff, 0.88, { organic: false }));
          germDots.push(V(5.6, y + 0.2, 0.2), V(6.1, y, 0.1), V(5.2, y - 0.25, -0.1));
        }
        const rete = ttube([[3.3, -1.8, 0], [3.1, 0, 0], [3.3, 1.8, 0]], 0.24, 0x9fd8ff);
        const vasa = [0, 1, 2].map(i => cyl([2.1, -0.6 + i * 0.6, 0], [3.1, -0.5 + i * 0.5, 0], 0.11, 0x4aa8ff));
        const wolff = cyl([2.0, -3.2, 0], [2.0, 2.8, 0], 0.2, 0x3f7bff);
        const leydig = dots([V(4.6, -0.6, 0.5), V(5.1, 0.5, 0.6), V(4.5, 1.5, 0.4), V(5.5, -1.4, 0.4)], 0.2, 0xff9a3a);
        reg(GN, '馬蹄形睪丸索（前塞透力氏＋生殖細胞）', 'Horseshoe seminiferous cords', 'Sry→Sox9 誘導前塞透力氏細胞包圍 PGCs（成前精原細胞 prospermatogonia，停滯於有絲分裂直到青春期）。', [...cords, dots(germDots, 0.14, 0xffe060)], { anchor: [6.8, 1.2, 0.6] });
        reg(GN, '睪丸網與輸出小管 → 吳爾夫氏管', 'Rete testis & vasa efferentia', '中腎索形成睪丸網並與中腎小管（輸出小管）接通至吳爾夫氏管，建立未來排精管道（Fig 2.3b）。', [rete, ...vasa, wolff], { anchor: [2.1, -2.9, 0.6] });
        reg(GN, '間質來狄吉細胞（分泌睪固酮）', 'Fetal Leydig cells', '由中腎遷移細胞形成，第 8–24 週大量分泌雄性素引導男性分化。', leydig, { anchor: [5.4, -2.8, 0.6] });
      } else {
        // 卵巢皮質原始濾泡 + 退化髓質索 + 穆勒氏管
        for (let i = 0; i < 8; i++) {
          const a = -1.2 + i * 0.35;
          const x = 4.9 + Math.cos(a) * 2.1, y = 0.2 + Math.sin(a) * 2.4;
          cords.push(ell([x, y, 0.2], [0.42, 0.42, 0.42], 0xff8ab8, 0.68));
          germDots.push(V(x, y, 0.2));
        }
        const degen = [0, 1, 2].map(i => cyl([3.3, -0.7 + i * 0.7, 0], [4.4, -0.5 + i * 0.5, 0], 0.08, 0x7a8090, 0.35));
        const mull = cyl([2.0, -3.2, 0], [2.0, 2.8, 0], 0.22, 0xff70a8);
        reg(GN, '皮質索與原始濾泡（減數前期 I 停頓）', 'Cortical primordial follicles', '無 Sry 時體腔上皮包裹卵原細胞於皮質，全部進入第一次減數分裂並停於核網期（dictyate GV），出生時即定下終生卵子庫存（Fig 2.3c,d）。', [...cords, dots(germDots, 0.18, 0xffe870)], { anchor: [7.2, 1.0, 0.6] });
        reg(GN, '退化髓質索（不與中腎管連通）', 'Degenerating medullary cords', '缺乏睪丸網連通（無持續 rete ovarii），故成年卵子只能從卵巢表面排入腹腔由輸卵管繖部捕捉。', degen, { anchor: [3.8, -2.6, 0.5] });
        reg(GN, '穆勒氏管（持續保留）', 'Müllerian duct', '無 AMH 時分化為輸卵管、子宮與上陰道。', mull, { anchor: [2.0, -2.9, 0.6] });
      }

      const dt = dtClock();
      CUR.tick = () => {
        const d = S1.play ? dt() : 0; S1.t += d;
        for (let i = 0; i < 14; i++) {
          const maxK = WK1 === 0 ? ((S1.t * 0.3 + i / 14) % 0.85) : 0.82 + 0.15 * ((i % 5) / 4);
          S1.pgcs.setP(i, S1.migC.getPointAt(clamp(maxK, 0, 1)).add(V((i % 3 - 1) * 0.08, ((i * 7) % 3 - 1) * 0.08, 0.1)));
        }
        S1.pgcs.instanceMatrix.needsUpdate = true;
      };
    },
    panel(box) {
      seg(box, '基因型選擇', [['XY', '46,XY（有 Sry）'], ['XX', '46,XX（無 Sry）']], SEX1, v => { SEX1 = v; reloadKeep(); });
      seg(box, '胚胎週數階段', [[0, '3 週 PGC 遷徙'], [1, '5 週無差別性腺'], [2, '8–24 週分化完成']], WK1, v => { WK1 = v; reloadKeep(); });
      checkbox(box, '播放 PGC 遷徙動畫', true, v => S1.play = v);
    }
  });

  /* ===== 場景②：SRY–SOX9 vs FOXL2 分子開關（p.40–41） ===== */
  let S2 = null, MUT2 = 'xy';
  const MUT_INFO = {
    xy: ['正常 XY 男性', 'SRY 活化 SOX9 → SOX9 自促正回饋＋PGD₂（橫向同步）＋FGF9（招中腎細胞）＋AMH；強力抑制 WNT4/FOXL2 → 形成睪丸。', true, true, true, false],
    xx: ['正常 XX 女性', '無 SRY → WNT4 / FOXL2 表現上升，抑制 SOX9 → 分化為卵巢並維持顆粒／膜細胞命運。', false, false, false, true],
    sry_xx: ['Sry 轉殖基因 XX 雄性（或 SOX9 重複）', '即使無 Y 染色體其他基因，單一 Sry 或 SOX9 高表現即可啟動完整下游級聯 → XX 發育出睪丸！', false, true, true, false],
    fgf9_ko: ['FGF9（或受體）基因剔除之 XY', '缺乏 FGF9 招募中腎細胞與正回饋支持，SOX9 無法維持足夠強度 → XY 出現卵巢或卵睪症（ovo-testis）！', true, false, false, true],
    foxl2_ko: ['成年雌鼠剔除 Foxl2', '卵巢顆粒細胞在成年後失去 FOXL2 抑制 → SOX9 重新上升 → 卵巢轉分化為類似睪丸的索狀結構！', false, true, false, false]
  };
  SCENES.push({
    name: '② SRY/SOX9 分子開關',
    title: 'SRY–SOX9 正回饋網路 vs WNT4–FOXL2 終生對抗（Ch.2 p.40–41）',
    camera: { pos: [0, 0.5, 19.5], target: [0, 0, 0], fit: [9.8, 6.2] },
    controls: [{ label: '🔍 全圖', fn() { flyHome(); } }],
    desc: `
<p><b>SRY</b> 僅發出「決策命令」，真正的「執行主管」是體染色體轉錄因子 <b>SOX9</b>；兩派基因在胚胎與成年期呈現動態平衡（Ch.2 p.40–41）。</p>
<details open><summary>關鍵實驗與突變證據</summary><ul>
<li><b>SRY 轉殖至 XX 單細胞受精卵</b>或 <b>SOX9 基因重複</b> → XX 雄性（證明 SRY/SOX9 足以造出睪丸）。</li>
<li><b>SOX9 突變（Campomelic dysplasia）</b>或 <b>FGF9 剔除</b> → XY 女性或卵睪症。</li>
<li><b>成年期可塑性</b>：成年雌鼠剔除 <i>Foxl2</i> → 卵巢轉分化為睪丸；成年雄鼠剔除 <i>Dmrt1</i> → SOX9 下降、FOXL2 上升並出現顆粒細胞特徵。</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.2 p.40–41</p>`,
    build() {
      S2 = { t: 0 };
      const [title, descTxt, hasSry, soxOn, fgfOn, ovOn] = MUT_INFO[MUT2];
      const N = '雄性調控軸（SRY–SOX9）', F = '雌性調控軸（WNT4–FOXL2）', OUT = '性腺命運';
      const sryM = ell([-6.0, 2.8, 0], [1.1, 0.7, 0.7], hasSry ? 0x4aa8ff : 0x445566, hasSry ? 1 : 0.35);
      const soxM = ell([-2.2, 2.0, 0], [1.4, 0.95, 0.95], soxOn ? 0x38d890 : 0x445566, soxOn ? 1 : 0.35);
      const pgdM = ell([-2.2, 4.4, 0], [0.85, 0.55, 0.65], soxOn ? 0xffb84a : 0x445566, soxOn ? 1 : 0.35);
      const fgfM = ell([1.8, 3.2, 0], [0.95, 0.65, 0.7], fgfOn ? 0x60e8ff : 0x445566, fgfOn ? 1 : 0.35);
      const amhM = ell([1.8, 0.9, 0], [0.95, 0.65, 0.7], soxOn ? 0x90a8ff : 0x445566, soxOn ? 1 : 0.35);
      const dmrM = ell([-5.4, -0.2, 0], [0.9, 0.6, 0.65], soxOn ? 0x70c8ff : 0x445566, soxOn ? 1 : 0.35);
      const foxM = ell([-2.2, -2.5, 0], [1.35, 0.9, 0.9], ovOn ? 0xff70b0 : 0x445566, ovOn ? 1 : 0.35);
      const gonM = ell([5.8, 0, 0], ovOn ? [1.7, 1.15, 1.1] : [1.4, 1.9, 1.3], ovOn ? 0xff85b8 : (soxOn ? 0x5aa8ff : 0xb080d0));

      reg(N, 'SRY（Y 染色體短臂啟動基因）', 'SRY transcription factor', '須入核結合 SOX9 上游啟動子；為短暫「啟動訊號」。', sryM, { anchor: [-6.8, 3.8, 0.5] });
      reg(N, 'SOX9（自促正回饋核心）', 'SOX9 master regulator', '能結合自身啟動子持續維持高表現（即使 SRY 關閉後仍維持），並強力壓抑 FOXL2/WNT4。', soxM, { anchor: [-3.2, 2.2, 0.8] });
      reg(N, 'PGD₂（旁分泌強化正回饋）', 'Prostaglandin D₂', '促使鄰近尚未啟動的前塞透力氏細胞同步轉向 SOX9 路徑，確保整顆性腺一致分化。', pgdM, { anchor: [-2.2, 5.2, 0.5] });
      reg(N, 'FGF9（招募中腎細胞＋正回饋）', 'Fibroblast growth factor 9', '化學趨化招募中腎肌樣與血管細胞進入睪丸並正回饋維持 SOX9；缺失則逆轉為卵巢/卵睪症。', fgfM, { anchor: [2.2, 4.1, 0.5] });
      reg(N, 'AMH（抗穆勒氏管激素）', 'Anti-Müllerian hormone', '由 SOX9 直接啟動表現，令胎兒穆勒氏管凋亡退化（Box 2.3）。', amhM, { anchor: [2.2, -0.2, 0.5] });
      reg(N, 'DMRT1（成體維持 SOX9）', 'DMRT1 maintenance factor', '成年睪丸若剔除 Dmrt1，SOX9 下降而 FOXL2 上升，導致塞透力氏細胞轉為顆粒細胞。', dmrM, { anchor: [-6.6, -0.2, 0.5] });
      reg(F, 'WNT4 / FOXL2（卵巢路徑）', 'WNT4 / FOXL2 pathway', '主動推動顆粒／膜細胞分化並抑制 SOX9；成年雌性若失活 Foxl2 亦會轉分化出睪丸構造。', foxM, { anchor: [-2.2, -3.7, 0.5] });
      reg(OUT, ovOn ? '最終性腺：卵巢' : '最終性腺：睪丸', ovOn ? 'Ovary' : 'Testis', descTxt, gonM, { anchor: [5.8, -2.5, 0.6] });

      // 連線箭頭
      addRoot(arcArrow([[-4.8, 2.7, 0], [-3.5, 2.3, 0]], hasSry ? C_STIM : 0x445566, 0.06));
      addRoot(arcArrow([[-2.5, 3.0, 0], [-2.5, 3.8, 0], [-1.7, 3.8, 0], [-1.7, 3.0, 0]], soxOn ? 0xffb84a : 0x445566, 0.05));
      addRoot(arcArrow([[-0.9, 2.4, 0], [0.8, 3.0, 0]], soxOn ? C_STIM : 0x445566, 0.055));
      addRoot(arcArrow([[0.9, 3.5, 0], [-0.8, 2.7, 0]], fgfOn ? C_STIM : 0x445566, 0.055));
      addRoot(arcArrow([[-0.9, 1.6, 0], [0.8, 1.1, 0]], soxOn ? C_STIM : 0x445566, 0.055));
      addRoot(arcArrow([[-4.5, 0.3, 0], [-3.4, 1.3, 0]], soxOn ? C_STIM : 0x445566, 0.05));
      // 互斥抑制箭頭（SOX9 ⊣ FOXL2 / FOXL2 ⊣ SOX9）
      addRoot(arcArrow([[-2.6, 0.9, 0], [-2.6, -1.5, 0]], soxOn ? C_INH : 0x445566, 0.06, { inhibit: true }));
      addRoot(arcArrow([[-1.8, -1.5, 0], [-1.8, 0.9, 0]], ovOn ? C_INH : 0x445566, 0.06, { inhibit: true }));
      addRoot(arcArrow([[2.8, 2.8, 0], [4.2, 1.0, 0]], fgfOn && soxOn ? C_STIM : 0x445566, 0.06));
      addRoot(arcArrow([[-0.8, -2.3, 0], [4.1, -0.6, 0]], ovOn ? C_STIM : 0x445566, 0.06));

      textSprite(title, [0, 5.4, 0], 0.44, '#ffd479');

      const dt = dtClock();
      CUR.tick = () => {
        S2.t += dt();
        const k = 1 + 0.07 * Math.sin(S2.t * 3);
        if (soxOn) soxM.scale.set(1.4 * k, 0.95 * k, 0.95 * k);
        if (ovOn) foxM.scale.set(1.35 * k, 0.9 * k, 0.9 * k);
      };
    },
    panel(box) {
      selectBox(box, '實驗／臨床基因型模型', [
        ['xy', '正常 46,XY（Sry + Sox9 + FGF9）'],
        ['xx', '正常 46,XX（Wnt4 + Foxl2）'],
        ['sry_xx', 'Sry 轉殖基因 XX 雄性（XX testis）'],
        ['fgf9_ko', 'FGF9 缺失 XY（逆轉／卵睪症）'],
        ['foxl2_ko', '成年雌性剔除 Foxl2（轉分化）']
      ], v => { MUT2 = v; reloadKeep(); }).value = MUT2;
      note(box, MUT_INFO[MUT2][1], 'big');
    }
  });

  /* ===== 場景③：內生殖道雙管選一與繼發性雌雄同體（Fig 2.5, 2.7） ===== */
  let S3 = null, COND3 = 'male';
  const COND3_INFO = {
    male: ['正常男性 (XY)', '睪丸分泌 T 維持<b>吳爾夫氏管</b>（副睪、輸精管、儲精囊），並分泌 AMH 使<b>穆勒氏管退化</b>（僅留 appendix testis 與 utriculus prostaticus）。', true, false],
    female: ['正常女性 (XX)', '無高濃度 T → 吳爾夫氏管退化（殘留 epoophoron、Gartner 囊腫）；無 AMH → <b>穆勒氏管</b>融合發育為輸卵管、子宮、子宮頸與上陰道。', false, true],
    cais: ['完全雄性素不敏 CAIS (XY)', '雖有睪丸並正常分泌 AMH（→ <b>無子宮與輸卵管</b>），但因缺乏雄性素受體（AR），T 無法作用 → 吳爾夫氏管亦退化，外觀為女性！', false, false],
    cah: ['先天腎上腺增生 CAH (XX)', '無 AMH → 保留<b>女性子宮與輸卵管</b>；但腎上腺過量雄性素可部分保留吳爾夫氏管並使外生殖器男性化。', true, true],
    pmds: ['持續性穆勒氏管 PMDS (XY)', 'AMH 或 AMHR2 基因突變 → 男性同時具有正常輸精管與<b>發育完整的子宮／輸卵管</b>（常伴隱睪）。', true, true]
  };
  SCENES.push({
    name: '③ 內生殖道分化',
    title: '吳爾夫氏管 vs 穆勒氏管分化與臨床症候群模擬（Figs 2.5, 2.7）',
    camera: { pos: [0, 0.2, 18.5], target: [0, 0, 0], fit: [8.8, 6.4] },
    controls: [{ label: '🔍 全貌', fn() { flyHome(); } }],
    desc: `
<p>不同於雙潛能的性腺原基，胚胎同時具備兩對獨立的「單潛能」內生殖道原基：<b>吳爾夫氏管（Wolffian）</b>與<b>穆勒氏管（Müllerian）</b>（Ch.2 p.42–46, Fig 2.5）。</p>
<details open><summary>雙激素控制原則</summary><ul>
<li><b>吳爾夫氏管（藍）</b>：需胎兒睪丸分泌<b>高濃度睪固酮（T）</b>（旁分泌）才得以維持並分化為<b>副睪、輸精管、儲精囊</b>；缺乏或 AR 失能則退化。</li>
<li><b>穆勒氏管（粉）</b>：不須卵巢支持即會<b>自發保留並融合成輸卵管、子宮、子宮頸與上陰道</b>；唯有在塞透力氏細胞分泌 <b>AMH</b> 作用下才會凋亡退化。</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.2 p.42–46（Figs 2.5, 2.7）</p>`,
    build() {
      S3 = { t: 0 };
      const [lbl, txt, keepW, keepM] = COND3_INFO[COND3];
      const G = '性腺', W = '吳爾夫氏管（雄性道）', M = '穆勒氏管（雌性道）';
      const isTestis = COND3 !== 'female' && COND3 !== 'cah';
      // 雙側性腺
      const gL = ell([-3.5, 3.2, 0], isTestis ? [0.75, 1.0, 0.75] : [1.0, 0.65, 0.65], isTestis ? 0x5aa8ff : 0xff90b8);
      const gR = ell([3.5, 3.2, 0], isTestis ? [0.75, 1.0, 0.75] : [1.0, 0.65, 0.65], isTestis ? 0x5aa8ff : 0xff90b8);
      reg(G, isTestis ? '胎兒睪丸' : '胎兒卵巢', isTestis ? 'Fetal testes' : 'Fetal ovaries',
        isTestis ? '分泌睪固酮（第 8–24 週高峰）與 AMH。' : '胎兒卵巢無須內分泌活性即可引導女性生殖道分化。', [gL, gR], { anchor: [-4.5, 3.5, 0.5] });

      // 吳爾夫氏管（兩側降下至尿道/前列腺與儲精囊）
      const wL = ttube([[-3.0, 3.1, 0.1], [-2.8, 1.4, 0.1], [-2.0, -0.6, 0.1], [-0.9, -2.1, 0.1], [-0.3, -3.0, 0.1]], keepW ? 0.2 : 0.06, 0x3b82f6, keepW ? 0.95 : 0.25, { organic: false });
      const wR = ttube([[3.0, 3.1, 0.1], [2.8, 1.4, 0.1], [2.0, -0.6, 0.1], [0.9, -2.1, 0.1], [0.3, -3.0, 0.1]], keepW ? 0.2 : 0.06, 0x3b82f6, keepW ? 0.95 : 0.25, { organic: false });
      const sv = keepW ? [ell([-0.9, -2.6, -0.2], [0.55, 0.25, 0.25], 0x2563eb), ell([0.9, -2.6, -0.2], [0.55, 0.25, 0.25], 0x2563eb)] : [];
      reg(W, keepW ? '吳爾夫氏管 → 副睪、輸精管、儲精囊' : '吳爾夫氏管退化（殘留 Gartner 囊腫等）', 'Wolffian (mesonephric) duct',
        keepW ? '受雄性素（與功能性 AR）維持而保留分化。' : '缺乏有效雄性素訊號而退化（在女性留存 epoophoron、paroophoron 與 Gartner’s cyst）。', [wL, wR, ...sv], { anchor: [-3.2, 0.5, 0.6] });

      // 穆勒氏管（由外側上端向下中央融合形成子宮–陰道管）
      const mL = ttube([[-4.2, 3.4, -0.1], [-3.6, 2.0, -0.1], [-1.8, 0.4, 0], [-0.6, -0.8, 0]], keepM ? 0.24 : 0.06, 0xf472b6, keepM ? 0.95 : 0.22, { organic: false });
      const mR = ttube([[4.2, 3.4, -0.1], [3.6, 2.0, -0.1], [1.8, 0.4, 0], [0.6, -0.8, 0]], keepM ? 0.24 : 0.06, 0xf472b6, keepM ? 0.95 : 0.22, { organic: false });
      const ut = lathe([[0.05, 0], [0.55, 0.6], [0.62, 1.5], [1.15, 2.5], [0.2, 2.8]], 0xe85d99, keepM ? 0.88 : 0.18, [0, -3.5, 0]);
      reg(M, keepM ? '穆勒氏管 → 輸卵管、子宮與上陰道' : '穆勒氏管退化（殘留睪丸附件／前列腺囊）', 'Müllerian (paramesonephric) duct',
        keepM ? '缺乏 AMH 作用時保留，下段融合成子宮體、子宮頸與陰道上段。' : '受塞透力氏細胞分泌之 AMH 誘導上皮凋亡而退化（男性殘留 appendix testis 與 utriculus prostaticus）。', [mL, mR, ut], { anchor: [3.6, -1.2, 0.6] });

      // 尿生殖竇／下段陰道或尿道基底
      const ugs = cyl([0, -5.0, 0], [0, -3.4, 0], 0.55, 0xd8a0a0, 0.45);
      reg(G, '尿生殖竇（下陰道／前列腺尿道）', 'Urogenital sinus', '連接內生殖道末端並向下開口至外生殖器。', ugs, { anchor: [0, -4.6, 0.6] });

      textSprite(lbl, [0, 4.9, 0], 0.46, '#ffd479');
    },
    panel(box) {
      selectBox(box, '條件／症候群選擇', [
        ['male', '正常男性 XY（T＋, AMH＋）'],
        ['female', '正常女性 XX（T−, AMH−）'],
        ['cais', 'CAIS 雄性素不敏 XY（AMH＋但 AR 失能）'],
        ['cah', 'CAH 先天腎上腺增生 XX（高腎上腺雄性素, AMH−）'],
        ['pmds', 'PMDS 持續性穆勒氏管 XY（T＋但 AMH 失能）']
      ], v => { COND3 = v; reloadKeep(); }).value = COND3;
      note(box, COND3_INFO[COND3][1], 'big');
    }
  });

  /* ===== 場景④：外生殖器共同雙潛能原基分化（Fig 2.6） ===== */
  let S4 = null, DHT4 = 1.0, PROG4 = 1.0; // DHT4: 0=女性, 1=男性; PROG4: 0(4-6週)~1(出生)
  SCENES.push({
    name: '④ 外生殖器分化',
    title: '共同雙潛能原基分化為男女外生殖器（受 DHT 驅動，Fig 2.6）',
    camera: { pos: [0, 3.6, 13.5], target: [0, 0, 0], fit: [5.5, 5.2] },
    controls: [{ label: '🔍 正視會陰平面', fn() { flyHome(); } }],
    desc: `
<p>與內生殖道不同，外生殖器來自<b>單一組共同的雙潛能原基</b>（第 4–6 週男女外觀完全相同），且男性化依賴局部 <b>5α-還原酶將睪固酮轉為 DHT</b>（Ch.2 p.42–45, Fig 2.6；Ch.1 Box 1.5）。</p>
<details open><summary>三組同源原基的對應命運（Fig 2.6）</summary>
<table>
  <tr><th>共同原基（第 6 週）</th><th>無雄性素（女性）</th><th>有 DHT（男性）</th></tr>
  <tr><td><b>生殖結節 (Genital tubercle)</b></td><td>陰蒂（Clitoris）</td><td>陰莖龜頭與陰莖體背側</td></tr>
  <tr><td><b>尿道褶 (Urethral folds)</b></td><td>小陰唇（維持分開）</td><td>中線融合包圍陰莖尿道（腹側縫線）</td></tr>
  <tr><td><b>生殖隆起 (Genital swellings)</b></td><td>大陰唇（維持分開）</td><td>中線融合為陰囊（中央留陰囊縫隔）</td></tr>
</table></details>
<p class="src">Essential Reproduction 7e Ch.2 p.42–46（Fig 2.6）</p>`,
    build() {
      S4 = { t: 0 };
      const P = '外生殖器原基與分化';
      const base = ell([0, -0.5, -0.8], [3.6, 4.2, 0.9], 0xe8bfa8, 0.35);
      const anus = ring(V(0, -3.2, 0.1), V(0, 0, 1), 0.32, 0.12, 0xb87068);
      reg(P, '會陰與肛門區', 'Perineum & anus', '外生殖器發育時，尿生殖膜與肛膜分別破開並由會陰體分隔。', [base, anus], { anchor: [2.8, -3.0, 0.4] });

      const k = PROG4 * DHT4; // 男性化進度 0..1
      const f = PROG4 * (1 - DHT4); // 女性化進度 0..1
      // 生殖結節 → 陰蒂 vs 陰莖體/龜頭
      const gtLen = 0.5 + 2.3 * k + 0.25 * f;
      const gt = ttube([[0, 1.5, 0.1], [0, 1.5 + gtLen * 0.5, 0.4 + 1.1 * k], [0, 1.5 + gtLen, 0.5 + 1.8 * k]], [0.42 + 0.12 * k, 0.38 + 0.12 * k, 0.32 + 0.15 * k], 0xd97d8a);
      reg(P, k > 0.5 ? '生殖結節 → 陰莖與龜頭' : '生殖結節 → 陰蒂', 'Genital tubercle → Penis / Clitoris', '在 DHT 作用下大幅延長並膨大形成陰莖與龜頭；無 DHT 則僅輕微發育為陰蒂。', gt, { anchor: [0, 2.8 + k * 1.2, 1.2] });

      // 尿道褶 → 融合包住尿道 vs 小陰唇
      const foldSep = 0.58 * (1 - 0.85 * k) + 0.12 * f;
      const ufL = ttube([[-foldSep, 1.3, 0.2], [-foldSep * 1.1, 0.2, 0.25], [-foldSep * 0.8, -1.0, 0.2]], 0.24, 0xc8586a);
      const ufR = ttube([[foldSep, 1.3, 0.2], [foldSep * 1.1, 0.2, 0.25], [foldSep * 0.8, -1.0, 0.2]], 0.24, 0xc8586a);
      reg(P, k > 0.5 ? '尿道褶融合 → 包圍尿道' : '尿道褶 → 小陰唇（分開）', 'Urethral folds → Penile urethra / Labia minora', 'DHT 促使兩側尿道褶由後向前中線融合，將尿道延伸至龜頭開口；融合失敗則導致尿道下裂（hypospadias）。', [ufL, ufR], { anchor: [-2.2, 0.4, 0.6] });

      // 生殖隆起 → 陰囊融合 vs 大陰唇
      const swSep = 1.45 * (1 - 0.52 * k) + 0.25 * f;
      const swY = -0.3 - 0.7 * k;
      const gsL = ell([-swSep, swY, 0.1], [0.75 + 0.2 * k, 1.5 - 0.25 * k, 0.65 + 0.25 * k], 0xd89888, 0.9);
      const gsR = ell([swSep, swY, 0.1], [0.75 + 0.2 * k, 1.5 - 0.25 * k, 0.65 + 0.25 * k], 0xd89888, 0.9);
      reg(P, k > 0.5 ? '生殖隆起融合 → 陰囊（中線縫隔）' : '生殖隆起 → 大陰唇', 'Genital swellings → Scrotum / Labia majora', 'DHT 使陰唇陰囊隆起向尾側移行並於中線融合形成陰囊（留下陰囊中縫 scrotal septum）。', [gsL, gsR], { anchor: [2.5, -0.5, 0.6] });

      // 尿道/陰道口指標
      const orifice = ell([0, k > 0.5 ? 1.5 + gtLen : -0.3, k > 0.5 ? 0.5 + 1.8 * k : 0.2], [0.18, 0.25, 0.18], 0x702030);
      reg(P, k > 0.5 ? '尿道外口（龜頭端）' : '尿道口與陰道前庭', 'Urethral / Vaginal opening', '男性融合使尿道移至陰莖尖端；女性保留前庭與處女膜開口。', orifice, { anchor: [0.4, -1.8, 0.6] });

      textSprite(DHT4 > 0.6 ? 'DHT 主導：男性外生殖器' : DHT4 < 0.4 ? '無雄性素：女性外生殖器' : '中間值：局部男性化／陰蒂肥大（如部分 AIS / CAH）', [0, 4.4, 0], 0.4, '#ffd479');
    },
    panel(box) {
      slider(box, 'DHT 雄性素訊號 (0=女性, 1=男性)', 0, 1, DHT4, 0.1, v => { DHT4 = v; reloadKeep(); });
      slider(box, '發育週數進度 (0=第6週, 1=出生)', 0, 1, PROG4, 0.1, v => { PROG4 = v; reloadKeep(); });
      btnRow(box, [
        ['👩 典型女性', () => { DHT4 = 0; PROG4 = 1; reloadKeep(); }],
        ['👨 典型男性', () => { DHT4 = 1; PROG4 = 1; reloadKeep(); }],
        ['🧬 CAH 部分男性化', () => { DHT4 = 0.5; PROG4 = 1; reloadKeep(); }]
      ]);
    }
  });
})();
