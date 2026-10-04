// 场地名录（新加坡）。资料整理自场地官网、ActiveSG、onePA，以及 TheSmartLocal
// （2026-06-18 更新）和 SassyMama（2026-09-03 更新）的场地整理，2026-10-02 核对；2026-10-03 补私人付费场（以官网为主）。
// 只收有地址来源的场地；来源互相矛盾或只有单一博客提到的先不收。价格和时间会变，
// 页面上注明以场地公告为准。区域（region）是按地址自行对应的 URA 分区。
// 字段：
//   id        网址用的英数字代号（#meetup?venue=<id>）
//   name      场地名称
//   city      区域，名录按这个分组，数组顺序就是区域顺序
//   address   地址（地图链接用）
//   setting   'indoor' 室内｜'sheltered' 有顶棚｜'outdoor' 户外；两种都有就写数组，例如 ['sheltered', 'outdoor']
//   courts    几片匹克球场（数字，不确定就不写）
//   price     筛选用：非会员最低每小时场租（新币，数字，0 是免费），照 fee 整理；fee 没写数字就不写
//   operator  筛选用：'public' 公家｜'private' 私人球馆｜'club' 会员制俱乐部
//   fee       费用，一句话（新币）
//   hours     开放时间，一句话
//   booking   预约方式：{ type: 'phone' | 'whatsapp' | 'line' | 'url', value, label? }
//   note      备注（选填）
//   source    资料来源（不显示，核对用）

const ACTIVESG = { type: 'url', value: 'https://activesg.gov.sg', label: 'ActiveSG 预约' };
const ONEPA = { type: 'url', value: 'https://www.onepa.gov.sg/facilities', label: 'onePA 预约' };
const PLAY_PICKLE = { type: 'url', value: 'https://app.courtreserve.com/online/publicbookings/13455' };
const ACTIVESG_FEE = '公民／PR 约 S$3.50–9.50／小时（室内较便宜，高峰较贵）';
const ACTIVESG_NOTE = '每次 1 小时、每天最多 2 个时段；高峰时段 14 天前抽签，其他时段 12 天前中午开放。';
const CC_NOTE = '民众俱乐部羽毛球场兼用，网通常要自备；部分要整个场馆一起订。';
const FREE_NOTE = '组屋区公共球场，不用预约，网通常要自备。';
const SCHOOL_NOTE = '学校礼堂（通过 ActiveSG 对公众开放），多半是晚上和周末，热门时段要抽签。';
const CHECK = '资料只有单一或非官方来源，出发前先确认。';
const school = (id, name, city, address) => ({ id, country: 'sg', name, city, address, price: 3.5, operator: 'public', setting: 'indoor', fee: ACTIVESG_FEE, booking: [ACTIVESG], note: SCHOOL_NOTE, source: 'activesg.gov.sg pickleball venue list; moe.edu.sg school contact' });

export const VENUES = [
  // ===== 中区 =====
  { id: 'pickle-bones', country: 'sg', price: 59.95, operator: 'private', name: 'Pickle & Bones @ TRIFECTA', city: '中区', address: 'Upper Deck, TRIFECTA, 10A Exeter Rd, Singapore 239958', setting: 'sheltered', courts: 1, fee: '非高峰 S$59.95／小时，高峰 S$70.85', hours: '每天 8:00–23:00', booking: [{ type: 'url', value: 'https://pickleandbones.playbypoint.com/book/PickleandBones' }, { type: 'whatsapp', value: '6580836643' }, { type: 'phone', value: '+65 8841 7080' }], note: 'Somerset 旁、TRIFECTA 顶层，另有 dink 练习区；可租球拍和球，有淋浴间。一次最多 12 人。', source: 'trifectasingapore.com/pickle-bones; TheSmartLocal; baseline.sg' },
  { id: 'ark-cuppage', country: 'sg', price: 25, operator: 'private', name: 'ARK Pickle Cuppage', city: '中区', address: '51 Cuppage Rd, Level 10 Roof Garden, Singapore 229469', setting: ['indoor', 'outdoor'], courts: 2, fee: 'S$25／小时起', hours: '每天 8:00–23:00', booking: [{ type: 'url', value: 'https://www.theark.sg/pickleball/booking' }, { type: 'phone', value: '9185 2555' }], note: 'Cuppage Plaza 旁、旧 StarHub Centre 10 楼顶楼，Somerset 站步行约 4 分钟。官网写露天，开幕贴文写室内有冷气，看起来室内户外都有，订场时问清楚是哪一片。', source: 'theark.sg/pickleball/venue (Open Air); The Ark Facebook/IG 2026 opening post (indoors, sheltered, air-conditioned); TikTok (rooftop); Waze (phone)' },
  { id: 'kallang', country: 'sg', price: 5.5, operator: 'public', name: 'The Kallang Hard Courts', city: '中区', address: '1 Stadium Drive, Singapore 397694', setting: 'outdoor', courts: 6, fee: '本地人 S$5.50–10／小时，外国人 S$8.50–15.50', hours: '平日 7:00–18:00（3 号场到 22:00），周末 7:00–22:00', booking: [{ type: 'url', value: 'https://thekallang.perfectgym.com/clientportal2/#/FacilityBooking?clubId=1&zoneTypeId=94' }], note: '国家体育场 13 号门旁，Stadium 站。', source: 'thekallang.com.sg/sport-fitness/pickleball' },
  { id: 'farrer-park', country: 'sg', price: 3.5, operator: 'public', name: 'ActiveSG Courts @ Farrer Park', city: '中区', address: '5A Race Course Road, Singapore 219775', setting: 'sheltered', courts: 8, fee: ACTIVESG_FEE, hours: '周一至周六 9:00–21:00', booking: [ACTIVESG, { type: 'phone', value: '6293 9058' }], note: `旧巴士转换站改建，2026 年 3 月启用。${ACTIVESG_NOTE}`, source: 'activesgcircle.gov.sg; Sport Singapore 2026-03-14' },
  { id: 'delta', country: 'sg', price: 3.5, operator: 'public', name: 'Delta Outdoor Courts', city: '中区', address: '900 Tiong Bahru Road, Singapore 158790', setting: 'outdoor', courts: 4, fee: ACTIVESG_FEE, booking: [ACTIVESG, { type: 'phone', value: '6203 9246' }], note: `4 片中有 2 片有遮蔽。${ACTIVESG_NOTE}`, source: 'activesg.gov.sg; TheSmartLocal' },
  { id: 'kings', country: 'sg', price: 24, operator: 'private', name: 'Kings Pickleball Arena', city: '中区', address: '317 Outram Road, Holiday Inn Singapore Atrium, Singapore 169075', setting: 'outdoor', courts: 4, fee: '平日 S$24–42／小时，周末 S$30–42', hours: '每天 7:00 起', booking: [{ type: 'url', value: 'https://kingspickleballarena.com/' }, { type: 'phone', value: '8830 5345' }], note: '酒店旁，有遮阴和夜间照明。', source: 'TheSmartLocal; SassyMama' },
  { id: 'matchpoint', country: 'sg', price: 40, operator: 'private', name: 'Matchpoint Inc', city: '中区', address: '6 Raffles Blvd #01-225/231 Marina Square, Singapore 039594', setting: 'indoor', courts: 1, fee: '非高峰 S$40／小时，高峰 S$60（8 人以内）', hours: '每天 8:00–23:00', booking: [{ type: 'url', value: 'https://matchpointinc.com.sg/book-game-event/' }, { type: 'phone', value: '+65 9109 0925' }], note: 'Marina Square 商场内。', source: 'TheSmartLocal; SassyMama' },
  { id: 'racket-jungle-dempsey', country: 'sg', price: 29, operator: 'private', name: 'Racket Jungle Dempsey', city: '中区', address: '26A Dempsey Road, Singapore 247693', setting: 'outdoor', courts: 4, fee: '约 S$29–35／小时起，平日早上有折扣', hours: '每天 6:00–24:00', booking: [{ type: 'url', value: 'https://www.probuddy.com/', label: 'ProBuddy 预约' }], source: 'TheSmartLocal; SassyMama; PickleGO' },
  { id: 'telok-ayer', country: 'sg', price: 29, operator: 'private', name: 'Telok Ayer Roof Terrace（Racket Jungle）', city: '中区', address: '51 Telok Ayer Street, Singapore 048441', setting: 'outdoor', courts: 2, fee: '约 S$29–35／小时', hours: '每天 7:00–22:00', booking: [{ type: 'url', value: 'https://www.probuddy.com/', label: 'ProBuddy 预约' }], note: '市区顶楼球场。', source: 'TheSmartLocal; SassyMama' },
  { id: 'picklechoo', country: 'sg', price: 16.5, operator: 'private', name: 'PickleChoo Arena @ One-North', city: '中区', address: '11 Slim Barracks Rise, Centre for Movement, Singapore 138664', setting: 'outdoor', courts: 1, fee: 'S$16.50–20／小时', booking: [{ type: 'url', value: 'https://tagtennis.org/picklechoo-arena-one-north-book-a-pickleball-court/' }], note: '顶楼球场。', source: 'TheSmartLocal; SassyMama' },
  { id: 'one-fullerton', country: 'sg', price: 40, operator: 'private', name: 'One Fullerton Pickleball Court', city: '中区', address: '1 Fullerton Road, Singapore 049213', setting: 'outdoor', courts: 1, fee: 'S$40／小时起；非住客要在酒店消费满 S$20', hours: '每天 7:00–22:00', booking: [{ type: 'phone', value: '+65 6733 8388' }], note: 'Marina Bay 顶楼。', source: 'TheSmartLocal; SassyMama' },
  { id: 'red-quarters', country: 'sg', price: 50, operator: 'private', name: 'RED Quarters', city: '中区', address: '26 Jalan Benaan Kapal, Singapore 399629', setting: 'indoor', courts: 1, fee: '非高峰 S$50／小时，高峰 S$70', booking: [{ type: 'url', value: 'https://floorballbyred.com/book/product/red-quarters-court-pickle-booking/' }, { type: 'phone', value: '9844 6228' }], source: 'TheSmartLocal; SassyMama' },
  { id: 'cairnhill-cc', country: 'sg', price: 4, operator: 'public', name: 'Cairnhill CC', city: '中区', address: '1 Anthony Road, Singapore 229944', setting: 'indoor', fee: '约 S$4–10／小时', booking: [ONEPA, { type: 'phone', value: '6737 9537' }], note: `要整个场馆一起订。${CC_NOTE}`, source: 'onePA FAQ; picklesg.com 2026-02' },
  { id: 'tanglin-cc', country: 'sg', price: 4, operator: 'public', name: 'Tanglin CC', city: '中区', address: '245 Whitley Road, Singapore 297829', setting: 'indoor', fee: '约 S$4–10／小时', booking: [ONEPA, { type: 'phone', value: '6251 3922' }], note: CC_NOTE, source: 'onePA FAQ; picklesg.com 2026-02' },
  { id: 'toa-payoh-east-cc', country: 'sg', price: 4, operator: 'public', name: 'Toa Payoh East CC', city: '中区', address: '160 Lorong 6 Toa Payoh, Singapore 319380', setting: 'indoor', fee: '约 S$4–10／小时', booking: [ONEPA], note: CC_NOTE, source: 'onePA FAQ; picklesg.com 2026-02' },
  { id: 'toa-payoh-west-cc', country: 'sg', price: 4, operator: 'public', name: 'Toa Payoh West CC', city: '中区', address: '200 Lorong 2 Toa Payoh, Singapore 319642', setting: 'indoor', fee: '约 S$4–10／小时', booking: [ONEPA], note: CC_NOTE, source: 'onePA FAQ; picklesg.com 2026-02' },

  { id: 'balmoral-novotel', country: 'sg', price: 12, operator: 'private', name: 'Balmoral Pickleball Club（Novotel Stevens）', city: '中区', address: '32 Stevens Road #02-01, Singapore 258892', setting: 'outdoor', courts: 4, fee: '平日中午 S$12／小时起，晚上和周末 S$32（场地方 2026-04 价目；酒店网页价格较高）', hours: '每天 7:00–22:00', booking: [{ type: 'url', value: 'https://playtomic.io/tenant/313718e6-7231-4414-99ae-bcf99f41d5ea', label: 'Playtomic 预约' }, { type: 'whatsapp', value: '6589021223' }], note: '从 Novotel Singapore on Stevens 进去，搭电梯到 2 楼。可租球拍和球。', source: 'balmoralpickleballclub.com (rates after 13 Apr 2026); novotel-singapore-stevens.com' },
  { id: 'mbp-suntec', country: 'sg', price: 32, operator: 'private', name: 'MBP Sports @ Suntec City', city: '中区', address: '3 Temasek Blvd #04-01, Suntec City, Singapore 038983', fee: '非高峰 S$32／小时，高峰 S$44', booking: [{ type: 'url', value: 'https://mbpsports.com/locations', label: 'MBP Sports 预约' }, { type: 'phone', value: '+65 9644 7739' }], note: '从 Lobby M／M2b 上 4 楼。MBP 的匹克球主场，有淋浴间。', source: 'mbpsports.com/locations; mbpsports.com/pricing' },
  { id: 'mbp-marina-square', country: 'sg', price: 32, operator: 'private', name: 'MBP Sports @ Marina Square', city: '中区', address: '6 Raffles Blvd #04-105, Marina Square, Singapore 039594', setting: 'outdoor', fee: '非高峰 S$32／小时，高峰 S$44', booking: [{ type: 'url', value: 'https://mbpsports.com/locations', label: 'MBP Sports 预约' }, { type: 'phone', value: '+65 9644 7739' }], note: '4 楼顶楼，网球、padel、匹克球共用；没有淋浴间。', source: 'mbpsports.com/locations; mbpsports.com/pricing' },
  { id: 'new-bahru', country: 'sg', price: 38, operator: 'private', name: 'Pickleball @ New Bahru', city: '中区', address: '46 Kim Yam Road, Singapore 239351', setting: 'indoor', courts: 2, fee: '非高峰 S$38／小时，高峰 S$48', booking: [{ type: 'url', value: 'https://app.acuityscheduling.com/schedule.php?owner=33373361' }], note: '学校区 2 楼礼堂，冷气室内；2 周前开放预约。', source: 'Acuity booking page; newbahru.com/visit; Instagram' },
  { id: 'src-franklin', country: 'sg', operator: 'private', name: 'SRC Franklin Pickleball Academy', city: '中区', address: 'SRC @ Ayer Rajah, Ayer Rajah Crescent (one-north)', courts: 9, booking: [{ type: 'url', value: 'https://src.franklinpickleball.com.sg/book/FranklinPickleballSingapore' }, { type: 'phone', value: '+65 9672 4205' }], note: '要先免费注册才能预约；Grab 总部对面。2026 年 2 月开幕。', source: 'src.franklinpickleball.com.sg' },
  { id: 'astrium-csc', country: 'sg', price: 27.25, operator: 'club', name: 'Chinese Swimming Club — The Astrium', city: '中区', address: '21 Amber Road, Singapore 439870', setting: 'indoor', fee: '非高峰 S$27.25／小时，高峰 S$38.15（含税）', hours: '每天 8:00–22:00', booking: [{ type: 'url', value: 'https://csc.iontone.com', label: '会员预约' }, { type: 'phone', value: '6885 0677' }], note: '会员制俱乐部，Astrium 2 楼 Stellar Grand，LED 地板室内场。', source: 'chineseswimmingclub.org.sg (Stellar Grand)' },
  { id: 'spgg', country: 'sg', price: 10.9, operator: 'club', name: 'SP Graduates’ Guild', city: '中区', address: '1010 Dover Road, Singapore 139658', setting: 'outdoor', courts: 3, fee: 'S$10.90／小时（优惠价），访客每人 S$5.45', hours: '每天 8:00–21:00', booking: [{ type: 'url', value: 'https://www.spgg.org.sg/appointment/14', label: '会员预约' }, { type: 'phone', value: '6796 9988' }], note: '会员制，7 天前开放预约。', source: 'spgg.org.sg/pickleball-courts' },
  { id: 'buona-vista-cc', country: 'sg', price: 4, operator: 'public', name: 'Buona Vista CC', city: '中区', address: '36 Holland Drive #01-01, Singapore 270036', setting: 'indoor', fee: '约 S$4–10／小时', booking: [ONEPA, { type: 'phone', value: '6778 5163' }], note: CC_NOTE, source: 'onePA FAQ; onePA CC page' },
  { id: 'thomson-cc', country: 'sg', price: 6, operator: 'public', name: 'Thomson CC', city: '中区', address: '194 Upper Thomson Road, Singapore 574339', setting: 'indoor', courts: 3, fee: '非高峰 S$6，高峰 S$8', booking: [ONEPA, { type: 'phone', value: '6251 6344' }], note: '专用匹克球场，onePA 在线预约。', source: 'onePA ThomsonCC_PICKLEBALL; Thomson CC Facebook' },
  { id: 'marymount-cc', country: 'sg', price: 6, operator: 'public', name: 'Marymount CC', city: '中区', address: '191 Sin Ming Avenue #01-01, Singapore 575738', setting: 'indoor', courts: 2, fee: '非高峰 S$6，高峰 S$8', booking: [ONEPA, { type: 'phone', value: '6451 5955' }], note: '专用匹克球场，onePA 在线预约。', source: 'onePA MarymountCC_PICKLEBALL; Marymount CC Facebook' },
  { id: 'bishan-cc', country: 'sg', price: 4, operator: 'public', name: 'Bishan CC', city: '中区', address: '51 Bishan Street 13, Singapore 579799', setting: 'indoor', courts: 2, fee: '约 S$4–10／小时', booking: [ONEPA, { type: 'phone', value: '6259 4720' }], note: '礼堂 1、2 号场羽毛球和匹克球共用。', source: 'Bishan CC Facebook (Dec 2025)' },
  { id: 'toa-payoh-south-cc', country: 'sg', operator: 'public', name: 'Toa Payoh South CC', city: '中区', address: '1999 Lorong 8 Toa Payoh, Singapore 319258', setting: 'indoor', booking: [ONEPA, { type: 'phone', value: '6259 6602' }], note: `${CC_NOTE}${CHECK}`, source: 'picklesg.com; YouTube (not on onePA list)' },
  school('school-chij-st-theresas', "CHIJ St. Theresa's Convent", '中区', '160 Lower Delta Road, Singapore 099138'),
  school('school-gan-eng-seng', 'Gan Eng Seng School', '中区', '1 Henderson Road, Singapore 159561'),
  school('school-nanyang-pri', 'Nanyang Primary School', '中区', "52 King's Road, Singapore 268097"),
  school('school-new-town-pri', 'New Town Primary School', '中区', '300 Tanglin Halt Road, Singapore 148812'),
  { id: 'picklechoo-apex', country: 'sg', operator: 'private', name: 'PickleChoo Apex @ Henderson', city: '中区', address: 'Rooftop, Apex @ Henderson, 201 Henderson Road, Singapore 159545', setting: 'outdoor', hours: '每天 6:00–22:00', booking: [{ type: 'url', value: 'https://www.planyo.com/booking.php?calendar=70415' }, { type: 'whatsapp', value: '6590298400' }], note: '顶楼球场，有观众席。', source: 'picklechoo.com/picklechoo-apex-court; tagtennis.org (official)' },
  { id: 'ppm-woodleigh', country: 'sg', price: 24, operator: 'private', name: 'Pickle Padel Movement（PUB Recreation Club）', city: '中区', address: '48 Woodleigh Park, Singapore 357844', setting: 'outdoor', courts: 5, fee: '平日白天 S$24／小时，平日晚上和周末 S$35', booking: [{ type: 'url', value: 'https://app.playtomic.io/tenants/2987e8fb-6130-4508-a3e1-fe7a329d446f/reservations', label: 'Playtomic 预约' }, { type: 'whatsapp', value: '6594552851' }], note: 'PUB 康乐俱乐部里，同一处另有 padel 场。', source: 'picklepadelmovement.com/pickle/court-bookings; /about' },
  { id: 'pixel-pickle', country: 'sg', price: 33, operator: 'private', name: 'Pixel Pickle', city: '中区', address: 'Singapore Chinese Recreation Club, 49 Balestier Road, Singapore 329676', setting: 'sheltered', courts: 2, fee: '平日白天 S$33／小时，平日晚上和周末 S$38', booking: [{ type: 'url', value: 'https://pixelpickle.sg/book-courts' }, { type: 'phone', value: '+65 8083 9228' }], note: '中华游艺会里，有顶棚。', source: 'pixelpickle.sg/book-courts (official); paddlepickers.sg (courts)' },
  { id: 'picklepark-balestier', country: 'sg', price: 28, operator: 'private', name: 'Picklepark @ Balestier 101', city: '中区', address: '101 Balestier Road, Singapore 329678', setting: 'sheltered', courts: 1, fee: '非高峰 S$28／小时，高峰 S$38', hours: '24 小时', booking: [{ type: 'url', value: 'https://www.pickleparksg.com/appointments' }, { type: 'phone', value: '+65 9114 4552' }], note: 'Ceylon Sports Club 里的独立有顶棚场，24 小时开放；可租发球机。订了不能退。', source: 'pickleparksg.com (official)' },
  { id: 'ace-club-funan', country: 'sg', price: 80, operator: 'private', name: 'Ace Club Tennis @ Funan', city: '中区', address: '107 North Bridge Road #04-19/21, Funan, Singapore 179105', setting: 'indoor', fee: '非高峰 S$80／小时，高峰 S$120（4 人以内）', booking: [{ type: 'url', value: 'https://aceclubtennis.simplybook.asia/v2/#book' }, { type: 'whatsapp', value: '6580885010' }], note: 'Funan 商场 4 楼，冷气室内，网球和匹克球共用；有淋浴间和咖啡座，球拍可租。', source: 'aceclubtennis.com/indoor-pickleball-centre; capitaland.com Funan store page (#04-19 to 21); booking.page/aceclubtennis (rates)' },
  // ===== 东区 =====
  { id: 'sports-arina-expo', country: 'sg', price: 30, operator: 'private', name: 'The Sports Arina（Expo）', city: '东区', address: '9 Somapah Road, Hall 7 Singapore Expo, Singapore 487370', setting: 'indoor', courts: 12, fee: '平日 S$30–45／小时，周末 S$40–45', hours: '每天 7:00–23:00', booking: [{ type: 'url', value: 'https://playtomic.com/clubs/sph?sport=PICKLEBALL', label: 'Playtomic 预约' }, { type: 'phone', value: '+65 9299 1795' }], note: '冷气室内场。', source: 'TheSmartLocal; SassyMama' },
  { id: 'play-pickle-st-patricks', country: 'sg', price: 40, operator: 'private', name: "Play! Pickle @ St Patrick's School", city: '东区', address: '490 East Coast Road, Singapore 429058', setting: 'sheltered', courts: 3, fee: 'S$40／小时', hours: '周五 18:30–21:30；周六日 8:00–20:00', booking: [PLAY_PICKLE], note: '2026 年 10 月新开。', source: 'playpickle.sg/court-booking' },
  { id: 'play-pickle-chai-chee', country: 'sg', price: 15, operator: 'private', name: 'Play! Pickle Chai Chee', city: '东区', address: '750A Chai Chee Road, 8th Floor, Singapore 469001', setting: 'outdoor', courts: 4, fee: '平日白天 S$15／小时，晚上和周末 S$30', hours: '每天 8:00–22:00', booking: [PLAY_PICKLE], source: 'playpickle.sg/court-booking' },
  { id: 'picklelize', country: 'sg', price: 20, operator: 'private', name: 'PickleliZe', city: '东区', address: '125 Pasir Ris Road, Singapore 519121', setting: 'indoor', courts: 2, fee: 'S$20／小时起', booking: [{ type: 'url', value: 'https://www.picklelize.com/' }], note: '可租发球机。', source: 'SassyMama' },
  { id: 'singapore-swimming-club', country: 'sg', price: 8, operator: 'club', name: 'Singapore Swimming Club', city: '东区', address: '45 Tanjong Rhu Road, Singapore 436899', setting: 'outdoor', courts: 3, fee: '会员 S$8–10／小时，访客另收费', booking: [{ type: 'url', value: 'https://sswimclub.org.sg/sport-facility/pickleball-court/' }, { type: 'phone', value: '+65 6342 3600' }], note: '会员制俱乐部。', source: 'TheSmartLocal; SassyMama' },
  { id: 'safra-tampines', country: 'sg', price: 5.1, operator: 'club', name: 'SAFRA Tampines', city: '东区', address: '1/A Tampines Street 92, Singapore 528882', setting: 'outdoor', courts: 3, fee: '会员 S$3.30–7.20／小时，访客 S$5.10–11.20', booking: [{ type: 'url', value: 'https://www.safra.sg/amenities-offerings/tennis-pickleball-courts' }, { type: 'phone', value: '6785 8800' }], note: '顶楼球场，在 mSAFRA 以网球场预约；可免费借球拍和球。', source: 'TheSmartLocal; SassyMama' },
  { id: 'bedok-north', country: 'sg', price: 3.5, operator: 'public', name: 'ActiveSG Sport Park @ Bedok North', city: '东区', address: '3 Bedok North Street 2, Singapore 469643', setting: 'outdoor', fee: ACTIVESG_FEE, hours: '每天 7:00–22:00', booking: [ACTIVESG, { type: 'phone', value: '6443 5511' }], note: ACTIVESG_NOTE, source: 'activesg.gov.sg' },
  { id: 'bedok-south-14', country: 'sg', price: 0, operator: 'public', name: 'Blk 14 Bedok South', city: '东区', address: '14 Bedok South Avenue 2, Singapore 460014', setting: 'outdoor', courts: 1, fee: '免费', note: FREE_NOTE, source: 'TheSmartLocal; SassyMama' },

  { id: 'performance-pickleball-beach-club', country: 'sg', price: 32, operator: 'private', name: 'Performance Pickleball（Changi Beach Club）', city: '东区', address: '350 Cranwell Road, Singapore 509864', courts: 5, fee: '非高峰 S$32／小时，高峰 S$40', hours: '周一至四 9:00–24:00，周五至日 8:00–24:00', booking: [{ type: 'url', value: 'https://book.performancepickleball.org/book/performancepickleball' }, { type: 'whatsapp', value: '6588912037' }], note: 'Changi Beach Club 里，软垫球场，会录像；每天 9:00 开放新时段。', source: 'performancepickleball.org (beachclub, court-booking)' },
  { id: 'bedok-stadium', country: 'sg', price: 3.5, operator: 'public', name: 'Bedok Stadium', city: '东区', address: '1 Bedok North Street 2, Singapore 469642', fee: ACTIVESG_FEE, booking: [ACTIVESG], note: ACTIVESG_NOTE, source: 'activesg.gov.sg pickleball venue list' },
  school('school-changkat-pri', 'Changkat Primary School', '东区', '11 Simei Street 3, Singapore 529896'),
  school('school-damai-sec', 'Damai Secondary School', '东区', '4800 Bedok Reservoir Road, Singapore 479229'),
  school('school-junyuan-pri', 'Junyuan Primary School', '东区', '2 Tampines Street 91, Singapore 528906'),
  school('school-loyang-view-sec', 'Loyang View Secondary School', '东区', '12 Pasir Ris Street 11, Singapore 519073'),
  school('school-pasir-ris-pri', 'Pasir Ris Primary School', '东区', '5 Pasir Ris Street 21, Singapore 518968'),
  // ===== 西区 =====
  { id: 'jurong-play-grounds', country: 'sg', price: 12, operator: 'private', name: 'Jurong Play Grounds', city: '西区', address: '2 Jurong Gateway Road, Singapore 608512', setting: 'outdoor', courts: 7, fee: '平日白天 S$12–18／小时，高峰 S$32', booking: [{ type: 'url', value: 'https://app.smashing.sg/' }, { type: 'phone', value: '+65 6275 3155' }], note: '部分有遮阴；同一处另有 Straits Pickle Club 的 3 片场。', source: 'TheSmartLocal; SassyMama' },
  { id: 'straits-pickle-club', country: 'sg', price: 18, operator: 'private', name: 'Straits Pickle Club', city: '西区', address: '2 Jurong Gateway Road, Singapore 608512', setting: 'outdoor', courts: 3, fee: '约 S$18–32／小时', booking: [{ type: 'url', value: 'https://straitspickleclub.com/court-booking' }], note: '在 Jurong Play Grounds 里，有遮阴。', source: 'TheSmartLocal; SassyMama; straitspickleclub.com' },
  { id: 'jurong-town', country: 'sg', price: 3.5, operator: 'public', name: 'ActiveSG Sport Village @ Jurong Town', city: '西区', address: '2 International Road, Singapore 619618', setting: 'outdoor', courts: 4, fee: ACTIVESG_FEE, hours: '每天 7:00–22:00', booking: [ACTIVESG, { type: 'phone', value: '6970 1619' }], note: `固定网。${ACTIVESG_NOTE}`, source: 'activesg.gov.sg; TheSmartLocal' },
  { id: 'clementi-sport-hall', country: 'sg', price: 3.5, operator: 'public', name: 'Clementi Sport Hall', city: '西区', address: '518 Clementi Avenue 3, Singapore 129907', setting: 'indoor', courts: 2, fee: ACTIVESG_FEE, booking: [ACTIVESG], note: ACTIVESG_NOTE, source: 'activesg.gov.sg; SassyMama' },
  { id: 'jurong-east-sport-hall', country: 'sg', price: 3.5, operator: 'public', name: 'Jurong East Sport Hall', city: '西区', address: '21 Jurong East Street 31, Singapore 609517', setting: 'indoor', fee: ACTIVESG_FEE, hours: '每天 7:00–22:00', booking: [ACTIVESG, { type: 'phone', value: '6563 5052' }], note: ACTIVESG_NOTE, source: 'activesg.gov.sg' },
  { id: 'choa-chu-kang-outdoor', country: 'sg', price: 3.5, operator: 'public', name: 'Choa Chu Kang Outdoor Courts', city: '西区', address: '1 Choa Chu Kang Street 53, Singapore 689236', setting: 'outdoor', fee: ACTIVESG_FEE, booking: [ACTIVESG], note: ACTIVESG_NOTE, source: 'activesg.gov.sg' },
  { id: 'safra-jurong', country: 'sg', price: 5.1, operator: 'club', name: 'SAFRA Jurong', city: '西区', address: '333 Boon Lay Way, Singapore 649848', setting: 'outdoor', courts: 1, fee: '会员 S$3.30–7.20／小时，访客 S$5.10–11.20', booking: [{ type: 'url', value: 'https://www.safra.sg/amenities-offerings/tennis-pickleball-courts' }, { type: 'phone', value: '6686 4333' }], source: 'TheSmartLocal' },
  { id: 'hillview-cc', country: 'sg', price: 4, operator: 'public', name: 'Hillview CC', city: '西区', address: '1 Hillview Rise, Singapore 667970', setting: 'indoor', fee: '约 S$4–10／小时', booking: [ONEPA, { type: 'phone', value: '6515 0075' }], note: `要整个场馆一起订。${CC_NOTE}`, source: 'onePA FAQ; picklesg.com 2026-02' },
  { id: 'cck-central', country: 'sg', price: 0, operator: 'public', name: 'Choa Chu Kang Central（Blk 233 一带）', city: '西区', address: '233 Choa Chu Kang Central, Singapore 680233', setting: 'outdoor', courts: 4, fee: '免费', note: FREE_NOTE, source: 'TheSmartLocal; SassyMama' },
  { id: 'jurong-west-523', country: 'sg', price: 0, operator: 'public', name: 'Jurong West Blk 523 一带', city: '西区', address: '523 Jurong West Street 52, Singapore 640523', setting: 'outdoor', courts: 2, fee: '免费', note: FREE_NOTE, source: 'TheSmartLocal; SassyMama' },
  { id: 'segar-467', country: 'sg', price: 0, operator: 'public', name: 'Blk 467 Segar Road', city: '西区', address: '467 Segar Road, Singapore 670467', setting: 'outdoor', fee: '免费', note: FREE_NOTE, source: 'TheSmartLocal; SassyMama' },

  { id: 'ark-sports-village', country: 'sg', price: 20, operator: 'private', name: 'ARK Sports Village', city: '西区', address: '20A Segar Road, Singapore 679350', setting: 'sheltered', courts: 5, fee: 'S$20／小时起', hours: '每天 8:00–22:00', booking: [{ type: 'url', value: 'https://theark.sg/pickleball' }, { type: 'phone', value: '9185 2555' }], note: 'Bukit Panjang 高架桥下，有遮蔽。', source: 'theark.sg/pickleball; TheSmartLocal (hours)' },
  { id: 'nanyang-cc', country: 'sg', operator: 'public', name: 'Nanyang CC', city: '西区', address: '60 Jurong West Street 91, Singapore 649040', setting: 'indoor', courts: 3, booking: [ONEPA, { type: 'phone', value: '6791 0395' }], note: `${CC_NOTE}${CHECK}`, source: 'Pickleheads (not on onePA list)' },
  school('school-dunearn-sec', 'Dunearn Secondary School', '西区', '21 Bukit Batok West Avenue 2, Singapore 659204'),
  school('school-greenridge-pri', 'Greenridge Primary School', '西区', '11 Jelapang Road, Singapore 677744'),
  school('school-hillgrove-sec', 'Hillgrove Secondary School', '西区', '10 Bukit Batok Street 52, Singapore 659250'),
  school('school-rulang-pri', 'Rulang Primary School', '西区', '6 Jurong West Street 52, Singapore 649295'),
  school('school-xingnan-pri', 'Xingnan Primary School', '西区', '5 Jurong West Street 91, Singapore 649036'),
  // ===== 北区 =====
  { id: 'bukit-canberra', country: 'sg', price: 3.5, operator: 'public', name: 'Bukit Canberra Sport Hall', city: '北区', address: '21 Canberra Link, Singapore 756973', setting: 'indoor', courts: 2, fee: ACTIVESG_FEE, hours: '每天 7:00–22:00', booking: [ACTIVESG, { type: 'phone', value: '6374 5342' }], note: ACTIVESG_NOTE, source: 'activesg.gov.sg; TheSmartLocal' },
  { id: 'yishun-sport-hall', country: 'sg', price: 3.5, operator: 'public', name: 'Yishun Sport Hall', city: '北区', address: '101 Yishun Avenue 1, Singapore 769130', setting: 'indoor', fee: ACTIVESG_FEE, hours: '每天 7:00–22:00', booking: [ACTIVESG, { type: 'phone', value: '6756 7416' }], note: ACTIVESG_NOTE, source: 'activesg.gov.sg' },
  { id: 'hometeamns-khatib', country: 'sg', price: 23, operator: 'club', name: 'HomeTeamNS Khatib', city: '北区', address: '2 Yishun Walk, Singapore 767944', setting: 'outdoor', courts: 2, fee: '一般 S$23–28／小时，会员 S$15–20', booking: [{ type: 'phone', value: '+65 6708 6670' }], note: '4 楼顶楼球场。', source: 'TheSmartLocal' },
  { id: 'safra-yishun', country: 'sg', price: 5.1, operator: 'club', name: 'SAFRA Yishun', city: '北区', address: '60 Yishun Avenue 4, Singapore 769027', setting: 'outdoor', courts: 1, fee: '会员 S$3.30–6.60／小时，访客 S$5.10–10.20', booking: [{ type: 'url', value: 'https://www.safra.sg/amenities-offerings/tennis-pickleball-courts' }], source: 'TheSmartLocal' },

  school('school-chongfu', 'Chongfu School', '北区', '170 Yishun Avenue 6, Singapore 768959'),
  school('school-wellington-pri', 'Wellington Primary School', '北区', '10 Wellington Circle, Singapore 757702'),
  { id: 'pickle-up-occ', country: 'sg', price: 38, operator: 'private', name: 'Pickle Up @ Orchid Country Club', city: '北区', address: '1 Orchid Club Road #01-34, Orchid Country Club, Singapore 769162', setting: 'indoor', courts: 6, fee: 'S$38–65／小时（看时段和场地等级；平日晚上和周末是高峰）', hours: '周日至四 8:00–23:00，周五六 8:00–24:00', booking: [{ type: 'url', value: 'https://playtomic.com/clubs/pickle-up', label: 'Playtomic 预约' }, { type: 'whatsapp', value: '6589919858' }], note: '冷气室内，另有独立包厢场 The Dink Room；Yishun 站 B 出口有免费接驳车。2026 年 10 月开幕。', source: 'pickleupsg.com; pickleupsg.com/pricing; Playtomic' },
  { id: 'ark-pickle-occ', country: 'sg', price: 25, operator: 'private', name: 'ARK Pickle @ Orchid Country Club', city: '北区', address: '1 Orchid Club Road, Level 3 Recreational Clubhouse, Singapore 769162', setting: 'sheltered', courts: 2, fee: 'S$25／小时起', hours: '每天 7:00–24:00（平日 17:00 后和周末是高峰）', booking: [{ type: 'url', value: 'https://theark.sg/pickleball/venue' }, { type: 'whatsapp', value: '6591852555' }], note: '软垫场地，一个月前开放预约。跟 Pickle Up 同一栋、不同经营者。', source: 'theark.sg/pickleball/venue; orchidclub.com/facilities/pickleball-courts' },
  { id: 'madpicklers', country: 'sg', price: 38, operator: 'private', name: 'MADPICKLERS', city: '北区', address: '2 Gambas Crescent #01-21, Nordcom II, Singapore 757044', setting: 'indoor', courts: 1, fee: '非高峰 S$38／小时，高峰 S$48', hours: '24 小时', booking: [{ type: 'url', value: 'https://www.madpicklers.com/book' }, { type: 'phone', value: '+65 8608 1500' }], note: '冷气室内，24 小时开放。', source: 'madpicklers.com/book; address from MADPICKLERS Facebook/IG posts' },
  // ===== 东北区 =====
  { id: 'play-pickle-serangoon', country: 'sg', price: 38, operator: 'private', name: 'Play! Pickle Serangoon', city: '东北区', address: '756 Upper Serangoon Road #04-27, Singapore 534626', setting: 'indoor', courts: 5, fee: '平日白天 S$38／小时，晚上和周末 S$48（单打小场较便宜）', hours: '每天 7:00–24:00', booking: [PLAY_PICKLE], note: '冷气室内，4 片标准场加 1 片单打场；15 天前开放预约。', source: 'playpickle.sg/court-booking' },
  { id: 'play-pickle-punggol', country: 'sg', price: 10, operator: 'private', name: 'Play! Pickle Punggol', city: '东北区', address: '10 Tebing Lane, Singapore 828836', setting: ['sheltered', 'outdoor'], courts: 8, fee: '有顶棚场 S$20–35／小时，户外 S$10–28', hours: '每天 7:00–24:00', booking: [PLAY_PICKLE, { type: 'phone', value: '8228 4334' }], note: '6 片有顶棚标准场、1 片单打场、1 片户外场。有消息说 2026 年 10 月底租约到期可能关闭，去之前先确认。', source: 'playpickle.sg/court-booking; TheSmartLocal; paddlepickers.sg (closing end Oct 2026, unofficial)' },
  { id: 'sports-arina-jalan-kayu', country: 'sg', price: 25, operator: 'private', name: 'The Sports Arina @ Jalan Kayu', city: '东北区', address: '20A Fernvale Rd, Singapore 799951', courts: 10, fee: '非会员 S$25–35／小时', hours: '每天 8:00–22:00', booking: [{ type: 'url', value: 'https://playtomic.com/clubs/tsa-jalan-kayu?sport=PICKLEBALL', label: 'Playtomic 预约' }, { type: 'phone', value: '+65 8088 1795' }], note: 'Thanggam 轻轨站附近，2026 年 4 月开幕。', source: 'TheSmartLocal' },
  { id: 'performance-pickleball-punggol', country: 'sg', price: 32, operator: 'private', name: 'Performance Pickleball（Boathouse）', city: '东北区', address: '11 Northshore Drive #01-23, Singapore 828670', setting: 'sheltered', courts: 2, fee: '非高峰 S$32／小时，高峰 S$40', hours: '周一至四 9:00–24:00，周五至日 8:00–24:00', booking: [{ type: 'url', value: 'https://book.performancepickleball.org/book/performancepickleball' }, { type: 'whatsapp', value: '6588912037' }], note: 'Boathouse，室内有遮蔽；每天 9:00 开放新时段。', source: 'performancepickleball.org; TheSmartLocal' },
  { id: 'sengkang-outdoor', country: 'sg', price: 3.5, operator: 'public', name: 'Sengkang Outdoor Pickleball Courts', city: '东北区', address: '57 Anchorvale Road, Singapore 544964', setting: 'outdoor', courts: 3, fee: ACTIVESG_FEE, hours: '每天 7:00–22:00', booking: [ACTIVESG, { type: 'phone', value: '6315 3574' }], note: ACTIVESG_NOTE, source: 'activesg.gov.sg' },
  { id: 'hougang-sport-hall', country: 'sg', price: 3.5, operator: 'public', name: 'Hougang Sport Hall', city: '东北区', address: '93 Hougang Avenue 4, Singapore 538832', setting: 'indoor', fee: ACTIVESG_FEE, hours: '每天 7:00–22:00', booking: [ACTIVESG, { type: 'phone', value: '6315 8671' }], note: ACTIVESG_NOTE, source: 'activesg.gov.sg' },
  { id: 'hwi-yoh-cc', country: 'sg', price: 4, operator: 'public', name: 'Hwi Yoh CC', city: '东北区', address: '535 Serangoon North Ave 4 #01-179, Singapore 550535', setting: 'indoor', fee: '约 S$4–10／小时', booking: [ONEPA, { type: 'phone', value: '6484 0338' }], note: CC_NOTE, source: 'onePA FAQ; picklesg.com 2026-02' },
  { id: 'kebun-baru-cc', country: 'sg', price: 4, operator: 'public', name: 'Kebun Baru CC', city: '东北区', address: '216 Ang Mo Kio Avenue 4, Singapore 569897', setting: 'indoor', fee: '约 S$4–10／小时', booking: [ONEPA, { type: 'phone', value: '6457 7379' }], note: `要整个场馆一起订。${CC_NOTE}`, source: 'onePA FAQ; picklesg.com 2026-02' },
  { id: 'serangoon-north-546', country: 'sg', price: 0, operator: 'public', name: 'Blk 546 Serangoon North', city: '东北区', address: '546 Serangoon North Ave 3, Singapore 550546', setting: 'sheltered', courts: 1, fee: '免费', note: FREE_NOTE, source: 'TheSmartLocal; SassyMama' },
  { id: 'yio-chu-kang-tennis', country: 'sg', price: 3.5, operator: 'public', name: 'Yio Chu Kang Tennis Centre', city: '东北区', address: '200 Ang Mo Kio Avenue 9, Singapore 569770', setting: 'outdoor', fee: ACTIVESG_FEE, hours: '每天 7:00–22:00', booking: [ACTIVESG, { type: 'phone', value: '6482 4980' }], note: `据说只有 9A 小场画了匹克球线，用 ActiveSG 订网球小场。${CHECK}`, source: 'activesgcircle.gov.sg; Facebook; Pickleheads (not on ActiveSG pickleball list)' },
  { id: 'picklechoo-prime', country: 'sg', operator: 'private', name: 'PickleChoo Prime', city: '东北区', address: 'Primax Building, 22 New Industrial Road, Singapore 536208', setting: 'outdoor', hours: '每天 6:00–22:00', booking: [{ type: 'url', value: 'https://www.planyo.com/booking.php?calendar=70182&mode=resource_list&planyo_lang=EN' }, { type: 'whatsapp', value: '6590298400' }], note: `TAG 网球学院经营，主要给长期包场。${CHECK}`, source: 'picklechoo.com/picklechoo-prime; tagtennis.org (official; its text says near Redhill, postal code says Hougang side)' },
  school('school-anderson-sec', 'Anderson Secondary School', '东北区', '10 Ang Mo Kio Street 53, Singapore 569206'),
  school('school-horizon-pri', 'Horizon Primary School', '东北区', '61 Edgedale Plains, Singapore 828819'),
  school('school-yangzheng-pri', 'Yangzheng Primary School', '东北区', '15 Serangoon Avenue 3, Singapore 556108'),
  // ===== 台北：士林、北投 =====
  { id: 'tw-zhishan-park', country: 'tw', price: 0, operator: 'public', name: '至善公园羽球场', city: '士林、北投', address: '台北市士林区至善路一段（至善公园）', setting: 'outdoor', courts: 2, fee: '免费', hours: '球友固定球局多在周二、四、日，时段各来源不同；灯开到 22:00', note: '羽毛球场画了匹克线，用羽毛球网、没有厨房线；高手多。', source: 'ipickleball.tw、PicklePi、中華民國匹克球總會、Pickleheads' },
  { id: 'tw-tianmu-park', country: 'tw', price: 0, operator: 'public', name: '天母公园羽球场', city: '士林、北投', address: '台北市士林区中山北路七段 141 巷旁（天母公园）', setting: 'outdoor', courts: 2, fee: '免费', hours: '6:00–22:00；每天早上有固定球局，随到随打', note: '和羽毛球共用，羽毛球网、已贴厨房线；有人打羽毛球要让一片。资料只有单一或非官方来源，出发前先确认。', source: '球友整理文章、Threads 球友心得' },
  { id: 'tw-mingde', country: 'tw', price: 0, operator: 'public', name: '明德匹克球专用球场', city: '士林、北投', address: '台北市北投区东华街一段 8 号', setting: 'outdoor', courts: 1, fee: '免费', hours: '9:00–18:00（住宅区，时间有限制）', note: '从捷运明德站走路可到；标准线专用场，只有一片要排队，地面为排水有点斜。资料只有单一或非官方来源，出发前先确认。', source: 'SP Pickleball 場地頁、PicklePi（2026）' },
  { id: 'tw-beitou-sports-center', country: 'tw', operator: 'public', name: '台北市北投运动中心', city: '士林、北投', address: '台北市北投区石牌路一段 39 巷 100 号', setting: 'indoor', fee: '散客每人约 NT$100–300（各来源不同）', hours: '匹克球时段常见周二、四中午、周六下午，以中心公告为准', booking: [{ type: 'url', value: 'https://www.btsport.org.tw/', label: '北投运动中心' }], note: '在 2 楼；近捷运石牌站，周四有新手体验。资料只有单一或非官方来源，出发前先确认。', source: 'ipickleball.tw、球友整理文章、中華民國匹克球總會' },
  // ===== 台北：松山、信义、内湖、南港 =====
  { id: 'tw-dongyang-park', country: 'tw', price: 0, operator: 'public', name: '东阳公园', city: '松山、信义、内湖、南港', address: '台北市南港区重阳路 187 巷旁（东阳公园）', setting: 'outdoor', courts: 1, fee: '免费', hours: '全天开放', note: '要自备球网。资料只有单一或非官方来源，出发前先确认。', source: 'PicklePi（2026）' },
  { id: 'tw-taipei-tennis-center', country: 'tw', price: 400, operator: 'public', name: '台北市网球中心 匹克球场', city: '松山、信义、内湖、南港', address: '台北市内湖区民权东路六段 208 号', setting: 'sheltered', courts: 4, fee: '非高峰 NT$400／小时，高峰 NT$800（平日 17:00 后、假日 8:00 后）', hours: '6:00–22:00', booking: [{ type: 'url', value: 'https://www.tsc.taipei/%E5%A0%B4%E9%A4%A8%E4%BB%8B%E7%B4%B9/%E5%8C%B9%E5%85%8B%E7%90%83%E7%90%83%E5%A0%B4pickleball/', label: '网球中心' }, { type: 'phone', value: '02-2795-1166' }], note: '4 片半户外场，场间有隔网；球拍可租 NT$50，要押证件。', source: '臺北市網球中心官網' },
  { id: 'tw-xinyi-sports-center', country: 'tw', price: 250, operator: 'public', name: '台北市信义运动中心 顶楼匹克球场', city: '松山、信义、内湖、南港', address: '台北市信义区松勤街 100 号 顶楼', setting: 'sheltered', fee: '平日 18:00 前、假日 12:00 前 NT$250／小时，其他时段 NT$400', hours: '6:00–22:00', booking: [{ type: 'url', value: 'https://xysc.teamxports.com/floor_info/floor-8f', label: '信义运动中心' }], note: '顶楼半户外，下雨可能不能打；建议 6 人以内，球拍可租 NT$50。热门时段要抢。', source: '信義運動中心官網、PicklePi' },
  { id: 'tw-nangang-sports-center', country: 'tw', operator: 'public', name: '台北市南港运动中心', city: '松山、信义、内湖、南港', address: '台北市南港区玉成街 69 号', setting: 'indoor', fee: '常见每人 NT$100–200', hours: '运动中心 6:00–22:00，匹克球时段先问中心', booking: [{ type: 'url', value: 'https://ngsc.cyc.org.tw/', label: '南港运动中心' }], note: '从捷运后山埤站走路约 5 分钟。资料只有单一或非官方来源，出发前先确认。', source: 'PicklePi（2026）' },
  { id: 'tw-yongchun-hs', country: 'tw', operator: 'public', name: '台北市立永春高中 活动中心', city: '松山、信义、内湖、南港', address: '台北市信义区松山路 654 号', setting: 'indoor', fee: '球友场每人约 NT$100–200', hours: '常见周二 19:00–22:00、周五 19:30–21:30、周日 20:00–22:00', note: '球友社团的固定场，散客先问。资料只有单一或非官方来源，出发前先确认。', source: 'ipickleball.tw、PicklePi' },
  { id: 'tw-nanhu-es', country: 'tw', operator: 'public', name: '台北市内湖区南湖小学', city: '松山、信义、内湖、南港', address: '台北市内湖区康宁路三段 220 号', setting: 'indoor', fee: '球友场每人约 NT$100–200', hours: '常见周六 18:00–21:00、周日 18:00–22:00', note: '球友社团的固定场，散客先问。资料只有单一或非官方来源，出发前先确认。', source: 'ipickleball.tw、PicklePi' },
  { id: 'tw-xisong-hs', country: 'tw', operator: 'public', name: '台北市立西松高中', city: '松山、信义、内湖、南港', address: '台北市松山区健康路 325 巷 7 号', setting: 'indoor', fee: '收费，金额先问球团', hours: '常见周六 17:30–21:00', note: '球友社团的固定场，散客先问。资料只有单一或非官方来源，出发前先确认。', source: 'PicklePi（2026）' },
  { id: 'tw-picklepickle-neihu', country: 'tw', price: 1200, operator: 'private', name: 'PicklePickle 匹克球场', city: '松山、信义、内湖、南港', address: '台北市内湖区堤顶大道二段 409 号 1 楼', setting: 'indoor', fee: '包场非高峰 NT$1,200／小时，高峰 NT$1,600', hours: '24 小时，自助入场', booking: [{ type: 'url', value: 'https://www.picklepickle.tw/products/pickleballcourtbooking', label: 'PicklePickle' }], note: '从捷运西湖站走路约 8 分钟；挑高近 6 米、有空调，有球拍可试打。', source: 'PicklePickle 官網、PicklePi、SP Pickleball' },
  { id: 'tw-pick-le-mode', country: 'tw', price: 1200, operator: 'private', name: 'Pick Le Mode 匹克模', city: '松山、信义、内湖、南港', address: '台北市内湖区行爱路 141 巷 38 号 3 楼', setting: 'indoor', courts: 3, fee: '包场 VIP 非高峰 NT$1,200／小时起，基本会员 NT$1,400–1,600', hours: '24 小时；23:00–6:00 为深夜自主练习', booking: [{ type: 'url', value: 'https://picklemode.io/zh/about', label: 'Pick Le Mode' }], note: '2026 年 8 月开业的包厢式球馆，有空调、停车场，球拍可租。', source: 'Pick Le Mode 官網、SP Pickleball' },
  // ===== 台北：中正、中山、大同、万华 =====
  { id: 'tw-huazhong-riverside', country: 'tw', price: 0, operator: 'public', name: '华中河滨公园匹克球场', city: '中正、中山、大同、万华', address: '台北市万华区环河南路三段与武成街 63 巷口附近（华中河滨公园）', setting: 'outdoor', courts: 4, fee: '免费', hours: '全天开放，灯开到 24:00（2026 年 5 月起）', note: '2026 年元旦改建启用：球场改南北向、2 米防风网、8 盏高杆灯。蚊子多，带防蚊液。', source: '今日匹克、PickleTown、PicklePi（2026）' },
  { id: 'tw-youth-park', country: 'tw', price: 0, operator: 'public', name: '青年公园', city: '中正、中山、大同、万华', address: '台北市万华区水源路 199 号', setting: 'outdoor', courts: 2, fee: '免费', hours: '羽毛球场 8:00–22:00，有夜间照明', note: '1、2 号羽毛球场是羽毛球、匹克球共用场，用羽毛球网；万华最多人组局的户外点。', source: '全國運動場館資訊網 iPlay、PicklePi（2026）' },
  { id: 'tw-wanhua-sports-center', country: 'tw', operator: 'public', name: '台北市万华运动中心', city: '中正、中山、大同、万华', address: '台北市万华区西宁南路 6 之 1 号', setting: 'indoor', fee: '散客每人约 NT$100–200', hours: '常见周一 14:00–16:00、周三 15:00–18:00', booking: [{ type: 'phone', value: '02-2375-9900' }], note: '近捷运西门站。资料只有单一或非官方来源，出发前先确认。', source: 'ipickleball.tw、中華民國匹克球總會' },
  { id: 'tw-zhongzheng-sports-center', country: 'tw', operator: 'public', name: '台北市中正运动中心', city: '中正、中山、大同、万华', address: '台北市中正区信义路一段 1 号', setting: 'indoor', fee: '散客每人约 NT$100–200', hours: '常见周一 14:00–17:00、周五 14:00–16:00', note: '可用台北市运动中心预约系统订时段。资料只有单一或非官方来源，出发前先确认。', source: 'ipickleball.tw、PicklePi' },
  { id: 'tw-maji-flora-expo', country: 'tw', price: 1100, operator: 'private', name: '花博 MAJI 匹克庭园', city: '中正、中山、大同、万华', address: '台北市中山区玉门街 1 号（花博公园 MAJI 集食行乐）', setting: ['indoor', 'outdoor'], courts: 3, fee: '包场平日非高峰 NT$1,100／小时起，假日 NT$1,400；1 号场较贵', hours: '每天 9:00–22:00', booking: [{ type: 'phone', value: '02-5570-0508' }, { type: 'url', value: 'https://www.facebook.com/flowerpickle/', label: 'Facebook' }], note: '从捷运圆山站走路约 5 分钟；有空调、有遮阳，另有户外花园场。球拍租 NT$100，球免费。', source: '食尚玩家場地卡、花博匹克 Threads 公告、今日匹克' },
  { id: 'tw-ahhh-social-hub', country: 'tw', price: 2000, operator: 'private', name: 'Ahhh Pickleball Social Hub', city: '中正、中山、大同、万华', address: '台北市中正区杭州北路 26 号 1 楼', setting: 'indoor', fee: '包场平日 10:00–16:00 NT$2,000／小时，其他时段 NT$2,500', hours: '10:00–23:00', booking: [{ type: 'url', value: 'https://shop.ichefpos.com/store/M8wLQ4u0/reserve', label: '在线订位' }, { type: 'phone', value: '02-2321-0090' }], note: '球场加酒吧，2026 年 3 月开业；场边每人最低消费一杯饮料。近华山文创园区。', source: '中央社、風傳媒、工商時報、食尚玩家' },
  // ===== 台北：大安、文山 =====
  { id: 'tw-jingmei-riverside', country: 'tw', price: 0, operator: 'public', name: '景美河滨公园 2 号羽球场（羽匹共用）', city: '大安、文山', address: '台北市文山区景美河滨公园（景美桥至新店溪口之间，从景美街口进堤防）', setting: 'outdoor', courts: 1, fee: '免费', hours: '常见 8:30–24:00；周末球友多', note: '2026 年 3 月 16 日起 2 号羽毛球场改为羽毛球、匹克球共用。', source: '臺北市體育局場館系統公告、ipickleball.tw、PeoPo' },
  { id: 'tw-ntut-zhongzheng-hall', country: 'tw', operator: 'public', name: '台北科技大学 中正馆', city: '大安、文山', address: '台北市大安区忠孝东路三段 1 号', setting: 'indoor', fee: '球友场每人约 NT$100–200', hours: '常见周六、日 18:00–21:30', note: '球友社团租的固定场，先加“北科大匹克球” LINE 群问散客。资料只有单一或非官方来源，出发前先确认。', source: 'ipickleball.tw、PicklePi、LINE 社群' },
];

export const VENUES_PAGE = {
  title: '约球・找场地',
  // 名錄的地區（標題下的切換）：新加坡、台北。
  area: { sg: '新加坡', tw: '台北' },
  areaLabel: '地区',
  en: 'Courts',
  disclaimer: '价格和时间整理自场地官网和网络资料（2026 年 10 月），可能会变，预约前以场地公告为准。',
  empty: '场地名录整理中，很快会放上第一批合作场地。',
  settings: { indoor: '室内', sheltered: '有顶棚', outdoor: '户外' },
  courts: '{n} 片场',
  fee: '费用',
  hours: '开放时间',
  map: '地图',
  meetup: '在这里组局',
  booking: { phone: '电话预约', whatsapp: 'WhatsApp 预约', line: 'LINE 预约', url: '在线预约' },
  bookShort: '预约',
  // 顶部筛选：搜索、区域、类型。区域的 id 对应上面 city 的值。
  search: '搜索场地或地址',
  regionLabel: '区域',
  regions: {
    sg: [{ id: '', label: '全部' }, { id: '中区', label: '中' }, { id: '东区', label: '东' }, { id: '西区', label: '西' }, { id: '北区', label: '北' }, { id: '东北区', label: '东北' }],
    tw: [{ id: '', label: '全部' }, { id: '士林、北投', label: '士林北投' }, { id: '松山、信义、内湖、南港', label: '内湖信义' }, { id: '中正、中山、大同、万华', label: '市中心' }, { id: '大安、文山', label: '大安文山' }],
  },
  // 筛选：爱心钮、筛选钮（打开面板）、排序。
  back: '全部场地',
  share: '分享这个场地',
  shareText: '{name}：在 Picobo 看怎么预约、怎么去',
  sharedLabel: '朋友分享的筛选：',
  sharedSep: '・',
  seeAll: '看全部',
  favOnly: '只看收藏',
  filter: '筛选',
  filterTitle: '筛选场地',
  sortLabel: '排序',
  sorts: [{ id: 'region', label: '按区域' }, { id: 'price', label: '最便宜' }],
  priceLabel: '价位（每小时场租）',
  prices: {
    sg: [{ id: 'free', label: '免费' }, { id: 'low', label: 'S$10 以下' }, { id: 'mid', label: 'S$10–35' }, { id: 'high', label: 'S$35 以上' }],
    tw: [{ id: 'free', label: '免费' }, { id: 'low', label: 'NT$500 以下' }, { id: 'mid', label: 'NT$500–1,500' }, { id: 'high', label: 'NT$1,500 以上' }],
  },
  priceHint: {
    sg: '按非会员最便宜的时段算；没写价钱的场地，选了价位就不会出现。',
    tw: '按包一片场最便宜的时段算；只收散客每人费用或没写价格的场地，选了价位就不会出现。',
  },
  opLabel: '类型',
  ops: [{ id: 'public', label: '公共场地' }, { id: 'private', label: '私人球馆' }, { id: 'club', label: '会员俱乐部' }],
  opHint: {
    sg: '公共场地：ActiveSG、社区中心、学校、组屋免费场。',
    tw: '公共场地：运动中心、公园、河滨、学校。',
  },
  otherLabel: '其他',
  courtsLabel: '场地数',
  courtSteps: [{ id: 0, label: '不限' }, { id: 2, label: '2 片以上' }, { id: 4, label: '4 片以上' }, { id: 6, label: '6 片以上' }],
  others: [{ id: 'dry', label: '不怕下雨' }],
  clear: '清除',
  show: '看 {n} 个场地',
  // 场地卡右上角的爱心：加入收藏（只存在这台手机）。
  fav: '加入收藏',
  unfav: '取消收藏',
  noFav: '还没有收藏的场地。在场地卡右上角点爱心，就会出现在这里。',
  count: '{n} 个场地',
  none: '没有符合的场地，换个条件试试。',
  // 名录最下面：不在名单上的场地（公寓球场、朋友的俱乐部）也能发报名信息。
  unlisted: '在名录以外的地方打（公寓球场、朋友的俱乐部）？自己输入场地名称也能',
};
