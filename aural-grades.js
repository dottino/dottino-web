/* Dottino Multi-Grade Curricula & Grade 5 Engines (ABRSM Grades 3 & 5 Aural Format).
   v2.0 — White-box audited:
   - Grade 3 Mock: 3A pulse/2-3-4 time, 3B 3 consecutive short echoes, 3C guaranteed pitch/rhythm change, 3D two features on ONE shared piece.
   - Grade 5 Mock: 5A octave-bounded melodies, 5B 6-note sight-singing (C/F/G/D/Bb, -3..+4, steps/3rds + rising 4th 5->1 only),
     5C(i) + 5C(ii) sharing ONE unified ExamPiece (features + 4 official periods incl. 20th Century Modern + rhythm clap-back + 2/3/4 time).
   - Musicianship Extension: Texture, Cadence & 6/8 compound feel clearly marked as extension training, never mislabeled as mandatory Grade 5 mock sections.
   - Multi-template variety: 3 distinct templates per Style (x4 periods = 12), per Texture (x3 = 9), per Cadence (x3 = 9) with overlapping tempos so speed never leaks answers. */
(function () {
  const rnd = n => Math.floor(Math.random() * n);
  const pick = a => a[rnd(a.length)];

  // =========================================================================
  // 1. GRADE 3 & GRADE 5 LESSON PLANS (8 weeks x 4 stops each)
  // =========================================================================

  // --- GRADE 3 OFFICIAL MOCK (3A, 3B x3 echoes, 3C guaranteed change, 3D shared piece) ---
  const G3_MOCK = [
    { t: 'tapbeat', lv: 1, sec: 'A3' },
    { t: 'meter', lv: 2, sec: 'A3' },
    { t: 'echo', lv: 2, sec: 'B3' },
    { t: 'echo', lv: 2, sec: 'B3' },
    { t: 'echo', lv: 3, sec: 'B3' },
    { t: 'same', lv: 1, a: 'change', sec: 'C3' },
    { t: 'same', lv: 2, a: 'change', sec: 'C3' },
    { t: 'g3d' }
  ];

  const G3_WEEKS = {
    1: [
      [ { type: 'intro' }, { type: 'hl', level: 0, up: 4, target: 2, streak: 5, max: 22 }, { type: 'find', count: 4 } ],
      [ { type: 'hl', level: 2, fixed: true, count: 3, warm: true }, { type: 'contour', level: 0, up: 3, target: 2, streak: 5, max: 18 }, { type: 'echo', level: 0, fixed: true, count: 4 } ],
      [ { type: 'contour', level: 2, fixed: true, count: 3, warm: true }, { type: 'same', level: 0, fixed: true, count: 6 }, { type: 'quiz', items: ['hl', 'hl', 'contour', 'contour', 'same', 'same', 'echo', 'echo'] } ],
      [ { type: 'same', level: 0, fixed: true, count: 3, warm: true }, { type: 'same', level: 1, fixed: true, count: 8 }, { type: 'meter', level: 0, fixed: true, count: 4 } ]
    ],
    2: [
      [ { type: 'meter', level: 0, up: 3, target: 1, streak: 5, max: 18 } ],
      [ { type: 'contour', level: 4, fixed: true, count: 6 }, { type: 'echo', level: 1, fixed: true, count: 5 } ],
      [ { type: 'meter', level: 1, fixed: true, count: 5 }, { type: 'meter', level: 2, fixed: true, count: 4 } ],
      [ { type: 'quiz', items: [{ t: 'meter', lv: 1 }, { t: 'meter', lv: 2 }, { t: 'contour', lv: 4 }, { t: 'echo', lv: 1 }, { t: 'echo', lv: 1 }, { t: 'same', lv: 1 }, { t: 'same', lv: 1 }] } ]
    ],
    3: [
      [ { type: 'tonic', level: 0, up: 4, target: 1, streak: 5, max: 18 } ],
      [ { type: 'rhythm', level: 0, fixed: true, count: 5 }, { type: 'rhythm', level: 1, fixed: true, count: 5 } ],
      [ { type: 'echo', level: 1, fixed: true, count: 2, warm: true }, { type: 'echo', level: 2, fixed: true, count: 5 } ],
      [ { type: 'quiz', items: [{ t: 'tonic', lv: 1 }, { t: 'rhythm', lv: 1 }, { t: 'rhythm', lv: 1 }, { t: 'meter', lv: 1 }, { t: 'echo', lv: 2 }, { t: 'echo', lv: 2 }, { t: 'same', lv: 1 }] } ]
    ],
    4: [ // Test 3A focus: pulse, clapping the beat, 2 / 3 / 4 time
      [ { type: 'tapbeat', level: 0, fixed: true, count: 5 } ],
      [ { type: 'tapbeat', level: 1, fixed: true, count: 5 }, { type: 'meter', level: 2, fixed: true, count: 3 } ],
      [ { type: 'rhythm', level: 1, fixed: true, count: 3 }, { type: 'taprhythm', level: 0, fixed: true, count: 5 } ],
      [ { type: 'quiz', items: [{ t: 'tapbeat', lv: 1 }, { t: 'tapbeat', lv: 1 }, { t: 'meter', lv: 2 }, { t: 'meter', lv: 2 }, { t: 'taprhythm', lv: 0 }, { t: 'echo', lv: 2 }, { t: 'same', lv: 1 }] } ]
    ],
    5: [ // Test 3B focus: singing/playing back 3 short echo phrases
      [ { type: 'singmatch', fixed: true, count: 6 }, { type: 'echo', level: 1, fixed: true, count: 3 } ],
      [ { type: 'echo', level: 2, fixed: true, count: 6 } ],
      [ { type: 'echo', level: 3, fixed: true, count: 6 } ],
      [ { type: 'quiz', items: [{ t: 'singmatch', lv: 0 }, { t: 'echo', lv: 2 }, { t: 'echo', lv: 2 }, { t: 'echo', lv: 3 }, { t: 'echo', lv: 3 }, { t: 'meter', lv: 2 }, { t: 'same', lv: 1, a: 'change' }] } ]
    ],
    6: [ // Test 3C focus: spot pitch vs rhythm change in a 2-bar phrase
      [ { type: 'same', level: 0, fixed: true, count: 3, warm: true }, { type: 'same', level: 1, fixed: true, count: 8 } ],
      [ { type: 'same', level: 1, fixed: true, count: 4 }, { type: 'same', level: 2, fixed: true, count: 6 } ],
      [ { type: 'same', level: 2, fixed: true, count: 8 } ],
      [ { type: 'quiz', items: [{ t: 'same', lv: 1, a: 'change' }, { t: 'same', lv: 1, a: 'change' }, { t: 'same', lv: 2, a: 'change' }, { t: 'same', lv: 2, a: 'change' }, { t: 'same', lv: 2, a: 'change' }, { t: 'echo', lv: 3 }, { t: 'tapbeat', lv: 1 }] } ]
    ],
    7: [ // Test 3D focus: dynamics, articulation, tempo changes & Major/Minor
      [ { type: 'mode', level: 0, fixed: true, count: 6 }, { type: 'mode', level: 1, fixed: true, count: 6 } ],
      [ { type: 'feat', aspect: 'dyn', level: 0, fixed: true, count: 4 }, { type: 'feat', aspect: 'art', level: 0, fixed: true, count: 4 }, { type: 'feat', aspect: 'dyn', level: 1, fixed: true, count: 3 } ],
      [ { type: 'feat', aspect: 'tempo', level: 0, fixed: true, count: 3 }, { type: 'feat', aspect: 'tempo', level: 1, fixed: true, count: 3 }, { type: 'feat', aspect: 'ton', level: 0, fixed: true, count: 4 } ],
      [ { type: 'quiz', items: [{ t: 'g3d' }, { t: 'feat', lv: 1, a: 'art' }, { t: 'feat', lv: 1, a: 'tempo' }, { t: 'mode', lv: 1 }, { t: 'same', lv: 2, a: 'change' }, { t: 'meter', lv: 2 }] } ]
    ],
    8: [ // Grade 3 Mock Exams (3A, 3B, 3C, 3D in exact exam order)
      [ { type: 'quiz', items: G3_MOCK, exam: true } ],
      [ { type: 'weak' } ],
      [ { type: 'quiz', items: G3_MOCK, exam: true } ],
      [ { type: 'quiz', items: G3_MOCK, exam: true } ]
    ]
  };

  // --- GRADE 5 OFFICIAL MOCK (5A, 5B 6-note, 5C(i)+5C(ii) sharing ONE unified ExamPiece!) ---
  const G5_MOCK = [
    { t: 'echo', lv: 6, sec: 'A' },
    { t: 'echo', lv: 7, sec: 'A' },
    { t: 'sight', lv: 3, sec: 'B' },
    { t: 'sight', lv: 4, sec: 'B' },
    { t: 'g5c' }
  ];

  const G5_WEEKS = {
    1: [ // Free Week 1: Grade 5 Foundations & Diagnostic
      [ { type: 'mode', level: 1, fixed: true, count: 6 }, { type: 'same', level: 2, fixed: true, count: 5 } ],
      [ { type: 'echo', level: 3, fixed: true, count: 3 }, { type: 'echo', level: 4, fixed: true, count: 4 } ],
      [ { type: 'meter', level: 2, fixed: true, count: 5 }, { type: 'rhythm', level: 2, fixed: true, count: 4 } ],
      [ { type: 'quiz', items: [{ t: 'echo', lv: 4 }, { t: 'mode', lv: 1 }, { t: 'same', lv: 2 }, { t: 'meter', lv: 2 }, { t: 'style', lv: 0 }, { t: 'feat', lv: 1, a: 'dyn' }] } ]
    ],
    2: [ // Test 5A Part 1: Rhythm + Major/Minor Melody Playback
      [ { type: 'mode', level: 1, fixed: true, count: 5 }, { type: 'echo', level: 4, fixed: true, count: 4 } ],
      [ { type: 'echo', level: 5, fixed: true, count: 6 } ],
      [ { type: 'echo', level: 6, fixed: true, count: 5 } ],
      [ { type: 'quiz', items: [{ t: 'echo', lv: 5 }, { t: 'echo', lv: 5 }, { t: 'echo', lv: 6 }, { t: 'echo', lv: 6 }, { t: 'mode', lv: 1 }, { t: 'meter', lv: 2 }] } ]
    ],
    3: [ // Test 5A Part 2: Extended Grade 5 Melodies (within octave, up to 3 sharps/flats)
      [ { type: 'echo', level: 6, fixed: true, count: 5 } ],
      [ { type: 'echo', level: 6, fixed: true, count: 2, warm: true }, { type: 'echo', level: 7, fixed: true, count: 5 } ],
      [ { type: 'echo', level: 7, fixed: true, count: 6 } ],
      [ { type: 'quiz', items: [{ t: 'echo', lv: 6 }, { t: 'echo', lv: 6 }, { t: 'echo', lv: 7 }, { t: 'echo', lv: 7 }, { t: 'echo', lv: 7 }, { t: 'feat', lv: 1, a: 'ton' }] } ]
    ],
    4: [ // Test 5B: 6-Note Sight-Singing (C, F, G, D, Bb major; -3..+4; steps/3rds + rising 4th 5->1 only)
      [ { type: 'singmatch', fixed: true, count: 5 }, { type: 'sight', level: 2, fixed: true, count: 3 } ],
      [ { type: 'sight', level: 3, fixed: true, count: 6 } ],
      [ { type: 'sight', level: 4, fixed: true, count: 6 } ],
      [ { type: 'quiz', items: [{ t: 'sight', lv: 3 }, { t: 'sight', lv: 3 }, { t: 'sight', lv: 4 }, { t: 'sight', lv: 4 }, { t: 'echo', lv: 6 }, { t: 'feat', lv: 1, a: 'dyn' }] } ]
    ],
    5: [ // Test 5C(i) Features + Musicianship Extension (Texture & Cadences — bridge to Grade 6)
      [ { type: 'feat', aspect: 'dyn', level: 1, fixed: true, count: 4 }, { type: 'feat', aspect: 'art', level: 1, fixed: true, count: 4 } ],
      [ { type: 'feat', aspect: 'tempo', level: 1, fixed: true, count: 4 }, { type: 'feat', aspect: 'ton', level: 1, fixed: true, count: 4 } ],
      [ { type: 'texture', level: 1, fixed: true, count: 5 }, { type: 'cadence', level: 1, fixed: true, count: 4 } ], // Extension
      [ { type: 'quiz', items: [{ t: 'feat', lv: 1, a: 'dyn' }, { t: 'feat', lv: 1, a: 'art' }, { t: 'feat', lv: 1, a: 'tempo' }, { t: 'feat', lv: 1, a: 'ton' }, { t: 'texture', lv: 1 }, { t: 'cadence', lv: 1 }] } ]
    ],
    6: [ // Test 5C(i) Core: Style & Period (Baroque / Classical / Romantic / 20th Century Modern) & Character
      [ { type: 'style', level: 0, fixed: true, count: 6 } ],
      [ { type: 'style', level: 1, fixed: true, count: 8 } ],
      [ { type: 'char', level: 1, fixed: true, count: 4 }, { type: 'style', level: 1, fixed: true, count: 4 } ],
      [ { type: 'quiz', items: [{ t: 'g5c' }, { t: 'style', lv: 1 }, { t: 'char', lv: 1 }] } ]
    ],
    7: [ // Test 5C(ii) Core: Rhythm Clap-Back & 2/3/4 Time (+ 6/8 Compound Feel Extension)
      [ { type: 'rhythm', level: 2, fixed: true, count: 5 }, { type: 'taprhythm', level: 1, fixed: true, count: 4 } ],
      [ { type: 'taprhythm', level: 2, fixed: true, count: 5 }, { type: 'meter', level: 2, fixed: true, count: 4 } ],
      [ { type: 'meter', level: 3, fixed: true, count: 6 } ], // Extension: 6/8 compound feel vs simple 2/3/4
      [ { type: 'quiz', items: [{ t: 'g5c' }, { t: 'taprhythm', lv: 2 }, { t: 'meter', lv: 2 }] } ]
    ],
    8: [ // Grade 5 Official Mock Exams (5A, 5B, unified 5C(i)+5C(ii) in exact ABRSM exam order)
      [ { type: 'quiz', items: G5_MOCK, exam: true } ],
      [ { type: 'weak' } ],
      [ { type: 'quiz', items: G5_MOCK, exam: true } ],
      [ { type: 'quiz', items: G5_MOCK, exam: true } ]
    ]
  };

  // =========================================================================
  // 2. SHUFFLE-BAG ANTI-REPEAT + PIANIST HUMANIZER + 38-PIECE REAL REPERTOIRE
  // =========================================================================

  // Shuffle bag: deals every item in random order without replacement, and avoids repeating the last item across boundaries
  const BAGS = {};
  const LAST_BAG = {};
  function bagNext(key, items) {
    if (!items || !items.length) return null;
    if (items.length === 1) return items[0];
    if (!BAGS[key] || !BAGS[key].length) {
      const a = items.slice();
      for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; }
      if (LAST_BAG[key] !== undefined && a[a.length - 1] === LAST_BAG[key] && a.length > 1) {
        const tmp = a[0]; a[0] = a[a.length - 1]; a[a.length - 1] = tmp;
      }
      BAGS[key] = a;
    }
    const chosen = BAGS[key].pop();
    LAST_BAG[key] = chosen;
    return chosen;
  }

  // Pianist humanizer (ported from Basso studio piano renderer):
  // gentle chord roll (LH anchors 0ms, upper LH +6ms, RH melody +3ms), 4-beat phrase arch, warm v9 acoustic velocity, natural legato overlap
  function playHumanized(ev, beatSec, playFn, art) {
    const contour = [1.03, 0.94, 1.04, 0.92];
    const lowestAt = new Map();
    ev.forEach(e => {
      const tk = Math.round(e.t * 100);
      if (!e.mel) lowestAt.set(tk, Math.min(lowestAt.get(tk) ?? 999, e.m));
    });
    let maxT = 0;
    ev.forEach(e => {
      const tk = Math.round(e.t * 100);
      const isLow = !e.mel && e.m === lowestAt.get(tk);
      const roll = e.mel ? 0.003 : isLow ? 0 : 0.007;
      const beatIdx = Math.floor(Math.max(0, e.t)) % 4;
      const vel = Math.max(0.32, Math.min(0.86, (e.v || 0.72) * contour[beatIdx] * (e.mel ? 1.0 : 0.88)));
      const overlap = art === 'staccato' ? 0 : (e.mel ? 0.038 : 0.02);
      const when = 0.1 + e.t * beatSec + roll;
      const dur = Math.max(0.09, e.d * beatSec + overlap);
      playFn(e.m, when, vel, false, dur);
      if (when + dur > maxT) maxT = when + dur;
    });
    return (maxT + 0.35) * 1000;
  }

  // Single-source-of-truth 2-bar melody rhythm extractor from piece.ev (eliminates any mismatch between played audio & 5C(ii) clap-back)
  function extractExactRhythm(ev, k, up) {
    const u0 = up || 0, twoBars = 2 * k;
    let best = null;
    for (let b = 0; b < 6; b++) {
      const start = u0 + b * k, end = start + twoBars;
      const raw = (ev || []).filter(e => e.mel && e.t >= start - 1e-4 && e.t < end - 1e-4);
      if (!raw.length) continue;
      const top = {};
      raw.forEach(e => {
        const t0 = +(e.t - start).toFixed(4);
        if (!top[t0] || e.m > top[t0].m) top[t0] = { t: t0, m: e.m };
      });
      // Ignore sub-16th ornamental MIDI grace notes (< 0.20 beats) that cannot be clapped separately
      const mel = Object.values(top).sort((a, b2) => a.t - b2.t)
        .filter((e, i, arr) => i === 0 || (e.t - arr[i - 1].t) >= 0.20);
      if (mel.length >= 3 && mel[0].t < 0.05) {
        const parts = [], rNotes = [];
        mel.forEach((e, i) => {
          if (i && Math.floor(e.t / k + 1e-6) !== Math.floor(mel[i - 1].t / k + 1e-6)) parts.push('|');
          const nextT = i + 1 < mel.length ? mel[i + 1].t : twoBars;
          const dur = +(nextT - e.t).toFixed(3);
          parts.push(String(dur));
          rNotes.push(e.m);
        });
        best = { rPat: parts.join(','), rNotes, rStart: start };
        break;
      }
    }
    return best;
  }

  function attachExactRhythm(piece) {
    const ex = extractExactRhythm(piece.ev, piece.k || 4, piece.up || 0);
    if (ex) { piece.rPat = ex.rPat; piece.rNotes = ex.rNotes; piece.rStart = ex.rStart; }
    return piece;
  }

  // Convert a real Mutopia piece from window.PIECES into a crisp 8-second excerpt + exact ev-derived rhythm pattern
  function mutopiaExcerpt(pc) {
    const u0 = pc.up || 0;
    const maxBeats = Math.min(pc.T || 16, Math.max(pc.k * 4, Math.floor(8.2 / (pc.B || 0.5))));
    const ev = (pc.ev || []).filter(e => e.t < maxBeats).map(e => ({
      t: e.t, d: e.d, m: e.m,
      v: e.mel ? Math.min(0.84, (e.v || 1) * 0.68) : Math.min(0.62, (e.v || 0.85) * 0.56),
      mel: e.mel
    }));
    const clueEn = pc.art === 'staccato'
      ? `crisp Romantic character miniature by ${pc.composer} with expressive harmonic colour and vivid phrasing`
      : `expressive Romantic lyricism by ${pc.composer} with a singing upper line over rich harmonic support`;
    const clueZh = pc.art === 'staccato'
      ? `${pc.composer}的浪漫派性格小品，颗粒感触键配合鲜明的和声色彩与乐句呼吸`
      : `${pc.composer}的浪漫派歌唱性片段，上方抒情旋律搭配宽广温润的和声伴奏`;
    const out = {
      real: true, id: pc.id, composer: pc.composer, title: pc.title,
      ev, B: pc.B || 0.5, T: maxBeats, k: pc.k, art: pc.art || 'legato', dyn: pc.dyn || 'mf',
      minor: !!pc.minor, tch: 'steady', period: 'romantic',
      evidence: { en: clueEn, zh: clueZh },
      up: u0, lh: 'real', compound: !!pc.compound
    };
    return attachExactRhythm(out);
  }

  // --- A. CADENCE (Extension: 4 voicings x 5 keys via Shuffle Bag — zero repeats!) ---
  function makeCadence(level) {
    const keys = [{ name: 'C', t: 60 }, { name: 'G', t: 67 }, { name: 'F', t: 65 }, { name: 'D', t: 62 }, { name: 'Bb', t: 58 }, { name: 'Eb', t: 63 }];
    const K = bagNext('cad-key', keys), t = K.t;
    const opts = level >= 1 ? ['perfect', 'imperfect', 'interrupted'] : ['perfect', 'imperfect'];
    const ans = bagNext('cad-ans-' + level, opts);
    const tpl = bagNext('cad-tpl-' + ans, [0, 1, 2, 3]);
    const chI   = [t - 12, t, t + 4, t + 7];
    const chI6  = [t - 8,  t, t + 7, t + 12];
    const chIhi = [t - 12, t + 4, t + 7, t + 12];
    const chIV  = [t - 7,  t, t + 5, t + 9];
    const chii  = [t - 10, t + 2, t + 5, t + 9];
    const chii6 = [t - 7,  t + 2, t + 5, t + 9];
    const chV   = [t - 5,  t - 1, t + 2, t + 7];
    const chV7  = [t - 5,  t - 1, t + 5, t + 7];
    const chvi  = [t - 3,  t, t + 4, t + 9];
    const chviB = [t - 3,  t, t + 4, t + 12];
    const banks = {
      perfect: [[chI, chIV, chV, chI], [chI, chii6, chV7, chI], [chI6, chIV, chV7, chI], [chIhi, chIV, chV, chIhi]],
      imperfect: [[chI, chIV, chI, chV], [chI, chvi, chii6, chV], [chI, chI6, chIV, chV], [chIhi, chvi, chIV, chV]],
      interrupted: [[chI, chii, chV, chvi], [chI, chIV, chV7, chviB], [chI6, chii6, chV, chvi], [chIhi, chIV, chV, chviB]]
    };
    const step = bagNext('cad-step', [0.70, 0.78, 0.86]);
    return { type: 'cadence', ans, opts, tpl, step, chords: banks[ans][tpl], key: K.name, root: t, level };
  }

  function playCadence(q, playFn, slow) {
    const step = (q.step || 0.78) * (slow ? 1.28 : 1);
    q.chords.forEach((ch, idx) => {
      const start = 0.1 + idx * step;
      const len = idx === 3 ? step * 1.7 : step * 0.96;
      ch.forEach((m, j) => playFn(m, start + j * 0.008, j === 3 ? 0.76 : j === 0 ? 0.66 : 0.54, false, len));
    });
    return (0.1 + 3 * step + step * 1.75) * 1000;
  }

  function cadenceSvg(ans, zh) {
    const W = 320, H = 88;
    const labels = zh
      ? { perfect: ['I 主和弦', '准备', 'V 属和弦', 'I 稳稳回家'], imperfect: ['I 主和弦', '展开', '过渡', 'V 悬在半空 ?'], interrupted: ['I 主和弦', '准备', 'V 属和弦', 'vi 意外小调 !'] }
      : { perfect: ['I', 'prep', 'V (tension)', 'I (home ✓)'], imperfect: ['I', 'move', 'prep', 'V (hanging ?)'], interrupted: ['I', 'prep', 'V (tension)', 'vi (surprise !)'] };
    const ys = ans === 'perfect' ? [52, 42, 26, 56] : ans === 'imperfect' ? [52, 42, 52, 24] : [52, 44, 26, 36];
    const xs = [44, 118, 194, 272];
    let s = `<div class="viz"><b>🔎 ${zh ? '和声终止式走向（拓展）' : 'Harmonic cadence arc (extension)'}</b><svg viewBox="0 0 ${W} ${H}" role="img">`;
    s += `<line x1="20" y1="56" x2="${W - 20}" y2="56" stroke="var(--line)" stroke-dasharray="4 4" stroke-width="1.5"/>`;
    s += `<polyline points="${xs.map((x, i) => x + ',' + ys[i]).join(' ')}" fill="none" stroke="var(--ink)" stroke-width="2.5" opacity=".45"/>`;
    xs.forEach((x, i) => {
      const last = i === 3;
      const col = !last ? 'var(--ink)' : ans === 'perfect' ? 'var(--good)' : 'var(--coral)';
      s += `<circle cx="${x}" cy="${ys[i]}" r="${last ? 10 : 7}" fill="${col}"/>`;
      s += `<text x="${x}" y="78" text-anchor="middle" font-size="11" font-weight="${last ? 800 : 600}" fill="${last ? col : 'var(--muted)'}">${labels[ans][i]}</text>`;
    });
    return s + '</svg></div>';
  }

  // --- C. 38-PIECE REAL CLASSICAL & MODERN REPERTOIRE BANK (6 Baroque + 6 Classical + 20 Mutopia Romantic + 6 Modern) ---
  // Dedicated textbook polyphony excerpt for Texture (Extension)
  function buildInvention1() {
    const ev = [];
    const add = (list, mel, vol, stac) => list.forEach(([t0, d, m]) => ev.push({ t: t0, d: d * (stac ? 0.72 : 0.92), m, v: vol, mel }));
    add([[0.25,0.25,60],[0.5,0.25,62],[0.75,0.25,64],[1,0.25,65],[1.25,0.25,62],[1.5,0.25,64],[1.75,0.25,60],[2,0.5,67],[2.5,0.5,72],[3,0.5,71],[3.5,0.5,72],[4,0.5,74],[4.5,0.25,67],[4.75,0.25,69],[5,0.25,71],[5.25,0.25,72],[5.5,0.25,69],[5.75,0.25,71],[6,0.25,67],[6.25,0.5,74],[6.75,0.5,79],[7.25,0.75,76]], 1, 0.76, true);
    add([[2.25,0.25,48],[2.5,0.25,50],[2.75,0.25,52],[3,0.25,53],[3.25,0.25,50],[3.5,0.25,52],[3.75,0.25,48],[4,0.5,55],[4.5,0.5,52],[5,0.5,53],[5.5,0.5,50],[6,0.5,55],[6.5,0.5,59],[7,1,60]], 0, 0.70, true);
    return { composer: 'J. S. Bach', title: 'Invention No. 1 in C (BWV 772)', ev, B: 0.52, T: 8, k: 4, art: 'staccato', dyn: 'mf', minor: false, tch: 'steady', period: 'baroque', texture: 'poly', tpl: 'inv1', up: 0, lh: 'real', compound: false };
  }

  function buildBaroque(idx) {
    const ev = [];
    const add = (list, mel, vol, stac) => list.forEach(([t0, d, m]) => ev.push({ t: t0, d: d * (stac ? 0.72 : 0.92), m, v: vol, mel }));
    if (idx === 0) {
      // J. S. Bach — Minuet in G (BWV Anh. 114, 3/4, 124 BPM)
      add([[0,1,74],[1,0.5,67],[1.5,0.5,69],[2,0.5,71],[2.5,0.5,72],[3,1,74],[4,1,67],[5,1,67],[6,1,76],[7,0.5,72],[7.5,0.5,74],[8,0.5,76],[8.5,0.5,78],[9,1,79],[10,1,67],[11,1,67]], 1, 0.76, false);
      add([[0,2,59],[0,2,55],[2,1,57],[3,3,59],[6,3,60],[9,2,59],[11,1,57]], 0, 0.60, false);
      return attachExactRhythm({ composer: 'J. S. Bach', title: 'Minuet in G (BWV Anh. 114)', ev, B: 0.48, T: 12, k: 3, art: 'legato', dyn: 'mf', minor: false, tch: 'steady', period: 'baroque', texture: 'poly', tpl: 0, up: 0, lh: 'real', compound: false,
        evidence: { en: 'graceful Baroque 3/4 court dance with clean two-part counterpoint and steady quaver motion', zh: '典雅的巴洛克三拍子小步舞曲，清晰的二声部线条与工整的八分音符流动' } });
    }
    if (idx === 1) {
      // J. S. Bach — March in D major (BWV Anh. 122, 4/4, 124 BPM — crisp two-voice Baroque counterpoint!)
      add([[0,0.5,74],[0.5,0.5,76],[1,0.5,78],[1.5,0.5,79],[2,1,81],[3,1,74],[4,0.5,79],[4.5,0.5,78],[5,0.5,76],[5.5,0.5,74],[6,1,76],[7,1,69],[8,0.5,74],[8.5,0.5,76],[9,0.5,78],[9.5,0.5,79],[10,1,81],[11,1,78],[12,1,76],[13,1,73],[14,2,74]], 1, 0.76, true);
      add([[0,1,50],[1,1,54],[2,1,57],[3,1,50],[4,1,55],[5,1,57],[6,1,52],[7,1,45],[8,1,50],[9,1,54],[10,1,57],[11,1,50],[12,1,55],[13,1,57],[14,2,50]], 0, 0.64, true);
      return attachExactRhythm({ composer: 'C. P. E. Bach (Notebook for A. M. Bach)', title: 'March in D major (BWV Anh. 122)', ev, B: 0.48, T: 16, k: 4, art: 'staccato', dyn: 'mf', minor: false, tch: 'steady', period: 'baroque', texture: 'poly', tpl: 1, up: 0, lh: 'real', compound: false,
        evidence: { en: 'crisp two-voice Baroque march with brisk walking bass and unhurried terraced rhythm', zh: '干脆利落的巴洛克二声部进行曲，清晰的行进低音与工整稳定的节奏推进' } });
    }
    if (idx === 2) {
      // Domenico Scarlatti — Minuet from Sonata in A, Kp. 83 (3 time, 142 BPM — 2027 ABRSM G4 A:1!)
      add([[0,1,73],[1,1,76],[2,1,81],[3,1,76],[4,0.5,74],[4.5,0.5,73],[5,0.5,71],[5.5,0.5,69],[6,1,73],[7,1,71],[8,1,69],[9,1,68],[10,1,71],[11,1,76]], 1, 0.76, true);
      add([[0,3,57],[3,3,56],[6,3,57],[9,3,52]], 0, 0.58, false);
      return attachExactRhythm({ composer: 'D. Scarlatti', title: 'Minuet (Sonata in A, Kp. 83)', ev, B: 0.42, T: 12, k: 3, art: 'staccato', dyn: 'mf', minor: false, tch: 'steady', period: 'baroque', texture: 'melacc', tpl: 2, up: 0, lh: 'real', compound: false,
        evidence: { en: 'harpsichord-like Scarlatti keyboard clarity with crisp arpeggio leaps and agile scale turns', zh: '斯卡拉蒂羽管键琴般的颗粒感音色，干脆的分解和弦跳进与灵巧音阶转折' } });
    }
    if (idx === 3) {
      // J. C. F. Bach — Scherzo in D minor (2/4, 128 BPM — 2027 ABRSM G4 A:2!)
      add([[0,0.5,62],[0.5,0.5,64],[1,0.5,65],[1.5,0.5,67],[2,0.25,69],[2.25,0.25,67],[2.5,0.25,65],[2.75,0.25,64],[3,0.5,69],[3.5,0.5,62],[4,0.5,61],[4.5,0.5,64],[5,0.5,67],[5.5,0.5,65],[6,1,64],[7,1,62]], 1, 0.76, true);
      add([[0,1,50],[1,1,53],[2,1,57],[3,1,50],[4,1,55],[5,1,57],[6,1,45],[7,1,50]], 0, 0.62, true);
      return attachExactRhythm({ composer: 'J. C. F. Bach', title: 'Scherzo in D minor', ev, B: 0.47, T: 8, k: 2, art: 'staccato', dyn: 'mf', minor: true, tch: 'steady', period: 'baroque', texture: 'poly', tpl: 3, up: 0, lh: 'real', compound: false,
        evidence: { en: 'agile Baroque/early-Classical two-part writing with detached 16th-note turns and clear D-minor leading tones', zh: '灵巧的二声部织体、颗粒感十六分音符装饰音型与鲜明的 D 小调和声导音' } });
    }
    if (idx === 4) {
      // Henry Purcell — Minuet in A minor (Z. 649, 3/4, 108 BPM — expressive slow Baroque!)
      add([[0,1,69],[1,1,71],[2,1,72],[3,1.5,71],[4.5,0.5,69],[5,1,68],[6,1,69],[7,1,76],[8,1,74],[9,2,72],[11,1,71]], 1, 0.74, false);
      add([[0,1,57],[1,1,56],[2,1,57],[3,1,52],[4,1,50],[5,1,52],[6,1,57],[7,1,55],[8,1,53],[9,2,52],[11,1,56]], 0, 0.66, false);
      return attachExactRhythm({ composer: 'H. Purcell', title: 'Minuet in A minor (Z. 649)', ev, B: 0.55, T: 12, k: 3, art: 'legato', dyn: 'mf', minor: true, tch: 'steady', period: 'baroque', texture: 'poly', tpl: 4, up: 0, lh: 'real', compound: false,
        evidence: { en: 'poised Baroque minor-key minuet with independent contrary-motion bass and dotted cadence suspension', zh: '克制优雅的巴洛克小调小步舞曲，独立的反向低音声部与附点终止式色彩' } });
    }
    // G. F. Handel — Sarabande in D minor (HWV 437, 3/4, 96 BPM — stately slow chordal Baroque!)
    const chs = [
      [0,1,[50,57,62,65]],[1,2,[50,57,62,65]],[3,1,[48,55,60,64]],[4,2,[48,55,60,64]],
      [6,1,[53,57,60,65]],[7,2,[53,57,60,69]],[9,1,[52,55,60,67]],[10,2,[45,57,61,64]]
    ];
    chs.forEach(([t0,d,ch]) => ch.forEach((m,j) => ev.push({ t: t0, d: d * 0.94, m, v: j === 3 ? 0.76 : 0.56, mel: j === 3 ? 1 : 0 })));
    return attachExactRhythm({ composer: 'G. F. Handel', title: 'Sarabande in D minor (HWV 437)', ev, B: 0.62, T: 12, k: 3, art: 'legato', dyn: 'mf', minor: true, tch: 'steady', period: 'baroque', texture: 'chordal', tpl: 5, up: 0, lh: 'real', compound: false,
      evidence: { en: 'stately Baroque Sarabande with solemn second-beat emphasis and noble minor-key chord progressions', zh: '庄严的巴洛克萨拉班德舞曲，第二拍延长重音与肃穆的柱式和弦序列' } });
  }

  function buildClassical(idx) {
    const ev = [];
    const add = (list, mel, vol, stac) => list.forEach(([t0, d, m]) => ev.push({ t: t0, d: d * (stac ? 0.68 : 0.92), m, v: vol, mel }));
    if (idx === 0) {
      // W. A. Mozart — Piano Sonata in C (K. 545, 4/4, 130 BPM — iconic Alberti bass!)
      add([[0,2,72],[2,1,76],[3,1,79],[4,1.5,71],[5.5,0.25,72],[5.75,0.25,74],[6,2,72],[8,2,81],[10,1,79],[11,1,72]], 1, 0.78, false);
      const alb = [48,55,52,55, 48,55,52,55, 50,55,53,55, 48,55,52,55, 48,57,53,57, 48,55,52,55];
      alb.forEach((m, i) => ev.push({ t: i * 0.5, d: 0.44, m, v: 0.46, mel: 0 }));
      return attachExactRhythm({ composer: 'W. A. Mozart', title: 'Sonata in C (K. 545)', ev, B: 0.46, T: 12, k: 4, art: 'legato', dyn: 'mf', minor: false, tch: 'steady', period: 'classical', texture: 'melacc', tpl: 0, up: 0, lh: 'real', compound: false,
        evidence: { en: 'textbook Classical Alberti-bass accompaniment supporting a crystal-clear, symmetrical melody', zh: '教科书级的古典阿尔贝蒂低音伴奏，托起对称、清澈透明的右手旋律' } });
    }
    if (idx === 1) {
      // Muzio Clementi — Sonatina in C (Op. 36 No. 1, 4/4, 154 BPM — bright Classical Allegro!)
      add([[0,1,72],[1,0.5,76],[1.5,0.5,72],[2,1,79],[3,1,72],[4,1,74],[5,0.5,72],[5.5,0.5,71],[6,2,72],[8,0.5,76],[8.5,0.5,74],[9,0.5,72],[9.5,0.5,71],[10,1,74],[11,1,72]], 1, 0.78, true);
      add([[0,2,48],[2,2,52],[4,2,55],[6,2,48],[8,2,53],[10,1,55],[11,1,48]], 0, 0.52, true);
      return attachExactRhythm({ composer: 'M. Clementi', title: 'Sonatina in C (Op. 36 No. 1)', ev, B: 0.39, T: 12, k: 4, art: 'staccato', dyn: 'mf', minor: false, tch: 'steady', period: 'classical', texture: 'melacc', tpl: 1, up: 0, lh: 'real', compound: false,
        evidence: { en: 'bright Classical Sonatina style with clean triadic motif, light bass and crisp cadence punctuation', zh: '明快的古典小奏鸣曲风格，干净的三和弦动机、轻盈低音与工整终止句读' } });
    }
    if (idx === 2) {
      // Joseph Haydn — German Dance in D (Hob. IX:22, 3/4, 138 BPM)
      add([[0,0.5,74],[0.5,0.5,78],[1,1,81],[2,1,81],[3,0.5,79],[3.5,0.5,76],[4,1,73],[5,1,73],[6,0.5,74],[6.5,0.5,78],[7,1,81],[8,1,79],[9,1,78],[10,1,76],[11,1,74]], 1, 0.78, true);
      add([[0,1,50],[1,1,57],[2,1,57],[3,1,45],[4,1,55],[5,1,55],[6,1,50],[7,1,57],[8,1,55],[9,1,50],[10,1,57],[11,1,50]], 0, 0.52, true);
      return attachExactRhythm({ composer: 'J. Haydn', title: 'German Dance in D (Hob. IX:22)', ev, B: 0.43, T: 12, k: 3, art: 'staccato', dyn: 'mf', minor: false, tch: 'steady', period: 'classical', texture: 'melacc', tpl: 2, up: 0, lh: 'real', compound: false,
        evidence: { en: 'witty Classical 3/4 dance with light “oom-pah-pah” accompaniment and balanced 2-bar question-and-answer phrases', zh: '机智轻快的古典三拍子舞曲，规整的“咚嚓嚓”伴奏与对称的问答式短句' } });
    }
    if (idx === 3) {
      // L. van Beethoven — Sonatina in G (Anh. 5 No. 1, 4/4, 118 BPM)
      add([[0,1,71],[1,0.5,74],[1.5,0.5,79],[2,1,78],[3,1,76],[4,1,74],[5,0.5,72],[5.5,0.5,71],[6,2,69],[8,1,71],[9,0.5,74],[9.5,0.5,79],[10,1,76],[11,1,74]], 1, 0.76, false);
      const alb = [55,59,62,59, 55,60,64,60, 55,59,62,59, 54,57,62,57, 55,59,62,59, 55,60,64,60];
      alb.forEach((m, i) => ev.push({ t: i * 0.5, d: 0.44, m, v: 0.46, mel: 0 }));
      return attachExactRhythm({ composer: 'L. van Beethoven', title: 'Sonatina in G (Anh. 5 No. 1)', ev, B: 0.51, T: 12, k: 4, art: 'legato', dyn: 'mf', minor: false, tch: 'steady', period: 'classical', texture: 'melacc', tpl: 3, up: 0, lh: 'real', compound: false,
        evidence: { en: 'poised Classical melody over gentle Alberti-style broken chords, resolving neatly to a half cadence', zh: '典雅平稳的古典旋律配轻柔阿尔贝蒂分解和弦，句尾干净落向半终止' } });
    }
    if (idx === 4) {
      // W. A. Mozart — Minuet in F (K. 2, 3/4, 112 BPM — slower Classical Minuet!)
      add([[0,1,77],[1,1,72],[2,1,69],[3,1,70],[4,1,74],[5,1,72],[6,0.5,70],[6.5,0.5,69],[7,1,67],[8,1,72],[9,2,69],[11,1,65]], 1, 0.76, false);
      add([[0,2,53],[2,1,57],[3,2,58],[5,1,57],[6,2,55],[8,1,48],[9,3,53]], 0, 0.52, false);
      return attachExactRhythm({ composer: 'W. A. Mozart', title: 'Minuet in F (K. 2)', ev, B: 0.53, T: 12, k: 3, art: 'legato', dyn: 'mf', minor: false, tch: 'steady', period: 'classical', texture: 'melacc', tpl: 4, up: 0, lh: 'real', compound: false,
        evidence: { en: 'galant Classical minuet with simple transparent two-part texture and poised symmetrical phrases', zh: '典雅清透的早期古典小步舞曲，织体简洁干净、乐句工整对称' } });
    }
    // Friedrich Kuhlau — Sonatina in C (Op. 20 No. 1, 4/4, 138 BPM)
    add([[0,1.5,76],[1.5,0.5,72],[2,1,79],[3,1,76],[4,1.5,77],[5.5,0.5,74],[6,2,72],[8,1.5,74],[9.5,0.5,76],[10,1,77],[11,1,74]], 1, 0.78, false);
    const alb = [48,55,52,55, 48,55,52,55, 50,55,53,55, 48,55,52,55, 50,55,53,55, 50,55,53,55];
    alb.forEach((m, i) => ev.push({ t: i * 0.5, d: 0.44, m, v: 0.46, mel: 0 }));
    return attachExactRhythm({ composer: 'F. Kuhlau', title: 'Sonatina in C (Op. 20 No. 1)', ev, B: 0.43, T: 12, k: 4, art: 'legato', dyn: 'mf', minor: false, tch: 'steady', period: 'classical', texture: 'melacc', tpl: 5, up: 0, lh: 'real', compound: false,
      evidence: { en: 'classic Viennese Sonatina opening: dotted lyric melody above a brisk, transparent Alberti bass', zh: '典型维也纳古典小奏鸣曲开篇：附点歌唱旋律配轻快透明的阿尔贝蒂低音' } });
  }

  function buildModern(idx) {
    const r = bagNext('mod-root', [60, 62, 65, 67]);
    const ev = [];
    if (idx === 0) {
      // Bartók-style Folk Ostinato (2/4, 150 BPM, minor-2nd clusters — non-tonal!)
      const rh = [[0,0.5,13],[0.5,0.5,18],[1,0.5,17],[1.5,0.5,11],[2,1,18],[3,0.5,12],[3.5,0.5,13],[4,0.5,19],[4.5,0.5,13],[5,0.5,12],[5.5,0.5,6],[6,1,13],[7,1,18]];
      rh.forEach(([t0,d,off]) => ev.push({ t: t0, d: d * 0.52, m: r + off, v: t0 < 4 ? 0.84 : 0.58, mel: 1 }));
      for (let i = 0; i < 8; i++) { ev.push({ t: i, d: 0.42, m: r - 12, v: i < 4 ? 0.68 : 0.46, mel: 0 }); ev.push({ t: i, d: 0.42, m: r - 11, v: i < 4 ? 0.62 : 0.42, mel: 0 }); }
      return attachExactRhythm({ composer: 'Style Study (after Bartók)', title: 'Folk Ostinato', isStudy: true, noTon: true, ev, B: 0.40, T: 8, k: 2, art: 'staccato', dyn: 'fp', minor: true, tch: 'steady', period: 'modern', tpl: 0, up: 0, lh: 'real', compound: false,
        evidence: { en: 'percussive minor-2nd ostinato clusters in the bass with angular folk leaps and sudden fp contrast', zh: '左手极具打击感的小二度音簇固定低音，配棱角分明的旋律跳进与突强突弱对比' } });
    }
    if (idx === 1) {
      // Debussy-style Whole-Tone Reflection (4/4, 100 BPM — slow Impressionist Modern, non-tonal!)
      const mel = [[0,1.5,14],[1.5,0.5,16],[2,1,18],[3,1,20],[4,1.5,18],[5.5,0.5,16],[6,2,14]];
      mel.forEach(([t0,d,off]) => ev.push({ t: t0, d: d * 1.04, m: r + off, v: 0.72, mel: 1 }));
      [[0,[-12,-6,-2,2]],[2,[-10,-4,0,4]],[4,[-8,-2,2,6]],[6,[-12,-6,-2,2]]].forEach(([t0,ch]) => ch.forEach((off,j) => ev.push({ t: t0 + j*0.09, d: 1.9, m: r + off, v: 0.46, mel: 0 })));
      return attachExactRhythm({ composer: 'Style Study (after Debussy)', title: 'Whole-Tone Prelude', isStudy: true, noTon: true, ev, B: 0.60, T: 8, k: 4, art: 'legato', dyn: 'dim', minor: false, tch: 'steady', period: 'modern', tpl: 1, up: 0, lh: 'real', compound: false,
        evidence: { en: 'floating Impressionist whole-tone scale and parallel colouristic chords without a traditional cadence', zh: '漂浮朦胧的印象派全音阶与平行色彩和弦，没有传统主属终止式归属感' } });
    }
    if (idx === 2) {
      // Prokofiev-style Quirky Staccato March (4/4, 134 BPM — chromatic/sardonic!)
      const rh = [[0,1,12],[1,0.5,15],[1.5,0.5,18],[2,1,17],[3,1,11],[4,1,12],[5,0.5,13],[5.5,0.5,18],[6,1,19],[7,1,12]];
      const lh = [[0,1,-12],[1,1,-6],[2,1,-11],[3,1,-5],[4,1,-12],[5,1,-6],[6,1,-1],[7,1,-12]];
      rh.forEach(([t0,d,off]) => ev.push({ t: t0, d: d * 0.56, m: r + off, v: t0 >= 4 ? 0.84 : 0.60, mel: 1 }));
      lh.forEach(([t0,d,off]) => ev.push({ t: t0, d: d * 0.56, m: r + off, v: t0 >= 4 ? 0.64 : 0.46, mel: 0 }));
      return attachExactRhythm({ composer: 'Style Study (after Prokofiev)', title: 'Quirky Staccato March', isStudy: true, noTon: true, ev, B: 0.45, T: 8, k: 4, art: 'staccato', dyn: 'pf', minor: true, tch: 'steady', period: 'modern', tpl: 2, up: 0, lh: 'real', compound: false,
        evidence: { en: 'wry 20th-century march with spiky staccato touch, tritone bass steps and unexpected chromatic twists', zh: '诙谐尖锐的 20 世纪断奏进行曲，低音三全音跳动与出人意料的半音转折' } });
    }
    if (idx === 3) {
      // Satie-style Modal Gymnopédie (3/4, 96 BPM — slow floating major-7th chords, modal!)
      const mel = [[3,1,16],[4,1,19],[5,1,18],[6,1,14],[7,1,11],[8,1,14],[9,3,16]];
      mel.forEach(([t0,d,off]) => ev.push({ t: t0, d: d * 1.02, m: r + off, v: 0.68, mel: 1 }));
      [[0,-12,[0,4,11]],[3,-17,[-5,2,7]],[6,-12,[0,4,11]],[9,-17,[-5,2,7]]].forEach(([t0,bs,ch]) => {
        ev.push({ t: t0, d: 2.8, m: r + bs, v: 0.50, mel: 0 });
        ch.forEach(off => ev.push({ t: t0 + 1, d: 1.8, m: r + off, v: 0.42, mel: 0 }));
      });
      return attachExactRhythm({ composer: 'Style Study (after Satie)', title: 'Modal Gymnopédie', isStudy: true, noTon: true, ev, B: 0.62, T: 12, k: 3, art: 'legato', dyn: 'mf', minor: false, tch: 'steady', period: 'modern', tpl: 3, up: 0, lh: 'real', compound: false,
        evidence: { en: 'sparse, hypnotic 20th-century modal harmony rocking slowly between unresolved major-7th chords', zh: '极简疏离的 20 世纪调式和声，在悬浮未解决的大七和弦之间缓慢摇曳' } });
    }
    if (idx === 4) {
      // Kabalevsky-style Playful Toccatina (2/4, 152 BPM — sharp bitonal/chromatic jumps!)
      const rh = [[0,0.5,12],[0.5,0.5,15],[1,0.5,16],[1.5,0.5,19],[2,0.5,18],[2.5,0.5,15],[3,1,12],[4,0.5,13],[4.5,0.5,16],[5,0.5,17],[5.5,0.5,20],[6,1,19],[7,1,12]];
      const lh = [[0,0.5,-12],[0.5,0.5,-5],[1,0.5,-12],[1.5,0.5,-6],[2,0.5,-12],[2.5,0.5,-5],[3,1,-12],[4,0.5,-11],[4.5,0.5,-4],[5,0.5,-11],[5.5,0.5,-5],[6,1,-12],[7,1,-12]];
      rh.forEach(([t0,d,off]) => ev.push({ t: t0, d: d * 0.52, m: r + off, v: 0.80, mel: 1 }));
      lh.forEach(([t0,d,off]) => ev.push({ t: t0, d: d * 0.52, m: r + off, v: 0.56, mel: 0 }));
      return attachExactRhythm({ composer: 'Style Study (after Kabalevsky)', title: 'Playful Toccatina', isStudy: true, noTon: true, ev, B: 0.39, T: 8, k: 2, art: 'staccato', dyn: 'mf', minor: true, tch: 'steady', period: 'modern', tpl: 4, up: 0, lh: 'real', compound: false,
        evidence: { en: 'motoric 20th-century toccatina with clashing major/minor 3rds and snappy chromatic bass shifts', zh: '机械律动感十足的 20 世纪小托卡塔，大小三度撞击与突然移位的半音低音' } });
    }
    // Stravinsky-style Syncopated Miniature (4/4, 126 BPM — syncopated & dissonant!)
    const rh = [[0,0.5,16],[0.5,1,19],[1.5,0.5,18],[2,0.5,14],[2.5,1,13],[3.5,0.5,16],[4,0.5,17],[4.5,1,22],[5.5,0.5,19],[6,1,18],[7,1,16]];
    const lh = [[0,1,-12],[1,1,-5],[2,1,-11],[3,1,-6],[4,1,-12],[5,1,-5],[6,1,-6],[7,1,-12]];
    rh.forEach(([t0,d,off]) => ev.push({ t: t0, d: d * 0.62, m: r + off, v: 0.78, mel: 1 }));
    lh.forEach(([t0,d,off]) => ev.push({ t: t0, d: d * 0.62, m: r + off, v: 0.58, mel: 0 }));
    return attachExactRhythm({ composer: 'Style Study (after Stravinsky)', title: 'Syncopated Miniature', isStudy: true, noTon: true, ev, B: 0.47, T: 8, k: 4, art: 'staccato', dyn: 'mf', minor: true, tch: 'steady', period: 'modern', tpl: 5, up: 0, lh: 'real', compound: false,
      evidence: { en: 'off-beat neo-classical syncopations paired with dry staccato fifths and sharp dissonant accents', zh: '干脆的新古典切分重音、空五度与不协和尖锐重拍，极具 20 世纪节奏张力' } });
  }

  function buildRomanticFromLibrary(forExam) {
    if (window.PIECES && window.PIECES.length) {
      const simple = window.PIECES.filter(p => !p.compound);
      let pool = simple;
      if (forExam) {
        // Only include excerpts whose ev yields a clean, tappable 2-bar downbeat melody (4..12 notes)
        pool = simple.filter(p => {
          const ex = extractExactRhythm(p.ev, p.k, p.up || 0);
          return ex && ex.rNotes.length >= 4 && ex.rNotes.length <= 12;
        });
      }
      const pc = bagNext(forExam ? 'rom-exam' : 'rom-real', pool.length ? pool : simple);
      return mutopiaExcerpt(pc);
    }
    // Fallback only if pieces.js not loaded
    const r = bagNext('rom-root', [60, 62, 65, 67]), ev = [];
    [[0,1.5,16],[1.5,0.5,17],[2,1.5,19],[3.5,0.5,16],[4,1,14],[5,1,12],[6,2,11]].forEach(([t0,d,off]) => ev.push({ t: t0, d, m: r+off, v: 0.76, mel: 1 }));
    [[0,[-12,-5,0,4]],[2,[-15,-8,-3,0]],[4,[-10,-3,2,5]],[6,[-17,-10,-5,-1]]].forEach(([t0,ch]) => ch.forEach((off,j) => ev.push({ t: t0+j*0.14, d: 1.9, m: r+off, v: 0.46, mel: 0 })));
    return attachExactRhythm({ composer: 'Style Study (Romantic)', title: 'Lyrical Nocturne', isStudy: true, ev, B: 0.53, T: 8, k: 4, art: 'legato', dyn: 'dim', minor: false, tch: 'steady', period: 'romantic', tpl: 0, up: 0, lh: 'real', compound: false,
      evidence: { en: 'singing Romantic cantabile melody over warm rolled arpeggios and gentle diminuendo', zh: '歌唱性浪漫派旋律配温暖的分解琶音伴奏与柔和渐弱' } });
  }

  function pickPeriodPiece(period, forExam) {
    if (period === 'baroque') return buildBaroque(bagNext(forExam ? 'ex-baroque' : 'sty-baroque', [0, 1, 2, 3, 4, 5]));
    if (period === 'classical') return buildClassical(bagNext(forExam ? 'ex-classical' : 'sty-classical', [0, 1, 2, 3, 4, 5]));
    if (period === 'romantic') return buildRomanticFromLibrary(forExam);
    return buildModern(bagNext(forExam ? 'ex-modern' : 'sty-modern', [0, 1, 2, 3, 4, 5]));
  }

  function makeStyle(level) {
    const opts = level >= 1 ? ['baroque', 'classical', 'romantic', 'modern'] : ['baroque', 'romantic', 'modern'];
    const ans = bagNext('sty-ans-' + level, opts);
    const piece = pickPeriodPiece(ans, false);
    return { type: 'style', ans, opts, tpl: piece.id || (ans + ':' + piece.tpl), piece, level };
  }

  function playStyle(q, playFn, slow) {
    const pc = q.piece || pickPeriodPiece(q.ans, false);
    const b = (pc.B || 0.46) * (slow ? 1.28 : 1);
    return playHumanized(pc.ev, b, playFn, pc.art);
  }

  function styleSayIt(ans, zh, piece) {
    const eraName = zh
      ? { baroque: '巴洛克时期', classical: '古典时期', romantic: '浪漫时期', modern: '20 世纪 / 现代时期' }[ans]
      : { baroque: 'Baroque', classical: 'Classical', romantic: 'Romantic', modern: '20th Century / Modern' }[ans];
    const fallback = zh ? {
      baroque: '声部线条独立清晰、节奏推进稳定工整，带有干脆的装饰音或复调感',
      classical: '乐句对称清晰，伴奏规整轻巧（如阿尔贝蒂低音），和声干净透明',
      romantic: '旋律充满歌唱性，和声宽广浓厚，力度起伏明显并富有情感呼吸',
      modern: '包含不协和音程（二度/三全音/全音阶）、棱角分明的节奏或突发强弱对比'
    }[ans] : {
      baroque: 'independent polyphonic lines, steady rhythmic drive, and crisp ornamentation',
      classical: 'balanced, symmetrical phrases with a light, transparent accompaniment and clear cadences',
      romantic: 'a singing cantabile melody, richer wide harmonies, and expressive dynamic shaping',
      modern: 'dissonant harmonies (clusters or whole-tone colours), angular rhythms, and sharp contrasts'
    }[ans];
    const evText = (piece && piece.evidence && (zh ? piece.evidence.zh : piece.evidence.en)) || fallback;
    const quote = zh ? `「这听起来像${eraName}：${evText}。」` : `“This sounds ${eraName}: ${evText}.”`;
    const badge = piece && piece.isStudy ? (zh ? '（教学风格仿作）' : ' (teaching style study)') : '';
    const tag = piece && piece.composer ? `<div class="small muted" style="margin-top:6px">♪ ${piece.composer} · ${piece.title}${badge}</div>` : '';
    return `<div class="say-it">${zh ? '考场可以这样说：' : 'In the exam you could say: '}<q>${quote}</q>${tag}</div>`;
  }

  // Unified ExamPiece builder for Grade 5 Test 5C(i) + 5C(ii): 30 verified 100%-ev-consistent excerpts across ALL 4 official periods
  function makeExamPiece5() {
    const period = bagNext('g5c-period', ['baroque', 'classical', 'romantic', 'modern']);
    return pickPeriodPiece(period, true);
  }

  // --- B. TEXTURE (Extension: 18+ real & classical excerpts via Shuffle Bag — zero repeats!) ---
  function buildTexturePiece(ans) {
    const byId = id => (window.PIECES || []).find(p => p.id === id);
    if (ans === 'chordal') {
      const slot = bagNext('tex-chordal', ['handel', 's04', 't01', 'syn0', 'syn1', 'syn2']);
      if (slot === 'handel') return buildBaroque(5);
      if ((slot === 's04' || slot === 't01') && byId(slot)) return mutopiaExcerpt(byId(slot));
      const r = bagNext('tex-root', [60, 62, 65, 67]), ev = [];
      if (slot === 'syn0') {
        [[r-12,r,r+4,r+7],[r-7,r,r+5,r+9],[r-5,r-1,r+2,r+7],[r-12,r,r+4,r+7],[r-3,r,r+4,r+9],[r-10,r+2,r+5,r+9],[r-5,r-1,r+2,r+7],[r-12,r,r+4,r+7]]
          .forEach((ch, i) => { const d = (i === 3 || i === 7) ? 2 : 1, t0 = i < 4 ? i : i + 1; ch.forEach((m, j) => ev.push({ t: t0, d: d * 0.94, m, v: j === 3 ? 0.76 : 0.54, mel: j === 3 ? 1 : 0 })); });
        return { composer: 'Chorale Study', title: 'Four-Part Hymn', ev, B: 0.52, art: 'legato', tpl: 'syn0' };
      }
      if (slot === 'syn1') {
        [[0,0.75,[r-12,r,r+4,r+7]],[0.75,0.25,[r-12,r,r+4,r+7]],[1,1,[r-7,r,r+5,r+9]],[2,0.5,[r-5,r-1,r+2,r+7]],[2.5,0.5,[r-5,r-1,r+2,r+7]],[3,1,[r-12,r,r+4,r+7]],[4,0.75,[r-10,r+2,r+5,r+9]],[4.75,0.25,[r-5,r-1,r+2,r+7]],[5,1,[r-3,r,r+4,r+9]],[6,1,[r-5,r-1,r+2,r+7]],[7,1.5,[r-12,r,r+4,r+7]]]
          .forEach(([t0,d,ch]) => ch.forEach((m, j) => ev.push({ t: t0, d: d * 0.76, m, v: j === 3 ? 0.78 : 0.58, mel: j === 3 ? 1 : 0 })));
        return { composer: 'Chordal Study', title: 'Brisk Processional', ev, B: 0.40, art: 'staccato', tpl: 'syn1' };
      }
      [[0,2,[r-12,r+4,r+7,r+12]],[2,1,[r-12,r+2,r+7,r+11]],[3,2,[r-7,r+5,r+9,r+12]],[5,1,[r-7,r+4,r+7,r+12]],[6,2,[r-5,r+2,r+7,r+11]],[8,1,[r-5,r+2,r+5,r+11]],[9,3,[r-12,r+4,r+7,r+12]]]
        .forEach(([t0,d,ch]) => ch.forEach((m, j) => ev.push({ t: t0, d: d * 0.94, m, v: j === 3 ? 0.76 : 0.54, mel: j === 3 ? 1 : 0 })));
      return { composer: 'Chorale Study', title: '3/4 Anthem', ev, B: 0.48, art: 'legato', tpl: 'syn2' };
    }
    if (ans === 'melacc') {
      const slot = bagNext('tex-melacc', ['mozart', 'kuhlau', 'beethoven', 's01', 'b03', 'b16', 't16']);
      if (slot === 'mozart') return buildClassical(0);
      if (slot === 'kuhlau') return buildClassical(5);
      if (slot === 'beethoven') return buildClassical(3);
      if (byId(slot)) return mutopiaExcerpt(byId(slot));
      return buildClassical(0);
    }
    // Polyphonic / Contrapuntal (6 distinct real Baroque & canon excerpts!)
    const slot = bagNext('tex-poly', ['bachInv', 'bachMin', 'purcell', 'jcf', 'canonSlow', 'contrary']);
    if (slot === 'bachInv') return buildInvention1();
    if (slot === 'bachMin') return buildBaroque(0);
    if (slot === 'purcell') return buildBaroque(4);
    if (slot === 'jcf') return buildBaroque(3);
    const r = bagNext('tex-proot', [60, 62, 65, 67]), ev = [], scale = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16];
    const degM = (base, deg) => base + (scale[deg] != null ? scale[deg] : 0);
    if (slot === 'canonSlow') {
      const subj = [[0,1,4],[1,0.5,5],[1.5,0.5,7],[2,1,5],[3,1,4],[4,1,2],[5,0.5,4],[5.5,0.5,2],[6,2,0]];
      subj.forEach(([t0,d,deg]) => ev.push({ t: t0, d: d * 0.95, m: degM(r + 7, deg), v: 0.76, mel: 1 }));
      subj.slice(0, 7).forEach(([t0,d,deg]) => ev.push({ t: t0 + 2, d: d * 0.95, m: degM(r - 5, deg), v: 0.72, mel: 0 }));
      return { composer: 'Contrapuntal Study', title: 'Lyrical Two-Part Canon', ev, B: 0.54, art: 'legato', tpl: 'canonSlow' };
    }
    const rh = [[0,0.5,0],[0.5,0.5,1],[1,0.5,2],[1.5,0.5,4],[2,1,5],[3,1,4],[4,0.5,7],[4.5,0.5,5],[5,0.5,4],[5.5,0.5,2],[6,1,1],[7,1.5,0]];
    const lh = [[0,1,7],[1,1,5],[2,0.5,4],[2.5,0.5,2],[3,0.5,1],[3.5,0.5,0],[4,1,2],[5,1,4],[6,0.5,5],[6.5,0.5,4],[7,1.5,0]];
    rh.forEach(([t0,d,deg]) => ev.push({ t: t0, d: d * 0.84, m: degM(r + 12, deg), v: 0.76, mel: 1 }));
    lh.forEach(([t0,d,deg]) => ev.push({ t: t0, d: d * 0.86, m: degM(r - 12, deg), v: 0.72, mel: 0 }));
    return { composer: 'Contrapuntal Study', title: 'Contrary-Motion Invention', ev, B: 0.44, art: 'staccato', tpl: 'contrary' };
  }

  function makeTexture(level) {
    const opts = level >= 1 ? ['chordal', 'melacc', 'poly'] : ['chordal', 'poly'];
    const ans = bagNext('tex-ans-' + level, opts);
    const piece = buildTexturePiece(ans);
    return { type: 'texture', ans, opts, tpl: piece.id || piece.title, piece, level };
  }

  function playTexture(q, playFn, slow) {
    const pc = q.piece || buildTexturePiece(q.ans);
    const b = (pc.B || 0.46) * (slow ? 1.28 : 1);
    return playHumanized(pc.ev, b, playFn, pc.art);
  }

  function textureSvg(ans, zh, piece) {
    const W = 320, H = 86;
    let body = '';
    if (ans === 'chordal') {
      [26, 78, 130, 182, 234, 276].forEach(x => {
        body += `<rect x="${x}" y="18" width="24" height="46" rx="6" fill="var(--ink)" opacity=".75"/>`;
        [26, 38, 50].forEach(y => { body += `<circle cx="${x + 12}" cy="${y}" r="3.2" fill="#fff"/>`; });
      });
    } else if (ans === 'melacc') {
      body += `<path d="M 20 26 Q 90 12, 160 28 T 300 22" fill="none" stroke="var(--coral)" stroke-width="4" stroke-linecap="round"/>`;
      for (let i = 0; i < 14; i++) { const x = 22 + i * 20, y = i % 2 === 0 ? 58 : 48; body += `<circle cx="${x}" cy="${y}" r="3.5" fill="var(--ink)" opacity=".45"/>`; }
    } else {
      body += `<path d="M 20 26 L 60 18 L 105 30 L 155 18 L 210 28 L 296 22" fill="none" stroke="var(--coral)" stroke-width="3.2" stroke-linecap="round"/>`;
      body += `<path d="M 76 58 L 116 48 L 160 60 L 210 48 L 260 58 L 298 52" fill="none" stroke="var(--good)" stroke-width="3.2" stroke-linecap="round"/>`;
    }
    const cap = zh
      ? { chordal: '多声部齐步走（和弦柱式织体）', melacc: '上方歌唱旋律 + 下方规整伴奏', poly: '两只手各自独立对话（复调织体）' }[ans]
      : { chordal: 'Voices move together in chord blocks', melacc: 'Singing melody above steady accompaniment', poly: 'Two independent lines conversing (contrapuntal)' }[ans];
    const tag = piece && piece.composer ? `<div class="small muted" style="margin-top:4px">♪ ${piece.composer} · ${piece.title}</div>` : '';
    return `<div class="viz"><b>🔎 ${zh ? '织体透视图（拓展）' : 'Texture map (extension)'}: ${cap}</b><svg viewBox="0 0 ${W} ${H}" role="img">${body}</svg>${tag}</div>`;
  }

  // --- D. COMPOUND 6/8 METER GENERATOR (Extension: meter level 3) ---
  function makeMeter68() {
    const k = pick([2, 3, 4, 6]);
    const SCALE = [60, 62, 64, 65, 67, 69, 71, 72];
    if (k !== 6) {
      const bars = k === 4 ? 3 : k === 3 ? 4 : 5;
      let d = 2 + rnd(4); const ev = [];
      for (let b = 0; b < bars; b++) for (let i = 0; i < k; i++) {
        d = Math.max(0, Math.min(7, d + pick([-1, 0, 1, 1, -1])));
        const split = i > 0 && Math.random() < 0.35;
        ev.push({ m: SCALE[d], beat: i, bar: b, half: false });
        if (split) { const d2 = Math.max(0, Math.min(7, d + pick([-1, 1]))); ev.push({ m: SCALE[d2], beat: i, bar: b, half: true }); }
      }
      return { type: 'meter', k, bars, ev, level: 3, accent: 0.8 };
    }
    const bars = 4; let d = 2 + rnd(4); const ev = [];
    for (let b = 0; b < bars; b++) {
      for (let beat = 0; beat < 2; beat++) {
        const pat = pick([[0, 1/3, 2/3], [0, 2/3], [0, 1/3, 2/3]]);
        pat.forEach((sub, si) => {
          d = Math.max(0, Math.min(7, d + pick([-1, 1, 1, -1, 0])));
          ev.push({ m: SCALE[d], beat, bar: b, sub, strong: beat === 0 && si === 0, mid: beat === 1 && si === 0 });
        });
      }
    }
    return { type: 'meter', k: 6, bars, ev, level: 3, accent: 0.85, compound: true };
  }

  function playMeter68(q, playFn, tickFn, slow, count) {
    const beat = slow ? 0.96 : 0.76;
    let maxW = 0;
    q.ev.forEach(e => {
      const when = 0.1 + (e.bar * 2 + e.beat + (e.sub || 0)) * beat;
      const vol = e.strong ? 0.94 : e.mid ? 0.72 : 0.44;
      playFn(e.m, when, vol);
      if (e.strong) playFn(e.bar % 2 ? 43 : 48, when, 0.62);
      else if (e.mid) playFn(55, when, 0.36);
      if (when > maxW) maxW = when;
    });
    if (count) {
      for (let b = 0; b < q.bars; b++) { tickFn(0.1 + (b * 2) * beat, true); tickFn(0.1 + (b * 2 + 1) * beat, false); }
    }
    return (maxW + 0.7) * 1000;
  }

  // =========================================================================
  // 3. BILINGUAL TEXT OVERRIDES FOR GRADE 3 & GRADE 5
  // =========================================================================
  const GRADE_META = {
    3: {
      en: {
        name: 'Grade 3', badge: 'Grade 3 · ABRSM 3A–3D',
        quick: [
          { href: '/ear-check/?ref=aural-g3', w: 0, t: '🎯 3-Min Check', s: 'Find weak spots' },
          { href: '?g=3&w=4', w: 4, t: '🥁 3A · Pulse & Time', s: 'Week 4 · 2/3/4 time' },
          { href: '?g=3&w=6', w: 6, t: '🔍 3C · Pitch/Rhythm', s: 'Week 6 · Spot change' },
          { href: '?g=3&w=8', w: 8, t: '⏱ Grade 3 Mock', s: 'Exam order · Wk 8' }
        ]
      },
      zh: {
        name: '三级', badge: '三级 · ABRSM 3A–3D',
        quick: [
          { href: '/ear-check/?ref=aural-g3', w: 0, t: '🎯 3 分钟自测', s: '先找薄弱题型' },
          { href: '?g=3&w=4', w: 4, t: '🥁 3A · 拍子与拍号', s: '第 4 周 · 2/3/4 拍' },
          { href: '?g=3&w=6', w: 6, t: '🔍 3C · 音高还是节奏', s: '第 6 周 · 找不同专项' },
          { href: '?g=3&w=8', w: 8, t: '⏱ 三级模拟考', s: '考场顺序 · 第 8 周' }
        ]
      }
    },
    4: {
      en: { name: 'Grade 4', badge: 'Grade 4 · ABRSM 4A–4C' },
      zh: { name: '四级', badge: '四级 · ABRSM 4A–4C' }
    },
    5: {
      en: {
        name: 'Grade 5', badge: 'Grade 5 · ABRSM 5A–5C',
        quick: [
          { href: '?g=5&w=3', w: 3, t: '🎹 5A · Melody Recall', s: 'Week 3 · Exam level' },
          { href: '?g=5&w=4', w: 4, t: '🎤 5B · 6-Note Sing', s: 'Week 4 · C/F/G/D/B♭' },
          { href: '?g=5&w=6', w: 6, t: '🏛 5C(i) · 4 Periods', s: 'Week 6 · Style & Period' },
          { href: '?g=5&w=8', w: 8, t: '⏱ Grade 5 Mock', s: 'Exam order · Wk 8' }
        ]
      },
      zh: {
        name: '五级', badge: '五级 · ABRSM 5A–5C',
        quick: [
          { href: '?g=5&w=3', w: 3, t: '🎹 5A · 旋律回弹', s: '第 3 周 · 考场难度' },
          { href: '?g=5&w=4', w: 4, t: '🎤 5B · 六音视唱', s: '第 4 周 · C/F/G/D/B♭' },
          { href: '?g=5&w=6', w: 6, t: '🏛 5C(i) · 四大时期', s: '第 6 周 · 风格与时期' },
          { href: '?g=5&w=8', w: 8, t: '⏱ 五级模拟考', s: '考场顺序 · 第 8 周' }
        ]
      }
    }
  };

  const EXTRA_T = {
    en: {
      pCadence: 'Musicianship extension: how does this phrase end?',
      sCadence: 'Listen to the final two chords (bridge towards Grade 6): home (Perfect), hanging (Imperfect), or surprise (Interrupted)?',
      cadName: { perfect: 'Finished (Perfect · V→I)', imperfect: 'Unfinished (Imperfect · →V)', interrupted: 'Surprise (Interrupted · V→vi)' },
      cadIcon: { perfect: '🏠', imperfect: '❓', interrupted: '⚡' },
      cadRight: n => 'Yes — ' + n + '.',
      wrongCad: ans => ans === 'perfect' ? 'That landed firmly back on home (Perfect cadence, V→I).' : ans === 'imperfect' ? 'That paused on the dominant chord, sounding unfinished like a comma (Imperfect cadence).' : 'That built tension on V, then swerved onto the darker vi chord instead of home (Interrupted cadence).',
      pTexture: 'Musicianship extension: what texture do you hear?',
      sTexture: 'Listen to how the hands work together: chord blocks moving together, a clear melody with accompaniment, or two independent lines conversing?',
      texName: { chordal: 'Chordal (moving together)', melacc: 'Melody + accompaniment', poly: 'Two independent lines (contrapuntal)' },
      texIcon: { chordal: '🧱', melacc: '🎶', poly: '🔀' },
      texRight: n => 'Yes — ' + n.toLowerCase() + '.',
      wrongTex: ans => ans === 'chordal' ? 'All the voices moved together in chord blocks (chordal texture).' : ans === 'melacc' ? 'There was one singing tune on top supported by a steady accompaniment.' : 'Both hands played independent melodic lines (contrapuntal texture).',
      pStyle: 'Which musical period does this sound like?',
      sStyle: 'Listen for texture, harmony and accompaniment — not just tempo! Baroque, Classical, Romantic or 20th Century / Modern.',
      styName: { baroque: 'Baroque', classical: 'Classical', romantic: 'Romantic', modern: '20th Century / Modern' },
      styIcon: { baroque: '🎻', classical: '🏛️', romantic: '🌹', modern: '⚡' },
      styRight: n => 'Yes — ' + n + ' style.',
      wrongSty: ans => 'This example has classic ' + ({ baroque: 'Baroque', classical: 'Classical', romantic: 'Romantic', modern: '20th Century / Modern' }[ans]) + ' fingerprints. Hear it again and notice the harmony and texture.',
      pMeter68: 'Extension: is it in 2, 3, 4 or compound 6/8 time?',
      sMeter68: 'Count the strong beats first. If two main beats swing in threes (“ONE-2-3 FOUR-5-6”), it is compound 6/8 (which counts as 2 time in the Grade 5 exam!).',
      timeOf68: k => k === 6 ? '6/8 (compound 2)' : k + ' time',
      wrongMeter68: k => k === 6 ? 'It was 6/8 (compound duple: ONE-2-3, FOUR-5-6). Tip: in the Grade 5 exam, 6/8 counts as 2 time!' : 'It was in ' + k + ' time (simple beats, not swinging in threes). Hear it again with the beats counted.',
      keyNameD: { C: 'C major', F: 'F major (B♭)', G: 'G major (F♯)', D: 'D major (F♯, C♯)', Bb: 'B♭ major (B♭, E♭)' },
      pSight6: 'Sing these six notes',
      pSightKeys6: 'Read these six notes and tap them',
      tempoTip: r => r > 1.35 ? ' (Tip: your rhythm proportions were right, just slower than the original pulse — try staying closer to the tempo!)' : r < 0.72 ? ' (Tip: your rhythm proportions were right, just quicker than the original pulse!)' : '',
      secLongG3: { A3: 'Test 3A · pulse & 2/3/4 time', B3: 'Test 3B · three echo phrases', C3: 'Test 3C · pitch or rhythm change', D3: 'Test 3D · features & major/minor' },
      secLongG5: { A: 'Test 5A · play back melody', B: 'Test 5B · sight-sing 6 notes', Bk: 'Test 5B · 6-note reading (keys)', Ci: 'Test 5C(i) · features, style & period', Cii: 'Test 5C(ii) · rhythm & 2/3/4 time' }
    },
    zh: {
      pCadence: '进阶拓展：这个乐句是怎么收尾的？',
      sCadence: '重点听最后两个和弦（衔接 6 级听觉）：稳稳回家（完满终止）、悬在半空（半终止），还是意外拐弯（阻碍终止）？',
      cadName: { perfect: '稳稳结束（完满终止 V→I）', imperfect: '悬在半空（半终止 →V）', interrupted: '意外转折（阻碍终止 V→vi）' },
      cadIcon: { perfect: '🏠', imperfect: '❓', interrupted: '⚡' },
      cadRight: n => '听对了——' + n + '。',
      wrongCad: ans => ans === 'perfect' ? '这句稳稳落回了主和弦，有明确的结束感（完满终止 V→I）。' : ans === 'imperfect' ? '这句停在属和弦上，像一个逗号，还没说完（半终止）。' : '属和弦制造了回家预期，结果意外滑向暗色的 vi 级小和弦（阻碍终止）。',
      pTexture: '进阶拓展：你听到的是哪种音乐织体？',
      sTexture: '听两只手如何配合：齐步走的和弦柱式、上方旋律加伴奏，还是两只手各自独立对话的复调？',
      texName: { chordal: '和弦柱式（齐步走）', melacc: '旋律 + 伴奏（主调）', poly: '双声部独立对话（复调）' },
      texIcon: { chordal: '🧱', melacc: '🎶', poly: '🔀' },
      texRight: n => '听对了——' + n + '。',
      wrongTex: ans => ans === 'chordal' ? '所有声部按相同节奏齐步前进，是典型的和弦柱式织体。' : ans === 'melacc' ? '右手唱出清晰旋律，左手用平稳伴奏托底，是经典的主调伴奏织体。' : '左右手各自带着独立旋律线条先后对话，是典型的复调织体。',
      pStyle: '这段音乐属于哪个时期风格？',
      sStyle: '别只凭快慢猜！抓和声、织体与伴奏指纹：巴洛克、古典、浪漫，还是 20 世纪/现代时期。',
      styName: { baroque: '巴洛克时期', classical: '古典时期', romantic: '浪漫时期', modern: '20 世纪 / 现代' },
      styIcon: { baroque: '🎻', classical: '🏛️', romantic: '🌹', modern: '⚡' },
      styRight: n => '听对了——' + n + '风格。',
      wrongSty: ans => '这段带着鲜明的' + ({ baroque: '巴洛克', classical: '古典', romantic: '浪漫', modern: '20 世纪/现代' }[ans]) + '时期听觉指纹，再听一遍感受它的和声与织体。',
      pMeter68: '拓展练习：这是 2 拍、3 拍、4 拍，还是 6/8 复二拍？',
      sMeter68: '先找强拍：两大拍里各带三连摇曳（「强-弱-弱 次强-弱-弱」）是 6/8 复拍子（注：五级正式考场中 6/8 请答 2 拍）。',
      timeOf68: k => k === 6 ? '6/8（复二拍）' : k + ' 拍',
      wrongMeter68: k => k === 6 ? '这是 6/8 复二拍（ONE-2-3, FOUR-5-6）。考场贴士：遇到 6/8 曲子，正式考级请答「2 time（2 拍）」！' : '这是单纯的 ' + k + ' 拍，不是三份摇摆的 6/8 拍。配着节拍声再听一遍。',
      keyNameD: { C: 'C 大调', F: 'F 大调（降 B）', G: 'G 大调（升 F）', D: 'D 大调（升 F、升 C）', Bb: 'B♭ 大调（降 B、降 E）' },
      pSight6: '视唱这六个音',
      pSightKeys6: '读出这六个音并在琴键上按出来',
      tempoTip: r => r > 1.35 ? '（小贴士：节奏比例完全正确，但整体拍速比原曲慢了一些，下次试着贴紧原速！）' : r < 0.72 ? '（小贴士：节奏比例完全正确，但整体拍速比原曲快了一些！）' : '',
      secLongG3: { A3: '3A · 拍子与 2/3/4 拍', B3: '3B · 三句旋律回声', C3: '3C · 音高或节奏变化', D3: '3D · 音乐特征与大小调' },
      secLongG5: { A: '5A · 听音弹回旋律', B: '5B · 六音视唱（麦克风）', Bk: '5B · 六音读谱（琴键）', Ci: '5C(i) · 特征、风格与时期', Cii: '5C(ii) · 节奏与 2/3/4 拍' }
    }
  };

  // --- GRADE 3 WEEK COPY ---
  const G3_COPY = {
    en: {
      1: {
        eyebrow: 'Grade 3 Aural · Week 1 · Free (ABRSM format)', h1: 'Hear direction, shape & changes.',
        intro: 'Week 1 builds the listening habits behind ABRSM Grade 3: hearing up vs down, tracing a short tune, spotting what changed, and feeling your first strong beat. Four 10-minute stops, free with no sign-up.',
        L: [
          { t: 'Higher or lower', d: 'Two notes: did the second go up or down? From wide jumps to steps.' },
          { t: 'Shape & first echo', d: 'Follow a three-note tune, then play it back on the keys.' },
          { t: 'Same or different', d: 'Hear a short tune twice and spot where it changed.' },
          { t: 'Pitch, rhythm & beat', d: 'First taste of Grade 3C (pitch vs rhythm change) and 3A (2 vs 3 time).' }
        ],
        card: (rows, date) => 'Dottino · ABRSM Grade 3 Aural · Week 1\n' + rows.join('\n') + '\nCompleted ' + date + ' · dottino.app/aural?g=3'
      },
      2: {
        eyebrow: 'Grade 3 Aural · Week 2 · Foundations', h1: 'Find the strong beat. Hold the tune.',
        intro: 'Prepare Tests 3A and 3B: feel 2, 3 and 4 time from the bass accent, and hold a four-note shape cleanly in memory.',
        L: [
          { t: 'Find the strong beat', d: '2 or 3 time first, then 4 time joins in.' },
          { t: 'Four-note shape & echo', d: 'Trace four-note contours and echo them back on the piano.' },
          { t: 'Exam-style 2, 3 or 4 time', d: 'Lighter accents and split beats — count calmly from ONE.' },
          { t: 'Week 2 challenge', d: 'Time signatures, melodic shapes, echoes and spotting changes.' }
        ],
        card: (rows, date) => 'Dottino · ABRSM Grade 3 Aural · Week 2\n' + rows.join('\n') + '\nCompleted ' + date + ' · dottino.app/aural?g=3&w=2'
      },
      3: {
        eyebrow: 'Grade 3 Aural · Week 3 · Foundations', h1: 'Anchor to home. See the rhythm.',
        intro: 'Hear notes relative to the tonic home, match heard rhythms to visual blocks, and build steady five-note melodic memory.',
        L: [
          { t: 'Find the note from home', d: 'Hear C as home, then find the next note inside the scale.' },
          { t: 'Match the rhythm', d: 'Two-bar rhythms in 2 and 3 time — connect sound to duration.' },
          { t: 'Five-note echo phrases', d: 'Smooth step-and-third phrases ready for Test 3B.' },
          { t: 'Week 3 challenge', d: 'Home anchor, rhythm matching, meter and five-note echoes.' }
        ],
        card: (rows, date) => 'Dottino · ABRSM Grade 3 Aural · Week 3\n' + rows.join('\n') + '\nCompleted ' + date + ' · dottino.app/aural?g=3&w=3'
      },
      4: {
        eyebrow: 'Grade 3 Aural · Week 4 · Test 3A Focus', h1: 'Clap the pulse. Name 2, 3 or 4 time.',
        intro: 'In ABRSM Grade 3 Test A, the examiner plays a short piece while you clap the pulse, then asks whether it is in 2, 3 or 4 time.',
        L: [
          { t: 'Tap along with the pulse', d: 'Keep steady clock-like taps matching the real tempo while the music plays.' },
          { t: 'Tap + name 2, 3 or 4 time', d: 'Feel the strong beat under your hands, then state the time.' },
          { t: 'Clap back short rhythms', d: 'Internalise beat subdivisions by tapping two-bar patterns.' },
          { t: 'Test 3A challenge', d: 'Full Test 3A drill mixed with echo and change-spotting.' }
        ],
        seg: { tapbeat: 'Test 3A · Tap beat', meter: 'Test 3A · 2/3/4 time', rhythm: 'Which rhythm', taprhythm: 'Clap rhythm', echo: 'Echo phrase', same: 'Spot change', quiz: 'Test 3A challenge' },
        hi: ['Test 3A week! Tap steady like a clock.', 'Feel the strong beat and name the time.', 'Now tap back short rhythms.', 'Test 3A challenge — ready?'],
        dTitle: ['Steady pulse locked in', 'You can tap and name 2/3/4 time', 'Short rhythms secure', 'Week 4 · Test 3A complete'],
        dNote: ['Next: name 2, 3 or 4 time right after tapping.', 'Next: rhythm clap-backs.', 'One more stop: the Test 3A challenge.', 'Your Week 4 card is ready on the week page.'],
        stickers: [['🥁', 'Pulse Keeper', 'Keeps a steady beat'], ['⏱️', 'Time Spotter', 'Names 2, 3 and 4 time'], ['👏', 'Rhythm Clapper', 'Claps 2-bar rhythms'], ['⭐', '3A Star', 'Finished Week 4']],
        wcEyebrow: 'Week 4 · Test 3A card', skills: { tapbeat: 'Clapping a steady pulse (3A)', meter: 'Identifying 2, 3 or 4 time (3A)', taprhythm: 'Clapping short rhythms' },
        card: (rows, date) => 'Dottino · ABRSM Grade 3 Aural · Week 4 (Test 3A)\n' + rows.join('\n') + '\nCompleted ' + date + ' · dottino.app/aural?g=3&w=4'
      },
      5: {
        eyebrow: 'Grade 3 Aural · Week 5 · Test 3B Focus', h1: 'Echo three short phrases cleanly.',
        intro: 'In ABRSM Grade 3 Test B, you sing back three short phrases as echoes. Warm up with live microphone pitch matching, then echo phrases in major and minor keys.',
        L: [
          { t: 'Voice pitch match + warm-up', d: 'Match single notes with the microphone (or keys), then 4-note echoes.' },
          { t: 'Five-note echo phrases', d: 'Hear once or twice and echo straight back cleanly.' },
          { t: 'Major & minor exam phrases', d: 'Key chord + starting note + five-note echo in C major or A minor.' },
          { t: 'Test 3B challenge', d: 'A full set of echo phrases plus pulse and change review.' }
        ],
        seg: { singmatch: 'Voice match', echo: 'Test 3B · Echo phrase', meter: '2/3/4 time', same: 'Spot change', quiz: 'Test 3B challenge' },
        hi: ['Test 3B week! Warm up your voice and ear.', 'Five-note echoes — listen to the whole shape.', 'Major and minor phrases today!', 'Test 3B challenge — ready?'],
        dTitle: ['Voice & ear warmed up', 'Five-note echoes steady', 'Major & minor echoes secure', 'Week 5 · Test 3B complete'],
        dNote: ['Next: five-note phrases.', 'Next: major & minor phrases.', 'One more stop: the Test 3B challenge.', 'Your Week 5 card is ready.'],
        stickers: [['🎤', 'Pitch Matcher', 'Matches single notes'], ['🎶', 'Echo Builder', 'Echoes 5-note phrases'], ['🎹', 'Key Echo', 'Echoes in major & minor'], ['⭐', '3B Star', 'Finished Week 5']],
        wcEyebrow: 'Week 5 · Test 3B card', skills: { singmatch: 'Voice pitch matching (3B)', echo: 'Echoing short phrases (3B)' },
        card: (rows, date) => 'Dottino · ABRSM Grade 3 Aural · Week 5 (Test 3B)\n' + rows.join('\n') + '\nCompleted ' + date + ' · dottino.app/aural?g=3&w=5'
      },
      6: {
        eyebrow: 'Grade 3 Aural · Week 6 · Test 3C Focus', h1: 'Pitch change or rhythm change?',
        intro: 'Test 3C plays a phrase twice with one pitch or rhythm change while keeping the exact same total bar length. See the exact moving key or rhythm pair after every question.',
        L: [
          { t: 'Pitch vs rhythm starter', d: 'Warm up with pitch changes, then distinguish pitch from rhythm.' },
          { t: 'Longer five-note phrases', d: 'Hold five notes in working memory while comparing both playings.' },
          { t: 'Exam-speed 3C drill', d: 'Eight real-style five-note phrases with instant piano & rhythm visual reveal.' },
          { t: 'Test 3C challenge', d: 'Five Test 3C questions mixed with Test 3A and 3B.' }
        ],
        seg: { same: 'Test 3C · Pitch or rhythm', echo: 'Echo phrase', tapbeat: 'Tap beat', quiz: 'Test 3C challenge' },
        hi: ['Test 3C week! Did the pitch move, or the rhythm?', 'Five-note phrases now — same total length, one internal change.', 'Exam-speed 3C drill. Sharp ears!', 'Test 3C challenge — let’s go!'],
        dTitle: ['Pitch vs rhythm separated', 'Five-note comparisons solid', 'Exam-speed 3C mastered', 'Week 6 · Test 3C complete'],
        dNote: ['Next: five-note phrases.', 'Next: exam-speed drill.', 'One more stop: Test 3C challenge.', 'Your Week 6 card is ready.'],
        stickers: [['🔍', 'Change Detective', 'Tells pitch from rhythm'], ['🎹', 'Key Spotter', 'Spots changes in 5 notes'], ['⚡', 'Sharp Ear', 'Exam-speed 3C drill'], ['⭐', '3C Star', 'Finished Week 6']],
        wcEyebrow: 'Week 6 · Test 3C card', skills: { same: 'Spotting pitch vs rhythm changes (3C)' },
        card: (rows, date) => 'Dottino · ABRSM Grade 3 Aural · Week 6 (Test 3C)\n' + rows.join('\n') + '\nCompleted ' + date + ' · dottino.app/aural?g=3&w=6'
      },
      7: {
        eyebrow: 'Grade 3 Aural · Week 7 · Test 3D Focus', h1: 'Major or minor, dynamics & tempo.',
        intro: 'In ABRSM Grade 3 Test D, the examiner plays ONE short piece and asks about two musical features — dynamics, articulation, tempo changes, and major or minor tonality.',
        L: [
          { t: 'Major or minor (new in Grade 3)', d: 'Hear the bright major 3rd vs darker minor 3rd across multiple keys.' },
          { t: 'Dynamics & articulation', d: 'Crescendo, diminuendo, sudden f/p contrasts, legato vs staccato.' },
          { t: 'Tempo changes & tonality', d: 'Steady vs slowing/speeding up, plus major vs minor in full pieces.' },
          { t: 'Test 3D challenge', d: 'Two questions on the same piece plus 3A and 3C review.' }
        ],
        seg: { mode: 'Major or minor', feat: 'Test 3D · Features', same: 'Spot change', meter: '2/3/4 time', quiz: 'Test 3D challenge' },
        hi: ['Test 3D week! Major or minor — listen to the 3rd.', 'Loudness & touch: smooth or detached?', 'Tempo changes & full-piece tonality.', 'Test 3D challenge — ready?'],
        dTitle: ['Major & minor clear', 'Dynamics & articulation sharp', 'Tempo & tonality secure', 'Week 7 · Test 3D complete'],
        dNote: ['Next: dynamics and articulation.', 'Next: tempo and full-piece tonality.', 'One more stop: Test 3D challenge.', 'Your Week 7 card is ready. Next up: Mock exams!'],
        stickers: [['🌗', 'Major/Minor Ear', 'Hears major vs minor'], ['🔊', 'Dynamic Radar', 'Spots loudness & touch'], ['🎼', 'Feature Pro', 'Hears tempo & tonality'], ['⭐', '3D Star', 'Finished Week 7']],
        wcEyebrow: 'Week 7 · Test 3D card', skills: { mode: 'Major vs minor (3D)', feat: 'Dynamics, articulation, tempo & tonality (3D)' },
        card: (rows, date) => 'Dottino · ABRSM Grade 3 Aural · Week 7 (Test 3D)\n' + rows.join('\n') + '\nCompleted ' + date + ' · dottino.app/aural?g=3&w=7'
      },
      8: {
        eyebrow: 'Grade 3 Aural · Week 8 · Full Mock Exams', h1: 'The complete Grade 3 aural test.',
        intro: 'Three full Grade 3 mock exams in exact exam order: Test 3A (pulse & 2/3/4 time), Test 3B (3 echo phrases), Test 3C (guaranteed pitch/rhythm change) and Test 3D (two features on the same piece). Stop 2 drills your weakest section.',
        L: [
          { t: 'Grade 3 Mock Exam 1', d: 'Tests 3A, 3B (3 phrases), 3C and 3D in real exam order.' },
          { t: 'Your focus stop', d: 'Targeted practice on whichever test needed most work in Mock 1.' },
          { t: 'Grade 3 Mock Exam 2', d: 'Full run-through again — check how much steadier your focus area is.' },
          { t: 'Final Grade 3 Mock', d: 'Last exam run + teacher-ready Grade 3 practice report.' }
        ],
        seg: { quiz: 'Grade 3 Mock', tapbeat: 'Test 3A · Pulse', meter: 'Test 3A · Time', echo: 'Test 3B · Echo', same: 'Test 3C · Change', feat: 'Test 3D · Features' },
        wcEyebrow: 'Grade 3 practice report', wcTitle: 'Grade 3 aural readiness',
        skills: { A3: 'Test 3A · pulse & 2/3/4 time', B3: 'Test 3B · three echo phrases', C3: 'Test 3C · pitch or rhythm change', D3: 'Test 3D · features & major/minor' },
        card: (rows, date) => 'Dottino · ABRSM Grade 3 Aural · Mock Exams (practice results, not ABRSM marks)\n' + rows.join('\n') + '\nCompleted ' + date + ' · dottino.app/aural?g=3&w=8'
      }
    },
    zh: {
      1: {
        eyebrow: '三级听力 · 第 1 周 · 免费（ABRSM 考纲体例）', h1: '先听方向、轮廓与变化。',
        intro: '第 1 周为 ABRSM 三级听力打底：听高低方向、画旋律轮廓、找两遍演奏里的变化，并感受第一个强拍。4 站、每站约 10 分钟，免费免注册。',
        L: [
          { t: '高还是低', d: '两个音：第二个往上还是往下走？从大跳到相邻的音。' },
          { t: '轮廓与第一次回声', d: '听出三音旋律形状，再在琴键上弹回来。' },
          { t: '一样还是不一样', d: '同一段听两遍，找出哪里变了。' },
          { t: '音高、节奏与强拍', d: '初体验三级 3C（音高还是节奏变了）和 3A（2 拍还是 3 拍）。' }
        ],
        card: (rows, date) => 'Dottino · ABRSM 三级听力 · 第 1 周\n' + rows.join('\n') + '\n完成于 ' + date + ' · dottino.app/aural?g=3'
      },
      2: {
        eyebrow: '三级听力 · 第 2 周 · 基础能力', h1: '找到强拍，记住旋律。',
        intro: '为 3A 与 3B 打基础：从低音强拍数出 2/3/4 拍，并把四音旋律清晰记在脑中。',
        L: [
          { t: '找强拍（2/3/4 拍）', d: '先分清 2 拍和 3 拍，再加入 4 拍。' },
          { t: '四音轮廓与回声', d: '听出四音走向，再完整弹回来。' },
          { t: '考场感 2/3/4 拍', d: '强拍变轻、加入拆分八分音符，依然稳稳数拍。' },
          { t: '第 2 周小测', d: '拍号、轮廓、回声与找不同综合检验。' }
        ],
        card: (rows, date) => 'Dottino · ABRSM 三级听力 · 第 2 周\n' + rows.join('\n') + '\n完成于 ' + date + ' · dottino.app/aural?g=3&w=2'
      },
      3: {
        eyebrow: '三级听力 · 第 3 周 · 基础能力', h1: '听清主音锚点，看见节奏。',
        intro: '建立主音参照感、把听到的节奏对应成节奏方块，并稳住五音回声记忆。',
        L: [
          { t: '从主音找音', d: '先听主音 C，再在音阶里找出下一个音。' },
          { t: '匹配节奏图', d: '两小节 2 拍/3 拍节奏，让耳朵和视觉方块对齐。' },
          { t: '五音短句回声', d: '级进加小跳的五音短句，衔接 3B 考题。' },
          { t: '第 3 周小测', d: '主音锚点、节奏图、拍号与五音回声综合测验。' }
        ],
        card: (rows, date) => 'Dottino · ABRSM 三级听力 · 第 3 周\n' + rows.join('\n') + '\n完成于 ' + date + ' · dottino.app/aural?g=3&w=3'
      },
      4: {
        eyebrow: '三级听力 · 第 4 周 · 3A 考题专项', h1: '稳稳拍出节拍，说清 2/3/4 拍。',
        intro: 'ABRSM 三级 3A 要求边听音乐边拍出稳定原速拍子，并判断是 2 拍、3 拍还是 4 拍。',
        L: [
          { t: '跟着音乐拍出稳拍', d: '贴紧原拍速均匀拍击，不抢拍不拖拍。' },
          { t: '边拍边判 2/3/4 拍', d: '先用手感受强拍回归周期，再说出拍号。' },
          { t: '拍回两小节短节奏', d: '强化拍内细分与长短时值感。' },
          { t: '3A 专项挑战', d: '综合 3A 拍子与拍号，穿插回声与找不同。' }
        ],
        seg: { tapbeat: '3A · 拍出拍子', meter: '3A · 2/3/4 拍', rhythm: '节奏图', taprhythm: '拍回节奏', echo: '旋律回声', same: '找不同', quiz: '3A 专项挑战' },
        hi: ['3A 专项周！贴紧原速稳稳打拍。', '先感受强拍，再说出几拍子。', '现在把短节奏拍回来。', '3A 专项挑战，准备好了吗？'],
        dTitle: ['稳拍感建立了', '能边拍边判 2/3/4 拍', '短节奏拍回很稳', '第 4 周 · 3A 完成'],
        dNote: ['下一站：边拍边说出 2/3/4 拍。', '下一站：短节奏拍回。', '最后一站：3A 专项挑战。', '第 4 周进度卡已生成。'],
        stickers: [['🥁', '稳拍达人', '拍子均匀稳定'], ['⏱️', '拍号雷达', '分清 2/3/4 拍'], ['👏', '节奏拍手', '拍回两小节节奏'], ['⭐', '3A 之星', '完成第 4 周']],
        wcEyebrow: '第 4 周 · 3A 进度卡', skills: { tapbeat: '跟着音乐稳稳打拍（3A）', meter: '辨别 2/3/4 拍（3A）', taprhythm: '拍回短节奏' },
        card: (rows, date) => 'Dottino · ABRSM 三级听力 · 第 4 周（3A）\n' + rows.join('\n') + '\n完成于 ' + date + ' · dottino.app/aural?g=3&w=4'
      },
      5: {
        eyebrow: '三级听力 · 第 5 周 · 3B 考题专项', h1: '干脆模唱/弹回三句旋律回声。',
        intro: 'ABRSM 三级 3B 要求听考官弹三句短旋律并模唱回声。先用麦克风练单音音准，再进阶大小调五音短句回声。',
        L: [
          { t: '声音音准配对 + 热身', d: '用麦克风唱准单音（或琴键作答），衔接四音回声。' },
          { t: '五音旋律回声', d: '听完整乐句形状，立刻弹/唱回来。' },
          { t: '大小调考场短句', d: '主和弦 + 起音 + C 大调/a 小调五音回声。' },
          { t: '3B 专项挑战', d: '完整一组回声短句，配拍号与找不同复习。' }
        ],
        seg: { singmatch: '单音模唱', echo: '3B · 旋律回声', meter: '2/3/4 拍', same: '找不同', quiz: '3B 专项挑战' },
        hi: ['3B 专项周！先开开嗓、对准音高。', '五音回声——先听整体起伏。', '今天加入大小调考场短句！', '3B 专项挑战，出发！'],
        dTitle: ['音准热身完成', '五音回声很稳', '大小调回声过关', '第 5 周 · 3B 完成'],
        dNote: ['下一站：五音短句回声。', '下一站：大小调考场短句。', '最后一站：3B 专项挑战。', '第 5 周进度卡已就绪。'],
        stickers: [['🎤', '音准小将', '唱准单音'], ['🎶', '回声能手', '准确回声五音'], ['🎹', '大小调回声', '大调小调都稳'], ['⭐', '3B 之星', '完成第 5 周']],
        wcEyebrow: '第 5 周 · 3B 进度卡', skills: { singmatch: '单音模唱音准（3B）', echo: '短句旋律回声（3B）' },
        card: (rows, date) => 'Dottino · ABRSM 三级听力 · 第 5 周（3B）\n' + rows.join('\n') + '\n完成于 ' + date + ' · dottino.app/aural?g=3&w=5'
      },
      6: {
        eyebrow: '三级听力 · 第 6 周 · 3C 考题专项', h1: '变的是音高，还是节奏？',
        intro: '3C 两遍乐句总拍数完全一致，只改变内部音高或节奏分配，绝不能靠“总时长变长”蒙题。每题答完直接亮出变动琴键或节奏对比。',
        L: [
          { t: '音高 vs 节奏入门', d: '先热身纯音高变化，再区分音高变化与等长节奏变化。' },
          { t: '进阶五音短句', d: '把五音短句装进工作记忆，清晰对比两遍差异。' },
          { t: '考场节奏 3C 强化', d: '8 题真实长度五音找不同，配全宽迷你键盘解析。' },
          { t: '3C 专项挑战', d: '5 题必含变化的 3C 密集考验，穿插 3A 与 3B。' }
        ],
        seg: { same: '3C · 音高或节奏', echo: '旋律回声', tapbeat: '稳拍', quiz: '3C 专项挑战' },
        hi: ['3C 专项周！两遍总长相同，听听变的是音高还是节奏？', '升级五音短句，稳住两遍对比。', '考场速度 3C 强化，竖起耳朵！', '3C 专项挑战开始！'],
        dTitle: ['音高与节奏分清了', '五音找不同很稳', '考场节奏 3C 拿下', '第 6 周 · 3C 完成'],
        dNote: ['下一站：五音短句对比。', '下一站：考场速度强化。', '最后一站：3C 专项挑战。', '第 6 周进度卡已生成。'],
        stickers: [['🔍', '变化侦探', '秒分音高与节奏'], ['🎹', '琴键鹰眼', '五音变化精准定位'], ['⚡', '极速分辨', '通过考场 3C 强化'], ['⭐', '3C 之星', '完成第 6 周']],
        wcEyebrow: '第 6 周 · 3C 进度卡', skills: { same: '辨别音高或节奏变化（3C）' },
        card: (rows, date) => 'Dottino · ABRSM 三级听力 · 第 6 周（3C）\n' + rows.join('\n') + '\n完成于 ' + date + ' · dottino.app/aural?g=3&w=6'
      },
      7: {
        eyebrow: '三级听力 · 第 7 周 · 3D 考题专项', h1: '大小调、强弱、连断与速度。',
        intro: 'ABRSM 三级 3D 听同一段音乐回答两项音乐特征——强弱变化、连奏/断奏、速度变化，以及三级新增的「大调还是小调」。',
        L: [
          { t: '大调还是小调（三级新增）', d: '跨多个主音听清大三度与小三度半音色彩差异。' },
          { t: '强弱与连断奏', d: '渐强渐弱、突强突弱，以及连奏 legato 与断奏 staccato。' },
          { t: '速度变化与乐段调性', d: '稳定/渐慢/渐快，以及真实乐段的大调/小调。' },
          { t: '3D 专项挑战', d: '同一乐段连答两项特征，衔接下周模拟考。' }
        ],
        seg: { mode: '大调或小调', feat: '3D · 音乐特征', same: '找不同', meter: '2/3/4 拍', quiz: '3D 专项挑战' },
        hi: ['3D 专项周！抓住三度听大小调。', '听强弱起伏和连奏断奏！', '现在听速度趋势和完整乐段调性。', '3D 专项挑战，准备好了吗？'],
        dTitle: ['大小调色彩稳了', '强弱连断清晰', '速度与调性过关', '第 7 周 · 3D 完成'],
        dNote: ['下一站：强弱与连断奏。', '下一站：速度与乐段调性。', '最后一站：3D 专项挑战。', '第 7 周完成！下周进入全真模拟考。'],
        stickers: [['🌗', '调性雷达', '听清大调与小调'], ['🔊', '强弱触键', '抓准力度与连断'], ['🎼', '特征全能', '听清速度与调性'], ['⭐', '3D 之星', '完成第 7 周']],
        wcEyebrow: '第 7 周 · 3D 进度卡', skills: { mode: '大调与小调辨别（3D）', feat: '强弱、连断、速度与调性（3D）' },
        card: (rows, date) => 'Dottino · ABRSM 三级听力 · 第 7 周（3D）\n' + rows.join('\n') + '\n完成于 ' + date + ' · dottino.app/aural?g=3&w=7'
      },
      8: {
        eyebrow: '三级听力 · 第 8 周 · 全真模拟考', h1: '完整跑完 ABRSM 三级听力。',
        intro: '三套严格按考场顺序编排的三级模拟考：3A（稳拍与 2/3/4 拍）、3B（连续三句旋律回声）、3C（必含音高或节奏变化）、3D（同一首乐曲连答两项特征）。',
        L: [
          { t: '三级模拟考 1', d: '按考场顺序完成 3A、3B（3 句）、3C、3D 全部四项。' },
          { t: '薄弱项专攻', d: '自动强化模拟考 1 中最需要打磨的那一项。' },
          { t: '三级模拟考 2', d: '再跑一整套，检验薄弱项是否已经站稳。' },
          { t: '终极三级模拟考', d: '考前最后演练，生成给老师看的完整报告。' }
        ],
        seg: { quiz: '三级模拟考', tapbeat: '3A · 拍子', meter: '3A · 拍号', echo: '3B · 回声', same: '3C · 找不同', feat: '3D · 特征' },
        wcEyebrow: '三级模拟考报告', wcTitle: '三级听力备考状态',
        skills: { A3: '3A · 拍子与 2/3/4 拍', B3: '3B · 三句旋律回声', C3: '3C · 音高或节奏变化', D3: '3D · 音乐特征与大小调' },
        card: (rows, date) => 'Dottino · ABRSM 三级听力 · 模拟考报告（练习结果，非官方评分）\n' + rows.join('\n') + '\n完成于 ' + date + ' · dottino.app/aural?g=3&w=8'
      }
    }
  };

  // --- GRADE 5 WEEK COPY (Strictly separating Official Exam Prep vs Musicianship Extension!) ---
  const G5_COPY = {
    en: {
      1: {
        eyebrow: 'Grade 5 Aural · Week 1 · Free (ABRSM format)', h1: 'Sharpen your Grade 5 ears.',
        intro: 'Week 1 diagnoses every core Grade 5 foundation: cross-key major/minor, equal-length pitch/rhythm changes, five-note memory, 2/3/4 time and a first taste of Style & Period. Four 10-minute stops, free.',
        L: [
          { t: 'Major/minor & 5-note changes', d: 'Cross-key mode listening plus exam-speed pitch/rhythm discrimination.' },
          { t: 'Five & six-note melody memory', d: 'Key chord + starting note + clean melodic playback.' },
          { t: 'Metre & dotted rhythms', d: 'Lock in steady 2, 3 and 4 time plus dotted-note patterns.' },
          { t: 'Grade 5 Week 1 check', d: 'A quick snapshot across melody, metre, features and musical period.' }
        ],
        seg: { mode: 'Major or minor', same: 'Spot change', echo: 'Melody playback', meter: '2/3/4 time', rhythm: 'Rhythm', style: 'Style & Period', feat: 'Features', quiz: 'Week 1 check' },
        hi: ['Welcome to Grade 5! Sharp ears ready?', 'Hold 5 and 6-note melodies cleanly.', 'Lock in steady metre and dotted rhythms!', 'Week 1 Grade 5 diagnostic — go!'],
        dTitle: ['Mode & changes sharp', 'Melody memory warmed up', 'Metre & rhythm locked in', 'Grade 5 Week 1 complete'],
        dNote: ['Next: 5 and 6-note playback.', 'Next: metre and dotted rhythms.', 'One more stop: Grade 5 Week 1 check.', 'Your Week 1 card is ready on the week page.'],
        stickers: [['🎯', 'G5 Starter', 'Warm-up complete'], ['🎹', 'Melody Keeper', 'Holds 6-note tunes'], ['🥁', 'Metre Lock', 'Steady 2/3/4 time'], ['⭐', 'G5 Week 1', 'Finished Week 1']],
        wcEyebrow: 'Grade 5 · Week 1 card', skills: { mode: 'Major & minor', same: 'Fine change spotting', echo: 'Melodic memory', meter: '2, 3 and 4 time' },
        card: (rows, date) => 'Dottino · ABRSM Grade 5 Aural · Week 1\n' + rows.join('\n') + '\nCompleted ' + date + ' · dottino.app/aural?g=5'
      },
      2: {
        eyebrow: 'Grade 5 Aural · Week 2 · Test 5A Part 1', h1: 'Play back melodies with rhythm.',
        intro: 'Build Test 5A fluency: hear the key chord, starting note and count-in, then play back two- to three-bar melodies within an octave with accurate pitch AND rhythm.',
        L: [
          { t: 'Key colour & 6-note tunes', d: 'Lock in major/minor tonal expectations before playing back.' },
          { t: 'Two-bar rhythmic melodies', d: 'Count-in + two bars in C, G, F, Am, Em, Dm — pitch and rhythm both count.' },
          { t: 'Three-bar exam melodies', d: 'Longer phrases within an octave across keys up to 3 sharps/flats.' },
          { t: 'Week 2 challenge', d: 'Four rhythmic play-backs plus mode and 2/3/4 time check.' }
        ],
        seg: { mode: 'Major or minor', echo: 'Test 5A · Play back', meter: '2/3/4 time', quiz: 'Week 2 challenge' },
        hi: ['Week 2: Test 5A with rhythm!', 'Feel the two-bar count-in.', 'Stretching to 3-bar melodies within an octave.', 'Week 2 challenge — ready?'],
        dTitle: ['Key feel locked', '2-bar rhythmic playback solid', '3-bar melodies conquered', 'Grade 5 Week 2 complete'],
        dNote: ['Next: 2-bar rhythmic melodies.', 'Next: 3-bar exam phrases.', 'One more stop: Week 2 challenge.', 'Your Week 2 card is ready.'],
        stickers: [['🌗', 'Tonal Anchor', 'Locks into the key'], ['🎹', 'Rhythmic Echo', '2-bar playback'], ['🎼', 'Long Phrase', '3-bar playback'], ['⭐', 'G5 Week 2', 'Finished Week 2']],
        wcEyebrow: 'Grade 5 · Week 2 card', skills: { mode: 'Major & minor', echo: 'Test 5A · rhythmic playback' },
        card: (rows, date) => 'Dottino · ABRSM Grade 5 Aural · Week 2 (Test 5A)\n' + rows.join('\n') + '\nCompleted ' + date + ' · dottino.app/aural?g=5&w=2'
      },
      3: {
        eyebrow: 'Grade 5 Aural · Week 3 · Test 5A Part 2', h1: 'Full-length Grade 5 melodies.',
        intro: 'Push Test 5A to full Grade 5 exam length: up to 4 bars, strictly within an octave, across major and minor keys up to 3 sharps/flats.',
        L: [
          { t: 'Multi-key 3-bar phrases', d: 'Fluent playback across major and minor keys up to 3 sharps/flats.' },
          { t: 'Four-bar exam phrases', d: 'Chunk arpeggios and cadence endings instead of memorising note by note.' },
          { t: 'Grade 5 Test 5A drill', d: 'Six full-length exam-level melodies back to back.' },
          { t: 'Test 5A challenge', d: 'Five Test 5A melodies plus a tonality ear check.' }
        ],
        seg: { echo: 'Test 5A · Extended melody', feat: 'Tonality', quiz: 'Test 5A challenge' },
        hi: ['Week 3: full Grade 5 melody length!', 'Chunk the shape and cadence endings.', 'Six exam-level melodies — stay calm!', 'Test 5A challenge — let’s go!'],
        dTitle: ['Multi-key playback fluent', '4-bar phrases chunked cleanly', 'Full Test 5A drill done', 'Grade 5 Week 3 · Test 5A complete'],
        dNote: ['Next: 4-bar melodies.', 'Next: full Test 5A drill.', 'One more stop: Test 5A challenge.', 'Your Week 3 card is ready.'],
        stickers: [['🗝️', 'Key Hopper', 'Plays back across keys'], ['🧠', 'Phrase Chunker', 'Holds 4-bar melodies'], ['🏆', '5A Master', 'Exam-length playback'], ['⭐', '5A Star', 'Finished Week 3']],
        wcEyebrow: 'Grade 5 · Week 3 (Test 5A) card', skills: { echo: 'Test 5A · full Grade 5 melody playback', feat: 'Tonality' },
        card: (rows, date) => 'Dottino · ABRSM Grade 5 Aural · Week 3 (Test 5A)\n' + rows.join('\n') + '\nCompleted ' + date + ' · dottino.app/aural?g=5&w=3'
      },
      4: {
        eyebrow: 'Grade 5 Aural · Week 4 · Test 5B Focus', h1: 'Sight-sing six notes across five keys.',
        intro: 'Official ABRSM Grade 5 Test B rules: SIX notes in C, F, G, D or B♭ major, within a 4th below to a 5th above the tonic, using steps, thirds and ONLY the rising 4th from dominant to tonic (so → do).',
        L: [
          { t: 'Voice warm-up + 5-note bridge', d: 'Lock pitch accuracy with the mic, then bridge smoothly from 5 notes.' },
          { t: 'Six notes in C, F & G major', d: 'Official Grade 5 intervals: steps, thirds, and rising dominant-to-tonic 4th.' },
          { t: 'Add D & B♭ major (2 sharps / 2 flats)', d: 'Full official Grade 5 Test 5B key set in treble or bass clef.' },
          { t: 'Test 5B challenge', d: 'Four official 6-note sight-singing lines plus Test 5A and dynamics.' }
        ],
        seg: { singmatch: 'Voice warm-up', sight: 'Test 5B · 6-note sight-sing', echo: 'Test 5A', feat: 'Dynamics', quiz: 'Test 5B challenge' },
        hi: ['Test 5B week! Warm up your voice.', 'Six notes now — watch for the rising so→do 4th!', 'D major and B♭ major join in!', 'Test 5B challenge — deep breath!'],
        dTitle: ['Voice locked in', 'Six-note lines fluent', 'All 5 official keys ready', 'Grade 5 Week 4 · Test 5B complete'],
        dNote: ['Next: six notes in C, F and G major.', 'Next: D and B♭ major.', 'One more stop: Test 5B challenge.', 'Your Week 4 card is ready.'],
        stickers: [['🎤', 'Warm Voice', 'Locked pitch on mic'], ['🎼', 'Six-Note Singer', 'Sings 6 notes cleanly'], ['🗝️', '5-Key Pro', 'Reads C, F, G, D & B♭'], ['⭐', '5B Star', 'Finished Week 4']],
        wcEyebrow: 'Grade 5 · Week 4 (Test 5B) card', skills: { sight: 'Test 5B · sight-singing 6 notes (singing)', sightkeys: 'Test 5B · reading 6 notes (keys)', singmatch: 'Voice pitch accuracy' },
        card: (rows, date) => 'Dottino · ABRSM Grade 5 Aural · Week 4 (Test 5B)\n' + rows.join('\n') + '\nCompleted ' + date + ' · dottino.app/aural?g=5&w=4'
      },
      5: {
        eyebrow: 'Grade 5 Aural · Week 5 · Test 5C(i) Features & Extension', h1: 'Musical features + musicianship extensions.',
        intro: 'Master core Grade 5 Test 5C(i) features (dynamics, articulation, tempo, tonality), plus optional Musicianship Extensions on Texture and Cadences to deepen listening and bridge towards Grade 6.',
        L: [
          { t: 'Dynamics & articulation', d: 'Gradual vs sudden loudness contrasts and legato vs staccato touch.' },
          { t: 'Tempo changes & tonality', d: 'Spot rallentando, accelerando and major/minor across full excerpts.' },
          { t: 'Extension: Texture & Cadences', d: 'Musicianship Lab (not a separate Grade 5 mock requirement): hear voice layers & cadence endings.' },
          { t: 'Week 5 challenge', d: 'All four core 5C(i) features plus texture & cadence extensions.' }
        ],
        seg: { feat: 'Test 5C(i) · Features', texture: 'Extension · Texture', cadence: 'Extension · Cadence', quiz: 'Week 5 challenge' },
        hi: ['Week 5: sharpen core 5C(i) features!', 'Tempo shifts and tonality — listen to the end.', 'Musicianship Extension: texture & cadences!', 'Week 5 challenge — sharp ears!'],
        dTitle: ['Dynamics & touch sharp', 'Tempo & tonality secure', 'Extension skills unlocked', 'Grade 5 Week 5 complete'],
        dNote: ['Next: tempo changes and tonality.', 'Next: optional Musicianship Extension.', 'One more stop: Week 5 challenge.', 'Your Week 5 card is ready.'],
        stickers: [['🔊', 'Dynamic Radar', 'Spots loudness & touch'], ['⏱️', 'Tempo & Key', 'Hears tempo & tonality'], ['🔀', 'Musicianship+', 'Texture & cadence extension'], ['⭐', 'G5 Week 5', 'Finished Week 5']],
        wcEyebrow: 'Grade 5 · Week 5 card', skills: { feat: 'Test 5C(i) · dynamics, articulation, tempo & tonality', texture: 'Extension · texture', cadence: 'Extension · cadences' },
        card: (rows, date) => 'Dottino · ABRSM Grade 5 Aural · Week 5\n' + rows.join('\n') + '\nCompleted ' + date + ' · dottino.app/aural?g=5&w=5'
      },
      6: {
        eyebrow: 'Grade 5 Aural · Week 6 · Test 5C(i) Style & Period', h1: 'Baroque, Classical, Romantic or Modern?',
        intro: 'ABRSM Grade 5 Test 5C(i) asks about Style and Period across FOUR eras: Baroque, Classical, Romantic and 20th Century / Modern. Multiple varied templates per era ensure you listen for genuine harmony and texture — never tempo shortcuts.',
        L: [
          { t: 'Baroque, Romantic & Modern', d: 'Start with three unmistakable contrasts across varied tempos.' },
          { t: 'All four official periods', d: 'Baroque, Classical, Romantic and 20th Century / Modern — 12 varied templates.' },
          { t: 'Character & period evidence', d: 'Back up every period choice with real audible clues for the examiner.' },
          { t: 'Test 5C(i) challenge', d: 'Unified Test 5C piece (feature + period + rhythm + metre) plus character review.' }
        ],
        seg: { style: 'Test 5C(i) · Style & Period', char: 'Character', feat: 'Features', taprhythm: 'Rhythm', meter: '2/3/4 time', quiz: 'Test 5C(i) challenge' },
        hi: ['Week 6: hear the period clues, not just speed!', 'All four official ABRSM periods together.', 'Explain WHY it belongs to that period!', 'Test 5C(i) challenge — go!'],
        dTitle: ['Core period contrasts clear', 'All 4 official periods mastered', 'Examiner-ready evidence', 'Grade 5 Week 6 · Test 5C(i) complete'],
        dNote: ['Next: Classical joins all 4 periods.', 'Next: character & period evidence.', 'One more stop: Test 5C(i) challenge.', 'Your Week 6 card is ready.'],
        stickers: [['🎻', 'Contrast Ear', 'Separates Baroque, Romantic & Modern'], ['🏛️', '4-Period Pro', 'All 4 ABRSM periods'], ['🗣️', 'Articulate', 'Gives musical evidence'], ['⭐', '5C(i) Star', 'Finished Week 6']],
        wcEyebrow: 'Grade 5 · Week 6 (Test 5C(i)) card', skills: { style: 'Test 5C(i) · Style & Period (4 eras)', char: 'Musical character & reasons' },
        card: (rows, date) => 'Dottino · ABRSM Grade 5 Aural · Week 6 (Style & Period)\n' + rows.join('\n') + '\nCompleted ' + date + ' · dottino.app/aural?g=5&w=6'
      },
      7: {
        eyebrow: 'Grade 5 Aural · Week 7 · Test 5C(ii) Rhythm & Metre', h1: 'Clap back rhythm & name 2, 3 or 4 time.',
        intro: 'Master Test 5C(ii): clap back dotted and syncopated two-bar rhythms in time and identify 2, 3 or 4 time — plus a Musicianship Extension on feeling 6/8 compound duple (which counts as 2 time in the Grade 5 exam!).',
        L: [
          { t: 'Dotted rhythms & visual match', d: 'See dotted pairs side-by-side and clap them back with steady tempo.' },
          { t: 'Exam-level rhythm & 2/3/4 time', d: 'Two-bar dotted clap-backs and steady 2, 3 or 4 metre identification.' },
          { t: 'Extension: Compound 6/8 feel', d: 'Musicianship Lab: recognise swinging 6/8 (compound 2 time) against simple metres.' },
          { t: 'Test 5C(ii) challenge', d: 'Unified Test 5C run plus exam-level rhythm and 2/3/4 time check.' }
        ],
        seg: { meter: 'Test 5C(ii) · Metre', rhythm: 'Which rhythm', taprhythm: 'Test 5C(ii) · Clap rhythm', feat: 'Features', style: 'Style & Period', quiz: 'Test 5C(ii) challenge' },
        hi: ['Week 7: dotted rhythms and crisp clap-back!', 'Keep close to the original tempo.', 'Extension: feel swinging 6/8 compound 2 time!', 'Test 5C(ii) challenge — ready?'],
        dTitle: ['Dotted rhythms locked in', 'Exam rhythm & 2/3/4 time sharp', '6/8 compound feel understood', 'Grade 5 Week 7 · Test 5C(ii) complete'],
        dNote: ['Next: exam-level clap-back & 2/3/4 time.', 'Next: 6/8 compound feel extension.', 'One more stop: Test 5C(ii) challenge.', 'Week 7 done! Next week: full Grade 5 mocks.'],
        stickers: [['👏', 'Dotted Rhythm', 'Claps dotted patterns'], ['🥁', '5C(ii) Pro', '2, 3 & 4 time secure'], ['🌊', '6/8 Aware', 'Feels compound duple'], ['⭐', '5C(ii) Star', 'Finished Week 7']],
        wcEyebrow: 'Grade 5 · Week 7 (Test 5C(ii)) card', skills: { taprhythm: 'Test 5C(ii) · clapping Grade 5 rhythms', meter: 'Test 5C(ii) · 2, 3 & 4 time', rhythm: 'Visual rhythm matching' },
        card: (rows, date) => 'Dottino · ABRSM Grade 5 Aural · Week 7 (Test 5C(ii))\n' + rows.join('\n') + '\nCompleted ' + date + ' · dottino.app/aural?g=5&w=7'
      },
      8: {
        eyebrow: 'Grade 5 Aural · Week 8 · Official-Format Mock Exams', h1: 'The complete Grade 5 aural test.',
        intro: 'Three full Grade 5 mock exams in exact ABRSM order: 5A (octave-bounded melody playback), 5B (6-note sight-singing in C/F/G/D/B♭), and unified Test 5C (ONE piece for features, 4-era style/period, rhythm clap-back & 2/3/4 time).',
        L: [
          { t: 'Grade 5 Mock Exam 1', d: 'Exact ABRSM order: 5A, 5B and unified 5C(i)+5C(ii) on one piece.' },
          { t: 'Your focus stop', d: 'Automatic targeted drill on your weakest section from Mock 1.' },
          { t: 'Grade 5 Mock Exam 2', d: 'Full run again — see your focus section tighten up.' },
          { t: 'Final Grade 5 Mock', d: 'Final run-through + teacher-readable Grade 5 practice report.' }
        ],
        seg: { quiz: 'Grade 5 Mock', echo: 'Test 5A · Melody', sight: 'Test 5B · 6-note sing', feat: 'Test 5C(i) · Features', style: 'Test 5C(i) · Period', taprhythm: 'Test 5C(ii) · Rhythm', meter: 'Test 5C(ii) · 2/3/4 time' },
        wcEyebrow: 'Grade 5 practice report', wcTitle: 'Grade 5 aural readiness',
        skills: { A: 'Test 5A · melody playback', B: 'Test 5B · sight-singing 6 notes (singing)', Bk: 'Test 5B · reading 6 notes (keys)', Ci: 'Test 5C(i) · features, style & period', Cii: 'Test 5C(ii) · rhythm & 2/3/4 time' },
        card: (rows, date) => 'Dottino · ABRSM Grade 5 Aural · Mock Exams (practice results, not ABRSM marks)\n' + rows.join('\n') + '\nCompleted ' + date + ' · dottino.app/aural?g=5&w=8'
      }
    },
    zh: {
      1: {
        eyebrow: '五级听力 · 第 1 周 · 免费（ABRSM 考纲体例）', h1: '切换进入五级耳朵。',
        intro: '第 1 周全面体检五级核心基础：跨调大小调、等长五音找不同、旋律记忆、2/3/4 拍与风格时期初体验。4 站、免费免注册。',
        L: [
          { t: '大小调与五音找不同', d: '跨主音调性分辨 + 等长音高/节奏辨别。' },
          { t: '五音与六音旋律记忆', d: '主和弦 + 起音，完整弹回更长的旋律线。' },
          { t: '拍号与附点节奏', d: '稳住 2/3/4 拍与附点节奏匹配。' },
          { t: '五级第 1 周体检', d: '一次摸底旋律、拍号、音乐特征与时期风格。' }
        ],
        seg: { mode: '大调或小调', same: '找不同', echo: '旋律回弹', meter: '2/3/4 拍', rhythm: '节奏图', style: '时期风格', feat: '音乐特征', quiz: '第 1 周体检' },
        hi: ['欢迎来到五级！耳朵开机了吗？', '稳稳记住五音和六音旋律。', '稳住拍号和附点节奏！', '五级第 1 周体检，出发！'],
        dTitle: ['调性与找不同很锐利', '旋律记忆热身完成', '拍号与节奏稳固', '五级第 1 周完成'],
        dNote: ['下一站：五音与六音旋律记忆。', '下一站：拍号与附点节奏。', '最后一站：五级第 1 周体检。', '第 1 周进度卡已生成。'],
        stickers: [['🎯', '五级起飞', '完成五级热身'], ['🎹', '旋律舵手', '稳住六音旋律'], ['🥁', '节拍稳健', '稳住 2/3/4 拍'], ['⭐', '五级第 1 周', '完成第 1 周']],
        wcEyebrow: '五级 · 第 1 周进度卡', skills: { mode: '大小调', same: '细节找不同', echo: '旋律记忆', meter: '2/3/4 拍' },
        card: (rows, date) => 'Dottino · ABRSM 五级听力 · 第 1 周\n' + rows.join('\n') + '\n完成于 ' + date + ' · dottino.app/aural?g=5'
      },
      2: {
        eyebrow: '五级听力 · 第 2 周 · 5A 专项（上）', h1: '带着节奏，弹回大小调旋律。',
        intro: '进入 5A 考题体例：主和弦、起音、两小节预备拍，严格控制在八度音域内，准确弹回音高与节奏。',
        L: [
          { t: '调性色彩与六音旋律', d: '先建立大小调听觉预期，再弹回旋律。' },
          { t: '两小节带节奏旋律', d: 'C/G/F/Am/Em/Dm 调，音高与节奏同时判定。' },
          { t: '三小节考场旋律', d: '八度音域内的更长乐句，扩展至三升三降以内。' },
          { t: '第 2 周挑战', d: '4 道带节奏旋律回弹 + 大小调与 2/3/4 拍。' }
        ],
        seg: { mode: '大小调', echo: '5A · 旋律回弹', meter: '2/3/4 拍', quiz: '第 2 周挑战' },
        hi: ['第 2 周：带节奏的 5A 来了！', '听准两小节预备拍。', '拉长到八度内的三小节旋律！', '第 2 周挑战，准备好了吗？'],
        dTitle: ['调性预期建立', '两小节带节奏过关', '三小节长乐句拿下', '五级第 2 周完成'],
        dNote: ['下一站：两小节带节奏旋律。', '下一站：三小节考场旋律。', '最后一站：第 2 周挑战。', '第 2 周进度卡已就绪。'],
        stickers: [['🌗', '调性定盘星', '稳抓主调'], ['🎹', '节奏回弹', '两小节精准回弹'], ['🎼', '长句能手', '拿下三小节'], ['⭐', '五级第 2 周', '完成第 2 周']],
        wcEyebrow: '五级 · 第 2 周进度卡', skills: { mode: '大小调', echo: '5A · 带节奏旋律回弹' },
        card: (rows, date) => 'Dottino · ABRSM 五级听力 · 第 2 周（5A）\n' + rows.join('\n') + '\n完成于 ' + date + ' · dottino.app/aural?g=5&w=2'
      },
      3: {
        eyebrow: '五级听力 · 第 3 周 · 5A 专项（下）', h1: '拿下五级完整长度旋律。',
        intro: '全面冲刺 5A 考场难度：长达 4 小节、严格控制在八度跨度内、含小调导音与附点节奏，覆盖三升三降以内常用调。',
        L: [
          { t: '多调三小节短句', d: '在多种大小调里流畅听音弹回。' },
          { t: '四小节考场乐句', d: '把分解和弦与收尾打包记忆，不再逐音死背。' },
          { t: '5A 考场全长度集训', d: '连续 6 道完整五级难度旋律。' },
          { t: '5A 专项挑战', d: '5 道 5A 旋律 + 调性听辨。' }
        ],
        seg: { echo: '5A · 旋律回弹', feat: '调性', quiz: '5A 专项挑战' },
        hi: ['第 3 周：五级全长度旋律！', '把轮廓和收尾打包记住。', '连续 6 道考场难度，沉住气！', '5A 专项挑战出发！'],
        dTitle: ['多调回弹流畅', '四小节打包记忆成型', '全长度 5A 集训通关', '五级第 3 周 · 5A 完成'],
        dNote: ['下一站：四小节考场乐句。', '下一站：5A 考场集训。', '最后一站：5A 专项挑战。', '第 3 周进度卡已就绪。'],
        stickers: [['🗝️', '多调通', '跨调回弹流畅'], ['🧠', '乐句打包师', '记住四小节长句'], ['🏆', '5A 大师', '通关考场长度'], ['⭐', '5A 之星', '完成第 3 周']],
        wcEyebrow: '五级 · 第 3 周（5A）进度卡', skills: { echo: '5A · 五级全长度旋律回弹', feat: '调性听辨' },
        card: (rows, date) => 'Dottino · ABRSM 五级听力 · 第 3 周（5A）\n' + rows.join('\n') + '\n完成于 ' + date + ' · dottino.app/aural?g=5&w=3'
      },
      4: {
        eyebrow: '五级听力 · 第 4 周 · 5B 六音视唱专项', h1: '五个大调，严格考纲六音视唱。',
        intro: '100% 严格按 ABRSM 五级 5B 考纲生成：6 个音，覆盖 C/F/G/D/B♭ 五大调，音域为主音下四度至上五度，只出现级进、三度以及唯一允许的四度（下方属音上行至主音 so→do）。',
        L: [
          { t: '开嗓对音 + 五音衔接', d: '麦克风校准音准，从五音自然过渡到六音。' },
          { t: 'C / F / G 大调六音视唱', d: '专练五级招牌跳进：下方属音上行至主音（so→do）。' },
          { t: '加入 D 与 B♭ 大调（两升/两降）', d: '完整覆盖五级 5B 全部 5 个官方大调，高低音谱号自由切换。' },
          { t: '5B 专项挑战', d: '4 条官方规则六音视唱 + 5A 与力度复习。' }
        ],
        seg: { singmatch: '开嗓对音', sight: '5B · 六音视唱', echo: '5A', feat: '力度', quiz: '5B 专项挑战' },
        hi: ['5B 六音视唱周！先开开嗓。', '升级六个音，留意下方属音上行回主音（so→do）！', '今天加入 D 大调与 B♭ 大调！', '5B 专项挑战，深呼吸！'],
        dTitle: ['音准热身到位', '六音视唱很稳', '五大官方调性全覆盖', '五级第 4 周 · 5B 完成'],
        dNote: ['下一站：C/F/G 大调六音视唱。', '下一站：加入 D 与 B♭ 大调。', '最后一站：5B 专项挑战。', '第 4 周进度卡已生成。'],
        stickers: [['🎤', '音准稳定器', '麦克风对音准确'], ['🎼', '六音视唱手', '流畅视唱六个音'], ['🗝️', '五调通关', 'C/F/G/D/B♭ 全覆盖'], ['⭐', '5B 之星', '完成第 4 周']],
        wcEyebrow: '五级 · 第 4 周（5B）进度卡', skills: { sight: '5B · 六音视唱（麦克风）', sightkeys: '5B · 六音读谱（琴键）', singmatch: '单音音准' },
        card: (rows, date) => 'Dottino · ABRSM 五级听力 · 第 4 周（5B）\n' + rows.join('\n') + '\n完成于 ' + date + ' · dottino.app/aural?g=5&w=4'
      },
      5: {
        eyebrow: '五级听力 · 第 5 周 · 5C(i) 音乐特征 + 拓展能力', h1: '核心音乐特征 + 织体/终止式拓展。',
        intro: '夯实五级 5C(i) 四大基础特征（力度、奏法、速度、调性），同时在第 3 站提供「进阶听觉拓展（织体与终止式）」，帮孩子听穿多声部并自然衔接 6 级。',
        L: [
          { t: '强弱变化与连断奏', d: '渐强渐弱、突强突弱与连奏/断奏辨别。' },
          { t: '速度变化与乐段调性', d: '稳速/渐慢/渐快与完整乐段的大小调。' },
          { t: '拓展模块：织体与终止式', d: '综合音乐素养拓展（非五级独立必考项）：听声部层次与和声收尾。' },
          { t: '第 5 周挑战', d: '四大核心特征 + 织体与终止式拓展检验。' }
        ],
        seg: { feat: '5C(i) · 音乐特征', texture: '拓展 · 织体', cadence: '拓展 · 终止式', quiz: '第 5 周挑战' },
        hi: ['第 5 周：把 5C(i) 基础特征磨利！', '听速度起伏和调性色彩。', '进入音乐素养拓展：织体与终止式！', '第 5 周挑战，开启透视耳！'],
        dTitle: ['力度与触键清晰', '速度与调性稳健', '拓展听觉解锁', '五级第 5 周完成'],
        dNote: ['下一站：速度变化与调性。', '下一站：织体与终止式拓展。', '最后一站：第 5 周挑战。', '第 5 周进度卡已生成。'],
        stickers: [['🔊', '力度雷达', '抓准强弱与连断'], ['⏱️', '速度调性', '听清快慢与大小调'], ['🔀', '素养拓展+', '听懂织体与终止式'], ['⭐', '五级第 5 周', '完成第 5 周']],
        wcEyebrow: '五级 · 第 5 周进度卡', skills: { feat: '5C(i) · 强弱、连断、速度与调性', texture: '拓展 · 织体分辨', cadence: '拓展 · 终止式听感' },
        card: (rows, date) => 'Dottino · ABRSM 五级听力 · 第 5 周\n' + rows.join('\n') + '\n完成于 ' + date + ' · dottino.app/aural?g=5&w=5'
      },
      6: {
        eyebrow: '五级听力 · 第 6 周 · 5C(i) 风格与时期', h1: '巴洛克、古典、浪漫还是 20 世纪？',
        intro: '完整覆盖 ABRSM 五级 5C(i) 官方四大时期：巴洛克、古典、浪漫与 20 世纪/现代时期。每时期均配备 3 套快慢交错的原创片段，杜绝靠速度猜答案，真正练出可迁移的听觉判断力。',
        L: [
          { t: '巴洛克、浪漫与 20 世纪', d: '先从反差最鲜明的三大时期入手，快慢交错防泄题。' },
          { t: '官方四大时期全分辨', d: '巴洛克、古典、浪漫与 20 世纪/现代，共 12 套多样片段。' },
          { t: '性格描述与时期证据', d: '学会在考场给出有理有据的听觉依据。' },
          { t: '5C(i) 专项挑战', d: '同一首曲子串起特征、时期、节奏与拍号 + 性格复习。' }
        ],
        seg: { style: '5C(i) · 四大时期', char: '性格', feat: '特征', taprhythm: '节奏', meter: '2/3/4 拍', quiz: '5C(i) 专项挑战' },
        hi: ['第 6 周：别凭快慢猜，听和声与织体！', '四大官方时期同场分辨。', '用真凭实据向考官说明时期！', '5C(i) 专项挑战开始！'],
        dTitle: ['三大时期反差分明', '官方四大时期全拿下', '考场表达有理有据', '五级第 6 周 · 5C(i) 完成'],
        dNote: ['下一站：加入古典时期凑齐四大时期。', '下一站：性格与时期证据。', '最后一站：5C(i) 专项挑战。', '第 6 周进度卡已就绪。'],
        stickers: [['🎻', '反差侦探', '分清巴洛克/浪漫/现代'], ['🏛️', '四大时期通', '掌握 4 个官方时期'], ['🗣️', '考场表达王', '有理有据讲时期'], ['⭐', '5C(i) 之星', '完成第 6 周']],
        wcEyebrow: '五级 · 第 6 周（5C(i)）进度卡', skills: { style: '5C(i) · 四大时期风格', char: '音乐性格与依据' },
        card: (rows, date) => 'Dottino · ABRSM 五级听力 · 第 6 周（风格与时期）\n' + rows.join('\n') + '\n完成于 ' + date + ' · dottino.app/aural?g=5&w=6'
      },
      7: {
        eyebrow: '五级听力 · 第 7 周 · 5C(ii) 节奏拍回与 2/3/4 拍', h1: '拍回附点节奏，稳判 2/3/4 拍。',
        intro: '专项攻克 5C(ii)：在原速下拍回两小节附点节奏并判断 2/3/4 拍；第 3 站附带「6/8 复二拍律动拓展」（注：正式考级遇到 6/8 曲子请回答 2 拍）。',
        L: [
          { t: '附点节奏图与拍回', d: '看清附点长短比例，稳稳跟紧原速拍回。' },
          { t: '考场节奏与 2/3/4 拍集训', d: '两小节附点拍回 + 精准判断 2/3/4 拍。' },
          { t: '拓展模块：6/8 复二拍律动', d: '综合拓展：把三连摇曳的 6/8 复二拍与单拍子区分开。' },
          { t: '5C(ii) 专项挑战', d: '同一乐曲贯通 5C 流程 + 节奏与 2/3/4 拍检验。' }
        ],
        seg: { meter: '5C(ii) · 拍号', rhythm: '节奏图', taprhythm: '5C(ii) · 拍回节奏', feat: '特征', style: '时期', quiz: '5C(ii) 专项挑战' },
        hi: ['第 7 周：抓住附点一长一短的弹性！', '尽量贴紧原曲速度拍回。', '拓展练习：感受 6/8 复二拍摇摆律动！', '5C(ii) 专项挑战，上场！'],
        dTitle: ['附点节奏稳固', '考场节奏与 2/3/4 拍过关', '6/8 复二拍律动清晰', '五级第 7 周 · 5C(ii) 完成'],
        dNote: ['下一站：考场节奏与 2/3/4 拍。', '下一站：6/8 复二拍拓展。', '最后一站：5C(ii) 专项挑战。', '第 7 周完成！下周进入五级全真模拟考。'],
        stickers: [['👏', '附点达人', '精准拍回附点'], ['🥁', '5C(ii) 全能', '2/3/4 拍双稳'], ['🌊', '复拍感知', '听懂 6/8 复二拍'], ['⭐', '5C(ii) 之星', '完成第 7 周']],
        wcEyebrow: '五级 · 第 7 周（5C(ii)）进度卡', skills: { taprhythm: '5C(ii) · 五级节奏拍回', meter: '5C(ii) · 2/3/4 拍辨别', rhythm: '节奏图匹配' },
        card: (rows, date) => 'Dottino · ABRSM 五级听力 · 第 7 周（5C(ii)）\n' + rows.join('\n') + '\n完成于 ' + date + ' · dottino.app/aural?g=5&w=7'
      },
      8: {
        eyebrow: '五级听力 · 第 8 周 · 严格考纲全真模拟考', h1: '完整跑完 ABRSM 五级听力。',
        intro: '三套严格对齐 ABRSM 考纲顺序的五级模拟考：5A（八度内旋律回弹）、5B（五大调六音视唱）、统一乐曲 5C（同一首曲子连续考特征、四大时期、节奏拍回与 2/3/4 拍）。',
        L: [
          { t: '五级模拟考 1', d: '严格按考场顺序完成 5A、5B 与同曲 5C(i)+5C(ii)。' },
          { t: '薄弱项专攻', d: '自动强化模拟考 1 中最需要打磨的板块。' },
          { t: '五级模拟考 2', d: '再完整跑一遍，检验薄弱板块进步。' },
          { t: '终极五级模拟考', d: '最后冲刺演练，生成给老师看的五级听力报告。' }
        ],
        seg: { quiz: '五级模拟考', echo: '5A · 旋律回弹', sight: '5B · 六音视唱', feat: '5C(i) · 特征', style: '5C(i) · 四大时期', taprhythm: '5C(ii) · 节奏', meter: '5C(ii) · 2/3/4 拍' },
        wcEyebrow: '五级模拟考报告', wcTitle: '五级听力备考状态',
        skills: { A: '5A · 旋律听音弹回', B: '5B · 六音视唱（麦克风）', Bk: '5B · 六音读谱（琴键）', Ci: '5C(i) · 特征、风格与时期', Cii: '5C(ii) · 节奏与 2/3/4 拍' },
        card: (rows, date) => 'Dottino · ABRSM 五级听力 · 模拟考报告（练习结果，非官方评分）\n' + rows.join('\n') + '\n完成于 ' + date + ' · dottino.app/aural?g=5&w=8'
      }
    }
  };

  window.AURAL_GRADES = {
    G3_WEEKS, G5_WEEKS, G3_MOCK, G5_MOCK,
    GRADE_META, EXTRA_T, G3_COPY, G5_COPY,
    makeCadence, playCadence, cadenceSvg,
    makeTexture, playTexture, textureSvg,
    makeStyle, playStyle, styleSayIt, makeExamPiece5,
    makeMeter68, playMeter68
  };
})();
