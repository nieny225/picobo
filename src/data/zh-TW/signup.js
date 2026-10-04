// 報名訊息（訂完場後貼到群組的接龍名單）。訊息本身用簡單英文，介面用中文。
export const SIGNUP = {
  title: '報名訊息',
  session: '第 {n} 場',
  addSession: '再加一場',
  removeSession: '刪除這一場',
  fields: {
    place: '場地',
    placeHint: '球場名稱',
    date: '日期',
    start: '開始',
    end: '結束',
    names: '已經報名（一行一組）',
    namesHint: '例如：Amy & Ben',
    cap: '人數上限（選填）',
    blanks: '留幾個空號',
  },
  preview: '接龍訊息預覽',
  // 預覽下面一句：第一次用的人不知道這段訊息是拿來接龍的。
  previewHint: '貼到 LINE 或 WhatsApp 群組，大家複製整段、在名單加上自己的名字再貼回去，就是接龍。',
  copy: '複製訊息',
  copied: '已複製，貼到群組吧',
  copyFailed: '沒辦法自動複製，請長按預覽的文字自己複製。',
  shareTitle: 'Pickleball',
  errors: {
    place: '請填場地。',
    date: '請選日期。',
    start: '請填開始時間。',
    end: '結束時間看起來不對。',
    cap: '人數上限請填 1 到 40。',
  },
  // 訊息裡的固定文字（英文）。
  labels: {
    heading: '🏓 Pickleball',
    cap: 'Max {n} players',
    footer: 'via picobo.net',
  },
  // 場地卡和找場地頁上的入口。
  fromVenue: '發報名訊息',
};
