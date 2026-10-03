// 規則內容與球場示意圖場景。正統規則以 USA Pickleball Official Rulebook 2026 為準，
// 括號內是規則書章節。場景的位置名稱由 src/court.js 定義。
// 甲隊（A）在球場下半（near），乙隊（B）在上半（far）。
// en：英文術語，顯示在標題後的括號裡，用詞以 glossary.js 為準。
// singlesScenes／singlesSummary／singlesDetail：單打雙打都適用、但單打要換圖或文字的規則。
// 有這些欄位的規則會拆成兩頁：雙打 #rules/<id>、單打 #rules/<id>-singles（沒寫的欄位沿用一般版本）。

export const RULEBOOK = 'USA Pickleball Official Rulebook 2026';

const A1 = (extra = {}) => ({ team: 'A', side: 'near', pos: 'right', label: '甲1', ...extra });
const A2 = (extra = {}) => ({ team: 'A', side: 'near', pos: 'left', label: '甲2', ...extra });
const B1 = (extra = {}) => ({ team: 'B', side: 'far', pos: 'right', label: '乙1', ...extra });
const B2 = (extra = {}) => ({ team: 'B', side: 'far', pos: 'left', label: '乙2', ...extra });

// 單打：甲在下半場、乙在上半場
const S = (extra = {}) => A1({ label: '甲', ...extra });
const R = (extra = {}) => B1({ label: '乙', ...extra });
const srv = { depth: 'behind', serving: true };

// 雙彈跳：發球彈一次、回球彈一次、第三拍飛到乙（1）面前、第四拍在空中截擊回去。
// 第三拍的落點用座標放在乙（1）身前，不然球會被人蓋住。
const TWO_BOUNCE = ['near:right:behind', 'far:right:mid', 'near:right:mid', [124, 184], 'near:left:kitchenLine'];

// 雙打四人都站底線的預設站位
const four = (serving = {}) => [A1(serving.A1), A2(serving.A2), B1(serving.B1), B2(serving.B2)];

// 章節：scoring 標出只適用哪一種計分（沒寫就是都適用）；規則的 play 標出
// 只適用雙打或單打（沒寫就是都適用）。規則頁上方的切換鈕靠這兩個欄位篩選。
// 兩個計分章節用同一套步驟（step）：points 怎麼得分、calling 怎麼喊分、
// positions 誰發球站哪裡。切換計分方式時跳到另一章的同一步；note 顯示在目錄的章節標題下。
export const SECTIONS = [
  {
    id: 'court',
    title: '球場與線',
    en: 'Court & Lines',
    intro: '先認識場地。後面每一條規則的圖，都是這一張球場。',
    items: [
      {
        id: 'dimensions',
        title: '球場尺寸',
        en: 'Court Dimensions',
        summary: '球場 13.41 × 6.10 公尺，跟羽球雙打場一樣大。網子兩邊各有一塊 2.13 公尺深的「廚房」。',
        detail: [
          '正式名稱是非截擊區（Non-Volley Zone），大家都叫廚房（Kitchen）。它是匹克球最重要的一塊地：人在裡面不能把球在空中直接打回去。',
          '網高：兩端 91 公分，中間 86 公分。',
          '場地劃線：底線、邊線、廚房線，以及從廚房線到底線的中線，把每邊分成左右兩個發球區。',
          '沒有匹克球場？下一頁「借場地打」教你用羽球場、網球場、排球場貼線。',
        ],
        scenes: [
          { caption: '整個球場 13.41 × 6.10 公尺，中間是網子。', labels: true },
          { caption: '網子兩邊各 2.13 公尺深的廚房，正式名稱是非截擊區。', labels: true, highlight: ['nvz'] },
          { caption: '廚房線到底線之間，被中線分成左右兩個發球區。', highlight: ['serviceBox:near:right', 'serviceBox:near:left', 'serviceBox:far:right', 'serviceBox:far:left'] },
        ],
      },
      {
        // 借別的球場打（實用做法，不是規則）。尺寸來源：USA Pickleball rulebook 第 2 節
        // （量到線外緣）、BWF Laws（羽球 13.40 × 6.10，前發球線離網 1.98，網中間 1.524）、
        // ITF Rules of Tennis（發球線離網 6.40，網中間 0.914）、FIVB（18 × 9，攻擊線 3 m）；
        // 一面網球場圍網範圍 60 × 120 ft 排 4 面：sportmaster.net、protrackandtennis.com。
        // 圖由 court.js setupSvg(host) 畫。
        id: 'setup',
        title: '借場地打',
        en: 'Court Setup',
        summary: '沒有匹克球場，羽球場最好借：線幾乎都能用，只要補兩條廚房線。網球場和排球場要多貼幾條。',
        setup: {
          intro: '先用捲尺量，再用 5 公分寬的膠帶貼線。尺寸量到線的外緣，線算在場內。貼好量兩條對角線，都是 14.73 公尺就是直角。',
          legend: { reuse: '直接用的線', tape: '要貼的線', host: '原本場地的線' },
          groups: [
            { host: 'badminton', name: '羽球場（最省事）', items: [
              '羽球雙打場 13.40 × 6.10 公尺，幾乎一樣大，邊線和底線直接用。',
              '廚房線：羽球前發球線離網 1.98 公尺，匹克球廚房 2.13 公尺，在前發球線後面約 15 公分貼一條。',
              '中線直接用羽球的中線，雙打後發球線不用管。',
              '網子太高（羽球網中間 1.52 公尺），要換匹克球網或自備可攜式網子。',
            ] },
            { host: 'tennis', name: '網球場', items: [
              '最簡單是用網球網畫一面：把網子中間的帶子放低到 86 公分。網子兩端會比匹克球高一點，休閒打沒關係。',
              '底線：網球發球線離網 6.40 公尺，匹克球底線 6.71 公尺，貼在發球線後面約 30 公分。',
              '邊線：以網球的中發球線為中心，左右各 3.05 公尺。',
              '中線用網球的中發球線，延長到新底線；廚房線離網 2.13 公尺，另外貼。',
              '整個網球場圍網範圍（約 18 × 36 公尺）可以排到 4 面匹克球場，要自備網子。',
            ] },
            { host: 'volleyball', name: '排球場', items: [
              '排球場 18 × 9 公尺，放得下一面匹克球場：以網子正下方為中心，兩邊邊線各往內 1.45 公尺。',
              '排球的線都對不上，四條邊、廚房線、中線全部要另外貼。攻擊線離網 3 公尺，不是廚房線。',
              '排球網太高，要自備匹克球網。',
            ] },
          ],
          note: '這是借場地的實用做法，不是規則；場館能不能貼膠帶，先問管理員。',
        },
      },
      {
        id: 'lines',
        title: '壓線判定',
        en: 'Line Calls',
        summary: '球碰到任何線都算界內。唯一例外：發球碰到廚房線算失誤。',
        detail: [
          '線寬 5 公分，球有碰到線的任何一點就算界內。',
          '發球時廚房和廚房線都是「不能落」的區域，發球碰到廚房線就是失誤；其他時候廚房線跟一般的線一樣算界內。',
          '發球落在斜對角發球區的中線、邊線或底線上都算界內，只有廚房線不行。',
          '自己那一邊的界內外由自己判，看不清楚就判對方界內。',
        ],
        singlesScenes: [
          { caption: '正常回合中，球碰到廚房線算界內。', highlight: ['kitchenLine:near'], ball: { path: ['far:left:mid', 'near:right:onKitchenLine'], bounces: [1] } },
          { caption: '發球時碰到廚房線就是失誤，球必須落在廚房線之後。', highlight: ['kitchenLine:far', 'nvz:far'], players: [S(srv), R()], ball: { path: ['near:right:behind', 'far:right:onKitchenLine'], bounces: [1] } },
          { caption: '發球落在中線上算界內，邊線、底線也一樣。', highlight: ['serviceBox:far:right', 'centerline:far'], players: [S(srv), R()], ball: { path: ['near:right:behind', 'far:center:mid'], bounces: [1] } },
        ],
        scenes: [
          { caption: '正常回合中，球碰到廚房線算界內。', highlight: ['kitchenLine:near'], ball: { path: ['far:left:mid', 'near:right:onKitchenLine'], bounces: [1] } },
          { caption: '發球時碰到廚房線就是失誤，球必須落在廚房線之後。', highlight: ['kitchenLine:far', 'nvz:far'], players: [A1({ depth: 'behind', serving: true })], ball: { path: ['near:right:behind', 'far:right:onKitchenLine'], bounces: [1] } },
          { caption: '發球落在中線上算界內，邊線、底線也一樣。', highlight: ['serviceBox:far:right', 'centerline:far'], players: [A1({ depth: 'behind', serving: true })], ball: { path: ['near:right:behind', 'far:center:mid'], bounces: [1] } },
        ],
      },
    ],
  },
  {
    id: 'sideout',
    title: '側出計分',
    en: 'Side-out Scoring',
    subtitle: 'USA Pickleball 正式比賽',
    note: '先在上面選好單打／雙打，再照順序看：怎麼得分、怎麼喊分、誰發球站哪裡。',
    scoring: 'sideout',
    intro: '正式比賽和大多數球場用的計分。只有發球方能得分。',
    items: [
      {
        id: 'points',
        step: 'points',
        title: '怎麼得分',
        en: 'Scoring',
        summary: '只有發球方能得分。打到 11 分、要贏 2 分。發球方輸球不扣分，換搭檔發；兩個人都輸了才換對方發（side-out）。',
        detail: [
          '發球方贏這一球得 1 分，同一個人繼續發。',
          '發球方輸了不扣分：第一發球員輸了換第二發球員發，第二發球員也輸了就換對方發球，叫 side-out。',
          '開局例外：第一局第一個發球的隊伍只有一個人可以發，輸了就直接換對方。',
          '接球方贏球不得分，只是離拿回發球權近一步。',
          '正式比賽通常打三局兩勝，每局 11 分；也有 15 分或 21 分的賽制。',
        ],
        scenes: [
          { caption: '甲隊發球、贏了這一球：得 1 分，同一個人繼續發。', players: [A1({ pos: 'left', depth: 'behind', serving: true }), A2({ pos: 'right' }), B1(), B2()] },
          { caption: '甲1 輸了這一球：不扣分，換搭檔甲2 發。', players: [A1({ pos: 'left' }), A2({ pos: 'right', depth: 'behind', serving: true }), B1(), B2()] },
          { caption: '甲2 也輸了：side-out，換乙隊發球。乙隊這時候贏球才開始得分。', players: [A1({ pos: 'left' }), A2({ pos: 'right' }), B1({ depth: 'behind', serving: true }), B2()] },
        ],
        singlesSummary: '只有發球方能得分。打到 11 分、要贏 2 分。發球方輸球不扣分，直接換對方發（side-out）。',
        singlesDetail: [
          '發球方贏這一球得 1 分，繼續發。',
          '發球方輸了不扣分，直接換對方發。單打沒有第二發球員。',
          '每次發球只有一次機會，沒有網球那種第二發。發球失誤就算輸這一球。',
          '正式比賽通常打三局兩勝，每局 11 分；也有 15 分或 21 分的賽制。',
        ],
        singlesScenes: [
          { caption: '甲發球、贏了這一球：得 1 分，繼續發。', players: [S({ pos: 'left', ...srv }), R({ pos: 'left' })] },
          { caption: '甲輸了這一球：不扣分，直接換乙發（side-out）。', players: [S(), R(srv)] },
        ],
      },
      {
        id: 'calling',
        step: 'calling',
        title: '怎麼喊分',
        en: 'Calling the Score',
        summary: '雙打喊三個數字：「發球方分數、接球方分數、第幾發球員」。發球前喊。',
        detail: [
          '第一個數字是發球方，第二個是接球方，第三個是 1 或 2：這一輪的第一還是第二發球員。',
          '開局喊「0-0-2」：第一局第一個發球的隊伍只有一個人可以發，所以直接從第二發球員算起。',
          '例：「5-3-1」＝發球方 5 分、接球方 3 分、第一發球員在發。',
        ],
        scenes: [
          { caption: '開局甲隊發球，喊「0-0-2」。', players: four({ A1: { depth: 'behind', serving: true } }) },
          { caption: '甲隊贏了這一球，變 1 分，喊「1-0-2」。', players: [A1({ pos: 'left', depth: 'behind', serving: true }), A2({ pos: 'right' }), B1(), B2()] },
          { caption: '甲隊輸了這一球。因為是第二發球員，換乙隊發，乙隊先喊自己的分數：「0-1-1」。', players: [A1({ pos: 'left' }), A2({ pos: 'right' }), B1({ depth: 'behind', serving: true }), B2()] },
        ],
        singlesSummary: '單打喊兩個數字：「發球方分數、接球方分數」。發球前喊。',
        singlesDetail: [
          '先喊發球方自己的分數，再喊對方的。單打沒有第幾發球員。',
          '例：「3-5」＝發球方 3 分、接球方 5 分。',
        ],
        singlesScenes: [
          { caption: '開局甲發球，喊「0-0」。', players: [S(srv), R()] },
          { caption: '甲贏這球變 1 分，喊「1-0」。', players: [S({ pos: 'left', ...srv }), R({ pos: 'left' })] },
          { caption: '換乙發球，乙先喊自己的分數：「0-1」。', players: [S(), R(srv)] },
        ],
      },
      {
        id: 'positions',
        step: 'positions',
        title: '誰發球、站哪裡',
        en: 'Serving & Positions',
        summary: '拿回發球權時，站在右邊的人先發。得分才換位，接球的隊伍不動。',
        detail: [
          '每次 side-out 的第一球都從右邊發，由當時站右邊的人發，這個人就是這一輪的第一發球員。沒有固定的第一發球員。',
          '發球方贏一球，發球員跟搭檔換邊，同一個人繼續發。發球方輸一球，換搭檔發，從他站的位置發。第二發球員也輸了就 side-out。',
          '接球的隊伍永遠不動。所以「誰站右邊」只跟分數有關：開局站右邊的人，你們偶數分時他在右邊，奇數分時他在左邊。',
          '口訣：拿回發球權，看分數確認站位，右邊的人開球。',
        ],
        scenes: [
          { caption: '開局：甲1 站右邊發球，喊「0-0-2」。', players: four({ A1: { depth: 'behind', serving: true } }) },
          { caption: '甲隊得 1 分：甲1 和甲2 換邊，甲1 從左邊繼續發，喊「1-0-2」。', players: [A1({ pos: 'left', depth: 'behind', serving: true }), A2({ pos: 'right' }), B1(), B2()] },
          { caption: '甲隊失分，side-out。乙隊 0 分，乙1 站右邊先發，喊「0-1-1」。甲隊維持原位不動。', players: [A1({ pos: 'left' }), A2({ pos: 'right' }), B1({ depth: 'behind', serving: true }), B2()] },
          { caption: '乙1 失分：換乙2 發，從他站的左邊發，喊「0-1-2」。', players: [A1({ pos: 'left' }), A2({ pos: 'right' }), B1(), B2({ depth: 'behind', serving: true })] },
          { caption: '乙2 也失分，side-out 回甲隊。甲隊 1 分（奇數），甲1 在左邊，所以站右邊的甲2 先發，喊「1-0-1」。', players: [A1({ pos: 'left' }), A2({ pos: 'right', depth: 'behind', serving: true }), B1(), B2()] },
          { caption: '甲2 得分變 2 分（偶數）：兩人換邊，甲1 回到右邊。開局站右的甲1，偶數分永遠在右邊。', players: [A1({ pos: 'right' }), A2({ pos: 'left', depth: 'behind', serving: true }), B1(), B2()] },
        ],
        singlesSummary: '看發球員自己的分數：偶數從右邊發、奇數從左邊發。接球的人站對角。',
        singlesDetail: [
          '發球員得分就換到另一邊繼續發。',
          '換對方發球時，對方照他自己的分數決定從哪一邊發。',
          '接球的人永遠站發球員的對角。',
        ],
        singlesScenes: [
          { caption: '開局甲 0 分（偶數），從右邊發，乙站對角接。', players: [S(srv), R()] },
          { caption: '甲得分變 1 分（奇數），換到左邊發，乙也換到對角。', players: [S({ pos: 'left', ...srv }), R({ pos: 'left' })] },
          { caption: '換乙發球。乙 0 分（偶數），從右邊發。', players: [S(), R(srv)] },
        ],
      },
    ],
  },
  {
    id: 'rally',
    title: '每球得分',
    en: 'Rally Scoring',
    subtitle: '2026 暫行規則',
    note: '先在上面選好單打／雙打，再照順序看：怎麼得分、怎麼喊分、誰發球站哪裡。',
    scoring: 'rally',
    intro: '每一球都有人得分，一局比較快結束，很多球場的社交球用這個。USA Pickleball 2025 年起把它列為暫行規則（provisional），2026 年繼續沿用。',
    items: [
      {
        id: 'rally-points',
        step: 'points',
        title: '怎麼得分',
        en: 'Scoring',
        summary: '每一球結束都有一隊得 1 分，誰贏這球誰發下一球。沒有第二發球員。',
        detail: [
          '打到 11、15 或 21 分，要贏 2 分。社交球最常用 15 或 21。',
          '發球方贏球：得 1 分，同一個人繼續發。',
          '接球方贏球：得 1 分並拿到發球權。',
          '2026 年起接球方也可以拿下最後一分，不用先拿回發球權。',
        ],
        scenes: [
          { caption: '甲隊發球、贏了這一球：得 1 分，甲1 繼續發。', players: [A1({ pos: 'left', depth: 'behind', serving: true }), A2({ pos: 'right' }), B1(), B2()] },
          { caption: '乙隊贏下一球：乙隊也得 1 分，並拿到發球權。1-1。', players: [A1({ pos: 'left' }), A2({ pos: 'right' }), B1({ pos: 'left' }), B2({ pos: 'right', depth: 'behind', serving: true })] },
        ],
        singlesSummary: '每一球結束都有人得 1 分，誰贏這球誰發下一球。',
        singlesDetail: [
          '打到 11、15 或 21 分，要贏 2 分。打到幾分開打前講好。',
          '發球方贏球：得 1 分，繼續發。',
          '接球方贏球：得 1 分並拿到發球權。',
          '2026 年起接球方也可以拿下最後一分，不用先拿回發球權。',
        ],
        singlesScenes: [
          { caption: '甲發球、贏了這一球：得 1 分，繼續發。', players: [A1({ label: '甲', pos: 'left', depth: 'behind', serving: true }), B1({ label: '乙', pos: 'left' })] },
          { caption: '乙贏下一球：乙也得 1 分，並拿到發球權。1-1。', players: [A1({ label: '甲', pos: 'left' }), B1({ label: '乙', pos: 'left', depth: 'behind', serving: true })] },
        ],
      },
      {
        id: 'rally-calling',
        step: 'calling',
        title: '怎麼喊分',
        en: 'Calling the Score',
        summary: '只喊兩個數字：「發球方分數、接球方分數」。雙打也不喊第幾發球員。',
        detail: [
          '開局喊「0-0」。',
          '例：「7-5」＝發球方 7 分、接球方 5 分。',
          '跟側出計分最大的差別：雙打沒有第三個數字，因為沒有第二發球員。',
        ],
        scenes: [
          { caption: '開局甲1 發球，喊「0-0」。', players: four({ A1: { depth: 'behind', serving: true } }) },
          { caption: '乙隊贏球拿到發球權，乙2 發球，乙隊先喊自己的分數：「1-0」。', players: [A1(), A2(), B1({ pos: 'left' }), B2({ pos: 'right', depth: 'behind', serving: true })] },
        ],
        singlesSummary: '只喊兩個數字：「發球方分數、接球方分數」。',
        singlesDetail: [
          '開局喊「0-0」。',
          '例：「7-5」＝發球方 7 分、接球方 5 分。',
        ],
        singlesScenes: [
          { caption: '開局甲發球，喊「0-0」。', players: [A1({ label: '甲', depth: 'behind', serving: true }), B1({ label: '乙' })] },
          { caption: '乙贏球拿到發球權。1 分是奇數，乙從左邊發，先喊自己的分數：「1-0」。', players: [A1({ label: '甲', pos: 'left' }), B1({ label: '乙', pos: 'left', depth: 'behind', serving: true })] },
        ],
      },
      {
        id: 'rally-positions',
        step: 'positions',
        title: '誰發球、站哪裡',
        en: 'Serving & Positions',
        summary: '兩隊都照自己的分數站：開局站右邊的人，偶數分在右、奇數分在左。換發時由站右邊的人發。',
        detail: [
          '發球方贏球：發球員跟搭檔換邊，同一個人繼續發。',
          '接球方贏球：得 1 分並拿到發球權。兩人先照新分數站好，再由站右邊的人發球。換發之後的第一球一定從右邊發。',
          '輸球的那隊不動。',
          '口訣：站位看分數，誰發看換發。',
          '常見誤會：拿到發球權時不換位、直接由站左邊的人發。USA Pickleball 的寫法是先換位，換發後的第一球一律從右邊發。各球場做法不同的話，開打前講好。',
        ],
        scenes: [
          { caption: '甲隊 0 分，甲1 從右邊發，喊「0-0」。', players: four({ A1: { depth: 'behind', serving: true } }) },
          { caption: '甲隊贏球：1-0，甲1 和甲2 換邊，甲1 繼續發。', players: [A1({ pos: 'left', depth: 'behind', serving: true }), A2({ pos: 'right' }), B1(), B2()] },
          { caption: '乙隊贏球：得 1 分並拿到發球權。1 分是奇數，乙1 和乙2 先換邊，再由站右邊的乙2 發，喊「1-1」。', players: [A1({ pos: 'left' }), A2({ pos: 'right' }), B1({ pos: 'left' }), B2({ pos: 'right', depth: 'behind', serving: true })] },
          { caption: '甲隊再贏：2 分是偶數，甲1 回到右邊，由他發，喊「2-1」。乙隊輸球不動。', players: [A1({ depth: 'behind', serving: true }), A2(), B1({ pos: 'left' }), B2({ pos: 'right' })] },
        ],
        singlesSummary: '發球員看自己的分數站：偶數從右邊發、奇數從左邊發。接球的人站對角。',
        singlesDetail: [
          '站位跟側出計分的單打一樣，看發球員自己的分數：偶數右邊、奇數左邊。',
          '發球方贏球：換到另一邊繼續發。',
          '接球方贏球：拿到發球權，照自己的新分數決定從哪一邊發。',
        ],
        singlesScenes: [
          { caption: '開局 0-0：甲從右邊發，乙站對角接。', players: [A1({ label: '甲', depth: 'behind', serving: true }), B1({ label: '乙' })], ball: { path: ['near:right:behind', 'far:right:mid'], bounces: [1] } },
          { caption: '甲贏球：1-0，甲換到左邊繼續發，乙也換到對角接。', players: [A1({ label: '甲', pos: 'left', depth: 'behind', serving: true }), B1({ label: '乙', pos: 'left' })], ball: { path: ['near:left:behind', 'far:left:mid'], bounces: [1] } },
          { caption: '乙贏球：乙得 1 分並拿到發球權。1 分是奇數，乙從左邊發，喊「1-1」。', players: [A1({ label: '甲', pos: 'left' }), B1({ label: '乙', pos: 'left', depth: 'behind', serving: true })], ball: { path: ['far:left:behind', 'near:left:mid'], bounces: [1] } },
        ],
      },
      {
        id: 'rally-pro',
        title: '職業賽與凍結',
        en: 'Pro Play (MLP)',
        summary: '職業聯盟 MLP 2023 到 2025 年用每球得分加「凍結」：快贏的那隊只有自己發球時才能得分。2026 年雙打改回側出計分。',
        collapsed: true,
        detail: [
          '凍結是什麼：分數到某個關卡之後，這一隊只有在自己發球時贏球才得分。對方發球時就算你贏了那一球，也只是拿回發球權、不加分，跟側出計分一樣。',
          'MLP 雙打打到 21 分：先到 20 分的隊伍凍結；另一隊追到 18 分時也凍結。',
          '例子：甲 20、乙 15，甲已經凍結。乙發球、甲贏了這一球：甲不加分，只換甲發球。甲發球再贏一球：21 分，比賽結束。',
          '為什麼要凍結：不讓接球的一方靠一球就結束比賽，最後幾分會更有拉鋸。這是 MLP 的規則，USA Pickleball 的每球得分沒有凍結。',
          '2026 年 MLP 雙打改回側出計分 11 分制，每球得分只留在單打決勝的 DreamBreaker（打到 21 分，贏 2 分，沒有凍結）。',
          '所以現在會看到的「每球得分」，就是上面 USA Pickleball 的暫行版本，沒有凍結規則。',
        ],
        scenes: [],
      },
    ],
  },
  {
    id: 'play',
    title: '共通規則',
    en: 'Core Rules',
    intro: '單打雙打、哪一種計分都一樣的規則。',
    items: [
      {
        id: 'serve',
        title: '發球',
        en: 'Serve',
        summary: '站在底線後，低手把球對角發到對面的發球區，要越過廚房和廚房線。只有一次機會。',
        detail: [
          '揮拍發球（volley serve）：手臂由下往上揮，觸球點低於腰（肚臍），觸球時拍頭要低於手腕。2026 年起這三點都要「明顯」合法，模糊的就判失誤。',
          '落地發球（drop serve）：把球從手上自然放掉，落地反彈後再打，怎麼揮都可以，但放球時不能用手指加旋轉。新手用這種最保險。',
          '發球時至少一腳在底線後方的地面上，腳不能碰到底線或場內，也不能超出邊線和中線的延伸線。',
          '發球碰網後落在正確的發球區照打，2021 年起沒有 let 重發。',
          '發球前要先喊分數，喊完 10 秒內要發出去。',
        ],
        singlesScenes: [
          { caption: '發球的人站在底線後面，至少一腳踩在地上。', highlight: ['baseline:near'], players: [S(srv), R()] },
          { caption: '對角發到對面的發球區，球要飛過廚房和廚房線。', highlight: ['serviceBox:far:right'], players: [S(srv), R()], ball: { path: ['near:right:behind', 'far:right:mid'], bounces: [1] } },
          { caption: '發太短落在廚房或廚房線上，失誤。', highlight: ['nvz:far'], players: [S(srv), R()], ball: { path: ['near:right:behind', 'far:right:kitchen'], bounces: [1] } },
        ],
        scenes: [
          { caption: '發球的人站在底線後面，至少一腳踩在地上。', highlight: ['baseline:near'], players: [A1({ depth: 'behind', serving: true }), A2(), B1(), B2()] },
          { caption: '對角發到對面的發球區，球要飛過廚房和廚房線。', highlight: ['serviceBox:far:right'], players: [A1({ depth: 'behind', serving: true }), A2(), B1(), B2()], ball: { path: ['near:right:behind', 'far:right:mid'], bounces: [1] } },
          { caption: '發太短落在廚房或廚房線上，失誤。', highlight: ['nvz:far'], players: [A1({ depth: 'behind', serving: true }), A2(), B1(), B2()], ball: { path: ['near:right:behind', 'far:right:kitchen'], bounces: [1] } },
        ],
      },
      {
        id: 'two-bounce',
        title: '雙彈跳',
        en: 'Two-Bounce Rule',
        summary: '發球要落地一次，回球也要落地一次，之後才可以在空中截擊。',
        detail: [
          '接發球的人一定要等球落地才能打，發球方接第三拍也一定要等球落地。',
          '所以發球方發完球不要急著衝上網，先站在底線等第三拍。',
          '兩次落地之後，誰都可以截擊，但廚房規則還是要守。',
          '回球沒有規定要落在哪裡，只要落在對面界內就好，深球、短球、落在廚房都可以。只有發球要落在斜對角的發球區，而且不能落在廚房或廚房線上。',
          '球碰到線算界內。唯一例外是發球碰到廚房線，算發球失誤。',
        ],
        singlesScenes: [
          { caption: '第一拍：發球。球要在對面彈一次（圈起來的地方），乙才能打。', players: [S(srv), R()], ball: { path: TWO_BOUNCE, bounces: [1, 2], step: 1 } },
          { caption: '第二拍：回球。球也要在甲這邊彈一次，所以甲發完球先留在底線等。乙回完球往前走。', players: [S(), R({ depth: 'mid' })], ball: { path: TWO_BOUNCE, bounces: [1, 2], step: 2 } },
          { caption: '第三拍：甲等球彈過再打。兩次彈跳到這裡都完成了，乙已經站到廚房線。', players: [S(), R({ depth: 'kitchenLine' })], ball: { path: TWO_BOUNCE, bounces: [1, 2], step: 3 } },
          { caption: '第四拍起可以截擊：乙不等落地，在空中直接把第三拍打回去。沒有圈的地方就是球沒落地。', players: [S(), R({ depth: 'kitchenLine' })], ball: { path: TWO_BOUNCE, bounces: [1, 2], step: 4 } },
        ],
        scenes: [
          { caption: '第一拍：發球。球要在對面彈一次（圈起來的地方），乙隊才能打。', players: [A1(srv), A2(), B1(), B2()], ball: { path: TWO_BOUNCE, bounces: [1, 2], step: 1 } },
          { caption: '第二拍：回球。球也要在甲隊這邊彈一次，所以甲隊發完球先留在底線等。乙隊回完球往前走。', players: [A1(), A2(), B1({ depth: 'mid' }), B2({ depth: 'mid' })], ball: { path: TWO_BOUNCE, bounces: [1, 2], step: 2 } },
          { caption: '第三拍：甲隊等球彈過再打。兩次彈跳到這裡都完成了，乙隊已經站到廚房線。', players: [A1(), A2(), B1({ depth: 'kitchenLine' }), B2({ depth: 'kitchenLine' })], ball: { path: TWO_BOUNCE, bounces: [1, 2], step: 3 } },
          { caption: '第四拍起可以截擊：乙1 不等落地，在空中直接把第三拍打回去。沒有圈的地方就是球沒落地。', players: [A1(), A2(), B1({ depth: 'kitchenLine' }), B2({ depth: 'kitchenLine' })], ball: { path: TWO_BOUNCE, bounces: [1, 2], step: 4 } },
        ],
      },
      {
        id: 'kitchen',
        title: '廚房（非截擊區）',
        en: 'Kitchen',
        summary: '人碰到廚房或廚房線的時候，不能把球在空中直接打回去。球落地之後隨便你站哪裡。',
        detail: [
          '截擊的整個動作都不能碰到廚房：起跳前、揮拍中、揮完之後因為衝力踩進去，都算犯規，就算球已經死了也一樣。',
          '你身上的東西掉進廚房也算：帽子、拍子、眼鏡。搭檔拉住你不讓你跌進去也算犯規。',
          '球落地之後可以進廚房打，打完再退出去。但只要人還在廚房裡或踩著線，就不能截擊下一球；要兩腳都回到廚房線外才可以。',
        ],
        singlesDetail: [
          '截擊的整個動作都不能碰到廚房：起跳前、揮拍中、揮完之後因為衝力踩進去，都算犯規，就算球已經死了也一樣。',
          '你身上的東西掉進廚房也算：帽子、拍子、眼鏡。',
          '球落地之後可以進廚房打，打完再退出去。但只要人還在廚房裡或踩著線，就不能截擊下一球；要兩腳都回到廚房線外才可以。',
        ],
        singlesScenes: [
          { caption: '兩個人都站在廚房線後面打 dink。', highlight: ['nvz'], players: [S({ depth: 'kitchenLine' }), R({ pos: 'left', depth: 'kitchenLine' })] },
          { caption: '人在廚房裡把球在空中打回去：犯規。', highlight: ['nvz:near'], players: [S({ depth: 'kitchen' }), R({ pos: 'left', depth: 'kitchenLine' })], ball: { path: ['far:left:kitchenLine', 'near:right:kitchen'] } },
          { caption: '球先落在廚房裡，再進去打：合法。', highlight: ['nvz:near'], players: [S({ depth: 'kitchen' }), R({ pos: 'left', depth: 'kitchenLine' })], ball: { path: ['far:left:kitchenLine', 'near:right:kitchen', 'far:left:kitchen'], bounces: [1], step: 2 } },
        ],
        scenes: [
          { caption: '四個人都站在廚房線後面打 dink，這是最常見的畫面。', highlight: ['nvz'], players: [A1({ depth: 'kitchenLine' }), A2({ depth: 'kitchenLine' }), B1({ depth: 'kitchenLine' }), B2({ depth: 'kitchenLine' })] },
          { caption: '人在廚房裡把球在空中打回去：犯規。', highlight: ['nvz:near'], players: [A1({ depth: 'kitchen' }), A2({ depth: 'kitchenLine' }), B1({ depth: 'kitchenLine' }), B2({ depth: 'kitchenLine' })], ball: { path: ['far:left:kitchenLine', 'near:right:kitchen'] } },
          { caption: '球先落在廚房裡，再進去打：合法。', highlight: ['nvz:near'], players: [A1({ depth: 'kitchen' }), A2({ depth: 'kitchenLine' }), B1({ depth: 'kitchenLine' }), B2({ depth: 'kitchenLine' })], ball: { path: ['far:left:kitchenLine', 'near:right:kitchen', 'far:right:kitchen'], bounces: [1], step: 2 } },
        ],
      },
      {
        id: 'faults',
        title: '常見犯規',
        en: 'Faults',
        summary: '球出界、掛網、廚房截擊、雙彈跳違規，還有球打到身上，都是這一球結束。',
        detail: [
          '出界：球落在線外。碰到線算界內。',
          '掛網：球沒過網，或是從網子下面過去。',
          '球碰到身體：除了持拍的手腕以下，球碰到你身上任何地方都算失誤，衣服也算。',
          '碰網：人、拍子或衣服在球還活著的時候碰到網子或網柱。',
          '雙擊：同一個人連續打到球兩下，除非是一個連續的揮拍動作。',
          '發球員錯、站位錯：正式比賽裁判會叫停糾正；自己打的話，發現了就重打那一球。',
        ],
        singlesDetail: [
          '出界：球落在線外。碰到線算界內。',
          '掛網：球沒過網，或是從網子下面過去。',
          '球碰到身體：除了持拍的手腕以下，球碰到你身上任何地方都算失誤，衣服也算。',
          '碰網：人、拍子或衣服在球還活著的時候碰到網子或網柱。',
          '雙擊：同一個人連續打到球兩下，除非是一個連續的揮拍動作。',
          '站位錯（從錯的那一邊發球）：正式比賽裁判會叫停糾正；自己打的話，發現了就重打那一球。',
        ],
        singlesScenes: [
          { caption: '球落在底線外，出界。', highlight: ['baseline:far'], players: [S(), R({ pos: 'left' })], ball: { path: ['near:right:mid', 'far:left:behind'], bounces: [1] } },
        ],
        scenes: [
          { caption: '球落在底線外，出界。', highlight: ['baseline:far'], players: four(), ball: { path: ['near:left:mid', 'far:left:behind'], bounces: [1] } },
        ],
      },
      {
        // 繞柱球與網子：USA Pickleball 11.K（網柱）、11.L（網子、11.L.3 繞柱球）。
        id: 'net',
        title: '擦網與繞柱球',
        en: 'Net & Around the Post',
        summary: '回球不一定要從網子上面過。從網柱外側繞過去、落在對面界內也算好球，叫繞柱球（ATP）。',
        detail: [
          '球擦網後掉進對面界內，照打。發球擦網也照打，沒有重發。',
          '繞柱球可以比網子還低，只要落在對面界內就好。常見在對手把球斜斜打到很外面的時候。',
          '球打到網柱，或從網子和網柱中間穿過去，算打的那一方失誤。',
          '打繞柱球可以跑出場外、甚至跑到隔壁場，但人和球拍都不能碰到網柱或網子，也不能踩進對方的場地。',
        ],
        scenes: [
          { caption: '乙斜斜 dink 到很外面，球在甲這邊的廚房彈一下，往場外飛。', players: [A1({ pos: 'right', depth: 'mid' }), B1({ depth: 'kitchenLine' })], ball: { path: ['far:right:kitchenLine', 'near:right:kitchen', [270, 318]], bounces: [1] } },
          { caption: '甲追到場外，從網柱外側把球打回去。球比網子還低，但沒碰到網柱、落在對面界內，算好球。', highlight: ['net'], players: [A1({ at: [266, 326], field: true }), B1({ depth: 'kitchenLine' })], ball: { path: [[266, 318], [268, 252], [170, 120]], bounces: [2] } },
        ],
      },
      {
        id: 'ends',
        title: '換場',
        en: 'Changing Ends',
        summary: '每局打完換場。決勝局打到一方 6 分時換場（11 分制）。',
        detail: [
          '三局兩勝的第三局，第一個到 6 分的時候雙方換邊，發球權不變，繼續由原本的人發。15 分制在 8 分換，21 分制在 11 分換。',
          '換場有 1 分鐘，局與局之間有 2 分鐘。',
        ],
        singlesScenes: [
          { caption: '決勝局 6-3 時換邊，發球的人不變。', players: [S(srv), R()] },
        ],
        scenes: [
          { caption: '決勝局 6-3 時換邊，發球員不變。', players: four({ A1: { depth: 'behind', serving: true } }) },
        ],
      },
    ],
  },
  {
    // 裝備。規格依 2026 USA Pickleball Official Rulebook 3.D（尺寸 3.D.2、重量 3.D.3、
    // 材質 3.D.4、表面 3.D.5、可改的地方 3.D.6–7）、18.A（比賽用核准拍）和 Equipment
    // Standards Manual 2.E–2.F；旋轉測試：usapickleball.org 2026-07-08 公告（2026-10-01 起，
    // 新送審 ≤ 2,100 rpm）。選拍建議：pickleballcentral.com/paddle-guide（重量、拍型、握把、
    // 網球／回力球）、paddletek.com（拍芯、桌球）、heliospickleball.com（羽球，品牌部落格）、
    // thedinkpickleball.com（網球轉換常見錯誤）、pickleheads.com（預算、網球肘）。
    id: 'gear',
    title: '裝備',
    en: 'Equipment',
    intro: '球拍的官方規格，和怎麼挑一支適合自己的。',
    items: [
      {
        id: 'paddle-rules',
        title: '球拍規定',
        en: 'Paddle Rules',
        summary: '長加寬不超過 61 公分、長度不超過 43 公分，厚度和重量不限。正式比賽要用官方核准名單上的球拍。',
        figure: {
          kind: 'paddleRules',
          alt: '球拍尺寸上限和可以貼膠帶的位置',
          length: '長 ≤ 43.18 公分',
          sum: '長＋寬 ≤ 60.96 公分',
          keys: ['拍緣 1.27 公分內：可以貼護邊和膠帶。', '拍面中間：不能貼東西。', '握把上方 2.5 公分內：可以貼膠帶、鉛片、貼紙。'],
          caption: '黃色是膠帶、貼紙可以貼的範圍。',
        },
        blocks: [
          { items: [
            '尺寸：長＋寬（含護邊和尾蓋）不超過 60.96 公分（24 吋），長度不超過 43.18 公分（17 吋）。厚度、重量都不限。',
            '材質要硬、不能壓縮，不能有彈簧或彈床效果。',
            '表面不能有洞、裂痕、脫層，不能貼砂紙、橡膠、防滑漆，或任何會加旋轉的塗層；也不能是會反光、干擾對手視線的亮面。',
            '自己可以改的只有：貼護邊膠帶、加鉛片、原廠配重、換原廠握把或拍面、纏握把布或加厚握把、貼名字或簽名。膠帶和貼紙只能貼在握把上方 2.5 公分內，或離拍緣 1.27 公分內。',
          ] },
          { name: '正式比賽', items: [
            '球拍要印品牌、型號和「USA Pickleball Approved」，而且在官方核准名單上。',
            '賽前發現不合格：換一支就好。比賽中才發現：整場判輸。賽後才發現：比分照算。',
            '2026 年 10 月起，新送審的球拍要通過旋轉測試，每分鐘 2,100 轉以內。',
          ] },
          { name: '平常打球', items: [
            '沒有人會檢查，但官方規格本來就適用所有比賽。買拍子挑有核准標誌的最保險，以後參加比賽也能用。',
          ] },
        ],
      },
      {
        id: 'paddle-choose',
        title: '怎麼選球拍',
        en: 'Choosing a Paddle',
        summary: '不知道選什麼，就選中等重量、標準寬面、16 mm 拍芯：甜區大、最好上手。打過別的拍類運動，可以照下面的建議挑。',
        figure: {
          kind: 'paddleShapes',
          alt: '三種拍型照比例畫：標準寬面、混合型、長型，圓圈是甜區',
          names: { standard: '標準寬面', hybrid: '混合型', elongated: '長型' },
          sizes: { standard: '40.6 × 20.3 cm', hybrid: '41.3 × 19.7 cm', elongated: '41.9 × 19.1 cm' },
          caption: '照比例畫，圓圈是甜區：拍面越長，伸得越遠，但甜區越小、離手越遠。',
        },
        picker: {
          prompt: '你以前打什麼？',
          labels: { shape: '拍型', weight: '重量', grip: '握把', face: '拍芯和拍面', why: '為什麼', watch: '轉過來要注意' },
          options: [
            { id: 'none', shapes: ['standard'], label: '沒打過拍類', shape: '標準寬面拍', weight: '中等，約 213–232 克', grip: '照身高挑（見下面）', face: '16 mm 厚拍芯', why: '寬面拍甜區最大、最寬容，厚拍芯控球穩，打偏也不容易失控。', watch: [] },
            { id: 'tennis', shapes: ['elongated', 'hybrid'], label: '網球（或回力球）', shape: '長型或混合型', weight: '中等到偏重', grip: '長握把，雙手反拍要 13.5 公分以上', face: '依喜好；想要力量選 13 mm', why: '網球、回力球出身的人多半喜歡長握把、長拍面：伸得遠、揮起來有力量。', watch: ['揮拍要小，像推不像揮；大拉拍很容易出界。', '網前截擊拍面放正，不要往前踩、不要由上往下切。'] },
            { id: 'badminton', shapes: ['standard', 'hybrid'], label: '羽球', shape: '標準或混合型', weight: '偏輕', grip: '小一點', face: '碳纖維面，偏控球', why: '網前反應和落點是你的強項，輕拍和碳纖維面最能發揮。', watch: ['匹克球拍比羽球拍重兩三倍（羽球拍約 70–100 克），不要用手腕甩，揮拍要短而紮實。'] },
            { id: 'tabletennis', shapes: ['standard'], label: '桌球', shape: '標準型，避開長型', weight: '中等偏輕（約 210–232 克，挑輕的那端）', grip: '照身高挑', face: '中到厚拍芯，碳纖維面', why: '桌球手的手感和旋轉控制很好，重心在中間的標準拍最順手。', watch: ['手腕放直放鬆，不要甩。', '改用大陸式或東方式握法，不要沿用桌球握法。', '場地比桌子大很多，腳要多動。'] },
          ],
          note: '這是一般建議，不是規則；能試打就先試打。',
        },
        blocks: [
          { name: '重量', items: [
            '輕拍約 215–221 克以下：手快、好揮，但力量和穩定度差一點。',
            '中等約 224–232 克：最多人用。',
            '重拍約 235 克以上：力量大、穩，但比較慢，手臂也比較累。',
            '太輕或太重都可能傷手臂。有網球肘的人常被建議選中等重量、16 mm 以上的厚拍芯（這不是醫療建議）。',
          ] },
          { name: '拍型', items: [
            '標準寬面（約 40.6 × 20.3 公分）：甜區最大、手最快，伸展範圍最短。',
            '混合型：介於兩者之間。',
            '長型（約 41.9 × 19.1 公分）：伸得最遠、力量和旋轉多，但甜區較小、較高。',
          ] },
          { name: '拍芯和拍面', items: [
            '拍芯薄（約 13 mm）力量大，厚（約 16 mm）控球好、手感軟、比較舒服。',
            '玻璃纖維面彈、有力量；碳纖維面偏控球和旋轉。',
          ] },
          { name: '握把', items: [
            '照身高：157 公分以下約 10.2 公分（4 吋），160–173 公分約 10.8 公分（4¼ 吋），175 公分以上約 11.4 公分（4½ 吋）。',
            '不確定就選小一點，太小可以纏握把布加厚。',
            '握把加長，拍面就變短：總長度上限 43 公分是固定的。',
          ] },
          { name: '預算', items: [
            '剛開始約 50–100 美元的拍子就夠用，確定會一直打再考慮更貴的。',
            '沒有分男女、也沒有分室內室外的拍子。',
          ] },
        ],
      },
    ],
  },
];

export const COMPARE = {
  title: '側出計分 vs 每球得分',
  en: 'Side-out vs Rally',
  rows: [
    ['誰能得分', '只有發球方', '每一球都有人得分'],
    ['喊分', '雙打三個數字（加上第幾發球員），單打兩個數字', '兩個數字：發球方、接球方'],
    ['一局幾分', '11 分，贏 2 分', '15 或 21 分，贏 2 分'],
    ['第二發球員', '雙打有，兩個人輪流發；單打沒有', '沒有，輸球就換對方發'],
    ['換位', '發球方得分才換', '得分的那隊照新分數站位，換發後由右邊的人發'],
    ['最後一分', '要在自己發球時拿到', '接球方也可以直接拿下'],
    ['一局多久', '約 15 到 25 分鐘', '約 10 到 15 分鐘'],
  ],
};
