// 規則目錄、單條規則頁與趣味玩法頁的介面文字。
export const RULES_INDEX = {
  title: '學規則',
  intro: '挑一條看圖解。每一條都有自己的網址，可以直接傳給球友。',
  more: '更多',
  moreEn: 'More',
};

// 規則總覽頂端的切換鈕：打法 × 計分，共四種組合。
export const FILTER = {
  play: { label: '打法', options: [{ id: 'doubles', label: '雙打' }, { id: 'singles', label: '單打' }] },
  scoring: { label: '計分', options: [{ id: 'sideout', label: '側出計分', en: 'Side-out' }, { id: 'rally', label: '每球得分', en: 'Rally' }] },
  applies: '適用',
  both: { play: '單打・雙打', scoring: '兩種計分' },
  showing: '目前顯示：',
};

// 計分板的模式選擇：打法沿用 FILTER.play，計分是 FILTER.scoring 再加「快打」。
// hints 是選好之後顯示的一句說明。
export const SCORE_SETUP = {
  mode: '模式',
  fun: { id: 'fun', label: '快打' },
  // 計分中畫面頂端標示目前模式，避免沿用舊比賽時搞不清楚是哪一種算法。
  playing: '{play}・{scoring}・打到 {target} 分',
  fullscreen: '全螢幕',
  exitFullscreen: '離開全螢幕',
  // 下一球贏了就結束這局時，大比分下面的小標。
  gamePoint: '{team}賽末點（Game Point）',
  gamePointBoth: '雙方賽末點（Game Point）',
  hints: {
    'sideout-doubles': '側出計分：只有發球方得分，兩個發球員，喊三個數字。',
    'sideout-singles': '側出計分：只有發球方得分，偶數右邊、奇數左邊發。',
    'rally-doubles': '每球得分：每一球都有人得分，換發後照分數站好、右邊的人發。',
    'rally-singles': '每球得分：每一球都有人得分，偶數右邊、奇數左邊發。',
    fun: '快打：只算分數，不管發球和站位。',
  },
};

// 分享目前這一頁。url 是正式網址，在 artifact 裡分享出去的也是這個網址。
export const SHARE = {
  url: 'https://picobo.net/',
  label: '分享',
  aria: '分享這一頁',
  copied: '已複製連結',
  manual: '複製這個網址分享：',
};

// 抽籤頁還沒輸入球友時的範例名單。
export const DRAW_SAMPLE = ['Bruce', 'Annie', 'Steven', 'Max', 'Rose', 'Henry', 'Lara', 'Casey', 'Frank', 'Erica', 'Matthew', 'Tom', 'GT', 'Mandy', 'John', 'Nick', 'Vivian'];

// 抽籤分組（排隊輪流上場）。{court} 換成場地編號。
export const OPEN_PLAY = {
  start: '開始抽籤',
  redraw: '重新抽籤',
  hint: '大家排成一列，前四位上場。打完按贏的那隊，四個人回到隊尾、搭檔拆開，排最前面的四位接著上。重新抽籤會打散重排，戰績保留。',
  won: '這隊贏',
  idle: '{court} 號場：人不夠，先休息',
  queue: '排隊中',
  queueHint: '（前四位下一場上）',
  queueEmpty: '沒有人在排隊',
  leaving: '打完這場離開：',
  stats: '今天戰績',
  cols: ['球友', '打', '贏'],
};

// 右上角的淺色／深色切換。按鈕上寫的是按下去會變成什麼。
export const THEME = {
  toDark: '切換成深色',
  toLight: '切換成淺色',
};

// 交接：把計分板、抽籤、Pico Bowl 主辦工具的目前狀態做成連結，傳給接手的人。
export const HANDOFF = {
  button: '交接',
  aria: '把目前狀態做成連結，傳給接手的人',
  titles: { score: 'Picobo 計分交接', draw: 'Picobo 抽籤交接', tourney: 'Pico Bowl 主辦交接' },
  kinds: { score: '比賽', draw: '抽籤名單和戰績', tourney: 'Pico Bowl 賽程和比分' },
  confirm: '這個連結帶著別人交接的{kind}，要取代這支手機上目前的{kind}嗎？',
  loaded: '已接手，從這裡繼續。原本的手機就不要再記了。',
  broken: '這個交接連結打不開，請對方重新分享一次。',
};

// 球場圖步驟輪播。step 裡的 {n} 換成第幾步。
export const SCENE_NAV = {
  prev: '上一步',
  next: '下一步',
  step: '第 {n} 步',
};

// 左側可收合的規則目錄。
export const DRAWER = {
  open: '目錄',
  title: '規則目錄',
  close: '關閉目錄',
  home: '目錄首頁',
};

export const RULE_PAGE = {
  back: '目錄',
  prev: '上一條',
  next: '下一條',
};

// 目錄裡不屬於單一規則的頁面。
export const EXTRA_PAGES = {
  compare: { summary: '兩種計分方式差在哪，一張表看完。' },
  faq: { title: '常見誤解', en: 'Common Misconceptions', summary: '雙打誰先發、碰線算不算，球場上最常吵的幾題。' },
  glossary: { title: '術語表', en: 'Glossary', summary: 'dink、side-out、ATP 這些詞的中文對照。', intro: '球場上中英文混著講很正常，這裡對照一下。' },
};

export const FORMATS_PAGE = {
  title: '趣味玩法',
  en: 'Fun Formats',
  note: '各球場做法不同，不是官方規則。',
  unofficial: '各球場做法不同',
  scoring: '計分：',
  intro: '人數不對、場地不夠、想練特定球路的時候用。這些都不是官方規則，各球場做法不同，開打前先講好版本。',
};
