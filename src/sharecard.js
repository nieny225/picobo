// What goes on a share image (src/ui/sharecard.js draws it): a finished
// game's score, the 抽籤 戰績 ranking, or a 戰報 (my week / month). No DOM; words come in as `labels`
// (src/data/nav.js SCORE_SHARE) and the date as "YYYY-MM-DD".
import { dateText } from './signup.js';

const fill = (s, vars) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k]);

// A finished match from src/scoring.js: both teams' names, the scores, which
// side won (0 = 甲, 1 = 乙) and one meta line, e.g.
// "10/2 (Thu)・雙打・側出計分".
export function scoreCard(match, date, labels) {
  if (!match?.teams?.A || !match?.teams?.B || !match.scores) throw new Error('sharecard: not a match');
  const doubles = match.teams.A.names.length > 1;
  const scoring = match.mode === 'fun' ? 'fun' : match.mode.split('-')[0];
  if (!labels.scoring[scoring]) throw new Error(`sharecard: unknown mode ${match.mode}`);
  const winner = match.finished ? (match.winner === 'A' ? 0 : 1) : null;
  return {
    teams: [match.teams.A.names.slice(), match.teams.B.names.slice()],
    scores: [match.scores.A, match.scores.B],
    winner,
    meta: [dateText(date), labels.play[doubles ? 'doubles' : 'singles'], labels.scoring[scoring]].join('・'),
  };
}

// 抽籤 counts ({ name: { played, won } }) ranked like the 今天戰績 table:
// most wins, then fewest games. Everyone who has played is on it (leaving
// people out of a shared picture feels wrong).
export function statsCard(stats, date, labels) {
  const ranked = Object.entries(stats ?? {})
    .filter(([, r]) => r.played > 0)
    .sort((a, b) => b[1].won - a[1].won || a[1].played - b[1].played);
  if (ranked.length === 0) throw new Error('sharecard: no games yet');
  return {
    meta: [dateText(date), fill(labels.people, { n: ranked.length })].join('・'),
    rows: ranked.map(([name, r], i) => ({ rank: i + 1, name, played: r.played, won: r.won })),
  };
}

// 戰報: my numbers over a range (summary() from src/record.js) as a picture:
// "這週打了 14 場" (split around the number so it can be highlighted), the
// dates, and four tiles: 勝率, 最長連勝, 最佳拍檔 (else 最常搭檔), 戰績.
export function reportCard(sum, name, range, now, labels) {
  const R = labels.report;
  if (!R[range]) throw new Error(`sharecard: unknown range ${range}`);
  if (!sum || sum.played < 1) throw new Error('sharecard: no games yet');
  const md = d => `${d.getMonth() + 1}/${d.getDate()}`;
  let period = R.allTime;
  if (range === 'week') {
    const mon = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7));
    const sun = new Date(mon.getFullYear(), mon.getMonth(), mon.getDate() + 6);
    period = `${md(mon)}–${md(sun)}`;
  } else if (range === 'month') period = fill(R.monthName, { m: now.getMonth() + 1 });
  const [before, after] = R[range].split('{n}');
  const partner = sum.bestPartner ? { label: R.best, value: sum.bestPartner.name } : sum.mostPartner ? { label: R.most, value: sum.mostPartner.name } : null;
  return {
    meta: [name, period].join('・'),
    headline: { before, n: String(sum.played), after },
    tiles: [
      { label: R.rate, value: `${sum.rate}%` },
      { label: R.streak, value: String(sum.longestStreak) },
      partner ?? { label: R.best, value: '–' },
      { label: R.record, value: fill(R.wl, { won: sum.won, lost: sum.lost }) },
    ],
  };
}
