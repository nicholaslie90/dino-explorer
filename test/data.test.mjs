import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { DINOS, UI } from '../public/data.js';
import { dinoSVG } from '../public/dinos.js';

const TEXT = ['meaning', 'period', 'length', 'weight', 'place', 'desc'];

test('every dino has ID + EN text, a drawing and a sound file', () => {
  for (const d of DINOS) {
    for (const k of TEXT) for (const l of ['id', 'en']) assert.ok(d[k]?.[l], `${d.slug}.${k}.${l}`);
    assert.equal(d.facts.id.length, d.facts.en.length, `${d.slug} facts`);
    assert.ok(UI.id.diet[d.diet] && UI.en.diet[d.diet], `${d.slug} diet`);
    assert.match(dinoSVG(d), /^<svg[\s\S]*<\/svg>$/, `${d.slug} svg`);
    assert.ok(existsSync(new URL(`../public/sounds/${d.sound}.mp3`, import.meta.url)), `${d.slug} sound`);
  }
  assert.equal(new Set(DINOS.map((d) => d.slug)).size, DINOS.length, 'unique slugs');
});

test('UI strings exist in both languages', () => {
  assert.deepEqual(Object.keys(UI.id).sort(), Object.keys(UI.en).sort());
});
