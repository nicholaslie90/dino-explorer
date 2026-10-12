import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { DINOS, UI } from '../public/data.js';
import { dinoSVG, KIND_NAMES } from '../public/dinos.js';

const TEXT = ['meaning', 'period', 'length', 'weight', 'place', 'desc'];
const pub = (p) => new URL(`../public/${p}`, import.meta.url);

test('every dino has ID + EN text, a drawing and a sound file', () => {
  for (const d of DINOS) {
    for (const k of TEXT) for (const l of ['id', 'en']) assert.ok(d[k]?.[l], `${d.slug}.${k}.${l}`);
    assert.ok(d.facts.id.length >= 1 && d.facts.id.length === d.facts.en.length, `${d.slug} facts`);
    assert.ok(UI.id.diet[d.diet] && UI.en.diet[d.diet], `${d.slug} diet ${d.diet}`);
    assert.ok(['land', 'sky', 'sea'].includes(d.scene), `${d.slug} scene`);
    assert.ok(d.len > 0 && d.len < 60, `${d.slug} len`);
    assert.ok(KIND_NAMES.includes(d.kind), `${d.slug} kind ${d.kind}`);
    assert.equal(d.colors.length, 3, `${d.slug} colors`);
    assert.match(dinoSVG(d), /^<svg[\s\S]*<\/svg>$/, `${d.slug} svg`);
    assert.doesNotMatch(dinoSVG(d), /undefined|NaN/, `${d.slug} svg values`);
    assert.ok(existsSync(pub(`sounds/${d.sound}.mp3`)), `${d.slug} sound ${d.sound}`);
  }
  assert.equal(new Set(DINOS.map((d) => d.slug)).size, DINOS.length, 'unique slugs');
});

test('realistic images exist and come from Wikimedia Commons with an allowed license', () => {
  for (const d of DINOS.filter((x) => x.image)) {
    assert.ok(existsSync(pub(d.image.file)), `${d.slug} image file ${d.image.file}`);
    assert.match(d.image.source, /^https:\/\/commons\.wikimedia\.org\//, `${d.slug} source`);
    assert.ok(d.image.author, `${d.slug} author`);
    assert.match(d.image.license, /^(CC0|CC BY(-SA)? [\d.]+|Public domain|PD)/i, `${d.slug} license ${d.image.license}`);
    assert.doesNotMatch(d.image.license, /NC|ND/, `${d.slug} non-free license`);
  }
});

test('UI strings exist in both languages', () => {
  assert.deepEqual(Object.keys(UI.id).sort(), Object.keys(UI.en).sort());
});
