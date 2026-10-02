// 場地名錄。只放確認過的資料（場地方或熟識的球友提供），不要自己猜地址電話。
// 欄位：
//   id        網址用的英數字代號（#meetup?venue=<id>）
//   name      場地名稱
//   city      縣市，名錄依這個分組（例如「臺北市」）
//   address   地址（地圖連結用）
//   setting   'indoor' 室內｜'outdoor' 戶外｜'both' 都有
//   courts    幾面匹克球場（數字）
//   fee       費用，一句話（例如「每人每小時 150 元」）
//   hours     開放時間，一句話
//   booking   預約方式，可放多個：{ type: 'phone' | 'line' | 'url', label, value }
//   note      備註（選填）
export const VENUES = [];

export const VENUES_PAGE = {
  title: '找場地',
  en: 'Courts',
  intro: '可以打匹克球的場地，怎麼預約、怎麼去。',
  empty: '場地名錄整理中，很快會放上第一批合作場地。',
  settings: { indoor: '室內', outdoor: '戶外', both: '室內＋戶外' },
  courts: '{n} 面場',
  fee: '費用',
  hours: '開放時間',
  map: '地圖',
  meetup: '在這裡揪團',
  booking: { phone: '電話預約', line: 'LINE 預約', url: '線上預約' },
};
