// 规则目录、单条规则页与趣味玩法页的界面文字。
export const RULES_INDEX = {
  title: '学规则',
  intro: '挑一条看图解。每一条都有自己的链接，可以直接发给球友。',
  more: '更多',
  moreEn: 'More',
};

// 规则总览顶端的切换按钮：打法 × 计分，共四种组合。
export const FILTER = {
  play: { label: '打法', options: [{ id: 'doubles', label: '双打' }, { id: 'singles', label: '单打' }] },
  scoring: { label: '计分', options: [{ id: 'sideout', label: '侧出计分', en: 'Side-out' }, { id: 'rally', label: '每球得分', en: 'Rally' }] },
  applies: '适用',
  both: { play: '单打・双打', scoring: '两种计分' },
  showing: '当前显示：',
  // 顶部切换栏第一次出现时的提示气泡（看过一次就不再出现）。
  hint: '点这里切换单打／双打、计分方式',
  // 切换后这条不适用、也没有对应的那一条：回目录。
  backToIndex: '这条不适用{combo}，已回到目录',
};

// 记分板的模式选择：打法沿用 FILTER.play，计分是 FILTER.scoring 再加“快打”。
// hints 是选好之后显示的一句说明。
export const SCORE_SETUP = {
  mode: '模式',
  fun: { id: 'fun', label: '快打' },
  // 计分中画面顶端标示当前模式，避免沿用旧比赛时搞不清楚是哪一种算法。
  playing: '{play}・{scoring}・打到 {target} 分',
  // 重新设置前的确认（已经打了至少一球、比赛还没结束时才问）。
  resetConfirm: { title: '重新设置这场比赛？', body: '当前的比分和发球记录会清掉，回到设置画面。', yes: '重新设置', no: '继续比赛' },
  // 从规则页“到记分板试打”过来，但记分板上还有比赛没打完。
  busy: '记分板上有比赛还没打完，先打完或重新设置再换模式。',
  fullscreen: '全屏',
  exitFullscreen: '退出全屏',
  // 下一球赢了就结束这局时，大比分下面的小标。
  gamePoint: '{team}赛点（Game Point）',
  gamePointBoth: '双方赛点（Game Point）',
  hints: {
    'sideout-doubles': '侧出计分：只有发球方得分，两个发球员，喊三个数字。',
    'sideout-singles': '侧出计分：只有发球方得分，偶数右边、奇数左边发。',
    'rally-doubles': '每球得分：每一球都有人得分，换发后照分数站好、右边的人发。',
    'rally-singles': '每球得分：每一球都有人得分，偶数右边、奇数左边发。',
    fun: '快打：只算分数，不管发球和站位。',
  },
};

// 分享比分／战绩成图片（IG 快拍、帖子）。照片只在手机上画，不上传。{n} 换成数字。
export const SCORE_SHARE = {
  open: '分享到 IG',
  openStats: '今天战绩分享到 IG',
  openReport: '战报分享到 IG',
  // 我的战绩的战报图。{n} 场数、{m} 月份、{won}／{lost} 胜负。
  report: {
    week: '这周打了 {n} 场',
    month: '这个月打了 {n} 场',
    all: '总共打了 {n} 场',
    monthName: '{m} 月',
    allTime: '全部',
    rate: '胜率',
    streak: '最长连胜',
    best: '最佳搭档',
    most: '最常搭档',
    record: '战绩',
    toughest: '最难缠的对手',
    wl: '{won} 胜 {lost} 负',
  },
  // 今天战绩旁的小按钮上的字（相机图标后面）。
  ig: 'IG',
  title: '分享到 IG',
  tabs: { image: '图片', sticker: '贴纸' },
  formats: { story: '快拍 9:16', post: '帖子 4:5' },
  takePhoto: '拍照',
  pickPhoto: '选照片',
  removePhoto: '去掉照片',
  // 比分条／战绩表的大小，和拖动的提示。
  sizes: { s: '小', m: '中', l: '大' },
  dragHint: '在预览上拖动可以移动位置',
  share: '分享',
  save: '保存图片',
  copySticker: '复制贴纸',
  saveSticker: '保存贴纸',
  close: '关闭',
  hint: '按“分享”选 Instagram，就能发快拍或帖子（也可以选 LINE、WhatsApp）。照片只用在这部手机上，不会上传。',
  stickerHint: '复制后到 IG 快拍，在照片上长按选“粘贴”，贴纸可以拖动、缩放、旋转。粘贴不了的话，改按“保存贴纸”，再从相册加进快拍。',
  saved: '图片已保存',
  copied: '贴纸已复制，到 IG 快拍粘贴',
  copyFailed: '这里不能复制图片，改按“保存贴纸”。',
  photoFailed: '这张照片读不出来，换一张试试。',
  preview: '分享图片预览',
  brand: 'picobo.',
  brandZh: '痞克柏',
  // 每张图上都有网址，看到的人知道去哪里找。
  url: 'picobo.net',
  played: '打',
  won: '赢',
  people: '{n} 人',
  play: { doubles: '双打', singles: '单打' },
  scoring: { sideout: '侧出计分', rally: '每球得分', fun: '快打' },
  file: 'picobo',
};

// 分享当前这一页。url 是正式网址，在 artifact 里分享出去的也是这个网址。
export const SHARE = {
  url: 'https://picobo.net/',
  label: '分享',
  aria: '分享这一页',
  copied: '已复制链接',
  manual: '复制这个网址分享：',
};

// 抽签：第一次用时名单是空的，这行提示怎么开始。
export const DRAW_EMPTY = '还没有球友。输入名字，或粘贴群里的接龙。';

// 抽签：把群里的报名接龙粘贴进来，读出名字。{n} 人数，{title} 哪一场。
export const DRAW_PASTE = {
  open: '粘贴群接龙，自动读出名字',
  hint: '把群里的接龙整条粘贴进来，例如“1. Amy & Ben”，一组两人会拆成两个名字。',
  placeholder: '9/5 (Sat) 5-7pm\n1. Amy & Ben\n2. Chris',
  read: '读出名字',
  pick: '这条有好几场，要用哪一场？',
  session: '{title}（{n} 人）',
  untitled: '名单',
  none: '没读到名字。名单要是“1. 名字”这种一行一号的格式。',
  added: '已加入 {n} 人',
};

// 常用球团：存好固定那群人的名单，抽签和报名信息一键带入。{name} 球团名称。
export const GROUPS = {
  label: '常用球团',
  add: '＋ 存成球团',
  sheetTitle: '存成球团',
  sheetHint: '把现在的名单存起来，下次一键带入。同名的球团会被更新。',
  namePlaceholder: '例如：周六 Kallang 团',
  save: '保存',
  cancel: '取消',
  saved: '“{name}”已保存',
  manage: '已存的球团',
  remove: '删除',
  removed: '“{name}”已删除',
  emptyName: '请给球团取个名字。',
  emptyRoster: '名单是空的，先加几个球友。',
  full: '球团最多存 20 个，先删掉一些。',
  replace: '换成“{name}”的名单？当前的名单和抽签进度会清掉。',
  loaded: '已带入“{name}”',
};

// 球友名单：点名字改名（粘贴名单读错、或想换成大家认得的名字）。
export const DRAW_RENAME = {
  hint: '点名字可以改名，按 × 移除。',
  title: '改名字',
  save: '保存',
  cancel: '取消',
  duplicate: '名单里已经有这个名字了。',
  empty: '名字不能空白。',
};

// 抽签分组和国王球场：点人名跟别人交换位置（场上或排队）。
export const DRAW_SWAP = {
  hint: '点名字可以跟别人交换位置。',
  title: '{name} 要跟谁交换？',
  note: '两个人互换位置，战绩不变。',
  queue: '排队中',
  court: '{court} 号场上',
  cancel: '取消',
  none: '目前没有可以交换的人。',
  done: '{a} 和 {b} 换好了',
};

// 抽签分组的混双：开了才在名字前显示性别，点一下换（未标 → ♂ → ♀）。
export const DRAW_MIX = {
  toggle: '混双',
  // 勾选框旁的小注解。
  note: '勾选后在名单点“?”标性别',
  hint: '点 ? 标性别（♂、♀），没标的人谁都能配。',
  symbols: { '': '?', m: '♂︎', f: '♀︎' },
  labels: { '': '未标性别', m: '男', f: '女' },
  tag: '{name}：{label}，点一下更换',
  notMixed: '这场不是混双',
};

// 抽签 ↔ 记分板：场号旁的计分图标带名字进记分板；打完回抽签记录胜负。
export const DRAW_SCORE = {
  open: '{court} 号场到记分板计分',
  from: '从抽签带入：{court} 号场',
  back: '回抽签，记录 {names} 赢',
  recorded: '{court} 号场记录好了，下一组上场',
  gone: '抽签那边这场已经换人或打完了，请在抽签手动记录。',
  busy: { title: '记分板上有比赛还没打完', body: '要换成 {court} 号场这场吗？当前的比分会清掉。', yes: '换成这场', no: '取消' },
};

// 抽签分组（排队轮流上场）。{court} 换成场地编号。
export const OPEN_PLAY = {
  start: '开始抽签',
  redraw: '重新抽签',
  hint: '大家排成一列，前四位上场。打完按赢的那队，四个人回到队尾、搭档拆开，排最前面的四位接着上，所以大家打的场数会一样多。重新抽签会打散重排，打得少的排前面，战绩保留。',
  won: '这队赢',
  idle: '{court} 号场：人不够，先休息',
  queue: '排队中',
  queueHint: '（前四位下一场上）',
  queueEmpty: '没有人在排队',
  leaving: '打完这场离开：',
  stats: '今天战绩',
  cols: ['球友', '打', '赢'],
  clear: '清除今天战绩',
  clearConfirm: '清除今天战绩？大家的打和赢归零，名单、场上和排队不变。已经记到“我的战绩”的比赛不会删。',
  cleared: '今天战绩已清除',
};

// 右上角的浅色／深色切换。按钮上写的是按下去会变成什么。
export const THEME = {
  toDark: '切换成深色',
  toLight: '切换成浅色',
};

// 分享当前状态：把记分板、抽签、Pico Bowl 主办工具的当前状态做成链接，给接手的人
// 继续。按钮跟一般分享一样，按下去先弹出说明再分享。
export const HANDOFF = {
  aria: '分享当前状态，让别人接着用',
  titles: { score: 'Picobo 计分', draw: 'Picobo 抽签', tourney: 'Pico Bowl 主办' },
  sheet: {
    score: { title: '分享这场比赛', body: '对方打开链接，就会看到现在的比分、谁发球、站哪边，可以直接接着记。适合换人计分，或给场边的人看。' },
    draw: { title: '分享抽签', body: '对方打开链接，就会拿到同一份球友名单、排队顺序和战绩，可以直接接着排。适合换人管场。' },
    tourney: { title: '分享主办进度', body: '对方打开链接，就会拿到所有队伍、赛程和比分，可以直接接手主办。' },
  },
  // 抽签's share button offers both: today's results to the players, or the
  // whole draw to the next organizer.
  choose: {
    title: '分享',
    games: { title: '把战绩发给球友', body: '今天打完的比赛发到群里，球友点开就会加进自己的“我的战绩”。', go: '发给球友' },
    handoff: { title: '交给下一位管场', body: '对方打开链接，就会拿到同一份名单、排队顺序和战绩，可以直接接着排。' },
  },
  note: '链接是按下去那一刻的状态，不会自动同步。交给别人之后，这部手机就不要再记了。',
  go: '分享链接',
  cancel: '取消',
  kinds: { score: '比赛', draw: '抽签名单和战绩', tourney: 'Pico Bowl 赛程和比分' },
  confirm: '这个链接带着别人分享的{kind}，要取代这部手机上当前的{kind}吗？',
  loaded: '已接手，从这里继续。原来的手机就不要再记了。',
  broken: '这个分享链接打不开，请对方重新分享一次。',
};

// 球场图步骤轮播。step 里的 {n} 换成第几步。
export const SCENE_NAV = {
  prev: '上一步',
  next: '下一步',
  step: '第 {n} 步',
};

// 左侧可收起的规则目录。
export const DRAWER = {
  open: '目录',
  title: '规则目录',
  close: '关闭目录',
  home: '目录首页',
};

export const RULE_PAGE = {
  prev: '上一条',
  next: '下一条',
  // 计分三步骤每页最下面：用同样的打法和计分方式打开记分板。
  tryScore: '到记分板试打',
};

// 目录里不属于单一规则的页面。
export const EXTRA_PAGES = {
  compare: { summary: '两种计分方式差在哪，一张表看完。' },
  faq: { title: '常见误解', en: 'Common Misconceptions', summary: '双打谁先发、压线算不算，球场上最常吵的几题。' },
  glossary: { title: '术语表', en: 'Glossary', summary: 'dink、side-out、ATP 这些词的中文对照。', intro: '球场上中英文混着讲很正常，这里对照一下。' },
};

export const FORMATS_PAGE = {
  title: '趣味玩法',
  en: 'Fun Formats',
  note: '各球场做法不同，不是官方规则。',
  unofficial: '各球场做法不同',
  // 玩法页顶部切换栏：按目的分组的短名称（key 是 formats.js 的 group），点了跳到那一组的第一个玩法。
  groupLabel: '按目的',
  groupShort: { 人多场地少: '人多', 人数凑不齐: '缺人', 想练技术: '练技术', 想玩热闹: '热闹' },
  scoring: '计分：',
};

// 记分板页面上的字。甲队／乙队、默认名字 甲1、乙2…（record.js 认得这些默认名字，
// 用默认名字的比赛不记进我的战绩）。{n}、{team}、{name}、{pos}、{names}、{a}、{b} 会换掉。
export const SCORE_TEXT = {
  title: '记分板',
  intro: '按谁赢了这一球，站位、换发、报分自动算好。',
  teams: { A: '甲队', B: '乙队' },
  placeholders: { A: ['甲1', '甲2'], B: ['乙1', '乙2'] },
  player: '球员 {n}',
  target: '打到几分',
  points: '{n} 分',
  winBy: '要赢几分',
  winBy2: '赢 2 分',
  winBy1: '赢 1 分就好',
  first: '谁先发球',
  flip: '抛硬币决定',
  flipped: '硬币说：{team}先发',
  deciding: '这是决胜局（到一半提醒换场）',
  quickHint: '{mode}，{names}',
  custom: '可以先改设置',
  start: '开始计分',
  alt: '当前站位与发球者',
  fun: '快打模式，只算分数',
  pos: { right: '右边', left: '左边' },
  serverN: '第 {n} 发球员 ',
  serving: '{team}发球：{n}{name} 从{pos}发',
  switchSides: '到一半了，两队换场，发球员不变。',
  switched: '已换场',
  won: '{team}赢了 🎉 {a}-{b}',
  rallyWon: '{names} 赢这球',
  undo: '撤销上一球',
  again: '再来一局',
  reset: '重新设置',
};

// 抽签轮转页面上其他的字。{n}、{court}、{name}、{round}、{names} 会换掉。
export const DRAW_TEXT = {
  // 場上先發球那一隊名字下的小標籤。
  servesFirst: '先发球',
  title: '抽签轮转',
  intro: '先输入今天的球友，再选要怎么分。',
  roster: '今天的球友',
  people: '{n} 人',
  remove: '移除 {name}',
  namePlaceholder: '输入名字',
  add: '加入',
  clear: '清空',
  subs: { draw: '抽签分组', rr: '轮转赛', koc: '国王球场' },
  courts: '场地数',
  court: '{court} 号场',
  vs: '对',
  rounds: '几轮',
  makeRounds: '排轮次',
  rrHint: '每轮换搭档，尽量不重复；人数超过场地容量时轮流休息。',
  round: '第 {round} 轮',
  resting: '休息：{names}',
  listSep: '、',
  streakMax: '最多连赢几场',
  kocStart: '开始',
  kocRestart: '重新开始',
  kocHint: '赢的留场、输的排队尾；连赢到上限也下场。',
  streak: '留场队已连赢 {n} 场',
  kocQueueHint: '（前两位下一场上）',
  atLeast: '至少要 {n} 个人。',
};

// 页签（顶部和手机底部）、页脚、球场图上的字，和几个零散的小字。
export const APP_TEXT = {
  // 網路慢時有些檔案先用了舊版，新版到了就提示重新整理。
  updated: '有新版本，点这里刷新',
  // 同一隊兩個人名字之間。
  and: '・',
  // 頂部的站名和瀏覽器分頁標題（英文版不放中文名）。
  brand: 'Picobo 痞克柏',
  tabsLabel: '主菜单',
  tabs: { home: '首页', rules: '规则', score: '计分', draw: '抽签', venues: '约球' },
  footer: '正式规则依据 {rulebook}。趣味玩法各球场做法不同，开打前先讲好。',
  moreDetail: '更多说明',
  people: '{n} 人',
  court: { zone: '厨房（非截击区）', zoneShort: '厨房', alt: '匹克球球场示意图' },
  standing: '{rank}. {team}  {won}胜{lost}负 {diff}',
  division: '【{name}】',
};
