// Cartoon dinos as inline SVG (viewBox 200x140, facing right, ground at y≈128).
// Parts carry classes (.tail .head .jaw .leg-a .leg-b .wing-l .wing-r) that style.css animates;
// each part's style sets its pivot point in viewBox units.

const o = (x, y) => `style="transform-origin:${x}px ${y}px"`;

const eye = (x, y) =>
  `<circle cx="${x}" cy="${y}" r="5" fill="#fff"/><circle cx="${x + 1.2}" cy="${y}" r="2.8" fill="#222"/><circle cx="${x + 2}" cy="${y - 1}" r="1" fill="#fff"/>`;

// A pillar leg hanging from hip (x,y), with a foot.
const leg = (x, y, len, w, cls, fill) =>
  `<g class="${cls}" ${o(x, y)}><path d="M${x - w} ${y} Q${x - w - 2} ${y + len * 0.6} ${x - w * 0.6} ${y + len} L${x + w * 0.9} ${y + len} Q${x + w} ${y + len * 0.5} ${x + w} ${y} Z" fill="${fill}"/><ellipse cx="${x + 2}" cy="${y + len}" rx="${w + 2}" ry="3" fill="${fill}"/></g>`;

const teeth = (x1, x2, y, down = true) => {
  let d = `M${x1} ${y}`;
  for (let x = x1; x < x2; x += 6) d += ` l3 ${down ? 4 : -4} l3 ${down ? -4 : 4}`;
  return `<path d="${d}" fill="#fff"/>`;
};

function theropod([c, d, b], v = {}) {
  const sail = v.sail ? `<path d="M68 58 Q74 8 100 12 Q120 10 124 54 Z" fill="${b}" stroke="${d}" stroke-width="2"/><path d="M80 52 L84 18 M92 50 L96 14 M104 50 L108 16 M114 52 L116 26" stroke="${d}" stroke-width="2"/>` : '';
  const feathers = v.feathers ? `<path d="M8 64 l-6 -6 M10 68 l-8 0 M12 72 l-6 6" stroke="${d}" stroke-width="3" stroke-linecap="round"/>` : '';
  const skull = v.snout
    ? `<path d="M126 38 Q140 30 188 40 Q192 44 188 47 L150 49 Q136 56 128 54 Z" fill="${c}"/>${teeth(152, 184, 47)}`
    : `<path d="M126 36 Q150 26 176 34 Q184 38 182 46 L150 50 Q136 58 128 54 Z" fill="${c}"/>${teeth(152, 176, 47)}`;
  const jaw = v.snout ? `M140 48 L186 47 Q182 54 150 57 Q140 57 140 48 Z` : `M140 49 L180 47 Q178 58 150 60 Q140 60 140 49 Z`;
  const arm = v.feathers
    ? `<path class="arm" d="M120 76 q12 6 12 16" stroke="${d}" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M122 80 l-4 10 M127 84 l-4 9" stroke="${d}" stroke-width="2"/>`
    : `<path class="arm" d="M122 78 q8 6 6 12" stroke="${d}" stroke-width="4" stroke-linecap="round" fill="none"/>`;
  return `${sail}
  <g class="tail" ${o(72, 68)}><path d="M74 58 Q36 56 4 66 Q38 76 76 84 Z" fill="${c}"/>${feathers}</g>
  ${leg(80, 80, 48, 9, 'leg-b', d)}
  <ellipse cx="95" cy="70" rx="34" ry="22" fill="${c}"/>
  <ellipse cx="100" cy="80" rx="22" ry="9" fill="${b}"/>
  ${leg(102, 82, 46, 10, 'leg-a', c)}
  ${arm}
  <g class="head" ${o(118, 66)}>
    <path d="M108 58 Q122 40 136 42 L142 68 Q128 78 114 78 Z" fill="${c}"/>
    <g class="jaw" ${o(142, 50)}><path d="${jaw}" fill="${d}"/>${teeth(152, 174, 51, false)}</g>
    ${skull}
    ${eye(148, 38)}<circle cx="${v.snout ? 184 : 176}" cy="40" r="1.6" fill="${d}"/>
  </g>`;
}

function sauropod([c, d, b]) {
  return `
  <g class="tail" ${o(50, 74)}><path d="M52 66 Q20 74 2 96 Q24 90 54 86 Z" fill="${c}"/></g>
  ${leg(60, 86, 42, 8, 'leg-b', d)}${leg(112, 82, 46, 8, 'leg-a', d)}
  <ellipse cx="86" cy="78" rx="40" ry="24" fill="${c}"/>
  <ellipse cx="88" cy="90" rx="28" ry="9" fill="${b}"/>
  ${leg(72, 88, 40, 9, 'leg-a', c)}${leg(122, 84, 44, 9, 'leg-b', c)}
  <g class="head" ${o(110, 70)}>
    <path d="M100 64 Q132 52 140 18 L156 20 Q150 62 120 88 Z" fill="${c}"/>
    <ellipse cx="160" cy="18" rx="15" ry="9" fill="${c}"/>
    <path d="M148 10 Q156 2 164 10" fill="${d}"/>
    ${eye(160, 15)}<path d="M166 24 q6 0 9 -3" stroke="${d}" stroke-width="2" fill="none"/>
  </g>`;
}

function ceratopsian([c, d, b]) {
  const bone = '#f5ecd2';
  return `
  <g class="tail" ${o(56, 80)}><path d="M58 70 Q26 76 8 92 Q30 94 60 92 Z" fill="${c}"/></g>
  ${leg(66, 92, 34, 8, 'leg-b', d)}${leg(110, 94, 32, 8, 'leg-a', d)}
  <ellipse cx="88" cy="82" rx="40" ry="24" fill="${c}"/>
  <ellipse cx="90" cy="94" rx="28" ry="8" fill="${b}"/>
  ${leg(78, 94, 32, 9, 'leg-a', c)}${leg(120, 94, 32, 9, 'leg-b', c)}
  <g class="head" ${o(118, 80)}>
    <path d="M110 52 Q116 26 140 36 Q144 70 130 96 Q112 86 110 52 Z" fill="${b}" stroke="${d}" stroke-width="3"/>
    <circle cx="116" cy="44" r="3" fill="${d}"/><circle cx="126" cy="34" r="3" fill="${d}"/><circle cx="138" cy="36" r="3" fill="${d}"/>
    <path d="M126 62 Q150 52 166 70 Q170 82 158 88 L134 92 Q122 80 126 62 Z" fill="${c}"/>
    <g class="jaw" ${o(150, 82)}><path d="M150 84 L172 82 L160 92 Z" fill="${d}"/></g>
    <path d="M160 68 L180 76 L162 84 Z" fill="${d}"/>
    <path d="M138 62 L168 32 L148 66 Z" fill="${bone}"/><path d="M146 64 L174 40 L152 68 Z" fill="${bone}" opacity=".85"/>
    <path d="M162 70 L168 56 L168 72 Z" fill="${bone}"/>
    ${eye(146, 70)}
  </g>`;
}

function stego([c, d, b]) {
  const plates = [[62, 18], [74, 26], [88, 32], [102, 30], [116, 22], [128, 14]]
    .map(([x, h]) => `<path d="M${x - 7} ${70 - h * 0.1} L${x} ${64 - h} L${x + 7} ${70 - h * 0.1} Z" fill="${b}" stroke="${d}" stroke-width="2"/>`).join('');
  return `${plates}
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

function ankylo([c, d, b]) {
  const studs = [[62, 82], [78, 76], [94, 74], [110, 76], [124, 82], [70, 92], [86, 88], [102, 88], [118, 92]]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${b}" stroke="${d}" stroke-width="1.5"/>`).join('');
  const spikes = [52, 76, 100, 124].map((x) => `<path d="M${x - 6} 96 L${x} 108 L${x + 6} 96 Z" fill="${b}"/>`).join('');
  return `
  <g class="tail" ${o(52, 92)}>
    <path d="M52 86 Q28 88 14 92 Q28 98 52 100 Z" fill="${c}"/>
    <ellipse cx="12" cy="94" rx="11" ry="9" fill="${b}" stroke="${d}" stroke-width="2"/>
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

function hadrosaur([c, d, b]) {
  return `
  <g class="tail" ${o(62, 74)}><path d="M64 64 Q30 60 4 72 Q34 82 66 86 Z" fill="${c}"/></g>
  ${leg(78, 82, 46, 9, 'leg-b', d)}
  <ellipse cx="92" cy="74" rx="36" ry="22" fill="${c}"/>
  <ellipse cx="96" cy="84" rx="24" ry="8" fill="${b}"/>
  ${leg(100, 84, 44, 10, 'leg-a', c)}
  <path class="arm" d="M118 82 q6 10 4 18" stroke="${d}" stroke-width="5" stroke-linecap="round" fill="none"/>
  <g class="head" ${o(118, 64)}>
    <path d="M108 60 Q122 44 138 44 L142 62 Q128 74 114 78 Z" fill="${c}"/>
    <path d="M138 44 Q116 20 92 14 Q88 20 94 24 Q118 30 142 50 Z" fill="${b}" stroke="${d}" stroke-width="2"/>
    <path d="M132 40 Q156 34 172 46 Q176 54 168 56 L142 58 Q130 52 132 40 Z" fill="${c}"/>
    <g class="jaw" ${o(160, 54)}><path d="M156 54 L182 54 L168 60 Z" fill="${d}"/></g>
    <path d="M164 46 L182 50 L168 54 Z" fill="${d}"/>
    ${eye(150, 46)}
  </g>`;
}

function pterosaur([c, d, b]) {
  return `
  <g class="wing-l" ${o(96, 68)}><path d="M98 64 Q60 36 4 56 Q50 64 94 80 Z" fill="${c}" stroke="${d}" stroke-width="2"/></g>
  <g class="wing-r" ${o(104, 68)}><path d="M102 64 Q140 36 196 56 Q150 64 106 80 Z" fill="${c}" stroke="${d}" stroke-width="2"/></g>
  <ellipse cx="100" cy="72" rx="12" ry="16" fill="${d}"/>
  <path d="M94 86 l-4 8 M106 86 l4 8" stroke="${d}" stroke-width="3" stroke-linecap="round"/>
  <g class="head" ${o(102, 58)}>
    <circle cx="104" cy="54" r="10" fill="${c}"/>
    <path d="M100 48 L72 30 L104 46 Z" fill="${b}"/>
    <g class="jaw" ${o(112, 56)}><path d="M110 56 L146 62 L112 60 Z" fill="${b}"/></g>
    <path d="M110 50 L150 58 L110 57 Z" fill="${b}"/>
    ${eye(106, 51)}
  </g>`;
}

function mosasaur([c, d, b]) {
  return `
  <g class="tail" ${o(42, 72)}><path d="M44 70 Q22 68 4 48 Q14 72 6 96 Q24 80 44 78 Z" fill="${d}"/></g>
  <g class="leg-b" ${o(72, 80)}><path d="M70 80 Q74 98 60 104 Q62 90 66 80 Z" fill="${d}"/></g>
  <path d="M34 72 Q80 46 140 56 Q170 58 186 68 L140 72 Q90 88 34 78 Z" fill="${c}"/>
  <path d="M50 78 Q90 84 138 72 L140 76 Q90 90 50 80 Z" fill="${b}"/>
  <g class="leg-a" ${o(122, 76)}><path d="M120 76 Q128 98 112 106 Q112 90 116 76 Z" fill="${d}"/></g>
  <g class="jaw" ${o(140, 72)}><path d="M138 72 L182 70 Q172 82 142 80 Z" fill="${d}"/>${teeth(146, 176, 71, false)}</g>
  ${teeth(146, 180, 69)}
  ${eye(158, 62)}
  <circle class="bubble" cx="190" cy="60" r="3" fill="none" stroke="#fff" stroke-width="1.5"/>
  <circle class="bubble b2" cx="186" cy="54" r="2" fill="none" stroke="#fff" stroke-width="1.5"/>`;
}

const KINDS = {
  theropod: (c) => theropod(c),
  raptor: (c) => theropod(c, { feathers: true }),
  spino: (c) => theropod(c, { sail: true, snout: true }),
  sauropod, ceratopsian, stego, ankylo, hadrosaur, pterosaur, mosasaur,
};

export function dinoSVG(dino, extraClass = '') {
  return `<svg class="dino ${dino.kind} ${extraClass}" viewBox="0 0 200 140" role="img" aria-label="${dino.name}">${KINDS[dino.kind](dino.colors)}</svg>`;
}
