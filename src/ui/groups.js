import { GROUPS as G, APP_TEXT } from '../data/nav.js';
import { saveGroup, removeGroup, cleanGroups } from '../groups.js';
import { esc } from './scenes.js';
import { toast } from './share.js';
import { fill } from '../fill.js';

// 常用球團 on this phone (src/groups.js holds the rules): a row of chips to
// load one, and a sheet to save the current names or delete old groups.
// Shared by 抽籤 and 報名訊息.
const KEY = 'picobo.groups';
export function loadGroups() {
  try { return cleanGroups(JSON.parse(localStorage.getItem(KEY))); } catch { return []; }
}
function storeGroups(groups) {
  try { localStorage.setItem(KEY, JSON.stringify(groups)); } catch { /* storage unavailable: this visit only */ }
}

// 「＋ 存成球團」 when `add`, then one chip per group (`current` is highlighted).
export function groupChipsHtml(groups, current, add) {
  if (groups.length === 0 && !add) return '';
  // The save chip comes first so it never scrolls out of sight.
  return `<div class="group-chips" role="group" aria-label="${esc(G.label)}">${
    add ? `<button type="button" class="group-chip group-add" data-group-add>${esc(G.add)}</button>` : ''}${groups.map(g =>
    `<button type="button" class="group-chip" data-group="${esc(g.name)}" aria-pressed="${g.name === current}">${esc(g.name)}</button>`).join('')}</div>`;
}

const fillName = (s, name) => fill(s, { name });

// Save `names` under a name, or delete saved groups. Calls `done()` after any change.
export function openGroupSheet(names, done) {
  let groups = loadGroups();
  const dlg = document.createElement('dialog');
  dlg.className = 'install-sheet group-sheet';
  const listHtml = () => groups.length ? `<p class="small swap-group">${esc(G.manage)}</p>
    <ul class="group-list">${groups.map(g => `<li><span><b>${esc(g.name)}</b> <span class="muted small">${esc(fill(APP_TEXT.people, { n: g.names.length }))}</span></span><button type="button" class="btn btn-ghost" data-del="${esc(g.name)}">${esc(G.remove)}</button></li>`).join('')}</ul>` : '';
  dlg.innerHTML = `<form method="dialog" class="rename-form"><b>${esc(G.sheetTitle)}</b>
    <p class="muted small">${esc(G.sheetHint)}</p>
    <input class="input" name="gname" maxlength="20" autocomplete="off" placeholder="${esc(G.namePlaceholder)}">
    <p class="form-error" hidden></p>
    <div class="toolbar"><button class="btn btn-ghost" type="button" data-cancel>${esc(G.cancel)}</button><button class="btn btn-primary" type="submit">${esc(G.save)}</button></div></form>
    <div class="group-manage">${listHtml()}</div>`;
  const form = dlg.querySelector('form'), err = dlg.querySelector('.form-error');
  const close = () => { dlg.close(); dlg.remove(); };
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.gname.value.trim();
    try {
      if (!name) throw new Error('groups: empty name');
      groups = saveGroup(groups, name, names);
    } catch (x) {
      const why = { 'groups: empty name': G.emptyName, 'groups: no players': G.emptyRoster, 'groups: full': G.full }[x.message];
      if (!why) throw x;
      err.textContent = why; err.hidden = false; return;
    }
    storeGroups(groups);
    toast(esc(fillName(G.saved, name)));
    close(); done();
  });
  dlg.addEventListener('click', e => {
    if (e.target === dlg || e.target.closest('[data-cancel]')) { close(); return; }
    const del = e.target.closest('[data-del]');
    if (!del) return;
    groups = removeGroup(groups, del.dataset.del);
    storeGroups(groups);
    toast(esc(fillName(G.removed, del.dataset.del)));
    dlg.querySelector('.group-manage').innerHTML = listHtml();
    done();
  });
  dlg.addEventListener('cancel', e => { e.preventDefault(); close(); });
  document.body.append(dlg);
  dlg.showModal();
  form.gname.focus();
}
