/* Ch.21：更年期內分泌與老化、不孕診治(PCOS/PRL/Clomiphene)、ART家族(IVF/ZD/SUZI/ICSI)與mtDNA原核置換 */
(function () {
  /* ===== 場景①：男女年齡生殖軸、更年期三步驟與 PCOS vs 高泌乳素（Figs 21.1–21.4, Table 21.1） ===== */
  let S1 = null, CASE1 = 'age38'; // age25 | age38 | meno | pcos | oligo
  const C1_TXT = {
    age25: ['女性 25 歲黃金期（卵數充足、MII 紡錘體穩定）', '大量腔前／腔狀濾泡分泌足量 <b>Inhibin B / Inhibin A / E₂</b> 穩定維持 28 天排卵週期；精子雖亦逐年微降但男性「無更年期」無卵竭斷崖（p.342–344）。'],
    age38: ['女性 38 歲轉折後：MII 紡錘體不穩、非整倍體↑ + 生育力急降', '35 歲以後，在卵池尚未歸零前，老化卵母細胞的 <b>第二減數紡錘體先變鬆散不穩</b> 導致染色體分配異常，自然流產與唐氏症等機率急升（Fig 21.3）！'],
    meno: ['更年期過渡 → 停經（平均 52 歲）：Inhibin B 先跌 → FSH↑ → E₂ 跌 → LH↑', '① 早期腔狀減少 → <b>Inhibin B 先降 → FSH 率先飆升</b>（縮短濾泡期！）；② 臨近停經 <b>Inhibin A &amp; E₂ 徹底崩跌 → LH 隨後高懸</b>！但靠人工激素配年輕捐贈卵仍可懷孕足月（Table 21.1）。'],
    pcos: ['多囊性卵巢症候群（PCOS，佔育齡婦女 5–10%）', '2–3 倍小濾泡卻集體卡死於早期腔狀期（無法選出優勢卵）：<b>LH 持續偏高而 FSH 不高</b>（區別於停經前高 FSH！）、高雄激素與胰島素阻抗；極易對促排卵產生 <b>OHSS</b> 過度刺激（p.348–349）。'],
    oligo: ['男性少弱畸形精蟲／無精症：阻塞性（FSH正常）vs 生精衰竭（FSH↑）', '<b>Table 21.2 異常界線：</b>&lt;2 ml、&lt;20×10⁶/ml、前向活力 &lt;50%、畸形 &gt;70%。若原發性生精衰竭缺抑制素 → <b>FSH 升高（預後不良）</b>；阻塞性無精約 50% 帶 <b>CF 囊腫性纖維化突變</b>！']
  };
  SCENES.push({
    name: '① 老化、更年期與病因',
    title: 'W35 卵紡錘體衰減・更年期 FSH→LH 次序・PCOS 與男性無精（Figs 21.1–21.4）',
    camera: { pos: [0, 0.8, 19.5], target: [0, 0, 0], fit: [10.4, 6.2] },
    controls: [{ label: '🔍 性腺與內分泌反轉總覽', fn() { flyHome(); } }],
    desc: `
<p>不孕在夫妻雙方各佔近一半比例（10–15% 伴侶滿 12 個月無避孕未受孕）；同時女性的<b>卵母細胞數量固定不可再生</b>與男性的<b>精原幹細胞持續更新</b>造成截然不同的「生殖衰老軸」（Ch.21 p.341–350, Figs 21.1–21.4）。</p>
<details open><summary>高頻鑑別必背三條臨床規律</summary><ul>
<li><b>為何年輕卵可讓 55 歲停經子宮懷孕？</b>：證明「生物時鐘極限主要在卵母細胞與濾泡耗竭，而非子宮」。</li>
<li><b>更年期過渡荷爾蒙順序</b>：先是 <b>Inhibin B↓ → FSH↑</b>，最後才 <b>E₂/Inhibin A↓ → LH↑</b>！</li>
<li><b>PCOS vs 早發卵巢衰竭</b>：PCOS 為「多量早期小濾泡停滯 ＋ <b>高 LH、不高 FSH</b>」；早發衰竭則是無濾泡導致 <b>FSH 暴高</b>！</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.21 p.341–350（Figs 21.1–21.4, Tables 21.1–21.2）</p>`,
    build() {
      S1 = { t: 0, play: true };
      const OV = '左側：卵巢／睪丸病理微結構', HPG = '右側：垂體 FSH vs LH 反應指標', AX = '中心：減數紡錘體 / 精子品質';

      const isOligo = CASE1 === 'oligo';
      // 左側：卵巢截面 or 睪丸
      const gonShell = shell(1, [2.7, 2.3, 1.9], isOligo ? 0xd8a888 : 0xf2a0c0, 0.34, 0.5, Math.PI * 1.65);
      gonShell.position.set(-5.0, 0.4, 0);
      const folMs = [gonShell];
      if (isOligo) {
        for (let i = 0; i < 4; i++) folMs.push(ttube([V(-6.2, -0.5 + i * 0.6, 0.2), V(-3.8, -0.5 + i * 0.6, 0.2)], 0.14, 0xeec888, 0.9, { organic: false }));
      } else {
        const nF = CASE1 === 'meno' ? 0 : (CASE1 === 'pcos' ? 14 : (CASE1 === 'age25' ? 7 : 3));
        for (let i = 0; i < nF; i++) {
          const a = i / Math.max(1, nF) * Math.PI * 2;
          const r = CASE1 === 'pcos' ? 0.32 : (i === 0 ? 0.85 : 0.35);
          folMs.push(ell([-5.0 + Math.cos(a) * 1.5, 0.4 + Math.sin(a) * 1.1, 0.3], [r, r, r], i === 0 && CASE1 !== 'pcos' ? 0xffd43a : 0xff70a0, 0.9));
        }
        if (CASE1 === 'meno') folMs.push(ell([-5.0, 0.4, 0.2], [1.4, 1.0, 0.8], 0x808898, 0.8)); // 纖維化萎縮更年期卵巢(仍含LH受激間質產雄激素)
      }
      reg(OV, isOligo ? '男性睪丸與生精小管（測 FSH 鑑別阻塞或衰竭）' : (CASE1 === 'pcos' ? 'PCOS 串珠型多發停滯小濾泡（無優勢卵！）' : (CASE1 === 'meno' ? '卵竭萎縮之更年期卵巢（間質仍隨高 LH 產雄激素！）' : '卵巢濾泡儲備')), 'Gonadal status',
        C1_TXT[CASE1][1], folMs, { anchor: [-5.0, 3.3, 0.9] });

      // 中央特寫：MII 紡錘體染色體排列（年輕緊實整齊 vs 38歲鬆散飄離！） or 男性老化突變精子
      const spMs = [];
      const eggBox = shell(1, [1.8, 1.8, 1.5], 0xffe4b8, 0.25, 0.5, Math.PI * 1.6);
      spMs.push(eggBox);
      if (!isOligo) {
        const messy = CASE1 === 'age38' || CASE1 === 'meno';
        // 雙極紡錘絲
        [-0.45, 0, 0.45].forEach(off => {
          spMs.push(ttube([V(-1.3, 0, 0.15), V(0, off, 0.18), V(1.3, 0, 0.15)], 0.025, 0xffd479, messy ? 0.38 : 0.72, { organic: false, seg: 14, radial: 8 }));
        });
        for (let k = -2; k <= 2; k++) {
          const dx = messy ? Math.sin(k * 2.5) * 0.72 : 0;
          const dy = messy ? Math.cos(k * 1.9) * 0.62 : k * 0.34;
          const ch = chromMesh([dx, dy, 0.2], messy ? 0xff5050 : 0x45c49e, messy ? 0xff8080 : 0x45c49e, true, 0.45);
          ch.g.rotation.z = messy ? k * 0.9 : Math.PI / 2;
          spMs.push(...ch.ms);
        }
        reg(AX, messy ? '老化卵母細胞：MII 紡錘體不穩、染色體離散（非整倍體風險急升！）' : '年輕卵母細胞：整齊赤道板減數紡錘體', 'Meiotic spindle integrity (p.342)',
          '女性 35 歲後最早擊垮生育力的就是久置於減數分裂中的紡錘體微管老化，導致染色體誤分配與早期流產（Fig 21.3）。', spMs, { anchor: [0, 3.0, 0.9] });
      } else {
        const spD = dots([V(-0.6, 0.2, 0.3), V(0.5, -0.3, 0.4), V(0, 0.6, 0.3)], 0.18, 0xffb040);
        reg(AX, '少弱畸形精子與基因檢查（CFTR / Y染色體微缺失）', 'Sperm defects & Paternal mutations', C1_TXT[CASE1][1], [eggBox, spD], { anchor: [0, 3.0, 0.9] });
      }

      // 右側：兩根 3D FSH / LH 動態柱！
      const fshH = CASE1 === 'meno' ? 3.8 : (CASE1 === 'age38' ? 2.4 : (CASE1 === 'oligo' ? 3.2 : (CASE1 === 'pcos' ? 1.1 : 1.3)));
      const lhH = CASE1 === 'meno' ? 3.6 : (CASE1 === 'pcos' ? 3.4 : 1.3);
      const colFSH = cyl([4.2, -2.0, 0], [4.2, -2.0 + fshH, 0], 0.52, 0x45c49e, 0.95);
      const colLH = cyl([6.2, -2.0, 0], [6.2, -2.0 + lhH, 0], 0.52, 0x4db8e8, 0.95);
      const barBase = box([5.2, -2.2, 0], [4.0, 0.4, 1.5], 0x2a3b4e);
      reg(HPG, `腦垂腺促性腺激素：左綠 FSH (${fshH.toFixed(1)}) ｜ 右藍 LH (${lhH.toFixed(1)})`, 'Pituitary FSH vs LH response',
        '留意：<b>早發停經前先漲 FSH</b>（Inhibin B↓）；<b>PCOS 則是 LH 偏高而 FSH 不高</b>；男方生精衰竭亦可見 FSH 大升！',
        [colFSH, colLH, barBase], { anchor: [5.2, -2.9, 0.9] });

      textSprite(C1_TXT[CASE1][0], [0, 5.0, 0], 0.33, '#ffd479');

      const dt = dtClock();
      CUR.tick = () => {
        const d = S1.play ? dt() : 0; S1.t += d;
        CUR.root.rotation.y = Math.sin(S1.t * 0.4) * 0.14;
      };
    },
    panel(box) {
      selectBox(box, '不孕與老化病例模型', [['age25', '25歲黃金期'], ['age38', '38歲紡錘體老化'], ['meno', '停經更年期'], ['pcos', 'PCOS 多囊卵巢'], ['oligo', '男性少弱精/衰竭']], v => { CASE1 = v; reloadKeep(); }).value = CASE1;
      const cv = mkCanvas(box, 290, 145);
      plot(cv, {
        title: 'Fig 21.3 女性年齡與不孕／無子女率 (%)',
        x: [18, 48], y: [0, 85], xt: [20, 25, 30, 35, 40, 45], xl: '女性年齡 (35 歲起急遽上升)',
        vl: [{ x: 35, col: '#ff7070', label: '35歲轉折', ly: 24 }],
        series: [{ f: a => 3 + 78 / (1 + Math.exp(-(a - 39.5) / 2.9)), col: '#a78bfa', label: '婚後持續無子女率 (%)', w: 2.6 }]
      });
      note(box, C1_TXT[CASE1][1], 'big');
      checkbox(box, '微幅立體觀察', true, v => S1.play = v);
    }
  });

  /* ===== 場景②：輔助生殖微操套件（IVF vs ZD vs SUZI vs ICSI）（Figs 21.5–21.7） ===== */
  let S2 = null, ART2 = 'icsi'; // ivf | zd | suzi | icsi
  const ART2_DATA = {
    ivf: ['IVF 體外受精（繞過輸卵管阻塞，~25% 每週期率）', '經 <b>Buserelin 下調防偷排 → rFSH 促熟 → hCG 觸發 → 超音波取卵</b> 後，與濃縮處理精子共培養 24–48 小時，達 2–4 細胞期後每次多植入 ≤2 顆（亦有無輸卵管阻礙者選用 GIFT 直接將配子放回輸卵管，p.345–350）。'],
    zd: ['透明帶鑽孔（Zona Drilling, ZD）', '在精液品質較差或透明帶過硬時，以機械、雷射或微滴化學藥在透明帶穿一小洞助精穿入（兼助囊胚孵出）；缺點是破壞完整透明帶屏障，<b>多精入卵（Polyspermy）風險明顯升高</b>（Fig 21.5）！'],
    suzi: ['透明帶下人工授精（Subzonal Insemination, SUZI）', '使用玻璃微細吸管將一條至數條經處理的精子<b>直接推送至透明帶與卵膜之間的卵周隙（Perivitelline space）</b>；可繞過穿越卵丘與透明帶障礙，仍須靠自身 Izumo1–CD9 完成膜融合。'],
    icsi: ['卵細胞質內單精子注射（ICSI）', '用極細玻璃微針精準穿破透明帶與卵膜，將「單隻精子」（甚至取自副睪 <b>PESA</b>、睪丸切片 <b>TESE</b> 的無尾／精細胞、或 <b>Izumo1⁻/⁻</b> 突變精子！）直接打入卵質，連融合障礙皆能一併繞過（Fig 21.5）！']
  };
  SCENES.push({
    name: '② ART (IVF/ZD/SUZI/ICSI)',
    title: '輔助生殖家族：IVF、ZD（多精風險）、SUZI 與 ICSI 微注射解剖深度比較（Fig 21.5）',
    camera: { pos: [0, 0.8, 19], target: [0, 0, 0], fit: [9.8, 6.0] },
    controls: [{ label: '🔍 微操台全貌', fn() { flyHome(); } }],
    desc: `
<p>從試管嬰兒先驅 <b>Robert Edwards（2010 年諾貝爾生理醫學獎）與 Patrick Steptoe（1978 年 Louise Brown 誕生）</b>以來，全球已有逾 400 萬人藉各種分層級的輔助生殖技術誕生（Ch.21 p.345–351, Figs 21.5–21.7）。</p>
<details open><summary>依精子缺陷程度「層層深入破關」的微操圖鑑（Fig 21.5）</summary><ul>
<li><b>IVF</b>：只在培養皿外濃度加高繞開子宮頸與輸卵管阻塞（但精子仍須會游、獲能、破透明帶並膜融合）。</li>
<li><b>ZD</b>：幫精子開「透明帶洞口」，但易引多精入卵。</li>
<li><b>SUZI</b>：把精子送到「卵周隙」，繞過透明帶但仍要會「膜融合」。</li>
<li><b>ICSI</b>：單針直達「卵質深處」，只需細胞核＋PLCζ＋中心粒即可，連 <b>PESA/TESE 無動力精細胞</b>也能救！</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.21 p.345–351（Figs 21.5–21.7）</p>`,
    build() {
      S2 = { t: 0, play: true };
      const OO = '透明帶（外）與卵母細胞膜（內）＋固定針', PIP = '微操作注射吸管與單精深度';

      // 左側：負壓固定吸管 holding pipette 穩住卵母細胞
      const holdPip = ttube([V(-7.8, 0, 0), V(-4.7, 0, 0)], [0.65, 0.52], 0xb0d8f0, 0.55, { organic: false });
      const zpGap = ART2 === 'zd' ? 0.55 : 0.25;
      const zp = shell(1, [4.2, 4.0, 3.2], 0xe8d0a8, 0.34, zpGap, Math.PI * 1.65);
      const ool = shell(1, [3.2, 3.1, 2.5], 0xff80a8, 0.42, 0.5, Math.PI * 1.6);
      const m2sp = ell([0, 2.5, 0.2], [0.75, 0.4, 0.4], 0xffd43a, 0.92); // 避開上方減數紡錘體進針！
      const pb1 = ell([0.3, 3.55, 0.2], [0.38, 0.32, 0.32], 0xffb0c8, 0.92);
      reg(OO, '固定微管（左）、透明帶（外米色）與卵膜（內粉紅）', 'Holding pipette, Zona & Oolemma (avoid MII spindle!)',
        '進行微針穿刺時，第一極體及其下方 MII 紡錘體（頂端黃色）務必轉向 12 點或 6 點鐘方向，嚴禁讓針從該區刺入以免破壞染色體！',
        [holdPip, zp, ool, m2sp, pb1], { anchor: [-5.2, 2.6, 0.9] });

      // 右側進針與單隻或數隻精子深度：
      // icsi: 針頭深入 x = 0.8 (oocytoplasm); suzi: x = 3.55 (perivitelline); zd: 僅孔洞 x=4.1 + 多隻外精子; ivf: 外圍游動
      const tipX = ART2 === 'icsi' ? 0.4 : (ART2 === 'suzi' ? 3.55 : (ART2 === 'zd' ? 4.35 : 5.6));
      // 漸細玻璃微針吸管（LatheGeometry 呈現真實毛細管壁與尖端）
      const pipLen = 8.2 - tipX;
      const needle = lathe([[0.045, 0], [0.065, pipLen * 0.25], [0.16, pipLen * 0.65], [0.28, pipLen]], 0xc8ecff, 0.52, [tipX, 0, 0], [1, 0, 0], 24);
      const targetSp = new THREE.Mesh(spermHeadGeo(0.75, 0.38, 0.2), mat(0x46d16a, 0.98));
      targetSp.position.set(tipX - 0.38, 0, 0.08);
      const extraSp = [];
      const _spG21 = spermHeadGeo(0.62, 0.32, 0.16);
      if (ART2 === 'ivf' || ART2 === 'zd') {
        for (let i = 0; i < 6; i++) {
          const sx = 4.6 + (i % 2) * 0.55, sy = -1.6 + i * 0.65;
          const sh = new THREE.Mesh(_spG21, mat(ART2 === 'zd' && i === 3 ? 0xff4040 : 0xf6f2e8, 0.96));
          sh.position.set(sx, sy, 0.4);
          const st = ttube([V(sx + 0.3, sy, 0.4), V(sx + 0.75, sy + 0.1, 0.42), V(sx + 1.2, sy - 0.08, 0.38)], [0.04, 0.015], 0xd0e2f2, 0.94, { organic: false, seg: 12, radial: 8 });
          extraSp.push(sh, st);
        }
      }
      const pMs = ART2 === 'ivf' ? extraSp : [needle, targetSp, ...extraSp];
      reg(PIP, ART2_DATA[ART2][0], 'Micromanipulation depth & target', ART2_DATA[ART2][1], pMs, { anchor: [5.5, -2.5, 0.9] });

      S2.needle = needle; S2.targetSp = targetSp;
      textSprite(ART2_DATA[ART2][0], [0, 5.0, 0], 0.34, '#ffd479');

      const dt = dtClock();
      CUR.tick = () => {
        const d = S2.play ? dt() : 0; S2.t += d;
        if (ART2 === 'icsi' || ART2 === 'suzi') {
          const osc = Math.sin(S2.t * 2.5) * 0.15;
          needle.position.x = tipX + osc; targetSp.position.x = (tipX - 0.38) + osc;
        }
      };
    },
    panel(box) {
      seg(box, 'ART 微操深入層級（Fig 21.5）', [['ivf', 'IVF (皿外)'], ['zd', 'ZD (鑿帶)'], ['suzi', 'SUZI (帶下)'], ['icsi', 'ICSI (胞內)']], ART2, v => { ART2 = v; reloadKeep(); });
      note(box, ART2_DATA[ART2][1], 'big');
      checkbox(box, '播放微針推進示範', true, v => S2.play = v);
    }
  });

  /* ===== 場景③：PGD 切片選擇 與 粒線體受精卵原核移植置換（Fig 21.8） ===== */
  let S3 = null, STEP3 = 2; // 0:雙親病卵受精 vs 捐贈正常卵受精 | 1:去核捐贈合子 | 2:父母原核移入重組合子 | 3:PGD 單細胞切片
  const S3_TXT = [
    ['步驟 1：患者卵（帶突變粒線體，紫點）受精 vs 捐贈健康卵受精', '患者母親自身帶著會引致神經肌肉／心肝衰竭的<b>突變 mtDNA（37 個粒線體基因，具異質性比例效應）</b>；同時取健康卵供核移植受精為合子（Fig 21.8）。'],
    ['步驟 2：吸除健康捐贈受精卵原有的原核 → 留下「健康無核卵質」', '保留捐贈受精卵內所有健康的正常粒線體（金點）及全部能量支持系統，移除並棄置捐贈者本身的雌雄原核！'],
    ['步驟 3：將父母雙原核植入健康無核受精卵 → 100% 雙親核基因＋健康粒線體！', '新生受精卵擁有父母兩人親生核染色體與絕大多數正常捐贈者粒線體，得以避開無法治癒的母系粒線體疾病生下健康寶寶（Fig 21.8）！'],
    ['並列補充：胚胎著床前遺傳診斷 PGD 切片時機與晶片工具（p.351）', '可於受精前取「極體」、Day 2–3 取「8 細胞中之 1–2 分裂球」、或 Day 5 取「滋養層細胞」進行 <b>aCGH</b>（測套數）或 <b>SNP 晶片（唯一可供單倍體分型 haplotyping）</b>！']
  ];
  SCENES.push({
    name: '③ 原核粒線體置換與PGD',
    title: '粒線體疾病「原核移植卵重組」4步流程（Fig 21.8）與 PGD 切片比較',
    camera: { pos: [0, 0.8, 19], target: [0, 0, 0], fit: [9.8, 6.0] },
    controls: [{ label: '🔍 卵重建與PGD全景', fn() { flyHome(); } }],
    desc: `
<p>因為人類精子的粒線體受精後無法存活，所有粒線體基因（37 個基因）都<b>100% 母系遺傳</b>！若母親帶高比例致病性 mtDNA 突變（異質性超過發病閾值），目前無藥可醫——第 21 章介紹如何藉<b>原核移植卵重組</b>切斷突變 mtDNA 遺傳卻保住親生核基因！（Ch.21 p.350–352, Fig 21.8）</p>
<details open><summary>冷凍保存（-196°C）、PGD 晶片與細胞切片</summary><ul>
<li><b>PGD 採樣三時期</b>：極體（卵基因）｜Day 2–3 卵裂球（8 細胞）｜Day 5 囊胚滋養層。</li>
<li><b>aCGH vs SNP 晶片</b>：經全基因組擴增（WGA）後兩者皆可抓染色體數目錯誤，但<b>唯有 SNP 陣列可做單倍體分型（haplotyping）</b>！</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.21 p.350–352（Fig 21.8）</p>`,
    build() {
      S3 = { t: 0, play: true };
      const PAT = '患者父母受精卵（帶突變 mtDNA 紫點）', DON = '健康捐贈者受精卵（帶健康 mtDNA 金點）';

      if (STEP3 <= 2) {
        // 左側：患者受精卵（紫點=突變mtDNA，雙原核藍粉）
        const patEgg = shell(1, [2.7, 2.6, 2.2], 0xd080d0, 0.3, 0.5, Math.PI * 1.6);
        patEgg.position.set(-4.0, 0, 0);
        const pMutMt = dots([V(-5.2, 1.2, 0.4), V(-4.5, -1.3, 0.5), V(-2.7, 0.8, 0.5), V(-3.1, -1.4, -0.4), V(-5.1, -0.4, 0.6)], 0.16, 0xd040ff);
        const pnShowLeft = STEP3 < 2;
        const pF = ell([-4.5, 0.2, 0.2], [0.52, 0.52, 0.45], 0xff80a8, pnShowLeft ? 0.95 : 0.15);
        const pM = ell([-3.3, 0.2, 0.2], [0.62, 0.62, 0.5], 0x4db8e8, pnShowLeft ? 0.95 : 0.15);
        reg(PAT, '患者受精卵（紫點：突變粒線體；藍/粉球：雙親核原核）', 'Patient zygote (mutant mtDNA)', S3_TXT[STEP3][1],
          [patEgg, pMutMt, pF, pM], { anchor: [-4.0, -3.2, 0.9] });

        // 右側：捐贈者受精卵（金點=健康mtDNA；STEP=0有捐贈核，STEP=1去核，STEP=2裝入雙親原核！）
        const donEgg = shell(1, [2.7, 2.6, 2.2], 0x45c49e, 0.34, 0.5, Math.PI * 1.6);
        donEgg.position.set(4.0, 0, 0);
        const dGoodMt = dots([V(2.8, 1.2, 0.4), V(3.5, -1.3, 0.5), V(5.3, 0.8, 0.5), V(4.9, -1.4, -0.4), V(2.9, -0.4, 0.6)], 0.16, 0xffd43a);
        const dNuc = STEP3 === 0 ? [ell([3.5, 0.2, 0.2], [0.5, 0.5, 0.45], 0x708090, 0.85), ell([4.6, 0.2, 0.2], [0.55, 0.55, 0.45], 0x708090, 0.85)]
          : (STEP3 === 2 ? [ell([3.4, 0.2, 0.2], [0.52, 0.52, 0.45], 0xff80a8, 0.98), ell([4.6, 0.2, 0.2], [0.62, 0.62, 0.5], 0x4db8e8, 0.98)] : []);
        const trArrow = STEP3 === 2 ? arcArrow([[-2.6, 0.6, 0.5], [0, 1.8, 0.5], [2.6, 0.6, 0.5]], 0x38bdf8, 0.08) : [];
        reg(DON, STEP3 === 0 ? '捐贈者受精卵（帶健康金點粒線體）' : (STEP3 === 1 ? '已移除原核之健康「空白卵質」' : '重建完成！100% 雙親核＋健康粒線體！'),
          'Donor zygote / Reconstructed embryo (Fig 21.8)', S3_TXT[STEP3][1],
          [donEgg, dGoodMt, ...dNuc, ...trArrow], { anchor: [4.0, -3.2, 0.9] });

        if (STEP3 === 2) {
          S3.fTr = flowOn(trArrow.curve, 10, 0.14, 0x38bdf8, 0x103050, 0.35, 0.03);
          CUR.root.add(S3.fTr);
        }
      } else { // STEP3 === 3: PGD 8-cell 單細胞活檢示範
        const zp = shell(1, [3.2, 3.2, 2.8], 0x90d8ff, 0.28, 0.6, Math.PI * 1.65);
        const cells = [];
        for (let i = 0; i < 7; i++) {
          const a = i / 7 * Math.PI * 2;
          cells.push(ell([Math.cos(a) * 1.1, Math.sin(a) * 1.1, (i % 2 ? 0.5 : -0.5)], [0.85, 0.85, 0.8], 0xe890b0, 0.92));
        }
        const biopsied = ell([3.2, 0.2, 0.3], [0.82, 0.82, 0.78], 0x46d16a, 0.98);
        const pip = lathe([[0.12, 0], [0.16, 1.0], [0.28, 2.5], [0.36, 3.8]], 0xc8ecff, 0.52, [3.45, 0.2, 0.3], [1, 0, 0], 24);
        reg(PAT, 'PGD 第 2–3 天 8 細胞胚胎抽取單顆分裂球（另有極體與 D5 滋養層切片）', 'Preimplantation Genetic Diagnosis (PGD) biopsy',
          S3_TXT[3][1], [zp, ...cells, biopsied, pip], { anchor: [0, -3.6, 0.9] });
      }

      textSprite(S3_TXT[STEP3][0], [0, 5.0, 0], 0.33, '#ffd479');

      const dt = dtClock();
      CUR.tick = () => {
        const d = S3.play ? dt() : 0; S3.t += d;
        if (S3.fTr) S3.fTr.run(d);
      };
    },
    panel(box) {
      seg(box, '粒線體卵重組 vs PGD', [[0, '1.受精準備'], [1, '2.去捐贈核'], [2, '3.原核移植!'], [3, 'PGD 切片']], STEP3, v => { STEP3 = v; reloadKeep(); });
      note(box, S3_TXT[STEP3][1], 'big');
      checkbox(box, '播放送核動畫', true, v => S3.play = v);
    }
  });
})();
