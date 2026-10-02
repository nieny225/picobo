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
  // 頂部切換列第一次出現時的提示泡泡（看過一次就不再出現）。
  hint: '點這裡切換單打／雙打、計分方式',
  // 切換後這條不適用、也沒有對應的那一條：回目錄。
  backToIndex: '這條不適用{combo}，已回到目錄',
};

// 計分板的模式選擇：打法沿用 FILTER.play，計分是 FILTER.scoring 再加「快打」。
// hints 是選好之後顯示的一句說明。
export const SCORE_SETUP = {
  mode: '模式',
  fun: { id: 'fun', label: '快打' },
  // 計分中畫面頂端標示目前模式，避免沿用舊比賽時搞不清楚是哪一種算法。
  playing: '{play}・{scoring}・打到 {target} 分',
  // 重新設定前的確認（已經打了至少一球、比賽還沒結束時才問）。
  resetConfirm: { title: '重新設定這場比賽？', body: '目前的比分和發球紀錄會清掉，回到設定畫面。', yes: '重新設定', no: '繼續比賽' },
  // 從規則頁「到計分板試打」過來，但計分板上還有比賽沒打完。
  busy: '計分板上有比賽還沒打完，先打完或重新設定再換模式。',
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

// 分享比分／戰績成圖片（IG 限動、貼文）。照片只在手機上畫，不上傳。{n} 換成數字。
export const SCORE_SHARE = {
  open: '分享到 IG',
  openStats: '今天戰績分享到 IG',
  // 今天戰績旁的小按鈕上的字（相機 icon 後面）。
  ig: 'IG',
  title: '分享到 IG',
  tabs: { image: '圖片', sticker: '貼紙' },
  formats: { story: '限動 9:16', post: '貼文 4:5' },
  takePhoto: '拍照',
  pickPhoto: '選照片',
  removePhoto: '拿掉照片',
  share: '分享',
  save: '存圖',
  copySticker: '複製貼紙',
  saveSticker: '存貼紙',
  close: '關閉',
  hint: '按「分享」選 Instagram，就能發限動或貼文（也可以選 LINE、WhatsApp）。照片只用在這支手機上，不會上傳。',
  stickerHint: '複製後到 IG 限動，在照片上長按選「貼上」，貼紙可以拖、縮放、轉。貼不上的話，改按「存貼紙」，再從相簿加進限動。',
  saved: '圖片存好了',
  copied: '貼紙複製好了，到 IG 限動貼上',
  copyFailed: '這裡不能複製圖片，改按「存貼紙」。',
  photoFailed: '這張照片讀不出來，換一張試試。',
  preview: '分享圖片預覽',
  brand: 'picobo.',
  brandZh: '痞克柏',
  // 每張圖上都有網址，看到的人知道去哪裡找。
  url: 'picobo.net',
  played: '打',
  won: '贏',
  people: '{n} 人',
  play: { doubles: '雙打', singles: '單打' },
  scoring: { sideout: '側出計分', rally: '每球得分', fun: '快打' },
  file: 'picobo',
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
// 抽籤：第一次用時名單是空的，這行提示怎麼開始。
export const DRAW_EMPTY = '還沒有球友。輸入名字，或貼上群組接龍。';

// 抽籤：把群組裡的報名接龍貼進來，讀出名字。{n} 人數，{title} 哪一場。
export const DRAW_PASTE = {
  open: '貼上群組接龍，自動讀出名字',
  hint: '把群組裡的接龍整則貼進來，例如「1. Amy & Ben」，一組兩人會拆成兩個名字。',
  placeholder: '9/5 (Sat) 5-7pm\n1. Amy & Ben\n2. Chris',
  read: '讀出名字',
  pick: '這則有好幾場，要用哪一場？',
  session: '{title}（{n} 人）',
  untitled: '名單',
  none: '沒讀到名字。名單要是「1. 名字」這種一行一號的格式。',
  added: '已加入 {n} 人',
};

// 球友名單：點名字改名（貼上名單讀錯、或想換成大家認得的名字）。
export const DRAW_RENAME = {
  hint: '點名字可以改名，按 × 移除。',
  title: '改名字',
  save: '儲存',
  cancel: '取消',
  duplicate: '名單裡已經有這個名字了。',
  empty: '名字不能空白。',
};

// 抽籤分組和國王球場：點人名跟別人交換位置（場上或排隊）。
export const DRAW_SWAP = {
  hint: '點名字可以跟別人交換位置。',
  title: '{name} 要跟誰交換？',
  note: '兩個人互換位置，戰績不變。',
  queue: '排隊中',
  court: '{court} 號場上',
  cancel: '取消',
  none: '目前沒有可以交換的人。',
  done: '{a} 和 {b} 換好了',
};

// 抽籤分組的混雙：開了才在名字前顯示性別，點一下換（未標 → ♂ → ♀）。
export const DRAW_MIX = {
  toggle: '混雙',
  // 勾選框旁的小註解。
  note: '勾選後在名單點「?」標性別',
  hint: '點 ? 標性別（♂、♀），沒標的人誰都能配。',
  symbols: { '': '?', m: '♂\uFE0E', f: '♀\uFE0E' },
  labels: { '': '未標性別', m: '男', f: '女' },
  tag: '{name}：{label}，點一下更換',
  notMixed: '這場不是混雙',
};

// 抽籤 ↔ 計分板：場號旁的計分 icon 帶名字進計分板；打完回抽籤記錄勝負。
export const DRAW_SCORE = {
  open: '{court} 號場到計分板計分',
  from: '從抽籤帶入：{court} 號場',
  back: '回抽籤，記錄 {names} 贏',
  recorded: '{court} 號場記錄好了，下一組上場',
  gone: '抽籤那邊這場已經換人或打完了，請在抽籤手動記錄。',
  busy: { title: '計分板上有比賽還沒打完', body: '要換成 {court} 號場這場嗎？目前的比分會清掉。', yes: '換成這場', no: '取消' },
};

// 抽籤分組（排隊輪流上場）。{court} 換成場地編號。
export const OPEN_PLAY = {
  start: '開始抽籤',
  redraw: '重新抽籤',
  hint: '大家排成一列，前四位上場。打完按贏的那隊，四個人回到隊尾、搭檔拆開，排最前面的四位接著上，所以大家打的場數會一樣多。重新抽籤會打散重排，打得少的排前面，戰績保留。',
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

// 分享目前狀態：把計分板、抽籤、Pico Bowl 主辦工具的目前狀態做成連結，給接手的人
// 繼續。按鈕跟一般分享一樣，按下去先跳說明再分享。
export const HANDOFF = {
  aria: '分享目前狀態，讓別人接著用',
  titles: { score: 'Picobo 計分', draw: 'Picobo 抽籤', tourney: 'Pico Bowl 主辦' },
  sheet: {
    score: { title: '分享這場比賽', body: '對方打開連結，就會看到現在的比分、誰發球、站哪邊，可以直接接著記。適合換人計分，或給場邊的人看。' },
    draw: { title: '分享抽籤', body: '對方打開連結，就會拿到同一份球友名單、排隊順序和戰績，可以直接接著排。適合換人管場。' },
    tourney: { title: '分享主辦進度', body: '對方打開連結，就會拿到所有隊伍、賽程和比分，可以直接接手主辦。' },
  },
  note: '連結是按下去那一刻的狀態，不會自動同步。交給別人之後，這支手機就不要再記了。',
  go: '分享連結',
  cancel: '取消',
  kinds: { score: '比賽', draw: '抽籤名單和戰績', tourney: 'Pico Bowl 賽程和比分' },
  confirm: '這個連結帶著別人分享的{kind}，要取代這支手機上目前的{kind}嗎？',
  loaded: '已接手，從這裡繼續。原本的手機就不要再記了。',
  broken: '這個分享連結打不開，請對方重新分享一次。',
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
  prev: '上一條',
  next: '下一條',
  // 計分三步驟每頁最下面：用同樣的打法和計分方式打開計分板。
  tryScore: '到計分板試打',
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
  // 玩法頁頂部切換列：依目的分組的短名稱（key 是 formats.js 的 group），點了跳到那一組的第一個玩法。
  groupLabel: '依目的',
  groupShort: { 人多場地少: '人多', 人數湊不齊: '缺人', 想練技術: '練技術', 想玩熱鬧: '熱鬧' },
  scoring: '計分：',
};
