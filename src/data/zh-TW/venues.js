// 場地名錄（新加坡）。資料整理自場地官網、ActiveSG、onePA，以及 TheSmartLocal
// （2026-06-18 更新）和 SassyMama（2026-09-03 更新）的場地整理，2026-10-02 查核；2026-10-03 補私人付費場（官網為主）。
// 只放有地址來源的場地；來源互相矛盾或只有單一部落格提到的先不放。價格和時間會變，
// 頁面上註明以場地公告為準。區域（region）是依地址自行對應的 URA 分區。
// 欄位：
//   id        網址用的英數字代號（#meetup?venue=<id>）
//   name      場地名稱
//   city      區域，名錄依這個分組，陣列順序就是區域順序
//   address   地址（地圖連結用）
//   setting   'indoor' 室內｜'sheltered' 有頂棚｜'outdoor' 戶外；兩種都有就寫陣列，例如 ['sheltered', 'outdoor']
//   courts    幾面匹克球場（數字，不確定就不寫）
//   price     篩選用：非會員最低每小時場租（新幣，數字，0 是免費），照 fee 整理；fee 沒寫數字就不寫
//   operator  篩選用：'public' 公家（ActiveSG、CC、學校、組屋免費場）｜'private' 私人球館｜'club' 會員制俱樂部
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
const SCHOOL_NOTE = '學校禮堂（ActiveSG 開放給大眾），多半是晚上和週末，熱門時段要抽籤。';
const CHECK = '資料只有單一或非官方來源，出發前先確認。';
const school = (id, name, city, address) => ({ id, name, city, address, price: 3.5, operator: 'public', setting: 'indoor', fee: ACTIVESG_FEE, booking: [ACTIVESG], note: SCHOOL_NOTE, source: 'activesg.gov.sg pickleball venue list; moe.edu.sg school contact' });

export const VENUES = [
  // ===== 中區 =====
  { id: 'pickle-bones', price: 59.95, operator: 'private', name: 'Pickle & Bones @ TRIFECTA', city: '中區', address: 'Upper Deck, TRIFECTA, 10A Exeter Rd, Singapore 239958', setting: 'sheltered', courts: 1, fee: '非尖峰 S$59.95／小時，尖峰 S$70.85', hours: '每天 8:00–23:00', booking: [{ type: 'url', value: 'https://pickleandbones.playbypoint.com/book/PickleandBones' }, { type: 'whatsapp', value: '6580836643' }, { type: 'phone', value: '+65 8841 7080' }], note: 'Somerset 旁、TRIFECTA 頂層，另有 dink 練習區；可租球拍和球，有淋浴間。一次最多 12 人。', source: 'trifectasingapore.com/pickle-bones; TheSmartLocal; baseline.sg' },
  { id: 'ark-cuppage', price: 25, operator: 'private', name: 'ARK Pickle Cuppage', city: '中區', address: '51 Cuppage Rd, Level 10 Roof Garden, Singapore 229469', setting: ['indoor', 'outdoor'], courts: 2, fee: 'S$25／小時起', hours: '每天 8:00–23:00', booking: [{ type: 'url', value: 'https://www.theark.sg/pickleball/booking' }, { type: 'phone', value: '9185 2555' }], note: 'Cuppage Plaza 旁、舊 StarHub Centre 10 樓頂樓，Somerset 站走路約 4 分鐘。官網寫露天，開幕貼文寫室內有冷氣，看起來室內戶外都有，訂場時問清楚是哪一面。', source: 'theark.sg/pickleball/venue (Open Air); The Ark Facebook/IG 2026 opening post (indoors, sheltered, air-conditioned); TikTok (rooftop); Waze (phone)' },
  { id: 'kallang', price: 5.5, operator: 'public', name: 'The Kallang Hard Courts', city: '中區', address: '1 Stadium Drive, Singapore 397694', setting: 'outdoor', courts: 6, fee: '本地人 S$5.50–10／小時，外國人 S$8.50–15.50', hours: '平日 7:00–18:00（3 號場到 22:00），週末 7:00–22:00', booking: [{ type: 'url', value: 'https://thekallang.perfectgym.com/clientportal2/#/FacilityBooking?clubId=1&zoneTypeId=94' }], note: '國家體育場 13 號門旁，Stadium 站。', source: 'thekallang.com.sg/sport-fitness/pickleball' },
  { id: 'farrer-park', price: 3.5, operator: 'public', name: 'ActiveSG Courts @ Farrer Park', city: '中區', address: '5A Race Course Road, Singapore 219775', setting: 'sheltered', courts: 8, fee: ACTIVESG_FEE, hours: '週一至週六 9:00–21:00', booking: [ACTIVESG, { type: 'phone', value: '6293 9058' }], note: `舊巴士轉運站改建，2026 年 3 月啟用。${ACTIVESG_NOTE}`, source: 'activesgcircle.gov.sg; Sport Singapore 2026-03-14' },
  { id: 'delta', price: 3.5, operator: 'public', name: 'Delta Outdoor Courts', city: '中區', address: '900 Tiong Bahru Road, Singapore 158790', setting: 'outdoor', courts: 4, fee: ACTIVESG_FEE, booking: [ACTIVESG, { type: 'phone', value: '6203 9246' }], note: `4 面中有 2 面有遮蔽。${ACTIVESG_NOTE}`, source: 'activesg.gov.sg; TheSmartLocal' },
  { id: 'kings', price: 24, operator: 'private', name: 'Kings Pickleball Arena', city: '中區', address: '317 Outram Road, Holiday Inn Singapore Atrium, Singapore 169075', setting: 'outdoor', courts: 4, fee: '平日 S$24–42／小時，週末 S$30–42', hours: '每天 7:00 起', booking: [{ type: 'url', value: 'https://kingspickleballarena.com/' }, { type: 'phone', value: '8830 5345' }], note: '飯店旁，有遮陰和夜間照明。', source: 'TheSmartLocal; SassyMama' },
  { id: 'matchpoint', price: 40, operator: 'private', name: 'Matchpoint Inc', city: '中區', address: '6 Raffles Blvd #01-225/231 Marina Square, Singapore 039594', setting: 'indoor', courts: 1, fee: '非尖峰 S$40／小時，尖峰 S$60（8 人以內）', hours: '每天 8:00–23:00', booking: [{ type: 'url', value: 'https://matchpointinc.com.sg/book-game-event/' }, { type: 'phone', value: '+65 9109 0925' }], note: 'Marina Square 商場內。', source: 'TheSmartLocal; SassyMama' },
  { id: 'racket-jungle-dempsey', price: 29, operator: 'private', name: 'Racket Jungle Dempsey', city: '中區', address: '26A Dempsey Road, Singapore 247693', setting: 'outdoor', courts: 4, fee: '約 S$29–35／小時起，平日早上有折扣', hours: '每天 6:00–24:00', booking: [{ type: 'url', value: 'https://www.probuddy.com/', label: 'ProBuddy 預約' }], source: 'TheSmartLocal; SassyMama; PickleGO' },
  { id: 'telok-ayer', price: 29, operator: 'private', name: 'Telok Ayer Roof Terrace（Racket Jungle）', city: '中區', address: '51 Telok Ayer Street, Singapore 048441', setting: 'outdoor', courts: 2, fee: '約 S$29–35／小時', hours: '每天 7:00–22:00', booking: [{ type: 'url', value: 'https://www.probuddy.com/', label: 'ProBuddy 預約' }], note: '市區頂樓球場。', source: 'TheSmartLocal; SassyMama' },
  { id: 'picklechoo', price: 16.5, operator: 'private', name: 'PickleChoo Arena @ One-North', city: '中區', address: '11 Slim Barracks Rise, Centre for Movement, Singapore 138664', setting: 'outdoor', courts: 1, fee: 'S$16.50–20／小時', booking: [{ type: 'url', value: 'https://tagtennis.org/picklechoo-arena-one-north-book-a-pickleball-court/' }], note: '頂樓球場。', source: 'TheSmartLocal; SassyMama' },
  { id: 'one-fullerton', price: 40, operator: 'private', name: 'One Fullerton Pickleball Court', city: '中區', address: '1 Fullerton Road, Singapore 049213', setting: 'outdoor', courts: 1, fee: 'S$40／小時起；非房客要在飯店消費滿 S$20', hours: '每天 7:00–22:00', booking: [{ type: 'phone', value: '+65 6733 8388' }], note: 'Marina Bay 頂樓。', source: 'TheSmartLocal; SassyMama' },
  { id: 'red-quarters', price: 50, operator: 'private', name: 'RED Quarters', city: '中區', address: '26 Jalan Benaan Kapal, Singapore 399629', setting: 'indoor', courts: 1, fee: '非尖峰 S$50／小時，尖峰 S$70', booking: [{ type: 'url', value: 'https://floorballbyred.com/book/product/red-quarters-court-pickle-booking/' }, { type: 'phone', value: '9844 6228' }], source: 'TheSmartLocal; SassyMama' },
  { id: 'cairnhill-cc', price: 4, operator: 'public', name: 'Cairnhill CC', city: '中區', address: '1 Anthony Road, Singapore 229944', setting: 'indoor', fee: '約 S$4–10／小時', booking: [ONEPA, { type: 'phone', value: '6737 9537' }], note: `要整個場館一起訂。${CC_NOTE}`, source: 'onePA FAQ; picklesg.com 2026-02' },
  { id: 'tanglin-cc', price: 4, operator: 'public', name: 'Tanglin CC', city: '中區', address: '245 Whitley Road, Singapore 297829', setting: 'indoor', fee: '約 S$4–10／小時', booking: [ONEPA, { type: 'phone', value: '6251 3922' }], note: CC_NOTE, source: 'onePA FAQ; picklesg.com 2026-02' },
  { id: 'toa-payoh-east-cc', price: 4, operator: 'public', name: 'Toa Payoh East CC', city: '中區', address: '160 Lorong 6 Toa Payoh, Singapore 319380', setting: 'indoor', fee: '約 S$4–10／小時', booking: [ONEPA], note: CC_NOTE, source: 'onePA FAQ; picklesg.com 2026-02' },
  { id: 'toa-payoh-west-cc', price: 4, operator: 'public', name: 'Toa Payoh West CC', city: '中區', address: '200 Lorong 2 Toa Payoh, Singapore 319642', setting: 'indoor', fee: '約 S$4–10／小時', booking: [ONEPA], note: CC_NOTE, source: 'onePA FAQ; picklesg.com 2026-02' },

  { id: 'balmoral-novotel', price: 12, operator: 'private', name: 'Balmoral Pickleball Club（Novotel Stevens）', city: '中區', address: '32 Stevens Road #02-01, Singapore 258892', setting: 'outdoor', courts: 4, fee: '平日中午 S$12／小時起，晚上和週末 S$32（場地方 2026-04 價目；飯店網頁價格較高）', hours: '每天 7:00–22:00', booking: [{ type: 'url', value: 'https://playtomic.io/tenant/313718e6-7231-4414-99ae-bcf99f41d5ea', label: 'Playtomic 預約' }, { type: 'whatsapp', value: '6589021223' }], note: '從 Novotel Singapore on Stevens 進去，搭電梯到 2 樓。可租球拍和球。', source: 'balmoralpickleballclub.com (rates after 13 Apr 2026); novotel-singapore-stevens.com' },
  { id: 'mbp-suntec', price: 32, operator: 'private', name: 'MBP Sports @ Suntec City', city: '中區', address: '3 Temasek Blvd #04-01, Suntec City, Singapore 038983', fee: '離峰 S$32／小時，尖峰 S$44', booking: [{ type: 'url', value: 'https://mbpsports.com/locations', label: 'MBP Sports 預約' }, { type: 'phone', value: '+65 9644 7739' }], note: '從 Lobby M／M2b 上 4 樓。MBP 的匹克球主場，有淋浴間。', source: 'mbpsports.com/locations; mbpsports.com/pricing' },
  { id: 'mbp-marina-square', price: 32, operator: 'private', name: 'MBP Sports @ Marina Square', city: '中區', address: '6 Raffles Blvd #04-105, Marina Square, Singapore 039594', setting: 'outdoor', fee: '離峰 S$32／小時，尖峰 S$44', booking: [{ type: 'url', value: 'https://mbpsports.com/locations', label: 'MBP Sports 預約' }, { type: 'phone', value: '+65 9644 7739' }], note: '4 樓頂樓，網球、padel、匹克球共用；沒有淋浴間。', source: 'mbpsports.com/locations; mbpsports.com/pricing' },
  { id: 'new-bahru', price: 38, operator: 'private', name: 'Pickleball @ New Bahru', city: '中區', address: '46 Kim Yam Road, Singapore 239351', setting: 'indoor', courts: 2, fee: '離峰 S$38／小時，尖峰 S$48', booking: [{ type: 'url', value: 'https://app.acuityscheduling.com/schedule.php?owner=33373361' }], note: '學校區 2 樓禮堂，冷氣室內；2 週前開放預約。', source: 'Acuity booking page; newbahru.com/visit; Instagram' },
  { id: 'src-franklin', operator: 'private', name: 'SRC Franklin Pickleball Academy', city: '中區', address: 'SRC @ Ayer Rajah, Ayer Rajah Crescent (one-north)', courts: 9, booking: [{ type: 'url', value: 'https://src.franklinpickleball.com.sg/book/FranklinPickleballSingapore' }, { type: 'phone', value: '+65 9672 4205' }], note: '要先免費註冊才能預約；Grab 總部對面。2026 年 2 月開幕。', source: 'src.franklinpickleball.com.sg' },
  { id: 'astrium-csc', price: 27.25, operator: 'club', name: 'Chinese Swimming Club — The Astrium', city: '中區', address: '21 Amber Road, Singapore 439870', setting: 'indoor', fee: '離峰 S$27.25／小時，尖峰 S$38.15（含稅）', hours: '每天 8:00–22:00', booking: [{ type: 'url', value: 'https://csc.iontone.com', label: '會員預約' }, { type: 'phone', value: '6885 0677' }], note: '會員制俱樂部，Astrium 2 樓 Stellar Grand，LED 地板室內場。', source: 'chineseswimmingclub.org.sg (Stellar Grand)' },
  { id: 'spgg', price: 10.9, operator: 'club', name: 'SP Graduates’ Guild', city: '中區', address: '1010 Dover Road, Singapore 139658', setting: 'outdoor', courts: 3, fee: 'S$10.90／小時（優惠價），訪客每人 S$5.45', hours: '每天 8:00–21:00', booking: [{ type: 'url', value: 'https://www.spgg.org.sg/appointment/14', label: '會員預約' }, { type: 'phone', value: '6796 9988' }], note: '會員制，7 天前開放預約。', source: 'spgg.org.sg/pickleball-courts' },
  { id: 'buona-vista-cc', price: 4, operator: 'public', name: 'Buona Vista CC', city: '中區', address: '36 Holland Drive #01-01, Singapore 270036', setting: 'indoor', fee: '約 S$4–10／小時', booking: [ONEPA, { type: 'phone', value: '6778 5163' }], note: CC_NOTE, source: 'onePA FAQ; onePA CC page' },
  { id: 'thomson-cc', price: 6, operator: 'public', name: 'Thomson CC', city: '中區', address: '194 Upper Thomson Road, Singapore 574339', setting: 'indoor', courts: 3, fee: '離峰 S$6，尖峰 S$8', booking: [ONEPA, { type: 'phone', value: '6251 6344' }], note: '專用匹克球場，onePA 線上預約。', source: 'onePA ThomsonCC_PICKLEBALL; Thomson CC Facebook' },
  { id: 'marymount-cc', price: 6, operator: 'public', name: 'Marymount CC', city: '中區', address: '191 Sin Ming Avenue #01-01, Singapore 575738', setting: 'indoor', courts: 2, fee: '離峰 S$6，尖峰 S$8', booking: [ONEPA, { type: 'phone', value: '6451 5955' }], note: '專用匹克球場，onePA 線上預約。', source: 'onePA MarymountCC_PICKLEBALL; Marymount CC Facebook' },
  { id: 'bishan-cc', price: 4, operator: 'public', name: 'Bishan CC', city: '中區', address: '51 Bishan Street 13, Singapore 579799', setting: 'indoor', courts: 2, fee: '約 S$4–10／小時', booking: [ONEPA, { type: 'phone', value: '6259 4720' }], note: '社區會堂 1、2 號場羽球和匹克球共用。', source: 'Bishan CC Facebook (Dec 2025)' },
  { id: 'toa-payoh-south-cc', operator: 'public', name: 'Toa Payoh South CC', city: '中區', address: '1999 Lorong 8 Toa Payoh, Singapore 319258', setting: 'indoor', booking: [ONEPA, { type: 'phone', value: '6259 6602' }], note: `${CC_NOTE}${CHECK}`, source: 'picklesg.com; YouTube (not on onePA list)' },
  school('school-chij-st-theresas', "CHIJ St. Theresa's Convent", '中區', '160 Lower Delta Road, Singapore 099138'),
  school('school-gan-eng-seng', 'Gan Eng Seng School', '中區', '1 Henderson Road, Singapore 159561'),
  school('school-nanyang-pri', 'Nanyang Primary School', '中區', "52 King's Road, Singapore 268097"),
  school('school-new-town-pri', 'New Town Primary School', '中區', '300 Tanglin Halt Road, Singapore 148812'),
  { id: 'picklechoo-apex', operator: 'private', name: 'PickleChoo Apex @ Henderson', city: '中區', address: 'Rooftop, Apex @ Henderson, 201 Henderson Road, Singapore 159545', setting: 'outdoor', hours: '每天 6:00–22:00', booking: [{ type: 'url', value: 'https://www.planyo.com/booking.php?calendar=70415' }, { type: 'whatsapp', value: '6590298400' }], note: '頂樓球場，有觀眾席。', source: 'picklechoo.com/picklechoo-apex-court; tagtennis.org (official)' },
  { id: 'ppm-woodleigh', price: 24, operator: 'private', name: 'Pickle Padel Movement（PUB Recreation Club）', city: '中區', address: '48 Woodleigh Park, Singapore 357844', setting: 'outdoor', courts: 5, fee: '平日白天 S$24／小時，平日晚上和週末 S$35', booking: [{ type: 'url', value: 'https://app.playtomic.io/tenants/2987e8fb-6130-4508-a3e1-fe7a329d446f/reservations', label: 'Playtomic 預約' }, { type: 'whatsapp', value: '6594552851' }], note: 'PUB 康樂俱樂部裡，同一處另有 padel 場。', source: 'picklepadelmovement.com/pickle/court-bookings; /about' },
  { id: 'pixel-pickle', price: 33, operator: 'private', name: 'Pixel Pickle', city: '中區', address: 'Singapore Chinese Recreation Club, 49 Balestier Road, Singapore 329676', setting: 'sheltered', courts: 2, fee: '平日白天 S$33／小時，平日晚上和週末 S$38', booking: [{ type: 'url', value: 'https://pixelpickle.sg/book-courts' }, { type: 'phone', value: '+65 8083 9228' }], note: '中華遊藝會裡，有頂棚。', source: 'pixelpickle.sg/book-courts (official); paddlepickers.sg (courts)' },
  { id: 'picklepark-balestier', price: 28, operator: 'private', name: 'Picklepark @ Balestier 101', city: '中區', address: '101 Balestier Road, Singapore 329678', setting: 'sheltered', courts: 1, fee: '離峰 S$28／小時，尖峰 S$38', hours: '24 小時', booking: [{ type: 'url', value: 'https://www.pickleparksg.com/appointments' }, { type: 'phone', value: '+65 9114 4552' }], note: 'Ceylon Sports Club 裡的獨立有頂棚場，24 小時開放；可租發球機。訂了不能退。', source: 'pickleparksg.com (official)' },
  { id: 'ace-club-funan', price: 80, operator: 'private', name: 'Ace Club Tennis @ Funan', city: '中區', address: '107 North Bridge Road #04-19/21, Funan, Singapore 179105', setting: 'indoor', fee: '離峰 S$80／小時，尖峰 S$120（4 人以內）', booking: [{ type: 'url', value: 'https://aceclubtennis.simplybook.asia/v2/#book' }, { type: 'whatsapp', value: '6580885010' }], note: 'Funan 商場 4 樓，冷氣室內，網球和匹克球共用；有淋浴間和咖啡座，球拍可租。', source: 'aceclubtennis.com/indoor-pickleball-centre; capitaland.com Funan store page (#04-19 to 21); booking.page/aceclubtennis (rates)' },
  // ===== 東區 =====
  { id: 'sports-arina-expo', price: 30, operator: 'private', name: 'The Sports Arina（Expo）', city: '東區', address: '9 Somapah Road, Hall 7 Singapore Expo, Singapore 487370', setting: 'indoor', courts: 12, fee: '平日 S$30–45／小時，週末 S$40–45', hours: '每天 7:00–23:00', booking: [{ type: 'url', value: 'https://playtomic.com/clubs/sph?sport=PICKLEBALL', label: 'Playtomic 預約' }, { type: 'phone', value: '+65 9299 1795' }], note: '冷氣室內場。', source: 'TheSmartLocal; SassyMama' },
  { id: 'play-pickle-st-patricks', price: 40, operator: 'private', name: "Play! Pickle @ St Patrick's School", city: '東區', address: '490 East Coast Road, Singapore 429058', setting: 'sheltered', courts: 3, fee: 'S$40／小時', hours: '週五 18:30–21:30；週六日 8:00–20:00', booking: [PLAY_PICKLE], note: '2026 年 10 月新開。', source: 'playpickle.sg/court-booking' },
  { id: 'play-pickle-chai-chee', price: 15, operator: 'private', name: 'Play! Pickle Chai Chee', city: '東區', address: '750A Chai Chee Road, 8th Floor, Singapore 469001', setting: 'outdoor', courts: 4, fee: '平日白天 S$15／小時，晚上和週末 S$30', hours: '每天 8:00–22:00', booking: [PLAY_PICKLE], source: 'playpickle.sg/court-booking' },
  { id: 'picklelize', price: 20, operator: 'private', name: 'PickleliZe', city: '東區', address: '125 Pasir Ris Road, Singapore 519121', setting: 'indoor', courts: 2, fee: 'S$20／小時起', booking: [{ type: 'url', value: 'https://www.picklelize.com/' }], note: '可租發球機。', source: 'SassyMama' },
  { id: 'singapore-swimming-club', price: 8, operator: 'club', name: 'Singapore Swimming Club', city: '東區', address: '45 Tanjong Rhu Road, Singapore 436899', setting: 'outdoor', courts: 3, fee: '會員 S$8–10／小時，訪客另收費', booking: [{ type: 'url', value: 'https://sswimclub.org.sg/sport-facility/pickleball-court/' }, { type: 'phone', value: '+65 6342 3600' }], note: '會員制俱樂部。', source: 'TheSmartLocal; SassyMama' },
  { id: 'safra-tampines', price: 5.1, operator: 'club', name: 'SAFRA Tampines', city: '東區', address: '1/A Tampines Street 92, Singapore 528882', setting: 'outdoor', courts: 3, fee: '會員 S$3.30–7.20／小時，訪客 S$5.10–11.20', booking: [{ type: 'url', value: 'https://www.safra.sg/amenities-offerings/tennis-pickleball-courts' }, { type: 'phone', value: '6785 8800' }], note: '頂樓球場，在 mSAFRA 以網球場預約；可免費借球拍和球。', source: 'TheSmartLocal; SassyMama' },
  { id: 'bedok-north', price: 3.5, operator: 'public', name: 'ActiveSG Sport Park @ Bedok North', city: '東區', address: '3 Bedok North Street 2, Singapore 469643', setting: 'outdoor', fee: ACTIVESG_FEE, hours: '每天 7:00–22:00', booking: [ACTIVESG, { type: 'phone', value: '6443 5511' }], note: ACTIVESG_NOTE, source: 'activesg.gov.sg' },
  { id: 'bedok-south-14', price: 0, operator: 'public', name: 'Blk 14 Bedok South', city: '東區', address: '14 Bedok South Avenue 2, Singapore 460014', setting: 'outdoor', courts: 1, fee: '免費', note: FREE_NOTE, source: 'TheSmartLocal; SassyMama' },

  { id: 'performance-pickleball-beach-club', price: 32, operator: 'private', name: 'Performance Pickleball（Changi Beach Club）', city: '東區', address: '350 Cranwell Road, Singapore 509864', courts: 5, fee: '離峰 S$32／小時，尖峰 S$40', hours: '週一至四 9:00–24:00，週五至日 8:00–24:00', booking: [{ type: 'url', value: 'https://book.performancepickleball.org/book/performancepickleball' }, { type: 'whatsapp', value: '6588912037' }], note: 'Changi Beach Club 裡，軟墊球場，會錄影；每天 9:00 開放新時段。', source: 'performancepickleball.org (beachclub, court-booking)' },
  { id: 'bedok-stadium', price: 3.5, operator: 'public', name: 'Bedok Stadium', city: '東區', address: '1 Bedok North Street 2, Singapore 469642', fee: ACTIVESG_FEE, booking: [ACTIVESG], note: ACTIVESG_NOTE, source: 'activesg.gov.sg pickleball venue list' },
  school('school-changkat-pri', 'Changkat Primary School', '東區', '11 Simei Street 3, Singapore 529896'),
  school('school-damai-sec', 'Damai Secondary School', '東區', '4800 Bedok Reservoir Road, Singapore 479229'),
  school('school-junyuan-pri', 'Junyuan Primary School', '東區', '2 Tampines Street 91, Singapore 528906'),
  school('school-loyang-view-sec', 'Loyang View Secondary School', '東區', '12 Pasir Ris Street 11, Singapore 519073'),
  school('school-pasir-ris-pri', 'Pasir Ris Primary School', '東區', '5 Pasir Ris Street 21, Singapore 518968'),
  // ===== 西區 =====
  { id: 'jurong-play-grounds', price: 12, operator: 'private', name: 'Jurong Play Grounds', city: '西區', address: '2 Jurong Gateway Road, Singapore 608512', setting: 'outdoor', courts: 7, fee: '平日白天 S$12–18／小時，尖峰 S$32', booking: [{ type: 'url', value: 'https://app.smashing.sg/' }, { type: 'phone', value: '+65 6275 3155' }], note: '部分有遮陰；同一處另有 Straits Pickle Club 的 3 面場。', source: 'TheSmartLocal; SassyMama' },
  { id: 'straits-pickle-club', price: 18, operator: 'private', name: 'Straits Pickle Club', city: '西區', address: '2 Jurong Gateway Road, Singapore 608512', setting: 'outdoor', courts: 3, fee: '約 S$18–32／小時', booking: [{ type: 'url', value: 'https://straitspickleclub.com/court-booking' }], note: '在 Jurong Play Grounds 裡，有遮陰。', source: 'TheSmartLocal; SassyMama; straitspickleclub.com' },
  { id: 'jurong-town', price: 3.5, operator: 'public', name: 'ActiveSG Sport Village @ Jurong Town', city: '西區', address: '2 International Road, Singapore 619618', setting: 'outdoor', courts: 4, fee: ACTIVESG_FEE, hours: '每天 7:00–22:00', booking: [ACTIVESG, { type: 'phone', value: '6970 1619' }], note: `固定網子。${ACTIVESG_NOTE}`, source: 'activesg.gov.sg; TheSmartLocal' },
  { id: 'clementi-sport-hall', price: 3.5, operator: 'public', name: 'Clementi Sport Hall', city: '西區', address: '518 Clementi Avenue 3, Singapore 129907', setting: 'indoor', courts: 2, fee: ACTIVESG_FEE, booking: [ACTIVESG], note: ACTIVESG_NOTE, source: 'activesg.gov.sg; SassyMama' },
  { id: 'jurong-east-sport-hall', price: 3.5, operator: 'public', name: 'Jurong East Sport Hall', city: '西區', address: '21 Jurong East Street 31, Singapore 609517', setting: 'indoor', fee: ACTIVESG_FEE, hours: '每天 7:00–22:00', booking: [ACTIVESG, { type: 'phone', value: '6563 5052' }], note: ACTIVESG_NOTE, source: 'activesg.gov.sg' },
  { id: 'choa-chu-kang-outdoor', price: 3.5, operator: 'public', name: 'Choa Chu Kang Outdoor Courts', city: '西區', address: '1 Choa Chu Kang Street 53, Singapore 689236', setting: 'outdoor', fee: ACTIVESG_FEE, booking: [ACTIVESG], note: ACTIVESG_NOTE, source: 'activesg.gov.sg' },
  { id: 'safra-jurong', price: 5.1, operator: 'club', name: 'SAFRA Jurong', city: '西區', address: '333 Boon Lay Way, Singapore 649848', setting: 'outdoor', courts: 1, fee: '會員 S$3.30–7.20／小時，訪客 S$5.10–11.20', booking: [{ type: 'url', value: 'https://www.safra.sg/amenities-offerings/tennis-pickleball-courts' }, { type: 'phone', value: '6686 4333' }], source: 'TheSmartLocal' },
  { id: 'hillview-cc', price: 4, operator: 'public', name: 'Hillview CC', city: '西區', address: '1 Hillview Rise, Singapore 667970', setting: 'indoor', fee: '約 S$4–10／小時', booking: [ONEPA, { type: 'phone', value: '6515 0075' }], note: `要整個場館一起訂。${CC_NOTE}`, source: 'onePA FAQ; picklesg.com 2026-02' },
  { id: 'cck-central', price: 0, operator: 'public', name: 'Choa Chu Kang Central（Blk 233 一帶）', city: '西區', address: '233 Choa Chu Kang Central, Singapore 680233', setting: 'outdoor', courts: 4, fee: '免費', note: FREE_NOTE, source: 'TheSmartLocal; SassyMama' },
  { id: 'jurong-west-523', price: 0, operator: 'public', name: 'Jurong West Blk 523 一帶', city: '西區', address: '523 Jurong West Street 52, Singapore 640523', setting: 'outdoor', courts: 2, fee: '免費', note: FREE_NOTE, source: 'TheSmartLocal; SassyMama' },
  { id: 'segar-467', price: 0, operator: 'public', name: 'Blk 467 Segar Road', city: '西區', address: '467 Segar Road, Singapore 670467', setting: 'outdoor', fee: '免費', note: FREE_NOTE, source: 'TheSmartLocal; SassyMama' },

  { id: 'ark-sports-village', price: 20, operator: 'private', name: 'ARK Sports Village', city: '西區', address: '20A Segar Road, Singapore 679350', setting: 'sheltered', courts: 5, fee: 'S$20／小時起', hours: '每天 8:00–22:00', booking: [{ type: 'url', value: 'https://theark.sg/pickleball' }, { type: 'phone', value: '9185 2555' }], note: 'Bukit Panjang 高架橋下，有遮蔽。', source: 'theark.sg/pickleball; TheSmartLocal (hours)' },
  { id: 'nanyang-cc', operator: 'public', name: 'Nanyang CC', city: '西區', address: '60 Jurong West Street 91, Singapore 649040', setting: 'indoor', courts: 3, booking: [ONEPA, { type: 'phone', value: '6791 0395' }], note: `${CC_NOTE}${CHECK}`, source: 'Pickleheads (not on onePA list)' },
  school('school-dunearn-sec', 'Dunearn Secondary School', '西區', '21 Bukit Batok West Avenue 2, Singapore 659204'),
  school('school-greenridge-pri', 'Greenridge Primary School', '西區', '11 Jelapang Road, Singapore 677744'),
  school('school-hillgrove-sec', 'Hillgrove Secondary School', '西區', '10 Bukit Batok Street 52, Singapore 659250'),
  school('school-rulang-pri', 'Rulang Primary School', '西區', '6 Jurong West Street 52, Singapore 649295'),
  school('school-xingnan-pri', 'Xingnan Primary School', '西區', '5 Jurong West Street 91, Singapore 649036'),
  // ===== 北區 =====
  { id: 'bukit-canberra', price: 3.5, operator: 'public', name: 'Bukit Canberra Sport Hall', city: '北區', address: '21 Canberra Link, Singapore 756973', setting: 'indoor', courts: 2, fee: ACTIVESG_FEE, hours: '每天 7:00–22:00', booking: [ACTIVESG, { type: 'phone', value: '6374 5342' }], note: ACTIVESG_NOTE, source: 'activesg.gov.sg; TheSmartLocal' },
  { id: 'yishun-sport-hall', price: 3.5, operator: 'public', name: 'Yishun Sport Hall', city: '北區', address: '101 Yishun Avenue 1, Singapore 769130', setting: 'indoor', fee: ACTIVESG_FEE, hours: '每天 7:00–22:00', booking: [ACTIVESG, { type: 'phone', value: '6756 7416' }], note: ACTIVESG_NOTE, source: 'activesg.gov.sg' },
  { id: 'hometeamns-khatib', price: 23, operator: 'club', name: 'HomeTeamNS Khatib', city: '北區', address: '2 Yishun Walk, Singapore 767944', setting: 'outdoor', courts: 2, fee: '一般 S$23–28／小時，會員 S$15–20', booking: [{ type: 'phone', value: '+65 6708 6670' }], note: '4 樓頂樓球場。', source: 'TheSmartLocal' },
  { id: 'safra-yishun', price: 5.1, operator: 'club', name: 'SAFRA Yishun', city: '北區', address: '60 Yishun Avenue 4, Singapore 769027', setting: 'outdoor', courts: 1, fee: '會員 S$3.30–6.60／小時，訪客 S$5.10–10.20', booking: [{ type: 'url', value: 'https://www.safra.sg/amenities-offerings/tennis-pickleball-courts' }], source: 'TheSmartLocal' },

  school('school-chongfu', 'Chongfu School', '北區', '170 Yishun Avenue 6, Singapore 768959'),
  school('school-wellington-pri', 'Wellington Primary School', '北區', '10 Wellington Circle, Singapore 757702'),
  { id: 'pickle-up-occ', price: 38, operator: 'private', name: 'Pickle Up @ Orchid Country Club', city: '北區', address: '1 Orchid Club Road #01-34, Orchid Country Club, Singapore 769162', setting: 'indoor', courts: 6, fee: 'S$38–65／小時（看時段和場地等級；平日晚上和週末是尖峰）', hours: '週日至四 8:00–23:00，週五六 8:00–24:00', booking: [{ type: 'url', value: 'https://playtomic.com/clubs/pickle-up', label: 'Playtomic 預約' }, { type: 'whatsapp', value: '6589919858' }], note: '冷氣室內，另有獨立包廂場 The Dink Room；Yishun 站 B 出口有免費接駁車。2026 年 10 月開幕。', source: 'pickleupsg.com; pickleupsg.com/pricing; Playtomic' },
  { id: 'ark-pickle-occ', price: 25, operator: 'private', name: 'ARK Pickle @ Orchid Country Club', city: '北區', address: '1 Orchid Club Road, Level 3 Recreational Clubhouse, Singapore 769162', setting: 'sheltered', courts: 2, fee: 'S$25／小時起', hours: '每天 7:00–24:00（平日 17:00 後和週末是尖峰）', booking: [{ type: 'url', value: 'https://theark.sg/pickleball/venue' }, { type: 'whatsapp', value: '6591852555' }], note: '軟墊場地，一個月前開放預約。跟 Pickle Up 同一棟、不同經營者。', source: 'theark.sg/pickleball/venue; orchidclub.com/facilities/pickleball-courts' },
  { id: 'madpicklers', price: 38, operator: 'private', name: 'MADPICKLERS', city: '北區', address: '2 Gambas Crescent #01-21, Nordcom II, Singapore 757044', setting: 'indoor', courts: 1, fee: '離峰 S$38／小時，尖峰 S$48', hours: '24 小時', booking: [{ type: 'url', value: 'https://www.madpicklers.com/book' }, { type: 'phone', value: '+65 8608 1500' }], note: '冷氣室內，24 小時開放。', source: 'madpicklers.com/book; address from MADPICKLERS Facebook/IG posts' },
  // ===== 東北區 =====
  { id: 'play-pickle-serangoon', price: 38, operator: 'private', name: 'Play! Pickle Serangoon', city: '東北區', address: '756 Upper Serangoon Road #04-27, Singapore 534626', setting: 'indoor', courts: 5, fee: '平日白天 S$38／小時，晚上和週末 S$48（單打小場較便宜）', hours: '每天 7:00–24:00', booking: [PLAY_PICKLE], note: '冷氣室內，4 面標準場加 1 面單打場；15 天前開放預約。', source: 'playpickle.sg/court-booking' },
  { id: 'play-pickle-punggol', price: 10, operator: 'private', name: 'Play! Pickle Punggol', city: '東北區', address: '10 Tebing Lane, Singapore 828836', setting: ['sheltered', 'outdoor'], courts: 8, fee: '有頂棚場 S$20–35／小時，戶外 S$10–28', hours: '每天 7:00–24:00', booking: [PLAY_PICKLE, { type: 'phone', value: '8228 4334' }], note: '6 面有頂棚標準場、1 面單打場、1 面戶外場。有消息說 2026 年 10 月底租約到期可能關閉，去之前先確認。', source: 'playpickle.sg/court-booking; TheSmartLocal; paddlepickers.sg (closing end Oct 2026, unofficial)' },
  { id: 'sports-arina-jalan-kayu', price: 25, operator: 'private', name: 'The Sports Arina @ Jalan Kayu', city: '東北區', address: '20A Fernvale Rd, Singapore 799951', courts: 10, fee: '非會員 S$25–35／小時', hours: '每天 8:00–22:00', booking: [{ type: 'url', value: 'https://playtomic.com/clubs/tsa-jalan-kayu?sport=PICKLEBALL', label: 'Playtomic 預約' }, { type: 'phone', value: '+65 8088 1795' }], note: 'Thanggam 輕軌站附近，2026 年 4 月開幕。', source: 'TheSmartLocal' },
  { id: 'performance-pickleball-punggol', price: 32, operator: 'private', name: 'Performance Pickleball（Boathouse）', city: '東北區', address: '11 Northshore Drive #01-23, Singapore 828670', setting: 'sheltered', courts: 2, fee: '離峰 S$32／小時，尖峰 S$40', hours: '週一至四 9:00–24:00，週五至日 8:00–24:00', booking: [{ type: 'url', value: 'https://book.performancepickleball.org/book/performancepickleball' }, { type: 'whatsapp', value: '6588912037' }], note: 'Boathouse，室內有遮蔽；每天 9:00 開放新時段。', source: 'performancepickleball.org; TheSmartLocal' },
  { id: 'sengkang-outdoor', price: 3.5, operator: 'public', name: 'Sengkang Outdoor Pickleball Courts', city: '東北區', address: '57 Anchorvale Road, Singapore 544964', setting: 'outdoor', courts: 3, fee: ACTIVESG_FEE, hours: '每天 7:00–22:00', booking: [ACTIVESG, { type: 'phone', value: '6315 3574' }], note: ACTIVESG_NOTE, source: 'activesg.gov.sg' },
  { id: 'hougang-sport-hall', price: 3.5, operator: 'public', name: 'Hougang Sport Hall', city: '東北區', address: '93 Hougang Avenue 4, Singapore 538832', setting: 'indoor', fee: ACTIVESG_FEE, hours: '每天 7:00–22:00', booking: [ACTIVESG, { type: 'phone', value: '6315 8671' }], note: ACTIVESG_NOTE, source: 'activesg.gov.sg' },
  { id: 'hwi-yoh-cc', price: 4, operator: 'public', name: 'Hwi Yoh CC', city: '東北區', address: '535 Serangoon North Ave 4 #01-179, Singapore 550535', setting: 'indoor', fee: '約 S$4–10／小時', booking: [ONEPA, { type: 'phone', value: '6484 0338' }], note: CC_NOTE, source: 'onePA FAQ; picklesg.com 2026-02' },
  { id: 'kebun-baru-cc', price: 4, operator: 'public', name: 'Kebun Baru CC', city: '東北區', address: '216 Ang Mo Kio Avenue 4, Singapore 569897', setting: 'indoor', fee: '約 S$4–10／小時', booking: [ONEPA, { type: 'phone', value: '6457 7379' }], note: `要整個場館一起訂。${CC_NOTE}`, source: 'onePA FAQ; picklesg.com 2026-02' },
  { id: 'serangoon-north-546', price: 0, operator: 'public', name: 'Blk 546 Serangoon North', city: '東北區', address: '546 Serangoon North Ave 3, Singapore 550546', setting: 'sheltered', courts: 1, fee: '免費', note: FREE_NOTE, source: 'TheSmartLocal; SassyMama' },
  { id: 'yio-chu-kang-tennis', price: 3.5, operator: 'public', name: 'Yio Chu Kang Tennis Centre', city: '東北區', address: '200 Ang Mo Kio Avenue 9, Singapore 569770', setting: 'outdoor', fee: ACTIVESG_FEE, hours: '每天 7:00–22:00', booking: [ACTIVESG, { type: 'phone', value: '6482 4980' }], note: `據說只有 9A 小場畫了匹克球線，用 ActiveSG 訂網球小場。${CHECK}`, source: 'activesgcircle.gov.sg; Facebook; Pickleheads (not on ActiveSG pickleball list)' },
  { id: 'picklechoo-prime', operator: 'private', name: 'PickleChoo Prime', city: '東北區', address: 'Primax Building, 22 New Industrial Road, Singapore 536208', setting: 'outdoor', hours: '每天 6:00–22:00', booking: [{ type: 'url', value: 'https://www.planyo.com/booking.php?calendar=70182&mode=resource_list&planyo_lang=EN' }, { type: 'whatsapp', value: '6590298400' }], note: `TAG 網球學院經營，主要給長期包場。${CHECK}`, source: 'picklechoo.com/picklechoo-prime; tagtennis.org (official; its text says near Redhill, postal code says Hougang side)' },
  school('school-anderson-sec', 'Anderson Secondary School', '東北區', '10 Ang Mo Kio Street 53, Singapore 569206'),
  school('school-horizon-pri', 'Horizon Primary School', '東北區', '61 Edgedale Plains, Singapore 828819'),
  school('school-yangzheng-pri', 'Yangzheng Primary School', '東北區', '15 Serangoon Avenue 3, Singapore 556108'),
];

export const VENUES_PAGE = {
  title: '找場地',
  en: 'Courts',
  intro: '新加坡可以打匹克球的場地，怎麼預約、怎麼去。',
  disclaimer: '價格和時間整理自場地官網和網路整理（2026 年 10 月），可能會變，預約前以場地公告為準。',
  empty: '場地名錄整理中，很快會放上第一批合作場地。',
  settings: { indoor: '室內', sheltered: '有頂棚', outdoor: '戶外' },
  courts: '{n} 面場',
  fee: '費用',
  hours: '開放時間',
  map: '地圖',
  meetup: '在這裡揪團',
  booking: { phone: '電話預約', whatsapp: 'WhatsApp 預約', line: 'LINE 預約', url: '線上預約' },
  // 頂部：搜尋、區域。區域的短名稱對應上面 city 的值。
  search: '搜尋場地名稱或地址',
  regionLabel: '區域',
  regions: [{ id: '', label: '全部' }, { id: '中區', label: '中' }, { id: '東區', label: '東' }, { id: '西區', label: '西' }, { id: '北區', label: '北' }, { id: '東北區', label: '東北' }],
  // 篩選：愛心鈕、篩選鈕（打開面板）、排序。面板裡的選項同一排可以多選（或），不同排要同時符合（且）。
  favOnly: '只看最愛',
  filter: '篩選',
  filterTitle: '篩選場地',
  sortLabel: '排序',
  sorts: [{ id: 'region', label: '依區域' }, { id: 'price', label: '最便宜' }],
  priceLabel: '價位（每小時場租）',
  prices: [{ id: 'free', label: '免費' }, { id: 'low', label: 'S$10 以下' }, { id: 'mid', label: 'S$10–35' }, { id: 'high', label: 'S$35 以上' }],
  priceHint: '照非會員最便宜的時段算；沒寫價錢的場地，選了價位就不會出現。',
  opLabel: '類型',
  ops: [{ id: 'public', label: '公家場地' }, { id: 'private', label: '私人球館' }, { id: 'club', label: '會員俱樂部' }],
  opHint: '公家場地：ActiveSG、社區中心、學校、組屋免費場。',
  otherLabel: '其他',
  courtsLabel: '場地數',
  courtSteps: [{ id: 0, label: '不限' }, { id: 2, label: '2 面以上' }, { id: 4, label: '4 面以上' }, { id: 6, label: '6 面以上' }],
  others: [{ id: 'dry', label: '不怕下雨' }],
  clear: '清除',
  show: '看 {n} 個場地',
  // 場地卡右上角的愛心：存成最愛（只存在這支手機）。
  fav: '加到最愛',
  unfav: '從最愛移除',
  noFav: '還沒有最愛的場地。在場地卡右上角按愛心，就會出現在這裡。',
  count: '{n} 個場地',
  none: '沒有符合的場地，換個條件試試。',
  // 名錄最下面：不在名單上的場地（公寓球場、朋友的俱樂部）也能發報名訊息。
  unlisted: '在名錄以外的地方打（公寓球場、朋友的俱樂部）？自己打場地名稱也能',
};
