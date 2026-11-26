/* Dottino Multi-Grade Curricula & Grade 5 Engines (ABRSM Grades 3 & 5 Aural Format).
   Loaded by aural.html right after pieces.js. Keeps Grade 4 100% untouched while supplying:
   - Full 8-week ABRSM Grade 3 plan (3A pulse/time, 3B echoes, 3C pitch/rhythm change, 3D features & major/minor)
   - Full 8-week ABRSM Grade 5 plan (5A extended melody, 5B 6-note sight-singing in C/F/G/D, 5C(i) texture/cadence/style/character, 5C(ii) rhythm + 2/3/4/6/8 time)
   - Bilingual EN + ZH week copy, stickers, teacher report cards, and visual SVG explainers. */
(function () {
  const rnd = n => Math.floor(Math.random() * n);
  const pick = a => a[rnd(a.length)];

  // =========================================================================
  // 1. GRADE 3 & GRADE 5 LESSON PLANS (8 weeks x 4 stops each)
  // =========================================================================

  // --- GRADE 3 (ABRSM 3A Pulse/Time, 3B Echoes, 3C Pitch/Rhythm Change, 3D Features/Mode) ---
  const G3_MOCK = [
    { t: 'tapbeat', lv: 1, sec: 'A3' },
    { t: 'meter', lv: 2, sec: 'A3' },
    { t: 'echo', lv: 2, sec: 'B3' },
    { t: 'echo', lv: 3, sec: 'B3' },
    { t: 'same', lv: 1, sec: 'C3' },
    { t: 'same', lv: 2, sec: 'C3' },
    { t: 'feat', lv: 1, a: 'dyn', sec: 'D3' },
    { t: 'feat', lv: 1, a: 'ton', sec: 'D3' }
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
      [ { type: 'quiz', items: [{ t: 'singmatch', lv: 0 }, { t: 'echo', lv: 2 }, { t: 'echo', lv: 2 }, { t: 'echo', lv: 3 }, { t: 'echo', lv: 3 }, { t: 'meter', lv: 2 }, { t: 'same', lv: 1 }] } ]
    ],
    6: [ // Test 3C focus: spot pitch vs rhythm change in a 2-bar phrase
      [ { type: 'same', level: 0, fixed: true, count: 3, warm: true }, { type: 'same', level: 1, fixed: true, count: 8 } ],
      [ { type: 'same', level: 1, fixed: true, count: 4 }, { type: 'same', level: 2, fixed: true, count: 6 } ],
      [ { type: 'same', level: 2, fixed: true, count: 8 } ],
      [ { type: 'quiz', items: [{ t: 'same', lv: 1 }, { t: 'same', lv: 1 }, { t: 'same', lv: 2 }, { t: 'same', lv: 2 }, { t: 'same', lv: 2 }, { t: 'echo', lv: 3 }, { t: 'tapbeat', lv: 1 }] } ]
    ],
    7: [ // Test 3D focus: dynamics, articulation, tempo changes & Major/Minor
      [ { type: 'mode', level: 0, fixed: true, count: 6 }, { type: 'mode', level: 1, fixed: true, count: 6 } ],
      [ { type: 'feat', aspect: 'dyn', level: 0, fixed: true, count: 4 }, { type: 'feat', aspect: 'art', level: 0, fixed: true, count: 4 }, { type: 'feat', aspect: 'dyn', level: 1, fixed: true, count: 3 } ],
      [ { type: 'feat', aspect: 'tempo', level: 0, fixed: true, count: 3 }, { type: 'feat', aspect: 'tempo', level: 1, fixed: true, count: 3 }, { type: 'feat', aspect: 'ton', level: 0, fixed: true, count: 4 } ],
      [ { type: 'quiz', items: [{ t: 'feat', lv: 1, a: 'dyn' }, { t: 'feat', lv: 1, a: 'art' }, { t: 'feat', lv: 1, a: 'tempo' }, { t: 'feat', lv: 1, a: 'ton' }, { t: 'mode', lv: 1 }, { t: 'same', lv: 2 }, { t: 'meter', lv: 2 }] } ]
    ],
    8: [ // Grade 3 Mock Exams (3A, 3B, 3C, 3D in real exam order)
      [ { type: 'quiz', items: G3_MOCK, exam: true } ],
      [ { type: 'weak' } ],
      [ { type: 'quiz', items: G3_MOCK, exam: true } ],
      [ { type: 'quiz', items: G3_MOCK, exam: true } ]
    ]
  };

  // --- GRADE 5 (ABRSM 5A Extended Melody, 5B 6-Note Sight-Singing, 5C(i) Features/Texture/Style/Cadence, 5C(ii) Rhythm & 2/3/4/6/8 Time) ---
  const G5_MOCK = [
    { t: 'echo', lv: 6, sec: 'A' },
    { t: 'echo', lv: 7, sec: 'A' },
    { t: 'sight', lv: 3, sec: 'B' },
    { t: 'sight', lv: 4, sec: 'B' },
    { t: 'cpair' },
    { t: 'texture', lv: 1, sec: 'Ci' },
    { t: 'style', lv: 1, sec: 'Ci' },
    { t: 'cii5' }
  ];

  const G5_WEEKS = {
    1: [ // Free Week 1: Grade 5 Foundations & Diagnostic
      [ { type: 'mode', level: 1, fixed: true, count: 6 }, { type: 'same', level: 2, fixed: true, count: 5 } ],
      [ { type: 'echo', level: 3, fixed: true, count: 3 }, { type: 'echo', level: 4, fixed: true, count: 4 } ],
      [ { type: 'meter', level: 2, fixed: true, count: 4 }, { type: 'meter', level: 3, fixed: true, count: 5 } ],
      [ { type: 'quiz', items: [{ t: 'echo', lv: 4 }, { t: 'mode', lv: 1 }, { t: 'same', lv: 2 }, { t: 'meter', lv: 3 }, { t: 'cadence', lv: 0 }, { t: 'texture', lv: 0 }, { t: 'feat', lv: 1, a: 'dyn' }] } ]
    ],
    2: [ // Test 5A Part 1: Rhythm + Major/Minor Melody Playback
      [ { type: 'mode', level: 1, fixed: true, count: 5 }, { type: 'echo', level: 4, fixed: true, count: 4 } ],
      [ { type: 'echo', level: 5, fixed: true, count: 6 } ],
      [ { type: 'echo', level: 6, fixed: true, count: 5 } ],
      [ { type: 'quiz', items: [{ t: 'echo', lv: 5 }, { t: 'echo', lv: 5 }, { t: 'echo', lv: 6 }, { t: 'echo', lv: 6 }, { t: 'mode', lv: 1 }, { t: 'meter', lv: 3 }] } ]
    ],
    3: [ // Test 5A Part 2: Extended Grade 5 Melodies (wider leaps, 3-4 bars, keys up to 3 sharps/flats)
      [ { type: 'echo', level: 6, fixed: true, count: 5 } ],
      [ { type: 'echo', level: 6, fixed: true, count: 2, warm: true }, { type: 'echo', level: 7, fixed: true, count: 5 } ],
      [ { type: 'echo', level: 7, fixed: true, count: 6 } ],
      [ { type: 'quiz', items: [{ t: 'echo', lv: 6 }, { t: 'echo', lv: 6 }, { t: 'echo', lv: 7 }, { t: 'echo', lv: 7 }, { t: 'echo', lv: 7 }, { t: 'cadence', lv: 0 }] } ]
    ],
    4: [ // Test 5B: 6-Note Sight-Singing (C, F, G, D major; range up to a 5th)
      [ { type: 'singmatch', fixed: true, count: 5 }, { type: 'sight', level: 2, fixed: true, count: 3 } ],
      [ { type: 'sight', level: 3, fixed: true, count: 6 } ],
      [ { type: 'sight', level: 4, fixed: true, count: 6 } ],
      [ { type: 'quiz', items: [{ t: 'sight', lv: 3 }, { t: 'sight', lv: 3 }, { t: 'sight', lv: 4 }, { t: 'sight', lv: 4 }, { t: 'echo', lv: 6 }, { t: 'cadence', lv: 1 }] } ]
    ],
    5: [ // Test 5C(i) Part 1: Texture & Cadences (Grade 5 core listening upgrades)
      [ { type: 'texture', level: 0, fixed: true, count: 6 } ],
      [ { type: 'texture', level: 1, fixed: true, count: 6 } ],
      [ { type: 'cadence', level: 0, fixed: true, count: 5 }, { type: 'cadence', level: 1, fixed: true, count: 5 } ],
      [ { type: 'quiz', items: [{ t: 'texture', lv: 1 }, { t: 'texture', lv: 1 }, { t: 'cadence', lv: 1 }, { t: 'cadence', lv: 1 }, { t: 'feat', lv: 1, a: 'dyn' }, { t: 'feat', lv: 1, a: 'art' }, { t: 'char', lv: 1 }] } ]
    ],
    6: [ // Test 5C(i) Part 2: Style, Period (Baroque / Classical / Romantic) & Character
      [ { type: 'style', level: 0, fixed: true, count: 6 } ],
      [ { type: 'style', level: 1, fixed: true, count: 6 } ],
      [ { type: 'char', level: 1, fixed: true, count: 4 }, { type: 'feat', aspect: 'tempo', level: 1, fixed: true, count: 3 }, { type: 'texture', level: 1, fixed: true, count: 3 } ],
      [ { type: 'quiz', items: [{ t: 'style', lv: 1 }, { t: 'style', lv: 1 }, { t: 'texture', lv: 1 }, { t: 'cadence', lv: 1 }, { t: 'char', lv: 1 }, { t: 'feat', lv: 1, a: 'ton' }, { t: 'cii5' }] } ]
    ],
    7: [ // Test 5C(ii): Compound Time 6/8 + Rhythm Clap-Back
      [ { type: 'meter', level: 3, fixed: true, count: 8 } ],
      [ { type: 'rhythm', level: 2, fixed: true, count: 4 }, { type: 'taprhythm', level: 1, fixed: true, count: 5 } ],
      [ { type: 'taprhythm', level: 2, fixed: true, count: 5 }, { type: 'meter', level: 3, fixed: true, count: 4 } ],
      [ { type: 'quiz', items: [{ t: 'cii5' }, { t: 'meter', lv: 3 }, { t: 'meter', lv: 3 }, { t: 'taprhythm', lv: 2 }, { t: 'style', lv: 1 }, { t: 'texture', lv: 1 }] } ]
    ],
    8: [ // Grade 5 Mock Exams (5A, 5B, 5C(i), 5C(ii) in real exam order)
      [ { type: 'quiz', items: G5_MOCK, exam: true } ],
      [ { type: 'weak' } ],
      [ { type: 'quiz', items: G5_MOCK, exam: true } ],
      [ { type: 'quiz', items: G5_MOCK, exam: true } ]
    ]
  };

  // =========================================================================
  // 2. NEW GRADE 5 QUESTION GENERATORS, AUDIO PLAYERS & VISUAL EXPLAINERS
  // =========================================================================

  // --- A. CADENCE (Perfect V->I, Imperfect ...->V, Interrupted V->vi) ---
  function makeCadence(level) {
    const keys = [
      { name: 'C', t: 60 }, { name: 'G', t: 67 }, { name: 'F', t: 65 }, { name: 'D', t: 62 }
    ];
    const K = pick(keys), t = K.t;
    const opts = level >= 1 ? ['perfect', 'imperfect', 'interrupted'] : ['perfect', 'imperfect'];
    const ans = pick(opts);
    // 4-chord progression (SATB-like 4-note voicings):
    // I -> IV -> V -> (I | V | vi)
    const chI   = [t - 12, t, t + 4, t + 7];
    const chIV  = [t - 7,  t, t + 5, t + 9];
    const chii  = [t - 10, t + 2, t + 5, t + 9];
    const chV   = [t - 5,  t - 1, t + 2, t + 7];
    const chvi  = [t - 3,  t, t + 4, t + 9];
    const chords = ans === 'perfect'
      ? [chI, chIV, chV, chI]
      : ans === 'imperfect'
      ? [chI, chIV, chI, chV]
      : [chI, chii, chV, chvi];
    return { type: 'cadence', ans, opts, chords, key: K.name, root: t, level };
  }

  function playCadence(q, playFn, slow) {
    const step = slow ? 1.05 : 0.78;
    q.chords.forEach((ch, idx) => {
      const start = 0.1 + idx * step;
      const len = idx === 3 ? step * 1.65 : step * 0.92;
      ch.forEach((m, j) => playFn(m, start + j * 0.008, j === 3 ? 0.78 : j === 0 ? 0.66 : 0.52, false, len));
    });
    return (0.1 + 3 * step + step * 1.7) * 1000;
  }

  function cadenceSvg(ans, zh) {
    const W = 320, H = 88;
    const labels = zh
      ? { perfect: ['I 主和弦', 'IV 下属', 'V 属和弦', 'I 稳稳回家'], imperfect: ['I 主和弦', 'IV 下属', 'I 主和弦', 'V 悬在半空 ?'], interrupted: ['I 主和弦', 'ii', 'V 属和弦', 'vi 意外小调 !'] }
      : { perfect: ['I', 'IV', 'V (tension)', 'I (home ✓)'], imperfect: ['I', 'IV', 'I', 'V (hanging ?)'], interrupted: ['I', 'ii', 'V (tension)', 'vi (surprise !)'] };
    const ys = ans === 'perfect' ? [52, 42, 26, 56] : ans === 'imperfect' ? [52, 42, 52, 24] : [52, 44, 26, 36];
    const xs = [44, 118, 194, 272];
    let s = `<div class="viz"><b>🔎 ${zh ? '和声终止式走向' : 'Harmonic cadence arc'}</b><svg viewBox="0 0 ${W} ${H}" role="img">`;
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

  // --- B. TEXTURE (Chordal / Melody + Accompaniment / Two Independent Lines) ---
  function makeTexture(level) {
    const opts = level >= 1 ? ['chordal', 'melacc', 'poly'] : ['chordal', 'poly'];
    const ans = pick(opts);
    const root = pick([60, 62, 65, 67]);
    return { type: 'texture', ans, opts, root, level };
  }

  function playTexture(q, playFn, slow) {
    const b = slow ? 0.56 : 0.44, r = q.root;
    const ev = [];
    if (q.ans === 'chordal') {
      // Rich hymnal block chords moving together in unison rhythm
      const prog = [
        [r - 12, r, r + 4, r + 7],
        [r - 7, r, r + 5, r + 9],
        [r - 5, r - 1, r + 2, r + 7],
        [r - 12, r, r + 4, r + 7],
        [r - 3, r, r + 4, r + 9],
        [r - 10, r + 2, r + 5, r + 9],
        [r - 5, r - 1, r + 2, r + 7],
        [r - 12, r, r + 4, r + 7]
      ];
      prog.forEach((ch, i) => {
        const d = (i === 3 || i === 7) ? 2 : 1;
        const t0 = i < 4 ? i : i + 1;
        ch.forEach((m, j) => ev.push([t0, d * 0.94, m, j === 3 ? 0.78 : 0.55]));
      });
    } else if (q.ans === 'melacc') {
      // Clear lyrical melody on top + Alberti broken-chord accompaniment underneath
      const mel = [[0, 1.5, r + 12], [1.5, 0.5, r + 14], [2, 1, r + 16], [3, 1, r + 12], [4, 1.5, r + 14], [5.5, 0.5, r + 12], [6, 2, r + 11], [8, 2, r + 12]];
      mel.forEach(([t0, d, m]) => ev.push([t0, d * 0.95, m, 0.85]));
      const bass = [
        [r - 12, r - 5, r - 8, r - 5],
        [r - 12, r - 5, r - 8, r - 5],
        [r - 10, r - 5, r - 7, r - 5],
        [r - 12, r - 5, r - 8, r - 5]
      ];
      bass.forEach((pat, bar) => {
        for (let i = 0; i < 4; i++) {
          ev.push([bar * 2 + i * 0.5, 0.45, pat[i], 0.44]);
        }
      });
      ev.push([8, 1.8, r - 12, 0.58], [8, 1.8, r - 8, 0.45], [8, 1.8, r - 5, 0.45]);
    } else {
      // Two independent contrapuntal lines (Bach-style canon/imitation: RH starts, LH imitates 2 beats later!)
      const subj = [[0, 0.5, 0], [0.5, 0.5, 2], [1, 0.5, 4], [1.5, 0.5, 5], [2, 1, 7], [3, 0.5, 4], [3.5, 0.5, 5], [4, 0.5, 7], [4.5, 0.5, 9], [5, 0.5, 7], [5.5, 0.5, 5], [6, 1, 4], [7, 1, 2], [8, 2, 0]];
      const scale = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16];
      const degM = (base, deg) => base + (scale[deg] != null ? scale[deg] : 0);
      subj.forEach(([t0, d, deg]) => ev.push([t0, d * 0.88, degM(r + 7, deg), 0.78]));
      // LH enters 2 beats later one octave lower with matching rhythmic independence
      subj.slice(0, 12).forEach(([t0, d, deg]) => ev.push([t0 + 2, d * 0.88, degM(r - 5, deg), 0.72]));
      ev.push([8, 2, r - 12, 0.72]);
    }
    let maxT = 0;
    ev.forEach(([t0, d, m, v]) => {
      const when = 0.1 + t0 * b;
      playFn(m, when, v, false, d * b);
      if (when + d * b > maxT) maxT = when + d * b;
    });
    return (maxT + 0.25) * 1000;
  }

  function textureSvg(ans, zh) {
    const W = 320, H = 86;
    let body = '';
    if (ans === 'chordal') {
      [26, 78, 130, 182, 234, 276].forEach(x => {
        body += `<rect x="${x}" y="18" width="24" height="46" rx="6" fill="var(--ink)" opacity=".75"/>`;
        [26, 38, 50].forEach(y => { body += `<circle cx="${x + 12}" cy="${y}" r="3.2" fill="#fff"/>`; });
      });
    } else if (ans === 'melacc') {
      body += `<path d="M 20 26 Q 90 12, 160 28 T 300 22" fill="none" stroke="var(--coral)" stroke-width="4" stroke-linecap="round"/>`;
      for (let i = 0; i < 14; i++) {
        const x = 22 + i * 20, y = i % 2 === 0 ? 58 : 48;
        body += `<circle cx="${x}" cy="${y}" r="3.5" fill="var(--ink)" opacity=".45"/>`;
      }
    } else {
      body += `<path d="M 20 26 L 60 18 L 105 30 L 155 18 L 210 28 L 296 22" fill="none" stroke="var(--coral)" stroke-width="3.2" stroke-linecap="round"/>`;
      body += `<path d="M 76 58 L 116 48 L 160 60 L 210 48 L 260 58 L 298 52" fill="none" stroke="var(--good)" stroke-width="3.2" stroke-linecap="round"/>`;
    }
    const cap = zh
      ? { chordal: '多声部齐步走（和弦柱式织体）', melacc: '上方歌唱旋律 + 下方规整伴奏', poly: '两只手各自独立对话（复调织体）' }[ans]
      : { chordal: 'Voices move together in chord blocks', melacc: 'Singing melody above steady accompaniment', poly: 'Two independent lines conversing (contrapuntal)' }[ans];
    return `<div class="viz"><b>🔎 ${zh ? '织体透视图' : 'Texture map'}: ${cap}</b><svg viewBox="0 0 ${W} ${H}" role="img">${body}</svg></div>`;
  }

  // --- C. STYLE & PERIOD (Baroque / Classical / Romantic) ---
  function makeStyle(level) {
    const opts = level >= 1 ? ['baroque', 'classical', 'romantic'] : ['baroque', 'romantic'];
    const ans = pick(opts);
    const root = pick([60, 62, 67]);
    return { type: 'style', ans, opts, root, level };
  }

  function playStyle(q, playFn, slow) {
    const r = q.root;
    const ev = [];
    let b = slow ? 0.5 : 0.38;
    if (q.ans === 'baroque') {
      // Crisp, terraced-dynamic two-voice Baroque dance with running 16th/8th drive and ornament turn
      b = slow ? 0.44 : 0.34;
      const rh = [[0,0.5,12],[0.5,0.5,14],[1,0.5,16],[1.5,0.5,14],[2,0.5,12],[2.5,0.5,11],[3,0.5,12],[3.5,0.5,7],[4,0.25,11],[4.25,0.25,12],[4.5,0.25,11],[4.75,0.25,9],[5,0.5,11],[5.5,0.5,7],[6,1,12],[7,1,12]];
      const lh = [[0,1,-12],[1,1,-8],[2,1,-5],[3,1,-8],[4,0.5,-5],[4.5,0.5,-7],[5,0.5,-8],[5.5,0.5,-10],[6,1,-12],[7,1,-12]];
      rh.forEach(([t0,d,off]) => ev.push([t0, d * 0.62, r + off, 0.78]));
      lh.forEach(([t0,d,off]) => ev.push([t0, d * 0.68, r + off, 0.68]));
    } else if (q.ans === 'classical') {
      // Clean Mozart-style balanced phrase + crisp Alberti bass + graceful cadence
      b = slow ? 0.52 : 0.4;
      const rh = [[0,1,12],[1,0.5,16],[1.5,0.5,19],[2,1,16],[3,1,14],[4,0.5,12],[4.5,0.5,14],[5,0.5,16],[5.5,0.5,12],[6,1,14],[7,1,12]];
      const alb = [-12,-5,-8,-5, -12,-5,-8,-5, -10,-5,-7,-5, -12,-5,-8,-5];
      rh.forEach(([t0,d,off]) => ev.push([t0, d * 0.88, r + off, 0.82]));
      alb.forEach((off, i) => ev.push([i * 0.5, 0.42, r + off, 0.44]));
    } else {
      // Expressive Romantic cantabile melody with warm wide rolling chords & gentle rubato
      b = slow ? 0.66 : 0.54;
      const mel = [[0,1.5,16],[1.5,0.5,17],[2,1.5,19],[3.5,0.5,16],[4,1,14],[5,1,12],[6,2.2,11]];
      mel.forEach(([t0,d,off], idx) => {
        const rub = idx >= 4 ? (idx - 3) * 0.08 : 0;
        const vol = idx === 2 ? 0.92 : idx >= 4 ? 0.62 : 0.74;
        ev.push([t0 + rub, d * 1.05, r + off, vol]);
      });
      const rolls = [
        [0, [-12, -5, 0, 4]],
        [2, [-15, -8, -3, 0]],
        [4, [-10, -3, 2, 5]],
        [6, [-17, -10, -5, -1]]
      ];
      rolls.forEach(([t0, ch]) => {
        ch.forEach((off, j) => ev.push([t0 + j * 0.14, 1.9, r + off, 0.46 + j * 0.04]));
      });
    }
    let maxT = 0;
    ev.forEach(([t0, d, m, v]) => {
      const when = 0.1 + t0 * b;
      playFn(m, when, v, false, d * b);
      if (when + d * b > maxT) maxT = when + d * b;
    });
    return (maxT + 0.3) * 1000;
  }

  function styleSayIt(ans, zh) {
    const map = zh ? {
      baroque: '「这听起来像巴洛克时期：声部线条独立清晰、节奏推进稳定工整，带有干脆的装饰音感。」',
      classical: '「这听起来像古典时期：乐句对称清晰，左手是规整轻巧的阿尔贝蒂分解伴奏，结构优雅平衡。」',
      romantic: '「这听起来像浪漫时期：旋律充满歌唱性，和声宽广温暖，力度起伏丰富并带有自然弹性速度。」'
    } : {
      baroque: '“This sounds Baroque: clear independent lines, a steady motoric rhythm, and crisp ornamentation.”',
      classical: '“This sounds Classical: balanced, symmetrical phrases with a light Alberti-bass accompaniment and clear cadence.”',
      romantic: '“This sounds Romantic: a singing cantabile melody, warm rich rolling chords, and expressive dynamic/tempo shaping.”'
    };
    return `<div class="say-it">${zh ? '考场可以这样说：' : 'In the exam you could say: '}<q>${map[ans]}</q></div>`;
  }

  // --- D. COMPOUND 6/8 METER GENERATOR (meter level 3 for Grade 5) ---
  function makeMeter68() {
    const k = pick([2, 3, 4, 6]); // 6 = compound 6/8 (2 dotted-crotchet beats per bar, subdivided in 3s!)
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
    // Compound 6/8: 4 bars of 2 compound beats (6 quavers per bar: ONE-2-3 FOUR-5-6)
    const bars = 4; let d = 2 + rnd(4); const ev = [];
    for (let b = 0; b < bars; b++) {
      for (let beat = 0; beat < 2; beat++) {
        const pat = pick([[0, 1/3, 2/3], [0, 2/3], [0, 1/3, 2/3]]); // triplet lilts or long-short (♪. ♪ -> ♩ ♪)
        pat.forEach((sub, si) => {
          d = Math.max(0, Math.min(7, d + pick([-1, 1, 1, -1, 0])));
          ev.push({ m: SCALE[d], beat, bar: b, sub, strong: beat === 0 && si === 0, mid: beat === 1 && si === 0 });
        });
      }
    }
    return { type: 'meter', k: 6, bars, ev, level: 3, accent: 0.85, compound: true };
  }

  function playMeter68(q, playFn, tickFn, slow, count) {
    const beat = slow ? 0.96 : 0.76; // one dotted-crotchet beat
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
      for (let b = 0; b < q.bars; b++) {
        tickFn(0.1 + (b * 2) * beat, true);
        tickFn(0.1 + (b * 2 + 1) * beat, false);
      }
    }
    return (maxW + 0.7) * 1000;
  }

  // =========================================================================
  // 3. BILINGUAL TEXT OVERRIDES FOR GRADE 3 & GRADE 5
  // =========================================================================
  const GRADE_META = {
    3: {
      en: {
        name: 'Grade 3',
        badge: 'Grade 3 · ABRSM 3A–3D',
        payTitle: 'Grade 3 Aural Pack · £15',
        paySub: 'All 8 weeks of Grade 3 aural practice (pulse & 2/3/4 time, echo singing, pitch/rhythm changes, features & major/minor), for 6 months.',
        quick: [
          { href: '/ear-check/?ref=aural-g3', w: 0, t: '🎯 3-Min Check', s: 'Find weak spots' },
          { href: '?g=3&w=4', w: 4, t: '🥁 3A · Pulse & Time', s: 'Week 4 · 2/3/4 time' },
          { href: '?g=3&w=6', w: 6, t: '🔍 3C · Pitch/Rhythm', s: 'Week 6 · Spot change' },
          { href: '?g=3&w=8', w: 8, t: '⏱ Grade 3 Mock', s: 'Exam order · Wk 8' }
        ]
      },
      zh: {
        name: '三级',
        badge: '三级 · ABRSM 3A–3D',
        payTitle: '三级听力训练包 · £15',
        paySub: '完整 8 周三级听力练习（拍子与 2/3/4 拍、旋律回声、音高/节奏找不同、音乐特征与大小调），可用 6 个月。',
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
        name: 'Grade 5',
        badge: 'Grade 5 · ABRSM 5A–5C',
        payTitle: 'Grade 5 Aural Pack · £15',
        paySub: 'All 8 weeks of Grade 5 aural practice (extended melodies, 6-note sight-singing, texture, cadences, Baroque/Classical/Romantic style & 6/8 time), for 6 months.',
        quick: [
          { href: '?g=5&w=3', w: 3, t: '🎹 5A · Long Melody', s: 'Week 3 · 3–4 bars' },
          { href: '?g=5&w=4', w: 4, t: '🎤 5B · 6-Note Sing', s: 'Week 4 · C/F/G/D' },
          { href: '?g=5&w=5', w: 5, t: '🏛 5C(i) · Texture/Style', s: 'Weeks 5–6 · New in G5' },
          { href: '?g=5&w=8', w: 8, t: '⏱ Grade 5 Mock', s: 'Exam order · Wk 8' }
        ]
      },
      zh: {
        name: '五级',
        badge: '五级 · ABRSM 5A–5C',
        payTitle: '五级听力训练包 · £15',
        paySub: '完整 8 周五级听力练习（长旋律回弹、6 音视唱、织体/终止式/时期风格与 6/8 复拍子），可用 6 个月。',
        quick: [
          { href: '?g=5&w=3', w: 3, t: '🎹 5A · 长旋律回弹', s: '第 3 周 · 3–4 小节' },
          { href: '?g=5&w=4', w: 4, t: '🎤 5B · 六音视唱', s: '第 4 周 · C/F/G/D' },
          { href: '?g=5&w=5', w: 5, t: '🏛 5C(i) · 织体/风格', s: '第 5–6 周 · 五级新增' },
          { href: '?g=5&w=8', w: 8, t: '⏱ 五级模拟考', s: '考场顺序 · 第 8 周' }
        ]
      }
    }
  };

  // Extra shared dictionary keys injected into T.en & T.zh for new Grade 3/5 question types
  const EXTRA_T = {
    en: {
      pCadence: 'How does this phrase end?',
      sCadence: 'Listen to the final two chords. Does it feel completely home (Perfect), left hanging (Imperfect), or take a surprise turn (Interrupted)?',
      cadName: { perfect: 'Finished (Perfect · V→I)', imperfect: 'Unfinished (Imperfect · →V)', interrupted: 'Surprise (Interrupted · V→vi)' },
      cadIcon: { perfect: '🏠', imperfect: '❓', interrupted: '⚡' },
      cadRight: n => 'Yes — ' + n + '.',
      wrongCad: ans => ans === 'perfect' ? 'That landed firmly back on home (Perfect cadence, V→I).' : ans === 'imperfect' ? 'That paused on the dominant chord, sounding unfinished like a comma (Imperfect cadence).' : 'That built tension on V, then swerved onto the darker vi chord instead of home (Interrupted cadence).',
      pTexture: 'What texture do you hear?',
      sTexture: 'Listen to how the hands work together: chord blocks moving together, a clear melody with accompaniment, or two independent voices conversing?',
      texName: { chordal: 'Chordal (moving together)', melacc: 'Melody + accompaniment', poly: 'Two independent lines (contrapuntal)' },
      texIcon: { chordal: '🧱', melacc: '🎶', poly: '🔀' },
      texRight: n => 'Yes — ' + n.toLowerCase() + '.',
      wrongTex: ans => ans === 'chordal' ? 'All the voices moved together in hymn-like chord blocks (chordal texture).' : ans === 'melacc' ? 'There was one singing tune on top supported by a steady broken-chord accompaniment.' : 'Both hands played independent melodic lines imitating each other (contrapuntal texture).',
      pStyle: 'Which musical period does this sound like?',
      sStyle: 'Listen for texture, accompaniment pattern and expression: crisp motoric lines (Baroque), balanced Alberti bass (Classical), or warm singing rubato (Romantic).',
      styName: { baroque: 'Baroque', classical: 'Classical', romantic: 'Romantic' },
      styIcon: { baroque: '🎻', classical: '🏛️', romantic: '🌹' },
      styRight: n => 'Yes — ' + n + ' style.',
      wrongSty: ans => 'This example has classic ' + ans[0].toUpperCase() + ans.slice(1) + ' fingerprints. Hear it again and notice the accompaniment and phrasing.',
      pMeter68: 'Is it in 2, 3, 4 or 6/8 time?',
      sMeter68: 'Count the strong beats first. If each main beat swings in threes (“ONE-2-3 FOUR-5-6”), it is compound 6/8 time.',
      timeOf68: k => k === 6 ? '6/8 time' : k + ' time',
      wrongMeter68: k => k === 6 ? 'It was in 6/8 (compound duple) time: ONE-2-3, FOUR-5-6 — two swinging beats per bar, each split into three.' : 'It was in ' + k + ' time (simple beats, not swinging in threes). Hear it again with the beats counted.',
      keyNameD: { C: 'C major', F: 'F major (B♭)', G: 'G major (F♯)', D: 'D major (F♯, C♯)' },
      pSight6: 'Sing these six notes',
      pSightKeys6: 'Read these six notes and tap them',
      secLongG3: { A3: 'Test 3A · pulse & 2/3/4 time', B3: 'Test 3B · echo phrases', C3: 'Test 3C · pitch or rhythm change', D3: 'Test 3D · features & major/minor' },
      secLongG5: { A: 'Test 5A · play back melody', B: 'Test 5B · sight-sing 6 notes', Bk: 'Test 5B · 6-note reading (keys)', Ci: 'Test 5C(i) · features, texture & style', Cii: 'Test 5C(ii) · rhythm & 2/3/4/6-8 time' }
    },
    zh: {
      pCadence: '这个乐句是怎么收尾的？',
      sCadence: '重点听最后两个和弦：稳稳回到家（完满终止）、像逗号一样悬在半空（半终止），还是突然拐进暗色小调（阻碍终止）？',
      cadName: { perfect: '稳稳结束（完满终止 V→I）', imperfect: '悬在半空（半终止 →V）', interrupted: '意外转折（阻碍终止 V→vi）' },
      cadIcon: { perfect: '🏠', imperfect: '❓', interrupted: '⚡' },
      cadRight: n => '听对了——' + n + '。',
      wrongCad: ans => ans === 'perfect' ? '这句稳稳落回了主和弦，有明确的结束感（完满终止 V→I）。' : ans === 'imperfect' ? '这句停在属和弦上，像一个逗号，还没说完（半终止）。' : '属和弦制造了回家预期，结果意外滑向暗色的 vi 级小和弦（阻碍终止）。',
      pTexture: '你听到的是哪种音乐织体？',
      sTexture: '听两只手如何配合：像赞美诗一样齐步走的和弦柱式、上方歌唱旋律加伴奏，还是两只手互相追逐对话的复调？',
      texName: { chordal: '和弦柱式（齐步走）', melacc: '旋律 + 伴奏（主调）', poly: '双声部独立对话（复调）' },
      texIcon: { chordal: '🧱', melacc: '🎶', poly: '🔀' },
      texRight: n => '听对了——' + n + '。',
      wrongTex: ans => ans === 'chordal' ? '所有声部按相同节奏齐步前进，是典型的和弦柱式织体。' : ans === 'melacc' ? '右手唱出清晰旋律，左手用平稳分解和弦托底，是经典的主调伴奏织体。' : '左右手各自带着独立旋律线条先后模仿对话，是典型的复调织体。',
      pStyle: '这段音乐属于哪个时期风格？',
      sStyle: '抓核心听觉线索：工整清晰的声部与装饰音（巴洛克）、轻巧阿尔贝蒂伴奏与对称乐句（古典）、宽广滚动和声与歌唱性起伏（浪漫）。',
      styName: { baroque: '巴洛克时期', classical: '古典时期', romantic: '浪漫时期' },
      styIcon: { baroque: '🎻', classical: '🏛️', romantic: '🌹' },
      styRight: n => '听对了——' + n + '风格。',
      wrongSty: ans => '这段带着鲜明的' + ({ baroque: '巴洛克', classical: '古典', romantic: '浪漫' }[ans]) + '时期听觉指纹，再听一遍感受它的伴奏型与乐句呼吸。',
      pMeter68: '这是 2 拍、3 拍、4 拍，还是 6/8 拍？',
      sMeter68: '先找强拍：如果每大拍里摇曳着三连音感（「强-弱-弱 次强-弱-弱」），就是 6/8 复拍子。',
      timeOf68: k => k === 6 ? '6/8 复拍子' : k + ' 拍',
      wrongMeter68: k => k === 6 ? '这是 6/8 复拍子：每小节两大拍，每大拍摇曳地分成三小份（ONE-2-3, FOUR-5-6）。' : '这是单纯的 ' + k + ' 拍，不是三份摇摆的 6/8 拍。配着节拍声再听一遍。',
      keyNameD: { C: 'C 大调', F: 'F 大调（降 B）', G: 'G 大调（升 F）', D: 'D 大调（升 F、升 C）' },
      pSight6: '视唱这六个音',
      pSightKeys6: '读出这六个音并在琴键上按出来',
      secLongG3: { A3: '3A · 拍子与 2/3/4 拍', B3: '3B · 旋律回声', C3: '3C · 音高或节奏变化', D3: '3D · 音乐特征与大小调' },
      secLongG5: { A: '5A · 听音弹回旋律', B: '5B · 六音视唱（麦克风）', Bk: '5B · 六音读谱（琴键）', Ci: '5C(i) · 特征、织体与时期', Cii: '5C(ii) · 节奏与 2/3/4/6-8 拍' }
    }
  };

  // --- GRADE 3 WEEK COPY (EN + ZH) ---
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
        intro: 'Start preparing Tests 3A and 3B: feel 2, 3 and 4 time from the bass accent, and hold a four-note shape cleanly in memory.',
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
        intro: 'In ABRSM Grade 3 Test A, the examiner plays a short piece while you clap the pulse, then asks whether it is in 2, 3 or 4 time. Practice steady pulse tapping and crisp rhythmic feel.',
        L: [
          { t: 'Tap along with the pulse', d: 'Keep steady clock-like taps while the music plays.' },
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
        intro: 'In ABRSM Grade 3 Test B, you sing back three short phrases as echoes. Warm up with live microphone pitch matching, then practise echoing phrases in major and minor keys.',
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
        intro: 'Test 3C is where many Grade 3 candidates hesitate: the examiner plays a short phrase twice and asks whether a pitch or rhythm changed. See the exact moving piano key or rhythm block after every question.',
        L: [
          { t: 'Pitch vs rhythm starter', d: 'Warm up with pitch changes, then distinguish pitch from rhythm.' },
          { t: 'Longer five-note phrases', d: 'Hold five notes in working memory while comparing both playings.' },
          { t: 'Exam-speed 3C drill', d: 'Eight real-style five-note phrases with instant piano & rhythm visual reveal.' },
          { t: 'Test 3C challenge', d: 'Five Test 3C questions mixed with Test 3A and 3B.' }
        ],
        seg: { same: 'Test 3C · Pitch or rhythm', echo: 'Echo phrase', tapbeat: 'Tap beat', quiz: 'Test 3C challenge' },
        hi: ['Test 3C week! Did the pitch move, or the rhythm?', 'Five-note phrases now — keep both versions clear.', 'Exam-speed 3C drill. Sharp ears!', 'Test 3C challenge — let’s go!'],
        dTitle: ['Pitch vs rhythm separated', 'Five-note comparisons solid', 'Exam-speed 3C mastered', 'Week 6 · Test 3C complete'],
        dNote: ['Next: five-note phrases.', 'Next: exam-speed drill.', 'One more stop: Test 3C challenge.', 'Your Week 6 card is ready.'],
        stickers: [['🔍', 'Change Detective', 'Tells pitch from rhythm'], ['🎹', 'Key Spotter', 'Spots changes in 5 notes'], ['⚡', 'Sharp Ear', 'Exam-speed 3C drill'], ['⭐', '3C Star', 'Finished Week 6']],
        wcEyebrow: 'Week 6 · Test 3C card', skills: { same: 'Spotting pitch vs rhythm changes (3C)' },
        card: (rows, date) => 'Dottino · ABRSM Grade 3 Aural · Week 6 (Test 3C)\n' + rows.join('\n') + '\nCompleted ' + date + ' · dottino.app/aural?g=3&w=6'
      },
      7: {
        eyebrow: 'Grade 3 Aural · Week 7 · Test 3D Focus', h1: 'Major or minor, dynamics & tempo.',
        intro: 'In ABRSM Grade 3 Test D, the examiner plays a short piece and asks about two musical features — dynamics, articulation, tempo changes, and (new at Grade 3!) major or minor tonality.',
        L: [
          { t: 'Major or minor (new in Grade 3)', d: 'Hear the bright major 3rd vs darker minor 3rd across multiple keys.' },
          { t: 'Dynamics & articulation', d: 'Crescendo, diminuendo, sudden f/p contrasts, legato vs staccato.' },
          { t: 'Tempo changes & tonality', d: 'Steady vs slowing/speeding up, plus major vs minor in full pieces.' },
          { t: 'Test 3D challenge', d: 'All four Test 3D features mixed with 3A and 3C.' }
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
        intro: 'Three full Grade 3 mock exams in exact exam order: Test 3A (pulse & 2/3/4 time), Test 3B (echo phrases), Test 3C (pitch or rhythm change) and Test 3D (features & major/minor). Stop 2 automatically drills your weakest section.',
        L: [
          { t: 'Grade 3 Mock Exam 1', d: 'Tests 3A, 3B, 3C and 3D in real exam order.' },
          { t: 'Your focus stop', d: 'Targeted practice on whichever test needed most work in Mock 1.' },
          { t: 'Grade 3 Mock Exam 2', d: 'Full run-through again — check how much steadier your focus area is.' },
          { t: 'Final Grade 3 Mock', d: 'Last exam run + teacher-ready Grade 3 practice report.' }
        ],
        seg: { quiz: 'Grade 3 Mock', tapbeat: 'Test 3A · Pulse', meter: 'Test 3A · Time', echo: 'Test 3B · Echo', same: 'Test 3C · Change', feat: 'Test 3D · Features' },
        wcEyebrow: 'Grade 3 practice report', wcTitle: 'Grade 3 aural readiness',
        skills: { A3: 'Test 3A · pulse & 2/3/4 time', B3: 'Test 3B · echo phrases', C3: 'Test 3C · pitch or rhythm change', D3: 'Test 3D · features & major/minor' },
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
        intro: 'ABRSM 三级 3A 要求边听音乐边拍出稳定拍子，并判断是 2 拍、3 拍还是 4 拍。本周专项打磨稳拍感与强拍感知。',
        L: [
          { t: '跟着音乐拍出稳拍', d: '像节拍器一样均匀拍击，不抢拍不拖拍。' },
          { t: '边拍边判 2/3/4 拍', d: '先用手感受强拍回归周期，再说出拍号。' },
          { t: '拍回两小节短节奏', d: '强化拍内细分与长短时值感。' },
          { t: '3A 专项挑战', d: '综合 3A 拍子与拍号，穿插回声与找不同。' }
        ],
        seg: { tapbeat: '3A · 拍出拍子', meter: '3A · 2/3/4 拍', rhythm: '节奏图', taprhythm: '拍回节奏', echo: '旋律回声', same: '找不同', quiz: '3A 专项挑战' },
        hi: ['3A 专项周！像钟表一样稳稳打拍。', '先感受强拍，再说出几拍子。', '现在把短节奏拍回来。', '3A 专项挑战，准备好了吗？'],
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
        intro: '3C 是三级考生最容易犹豫的一题：短句听两遍，判断变的是音高还是节奏。每题答完直接亮出变动琴键或节奏方块，一眼看穿。',
        L: [
          { t: '音高 vs 节奏入门', d: '先热身纯音高变化，再区分音高变化与节奏变化。' },
          { t: '进阶五音短句', d: '把五音短句装进工作记忆，清晰对比两遍差异。' },
          { t: '考场节奏 3C 强化', d: '8 题真实长度五音找不同，配全宽迷你键盘解析。' },
          { t: '3C 专项挑战', d: '5 题 3C 密集考验，穿插 3A 与 3B。' }
        ],
        seg: { same: '3C · 音高或节奏', echo: '旋律回声', tapbeat: '稳拍', quiz: '3C 专项挑战' },
        hi: ['3C 专项周！听听变的是音高还是节奏？', '升级五音短句，稳住两遍对比。', '考场速度 3C 强化，竖起耳朵！', '3C 专项挑战开始！'],
        dTitle: ['音高与节奏分清了', '五音找不同很稳', '考场节奏 3C 拿下', '第 6 周 · 3C 完成'],
        dNote: ['下一站：五音短句对比。', '下一站：考场速度强化。', '最后一站：3C 专项挑战。', '第 6 周进度卡已生成。'],
        stickers: [['🔍', '变化侦探', '秒分音高与节奏'], ['🎹', '琴键鹰眼', '五音变化精准定位'], ['⚡', '极速分辨', '通过考场 3C 强化'], ['⭐', '3C 之星', '完成第 6 周']],
        wcEyebrow: '第 6 周 · 3C 进度卡', skills: { same: '辨别音高或节奏变化（3C）' },
        card: (rows, date) => 'Dottino · ABRSM 三级听力 · 第 6 周（3C）\n' + rows.join('\n') + '\n完成于 ' + date + ' · dottino.app/aural?g=3&w=6'
      },
      7: {
        eyebrow: '三级听力 · 第 7 周 · 3D 考题专项', h1: '大小调、强弱、连断与速度。',
        intro: 'ABRSM 三级 3D 听完整乐段回答两项音乐特征——强弱变化、连奏/断奏、速度变化，以及三级新增的「大调还是小调」。',
        L: [
          { t: '大调还是小调（三级新增）', d: '跨多个主音听清大三度与小三度半音色彩差异。' },
          { t: '强弱与连断奏', d: '渐强渐弱、突强突弱，以及连奏 legato 与断奏 staccato。' },
          { t: '速度变化与乐段调性', d: '稳定/渐慢/渐快，以及真实乐段的大调/小调。' },
          { t: '3D 专项挑战', d: '四类 3D 特征综合测验，衔接下周模拟考。' }
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
        intro: '三套严格按考场顺序编排的三级模拟考：3A（稳拍与 2/3/4 拍）、3B（旋律回声）、3C（音高或节奏变化）、3D（音乐特征与大小调）。第 2 站自动针对模拟 1 最弱项强化。',
        L: [
          { t: '三级模拟考 1', d: '按考场顺序完成 3A、3B、3C、3D 全部四项。' },
          { t: '薄弱项专攻', d: '自动强化模拟考 1 中最需要打磨的那一项。' },
          { t: '三级模拟考 2', d: '再跑一整套，检验薄弱项是否已经站稳。' },
          { t: '终极三级模拟考', d: '考前最后演练，生成给老师看的完整报告。' }
        ],
        seg: { quiz: '三级模拟考', tapbeat: '3A · 拍子', meter: '3A · 拍号', echo: '3B · 回声', same: '3C · 找不同', feat: '3D · 特征' },
        wcEyebrow: '三级模拟考报告', wcTitle: '三级听力备考状态',
        skills: { A3: '3A · 拍子与 2/3/4 拍', B3: '3B · 旋律回声', C3: '3C · 音高或节奏变化', D3: '3D · 音乐特征与大小调' },
        card: (rows, date) => 'Dottino · ABRSM 三级听力 · 模拟考报告（练习结果，非官方评分）\n' + rows.join('\n') + '\n完成于 ' + date + ' · dottino.app/aural?g=3&w=8'
      }
    }
  };

  // --- GRADE 5 WEEK COPY (EN + ZH) ---
  const G5_COPY = {
    en: {
      1: {
        eyebrow: 'Grade 5 Aural · Week 1 · Free (ABRSM format)', h1: 'Sharpen your Grade 5 ears.',
        intro: 'Week 1 checks every skill stepping up to ABRSM Grade 5: major/minor tonal memory, 5-note changes, compound 6/8 feel, and a first taste of Grade 5 cadences and texture. Four 10-minute stops, free.',
        L: [
          { t: 'Major/minor & 5-note changes', d: 'Cross-key mode listening plus exam-speed pitch/rhythm discrimination.' },
          { t: 'Five & six-note melody memory', d: 'Key chord + starting note + clean melodic playback.' },
          { t: 'Meet 6/8 compound time', d: 'Tell 2, 3 and 4 time apart from swinging compound 6/8.' },
          { t: 'Grade 5 Week 1 check', d: 'A quick snapshot across melody, 6/8 time, cadences and texture.' }
        ],
        seg: { mode: 'Major or minor', same: 'Spot change', echo: 'Melody playback', meter: '2/3/4 or 6/8 time', cadence: 'Cadences', texture: 'Texture', feat: 'Features', quiz: 'Week 1 check' },
        hi: ['Welcome to Grade 5! Sharp ears ready?', 'Hold 5 and 6-note melodies cleanly.', 'Meet compound 6/8 time today!', 'Week 1 Grade 5 diagnostic — go!'],
        dTitle: ['Mode & changes sharp', 'Melody memory warmed up', '6/8 compound feel unlocked', 'Grade 5 Week 1 complete'],
        dNote: ['Next: 5 and 6-note playback.', 'Next: compound 6/8 time.', 'One more stop: Grade 5 Week 1 check.', 'Your Week 1 card is ready on the week page.'],
        stickers: [['🎯', 'G5 Starter', 'Warm-up complete'], ['🎹', 'Melody Keeper', 'Holds 6-note tunes'], ['🌊', '6/8 Swinger', 'Feels compound time'], ['⭐', 'G5 Week 1', 'Finished Week 1']],
        wcEyebrow: 'Grade 5 · Week 1 card', skills: { mode: 'Major & minor', same: 'Fine change spotting', echo: 'Melodic memory', meter: '2/3/4 & 6/8 time' },
        card: (rows, date) => 'Dottino · ABRSM Grade 5 Aural · Week 1\n' + rows.join('\n') + '\nCompleted ' + date + ' · dottino.app/aural?g=5'
      },
      2: {
        eyebrow: 'Grade 5 Aural · Week 2 · Test 5A Part 1', h1: 'Play back melodies with rhythm.',
        intro: 'Build Test 5A fluency: hear the key chord, starting note and count-in, then play back two- to three-bar melodies in major and minor keys with accurate pitch AND rhythm.',
        L: [
          { t: 'Key colour & 6-note tunes', d: 'Lock in major/minor tonal expectations before playing back.' },
          { t: 'Two-bar rhythmic melodies', d: 'Count-in + two bars in C, G, F, Am, Em, Dm — pitch and rhythm both count.' },
          { t: 'Three-bar exam melodies', d: 'Longer phrases with leaps and wider range (up to 3 sharps/flats).' },
          { t: 'Week 2 challenge', d: 'Four rhythmic play-backs plus mode and 6/8 time check.' }
        ],
        seg: { mode: 'Major or minor', echo: 'Test 5A · Play back', meter: '2/3/4/6-8 time', quiz: 'Week 2 challenge' },
        hi: ['Week 2: Test 5A with rhythm!', 'Feel the two-bar count-in.', 'Stretching to 3-bar melodies now.', 'Week 2 challenge — ready?'],
        dTitle: ['Key feel locked', '2-bar rhythmic playback solid', '3-bar melodies conquered', 'Grade 5 Week 2 complete'],
        dNote: ['Next: 2-bar rhythmic melodies.', 'Next: 3-bar exam phrases.', 'One more stop: Week 2 challenge.', 'Your Week 2 card is ready.'],
        stickers: [['🌗', 'Tonal Anchor', 'Locks into the key'], ['🎹', 'Rhythmic Echo', '2-bar playback'], ['🎼', 'Long Phrase', '3-bar playback'], ['⭐', 'G5 Week 2', 'Finished Week 2']],
        wcEyebrow: 'Grade 5 · Week 2 card', skills: { mode: 'Major & minor', echo: 'Test 5A · rhythmic playback' },
        card: (rows, date) => 'Dottino · ABRSM Grade 5 Aural · Week 2 (Test 5A)\n' + rows.join('\n') + '\nCompleted ' + date + ' · dottino.app/aural?g=5&w=2'
      },
      3: {
        eyebrow: 'Grade 5 Aural · Week 3 · Test 5A Part 2', h1: 'Full-length Grade 5 melodies.',
        intro: 'Push Test 5A to full Grade 5 exam length: up to 4 bars, wider intervals (4ths & 5ths), minor leading notes and dotted rhythms across keys up to 3 sharps/flats.',
        L: [
          { t: 'Multi-key 3-bar phrases', d: 'Fluent playback across major and minor keys up to 3 sharps/flats.' },
          { t: 'Wider leaps & 4-bar phrases', d: 'Chunk arpeggios and cadence endings instead of memorising note by note.' },
          { t: 'Grade 5 Test 5A drill', d: 'Six full-length exam-level melodies back to back.' },
          { t: 'Test 5A challenge', d: 'Five Test 5A melodies plus a cadence ear check.' }
        ],
        seg: { echo: 'Test 5A · Extended melody', cadence: 'Cadence', quiz: 'Test 5A challenge' },
        hi: ['Week 3: full Grade 5 melody length!', 'Chunk the leaps and cadence endings.', 'Six exam-level melodies — stay calm!', 'Test 5A challenge — let’s go!'],
        dTitle: ['Multi-key playback fluent', '4-bar phrases chunked cleanly', 'Full Test 5A drill done', 'Grade 5 Week 3 · Test 5A complete'],
        dNote: ['Next: wider leaps & 4-bar melodies.', 'Next: full Test 5A drill.', 'One more stop: Test 5A challenge.', 'Your Week 3 card is ready.'],
        stickers: [['🗝️', 'Key Hopper', 'Plays back across keys'], ['🧠', 'Phrase Chunker', 'Holds 4-bar melodies'], ['🏆', '5A Master', 'Exam-length playback'], ['⭐', '5A Star', 'Finished Week 3']],
        wcEyebrow: 'Grade 5 · Week 3 (Test 5A) card', skills: { echo: 'Test 5A · full Grade 5 melody playback', cadence: 'Phrase endings' },
        card: (rows, date) => 'Dottino · ABRSM Grade 5 Aural · Week 3 (Test 5A)\n' + rows.join('\n') + '\nCompleted ' + date + ' · dottino.app/aural?g=5&w=3'
      },
      4: {
        eyebrow: 'Grade 5 Aural · Week 4 · Test 5B Focus', h1: 'Sight-sing six notes across four keys.',
        intro: 'In ABRSM Grade 5 Test B, you sight-sing SIX notes (up from 5 at Grade 4) in C, F, G or D major, reaching up to a 5th from the tonic. Live microphone pitch guidance checks every note — or tap on keys.',
        L: [
          { t: 'Voice warm-up + 5-note bridge', d: 'Lock pitch accuracy with the mic, then bridge smoothly from 5 notes.' },
          { t: 'Six notes in C, F & G major', d: 'Longer 6-note lines with wider intervals up to a 4th/5th.' },
          { t: 'Add D major (F♯, C♯)', d: 'Full Grade 5 Test B range across C, F, G and D major in treble or bass clef.' },
          { t: 'Test 5B challenge', d: 'Four Grade 5 six-note sight-singing lines plus Test 5A and cadence review.' }
        ],
        seg: { singmatch: 'Voice warm-up', sight: 'Test 5B · 6-note sight-sing', echo: 'Test 5A', cadence: 'Cadence', quiz: 'Test 5B challenge' },
        hi: ['Test 5B week! Warm up your voice.', 'Six notes now — hear the tonic anchor.', 'D major joins in (F♯, C♯)!', 'Test 5B challenge — deep breath!'],
        dTitle: ['Voice locked in', 'Six-note lines fluent', 'D major & wide leaps ready', 'Grade 5 Week 4 · Test 5B complete'],
        dNote: ['Next: six notes in C, F and G major.', 'Next: D major & full Grade 5 range.', 'One more stop: Test 5B challenge.', 'Your Week 4 card is ready.'],
        stickers: [['🎤', 'Warm Voice', 'Locked pitch on mic'], ['🎼', 'Six-Note Singer', 'Sings 6 notes cleanly'], ['🗝️', 'D Major Pro', 'Reads C, F, G & D major'], ['⭐', '5B Star', 'Finished Week 4']],
        wcEyebrow: 'Grade 5 · Week 4 (Test 5B) card', skills: { sight: 'Test 5B · sight-singing 6 notes (singing)', sightkeys: 'Test 5B · reading 6 notes (keys)', singmatch: 'Voice pitch accuracy' },
        card: (rows, date) => 'Dottino · ABRSM Grade 5 Aural · Week 4 (Test 5B)\n' + rows.join('\n') + '\nCompleted ' + date + ' · dottino.app/aural?g=5&w=4'
      },
      5: {
        eyebrow: 'Grade 5 Aural · Week 5 · Test 5C(i) Texture & Cadences', h1: 'Hear texture & harmonic endings.',
        intro: 'Grade 5 Test C(i) asks deeper musical questions than Grade 4 — especially about TEXTURE (how the parts fit together) and how phrases resolve. Hear clear examples with visual voice-line and cadence maps.',
        L: [
          { t: 'Chordal vs contrapuntal', d: 'Hear voices moving together in blocks vs two independent conversing lines.' },
          { t: 'All three textures', d: 'Distinguish chordal, melody + accompaniment, and two independent lines.' },
          { t: 'Cadences: finished, hanging or surprise', d: 'Hear Perfect (V→I), Imperfect (→V) and Interrupted (V→vi) endings.' },
          { t: 'Week 5 challenge', d: 'Texture, cadences, dynamics, articulation and musical character.' }
        ],
        seg: { texture: 'Test 5C(i) · Texture', cadence: 'Cadences', feat: 'Features', char: 'Character', quiz: 'Week 5 challenge' },
        hi: ['Week 5: how do the two hands fit together?', 'All three textures — follow both lines!', 'Listen to how each phrase lands.', 'Week 5 challenge — sharp ears!'],
        dTitle: ['Chordal vs contrapuntal clear', 'All 3 textures mapped', 'Cadence endings heard clearly', 'Grade 5 Week 5 complete'],
        dNote: ['Next: add melody + accompaniment.', 'Next: Perfect, Imperfect & Interrupted cadences.', 'One more stop: Week 5 challenge.', 'Your Week 5 card is ready.'],
        stickers: [['🧱', 'Voice Tracker', 'Separates chordal & polyphonic'], ['🔀', 'Texture Pro', 'Identifies all 3 textures'], ['🏠', 'Cadence Ear', 'Hears V→I, →V & V→vi'], ['⭐', 'G5 Week 5', 'Finished Week 5']],
        wcEyebrow: 'Grade 5 · Week 5 card', skills: { texture: 'Texture (chordal / melody+acc / contrapuntal)', cadence: 'Cadences (Perfect / Imperfect / Interrupted)' },
        card: (rows, date) => 'Dottino · ABRSM Grade 5 Aural · Week 5 (Texture & Cadences)\n' + rows.join('\n') + '\nCompleted ' + date + ' · dottino.app/aural?g=5&w=5'
      },
      6: {
        eyebrow: 'Grade 5 Aural · Week 6 · Test 5C(i) Style & Period', h1: 'Baroque, Classical or Romantic?',
        intro: 'In ABRSM Grade 5 Test C(i), the examiner asks about STYLE AND PERIOD — and why the music sounds that way. Learn the unmistakable listening fingerprints and the exact wording you can use in the exam.',
        L: [
          { t: 'Baroque vs Romantic', d: 'Start with the sharpest contrast: crisp contrapuntal drive vs warm singing rubato.' },
          { t: 'Baroque, Classical & Romantic', d: 'Spot Classical balance and Alberti bass alongside Baroque and Romantic.' },
          { t: 'Character, tempo & texture', d: 'Describe real classical repertoire with confident examiner-ready reasons.' },
          { t: 'Test 5C(i) challenge', d: 'Style, texture, cadence, character and a real-piece rhythm/time check.' }
        ],
        seg: { style: 'Test 5C(i) · Style & Period', char: 'Character', feat: 'Features', texture: 'Texture', cadence: 'Cadence', taprhythm: 'Rhythm', meter: 'Time', quiz: 'Test 5C(i) challenge' },
        hi: ['Week 6: Baroque or Romantic? Hear the contrast!', 'Now all three periods: Baroque, Classical, Romantic.', 'Real classical pieces — back up every answer with reasons!', 'Test 5C(i) challenge — go!'],
        dTitle: ['Baroque vs Romantic crystal clear', 'All 3 periods identified', 'Examiner-ready descriptions', 'Grade 5 Week 6 · Test 5C(i) complete'],
        dNote: ['Next: Classical joins in.', 'Next: real repertoire character & texture.', 'One more stop: Test 5C(i) challenge.', 'Your Week 6 card is ready.'],
        stickers: [['🎻', 'Contrast Ear', 'Baroque vs Romantic'], ['🏛️', 'Period Sleuth', 'Baroque, Classical & Romantic'], ['🗣️', 'Articulate', 'Explains musical character'], ['⭐', '5C(i) Star', 'Finished Week 6']],
        wcEyebrow: 'Grade 5 · Week 6 (Test 5C(i)) card', skills: { style: 'Style & Period (Baroque / Classical / Romantic)', char: 'Musical character & reasons', texture: 'Texture' },
        card: (rows, date) => 'Dottino · ABRSM Grade 5 Aural · Week 6 (Style & Character)\n' + rows.join('\n') + '\nCompleted ' + date + ' · dottino.app/aural?g=5&w=6'
      },
      7: {
        eyebrow: 'Grade 5 Aural · Week 7 · Test 5C(ii) Rhythm & 6/8 Time', h1: 'Clap complex rhythms & spot 6/8.',
        intro: 'At Grade 5, Test C(ii) expands to include COMPOUND TIME (6/8) alongside 2, 3 and 4 time — plus dotted rhythms and real 6/8 classical pieces (Burgmüller & Schumann).',
        L: [
          { t: '2, 3, 4 or 6/8 time?', d: 'Hear the unmistakable ONE-2-3 FOUR-5-6 lilt of 6/8 against simple time.' },
          { t: 'Dotted rhythms & clap-back', d: 'See dotted pairs side-by-side and tap them back with steady pulse.' },
          { t: 'Real 6/8 & exam rhythm drill', d: 'Clap back tricky two-bar rhythms and spot 2/3/4/6-8 time cleanly.' },
          { t: 'Test 5C(ii) challenge', d: 'Full Test 5C(ii) run with real pieces, plus style & texture review.' }
        ],
        seg: { meter: 'Test 5C(ii) · 2/3/4/6-8 time', rhythm: 'Which rhythm', taprhythm: 'Test 5C(ii) · Clap rhythm', style: 'Style', texture: 'Texture', quiz: 'Test 5C(ii) challenge' },
        hi: ['Week 7: 2, 3, 4 or 6/8 time!', 'Dotted rhythms — feel the long-short bounce.', 'Real-piece rhythm & compound time drill!', 'Test 5C(ii) challenge — ready?'],
        dTitle: ['6/8 compound time mastered', 'Dotted rhythms locked in', 'Real-piece rhythm & time sharp', 'Grade 5 Week 7 · Test 5C(ii) complete'],
        dNote: ['Next: dotted rhythms & clap-back.', 'Next: real-piece drill.', 'One more stop: Test 5C(ii) challenge.', 'Week 7 done! Next week: full Grade 5 mocks.'],
        stickers: [['🌊', '6/8 Master', 'Spots 6/8 compound time'], ['👏', 'Dotted Rhythm', 'Claps dotted patterns'], ['🥁', '5C(ii) Pro', 'Rhythm & time secure'], ['⭐', '5C(ii) Star', 'Finished Week 7']],
        wcEyebrow: 'Grade 5 · Week 7 (Test 5C(ii)) card', skills: { meter: 'Identifying 2, 3, 4 & 6/8 time (5C(ii))', taprhythm: 'Clapping Grade 5 rhythms (5C(ii))', rhythm: 'Visual rhythm matching' },
        card: (rows, date) => 'Dottino · ABRSM Grade 5 Aural · Week 7 (Test 5C(ii))\n' + rows.join('\n') + '\nCompleted ' + date + ' · dottino.app/aural?g=5&w=7'
      },
      8: {
        eyebrow: 'Grade 5 Aural · Week 8 · Full Mock Exams', h1: 'The complete Grade 5 aural test.',
        intro: 'Three full Grade 5 mock exams in real ABRSM exam order: 5A (extended melody playback), 5B (6-note sight-singing in C/F/G/D), 5C(i) (features, character, texture & period) and 5C(ii) (rhythm clap-back & 2/3/4/6-8 time).',
        L: [
          { t: 'Grade 5 Mock Exam 1', d: 'All four Grade 5 parts in exact exam order.' },
          { t: 'Your focus stop', d: 'Automatic targeted drill on your weakest section from Mock 1.' },
          { t: 'Grade 5 Mock Exam 2', d: 'Full run again — see your focus section tighten up.' },
          { t: 'Final Grade 5 Mock', d: 'Final run-through + teacher-readable Grade 5 practice report.' }
        ],
        seg: { quiz: 'Grade 5 Mock', echo: 'Test 5A · Melody', sight: 'Test 5B · 6-note sing', feat: 'Test 5C(i) · Features', char: 'Test 5C(i) · Character', texture: 'Test 5C(i) · Texture', style: 'Test 5C(i) · Period', taprhythm: 'Test 5C(ii) · Rhythm', meter: 'Test 5C(ii) · 2/3/4/6-8' },
        wcEyebrow: 'Grade 5 practice report', wcTitle: 'Grade 5 aural readiness',
        skills: { A: 'Test 5A · extended melody playback', B: 'Test 5B · sight-singing 6 notes (singing)', Bk: 'Test 5B · reading 6 notes (keys)', Ci: 'Test 5C(i) · features, character, texture & style', Cii: 'Test 5C(ii) · rhythm & 2/3/4/6-8 time' },
        card: (rows, date) => 'Dottino · ABRSM Grade 5 Aural · Mock Exams (practice results, not ABRSM marks)\n' + rows.join('\n') + '\nCompleted ' + date + ' · dottino.app/aural?g=5&w=8'
      }
    },
    zh: {
      1: {
        eyebrow: '五级听力 · 第 1 周 · 免费（ABRSM 考纲体例）', h1: '切换进入五级耳朵。',
        intro: '第 1 周全面体检五级所需核心能力：跨调大小调、五音细节找不同、6/8 复拍子初体验，以及五级新增的终止式与织体听辨。4 站、免费免注册。',
        L: [
          { t: '大小调与五音找不同', d: '跨主音调性分辨 + 考场速度音高/节奏辨别。' },
          { t: '五音与六音旋律记忆', d: '主和弦 + 起音，完整弹回更长的旋律线。' },
          { t: '初识 6/8 复拍子', d: '把摇曳的 6/8 复拍子从 2/3/4 拍里一眼认出来。' },
          { t: '五级第 1 周体检', d: '一次摸底旋律、6/8 拍、终止式与织体四大板块。' }
        ],
        seg: { mode: '大调或小调', same: '找不同', echo: '旋律回弹', meter: '2/3/4 或 6/8 拍', cadence: '终止式', texture: '织体', feat: '音乐特征', quiz: '第 1 周体检' },
        hi: ['欢迎来到五级！耳朵开机了吗？', '稳稳记住五音和六音旋律。', '今天认识五级重头戏：6/8 复拍子！', '五级第 1 周体检，出发！'],
        dTitle: ['调性与找不同很锐利', '旋律记忆热身完成', '6/8 复拍子解锁', '五级第 1 周完成'],
        dNote: ['下一站：五音与六音旋律记忆。', '下一站：初识 6/8 复拍子。', '最后一站：五级第 1 周体检。', '第 1 周进度卡已生成。'],
        stickers: [['🎯', '五级起飞', '完成五级热身'], ['🎹', '旋律舵手', '稳住六音旋律'], ['🌊', '6/8 摇摆手', '感受复拍子'], ['⭐', '五级第 1 周', '完成第 1 周']],
        wcEyebrow: '五级 · 第 1 周进度卡', skills: { mode: '大小调', same: '细节找不同', echo: '旋律记忆', meter: '2/3/4 与 6/8 拍' },
        card: (rows, date) => 'Dottino · ABRSM 五级听力 · 第 1 周\n' + rows.join('\n') + '\n完成于 ' + date + ' · dottino.app/aural?g=5'
      },
      2: {
        eyebrow: '五级听力 · 第 2 周 · 5A 专项（上）', h1: '带着节奏，弹回大小调旋律。',
        intro: '进入 5A 考题体例：主和弦、起音、两小节预备拍，在多种大小调里准确弹回音高与节奏。',
        L: [
          { t: '调性色彩与六音旋律', d: '先建立大小调听觉预期，再弹回旋律。' },
          { t: '两小节带节奏旋律', d: 'C/G/F/Am/Em/Dm 调，音高与节奏同时判定。' },
          { t: '三小节考场旋律', d: '更长乐句、更大跨度，扩展至三升三降以内。' },
          { t: '第 2 周挑战', d: '4 道带节奏旋律回弹 + 大小调与 6/8 拍。' }
        ],
        seg: { mode: '大小调', echo: '5A · 旋律回弹', meter: '2/3/4/6-8 拍', quiz: '第 2 周挑战' },
        hi: ['第 2 周：带节奏的 5A 来了！', '听准两小节预备拍。', '拉长到三小节旋律！', '第 2 周挑战，准备好了吗？'],
        dTitle: ['调性预期建立', '两小节带节奏过关', '三小节长乐句拿下', '五级第 2 周完成'],
        dNote: ['下一站：两小节带节奏旋律。', '下一站：三小节考场旋律。', '最后一站：第 2 周挑战。', '第 2 周进度卡已就绪。'],
        stickers: [['🌗', '调性定盘星', '稳抓主调'], ['🎹', '节奏回弹', '两小节精准回弹'], ['🎼', '长句能手', '拿下三小节'], ['⭐', '五级第 2 周', '完成第 2 周']],
        wcEyebrow: '五级 · 第 2 周进度卡', skills: { mode: '大小调', echo: '5A · 带节奏旋律回弹' },
        card: (rows, date) => 'Dottino · ABRSM 五级听力 · 第 2 周（5A）\n' + rows.join('\n') + '\n完成于 ' + date + ' · dottino.app/aural?g=5&w=2'
      },
      3: {
        eyebrow: '五级听力 · 第 3 周 · 5A 专项（下）', h1: '拿下五级完整长度长旋律。',
        intro: '全面冲刺 5A 考场难度：长达 4 小节、四度/五度跳进、小调导音与附点节奏，覆盖三升三降以内常用调。',
        L: [
          { t: '多调三小节短句', d: '在多种大小调里流畅听音弹回。' },
          { t: '大跳与四小节长乐句', d: '学会把分解和弦与收尾打包记忆，不再逐音死背。' },
          { t: '5A 考场全长度集训', d: '连续 6 道完整五级难度旋律。' },
          { t: '5A 专项挑战', d: '5 道 5A 长旋律 + 终止式收尾听辨。' }
        ],
        seg: { echo: '5A · 长旋律回弹', cadence: '终止式', quiz: '5A 专项挑战' },
        hi: ['第 3 周：五级全长度旋律！', '把大跳和收尾打包记住。', '连续 6 道考场难度，沉住气！', '5A 专项挑战出发！'],
        dTitle: ['多调回弹流畅', '四小节打包记忆成型', '全长度 5A 集训通关', '五级第 3 周 · 5A 完成'],
        dNote: ['下一站：大跳与四小节长乐句。', '下一站：5A 考场集训。', '最后一站：5A 专项挑战。', '第 3 周进度卡已就绪。'],
        stickers: [['🗝️', '多调通', '跨调回弹流畅'], ['🧠', '乐句打包师', '记住四小节长句'], ['🏆', '5A 大师', '通关考场长度'], ['⭐', '5A 之星', '完成第 3 周']],
        wcEyebrow: '五级 · 第 3 周（5A）进度卡', skills: { echo: '5A · 五级全长度旋律回弹', cadence: '乐句收尾听辨' },
        card: (rows, date) => 'Dottino · ABRSM 五级听力 · 第 3 周（5A）\n' + rows.join('\n') + '\n完成于 ' + date + ' · dottino.app/aural?g=5&w=3'
      },
      4: {
        eyebrow: '五级听力 · 第 4 周 · 5B 六音视唱专项', h1: '四个大调，视唱六个音。',
        intro: 'ABRSM 五级 5B 从四级的 5 个音升级到 6 个音，调性扩展到 C、F、G、D 大调，音域宽至主音上下五度。麦克风实时追踪音准，也可切琴键读谱。',
        L: [
          { t: '开嗓对音 + 五音衔接', d: '麦克风校准音准，从五音自然过渡到六音。' },
          { t: 'C / F / G 大调六音视唱', d: '适应更长的六音线条与四度/五度跨度。' },
          { t: '加入 D 大调（升 F、升 C）', d: '完整覆盖五级 5B 四个大调，高低音谱号自由切换。' },
          { t: '5B 专项挑战', d: '4 条五级六音视唱 + 5A 与终止式复习。' }
        ],
        seg: { singmatch: '开嗓对音', sight: '5B · 六音视唱', echo: '5A', cadence: '终止式', quiz: '5B 专项挑战' },
        hi: ['5B 六音视唱周！先开开嗓。', '升级六个音，牢记主音位置。', '今天加入 D 大调（双升号）！', '5B 专项挑战，深呼吸！'],
        dTitle: ['音准热身到位', '六音视唱很稳', 'D 大调与五度跨度拿下', '五级第 4 周 · 5B 完成'],
        dNote: ['下一站：C/F/G 大调六音视唱。', '下一站：加入 D 大调。', '最后一站：5B 专项挑战。', '第 4 周进度卡已生成。'],
        stickers: [['🎤', '音准稳定器', '麦克风对音准确'], ['🎼', '六音视唱手', '流畅视唱六个音'], ['🗝️', 'D 大调通关', 'C/F/G/D 全覆盖'], ['⭐', '5B 之星', '完成第 4 周']],
        wcEyebrow: '五级 · 第 4 周（5B）进度卡', skills: { sight: '5B · 六音视唱（麦克风）', sightkeys: '5B · 六音读谱（琴键）', singmatch: '单音音准' },
        card: (rows, date) => 'Dottino · ABRSM 五级听力 · 第 4 周（5B）\n' + rows.join('\n') + '\n完成于 ' + date + ' · dottino.app/aural?g=5&w=4'
      },
      5: {
        eyebrow: '五级听力 · 第 5 周 · 5C(i) 织体与终止式', h1: '听穿声部织体与和声收尾。',
        intro: '五级 5C(i) 相比四级迈出了关键一步：考官会问音乐的「织体（Texture）」与和声收束感。每题配声部线条透视图与终止式张力图。',
        L: [
          { t: '和弦柱式 vs 复调对话', d: '先听最鲜明的对比：齐步走和弦 vs 双声部独立对话。' },
          { t: '三种核心织体全分辨', d: '清晰区分和弦柱式、旋律+伴奏、复调双声部。' },
          { t: '和声终止式：回家、悬空还是意外', d: '听清完满终止（V→I）、半终止（→V）与阻碍终止（V→vi）。' },
          { t: '第 5 周挑战', d: '织体、终止式、力度、连断与音乐性格综合测验。' }
        ],
        seg: { texture: '5C(i) · 织体', cadence: '终止式', feat: '音乐特征', char: '音乐性格', quiz: '第 5 周挑战' },
        hi: ['第 5 周：听听两只手是怎么配合的！', '三种织体齐聚——同时盯住上下声部。', '听每个乐句是怎么落地的。', '第 5 周挑战，开启透视耳！'],
        dTitle: ['柱式与复调一耳分清', '三大织体全掌握', '三大终止式听感清晰', '五级第 5 周完成'],
        dNote: ['下一站：加入旋律+伴奏织体。', '下一站：三种终止式。', '最后一站：第 5 周挑战。', '第 5 周进度卡已生成。'],
        stickers: [['🧱', '声部透视眼', '分清柱式与复调'], ['🔀', '织体专家', '三种织体全分辨'], ['🏠', '和声定位仪', '听清三种终止式'], ['⭐', '五级第 5 周', '完成第 5 周']],
        wcEyebrow: '五级 · 第 5 周进度卡', skills: { texture: '织体分辨（柱式 / 主调 / 复调）', cadence: '和声终止式（完满 / 半终止 / 阻碍）' },
        card: (rows, date) => 'Dottino · ABRSM 五级听力 · 第 5 周（织体与终止式）\n' + rows.join('\n') + '\n完成于 ' + date + ' · dottino.app/aural?g=5&w=5'
      },
      6: {
        eyebrow: '五级听力 · 第 6 周 · 5C(i) 时期与风格', h1: '巴洛克、古典还是浪漫？',
        intro: 'ABRSM 五级 5C(i) 的招牌题：判断音乐属于哪个时期并说出听觉依据。学完每道题都附带考场可直接复述的规范表述。',
        L: [
          { t: '巴洛克 vs 浪漫时期', d: '先抓住最强烈反差：工整复调线条 vs 温暖歌唱与弹性速度。' },
          { t: '巴洛克、古典与浪漫', d: '加入古典时期（对称乐句 + 阿尔贝蒂低音）三选一。' },
          { t: '真实名曲性格与织体', d: '在舒曼、布格缪勒、柴可夫斯基真曲中练就考场口述力。' },
          { t: '5C(i) 专项挑战', d: '时期、织体、终止式、性格 + 真曲节奏拍号综合测验。' }
        ],
        seg: { style: '5C(i) · 时期风格', char: '性格', feat: '特征', texture: '织体', cadence: '终止式', taprhythm: '节奏', meter: '拍号', quiz: '5C(i) 专项挑战' },
        hi: ['第 6 周：巴洛克还是浪漫？先听反差！', '古典时期加入——三大时期同场分辨。', '用真曲练出考官爱听的专业描述！', '5C(i) 专项挑战开始！'],
        dTitle: ['巴洛克与浪漫分明', '三大时期精准分辨', '考场口述能力成型', '五级第 6 周 · 5C(i) 完成'],
        dNote: ['下一站：加入古典时期。', '下一站：真曲性格与织体。', '最后一站：5C(i) 专项挑战。', '第 6 周进度卡已就绪。'],
        stickers: [['🎻', '反差侦探', '分清巴洛克与浪漫'], ['🏛️', '时期鉴定师', '巴洛克/古典/浪漫'], ['🗣️', '考场表达王', '有理有据描述音乐'], ['⭐', '5C(i) 之星', '完成第 6 周']],
        wcEyebrow: '五级 · 第 6 周（5C(i)）进度卡', skills: { style: '时期风格（巴洛克 / 古典 / 浪漫）', char: '音乐性格与依据', texture: '织体辨别' },
        card: (rows, date) => 'Dottino · ABRSM 五级听力 · 第 6 周（时期与风格）\n' + rows.join('\n') + '\n完成于 ' + date + ' · dottino.app/aural?g=5&w=6'
      },
      7: {
        eyebrow: '五级听力 · 第 7 周 · 5C(ii) 节奏与 6/8 拍', h1: '拍回附点节奏，认出 6/8 拍。',
        intro: '五级 5C(ii) 在 2、3、4 拍之外正式加入 6/8 复拍子，并提升附点节奏拍回难度，搭配曲库中 4 首真实 6/8 古典名曲。',
        L: [
          { t: '2、3、4 还是 6/8 拍？', d: '在单拍子与 6/8 复拍子之间秒速分辨三连摇曳律动。' },
          { t: '附点节奏与拍回', d: '看清附点长短比例，稳稳拍回两小节节奏。' },
          { t: '考场节奏与 6/8 真曲集训', d: '综合附点拍回与 2/3/4/6-8 拍号判断。' },
          { t: '5C(ii) 专项挑战', d: '完整 5C(ii) 真曲流程 + 时期与织体回顾。' }
        ],
        seg: { meter: '5C(ii) · 2/3/4/6-8 拍', rhythm: '节奏图', taprhythm: '5C(ii) · 拍回节奏', style: '时期', texture: '织体', quiz: '5C(ii) 专项挑战' },
        hi: ['第 7 周：2、3、4 还是 6/8 拍？', '抓住附点一长一短的弹性！', '真曲节奏与复拍子集训！', '5C(ii) 专项挑战，上场！'],
        dTitle: ['6/8 复拍子彻底拿捏', '附点节奏拍回稳健', '真曲节奏与拍号过关', '五级第 7 周 · 5C(ii) 完成'],
        dNote: ['下一站：附点节奏拍回。', '下一站：真曲集训。', '最后一站：5C(ii) 专项挑战。', '第 7 周完成！下周进入五级全真模拟考。'],
        stickers: [['🌊', '6/8 专家', '稳抓 6/8 复拍子'], ['👏', '附点达人', '精准拍回附点'], ['🥁', '5C(ii) 全能', '节奏拍号双稳'], ['⭐', '5C(ii) 之星', '完成第 7 周']],
        wcEyebrow: '五级 · 第 7 周（5C(ii)）进度卡', skills: { meter: '分辨 2/3/4 与 6/8 拍（5C(ii)）', taprhythm: '五级节奏拍回（5C(ii)）', rhythm: '节奏图匹配' },
        card: (rows, date) => 'Dottino · ABRSM 五级听力 · 第 7 周（5C(ii)）\n' + rows.join('\n') + '\n完成于 ' + date + ' · dottino.app/aural?g=5&w=7'
      },
      8: {
        eyebrow: '五级听力 · 第 8 周 · 全真模拟考', h1: '完整跑完 ABRSM 五级听力。',
        intro: '三套按真实考场顺序编排的五级模拟考：5A（长旋律回弹）、5B（四调六音视唱）、5C(i)（特征、性格、织体与时期）、5C(ii)（节奏拍回与 2/3/4/6-8 拍）。第 2 站自动专攻模拟 1 最弱项。',
        L: [
          { t: '五级模拟考 1', d: '按考场顺序完成 5A、5B、5C(i)、5C(ii) 全套。' },
          { t: '薄弱项专攻', d: '自动强化模拟考 1 中最需要打磨的板块。' },
          { t: '五级模拟考 2', d: '再完整跑一遍，检验薄弱板块进步。' },
          { t: '终极五级模拟考', d: '最后冲刺演练，生成给老师看的五级听力报告。' }
        ],
        seg: { quiz: '五级模拟考', echo: '5A · 旋律回弹', sight: '5B · 六音视唱', feat: '5C(i) · 特征', char: '5C(i) · 性格', texture: '5C(i) · 织体', style: '5C(i) · 时期', taprhythm: '5C(ii) · 节奏', meter: '5C(ii) · 2/3/4/6-8' },
        wcEyebrow: '五级模拟考报告', wcTitle: '五级听力备考状态',
        skills: { A: '5A · 长旋律听音弹回', B: '5B · 六音视唱（麦克风）', Bk: '5B · 六音读谱（琴键）', Ci: '5C(i) · 特征、性格、织体与时期', Cii: '5C(ii) · 节奏与 2/3/4/6-8 拍' },
        card: (rows, date) => 'Dottino · ABRSM 五级听力 · 模拟考报告（练习结果，非官方评分）\n' + rows.join('\n') + '\n完成于 ' + date + ' · dottino.app/aural?g=5&w=8'
      }
    }
  };

  window.AURAL_GRADES = {
    G3_WEEKS, G5_WEEKS, G3_MOCK, G5_MOCK,
    GRADE_META, EXTRA_T, G3_COPY, G5_COPY,
    makeCadence, playCadence, cadenceSvg,
    makeTexture, playTexture, textureSvg,
    makeStyle, playStyle, styleSayIt,
    makeMeter68, playMeter68
  };
})();
