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
  divisions: [
    { name: '男子雙打', en: "Men's Doubles", note: '預計 7 隊左右' },
    { name: '女子雙打', en: "Women's Doubles", note: '預計 5 隊左右' },
    { name: '混合雙打', en: 'Mixed Doubles', note: '預計 10 隊左右' },
  ],
  divisionsNote: '每人最多報兩項：男雙或女雙，再加混雙。',
  formatTitle: '賽制',
  format: [
    '先分組循環賽：同組每一隊都會打到，每隊至少打 4 場。',
    '每組前兩名晉級，打準決賽和決賽。',
    '女雙隊數較少，可能全部打循環，前兩名直接打決賽。',
  ],
  dayTitle: '當天流程',
  day: [
    { when: '上午', what: '男雙、女雙同時開打（球員不重疊，不會撞場）' },
    { when: '下午', what: '混雙' },
  ],
  scoringTitle: '計分',
  scoring: [
    '分組賽：一局 11 分，側出計分，要贏 2 分。',
    '準決賽、決賽：一局 15 分。',
  ],
  rulesLinks: [
    { href: '#rules/scoring', label: '側出計分怎麼算' },
    { href: '#rules/positions', label: '發球順序與站位' },
    { href: '#rules/kitchen', label: '廚房規則' },
  ],
  rankingTitle: '分組排名怎麼算',
  ranking: ['勝場數', '同勝場看兩隊對戰結果', '再看得失分差'],
  signupTitle: '報名',
  signupPending: '報名表單待公布',
  signupUrl: null,
};
