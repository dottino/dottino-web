#!/usr/bin/env node
/**
 * Dottino ABRSM Grades 3-5 Aural Automated Regression Suite
 * Run anytime: node tools/test_aural.mjs
 *
 * Verifies:
 * 1. P0-01: Grade 5 6-note Sight-Singing (Lv.3 & Lv.4, 10,000 samples each) -> 0 illegal intervals,
 *           strictly within -3..+4, C/F/G/D/Bb keys covered, valid treble & bass SVG.
 * 2. P0-02: Melodic Recall makeEchoR (Lv.5, Lv.6, Lv.7, 10,000 samples each) -> 0 octave violations (>12 semitones).
 * 3. P0-03 & P0-04: Grade 3 & Grade 5 Mock purity + shared ExamPiece in Test 5C & Test 3D.
 * 4. P1-01: Spot the Change makeQ('same') (Lv.1 & Lv.2, 10,000 samples each) -> 0 total-duration drifts; force='change' always changes.
 * 5. P1-02: Style/Texture/Cadence multi-template diversity (4 official periods incl. 20th Century Modern; overlapping tempos).
 * 6. P2: Rhythm Lv.0-2 (10,000 samples each) -> 0 questions with fewer than 3 unique options.
 * 7. Engineering: Teacher Preview (?preview=1) never payLocked across Grades 3/4/5; per-grade expiry in _lib.js;
 *                 all 48 Grade x Week x Lang page loads pass cleanly.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const N = 10000;

const piecesSrc = fs.readFileSync(path.join(ROOT, 'pieces.js'), 'utf8');
const agSrc = fs.readFileSync(path.join(ROOT, 'aural-grades.js'), 'utf8');
const auralHtml = fs.readFileSync(path.join(ROOT, 'aural.html'), 'utf8');
const auralScript = [...auralHtml.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)][0][1];

const dummyEl = () => ({
  addEventListener() {}, setAttribute() {}, remove() {}, prepend() {}, before() {}, after() {}, append() {},
  closest() { return { parentNode: { insertBefore() {} } }; },
  style: {}, classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
  querySelectorAll() { return []; }, querySelector() { return null; },
  innerHTML: '', textContent: '', hidden: false, disabled: false, dataset: {}, value: '', children: []
});

function bootAural({ grade = 4, week = 1, lang = 'en', preview = false, clef = 'treble' } = {}) {
  const win = {
    location: { search: `?g=${grade}&w=${week}${preview ? '&preview=1' : ''}`, origin: 'https://dottino.app', pathname: '/aural' },
    localStorage: { getItem(k) { return k === 'dottino:v1' ? JSON.stringify({ lang, clef }) : null; }, setItem() {} },
    sessionStorage: { getItem() { return preview ? '1' : null; }, setItem() {} },
    navigator: { language: lang },
    matchMedia: () => ({ matches: false }),
    scrollTo() {},
    DottinoPay: { CFG: { env: 'production', prices: { g3: 'p3', g4: 'p4', g5: 'p5' } }, active: () => true, hasAccess: () => false },
    addEventListener() {},
    document: {
      body: dummyEl(),
      documentElement: { lang, setAttribute() {}, getAttribute() { return 'light'; } },
      title: '',
      getElementById: () => dummyEl(),
      querySelector: () => dummyEl(),
      querySelectorAll: () => [],
      createElement: () => dummyEl(),
      addEventListener() {}
    }
  };
  new Function('window', piecesSrc)(win);
  new Function('window', agSrc)(win);
  const exposed = auralScript.replace(/\}\)\(\);\s*$/, 'window.__R = { GRADE, WEEK, LESSONS, t, makeQ, staffSvg, weakPlan, AG, payLocked, PREVIEW, nextSeg, startLesson, getL: () => L }; })();');
  new Function('window','PIECES','document','navigator','localStorage','sessionStorage','location','matchMedia','addEventListener','URLSearchParams','performance','setTimeout','clearTimeout','setInterval','clearInterval','requestAnimationFrame', exposed)(
    win, win.PIECES, win.document, win.navigator, win.localStorage, win.sessionStorage, win.location, win.matchMedia, win.addEventListener, URLSearchParams, { now: () => 0 }, () => 0, () => {}, () => 0, () => {}, () => 0
  );
  return win.__R;
}

let fails = 0;
function assert(cond, msg) {
  if (!cond) { console.error('FAIL:', msg); fails++; }
  else console.log('PASS:', msg);
}

// 0. Syntax checks on HTML inline scripts
for (const f of ['index.html', 'aural.html', 'teachers/index.html']) {
  const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
  const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)];
  scripts.forEach(m => new Function(m[1]));
}
console.log('PASS: Inline HTML script syntax checks');

const R5 = bootAural({ grade: 5, week: 8, lang: 'en', preview: true });

// 1. P0-01: Sight Singing Lv.3 & Lv.4 (10,000 each)
for (const lv of [3, 4]) {
  let badInt = 0, badRange = 0, badLen = 0, badSvg = 0;
  const keysSeen = new Set();
  let rising4Count = 0;
  for (let i = 0; i < N; i++) {
    const q = R5.makeQ('sight', lv);
    keysSeen.add(q.key);
    if (q.steps.length !== 6) badLen++;
    for (let k = 0; k < q.steps.length; k++) {
      const off = q.steps[k] - q.home;
      if (off < -3 || off > 4) badRange++;
      if (k > 0) {
        const prev = q.steps[k - 1] - q.home;
        if (prev === -3 && off === 0) rising4Count++;
        else if (Math.abs(off - prev) > 2 || off === prev) badInt++;
      }
    }
    if (i < 100) {
      const svg = R5.staffSvg(q, true);
      if (!svg || svg.includes('NaN') || svg.includes('undefined')) badSvg++;
    }
  }
  assert(badInt === 0 && badRange === 0 && badLen === 0 && badSvg === 0,
    `P0-01 Sight Lv.${lv} (${N} samples): badInt=${badInt}, badRange=${badRange}, badLen=${badLen}, badSvg=${badSvg}, rising4=${rising4Count}, keys=[${[...keysSeen].sort().join(',')}]`);
  if (lv === 4) assert(keysSeen.has('Bb') && keysSeen.has('D') && keysSeen.size === 5, `P0-01 Sight Lv.4 covers all 5 official keys (C,F,G,D,Bb)`);
}
// Also verify bass clef Bb & D staff SVG
const R5Bass = bootAural({ grade: 5, week: 4, lang: 'en', clef: 'bass' });
let bassBad = 0;
for (let i = 0; i < 200; i++) {
  const q = R5Bass.makeQ('sight', 4);
  const svg = R5Bass.staffSvg(q, true);
  if (!svg || svg.includes('NaN') || svg.includes('undefined')) bassBad++;
}
assert(bassBad === 0, `P0-01 Bass clef Sight Lv.4 SVG clean (200 samples, bad=${bassBad})`);

// 2. P0-02: Melodic Recall makeEchoR Lv.5, Lv.6, Lv.7 (10,000 each)
for (const lv of [5, 6, 7]) {
  let overOctave = 0;
  for (let i = 0; i < N; i++) {
    const q = R5.makeQ('echo', lv);
    if (Math.max(...q.notes) - Math.min(...q.notes) > 12) overOctave++;
  }
  assert(overOctave === 0, `P0-02 Melodic Recall Lv.${lv} (${N} samples): span > 12 semitones = ${overOctave}`);
}

// 3. P1-01: Spot the Change makeQ('same') Lv.1 & Lv.2 (10,000 each)
for (const lv of [1, 2]) {
  let drift = 0, forcedSame = 0;
  for (let i = 0; i < N; i++) {
    const q = R5.makeQ('same', lv);
    if (Math.abs(q.durs.reduce((a, b) => a + b, 0) - q.durs2.reduce((a, b) => a + b, 0)) > 1e-6) drift++;
    if (i < 1000) {
      const qc = R5.makeQ('same', lv, 'change');
      if (qc.same) forcedSame++;
      if (Math.abs(qc.durs.reduce((a, b) => a + b, 0) - qc.durs2.reduce((a, b) => a + b, 0)) > 1e-6) drift++;
    }
  }
  assert(drift === 0 && forcedSame === 0, `P1-01 Same Lv.${lv} (${N} samples): durationDrift=${drift}, forceChangeFail=${forcedSame}`);
}

// 4. P2: Rhythm Lv.0-2 (10,000 each) -> always 3 unique options
for (const lv of [0, 1, 2]) {
  let short = 0;
  for (let i = 0; i < N; i++) {
    const q = R5.makeQ('rhythm', lv);
    if (new Set(q.options).size < 3) short++;
  }
  assert(short === 0, `P2 Rhythm Lv.${lv} (${N} samples): <3 unique options = ${short}`);
}

// 5. P1-02: Style 4 official periods + 34+ distinct real excerpts + overlapping tempos + Shuffle Bag zero back-to-back repeats
{
  const periods = new Set(), piecesSeen = new Set();
  const tempoRange = { baroque: [999, 0], classical: [999, 0], romantic: [999, 0], modern: [999, 0] };
  let styleConsecDup = 0, prevStyKey = null;
  for (let i = 0; i < 400; i++) {
    const q = R5.makeQ('style', 1);
    periods.add(q.ans);
    const pk = q.ans + ':' + (q.piece.title || q.tpl);
    piecesSeen.add(pk);
    if (pk === prevStyKey) styleConsecDup++;
    prevStyKey = pk;
    const bpm = Math.round(60 / q.piece.B);
    tempoRange[q.ans][0] = Math.min(tempoRange[q.ans][0], bpm);
    tempoRange[q.ans][1] = Math.max(tempoRange[q.ans][1], bpm);
  }
  let texConsecDup = 0, prevTexKey = null;
  const texSeen = new Set();
  for (let i = 0; i < 120; i++) {
    const q = R5.makeQ('texture', 1);
    const tk = q.ans + ':' + (q.piece.title || q.tpl);
    texSeen.add(tk);
    if (tk === prevTexKey) texConsecDup++;
    prevTexKey = tk;
  }
  assert(periods.size === 4 && periods.has('modern'), `P1-02 Style covers all 4 official periods: [${[...periods].join(',')}]`);
  assert(piecesSeen.size >= 34 && styleConsecDup === 0, `Repertoire Style bank has ${piecesSeen.size} distinct pieces (0 consecutive repeats)`);
  assert(texSeen.size >= 16 && texConsecDup === 0, `Repertoire Texture bank has ${texSeen.size} distinct pieces (0 consecutive repeats)`);
  const minHigh = Math.min(...Object.values(tempoRange).map(r => r[1]));
  const maxLow = Math.max(...Object.values(tempoRange).map(r => r[0]));
  assert(minHigh > maxLow, `P1-02 Style tempos overlap across all 4 periods (${JSON.stringify(tempoRange)})`);
}

// 6. P0-03 & P0-04: Unified ExamPiece in Grade 5 Mock (g5c) & Grade 3 Mock (g3d)
{
  R5.startLesson(0); // Grade 5 Mock 1
  const L5 = R5.getL();
  const cQs = L5.quizQs.filter(q => q.sec === 'Ci' || q.sec === 'Cii');
  const uniquePieces5 = new Set(cQs.map(q => q.piece));
  const meter5 = cQs.find(q => q.type === 'meter');
  assert(cQs.length === 4 && uniquePieces5.size === 1 && meter5 && meter5.level === 2 && [2, 3, 4].includes(meter5.k),
    `P0-04 Grade 5 Mock Test 5C shares 1 unified ExamPiece across 4 Qs (metre=${meter5 && meter5.k} time)`);

  const R3 = bootAural({ grade: 3, week: 8, lang: 'en', preview: true });
  R3.startLesson(0); // Grade 3 Mock 1
  const L3 = R3.getL();
  const b3 = L3.quizQs.filter(q => q.sec === 'B3');
  const c3 = L3.quizQs.filter(q => q.sec === 'C3');
  const d3 = L3.quizQs.filter(q => q.sec === 'D3');
  assert(b3.length === 3, `Grade 3 Mock 3B has 3 consecutive echo phrases (${b3.length})`);
  assert(c3.length === 2 && c3.every(q => !q.same), `Grade 3 Mock 3C guarantees pitch/rhythm change`);
  assert(d3.length === 2 && d3[0].piece === d3[1].piece, `Grade 3 Mock 3D asks 2 features on ONE shared piece`);
}

// 7. Teacher Preview unlock + all 48 Grade x Week x Lang loads
{
  let previewLocked = 0, loadErrs = 0;
  for (const g of [3, 4, 5]) {
    for (let w = 1; w <= 8; w++) {
      const rp = bootAural({ grade: g, week: w, lang: 'en', preview: true });
      if (rp.payLocked()) previewLocked++;
      for (const lang of ['en', 'zh']) {
        const r = bootAural({ grade: g, week: w, lang, preview: false });
        const T_ = r.t();
        if (!r.LESSONS || r.LESSONS.length !== 4 || !T_.L || T_.L.length !== 4) loadErrs++;
        if (w >= 2 && !r.payLocked()) loadErrs++; // unpaid Week 2-8 must lock for all 3 grades
        if (w === 1 && r.payLocked()) loadErrs++; // Week 1 must stay free for all 3 grades
      }
    }
  }
  assert(previewLocked === 0, `P1 Teacher Preview (?preview=1) unlocked across all 24 Grade x Week pages (locked=${previewLocked})`);
  assert(loadErrs === 0, `All 48 Grade x Week x Lang pages + paywall boundaries valid (errs=${loadErrs})`);
}

// 8. Backend per-grade expiry check (_lib.js)
{
  process.env.PADDLE_ENV = 'production';
  const { licenseFrom } = require(path.join(ROOT, 'netlify/functions/_lib.js'));
  const old = new Date(Date.now() - 200 * 864e5).toISOString(); // expired (>183 days)
  const fresh = new Date(Date.now() - 5 * 864e5).toISOString();  // active
  const lic = licenseFrom([
    { status: 'completed', billed_at: old, items: [{ price: { id: 'pri_01m8bg0tj57y48h8kyngp5wdvg' } }] },   // G3 expired
    { status: 'completed', billed_at: fresh, items: [{ price: { id: 'pri_01m65ffd1mtr2r0fgsz558c3f5' } }] }  // G4 active
  ], 'parent@test.uk');
  assert(lic && lic.grades.join(',') === '4' && lic.expByGrade && !lic.expByGrade[3] && lic.expByGrade[4] > Date.now(),
    `P1 Per-grade expiry isolates expired Grade 3 from active Grade 4 (grades=[${lic && lic.grades}])`);
}

console.log(fails ? `\nSUMMARY: ${fails} FAILURES` : '\nSUMMARY: ALL REGRESSION CHECKS PASSED (0 FAILURES)');
process.exit(fails ? 1 : 0);
