// Rule copy and court diagram scenes. Official rules follow the USA Pickleball Official Rulebook 2026;
// rule numbers in comments refer to the rulebook. Scene positions are defined in src/court.js.
// Team A is on the near half of the court, Team B on the far half.
// en: the English term shown in brackets after the title (wording follows glossary.js).
// singlesScenes / singlesSummary / singlesDetail: rules that apply to both singles and doubles but need
// different pictures or text for singles. Such rules split into two pages: doubles #rules/<id>,
// singles #rules/<id>-singles (fields not given fall back to the general version).

export const RULEBOOK = 'USA Pickleball Official Rulebook 2026';

const A1 = (extra = {}) => ({ team: 'A', side: 'near', pos: 'right', label: 'A1', ...extra });
const A2 = (extra = {}) => ({ team: 'A', side: 'near', pos: 'left', label: 'A2', ...extra });
const B1 = (extra = {}) => ({ team: 'B', side: 'far', pos: 'right', label: 'B1', ...extra });
const B2 = (extra = {}) => ({ team: 'B', side: 'far', pos: 'left', label: 'B2', ...extra });

// Singles: A on the near half, B on the far half
const S = (extra = {}) => A1({ label: 'A', ...extra });
const R = (extra = {}) => B1({ label: 'B', ...extra });
const srv = { depth: 'behind', serving: true };

// Two-bounce: the serve bounces once, the return bounces once, the third shot flies to B1,
// and the fourth shot is volleyed back. The third shot's landing point is a coordinate in front
// of B1, otherwise the player would cover the ball.
const TWO_BOUNCE = ['near:right:behind', 'far:right:mid', 'near:right:mid', [124, 184], 'near:left:kitchenLine'];

// Doubles default: all four players at the baseline
const four = (serving = {}) => [A1(serving.A1), A2(serving.A2), B1(serving.B1), B2(serving.B2)];

// Sections: scoring marks which scoring system a section applies to (none = both); a rule's play
// marks doubles or singles only (none = both). The toggles at the top of the rules page filter on these.
// The two scoring sections share the same steps (step): points how to score, calling how to call
// the score, positions who serves from where. Switching scoring jumps to the same step in the other
// section; note shows under the section title in the index.
export const SECTIONS = [
  {
    id: 'court',
    title: 'Court and lines',
    en: 'Court & Lines',
    intro: 'Know the court first. Every rule diagram after this uses this same court.',
    items: [
      {
        id: 'dimensions',
        title: 'Court dimensions',
        en: 'Court Dimensions',
        summary: 'The court is 13.41 × 6.10 m, the same size as a badminton doubles court. Each side of the net has a 2.13 m deep "kitchen".',
        detail: [
          'Its official name is the non-volley zone; everyone calls it the kitchen. It is the most important area in pickleball: while you are in it, you may not hit the ball out of the air.',
          'Net height: 91 cm at the sidelines, 86 cm at the center.',
          'Court lines: baselines, sidelines, kitchen lines, and a centerline from the kitchen line to the baseline that splits each side into right and left service courts.',
          'No pickleball court? The next page, "Court setup", shows how to tape lines on a badminton, tennis or volleyball court.',
        ],
        scenes: [
          { caption: 'The full court is 13.41 × 6.10 m, with the net in the middle.', labels: true },
          { caption: 'A 2.13 m deep kitchen on each side of the net. Official name: non-volley zone.', labels: true, highlight: ['nvz'] },
          { caption: 'Between kitchen line and baseline, the centerline makes two service courts.', highlight: ['serviceBox:near:right', 'serviceBox:near:left', 'serviceBox:far:right', 'serviceBox:far:left'] },
        ],
      },
      {
        // Playing on another court (a practical setup, not a rule). Dimension sources: USA Pickleball rulebook
        // section 2 (measured to the outside of the lines), BWF Laws (badminton 13.40 × 6.10, short service line
        // 1.98 from the net, net center 1.524), ITF Rules of Tennis (service line 6.40 from the net, net center 0.914),
        // FIVB (18 × 9, attack line 3 m); 4 courts in one 60 × 120 ft fenced tennis court: sportmaster.net,
        // protrackandtennis.com. Drawn by court.js setupSvg(host).
        id: 'setup',
        title: 'Court setup',
        en: 'Court Setup',
        summary: 'No pickleball court? A badminton court is best: almost every line works, you only add two kitchen lines. Tennis and volleyball courts need more tape.',
        setup: {
          intro: 'Measure with a tape measure, then lay lines with 5 cm wide tape. Measure to the outside edge of the lines; lines count as in. Then check both diagonals: if each is 14.73 m, the corners are square.',
          legend: { reuse: 'Lines you keep', tape: 'Lines to tape', host: 'Existing court lines' },
          groups: [
            { host: 'badminton', name: 'Badminton court (easiest)', items: [
              'A badminton doubles court is 13.40 × 6.10 m, almost the same size. Use its sidelines and baselines as they are.',
              'Kitchen line: the badminton short service line is 1.98 m from the net and the kitchen is 2.13 m deep, so tape a line about 15 cm behind the short service line.',
              'Use the badminton centerline as is; ignore the doubles long service line.',
              'The net is too high (1.52 m at the center). Use a pickleball net or bring a portable one.',
            ] },
            { host: 'tennis', name: 'Tennis court', items: [
              'Easiest is one court using the tennis net: lower the center strap to 86 cm. The net ends will be a bit higher than pickleball height, which is fine for casual play.',
              'Baseline: the tennis service line is 6.40 m from the net and the pickleball baseline is 6.71 m, so tape it about 30 cm behind the service line.',
              'Sidelines: 3.05 m to each side of the tennis center service line.',
              'Use the tennis center service line as the centerline and extend it to the new baseline. Tape the kitchen line 2.13 m from the net.',
              'The full fenced area of a tennis court (about 18 × 36 m) fits 4 pickleball courts; bring your own nets.',
            ] },
            { host: 'volleyball', name: 'Volleyball court', items: [
              'A volleyball court is 18 × 9 m and fits one pickleball court: center it under the net, with each sideline 1.45 m inside the volleyball sidelines.',
              'No volleyball lines match, so tape all four outer lines, the kitchen lines and the centerline. The attack line is 3 m from the net; it is not a kitchen line.',
              'A volleyball net is too high; bring a pickleball net.',
            ] },
          ],
          note: 'This is a practical way to borrow a court, not a rule. Ask the venue before putting tape down.',
        },
      },
      {
        id: 'lines',
        title: 'Line calls',
        en: 'Line Calls',
        summary: 'A ball touching any line is in. The one exception: a serve that touches the kitchen line is a fault.',
        detail: [
          'Lines are 5 cm wide. If the ball touches any part of a line, it is in.',
          'On the serve, the kitchen and the kitchen line are both off limits, so a serve that touches the kitchen line is a fault. At any other time the kitchen line is in, like every other line.',
          'A serve landing on the centerline, sideline or baseline of the diagonal service court is in. Only the kitchen line is out.',
          'You call the lines on your own side. If you are not sure, the ball is in.',
        ],
        singlesScenes: [
          { caption: 'During a rally, a ball on the kitchen line is in.', highlight: ['kitchenLine:near'], ball: { path: ['far:left:mid', 'near:right:onKitchenLine'], bounces: [1] } },
          { caption: 'On the serve, touching the kitchen line is a fault. Land past it.', highlight: ['kitchenLine:far', 'nvz:far'], players: [S(srv), R()], ball: { path: ['near:right:behind', 'far:right:onKitchenLine'], bounces: [1] } },
          { caption: 'A serve on the centerline is in. Same for sideline and baseline.', highlight: ['serviceBox:far:right', 'centerline:far'], players: [S(srv), R()], ball: { path: ['near:right:behind', 'far:center:mid'], bounces: [1] } },
        ],
        scenes: [
          { caption: 'During a rally, a ball on the kitchen line is in.', highlight: ['kitchenLine:near'], ball: { path: ['far:left:mid', 'near:right:onKitchenLine'], bounces: [1] } },
          { caption: 'On the serve, touching the kitchen line is a fault. Land past it.', highlight: ['kitchenLine:far', 'nvz:far'], players: [A1({ depth: 'behind', serving: true })], ball: { path: ['near:right:behind', 'far:right:onKitchenLine'], bounces: [1] } },
          { caption: 'A serve on the centerline is in. Same for sideline and baseline.', highlight: ['serviceBox:far:right', 'centerline:far'], players: [A1({ depth: 'behind', serving: true })], ball: { path: ['near:right:behind', 'far:center:mid'], bounces: [1] } },
        ],
      },
    ],
  },
  {
    // Equipment. Specs per the 2026 USA Pickleball Official Rulebook 3.D (size 3.D.2, weight 3.D.3,
    // material 3.D.4, surface 3.D.5, allowed alterations 3.D.6–7), 18.A (approved paddles in sanctioned play)
    // and Equipment Standards Manual 2.E–2.F; spin test: usapickleball.org notice of 2026-07-08 (from
    // 2026-10-01, new submissions ≤ 2,100 rpm). Buying advice: pickleballcentral.com/paddle-guide (weight,
    // shape, grip, tennis / racquetball), paddletek.com (core, table tennis), heliospickleball.com (badminton,
    // brand blog), thedinkpickleball.com (common tennis-convert mistakes), pickleheads.com (budget, tennis elbow);
    // foam core: pickleball.com "Foam Core Paddles Explained", pickleballeffect.com foam vs polymer,
    // pickleheads.com foam paddle guide, nexpickleball.com (only what they agree on).
    id: 'gear',
    title: 'Equipment',
    en: 'Equipment',
    intro: 'The official paddle specs, and how to pick one that suits you.',
    items: [
      {
        id: 'paddle-rules',
        title: 'Paddle rules',
        en: 'Paddle Rules',
        summary: 'Length plus width up to 61 cm, length up to 43 cm. No limit on thickness or weight. Sanctioned play requires a paddle on the approved list.',
        figure: {
          kind: 'paddleRules',
          alt: 'Paddle size limits and where tape is allowed',
          length: 'Length ≤ 43.18 cm',
          sum: 'Length + width ≤ 60.96 cm',
          keys: ['Within 1.27 cm of the edge: edge guard and tape allowed.', 'Middle of the face: nothing may be added.', 'Within 2.5 cm above the handle: tape, lead tape, decals allowed.'],
          caption: 'Yellow shows where tape and decals may go.',
        },
        blocks: [
          { items: [
            'Size: length plus width (including edge guard and butt cap) up to 60.96 cm (24 in), length up to 43.18 cm (17 in). No limit on thickness or weight.',
            'It must be made of rigid, non-compressible material, with no springs or trampoline effect.',
            'The surface may not have holes, cracks or delamination, and may not have sandpaper, rubber, anti-slip paint or any coating that adds spin. It may not be reflective enough to hinder an opponent\'s vision.',
            'The only changes you may make: edge guard tape, lead tape, factory weights, a factory replacement grip or face, grip wrap or build-up, and your name or signature. Tape and decals may only go within 2.5 cm above the handle or within 1.27 cm of the edge.',
          ] },
          { name: 'Sanctioned play', items: [
            'The paddle must show the brand, model and "USA Pickleball Approved", and be on the official approved list.',
            'Found non-compliant before the match: just switch paddles. During the match: you forfeit the match. After the match: the result stands.',
            'From October 2026, newly submitted paddles must pass a spin test: 2,100 rpm or less.',
          ] },
          { name: 'Casual play', items: [
            'Nobody checks, but the official specs apply to all play anyway. A paddle with the approved mark is the safe buy, and you can use it in tournaments later.',
          ] },
        ],
      },
      {
        id: 'paddle-choose',
        title: 'Choosing a paddle',
        en: 'Choosing a Paddle',
        summary: 'Not sure? Go mid-weight, standard wide shape, 16 mm core: big sweet spot, easiest to learn. Played another racket sport? Pick by the advice below.',
        figure: {
          kind: 'paddleShapes',
          alt: 'Three paddle shapes drawn to scale: standard, hybrid, elongated; circles are sweet spots',
          names: { standard: 'Standard', hybrid: 'Hybrid', elongated: 'Elongated' },
          sizes: { standard: '40.6 × 20.3 cm', hybrid: '41.3 × 19.7 cm', elongated: '41.9 × 19.1 cm' },
          caption: 'Drawn to scale; circles are sweet spots. Longer face, more reach, but a smaller sweet spot further from your hand.',
        },
        picker: {
          prompt: 'What did you play before?',
          labels: { shape: 'Shape', weight: 'Weight', grip: 'Grip', face: 'Core and face', why: 'Why', watch: 'Watch out for' },
          options: [
            { id: 'none', shapes: ['standard'], label: 'No racket sport', shape: 'Standard wide paddle', weight: 'Mid, about 213–232 g', grip: 'By height (see below)', face: '16 mm thick core', why: 'A wide paddle has the biggest, most forgiving sweet spot, and a thick core gives steady control, so off-center hits stay manageable.', watch: [] },
            { id: 'tennis', shapes: ['elongated', 'hybrid'], label: 'Tennis (or racquetball)', shape: 'Elongated or hybrid', weight: 'Mid to heavy', grip: 'Long handle; 13.5 cm or more for a two-handed backhand', face: 'Your choice; 13 mm for power', why: 'Tennis and racquetball players usually like a long handle and long face: more reach, more power in the swing.', watch: ['Keep the swing small, more push than swing; a big backswing sends balls out.', 'At the net, keep the paddle face square on volleys. Don\'t step in, don\'t chop down.'] },
            { id: 'badminton', shapes: ['standard', 'hybrid'], label: 'Badminton', shape: 'Standard or hybrid', weight: 'Light', grip: 'Smaller', face: 'Carbon fiber face, control', why: 'Net reflexes and placement are your strengths; a light paddle with a carbon face makes the most of them.', watch: ['A pickleball paddle is two to three times heavier than a badminton racket (about 70–100 g). Don\'t flick your wrist; keep swings short and solid.'] },
            { id: 'tabletennis', shapes: ['standard'], label: 'Table tennis', shape: 'Standard; avoid elongated', weight: 'Mid to light (about 210–232 g, the lighter end)', grip: 'By height', face: 'Medium to thick core, carbon fiber face', why: 'Table tennis players have great touch and spin control; a standard paddle balanced in the middle feels most natural.', watch: ['Keep your wrist straight and relaxed; don\'t flick.', 'Switch to a continental or eastern grip; don\'t keep your table tennis grip.', 'The court is far bigger than a table, so move your feet more.'] },
          ],
          note: 'General advice, not a rule. Try before you buy if you can.',
        },
        blocks: [
          { name: 'Weight', items: [
            'Light, about 215–221 g or less: quick hands, easy to swing, but less power and stability.',
            'Mid, about 224–232 g: what most people use.',
            'Heavy, about 235 g or more: more power and stability, but slower and more tiring for the arm.',
            'Too light or too heavy can both hurt your arm. People with tennis elbow are often advised to go mid-weight with a thick core of 16 mm or more (not medical advice).',
          ] },
          { name: 'Shape', items: [
            'Standard wide (about 40.6 × 20.3 cm): biggest sweet spot, fastest hands, shortest reach.',
            'Hybrid: in between.',
            'Elongated (about 41.9 × 19.1 cm): longest reach, more power and spin, but a smaller, higher sweet spot.',
          ] },
          { name: 'Core and face', figure: {
            kind: 'paddleCores',
            alt: 'Paddle cross-section: faces top and bottom, core in the middle; honeycomb core left, foam core right',
            names: { honeycomb: 'Honeycomb core', foam: 'Foam core' },
            caption: 'A paddle cut open: the two outer layers are the faces, the middle is the core.',
          }, items: [
            'A thin core (about 13 mm) gives more power; a thick core (about 16 mm) gives more control, a softer feel and more comfort.',
            'Fiberglass faces are springy and powerful; carbon fiber faces lean toward control and spin.',
            'Honeycomb core (polymer honeycomb): the most common. Crisp feel, fast off the face. With use the cells get crushed; once it loses pop, replace it.',
            'Foam core (e.g. EPP, EVA): newer. Generally said to last longer, feel solid, have a forgiving sweet spot and play quieter. Designs vary a lot: some are very powerful, some lean to control. Being new, poor-quality ones can also go soft or develop dead spots.',
          ] },
          { name: 'Grip', items: [
            'By height: under 157 cm about 10.2 cm (4 in), 160–173 cm about 10.8 cm (4¼ in), 175 cm and up about 11.4 cm (4½ in).',
            'If unsure, go smaller. Too small? Add an overgrip to build it up.',
            'A longer handle means a shorter face: the 43 cm total length limit is fixed.',
          ] },
          { name: 'Budget', items: [
            'To start, a paddle around US$50–100 is enough. Once you know you\'ll keep playing, consider a pricier one.',
            'There are no men\'s or women\'s paddles, and no indoor or outdoor paddles.',
          ] },
        ],
      },
    ],
  },
  {
    id: 'sideout',
    title: 'Side-out scoring',
    en: 'Side-out Scoring',
    subtitle: 'USA Pickleball sanctioned play',
    note: 'Pick singles or doubles above, then go in order: how to score, how to call the score, who serves from where.',
    scoring: 'sideout',
    intro: 'The scoring used in sanctioned play and on most courts. Only the serving side can score.',
    items: [
      {
        id: 'points',
        step: 'points',
        title: 'How to score',
        en: 'Scoring',
        summary: 'Only the serving side scores. Play to 11, win by 2. Losing a rally as server costs no point; your partner serves. When both lose, the serve goes over (side-out).',
        detail: [
          'If the serving side wins the rally, it scores 1 point and the same player serves again.',
          'If the serving side loses, no point is lost: when server 1 loses, server 2 serves; when server 2 also loses, the serve passes to the other team. That is a side-out.',
          'Start-of-game exception: the team serving first in the game gets only one server. When it loses the rally, it is a side-out.',
          'The receiving side cannot score by winning a rally; it only gets one step closer to winning the serve back.',
          'Sanctioned matches are usually best of three games to 11; there are also games to 15 or 21.',
        ],
        scenes: [
          { caption: 'Team A serves and wins the rally: 1 point, same server again.', players: [A1({ pos: 'left', depth: 'behind', serving: true }), A2({ pos: 'right' }), B1(), B2()] },
          { caption: 'A1 loses the rally: no point lost, partner A2 serves.', players: [A1({ pos: 'left' }), A2({ pos: 'right', depth: 'behind', serving: true }), B1(), B2()] },
          { caption: 'A2 loses too: side-out, Team B serves. Only now can Team B score.', players: [A1({ pos: 'left' }), A2({ pos: 'right' }), B1({ depth: 'behind', serving: true }), B2()] },
        ],
        singlesSummary: 'Only the server scores. Play to 11, win by 2. Losing a rally as server costs no point; the serve goes straight over (side-out).',
        singlesDetail: [
          'If the server wins the rally, they score 1 point and serve again.',
          'If the server loses, no point is lost and the serve goes straight to the opponent. Singles has no server 2.',
          'You get one try per serve. There is no second serve like in tennis. A service fault loses the rally.',
          'Sanctioned matches are usually best of three games to 11; there are also games to 15 or 21.',
        ],
        singlesScenes: [
          { caption: 'A serves and wins the rally: 1 point, A serves again.', players: [S({ pos: 'left', ...srv }), R({ pos: 'left' })] },
          { caption: 'A loses the rally: no point lost, serve goes to B (side-out).', players: [S(), R(srv)] },
        ],
      },
      {
        id: 'calling',
        step: 'calling',
        title: 'Calling the score',
        en: 'Calling the Score',
        summary: 'In doubles, call three numbers: "serving score, receiving score, server number". Call it before you serve.',
        detail: [
          'The first number is the serving team\'s score, the second is the receiving team\'s, the third is 1 or 2: server 1 or server 2 for this turn.',
          'Start the game with "0-0-2": the team serving first gets only one server, so it starts as server 2.',
          'Example: "5-3-1" = serving team 5, receiving team 3, server 1 serving.',
        ],
        scenes: [
          { caption: 'Team A serves first and calls "0-0-2".', players: four({ A1: { depth: 'behind', serving: true } }) },
          { caption: 'Team A wins the rally, now 1 point: "1-0-2".', players: [A1({ pos: 'left', depth: 'behind', serving: true }), A2({ pos: 'right' }), B1(), B2()] },
          { caption: 'Team A loses the rally. As server 2, that\'s a side-out; Team B calls its score first: "0-1-1".', players: [A1({ pos: 'left' }), A2({ pos: 'right' }), B1({ depth: 'behind', serving: true }), B2()] },
        ],
        singlesSummary: 'In singles, call two numbers: "server\'s score, receiver\'s score". Call it before you serve.',
        singlesDetail: [
          'Call the server\'s own score first, then the opponent\'s. Singles has no server number.',
          'Example: "3-5" = server 3, receiver 5.',
        ],
        singlesScenes: [
          { caption: 'A serves first and calls "0-0".', players: [S(srv), R()] },
          { caption: 'A wins the rally, now 1 point: "1-0".', players: [S({ pos: 'left', ...srv }), R({ pos: 'left' })] },
          { caption: 'B serves now and calls their own score first: "0-1".', players: [S(), R(srv)] },
        ],
      },
      {
        id: 'positions',
        step: 'positions',
        title: 'Who serves from where',
        en: 'Serving & Positions',
        summary: 'When your team wins the serve back, the player on the right serves first. Players switch sides only when their team scores; the receiving team never moves.',
        detail: [
          'After every side-out, the first serve comes from the right side, by whoever is standing on the right. That player is server 1 for this turn. There is no fixed server 1.',
          'If the serving team wins a rally, the server switches sides with the partner and serves again. If it loses, the partner serves from where they stand. If server 2 also loses, it is a side-out.',
          'The receiving team never switches. So who stands on the right depends only on the score: the player who started on the right is on the right when your score is even, on the left when it is odd.',
          'Remember: serve back, check your score for positions, the right-side player serves first.',
        ],
        scenes: [
          { caption: 'Start: A1 serves from the right, calls "0-0-2".', players: four({ A1: { depth: 'behind', serving: true } }) },
          { caption: 'Team A scores: A1 and A2 switch, A1 serves again from the left: "1-0-2".', players: [A1({ pos: 'left', depth: 'behind', serving: true }), A2({ pos: 'right' }), B1(), B2()] },
          { caption: 'Team A loses the rally: side-out. Team B has 0, so B1 on the right serves first: "0-1-1". Team A stays put.', players: [A1({ pos: 'left' }), A2({ pos: 'right' }), B1({ depth: 'behind', serving: true }), B2()] },
          { caption: 'B1 loses the rally: B2 serves from the left, where they stand: "0-1-2".', players: [A1({ pos: 'left' }), A2({ pos: 'right' }), B1(), B2({ depth: 'behind', serving: true })] },
          { caption: 'B2 loses too: side-out to Team A. Team A has 1 (odd), A1 is on the left, so A2 on the right serves first: "1-0-1".', players: [A1({ pos: 'left' }), A2({ pos: 'right', depth: 'behind', serving: true }), B1(), B2()] },
          { caption: 'A2 scores, now 2 (even): they switch, A1 back on the right. A1 started on the right, so is always there on even scores.', players: [A1({ pos: 'right' }), A2({ pos: 'left', depth: 'behind', serving: true }), B1(), B2()] },
        ],
        singlesSummary: 'Go by the server\'s own score: even, serve from the right; odd, from the left. The receiver stands diagonally opposite.',
        singlesDetail: [
          'When the server scores, they move to the other side and serve again.',
          'When the serve goes over, the new server picks the side by their own score.',
          'The receiver always stands diagonally opposite the server.',
        ],
        singlesScenes: [
          { caption: 'Start: A has 0 (even), serves from the right; B receives diagonally.', players: [S(srv), R()] },
          { caption: 'A scores, now 1 (odd): serves from the left; B moves diagonally too.', players: [S({ pos: 'left', ...srv }), R({ pos: 'left' })] },
          { caption: 'B serves now. B has 0 (even), serves from the right.', players: [S(), R(srv)] },
        ],
      },
    ],
  },
  {
    id: 'rally',
    title: 'Rally scoring',
    en: 'Rally Scoring',
    subtitle: '2026 provisional rule',
    note: 'Pick singles or doubles above, then go in order: how to score, how to call the score, who serves from where.',
    scoring: 'rally',
    intro: 'Every rally scores a point, so games finish faster; many courts use it for social play. USA Pickleball made it a provisional rule in 2025 and kept it in 2026.',
    items: [
      {
        id: 'rally-points',
        step: 'points',
        title: 'How to score',
        en: 'Scoring',
        summary: 'Every rally gives one team 1 point, and whoever wins the rally serves next. There is no server 2.',
        detail: [
          'Play to 11, 15 or 21, win by 2. Social play most often uses 15 or 21.',
          'Serving team wins the rally: 1 point, the same player serves again.',
          'Receiving team wins the rally: 1 point and the serve.',
          'From 2026 the receiving team can also win the final point; it does not need to win the serve back first.',
        ],
        scenes: [
          { caption: 'Team A serves and wins the rally: 1 point, A1 serves again.', players: [A1({ pos: 'left', depth: 'behind', serving: true }), A2({ pos: 'right' }), B1(), B2()] },
          { caption: 'Team B wins the next rally: 1 point for Team B, plus the serve. 1-1.', players: [A1({ pos: 'left' }), A2({ pos: 'right' }), B1({ pos: 'left' }), B2({ pos: 'right', depth: 'behind', serving: true })] },
        ],
        singlesSummary: 'Every rally gives someone 1 point, and whoever wins the rally serves next.',
        singlesDetail: [
          'Play to 11, 15 or 21, win by 2. Agree on the target before you start.',
          'Server wins the rally: 1 point, serves again.',
          'Receiver wins the rally: 1 point and the serve.',
          'From 2026 the receiver can also win the final point; they do not need to win the serve back first.',
        ],
        singlesScenes: [
          { caption: 'A serves and wins the rally: 1 point, A serves again.', players: [A1({ label: 'A', pos: 'left', depth: 'behind', serving: true }), B1({ label: 'B', pos: 'left' })] },
          { caption: 'B wins the next rally: 1 point for B, plus the serve. 1-1.', players: [A1({ label: 'A', pos: 'left' }), B1({ label: 'B', pos: 'left', depth: 'behind', serving: true })] },
        ],
      },
      {
        id: 'rally-calling',
        step: 'calling',
        title: 'Calling the score',
        en: 'Calling the Score',
        summary: 'Call just two numbers: "serving score, receiving score". No server number, even in doubles.',
        detail: [
          'Start the game with "0-0".',
          'Example: "7-5" = serving team 7, receiving team 5.',
          'The big difference from side-out scoring: no third number in doubles, because there is no server 2.',
        ],
        scenes: [
          { caption: 'A1 serves first and calls "0-0".', players: four({ A1: { depth: 'behind', serving: true } }) },
          { caption: 'Team B wins the rally and the serve. B2 serves; Team B calls its score first: "1-0".', players: [A1(), A2(), B1({ pos: 'left' }), B2({ pos: 'right', depth: 'behind', serving: true })] },
        ],
        singlesSummary: 'Call just two numbers: "server\'s score, receiver\'s score".',
        singlesDetail: [
          'Start the game with "0-0".',
          'Example: "7-5" = server 7, receiver 5.',
        ],
        singlesScenes: [
          { caption: 'A serves first and calls "0-0".', players: [A1({ label: 'A', depth: 'behind', serving: true }), B1({ label: 'B' })] },
          { caption: 'B wins the rally and the serve. 1 is odd, so B serves from the left, calling their score first: "1-0".', players: [A1({ label: 'A', pos: 'left' }), B1({ label: 'B', pos: 'left', depth: 'behind', serving: true })] },
        ],
      },
      {
        id: 'rally-positions',
        step: 'positions',
        title: 'Who serves from where',
        en: 'Serving & Positions',
        summary: 'Both teams stand by their own score: the player who started on the right is on the right at even scores, on the left at odd. After a side-out, the player on the right serves.',
        detail: [
          'Serving team wins the rally: the server switches sides with the partner and serves again.',
          'Receiving team wins the rally: 1 point and the serve. The pair first lines up by the new score, then the player on the right serves. The first serve after a side-out is always from the right.',
          'The team that lost the rally does not move.',
          'Remember: score sets positions, side-out sets the server.',
          'Common mistake: not switching on winning the serve, so the player on the left serves. USA Pickleball\'s wording is to switch first; the first serve after a side-out is always from the right. Practice varies by club; agree before you play.',
        ],
        scenes: [
          { caption: 'Team A has 0; A1 serves from the right: "0-0".', players: four({ A1: { depth: 'behind', serving: true } }) },
          { caption: 'Team A wins the rally: 1-0. A1 and A2 switch; A1 serves again.', players: [A1({ pos: 'left', depth: 'behind', serving: true }), A2({ pos: 'right' }), B1(), B2()] },
          { caption: 'Team B wins: 1 point and the serve. 1 is odd, so B1 and B2 switch, then B2 on the right serves: "1-1".', players: [A1({ pos: 'left' }), A2({ pos: 'right' }), B1({ pos: 'left' }), B2({ pos: 'right', depth: 'behind', serving: true })] },
          { caption: 'Team A wins again: 2 is even, A1 back on the right serves: "2-1". Team B lost, so it stays put.', players: [A1({ depth: 'behind', serving: true }), A2(), B1({ pos: 'left' }), B2({ pos: 'right' })] },
        ],
        singlesSummary: 'The server goes by their own score: even, serve from the right; odd, from the left. The receiver stands diagonally opposite.',
        singlesDetail: [
          'Same positions as side-out singles, by the server\'s own score: even on the right, odd on the left.',
          'Server wins the rally: move to the other side and serve again.',
          'Receiver wins the rally: wins the serve, and picks the side by their own new score.',
        ],
        singlesScenes: [
          { caption: 'Start, 0-0: A serves from the right; B receives diagonally.', players: [A1({ label: 'A', depth: 'behind', serving: true }), B1({ label: 'B' })], ball: { path: ['near:right:behind', 'far:right:mid'], bounces: [1] } },
          { caption: 'A wins: 1-0. A serves again from the left; B moves diagonally too.', players: [A1({ label: 'A', pos: 'left', depth: 'behind', serving: true }), B1({ label: 'B', pos: 'left' })], ball: { path: ['near:left:behind', 'far:left:mid'], bounces: [1] } },
          { caption: 'B wins: 1 point and the serve. 1 is odd, so B serves from the left: "1-1".', players: [A1({ label: 'A', pos: 'left' }), B1({ label: 'B', pos: 'left', depth: 'behind', serving: true })], ball: { path: ['far:left:behind', 'near:left:mid'], bounces: [1] } },
        ],
      },
      {
        id: 'rally-pro',
        title: 'Pro play and freezing',
        en: 'Pro Play (MLP)',
        summary: 'From 2023 to 2025, the pro league MLP used rally scoring with "freezing": a team close to winning can only score on its own serve. In 2026 MLP doubles went back to side-out scoring.',
        collapsed: true,
        detail: [
          'What freezing means: once a team reaches a set score, it can only score by winning a rally on its own serve. Winning a rally on the opponent\'s serve only wins the serve back, no point, just like side-out scoring.',
          'MLP doubles played to 21: the first team to reach 20 is frozen; the other team is frozen when it reaches 18.',
          'Example: A 20, B 15, A is frozen. B serves and A wins the rally: no point for A, A just gets the serve. A serves and wins another rally: 21, game over.',
          'Why freeze: so the receiving side cannot end the game in one rally, which makes the last few points more of a battle. This is an MLP rule; USA Pickleball rally scoring has no freezing.',
          'In 2026 MLP doubles went back to side-out scoring to 11. Rally scoring stays only in the singles DreamBreaker tiebreaker (to 21, win by 2, no freezing).',
          'So the "rally scoring" you see today is the USA Pickleball provisional version above, with no freezing.',
        ],
        scenes: [],
      },
    ],
  },
  {
    id: 'play',
    title: 'Core rules',
    en: 'Core Rules',
    intro: 'Rules that are the same in singles and doubles, under either scoring system.',
    items: [
      {
        id: 'serve',
        title: 'Serve',
        en: 'Serve',
        summary: 'Stand behind the baseline and serve underhand, diagonally into the opposite service court, clearing the kitchen and the kitchen line. You get one try.',
        detail: [
          'Volley serve: the arm swings upward, contact is below the waist (navel), and the paddle head is below the wrist at contact. From 2026 all three must be clearly legal; if in doubt, it is a fault.',
          'Drop serve: release the ball naturally from your hand and hit it after it bounces, with any swing you like. You may not spin the ball with your fingers on the release. This is the safest serve for beginners.',
          'When serving, at least one foot must be on the ground behind the baseline. Neither foot may touch the baseline or the court, or be outside the imaginary extensions of the sideline and centerline.',
          'A serve that touches the net and lands in the correct service court is in play. There have been no service lets since 2021.',
          'Call the score before you serve, then serve within 10 seconds.',
        ],
        singlesScenes: [
          { caption: 'The server stands behind the baseline, at least one foot on the ground.', highlight: ['baseline:near'], players: [S(srv), R()] },
          { caption: 'Serve diagonally into the opposite service court, past the kitchen and kitchen line.', highlight: ['serviceBox:far:right'], players: [S(srv), R()], ball: { path: ['near:right:behind', 'far:right:mid'], bounces: [1] } },
          { caption: 'Too short, into the kitchen or on its line: fault.', highlight: ['nvz:far'], players: [S(srv), R()], ball: { path: ['near:right:behind', 'far:right:kitchen'], bounces: [1] } },
        ],
        scenes: [
          { caption: 'The server stands behind the baseline, at least one foot on the ground.', highlight: ['baseline:near'], players: [A1({ depth: 'behind', serving: true }), A2(), B1(), B2()] },
          { caption: 'Serve diagonally into the opposite service court, past the kitchen and kitchen line.', highlight: ['serviceBox:far:right'], players: [A1({ depth: 'behind', serving: true }), A2(), B1(), B2()], ball: { path: ['near:right:behind', 'far:right:mid'], bounces: [1] } },
          { caption: 'Too short, into the kitchen or on its line: fault.', highlight: ['nvz:far'], players: [A1({ depth: 'behind', serving: true }), A2(), B1(), B2()], ball: { path: ['near:right:behind', 'far:right:kitchen'], bounces: [1] } },
        ],
      },
      {
        id: 'two-bounce',
        title: 'Two-bounce rule',
        en: 'Two-Bounce Rule',
        summary: 'The serve must bounce once, and the return must bounce once. Only then may anyone volley.',
        detail: [
          'The receiver must let the serve bounce before hitting it, and the serving team must let the return bounce before hitting the third shot.',
          'So after serving, don\'t rush the net. Stay at the baseline and wait for the third shot.',
          'After the two bounces, anyone may volley, but the kitchen rules still apply.',
          'Returns have no required landing area: anywhere in on the other side is fine, deep, short or in the kitchen. Only the serve must land in the diagonal service court, and not in the kitchen or on the kitchen line.',
          'A ball on a line is in. The one exception: a serve on the kitchen line is a service fault.',
        ],
        singlesScenes: [
          { caption: 'Shot 1, the serve: it must bounce once on the far side (circled) before B hits it.', players: [S(srv), R()], ball: { path: TWO_BOUNCE, bounces: [1, 2], step: 1 } },
          { caption: 'Shot 2, the return: it must bounce on A\'s side too, so A stays back after serving. B moves up.', players: [S(), R({ depth: 'mid' })], ball: { path: TWO_BOUNCE, bounces: [1, 2], step: 2 } },
          { caption: 'Shot 3: A lets it bounce first. Both bounces are done; B is now at the kitchen line.', players: [S(), R({ depth: 'kitchenLine' })], ball: { path: TWO_BOUNCE, bounces: [1, 2], step: 3 } },
          { caption: 'From shot 4, volleys are allowed: B hits the third shot back out of the air. No circle means no bounce.', players: [S(), R({ depth: 'kitchenLine' })], ball: { path: TWO_BOUNCE, bounces: [1, 2], step: 4 } },
        ],
        scenes: [
          { caption: 'Shot 1, the serve: it must bounce once on the far side (circled) before Team B hits it.', players: [A1(srv), A2(), B1(), B2()], ball: { path: TWO_BOUNCE, bounces: [1, 2], step: 1 } },
          { caption: 'Shot 2, the return: it must bounce on Team A\'s side too, so Team A stays back after serving. Team B moves up.', players: [A1(), A2(), B1({ depth: 'mid' }), B2({ depth: 'mid' })], ball: { path: TWO_BOUNCE, bounces: [1, 2], step: 2 } },
          { caption: 'Shot 3: Team A lets it bounce first. Both bounces are done; Team B is now at the kitchen line.', players: [A1(), A2(), B1({ depth: 'kitchenLine' }), B2({ depth: 'kitchenLine' })], ball: { path: TWO_BOUNCE, bounces: [1, 2], step: 3 } },
          { caption: 'From shot 4, volleys are allowed: B1 hits the third shot back out of the air. No circle means no bounce.', players: [A1(), A2(), B1({ depth: 'kitchenLine' }), B2({ depth: 'kitchenLine' })], ball: { path: TWO_BOUNCE, bounces: [1, 2], step: 4 } },
        ],
      },
      {
        id: 'kitchen',
        title: 'Kitchen (non-volley zone)',
        en: 'Kitchen',
        summary: 'While you are touching the kitchen or its line, you may not hit the ball out of the air. Once the ball has bounced, stand wherever you like.',
        detail: [
          'Nothing in the whole volley motion may touch the kitchen: before the jump, during the swing, or stepping in from momentum after the swing. All are faults, even if the ball is already dead.',
          'Anything you are wearing or carrying that falls into the kitchen counts too: hat, paddle, glasses. A partner holding you back from falling in is also a fault.',
          'You may go into the kitchen to hit a ball that has bounced, then step out. But while you are still in the kitchen or on the line, you may not volley the next ball; both feet must be back outside the kitchen first.',
        ],
        singlesDetail: [
          'Nothing in the whole volley motion may touch the kitchen: before the jump, during the swing, or stepping in from momentum after the swing. All are faults, even if the ball is already dead.',
          'Anything you are wearing or carrying that falls into the kitchen counts too: hat, paddle, glasses.',
          'You may go into the kitchen to hit a ball that has bounced, then step out. But while you are still in the kitchen or on the line, you may not volley the next ball; both feet must be back outside the kitchen first.',
        ],
        singlesScenes: [
          { caption: 'Both players dink from behind the kitchen line.', highlight: ['nvz'], players: [S({ depth: 'kitchenLine' }), R({ pos: 'left', depth: 'kitchenLine' })] },
          { caption: 'Volleying the ball while in the kitchen: fault.', highlight: ['nvz:near'], players: [S({ depth: 'kitchen' }), R({ pos: 'left', depth: 'kitchenLine' })], ball: { path: ['far:left:kitchenLine', 'near:right:kitchen'] } },
          { caption: 'The ball bounces in the kitchen first, then you step in to hit it: legal.', highlight: ['nvz:near'], players: [S({ depth: 'kitchen' }), R({ pos: 'left', depth: 'kitchenLine' })], ball: { path: ['far:left:kitchenLine', 'near:right:kitchen', 'far:left:kitchen'], bounces: [1], step: 2 } },
        ],
        scenes: [
          { caption: 'All four players dink from behind the kitchen line. The most common sight.', highlight: ['nvz'], players: [A1({ depth: 'kitchenLine' }), A2({ depth: 'kitchenLine' }), B1({ depth: 'kitchenLine' }), B2({ depth: 'kitchenLine' })] },
          { caption: 'Volleying the ball while in the kitchen: fault.', highlight: ['nvz:near'], players: [A1({ depth: 'kitchen' }), A2({ depth: 'kitchenLine' }), B1({ depth: 'kitchenLine' }), B2({ depth: 'kitchenLine' })], ball: { path: ['far:left:kitchenLine', 'near:right:kitchen'] } },
          { caption: 'The ball bounces in the kitchen first, then you step in to hit it: legal.', highlight: ['nvz:near'], players: [A1({ depth: 'kitchen' }), A2({ depth: 'kitchenLine' }), B1({ depth: 'kitchenLine' }), B2({ depth: 'kitchenLine' })], ball: { path: ['far:left:kitchenLine', 'near:right:kitchen', 'far:right:kitchen'], bounces: [1], step: 2 } },
        ],
      },
      {
        id: 'faults',
        title: 'Common faults',
        en: 'Faults',
        summary: 'Ball out, ball into the net, volleying in the kitchen, breaking the two-bounce rule, or the ball hitting you: each ends the rally.',
        detail: [
          'Out: the ball lands outside the lines. A ball on the line is in.',
          'Net: the ball does not clear the net, or goes under it.',
          'Ball hits you: the ball touching you anywhere except your paddle hand below the wrist is a fault, clothing included.',
          'Touching the net: you, your paddle or your clothing touches the net or net post while the ball is in play.',
          'Double hit: the same player hits the ball twice in a row, unless it is one continuous swing.',
          'Wrong server or wrong position: in sanctioned play the referee stops play and corrects it; in casual play, if you notice, replay that rally.',
        ],
        singlesDetail: [
          'Out: the ball lands outside the lines. A ball on the line is in.',
          'Net: the ball does not clear the net, or goes under it.',
          'Ball hits you: the ball touching you anywhere except your paddle hand below the wrist is a fault, clothing included.',
          'Touching the net: you, your paddle or your clothing touches the net or net post while the ball is in play.',
          'Double hit: the same player hits the ball twice in a row, unless it is one continuous swing.',
          'Wrong position (serving from the wrong side): in sanctioned play the referee stops play and corrects it; in casual play, if you notice, replay that rally.',
        ],
        singlesScenes: [
          { caption: 'The ball lands past the baseline: out.', highlight: ['baseline:far'], players: [S(), R({ pos: 'left' })], ball: { path: ['near:right:mid', 'far:left:behind'], bounces: [1] } },
        ],
        scenes: [
          { caption: 'The ball lands past the baseline: out.', highlight: ['baseline:far'], players: four(), ball: { path: ['near:left:mid', 'far:left:behind'], bounces: [1] } },
        ],
      },
      {
        // Around the post and the net: USA Pickleball 11.K (net post), 11.L (net, 11.L.3 around the post).
        id: 'net',
        title: 'Net cords and around the post',
        en: 'Net & Around the Post',
        summary: 'A return does not have to go over the net. A ball that goes around the outside of the net post and lands in on the other side is good. That is an around-the-post shot (ATP).',
        detail: [
          'A ball that clips the net and drops in on the other side is in play. A serve that clips the net is in play too; there is no let.',
          'An ATP can pass lower than the net, as long as it lands in on the other side. It usually comes when your opponent hits a sharp angle far out wide.',
          'A ball that hits the net post, or passes between the net and the net post, is a fault on the hitter.',
          'To hit an ATP you may run off the court, even onto the next court, but neither you nor your paddle may touch the net post or net, and you may not step onto the opponent\'s court.',
        ],
        scenes: [
          { caption: 'B dinks at a sharp angle; the ball bounces in A\'s kitchen and heads off the court.', players: [A1({ pos: 'right', depth: 'mid' }), B1({ depth: 'kitchenLine' })], ball: { path: ['far:right:kitchenLine', 'near:right:kitchen', [270, 318]], bounces: [1] } },
          { caption: 'A chases it off court and hits it back around the post. Lower than the net, no post touched, lands in: good.', highlight: ['net'], players: [A1({ at: [266, 326], field: true }), B1({ depth: 'kitchenLine' })], ball: { path: [[266, 318], [268, 252], [170, 120]], bounces: [2] } },
        ],
      },
      {
        id: 'ends',
        title: 'Changing ends',
        en: 'Changing Ends',
        summary: 'Switch ends after each game. In the deciding game, switch when a team reaches 6 (games to 11).',
        detail: [
          'In game three of a best-of-three, when the first team reaches 6, both teams switch ends. The serve does not change; the same player keeps serving. In games to 15, switch at 8; in games to 21, at 11.',
          'You get 1 minute to change ends, and 2 minutes between games.',
        ],
        singlesScenes: [
          { caption: 'Deciding game at 6-3: switch ends, same server.', players: [S(srv), R()] },
        ],
        scenes: [
          { caption: 'Deciding game at 6-3: switch ends, same server.', players: four({ A1: { depth: 'behind', serving: true } }) },
        ],
      },
    ],
  },
];

export const COMPARE = {
  title: 'Side-out vs rally scoring',
  en: 'Side-out vs Rally',
  rows: [
    ['Who scores', 'Only the serving side', 'Every rally scores'],
    ['Calling the score', 'Doubles: three numbers (adds server number); singles: two', 'Two numbers: serving, receiving'],
    ['Game to', '11, win by 2', '15 or 21, win by 2'],
    ['Server 2', 'Doubles: yes, partners take turns; singles: no', 'None; lose the rally and the serve goes over'],
    ['Switching sides', 'Only when the serving side scores', 'The scoring team lines up by its new score; after a side-out, the right-side player serves'],
    ['Final point', 'Must be won on your own serve', 'The receiving side can win it too'],
    ['Game length', 'About 15 to 25 minutes', 'About 10 to 15 minutes'],
  ],
};
