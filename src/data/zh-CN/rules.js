// 规则内容与球场示意图场景。正式规则以 USA Pickleball Official Rulebook 2026 为准，
// 括号内是规则书章节。场景的位置名称由 src/court.js 定义。
// 甲队（A）在球场下半（near），乙队（B）在上半（far）。
// en：英文术语，显示在标题后的括号里，用词以 glossary.js 为准。
// singlesScenes／singlesSummary／singlesDetail：单打双打都适用、但单打要换图或文字的规则。
// 有这些字段的规则会拆成两页：双打 #rules/<id>、单打 #rules/<id>-singles（没写的字段沿用一般版本）。

export const RULEBOOK = 'USA Pickleball Official Rulebook 2026';

const A1 = (extra = {}) => ({ team: 'A', side: 'near', pos: 'right', label: '甲1', ...extra });
const A2 = (extra = {}) => ({ team: 'A', side: 'near', pos: 'left', label: '甲2', ...extra });
const B1 = (extra = {}) => ({ team: 'B', side: 'far', pos: 'right', label: '乙1', ...extra });
const B2 = (extra = {}) => ({ team: 'B', side: 'far', pos: 'left', label: '乙2', ...extra });

// 单打：甲在下半场、乙在上半场
const S = (extra = {}) => A1({ label: '甲', ...extra });
const R = (extra = {}) => B1({ label: '乙', ...extra });
const srv = { depth: 'behind', serving: true };

// 双弹跳：发球弹一次、回球弹一次、第三拍飞到乙（1）面前、第四拍在空中截击回去。
// 第三拍的落点用坐标放在乙（1）身前，不然球会被人挡住。
const TWO_BOUNCE = ['near:right:behind', 'far:right:mid', 'near:right:mid', [124, 184], 'near:left:kitchenLine'];

// 双打四人都站底线的默认站位
const four = (serving = {}) => [A1(serving.A1), A2(serving.A2), B1(serving.B1), B2(serving.B2)];

// 章节：scoring 标出只适用哪一种计分（没写就是都适用）；规则的 play 标出
// 只适用双打或单打（没写就是都适用）。规则页上方的切换按钮靠这两个字段筛选。
// 两个计分章节用同一套步骤（step）：points 怎么得分、calling 怎么报分、
// positions 谁发球站哪里。切换计分方式时跳到另一章的同一步；note 显示在目录的章节标题下。
export const SECTIONS = [
  {
    id: 'court',
    title: '球场与线',
    en: 'Court & Lines',
    intro: '先认识场地。后面每一条规则的图，都是这一张球场。',
    items: [
      {
        id: 'dimensions',
        title: '球场尺寸',
        en: 'Court Dimensions',
        summary: '球场 13.41 × 6.10 米，跟羽毛球双打场一样大。网两边各有一块 2.13 米深的“厨房”。',
        detail: [
          '正式名称是非截击区（Non-Volley Zone），大家都叫厨房（Kitchen）。它是匹克球最重要的一块区域：人在里面不能把球在空中直接打回去。',
          '网高：两端 91 厘米，中间 86 厘米。',
          '场地画线：底线、边线、厨房线，以及从厨房线到底线的中线，把每边分成左右两个发球区。',
          '没有匹克球场？下一页“借场地打”教你用羽毛球场、网球场、排球场贴线。',
        ],
        scenes: [
          { caption: '整个球场 13.41 × 6.10 米，中间是球网。', labels: true },
          { caption: '网两边各 2.13 米深的厨房，正式名称是非截击区。', labels: true, highlight: ['nvz'] },
          { caption: '厨房线到底线之间，被中线分成左右两个发球区。', highlight: ['serviceBox:near:right', 'serviceBox:near:left', 'serviceBox:far:right', 'serviceBox:far:left'] },
        ],
      },
      {
        // 借别的球场打（实用做法，不是规则）。尺寸来源：USA Pickleball rulebook 第 2 节
        // （量到线外缘）、BWF Laws（羽毛球 13.40 × 6.10，前发球线离网 1.98，网中间 1.524）、
        // ITF Rules of Tennis（发球线离网 6.40，网中间 0.914）、FIVB（18 × 9，进攻线 3 m）；
        // 一片网球场围网范围 60 × 120 ft 排 4 片：sportmaster.net、protrackandtennis.com。
        // 图由 court.js setupSvg(host) 画。
        id: 'setup',
        title: '借场地打',
        en: 'Court Setup',
        summary: '没有匹克球场，最好借羽毛球场：线几乎都能用，只要补两条厨房线。网球场和排球场要多贴几条。',
        setup: {
          intro: '先用卷尺量，再用 5 厘米宽的胶带贴线。尺寸量到线的外缘，线算在场内。贴好后量两条对角线，都是 14.73 米就是直角。',
          legend: { reuse: '直接用的线', tape: '要贴的线', host: '原有场地的线' },
          groups: [
            { host: 'badminton', name: '羽毛球场（最省事）', items: [
              '羽毛球双打场 13.40 × 6.10 米，几乎一样大，边线和底线直接用。',
              '厨房线：羽毛球前发球线离网 1.98 米，匹克球厨房 2.13 米，在前发球线后面约 15 厘米贴一条。',
              '中线直接用羽毛球的中线，双打后发球线不用管。',
              '球网太高（羽毛球网中间 1.52 米），要换匹克球网或自带便携式球网。',
            ] },
            { host: 'tennis', name: '网球场', items: [
              '最简单是用网球网打一片：把网中间的中心带放低到 86 厘米。网两端会比匹克球网高一点，休闲打没关系。',
              '底线：网球发球线离网 6.40 米，匹克球底线 6.71 米，贴在发球线后面约 30 厘米。',
              '边线：以网球的中发球线为中心，左右各 3.05 米。',
              '中线用网球的中发球线，延长到新底线；厨房线离网 2.13 米，另外贴。',
              '整个网球场围网范围（约 18 × 36 米）可以排下 4 片匹克球场，要自带球网。',
            ] },
            { host: 'volleyball', name: '排球场', items: [
              '排球场 18 × 9 米，放得下一片匹克球场：以球网正下方为中心，两边边线各往内 1.45 米。',
              '排球的线都对不上，四条边线、厨房线、中线全部要另外贴。进攻线离网 3 米，不是厨房线。',
              '排球网太高，要自带匹克球网。',
            ] },
          ],
          note: '这是借场地的实用做法，不是规则；场馆能不能贴胶带，先问管理员。',
        },
      },
      {
        id: 'lines',
        title: '压线判定',
        en: 'Line Calls',
        summary: '球碰到任何线都算界内。唯一例外：发球碰到厨房线算失误。',
        detail: [
          '线宽 5 厘米，球碰到线的任何一点就算界内。',
          '发球时厨房和厨房线都是“不能落”的区域，发球碰到厨房线就是失误；其他时候厨房线跟普通的线一样算界内。',
          '发球落在斜对角发球区的中线、边线或底线上都算界内，只有厨房线不行。',
          '自己这一边的界内外由自己判，看不清楚就判对方界内。',
        ],
        singlesScenes: [
          { caption: '正常回合中，球碰到厨房线算界内。', highlight: ['kitchenLine:near'], ball: { path: ['far:left:mid', 'near:right:onKitchenLine'], bounces: [1] } },
          { caption: '发球时碰到厨房线就是失误，球必须落在厨房线之后。', highlight: ['kitchenLine:far', 'nvz:far'], players: [S(srv), R()], ball: { path: ['near:right:behind', 'far:right:onKitchenLine'], bounces: [1] } },
          { caption: '发球落在中线上算界内，边线、底线也一样。', highlight: ['serviceBox:far:right', 'centerline:far'], players: [S(srv), R()], ball: { path: ['near:right:behind', 'far:center:mid'], bounces: [1] } },
        ],
        scenes: [
          { caption: '正常回合中，球碰到厨房线算界内。', highlight: ['kitchenLine:near'], ball: { path: ['far:left:mid', 'near:right:onKitchenLine'], bounces: [1] } },
          { caption: '发球时碰到厨房线就是失误，球必须落在厨房线之后。', highlight: ['kitchenLine:far', 'nvz:far'], players: [A1({ depth: 'behind', serving: true })], ball: { path: ['near:right:behind', 'far:right:onKitchenLine'], bounces: [1] } },
          { caption: '发球落在中线上算界内，边线、底线也一样。', highlight: ['serviceBox:far:right', 'centerline:far'], players: [A1({ depth: 'behind', serving: true })], ball: { path: ['near:right:behind', 'far:center:mid'], bounces: [1] } },
        ],
      },
    ],
  },
  {
    // 装备。规格依 2026 USA Pickleball Official Rulebook 3.D（尺寸 3.D.2、重量 3.D.3、
    // 材质 3.D.4、表面 3.D.5、可改的地方 3.D.6–7）、18.A（比赛用认证拍）和 Equipment
    // Standards Manual 2.E–2.F；旋转测试：usapickleball.org 2026-07-08 公告（2026-10-01 起，
    // 新送审 ≤ 2,100 rpm）。选拍建议：pickleballcentral.com/paddle-guide（重量、拍型、握把、
    // 网球／壁球）、paddletek.com（拍芯、乒乓球）、heliospickleball.com（羽毛球，品牌博客）、
    // thedinkpickleball.com（网球转换常见错误）、pickleheads.com（预算、网球肘）；
    // 泡沫芯：pickleball.com“Foam Core Paddles Explained”、pickleballeffect.com foam vs polymer、
    // pickleheads.com foam paddle guide、nexpickleball.com（各家一致的部分才写）。
    id: 'gear',
    title: '装备',
    en: 'Equipment',
    intro: '球拍的官方规格，以及怎么挑一支适合自己的。',
    items: [
      {
        id: 'paddle-rules',
        title: '球拍规定',
        en: 'Paddle Rules',
        summary: '长加宽不超过 61 厘米、长度不超过 43 厘米，厚度和重量不限。正式比赛要用官方认证名单上的球拍。',
        figure: {
          kind: 'paddleRules',
          alt: '球拍尺寸上限和可以贴胶带的位置',
          length: '长 ≤ 43.18 厘米',
          sum: '长＋宽 ≤ 60.96 厘米',
          keys: ['拍框 1.27 厘米内：可以贴护边和胶带。', '拍面中间：不能贴东西。', '握把上方 2.5 厘米内：可以贴胶带、铅片、贴纸。'],
          caption: '黄色是胶带、贴纸可以贴的范围。',
        },
        blocks: [
          { items: [
            '尺寸：长＋宽（含护边和底盖）不超过 60.96 厘米（24 英寸），长度不超过 43.18 厘米（17 英寸）。厚度、重量都不限。',
            '材质要硬、不能压缩，不能有弹簧或蹦床效果。',
            '表面不能有洞、裂痕、脱层，不能贴砂纸、橡胶、防滑漆，或任何会加旋转的涂层；也不能是会反光、干扰对手视线的亮面。',
            '自己可以改的只有：贴护边胶带、加铅片、原厂配重、换原厂握把或拍面、缠手胶或加粗握把、贴名字或签名。胶带和贴纸只能贴在握把上方 2.5 厘米内，或离拍框 1.27 厘米内。',
          ] },
          { name: '正式比赛', items: [
            '球拍要印品牌、型号和“USA Pickleball Approved”，而且在官方认证名单上。',
            '赛前发现不合格：换一支就行。比赛中才发现：整场判负。赛后才发现：比分照算。',
            '2026 年 10 月起，新送审的球拍要通过旋转测试，每分钟 2,100 转以内。',
          ] },
          { name: '平时打球', items: [
            '没有人会检查，但官方规格本来就适用于所有比赛。买拍子挑有认证标志的最保险，以后参加比赛也能用。',
          ] },
        ],
      },
      {
        id: 'paddle-choose',
        title: '怎么选球拍',
        en: 'Choosing a Paddle',
        summary: '不知道选什么，就选中等重量、标准宽面、16 mm 拍芯：甜区大、最容易上手。打过别的拍类运动，可以照下面的建议挑。',
        figure: {
          kind: 'paddleShapes',
          alt: '三种拍型按比例画：标准宽面、混合型、长型，圆圈是甜区',
          names: { standard: '标准宽面', hybrid: '混合型', elongated: '长型' },
          sizes: { standard: '40.6 × 20.3 cm', hybrid: '41.3 × 19.7 cm', elongated: '41.9 × 19.1 cm' },
          caption: '按比例画，圆圈是甜区：拍面越长，够得越远，但甜区越小、离手越远。',
        },
        picker: {
          prompt: '你以前打什么？',
          labels: { shape: '拍型', weight: '重量', grip: '握把', face: '拍芯和拍面', why: '为什么', watch: '转过来要注意' },
          options: [
            { id: 'none', shapes: ['standard'], label: '没打过拍类', shape: '标准宽面拍', weight: '中等，约 213–232 克', grip: '按身高挑（见下面）', face: '16 mm 厚拍芯', why: '宽面拍甜区最大、最宽容，厚拍芯控球稳，打偏也不容易失控。', watch: [] },
            { id: 'tennis', shapes: ['elongated', 'hybrid'], label: '网球（或美式壁球）', shape: '长型或混合型', weight: '中等到偏重', grip: '长握把，双手反拍要 13.5 厘米以上', face: '看个人喜好；想要力量选 13 mm', why: '网球、美式壁球出身的人大多喜欢长握把、长拍面：够得远、挥起来有力量。', watch: ['挥拍要小，像推不像挥；大引拍很容易出界。', '网前截击拍面放正，不要往前踩、不要由上往下切。'] },
            { id: 'badminton', shapes: ['standard', 'hybrid'], label: '羽毛球', shape: '标准或混合型', weight: '偏轻', grip: '小一点', face: '碳纤维面，偏控球', why: '网前反应和落点是你的强项，轻拍和碳纤维面最能发挥。', watch: ['匹克球拍比羽毛球拍重两三倍（羽毛球拍约 70–100 克），不要用手腕甩，挥拍要短而扎实。'] },
            { id: 'tabletennis', shapes: ['standard'], label: '乒乓球', shape: '标准型，避开长型', weight: '中等偏轻（约 210–232 克，挑轻的那一端）', grip: '按身高挑', face: '中到厚拍芯，碳纤维面', why: '乒乓球手的手感和旋转控制很好，重心在中间的标准拍最顺手。', watch: ['手腕放直放松，不要甩。', '改用大陆式或东方式握法，不要沿用乒乓球握法。', '场地比球台大很多，脚步要多动。'] },
          ],
          note: '这是一般建议，不是规则；能试打就先试打。',
        },
        blocks: [
          { name: '重量', items: [
            '轻拍约 215–221 克以下：出手快、好挥，但力量和稳定性差一点。',
            '中等约 224–232 克：用的人最多。',
            '重拍约 235 克以上：力量大、稳，但比较慢，手臂也比较累。',
            '太轻或太重都可能伤手臂。有网球肘的人常被建议选中等重量、16 mm 以上的厚拍芯（这不是医疗建议）。',
          ] },
          { name: '拍型', items: [
            '标准宽面（约 40.6 × 20.3 厘米）：甜区最大、出手最快，覆盖范围最小。',
            '混合型：介于两者之间。',
            '长型（约 41.9 × 19.1 厘米）：够得最远、力量和旋转多，但甜区较小、位置较高。',
          ] },
          { name: '拍芯和拍面', figure: {
            kind: 'paddleCores',
            alt: '球拍剖面：上下是拍面，中间是拍芯；左边蜂窝芯，右边泡沫芯',
            names: { honeycomb: '蜂窝芯', foam: '泡沫芯' },
            caption: '把球拍切开来看：上下两片是拍面，中间是拍芯。',
          }, items: [
            '拍芯薄（约 13 mm）力量大，厚（约 16 mm）控球好、手感软、比较舒服。',
            '玻璃纤维面弹、有力量；碳纤维面偏控球和旋转。',
            '蜂窝芯（polymer honeycomb）：最常见，手感清脆、出球快。打久了蜂窝格会被压坏，弹性变差就该换拍。',
            '泡沫芯（foam，如 EPP、EVA）：比较新。普遍认为更耐打、手感扎实、甜区宽容、声音小；各家做法差别很大，有的力量很大、有的偏控球。因为还比较新，质量差的也可能变软、出现死点。',
          ] },
          { name: '握把', items: [
            '按身高：157 厘米以下约 10.2 厘米（4 英寸），160–173 厘米约 10.8 厘米（4¼ 英寸），175 厘米以上约 11.4 厘米（4½ 英寸）。',
            '不确定就选小一点，太小可以缠手胶加粗。',
            '握把加长，拍面就变短：总长度上限 43 厘米是固定的。',
          ] },
          { name: '预算', items: [
            '刚开始约 50–100 美元的拍子就够用，确定会一直打再考虑更贵的。',
            '球拍不分男女，也不分室内室外。',
          ] },
        ],
      },
    ],
  },
  {
    id: 'sideout',
    title: '侧出计分',
    en: 'Side-out Scoring',
    subtitle: 'USA Pickleball 正式比赛',
    note: '先在上面选好单打／双打，再按顺序看：怎么得分、怎么报分、谁发球站哪里。',
    scoring: 'sideout',
    intro: '正式比赛和大多数球场用的计分。只有发球方能得分。',
    items: [
      {
        id: 'points',
        step: 'points',
        title: '怎么得分',
        en: 'Scoring',
        summary: '只有发球方能得分。打到 11 分、要赢 2 分。发球方输球不扣分，换搭档发；两个人都输了才换对方发（side-out）。',
        detail: [
          '发球方赢这一球得 1 分，同一个人继续发。',
          '发球方输了不扣分：第一发球员输了换第二发球员发，第二发球员也输了就换对方发球，叫 side-out。',
          '开局例外：第一局第一个发球的队伍只有一个人可以发，输了就直接换对方。',
          '接球方赢球不得分，只是离拿回发球权近一步。',
          '正式比赛通常三局两胜，每局 11 分；也有 15 分或 21 分的赛制。',
        ],
        scenes: [
          { caption: '甲队发球、赢了这一球：得 1 分，同一个人继续发。', players: [A1({ pos: 'left', depth: 'behind', serving: true }), A2({ pos: 'right' }), B1(), B2()] },
          { caption: '甲1 输了这一球：不扣分，换搭档甲2 发。', players: [A1({ pos: 'left' }), A2({ pos: 'right', depth: 'behind', serving: true }), B1(), B2()] },
          { caption: '甲2 也输了：side-out，换乙队发球。乙队这时候赢球才开始得分。', players: [A1({ pos: 'left' }), A2({ pos: 'right' }), B1({ depth: 'behind', serving: true }), B2()] },
        ],
        singlesSummary: '只有发球方能得分。打到 11 分、要赢 2 分。发球方输球不扣分，直接换对方发（side-out）。',
        singlesDetail: [
          '发球方赢这一球得 1 分，继续发。',
          '发球方输了不扣分，直接换对方发。单打没有第二发球员。',
          '每次发球只有一次机会，没有网球那种二发。发球失误就算输这一球。',
          '正式比赛通常三局两胜，每局 11 分；也有 15 分或 21 分的赛制。',
        ],
        singlesScenes: [
          { caption: '甲发球、赢了这一球：得 1 分，继续发。', players: [S({ pos: 'left', ...srv }), R({ pos: 'left' })] },
          { caption: '甲输了这一球：不扣分，直接换乙发（side-out）。', players: [S(), R(srv)] },
        ],
      },
      {
        id: 'calling',
        step: 'calling',
        title: '怎么报分',
        en: 'Calling the Score',
        summary: '双打报三个数字：“发球方分数、接球方分数、第几发球员”。发球前报。',
        detail: [
          '第一个数字是发球方，第二个是接球方，第三个是 1 或 2：这一轮的第一还是第二发球员。',
          '开局报“0-0-2”：第一局第一个发球的队伍只有一个人可以发，所以直接从第二发球员算起。',
          '例：“5-3-1”＝发球方 5 分、接球方 3 分、第一发球员在发。',
        ],
        scenes: [
          { caption: '开局甲队发球，报“0-0-2”。', players: four({ A1: { depth: 'behind', serving: true } }) },
          { caption: '甲队赢了这一球，变 1 分，报“1-0-2”。', players: [A1({ pos: 'left', depth: 'behind', serving: true }), A2({ pos: 'right' }), B1(), B2()] },
          { caption: '甲队输了这一球。因为是第二发球员，换乙队发，乙队先报自己的分数：“0-1-1”。', players: [A1({ pos: 'left' }), A2({ pos: 'right' }), B1({ depth: 'behind', serving: true }), B2()] },
        ],
        singlesSummary: '单打报两个数字：“发球方分数、接球方分数”。发球前报。',
        singlesDetail: [
          '先报发球方自己的分数，再报对方的。单打没有第几发球员。',
          '例：“3-5”＝发球方 3 分、接球方 5 分。',
        ],
        singlesScenes: [
          { caption: '开局甲发球，报“0-0”。', players: [S(srv), R()] },
          { caption: '甲赢这球变 1 分，报“1-0”。', players: [S({ pos: 'left', ...srv }), R({ pos: 'left' })] },
          { caption: '换乙发球，乙先报自己的分数：“0-1”。', players: [S(), R(srv)] },
        ],
      },
      {
        id: 'positions',
        step: 'positions',
        title: '谁发球、站哪里',
        en: 'Serving & Positions',
        summary: '拿回发球权时，站在右边的人先发。得分才换位，接球的队伍不动。',
        detail: [
          '每次 side-out 的第一球都从右边发，由当时站右边的人发，这个人就是这一轮的第一发球员。没有固定的第一发球员。',
          '发球方赢一球，发球员跟搭档换边，同一个人继续发。发球方输一球，换搭档发，从他站的位置发。第二发球员也输了就 side-out。',
          '接球的队伍永远不动。所以“谁站右边”只跟分数有关：开局站右边的人，你们偶数分时他在右边，奇数分时他在左边。',
          '口诀：拿回发球权，看分数确认站位，右边的人开球。',
        ],
        scenes: [
          { caption: '开局：甲1 站右边发球，报“0-0-2”。', players: four({ A1: { depth: 'behind', serving: true } }) },
          { caption: '甲队得 1 分：甲1 和甲2 换边，甲1 从左边继续发，报“1-0-2”。', players: [A1({ pos: 'left', depth: 'behind', serving: true }), A2({ pos: 'right' }), B1(), B2()] },
          { caption: '甲队失分，side-out。乙队 0 分，乙1 站右边先发，报“0-1-1”。甲队保持原位不动。', players: [A1({ pos: 'left' }), A2({ pos: 'right' }), B1({ depth: 'behind', serving: true }), B2()] },
          { caption: '乙1 失分：换乙2 发，从他站的左边发，报“0-1-2”。', players: [A1({ pos: 'left' }), A2({ pos: 'right' }), B1(), B2({ depth: 'behind', serving: true })] },
          { caption: '乙2 也失分，side-out 回到甲队。甲队 1 分（奇数），甲1 在左边，所以站右边的甲2 先发，报“1-0-1”。', players: [A1({ pos: 'left' }), A2({ pos: 'right', depth: 'behind', serving: true }), B1(), B2()] },
          { caption: '甲2 得分变 2 分（偶数）：两人换边，甲1 回到右边。开局站右边的甲1，偶数分永远在右边。', players: [A1({ pos: 'right' }), A2({ pos: 'left', depth: 'behind', serving: true }), B1(), B2()] },
        ],
        singlesSummary: '看发球员自己的分数：偶数从右边发、奇数从左边发。接球的人站对角。',
        singlesDetail: [
          '发球员得分就换到另一边继续发。',
          '换对方发球时，对方按他自己的分数决定从哪一边发。',
          '接球的人永远站在发球员的对角。',
        ],
        singlesScenes: [
          { caption: '开局甲 0 分（偶数），从右边发，乙站对角接。', players: [S(srv), R()] },
          { caption: '甲得分变 1 分（奇数），换到左边发，乙也换到对角。', players: [S({ pos: 'left', ...srv }), R({ pos: 'left' })] },
          { caption: '换乙发球。乙 0 分（偶数），从右边发。', players: [S(), R(srv)] },
        ],
      },
    ],
  },
  {
    id: 'rally',
    title: '每球得分',
    en: 'Rally Scoring',
    subtitle: '2026 暂行规则',
    note: '先在上面选好单打／双打，再按顺序看：怎么得分、怎么报分、谁发球站哪里。',
    scoring: 'rally',
    intro: '每一球都有人得分，一局结束得比较快，很多球场的社交局用这个。USA Pickleball 从 2025 年起把它列为暂行规则（provisional），2026 年继续沿用。',
    items: [
      {
        id: 'rally-points',
        step: 'points',
        title: '怎么得分',
        en: 'Scoring',
        summary: '每一球结束都有一队得 1 分，谁赢这球谁发下一球。没有第二发球员。',
        detail: [
          '打到 11、15 或 21 分，要赢 2 分。社交局最常用 15 或 21。',
          '发球方赢球：得 1 分，同一个人继续发。',
          '接球方赢球：得 1 分并拿到发球权。',
          '2026 年起接球方也可以拿下最后一分，不用先拿回发球权。',
        ],
        scenes: [
          { caption: '甲队发球、赢了这一球：得 1 分，甲1 继续发。', players: [A1({ pos: 'left', depth: 'behind', serving: true }), A2({ pos: 'right' }), B1(), B2()] },
          { caption: '乙队赢下一球：乙队也得 1 分，并拿到发球权。1-1。', players: [A1({ pos: 'left' }), A2({ pos: 'right' }), B1({ pos: 'left' }), B2({ pos: 'right', depth: 'behind', serving: true })] },
        ],
        singlesSummary: '每一球结束都有人得 1 分，谁赢这球谁发下一球。',
        singlesDetail: [
          '打到 11、15 或 21 分，要赢 2 分。打到几分开打前说好。',
          '发球方赢球：得 1 分，继续发。',
          '接球方赢球：得 1 分并拿到发球权。',
          '2026 年起接球方也可以拿下最后一分，不用先拿回发球权。',
        ],
        singlesScenes: [
          { caption: '甲发球、赢了这一球：得 1 分，继续发。', players: [A1({ label: '甲', pos: 'left', depth: 'behind', serving: true }), B1({ label: '乙', pos: 'left' })] },
          { caption: '乙赢下一球：乙也得 1 分，并拿到发球权。1-1。', players: [A1({ label: '甲', pos: 'left' }), B1({ label: '乙', pos: 'left', depth: 'behind', serving: true })] },
        ],
      },
      {
        id: 'rally-calling',
        step: 'calling',
        title: '怎么报分',
        en: 'Calling the Score',
        summary: '只报两个数字：“发球方分数、接球方分数”。双打也不报第几发球员。',
        detail: [
          '开局报“0-0”。',
          '例：“7-5”＝发球方 7 分、接球方 5 分。',
          '跟侧出计分最大的区别：双打没有第三个数字，因为没有第二发球员。',
        ],
        scenes: [
          { caption: '开局甲1 发球，报“0-0”。', players: four({ A1: { depth: 'behind', serving: true } }) },
          { caption: '乙队赢球拿到发球权，乙2 发球，乙队先报自己的分数：“1-0”。', players: [A1(), A2(), B1({ pos: 'left' }), B2({ pos: 'right', depth: 'behind', serving: true })] },
        ],
        singlesSummary: '只报两个数字：“发球方分数、接球方分数”。',
        singlesDetail: [
          '开局报“0-0”。',
          '例：“7-5”＝发球方 7 分、接球方 5 分。',
        ],
        singlesScenes: [
          { caption: '开局甲发球，报“0-0”。', players: [A1({ label: '甲', depth: 'behind', serving: true }), B1({ label: '乙' })] },
          { caption: '乙赢球拿到发球权。1 分是奇数，乙从左边发，先报自己的分数：“1-0”。', players: [A1({ label: '甲', pos: 'left' }), B1({ label: '乙', pos: 'left', depth: 'behind', serving: true })] },
        ],
      },
      {
        id: 'rally-positions',
        step: 'positions',
        title: '谁发球、站哪里',
        en: 'Serving & Positions',
        summary: '两队都按自己的分数站：开局站右边的人，偶数分在右、奇数分在左。换发时由站右边的人发。',
        detail: [
          '发球方赢球：发球员跟搭档换边，同一个人继续发。',
          '接球方赢球：得 1 分并拿到发球权。两人先按新分数站好，再由站右边的人发球。换发之后的第一球一定从右边发。',
          '输球的那队不动。',
          '口诀：站位看分数，谁发看换发。',
          '常见误解：拿到发球权时不换位、直接由站左边的人发。USA Pickleball 的规定是先换位，换发后的第一球一律从右边发。各球场做法不同的话，开打前说好。',
        ],
        scenes: [
          { caption: '甲队 0 分，甲1 从右边发，报“0-0”。', players: four({ A1: { depth: 'behind', serving: true } }) },
          { caption: '甲队赢球：1-0，甲1 和甲2 换边，甲1 继续发。', players: [A1({ pos: 'left', depth: 'behind', serving: true }), A2({ pos: 'right' }), B1(), B2()] },
          { caption: '乙队赢球：得 1 分并拿到发球权。1 分是奇数，乙1 和乙2 先换边，再由站右边的乙2 发，报“1-1”。', players: [A1({ pos: 'left' }), A2({ pos: 'right' }), B1({ pos: 'left' }), B2({ pos: 'right', depth: 'behind', serving: true })] },
          { caption: '甲队再赢：2 分是偶数，甲1 回到右边，由他发，报“2-1”。乙队输球不动。', players: [A1({ depth: 'behind', serving: true }), A2(), B1({ pos: 'left' }), B2({ pos: 'right' })] },
        ],
        singlesSummary: '发球员看自己的分数站：偶数从右边发、奇数从左边发。接球的人站对角。',
        singlesDetail: [
          '站位跟侧出计分的单打一样，看发球员自己的分数：偶数右边、奇数左边。',
          '发球方赢球：换到另一边继续发。',
          '接球方赢球：拿到发球权，按自己的新分数决定从哪一边发。',
        ],
        singlesScenes: [
          { caption: '开局 0-0：甲从右边发，乙站对角接。', players: [A1({ label: '甲', depth: 'behind', serving: true }), B1({ label: '乙' })], ball: { path: ['near:right:behind', 'far:right:mid'], bounces: [1] } },
          { caption: '甲赢球：1-0，甲换到左边继续发，乙也换到对角接。', players: [A1({ label: '甲', pos: 'left', depth: 'behind', serving: true }), B1({ label: '乙', pos: 'left' })], ball: { path: ['near:left:behind', 'far:left:mid'], bounces: [1] } },
          { caption: '乙赢球：乙得 1 分并拿到发球权。1 分是奇数，乙从左边发，报“1-1”。', players: [A1({ label: '甲', pos: 'left' }), B1({ label: '乙', pos: 'left', depth: 'behind', serving: true })], ball: { path: ['far:left:behind', 'near:left:mid'], bounces: [1] } },
        ],
      },
      {
        id: 'rally-pro',
        title: '职业赛与冻结',
        en: 'Pro Play (MLP)',
        summary: '职业联赛 MLP 在 2023 到 2025 年用每球得分加“冻结”：快赢的那队只有自己发球时才能得分。2026 年双打改回侧出计分。',
        collapsed: true,
        detail: [
          '冻结是什么：分数到某个关口之后，这一队只有在自己发球时赢球才得分。对方发球时就算你赢了那一球，也只是拿回发球权、不加分，跟侧出计分一样。',
          'MLP 双打打到 21 分：先到 20 分的队伍冻结；另一队追到 18 分时也冻结。',
          '例子：甲 20、乙 15，甲已经冻结。乙发球、甲赢了这一球：甲不加分，只换甲发球。甲发球再赢一球：21 分，比赛结束。',
          '为什么要冻结：不让接球的一方靠一球就结束比赛，最后几分会更有拉锯。这是 MLP 的规则，USA Pickleball 的每球得分没有冻结。',
          '2026 年 MLP 双打改回侧出计分 11 分制，每球得分只留在单打决胜的 DreamBreaker（打到 21 分，赢 2 分，没有冻结）。',
          '所以现在看到的“每球得分”，就是上面 USA Pickleball 的暂行版本，没有冻结规则。',
        ],
        scenes: [],
      },
    ],
  },
  {
    id: 'play',
    title: '通用规则',
    en: 'Core Rules',
    intro: '单打双打、哪一种计分都一样的规则。',
    items: [
      {
        id: 'serve',
        title: '发球',
        en: 'Serve',
        summary: '站在底线后，低手把球对角发到对面的发球区，要越过厨房和厨房线。只有一次机会。',
        detail: [
          '挥拍发球（volley serve）：手臂由下往上挥，击球点低于腰部（肚脐），击球时拍头要低于手腕。2026 年起这三点都要“明显”合法，模糊的就判失误。',
          '落地发球（drop serve）：把球从手上自然放下，落地反弹后再打，怎么挥都可以，但放球时不能用手指加旋转。新手用这种最保险。',
          '发球时至少一只脚在底线后方的地面上，脚不能碰到底线或场内，也不能超出边线和中线的延长线。',
          '发球擦网后落在正确的发球区照打，2021 年起没有 let 重发。',
          '发球前要先报分，报完 10 秒内要发出去。',
        ],
        singlesScenes: [
          { caption: '发球的人站在底线后面，至少一只脚踩在地上。', highlight: ['baseline:near'], players: [S(srv), R()] },
          { caption: '对角发到对面的发球区，球要飞过厨房和厨房线。', highlight: ['serviceBox:far:right'], players: [S(srv), R()], ball: { path: ['near:right:behind', 'far:right:mid'], bounces: [1] } },
          { caption: '发太短落在厨房或厨房线上，失误。', highlight: ['nvz:far'], players: [S(srv), R()], ball: { path: ['near:right:behind', 'far:right:kitchen'], bounces: [1] } },
        ],
        scenes: [
          { caption: '发球的人站在底线后面，至少一只脚踩在地上。', highlight: ['baseline:near'], players: [A1({ depth: 'behind', serving: true }), A2(), B1(), B2()] },
          { caption: '对角发到对面的发球区，球要飞过厨房和厨房线。', highlight: ['serviceBox:far:right'], players: [A1({ depth: 'behind', serving: true }), A2(), B1(), B2()], ball: { path: ['near:right:behind', 'far:right:mid'], bounces: [1] } },
          { caption: '发太短落在厨房或厨房线上，失误。', highlight: ['nvz:far'], players: [A1({ depth: 'behind', serving: true }), A2(), B1(), B2()], ball: { path: ['near:right:behind', 'far:right:kitchen'], bounces: [1] } },
        ],
      },
      {
        id: 'two-bounce',
        title: '双弹跳',
        en: 'Two-Bounce Rule',
        summary: '发球要落地一次，回球也要落地一次，之后才可以在空中截击。',
        detail: [
          '接发球的人一定要等球落地才能打，发球方打第三拍也一定要等球落地。',
          '所以发球方发完球不要急着冲上网，先站在底线等第三拍。',
          '两次落地之后，谁都可以截击，但厨房规则还是要遵守。',
          '回球没有规定要落在哪里，只要落在对面界内就行，深球、短球、落在厨房都可以。只有发球要落在斜对角的发球区，而且不能落在厨房或厨房线上。',
          '球碰到线算界内。唯一例外是发球碰到厨房线，算发球失误。',
        ],
        singlesScenes: [
          { caption: '第一拍：发球。球要在对面弹一次（圈起来的地方），乙才能打。', players: [S(srv), R()], ball: { path: TWO_BOUNCE, bounces: [1, 2], step: 1 } },
          { caption: '第二拍：回球。球也要在甲这边弹一次，所以甲发完球先留在底线等。乙回完球往前走。', players: [S(), R({ depth: 'mid' })], ball: { path: TWO_BOUNCE, bounces: [1, 2], step: 2 } },
          { caption: '第三拍：甲等球弹过再打。两次弹跳到这里都完成了，乙已经站到厨房线。', players: [S(), R({ depth: 'kitchenLine' })], ball: { path: TWO_BOUNCE, bounces: [1, 2], step: 3 } },
          { caption: '第四拍起可以截击：乙不等落地，在空中直接把第三拍打回去。没有圈的地方就是球没落地。', players: [S(), R({ depth: 'kitchenLine' })], ball: { path: TWO_BOUNCE, bounces: [1, 2], step: 4 } },
        ],
        scenes: [
          { caption: '第一拍：发球。球要在对面弹一次（圈起来的地方），乙队才能打。', players: [A1(srv), A2(), B1(), B2()], ball: { path: TWO_BOUNCE, bounces: [1, 2], step: 1 } },
          { caption: '第二拍：回球。球也要在甲队这边弹一次，所以甲队发完球先留在底线等。乙队回完球往前走。', players: [A1(), A2(), B1({ depth: 'mid' }), B2({ depth: 'mid' })], ball: { path: TWO_BOUNCE, bounces: [1, 2], step: 2 } },
          { caption: '第三拍：甲队等球弹过再打。两次弹跳到这里都完成了，乙队已经站到厨房线。', players: [A1(), A2(), B1({ depth: 'kitchenLine' }), B2({ depth: 'kitchenLine' })], ball: { path: TWO_BOUNCE, bounces: [1, 2], step: 3 } },
          { caption: '第四拍起可以截击：乙1 不等落地，在空中直接把第三拍打回去。没有圈的地方就是球没落地。', players: [A1(), A2(), B1({ depth: 'kitchenLine' }), B2({ depth: 'kitchenLine' })], ball: { path: TWO_BOUNCE, bounces: [1, 2], step: 4 } },
        ],
      },
      {
        id: 'kitchen',
        title: '厨房（非截击区）',
        en: 'Kitchen',
        summary: '人碰到厨房或厨房线的时候，不能把球在空中直接打回去。球落地之后随便你站哪里。',
        detail: [
          '截击的整个动作都不能碰到厨房：起跳前、挥拍中、挥完之后因为惯性踩进去，都算犯规，就算球已经死了也一样。',
          '你身上的东西掉进厨房也算：帽子、拍子、眼镜。搭档拉住你不让你跌进去也算犯规。',
          '球落地之后可以进厨房打，打完再退出去。但只要人还在厨房里或踩着线，就不能截击下一球；要两只脚都回到厨房线外才可以。',
        ],
        singlesDetail: [
          '截击的整个动作都不能碰到厨房：起跳前、挥拍中、挥完之后因为惯性踩进去，都算犯规，就算球已经死了也一样。',
          '你身上的东西掉进厨房也算：帽子、拍子、眼镜。',
          '球落地之后可以进厨房打，打完再退出去。但只要人还在厨房里或踩着线，就不能截击下一球；要两只脚都回到厨房线外才可以。',
        ],
        singlesScenes: [
          { caption: '两个人都站在厨房线后面打 dink。', highlight: ['nvz'], players: [S({ depth: 'kitchenLine' }), R({ pos: 'left', depth: 'kitchenLine' })] },
          { caption: '人在厨房里把球在空中打回去：犯规。', highlight: ['nvz:near'], players: [S({ depth: 'kitchen' }), R({ pos: 'left', depth: 'kitchenLine' })], ball: { path: ['far:left:kitchenLine', 'near:right:kitchen'] } },
          { caption: '球先落在厨房里，再进去打：合法。', highlight: ['nvz:near'], players: [S({ depth: 'kitchen' }), R({ pos: 'left', depth: 'kitchenLine' })], ball: { path: ['far:left:kitchenLine', 'near:right:kitchen', 'far:left:kitchen'], bounces: [1], step: 2 } },
        ],
        scenes: [
          { caption: '四个人都站在厨房线后面打 dink，这是最常见的画面。', highlight: ['nvz'], players: [A1({ depth: 'kitchenLine' }), A2({ depth: 'kitchenLine' }), B1({ depth: 'kitchenLine' }), B2({ depth: 'kitchenLine' })] },
          { caption: '人在厨房里把球在空中打回去：犯规。', highlight: ['nvz:near'], players: [A1({ depth: 'kitchen' }), A2({ depth: 'kitchenLine' }), B1({ depth: 'kitchenLine' }), B2({ depth: 'kitchenLine' })], ball: { path: ['far:left:kitchenLine', 'near:right:kitchen'] } },
          { caption: '球先落在厨房里，再进去打：合法。', highlight: ['nvz:near'], players: [A1({ depth: 'kitchen' }), A2({ depth: 'kitchenLine' }), B1({ depth: 'kitchenLine' }), B2({ depth: 'kitchenLine' })], ball: { path: ['far:left:kitchenLine', 'near:right:kitchen', 'far:right:kitchen'], bounces: [1], step: 2 } },
        ],
      },
      {
        id: 'faults',
        title: '常见犯规',
        en: 'Faults',
        summary: '球出界、下网、厨房截击、违反双弹跳，还有球打到身上，这一球都结束。',
        detail: [
          '出界：球落在线外。碰到线算界内。',
          '下网：球没过网，或是从网下面过去。',
          '球碰到身体：除了持拍手手腕以下，球碰到你身上任何地方都算失误，衣服也算。',
          '触网：人、拍子或衣服在活球期间碰到球网或网柱。',
          '连击：同一个人连续击球两次，除非是一个连贯的挥拍动作。',
          '发球员错、站位错：正式比赛裁判会叫停纠正；自己打的话，发现了就重打那一球。',
        ],
        singlesDetail: [
          '出界：球落在线外。碰到线算界内。',
          '下网：球没过网，或是从网下面过去。',
          '球碰到身体：除了持拍手手腕以下，球碰到你身上任何地方都算失误，衣服也算。',
          '触网：人、拍子或衣服在活球期间碰到球网或网柱。',
          '连击：同一个人连续击球两次，除非是一个连贯的挥拍动作。',
          '站位错（从错的那一边发球）：正式比赛裁判会叫停纠正；自己打的话，发现了就重打那一球。',
        ],
        singlesScenes: [
          { caption: '球落在底线外，出界。', highlight: ['baseline:far'], players: [S(), R({ pos: 'left' })], ball: { path: ['near:right:mid', 'far:left:behind'], bounces: [1] } },
        ],
        scenes: [
          { caption: '球落在底线外，出界。', highlight: ['baseline:far'], players: four(), ball: { path: ['near:left:mid', 'far:left:behind'], bounces: [1] } },
        ],
      },
      {
        // 绕柱球与球网：USA Pickleball 11.K（网柱）、11.L（球网、11.L.3 绕柱球）。
        id: 'net',
        title: '擦网与绕柱球',
        en: 'Net & Around the Post',
        summary: '回球不一定要从网上面过。从网柱外侧绕过去、落在对面界内也算好球，叫绕柱球（ATP）。',
        detail: [
          '球擦网后掉进对面界内，照打。发球擦网也照打，不重发。',
          '绕柱球可以比球网还低，只要落在对面界内就行。常见于对手把球斜着打到很外面的时候。',
          '球打到网柱，或从球网和网柱中间穿过去，算击球一方失误。',
          '打绕柱球可以跑出场外、甚至跑到隔壁场，但人和球拍都不能碰到网柱或球网，也不能踩进对方的场地。',
        ],
        scenes: [
          { caption: '乙斜线 dink 到很外面，球在甲这边的厨房弹一下，往场外飞。', players: [A1({ pos: 'right', depth: 'mid' }), B1({ depth: 'kitchenLine' })], ball: { path: ['far:right:kitchenLine', 'near:right:kitchen', [270, 318]], bounces: [1] } },
          { caption: '甲追到场外，从网柱外侧把球打回去。球比球网还低，但没碰到网柱、落在对面界内，算好球。', highlight: ['net'], players: [A1({ at: [266, 326], field: true }), B1({ depth: 'kitchenLine' })], ball: { path: [[266, 318], [268, 252], [170, 120]], bounces: [2] } },
        ],
      },
      {
        id: 'ends',
        title: '换场',
        en: 'Changing Ends',
        summary: '每局打完换场。决胜局打到一方 6 分时换场（11 分制）。',
        detail: [
          '三局两胜的第三局，有一方先到 6 分时双方换边，发球权不变，继续由原来的人发。15 分制在 8 分换，21 分制在 11 分换。',
          '换场有 1 分钟，局与局之间有 2 分钟。',
        ],
        singlesScenes: [
          { caption: '决胜局 6-3 时换边，发球的人不变。', players: [S(srv), R()] },
        ],
        scenes: [
          { caption: '决胜局 6-3 时换边，发球员不变。', players: four({ A1: { depth: 'behind', serving: true } }) },
        ],
      },
    ],
  },
];

export const COMPARE = {
  title: '侧出计分 vs 每球得分',
  en: 'Side-out vs Rally',
  rows: [
    ['谁能得分', '只有发球方', '每一球都有人得分'],
    ['报分', '双打三个数字（加上第几发球员），单打两个数字', '两个数字：发球方、接球方'],
    ['一局几分', '11 分，赢 2 分', '15 或 21 分，赢 2 分'],
    ['第二发球员', '双打有，两个人轮流发；单打没有', '没有，输球就换对方发'],
    ['换位', '发球方得分才换', '得分的那队按新分数站位，换发后由右边的人发'],
    ['最后一分', '要在自己发球时拿到', '接球方也可以直接拿下'],
    ['一局多久', '约 15 到 25 分钟', '约 10 到 15 分钟'],
  ],
};
