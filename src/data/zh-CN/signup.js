// 报名信息（订完场后贴到群里的接龙名单）。消息本身用简单英文，界面用中文。
export const SIGNUP = {
  title: '报名接龙',
  intro: '订好场之后，填时间和已经报名的人，复制贴到 IG、WhatsApp 或 LINE，大家按顺序把名字加上去。',
  session: '第 {n} 场',
  addSession: '再加一场',
  removeSession: '删除这一场',
  fields: {
    place: '场地',
    placeHint: '球场名称',
    date: '日期',
    start: '开始',
    end: '结束',
    names: '已经报名（一行一组）',
    namesHint: '例如：Amy & Ben',
    cap: '人数上限（选填）',
    blanks: '留几个空位',
  },
  preview: '消息预览',
  copy: '复制消息',
  copied: '已复制，贴到群里吧',
  copyFailed: '没办法自动复制，请长按预览的文字自己复制。',
  shareTitle: 'Pickleball',
  errors: {
    place: '请填场地。',
    date: '请选日期。',
    start: '请填开始时间。',
    end: '结束时间看起来不对。',
    cap: '人数上限请填 1 到 40。',
  },
  // 消息里的固定文字（英文）。
  labels: {
    heading: '🏓 Pickleball',
    cap: 'Max {n} players',
    footer: 'via picobo.net',
  },
  // 场地卡和找场地页上的入口。
  fromVenue: '发报名接龙',
};
