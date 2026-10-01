// 首頁文字。slogan 每一行一個元素；概念先不講明，只留形象。
export const HOME = {
  slogan: ['Pick one,', 'pick a place,', 'picobo.'],
  entriesLabel: '從這裡開始',
  intro: '痞克柏是你的匹克球場邊夥伴。',
  courtAlt: '一個人在發球，對面亮起一塊發球區',
  // 首頁「安裝到桌面」小卡。Chrome、Edge、Android 有安裝按鈕；iPhone 只能手動加入主畫面。
  install: {
    title: '把痞克柏放到桌面',
    desc: '像 App 一樣從桌面打開，球場沒訊號也能用。',
    button: '安裝到桌面',
    ios: '點瀏覽器的「分享」按鈕，再選「加入主畫面」，就能像 App 一樣從桌面打開，沒訊號也能用。',
    mac: '在 Safari 上方選單點「檔案」，再選「加入 Dock」，就能像 App 一樣打開。',
    android: '點瀏覽器右上角的「⋮」選單，選「安裝應用程式」或「加到主畫面」，就能像 App 一樣從桌面打開。已經裝過的話，從桌面的痞克柏打開就好。',
    inApp: '在 LINE、Facebook、Instagram 裡打開的網頁不能安裝。點右上角的選單，選「用瀏覽器開啟」，再從 Chrome 或 Safari 安裝。',
    // 頂部列的安裝按鈕；瀏覽器沒給安裝視窗時（iPhone、iPad、Mac Safari、Android 剛移除過、
    // LINE 等 App 內建瀏覽器），按了改顯示上面的步驟。
    short: '安裝',
    aria: '把痞克柏安裝成 App',
    close: '知道了',
  },
  entries: [
    { route: 'rules', title: '學規則', en: 'Rules', desc: '看球場圖一步一步弄懂發球、廚房、計分，還有趣味玩法。' },
    { route: 'score', title: '計分板', en: 'Scoreboard', desc: '誰發球、站哪邊，按一下就算好。' },
    { route: 'draw', title: '抽籤輪轉', en: 'Draw', desc: '分組、輪轉賽、國王球場，人多也不亂。' },
  ],
};
