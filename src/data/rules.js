// 規則內容與球場示意圖場景。正統規則以 USA Pickleball Official Rulebook 2026 為準，
// 括號內是規則書章節。場景的位置名稱由 src/court.js 定義。
// 甲隊（A）在球場下半（near），乙隊（B）在上半（far）。
// en：英文術語，顯示在標題後的括號裡，用詞以 glossary.js 為準。
// singlesScenes／singlesSummary／singlesDetail：單打雙打都適用的規則，切到單打時
// 改用這些單打版的圖和文字（沒寫就沿用一般版本）。

export const RULEBOOK = 'USA Pickleball Official Rulebook 2026';

const A1 = (extra = {}) => ({ team: 'A', side: 'near', pos: 'right', label: '甲1', ...extra });
const A2 = (extra = {}) => ({ team: 'A', side: 'near', pos: 'left', label: '甲2', ...extra });
const B1 = (extra = {}) => ({ team: 'B', side: 'far', pos: 'right', label: '乙1', ...extra });
const B2 = (extra = {}) => ({ team: 'B', side: 'far', pos: 'left', label: '乙2', ...extra });

// 單打：甲在下半場、乙在上半場
const S = (extra = {}) => A1({ label: '甲', ...extra });
const R = (extra = {}) => B1({ label: '乙', ...extra });
const srv = { depth: 'behind', serving: true };

// 雙打四人都站底線的預設站位
const four = (serving = {}) => [A1(serving.A1), A2(serving.A2), B1(serving.B1), B2(serving.B2)];

// 章節：scoring 標出只適用哪一種計分（沒寫就是都適用）；規則的 play 標出
// 只適用雙打或單打（沒寫就是都適用）。規則頁上方的切換鈕靠這兩個欄位篩選。
export const SECTIONS = [
  {
    id: 'court',
    title: '球場與基本',
    en: 'Court Basics',
    intro: '先認識場地。後面每一條規則的圖，都是這一張球場。',
    items: [
      {
        id: 'dimensions',
        title: '球場長什麼樣',
        en: 'Court Dimensions',
        summary: '球場 13.41 × 6.10 公尺，跟羽球雙打場一樣大。網子兩邊各有一塊 2.13 公尺深的「廚房」。',
        detail: [
          '正式名稱是非截擊區（Non-Volley Zone），大家都叫廚房（Kitchen）。它是匹克球最重要的一塊地：人在裡面不能把球在空中直接打回去。',
          '網高：兩端 91 公分，中間 86 公分。',
          '場地劃線：底線、邊線、廚房線，以及從廚房線到底線的中線，把每邊分成左右兩個發球區。',
        ],
        scenes: [
          { caption: '整個球場 13.41 × 6.10 公尺，中間是網子。', labels: true },
          { caption: '網子兩邊各 2.13 公尺深的廚房，正式名稱是非截擊區。', labels: true, highlight: ['nvz'] },
          { caption: '廚房線到底線之間，被中線分成左右兩個發球區。', highlight: ['serviceBox:near:right', 'serviceBox:near:left', 'serviceBox:far:right', 'serviceBox:far:left'] },
        ],
      },
      {
        id: 'lines',
        title: '線算界內還是界外',
        en: 'Line Calls',
        summary: '球碰到任何線都算界內。唯一例外：發球碰到廚房線算失誤。',
        detail: [
          '線寬 5 公分，球有碰到線的任何一點就算界內（第 6 節）。',
          '發球時廚房和廚房線都是「不能落」的區域，發球碰到廚房線就是失誤；其他時候廚房線跟一般的線一樣算界內。',
          '自己那一邊的界內外由自己判，看不清楚就判對方界內。',
        ],
        singlesScenes: [
          { caption: '正常回合中，球碰到廚房線算界內。', highlight: ['kitchenLine:near'], ball: { path: ['far:left:mid', 'near:right:kitchenLine'], bounces: [1] } },
          { caption: '發球時碰到廚房線就是失誤，球必須落在廚房線之後。', highlight: ['kitchenLine:far', 'nvz:far'], players: [S(srv), R()], ball: { path: ['near:right:behind', 'far:right:kitchenLine'], bounces: [1] } },
        ],
        scenes: [
          { caption: '正常回合中，球碰到廚房線算界內。', highlight: ['kitchenLine:near'], ball: { path: ['far:left:mid', 'near:right:kitchenLine'], bounces: [1] } },
          { caption: '發球時碰到廚房線就是失誤，球必須落在廚房線之後。', highlight: ['kitchenLine:far', 'nvz:far'], players: [A1({ depth: 'behind', serving: true })], ball: { path: ['near:right:behind', 'far:right:kitchenLine'], bounces: [1] } },
        ],
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
        rule: '第 4 節',
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
        rule: '第 7 節',
        summary: '發球要落地一次，回球也要落地一次，之後才可以在空中截擊。',
        detail: [
          '接發球的人一定要等球落地才能打，發球方接第三拍也一定要等球落地。',
          '所以發球方發完球不要急著衝上網，先站在底線等第三拍。',
          '兩次落地之後，誰都可以截擊，但廚房規則還是要守。',
        ],
        singlesScenes: [
          { caption: '第一拍：發球，球在對面落地一次。', players: [S(srv), R()], ball: { path: ['near:right:behind', 'far:right:mid', 'near:right:mid', 'far:left:kitchenLine'], bounces: [1, 2], step: 1 } },
          { caption: '第二拍：乙等球落地再回，球回到甲這邊也要落地一次。', players: [S({ depth: 'behind' }), R()], ball: { path: ['near:right:behind', 'far:right:mid', 'near:right:mid', 'far:left:kitchenLine'], bounces: [1, 2], step: 2 } },
          { caption: '第三拍起：兩次落地都完成，之後可以在空中直接截擊。', players: [S({ depth: 'mid' }), R({ pos: 'left', depth: 'kitchenLine' })], ball: { path: ['near:right:behind', 'far:right:mid', 'near:right:mid', 'far:left:kitchenLine'], bounces: [1, 2], step: 3 } },
        ],
        scenes: [
          { caption: '第一拍：發球，球在對面落地一次。', players: [A1({ depth: 'behind', serving: true }), A2(), B1(), B2()], ball: { path: ['near:right:behind', 'far:right:mid', 'near:right:mid', 'far:left:kitchenLine'], bounces: [1, 2], step: 1 } },
          { caption: '第二拍：接發球的人等球落地再回，球回到發球方也要落地一次。', players: [A1({ depth: 'behind' }), A2(), B1(), B2()], ball: { path: ['near:right:behind', 'far:right:mid', 'near:right:mid', 'far:left:kitchenLine'], bounces: [1, 2], step: 2 } },
          { caption: '第三拍起：兩次落地都完成，之後可以在空中直接截擊。', players: [A1({ depth: 'mid' }), A2(), B1({ depth: 'kitchenLine' }), B2({ depth: 'kitchenLine' })], ball: { path: ['near:right:behind', 'far:right:mid', 'near:right:mid', 'far:left:kitchenLine'], bounces: [1, 2], step: 3 } },
        ],
      },
      {
        id: 'kitchen',
        title: '廚房（非截擊區）',
        en: 'Kitchen',
        rule: '第 9 節',
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
        rule: '第 7 節',
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
        id: 'ends',
        title: '換場',
        en: 'Changing Ends',
        rule: '第 5 節',
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
    id: 'sideout',
    title: '側出計分',
    en: 'Side-out Scoring',
    subtitle: 'USA Pickleball 正式比賽',
    scoring: 'sideout',
    intro: '正式比賽和大多數球場用的計分。只有發球方能得分。',
    items: [
      {
        id: 'scoring',
        title: '計分與喊分',
        en: 'Scoring',
        rule: '第 4 節',
        summary: '只有發球方能得分。打到 11 分、要贏 2 分。雙打喊三個數字：「發球方分數、接球方分數、第幾發球員」。',
        detail: [
          '開局喊「0-0-2」：第一局第一個發球的隊伍只有一個人可以發，所以直接從第二發球員開始。',
          '發球方贏了這一球得 1 分，同一個人繼續發。發球方輸了不扣分，換搭檔發；兩個人都輸了才換對方發。',
          '正式比賽通常打三局兩勝，每局 11 分；也有 15 分或 21 分的賽制。',
        ],
        singlesSummary: '只有發球方能得分。打到 11 分、要贏 2 分。單打喊兩個數字：「發球方分數、接球方分數」。',
        singlesDetail: [
          '發球方贏了這一球得 1 分，繼續發。發球方輸了不扣分，直接換對方發（side-out），單打沒有第二發球員。',
          '發球位置看發球員自己的分數：偶數從右邊發、奇數從左邊發。接球的人站對角。',
          '正式比賽通常打三局兩勝，每局 11 分；也有 15 分或 21 分的賽制。',
        ],
        singlesScenes: [
          { caption: '開局甲發球，喊「0-0」。單打只喊兩個數字。', players: [S(srv), R()] },
          { caption: '甲贏這球變 1 分。1 是奇數，甲換到左邊發，喊「1-0」。', players: [S({ pos: 'left', ...srv }), R({ pos: 'left' })] },
          { caption: '甲輸了這一球。單打沒有第二發球員，直接換乙發。乙 0 分從右邊發，喊「0-1」。', players: [S(), R(srv)] },
        ],
        scenes: [
          { caption: '開局甲隊發球，喊「0-0-2」。', players: four({ A1: { depth: 'behind', serving: true } }) },
          { caption: '甲隊贏了這一球，變 1 分，喊「1-0-2」。發球員和搭檔換位置，同一個人繼續發。', players: [A1({ pos: 'left', depth: 'behind', serving: true }), A2({ pos: 'right' }), B1(), B2()] },
          { caption: '甲隊輸了這一球。因為是第二發球員，換乙隊發球，喊「0-1-1」。', players: [A1({ pos: 'left' }), A2({ pos: 'right' }), B1({ depth: 'behind', serving: true }), B2()] },
        ],
      },
      {
        id: 'positions',
        play: 'doubles',
        title: '發球順序與站位',
        en: 'Serving Order & Positions',
        rule: '第 4 節',
        summary: '拿回發球權時，站在右邊的人先發。得分才換位，接球的隊伍不動。',
        detail: [
          '每次 side-out 的第一球都從右邊發，由當時站右邊的人發，這個人就是這一輪的第一發球員（4.B.6）。沒有固定的第一發球員。',
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
      },
    ],
  },
  {
    id: 'rally',
    title: '每球得分制',
    en: 'Rally Scoring',
    subtitle: '2026 暫行規則',
    scoring: 'rally',
    intro: '每一球都有人得分，一局比較快結束，很多球場的社交球用這個。USA Pickleball 2025 年起把它列為暫行規則（provisional），2026 年繼續沿用。',
    items: [
      {
        id: 'rally-basics',
        play: 'doubles',
        title: '每球得分怎麼打',
        en: 'Rally Scoring',
        summary: '每一球結束都有一隊得 1 分，誰贏這球誰發下一球。沒有第二發球員。',
        detail: [
          '打到 11、15 或 21 分，要贏 2 分。社交球最常用 15 或 21。',
          '發球方贏球：得 1 分，發球員跟搭檔換邊，同一個人繼續發。',
          '接球方贏球：得 1 分並拿到發球權。兩人先照新分數站好，再由站右邊的人發球（14.A.4）。換發之後的第一球一定從右邊發。',
          '照分數站位：開局站右邊的人，己方偶數分時在右邊、奇數分時在左邊。輸球的那隊不動。',
          '2026 年起接球方也可以拿下最後一分，不用先拿回發球權。',
          '喊分只喊兩個數字：「我方分數、對方分數」。',
        ],
        scenes: [
          { caption: '甲隊 0 分，甲1 從右邊發，喊「0-0」。', players: four({ A1: { depth: 'behind', serving: true } }) },
          { caption: '甲隊贏球：1-0，甲1 和甲2 換邊，甲1 繼續發。', players: [A1({ pos: 'left', depth: 'behind', serving: true }), A2({ pos: 'right' }), B1(), B2()] },
          { caption: '乙隊贏球：得 1 分並拿到發球權。1 分是奇數，乙1 和乙2 先換邊，再由站右邊的乙2 發，喊「1-1」。', players: [A1({ pos: 'left' }), A2({ pos: 'right' }), B1({ pos: 'left' }), B2({ pos: 'right', depth: 'behind', serving: true })] },
          { caption: '甲隊再贏：2 分是偶數，甲1 回到右邊，由他發，喊「2-1」。乙隊輸球不動。', players: [A1({ depth: 'behind', serving: true }), A2(), B1({ pos: 'left' }), B2({ pos: 'right' })] },
        ],
      },
      {
        id: 'rally-singles',
        play: 'singles',
        title: '每球得分怎麼打',
        en: 'Rally Scoring',
        summary: '每一球都有人得分。發球員看自己的分數站：偶數從右邊發、奇數從左邊發。',
        detail: [
          '站位跟側出計分的單打一樣，看發球員自己的分數：偶數右邊、奇數左邊。接球的人站對角。',
          '發球方贏球：得 1 分，換到另一邊繼續發。',
          '接球方贏球：得 1 分並拿到發球權，照自己的新分數決定從哪一邊發。',
          '要贏 2 分。打到幾分開打前講好，常見 15 或 21 分。',
          '喊分喊兩個數字：「發球方分數、接球方分數」（14.A.3）。',
        ],
        scenes: [
          { caption: '開局 0-0：甲從右邊發，乙站對角接。', players: [A1({ label: '甲', depth: 'behind', serving: true }), B1({ label: '乙' })], ball: { path: ['near:right:behind', 'far:right:mid'], bounces: [1] } },
          { caption: '甲贏球：1-0，甲換到左邊繼續發，乙也換到對角接。', players: [A1({ label: '甲', pos: 'left', depth: 'behind', serving: true }), B1({ label: '乙', pos: 'left' })], ball: { path: ['near:left:behind', 'far:left:mid'], bounces: [1] } },
          { caption: '乙贏球：乙得 1 分並拿到發球權。1 分是奇數，乙從左邊發，喊「1-1」。', players: [A1({ label: '甲', pos: 'left' }), B1({ label: '乙', pos: 'left', depth: 'behind', serving: true })], ball: { path: ['far:left:behind', 'near:left:mid'], bounces: [1] } },
        ],
      },
      {
        id: 'rally-pro',
        title: '職業賽怎麼打',
        en: 'Pro Play (MLP)',
        summary: '職業聯盟 MLP 曾經用 21 分制加「凍結」規則，2026 年改回側出計分。',
        collapsed: true,
        detail: [
          'MLP 在 2023 到 2025 年的雙打用每球得分打到 21 分，領先隊到 20 分時「凍結」：只能在自己發球時得分；落後隊到 18 分時也凍結。',
          '2026 年 MLP 雙打改回側出計分 11 分制，每球得分只留在單打決勝的 DreamBreaker（打到 21 分，贏 2 分，沒有凍結）。',
          '所以現在會看到的「每球得分」，就是上面 USA Pickleball 的暫行版本，沒有凍結規則。',
        ],
        scenes: [],
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
