// 趣味玩法。这些都不是官方规则，各球场做法不同；每一种都标 official: false。
// group 按目的分类：人多场地少、人数凑不齐、想练技术、想玩热闹。数组顺序就是目录和上一条／下一条的顺序。
// scenes：球场图步骤，位置名称由 src/court.js 定义。排队或休息的人画在球场
// 右侧场外（淡色）。橙色（A）在下半场，绿色（B）在上半场。

const P = (team, side, pos, label, extra = {}) => ({ team, side, pos, label, ...extra });
const wait = (team, i, label) => ({ team, at: [262, 80 + i * 40], label, dim: true });
// 绕场的两排：各自属于球场的一端，球场横放时也跟着留在自己那一端。
const queueFar = (team, i, label) => ({ team, at: [262, 80 + i * 40], label, dim: true, keepSide: true });
const queueNear = (team, i, label) => ({ team, at: [262, 440 - i * 40], label, dim: true, keepSide: true });
// 出局的人：画在球场左侧场外。
const out = label => ({ team: 'A', at: [18, 260], label, dim: true });
const serve = { depth: 'behind', serving: true };
const atLine = { depth: 'kitchenLine' };
export const FORMATS = [
  {
    id: 'king',
    name: '国王球场',
    en: 'King of the Court',
    group: '人多场地少',
    players: '6 人以上、场地不够时',
    tagline: '赢的留下、输的排队，最快消化人潮的玩法。',
    rules: [
      '一块场地四个人打短局，输的一队下场排到队伍最后。',
      '赢的一队留在场上，换排在最前面的两个人上来当对手。',
      '留场的队伍连赢三场就自动下场，让大家都有球打。',
      '新上场的队伍先发球，因为留场的已经有主场优势。',
    ],
    scoring: '每球得分，打到 7 分或 11 分，不用赢 2 分。',
    scenes: [
      { caption: '甲队留在场上，乙队上来挑战。其他人在场边排队。', players: [P('A', 'near', 'right', '甲1'), P('A', 'near', 'left', '甲2'), P('B', 'far', 'right', '乙1', serve), P('B', 'far', 'left', '乙2'), wait('B', 0, '丙1'), wait('B', 1, '丙2'), wait('B', 2, '丁1'), wait('B', 3, '丁2')] },
      { caption: '乙队输了，下场排到队伍最后。排最前面的丙队上场，新上场的先发球。', players: [P('A', 'near', 'right', '甲1'), P('A', 'near', 'left', '甲2'), P('B', 'far', 'right', '丙1', serve), P('B', 'far', 'left', '丙2'), wait('B', 0, '丁1'), wait('B', 1, '丁2'), wait('B', 2, '乙1'), wait('B', 3, '乙2')] },
      { caption: '甲队连赢三场也要下场，换排最前面的丁队上来，让大家都有球打。', players: [P('A', 'near', 'right', '丁1', serve), P('A', 'near', 'left', '丁2'), P('B', 'far', 'right', '丙1'), P('B', 'far', 'left', '丙2'), wait('B', 0, '乙1'), wait('B', 1, '乙2'), wait('A', 2, '甲1'), wait('A', 3, '甲2')] },
    ],
    tip: '用“抽签”页的国王球场模式，点一下赢家就会自动排队。',
  },
  {
    id: 'roundrobin',
    name: '轮转赛',
    en: 'Round Robin',
    group: '人多场地少',
    players: '8 到 16 人、1 到 4 块场地',
    tagline: '每一轮换搭档、换对手，最后算个人总分。',
    rules: [
      '事先排好每一轮谁跟谁一队、在哪块场地，休息的人也排好。',
      '每一轮所有场地同时开打，打固定分数或固定时间。',
      '每个人记自己这一轮拿到的分数，不管队友是谁。',
      '打完所有轮次，个人总分最高的是今天的赢家。',
    ],
    scoring: '每球得分，打到 11 分（或计时 10 分钟），把自己那队的分数记在个人名下。',
    scenes: [
      { caption: '第 1 轮：明＋华 对 婷＋卫，佩和伦先休息。', players: [P('A', 'near', 'right', '明'), P('A', 'near', 'left', '华'), P('B', 'far', 'right', '婷'), P('B', 'far', 'left', '卫'), wait('A', 0, '佩'), wait('A', 1, '伦')] },
      { caption: '第 2 轮：换搭档也换对手，刚才休息的人上场。', players: [P('A', 'near', 'right', '明'), P('A', 'near', 'left', '佩'), P('B', 'far', 'right', '华'), P('B', 'far', 'left', '伦'), wait('A', 0, '婷'), wait('A', 1, '卫')] },
      { caption: '每个人记自己拿到的分数，不管队友是谁。打完所有轮次，总分最高的赢。', players: [P('A', 'near', 'right', '婷'), P('A', 'near', 'left', '伦'), P('B', 'far', 'right', '明'), P('B', 'far', 'left', '佩'), wait('A', 0, '华'), wait('A', 1, '卫')] },
    ],
    tip: '用“抽签”页生成轮次表，程序会尽量让大家不重复搭档。',
  },
  {
    id: 'quick',
    name: '快打短局',
    en: 'Quick Games',
    group: '人多场地少',
    players: '4 人、人多轮转时',
    tagline: '7 分一局或 10 分钟一局，上下场最快。',
    rules: [
      '每球得分，先到 7 分就结束，不用赢 2 分。',
      '或者设一个 10 分钟的计时器，时间到分数高的赢，平手就打一球定胜负。',
      '发球权按每球得分制走：谁赢这球谁发下一球。',
    ],
    scoring: '每球得分到 7 分，或计时 10 分钟。',
    scenes: [
      { caption: '每球得分，谁赢这球谁发下一球。先到 7 分就结束，不用赢 2 分。', players: [P('A', 'near', 'right', '甲1', serve), P('A', 'near', 'left', '甲2'), P('B', 'far', 'right', '乙1'), P('B', 'far', 'left', '乙2')], ball: { path: ['near:right:behind', 'far:right:mid'], bounces: [1] } },
    ],
    tip: '记分板选“快打”模式，分数设 7、赢 1 分就好。',
  },
  {
    id: 'cutthroat',
    name: '3 人制',
    en: 'Cutthroat',
    group: '人数凑不齐',
    players: '刚好 3 人',
    tagline: '一个人打两个人，轮流当那个“一个人”。',
    rules: [
      '发球的人自己一队，对面两个人一队，发球的人用整个半场，对面按双打规则。',
      '发球的人赢了这一球就得 1 分，继续发球，发球位置按分数偶右奇左。',
      '发球的人输了就换下一位当发球员，三个人轮流。',
      '每个人记自己的分数，先到 11 分的人赢。',
    ],
    scoring: '只有发球的人能得分，先到 11 分（赢 2 分）。',
    scenes: [
      { caption: '发球的甲（橙色）自己一队，守整个半场；对面乙、丙两人一队。', highlight: ['nvz:near', 'serviceBox:near:right', 'serviceBox:near:left'], players: [P('A', 'near', 'right', '甲', serve), P('B', 'far', 'right', '乙'), P('B', 'far', 'left', '丙')] },
      { caption: '甲赢球得 1 分，继续发。1 分是奇数，换到左边发。', players: [P('A', 'near', 'left', '甲', serve), P('B', 'far', 'right', '乙'), P('B', 'far', 'left', '丙')], ball: { path: ['near:left:behind', 'far:left:mid'], bounces: [1] } },
      { caption: '甲输了，换乙当一个人的那方来发球；甲换到对面跟丙一队。', highlight: ['nvz:near', 'serviceBox:near:right', 'serviceBox:near:left'], players: [P('A', 'near', 'right', '乙', serve), P('B', 'far', 'right', '甲'), P('B', 'far', 'left', '丙')] },
    ],
    tip: '单打那一边很累，短局 7 分比较合适；也有人让单打方的发球区放宽到整个半场。',
  },
  {
    id: 'skinny',
    name: '半场单打',
    en: 'Skinny Singles',
    group: '人数凑不齐',
    players: '刚好 2 人',
    tagline: '单打只用一半的场地，跑动少、练落点。',
    rules: [
      '分数偶数时两人都用右半场，奇数时两人都用左半场，球落到另一半算出界。',
      '另一种打法是对角：发球员站偶右奇左，对手站对角的半场，球只能落在对角。',
      '其他规则跟单打一样：双弹跳、厨房规则都照旧。',
    ],
    scoring: '侧出计分到 11 分，或每球得分到 15 分，开打前先说好。',
    scenes: [
      { caption: '直线版：发球方分数偶数，两人都只用右边这半场，球落到另一半算出界。', highlight: ['serviceBox:near:right', 'serviceBox:far:left'], players: [P('A', 'near', 'right', '甲', serve), P('B', 'far', 'left', '乙')], ball: { path: ['near:right:behind', 'far:left:mid'], bounces: [1] } },
      { caption: '分数奇数：两人一起换到左边那半场。', highlight: ['serviceBox:near:left', 'serviceBox:far:right'], players: [P('A', 'near', 'left', '甲', serve), P('B', 'far', 'right', '乙')], ball: { path: ['near:left:behind', 'far:right:mid'], bounces: [1] } },
      { caption: '对角版：发球员照样偶右奇左，但球只能打到对角那半场。', highlight: ['serviceBox:near:right', 'serviceBox:far:right'], players: [P('A', 'near', 'right', '甲', serve), P('B', 'far', 'right', '乙')], ball: { path: ['near:right:behind', 'far:right:mid'], bounces: [1] } },
    ],
    tip: '两种版本开打前要先说清楚用哪一种，不然一定会吵。',
  },
  {
    id: 'dink',
    name: '厨房战',
    en: 'Dink Game',
    group: '想练技术',
    players: '2 或 4 人',
    tagline: '只能 dink，练耐心和手感。',
    rules: [
      '四个人都站厨房线后面，用 dink 开球（把球轻轻送过网）。',
      '球一定要落在对面的厨房里，超过厨房线算出界。',
      '不能截击、不能抽球，球一定要落地才能打。',
      '对方 dink 出界或下网，你就得 1 分。',
    ],
    scoring: '每球得分，打到 7 分或 11 分。',
    scenes: [
      { caption: '四个人都站厨房线后面，用 dink 开球，把球轻轻放进对面厨房。', highlight: ['nvz'], players: [P('A', 'near', 'right', '甲1', atLine), P('A', 'near', 'left', '甲2', atLine), P('B', 'far', 'right', '乙1', atLine), P('B', 'far', 'left', '乙2', atLine)], ball: { path: ['near:right:kitchenLine', 'far:left:kitchen'], bounces: [1] } },
      { caption: '球一定要落在对面厨房里，落到厨房外就算出界。', highlight: ['nvz:far'], players: [P('A', 'near', 'right', '甲1', atLine), P('A', 'near', 'left', '甲2', atLine), P('B', 'far', 'right', '乙1', atLine), P('B', 'far', 'left', '乙2', atLine)], ball: { path: ['near:left:kitchenLine', 'far:right:mid'], bounces: [1] } },
      { caption: '不能截击，球一定要先在厨房落地才能打。', highlight: ['nvz:near'], players: [P('A', 'near', 'right', '甲1', atLine), P('A', 'near', 'left', '甲2', atLine), P('B', 'far', 'right', '乙1', atLine), P('B', 'far', 'left', '乙2', atLine)], ball: { path: ['far:left:kitchenLine', 'near:right:kitchen', 'near:right:kitchenLine'], bounces: [1] } },
    ],
    tip: '很多球场会放宽到“厨房线后一步内”也算界内，开打前说好。',
  },
  {
    id: 'volley',
    name: '截击大战',
    en: 'Volley Wars',
    group: '想练技术',
    players: '2 或 4 人',
    tagline: '开球之后球都不能落地，全部在空中打。',
    rules: [
      '大家站在厨房线后面一步，用轻轻送过网的球开球。',
      '之后球都不能落地，每一拍都要在空中直接打回去。',
      '球落地、下网或出界的一方输这一球。',
      '厨房规则照常：截击时脚不能碰到厨房或厨房线。',
    ],
    scoring: '每球得分，打到 11 分。',
    scenes: [
      { caption: '四个人站在厨房线后面一步，用轻送球开球。', players: [P('A', 'near', 'right', '甲1', atLine), P('A', 'near', 'left', '甲2', atLine), P('B', 'far', 'right', '乙1', atLine), P('B', 'far', 'left', '乙2', atLine)], ball: { path: ['near:right:kitchenLine', 'far:left:kitchenLine', 'near:left:kitchenLine', 'far:right:kitchen'], step: 1 } },
      { caption: '之后球都不能落地，全部在空中打回去。', players: [P('A', 'near', 'right', '甲1', atLine), P('A', 'near', 'left', '甲2', atLine), P('B', 'far', 'right', '乙1', atLine), P('B', 'far', 'left', '乙2', atLine)], ball: { path: ['near:right:kitchenLine', 'far:left:kitchenLine', 'near:left:kitchenLine', 'far:right:kitchen'], step: 2 } },
      { caption: '球落地、下网或出界就输这一球。截击时脚一样不能踩进厨房。', highlight: ['nvz'], players: [P('A', 'near', 'right', '甲1', atLine), P('A', 'near', 'left', '甲2', atLine), P('B', 'far', 'right', '乙1', atLine), P('B', 'far', 'left', '乙2', atLine)], ball: { path: ['near:right:kitchenLine', 'far:left:kitchenLine', 'near:left:kitchenLine', 'far:right:kitchen'], bounces: [3], step: 3 } },
    ],
    tip: '练手速和反应最有效。站太近容易踩进厨房，站在厨房线后一步刚好。',
  },
  {
    id: 'thirdshot',
    name: '第三拍挑战',
    en: 'Third-Shot Challenge',
    group: '想练技术',
    players: '4 人',
    tagline: '第三拍吊进厨房、又赢下那一球，算 2 分。',
    rules: [
      '按一般双打打。',
      '发球方的第三拍如果落在对面厨房里，而且发球方最后赢下这一球，这一球算 2 分。',
      '第三拍没有落进厨房，就按平常计分。',
      '接发球方得分照常，不加分。',
    ],
    scoring: '用平常的计分，吊球成功又赢球的那一球算 2 分，建议打到 15 分。',
    scenes: [
      { caption: '甲1 发球，乙1 回一个深球，乙队往前上网。', players: [P('A', 'near', 'right', '甲1', serve), P('A', 'near', 'left', '甲2'), P('B', 'far', 'right', '乙1', { depth: 'mid' }), P('B', 'far', 'left', '乙2', { depth: 'mid' })], ball: { path: ['near:right:behind', 'far:right:mid', 'near:right:mid', 'far:left:kitchen'], bounces: [1, 2], step: 2 } },
      { caption: '第三拍：甲1 把球轻轻吊进对面厨房，乙队只能往上挑。', highlight: ['nvz:far'], players: [P('A', 'near', 'right', '甲1'), P('A', 'near', 'left', '甲2'), P('B', 'far', 'right', '乙1', atLine), P('B', 'far', 'left', '乙2', atLine)], ball: { path: ['near:right:behind', 'far:right:mid', 'near:right:mid', 'far:left:kitchen'], bounces: [1, 2, 3], step: 3 } },
      { caption: '甲队趁机上网，最后赢下这一球：这一球算 2 分。', highlight: ['nvz:far'], players: [P('A', 'near', 'right', '甲1', atLine), P('A', 'near', 'left', '甲2', atLine), P('B', 'far', 'right', '乙1', atLine), P('B', 'far', 'left', '乙2', atLine)], ball: { path: ['near:right:behind', 'far:right:mid', 'near:right:mid', 'far:left:kitchen'], bounces: [1, 2, 3], step: 3 } },
    ],
    tip: '鼓励大家练第三拍吊球（third shot drop），不要只会抽球。比分涨得比较快，可以打到 15 分。',
  },
  {
    id: 'relay',
    name: '接力团体赛',
    en: 'Relay',
    group: '想玩热闹',
    players: '8 到 16 人、分两队',
    tagline: '两队轮流派两个人上场，一起打一场到 21 分。',
    rules: [
      '分成两队，每队 4 到 8 人，先排好上场的两人一组顺序。',
      '两队各派一组上场，打一场每球得分、到 21 分的长局。',
      '两队比分加起来到 4 的倍数（4、8、12…），两队都换下一组上场，比分接着算。',
      '轮到最后一组之后，再从第一组开始。先到 21 分的队伍赢。',
    ],
    scoring: '每球得分打到 21 分，要赢 2 分（时间不够就 21 分直接结束）。',
    scenes: [
      { caption: '两队各 4 人，先派一组上场，其他人在场边等。', players: [P('A', 'near', 'right', '甲1', serve), P('A', 'near', 'left', '甲2'), P('B', 'far', 'right', '乙1'), P('B', 'far', 'left', '乙2'), wait('A', 0, '甲3'), wait('A', 1, '甲4'), wait('B', 2, '乙3'), wait('B', 3, '乙4')] },
      { caption: '比分 3:1，加起来 4 分，两队都换下一组上场。比分接着算，不归零。', players: [P('A', 'near', 'right', '甲3', serve), P('A', 'near', 'left', '甲4'), P('B', 'far', 'right', '乙3'), P('B', 'far', 'left', '乙4'), wait('A', 0, '甲1'), wait('A', 1, '甲2'), wait('B', 2, '乙1'), wait('B', 3, '乙2')] },
      { caption: '轮完一圈再从第一组开始。先到 21 分的队伍赢，场边的人负责加油。', players: [P('A', 'near', 'right', '甲1'), P('A', 'near', 'left', '甲2'), P('B', 'far', 'right', '乙1', serve), P('B', 'far', 'left', '乙2'), wait('A', 0, '甲3'), wait('A', 1, '甲4'), wait('B', 2, '乙3'), wait('B', 3, '乙4')] },
    ],
    tip: '记分板选每球得分、打到 21 分；看大比分加起来是不是 4 的倍数就知道要不要换人。',
  },
  {
    id: 'around',
    name: '绕场',
    en: 'Around the World',
    group: '想玩热闹',
    players: '6 人以上，越多越热闹',
    tagline: '每人打一拍就跑到对面排队，漏接就出局。',
    rules: [
      '大家分成两排，一边一排，站在底线后面。',
      '第一个人发球，打完马上跑到对面那一排的最后面。',
      '对面排最前面的人把球打回来，打完一样跑到另一边排队。每个人每次只打一拍。',
      '漏接、出界或下网的人出局。剩两个人时，打一分定胜负。',
    ],
    scoring: '不计分，最后留下来的人赢。',
    scenes: [
      { caption: '分成两排，一边一排。甲先发球，打完就跑到对面那排的最后面。', players: [P('A', 'near', 'right', '甲', serve), P('B', 'far', 'right', '乙'), queueFar('B', 0, '丙'), queueFar('B', 1, '丁'), queueNear('A', 0, '戊'), queueNear('A', 1, '己')], ball: { path: ['near:right:behind', 'far:right:mid'], bounces: [1] } },
      { caption: '对面的乙把球打回来，打完也跑到另一边。下一球由戊接，每个人只打一拍。', players: [P('A', 'near', 'right', '戊'), P('B', 'far', 'right', '乙'), queueFar('B', 0, '丙'), queueFar('B', 1, '丁'), queueFar('B', 2, '甲'), queueNear('A', 0, '己')], ball: { path: ['far:right:mid', 'near:right:mid'], bounces: [1] } },
      { caption: '漏接、出界或下网就出局，到场边加油。剩两个人时打一分定胜负。', players: [P('A', 'near', 'right', '己'), P('B', 'far', 'right', '丙'), queueFar('B', 0, '丁'), queueNear('A', 0, '乙'), out('戊')], ball: { path: ['far:right:mid', 'near:left:behind'] } },
    ],
    tip: '人多时可以每人有三条命，出局三次才淘汰，大家打得比较久。',
  },
  {
    id: 'scotch',
    name: '苏格兰双打',
    en: 'Scotch Doubles',
    group: '想玩热闹',
    players: '4 人',
    tagline: '同一队两个人要轮流打，同一个人不能连打两拍。',
    rules: [
      '按一般双打的规则打，只多一条：同一队两个人一定要轮流击球。',
      '发球也算一拍，所以第三拍一定是发球员的搭档打。',
      '接发球方也一样：接发球的人打完，下一拍换他的搭档。',
      '同一个人连打两拍，就输这一球。',
    ],
    scoring: '按平常的计分，侧出或每球得分都可以。',
    scenes: [
      { caption: '甲1 发球，乙1 接发球。', players: [P('A', 'near', 'right', '甲1', serve), P('A', 'near', 'left', '甲2'), P('B', 'far', 'right', '乙1'), P('B', 'far', 'left', '乙2')], ball: { path: ['near:right:behind', 'far:right:mid', 'near:left:mid', 'far:left:mid'], bounces: [1, 2], step: 1 } },
      { caption: '球回到甲队：甲1 刚发过球，这一拍一定要甲2 打。', players: [P('A', 'near', 'right', '甲1'), P('A', 'near', 'left', '甲2'), P('B', 'far', 'right', '乙1'), P('B', 'far', 'left', '乙2')], ball: { path: ['near:right:behind', 'far:right:mid', 'near:left:mid', 'far:left:mid'], bounces: [1, 2], step: 2 } },
      { caption: '换到乙队：乙1 刚接过发球，这一拍换乙2 打。打错人就输这一球。', players: [P('A', 'near', 'right', '甲1'), P('A', 'near', 'left', '甲2'), P('B', 'far', 'right', '乙1'), P('B', 'far', 'left', '乙2')], ball: { path: ['near:right:behind', 'far:right:mid', 'near:left:mid', 'far:left:mid'], bounces: [1, 2], step: 3 } },
    ],
    tip: '一开始先慢慢打。习惯之后会发现，谁打下一拍、要站哪里，比打得多用力重要。',
  },
].map(f => ({ ...f, official: false }));
