// 首頁文字。slogan 每一行一個元素；概念先不講明，只留形象。
export const HOME = {
  slogan: ['Pick a day,', 'pick a place,', 'picobo.'],
  entriesLabel: '從這裡開始',
  intro: '痞克柏，你的匹克球好夥伴。',
  // 頂部列的「安裝」按鈕和它跳出的步驟說明。
  install: {
    title: '把痞克柏放到桌面',
    ios: '點瀏覽器的「分享」按鈕，再選「加入主畫面」，就能像 App 一樣從桌面打開，沒訊號也能用。',
    mac: '在 Safari 上方選單點「檔案」，再選「加入 Dock」，就能像 App 一樣打開。',
    android: '點瀏覽器右上角的「⋮」選單，選「安裝應用程式」或「加到主畫面」，就能像 App 一樣從桌面打開。已經裝過的話，從桌面的痞克柏打開就好。',
    inApp: '在 LINE、Facebook、Instagram 裡打開的網頁不能安裝。點右上角的選單，選「用瀏覽器開啟」，再從 Chrome 或 Safari 安裝。',
    // 頂部列的安裝按鈕；瀏覽器沒給安裝視窗時（iPhone、iPad、Mac Safari、Android 剛移除過、
    // LINE 等 App 內建瀏覽器），按了改顯示上面的步驟。
    short: '安裝',
    aria: '把痞克柏安裝成 App',
    close: '知道了',
    // 裝好之後（或這個瀏覽器不能安裝時），同一個位置換成邀請朋友的分享 icon。
    invite: { aria: '邀請朋友一起用痞克柏', title: 'Picobo 痞克柏', text: '痞克柏：匹克球規則圖解、計分板、抽籤輪轉，打球一起用。' },
  },
  entries: [
    { route: 'score', title: '計分板', en: 'Scoreboard', desc: '輕鬆算好站位、發球、計分' },
    { route: 'draw', title: '抽籤輪轉', en: 'Draw', desc: '分組、輪轉賽、國王球場，人多也不亂。' },
    { route: 'rules', title: '學規則', en: 'Rules', desc: '圖解一步步搞懂規則' },
    { route: 'meetup', title: '揪團', en: 'Find Players', desc: '填時間地點缺幾人，一張卡丟到群組。' },
    { route: 'venues', title: '找場地', en: 'Courts', desc: '哪裡能打、怎麼預約、怎麼去，還能快速揪團。' },
    // 合作表單（Google 表單，不顯示站長 email）。新加坡的人也會來，所以中英並列。
    { href: 'https://forms.gle/X8Rsieeez7oDLZMFA', title: '找合作', en: 'Partner with us', desc: '場地、教練、品牌、活動' },
  ],
};
