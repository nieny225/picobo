// 場地名錄（新加坡）。資料整理自場地官網、ActiveSG、onePA，以及 TheSmartLocal
// （2026-06-18 更新）和 SassyMama（2026-09-03 更新）的場地整理，2026-10-02 查核。
// 只放有地址來源的場地；來源互相矛盾或只有單一部落格提到的先不放。價格和時間會變，
// 頁面上註明以場地公告為準。區域（region）是依地址自行對應的 URA 分區。
// 欄位：
//   id        網址用的英數字代號（#meetup?venue=<id>）
//   name      場地名稱
//   city      區域，名錄依這個分組，陣列順序就是區域順序
//   address   地址（地圖連結用）
//   setting   'indoor' 室內｜'outdoor' 戶外｜'sheltered' 有頂棚｜'both' 室內＋戶外
//   courts    幾面匹克球場（數字，不確定就不寫）
//   fee       費用，一句話（新幣）
//   hours     開放時間，一句話
//   booking   預約方式：{ type: 'phone' | 'whatsapp' | 'line' | 'url', value, label? }
//   note      備註（選填）
//   source    資料來源（不顯示，查核用）

const ACTIVESG = { type: 'url', value: 'https://activesg.gov.sg', label: 'ActiveSG 預約' };
const ONEPA = { type: 'url', value: 'https://www.onepa.gov.sg/facilities', label: 'onePA 預約' };
const PLAY_PICKLE = { type: 'url', value: 'https://app.courtreserve.com/online/publicbookings/13455' };
const ACTIVESG_FEE = '公民／PR 約 S$3.50–9.50／小時（室內較便宜，尖峰較貴）';
const ACTIVESG_NOTE = '每次 1 小時、每天最多 2 個時段；尖峰時段 14 天前抽籤，其他時段 12 天前中午開放。';
const CC_NOTE = '社區中心羽球場兼用，網子通常要自備；部分要整個場館一起訂。';
const FREE_NOTE = '組屋區公共球場，不用預約，網子通常要自備。';

export const VENUES = [
  // ===== 中區 =====
  { id: 'pickle-bones', name: 'Pickle & Bones @ TRIFECTA', city: '中區', address: 'Upper Deck, TRIFECTA, 10A Exeter Rd, Singapore 239958', setting: 'sheltered', courts: 1, fee: '非尖峰 S$59.95／小時，尖峰 S$70.85', hours: '每天 8:00–23:00', booking: [{ type: 'url', value: 'https://pickleandbones.playbypoint.com/book/PickleandBones' }, { type: 'whatsapp', value: '6580836643' }, { type: 'phone', value: '+65 8841 7080' }], note: 'Somerset 旁、TRIFECTA 頂層，另有 dink 練習區；可租球拍和球，有淋浴間。一次最多 12 人。', source: 'trifectasingapore.com/pickle-bones; TheSmartLocal; baseline.sg' },
  { id: 'ark-cuppage', name: 'ARK Pickle Cuppage', city: '中區', address: '51 Cuppage Rd, Level 10 Roof Garden, Singapore 229469', setting: 'outdoor', courts: 2, fee: 'S$25／小時起', hours: '每天 8:00–23:00', booking: [{ type: 'url', value: 'https://www.theark.sg/pickleball/booking' }], note: 'Cuppage Plaza 旁、舊 StarHub Centre 10 樓頂樓花園，Somerset 站走路約 4 分鐘。', source: 'theark.sg/pickleball/venue; 51cuppage.com.sg; The Ark Facebook 2026' },
  { id: 'kallang', name: 'The Kallang Hard Courts', city: '中區', address: '1 Stadium Drive, Singapore 397694', setting: 'outdoor', courts: 6, fee: '本地人 S$5.50–10／小時，外國人 S$8.50–15.50', hours: '平日 7:00–18:00（3 號場到 22:00），週末 7:00–22:00', booking: [{ type: 'url', value: 'https://thekallang.perfectgym.com/clientportal2/#/FacilityBooking?clubId=1&zoneTypeId=94' }], note: '國家體育場 13 號門旁，Stadium 站。', source: 'thekallang.com.sg/sport-fitness/pickleball' },
  { id: 'farrer-park', name: 'ActiveSG Courts @ Farrer Park', city: '中區', address: '5A Race Course Road, Singapore 219775', setting: 'sheltered', courts: 8, fee: ACTIVESG_FEE, hours: '週一至週六 9:00–21:00', booking: [ACTIVESG, { type: 'phone', value: '6293 9058' }], note: `舊巴士轉運站改建，2026 年 3 月啟用。${ACTIVESG_NOTE}`, source: 'activesgcircle.gov.sg; Sport Singapore 2026-03-14' },
  { id: 'delta', name: 'Delta Outdoor Courts', city: '中區', address: '900 Tiong Bahru Road, Singapore 158790', setting: 'outdoor', courts: 4, fee: ACTIVESG_FEE, booking: [ACTIVESG, { type: 'phone', value: '6203 9246' }], note: `4 面中有 2 面有遮蔽。${ACTIVESG_NOTE}`, source: 'activesg.gov.sg; TheSmartLocal' },
  { id: 'kings', name: 'Kings Pickleball Arena', city: '中區', address: '317 Outram Road, Holiday Inn Singapore Atrium, Singapore 169075', setting: 'outdoor', courts: 4, fee: '平日 S$24–42／小時，週末 S$30–42', hours: '每天 7:00 起', booking: [{ type: 'url', value: 'https://kingspickleballarena.com/' }, { type: 'phone', value: '8830 5345' }], note: '飯店旁，有遮陰和夜間照明。', source: 'TheSmartLocal; SassyMama' },
  { id: 'matchpoint', name: 'Matchpoint Inc', city: '中區', address: '6 Raffles Blvd #01-225/231 Marina Square, Singapore 039594', setting: 'indoor', courts: 1, fee: '非尖峰 S$40／小時，尖峰 S$60（8 人以內）', hours: '每天 8:00–23:00', booking: [{ type: 'url', value: 'https://matchpointinc.com.sg/book-game-event/' }, { type: 'phone', value: '+65 9109 0925' }], note: 'Marina Square 商場內。', source: 'TheSmartLocal; SassyMama' },
  { id: 'racket-jungle-dempsey', name: 'Racket Jungle Dempsey', city: '中區', address: '26A Dempsey Road, Singapore 247693', setting: 'outdoor', courts: 4, fee: '約 S$29–35／小時起，平日早上有折扣', hours: '每天 6:00–24:00', booking: [{ type: 'url', value: 'https://www.probuddy.com/', label: 'ProBuddy 預約' }], source: 'TheSmartLocal; SassyMama; PickleGO' },
  { id: 'telok-ayer', name: 'Telok Ayer Roof Terrace（Racket Jungle）', city: '中區', address: '51 Telok Ayer Street, Singapore 048441', setting: 'outdoor', courts: 2, fee: '約 S$29–35／小時', hours: '每天 7:00–22:00', booking: [{ type: 'url', value: 'https://www.probuddy.com/', label: 'ProBuddy 預約' }], note: '市區頂樓球場。', source: 'TheSmartLocal; SassyMama' },
  { id: 'picklechoo', name: 'PickleChoo Arena @ One-North', city: '中區', address: '11 Slim Barracks Rise, Centre for Movement, Singapore 138664', setting: 'outdoor', courts: 1, fee: 'S$16.50–20／小時', booking: [{ type: 'url', value: 'https://tagtennis.org/picklechoo-arena-one-north-book-a-pickleball-court/' }], note: '頂樓球場。', source: 'TheSmartLocal; SassyMama' },
  { id: 'one-fullerton', name: 'One Fullerton Pickleball Court', city: '中區', address: '1 Fullerton Road, Singapore 049213', setting: 'outdoor', courts: 1, fee: 'S$40／小時起；非房客要在飯店消費滿 S$20', hours: '每天 7:00–22:00', booking: [{ type: 'phone', value: '+65 6733 8388' }], note: 'Marina Bay 頂樓。', source: 'TheSmartLocal; SassyMama' },
  { id: 'red-quarters', name: 'RED Quarters', city: '中區', address: '26 Jalan Benaan Kapal, Singapore 399629', setting: 'indoor', courts: 1, fee: '非尖峰 S$50／小時，尖峰 S$70', booking: [{ type: 'url', value: 'https://floorballbyred.com/book/product/red-quarters-court-pickle-booking/' }, { type: 'phone', value: '9844 6228' }], source: 'TheSmartLocal; SassyMama' },
  { id: 'cairnhill-cc', name: 'Cairnhill CC', city: '中區', address: '1 Anthony Road, Singapore 229944', setting: 'indoor', fee: '約 S$4–10／小時', booking: [ONEPA, { type: 'phone', value: '6737 9537' }], note: `要整個場館一起訂。${CC_NOTE}`, source: 'onePA FAQ; picklesg.com 2026-02' },
  { id: 'tanglin-cc', name: 'Tanglin CC', city: '中區', address: '245 Whitley Road, Singapore 297829', setting: 'indoor', fee: '約 S$4–10／小時', booking: [ONEPA, { type: 'phone', value: '6251 3922' }], note: CC_NOTE, source: 'onePA FAQ; picklesg.com 2026-02' },
  { id: 'toa-payoh-east-cc', name: 'Toa Payoh East CC', city: '中區', address: '160 Lorong 6 Toa Payoh, Singapore 319380', setting: 'indoor', fee: '約 S$4–10／小時', booking: [ONEPA], note: CC_NOTE, source: 'onePA FAQ; picklesg.com 2026-02' },
  { id: 'toa-payoh-west-cc', name: 'Toa Payoh West CC', city: '中區', address: '200 Lorong 2 Toa Payoh, Singapore 319642', setting: 'indoor', fee: '約 S$4–10／小時', booking: [ONEPA], note: CC_NOTE, source: 'onePA FAQ; picklesg.com 2026-02' },

  // ===== 東區 =====
  { id: 'sports-arina-expo', name: 'The Sports Arina（Expo）', city: '東區', address: '9 Somapah Road, Hall 7 Singapore Expo, Singapore 487370', setting: 'indoor', courts: 12, fee: '平日 S$30–45／小時，週末 S$40–45', hours: '每天 7:00–23:00', booking: [{ type: 'url', value: 'https://playtomic.com/clubs/sph?sport=PICKLEBALL', label: 'Playtomic 預約' }, { type: 'phone', value: '+65 9299 1795' }], note: '冷氣室內場。', source: 'TheSmartLocal; SassyMama' },
  { id: 'play-pickle-st-patricks', name: "Play! Pickle @ St Patrick's School", city: '東區', address: '490 East Coast Road, Singapore 429058', setting: 'sheltered', courts: 3, fee: 'S$40／小時', hours: '週五 18:30–21:30；週六日 8:00–20:00', booking: [PLAY_PICKLE], note: '2026 年 10 月新開。', source: 'playpickle.sg/court-booking' },
  { id: 'play-pickle-chai-chee', name: 'Play! Pickle Chai Chee', city: '東區', address: '750A Chai Chee Road, 8th Floor, Singapore 469001', setting: 'outdoor', courts: 4, fee: '平日白天 S$15／小時，晚上和週末 S$30', hours: '每天 8:00–22:00', booking: [PLAY_PICKLE], source: 'playpickle.sg/court-booking' },
  { id: 'picklelize', name: 'PickleliZe', city: '東區', address: '125 Pasir Ris Road, Singapore 519121', setting: 'indoor', courts: 2, fee: 'S$20／小時起', booking: [{ type: 'url', value: 'https://www.picklelize.com/' }], note: '可租發球機。', source: 'SassyMama' },
  { id: 'singapore-swimming-club', name: 'Singapore Swimming Club', city: '東區', address: '45 Tanjong Rhu Road, Singapore 436899', setting: 'outdoor', courts: 3, fee: '會員 S$8–10／小時，訪客另收費', booking: [{ type: 'url', value: 'https://sswimclub.org.sg/sport-facility/pickleball-court/' }, { type: 'phone', value: '+65 6342 3600' }], note: '會員制俱樂部。', source: 'TheSmartLocal; SassyMama' },
  { id: 'safra-tampines', name: 'SAFRA Tampines', city: '東區', address: '1/A Tampines Street 92, Singapore 528882', setting: 'outdoor', courts: 3, fee: '會員 S$3.30–7.20／小時，訪客 S$5.10–11.20', booking: [{ type: 'url', value: 'https://www.safra.sg/amenities-offerings/tennis-pickleball-courts' }, { type: 'phone', value: '6785 8800' }], note: '頂樓球場，在 mSAFRA 以網球場預約；可免費借球拍和球。', source: 'TheSmartLocal; SassyMama' },
  { id: 'bedok-north', name: 'ActiveSG Sport Park @ Bedok North', city: '東區', address: '3 Bedok North Street 2, Singapore 469643', setting: 'outdoor', fee: ACTIVESG_FEE, hours: '每天 7:00–22:00', booking: [ACTIVESG, { type: 'phone', value: '6443 5511' }], note: ACTIVESG_NOTE, source: 'activesg.gov.sg' },
  { id: 'bedok-south-14', name: 'Blk 14 Bedok South', city: '東區', address: '14 Bedok South Avenue 2, Singapore 460014', setting: 'outdoor', courts: 1, fee: '免費', note: FREE_NOTE, source: 'TheSmartLocal; SassyMama' },

  // ===== 西區 =====
  { id: 'jurong-play-grounds', name: 'Jurong Play Grounds', city: '西區', address: '2 Jurong Gateway Road, Singapore 608512', setting: 'outdoor', courts: 7, fee: '平日白天 S$12–18／小時，尖峰 S$32', booking: [{ type: 'url', value: 'https://app.smashing.sg/' }, { type: 'phone', value: '+65 6275 3155' }], note: '部分有遮陰；同一處另有 Straits Pickle Club 的 3 面場。', source: 'TheSmartLocal; SassyMama' },
  { id: 'straits-pickle-club', name: 'Straits Pickle Club', city: '西區', address: '2 Jurong Gateway Road, Singapore 608512', setting: 'outdoor', courts: 3, fee: '約 S$18–32／小時', booking: [{ type: 'url', value: 'https://straitspickleclub.com/court-booking' }], note: '在 Jurong Play Grounds 裡，有遮陰。', source: 'TheSmartLocal; SassyMama; straitspickleclub.com' },
  { id: 'jurong-town', name: 'ActiveSG Sport Village @ Jurong Town', city: '西區', address: '2 International Road, Singapore 619618', setting: 'outdoor', courts: 4, fee: ACTIVESG_FEE, hours: '每天 7:00–22:00', booking: [ACTIVESG, { type: 'phone', value: '6970 1619' }], note: `固定網子。${ACTIVESG_NOTE}`, source: 'activesg.gov.sg; TheSmartLocal' },
  { id: 'clementi-sport-hall', name: 'Clementi Sport Hall', city: '西區', address: '518 Clementi Avenue 3, Singapore 129907', setting: 'indoor', courts: 2, fee: ACTIVESG_FEE, booking: [ACTIVESG], note: ACTIVESG_NOTE, source: 'activesg.gov.sg; SassyMama' },
  { id: 'jurong-east-sport-hall', name: 'Jurong East Sport Hall', city: '西區', address: '21 Jurong East Street 31, Singapore 609517', setting: 'indoor', fee: ACTIVESG_FEE, hours: '每天 7:00–22:00', booking: [ACTIVESG, { type: 'phone', value: '6563 5052' }], note: ACTIVESG_NOTE, source: 'activesg.gov.sg' },
  { id: 'choa-chu-kang-outdoor', name: 'Choa Chu Kang Outdoor Courts', city: '西區', address: '1 Choa Chu Kang Street 53, Singapore 689236', setting: 'outdoor', fee: ACTIVESG_FEE, booking: [ACTIVESG], note: ACTIVESG_NOTE, source: 'activesg.gov.sg' },
  { id: 'safra-jurong', name: 'SAFRA Jurong', city: '西區', address: '333 Boon Lay Way, Singapore 649848', setting: 'outdoor', courts: 1, fee: '會員 S$3.30–7.20／小時，訪客 S$5.10–11.20', booking: [{ type: 'url', value: 'https://www.safra.sg/amenities-offerings/tennis-pickleball-courts' }, { type: 'phone', value: '6686 4333' }], source: 'TheSmartLocal' },
  { id: 'hillview-cc', name: 'Hillview CC', city: '西區', address: '1 Hillview Rise, Singapore 667970', setting: 'indoor', fee: '約 S$4–10／小時', booking: [ONEPA, { type: 'phone', value: '6515 0075' }], note: `要整個場館一起訂。${CC_NOTE}`, source: 'onePA FAQ; picklesg.com 2026-02' },
  { id: 'cck-central', name: 'Choa Chu Kang Central（Blk 233 一帶）', city: '西區', address: '233 Choa Chu Kang Central, Singapore 680233', setting: 'outdoor', courts: 4, fee: '免費', note: FREE_NOTE, source: 'TheSmartLocal; SassyMama' },
  { id: 'jurong-west-523', name: 'Jurong West Blk 523 一帶', city: '西區', address: '523 Jurong West Street 52, Singapore 640523', setting: 'outdoor', courts: 2, fee: '免費', note: FREE_NOTE, source: 'TheSmartLocal; SassyMama' },
  { id: 'segar-467', name: 'Blk 467 Segar Road', city: '西區', address: '467 Segar Road, Singapore 670467', setting: 'outdoor', fee: '免費', note: FREE_NOTE, source: 'TheSmartLocal; SassyMama' },

  // ===== 北區 =====
  { id: 'bukit-canberra', name: 'Bukit Canberra Sport Hall', city: '北區', address: '21 Canberra Link, Singapore 756973', setting: 'indoor', courts: 2, fee: ACTIVESG_FEE, hours: '每天 7:00–22:00', booking: [ACTIVESG, { type: 'phone', value: '6374 5342' }], note: ACTIVESG_NOTE, source: 'activesg.gov.sg; TheSmartLocal' },
  { id: 'yishun-sport-hall', name: 'Yishun Sport Hall', city: '北區', address: '101 Yishun Avenue 1, Singapore 769130', setting: 'indoor', fee: ACTIVESG_FEE, hours: '每天 7:00–22:00', booking: [ACTIVESG, { type: 'phone', value: '6756 7416' }], note: ACTIVESG_NOTE, source: 'activesg.gov.sg' },
  { id: 'hometeamns-khatib', name: 'HomeTeamNS Khatib', city: '北區', address: '2 Yishun Walk, Singapore 767944', setting: 'outdoor', courts: 2, fee: '一般 S$23–28／小時，會員 S$15–20', booking: [{ type: 'phone', value: '+65 6708 6670' }], note: '4 樓頂樓球場。', source: 'TheSmartLocal' },
  { id: 'safra-yishun', name: 'SAFRA Yishun', city: '北區', address: '60 Yishun Avenue 4, Singapore 769027', setting: 'outdoor', courts: 1, fee: '會員 S$3.30–6.60／小時，訪客 S$5.10–10.20', booking: [{ type: 'url', value: 'https://www.safra.sg/amenities-offerings/tennis-pickleball-courts' }], source: 'TheSmartLocal' },

  // ===== 東北區 =====
  { id: 'play-pickle-serangoon', name: 'Play! Pickle Serangoon', city: '東北區', address: '756 Upper Serangoon Road #04-27, Singapore 534626', setting: 'indoor', courts: 5, fee: '平日白天 S$38／小時，晚上和週末 S$48（單打小場較便宜）', hours: '每天 7:00–24:00', booking: [PLAY_PICKLE], note: '冷氣室內，4 面標準場加 1 面單打場；15 天前開放預約。', source: 'playpickle.sg/court-booking' },
  { id: 'play-pickle-punggol', name: 'Play! Pickle Punggol', city: '東北區', address: '10 Tebing Lane, Singapore 828836', setting: 'both', courts: 8, fee: '有頂棚場 S$20–35／小時，戶外 S$10–28', hours: '每天 7:00–24:00', booking: [PLAY_PICKLE, { type: 'phone', value: '8228 4334' }], note: '6 面有頂棚標準場、1 面單打場、1 面戶外場。', source: 'playpickle.sg/court-booking; TheSmartLocal' },
  { id: 'sports-arina-jalan-kayu', name: 'The Sports Arina @ Jalan Kayu', city: '東北區', address: '20A Fernvale Rd, Singapore 799951', courts: 10, fee: '非會員 S$25–35／小時', hours: '每天 8:00–22:00', booking: [{ type: 'url', value: 'https://playtomic.com/clubs/tsa-jalan-kayu?sport=PICKLEBALL', label: 'Playtomic 預約' }, { type: 'phone', value: '+65 8088 1795' }], note: 'Thanggam 輕軌站附近，2026 年 4 月開幕。', source: 'TheSmartLocal' },
  { id: 'performance-pickleball-punggol', name: 'Performance Pickleball Punggol', city: '東北區', address: '11 Northshore Drive #01-23, Singapore 828670', setting: 'sheltered', courts: 2, fee: '約 S$32–40／小時', booking: [{ type: 'url', value: 'https://app.courtreserve.com/', label: 'CourtReserve 預約' }], note: '每天 9:00 開放 14 天後的時段。', source: 'TheSmartLocal; SassyMama' },
  { id: 'sengkang-outdoor', name: 'Sengkang Outdoor Pickleball Courts', city: '東北區', address: '57 Anchorvale Road, Singapore 544964', setting: 'outdoor', courts: 3, fee: ACTIVESG_FEE, hours: '每天 7:00–22:00', booking: [ACTIVESG, { type: 'phone', value: '6315 3574' }], note: ACTIVESG_NOTE, source: 'activesg.gov.sg' },
  { id: 'hougang-sport-hall', name: 'Hougang Sport Hall', city: '東北區', address: '93 Hougang Avenue 4, Singapore 538832', setting: 'indoor', fee: ACTIVESG_FEE, hours: '每天 7:00–22:00', booking: [ACTIVESG, { type: 'phone', value: '6315 8671' }], note: ACTIVESG_NOTE, source: 'activesg.gov.sg' },
  { id: 'hwi-yoh-cc', name: 'Hwi Yoh CC', city: '東北區', address: '535 Serangoon North Ave 4 #01-179, Singapore 550535', setting: 'indoor', fee: '約 S$4–10／小時', booking: [ONEPA, { type: 'phone', value: '6484 0338' }], note: CC_NOTE, source: 'onePA FAQ; picklesg.com 2026-02' },
  { id: 'kebun-baru-cc', name: 'Kebun Baru CC', city: '東北區', address: '216 Ang Mo Kio Avenue 4, Singapore 569897', setting: 'indoor', fee: '約 S$4–10／小時', booking: [ONEPA, { type: 'phone', value: '6457 7379' }], note: `要整個場館一起訂。${CC_NOTE}`, source: 'onePA FAQ; picklesg.com 2026-02' },
  { id: 'serangoon-north-546', name: 'Blk 546 Serangoon North', city: '東北區', address: '546 Serangoon North Ave 3, Singapore 550546', setting: 'sheltered', courts: 1, fee: '免費', note: FREE_NOTE, source: 'TheSmartLocal; SassyMama' },
];

export const VENUES_PAGE = {
  title: '找場地',
  en: 'Courts',
  intro: '新加坡可以打匹克球的場地，怎麼預約、怎麼去。',
  disclaimer: '價格和時間整理自場地官網和網路整理（2026 年 10 月），可能會變，預約前以場地公告為準。',
  empty: '場地名錄整理中，很快會放上第一批合作場地。',
  settings: { indoor: '室內', outdoor: '戶外', sheltered: '有頂棚', both: '室內＋戶外' },
  courts: '{n} 面場',
  fee: '費用',
  hours: '開放時間',
  map: '地圖',
  meetup: '在這裡揪團',
  booking: { phone: '電話預約', whatsapp: 'WhatsApp 預約', line: 'LINE 預約', url: '線上預約' },
  // 頂部篩選：搜尋、區域、類型。區域的短名稱對應上面 city 的值。
  search: '搜尋場地名稱或地址',
  regionLabel: '區域',
  regions: [{ id: '', label: '全部' }, { id: '中區', label: '中' }, { id: '東區', label: '東' }, { id: '西區', label: '西' }, { id: '北區', label: '北' }, { id: '東北區', label: '東北' }],
  kindLabel: '類型',
  kinds: [{ id: '', label: '全部' }, { id: 'fav', label: '♥ 最愛' }, { id: 'dry', label: '不怕下雨' }, { id: 'free', label: '免費' }],
  // 場地卡右上角的愛心：存成最愛（只存在這支手機）。
  fav: '加到最愛',
  unfav: '從最愛移除',
  noFav: '還沒有最愛的場地。在場地卡右上角按愛心，就會出現在這裡。',
  count: '{n} 個場地',
  none: '沒有符合的場地，換個條件試試。',
  // 名錄最下面：不在名單上的場地（公寓球場、朋友的俱樂部）也能發報名訊息。
  unlisted: '在名錄以外的地方打（公寓球場、朋友的俱樂部）？自己打場地名稱也能',
  free: '免費',
};
