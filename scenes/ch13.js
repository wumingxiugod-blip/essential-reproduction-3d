/* Ch.13：胎膜演化、絨毛樹與 EVT 低氧轉換、母－胎－胎盤內分泌協作 */
(function () {
  /* ===== 場景①：胚外胎膜衍化與卵黃囊→尿囊絨毛胎盤轉換（Figs 13.1–13.2） ===== */
  let S1 = null, ST1 = 4; // 0..4 對應 Fig 13.1 b,d,e,f & late expansion
  const ST1_TXT = [
    ['步驟 1：雙層胚盤形成（Epiblast + Hypoblast）', '多能胚層（ICM）分出上胚層（Epiblast，粉橘）與下胚層（Hypoblast，藍）；滋養層持續擴張包圍最外圈（Fig 13.1b）。'],
    ['步驟 2：胚外中胚層＋原羊膜腔＋卵黃囊腔', '上下胚層之間長出胚外中胚層（洋紅）並裂開形成胚外體腔；下方包圍成初級卵黃囊（Fig 13.1d）。'],
    ['步驟 3：三胚層胚盤＋絨毛卵黃囊胎盤（Choriovitelline）', '卵黃囊造血並貼近外圍絨毛膜形成早期「卵黃囊胎盤」（有袋類終生使用；兔/鼠維持部分轉運）；胚胎與母親透過子宮乳進行組織滋養（Fig 13.1e）。'],
    ['步驟 4：後腸「尿囊」帶臍血管貼附成尿囊絨毛胎盤', '胚胎向腹側捲摺出原始腸道，後端長出尿囊（Allantois，黃綠管）偕臍血管融合絨毛膜形成永久的<b>尿囊絨毛膜胎盤（Chorioallantoic）</b>（Fig 13.1f）。'],
    ['步驟 5：羊膜澎大貼合絨毛膜（消滅胚外體腔）', '充滿羊水的羊膜腔向外膨脹貼死外圍絨毛膜並包覆臍帶，卵黃囊退縮（Fig 13.2e）！']
  ];
  SCENES.push({
    name: '① 胚外膜與胎盤演化',
    title: '從雙層胚盤→卵黃囊胎盤→尿囊絨毛膜胎盤與羊膜擴張（Figs 13.1–13.2）',
    camera: { pos: [0, 0.8, 19], target: [0, 0, 0], fit: [9.8, 6.0] },
    controls: [{ label: '🔍 胚膜立體剖面', fn() { flyHome(); } }],
    desc: `
<p>這組胚外膜構造最常讓學生混淆，其實抓住兩個關鍵融合事件即可全盤貫通：<b>「卵黃囊＋絨毛膜＝過渡卵黃囊胎盤」</b>，與 <b>「後腸尿囊（帶臍血管）＋絨毛膜＝永久尿囊絨毛胎盤」</b>（Ch.13 p.229–231, Figs 13.1–13.2）。</p>
<details open><summary>四個核心胚外膜的來源與命運（Fig 13.1）</summary><ul>
<li><b>絨毛膜（Chorion）</b>：外層滋養層 ＋ 內襯胚外中胚層。</li>
<li><b>羊膜（Amnion）</b>：羊膜外胚層（源自上胚層）＋ 胚外中胚層（終將擴張吞沒胚外體腔）。</li>
<li><b>卵黃囊（Yolk sac）</b>：下胚層內胚層 ＋ 胚外中胚層（最早造血！）。</li>
<li><b>尿囊（Allantois）</b>：後腸內胚層盲囊帶中胚層血管，延伸成為<b>臍帶血管骨幹</b>！</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.13 p.228–232（Figs 13.1–13.2, Box 13.1）</p>`,
    build() {
      S1 = { t: 0, play: true };
      const CH = '外圍絨毛膜（Chorion）', EM = '胚胎／羊膜腔與胚外體腔', YK = '卵黃囊與尿囊（臍帶起源）';
      const chor = shell(1, [4.6, 4.1, 3.2], 0xe56b92, 0.34, 0.55, Math.PI * 1.6);
      const chorMes = shell(1, [4.25, 3.75, 2.9], 0xc05080, 0.25, 0.55, Math.PI * 1.6);
      reg(CH, '絨毛膜（Trophoblast + Chorionic mesoderm）', 'Chorion',
        '外層面向母體脫膜／子宮腺（第一孕期透過組織滋養吸收「子宮乳」，第 10–12 週切換成血液滋養胎盤，見右側頂部血管叢）。',
        [chor, chorMes], { anchor: [-4.6, 3.3, 0.9] });

      // 胎盤位置 (頂右)：隨 ST1 >= 3 長出絨毛叢
      const placDisk = ST1 >= 3 ? ell([0, 3.65, 0], [2.4, 0.65, 1.8], 0xd83050, 0.92) : ell([0, 3.65, 0], [1.2, 0.35, 1.0], 0xf08090, 0.5);
      reg(CH, ST1 >= 3 ? '尿囊絨毛膜胎盤發育處' : '早期絨毛卵黃囊接觸帶', 'Placental disc region',
        '胚胎第 1 孕期維持在 2–3% 低氧組織滋養，第 2 孕期啟動尿囊絨毛膜高效血液交換。', placDisk, { anchor: [0, 4.5, 0.8] });

      // 羊膜腔 & 胚胎
      const amScale = ST1 === 4 ? 3.85 : ST1 >= 2 ? 2.1 : 1.15;
      const amnion = shell(1, [amScale, amScale * 0.82, amScale * 0.7], 0x70e8ff, 0.24, 0.5, Math.PI * 1.6);
      amnion.position.set(0, ST1 === 4 ? 0 : 0.7, 0);
      const embY = ST1 >= 3 ? 0.2 : 0.5;
      const embryo = ST1 >= 2 ? ell([0, embY, 0.2], [1.25, 0.75, 0.7], 0xf09070, 0.95) : box([0, embY, 0.1], [1.8, 0.4, 1.2], 0xf09070, 0.95);
      const heart = ST1 >= 2 ? ell([-0.55, embY - 0.1, 0.5], [0.24, 0.24, 0.24], 0xff2828) : null;
      const emArr = [amnion, embryo]; if (heart) emArr.push(heart);
      reg(EM, ST1 === 4 ? '擴張之羊膜腔（已消滅胚外體腔！）' : '胚盤／捲曲胎兒與羊膜腔', 'Amnion & Embryo',
        '上胚層衍生胚胎外胚層（未來皮膚＋神經系統）與羊膜上皮；紅點為胚內原始心臟開始透過臍血管泵血。', emArr, { anchor: [-3.9, -0.5, 0.9] });

      // 卵黃囊（前大後縮） + 尿囊臍帶血管
      const ykR = ST1 === 0 ? 1.5 : ST1 <= 2 ? 1.85 : ST1 === 3 ? 1.1 : 0.48;
      const ykX = ST1 >= 3 ? -1.8 : 0, ykY = ST1 >= 3 ? -1.4 : -1.25;
      const yolk = ell([ykX, ykY, 0.2], [ykR, ykR * 0.85, ykR * 0.75], 0x4db8e8, 0.72);
      const allan = ST1 >= 3 ? ttube([V(0.7, embY - 0.2, 0.2), V(1.3, 1.4, 0.3), V(0.2, 3.2, 0.1)], [0.22, 0.28, 0.32], 0x45c49e, 0.92, { organic: false }) : null;
      const yArr = [yolk]; if (allan) yArr.push(allan);
      reg(YK, ST1 >= 3 ? '萎縮中之卵黃囊（藍）與新生尿囊臍帶（綠）' : '卵黃囊（最早造血與原始卵黃囊胎盤）', 'Yolk sac & Allantois (Umbilical stalk)',
        ST1 >= 3 ? '綠色管道即後腸長出的尿囊連同臍動靜脈直接貼合頂部絨毛膜建立胎盤！藍色卵黃囊隨後萎縮並入臍帶。' : '卵黃囊內壁為下胚層、外壁為造血中胚層；在兔／鼠一直協助免疫球蛋白等特定運輸，在人類則逐步退化。',
        yArr, { anchor: [3.2, -1.8, 0.9] });

      textSprite(ST1_TXT[ST1][0], [0, 5.1, 0], 0.36, '#ffd479');

      const dt = dtClock();
      CUR.tick = () => {
        const d = S1.play ? dt() : 0; S1.t += d;
        if (heart) { const s = 1 + 0.18 * Math.sin(S1.t * 8); heart.scale.set(s, s, s); }
      };
    },
    panel(box) {
      seg(box, '胎膜發育時刻（Fig 13.1）', [[0, '雙層'], [1, '體腔'], [2, '卵黃胎盤'], [3, '尿囊融合'], [4, '羊膜滿膨']], ST1, v => { ST1 = v; reloadKeep(); });
      note(box, ST1_TXT[ST1][1], 'big');
      checkbox(box, '播放心臟搏動', true, v => S1.play = v);
    }
  });

  /* ===== 場景②：胎盤終末絨毛與 EVT 螺旋動脈轉換／低氧防護（Figs 13.4–13.6, Box 13.3） ===== */
  let S2 = null, FLOW2 = 'plug'; // plug (1st tri 2-3% O2) | open (2nd/3rd tri converted) | fail (pre-eclampsia)
  const F2_TXT = {
    plug: ['第一孕期（<10–12 週）：EVT 塞子防高氧 ROS 畸形！', '<b>血管內 EVT</b> 雖已展開螺旋動脈擴張轉換，但暫時形成「滋養層塞子（Trophoblastic plugs）」阻擋母血球進入：絨毛間隙僅含清澈血漿＋子宮腺乳，<b>氧氣維持 2–3%（穩定 HIF1α）</b>以防自由基 ROS 毒害器官發生（Box 13.3）！'],
    open: ['第二／三孕期（>12 週）：塞子散去＋高容低壓血液滋養！', '螺旋動脈已去除平滑肌與血管收縮性（Converted），EVT 塞子消散，母血以極低壓 <b>4–10 mmHg</b>、緩速 <b>0.1–10 ml/s</b> 湧入「開窗酒杯狀（lobule）」空間刷過終末絨毛微血管叢，全力供應胎兒生長！'],
    fail: ['病理：螺旋動脈轉換失敗（子癇前症與胎兒遲滯 IUGR）', '若 EVT 侵入不足，螺旋動脈保留頑固平滑肌且管徑狹窄：母血呈高壓高速噴射（jets）損傷脆弱絨毛合胞層並造成缺血—再灌流 ROS 氧化壓力，誘發子癇前症與 IUGR（Fig 13.6）！']
  };
  SCENES.push({
    name: '② EVT轉換與低氧防護',
    title: '胎盤三級絨毛、EVT 重塑螺旋動脈與第一孕期 2–3% O₂ 保護（Figs 13.4–13.6）',
    camera: { pos: [0, 0.8, 19.5], target: [0, 0, 0], fit: [10.4, 6.2] },
    controls: [
      { label: '🔍 絨毛與螺旋動脈全剖面', fn() { flyHome(); } },
      { label: '🔍 下段：螺旋動脈轉換區', fn() { flyFit([0, -2.8, 0], [5.2, 2.8]); } }
    ],
    desc: `
<p>人類絨毛膜板延伸出幹絨毛與分支如毛刷般的<b>終末絨毛微血管結（Terminal villi，約 200 個胎兒小葉）</b>浸泡於母血池；這座系統早在 3–4 週即建好骨架，卻故意等到 10–12 週才全面通母血！（Ch.13 p.232–236, Figs 13.4–13.6）</p>
<details open><summary>自然選擇「犧牲前期生長速度以保護胚形分化」</summary><ul>
<li><b>HIF1α 氧氣感測（Box 13.3）</b>：低氧（2–3%）穩定 HIF1α 並保持滋養幹細胞；一旦暴露 &gt;10% O₂ 則促使其轉成 <b>EVT（Extravillous trophoblast）</b>。</li>
<li><b>雙路 EVT</b>：間質性（interstitial EVT）穿入脫膜基質；血管內（<b>endovascular EVT</b>）沿螺旋動脈上溯拆除肌層並於前 10 週先塞住開口！</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.13 p.232–236（Figs 13.4–13.6, Box 13.3）</p>`,
    build() {
      S2 = { t: 0, play: true };
      const VL = '絨毛膜板與三級終末絨毛樹', S = '間質／血管內 EVT 與母體螺旋動脈', IV = '絨毛間隙液體與氧分壓';

      // 上層：絨毛膜板 + 幹絨毛分支 + 終末微血管結
      const cPlate = tissueSlab([0, 4.0, 0], [10.5, 0.68, 2.8], 0x45c49e, 0.92, { wave: 0.08, seed: 1.3 });
      const villiMs = [cPlate];
      [-3.0, 0, 3.0].forEach((vx, idx) => {
        // 幹絨毛＋多級終末絨毛樹
        villiMs.push(ttube([V(vx, 3.7, 0), V(vx + 0.18 * Math.sin(idx + 1), 1.4, 0.18), V(vx, -0.75, 0)], [0.36, 0.24, 0.14], 0xe56b92, 0.9));
        for (let b = -1; b <= 1; b += 2) {
          villiMs.push(ttube([V(vx, 2.0, 0.1), V(vx + b * 0.95, 1.25, 0.32), V(vx + b * 1.3, 0.35, 0.1)], [0.2, 0.1], 0xe56b92, 0.86));
          villiMs.push(ttube([V(vx, 1.2, 0.1), V(vx + b * 1.15, 0.4, 0.4), V(vx + b * 1.4, -0.45, 0.05)], [0.15, 0.09], 0x4db8e8, 0.94, { organic: false }));
          villiMs.push(ell([vx + b * 1.35, -0.45, 0.08], [0.22, 0.18, 0.2], 0xff80a8, 0.88));
        }
      });
      reg(VL, '絨毛膜板與三級終末絨毛微血管叢（約 200 個小葉）', 'Chorionic plate & Tertiary terminal villi',
        '胎兒臍動脈血經幹絨毛分流至末端擴張的微血管環（Fig 13.5），降低流速以充分交換氣體與養分，僅隔一層極薄合胞滋養層面對母血（Fig 13.4）。',
        villiMs, { anchor: [-5.5, 2.6, 0.9] });

      // 絨毛間隙半透明底池
      const ivCol = FLOW2 === 'plug' ? 0x70c8e8 : (FLOW2 === 'open' ? 0xd83048 : 0xff4040);
      const ivPool = tissueSlab([0, 0.8, -0.6], [10.2, 4.4, 2.2], ivCol, FLOW2 === 'plug' ? 0.16 : 0.26, { wave: 0.07, seed: 2.1 });
      const ivArr = [ivPool];
      if (FLOW2 !== 'plug') {
        const rPts = [];
        for (let i = 0; i < 12; i++) rPts.push(V(-3.8 + (i % 6) * 1.5, -0.3 + Math.floor(i / 6) * 1.9 + (i % 2) * 0.4, 0.55));
        ivArr.push(rbcDiscs(rPts, 0.2, 0xe82838, 0.94));
      }
      reg(IV, FLOW2 === 'plug' ? '第一孕期：無紅血球清澈血漿＋子宮腺乳（2–3% O₂）' : '第二／三孕期：母血以 4–10 mmHg 浸潤空間', 'Intervillous space fluid/blood',
        F2_TXT[FLOW2][1], ivArr, { anchor: [5.4, 1.8, 0.9] });

      // 下層：波浪有機脫膜基底板＋兩條螺旋動脈（顯示轉換粗細＋塞子！）
      const bPlate = tissueSlab([0, -1.8, 0], [10.5, 0.72, 2.8], 0xc87890, 0.88, { wave: 0.08, seed: 3.1 });
      const dec = tissueSlab([0, -3.5, 0], [10.5, 2.6, 2.7], 0x904860, 0.42, { wave: 0.08, seed: 4.2 });
      const artTopW = FLOW2 === 'fail' ? 0.22 : 0.68; // 轉換後喇叭口大幅擴張！
      const artL = ttube([V(-2.4, -4.6, 0.2), V(-2.0, -3.6, 0.2), V(-2.4, -2.7, 0.2), V(-2.1, -1.5, 0.2)], [0.22, 0.25, artTopW * 0.75, artTopW], FLOW2 === 'fail' ? 0xff4040 : 0xff7080, 0.88, { organic: false });
      const artR = ttube([V(2.4, -4.6, 0.2), V(2.0, -3.6, 0.2), V(2.4, -2.7, 0.2), V(2.1, -1.5, 0.2)], [0.22, 0.25, artTopW * 0.75, artTopW], FLOW2 === 'fail' ? 0xff4040 : 0xff7080, 0.88, { organic: false });
      // EVT 塞子（plug 模式塞住喇叭口！）+ 間質 EVT 細胞點
      const evtPlugs = [];
      if (FLOW2 === 'plug') {
        evtPlugs.push(ell([-2.1, -1.65, 0.25], [0.58, 0.38, 0.48], 0xffd43a, 0.95));
        evtPlugs.push(ell([2.1, -1.65, 0.25], [0.58, 0.38, 0.48], 0xffd43a, 0.95));
      }
      const evtInter = dots([V(-3.4, -2.4, 0.7), V(-1.1, -2.6, 0.7), V(0.8, -2.5, 0.7), V(3.6, -2.3, 0.7)], 0.17, 0xffd43a, FLOW2 === 'fail' ? 0.2 : 0.92);
      reg(S, FLOW2 === 'fail' ? '未轉換狹窄螺旋動脈（保留平滑肌高阻！）' : 'EVT 重塑轉換後寬大喇叭口螺旋動脈', 'Spiral artery conversion & Endovascular EVT',
        '正常情況下血管內 EVT（金黃）破壞動脈平滑肌與內皮，讓口徑擴張轉成無阻力通道；第 1 孕期並以金黃細胞栓暫緩高氧紅血球涌入（Fig 13.6）。',
        [bPlate, dec, artL, artR, evtInter, ...evtPlugs], { anchor: [-5.4, -3.2, 0.9] });

      // 血流粒子進入小葉
      const mFlowC = new THREE.CatmullRomCurve3([V(-2.4, -4.6, 0.3), V(-2.2, -2.6, 0.3), V(-2.1, -1.3, 0.3), V(-2.2, 1.4, 0.3), V(-1.2, 2.8, 0.3)]);
      const spd2 = FLOW2 === 'plug' ? 0.08 : (FLOW2 === 'open' ? 0.22 : 0.68); // fail = 高速危險噴流！
      const fCol = FLOW2 === 'plug' ? 0x90e8ff : 0xff3b3b;
      S2.flow = flowOn(mFlowC, FLOW2 === 'plug' ? 8 : 22, FLOW2 === 'plug' ? 0.1 : 0.15, fCol, 0x300808, spd2, 0.08);
      CUR.root.add(S2.flow);

      textSprite(F2_TXT[FLOW2][0], [0, 5.1, 0], 0.36, '#ffd479');

      const dt = dtClock();
      CUR.tick = () => {
        const d = S2.play ? dt() : 0; S2.t += d;
        S2.flow.run(d);
      };
    },
    panel(box) {
      seg(box, '胎盤灌流時期／病理切換', [['plug', 'W4–9 低氧塞子'], ['open', 'W12+ 轉換血液滋養'], ['fail', '轉換失敗(子癇前症)']], FLOW2, v => { FLOW2 = v; reloadKeep(); });
      note(box, F2_TXT[FLOW2][1], 'big');
      checkbox(box, '播放螺旋動脈流', true, v => S2.play = v);
    }
  });

  /* ===== 場景③：母－胎－胎盤雌三醇協作工廠與物種激素（Figs 13.7–13.8, Table 13.1） ===== */
  let S3 = null, CASE3 = 'normal'; // normal | anenceph | sts_def
  const C3_TXT = {
    normal: ['正常協作（Fig 13.8）：母體膽固醇→胎盤 P₄；胎兒腎上腺/肝→胎盤→雌三醇 E₃', '<b>兩道互補缺失</b>：① 胎盤有芳香化酶缺 C17–20 裂解酶；② 胎兒腎上腺有裂解酶產 <b>DHA-S</b> 缺芳香化酶，加上<b>胎兒肝臟 16α-羥基化</b>生成 16α-OH-DHA-S 送回胎盤脫硫酸成 <b>E₃</b>（母血含量最高之雌激素）！'],
    anenceph: ['病理模擬：無腦兒（胎兒腎上腺萎縮 ↓ DHA-S）', '胎兒腦垂腺缺損使胎兒腎上腺發育不良，無法產 DHA-S → <b>16α-羥基化雌三醇（E₃）暴跌！</b>但 P₄（不靠胎兒）正常，且母體腎上腺仍可供應 50–60% 前驅物維持部分 E₁/E₂（p.240）。'],
    sts_def: ['病理模擬：X-連鎖胎盤硫酸酯酶缺乏症', '胎兒仍持續把所有類固醇加上硫酸根以策安全，但胎盤失去「去硫酸酶（sulphatase）」無法切除硫酸根 → 芳香化製造母體雌激素嚴重受阻（Fig 13.8 legend）！']
  };
  SCENES.push({
    name: '③ 母胎胎盤協作工廠',
    title: '胎盤自主 P₄、硫酸化防護網與胎兒腎上腺／肝產 E₃ 協作（Figs 13.7–13.8）',
    camera: { pos: [0, 0.8, 19.5], target: [0, 0, 0], fit: [10.4, 6.2] },
    controls: [{ label: '🔍 三室工廠全圖', fn() { flyHome(); } }],
    desc: `
<p>人類胚胎在短短 5–6 週內就達成「內分泌自主」，胎盤本身更如一間生合成巨廠；其中最具考點的莫過於<b>單獨培養胎盤細胞或單獨灌流胎兒均無法合成雌激素，唯獨「胎盤＋胎兒」合體方能完成！</b>（Ch.13 p.237–241, Figs 13.7–13.8）</p>
<details open><summary>必背口訣：胎兒「貼硫酸封印」，胎盤「撕封印並芳香化」</summary><ul>
<li><b>P₄（&gt;200 mg/day）</b>：完全靠<b>母體膽固醇 → 孕烯醇酮 → P₄</b>，不經胎兒！</li>
<li><b>E₃ 接力路線</b>：孕烯醇酮 → 胎兒腎上腺 <b>DHA-S</b> → 胎兒肝 <b>16α-OH-DHA-S</b> → 胎盤硫酸酯酶 + 芳香化酶 → <b>雌三醇（Oestriol, E₃）</b>！</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.13 p.237–243（Figs 13.7–13.8, Tables 13.1–13.3）</p>`,
    build() {
      S3 = { t: 0, play: true };
      const MT = '母體室（膽固醇・E₃ 出口）', PL = '胎盤合胞滋養層（自主 P₄・芳香化酶）', FT = '胎兒室（胎兒腎上腺＋肝 16α-羥基化）';

      const mBox = box([-5.8, 0, 0], [3.6, 6.8, 2.2], 0xf080a0, 0.35);
      const mChol = ell([-5.8, 2.0, 0.3], [0.95, 0.65, 0.65], 0xffd43a, 0.92);
      const mE3Out = ell([-5.8, -2.0, 0.3], [0.95, 0.65, 0.65], CASE3 === 'normal' ? 0xff70c0 : 0x556677, CASE3 === 'normal' ? 0.95 : 0.3);
      reg(MT, '母體循環（提供膽固醇＋部分 DHA-S；接收 P₄ 與 E₃）', 'Maternal compartment',
        '母體血中膽固醇（不是醋酸！）是胎盤合成每天超過 200 mg 助孕素的原料；母體腎上腺亦供應 50–60% E₁/E₂ 前驅物。',
        [mBox, mChol, mE3Out], { anchor: [-5.8, 3.9, 0.8] });

      const pBox = box([0, 0, 0], [4.0, 6.8, 2.2], 0x45c49e, 0.36);
      const pP4 = ell([0, 2.0, 0.3], [1.1, 0.7, 0.7], 0xffe060, 0.95);
      const pArom = ell([0, -2.0, 0.3], [1.15, 0.75, 0.7], CASE3 === 'sts_def' ? 0xff5050 : 0x60f0b0, 0.92);
      reg(PL, '胎盤合胞滋養層（缺 C17-20 裂解酶・具芳香化酶＋硫酸酯酶）', 'Placental syncytiotrophoblast',
        CASE3 === 'sts_def' ? 'X-連鎖硫酸酯酶缺乏！無法切掉從胎兒送來的 DHA-S / 16α-OH-DHA-S 上之硫酸根！' : '自主合成 P₄ 送回母胎；同時脫去胎兒雄激素硫酸根並芳香化生成大量 E₃！',
        [pBox, pP4, pArom], { anchor: [0, 3.9, 0.8] });

      const fBox = box([5.8, 0, 0], [3.6, 6.8, 2.2], 0x4db8e8, 0.35);
      const fAdr = ell([5.8, 1.5, 0.3], [1.0, 0.75, 0.7], CASE3 === 'anenceph' ? 0x607080 : 0xf09a4a, CASE3 === 'anenceph' ? 0.35 : 0.95);
      const fLiv = ell([5.8, -1.5, 0.3], [1.05, 0.75, 0.7], CASE3 === 'anenceph' ? 0x7090b0 : 0xd06040, 0.92);
      reg(FT, '胎兒腎上腺「胎兒帶」與胎兒肝臟（16α-OH + 硫酸化！）', 'Fetal adrenal & Fetal liver',
        CASE3 === 'anenceph' ? '無腦兒腦垂腺缺損 → 胎兒腎上腺萎縮無法產 DHA-S → 孕母血與尿 E₃ 急劇下降！' : '將胎盤傳來的孕烯醇酮加上「無毒硫酸根」，於腎上腺產 DHA-S 再經胎兒肝 16α-羥基化形成 16α-OH-DHA-S 送回胎盤。',
        [fBox, fAdr, fLiv], { anchor: [5.8, 3.9, 0.8] });

      // 流向路徑
      const cChP4 = arcArrow([[-4.7, 2.0, 0.4], [-1.3, 2.0, 0.4]], 0xffd43a, 0.06);
      const cPregF = arcArrow([[1.3, 2.0, 0.4], [4.6, 1.6, 0.4]], 0x70e8ff, 0.06);
      const cFetP = arcArrow([[4.6, -1.6, 0.4], [1.3, -2.0, 0.4]], CASE3 === 'anenceph' ? C_INH : 0xf09a4a, 0.06, { inhibit: CASE3 === 'anenceph' });
      const cPlM = arcArrow([[-1.3, -2.0, 0.4], [-4.7, -2.0, 0.4]], CASE3 === 'normal' ? 0xff70c0 : C_INH, 0.06, { inhibit: CASE3 !== 'normal' });
      addRoot([...cChP4, ...cPregF, ...cFetP, ...cPlM]);

      S3.f1 = flowOn(cChP4.curve, 8, 0.11, 0xffd43a, 0x302000, 0.35, 0.03);
      S3.f2 = flowOn(cPregF.curve, 8, 0.11, 0x70e8ff, 0x103050, 0.32, 0.03);
      S3.f3 = flowOn(cFetP.curve, 8, 0.11, 0xf09a4a, 0x301000, CASE3 === 'anenceph' ? 0.03 : 0.32, 0.03);
      S3.f4 = flowOn(cPlM.curve, 8, 0.11, 0xff70c0, 0x300020, CASE3 === 'normal' ? 0.34 : 0.03, 0.03);
      CUR.root.add(S3.f1, S3.f2, S3.f3, S3.f4);

      textSprite(C3_TXT[CASE3][0], [0, 4.9, 0], 0.33, '#ffd479');

      const dt = dtClock();
      CUR.tick = () => {
        const d = S3.play ? dt() : 0; S3.t += d;
        S3.f1.run(d); S3.f2.run(d); S3.f3.run(d); S3.f4.run(d);
      };
    },
    panel(box) {
      seg(box, '臨床／生化模型', [['normal', '正常協作 (E₃↑)'], ['anenceph', '無腦兒(E₃↓)'], ['sts_def', 'X-硫酸酯酶缺失']], CASE3, v => { CASE3 = v; reloadKeep(); });
      const cv = mkCanvas(box, 290, 145);
      plot(cv, {
        title: 'Fig 13.7a 人類孕期主要荷爾蒙曲線 (約 280 天)',
        x: [0, 280], y: [0, 1.05], xt: [0, 70, 140, 210, 280], xl: '懷孕天數',
        vl: [{ x: 40, col: '#45c49e', label: '卵巢可切(D40)' }],
        series: [
          { f: d => d < 14 ? 0.02 : (d < 65 ? 0.9 * Math.exp(-Math.pow((d - 65) / 28, 2)) : 0.14), col: '#45c49e', label: 'hCG (高6–9wk)', w: 2.2 },
          { f: d => 0.08 + 0.85 * Math.pow(d / 280, 1.15), col: '#ffd43a', label: 'P₄ (max ~160-200 ng/ml)', w: 2.2 },
          { f: d => 0.04 + 0.88 * Math.pow(d / 280, 1.6), col: '#ff70c0', label: 'E₃ (≫E₁/E₂)', w: 2.2 },
          { f: d => d < 45 ? 0.02 : 0.02 + 0.78 * Math.pow((d - 45) / 235, 1.1), col: '#4db8e8', label: 'hPL', w: 2 }
        ]
      });
      note(box, C3_TXT[CASE3][1], 'big');
      checkbox(box, '播放類固醇穿梭流', true, v => S3.play = v);
    }
  });
})();
