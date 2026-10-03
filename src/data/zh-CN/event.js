// Pico Bowl 比赛专页。日期、地点、计分都还没定案，标“待公布”或“草案”，
// 定案后直接改这里。open 为 false 时首页卡片显示 Coming soon、不能点，
// 但直接打开 #picobowl 还是看得到页面。
export const PICOBOWL = {
  open: false,
  name: 'Pico Bowl',
  tagline: '痞克柏匹克球赛',
  comingSoon: 'Coming soon',
  cardDesc: '男双、女双、混双。2026 年 11 月，详情即将公布。',
  draft: '草案',
  draftNote: '以下是规划中的草案，日期、地点、赛制和计分以正式公告为准。',
  facts: [
    { label: '日期', value: '2026 年 11 月（日期待公布）' },
    { label: '地点', value: '待公布' },
    { label: '组别', value: '男子双打、女子双打、混合双打' },
  ],
  divisionsTitle: '组别',
  // id 给主办工具用；block 1 是上午、2 是下午。
  divisions: [
    { id: 'MD', short: '男双', name: '男子双打', en: "Men's Doubles", note: '预计 7 队左右', block: 1 },
    { id: 'WD', short: '女双', name: '女子双打', en: "Women's Doubles", note: '预计 5 队左右', block: 1 },
    { id: 'XD', short: '混双', name: '混合双打', en: 'Mixed Doubles', note: '预计 10 队左右', block: 2 },
  ],
  divisionsNote: '一个人可以报多项：男双或女双，再加混双。上午、下午分开打，不会撞场。',
  formatTitle: '赛制',
  format: [
    '先分组循环赛：同组每一队都会打到，每队至少打 3 场。',
    '6 队以内全部一组，打完循环前两名打决赛。',
    '7 队以上分成 3～4 队一组，晋级 4 队打半决赛和决赛。',
    '共 2 片场地，哪片场先打完，下一场就接着上。',
  ],
  dayTitle: '当天流程',
  day: [
    { when: '上午', what: '男双、女双同时开打，各用一片场（球员不重叠，不会撞场）' },
    { when: '下午', what: '混双，两片场一起打' },
  ],
  scoringTitle: '计分',
  scoring: [
    '每球得分（rally scoring）：每一球都有人得分，接发球方也能得分。',
    '小组赛：一局打到 15 分，要赢 2 分。',
    '半决赛、决赛：一局打到 21 分，要赢 2 分。',
  ],
  rulesLinks: [
    { href: '#rules/rally-points', label: '每球得分：怎么得分' },
    { href: '#rules/rally-positions', label: '每球得分：谁发球、站哪里' },
    { href: '#rules/kitchen', label: '厨房规则' },
    { href: '#rules/two-bounce', label: '双弹跳' },
  ],
  rankingTitle: '小组排名怎么算',
  ranking: ['胜场数', '两队同胜场时看两队交手结果', '再看净胜分，再看总得分'],
  signupTitle: '报名',
  signupPending: '报名表单待公布',
  signupUrl: null,
};

// 主办工具（#picobowl/manage）。只存在主办这部手机上，不会同步给别人。
// {n}、{pool}、{round} 会换成数字或组名。
export const MANAGE = {
  title: '主办工具',
  intro: '数据只存在这部手机上。开赛前输入队伍，当天输入比分，排名、半决赛和决赛会自动排好；哪片场空了，下一场自动补上，同一个人不会同时排在两片场。',
  courts: '场地数',
  teamsHint: '一行一队，两个名字用“/”或空格隔开',
  create: '生成分组与赛程',
  recreate: '重新生成会清掉所有比分，确定吗？',
  onCourt: '场上',
  court: '{n} 号场',
  idle: '等待中',
  submit: '提交比分',
  next: '接下来',
  nothingNext: '没有等待中的比赛',
  pool: '{pool} 组',
  poolRound: '{pool} 组 第 {round} 轮',
  semi: '半决赛 {n}',
  final: '决赛',
  tbd: '待定',
  cols: ['队伍', '胜', '负', '净胜分'],
  matches: '全部比赛',
  edit: '改比分',
  champion: '冠军',
  copy: '复制战况（贴到 LINE）',
  copied: '已复制，可以贴到 LINE 了',
  copyFallback: '复制下面的文字：',
  reset: '清除全部，重新设置',
  resetConfirm: '确定清除所有队伍和比分？',
  errors: {
    teamLine: '{div} 第 {n} 行要刚好两个名字：{line}',
    tooFew: '{div} 至少要 2 队',
    level: '比分不能一样',
    number: '请输入两队的比分',
    used: '这场的结果已经用来排后面的比赛，不能改了',
  },
  backToEvent: 'Pico Bowl 比赛信息',
};
