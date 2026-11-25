/* Ch.16：胎兒並聯循環與三道分流、皮質醇與肺成熟、丘腦-皮質與神經發育 */
(function () {
  /* ===== 場景①：胎兒三道分流並聯循環 vs 新生兒／成人串聯切換（Fig 16.2） ===== */
  let S1 = null, CIRC1 = 'fetal'; // fetal | trans | adult | pda
  const C1_INFO = {
    fetal: ['胎兒並聯循環（三道分流全部開啟，O₂% 見標示）', '臍靜脈 <b>90% 飽滿氧血</b> → <b>① 靜脈導管（DV）</b>繞肝入下腔靜脈(67%) → 界嵴分進 <b>② 卵圓孔（FO）</b>→ 左心(62%)優先供腦；右心血(2/3CO, 52%)因高肺阻力大部分經 <b>③ 動脈導管（DA）</b>分進降主動脈(58%)！'],
    trans: ['出生瞬間第一口呼吸（暫態功能閉鎖，Fig 16.2b）', '肺泡膨脹＋肺動脈 Po₂ 升 → <b>肺阻力驟降</b>！左房壓壓閉<b>卵圓孔瓣膜</b>；同時高 Po₂ ＋ <b>PGE₂ 下降</b>促使動脈導管平滑肌急劇收縮（偶爾仍會暫時性微開直到完全解剖纖維化）！'],
    adult: ['成人串聯雙循環（三道分流完全閉鎖，Fig 16.2c）', '右心靜脈血 100% 送入肺泡換氣 → 回左心送全身！典型永久解剖閉鎖時間：DV 約 3 個月、DA 約 1 年；約 10% 成人的卵圓孔遺留小縫可探針穿過（probe-patent）。'],
    pda: ['未閉合動脈導管 PDA（約 6/10,000 足月兒；早產更常見）', '動脈導管對高氧無充分收縮或 <b>PGE₂</b> 偏高導致持續分流增加肺與心負荷。臨床使用 COX 抑制劑 <b>Indomethacin</b> 壓低 PGE₂ 促使平滑肌關閉導管（p.276）！']
  };
  SCENES.push({
    name: '① 胎兒三道分流',
    title: '靜脈導管・卵圓孔・動脈導管與出生第1口呼吸轉換（Fig 16.2）',
    camera: { pos: [0, 0.8, 19.5], target: [0, 0, 0], fit: [10.4, 6.2] },
    controls: [{ label: '🔍 心臟與三導管全圖', fn() { flyHome(); } }],
    desc: `
<p>出生前的肺泡裡充滿液體，無法進行氣體交換！為此胎兒演化出精巧的<b>「兩心室並聯（RV 2/3, LV 1/3）」與「三道血管分流」</b>，並在剪臍帶與吸進第一口氣的幾秒內轉換為成人串聯模式（Ch.16 p.274–276, Fig 16.2）。</p>
<details open><summary>三道分流如何讓胎兒大腦搶到最濃氧血？</summary><ul>
<li><b>① 靜脈導管（DV）</b>：繞開高耗氧的胎兒肝臟，保住來自胎盤臍靜脈的 <b>90% 血氧飽和度</b>。</li>
<li><b>② 卵圓孔（FO）</b>：把 IVC 進右房的充氧血大股直導左房→左室→頭臂動脈直衝大腦（<b>62%</b>）。</li>
<li><b>③ 動脈導管（DA）</b>：因胎兒低氧（20–25 mmHg）令肺動脈劇縮，將右室血大部分直接引回降主動脈（<b>58%</b>）再由臍動脈還給胎盤！</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.16 p.274–276（Fig 16.2）</p>`,
    build() {
      S1 = { t: 0, play: true };
      const H = '四腔心臟與卵圓孔瓣膜', SH = '三大分流管（DV / FO / DA）', ORG = '胎盤・肺臟・胎頭／體循環';
      const isFet = CIRC1 === 'fetal', isPDA = CIRC1 === 'pda';

      // 四腔心（右心在圖左側 x=-1.4, 左心在圖右側 x=+1.4）
      const ra = box([-1.5, 1.1, 0], [2.2, 1.8, 1.8], 0x906090, 0.45);
      const rv = box([-1.5, -1.0, 0], [2.2, 2.0, 1.8], 0x5068a0, 0.55);
      const la = box([1.5, 1.1, 0], [2.2, 1.8, 1.8], isFet ? 0xd06080 : 0xff4555, 0.45);
      const lv = box([1.5, -1.0, 0], [2.2, 2.0, 1.8], isFet ? 0xd85070 : 0xff3b3b, 0.55);
      // 卵圓孔通道 (FO)
      const fo = cyl([-0.35, 1.1, 0], [0.35, 1.1, 0], isFet ? 0.34 : 0.08, isFet ? 0xffd43a : 0x556677, isFet ? 0.96 : 0.45);
      reg(H, '右房/右室（2/3 心輸出）↔ 左房/左室 ＋ 卵圓孔（FO）', 'Heart chambers & Foramen Ovale', C1_INFO[CIRC1][1],
        [ra, rv, la, lv, fo], { anchor: [1.5, -0.5, 1.1] });

      // 器官節點：頂左=頭臂供腦(y=4.0,x=1.5), 頂右=胎肺(y=3.2,x=-4.8 vs 5.2), 底部=胎盤&DV(y=-4.0)
      const brain = ell([2.2, 4.1, 0], [1.4, 0.72, 0.8], 0xf2a090, 0.92);
      const lungs = ell([-5.2, 2.5, 0], [1.35, 1.4, 0.9], isFet ? 0x607898 : 0xff8098, isFet ? 0.72 : 0.95);
      const placenta = ell([-5.2, -3.5, 0], [1.65, 0.85, 0.9], isFet || CIRC1 === 'trans' ? 0xd83050 : 0x445566, isFet ? 0.95 : 0.25);
      const liver = ell([-2.6, -3.5, 0], [0.95, 0.6, 0.7], 0x904830, 0.88);
      const body = ell([5.2, -2.5, 0], [1.3, 1.6, 0.9], 0xc07080, 0.88);

      // 靜脈導管 (DV) 繞過肝臟入 IVC -> RA
      const dv = ttube([V(-4.0, -3.4, 0.3), V(-2.5, -2.4, 0.3), V(-1.5, -0.2, 0.2)], isFet ? 0.24 : 0.08, isFet ? 0xffd43a : 0x556677, isFet ? 0.95 : 0.35, { organic: false });
      // 動脈導管 (DA) 連接 肺動脈(-3.2, 2.2) <-> 主動脈(2.8, 2.2)
      const daOpen = isFet || isPDA || CIRC1 === 'trans';
      const daR = isFet ? 0.3 : (isPDA ? 0.24 : (CIRC1 === 'trans' ? 0.1 : 0.05));
      const da = cyl([-2.6, 2.8, 0.2], [2.0, 2.8, 0.2], daR, isPDA ? 0xff4040 : (isFet ? 0xffd43a : 0x556677), daOpen ? 0.95 : 0.35);
      // 主要動脈弧 (LV->頭/體; RV->肺; 體->胎盤)
      const rvPulm = ttube([V(-1.5, 0.1, 0), V(-2.6, 2.8, 0.2), V(-4.2, 2.6, 0)], isFet ? [0.28, 0.24, 0.12] : [0.28, 0.28, 0.26], 0x4db8e8, 0.88, { organic: false });
      const pulmRet = ttube([V(-4.4, 2.0, -0.3), V(-1.0, 2.2, -0.4), V(1.5, 1.5, -0.2)], isFet ? 0.12 : 0.26, 0xff5060, 0.88, { organic: false });
      const lvAorta = ttube([V(1.5, -0.2, 0.1), V(2.0, 2.8, 0.2), V(4.8, 1.5, 0.1), V(5.2, -1.0, 0)], 0.26, 0xff4050, 0.9, { organic: false });
      const descPlac = ttube([V(4.2, -3.2, 0), V(0, -4.1, 0), V(-3.8, -3.7, 0)], 0.18, 0x8060c0, isFet ? 0.85 : 0.2, { organic: false });

      reg(SH, '靜脈導管（DV）與動脈導管（DA）＋藥物關閉機制', 'Ductus venosus & Ductus arteriosus',
        isPDA ? '<b>PDA 治療：</b>給予 COX 抑制劑 <b>Indomethacin</b> 減少維持導管擴張的 <b>PGE₂</b>，促使平滑肌隨氧壓收縮閉合！' : '黃色顯著管徑即胎兒三大分流路徑（DV, FO, DA）；出生後依壓差與氧分壓依序功能及解剖閉合。',
        [dv, da], { anchor: [-0.2, 3.3, 0.9] });
      reg(ORG, '胎盤 (90% O₂ 源)・低灌流胎肺 (Po₂ 20–25)・頭與體循環', 'Placenta, Lungs, Head & Body',
        '胎頭/上肢經由卵圓孔搶得 62% 血氧優先發育大腦；肺臟在出生第一口氣後血流量暴升數倍接手換氣！',
        [brain, lungs, placenta, liver, body, rvPulm, pulmRet, lvAorta, descPlac], { anchor: [-5.8, -1.8, 0.9] });

      // 流向粒子：DV->FO->Brain（胎兒最粗黃紅流），Adult 為 RV->Lung->LV->Body
      const mainC = isFet ? new THREE.CatmullRomCurve3([V(-4.0, -3.4, 0.3), V(-2.2, -1.8, 0.3), V(-1.2, 1.1, 0.3), V(1.4, 1.1, 0.3), V(2.1, 3.5, 0.3)])
        : new THREE.CatmullRomCurve3([V(-1.5, -0.5, 0.1), V(-2.6, 2.8, 0.2), V(-4.5, 2.5, 0), V(-1.0, 2.2, -0.3), V(1.5, 1.2, 0), V(4.8, 1.5, 0.1), V(5.2, -1.2, 0)]);
      S1.flow = flowOn(mainC, 16, 0.14, isFet ? 0xffd43a : 0x60f0ff, 0x201010, 0.34, 0.04);
      CUR.root.add(S1.flow);

      textSprite(C1_INFO[CIRC1][0], [0, 5.1, 0], 0.34, '#ffd479');

      const dt = dtClock();
      CUR.tick = () => {
        const d = S1.play ? dt() : 0; S1.t += d;
        S1.flow.run(d);
      };
    },
    panel(box) {
      seg(box, '循環模式切換（Fig 16.2）', [['fetal', '胎兒(三道開)'], ['trans', '出生第一口氣'], ['adult', '成人(全閉鎖)'], ['pda', '病理 PDA']], CIRC1, v => { CIRC1 = v; reloadKeep(); });
      note(box, C1_INFO[CIRC1][1], 'big');
      checkbox(box, '播放循環血液分流', true, v => S1.play = v);
    }
  });

  /* ===== 場景②：皮質醇統籌肺表面張力素（L/S 比）與全身成熟（Fig 16.1, Table 16.1） ===== */
  let S2 = null, WK2 = 34, BETHA2 = false;
  SCENES.push({
    name: '② 肺表面張力素與皮質醇',
    title: '胎兒皮質醇誘導肺泡表面張力素（L/S >2）、PNMT 與肝醣（Fig 16.1）',
    camera: { pos: [0, 0.8, 19], target: [0, 0, 0], fit: [10.0, 6.0] },
    controls: [{ label: '🔍 器官與腎上腺全圖', fn() { flyHome(); } }],
    desc: `
<p>早產兒面臨兩大生死關卡：肺泡因缺<b>表面張力素（Surfactant）</b>擴不開（RDS 呼吸窘迫）、肝臟肝醣與腎臟留鈉能力不足。這整套倒數計時器全由胎兒下視丘 CRH → ACTH → <b>腎上腺皮質醇（Cortisol）</b>總指揮！（Ch.16 p.274–281, Fig 16.1, Table 16.1）</p>
<details open><summary>皮質醇統籌之五大臨產成熟任務</summary><ul>
<li><b>肺泡表面張力素＋吸水</b>：誘導雙飽和卵磷脂（Dipalmitoyl lecithin；羊水 L/S &gt; 2 表安全！）＋誘導 <b>PNMT（NA → 腎上腺素）</b>清除肺積液。</li>
<li><b>胎兒肝醣（Liver glycogen）</b>：孕末暴增支撐出生斷臍後空腹低血糖防線。</li>
<li><b>腎小管 Na<sup>+</sup>/K<sup>+</sup>-ATPase</b>：降低早產兒嚴重的漏鈉（早產漏鈉高達足月 3 倍！）。</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.16 p.276–280（Fig 16.1, Table 16.1）</p>`,
    build() {
      S2 = { t: 0, play: true };
      const u = clamp((WK2 - 20) / 20, 0, 1);
      const effU = clamp(u + (BETHA2 ? 0.38 : 0), 0, 1.0); // 母體注射單劑合成類固醇加速成熟！
      const AD = '胎兒腎上腺皮質（Cortisol ↑）＋PNMT', LG = '胎兒肺泡膨脹與表面張力素膜', LV = '胎兒肝醣儲備（Fig 16.1）與腎留鈉';

      const adr = ell([-5.2, 2.2, 0], [1.3, 0.95, 0.9], effU > 0.65 ? 0xffd43a : 0xf09050, 0.95);
      const med = ell([-5.2, 2.2, 0.6], [0.55, 0.45, 0.45], effU > 0.65 ? 0x46d16a : 0x708090); // PNMT
      reg(AD, BETHA2 ? '胎兒腎上腺＋外源合成皮質醇（加速成熟！）' : `胎兒腎上腺皮質（${WK2} 週 · Cortisol ${Math.round(10 + 180 * Math.pow(effU, 2.5))} ng/ml）`, 'Fetal adrenal cortex & PNMT',
        '胎兒皮質醇活化肺與腎上腺髓質之 <b>PNMT</b>，把正腎上腺素甲基化為腎上腺素，並刺激肺與肝臟末期酵素群成熟（Table 16.1）。',
        [adr, med], { anchor: [-5.5, 3.8, 0.8] });

      // 肺泡氣囊（表面張力素不夠就扁塌緊繃；夠則圓潤擴張並有一層亮青色卵磷脂內膜！）
      const alvR = 1.15 + 1.35 * Math.pow(effU, 1.2);
      const alvWall = shell(1, [alvR, alvR, alvR * 0.85], effU > 0.6 ? 0x90e8ff : 0xff7080, 0.35, 0.55, Math.PI * 1.6);
      alvWall.position.set(0.4, 1.4, 0);
      const surfCoat = shell(1, [alvR * 0.88, alvR * 0.88, alvR * 0.75], 0x38bdf8, 0.1 + 0.65 * effU, 0.55, Math.PI * 1.6);
      surfCoat.position.set(0.4, 1.4, 0);
      reg(LG, effU > 0.6 ? '富含卵磷脂表面張力素之成熟肺泡（L/S > 2）' : '缺張力素之塌陷危機肺泡（RDS 風險 · L/S < 2）', 'Alveolus & Dipalmitoyl lecithin',
        '雙飽和卵磷脂大幅降低表面張力；羊水卵磷脂/神經鞘磷脂比 L/S &gt; 2 表示不致發生呼吸窘迫症（玻璃樣膜病）。',
        [alvWall, surfCoat], { anchor: [0.4, 4.3, 0.8] });

      // 右下方：胎兒肝臟 (肝醣黃顆粒) + 腎臟 (Na+/K+-ATPase)
      const liv = ell([5.2, 1.6, 0], [1.45, 1.0, 0.9], 0xb05040, 0.85);
      const glyPts = [];
      for (let i = 0; i < Math.round(2 + 12 * Math.pow(effU, 1.8)); i++) {
        glyPts.push(V(4.4 + (i % 4) * 0.55, 1.1 + Math.floor(i / 4) * 0.45, 0.75));
      }
      const glyD = dots(glyPts, 0.16, 0xffd43a);
      const kid = ell([5.2, -2.2, 0], [1.1, 0.85, 0.75], effU > 0.65 ? 0x45c49e : 0x8090a0, 0.92);
      reg(LV, '胎兒肝臟肝醣庫（上）＋腎皮質 Na⁺/K⁺-ATPase（下）', 'Liver glycogen & Renal Na+ retention',
        '肝醣儲備於臨產前數週飆升至 ~50 mg/g 供出生斷食維持腦糖；皮質醇促進腎臟留鈉（否則早產兒漏鈉率達 3 倍易危及低血鈉！）。',
        [liv, glyD, kid], { anchor: [5.2, -3.5, 0.9] });

      // 皮質醇傳導箭頭
      const cA1 = arcArrow([[-3.8, 2.2, 0.3], [-1.8, 1.6, 0.3]], 0xffd43a, 0.06);
      const cA2 = arcArrow([[2.6, 1.4, 0.3], [3.8, 1.5, 0.3]], 0xffd43a, 0.05);
      addRoot([...cA1, ...cA2]);
      S2.fC = flowOn(cA1.curve, 10, 0.12, 0xffd43a, 0x302000, 0.15 + 0.3 * effU, 0.03);
      CUR.root.add(S2.fC);

      textSprite(`妊娠 ${WK2} 週${BETHA2 ? ' + 產前合成皮質醇' : ''}（L/S 比約 ${(0.8 + 1.9 * Math.pow(effU, 1.8)).toFixed(1)}）`, [0, 5.1, 0], 0.35, '#ffd479');

      const dt = dtClock();
      CUR.tick = () => {
        const d = S2.play ? dt() : 0; S2.t += d;
        S2.fC.run(d);
        const br = 1 + 0.06 * effU * Math.sin(S2.t * 4);
        alvWall.scale.set(alvR * br, alvR * br, alvR * 0.85 * br);
      };
    },
    panel(box) {
      slider(box, '妊娠週數 (W20 → W40)', 20, 40, WK2, 1, v => { WK2 = v; reloadKeep(); });
      checkbox(box, '產前給母體單劑合成皮質醇 (早產急救)', BETHA2, v => { BETHA2 = v; reloadKeep(); });
      const cv = mkCanvas(box, 290, 140);
      plot(cv, {
        title: 'Fig 16.1 血漿皮質醇、羊水卵磷脂與肝醣同步飆升',
        x: [20, 40], y: [0, 1.05], xt: [20, 24, 28, 32, 36, 40], xl: '妊娠週數',
        vl: [{ x: WK2, col: '#ffffff', label: '現在' }],
        series: [
          { f: w => 0.08 + 0.85 * Math.pow((w - 20) / 20, 2.7), col: '#ffd43a', label: '血漿皮質醇 (max 200 ng/ml)', w: 2.3 },
          { f: w => 0.06 + 0.82 * Math.pow((w - 20) / 20, 3.1), col: '#38bdf8', label: '羊水卵磷脂 L/S 指標', w: 2.2 },
          { f: w => 0.1 + 0.78 * Math.pow((w - 20) / 20, 2.2), col: '#ff7070', label: '胎兒肝醣 (max 50 mg/g)', w: 2.1 }
        ]
      });
      note(box, '<b>Ch17 p.293 臨床提醒：</b>合成類固醇雖可救早產兒肺成熟，但僅建議<b>單次療程</b>，重複多劑易長期改變新生兒 HPA 軸與心理健康。', 'big');
      checkbox(box, '播放 REM 胎兒呼吸動作', true, v => S2.play = v);
    }
  });

  /* ===== 場景③：神經丘腦—皮質連結（W24 痛覺門檻）與甲狀腺／鈣激素（Box 16.1） ===== */
  let S3 = null, N_WK3 = 24;
  SCENES.push({
    name: '③ 神經痛覺與 T4/PTHrP',
    title: 'W24 丘腦－皮質痛覺線界 vs 脊髓反射、T₄（腦分化）與 PTHrP（運鈣）（Box 16.1）',
    camera: { pos: [0, 0.8, 19], target: [0, 0, 0], fit: [10.0, 6.0] },
    controls: [{ label: '🔍 神經軸與激素總圖', fn() { flyHome(); } }],
    desc: `
<p>醫學與倫理高度關注「胎兒何時開始會痛」；發育神經生物學將<b>「脊髓傷害性反射」</b>與<b>「需大腦皮質參與的痛覺意識」</b>明確區分開（Ch.16 p.277–280, Box 16.1）。</p>
<details open><summary>神經連線與不可缺的腦／骨發育雙激素</summary><ul>
<li><b>W10</b> 皮膚現受器 → <b>W14</b> 母體胎動感（quickening）→ <b>W15</b> 脊髓縮回反射（無腦兒亦有）→ <b>W18</b> 腦幹應激 → <b>W24+</b> 方確立 <b>丘腦—皮質（Thalamocortical）</b>傳導且宮內常呈腺苷類睡眠鎮靜態（RCOG Box 16.1）。</li>
<li><b>胎兒甲狀腺 T₄</b>：早期借母體，中後期須母體供<b>碘</b>由胎兒自製且足月濃過母體，缺則重創 CNS 分化。</li>
<li><b>PTHrP</b>：調控跨胎盤運鈣；剔除 PTHrP 的小鼠出生即死於骨礦質化失敗！</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.16 p.277–280（Box 16.1）</p>`,
    build() {
      S3 = { t: 0, play: true };
      const NS = '大腦皮質・丘腦・脊髓傳導軸', ED = '胎兒甲狀腺 T₄（左下方）與副甲狀腺 PTHrP（右下方）';
      const hasSkin = N_WK3 >= 10, hasReflex = N_WK3 >= 15, hasBrainstem = N_WK3 >= 18, hasCortex = N_WK3 >= 24;

      // 左上至中：大腦皮質 -> 丘腦 -> 腦幹 -> 脊髓 -> 周圍皮膚
      const cortex = ell([-1.2, 3.3, 0], [2.6, 1.35, 1.3], hasCortex ? 0x38bdf8 : 0x556677, hasCortex ? 0.55 : 0.28);
      const thal = ell([-1.2, 1.5, 0], [0.9, 0.7, 0.7], hasBrainstem ? 0xffd43a : 0x607080, 0.92);
      const bstem = cyl([-1.2, 0.9, 0], [-1.2, -0.4, 0], 0.45, hasBrainstem ? 0x45c49e : 0x607080, 0.92);
      const scord = cyl([-1.2, -0.4, 0], [-1.2, -3.5, 0], 0.34, hasReflex ? 0xf09a4a : 0x607080, 0.92);
      const skin = box([-5.5, -2.5, 0], [1.4, 2.0, 1.2], hasSkin ? 0xff8080 : 0x556677, 0.88);
      const effLimb = arcArrow([[-4.7, -2.5, 0.3], [-1.6, -2.5, 0.3]], hasSkin ? 0xff7070 : 0x445566, 0.06);
      const thalamoCort = arcArrow([[-1.2, 1.8, 0.3], [-1.2, 3.1, 0.3]], hasCortex ? C_STIM : 0x445566, 0.07);
      reg(NS, `神經發育里程碑（第 ${N_WK3} 週：${hasCortex ? '丘腦—皮質連結確立（但呈類睡眠態）' : hasReflex ? '已有脊髓縮回反射，尚無大腦皮質痛覺' : '感覺受器初現'}）`, 'Thalamocortical vs Spinal reflex pathways',
        'RCOG 工作小組（Box 16.1）：在 <b>第 24 週</b> 建立功能性丘腦—皮質連結前，大腦皮質無法感知痛覺；且子宮內胎兒處於腺苷鎮靜之類睡眠態。',
        [cortex, thal, bstem, scord, skin, ...effLimb, ...thalamoCort], { anchor: [-4.4, 3.4, 0.8] });

      // 右側：甲狀腺 T4 & 副甲狀腺 PTHrP
      const thyr = ell([4.8, 2.0, 0], [1.2, 0.85, 0.7], 0x45c49e, 0.92);
      const t4C = arcArrow([[4.8, 2.5, 0.3], [1.5, 3.1, 0.3]], 0x45c49e, 0.06);
      const para = ell([4.8, -1.6, 0], [1.1, 0.75, 0.7], 0xffd43a, 0.92);
      const bone = box([4.8, -3.5, 0], [2.4, 0.7, 0.8], 0xeef2f7, 0.92);
      reg(ED, '胎兒甲狀腺 T₄（助腦分化）與 PTHrP（保鈣與骨化）', 'Fetal Thyroid T4 & Parathyroid PTHrP',
        '後期胎兒靠母體透過胎盤脫碘酶提供之碘製造高濃度 T₄ 支持腦發育；<b>PTHrP</b>（亦來於胎盤）是跨胎盤主動運鈣的不可取代關鍵！',
        [thyr, ...t4C, para, bone], { anchor: [4.9, 3.4, 0.8] });

      S3.fSens = flowOn(effLimb.curve, 8, 0.1, 0xff7070, 0x301010, hasSkin ? 0.32 : 0.02, 0.03);
      S3.fCort = flowOn(thalamoCort.curve, 8, 0.11, 0x38bdf8, 0x103050, hasCortex ? 0.35 : 0.02, 0.02);
      S3.fT4 = flowOn(t4C.curve, 8, 0.1, 0x45c49e, 0x103020, 0.28, 0.03);
      CUR.root.add(S3.fSens, S3.fCort, S3.fT4);

      textSprite(`W${N_WK3}：${hasCortex ? 'W24+ 丘腦－皮質相通 (仍處睡眠鎮靜態)' : hasBrainstem ? 'W18–23 腦幹應激未接通皮質' : hasReflex ? 'W15 脊髓反射 (無皮質痛覺)' : 'W10 皮膚受器未連腦'}`, [0, 5.1, 0], 0.33, '#ffd479');

      const dt = dtClock();
      CUR.tick = () => {
        const d = S3.play ? dt() : 0; S3.t += d;
        S3.fSens.run(d); S3.fCort.run(d); S3.fT4.run(d);
      };
    },
    panel(box) {
      slider(box, '神經發育週數 (W10 → W30)', 10, 30, N_WK3, 1, v => { N_WK3 = v; reloadKeep(); });
      stepList(box, [
        '10w 皮膚痛覺受器出現',
        '14w 母親感到胎動 (Quickening)',
        '15w 脊髓縮回反射成立',
        '18w 脊髓－腦幹應激建立',
        '24w 丘腦－皮質纖維接通（仍低清醒態）'
      ]);
      checkbox(box, '播放神經上傳與 T₄ 流動', true, v => S3.play = v);
    }
  });
})();
