import { DINOS, UI } from './data.js';
import { dinoSVG } from './dinos.js';

const app = document.getElementById('app');
const topbar = document.querySelector('.topbar');
const MAX_LEN = Math.max(...DINOS.map((d) => d.len));
const KID_LEN = 1.3;

const pref = (k, def) => { try { return localStorage.getItem(k) || def; } catch { return def; } };
const save = (k, v) => { try { localStorage.setItem(k, v); } catch {} };
let lang = pref('lang', 'id');
let mode = pref('mode', 'cartoon'); // 'cartoon' | 'real' — the viewer's default look
let filter = 'all', query = '';
const t = () => UI[lang];
const L = (obj) => obj[lang];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`); // image credits come from Commons metadata

// ---------- sound ----------
const clips = {};
function playDino(d) {
  const a = (clips[d.sound] ??= new Audio(`sounds/${d.sound}.mp3`));
  a.preservesPitch = false;
  a.playbackRate = d.rate;
  a.currentTime = 0;
  a.play().catch(() => {});
}

function speak(text, btn) {
  const s = window.speechSynthesis;
  if (!s) return;
  if (s.speaking) { s.cancel(); return; }
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang === 'id' ? 'id-ID' : 'en-US';
  const voices = s.getVoices();
  u.voice = voices.find((v) => v.lang.replace('_', '-') === u.lang) || voices.find((v) => v.lang.startsWith(lang)) || null;
  u.rate = 0.9;
  u.pitch = 1.1;
  btn.classList.add('on');
  u.onend = u.onerror = () => btn.classList.remove('on');
  s.speak(u);
}

// Cartoon SVG, or the realistic paleoart when that mode is on and the animal has one.
function art(d, cls = '', lazy = true) {
  if (mode !== 'real' || !d.image) return dinoSVG(d, cls);
  return `<span class="real-wrap${d.image.flip ? ' flipped' : ''}"><img class="real ${d.kind} ${cls}" src="${d.image.file}" alt="${d.name}"${lazy ? ' loading="lazy"' : ''}></span>`;
}

// ---------- views ----------
function header() {
  topbar.innerHTML = `<a href="#/" class="logo">🦖 ${t().title}</a>
    <nav><button class="btn mode" aria-pressed="${mode === 'real'}" title="${t().modeHint}">${mode === 'real' ? t().modeReal : t().modeCartoon}</button>
    <button class="btn lang" aria-label="${t().langLabel}">🌐 ${t().lang}</button></nav>`;
  topbar.querySelector('.lang').onclick = () => {
    lang = lang === 'id' ? 'en' : 'id';
    save('lang', lang);
    header();
    route();
  };
  topbar.querySelector('.mode').onclick = () => {
    mode = mode === 'real' ? 'cartoon' : 'real';
    save('mode', mode);
    header();
    route(false);
  };
  document.documentElement.lang = lang;
}

const FILTERS = {
  all: () => true,
  meat: (d) => d.diet !== 'plant',
  plant: (d) => d.diet === 'plant' || d.diet === 'omni',
  sky: (d) => d.scene === 'sky',
  sea: (d) => d.scene === 'sea',
};

function home() {
  app.innerHTML = `<p class="subtitle">${t().subtitle}</p>
    <div class="filters">
      <input class="search" type="search" placeholder="🔎 ${t().search}" aria-label="${t().search}" value="${query.replace(/"/g, '&quot;')}">
      <div class="chips-row">${Object.keys(FILTERS).map((f) => `<button class="btn filter${f === filter ? ' active' : ''}" data-f="${f}" aria-pressed="${f === filter}">${t().filters[f]}</button>`).join('')}</div>
    </div>
    <p class="count" aria-live="polite"></p>
    <div class="grid"></div>`;
  const grid = app.querySelector('.grid');
  const draw = () => {
    const q = query.trim().toLowerCase();
    const list = DINOS.filter((d) => FILTERS[filter](d) && (!q || d.name.toLowerCase().includes(q) || L(d.meaning).toLowerCase().includes(q)));
    app.querySelector('.count').textContent = list.length ? t().count(list.length) : t().none;
    grid.innerHTML = list.map((d, i) => `
      <a class="card" href="#/dino/${d.slug}" style="--i:${Math.min(i, 12)};--c:${d.colors[0]}">
        ${art(d)}<span class="card-name">${d.name}</span><span class="card-meaning">${L(d.meaning)}</span>
      </a>`).join('');
  };
  app.querySelector('.search').oninput = (e) => { query = e.target.value; draw(); };
  app.querySelectorAll('.filter').forEach((b) => b.onclick = () => {
    filter = b.dataset.f;
    app.querySelectorAll('.filter').forEach((x) => { x.classList.toggle('active', x === b); x.setAttribute('aria-pressed', x === b); });
    draw();
  });
  draw();
}

const SCENERY = {
  land: '<div class="sun"></div><div class="cloud"></div><div class="cloud c2"></div><div class="volcano"><span class="smoke"></span><span class="smoke s2"></span></div><div class="ground"></div><div class="plant p1">🌴</div><div class="plant p2">🌿</div>',
  sky: '<div class="sun"></div><div class="cloud"></div><div class="cloud c2"></div><div class="ground"></div>',
  sea: '<div class="ground"></div><div class="plant p1">🌿</div><div class="plant p2">🐚</div>',
};

let roarTimer;
function detail(d) {
  const i = DINOS.indexOf(d);
  const prev = DINOS.at(i - 1), next = DINOS[(i + 1) % DINOS.length];
  const chips = [
    ['🕰️', t().period, L(d.period)],
    [t().diet[d.diet].split(' ')[0], t().food, t().diet[d.diet].split(' ').slice(1).join(' ')],
    ['📏', t().length, L(d.length)],
    ['⚖️', t().weight, L(d.weight)],
    ['🌍', t().place, L(d.place)],
  ];
  app.innerHTML = `
    <a class="btn" href="#/">⬅ ${t().back}</a>
    <section class="stage scene-${d.scene}">
      ${SCENERY[d.scene]}
      <button class="walker" aria-label="${t().roar}"><span class="flip">${art(d, 'walking', false)}</span></button>
      <span class="tap-hint">👆 ${t().tap}</span>
    </section>
    ${mode === 'real' && d.image ? `<p class="credit">📷 ${t().credit}: <a href="${esc(d.image.source)}" target="_blank" rel="noopener">${esc(d.image.author)}</a> · ${esc(d.image.license)}</p>` : ''}
    <h2 class="dino-name">${d.name}</h2>
    ${d.notDino ? `<p class="badge">⚠️ ${t().notDino}</p>` : ''}
    <p class="meaning">${t().meaning}: <b>“${L(d.meaning)}”</b></p>
    <div class="actions">
      <button class="btn big roar-btn">🔊 ${t().roar}</button>
      <button class="btn big read-btn">📖 ${t().read}</button>
    </div>
    <div class="chips">${chips.map(([icon, label, val], j) => `<div class="chip" style="--i:${j}"><small>${icon} ${label}</small>${val}</div>`).join('')}</div>
    <section class="panel"><p class="desc">${L(d.desc)}</p></section>
    <section class="panel">
      <h3>📐 ${t().howBig}</h3>
      <div class="size-row"><span class="who">🧒</span><div class="bar" style="--w:${(KID_LEN / MAX_LEN) * 100}%;--c:#ff8a3d"></div></div>
      <div class="bar-label">${t().you} ≈ ${lang === 'id' ? '1,3' : '1.3'} m</div>
      <div class="size-row">${art(d)}<div class="bar" style="--w:${(d.len / MAX_LEN) * 100}%;--c:${d.colors[0]}"></div></div>
      <div class="bar-label">${d.name}: ${L(d.length)}</div>
      <p><b>${t().timesYou(Math.max(1, Math.round(d.len / KID_LEN)))}</b></p>
    </section>
    <section class="panel">
      <h3>💡 ${t().didYouKnow}</h3>
      <ul class="facts">${L(d.facts).map((f, j) => `<li style="--i:${j}">${f}</li>`).join('')}</ul>
    </section>
    <nav class="pager">
      <a class="btn" href="#/dino/${prev.slug}">⬅ ${prev.name}</a>
      <a class="btn" href="#/dino/${next.slug}">${next.name} ➡</a>
    </nav>`;

  const walker = app.querySelector('.walker'), svg = walker.querySelector('.dino, .real');
  const roar = () => {
    app.querySelector('.tap-hint')?.remove();
    playDino(d);
    svg.classList.remove('roaring');
    void svg.getBoundingClientRect(); // restart the CSS animation
    svg.classList.add('roaring');
    walker.classList.add('paused');
    clearTimeout(roarTimer);
    roarTimer = setTimeout(() => { svg.classList.remove('roaring'); walker.classList.remove('paused'); }, 1200);
  };
  // Paleoart is cut out (transparent); the few with a painted backdrop (opaque corner pixel) are shown framed.
  const img = walker.querySelector('img');
  const sniff = () => {
    const c = Object.assign(document.createElement('canvas'), { width: 1, height: 1 }).getContext('2d');
    c.drawImage(img, 0, 0, 1, 1, 0, 0, 1, 1);
    if (c.getImageData(0, 0, 1, 1).data[3] === 255) walker.classList.add('framed');
  };
  if (img) img.complete && img.naturalWidth ? sniff() : img.addEventListener('load', sniff, { once: true });
  walker.onclick = roar;
  app.querySelector('.roar-btn').onclick = roar;
  app.querySelector('.read-btn').onclick = (e) =>
    speak([d.name + '.', `${t().meaning}: ${L(d.meaning)}.`, L(d.desc), t().didYouKnow, ...L(d.facts)].join(' '), e.currentTarget);
}

// ---------- router ----------
function route(scroll = true) {
  window.speechSynthesis?.cancel();
  const [, page, slug] = location.hash.split('/');
  if (page === 'dino') detail(DINOS.find((d) => d.slug === slug) ?? DINOS[0]);
  else home();
  if (scroll) scrollTo(0, 0);
}

addEventListener('hashchange', () => route());
header();
route();
