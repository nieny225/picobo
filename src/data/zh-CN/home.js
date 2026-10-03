// 首页文字。slogan 每一行一个元素；概念先不讲明，只留形象。
export const HOME = {
  slogan: ['Pick a day,', 'pick a place,', 'picobo.'],
  entriesLabel: '从这里开始',
  intro: '痞克柏是你的匹克球场边伙伴。',
  // 顶部栏的“安装”按钮和它弹出的步骤说明。
  install: {
    title: '把痞克柏放到桌面',
    ios: '点浏览器的“分享”按钮，再选“添加到主屏幕”，就能像 App 一样从桌面打开，没信号也能用。',
    mac: '在 Safari 上方菜单点“文件”，再选“添加到程序坞”，就能像 App 一样打开。',
    android: '点浏览器右上角的“⋮”菜单，选“安装应用”或“添加到主屏幕”，就能像 App 一样从桌面打开。已经装过的话，从桌面的痞克柏打开就好。',
    inApp: '在 LINE、Facebook、Instagram 里打开的网页不能安装。点右上角的菜单，选“在浏览器中打开”，再从 Chrome 或 Safari 安装。',
    // 顶部栏的安装按钮；浏览器没给安装窗口时（iPhone、iPad、Mac Safari、Android 刚卸载过、
    // LINE 等 App 内置浏览器），按了改显示上面的步骤。
    short: '安装',
    aria: '把痞克柏安装成 App',
    close: '知道了',
    // 装好之后（或这个浏览器不能安装时），同一个位置换成邀请朋友的分享 icon。
    invite: { aria: '邀请朋友一起用痞克柏', title: 'Picobo 痞克柏', text: '痞克柏：匹克球规则图解、记分板、抽签轮转，打球一起用。' },
  },
  entries: [
    { route: 'rules', title: '学规则', en: 'Rules', desc: '图解一步步搞懂规则' },
    { route: 'score', title: '记分板', en: 'Scoreboard', desc: '轻松算好站位、发球、计分' },
    { route: 'draw', title: '抽签轮转', en: 'Draw', desc: '分组、轮转赛、国王球场，人多也不乱。' },
    { route: 'meetup', title: '约球', en: 'Find Players', desc: '填时间地点缺几人，一张卡发到群里。' },
    { route: 'venues', title: '找场地', en: 'Courts', desc: '哪里能打、怎么预约、怎么去，还能快速组局。' },
    // 合作表单（Google 表单，不显示站长 email）。新加坡的人也会来，所以中英并列。
    { href: 'https://forms.gle/X8Rsieeez7oDLZMFA', title: '找合作', en: 'Partner with us', desc: '场地、教练、品牌、活动' },
  ],
};
