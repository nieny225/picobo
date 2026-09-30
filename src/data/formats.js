// 趣味玩法。這些都不是官方規則，各球場做法不同；每一種都標 official: false。
// scenes：球場圖步驟，位置名稱由 src/court.js 定義。排隊或休息的人畫在球場
// 右側場外（淡色）。橘色（A）在下半場，綠色（B）在上半場。

const P = (team, side, pos, label, extra = {}) => ({ team, side, pos, label, ...extra });
const wait = (team, i, label) => ({ team, at: [262, 80 + i * 40], label, dim: true });
const serve = { depth: 'behind', serving: true };
const atLine = { depth: 'kitchenLine' };
export const FORMATS = [
  {
    id: 'king',
    name: '國王球場',
    en: 'King of the Court',
    group: '排隊類',
    players: '6 人以上、場地不夠時',
    tagline: '贏的留下、輸的排隊，最快消化人潮的玩法。',
    rules: [
      '一場地四個人打短局，輸的一隊下場排到隊伍最後。',
      '贏的一隊留在場上，換排隊最前面的兩個人上來當對手。',
      '留場的隊伍連贏三場就自動下場，讓大家都有球打。',
      '新上場的隊伍先發球，因為留場的已經有主場優勢。',
    ],
    scoring: '每球得分，打到 7 分或 11 分，不用贏 2 分。',
    scenes: [
      { caption: '甲隊留在場上，乙隊上來挑戰。其他人在場邊排隊。', players: [P('A', 'near', 'right', '甲1'), P('A', 'near', 'left', '甲2'), P('B', 'far', 'right', '乙1', serve), P('B', 'far', 'left', '乙2'), wait('B', 0, '丙1'), wait('B', 1, '丙2'), wait('B', 2, '丁1'), wait('B', 3, '丁2')] },
      { caption: '乙隊輸了，下場排到隊伍最後。排最前面的丙隊上場，新上場的先發球。', players: [P('A', 'near', 'right', '甲1'), P('A', 'near', 'left', '甲2'), P('B', 'far', 'right', '丙1', serve), P('B', 'far', 'left', '丙2'), wait('B', 0, '丁1'), wait('B', 1, '丁2'), wait('B', 2, '乙1'), wait('B', 3, '乙2')] },
      { caption: '甲隊連贏三場也要下場，換排最前面的丁隊上來，讓大家都有球打。', players: [P('A', 'near', 'right', '丁1', serve), P('A', 'near', 'left', '丁2'), P('B', 'far', 'right', '丙1'), P('B', 'far', 'left', '丙2'), wait('B', 0, '乙1'), wait('B', 1, '乙2'), wait('A', 2, '甲1'), wait('A', 3, '甲2')] },
    ],
    tip: '用「抽籤」分頁的國王球場模式，按一下贏家就會自動排隊。',
  },
  {
    id: 'roundrobin',
    name: '輪轉賽',
    en: 'Round Robin',
    group: '排隊類',
    players: '8 到 16 人、1 到 4 個場地',
    tagline: '每一輪換搭檔、換對手，最後算個人總分。',
    rules: [
      '事先排好每一輪誰跟誰一隊、在哪個場地，休息的人也排好。',
      '每一輪所有場地同時開打，打固定分數或固定時間。',
      '每個人記自己這一輪拿到的分數，不管隊友是誰。',
      '打完所有輪次，個人總分最高的是今天的贏家。',
    ],
    scoring: '每球得分，打到 11 分（或計時 10 分鐘），把自己那隊的分數記在個人名下。',
    scenes: [
      { caption: '第 1 輪：明＋華 對 婷＋衛，佩和倫先休息。', players: [P('A', 'near', 'right', '明'), P('A', 'near', 'left', '華'), P('B', 'far', 'right', '婷'), P('B', 'far', 'left', '衛'), wait('A', 0, '佩'), wait('A', 1, '倫')] },
      { caption: '第 2 輪：換搭檔也換對手，剛才休息的人上場。', players: [P('A', 'near', 'right', '明'), P('A', 'near', 'left', '佩'), P('B', 'far', 'right', '華'), P('B', 'far', 'left', '倫'), wait('A', 0, '婷'), wait('A', 1, '衛')] },
      { caption: '每個人記自己拿到的分數，不管隊友是誰。打完所有輪次，總分最高的贏。', players: [P('A', 'near', 'right', '婷'), P('A', 'near', 'left', '倫'), P('B', 'far', 'right', '明'), P('B', 'far', 'left', '佩'), wait('A', 0, '華'), wait('A', 1, '衛')] },
    ],
    tip: '用「抽籤」分頁產生輪次表，程式會盡量讓大家不重複搭檔。',
  },
  {
    id: 'cutthroat',
    name: '3 人制',
    en: 'Cutthroat',
    group: '人數變化類',
    players: '剛好 3 人',
    tagline: '一個人打兩個人，輪流當那個「一個人」。',
    rules: [
      '發球的人自己一隊，對面兩個人一隊，發球的人用整個半場，對面照雙打規則。',
      '發球的人贏了這一球就得 1 分，繼續發球，發球位置照分數偶右奇左。',
      '發球的人輸了就換下一位當發球者，三個人輪流。',
      '每個人記自己的分數，先到 11 分的人贏。',
    ],
    scoring: '只有發球的人能得分，先到 11 分（贏 2 分）。',
    scenes: [
      { caption: '發球的甲（橘色）自己一隊，顧整個半場；對面乙、丙兩人一隊。', highlight: ['nvz:near', 'serviceBox:near:right', 'serviceBox:near:left'], players: [P('A', 'near', 'right', '甲', serve), P('B', 'far', 'right', '乙'), P('B', 'far', 'left', '丙')] },
      { caption: '甲贏球得 1 分，繼續發。1 分是奇數，換到左邊發。', players: [P('A', 'near', 'left', '甲', serve), P('B', 'far', 'right', '乙'), P('B', 'far', 'left', '丙')], ball: { path: ['near:left:behind', 'far:left:mid'], bounces: [1] } },
      { caption: '甲輸了，換乙當一個人的那方來發球；甲換到對面跟丙一隊。', highlight: ['nvz:near', 'serviceBox:near:right', 'serviceBox:near:left'], players: [P('A', 'near', 'right', '乙', serve), P('B', 'far', 'right', '甲'), P('B', 'far', 'left', '丙')] },
    ],
    tip: '單打那一邊很累，短局 7 分比較剛好；也有人讓單打方的發球區放寬到整個半場。',
  },
  {
    id: 'skinny',
    name: '半場單打',
    en: 'Skinny Singles',
    group: '人數變化類',
    players: '剛好 2 人',
    tagline: '單打只用一半的場地，跑動少、練落點。',
    rules: [
      '分數偶數時兩人都用右半場，奇數時兩人都用左半場，球落到另一半算出界。',
      '另一種打法是對角：發球員站偶右奇左，對手站對角的半場，球只能落在對角。',
      '其他規則跟單打一樣：雙彈跳、廚房規則都照舊。',
    ],
    scoring: '側出計分到 11 分，或每球得分到 15 分，開打前先講好。',
    scenes: [
      { caption: '直線版：發球方分數偶數，兩人都只用右邊這半場，球落到另一半算出界。', highlight: ['serviceBox:near:right', 'serviceBox:far:left'], players: [P('A', 'near', 'right', '甲', serve), P('B', 'far', 'left', '乙')], ball: { path: ['near:right:behind', 'far:left:mid'], bounces: [1] } },
      { caption: '分數奇數：兩人一起換到左邊那半場。', highlight: ['serviceBox:near:left', 'serviceBox:far:right'], players: [P('A', 'near', 'left', '甲', serve), P('B', 'far', 'right', '乙')], ball: { path: ['near:left:behind', 'far:right:mid'], bounces: [1] } },
      { caption: '對角版：發球員照樣偶右奇左，但球只能打到對角那半場。', highlight: ['serviceBox:near:right', 'serviceBox:far:right'], players: [P('A', 'near', 'right', '甲', serve), P('B', 'far', 'right', '乙')], ball: { path: ['near:right:behind', 'far:right:mid'], bounces: [1] } },
    ],
    tip: '兩種版本開打前要先講清楚用哪一種，不然一定會吵。',
  },
  {
    id: 'dink',
    name: '廚房戰',
    en: 'Dink Game',
    group: '練習類',
    players: '2 或 4 人',
    tagline: '只能 dink，練耐心和手感。',
    rules: [
      '四個人都站廚房線後面，用 dink 開球（把球輕輕丟過網）。',
      '球一定要落在對面的廚房裡，超過廚房線算出界。',
      '不能截擊、不能抽球，球一定要落地才能打。',
      '對方 dink 出界或掛網，你就得 1 分。',
    ],
    scoring: '每球得分，打到 7 分或 11 分。',
    scenes: [
      { caption: '四個人都站廚房線後面，用 dink 開球，把球輕輕放進對面廚房。', highlight: ['nvz'], players: [P('A', 'near', 'right', '甲1', atLine), P('A', 'near', 'left', '甲2', atLine), P('B', 'far', 'right', '乙1', atLine), P('B', 'far', 'left', '乙2', atLine)], ball: { path: ['near:right:kitchenLine', 'far:left:kitchen'], bounces: [1] } },
      { caption: '球一定要落在對面廚房裡，落到廚房外就算出界。', highlight: ['nvz:far'], players: [P('A', 'near', 'right', '甲1', atLine), P('A', 'near', 'left', '甲2', atLine), P('B', 'far', 'right', '乙1', atLine), P('B', 'far', 'left', '乙2', atLine)], ball: { path: ['near:left:kitchenLine', 'far:right:mid'], bounces: [1] } },
      { caption: '不能截擊，球一定要先在廚房落地才能打。', highlight: ['nvz:near'], players: [P('A', 'near', 'right', '甲1', atLine), P('A', 'near', 'left', '甲2', atLine), P('B', 'far', 'right', '乙1', atLine), P('B', 'far', 'left', '乙2', atLine)], ball: { path: ['far:left:kitchenLine', 'near:right:kitchen', 'near:right:kitchenLine'], bounces: [1] } },
    ],
    tip: '很多球場會放寬到「廚房線後一步內」也算界內，開打前講好。',
  },
  {
    id: 'quick',
    name: '快打短局',
    en: 'Quick Games',
    group: '練習類',
    players: '4 人、人多輪轉時',
    tagline: '7 分一局或 10 分鐘一局，上下場最快。',
    rules: [
      '每球得分，先到 7 分就結束，不用贏 2 分。',
      '或者設一個 10 分鐘的計時器，時間到分數高的贏，平手就打一球定勝負。',
      '發球權照每球得分制走：誰贏這球誰發下一球。',
    ],
    scoring: '每球得分到 7 分，或計時 10 分鐘。',
    scenes: [
      { caption: '每球得分，誰贏這球誰發下一球。先到 7 分就結束，不用贏 2 分。', players: [P('A', 'near', 'right', '甲1', serve), P('A', 'near', 'left', '甲2'), P('B', 'far', 'right', '乙1'), P('B', 'far', 'left', '乙2')], ball: { path: ['near:right:behind', 'far:right:mid'], bounces: [1] } },
    ],
    tip: '計分板選「快打」模式，分數設 7、贏 1 分就好。',
  },
].map(f => ({ ...f, official: false }));
