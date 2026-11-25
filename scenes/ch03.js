/* Ch.3：性成熟、睪丸下降、蔓狀靜脈叢逆流散熱、青春期 KNDy/GnRH 與松果體光週期 */
(function () {
  /* ===== 場景①：睪丸兩階段下降（Fig 3.1） ===== */
  let S1 = null, WK1 = 2, CRYPT = false; // 0:10w, 1:15w, 2:28w, 3:38w
  const ST_T = [
    ['第 10 週：腹腔後壁起點', '睪丸位於腰部腎臟下方腹膜後位置；上方連著<b>懸韌帶（suspensory ligament）</b>，下方連著<b>引帶（gubernaculum）</b>。'],
    ['第 15 週：經腹腔移向骨盆（Insl3 + 雄性素）', '胚胎長大時，<b>雄性素</b>使懸韌帶退化延長，<b>Insl3（作用於 RXFP2）</b>使引帶成熟縮短，睪丸因而相對下移至腹股溝內口。'],
    ['第 25–28 週：經腹股溝管跨過恥骨', '腹肌與腹膜向外膨出形成<b>腹膜鞘突（processus vaginalis）</b>進入陰囊隆起；睪丸沿其後方滑過恥骨緣。'],
    ['第 35–40 週：抵達陰囊與精索形成', '睪丸進入陰囊，鞘突上端閉鎖、下端雙層膜包覆睪丸成<b>鞘膜（tunica vaginalis）</b>；輸精管與拉長的睪丸動靜脈合稱<b>精索</b>。']
  ];
  SCENES.push({
    name: '① 睪丸下降遷徙',
    title: '胎兒睪丸兩階段下降至陰囊與隱睪症模擬（Fig 3.1）',
    camera: { pos: [0, 0.2, 19.5], target: [0, 0, 0], fit: [8.8, 6.8] },
    controls: [{ label: '🔍 全貌', fn() { flyHome(); } }],
    desc: `
<p>性腺起源於上腰部（腎臟附近），但多數哺乳類雄性睪丸必須穿越腹腔與<b>腹股溝管（inguinal canal）</b>下降至陰囊（Ch.3 p.51–54, Fig 3.1）。</p>
<details open><summary>關鍵激素與構造</summary><ul>
<li><b>懸韌帶（Suspensory ligament）</b>：受胎兒來狄吉細胞<b>雄性素</b>抑制退化、延長，釋放上端牽制。</li>
<li><b>引帶（Gubernaculum）</b>：受<b>胰島素樣因子 3（Insl3 → RXFP2）</b>促進成熟，牽引／錨定睪丸至陰囊。</li>
<li><b>腹膜鞘突 → 鞘膜（Tunica vaginalis）</b>：包裹睪丸的雙層腹膜囊，上方閉鎖為精索一部分。</li>
<li><b>隱睪症（Cryptorchidism）</b>：若 Insl3 突變或下降受阻，睪丸停於腹腔高溫環境 → 生精停止、腫瘤風險↑。</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.3 p.51–54（Fig 3.1, Box 3.1）</p>`,
    build() {
      S1 = { t: 0 };
      const BG = '腹腔與骨盆地標', M = '睪丸與牽引結構';
      // 腎臟、主動脈、膀胱、恥骨、陰囊囊袋
      const kid = [ell([-2.5, 4.0, -0.8], [0.85, 1.3, 0.7], 0xa05858, 0.5), ell([2.5, 4.0, -0.8], [0.85, 1.3, 0.7], 0xa05858, 0.5)];
      const aorta = cyl([0, -0.5, -1.2], [0, 5.2, -1.2], 0.35, 0xd83a3a, 0.5);
      const bladder = ell([0, -1.3, 0.6], [1.4, 1.2, 1.1], 0xe8b878, 0.35);
      const pubis = box([0, -2.5, 1.4], [3.6, 0.7, 0.7], 0xeadcbc, 0.7);
      const scrotum = shell(2.0, [1.25, 1.35, 0.9], 0xd89888, 0.25, Math.PI * 0.4, Math.PI * 1.2);
      scrotum.position.set(0, -4.8, 0.8);
      reg(BG, '腎臟與腹主動脈（腰部起源）', 'Kidneys & abdominal aorta', '睪丸動靜脈發源自腰部腎動脈旁的主動脈，隨睪丸下降而拉長（Fig 3.1d,e）。', [...kid, aorta], { anchor: [-3.8, 4.2, 0.4] });
      reg(BG, '膀胱與恥骨弓', 'Urinary bladder & pubic bone', '睪丸須跨過骨盆緣與恥骨前方進入腹股溝管。', [bladder, pubis], { anchor: [-2.6, -1.8, 1.0] });
      reg(BG, '陰囊與腹膜鞘突腔', 'Scrotum & processus vaginalis', '第 25–28 週腹肌筋膜與腹膜膨出為鞘突，包裹抵達的睪丸形成鞘膜（tunica vaginalis）。', scrotum, { anchor: [2.8, -5.0, 0.8] });

      // 雙側睪丸位置隨 WK1（若 CRYPT 則右側停在腹腔）
      const ys = [3.0, 0.8, -2.0, -4.5];
      const zs = [-0.2, 0.2, 1.2, 0.9];
      const tyL = ys[WK1], tzL = zs[WK1];
      const tyR = CRYPT ? ys[Math.min(1, WK1)] : tyL, tzR = CRYPT ? zs[Math.min(1, WK1)] : tzL;
      const tL = ell([-1.3, tyL, tzL], [0.65, 0.92, 0.65], 0x5aa8ff);
      const tR = ell([1.3, tyR, tzR], [0.65, 0.92, 0.65], CRYPT ? 0xff6b6b : 0x5aa8ff);
      reg(M, CRYPT ? '睪丸（左正常／右隱睪滯留）' : '雙側下降中睪丸', 'Descending testes',
        CRYPT ? '右睪丸因 Insl3／引帶缺陷停滯於腹腔（Cryptorchidism），4–7°C 過高體溫將阻礙日後精子生成！' : '依週數從腰部經腹腔、腹股溝管降至陰囊。',
        [tL, tR], { anchor: [-2.4, tyL, tzL + 0.5] });

      // 懸韌帶（上）與引帶（下）
      const susp = [
        cyl([-1.3, tyL + 0.8, tzL], [-1.8, 4.8, -0.5], 0.08, 0xffd479, 0.75),
        cyl([1.3, tyR + 0.8, tzR], [1.8, 4.8, -0.5], 0.08, 0xffd479, 0.75)
      ];
      const gub = [
        cyl([-1.3, tyL - 0.8, tzL], [-1.0, -5.2, 0.8], 0.14, 0x46d16a, 0.85),
        cyl([1.3, tyR - 0.8, tzR], [1.0, -5.2, 0.8], 0.14, CRYPT ? 0xff4a4a : 0x46d16a, 0.85)
      ];
      reg(M, '上方懸韌帶（受雄性素鬆弛）', 'Suspensory ligament', '雄性素使其退化延長，避免睪丸被固定於腰部（女性保留為卵巢懸韌帶）。', susp, { anchor: [2.6, 3.6, 0.4] });
      reg(M, '下方引帶（受 Insl3/RXFP2 成熟）', 'Gubernaculum', 'Insl3 使引帶膨大縮短，定位陰囊入口並牽引／導引睪丸跨出腹股溝管。', gub, { anchor: [-2.4, -3.5, 0.8] });

      // 拉長的精索血管與輸精管
      const cordL = ttube([[0, 3.8, -1.0], [-1.3, (3.8 + tyL) / 2, tzL * 0.5], [-1.3, tyL + 0.6, tzL]], 0.1, 0xff5a5a, 0.9, { organic: false });
      const cordR = ttube([[0, 3.8, -1.0], [1.3, (3.8 + tyR) / 2, tzR * 0.5], [1.3, tyR + 0.6, tzR]], 0.1, 0xff5a5a, 0.9, { organic: false });
      reg(M, '精索血管與輸精管', 'Spermatic cord & testicular vessels', '維持腰部起源，隨睪丸下移而延伸貫穿腹股溝管。', [cordL, cordR], { anchor: [2.4, 1.4, 0.4] });
    },
    panel(box) {
      const info = note(box, '', 'big');
      const sl = slider(box, '發育時期', 0, 3, WK1, 1, v => { WK1 = v; reloadKeep(); });
      checkbox(box, '模擬右側隱睪（Insl3 缺陷）', CRYPT, v => { CRYPT = v; reloadKeep(); });
      info.innerHTML = `<b>${ST_T[WK1][0]}</b><br>${ST_T[WK1][1]}`;
    }
  });

  /* ===== 場景②：成人睪丸剖面與蔓狀靜脈叢逆流降溫（Fig 3.2） ===== */
  let S2 = null;
  SCENES.push({
    name: '② 蔓狀靜脈叢散熱',
    title: '成人睪丸剖面與蔓狀靜脈叢逆流熱交換（4–7 °C 溫差，Fig 3.2）',
    camera: { pos: [0, 0.5, 18.5], target: [0, 0, 0], fit: [8.4, 6.6] },
    controls: [{ label: '🔍 全構造', fn() { flyHome(); } }],
    desc: `
<p>人類陰囊睪丸的最佳運作溫度須比腹腔核心低 <b>4–7 °C</b>；這歸功於陰囊皮膚汗腺與精索內<b>蔓狀靜脈叢（pampiniform plexus）</b>的逆流熱交換（Ch.3 p.51–53, Fig 3.2）。</p>
<details open><summary>熱交換機制與內部解剖</summary><ul>
<li><b>盤曲的內精動脈（紅）</b>：進入睪丸前高度盤旋增加表面積，被外層由陰囊外周回流的低溫靜脈網包裹。</li>
<li><b>蔓狀靜脈叢（藍）</b>：冷卻後的靜脈血吸收動脈熱量（使動脈降溫、靜脈回暖再入體循環）。</li>
<li><b>睪丸內部</b>：白膜分出中隔劃分小葉（lobes），內含盤曲曲細精管 → 直細精管 → 睪丸網 → 輸出小管 → 副睪頭體尾 → 輸精管。</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.3 p.51–53（Fig 3.2）</p>`,
    build() {
      S2 = { t: 0, play: true };
      const T = '睪丸與副睪構造', VSC = '逆流熱交換血管網';
      const tv = shell(2.5, [1.05, 1.45, 0.9], 0x90c8f0, 0.16, Math.PI * 0.45, Math.PI * 1.15);
      tv.position.set(0, -1.8, 0);
      const ta = shell(2.2, [1.0, 1.4, 0.85], 0xf4f1ea, 0.32, Math.PI * 0.55, Math.PI * 0.9);
      ta.position.set(0, -1.8, 0);
      // 小葉與曲細精管
      const tubs = [];
      for (let i = 0; i < 4; i++) {
        const y = -3.6 + i * 1.15;
        tubs.push(ttube([[0.6, y, 0], [1.4, y + 0.3, 0.4], [0.8, y + 0.5, -0.3], [-0.4, y + 0.2, 0.3], [-1.0, y, 0]], 0.14, 0xf2c870, 0.9, { organic: false }));
      }
      const rete = cyl([-1.1, -3.4, 0], [-1.1, -0.2, 0], 0.22, 0xe8d080);
      const epi = ttube([[-1.2, 0.4, 0], [-2.1, 0.8, 0.2], [-2.4, -1.5, 0.1], [-2.0, -4.3, 0], [-1.1, -4.6, -0.2], [-1.8, -1.2, -0.5], [-1.5, 4.5, -0.4]], [0.5, 0.42, 0.28, 0.26, 0.35, 0.2, 0.18], 0xd8a860, 0.88, { organic: false });
      reg(T, '鞘膜與白膜', 'Tunica vaginalis & albuginea', '雙層鞘膜包覆堅韌纖維性白膜，白膜向內延伸形成隔膜劃分睪丸小葉。', [tv, ta], { anchor: [2.7, -3.2, 0.6] });
      reg(T, '曲細精管與睪丸網', 'Seminiferous tubules & rete testis', '產生精子後經直細精管匯入後側睪丸網（rete testis），再由輸出小管進入副睪。', [...tubs, rete], { anchor: [2.2, -1.6, 0.5] });
      reg(T, '副睪（頭／體／尾）與輸精管', 'Epididymis & vas deferens', '精子在此完成運動與受精能力成熟並儲存於副睪尾，沿輸精管上行進入精索。', epi, { anchor: [-3.2, -1.4, 0.4] });

      // 精索熱交換：中央盤曲動脈 + 周圍編織蔓狀靜脈叢
      const artCurve = new THREE.CatmullRomCurve3(PV([[0.2, 5.4, 0], [0.6, 4.3, 0.3], [-0.3, 3.4, -0.2], [0.5, 2.5, 0.3], [-0.2, 1.6, -0.2], [0.4, 0.6, 0.2], [0.1, -0.6, 0]]));
      const art = ttube(artCurve.getPoints(60), 0.14, 0xff4040, 0.95, { organic: false });
      const veins = [0, 1, 2].map(p => ttube(helixAlong(lineCurve([0.1, -0.5, 0], [0.1, 5.4, 0]), 0.65, 5, p * 2.1, 180), 0.09, 0x3b82f6, 0.82, { organic: false }));
      reg(VSC, '盤曲內精動脈（37 °C → 31–33 °C）', 'Coiled internal spermatic artery', '血液下行途中把熱量傳給緊貼的外圍冷靜脈叢，到達睪丸時已降溫 4–7 °C。', art, { anchor: [1.5, 3.8, 0.5] });
      reg(VSC, '蔓狀靜脈叢（逆流吸收熱量）', 'Pampiniform venous plexus', '由陰囊表面冷卻的靜脈血上行回流，包裹動脈進行高效逆流熱交換（Fig 3.2c）。', veins, { anchor: [-1.4, 3.5, 0.6] });

      S2.fArt = flowOn(artCurve, 14, 0.11, 0xff9070, 0x501000, 0.22, 0.04); CUR.root.add(S2.fArt);
      const vCurve = new THREE.CatmullRomCurve3(veins[0].userData.curve.getPoints(40));
      S2.fVein = flowOn(vCurve, 14, 0.1, 0x70d0ff, 0x002050, 0.22, 0.04); CUR.root.add(S2.fVein);

      textSprite('精索上端 ≈ 37 °C', [2.3, 5.1, 0], 0.36, '#ff9a9a');
      textSprite('睪丸實質 ≈ 31–33 °C (−4–7 °C)', [2.8, -0.4, 0], 0.36, '#8fd0ff');

      const dt = dtClock();
      CUR.tick = () => {
        const d = S2.play ? dt() : 0;
        S2.fArt.run(d); S2.fVein.run(d);
      };
    },
    panel(box) {
      checkbox(box, '播放逆流血流動畫', true, v => S2.play = v);
      note(box, '🔴 動脈下行降溫｜🔵 蔓狀靜脈叢上行吸熱回暖');
    }
  });

  /* ===== 場景③：發身中樞啟動、KNDy/GABA 與夜間 LH 脈衝（Figs 3.10–3.15） ===== */
  let S3 = null, PUB = 'early';
  const PUB_INFO = {
    pre: ['兒童期（Prepuberty）', 'GABA 與 β-內啡肽抑制較強，KNDy/Kisspeptin 活性低，血中 LH 脈衝極微弱且幾無夜間增強。', 0.12, 0.8],
    early: ['發身早–中期（Early–mid puberty）', '脂肪量與瘦體素（Leptin）達許可閾值、GABA 抑制鬆動 → KNDy/Kisspeptin 促進 <b>夜間睡眠期 LH 脈衝大幅上升</b>（Fig 3.10b）！', 0.65, 0.4],
    adult: ['成年期（Adulthood）', '全天候維持約每小時 1 次（circhoral）穩定高頻 GnRH / LH 脈衝，日夜節律差異消退（Fig 3.10d）。', 1.0, 0.15]
  };
  SCENES.push({
    name: '③ 發身神經啟動',
    title: '青春期 GnRH 脈衝喚醒：KNDy、GABA、Leptin 與夜間 LH（Figs 3.10–3.13）',
    camera: { pos: [0, 0.5, 19.5], target: [0, 0, 0], fit: [9.8, 6.4] },
    controls: [{ label: '🔍 全軸', fn() { flyHome(); } }],
    desc: `
<p>人類經歷漫長的兒童期抑制後，青春期由<b>中樞神經系統解除抑制並喚醒 GnRH 脈衝</b>啟動（Ch.3 p.59–66, Figs 3.10–3.13）。</p>
<details open><summary>促進 vs 抑制神經網路（Box 3.2）</summary><ul>
<li><b>正調控</b>：弓狀核 <b>Kisspeptin 1（KISS1/GPR54）</b>與共表現 <b>Neurokinin B（TAC3/TACR3）</b>＋麩胺酸（NMDA 受體）＋延腦去甲腎上腺素。</li>
<li><b>負調控</b>：<b>GABA</b>（發身時下降）與弓狀核 <b>β-內啡肽</b>。</li>
<li><b>代謝許可（Box 3.4）</b>：白脂肪分泌 <b>Leptin</b>（體重達臨界值 ~47 kg 初經），經下視丘許可 Kisspeptin 表現（但非獨立早熟觸發器）。</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.3 p.59–66（Figs 3.10–3.15, Boxes 3.2, 3.4）</p>`,
    build() {
      S3 = { t: 0, play: true };
      const [, descTxt, gVal, inhVal] = PUB_INFO[PUB];
      const N = '正調控神經網', I = '幼年抑制系統', H = '垂腺–性腺反應';
      const gnrh = neuronM([0, 1.5, 0], 0x50d0ff, { s: 1.4, seed: 2 });
      const kiss = neuronM([-3.8, 2.8, 0.3], 0x46d16a, { s: 1.2, seed: 5 });
      const glu = neuronM([-3.8, 0.2, 0.3], 0xffe060, { s: 1.0, seed: 9 });
      const gaba = neuronM([3.8, 2.8, 0.3], 0xff5a5a, { s: 1.2, seed: 4 });
      const lep = ell([-6.8, -1.8, 0.5], [1.1, 0.85, 0.85], 0xffb84a);
      const pit = ell([0, -2.5, 0], [1.2, 0.85, 0.85], 0xd88a80);
      const gon = ell([4.4, -2.8, 0], [1.2, 1.0, 0.9], 0xf0c0b8);

      reg(N, 'GnRH 神經元（正中隆起軸突）', 'GnRH neuron', '接收來自 KNDy、GABA、麩胺酸與延腦的多重整合訊號，以每小時脈衝釋入垂體門脈。', gnrh, { anchor: [0, 3.3, 0.6] });
      reg(N, 'Kisspeptin 1 / 神經激肽 B（KNDy）', 'KISS1 & NKB (TAC3) neurons', '發身啟動必要中樞驅動者；<i>KISS1/KISS1R</i> 或 <i>TAC3/TACR3</i> 失能突變皆會完全阻斷發身。', kiss, { anchor: [-5.2, 3.8, 0.5] });
      reg(N, '麩胺酸與去甲腎上腺素輸入', 'Glutamate & Noradrenaline', '發身時 GnRH 胞體旁麩胺酸釋放上升；間歇性刺激 NMDA 受體可提早誘發發身。', glu, { anchor: [-5.2, 0.6, 0.5] });
      reg(N, '白色脂肪組織與瘦體素（Leptin）', 'Adipose tissue & Leptin', '反映足夠體脂與能量（女性約 47 kg 臨界體重），提供發身必需之「許可性背景訊號」。', lep, { anchor: [-6.8, -3.2, 0.6] });
      reg(I, 'GABA 與 β-內啡肽抑制系統', 'GABA & β-endorphin brake', '兒童期壓抑 GnRH 脈衝；發身啟動時視前區／基底下視丘 GABA 釋放下降，解除中樞煞車。', gaba, { anchor: [5.4, 3.6, 0.5] });
      reg(H, '腦垂腺前葉與性腺喚醒', 'Pituitary & gonadal awakening', '接受脈衝 GnRH 釋放 LH/FSH → 驅動第二性徵發育與配子生成。', [pit, gon], { anchor: [4.4, -4.2, 0.6] });

      const pK = arcArrow([[-2.8, 2.5, 0.3], [-1.0, 1.8, 0.2]], C_STIM, 0.065);
      const pG = arcArrow([[2.8, 2.5, 0.3], [1.0, 1.8, 0.2]], C_INH, 0.065, { inhibit: true });
      const pL = arcArrow([[-6.0, -1.0, 0.4], [-4.4, 1.8, 0.3]], 0xffb84a, 0.055);
      const pP = arcArrow([[0, 0.4, 0], [0, -1.5, 0]], 0x50d0ff, 0.07);
      const pGn = arcArrow([[1.2, -2.5, 0], [3.2, -2.7, 0]], 0xd88a80, 0.06);
      addRoot([...pK, ...pG, ...pL, ...pP, ...pGn]);

      S3.fK = flowOn(pK.curve, 10, 0.11, 0x7dff8a, 0x104010, 0.35 * gVal + 0.05, 0.04);
      S3.fI = flowOn(pG.curve, 10, 0.11, 0xff7070, 0x401010, 0.35 * inhVal + 0.05, 0.04);
      S3.fP = puffer(pP.curve, 16, 0.12, 0x8fd0ff, 0x103060, 0.9, 0.08);
      CUR.root.add(S3.fK, S3.fI, S3.fP);

      textSprite(PUB_INFO[PUB][0], [0, 4.9, 0], 0.44, '#ffd479');

      let lastP = -1;
      const dt = dtClock();
      CUR.tick = () => {
        const d = S3.play ? dt() : 0; S3.t += d;
        S3.fK.run(d); S3.fI.run(d); S3.fP.run(d);
        const step = Math.floor(S3.t * (0.4 + gVal * 1.4));
        if (step !== lastP) { lastP = step; S3.fP.emit(Math.round(3 + gVal * 9)); }
        gon.scale.setScalar((0.75 + 0.55 * gVal) * (1 + 0.04 * Math.sin(S3.t * 2)));
      };
    },
    panel(box) {
      seg(box, '發身時期切換（Fig 3.10）', [['pre', '兒童期'], ['early', '早–中期（夜間）'], ['adult', '成年期']], PUB, v => { PUB = v; reloadKeep(); });
      const ch = mkCanvas(box, 290, 145);
      const fn = PUB === 'pre' ? x => 0.8 + 0.3 * Math.sin(x * 40)
        : PUB === 'early' ? x => (x > 0.18 && x < 0.55 ? 2.5 + 5.5 * Math.pow(Math.max(0, Math.sin((x - 0.18) * 55)), 4) : 1.0 + 0.5 * Math.pow(Math.max(0, Math.sin(x * 45)), 4))
        : x => 3.0 + 4.8 * Math.pow(Math.max(0, Math.sin(x * 65)), 4);
      plot(ch, {
        title: '24 小時血中 LH 脈衝曲線 (Fig 3.10 示意)',
        x: [0, 24], y: [0, 10], xl: '時間（22:00 起算；陰影＝睡眠）', yl: 'LH (mIU/ml)',
        bands: [{ x0: 4.5, x1: 13.5, col: 'rgba(100,150,255,0.16)', label: '睡眠期' }],
        series: [{ f: t => fn(t / 24), col: '#ffd479', w: 2 }],
        legend: false
      });
      note(box, PUB_INFO[PUB][1], 'big');
      checkbox(box, '播放脈衝動畫', true, v => S3.play = v);
    }
  });

  /* ===== 場景④：松果體光週期與褪黑素季節繁殖（Box 3.3） ===== */
  let S4 = null, DL4 = 9; // 日照時數 8 (短日) ~ 16 (長日)
  SCENES.push({
    name: '④ 松果體光週期',
    title: '視網膜 → SCN → 松果體褪黑素時間碼：短日（綿羊）vs 長日（倉鼠）（Box 3.3）',
    camera: { pos: [0, 0.4, 19.5], target: [0, 0, 0], fit: [9.8, 6.2] },
    controls: [{ label: '🔍 全路徑', fn() { flyHome(); } }],
    desc: `
<p>許多野生與家畜須確保幼獸在春季或初夏出生，因此演化出偵測<b>光週期（photoperiod）</b>的機構（Ch.3 Box 3.3）。</p>
<details open><summary>褪黑素時間長度密碼</summary><ul>
<li><b>路徑</b>：視網膜光受體 → 視交叉上核（SCN，晝夜振盪器）→ 交感神經 → <b>松果體（pineal）</b>在黑暗中活化 <i>N-acetyl transferase</i> 分泌<b>褪黑素（melatonin）</b>。</li>
<li><b>關鍵</b>：褪黑素<b>持續寬度＝黑夜長度</b>（秋冬季長、春夏季短）。</li>
<li><b>長日照動物（倉鼠／鳥，孕期短）</b>：短夜（<12.5h 暗）刺激繁殖，長夜（冬季）性腺萎縮。</li>
<li><b>短日照動物（綿羊／鹿，孕期 ~5 個月）</b>：秋季長夜（褪黑素峰變寬）反而刺激 GnRH 脈衝啟動發情，使羔羊於隔年春天出生！</li></ul></details>
<p class="src">Essential Reproduction 7e Ch.3 p.64–65（Box 3.3）</p>`,
    build() {
      S4 = { t: 0, play: true };
      const night = 24 - DL4;
      const sheepOn = night > 11.5;
      const hamOn = DL4 > 12.5;
      const P = '光線–松果體路徑', SP = '物種繁殖反應';

      const sun = ell([-6.8, 3.2, 0], [0.85, 0.85, 0.85], 0xffd43a);
      const eye = ell([-4.2, 1.5, 0], [0.65, 0.65, 0.65], 0xe8f4ff);
      const scn = ell([-1.6, 1.5, 0], [0.75, 0.6, 0.65], 0x70ff90);
      const pin = ell([1.2, 3.2, 0], [0.75, 0.6, 0.65], 0xb07ae0);
      const gnrh = ell([1.2, 0.2, 0], [0.9, 0.65, 0.7], 0x50d0ff);
      reg(P, '環境日照（光：暗比例）', 'Ambient photoperiod', `目前設定：白天 ${DL4} 小時 ／ 黑夜 ${night} 小時。`, sun, { anchor: [-7.0, 4.4, 0.5] });
      reg(P, '視網膜與視下視丘徑', 'Retina & retinohypothalamic tract', '將晝夜明暗變化直接傳遞給 SCN 進行節律校正（entrainment）。', eye, { anchor: [-4.5, 2.5, 0.5] });
      reg(P, '視交叉上核（SCN 時鐘）', 'Suprachiasmatic nucleus', '具內生 ~24 小時振盪節律；破壞 SCN 會完全喪失光週期感應。', scn, { anchor: [-1.8, 0.4, 0.5] });
      reg(P, '松果體與褪黑素訊號', 'Pineal gland & Melatonin', '僅在黑夜分泌褪黑素（由血清素經 N-乙醯轉移酶合成），高峰持續時間＝黑夜長度。', pin, { anchor: [1.2, 4.3, 0.5] });
      reg(P, '下視丘 GnRH 脈衝產生器', 'Hypothalamic GnRH pulse generator', '解讀褪黑素持續寬度後改變 GnRH 脈衝頻率。', gnrh, { anchor: [-0.2, -0.8, 0.5] });

      // 右側：綿羊 vs 倉鼠性腺狀態
      const shGon = ell([5.2, 2.2, 0], [sheepOn ? 1.25 : 0.6, sheepOn ? 1.0 : 0.5, 0.8], sheepOn ? 0x46d16a : 0x607080);
      const hmGon = ell([5.2, -1.8, 0], [hamOn ? 1.25 : 0.6, hamOn ? 1.0 : 0.5, 0.8], hamOn ? 0x46d16a : 0x607080);
      reg(SP, `綿羊（短日照秋季繁殖：${sheepOn ? '活躍' : '乏情'}）`, 'Sheep (short-day breeder)', '孕期約 5 個月；秋季日照縮短、褪黑素高峰變寬 → 啟動 GnRH 脈衝，確保春天產羔。', shGon, { anchor: [5.2, 3.6, 0.5] });
      reg(SP, `敘利亞倉鼠（長日照春夏繁殖：${hamOn ? '活躍' : '萎縮'}）`, 'Syrian hamster (long-day breeder)', '孕期極短；須日照 >12.5 小時（褪黑素時間窄）才維持性腺活性，冬季長夜則萎縮。', hmGon, { anchor: [5.2, -3.2, 0.5] });

      addRoot(arrowM([-6.0, 2.7, 0], [-4.8, 1.9, 0], 0xffd43a, 0.05));
      addRoot(arrowM([-3.4, 1.5, 0], [-2.5, 1.5, 0], 0x70ff90, 0.05));
      const cPin = arcArrow([[-1.0, 1.9, 0], [0.2, 2.9, 0]], 0xb07ae0, 0.055);
      const cMel = arcArrow([[1.2, 2.5, 0], [1.2, 1.0, 0]], 0xb07ae0, 0.06);
      addRoot([...cPin, ...cMel]);
      addRoot(arrowM([2.2, 0.6, 0], [3.9, 1.9, 0], sheepOn ? C_STIM : C_INH, 0.05));
      addRoot(arrowM([2.2, -0.2, 0], [3.9, -1.5, 0], hamOn ? C_STIM : C_INH, 0.05));

      S4.fMel = flowOn(cMel.curve, 12, 0.12, 0xd090ff, 0x301050, 0.25, 0.04); CUR.root.add(S4.fMel);

      const dt = dtClock();
      CUR.tick = () => {
        const d = S4.play ? dt() : 0;
        S4.fMel.run(d);
      };
    },
    panel(box) {
      slider(box, '日照長度 (小時/天)', 8, 16, DL4, 0.5, v => { DL4 = v; reloadKeep(); });
      const ch = mkCanvas(box, 290, 130);
      const night = 24 - DL4;
      const n0 = 12 - night / 2, n1 = 12 + night / 2;
      plot(ch, {
        title: `褪黑素分泌波（黑夜 ${night} 小時）`,
        x: [0, 24], y: [0, 1.1], xl: '24 小時（中央 12 = 午夜）', yl: '褪黑素',
        bands: [{ x0: n0, x1: n1, col: 'rgba(176,122,224,0.22)', label: '黑夜' }],
        series: [{ f: x => (x > n0 && x < n1 ? 0.9 * smooth(Math.min(x - n0, n1 - x) / 1.2) : 0.05), col: '#d090ff', w: 2.5 }],
        legend: false
      });
      btnRow(box, [
        ['🍂 秋冬短日 (9h 光)', () => { DL4 = 9; reloadKeep(); }],
        ['☀️ 春夏長日 (15h 光)', () => { DL4 = 15; reloadKeep(); }]
      ]);
      checkbox(box, '播放褪黑素傳遞', true, v => S4.play = v);
    }
  });
})();
