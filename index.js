// Plumo : Un petit oiseau à faire voler entre les colonnes : un battement à chaque clic. Le ciel change avec ton score, des médailles à gagner.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Plumo</span><span class="hint">Clic, espace, ↑ ou A (manette) : battre des ailes · P ou Start : pause</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="plCanvas" width="216" height="288"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="plStats"></div></div>
      <div class="sysCard"><b>MÉDAILLES</b><div class="row" id="plMedals"></div></div>
      <div class="sysCard"><b>OISEAUX</b><div class="plBirds" id="plBirds"></div></div>
      <div class="row"><button class="btn main" id="plNew">NOUVELLE PARTIE</button><button class="btn" id="plFs">PLEIN ÉCRAN</button></div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:1 1 360px;min-width:min(100%,320px);position:relative}
.gameBox:fullscreen{padding:0}
.gameBox:fullscreen canvas{width:min(100vw,calc(100vh * 216 / 288))}
.gameBox canvas{width:100%;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}
.gameBox canvas{width:min(100%,max(280px,calc((100vh - 170px) * 216 / 288)));height:auto;aspect-ratio:216/288}
.plBirds{display:grid;grid-template-columns:repeat(auto-fill,minmax(88px,1fr));gap:8px}
.plBirds button{display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 4px;font-size:13px;line-height:1.2}
.plBirds canvas{width:48px;height:36px;image-rendering:pixelated}
#plMedals canvas{width:48px;height:48px;image-rendering:pixelated}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}


export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: 'PLUMO', T: { k: '#1a0e05', k2: '#2a1808', fill: '#3a2410', fillOn: '#4e3216', hl: '#5e3c1a', line: '#7a5024', acc: '#ffcf3a', accL: '#fff0a8', accS: '#c98a14', accD: '#5a3a06',
  rivet: '#fff7d1', btn: '#5e3c1a', btnHi: '#9a6a32', btnLo: '#2a1808', btnHov: '#74491f', btnHovHi: '#b8823e', text: '#fff4e0', muted: '#d6b58a', acc2: '#5ec8ff', gold: '#ffcf3a',
  orange: '#ff8a3a', red: '#ff5a4a', green: '#7ee07a', green2: '#2f8a3a', bg: '#1d1006', bgDot: '#3a2410', bgDot2: '#2a1808', spark: '#7a5024', spark2: '#fff0a8',
  tile: ['................', '...:............', '................', '..........+.....', '................', '................', '.....:..........', '................',
    '................', '.............:..', '................', '..+.............', '................', '.........:......', '................', '................'] },
  emblem: ['....kkkkk......', '..kkggggskk....', '.kggggggwwk....', '.kgggggggwkwk..', 'kggggggggwwwk..', 'kwwwgggggooooo.', 'kwwwwggggkoook.', '.kwwwgggggkkk..', '.kggggggggk....', '..kkggggskk....', '....kkkkk......'],
  icons: [[/^NOUVELLE/, 'play'], [/^PLEIN/, 'full'], [/^RECORDS/, 'crown'], [/^MÉDAILLES/, 'star'], [/^OISEAUX/, 'star']] });
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const games = { best: {}, ...(await doc('games')) };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v) => { const b = games.best[k]; if (b == null || v > b) { games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // lignes centrées en police pixel, sur une bande sombre
  g.fillStyle = 'rgba(11,3,28,.72)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
  lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };

const clock = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');

/* ---------- Plumo : gravité, un battement = une impulsion vers le haut ; colonnes de pierre ; le ciel passe du jour au soir puis à la nuit avec le score ---------- */
const PL = {W: 216, H: 288, GROUND: 252, G: .16, FLAP: -3.15, VMAX: 5, GAP0: 92, GAPMIN: 66, SPEED0: 1.25, SPACING: 92, PW: 26};
const PL_MED = [[100, 'platine', ['#e8f4ff', '#9fc8e8', '#5a7fa8']], [50, 'or', ['#fff0a8', '#ffcf3a', '#a8780a']], [25, 'argent', ['#ffffff', '#c8ccd8', '#7a7f92']], [10, 'bronze', ['#ffc89a', '#d0844a', '#7a4a1f']]];
const pls = gstore('plumo', {games: 0, flaps: 0, medals: {}});
pls.bird ??= 0;
let pl = null;
const BIRD = [  // 3 images d'ailes ; k contour, y corps, w ventre et œil, o bec, e pupille
  ['....kkkkk...', '..kkyyyykk..', '.kyyyyywwek.', 'kkkyyyywwwk.', 'kwwwkyyyyoook', 'kwwwkyyykoook', '.kkkyyyyykkk.', '..kyyyyyyk...', '...kkkkkk....'],
  ['....kkkkk...', '..kkyyyykk..', '.kyyyyywwek.', 'kyyyyyywwwk.', 'kkkkkyyyyoook', 'kwwwwkyykoook', '.kwwwkyyykkk.', '..kkkyyyyk...', '...kkkkkk....'],
  ['....kkkkk...', '..kkyyyykk..', '.kkkyyywwek.', 'kwwwkyywwwk.', 'kwwwkyyyyoook', 'kkkkyyyykoook', '.kyyyyyyykkk.', '..kyyyyyyk...', '...kkkkkk....']];
const BIRDS = [
  {name: 'Plumo', need: null, pal: {k: '#2a1408', y: '#ffcf3a', w: '#ffffff', o: '#ff6a2a', e: '#2a1408'}},
  {name: 'Rougegorge', need: 'bronze', pal: {k: '#2a1408', y: '#a86a3a', w: '#ff6a3a', o: '#3a2a1a', e: '#2a1408'}},
  {name: 'Mésange', need: 'argent', pal: {k: '#0e1a32', y: '#3f7aff', w: '#fff07a', o: '#2a2a3a', e: '#0e1a32'}},
  {name: 'Flamant', need: 'or', pal: {k: '#3a0e22', y: '#ff8ac8', w: '#ffd8ec', o: '#2a1420', e: '#3a0e22'}},
  {name: 'Phénix', need: 'platine', pal: {k: '#3a0806', y: '#ff5a2a', w: '#ffe07a', o: '#fff4c8', e: '#3a0806'}, glow: true},
];
const plBirdOk = b => !b.need || !!pls.medals[b.need];
let BIRD_PAL = BIRDS[0].pal;
function plNew() {
  pl = Object.assign(pl || {tick: 0, raf: 0}, {seen: pl ? pl.tick : 0, mode: 'ready', y: 120, v: 0, rot: 0, pipes: [], score: 0, dist: 0, flash: 0, dead: 0, record: false, fl: 0, wind: 0, windA: 0, windT: 0, windNext: 480, gusts: []});
  BIRD_PAL = (plBirdOk(BIRDS[pls.bird] || BIRDS[0]) ? BIRDS[pls.bird] : BIRDS[0]).pal;
}
function plGap() { return Math.max(PL.GAPMIN, PL.GAP0 - pl.score * .6); }
function plSpeed() { return PL.SPEED0 + Math.min(1, pl.score / 60) * .7; }
function plFlap() {
  if (pl.mode === 'over') { if (pl.dead > 40) plNew(); return; }
  if (pl.mode === 'ready') { pl.mode = 'play'; pls.games++; saveGames(); }
  if (pl.mode === 'pause') pl.mode = 'play';
  pl.v = PL.FLAP; pl.fl = 10; pls.flaps++; plBeep(520, .05);
}
let plac = null;
let plMute = false;
function plBeep(f, d, type = 'square', slide = 0) { if (plMute) return; try { plac ??= new AudioContext(); const o = plac.createOscillator(), g = plac.createGain(), t = plac.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); g.gain.setValueAtTime(.05, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(plac.destination); o.start(t); o.stop(t + d + .02); } catch {} }
function plHit() {
  if (pl.mode !== 'play') return;
  pl.mode = 'over'; pl.flash = 8; pl.dead = 0; plBeep(300, .3, 'sawtooth', 60);
  pl.record = best('plumo', pl.score);
  for (const [n, k] of PL_MED) if (pl.score >= n) { pls.medals[k] = (pls.medals[k] || 0) + 1; break; }
  saveGames(); plInfo();
}
function plUpdate() {
  if (pl.fl) pl.fl--; if (pl.flash) pl.flash--;
  if (pl.mode === 'ready') { pl.y = 120 + Math.sin(pl.tick / 12) * 4; pl.dist += 1; return; }
  if (pl.mode === 'over') { pl.dead++; if (pl.y < PL.GROUND - 10) { pl.v = Math.min(PL.VMAX + 2, pl.v + PL.G * 1.5); pl.y += pl.v; } return; }
  const sp = plSpeed(); pl.dist += sp;
  if (pl.score >= 50) {  // le vent : une rafale de 2 à 3 s toutes les 6 à 10 s, annoncée une seconde avant
    if (pl.windA > 0) pl.windA--; else if (pl.windT > 0) { if (--pl.windT === 0) pl.wind = 0; } else if (--pl.windNext <= 0) { pl.wind = Math.random() < .5 ? -1 : 1; pl.windA = 60; pl.windT = 120 + Math.floor(Math.random() * 60); pl.windNext = 360 + Math.floor(Math.random() * 240); plBeep(200, .5, 'triangle', pl.wind < 0 ? 400 : 100); }
  }
  const blow = !pl.windA && pl.windT > 0 ? pl.wind * .055 : 0;  // la première seconde n'est que l'annonce
  pl.v = Math.min(PL.VMAX, pl.v + PL.G + blow); pl.y += pl.v; if (pl.y < 4) { pl.y = 4; pl.v = 0; }
  pl.rot = Math.max(-.45, Math.min(1.2, pl.v / 4));
  const last = pl.pipes.at(-1);
  if (!last || last.x < PL.W - PL.SPACING) { const gap = plGap(), top = 30 + Math.random() * (PL.GROUND - 60 - gap); pl.pipes.push({x: PL.W + 4, top, base: top, gap, done: false, kind: Math.random() < .5 ? 0 : 1, mv: pl.score >= 50 && Math.random() < .45 ? 14 + Math.random() * 10 : 0, ph: Math.random() * 6}); }
  for (const p of pl.pipes) {
    p.x -= sp;
    if (p.mv) p.top = Math.max(26, Math.min(PL.GROUND - 26 - p.gap, p.base + Math.sin(pl.dist / 40 + p.ph) * p.mv));  // une colonne qui bouge
    if (!p.done && p.x + PL.PW < 52) { p.done = true; pl.score++; plBeep(880, .08, 'square', 1320); if (pl.score % 25 === 0) plBeep(660, .3, 'triangle', 1320); }
    if (p.x < 64 && p.x + PL.PW > 44 && (pl.y - 9 < p.top || pl.y + 9 > p.top + p.gap)) plHit();  // la boîte de l'oiseau est un peu plus petite que son dessin
  }
  pl.pipes = pl.pipes.filter(p => p.x > -PL.PW - 4);
  if (pl.y + 10 >= PL.GROUND) { pl.y = PL.GROUND - 10; plHit(); }
}
// le ciel : 4 ambiances (jour, soir, nuit, aube) qui se suivent tous les 25 points
const SKY = [{top: '#5ec8ff', bot: '#bfeaff', hill: '#7ee07a', hill2: '#4fb85a', cloud: '#ffffff', far: '#9fd8f0'}, {top: '#ff8a5a', bot: '#ffd08a', hill: '#c87a4a', hill2: '#8a4a2a', cloud: '#ffe0c0', far: '#e8a07a'},
  {top: '#0b1236', bot: '#2a2a6a', hill: '#1a2a4a', hill2: '#0e1a32', cloud: '#3a3f7a', far: '#1e2650'}, {top: '#9a7ae8', bot: '#ffc0d8', hill: '#6aa87a', hill2: '#3f7a5a', cloud: '#fff0f8', far: '#c8a8e8'}];
const lerpC = (a, b, k) => '#' + [1, 3, 5].map(i => Math.round(parseInt(a.substr(i, 2), 16) * (1 - k) + parseInt(b.substr(i, 2), 16) * k).toString(16).padStart(2, '0')).join('');
function plSky() { const f = (pl.score / 25) % 4, i = Math.floor(f), k = Math.min(1, (f - i) * 4), a = SKY[i], b = SKY[(i + 1) % 4]; return Object.fromEntries(Object.keys(a).map(n => [n, lerpC(a[n], b[n], i === Math.floor(f) && f - i > .75 ? (f - i - .75) * 4 : 0)])); }
function plPipe(g, x, y, h, cap, kind) {  // une colonne de pierre : bord sombre, face claire à gauche, joints, chapiteau
  if (h <= 0) return;
  const W = PL.PW, C = kind ? ['#2a1408', '#c8a878', '#e8d0a0', '#8a6a42'] : ['#14301a', '#4fb85a', '#9ae88a', '#2a7a3a'];
  px(g, C[0], x, y, W, h); px(g, C[1], x + 1, y, W - 2, h); px(g, C[2], x + 3, y, 3, h); px(g, C[3], x + W - 5, y, 3, h);
  for (let j = (Math.floor(y) % 12 + 12) % 12; j < h; j += 12) px(g, C[3], x + 1, y + j, W - 2, 1);
  const cy = cap === 'top' ? y + h - 10 : y; px(g, C[0], x - 3, cy, W + 6, 10); px(g, C[1], x - 2, cy + 1, W + 4, 8); px(g, C[2], x, cy + 2, 3, 6); px(g, C[3], x - 2, cy + 7, W + 4, 2);
}
function plDraw() {
  const g = pl.g, s = plSky(), W = PL.W;
  for (; pl.seen < pl.tick; pl.seen++) if (pl.mode !== 'play') plUpdate();  // la boucle commune n'avance que les parties en cours : l'attente et la chute avancent ici
  const sky = g.createLinearGradient(0, 0, 0, PL.GROUND); sky.addColorStop(0, s.top); sky.addColorStop(1, s.bot);
  // le ciel en bandes (pas de dégradé lisse : des bandes de 6 pixels, tramées)
  for (let y = 0; y < PL.GROUND; y += 6) { const k = y / PL.GROUND; g.fillStyle = lerpC(s.top, s.bot, Math.round(k * 8) / 8); g.fillRect(0, y, W, 6); }
  if (s.top === SKY[2].top || pl.score % 100 >= 50 && pl.score % 100 < 75) for (let i = 0; i < 30; i++) px(g, '#ffffff', (i * 71 + 13) % W, (i * 37) % 120, 1, 1);
  const d = pl.dist;
  // nuages, collines lointaines, collines proches : trois vitesses
  for (let i = 0; i < 5; i++) { const x = ((i * 67 - d * .15) % (W + 60) + W + 60) % (W + 60) - 40, y = 20 + (i * 29) % 70; for (const [a, b, w, h] of [[0, 4, 30, 6], [6, 0, 16, 10], [18, 2, 10, 8]]) px(g, s.cloud, x + a, y + b, w, h); }
  for (let x = 0; x < W; x += 2) { const h = 24 + Math.sin((x + d * .3) / 23) * 10 + Math.sin((x + d * .3) / 9) * 3; px(g, s.far, x, PL.GROUND - 18 - h, 2, h + 18); }
  for (let x = 0; x < W; x += 2) { const h = 12 + Math.sin((x + d * .6) / 17) * 6; px(g, s.hill2, x, PL.GROUND - h, 2, h); px(g, s.hill, x, PL.GROUND - h, 2, 2); }
  for (const p of pl.pipes) { plPipe(g, p.x, 0, p.top, 'top', p.kind); plPipe(g, p.x, p.top + p.gap, PL.GROUND - p.top - p.gap, 'bottom', p.kind); if (p.mv) for (const yy of [p.top - 4, p.top + p.gap + 3]) px(g, '#ffffff', p.x + PL.PW / 2 - 1, yy, 2, 1); }
  if (pl.wind) {  // la rafale : des traits qui filent, et l'annonce en haut
    if (pl.mode === 'play' && !pl.windA && pl.tick % 2 === 0) pl.gusts.push({x: Math.random() * W, y: pl.wind < 0 ? PL.GROUND : 0, l: 8 + Math.random() * 10});
    if (pl.windA || (pl.tick >> 3) % 2) PXK.fill(g, pl.wind < 0 ? '↑ RAFALE ↑' : '↓ RAFALE ↓', W / 2, 58, pl.windA ? '#ffcf3a' : '#ffffff', 1, 'center');
  }
  for (const q of pl.gusts) { q.y += pl.wind < 0 ? -5 : 5; q.x -= 1; px(g, 'rgba(255,255,255,.55)', q.x, q.y, 1, q.l); }
  pl.gusts = pl.gusts.filter(q => q.y > -20 && q.y < PL.GROUND + 20);
  // le sol : herbe, terre, petites pierres qui défilent
  px(g, '#2a1408', 0, PL.GROUND, W, 1); px(g, '#7ee07a', 0, PL.GROUND + 1, W, 4); px(g, '#4fb85a', 0, PL.GROUND + 5, W, 2); px(g, '#c8925a', 0, PL.GROUND + 7, W, PL.H - PL.GROUND - 7);
  for (let x = -(d % 16); x < W; x += 16) { px(g, '#a8723a', x, PL.GROUND + 12, 6, 2); px(g, '#a8723a', x + 9, PL.GROUND + 22, 4, 2); px(g, '#4fb85a', x + 4, PL.GROUND + 5, 2, 2); }
  // l'oiseau, penché selon sa vitesse (rotation par pas de 1/8 de tour : reste net)
  const f = pl.mode === 'over' ? 1 : pl.fl > 5 ? 2 : pl.fl > 0 ? 0 : Math.floor(pl.tick / 8) % 3, r = Math.round(pl.rot * 4) / 4;
  if (BIRD_PAL === BIRDS[4].pal && pl.mode !== 'over') for (let i = 1; i < 6; i++) px(g, i % 2 ? '#ffcf3a' : '#ff5a2a', 42 - i * 4 + ((pl.tick + i) % 3), pl.y - 1 + Math.sin(pl.tick / 4 + i) * 2, 3, 3);  // la traîne du phénix
  g.save(); g.translate(Math.round(54), Math.round(pl.y)); g.rotate(r); g.scale(2, 2); sprite(g, BIRD[f], -6, -5, BIRD_PAL); g.restore();
  if (pl.flash) { g.globalAlpha = pl.flash / 10; g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, PL.H); g.globalAlpha = 1; }
  // score
  if (pl.mode !== 'ready') { const k = PXK.scale(24), t = String(pl.score); for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [1, 1]]) PXK.fill(g, t, W / 2 + dx * k, 34 + dy * k, '#2a1408', k, 'center'); PXK.fill(g, t, W / 2, 34, '#ffffff', k, 'center'); }
  if (pl.mode === 'ready') gameText(g, W, [['PLUMO', '#ffcf3a', 16], ['Clic ou espace', '#ffffff'], ['pour voler', '#ffffff'], ['Record ' + (games.best.plumo || 0), '#fff0a8']], 160);
  if (pl.mode === 'pause') gameText(g, W, [['PAUSE', '#ffffff', 12], ['Clic pour reprendre', '#fff0a8']], 140);
  if (pl.mode === 'over' && pl.dead > 20) {
    const m = PL_MED.find(([n]) => pl.score >= n);
    gameText(g, W, [['PERDU', '#ff5a4a', 14], ['Score ' + pl.score, '#ffffff'], [pl.record ? 'NOUVEAU RECORD !' : 'Record ' + (games.best.plumo || 0), '#ffcf3a'], [m ? 'Médaille ' + m[1] : 'Médaille à 10 points', '#fff0a8'], [pl.dead > 40 ? 'Clic pour rejouer' : '', '#d6b58a']], 120);
    if (m) plMedal(g, W / 2 - 12, 196, m[2]);
  }
}
function plMedal(g, x, y, [l, m, d]) {  // une médaille 24 × 24 : ruban et disque
  const R = ['..rr....bb..', '..rrr..bbb..', '...rr..bb...', '....kkkk....', '..kkmmmmkk..', '.kmllmmmmdk.', '.kmlmmmmmdk.', 'kmlmmllmmmdk', 'kmmmmllmmmdk', '.kmmmmmmmdk.', '.kkmmmmmddk.', '...kkkkkk...'];
  R.forEach((row, j) => { for (let i = 0; i < 12; i++) { const c = {r: '#ff4f6a', b: '#3f7aff', k: '#2a1408', m, l, d}[row[i]]; if (c) px(g, c, x + i * 2, y + j * 2, 2, 2); } });
}
function plInfo() {
  const rows = [el('span', '', 'Meilleur score'), el('b', '', String(games.best.plumo || 0)), el('span', '', 'Parties'), el('b', '', String(pls.games)), el('span', '', 'Battements d’ailes'), el('b', '', String(pls.flaps))];
  $('plStats').replaceChildren(...rows);
  $('plBirds').replaceChildren(...BIRDS.map((B, i) => {  // les oiseaux : choisis d'un clic, ou cadenas avec la médaille qui les débloque
    const ok = plBirdOk(B), c = el('canvas'); c.width = 16; c.height = 12; sprite(c.getContext('2d'), BIRD[0], 2, 1, ok ? B.pal : {k: '#1a0e05', y: '#3a2410', w: '#3a2410', o: '#3a2410', e: '#1a0e05'});
    const btn = el('button', 'btn' + (pls.bird === i && ok ? ' main' : '')); btn.disabled = !ok; btn.append(c, el('span', '', ok ? B.name : 'Médaille ' + B.need));
    btn.onclick = () => { pls.bird = i; saveGames(); if (pl.mode !== 'play') BIRD_PAL = B.pal; plInfo(); btn.blur(); };
    return btn;
  }));
  $('plMedals').replaceChildren(...PL_MED.map(([n, k, col]) => { const c = el('canvas'); c.width = c.height = 24; const g = c.getContext('2d'); if (!pls.medals[k]) g.globalAlpha = .25; plMedal(g, 0, 0, col); const w = el('div', 'hint'); w.title = k + ' (' + n + ' points)'; w.append(c, el('span', '', ' × ' + (pls.medals[k] || 0))); return w; }));
}
$('plCanvas').onpointerdown = e => { e.preventDefault(); if (pl) plFlap(); };
document.addEventListener('keydown', e => {
  if (!view.classList.contains('on') || !pl || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
  if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'Enter') { e.preventDefault(); if (!e.repeat) plFlap(); }
  if (e.key.toLowerCase() === 'p' && pl.mode === 'play') pl.mode = 'pause';
});
$('plNew').onclick = () => { plNew(); $('plNew').blur(); };
$('plFs').onclick = () => { $('plFs').blur(); try { document.fullscreenElement ? document.exitFullscreen() : $('plCanvas').parentElement.requestFullscreen?.().catch(() => {}); } catch {} };
{  // la manette envoie les touches du clavier : A, B ou la croix vers le haut = battre des ailes, Start = pause
  const KEY = {0: ' ', 1: ' ', 12: 'ArrowUp', 9: 'p'}, held = new Set();
  const loop = () => {
    requestAnimationFrame(loop); if (!view.classList.contains('on') || !navigator.getGamepads) return;
    const p = [...navigator.getGamepads()].find(Boolean); if (!p) return;
    const down = new Set(); for (const [i, k] of Object.entries(KEY)) if (p.buttons[i]?.pressed) down.add(k); if ((p.axes[1] || 0) < -.6) down.add('ArrowUp');
    for (const k of down) if (!held.has(k)) { held.add(k); document.dispatchEvent(new KeyboardEvent('keydown', {key: k, bubbles: true})); }
    for (const k of [...held]) if (!down.has(k)) held.delete(k);
  };
  requestAnimationFrame(loop);
}
$('plCanvas').__pl = {st: () => pl, pls, birds: BIRDS, info: () => plInfo()};
{  // vérification : passer une colonne donne un point, toucher le sol arrête la partie
  const keep = pl, realBest = games.best.plumo; pl = null; plMute = true; plNew();
  pl.mode = 'play'; pl.y = 120; pl.v = 0; pl.pipes = [{x: 20, top: 60, gap: 120, done: false, kind: 0}]; for (let i = 0; i < 5; i++) { pl.v = PL.FLAP / 2; plUpdate(); } const scored = pl.score === 1;
  pl.pipes = []; pl.y = PL.GROUND - 9; pl.v = 3; plUpdate(); const dead = pl.mode === 'over';
  plNew(); pl.mode = 'play'; pl.score = 60; let moving = 0; for (let i = 0; i < 40; i++) { pl.pipes = []; pl.y = 120; plUpdate(); moving += pl.pipes.some(q => q.mv) ? 1 : 0; }
  plNew(); pl.mode = 'play'; pl.score = 60; pl.windNext = 1; pl.y = 120; plUpdate(); const windy = pl.wind !== 0;
  console.assert(scored && dead && moving > 5 && moving < 35 && windy, 'plumo', {scored, dead, moving, windy});
  if (realBest === undefined) delete games.best.plumo; else games.best.plumo = realBest;  // la vérification ne laisse pas de faux record
  pl = keep; plMute = false;
}
ctx.onOpen(() => {
  if (!pl || !pl.g) { plNew(); pl.g = $('plCanvas').getContext('2d'); }
  gameLoop(pl, 'plumo', plUpdate, plDraw); plInfo();
});
}
