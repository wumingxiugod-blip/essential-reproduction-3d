/* Ch.6：精子生成（四分區與BTB、細胞質橋與減數分裂、精子形成與染色質濃縮、精子超微構造、生精週期與波） */
(function () {
  /* ===== 場景①：睪丸四生理分區與血睪障壁（Figs 6.1–6.2） ===== */
  let S1 = null, BREACH = false;
  SCENES.push({
    name: '① 四分區與血睪障壁',
    title: '曲細精管楔形剖面：四生理分區與 Sertoli 血睪障壁（Figs 6.1–6.2）',
    camera: { pos: [0, 1.2, 19.5], target: [0, 0, 0], fit: [9.5, 6.4] },
    controls: [
      { label: '🔍 全部結構', fn() { flyHome(); } },
      { label: '🔍 血睪障壁特寫', fn() { flyFit([0, -1.5, 0.5], [4.5, 3.0]); } }
    ],
    desc: `
<p>成年睪丸分成兩大系統、四個生理分區，藉<b>血睪障壁（BTB）</b>隔離外來與自體免疫攻擊並創造特殊管腔液（Ch.6 p.106–107, Figs 6.1–6.2）。</p>
<details open><summary>四個生理分區與連接</summary><ul>
<li><b>V 血管＋I 間質分區</b>：含微血管、淋巴管與<b>來狄吉細胞（Leydig）</b>；水溶性標記自由平衡。</li>
<li><b>管周界線</b>：基底膜＋<b>肌樣細胞（myoid）</b>＋纖維細胞；無血管／淋巴／神經穿入管內！</li>
<li><b>B 基底分區</b>：含<b>精原細胞</b>與休止初級精母細胞。</li>
<li><b>血睪障壁（BTB）</b>：Sertoli 細胞間環狀<b>緊密＋黏附＋間隙連接</b>（內襯肌動蛋白絲與 RER）；由 <b>TNFα / TGFβ3</b> 短暫開啟讓前細紐期精母細胞跨入近腔分區。</li>
<li><b>A 近腔分區</b>：含精母細胞、精細胞與精子；管腔液富含 <b>K⁺、肌醇、睪固酮</b>，低 Na⁺ 與蛋白（Fig 6.2）。</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.6 p.106–107（Figs 6.1–6.2）</p>`,
    build() {
      S1 = { t: 0, play: true };
      const EX = '管外分區（V & I）', IN = '塞透力氏細胞與 BTB', GM = '管內生殖細胞（B → A）';

      // 波浪狀有機基底膜與紡錘形管周肌樣細胞
      const bm = tissueSlab([0, -3.72, 0], [11.6, 0.28, 4.4], 0x9ab4cc, 0.9, { wave: 0.055, freq: 1.4, seed: 2.1 });
      const myo = [];
      [-4.1, -1.4, 1.4, 4.1].forEach((mx, i) => {
        myo.push(ell([mx, -4.18, (i % 2 ? 0.55 : -0.45)], [1.35, 0.22, 1.15], 0xc87870, 0.9));
        myo.push(ell([mx, -4.18, (i % 2 ? 0.55 : -0.45)], [0.45, 0.14, 0.32], 0x7c3840, 0.95));
      });
      // 來狄吉細胞群（多角飽滿細胞＋深色核）與半透明微血管＋雙凹紅血球
      const ley = [
        ell([-3.8, -5.55, 0.5], [1.05, 0.78, 0.85], 0xff9a3a, 0.92),
        ell([-3.8, -5.55, 0.65], [0.42, 0.36, 0.38], 0x9a4818, 0.96),
        ell([2.3, -5.45, -0.3], [1.0, 0.76, 0.82], 0xff9a3a, 0.92),
        ell([2.3, -5.45, -0.15], [0.4, 0.34, 0.36], 0x9a4818, 0.96)
      ];
      const bv = ttube([V(-6.5, -5.75, 0.85), V(-2.2, -5.55, 0.95), V(2.2, -5.85, 0.85), V(6.5, -5.65, 0.95)], 0.5, 0xd83a48, 0.42, { organic: false, radial: 20 });
      const rbcPts = [-5.0, -3.1, -1.2, 0.7, 2.6, 4.5].map((x, i) => V(x, -5.7 + Math.sin(i) * 0.14, 0.9));
      const rbcs = rbcDiscs(rbcPts, 0.24, 0xe82838, 0.96);
      reg(EX, '血管與間質分區（V & I＋來狄吉細胞）', 'Vascular & Interstitial compartments', '血管與間質（含淋巴與 Leydig 細胞）之間物質自由平衡，但沒有血管或神經能進入曲細精管。', [bv, rbcs, ...ley], { anchor: [-4.5, -5.8, 0.9] });
      reg(EX, '基底膜與管周肌樣細胞', 'Basement membrane & myoid cells', '圍繞曲細精管外圍，僅具點狀連接，尚不足以構成主要擴散障壁；肌樣細胞具收縮性推動管腔液。', [bm, ...myo], { anchor: [4.8, -4.1, 0.8] });

      // 兩顆雕塑化柱狀 Sertoli 細胞（寬基底腳＋側壁凹槽＋帶核仁基底核）
      const sL = sertoliColumn(-1, 0x70b8e8, 0.25);
      const sR = sertoliColumn(1, 0x70b8e8, 0.25);
      const sNuc = [
        ell([-2.8, -2.55, 0.2], [0.82, 0.56, 0.64], 0x3b6cd8, 0.92),
        ell([-2.65, -2.5, 0.55], [0.22, 0.2, 0.22], 0x1d3578, 0.98),
        ell([2.8, -2.55, 0.2], [0.82, 0.56, 0.64], 0x3b6cd8, 0.92),
        ell([2.65, -2.5, 0.55], [0.22, 0.2, 0.22], 0x1d3578, 0.98)
      ];
      reg(IN, '塞透力氏細胞（基底 → 管腔柱狀）', 'Sertoli cells', '橫跨基底膜至管腔，側壁凹槽包覆各期生殖細胞，協調生精節律並分泌高 K⁺/肌醇/ABP 管腔液。', [sL, sR, ...sNuc], { anchor: [-4.6, 1.5, 0.8] });

      // BTB 連接複合體（緊密連接拉鍊索＋肌動蛋白絲束）
      const gapX = BREACH ? 0.52 : 0.08;
      const btbMs = [];
      [-1, 1].forEach(side => {
        for (let k = -2; k <= 2; k++) {
          const z = k * 0.62;
          btbMs.push(capsule([side * (0.28 + gapX), -1.85, z], [side * (0.28 + gapX), -1.3, z], 0.13, 0xff5a5a, 0.95));
          btbMs.push(capsule([side * (0.62 + gapX), -1.95, z], [side * (0.62 + gapX), -1.2, z], 0.07, 0xffd43a, 0.95));
        }
        // 縱向緊密連接蛋白條帶
        btbMs.push(ttube([V(side * (0.28 + gapX), -1.58, -1.45), V(side * (0.34 + gapX), -1.52, 0), V(side * (0.28 + gapX), -1.58, 1.45)], 0.09, 0xff3b4a, 0.96, { organic: false }));
      });
      if (!BREACH) {
        for (let k = -2; k <= 2; k++) {
          btbMs.push(capsule([-0.32, -1.58, k * 0.62], [0.32, -1.58, k * 0.62], 0.075, 0xff8080, 0.96));
        }
      }
      reg(IN, '血睪障壁 BTB（環狀緊密＋黏附＋間隙連接）', 'Blood–testis barrier (Zonular junctions)',
        BREACH ? '<b>TNFα 與 TGFβ3 作用中</b>：BTB 短暫重塑開啟，讓複製完 DNA 的前細紐期初級精母細胞向上移入近腔分區！'
          : '完全環繞 Sertoli 細胞腰部（內襯肌動蛋白絲與 RER），徹底隔離近腔分區免受免疫細胞與血中水溶性大分子進入。',
        btbMs, { anchor: [3.2, -1.6, 0.8] });

      // 基底 vs 近腔生殖細胞（含核＋ES 環＋真實梨形頭延長精細胞）
      const spg = [ell([0, -2.92, 0.2], [0.68, 0.54, 0.62], 0x5aa0f0, 0.88), ell([0, -2.92, 0.25], [0.36, 0.3, 0.34], 0x26529c, 0.96)];
      const spcY = BREACH ? -1.45 : 0.45;
      const spc = [ell([0, spcY, 0.2], [0.88, 0.82, 0.78], 0x9a6ad8, 0.85), ell([0, spcY, 0.25], [0.48, 0.45, 0.44], 0x542c8a, 0.96)];
      const rtid = [ell([-0.85, 2.25, 0.2], [0.52, 0.52, 0.5], 0xd8a8ff, 0.88), ell([-0.85, 2.25, 0.25], [0.28, 0.28, 0.28], 0x6e3ca8, 0.96)];
      const es = ring(V(-0.85, 2.25, 0.2), V(0, 1, 0), 0.64, 0.085, 0x46d16a, 0.95);
      // 延長精細胞：真正扁平梨形頭＋波浪鞭毛
      const eHead = new THREE.Mesh(spermHeadGeo(0.95, 0.52, 0.24), mat(0xf6f0d8, 0.96));
      eHead.position.set(0.85, 3.05, 0.2); eHead.rotation.z = Math.PI / 2;
      const eAcr = new THREE.Mesh(spermAcrosomeGeo(1.0, 0.56, 0.27, 0.62), mat(0xff80a8, 0.9));
      eAcr.position.set(0.85, 3.05, 0.2); eAcr.rotation.z = Math.PI / 2;
      const eTail = ttube([V(0.85, 3.45, 0.2), V(1.02, 4.05, 0.25), V(0.75, 4.65, 0.15), V(0.95, 5.2, 0.22)], [0.06, 0.025], 0xd8e4f0, 0.95, { organic: false });
      const tbc = ttube([V(0.65, 2.75, 0.22), V(1.05, 2.55, 0.35), V(1.38, 2.38, 0.2)], [0.11, 0.17], 0xffb84a, 0.95, { organic: false });
      reg(GM, 'B 基底分區：精原細胞', 'Basal: Spermatogonium', '位於血睪障壁下方，受 GDNF 維持幹細胞微環境並進行有絲分裂。', spg, { anchor: [0, -2.9, 0.9] });
      reg(GM, 'A 近腔分區：初級精母細胞', 'Adluminal: Primary spermatocyte', '穿越 BTB 後進入漫長減數分裂 I（粗絲期最敏感）。', spc, { anchor: [0, spcY, 1.0] });
      reg(GM, '圓形／延長精細胞（ES ＋ 管球狀複合體）', 'Spermatids (ES & tubulobulbar complex)', '外質特化（綠環 ES）負責錨定／重塑精細胞；管球狀複合體（橘）協助內吞多餘胞質並於排精釋出精子。', [...rtid, es, eHead, eAcr, eTail, tbc], { anchor: [1.8, 3.8, 0.8] });

      // 標記小分子擴散測試（血中染料滲入間質但被 BTB 阻擋）
      const dyePts = [];
      for (let i = 0; i < 18; i++) dyePts.push(V(-4.5 + (i % 9) * 1.1, i < 9 ? -4.9 : -3.1, 1.05));
      S1.dyes = dots(dyePts, 0.12, 0x60f0ff); CUR.root.add(S1.dyes);

      textSprite('A 近腔分區（高 K⁺ / 肌醇 / 睪固酮）', [0, 5.1, 0], 0.36, '#8fd0ff');
      textSprite('V+I 管外（染料自由擴散到此被 BTB 擋住）', [0, -6.7, 0], 0.34, '#ffd479');

      const dt = dtClock();
      CUR.tick = () => {
        const d = S1.play ? dt() : 0; S1.t += d;
        S1.dyes.position.y = Math.sin(S1.t * 2) * 0.12;
      };
    },
    panel(box) {
      checkbox(box, 'TNFα / TGFβ3 短暫開啟 BTB', BREACH, v => { BREACH = v; reloadKeep(); });
      const ch = mkCanvas(box, 290, 145);
      plot(ch, {
        title: 'Fig 6.2 血漿 vs 曲細精管液離子濃度比較',
        x: [0, 4], y: [0, 1.1], xt: [0.5, 1.5, 2.5, 3.5],
        fmtX: v => ['Na⁺', 'K⁺', '蛋白質', '肌醇'][Math.round(v - 0.5)] || '',
        yt: [0, 0.5, 1], fmtY: v => v === 0 ? '低' : v === 0.5 ? '中' : '極高',
        series: [
          { pts: [[0.5, 0.95], [1.5, 0.15], [2.5, 0.9], [3.5, 0.1]], col: '#ff6b6b', label: '血漿/淋巴', w: 2.5 },
          { pts: [[0.5, 0.65], [1.5, 0.92], [2.5, 0.08], [3.5, 1.0]], col: '#60e8ff', label: '管腔液', w: 2.5 }
        ]
      });
      checkbox(box, '分子輕微脈動', true, v => S1.play = v);
    }
  });

  /* ===== 場景②：細胞質橋群落與染色質濃縮（Figs 6.4–6.5, Box 6.3） ===== */
  let S2 = null, CHROM_ST = 2; // 0:組蛋白, 1:TNP, 2:魚精蛋白
  const CH_TXT = [
    ['1. 組蛋白核小體（精母細胞／圓形精細胞）', 'DNA 纏繞八聚體組蛋白（含睪丸專一變體 H1t, TH2A, H3t）；減數後仰賴 <b>CREMτ</b> 進行大量單倍體轉錄。'],
    ['2. 過渡核蛋白（TNP1 & TNP2 置換）', '組蛋白發生超乙醯化與泛素化而被移除 ＞90%，先由睪丸專一鹼性蛋白 <b>TNP1/2</b> 暫時替換。'],
    ['3. 魚精蛋白（Protamines 1/2 ＋ 雙硫鍵）', '濃縮達體細胞核 <b>5% 體積</b>（流線化＋抗氧化保護），含 50% 精胺酸並以半胱胺酸雙硫鍵交聯關閉轉錄（早期發育重要基因仍保留組蛋白）。']
  ];
  SCENES.push({
    name: '② 胞質橋與魚精蛋白',
    title: '合體細胞質橋譜系（Figs 6.4–6.5）與染色質濃縮（Box 6.3）',
    camera: { pos: [0, 0.5, 20], target: [0, 0, 0], fit: [10.6, 6.4] },
    controls: [
      { label: '🔍 全覽', fn() { flyHome(); } },
      { label: '🔍 右：DNA 染色質濃縮', fn() { flyFit([5.2, 0, 0], [4.6, 4.2]); } }
    ],
    desc: `
<p>單一顆 <b>A₁ 精原細胞</b>歷經有絲分裂與減數分裂時<b>胞質分裂不完全</b>，所有子細胞以<b>細胞質橋（cytoplasmic bridges）</b>相連同步發育（Ch.6 p.108–115, Figs 6.4–6.5）。</p>
<details open><summary>Box 6.2 & 6.3 基因表現與染色質重塑</summary><ul>
<li><b>單倍體轉錄高峰（Box 6.2）</b>：圓形精細胞利用 <b>CREMτ + TFIIAτ + TRF2</b> 表現 <i>protamine</i> 與 <i>proacrosin</i> 等基因（性染色體則鎖於 sex vesicle 沉默）。</li>
<li><b>核體積濃縮至 5%（Box 6.3）</b>：組蛋白 → <b>TNP1/2</b> → <b>Protamines 1/2</b>（S–S 雙硫鍵交聯）。</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.6 p.107–115（Figs 6.4–6.5, Boxes 6.1–6.3）</p>`,
    build() {
      S2 = { t: 0, play: true };
      const CL = '細胞群落與胞質橋（左）', CR = '染色質重塑（右，Box 6.3）';
      const rows = [
        ['SSC / A₁–B 精原細胞 (2n)', 'Spermatogonia', 3.5, 4, 0x5aa0f0, '行 6 次有絲分裂（大鼠可擴增成 64 初級精母細胞群落）。'],
        ['初級精母細胞 (粗絲期，性小泡)', 'Primary spermatocytes', 1.2, 6, 0x9a6ad8, '穿越 BTB 進行同源染色體聯會互換；X/Y 染色體隔離於性小泡關閉轉錄。'],
        ['次級精母 → 圓形精細胞 (1n)', 'Spermatids (CREMτ active)', -1.2, 8, 0xd8a8ff, '細胞質橋共享 mRNA/蛋白；CREMτ 啟動單倍體基因轉錄高峰。'],
        ['釋放成熟精子（斷開胞質橋）', 'Spermiation', -3.6, 8, 0xf6f0d8, '殘餘體被 Sertoli 細胞吞噬，精子斷橋釋入曲細精管腔。']
      ];
      const brMs = [];
      // 沙漏狀胞質橋旋轉輪廓
      const bridgeProf = [[0.14, -0.32], [0.09, -0.15], [0.075, 0], [0.09, 0.15], [0.14, 0.32]];
      const sHeadG = spermHeadGeo(0.56, 0.3, 0.16);
      rows.forEach(([zh, en, y, cnt, col, info], ri) => {
        const ms = [], span = cnt * 0.94;
        for (let i = 0; i < cnt; i++) {
          const x = -5.2 - span / 2 + (span * i) / (cnt - 1);
          if (ri < 3) {
            ms.push(ell([x, y, 0], [0.35, 0.34, 0.34], col, 0.88));
            ms.push(ell([x, y, 0.04], [0.17, 0.17, 0.17], 0x2a325c, 0.95));
            if (i < cnt - 1) {
              const nx = x + span / (cnt - 1);
              brMs.push(lathe(bridgeProf, 0x70d8ff, 0.92, [(x + nx) / 2, y, 0], [1, 0, 0], 18));
            }
          } else {
            const hd = new THREE.Mesh(sHeadG, mat(col, 0.96));
            hd.position.set(x, y + 0.3, 0); hd.rotation.z = -Math.PI / 2;
            const tl = ttube([V(x, y + 0.02, 0), V(x + 0.1, y - 0.42, 0.04), V(x - 0.08, y - 0.88, -0.03), V(x + 0.06, y - 1.28, 0.02)], [0.045, 0.018], 0xc8d8e8, 0.95, { organic: false, seg: 18, radial: 8 });
            ms.push(hd, tl);
          }
        }
        reg(CL, zh, en, info, ms, { anchor: [-5.2 - span / 2 - 0.5, y, 0.4] });
      });
      reg(CL, '細胞質橋（胞質相連同步化）', 'Cytoplasmic bridges (syncytium)', '即使完成減數分裂成為單倍體，基因產物仍可在整個群落細胞間自由擴散交流，因此 X/Y 精子在表面蛋白質上並無分化差異。', brMs, { anchor: [-2.2, 0, 0.5] });

      // 右側：染色質包裝模型（圓盤核小體八聚體 / 過渡蛋白 / 緊密魚精蛋白核心）
      const sp = CHROM_ST === 0 ? 1.85 : CHROM_ST === 1 ? 1.15 : 0.62;
      const protCol = CHROM_ST === 0 ? 0xd8a848 : CHROM_ST === 1 ? 0x46d16a : 0xff7090;
      const cores = [], dna1 = [], dna2 = [], ssPts = [];
      for (let i = 0; i < 4; i++) {
        const y = (i - 1.5) * sp;
        if (CHROM_ST === 0) {
          const oct = disc(0.68, 0.44, protCol, 0.95, 5.2, y, -0.22);
          oct.rotation.x = Math.PI / 2;
          cores.push(oct);
        } else {
          cores.push(ell([5.2, y, 0], [CHROM_ST === 2 ? 0.42 : 0.64, CHROM_ST === 2 ? 0.24 : 0.34, CHROM_ST === 2 ? 0.42 : 0.56], protCol, 0.95));
        }
        const rad = CHROM_ST === 2 ? 0.52 : 0.82;
        for (let k = 0; k <= 14; k++) {
          const a = k / 14 * Math.PI * 2;
          const yy = y + (k / 14 - 0.5) * (CHROM_ST === 2 ? 0.22 : 0.34);
          dna1.push(V(5.2 + Math.cos(a) * rad, yy, Math.sin(a) * rad));
          dna2.push(V(5.2 + Math.cos(a + 0.35) * (rad + 0.1), yy + 0.07, Math.sin(a + 0.35) * (rad + 0.1)));
        }
        if (CHROM_ST === 2 && i < 3) {
          ssPts.push([V(5.58, y + 0.12, 0.34), V(5.58, y + sp - 0.12, 0.34)]);
          ssPts.push([V(4.82, y + 0.12, -0.34), V(4.82, y + sp - 0.12, -0.34)]);
        }
      }
      reg(CR, CH_TXT[CHROM_ST][0], 'Chromatin packaging protein', CH_TXT[CHROM_ST][1], cores, { anchor: [7.2, 1.5, 0.6] });
      reg(CR, '精子染色體 DNA 雙螺旋', 'Spermatogenic DNA', '當替換為魚精蛋白並形成雙硫鍵後，呈惰性異染色質且不再進行轉錄。', [
        ttube(dna1, 0.065, 0x5aa8ff, 1, { organic: false }),
        ttube(dna2, 0.055, 0x9fd8ff, 0.95, { organic: false })
      ], { anchor: [3.2, 0, 0.6] });
      if (ssPts.length) {
        const ssMeshes = ssPts.map(([a, b]) => capsule(a, b, 0.07, 0xffd43a, 0.98));
        reg(CR, '半胱胺酸雙硫鍵（S–S 交聯）', 'Cysteine disulphide cross-links', '魚精蛋白間的 S–S 鍵將相鄰 DNA 緊鎖成流線且抗自由基氧化的結晶樣核心。', ssMeshes, { anchor: [7.0, -1.0, 0.5] });
      }
    },
    panel(box) {
      seg(box, 'Box 6.3 染色質濃縮階段', [[0, '1. 組蛋白'], [1, '2. TNP1/2'], [2, '3. 魚精蛋白 (5%)']], CHROM_ST, v => { CHROM_ST = v; reloadKeep(); });
      note(box, CH_TXT[CHROM_ST][1], 'big');
    }
  });

  /* ===== 場景③：精子形成變形四期（Fig 6.6） ===== */
  let S3 = null, ST3 = 2;
  const SP_STEPS = [
    ['1. 高爾基期（Golgi phase）', '圓形精細胞內高爾基氏器（G）產生富含醣蛋白之類溶體小泡並融合成單一<b>頭巾泡（acrosomal vesicle）</b>；相對極的兩顆中心粒長出 9+2 鞭毛。'],
    ['2. 頭帽期（Cap phase）', '頭巾泡覆蓋核前極形成帽狀；對側遠端中心粒向後延伸出軸索鞭毛，近端中心粒形成頸部連接片；部分物種核膜下形成穿孔器。'],
    ['3. 頭巾／頂體期（Acrosomal phase）', '細胞核移向質膜並開始濃縮變扁延長（染色質換成 TNP/魚精蛋白）；高爾基氏器脫離後移，9 條外緻密纖維沿軸索發育。'],
    ['4. 成熟期與排精（Maturation & Spermiation）', '粒線體移向鞭毛前段纏繞成螺旋鞘；多餘細胞質被擠出成<b>殘餘體（residual body）</b>由 Sertoli 細胞吞噬，僅剩極少量胞質與流線精子釋出。']
  ];
  SCENES.push({
    name: '③ 精子形成變形',
    title: '圓形精細胞變形為成熟精子：精子形成過程（Spermiogenesis, Fig 6.6）',
    camera: { pos: [0, 0.4, 15.5], target: [0, 0, 0], fit: [7.6, 5.2] },
    controls: [{ label: '🔍 細胞特寫', fn() { flyHome(); } }],
    desc: `
<p>圓形精細胞不經再分裂，而是經歷劇烈的細胞重塑（<b>Spermiogenesis</b>）打包成具運動與穿卵能力的精子（Ch.6 p.110–111, Fig 6.6）。</p>
<p class="src">Essential Reproduction 7e Ch.6 p.110–111（Fig 6.6）</p>`,
    build() {
      S3 = { t: 0, play: true };
      const P = '精細胞變形構造';
      const k = ST3 / 3;

      // 細胞質外膜（厚壁開窗剖面，成熟期收縮為流線貼身外膜）
      const cyto = ST3 < 3
        ? thickShell(1, [2.4 - 0.9 * k, 2.25 - 1.15 * k, 2.1 - 1.15 * k], 0xe8d0f0, 0.34, 0.45, Math.PI * 1.65, 0.12)
        : new THREE.Mesh(spermHeadGeo(2.35, 1.18, 0.56), mat(0xe8d0f0, 0.25));
      cyto.position.set(ST3 < 3 ? 0.55 * k : -2.05, 0, 0);

      // 細胞核（高爾基/頭帽期為球形，頂體/成熟期演變為流線梨形）
      let nuc, acr;
      if (ST3 <= 1) {
        nuc = ell([-0.4 - 1.1 * k, 0, 0], [0.95, 0.9, 0.85], 0x4870c8, 0.95);
        acr = ST3 === 0
          ? ell([-1.35, 0.15, 0], [0.36, 0.42, 0.36], 0xff7aa8, 0.92)
          : thickShell(1.02, [1.0, 0.94, 0.88], 0xff7aa8, 0.88, Math.PI * 0.62, Math.PI * 0.76, 0.12);
        if (ST3 === 1) acr.position.set(-0.4 - 1.1 * k, 0, 0);
      } else {
        const len = ST3 === 2 ? 2.0 : 2.15, w = ST3 === 2 ? 1.15 : 0.98, th = ST3 === 2 ? 0.62 : 0.42;
        nuc = new THREE.Mesh(spermHeadGeo(len, w, th), mat(0x4870c8, 0.96));
        nuc.position.set(-1.35 - 0.7 * (ST3 - 2), 0, 0);
        acr = new THREE.Mesh(spermAcrosomeGeo(len * 1.05, w * 1.07, th * 1.12, 0.62), mat(0xff7aa8, 0.88));
        acr.position.copy(nuc.position);
      }

      // 層疊扁囊狀高爾基氏器（3 片微彎囊泡）
      const gx = 0.05 + 1.65 * k, gy = 0.95 - 1.3 * k;
      const gScale = 1 - 0.45 * k;
      const golgi = [-0.14, 0, 0.14].map((dy, i) =>
        ttube([V(gx - 0.45 * gScale, gy + dy * gScale, 0.25), V(gx, gy + (dy + 0.12) * gScale, 0.35), V(gx + 0.45 * gScale, gy + dy * gScale, 0.25)], 0.075 * gScale, 0xffe060, 0.95, { organic: false })
      );

      // 中心粒與連續波動鞭毛
      const tailX = ST3 <= 1 ? (0.55 - 1.1 * k) : (-0.35 - 0.6 * (ST3 - 2));
      const cent = [
        capsule([tailX - 0.08, -0.14, 0], [tailX - 0.08, 0.14, 0], 0.09, 0xd8c870, 0.96),
        capsule([tailX + 0.12, 0, -0.12], [tailX + 0.12, 0, 0.12], 0.085, 0xe8b860, 0.96)
      ];
      const tailLen = 1.4 + 4.4 * k;
      const tail = waveTail(tailX, 0, 0, tailLen, 0.1, 0.035, 0x70d8ff, 0.95, 36, 12);
      S3.tail = tail;

      reg(P, '精細胞質／殘餘體', 'Cytoplasm → Residual body', ST3 === 3 ? '多餘胞質向下擠出成為殘餘體（將被 Sertoli 細胞吞噬）。' : '提供高爾基氏器與粒線體重組所需的細胞質空間。', cyto, { anchor: [1.8, -2.0, 0.5] });
      reg(P, '細胞核（從圓形濃縮成流線型）', 'Nucleus (condensing chromatin)', '染色質由組蛋白逐步替換為 TNP1/2 與魚精蛋白濃縮至 5% 體積。', nuc, { anchor: [-2.2, 1.2, 0.5] });
      reg(P, '高爾基氏器與頭巾（Acrosome）', 'Golgi & Acrosomal cap', '高爾基氏器分泌類溶體顆粒融合覆蓋核前端成酵素頭巾（酶刀）。', [acr, ...golgi], { anchor: [-2.4, -1.2, 0.5] });
      reg(P, '中心粒與鞭毛（9+2 軸索）', 'Centrioles & Flagellum', '遠端中心粒長出 9+2 微小管鞭毛；成熟期粒線體纏繞前段形成中片螺旋鞘。', [...cent, tail], { anchor: [3.2, 1.0, 0.5] });

      if (ST3 === 3) {
        const mito = ttube(helixAlong(lineCurve([-0.92, 0, 0], [1.45, 0, 0]), 0.19, 11, 0, 180), 0.085, 0x70e060, 0.96, { organic: false });
        const resBody = [
          ell([1.15, -1.65, 0], [0.92, 0.72, 0.72], 0xd8a8c0, 0.82),
          ell([1.75, -1.35, 0.2], [0.48, 0.42, 0.42], 0xe8b8d0, 0.82),
          ttube([V(0.2, -0.25, 0), V(0.65, -0.85, 0.05), V(0.95, -1.35, 0)], [0.1, 0.22], 0xd8a8c0, 0.78, { organic: false })
        ];
        reg(P, '螺旋粒線體鞘（中片）', 'Mitochondrial sheath', '粒線體聚集中片提供鞭毛擺動所需 ATP。', mito, { anchor: [0.4, 1.1, 0.5] });
        reg(P, '殘餘體（將被 Sertoli 吞噬）', 'Residual body', '經 tubulobulbar complexes 排除多餘胞質與脫離的高爾基殘骸。', resBody, { anchor: [1.5, -2.6, 0.5] });
      }
      textSprite(SP_STEPS[ST3][0], [0, 3.3, 0], 0.42, '#ffd479');

      const dt = dtClock();
      CUR.tick = () => {
        const d = S3.play ? dt() : 0; S3.t += d;
        if (S3.tail) S3.tail.updateWave(S3.t * 6.5, ST3 >= 2 ? 0.3 : 0.12, 6.5);
      };
    },
    panel(box) {
      const info = note(box, '', 'big');
      const sl = slider(box, '變形階段', 0, 3, ST3, 1, v => { ST3 = v; reloadKeep(); });
      btnRow(box, [['◀ 上一步', () => { ST3 = Math.max(0, ST3 - 1); sl.value = ST3; reloadKeep(); }], ['下一步 ▶', () => { ST3 = Math.min(3, ST3 + 1); sl.value = ST3; reloadKeep(); }]]);
      info.innerHTML = `<b>${SP_STEPS[ST3][0]}</b><br>${SP_STEPS[ST3][1]}`;
      checkbox(box, '鞭毛波動', true, v => S3.play = v);
    }
  });

  /* ===== 場景④：靈長類精子超微構造與三段橫切（Fig 6.7） ===== */
  let S4 = null, XRAY4 = true;
  SCENES.push({
    name: '④ 精子超微構造',
    title: '靈長類精子超微構造（50 µm）、區域界線與三段橫切面（Fig 6.7）',
    camera: { pos: [0, 0.4, 19], target: [0, 0, 0], fit: [9.4, 6.2] },
    controls: [
      { label: '🔍 全部', fn() { flyHome(); } },
      { label: '🔍 頭部／赤道區／頸部', fn() { flyFit([-5.0, 1.6, 0], [3.6, 2.6]); } },
      { label: '🔍 鞭毛橫切比較', fn() { flyFit([0.5, -2.5, 0], [6.8, 2.5]); } }
    ],
    desc: `
<p>靈長類成熟精子全長約 <b>50 µm</b>，細胞膜表面各區域藉特殊邊界環帶分隔出不同脂質、醣類、表面電荷與蛋白質組成（Ch.6 p.111–112, Fig 6.7）。</p>
<details open><summary>頭部與三段尾部構造（Fig 6.7）</summary><ul>
<li><b>頭部</b>：濃縮染色質核（唯一保留核孔處在後端<b>植入窩 implantation fossa</b>）；頭巾覆蓋前 2/3，後方為<b>赤道區（equatorial segment）</b>與後頂體區，<b>後環（posterior ring）</b>分隔頭頸。</li>
<li><b>頸部</b>：頭冠（capitulum）連接<b>兩條主、五條次分節柱（segmented columns）</b>與近端中心粒（遠端中心粒在成熟末期退化）。</li>
<li><b>中片</b>：9+2 軸索＋9 條外緻密纖維（ODF）＋外包<b>螺旋粒線體鞘</b>（止於<b>軸環 annulus</b>）。</li>
<li><b>主片</b>：纖維鞘兩條<b>縱柱連至 3、8 號 ODF</b>＋環形肋條（circumferential ribs）。</li>
<li><b>終片</b>：ODF 與纖維鞘皆終止，僅剩 9+2 軸索與質膜。</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.6 p.111–112（Fig 6.7）</p>`,
    build() {
      S4 = { t: 0, play: true };
      const H = '頭部與頸部（Fig 6.7a,b）', T = '鞭毛三段（Fig 6.7c,d）', CS = '橫切面結構（9+2 軸索）';
      const yM = 1.9;

      // 扁平梨形濃縮核＋厚壁貼合頂體帽＋貼合式赤道區環帶＋流線外質膜
      const nuc = new THREE.Mesh(spermHeadGeo(2.3, 1.38, 0.48), mat(0x44aa77, 0.96));
      nuc.position.set(-5.8, yM, 0);
      const acr = new THREE.Mesh(spermAcrosomeGeo(2.42, 1.48, 0.54, 0.6), mat(0xff80a8, 0.86));
      acr.position.set(-5.8, yM, 0);
      // 貼合扁平頭輪廓的赤道帶與後環（橢圓環帶，取代原本的方塊！）
      const eq = ring(V(-5.48, yM, 0), V(1, 0, 0), 0.72, 0.085, 0xffd479, 0.92);
      eq.scale.set(1.0, 0.96, 0.42);
      const postRing = ring(V(-4.72, yM, 0), V(1, 0, 0), 0.34, 0.055, 0xffa850, 0.94);
      postRing.scale.set(1.0, 0.92, 0.56);
      const mem = new THREE.Mesh(spermHeadGeo(2.58, 1.62, 0.66), mat(0xdcf0ff, 0.22));
      mem.position.set(-5.8, yM, 0);
      mem.visible = XRAY4;
      S4.mem = mem;

      // 頸部：漏斗狀頭冠＋7 條環繞分節柱＋近端中心粒
      const cap = lathe([[0.18, -0.22], [0.28, -0.05], [0.3, 0.14], [0.16, 0.22]], 0xd8c890, 0.95, [-4.52, yM, 0], [1, 0, 0], 24);
      const neck = [cap, capsule([-4.35, yM - 0.14, 0], [-4.35, yM + 0.14, 0], 0.065, 0x70d8ff, 0.98)];
      for (let i = 0; i < 7; i++) {
        const a = i / 7 * Math.PI * 2;
        neck.push(capsule([-4.55, yM + Math.cos(a) * 0.2, Math.sin(a) * 0.18], [-4.02, yM + Math.cos(a) * 0.16, Math.sin(a) * 0.16], i < 2 ? 0.048 : 0.036, 0xe8b860, 0.96));
      }
      reg(H, '濃縮細胞核與核孔（植入窩）', 'Condensed nucleus & implantation fossa', '核高度濃縮，僅後端植入窩保留核孔並以細絲連至頭冠（capitulum）。', nuc, { anchor: [-5.8, yM + 1.0, 0.4] });
      reg(H, '頂體帽／頭巾（內／外頂體膜）', 'Acrosomal sac', '位於核前端之變形溶體，含水解酵素以穿透透明帶（Fig 6.7b）。', [acr, mem], { anchor: [-7.1, yM + 0.9, 0.4] });
      reg(H, '赤道區與後環界線', 'Equatorial segment & posterior ring', '膜上脂質與蛋白質分區；赤道區為受精時與卵膜最先融合處。', [eq, postRing], { anchor: [-5.2, yM - 1.1, 0.4] });
      reg(H, '頸部：頭冠、分節柱與近端中心粒', 'Connecting piece (capitulum & segmented columns)', '2 條主＋5 條次分節柱連接外緻密纖維；近端中心粒將貢獻給受精卵（遠端中心粒已退化）。', neck, { anchor: [-4.3, yM - 0.9, 0.4] });

      // 中片：螺旋粒線體鞘＋軸索＋軸環
      const midAxis = lineCurve([-4.02, yM, 0], [-0.8, yM, 0]);
      const midH = ttube(helixAlong(midAxis, 0.22, 13, 0, 220), 0.095, 0x70d850, 0.96, { organic: false });
      const midC = cyl([-4.02, yM, 0], [-0.8, yM, 0], 0.13, 0x50b8ff, 0.95);
      const ann = ring(V(-0.8, yM, 0), V(1, 0, 0), 0.27, 0.068, 0xffd43a, 0.96);
      reg(T, '中片（螺旋粒線體鞘）與軸環', 'Midpiece & annulus', '粒線體螺旋纏繞外緻密纖維與 9+2 軸索，止於環狀軸環（annulus）。', [midH, midC, ann], { anchor: [-2.4, yM + 1.0, 0.4] });

      // 連續滑順波動的主片與終片（取代原本 18 段斷裂圓柱！）
      const prinTail = waveTail(-0.8, yM, 0, 6.0, 0.18, 0.09, 0x5878a8, 0.96, 36, 14);
      const endTail = waveTail(5.2, yM, 0, 2.6, 0.085, 0.032, 0x90e0ff, 0.96, 20, 10);
      S4.prinTail = prinTail; S4.endTail = endTail;
      reg(T, '主片（纖維鞘縱柱＋環肋）', 'Principal piece', '兩縱柱連接第 3、8 號 ODF，提供鞭毛平面擺動之彈性力學支撐。', prinTail, { anchor: [2.2, yM + 0.9, 0.4] });
      reg(T, '終片（僅餘 9+2 軸索）', 'End piece', 'ODF 與纖維鞘皆消失，僅餘軸索微管與細胞膜。', endTail, { anchor: [6.8, yM + 0.8, 0.4] });

      // 三段超微橫切面（帶半透明胞質底盤、真實雙聯體微管與 ODF）
      function mkCS(cx, cy, kind) {
        const g = new THREE.Group(); g.position.set(cx, cy, 0);
        const outerR = kind === 'mid' ? 1.04 : kind === 'prin' ? 0.88 : 0.52;
        const ms = [
          disc(outerR, 0.14, 0x203550, 0.42, 0, 0, -0.07),
          // 中央單微管對
          cyl([-0.08, 0, -0.18], [-0.08, 0, 0.18], 0.045, 0x90e0ff),
          cyl([0.08, 0, -0.18], [0.08, 0, 0.18], 0.045, 0x90e0ff)
        ];
        for (let i = 0; i < 9; i++) {
          const a = i / 9 * Math.PI * 2;
          const ca = Math.cos(a), sa = Math.sin(a);
          // 9 組 A/B 雙聯體微管
          ms.push(cyl([ca * 0.32 - sa * 0.03, sa * 0.32 + ca * 0.03, -0.18], [ca * 0.32 - sa * 0.03, sa * 0.32 + ca * 0.03, 0.18], 0.038, 0x50b8ff));
          ms.push(cyl([ca * 0.32 + sa * 0.03, sa * 0.32 - ca * 0.03, -0.18], [ca * 0.32 + sa * 0.03, sa * 0.32 - ca * 0.03, 0.18], 0.034, 0x3892d8));
          if (kind !== 'end') {
            const rf = kind === 'mid' ? 0.56 : 0.52;
            const odf = ell([ca * rf, sa * rf, 0], [0.075, 0.095, 0.18], 0xc864b8, 0.96);
            odf.rotation.z = a;
            ms.push(odf);
          }
        }
        if (kind === 'mid') {
          for (let i = 0; i < 10; i++) {
            const a = i / 10 * Math.PI * 2;
            const mt = ell([Math.cos(a) * 0.82, Math.sin(a) * 0.82, 0], [0.18, 0.12, 0.16], 0x70d850, 0.95);
            mt.rotation.z = a + Math.PI / 2;
            ms.push(mt);
          }
          ms.push(ring(V(0, 0, 0), V(0, 0, 1), 1.02, 0.045, 0xf0e0c0, 0.95));
        } else if (kind === 'prin') {
          ms.push(ell([0.78, 0, 0], [0.16, 0.28, 0.18], 0xff90a8, 0.96), ell([-0.78, 0, 0], [0.16, 0.28, 0.18], 0xff90a8, 0.96));
          ms.push(ring(V(0, 0, 0), V(0, 0, 1), 0.84, 0.06, 0x4b628c, 0.95));
        } else {
          ms.push(ring(V(0, 0, 0), V(0, 0, 1), 0.5, 0.042, 0xf0e0c0, 0.95));
        }
        return { g, ms };
      }
      const csM = mkCS(-4.2, -2.5, 'mid'), csP = mkCS(0.5, -2.5, 'prin'), csE = mkCS(5.2, -2.5, 'end');
      attachPart(reg(CS, '中片橫切（粒線體鞘＋9 ODF＋9+2）', 'Midpiece cross-section', '外層螺旋粒線體、中層 9 ODF、中央 9+2 軸索。', csM.ms, { anchor: [0, -1.5, 0.4] }), csM.g);
      attachPart(reg(CS, '主片橫切（3/8 縱柱＋環肋）', 'Principal piece cross-section', '纖維鞘兩側縱柱精準對應第 3 與第 8 號 ODF。', csP.ms, { anchor: [0, -1.5, 0.4] }), csP.g);
      attachPart(reg(CS, '終片橫切（僅 9+2 軸索）', 'End piece cross-section', '僅剩中央與外圍微管雙聯體。', csE.ms, { anchor: [0, -1.5, 0.4] }), csE.g);

      textSprite('中片橫切', [-4.2, -0.95, 0], 0.34, '#70e860');
      textSprite('主片橫切', [0.5, -0.95, 0], 0.34, '#ff9ad8');
      textSprite('終片橫切', [5.2, -0.95, 0], 0.34, '#90e0ff');

      const dt = dtClock();
      CUR.tick = () => {
        const d = S4.play ? dt() : 0; S4.t += d;
        const amp = S4.play ? 0.38 : 0;
        const ph = S4.t * 7;
        S4.prinTail.updateWave(ph, amp * 0.72, 6.2);
        // 終片緊接主片末端座標
        const endY = yM + Math.sin(ph - 6.2) * (amp * 0.72);
        S4.endTail.position.y = endY - yM;
        S4.endTail.updateWave(ph - 6.2, amp * 0.55, 3.8);
      };
    },
    panel(box) {
      checkbox(box, '顯示表面細胞質膜', XRAY4, v => { XRAY4 = v; if (S4.mem) S4.mem.visible = v; });
      checkbox(box, '播放鞭毛波動', true, v => S4.play = v);
    }
  });

  /* ===== 場景⑤：生精上皮週期（時間）vs 生精波（空間）與 Table 6.1（Figs 6.8–6.11） ===== */
  let S5 = null, SPEC5 = 'rat';
  const T61 = {
    man: ['人類 Man', 64, 16, '人類與類人猿在橫切面僅局部「楔形（wedges）」同步，不同於大鼠整圈同步（p.118）。'],
    bull: ['牛 Bull', 54, 13.5, '生精總長 54 日，上皮週期 13.5 日（4 個週期完成一輪）。'],
    ram: ['綿羊 Ram', 49, 12.25, '生精總長 49 日，上皮週期 12.25 日。'],
    boar: ['豬 Boar', 34, 8.5, '表 6.1 所列家畜中最短生精時間（34 日／週期 8.5 日），每日總產量高達 16 億隻！'],
    rat: ['大鼠 Rat', 48, 12, '經典研究模型（48 日／週期 12 日）；橫切面整圈同步，縱軸呈明顯 1–8 期「生精波」（Figs 6.8–6.11）。']
  };
  SCENES.push({
    name: '⑤ 生精週期與波',
    title: '生精上皮週期（時間）vs 生精波（空間）與物種動力學（Figs 6.8–6.11, Table 6.1）',
    camera: { pos: [0, 1.5, 20], target: [0, 0, 0], fit: [10.6, 6.2] },
    controls: [{ label: '🔍 全管觀察', fn() { flyHome(); } }],
    desc: `
<p>任何定點每隔固定天數（<b>生精週期</b>，約總生精長 1/4）就會啟動新一批幹細胞，使管壁呈現 4 層重疊發育的固定細胞組合（Ch.6 p.113–120, Figs 6.8–6.11）。</p>
<details open><summary>週期（時間）vs 波（空間）</summary><ul>
<li><b>時間維度（Cycle）</b>：如同把攝影機架在管壁同一點拍縮時攝影，看到該點經歷第 1→8 期的循環（Rat 12 天一輪）。</li>
<li><b>空間維度（Wave）</b>：沿解剖出來的曲細精管縱軸移動觀察，可見相鄰節段依序呈現 <b>7–6–5–4–3–2–1</b> 的連續階段波浪，使整個睪丸能<b>平穩連續</b>而非脈衝式排出精子！</li>
<li><b>協調者</b>：Sertoli 細胞藉間隙連接相連並隨之節律震盪，但由生殖細胞設定計時器（大鼠 SSC 植入小鼠睪丸會呈現大鼠的生精速度）。</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.6 p.113–120（Figs 6.8–6.11, Table 6.1）</p>`,
    build() {
      S5 = { t: 0, play: true, segMeshes: [], wavePhase: 0 };
      const W = '縱向剖開曲細精管：空間生精波', T = '固定點四世代重疊切面（時間週期）';
      const stCols = [0x4488cc, 0x4aa8ff, 0x5ad1a0, 0x86efac, 0xfde047, 0xfb923c, 0xf472b6, 0xc084fc];
      const stages = [7, 6, 5, 4, 3, 2, 3, 4, 5, 6, 7];
      // 11 個帶倒角圓環管段展示 Fig 6.11 的雙向空間波
      stages.forEach((stNum, idx) => {
        const x = (idx - 5) * 1.48;
        const m = annulus(0.98, 0.42, 1.38, stCols[stNum - 1], 0.9, -0.69);
        m.rotation.y = Math.PI / 2;
        m.position.set(x, 2.25, 0);
        S5.segMeshes.push({ m, baseSt: stNum });
        reg(W, `管段 #${idx + 1}（第 ${stNum} 期）`, `Tubule segment Stage ${stNum}`, `相鄰區段相位超前或落後 1 期（7→6→5→4→3→2…），使整條曲細精管任何時刻都有區段在排精（第 8/1 期）。`, m, { anchor: [x, 3.6, 0.6], nolabel: idx % 2 === 1 });
      });

      // 下方：定點放大 4 層同心細胞世代（帶厚壁管壁＋管腔）
      addRoot(annulus(2.85, 2.58, 0.55, 0x9ab0c8, 0.88, 0));
      CUR.root.children[CUR.root.children.length - 1].position.set(0, -2.5, 0);
      addRoot(annulus(2.58, 0.55, 0.45, 0x3b6088, 0.26, 0.05));
      CUR.root.children[CUR.root.children.length - 1].position.set(0, -2.5, 0);
      const layers = [
        ['第 1 世代（基底）：A₁–B 精原細胞', 2.35, 0x5aa0f0, 0.23],
        ['第 2 世代（中下）：粗絲期初級精母細胞', 1.78, 0x9a6ad8, 0.26],
        ['第 3 世代（中上）：圓形精細胞', 1.22, 0xd8a8ff, 0.2],
        ['第 4 世代（管腔）：成熟精子準備排精', 0.72, 0xffd479, 0.14]
      ];
      layers.forEach(([zh, rad, col, rDot], li) => {
        const pts = [];
        const n = SPEC5 === 'man' ? 4 : 12;
        for (let i = 0; i < n; i++) {
          const a = (SPEC5 === 'man' ? 0.35 + i * 0.24 : i / n * Math.PI * 2);
          pts.push(V(Math.cos(a) * rad, -2.5 + Math.sin(a) * rad, 0.32));
        }
        const ms = [dots(pts, rDot, col, 0.96, 14)];
        if (li === 3) {
          pts.forEach(p => {
            const inward = V(0, -2.5, 0.32).sub(p).normalize().multiplyScalar(0.5);
            ms.push(capsule(p, p.clone().add(inward), 0.035, 0xd8e8f8, 0.92));
          });
        }
        reg(T, zh, `Generation ${li + 1}`, SPEC5 === 'man' ? '人類橫切面呈「楔形（wedge）」局部同步，同一圈可能混有多個階段。' : '多數哺乳類（如大鼠）整個橫切面圓周呈現高度同步的四世代固定細胞組合。', ms, { anchor: [3.4, -0.8 - li * 0.85, 0.4] });
      });

      textSprite('空間維度：沿曲細精管的「生精波」(Fig 6.11)', [0, 4.7, 0], 0.38, '#ffd479');
      textSprite(SPEC5 === 'man' ? '時間維度：人類楔形局部同步橫切' : '時間維度：大鼠整圈四世代同步橫切 (Fig 6.9)', [0, -5.8, 0], 0.36, '#8fd0ff');

      const dt = dtClock();
      CUR.tick = () => {
        const d = S5.play ? dt() : 0; S5.t += d;
        const shift = Math.floor(S5.t * 1.4);
        S5.segMeshes.forEach(s => {
          const st = ((s.baseSt + shift) % 8);
          s.m.material.color.setHex(stCols[st]).convertSRGBToLinear();
        });
      };
    },
    panel(box) {
      selectBox(box, '表 6.1 物種選擇', Object.keys(T61).map(k => [k, T61[k][0]]), v => { SPEC5 = v; reloadKeep(); }).value = SPEC5;
      const d = T61[SPEC5];
      note(box, `<b>${d[0]}</b>｜生精總時長 <b>${d[1]} 天</b>｜上皮週期 <b>${d[2]} 天</b><br>${d[3]}`, 'big');
      const ch = mkCanvas(box, 290, 130);
      plot(ch, {
        title: 'Table 6.1 各物種生精總天數比較',
        x: [0, 5], y: [0, 75], xt: [0.5, 1.5, 2.5, 3.5, 4.5],
        fmtX: v => ['人', '牛', '羊', '大鼠', '豬'][Math.round(v - 0.5)] || '',
        yl: '天數',
        series: [
          { pts: [[0.5, 64], [1.5, 54], [2.5, 49], [3.5, 48], [4.5, 34]], col: '#4ade80', label: '總長(天)', w: 2.5 },
          { pts: [[0.5, 16], [1.5, 13.5], [2.5, 12.25], [3.5, 12], [4.5, 8.5]], col: '#ffd479', label: '週期(天)', w: 2.5 }
        ]
      });
      checkbox(box, '播放時間週期與波推進', true, v => S5.play = v);
    }
  });
})();
