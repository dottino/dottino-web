/* Dottino Ear Check: six listening questions, two each at Grade 3, 4 and 5 level (built around the ABRSM aural tests).
   Listening only (no microphone, no clapping), so it works inside the Instagram / TikTok browsers.
   Each answer reveals the listening tool behind it: the count (beats in a bar), the shape line (melody), the beat grid (rhythm).
   Needs: window.PIECES (pieces.js) for the first question. */
(function () {
  const $ = id => document.getElementById(id);
  const Q = new URLSearchParams(location.search);
  const REF = (Q.get('ref') || Q.get('utm_source') || (() => { const r = document.referrer; return /instagram/i.test(r) ? 'instagram' : /tiktok/i.test(r) ? 'tiktok' : /youtube/i.test(r) ? 'youtube' : /facebook/i.test(r) ? 'facebook' : ''; })() || 'direct').replace(/[^\w-]/g, '').slice(0, 30);
  const SOCIAL = /instagram|tiktok|youtube|facebook/.test(REF);
  const INAPP = /Instagram|FBAN|FBAV|musical_ly|TikTok|BytedanceWebview|Snapchat/i.test(navigator.userAgent || '');
  function track(name) { try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: 'event/ear/' + name, title: 'ear ' + name, event: true }); } catch (e) { /* ignore */ } }
  setTimeout(() => { if (!(window.goatcounter && window.goatcounter.count)) return; track('from/' + REF);
    try { const u = new URL(location.href); let c = false; ['ref', 's', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].forEach(k => { if (u.searchParams.has(k)) { u.searchParams.delete(k); c = true; } }); if (c) history.replaceState(history.state, '', u.pathname + u.search + u.hash); } catch (e) { /* ignore */ } }, 1500);

  const rnd = n => Math.floor(Math.random() * n);
  const pick = a => a[rnd(a.length)];
  const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = rnd(i + 1); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const sum = a => a.reduce((s, x) => s + x, 0);

  // ---------- audio (same piano as the challenges: Salamander Grand, middle layer) ----------
  let ctx = null, bus = null, gen = 0, unlocked = false, timers = [], room = null;
  const buf = {}, loads = {}, NM3 = ['C', 'Ds', 'Fs', 'A'];
  const salName = m => NM3[((m - 36) / 3) % 4] + (Math.floor(m / 12) - 1) + 'v9';
  const baseOf = m => Math.max(36, Math.min(96, 36 + Math.round((m - 36) / 3) * 3));
  function ensureCtx() { if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ctx = null; } } return ctx; }
  function unlock() {
    if (!ensureCtx()) return; if (ctx.state === 'suspended') ctx.resume();
    if (unlocked) return; unlocked = true;
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) { /* older browsers */ }
    try { const a = new Audio('/audio/silent.mp3'); a.setAttribute('playsinline', ''); a.volume = 0.01; const p = a.play(); if (p && p.catch) p.catch(() => {}); } catch (e) { /* ignore */ }
  }
  ['pointerdown', 'touchend', 'keydown'].forEach(ev => addEventListener(ev, unlock, { passive: true }));
  function decode(url) { return fetch(url).then(r => r.arrayBuffer()).then(a => new Promise((ok, no) => ctx.decodeAudioData(a, ok, no))); }
  function loadSample(base) { if (!loads[base]) loads[base] = decode('/audio/sal/' + salName(base) + '.mp3').then(b => { buf[base] = b; return b; }).catch(() => null); return loads[base]; }
  function out() {
    if (bus && bus.context === ctx) return bus;
    bus = ctx.createGain(); bus.connect(ctx.destination);
    if (!room || room.sampleRate !== ctx.sampleRate) { const len = Math.floor(ctx.sampleRate * 1.8); room = ctx.createBuffer(2, len, ctx.sampleRate); for (let c = 0; c < 2; c++) { const d = room.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.4) * (i < 240 ? i / 240 : 1); } }
    const cv = ctx.createConvolver(); cv.buffer = room; const wet = ctx.createGain(); wet.gain.value = 0.22; cv.connect(wet); wet.connect(bus); bus.verb = cv;
    return bus;
  }
  function stopAudio() { gen++; timers.forEach(clearTimeout); timers = []; if (bus && ctx) { const b = bus; try { b.gain.setTargetAtTime(0, ctx.currentTime, 0.015); } catch (e) { /* ignore */ } setTimeout(() => { try { b.disconnect(); } catch (e) { /* ignore */ } }, 160); } bus = null; }
  const later = (fn, ms) => { const g = gen, t = setTimeout(() => { if (g === gen) fn(); }, ms); timers.push(t); };
  function note(m, at, vel, len, boost) {
    const base = baseOf(m), b = buf[base]; if (!b) return;
    const g = ctx.createGain(); g.gain.value = (0.5 + 0.62 * vel) * 0.92 * (boost || 1); g.connect(out()); g.connect(out().verb);
    const s = ctx.createBufferSource(); s.buffer = b; s.playbackRate.value = Math.pow(2, (m - base) / 12); s.connect(g);
    const t0 = ctx.currentTime + at; s.start(t0); g.gain.setTargetAtTime(0, t0 + len, 0.18); s.stop(t0 + len + 1.4);
  }
  function tick(at, strong) {
    const t0 = ctx.currentTime + at, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'triangle'; o.frequency.value = strong ? 1250 : 900; g.gain.setValueAtTime(strong ? 0.22 : 0.12, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.07);
    o.connect(g); g.connect(out()); o.start(t0); o.stop(t0 + 0.08);
  }
  const loadAll = midis => Promise.all([...new Set(midis.map(baseOf))].map(loadSample));

  // ---------- music helpers ----------
  const SC = { maj: [0, 2, 4, 5, 7, 9, 11], min: [0, 2, 3, 5, 7, 8, 11] }; // minor = harmonic, as in the exam melodies
  const midiOf = (deg, key) => key.tonic + 12 * Math.floor(deg / 7) + SC[key.mode][((deg % 7) + 7) % 7];
  const KEYS = { maj: [{ name: 'C major', tonic: 60, mode: 'maj' }, { name: 'G major', tonic: 55, mode: 'maj' }, { name: 'F major', tonic: 53, mode: 'maj' }, { name: 'D major', tonic: 62, mode: 'maj' }],
    min: [{ name: 'A minor', tonic: 57, mode: 'min' }, { name: 'D minor', tonic: 62, mode: 'min' }, { name: 'E minor', tonic: 52, mode: 'min' }] };
  const triad = key => [0, 2, 4].map(d => midiOf(d, key) - 12);
  // a melody line: notes [{deg, d}] in beats. Returns its length in seconds
  function playLine(notes, key, beat, at, vel) { let t = at; notes.forEach(n => { note(midiOf(n.deg, key), t, vel || 0.55, n.d * beat * 0.92); t += n.d * beat; }); return sum(notes.map(n => n.d)) * beat; }
  function lineMidis(notes, key) { return notes.map(n => midiOf(n.deg, key)); }

  // melodies: a gentle random walk (mostly steps), starting and ending on the tonic
  function walk(len, lo, hi, leap) {
    for (let tries = 0; tries < 200; tries++) {
      const d = [0]; let ok = true;
      for (let i = 1; i < len - 1; i++) { const r = Math.random(), step = r < leap ? pick([-2, 2]) : r < leap + 0.08 ? 0 : pick([-1, 1]); const n = d[i - 1] + step; if (n < lo || n > hi) { ok = false; break; } d.push(n); }
      if (!ok) continue;
      const lastGap = Math.abs(d[len - 2]); if (lastGap === 0 || lastGap > 2) continue;
      d.push(0);
      if (new Set(d).size < Math.min(4, len - 1)) continue;
      return d;
    }
    return [0, 1, 2, 1, 0].slice(0, len);
  }

  // ---------- the six questions ----------
  const RH4_EASY = [[1, 1, 1, 1], [0.5, 0.5, 1, 1, 1], [1, 1, 0.5, 0.5, 1], [2, 1, 1], [1, 1, 2], [1, 0.5, 0.5, 2], [0.5, 0.5, 0.5, 0.5, 2]];
  const RH4_END = [[1, 1, 2], [2, 2], [1, 1, 1, 1], [0.5, 0.5, 1, 2]];
  // Grade 5 rhythms: dotted notes and an off-beat; each has a near twin that differs in one beat only
  const RH5 = [
    { a: [1.5, 0.5, 1, 1], b: [1, 0.5, 0.5, 1, 1] },
    { a: [1, 1.5, 0.5, 1], b: [1, 1, 0.5, 0.5, 1] },
    { a: [0.5, 1, 0.5, 2], b: [0.5, 0.5, 1, 2] },
    { a: [1, 0.5, 0.5, 1.5, 0.5], b: [1, 0.5, 0.5, 1, 0.5, 0.5] },
    { a: [1.5, 0.5, 2], b: [1, 1, 2] }
  ];
  const rkey = r => r.join(',');

  function qMeter() { // Grade 3 Test A: 2, 3 or 4 time (a real piece)
    const UNSURE = ['b12']; // pickup not confirmed yet: keep out of the beats question
    const pool = (window.PIECES || []).filter(p => !p.compound && [2, 3, 4].includes(p.k) && !UNSURE.includes(p.id));
    const byK = k => pool.filter(p => p.k === k);
    const k = pick([2, 3, 4].filter(x => byK(x).length)), p = pick(byK(k));
    const up = p.up || 0, beats = Math.min(p.T, up + p.k * Math.ceil(7.2 / p.B / p.k));
    return { kind: 'meter', grade: 3, piece: p, beats, ev: p.ev.filter(e => e.t < beats - 0.01), ans: String(k), opts: ['2', '3', '4'] };
  }
  function qChange() { // Grade 3 Test C: a phrase played twice, one change: pitch or rhythm?
    const key = pick(KEYS.maj), r = pick([[[1, 1, 1, 1], [1, 1, 2]], [[1, 0.5, 0.5, 1, 1], [1, 1, 2]], [[1, 1, 1, 1], [0.5, 0.5, 1, 2]]]);
    const durs = r[0].concat(r[1]), degs = walk(durs.length, -1, 4, 0.2), a = durs.map((d, i) => ({ deg: degs[i], d }));
    const type = pick(['pitch', 'rhythm']), b = a.map(n => Object.assign({}, n)); let at = [];
    if (type === 'pitch') { const i = 2 + rnd(a.length - 3); b[i].deg += a[i].deg >= 3 ? -pick([1, 2]) : pick([1, 2]); if (b[i].deg === a[i - 1].deg || b[i].deg === a[i + 1].deg) b[i].deg += b[i].deg > a[i].deg ? 1 : -1; at = [i]; }
    else { const cand = []; let t = 0; for (let i = 0; i < a.length - 2; i++) { if (a[i].d === 1 && a[i + 1].d === 1 && Math.floor(t / 4) === Math.floor((t + 1.5) / 4) && t % 1 === 0) cand.push(i); t += a[i].d; } const i = cand.length ? pick(cand) : 0; b[i].d = 1.5; b[i + 1].d = 0.5; at = [i, i + 1]; }
    return { kind: 'change', grade: 3, key, a, b, at, ans: type === 'pitch' ? 'Pitch' : 'Rhythm', opts: ['Pitch', 'Rhythm'] };
  }
  function rhythmQ(grade) { // Grade 4 / 5, Test C(ii) prep: which rhythm did you hear?
    let ok, x, y, x2, y2;
    if (grade === 4) { x = pick(RH4_EASY); y = pick(RH4_END); x2 = pick(RH4_EASY.filter(r => rkey(r) !== rkey(x))); y2 = pick(RH4_END.filter(r => rkey(r) !== rkey(y))); }
    else { const p1 = pick(RH5), p2 = pick(RH5.filter(p => p !== p1)), f1 = Math.random() < 0.5, f2 = Math.random() < 0.5; x = f1 ? p1.a : p1.b; x2 = f1 ? p1.b : p1.a; y = f2 ? p2.a : p2.b; y2 = f2 ? p2.b : p2.a; }
    ok = x.concat(y);
    const opts = shuffle([{ r: ok, ok: true }, { r: x.concat(y2) }, { r: x2.concat(y) }]).map((o, i) => Object.assign(o, { label: 'ABC'[i] }));
    const key = pick(grade === 4 ? KEYS.maj : KEYS.maj.concat(KEYS.min)), degs = walk(ok.length, -2, 4, 0.25);
    return { kind: 'rhythm', grade, key, line: ok.map((d, i) => ({ deg: degs[i], d })), ropts: opts, ans: opts.find(o => o.ok).label, opts: ['A', 'B', 'C'], beat: grade === 4 ? 0.56 : 0.5 };
  }
  function shapeQ(grade) { // Grade 4 / 5, Test A prep: remember the tune; which shape was it?
    const key = grade === 4 ? pick(KEYS.maj) : pick(KEYS.min), len = grade === 4 ? 5 : 7;
    const degs = grade === 4 ? walk(len, 0, 4, 0.2) : walk(len, -2, 5, 0.3);
    const durs = grade === 4 ? [1, 1, 1, 1, 2] : pick([[1, 1, 1, 0.5, 0.5, 1, 2], [1.5, 0.5, 1, 1, 1, 1, 2], [1, 0.5, 0.5, 1, 1, 1, 2]]);
    const lo = grade === 4 ? 0 : -2, hi = grade === 4 ? 4 : 5, seen = new Set([degs.join()]), wrong = [];
    // the wrong shapes change one note: by a jump at Grade 4, by a single step at Grade 5 (much closer)
    for (let tries = 0; tries < 300 && wrong.length < 2; tries++) {
      const d = degs.slice(), i = 1 + rnd(len - 2), step = grade === 4 ? pick([-2, 2, -3, 3]) : pick([-1, 1]); d[i] += step;
      if (d[i] < lo || d[i] > hi || d[i] === d[i - 1] || seen.has(d.join())) continue;
      if (grade === 5 && wrong.length && wrong[0].i === i) continue;
      seen.add(d.join()); wrong.push({ d, i });
    }
    const opts = shuffle([{ d: degs, ok: true }].concat(wrong)).map((o, i) => Object.assign(o, { label: 'ABC'[i] }));
    return { kind: 'shape', grade, key, line: degs.map((g, i) => ({ deg: g, d: durs[i] })), sopts: opts, ans: opts.find(o => o.ok).label, opts: ['A', 'B', 'C'], beat: grade === 4 ? 0.6 : 0.5 };
  }

  const TITLES = {
    meter: { q: '2, 3 or 4 beats in a bar?', tool: 'The count', how: k => `Find the strong beat, then count to the next one: <b>${['', '', 'ONE two', 'ONE two three', 'ONE two three four'][+k]}</b>.` },
    change: { q: 'It plays twice. What changed: the pitch or the rhythm?', tool: 'Note by note', how: (a, q) => q.ans === 'Pitch' ? 'Same rhythm, but one note moved. Look for the dot that jumps out of line.' : 'Same notes, but two of them became <b>long–short</b>. The dots are the same height; the spacing changed.' },
    rhythm: { q: 'Which rhythm did you hear?', tool: 'The beat grid', how: (a, q) => q.grade === 4 ? 'One wrong answer starts the same, one ends the same. Only one fits all the way through.' : 'They differ by just one beat. Long–short (a dotted note) or two even notes? Follow the grid beat by beat.' },
    shape: { q: 'Which shape is the tune?', tool: 'The shape line', how: (a, q) => q.grade === 4 ? 'Draw the tune in the air: up, down or the same? The wrong shapes jump somewhere the tune doesn’t.' : 'Only one note is different, and only by a step. Hold the whole line in your head, then check the middle.' }
  };

  // ---------- drawings: the listening tools ----------
  let clipN = 0;
  function noteBar(i, x, y, w, h, hl) { // a note block plus a fill layer (clipped to the block) that grows while the note sounds
    const id = 'nc' + (++clipN), r = h / 2;
    return `<clipPath id="${id}"><rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h}" rx="${r}"/></clipPath>`
      + `<rect data-i="${i}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h}" rx="${r}" class="${hl ? 'nb hl' : 'nb'}"/>`
      + `<g clip-path="url(#${id})"><rect class="fl" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h}"/></g>`;
  }
  function gridSvg(r, beatsPerBar, hl, cls) { // beat grid: one block per note, length = how long it lasts
    const total = sum(r), W = 300, H = 46, pad = 6, u = (W - pad * 2) / total; let x = pad, s = `<svg class="${cls || 'grid'}" viewBox="0 0 ${W} ${H}" aria-hidden="true">`;
    for (let b = 0; b <= total; b++) s += `<line x1="${pad + b * u}" y1="${b % beatsPerBar ? 10 : 2}" x2="${pad + b * u}" y2="${b % beatsPerBar ? H - 10 : H - 2}" class="${b % beatsPerBar ? 'gl' : 'gb'}"/>`;
    r.forEach((d, i) => { s += noteBar(i, x + 2, 15, Math.max(6, d * u - 4), 16, hl && hl.includes(i)); x += d * u; });
    return s + '</svg>';
  }
  function shapeSvg(degs, hl, cls, lo, hi) { // shape line: one dot per note, height = pitch
    const W = 300, H = 92, pad = 16, n = degs.length, span = Math.max(1, hi - lo), dx = (W - pad * 2) / (n - 1);
    const pt = (g, i) => [pad + i * dx, H - pad - ((g - lo) / span) * (H - pad * 2)];
    let s = `<svg class="${cls || 'shape'}" viewBox="0 0 ${W} ${H}" aria-hidden="true"><polyline class="sl" points="${degs.map((g, i) => pt(g, i).map(v => v.toFixed(1)).join(',')).join(' ')}"/>`;
    degs.forEach((g, i) => { const [x, y] = pt(g, i); s += `<circle data-i="${i}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${hl && hl.includes(i) ? 8 : 6.5}" class="${hl && hl.includes(i) ? 'sd hl' : 'sd'}"/>`; });
    return s + '</svg>';
  }
  function timeSvg(notes, hl, lo, hi) { // both pitch and rhythm: dots placed in time, height = pitch
    const W = 300, H = 70, pad = 12, total = sum(notes.map(n => n.d)), span = Math.max(1, hi - lo), u = (W - pad * 2) / total; let t = 0, s = `<svg class="time" viewBox="0 0 ${W} ${H}" aria-hidden="true">`;
    for (let b = 0; b <= total; b++) s += `<line x1="${pad + b * u}" y1="${b % 4 ? 14 : 4}" x2="${pad + b * u}" y2="${b % 4 ? H - 14 : H - 4}" class="${b % 4 ? 'gl' : 'gb'}"/>`;
    notes.forEach((n, i) => { const x = pad + t * u, y = H - pad - ((n.deg - lo) / span) * (H - pad * 2); s += noteBar(i, x + 1, y - 5, Math.max(8, n.d * u - 3), 10, hl && hl.includes(i)); t += n.d; });
    return s + '</svg>';
  }

  // ---------- playing a question ----------
  function prepare(q) {
    if (q.kind === 'meter') return loadAll(q.ev.map(e => e.m));
    const k = q.key, lines = q.kind === 'change' ? q.a.concat(q.b) : q.line;
    return loadAll(lineMidis(lines, k).concat(triad(k)));
  }
  function phase(text, at) { later(() => { const c = $('caption'); if (c && S.playing) c.innerHTML = text; }, at * 1000); }
  function playQ(q, withTool) { // returns seconds
    stopAudio(); unlock(); if (!ctx) return 0;
    const lead = 0.15, cue = !withTool;
    if (q.kind === 'meter') {
      const p = q.piece, soft = ['calm', 'solemn', 'sad', 'flowing', 'dance'].includes(p.char);
      const up = p.up || 0, pos = t => (((t - up) % p.k) + p.k) % p.k;
      const boostAt = t => { const r = pos(t), near = x => Math.abs(r - x) < 0.01; if (near(0) || near(p.k)) return 1.75; if (p.k === 4 && near(2)) return 1.2; return Math.abs(r - Math.round(r)) < 0.01 ? 0.95 : 0.78; };
      q.ev.forEach(e => { const at = lead + e.t * p.B, dur = e.d * p.B;
        const vel = Math.min(1, Math.max(0.15, 0.2 + ((e.v || 1) * 80 - 40) / 70) * (e.mel ? 0.85 : soft ? 0.5 : 0.62));
        note(e.m, at, vel, p.art === 'staccato' ? Math.min(0.2, dur * 0.55) : dur + (e.mel ? 0.06 : 0.18), boostAt(e.t) * 0.85); });
      if (withTool) { const f = up % 1, n0 = Math.round(up - f); for (let i = 0; f + i < q.beats - 0.01; i++) { const at = lead + (f + i) * p.B, b = (((i - n0) % p.k) + p.k) % p.k; tick(at, b === 0); later(() => light('beats', b), at * 1000); } }
      return lead + q.beats * p.B + 0.4;
    }
    const k = q.key, ch = triad(k);
    if (q.kind === 'change') { // key chord, then the phrase twice (the second time with the change)
      ch.forEach(m => note(m, lead, 0.4, 1.1)); const beat = 0.55; let t = lead + 1.5;
      if (cue) { phase('<b>Key chord</b> first. The question hasn’t started yet…', 0); phase('<b>1st time.</b> Remember it…', t - 0.1); }
      const l1 = playLine(q.a, k, beat, t); if (withTool) lightLine('t1', q.a, beat, t); t += l1 + 1.0;
      if (cue) phase('<b>2nd time.</b> What’s different?', t - 0.1);
      const l2 = playLine(q.b, k, beat, t); if (withTool) lightLine('t2', q.b, beat, t);
      return t + l2 + 0.4;
    }
    if (q.kind === 'rhythm') { // count-in clicks, then the phrase
      const beat = q.beat; let t = lead; for (let i = 0; i < 4; i++) tick(t + i * beat, i === 0);
      if (cue) phase('<b>Count-in:</b> 1 · 2 · 3 · 4. The rhythm starts next…', 0);
      t += 4 * beat; if (cue) phase('<b>Now the rhythm.</b>', t - 0.05);
      const l = playLine(q.line, k, beat, t, 0.6); if (withTool) lightLine('g-ok', q.line, beat, t);
      return t + l + 0.4;
    }
    // shape: key chord + starting note, then the tune twice (as in the exam)
    ch.forEach(m => note(m, lead, 0.4, 1.1)); note(midiOf(0, k), lead + 1.3, 0.55, 0.8);
    let t = lead + 2.6;
    if (cue) { phase('<b>Key chord</b> first. The tune hasn’t started yet…', 0); phase('<b>Starting note.</b> The tune begins on this note…', lead + 1.25); phase('<b>The tune, 1st time.</b>', t - 0.1); }
    const l1 = playLine(q.line, k, q.beat, t); if (withTool) lightLine('s-ok', q.line, q.beat, t); t += l1 + 1.2;
    if (cue) phase('<b>The tune, 2nd time.</b>', t - 0.1);
    const l2 = withTool ? 0 : playLine(q.line, k, q.beat, t);
    return t + l2 + 0.3 - (withTool ? 1.2 : 0);
  }
  function light(id, i) { const bx = $(id); if (!bx) return; [...bx.children].forEach((c, j) => c.classList.toggle('on', j === i)); }
  // while the tool replay plays: shape dots light up one by one; rhythm blocks fill up over exactly as long as each note lasts
  function lightLine(id, notes, beat, at) {
    const box = $(id); if (box) box.querySelectorAll('.fl').forEach(f => { f.style.transition = 'none'; f.classList.remove('go'); });
    let t = at; notes.forEach((n, i) => { const on = t, len = n.d * beat; later(() => { const s = $(id); if (!s) return;
      s.querySelectorAll('circle[data-i]').forEach((el, j) => el.classList.toggle('on', j === i));
      const f = s.querySelectorAll('.fl')[i]; if (f) { void f.getBoundingClientRect(); f.style.transition = `transform ${len.toFixed(2)}s linear`; f.classList.add('go'); } }, on * 1000); t += n.d * beat; });
    later(() => { const s = $(id); if (s) s.querySelectorAll('circle.on').forEach(el => el.classList.remove('on')); }, t * 1000 + 300);
  }

  // ---------- the check ----------
  const S = { stage: 'intro', plays: null, i: 0, qs: [], picks: [], playing: false, heard: false, answered: false, replays: 0 };
  const GRADES = [{ v: 'g12', t: 'Grade 1–2' }, { v: 'g3', t: 'Grade 3' }, { v: 'g4', t: 'Grade 4' }, { v: 'g5', t: 'Grade 5' }, { v: 'g6', t: 'Grade 6+' }, { v: 'none', t: 'No exam / not sure' }];
  const playsNum = () => ({ g12: 2, g3: 3, g4: 4, g5: 5, g6: 6 })[S.plays] || 0;
  function build() { S.qs = [qMeter(), qChange(), rhythmQ(4), shapeQ(4), shapeQ(5), rhythmQ(5)]; S.picks = []; S.i = 0; }

  function render() {
    const app = $('app');
    if (S.stage === 'intro') {
      app.innerHTML = `
        <section class="card">
          <p class="eyebrow">Ear check · Grades 3–5</p>
          <h1 class="q">How far can your ear go?</h1>
          <p class="count">Six short listening questions, from Grade 3 to Grade 5 level, built around the ABRSM aural tests. About 3 minutes. Sound&nbsp;on.</p>
        </section>
        <section class="below">
          <p class="caption"><b>Which grade are you playing at, or working towards?</b> We’ll compare it with your&nbsp;ear.</p>
          <div class="grades">${GRADES.map(g => `<button class="opt sm" data-v="${g.v}">${g.t}</button>`).join('')}</div>
        </section>`;
      app.querySelectorAll('[data-v]').forEach(b => b.onclick = () => { unlock(); S.plays = b.dataset.v; track('plays/' + S.plays); track('start'); build(); S.stage = 'q'; newQ(); });
      return;
    }
    if (S.stage === 'result') return renderResult();
    const q = S.qs[S.i], T = TITLES[q.kind], right = S.answered && S.picks[S.i] === q.ans;
    app.innerHTML = `
      <section class="card" aria-live="polite">
        <div class="qhead"><p class="eyebrow">Question ${S.i + 1} of 6 · Grade ${q.grade} level</p><div class="dots">${S.qs.map((x, j) => `<i class="${j < S.i ? (S.picks[j] === x.ans ? 'ok' : 'no') : j === S.i ? 'cur' : ''}"></i>`).join('')}</div></div>
        ${S.answered ? `<h1 class="q ans"><span class="mark ${right ? 'ok' : 'no'}" aria-hidden="true">${right ? '✓' : '•'}</span>${answerTitle(q)}</h1>` : `<h1 class="q">${T.q}</h1>`}
        ${S.answered ? `<p class="toolname">Listening tool: ${T.tool}</p>` : ''}
        <div class="figs">${figures(q)}</div>
        ${S.answered ? `<p class="count">${T.how(q.ans, q)}</p>` : `<div class="bar"><i id="prog"></i></div>`}
      </section>
      <section class="below">
        ${S.answered ? '' : `<div class="opts n${q.opts.length}">${q.opts.map(o => `<button class="opt" data-v="${o}" ${S.heard || S.playing ? '' : 'disabled'}>${optLabel(q, o)}</button>`).join('')}</div>`}
        <p class="caption" id="caption"></p>
        <div class="actions" id="actions"></div>
      </section>`;
    const cap = $('caption'), act = $('actions');
    if (!S.answered) {
      const twice = q.kind === 'shape' || q.kind === 'change';
      cap.innerHTML = S.playing ? (q.kind === 'meter' ? 'Listen for the strong beats…' : cap.innerHTML || 'Listen…') : S.heard ? 'Choose your answer.'
        : q.kind === 'shape' ? '<b>Sound on.</b> First the key chord and the starting note (not the question yet), then the tune twice.'
        : q.kind === 'change' ? '<b>Sound on.</b> First the key chord (not the question yet), then the tune twice.'
        : q.kind === 'rhythm' ? '<b>Sound on.</b> First a count-in of four clicks, then the rhythm.' : '<b>Sound on.</b> Press play when you’re ready.';
      const canReplay = !S.heard || S.replays < 1;
      act.innerHTML = `<button class="btn ${S.heard || S.playing ? 'ghost' : 'primary'}" id="play"${S.playing || !canReplay ? ' disabled' : ''}>${S.playing ? '♪ Playing…' : S.heard ? (canReplay ? '↻ Hear it once more' : 'Heard it twice') : '▶ Play'}</button>`;
      $('play').onclick = start;
      app.querySelectorAll('.opt').forEach(b => b.onclick = () => answer(b.dataset.v));
    } else {
      cap.textContent = right ? 'Yes!' : 'Not this time. The tool above shows what to listen for.';
      act.innerHTML = `<button class="btn ghost" id="tool">♪ Hear it with the tool</button><button class="btn primary" id="next">${S.i === 5 ? 'See my result →' : 'Next question →'}</button>`;
      $('tool').onclick = () => { track('tool/' + q.kind); prepare(q).then(() => playQ(q, true)); };
      $('next').onclick = next;
    }
  }
  function optLabel(q, o) { return q.kind === 'meter' ? o + ' beats' : o; }
  function answerTitle(q) { return q.kind === 'meter' ? q.ans + ' beats in a bar' : q.kind === 'change' ? (q.ans === 'Pitch' ? 'The pitch changed' : 'The rhythm changed') : q.kind === 'rhythm' ? 'Rhythm ' + q.ans : 'Shape ' + q.ans; }
  function figures(q) {
    if (q.kind === 'meter') return S.answered ? `<div class="beats" id="beats" aria-hidden="true">${Array.from({ length: +q.ans }, (x, i) => `<i>${i + 1}</i>`).join('')}</div><p class="piece">♪ ${q.piece.composer} · ${q.piece.title}</p>` : '';
    if (q.kind === 'change') { if (!S.answered) return ''; const all = q.a.concat(q.b).map(n => n.deg), lo = Math.min(...all), hi = Math.max(...all);
      return `<div class="pair"><span>1st</span><div id="t1">${timeSvg(q.a, [], lo, hi)}</div><span>2nd</span><div id="t2">${timeSvg(q.b, q.at, lo, hi)}</div></div>`; }
    if (q.kind === 'rhythm') return `<div class="choices">${q.ropts.map(o => `<div class="choice${S.answered ? (o.ok ? ' right' : ' dim') : ''}"><b>${o.label}</b><div${o.ok ? ' id="g-ok"' : ''}>${gridSvg(o.r, 4, S.answered && !o.ok ? diffIdx(o.r, q.ropts.find(x => x.ok).r) : [])}</div></div>`).join('')}</div>`;
    const all = q.sopts.flatMap(o => o.d), lo = Math.min(...all), hi = Math.max(...all);
    return `<div class="choices">${q.sopts.map(o => `<div class="choice${S.answered ? (o.ok ? ' right' : ' dim') : ''}"><b>${o.label}</b><div${o.ok ? ' id="s-ok"' : ''}>${shapeSvg(o.d, S.answered && !o.ok ? [o.i] : [], 'shape', lo, hi)}</div></div>`).join('')}</div>`;
  }
  function diffIdx(r, ok) { const on = rr => { let t = 0; return rr.map(d => { const x = t; t += d; return x + ':' + d; }); }; const a = on(r), b = new Set(on(ok)); return a.map((k, i) => (b.has(k) ? -1 : i)).filter(i => i >= 0); }

  function newQ() { S.playing = false; S.heard = false; S.answered = false; S.replays = 0; render(); prepare(S.qs[S.i]); }
  function start() {
    unlock(); const q = S.qs[S.i]; if (S.heard) { S.replays++; track('replay'); }
    const btn = $('play'); if (btn) { btn.disabled = true; btn.textContent = 'Loading…'; }
    prepare(q).then(() => {
      if (S.answered || S.qs[S.i] !== q) return;
      const len = playQ(q, false); S.playing = true; render();
      const pr = $('prog'); if (pr) { pr.style.transition = 'none'; pr.style.width = '0'; void pr.offsetWidth; pr.style.transition = `width ${len}s linear`; pr.style.width = '100%'; }
      later(() => { S.playing = false; S.heard = true; if (!S.answered) render(); }, len * 1000);
    });
  }
  function answer(v) {
    if (S.answered) return; stopAudio();
    const q = S.qs[S.i]; S.answered = true; S.picks[S.i] = v; S.playing = false; S.heard = true;
    track('q' + (S.i + 1) + '-g' + q.grade + '-' + q.kind + '/' + (v === q.ans ? 'right' : 'wrong'));
    render(); if (v === q.ans) chime();
  }
  function chime() { if (!ctx) return; const g0 = gen; [84, 88, 91].forEach((m, i) => loadSample(baseOf(m)).then(() => { if (g0 === gen) note(m, 0.05 + i * 0.09, 0.5, 0.5); })); }
  function next() { stopAudio(); if (S.i >= 5) { S.stage = 'result'; render(); return; } S.i++; newQ(); }

  // ---------- result ----------
  function scoreOf(g) { return S.qs.filter((q, i) => q.grade === g && S.picks[i] === q.ans).length; }
  function levelOf() { // the highest grade with both questions right, allowing one slip below it
    let lv = 0; for (const g of [3, 4, 5]) { const below = [3, 4, 5].filter(x => x < g).reduce((s, x) => s + (2 - scoreOf(x)), 0); if (scoreOf(g) === 2 && below <= 1) lv = g; }
    return lv;
  }
  function renderResult() {
    const app = $('app'), total = S.qs.filter((q, i) => S.picks[i] === q.ans).length, lv = levelOf(), plays = playsNum();
    const head = lv ? `Your ear: around Grade ${lv}` : 'Your ear: building up to Grade 3';
    let gap = '';
    if (plays >= 3 && plays <= 5 && lv) gap = lv >= plays ? `You’re working at Grade ${plays}, and your ear is keeping up. Nice.` : `You’re working at Grade ${plays}; your ear came out around Grade ${lv}. That gap is very common: lessons spend most of the time on pieces, so listening skills fall behind. It closes quickly with short, regular practice.`;
    else if (plays >= 3 && plays <= 5) gap = `You’re working at Grade ${plays}; your ear isn’t at Grade 3 level yet. That’s common, and it’s the easiest gap to close: a few minutes of listening a day makes a real difference.`;
    else if (plays === 6) gap = 'This check stops at Grade 5. If you got 6/6, your ear is ready for more.';
    const target = Math.min(5, Math.max(3, lv >= 5 ? 5 : plays >= 3 && plays <= 5 ? plays : lv + 1 || 3));
    const resultText = `Dottino Ear Check: ${total}/6 · ${lv ? 'around Grade ' + lv : 'building up to Grade 3'}`;
    try { localStorage.setItem('dottino:earcheck', JSON.stringify({ total, lv, plays: S.plays, at: Date.now() })); } catch (e) { /* ignore */ }
    track('finish'); track('result/' + (lv ? 'g' + lv : 'pre3')); if (plays >= 3 && plays <= 5) track('gap/plays' + plays + '-ear' + lv);
    app.innerHTML = `
      <section class="card final">
        <p class="eyebrow">Your result · ${total}/6</p>
        <h1 class="q">${head}</h1>
        ${gap ? `<p class="count">${gap}</p>` : ''}
        <div class="rows">${[3, 4, 5].map(g => { const s = scoreOf(g); return `<div class="row"><span>Grade ${g} level</span><span class="pips">${[0, 1].map(j => `<i class="${j < s ? 'ok' : ''}"></i>`).join('')}</span><span class="muted">${s}/2</span></div>`; }).join('')}</div>
        <p class="fine">A quick 6-question listening check, not an ABRSM mark. It doesn’t test singing, clapping back or describing music, which the real aural test also asks for.</p>
      </section>
      <section class="below">
        ${SOCIAL ? `<p class="caption"><b>Came from a Basso video?</b> Comment your grade and score: <span class="hl">“${plays ? (GRADES.find(g => g.v === S.plays).t + ' · ') : ''}${total}/6”</span></p>` : ''}
        <div class="actions"><button class="btn primary" id="share">Share my result</button><button class="btn ghost" id="send">Send to a parent or teacher</button></div>
        <p class="share-note" id="shareNote" hidden></p>
        <div class="next">
          <a class="go" id="goWeek" href="/aural.html?w=1&ref=ear-${encodeURIComponent(REF)}"><b>Start listening practice free</b><span>Week 1 of the Grade 4 plan: three 10-minute lessons with Basso, the same tools you just saw. No sign-up.</span></a>
          <button class="go linkish" id="again"><b>Try a new set of questions</b><span>Every check is different.</span></button>
        </div>
        ${INAPP ? '<p class="tip">Tip: the full lessons work best in Safari or Chrome. Tap ••• and choose “Open in browser”.</p>' : ''}
        <form class="mail" id="mail" novalidate>
          <label for="mailIn"><b>Get Grade ${target} listening practice by email</b><span>Tips for your level, and one email when the Grade ${target} pack opens (founding price £15). Under 13? Ask a parent to put in their email. No spam.</span></label>
          <div class="row"><input id="mailIn" type="email" inputmode="email" autocomplete="email" placeholder="you@example.com" required><button class="btn primary" type="submit">Send it</button></div>
          <p class="mail-msg" id="mailMsg" role="status"></p>
        </form>
      </section>`;
    const url = location.origin + '/ear-check/?ref=share';
    async function share(text, ev) {
      track(ev); const note = $('shareNote');
      try { if (navigator.share) { await navigator.share({ title: 'Dottino Ear Check', text, url }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
      try { await navigator.clipboard.writeText(text + ' ' + url); note.textContent = 'Copied. Paste it into a message.'; } catch (e) { note.textContent = text + ' ' + url; }
      note.hidden = false;
    }
    $('share').onclick = () => share(`I got ${total}/6 on the Dottino Ear Check (${lv ? 'around Grade ' + lv : 'building up to Grade 3'}). How far can your ear go?`, 'share');
    $('send').onclick = () => share(`My ear check result: ${total}/6, ${lv ? 'around Grade ' + lv : 'building up to Grade 3'} ${plays ? '(I’m working at ' + GRADES.find(g => g.v === S.plays).t + ')' : ''}. Here’s the check:`, 'send-adult');
    $('goWeek').onclick = () => track('go/week1');
    $('again').onclick = () => { track('again'); build(); S.stage = 'q'; newQ(); };
    $('mail').onsubmit = e => {
      e.preventDefault(); const v = $('mailIn').value.trim(), msg = $('mailMsg');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { msg.textContent = 'Please check the email address.'; return; }
      const body = new URLSearchParams({ 'form-name': 'founding', email: v, grade: String(target), ref: REF, lang: 'en', src: `ear-check · ${resultText} · plays ${S.plays}` });
      msg.textContent = 'Sending…';
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() })
        .then(r => { if (!r.ok) throw 0; track('email/g' + target); $('mail').innerHTML = '<p class="mail-done"><b>Thanks!</b> We’ll be in touch with Grade ' + target + ' practice.</p>'; })
        .catch(() => { msg.textContent = 'That didn’t send. Please try again in a moment.'; });
    };
  }

  render();
  // test hooks for local checks only (?test=1): build a set without the intro and expose state
  if (Q.get('test') === '1') window.__ear = { S, build, render, qMeter, qChange, rhythmQ, shapeQ, levelOf, scoreOf };
})();
