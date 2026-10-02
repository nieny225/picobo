// Pico Bowl 比賽專頁。日期、地點、計分都還沒定案，標「待公布」或「草案」，
// 定案後直接改這裡。open 為 false 時首頁卡片顯示 Coming soon、不能點，
// 但直接開 #picobowl 還是看得到頁面。
export const PICOBOWL = {
  open: false,
  name: 'Pico Bowl',
  tagline: '痞克柏匹克球賽',
  comingSoon: 'Coming soon',
  cardDesc: '男雙、女雙、混雙。2026 年 11 月，詳情即將公布。',
  draft: '草案',
  draftNote: '以下是規劃中的草案，日期、地點、賽制和計分以正式公告為準。',
  facts: [
    { label: '日期', value: '2026 年 11 月（日期待公布）' },
    { label: '地點', value: '待公布' },
    { label: '組別', value: '男子雙打、女子雙打、混合雙打' },
  ],
  divisionsTitle: '組別',
  // id 給主辦工具用；block 1 是上午、2 是下午。
  divisions: [
    { id: 'MD', short: '男雙', name: '男子雙打', en: "Men's Doubles", note: '預計 7 隊左右', block: 1 },
    { id: 'WD', short: '女雙', name: '女子雙打', en: "Women's Doubles", note: '預計 5 隊左右', block: 1 },
    { id: 'XD', short: '混雙', name: '混合雙打', en: 'Mixed Doubles', note: '預計 10 隊左右', block: 2 },
  ],
  divisionsNote: '一個人可以報多項：男雙或女雙，再加混雙。上午、下午分開打，不會撞場。',
  formatTitle: '賽制',
  format: [
    '先分組循環賽：同組每一隊都會打到，每隊至少打 3 場。',
    '6 隊以內全部一組，打完循環前兩名打決賽。',
    '7 隊以上分成 3～4 隊一組，晉級 4 隊打準決賽和決賽。',
    '共 2 面場地，哪面場先打完，下一場就接著上。',
  ],
  dayTitle: '當天流程',
  day: [
    { when: '上午', what: '男雙、女雙同時開打，各用一面場（球員不重疊，不會撞場）' },
    { when: '下午', what: '混雙，兩面場一起打' },
  ],
  scoringTitle: '計分',
  scoring: [
    '每球得分（rally scoring）：每一球都有人得分，接發球方也能得分。',
    '分組賽：一局打到 15 分，要贏 2 分。',
    '準決賽、決賽：一局打到 21 分，要贏 2 分。',
  ],
  rulesLinks: [
    { href: '#rules/rally-basics', label: '每球得分：計分與站位' },
    { href: '#rules/kitchen', label: '廚房規則' },
    { href: '#rules/two-bounce', label: '雙彈跳' },
  ],
  rankingTitle: '分組排名怎麼算',
  ranking: ['勝場數', '兩隊同勝場時看兩隊對戰結果', '再看得失分差，再看總得分'],
  signupTitle: '報名',
  signupPending: '報名表單待公布',
  signupUrl: null,
};

// 主辦工具（#picobowl/manage）。只存在主辦這支手機上，不會同步給別人。
// {n}、{pool}、{round} 會換成數字或組名。
export const MANAGE = {
  title: '主辦工具',
  intro: '資料只存在這支手機上。開賽前輸入隊伍，當天按比分，排名、準決賽和決賽會自動排好；哪面場空了，下一場自動補上，同一個人不會同時排在兩面場。',
  courts: '場地數',
  teamsHint: '一行一隊，兩個名字用「/」或空白隔開',
  create: '產生分組與賽程',
  recreate: '重新產生會清掉所有比分，確定嗎？',
  onCourt: '場上',
  court: '{n} 號場',
  idle: '等待中',
  submit: '送出比分',
  next: '接下來',
  nothingNext: '沒有等待中的比賽',
  pool: '{pool} 組',
  poolRound: '{pool} 組 第 {round} 輪',
  semi: '準決賽 {n}',
  final: '決賽',
  tbd: '待定',
  cols: ['隊伍', '勝', '負', '得失分'],
  matches: '全部比賽',
  edit: '改比分',
  champion: '冠軍',
  copy: '複製戰況（貼到 LINE）',
  copied: '已複製，可以貼到 LINE 了',
  copyFallback: '複製下面的文字：',
  reset: '清除全部，重新設定',
  resetConfirm: '確定清除所有隊伍和比分？',
  errors: {
    teamLine: '{div} 第 {n} 行要剛好兩個名字：{line}',
    tooFew: '{div} 至少要 2 隊',
    level: '比分不能一樣',
    number: '請輸入兩隊的比分',
    used: '這場的結果已經用來排後面的比賽，不能改了',
  },
  backToEvent: 'Pico Bowl 比賽資訊',
};
