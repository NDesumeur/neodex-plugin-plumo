// lancé par le test « local » de NeoDex : un vol au clavier, les oiseaux débloqués par les médailles, colonnes qui bougent et rafales après 50,
// le plein écran et la place prise (avec NEO_SHOTS : garde des images du jeu)
module.exports = async ({ pj, sleep }) => {
  const C = code => pj(`(() => { const cv = document.getElementById('plCanvas'), T = cv.__pl, pl = T.st(); ${code} })()`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('plCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'plumo-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  const key = k => pj(`document.dispatchEvent(new KeyboardEvent('keydown', {key: '${k}', bubbles: true})), 0`);
  await pj(`window.__e = []; addEventListener('error', e => __e.push(e.message)); 0`);
  await pj(`document.getElementById('plNew').click(), 0`); await sleep(300); await shot('0-pret');
  await key(' '); for (let i = 0; i < 6; i++) { await sleep(250); await key(' '); }
  if (await C('return pl.mode;') !== 'play') throw new Error('le vol ne démarre pas : ' + await C('return pl.mode;'));
  // les oiseaux : sans médaille d'or le flamant est fermé ; une médaille d'or le débloque et il se choisit
  const locked = await pj(`[...document.querySelectorAll('#plBirds button')].map(b => b.disabled)`);
  await C(`T.pls.medals.bronze = T.pls.medals.argent = T.pls.medals.or = T.pls.medals.platine = 1; T.info(); return 0;`); await pj(`document.getElementById('plNew').click(), 0`); await sleep(200);
  await pj(`document.querySelectorAll('#plBirds button')[4].click(), 0`); await sleep(200);
  const chosen = await C('return T.pls.bird;');
  if (locked.length !== 5 || chosen !== 4) throw new Error('oiseaux : ' + JSON.stringify(locked) + ' choisi ' + chosen);
  // après 50 : colonnes qui bougent et rafale (sans pouvoir perdre le temps des images : l'oiseau suit le milieu de la colonne)
  await C(`pl.mode = 'play'; pl.score = 55; pl.windNext = 1; window.__pin = setInterval(() => { const q = pl.pipes.find(p => p.x + 26 > 40) ; pl.y = q ? q.top + q.gap / 2 : 120; pl.v = 0; }, 5); return 0;`);
  await sleep(2600); await shot('1-rafale');
  const st = await C('return [pl.mode, pl.wind, pl.pipes.some(p => p.mv)];');
  await sleep(2500); await shot('2-colonnes');
  await pj(`clearInterval(__pin), 0`);
  if (st[0] !== 'play' || !st[1]) throw new Error('après 50 : ' + JSON.stringify(st));
  // les mondes : quatre boutons ; chacun se choisit avant la partie et garde son propre record
  if (await pj(`document.querySelectorAll('#plWorlds button').length`) !== 4) throw new Error('il faut 4 mondes');
  for (const [i, id] of [[1, 'foret'], [2, 'ville'], [3, 'neige']]) {
    await pj(`document.getElementById('plNew').click(), 0`); await sleep(150); await pj(`document.querySelectorAll('#plWorlds button')[${i}].click(), 0`); await sleep(150);
    if (await C('return T.pls.world;') !== id) throw new Error('monde pas choisi : ' + id);
    await C(`pl.mode = 'play'; pl.score = 12; window.__pin = setInterval(() => { const q = pl.pipes.find(p => p.x + 26 > 40); pl.y = q ? q.top + q.gap / 2 : 120; pl.v = 0; }, 5); return 0;`);
    await sleep(2200); await shot('3-' + id); await pj(`clearInterval(__pin), 0`);
    if (await C('return pl.mode;') !== 'play') throw new Error('perdu dans le monde ' + id);
  }
  await C(`T.pls.world = 'prairie'; T.pls.bird = 0; return 0;`); await pj(`document.getElementById('plNew').click(), 0`);
  const errs = await pj(`window.__e.join(' | ')`); if (errs) throw new Error('erreur : ' + errs);
  await pj(`document.getElementById('plFs').click(), 0`); await sleep(700);
  const fs = await pj(`(() => { const c = document.getElementById('plCanvas'), r = c.getBoundingClientRect(); return document.fullscreenElement === c.parentElement && (Math.abs(r.height - innerHeight) < 3 || Math.abs(r.width - innerWidth) < 3); })()`);
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(300);
  if (!fs) throw new Error('le plein écran ne remplit pas l\'écran');
  const L = await pj(`(() => { const r = document.getElementById('plCanvas').getBoundingClientRect(); let s = 0; for (let e = document.getElementById('plCanvas').parentElement; e; e = e.parentElement) s += e.scrollTop; return { bottom: Math.round(r.bottom + s), h: Math.round(r.height), wh: innerHeight, ww: innerWidth, sw: document.documentElement.scrollWidth }; })()`);
  if (L.bottom > L.wh + 1 || L.sw > L.ww + 1 || L.h < 300) throw new Error('le jeu dépasse la fenêtre ou reste petit : ' + JSON.stringify(L));
  return 'vol, phénix choisi, rafale ' + (st[1] < 0 ? 'montante' : 'descendante') + (st[2] ? ' et colonnes qui bougent' : '') + ' · plein écran · ' + L.h + ' px dans ' + L.ww + '×' + L.wh;
};
