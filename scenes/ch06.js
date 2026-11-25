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
      // 管壁：纖維細胞 + 肌樣細胞 + 基底膜（底層 y=-4.5）
      const bm = box([0, -3.7, 0], [11.5, 0.25, 4.5], 0x9ab0c8, 0.85);
      const myo = [box([-3, -4.15, 0], [5.2, 0.45, 4.4], 0xc87870, 0.85), box([3, -4.15, 0], [5.2, 0.45, 4.4], 0xc87870, 0.85)];
      const ley = [ell([-3.8, -5.6, 0.6], [1.0, 0.75, 0.8], 0xff9a3a), ell([2.2, -5.5, -0.4], [1.0, 0.75, 0.8], 0xff9a3a)];
      const bv = cyl([-6.5, -5.7, 0.8], [6.5, -5.7, 0.8], 0.48, 0xd83a3a, 0.72);
      reg(EX, '血管與間質分區（V & I＋來狄吉細胞）', 'Vascular & Interstitial compartments', '血管與間質（含淋巴與 Leydig 細胞）之間物質自由平衡，但沒有血管或神經能進入曲細精管。', [bv, ...ley], { anchor: [-4.5, -5.8, 0.9] });
      reg(EX, '基底膜與管周肌樣細胞', 'Basement membrane & myoid cells', '圍繞曲細精管外圍，僅具點狀連接，尚不足以構成主要擴散障壁；肌樣細胞具收縮性推動管腔液。', [bm, ...myo], { anchor: [4.8, -4.1, 0.8] });

      // 兩顆柱狀 Sertoli 細胞（從 y=-3.5 伸至管腔 y=4.0）
      const sL = box([-2.6, 0.3, 0], [3.4, 7.2, 3.6], 0x70b8e8, 0.22);
      const sR = box([2.6, 0.3, 0], [3.4, 7.2, 3.6], 0x70b8e8, 0.22);
      const sNuc = [ell([-2.6, -2.5, 0.4], [0.75, 0.52, 0.6], 0x3b6cd8), ell([2.6, -2.5, 0.4], [0.75, 0.52, 0.6], 0x3b6cd8)];
      reg(IN, '塞透力氏細胞（基底 → 管腔柱狀）', 'Sertoli cells', '橫跨基底膜至管腔，協調生精節律、分泌管腔液（高 K⁺/肌醇/ABP）與多種旁分泌生長因子。', [sL, sR, ...sNuc], { anchor: [-4.6, 1.5, 0.8] });

      // BTB 連接複合體（緊密連接 + 肌動蛋白絲 + RER）
      const gapX = BREACH ? 0.55 : 0.12;
      const btbL = box([-0.45 - gapX, -1.6, 0], [0.7, 0.6, 3.6], 0xff5a5a, 0.92);
      const btbR = box([0.45 + gapX, -1.6, 0], [0.7, 0.6, 3.6], 0xff5a5a, 0.92);
      const actin = [box([-1.0 - gapX, -1.6, 0], [0.22, 0.9, 3.6], 0xffd43a), box([1.0 + gapX, -1.6, 0], [0.22, 0.9, 3.6], 0xffd43a)];
      reg(IN, '血睪障壁 BTB（環狀緊密＋黏附＋間隙連接）', 'Blood–testis barrier (Zonular junctions)',
        BREACH ? '<b>TNFα 與 TGFβ3 作用中</b>：BTB 短暫重塑開啟，讓複製完 DNA 的前細紐期初級精母細胞向上移入近腔分區！'
          : '完全環繞 Sertoli 細胞腰部（內襯肌動蛋白絲與 RER），徹底隔離近腔分區免受免疫細胞與血中水溶性大分子進入。',
        [btbL, btbR, ...actin], { anchor: [3.2, -1.6, 0.8] });

      // 基底 vs 近腔生殖細胞 + ectoplasmic specialization / tubulobulbar
      const spg = ell([0, -2.9, 0.2], [0.65, 0.52, 0.6], 0x5aa0f0);
      const spc = ell([0, BREACH ? -1.4 : 0.4, 0.2], [0.85, 0.8, 0.75], 0x9a6ad8);
      const rtid = ell([-1.2, 2.3, 0.2], [0.5, 0.5, 0.5], 0xd8a8ff);
      const es = ring(V(-1.2, 2.3, 0.2), V(0, 1, 0), 0.62, 0.08, 0x46d16a);
      const etid = [ell([1.2, 3.1, 0.2], [0.22, 0.55, 0.2], 0xf6f0d8), cyl([1.2, 3.6, 0.2], [1.2, 5.0, 0.2], 0.04, 0xd8e0e8)];
      const tbc = cyl([0.9, 2.7, 0.2], [1.5, 2.5, 0.2], 0.14, 0xffb84a);
      reg(GM, 'B 基底分區：精原細胞', 'Basal: Spermatogonium', '位於血睪障壁下方，受 GDNF 維持幹細胞微環境並進行有絲分裂。', spg, { anchor: [0, -2.9, 0.9] });
      reg(GM, 'A 近腔分區：初級精母細胞', 'Adluminal: Primary spermatocyte', '穿越 BTB 後進入漫長減數分裂 I（粗絲期最敏感）。', spc, { anchor: [0, 0.4, 1.0] });
      reg(GM, '圓形／延長精細胞（ES ＋ 管球狀複合體）', 'Spermatids (ES & tubulobulbar complex)', '外質特化（綠環 ES）負責錨定／重塑精細胞；管球狀複合體（橘）協助內吞多餘胞質並於排精釋出精子。', [rtid, es, ...etid, tbc], { anchor: [1.8, 3.8, 0.8] });

      // 標記小分子擴散測試（血中染料滲入間質但被 BTB 阻擋）
      const dyePts = [];
      for (let i = 0; i < 18; i++) dyePts.push(V(-4.5 + (i % 9) * 1.1, i < 9 ? -4.9 : -3.1, 1.0));
      S1.dyes = dots(dyePts, 0.12, 0x60f0ff); CUR.root.add(S1.dyes);

      textSprite('A 近腔分區（高 K⁺ / 肌醇 / 睪固酮）', [0, 4.9, 0], 0.36, '#8fd0ff');
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
      const br = [];
      rows.forEach(([zh, en, y, cnt, col, info], ri) => {
        const ms = [], span = cnt * 0.92;
        for (let i = 0; i < cnt; i++) {
          const x = -5.2 - span / 2 + (span * i) / (cnt - 1);
          if (ri < 3) {
            ms.push(ell([x, y, 0], [0.34, 0.34, 0.34], col));
            if (i < cnt - 1) br.push([new THREE.CylinderGeometry(0.08, 0.08, 1, 8), segMtx(V(x, y, 0), V(x + span / (cnt - 1), y, 0))]);
          } else {
            ms.push(ell([x, y + 0.25, 0], [0.14, 0.28, 0.12], col), cyl([x, y, 0], [x, y - 1.1, 0], 0.04, 0xc8d4e0));
          }
        }
        reg(CL, zh, en, info, ms, { anchor: [-5.2 - span / 2 - 0.5, y, 0.4] });
      });
      reg(CL, '細胞質橋（胞質相連同步化）', 'Cytoplasmic bridges (syncytium)', '即使完成減數分裂成為單倍體，基因產物仍可在整個群落細胞間自由擴散交流，因此 X/Y 精子在表面蛋白質上並無分化差異。', new THREE.Mesh(mergeGeo(br), mat(0x70d8ff, 0.92)), { anchor: [-2.2, 0, 0.5] });

      // 右側：染色質包裝模型（隨 CHROM_ST 切換鬆緊與蛋白質類型）
      const sp = CHROM_ST === 0 ? 1.8 : CHROM_ST === 1 ? 1.15 : 0.65;
      const protCol = CHROM_ST === 0 ? 0xd8a848 : CHROM_ST === 1 ? 0x46d16a : 0xff7090;
      const cores = [], dnaPts = [], ssPts = [];
      for (let i = 0; i < 4; i++) {
        const y = (i - 1.5) * sp;
        cores.push(ell([5.2, y, 0], [CHROM_ST === 2 ? 0.42 : 0.72, 0.38, 0.55], protCol));
        for (let k = 0; k <= 12; k++) {
          const a = k / 12 * Math.PI * 2;
          dnaPts.push(V(5.2 + Math.cos(a) * (CHROM_ST === 2 ? 0.55 : 0.85), y + (k / 12 - 0.5) * 0.3, Math.sin(a) * (CHROM_ST === 2 ? 0.55 : 0.85)));
        }
        if (CHROM_ST === 2 && i < 3) ssPts.push([V(5.55, y + 0.15, 0.35), V(5.55, y + sp - 0.15, 0.35)]);
      }
      reg(CR, CH_TXT[CHROM_ST][0], 'Chromatin packaging protein', CH_TXT[CHROM_ST][1], cores, { anchor: [7.2, 1.5, 0.6] });
      reg(CR, '精子染色體 DNA 雙螺旋', 'Spermatogenic DNA', '當替換為魚精蛋白並形成雙硫鍵後，呈惰性異染色質且不再進行轉錄。', ttube(dnaPts, 0.08, 0x5aa8ff, 1, { organic: false }), { anchor: [3.2, 0, 0.6] });
      if (ssPts.length) {
        const ssMeshes = ssPts.map(([a, b]) => cyl(a.toArray(), b.toArray(), 0.07, 0xffd43a));
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
      S3 = { t: 0 };
      const P = '精細胞變形構造';
      const k = ST3 / 3;
      const cytoSc = [2.4 - 1.5 * k, 2.3 - 1.6 * k, 2.2 - 1.5 * k];
      const cyto = ell([0.6 * k, 0, 0], cytoSc, 0xe8d0f0, 0.35);
      const nuc = ell([-0.4 - 1.4 * k, 0, 0], [0.95 - 0.1 * k, 0.9 - 0.42 * k, 0.85 - 0.55 * k], 0x4870c8);
      const acr = shell(0.95, [1.0, 0.9 - 0.42 * k, 0.85 - 0.55 * k], 0xff7aa8, 0.85, Math.PI * (0.65 - 0.15 * k), Math.PI * (0.7 + 0.3 * k));
      acr.position.set(-0.45 - 1.45 * k, 0, 0);
      const golgi = ell([0.1 + 1.8 * k, 0.8 - 1.2 * k, 0.3], [0.42 * (1 - 0.5 * k), 0.3 * (1 - 0.5 * k), 0.3], 0xffe060);
      const cent = ell([0.5 - 1.3 * k, 0, 0], [0.22, 0.22, 0.22], 0xd8c870);
      const tail = cyl([0.5 - 1.3 * k, 0, 0], [1.2 + 3.6 * k, 0, 0], 0.09, 0x70d8ff);
      reg(P, '精細胞質／殘餘體', 'Cytoplasm → Residual body', ST3 === 3 ? '多餘胞質向下擠出成為殘餘體（將被 Sertoli 細胞吞噬）。' : '提供高爾基氏器與粒線體重組所需的細胞質空間。', cyto, { anchor: [1.8, -2.0, 0.5] });
      reg(P, '細胞核（從圓形濃縮成流線型）', 'Nucleus (condensing chromatin)', '染色質由組蛋白逐步替換為 TNP1/2 與魚精蛋白濃縮至 5% 體積。', nuc, { anchor: [-2.2, 1.2, 0.5] });
      reg(P, '高爾基氏器與頭巾（Acrosome）', 'Golgi & Acrosomal cap', '高爾基氏器分泌類溶體顆粒融合覆蓋核前端成酵素頭巾（酶刀）。', [acr, golgi], { anchor: [-2.4, -1.2, 0.5] });
      reg(P, '中心粒與鞭毛（9+2 軸索）', 'Centrioles & Flagellum', '遠端中心粒長出 9+2 微小管鞭毛；成熟期粒線體纏繞前段形成中片螺旋鞘。', [cent, tail], { anchor: [3.2, 1.0, 0.5] });

      if (ST3 === 3) {
        const mito = ttube(helixAlong(lineCurve([-0.8, 0, 0], [1.6, 0, 0]), 0.18, 10, 0, 140), 0.08, 0x70e060, 0.95, { organic: false });
        const resBody = ell([1.2, -1.6, 0], [0.95, 0.75, 0.75], 0xd8a8c0, 0.75);
        reg(P, '螺旋粒線體鞘（中片）', 'Mitochondrial sheath', '粒線體聚集中片提供鞭毛擺動所需 ATP。', mito, { anchor: [0.4, 1.1, 0.5] });
        reg(P, '殘餘體（將被 Sertoli 吞噬）', 'Residual body', '經 tubulobulbar complexes 排除多餘胞質與脫離的高爾基殘骸。', resBody, { anchor: [1.5, -2.6, 0.5] });
      }
      textSprite(SP_STEPS[ST3][0], [0, 3.3, 0], 0.42, '#ffd479');
    },
    panel(box) {
      const info = note(box, '', 'big');
      const sl = slider(box, '變形階段', 0, 3, ST3, 1, v => { ST3 = v; reloadKeep(); });
      btnRow(box, [['◀ 上一步', () => { ST3 = Math.max(0, ST3 - 1); sl.value = ST3; reloadKeep(); }], ['下一步 ▶', () => { ST3 = Math.min(3, ST3 + 1); sl.value = ST3; reloadKeep(); }]]);
      info.innerHTML = `<b>${SP_STEPS[ST3][0]}</b><br>${SP_STEPS[ST3][1]}`;
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
      S4 = { t: 0, play: true, segs: [] };
      const H = '頭部與頸部（Fig 6.7a,b）', T = '鞭毛三段（Fig 6.7c,d）', CS = '橫切面結構（9+2 軸索）';
      const yM = 1.9;
      const nuc = ell([-5.8, yM, 0], [1.15, 0.72, 0.25], 0x44aa77);
      const acr = shell(1.2, [1.0, 0.68, 0.26], 0xff80a8, 0.8, Math.PI * 0.58, Math.PI * 0.85);
      acr.position.set(-5.8, yM, 0);
      const eq = box([-5.35, yM, 0], [0.34, 1.38, 0.54], 0xffd479, 0.55);
      const mem = ell([-5.8, yM, 0], [1.28, 0.84, 0.34], 0xe8f4ff, 0.22);
      mem.visible = XRAY4;
      S4.mem = mem;
      const neck = [ell([-4.6, yM, 0], [0.16, 0.28, 0.22], 0xd8c890), cyl([-4.55, yM, 0], [-4.05, yM, 0], 0.19, 0xe8b860)];
      reg(H, '濃縮細胞核與核孔（植入窩）', 'Condensed nucleus & implantation fossa', '核高度濃縮，僅後端植入窩保留核孔並以細絲連至頭冠（capitulum）。', nuc, { anchor: [-5.8, yM + 1.0, 0.4] });
      reg(H, '頂體帽／頭巾（內／外頂體膜）', 'Acrosomal sac', '位於核前端之變形溶體，含水解酵素以穿透透明帶（Fig 6.7b）。', [acr, mem], { anchor: [-7.1, yM + 0.9, 0.4] });
      reg(H, '赤道區與後環界線', 'Equatorial segment & posterior ring', '膜上脂質與蛋白質分區；赤道區為受精時與卵膜最先融合處。', eq, { anchor: [-5.2, yM - 1.1, 0.4] });
      reg(H, '頸部：頭冠、分節柱與近端中心粒', 'Connecting piece (capitulum & segmented columns)', '2 條主＋5 條次分節柱連接外緻密纖維；近端中心粒將貢獻給受精卵（遠端中心粒已退化）。', neck, { anchor: [-4.3, yM - 0.9, 0.4] });

      const midAxis = lineCurve([-4.05, yM, 0], [-0.8, yM, 0]);
      const midH = ttube(helixAlong(midAxis, 0.22, 12, 0, 200), 0.1, 0x70d850, 0.92, { organic: false });
      const midC = cyl([-4.05, yM, 0], [-0.8, yM, 0], 0.12, 0x50b8ff);
      const ann = ring(V(-0.8, yM, 0), V(1, 0, 0), 0.27, 0.065, 0xffd43a);
      reg(T, '中片（螺旋粒線體鞘）與軸環', 'Midpiece & annulus', '粒線體螺旋纏繞外緻密纖維與 9+2 軸索，止於環狀軸環（annulus）。', [midH, midC, ann], { anchor: [-2.4, yM + 1.0, 0.4] });

      const nSeg = 18, tLen = 8.4;
      for (let i = 0; i < nSeg; i++) {
        const f = i / nSeg, x = -0.8 + f * tLen, isEnd = f > 0.72, r = isEnd ? 0.06 : 0.16 * (1 - 0.45 * f);
        S4.segs.push({ m: cyl([x, yM, 0], [x + tLen / nSeg, yM, 0], r, isEnd ? 0x90e0ff : 0x587098, 0.92), x, dx: tLen / nSeg, f, isEnd });
      }
      reg(T, '主片（纖維鞘縱柱＋環肋）', 'Principal piece', '兩縱柱連接第 3、8 號 ODF，提供鞭毛平面擺動之彈性力學支撐。', S4.segs.filter(s => !s.isEnd).map(s => s.m), { anchor: [2.2, yM + 0.9, 0.4] });
      reg(T, '終片（僅餘 9+2 軸索）', 'End piece', 'ODF 與纖維鞘皆消失，僅餘軸索微管與細胞膜。', S4.segs.filter(s => s.isEnd).map(s => s.m), { anchor: [6.8, yM + 0.8, 0.4] });

      function mkCS(cx, cy, kind) {
        const g = new THREE.Group(); g.position.set(cx, cy, 0);
        const ms = [cyl([-0.08, 0, -0.15], [-0.08, 0, 0.15], 0.04, 0x90e0ff), cyl([0.08, 0, -0.15], [0.08, 0, 0.15], 0.04, 0x90e0ff)];
        for (let i = 0; i < 9; i++) {
          const a = i / 9 * Math.PI * 2;
          ms.push(cyl([Math.cos(a) * 0.34, Math.sin(a) * 0.34, -0.15], [Math.cos(a) * 0.34, Math.sin(a) * 0.34, 0.15], 0.045, 0x50b8ff));
          if (kind !== 'end') {
            const rf = kind === 'mid' ? 0.56 : 0.52;
            ms.push(cyl([Math.cos(a) * rf, Math.sin(a) * rf, -0.15], [Math.cos(a) * rf, Math.sin(a) * rf, 0.15], 0.06, 0xc060b0));
          }
        }
        if (kind === 'mid') {
          for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; ms.push(ell([Math.cos(a) * 0.82, Math.sin(a) * 0.82, 0], [0.16, 0.12, 0.14], 0x70d850)); }
          ms.push(ring(V(0, 0, 0), V(0, 0, 1), 1.0, 0.04, 0xf0e0c0));
        } else if (kind === 'prin') {
          ms.push(ell([0.78, 0, 0], [0.18, 0.25, 0.16], 0xff90a8), ell([-0.78, 0, 0], [0.18, 0.25, 0.16], 0xff90a8));
          ms.push(ring(V(0, 0, 0), V(0, 0, 1), 0.82, 0.055, 0x3a4a70));
        } else ms.push(ring(V(0, 0, 0), V(0, 0, 1), 0.48, 0.04, 0xf0e0c0));
        return { g, ms };
      }
      const csM = mkCS(-4.2, -2.5, 'mid'), csP = mkCS(0.5, -2.5, 'prin'), csE = mkCS(5.2, -2.5, 'end');
      attachPart(reg(CS, '中片橫切（粒線體鞘＋9 ODF＋9+2）', 'Midpiece cross-section', '外層螺旋粒線體、中層 9 ODF、中央 9+2 軸索。', csM.ms, { anchor: [0, -1.5, 0.4] }), csM.g);
      attachPart(reg(CS, '主片橫切（3/8 縱柱＋環肋）', 'Principal piece cross-section', '纖維鞘兩側縱柱精準對應第 3 與第 8 號 ODF。', csP.ms, { anchor: [0, -1.5, 0.4] }), csP.g);
      attachPart(reg(CS, '終片橫切（僅 9+2 軸索）', 'End piece cross-section', '僅剩中央與外圍微管雙聯體。', csE.ms, { anchor: [0, -1.5, 0.4] }), csE.g);

      textSprite('中片橫切', [-4.2, -1.0, 0], 0.34, '#70e860');
      textSprite('主片橫切', [0.5, -1.0, 0], 0.34, '#ff9ad8');
      textSprite('終片橫切', [5.2, -1.0, 0], 0.34, '#90e0ff');

      const dt = dtClock();
      CUR.tick = () => {
        const d = S4.play ? dt() : 0; S4.t += d;
        S4.segs.forEach(s => {
          const amp = S4.play ? 0.38 * s.f : 0;
          const y1 = yM + Math.sin(S4.t * 7 - s.f * 8) * amp, y2 = yM + Math.sin(S4.t * 7 - (s.f + 0.05) * 8) * amp;
          setCyl(s.m, V(s.x, y1, 0), V(s.x + s.dx, y2, 0), s.isEnd ? 0.06 : 0.16 * (1 - 0.45 * s.f));
        });
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
      // 11 個相鄰管段展示 Fig 6.11 的雙向空間波
      stages.forEach((stNum, idx) => {
        const x = (idx - 5) * 1.55;
        const m = cyl([x - 0.7, 2.2, 0], [x + 0.7, 2.2, 0], 0.95, stCols[stNum - 1], 0.85);
        S5.segMeshes.push({ m, baseSt: stNum });
        reg(W, `管段 #${idx + 1}（第 ${stNum} 期）`, `Tubule segment Stage ${stNum}`, `相鄰區段相位超前或落後 1 期（7→6→5→4→3→2…），使整條曲細精管任何時刻都有區段在排精（第 8/1 期）。`, m, { anchor: [x, 3.6, 0.6], nolabel: idx % 2 === 1 });
      });

      // 下方：定點放大 4 層同心細胞世代（基底→近腔）
      const layers = [
        ['第 1 世代（基底）：A₁–B 精原細胞', 2.4, 0x5aa0f0],
        ['第 2 世代（中下）：粗絲期初級精母細胞', 1.8, 0x9a6ad8],
        ['第 3 世代（中上）：圓形精細胞', 1.2, 0xd8a8ff],
        ['第 4 世代（管腔）：成熟精子準備排精', 0.65, 0xffd479]
      ];
      layers.forEach(([zh, rad, col], li) => {
        const pts = [];
        const n = SPEC5 === 'man' ? 4 : 10; // 人類楔形局部 vs 大鼠整圈同步
        for (let i = 0; i < n; i++) {
          const a = (SPEC5 === 'man' ? 0.3 + i * 0.25 : i / n * Math.PI * 2);
          pts.push(V(Math.cos(a) * rad, -2.5 + Math.sin(a) * rad, 0.3));
        }
        reg(T, zh, `Generation ${li + 1}`, SPEC5 === 'man' ? '人類橫切面呈「楔形（wedge）」局部同步，同一圈可能混有多個階段。' : '多數哺乳類（如大鼠）整個橫切面圓周呈現高度同步的四世代固定細胞組合。', dots(pts, 0.2, col), { anchor: [3.4, -0.8 - li * 0.85, 0.4] });
      });
      addRoot(ring(V(0, -2.5, 0.3), V(0, 0, 1), 2.75, 0.08, 0x9ab0c8));

      textSprite('空間維度：沿曲細精管的「生精波」(Fig 6.11)', [0, 4.7, 0], 0.38, '#ffd479');
      textSprite(SPEC5 === 'man' ? '時間維度：人類楔形局部同步橫切' : '時間維度：大鼠整圈四世代同步橫切 (Fig 6.9)', [0, -5.8, 0], 0.36, '#8fd0ff');

      const dt = dtClock();
      CUR.tick = () => {
        const d = S5.play ? dt() : 0; S5.t += d;
        const shift = Math.floor(S5.t * 1.4);
        S5.segMeshes.forEach((s, i) => {
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
