import { DINOS, UI } from './data.js';
import { dinoSVG } from './dinos.js';

const app = document.getElementById('app');
const topbar = document.querySelector('.topbar');
const MAX_LEN = Math.max(...DINOS.map((d) => d.len));
const KID_LEN = 1.3;

let lang = 'id';
try { lang = localStorage.getItem('lang') || 'id'; } catch {}
const t = () => UI[lang];
const L = (obj) => obj[lang];
const shuffle = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((p) => p[1]);

// ---------- sound ----------
const clips = {};
const VOLUME = { 'roar-big': 0.7 }; // roar-big is mastered hotter than the rest
function playDino(d) {
  const a = (clips[d.sound] ??= new Audio(`sounds/${d.sound}.mp3`));
  a.preservesPitch = false;
  a.playbackRate = d.rate;
  a.volume = VOLUME[d.sound] ?? 1;
  a.currentTime = 0;
  a.play().catch(() => {});
}

let ctx;
function chime(ok) {
  ctx ??= new AudioContext();
  (ok ? [523, 659, 784] : [220, 165]).forEach((f, i) => {
    const osc = ctx.createOscillator(), gain = ctx.createGain(), t0 = ctx.currentTime + i * 0.12;
    osc.type = ok ? 'triangle' : 'square';
    osc.frequency.value = f;
    gain.gain.setValueAtTime(0.15, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.3);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0); osc.stop(t0 + 0.32);
  });
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

function confetti() {
  const colors = ['#ff8a3d', '#ffd84a', '#3bb54a', '#2a7fff', '#e06a7a', '#9c7ad1'];
  for (let i = 0; i < 40; i++) {
    const c = document.createElement('span');
    c.className = 'confetti';
    c.style.cssText = `left:${Math.random() * 100}vw;background:${colors[i % colors.length]};animation-delay:${Math.random() * 0.5}s`;
    document.body.append(c);
    setTimeout(() => c.remove(), 3000);
  }
}

// ---------- views ----------
function header() {
  topbar.innerHTML = `<a href="#/" class="logo">🦖 ${t().title}</a>
    <nav><a class="btn" href="#/quiz">❓ ${t().quiz}</a>
    <button class="btn lang" aria-label="${t().langLabel}">🌐 ${t().lang}</button></nav>`;
  topbar.querySelector('.lang').onclick = () => {
    lang = lang === 'id' ? 'en' : 'id';
    try { localStorage.setItem('lang', lang); } catch {}
    header();
    route();
  };
  document.documentElement.lang = lang;
}

function home() {
  app.innerHTML = `<p class="subtitle">${t().subtitle}</p>
    <div class="grid">${DINOS.map((d, i) => `
      <a class="card" href="#/dino/${d.slug}" style="--i:${i};--c:${d.colors[0]}">
        ${dinoSVG(d)}<span class="card-name">${d.name}</span><span class="card-meaning">${L(d.meaning)}</span>
      </a>`).join('')}</div>`;
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
      <button class="walker" aria-label="${t().roar}"><span class="flip">${dinoSVG(d, 'walking')}</span></button>
      <span class="tap-hint">👆 ${t().tap}</span>
    </section>
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
      <div class="size-row">${dinoSVG(d)}<div class="bar" style="--w:${(d.len / MAX_LEN) * 100}%;--c:${d.colors[0]}"></div></div>
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

  const walker = app.querySelector('.walker'), svg = walker.querySelector('svg');
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
  walker.onclick = roar;
  app.querySelector('.roar-btn').onclick = roar;
  app.querySelector('.read-btn').onclick = (e) =>
    speak([d.name + '.', `${t().meaning}: ${L(d.meaning)}.`, L(d.desc), t().didYouKnow, ...L(d.facts)].join(' '), e.currentTarget);
}

// ---------- quiz ----------
function makeQuiz(dinos = DINOS) {
  const pick = (n, pool) => shuffle(pool).slice(0, n);
  const qs = [];
  for (const d of pick(3, dinos)) qs.push({ type: 'who', dino: d, options: shuffle([d, ...pick(2, dinos.filter((x) => x !== d))]), answer: d });
  for (const d of pick(2, dinos)) qs.push({ type: 'food', dino: d, options: ['plant', 'meat'], answer: d.diet === 'plant' ? 'plant' : 'meat' });
  // Length question: real dinos only (pteranodon's number is a wingspan), at least 3 m apart so it's not a trick.
  const real = dinos.filter((d) => !d.notDino);
  const [a] = pick(1, real);
  const [b] = pick(1, real.filter((x) => Math.abs(x.len - a.len) >= 3));
  qs.push({ type: 'bigger', options: shuffle([a, b]), answer: a.len > b.len ? a : b });
  return shuffle(qs);
}

function quiz() {
  const qs = makeQuiz();
  let n = 0, score = 0;
  const show = () => {
    if (n === qs.length) {
      app.innerHTML = `<div class="quiz"><div class="stars">${'⭐'.repeat(score) || '🦕'}</div>
        <h2 class="question">${t().score(score, qs.length)}</h2>
        <p><button class="btn big again">🔁 ${t().again}</button> <a class="btn" href="#/">🏠 ${t().home}</a></p></div>`;
      app.querySelector('.again').onclick = quiz;
      if (score >= qs.length - 1) confetti();
      return;
    }
    const q = qs[n];
    const title = { who: t().qWho, food: q.dino && t().qFood(q.dino.name), bigger: t().qBigger }[q.type];
    const art = q.type === 'bigger' ? '' : `<div class="q-art ${q.type === 'who' ? 'silhouette' : ''}">${dinoSVG(q.dino, 'walking')}</div>`;
    const label = (o) => q.type === 'food' ? (o === 'plant' ? t().plants : t().animals)
      : q.type === 'bigger' ? `${dinoSVG(o)}${o.name}` : o.name;
    app.innerHTML = `<div class="quiz">
      <div class="dots">${qs.map((_, j) => `<span class="${j < n ? 'done' : ''}"></span>`).join('')}</div>
      <h2 class="question">${title}</h2>${art}
      <div class="options">${q.options.map((o, j) => `<button class="opt" data-j="${j}" style="--i:${j}">${label(o)}</button>`).join('')}</div>
      <p class="feedback" aria-live="polite"></p><p class="next-wrap"></p></div>`;
    app.querySelectorAll('.opt').forEach((btn) => btn.onclick = () => {
      const chosen = q.options[btn.dataset.j], ok = chosen === q.answer;
      app.querySelectorAll('.opt').forEach((b) => {
        b.disabled = true;
        if (q.options[b.dataset.j] === q.answer) b.classList.add('right');
      });
      if (!ok) btn.classList.add('wrong');
      app.querySelector('.silhouette')?.classList.remove('silhouette');
      chime(ok);
      if (ok) { score++; confetti(); }
      if (q.dino) setTimeout(() => playDino(q.dino), 400);
      app.querySelector('.feedback').textContent = ok ? `🎉 ${t().correct}` : `${t().wrong} ${q.type === 'food' ? label(q.answer) : q.answer.name}`;
      const nextBtn = Object.assign(document.createElement('button'), { className: 'btn big', textContent: t().nextQ });
      nextBtn.onclick = () => { n++; show(); };
      app.querySelector('.next-wrap').append(nextBtn);
      nextBtn.focus();
    });
  };
  show();
}

// ---------- router ----------
function route() {
  window.speechSynthesis?.cancel();
  const [, page, slug] = location.hash.split('/');
  if (page === 'dino') detail(DINOS.find((d) => d.slug === slug) ?? DINOS[0]);
  else if (page === 'quiz') quiz();
  else home();
  scrollTo(0, 0);
}

addEventListener('hashchange', route);
header();
route();
