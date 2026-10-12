// Cartoon dinos as inline SVG (viewBox 200x140, facing right, ground at y≈128).
// Parts carry classes (.tail .head .jaw .leg-a .leg-b .wing-l .wing-r) that style.css animates;
// each part's style sets its pivot point in viewBox units.
// Each template takes ([main, dark, accent], opts); opts are per-dino variations (see data/*.js).

const o = (x, y) => `style="transform-origin:${x}px ${y}px"`;

const eye = (x, y, r = 5) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/><circle cx="${x + r * 0.24}" cy="${y}" r="${r * 0.56}" fill="#222"/><circle cx="${x + r * 0.4}" cy="${y - r * 0.2}" r="${r * 0.2}" fill="#fff"/>`;

// A pillar leg hanging from hip (x,y), with a foot.
const leg = (x, y, len, w, cls, fill) =>
  `<g class="${cls}" ${o(x, y)}><path d="M${x - w} ${y} Q${x - w - 2} ${y + len * 0.6} ${x - w * 0.6} ${y + len} L${x + w * 0.9} ${y + len} Q${x + w} ${y + len * 0.5} ${x + w} ${y} Z" fill="${fill}"/><ellipse cx="${x + 2}" cy="${y + len}" rx="${w + 2}" ry="3" fill="${fill}"/></g>`;

const teeth = (x1, x2, y, down = true) => {
  let d = `M${x1} ${y}`;
  for (let x = x1; x < x2; x += 6) d += ` l3 ${down ? 4 : -4} l3 ${down ? -4 : 4}`;
  return `<path d="${d}" fill="#fff"/>`;
};

const flipper = (cls, x, y, d, fill) => `<g class="${cls}" ${o(x, y)}><path d="${d}" fill="${fill}"/></g>`;

function theropod([c, d, b], v = {}) {
  const sail = v.sail ? `<path d="M68 58 Q74 8 100 12 Q120 10 124 54 Z" fill="${b}" stroke="${d}" stroke-width="2"/><path d="M80 52 L84 18 M92 50 L96 14 M104 50 L108 16 M114 52 L116 26" stroke="${d}" stroke-width="2"/>` : '';
  const hump = v.hump ? `<path d="M80 54 Q94 26 108 52 Z" fill="${c}" stroke="${d}" stroke-width="2"/>` : '';
  const feathers = v.feathers ? `<path d="M8 64 l-6 -6 M10 68 l-8 0 M12 72 l-6 6" stroke="${d}" stroke-width="3" stroke-linecap="round"/>` : '';
  const crest = {
    single: `<path d="M130 36 Q146 14 162 32 Z" fill="${b}" stroke="${d}" stroke-width="1.5"/>`,
    double: `<path d="M130 36 Q136 10 154 30 Z" fill="${b}" stroke="${d}" stroke-width="1.5"/><path d="M138 36 Q148 12 166 32 Z" fill="${b}" stroke="${d}" stroke-width="1.5"/>`,
    fan: `<path d="M136 34 L138 16 L144 24 L148 12 L153 24 L158 16 L160 34 Z" fill="${b}" stroke="${d}" stroke-width="1.5"/>`,
  }[v.crest] ?? '';
  const horns = v.horns ? `<path d="M140 32 L142 14 L150 32 Z M146 32 L152 16 L156 33 Z" fill="${b}" stroke="${d}" stroke-width="1.5"/>` : '';
  const skull = v.snout
    ? `<path d="M126 38 Q140 30 188 40 Q192 44 188 47 L150 49 Q136 56 128 54 Z" fill="${c}"/>${teeth(152, 184, 47)}`
    : `<path d="M126 36 Q150 26 176 34 Q184 38 182 46 L150 50 Q136 58 128 54 Z" fill="${c}"/>${teeth(152, 176, 47)}`;
  const jaw = v.snout ? `M140 48 L186 47 Q182 54 150 57 Q140 57 140 48 Z` : `M140 49 L180 47 Q178 58 150 60 Q140 60 140 49 Z`;
  const armPath = v.arms === 'tiny' ? 'M122 80 q4 3 4 7' : v.arms === 'long' || v.feathers ? 'M120 76 q12 6 12 16' : 'M122 78 q8 6 6 12';
  const wings = v.wings ? `<path d="M118 74 L146 88 L136 96 L124 98 Z" fill="${b}" stroke="${d}" stroke-width="1.5"/>` : '';
  const claws = v.feathers || v.arms === 'long' ? `<path d="M122 80 l-4 10 M127 84 l-4 9" stroke="${d}" stroke-width="2"/>` : '';
  return `${sail}${hump}
  <g class="tail" ${o(72, 68)}><path d="M74 58 Q36 56 4 66 Q38 76 76 84 Z" fill="${c}"/>${feathers}</g>
  ${leg(80, 80, 48, 9, 'leg-b', d)}
  <ellipse cx="95" cy="70" rx="34" ry="22" fill="${c}"/>
  <ellipse cx="100" cy="80" rx="22" ry="9" fill="${b}"/>
  ${leg(102, 82, 46, 10, 'leg-a', c)}
  ${wings}<path class="arm" d="${armPath}" stroke="${d}" stroke-width="${v.feathers ? 5 : 4}" stroke-linecap="round" fill="none"/>${claws}
  <g class="head" ${o(118, 66)}>
    <path d="M108 58 Q122 40 136 42 L142 68 Q128 78 114 78 Z" fill="${c}"/>
    ${crest}
    <g class="jaw" ${o(142, 50)}><path d="${jaw}" fill="${d}"/>${teeth(152, 174, 51, false)}</g>
    ${skull}${horns}
    ${eye(148, 38)}<circle cx="${v.snout ? 184 : 176}" cy="40" r="1.6" fill="${d}"/>
  </g>`;
}

function ornitho([c, d, b], v = {}) {
  const claws = v.claws ? `<path d="M122 96 l4 18 M126 94 l10 16 M119 96 l-2 18" stroke="${b}" stroke-width="3" stroke-linecap="round"/>` : '';
  const hump = v.hump ? `<path d="M76 58 Q92 24 108 54 Z" fill="${c}" stroke="${d}" stroke-width="2"/>` : '';
  const crest = v.crest ? `<path d="M134 18 Q138 -2 152 12 Z" fill="${b}" stroke="${d}" stroke-width="1.5"/>` : '';
  return `${hump}
  <g class="tail" ${o(70, 68)}><path d="M70 62 Q40 56 12 56 Q40 74 72 80 Z" fill="${c}"/><path d="M14 56 l-8 -6 M12 60 l-10 0 M14 64 l-8 6" stroke="${d}" stroke-width="3" stroke-linecap="round"/></g>
  ${leg(82, 80, 48, 6, 'leg-b', d)}
  <ellipse cx="92" cy="70" rx="28" ry="18" fill="${c}"/>
  <ellipse cx="96" cy="78" rx="18" ry="7" fill="${b}"/>
  ${leg(100, 82, 46, 7, 'leg-a', c)}
  <path class="arm" d="M112 76 q12 6 12 20" stroke="${d}" stroke-width="5" stroke-linecap="round" fill="none"/>${claws}
  <g class="head" ${o(110, 64)}>
    <path d="M104 62 Q120 40 132 22 L142 24 Q130 52 116 76 Z" fill="${c}"/>
    ${crest}
    <ellipse cx="142" cy="22" rx="12" ry="9" fill="${c}"/>
    <g class="jaw" ${o(150, 25)}><path d="M150 24 L166 26 L150 30 Z" fill="${d}"/></g>
    <path d="M150 17 L168 24 L150 25 Z" fill="${b}"/>
    ${eye(142, 19, 4.5)}
  </g>`;
}

function sauropod([c, d, b], v = {}) {
  const level = v.neck === 'level';
  const neck = level
    ? `<path d="M104 64 Q140 50 168 52 L170 66 Q140 70 116 88 Z" fill="${c}"/><ellipse cx="178" cy="58" rx="14" ry="8" fill="${c}"/>${eye(180, 55)}<path d="M184 63 q5 0 8 -3" stroke="${d}" stroke-width="2" fill="none"/>`
    : `<path d="M100 64 Q132 52 140 18 L156 20 Q150 62 120 88 Z" fill="${c}"/><ellipse cx="160" cy="18" rx="15" ry="9" fill="${c}"/><path d="M148 10 Q156 2 164 10" fill="${d}"/>${eye(160, 15)}<path d="M166 24 q6 0 9 -3" stroke="${d}" stroke-width="2" fill="none"/>`;
  // Upright-neck spikes sit on points along the neck's back curve, pointing up-left.
  const spikes = v.spikes
    ? (level
      ? [112, 124, 136, 148, 160].map((x, i) => `<path d="M${x} ${58 - i * 0.6} l2 -16 l3 15 Z" fill="${b}"/>`)
      : [[110, 60], [116, 56], [122, 51], [127, 45], [131, 39], [134, 32]].map(([x, y]) => `<path d="M${x - 2} ${y + 2} L${x - 13} ${y - 7} L${x + 4} ${y - 3} Z" fill="${b}"/>`)).join('')
    : '';
  const bumps = v.bumps ? [[70, 62], [84, 58], [98, 60], [78, 72], [92, 70]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="${b}" stroke="${d}"/>`).join('') : '';
  return `
  <g class="tail" ${o(50, 74)}><path d="${level ? 'M52 66 Q20 66 0 80 Q24 82 54 86 Z' : 'M52 66 Q20 74 2 96 Q24 90 54 86 Z'}" fill="${c}"/></g>
  ${leg(60, 86, 42, 8, 'leg-b', d)}${leg(112, 82, 46, 8, 'leg-a', d)}
  <ellipse cx="86" cy="78" rx="40" ry="24" fill="${c}"/>
  <ellipse cx="88" cy="90" rx="28" ry="9" fill="${b}"/>${bumps}
  ${leg(72, 88, 40, 9, 'leg-a', c)}${leg(122, 84, 44, 9, 'leg-b', c)}
  <g class="head" ${o(110, 70)}>${spikes}${neck}</g>`;
}

function ceratopsian([c, d, b], v = {}) {
  const bone = '#f5ecd2';
  const horns = v.horns ?? 'three';
  const frill = {
    small: `<path d="M118 60 Q120 44 136 46 Q140 66 130 84 Q118 76 118 60 Z" fill="${b}" stroke="${d}" stroke-width="3"/>`,
    big: `<path d="M102 50 Q104 12 144 28 Q148 70 130 100 Q104 88 102 50 Z" fill="${b}" stroke="${d}" stroke-width="3"/>`,
  }[v.frill] ?? `<path d="M110 52 Q116 26 140 36 Q144 70 130 96 Q112 86 110 52 Z" fill="${b}" stroke="${d}" stroke-width="3"/>`;
  const spikes = v.spikes ? `<path d="M114 44 L100 16 L122 36 Z M126 34 L124 4 L136 32 Z M138 36 L150 10 L144 42 Z" fill="${bone}" stroke="${d}" stroke-width="1"/>` : '';
  const brow = `<path d="M138 62 L168 32 L148 66 Z" fill="${bone}"/><path d="M146 64 L174 40 L152 68 Z" fill="${bone}" opacity=".85"/>`;
  const nose = horns === 'nose'
    ? `<path d="M158 70 L170 40 L170 72 Z" fill="${bone}"/>`
    : `<path d="M162 70 L168 56 L168 72 Z" fill="${bone}"/>`;
  const hornSvg = { three: brow + nose, nose, brow, boss: `<ellipse cx="160" cy="66" rx="9" ry="5" fill="${bone}" stroke="${d}"/>`, none: '' }[horns] ?? brow + nose;
  return `
  <g class="tail" ${o(56, 80)}><path d="M58 70 Q26 76 8 92 Q30 94 60 92 Z" fill="${c}"/></g>
  ${leg(66, 92, 34, 8, 'leg-b', d)}${leg(110, 94, 32, 8, 'leg-a', d)}
  <ellipse cx="88" cy="82" rx="40" ry="24" fill="${c}"/>
  <ellipse cx="90" cy="94" rx="28" ry="8" fill="${b}"/>
  ${leg(78, 94, 32, 9, 'leg-a', c)}${leg(120, 94, 32, 9, 'leg-b', c)}
  <g class="head" ${o(118, 80)}>
    ${spikes}${frill}
    <path d="M126 62 Q150 52 166 70 Q170 82 158 88 L134 92 Q122 80 126 62 Z" fill="${c}"/>
    <g class="jaw" ${o(150, 82)}><path d="M150 84 L172 82 L160 92 Z" fill="${d}"/></g>
    <path d="M160 68 L180 76 L162 84 Z" fill="${d}"/>
    ${hornSvg}
    ${eye(146, 70)}
  </g>`;
}

function stego([c, d, b], v = {}) {
  const plates = [[62, 18], [74, 26], [88, 32], [102, 30], [116, 22], [128, 14]]
    .map(([x, h]) => `<path d="M${x - 7} ${70 - h * 0.1} L${x} ${64 - h} L${x + 7} ${70 - h * 0.1} Z" fill="${b}" stroke="${d}" stroke-width="2"/>`).join('');
  const spikes = v.spikes ? `<path d="M56 74 L44 46 L64 70 Z M70 70 L66 40 L78 68 Z M118 88 L136 76 L124 94 Z" fill="${b}" stroke="${d}" stroke-width="1.5"/>` : '';
  return `${plates}${spikes}
  <g class="tail" ${o(60, 84)}>
    <path d="M60 78 Q30 76 6 64 Q28 88 62 94 Z" fill="${c}"/>
    <path d="M14 66 L2 50 L22 64 Z M24 70 L18 52 L30 70 Z" fill="${b}"/>
  </g>
  ${leg(70, 90, 38, 9, 'leg-b', d)}${leg(118, 96, 32, 7, 'leg-a', d)}
  <ellipse cx="95" cy="84" rx="42" ry="24" fill="${c}"/>
  <ellipse cx="96" cy="98" rx="30" ry="7" fill="${b}" opacity=".6"/>
  ${leg(82, 92, 36, 10, 'leg-a', c)}${leg(126, 96, 32, 8, 'leg-b', c)}
  <g class="head" ${o(132, 92)}>
    <path d="M128 84 Q146 92 156 100 L152 110 Q136 106 124 98 Z" fill="${c}"/>
    <ellipse cx="160" cy="104" rx="12" ry="7" fill="${c}"/>
    <g class="jaw" ${o(156, 108)}><path d="M154 108 L172 106 L162 113 Z" fill="${d}"/></g>
    ${eye(161, 101)}
  </g>`;
}

function ankylo([c, d, b], v = {}) {
  const studs = [[62, 82], [78, 76], [94, 74], [110, 76], [124, 82], [70, 92], [86, 88], [102, 88], [118, 92]]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${b}" stroke="${d}" stroke-width="1.5"/>`).join('');
  const spikes = [52, 76, 100, 124].map((x) => `<path d="M${x - 6} 96 L${x} 108 L${x + 6} 96 Z" fill="${b}"/>`).join('')
    + (v.spikes ? `<path d="M118 80 L140 62 L130 86 Z M104 76 L114 56 L114 78 Z" fill="${b}" stroke="${d}" stroke-width="1.5"/>` : '');
  const club = v.club === false ? '' : `<ellipse cx="12" cy="94" rx="11" ry="9" fill="${b}" stroke="${d}" stroke-width="2"/>`;
  return `
  <g class="tail" ${o(52, 92)}>
    <path d="M52 86 Q28 88 ${club ? 14 : 8} 92 Q28 98 52 100 Z" fill="${c}"/>${club}
  </g>
  ${leg(64, 100, 26, 8, 'leg-b', d)}${leg(118, 100, 26, 8, 'leg-a', d)}
  ${spikes}
  <ellipse cx="92" cy="88" rx="46" ry="20" fill="${c}"/>
  ${studs}
  ${leg(76, 102, 24, 9, 'leg-a', c)}${leg(128, 102, 24, 9, 'leg-b', c)}
  <g class="head" ${o(134, 92)}>
    <path d="M132 80 Q160 76 170 92 Q164 104 136 104 Z" fill="${c}"/>
    <path d="M138 80 L132 70 L146 79 Z M140 102 L134 110 L148 103 Z" fill="${b}"/>
    <g class="jaw" ${o(156, 98)}><path d="M150 98 L170 94 L160 104 Z" fill="${d}"/></g>
    ${eye(152, 88)}
  </g>`;
}

function hadrosaur([c, d, b], v = {}) {
  const crest = {
    tube: `<path d="M138 44 Q116 20 92 14 Q88 20 94 24 Q118 30 142 50 Z" fill="${b}" stroke="${d}" stroke-width="2"/>`,
    helmet: `<path d="M134 42 Q136 12 158 22 Q162 36 148 46 Z" fill="${b}" stroke="${d}" stroke-width="2"/>`,
    spike: `<path d="M134 40 Q140 20 156 26 L148 42 Z" fill="${b}" stroke="${d}" stroke-width="2"/><path d="M136 36 L116 24 L138 42 Z" fill="${b}" stroke="${d}" stroke-width="1.5"/>`,
  }[v.crest ?? 'tube'] ?? '';
  const sail = v.sail ? `<path d="M62 62 Q74 26 100 28 Q118 32 118 58 Z" fill="${b}" stroke="${d}" stroke-width="2"/>` : '';
  return `${sail}
  <g class="tail" ${o(62, 74)}><path d="M64 64 Q30 60 4 72 Q34 82 66 86 Z" fill="${c}"/></g>
  ${leg(78, 82, 46, 9, 'leg-b', d)}
  <ellipse cx="92" cy="74" rx="36" ry="22" fill="${c}"/>
  <ellipse cx="96" cy="84" rx="24" ry="8" fill="${b}"/>
  ${leg(100, 84, 44, 10, 'leg-a', c)}
  <path class="arm" d="M118 82 q6 10 4 18" stroke="${d}" stroke-width="5" stroke-linecap="round" fill="none"/>
  <g class="head" ${o(118, 64)}>
    <path d="M108 60 Q122 44 138 44 L142 62 Q128 74 114 78 Z" fill="${c}"/>
    ${crest}
    <path d="M132 40 Q156 34 172 46 Q176 54 168 56 L142 58 Q130 52 132 40 Z" fill="${c}"/>
    <g class="jaw" ${o(160, 54)}><path d="M156 54 L182 54 L168 60 Z" fill="${d}"/></g>
    <path d="M164 46 L182 50 L168 54 Z" fill="${d}"/>
    ${eye(150, 46)}
  </g>`;
}

function pachy([c, d, b]) {
  const knobs = [[130, 52], [131, 42], [136, 33], [144, 29]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="${d}"/>`).join('');
  return `
  <g class="tail" ${o(64, 74)}><path d="M66 64 Q30 62 4 72 Q34 82 68 86 Z" fill="${c}"/></g>
  ${leg(80, 82, 46, 9, 'leg-b', d)}
  <ellipse cx="92" cy="74" rx="34" ry="22" fill="${c}"/>
  <ellipse cx="96" cy="84" rx="22" ry="8" fill="${b}"/>
  ${leg(100, 84, 44, 10, 'leg-a', c)}
  <path class="arm" d="M116 82 q6 6 5 12" stroke="${d}" stroke-width="4" stroke-linecap="round" fill="none"/>
  <g class="head" ${o(116, 64)}>
    <path d="M108 60 Q120 46 134 46 L138 64 Q126 74 114 78 Z" fill="${c}"/>
    ${knobs}
    <ellipse cx="148" cy="44" rx="16" ry="15" fill="${b}" stroke="${d}" stroke-width="2"/>
    <path d="M134 48 Q152 50 168 56 Q168 64 160 66 L138 66 Z" fill="${c}"/>
    <g class="jaw" ${o(148, 64)}><path d="M146 63 L166 61 L156 68 Z" fill="${d}"/></g>
    ${eye(150, 54, 4.5)}
  </g>`;
}

function pterosaur([c, d, b], v = {}) {
  const crest = { back: `<path d="M100 48 L72 30 L104 46 Z" fill="${b}"/>`, tall: `<path d="M98 50 Q84 8 122 18 Q114 40 106 48 Z" fill="${b}" stroke="${d}" stroke-width="1.5"/>` }[v.crest ?? 'back'] ?? '';
  const tail = v.tail ? `<path d="M100 86 Q98 108 92 122" stroke="${d}" stroke-width="2.5" fill="none"/><path d="M92 120 l-7 6 l7 7 l7 -7 Z" fill="${b}"/>` : '';
  const teeth = v.teeth ? `<path d="M118 58 l2 4 l2 -4 l2 4 l2 -4 l2 4 l2 -4 l2 4 l2 -4" stroke="#fff" stroke-width="1.2" fill="none"/>` : '';
  return `${tail}
  <g class="wing-l" ${o(96, 68)}><path d="M98 64 Q60 36 4 56 Q50 64 94 80 Z" fill="${c}" stroke="${d}" stroke-width="2"/></g>
  <g class="wing-r" ${o(104, 68)}><path d="M102 64 Q140 36 196 56 Q150 64 106 80 Z" fill="${c}" stroke="${d}" stroke-width="2"/></g>
  <ellipse cx="100" cy="72" rx="12" ry="16" fill="${d}"/>
  <path d="M94 86 l-4 8 M106 86 l4 8" stroke="${d}" stroke-width="3" stroke-linecap="round"/>
  <g class="head" ${o(102, 58)}>
    ${crest}
    <circle cx="104" cy="54" r="10" fill="${c}"/>
    <g class="jaw" ${o(112, 56)}><path d="M110 56 L146 62 L112 60 Z" fill="${b}"/></g>
    <path d="M110 50 L150 58 L110 57 Z" fill="${b}"/>${teeth}
    ${eye(106, 51)}
  </g>`;
}

function mosasaur([c, d, b], v = {}) {
  const dorsal = v.dorsal ? `<path d="M88 56 Q98 28 116 54 Z" fill="${d}"/>` : '';
  return `${dorsal}
  <g class="tail" ${o(42, 72)}><path d="M44 70 Q22 68 4 48 Q14 72 6 96 Q24 80 44 78 Z" fill="${d}"/></g>
  ${flipper('leg-b', 72, 80, 'M70 80 Q74 98 60 104 Q62 90 66 80 Z', d)}
  <path d="M34 72 Q80 46 140 56 Q170 58 186 68 L140 72 Q90 88 34 78 Z" fill="${c}"/>
  <path d="M50 78 Q90 84 138 72 L140 76 Q90 90 50 80 Z" fill="${b}"/>
  ${flipper('leg-a', 122, 76, 'M120 76 Q128 98 112 106 Q112 90 116 76 Z', d)}
  <g class="jaw" ${o(140, 72)}><path d="M138 72 L182 70 Q172 82 142 80 Z" fill="${d}"/>${teeth(146, 176, 71, false)}</g>
  ${teeth(146, 180, 69)}
  ${eye(158, 62)}
  <circle class="bubble" cx="190" cy="60" r="3" fill="none" stroke="#fff" stroke-width="1.5"/>
  <circle class="bubble b2" cx="186" cy="54" r="2" fill="none" stroke="#fff" stroke-width="1.5"/>`;
}

function plesiosaur([c, d, b], v = {}) {
  const head = v.neck === 'short'
    ? `<path d="M106 64 Q150 54 184 64 Q188 70 182 72 L112 84 Z" fill="${c}"/>${teeth(140, 180, 70)}
       <g class="jaw" ${o(130, 74)}><path d="M126 74 L182 72 Q170 88 132 86 Z" fill="${d}"/>${teeth(140, 176, 74, false)}</g>${eye(150, 64)}`
    : `<path d="M104 66 Q140 50 158 28 L168 34 Q150 62 112 82 Z" fill="${c}"/><ellipse cx="170" cy="30" rx="13" ry="8" fill="${c}"/>
       <g class="jaw" ${o(176, 33)}><path d="M174 32 L190 31 L178 38 Z" fill="${d}"/></g>${teeth(176, 188, 30)}${eye(170, 27, 4)}`;
  return `
  <g class="tail" ${o(46, 74)}><path d="M48 70 Q26 72 10 80 Q28 82 48 80 Z" fill="${c}"/></g>
  ${flipper('leg-a', 62, 82, 'M62 80 Q52 98 34 106 Q46 92 56 80 Z', d)}${flipper('leg-b', 104, 82, 'M104 80 Q104 100 90 110 Q94 94 98 80 Z', d)}
  <ellipse cx="80" cy="74" rx="36" ry="18" fill="${c}"/>
  <ellipse cx="82" cy="82" rx="26" ry="7" fill="${b}"/>
  ${flipper('leg-b', 70, 84, 'M70 84 Q62 104 46 112 Q56 98 64 84 Z', c)}${flipper('leg-a', 108, 84, 'M108 84 Q112 106 98 116 Q100 100 102 84 Z', c)}
  <g class="head" ${o(108, 70)}>${head}</g>
  <circle class="bubble" cx="${v.neck === 'short' ? 190 : 194}" cy="${v.neck === 'short' ? 56 : 20}" r="3" fill="none" stroke="#fff" stroke-width="1.5"/>`;
}

function croc([c, d, b], v = {}) {
  const sail = v.sail ? `<path d="M58 88 Q66 30 90 26 Q112 30 116 88 Z" fill="${b}" stroke="${d}" stroke-width="2"/><path d="M70 84 L74 40 M82 84 L86 30 M94 84 L96 30 M106 84 L106 44" stroke="${d}" stroke-width="2"/>` : '';
  const scutes = v.sail ? '' : [62, 72, 82, 92, 102, 112].map((x) => `<path d="M${x - 4} 80 l4 -6 l4 6 Z" fill="${d}"/>`).join('');
  const head = v.neck === 'long'
    ? `<path d="M114 86 Q150 70 168 50 L176 56 Q156 82 120 98 Z" fill="${c}"/><ellipse cx="180" cy="50" rx="11" ry="6" fill="${c}"/>
       <g class="jaw" ${o(182, 53)}><path d="M180 52 L194 52 L184 58 Z" fill="${d}"/></g>${eye(180, 47, 3.5)}`
    : v.sail
      ? `<path d="M114 80 Q140 70 168 80 Q170 90 162 94 L118 98 Z" fill="${c}"/>${teeth(140, 166, 92)}
         <g class="jaw" ${o(124, 94)}><path d="M122 94 L166 93 Q156 104 126 102 Z" fill="${d}"/></g>${eye(140, 82)}`
      : `<path d="M116 82 Q150 78 188 86 Q190 90 186 92 L120 96 Z" fill="${c}"/>${teeth(142, 184, 91)}
         <g class="jaw" ${o(124, 94)}><path d="M122 94 L186 92 Q170 102 126 102 Z" fill="${d}"/></g><circle cx="136" cy="82" r="6" fill="${c}"/>${eye(136, 81, 4)}`;
  return `${sail}
  <g class="tail" ${o(60, 90)}><path d="M62 82 Q30 84 4 96 Q34 102 64 100 Z" fill="${c}"/></g>
  ${leg(62, 96, 24, 6, 'leg-b', d)}${leg(108, 96, 24, 6, 'leg-a', d)}
  <ellipse cx="88" cy="90" rx="34" ry="13" fill="${c}"/>${scutes}
  <ellipse cx="90" cy="98" rx="24" ry="5" fill="${b}"/>
  ${leg(72, 98, 22, 7, 'leg-a', c)}${leg(116, 98, 22, 7, 'leg-b', c)}
  <g class="head" ${o(116, 90)}>${head}</g>`;
}

function turtle([c, d, b]) {
  const scutes = [[80, 66], [100, 62], [120, 66], [90, 80], [110, 80]].map(([x, y]) => `<path d="M${x - 8} ${y} l4 -7 h8 l4 7 l-4 7 h-8 Z" fill="none" stroke="${b}" stroke-width="2"/>`).join('');
  return `
  ${flipper('leg-b', 66, 82, 'M66 80 Q50 96 38 100 Q50 88 60 78 Z', d)}
  <path d="M56 76 l-12 6 l12 2 Z" fill="${d}"/>
  <ellipse cx="96" cy="72" rx="44" ry="22" fill="${c}"/>${scutes}
  <path d="M54 80 Q96 96 138 80" stroke="${b}" stroke-width="4" fill="none"/>
  ${flipper('leg-a', 120, 80, 'M118 80 Q140 98 160 112 Q134 106 112 88 Z', d)}
  <g class="head" ${o(136, 72)}>
    <path d="M132 66 Q150 58 168 64 Q172 72 164 78 L136 80 Z" fill="${d}"/>
    <path d="M166 66 L174 72 L164 76 Z" fill="${b}"/>
    <g class="jaw" ${o(160, 76)}><path d="M156 76 L168 76 L160 80 Z" fill="${b}"/></g>
    ${eye(154, 68, 4)}
  </g>
  <circle class="bubble" cx="184" cy="58" r="3" fill="none" stroke="#fff" stroke-width="1.5"/>`;
}

function fish([c, d, b]) {
  return `
  <path d="M78 48 Q90 24 106 46 Z" fill="${d}"/>
  <g class="tail" ${o(32, 70)}><path d="M34 70 L4 42 L14 70 L4 98 Z" fill="${d}"/></g>
  <path d="M24 70 Q60 40 130 46 Q170 50 186 70 Q170 92 130 94 Q60 100 24 70 Z" fill="${c}"/>
  <path d="M120 47 Q168 50 186 70 Q170 92 126 94 Q132 70 120 47 Z" fill="${b}" stroke="${d}" stroke-width="2"/>
  <path d="M60 76 Q100 86 124 84" stroke="${d}" stroke-width="2" fill="none" opacity=".5"/>
  ${flipper('leg-a', 108, 86, 'M108 86 Q116 104 98 108 Q102 96 102 86 Z', d)}
  <g class="jaw" ${o(150, 76)}><path d="M150 74 L186 72 L180 88 Q160 90 150 82 Z" fill="${d}"/></g>
  <path d="M168 66 L186 70 L172 74 Z" fill="#f5ecd2"/>
  ${eye(152, 60)}
  <circle class="bubble" cx="192" cy="56" r="3" fill="none" stroke="#fff" stroke-width="1.5"/>`;
}

const KINDS = {
  theropod,
  raptor: (c, v) => theropod(c, { ...v, feathers: true }),
  spino: (c, v) => theropod(c, { sail: true, snout: true, ...v }),
  synapsid: (c, v) => croc(c, { sail: true, ...v }),
  ornitho, sauropod, ceratopsian, stego, ankylo, hadrosaur, pachy, pterosaur, mosasaur, plesiosaur, croc, turtle, fish,
};
export const KIND_NAMES = Object.keys(KINDS);

export function dinoSVG(dino, extraClass = '') {
  return `<svg class="dino ${dino.kind} ${extraClass}" viewBox="0 0 200 140" role="img" aria-label="${dino.name}">${KINDS[dino.kind](dino.colors, dino.opts ?? {})}</svg>`;
}
