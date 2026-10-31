/* Basso Challenge page: the question from the video, then a 3-round rematch against Basso with real pieces.
   Needs: window.CHALLENGES (challenges.js), window.PIECES (pieces.js), window.CH_N (set by the page). */
(function () {
  const C = (window.CHALLENGES || []).find(c => c.n === window.CH_N) || (window.CHALLENGES || [])[0];
  if (!C) return;
  const $ = id => document.getElementById(id);
  const Q = new URLSearchParams(location.search);
  const REF = (Q.get('ref') || Q.get('utm_source') || (() => { const r = document.referrer; return /instagram/i.test(r) ? 'instagram' : /tiktok/i.test(r) ? 'tiktok' : /youtube/i.test(r) ? 'youtube' : /facebook/i.test(r) ? 'facebook' : ''; })() || 'direct').replace(/[^\w-]/g, '').slice(0, 30);
  const UA = navigator.userAgent || '';
  const INAPP = /Instagram|FBAN|FBAV|musical_ly|TikTok|BytedanceWebview|Snapchat/i.test(UA);
  const ROUNDS = 4;
  function track(name) { try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: 'event/c' + C.n + '/' + name, title: 'c' + C.n + ' ' + name, event: true }); } catch (e) { /* ignore */ } }
  // where people came from: one event per visit, so the bio links can be compared (GoatCounter also reads ?ref=)
  // once counted, take the source tags out of the address bar (REF is already kept for the links on this page)
  setTimeout(() => { if (!(window.goatcounter && window.goatcounter.count)) return; track('from/' + REF);
    try { const u = new URL(location.href); let c = false; ['ref', 's', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].forEach(k => { if (u.searchParams.has(k)) { u.searchParams.delete(k); c = true; } }); if (c) history.replaceState(history.state, '', u.pathname + u.search + u.hash); } catch (e) { /* ignore */ } }, 1500);

  // ---------- audio ----------
  let ctx = null, bus = null, gen = 0, unlocked = false;
  const buf = {}, loads = {}, NM3 = ['C', 'Ds', 'Fs', 'A'];
  const salName = m => NM3[((m - 36) / 3) % 4] + (Math.floor(m / 12) - 1) + 'v9';
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
  const baseOf = m => Math.max(36, Math.min(96, 36 + Math.round((m - 36) / 3) * 3));
  let room = null;
  function out() {
    if (bus && bus.context === ctx) return bus;
    bus = ctx.createGain(); bus.connect(ctx.destination);
    if (!room || room.sampleRate !== ctx.sampleRate) { const len = Math.floor(ctx.sampleRate * 1.8); room = ctx.createBuffer(2, len, ctx.sampleRate); for (let c = 0; c < 2; c++) { const d = room.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.4) * (i < 240 ? i / 240 : 1); } }
    const cv = ctx.createConvolver(); cv.buffer = room; const wet = ctx.createGain(); wet.gain.value = 0.22; cv.connect(wet); wet.connect(bus); bus.verb = cv;
    return bus;
  }
  function stopAudio() { gen++; timers.forEach(clearTimeout); timers = []; if (bus && ctx) { const b = bus; try { b.gain.setTargetAtTime(0, ctx.currentTime, 0.015); } catch (e) { /* ignore */ } setTimeout(() => { try { b.disconnect(); } catch (e) { /* ignore */ } }, 160); } bus = null; }
  let timers = [];
  const later = (fn, ms) => { const g = gen, t = setTimeout(() => { if (g === gen) fn(); }, ms); timers.push(t); };
  function note(m, at, vel, len) {
    const base = baseOf(m), b = buf[base]; if (!b) return;
    const g = ctx.createGain(); g.gain.value = (0.5 + 0.62 * vel) * 0.92; g.connect(out()); g.connect(out().verb);
    const s = ctx.createBufferSource(); s.buffer = b; s.playbackRate.value = Math.pow(2, (m - base) / 12); s.connect(g);
    const t0 = ctx.currentTime + at; s.start(t0); g.gain.setTargetAtTime(0, t0 + len, 0.18); s.stop(t0 + len + 1.4);
  }
  function tick(at, strong) { // a little wood-block click for the count-along
    const t0 = ctx.currentTime + at, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'triangle'; o.frequency.value = strong ? 1250 : 900; g.gain.setValueAtTime(strong ? 0.22 : 0.12, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.07);
    o.connect(g); g.connect(out()); o.start(t0); o.stop(t0 + 0.08);
  }

  // ---------- questions ----------
  // the video question plays its own clip; rematch rounds play the opening bars of real pieces in 2 or 3 time
  let clipBuf = null, clipLoad = null;
  function loadClip() { if (!clipLoad && ensureCtx()) clipLoad = decode(C.audio).then(b => { clipBuf = b; return b; }).catch(() => null); return clipLoad || Promise.resolve(null); }
  // each kind of question: which pieces fit the rematch, the right answer for a piece, and the words around it
  const KINDS = {
    meter23: {
      pool: p => !p.compound && (p.k === 2 || p.k === 3), ansOf: p => String(p.k), other: a => (a === '2' ? '3' : '2'),
      opt: o => o + ' beats', title: a => a + ' beats in a bar', count: true, again: '♪ Hear it with the count', pick: 'Pick 2 or 3. Or hear it once more.',
      explain: a => (a === '3' ? 'Strong, light, light: <b>ONE</b> two three.' : 'Strong, light: <b>ONE</b> two.'), hint: 'listen for the strong beat', helpBubble: 'Listen to the count with me!',
      says: { '2': ['I know, it’s TWO!', 'Easy. Two!', 'Two, for sure!'], '3': ['I know, it’s THREE!', 'Three! Definitely.', 'Sounds like three to me!'] }
    },
    mode: {
      pool: p => typeof p.minor === 'boolean', ansOf: p => (p.minor ? 'Minor' : 'Major'), other: a => (a === 'Major' ? 'Minor' : 'Major'),
      opt: o => o, title: a => a, count: false, again: '♪ Hear it again', pick: 'Major or minor? Or hear it once more.',
      explain: a => (a === 'Minor' ? 'A darker colour, and it settles on a <b>minor</b> chord.' : 'A bright colour, and it settles on a <b>major</b> chord.'), hint: 'listen to where the music ends', helpBubble: 'Listen to the ending with me!',
      says: { Major: ['It’s MAJOR!', 'Bright. Major!', 'Major, for sure!'], Minor: ['It’s MINOR!', 'Sounds minor to me!', 'Minor. Definitely.'] }
    }
  };
  const K = KINDS[C.kind] || KINDS.meter23;
  const POOL = (window.PIECES || []).filter(K.pool);
  function excerpt(p) { const beats = Math.min(p.T, p.k * Math.ceil(7.2 / p.B / p.k)); return { p, beats, ev: p.ev.filter(e => e.t < beats - 0.01), len: beats * p.B }; }
  function rematchSet() { // one of each answer, plus one more of either, in random order
    const [a, b] = C.opts, sh = arr => arr.sort(() => Math.random() - 0.5);
    const A = sh(POOL.filter(p => K.ansOf(p) === a)), B = sh(POOL.filter(p => K.ansOf(p) === b));
    const pick = sh([A[0], B[0], Math.random() < 0.5 ? A[1] : B[1]].filter(Boolean));
    return pick.map(p => { const ans = K.ansOf(p); return { piece: excerpt(p), ans, basso: Math.random() < 0.55 ? ans : K.other(ans) }; });
  }
  function prepare(item) {
    if (item.piece) { const bases = [...new Set(item.piece.ev.map(e => baseOf(e.m)))]; return Promise.all(bases.map(loadSample)); }
    return loadClip();
  }
  // play an item; returns its length in seconds. withCount adds clicks and lights the beat chips
  function playItem(item, withCount) {
    stopAudio(); unlock(); if (!ctx) return 0;
    const lead = 0.12;
    if (!item.piece) {
      if (!clipBuf) return 0;
      const s = ctx.createBufferSource(); s.buffer = clipBuf; s.connect(out()); s.start(ctx.currentTime + lead);
      if (withCount && C.beat) { const B = C.beat; for (let i = 0; i < B.n; i++) { const at = lead + B.first + i * B.len; tick(at, i % B.k === 0); later(() => lightBeat(i % B.k), at * 1000); } }
      return lead + clipBuf.duration;
    }
    const x = item.piece, p = x.p, soft = ['calm', 'solemn', 'sad', 'flowing', 'dance'].includes(p.char);
    x.ev.forEach(e => {
      const at = lead + e.t * p.B, dur = e.d * p.B, acc = Math.abs(e.t % p.k) < 0.01 ? (soft ? 1.04 : 1.1) : 1;
      const vel = Math.min(1, Math.max(0.15, 0.2 + ((e.v || 1) * 80 - 40) / 70) * acc * (e.mel ? 1 : soft ? 0.5 : 0.62));
      note(e.m, at, vel, p.art === 'staccato' ? Math.min(0.2, dur * 0.55) : dur + (e.mel ? 0.06 : 0.18));
    });
    if (withCount) for (let i = 0; i < x.beats; i++) { const at = lead + i * p.B; tick(at, i % p.k === 0); later(() => lightBeat(i % p.k), at * 1000); }
    return lead + x.len + 0.4;
  }

  // ---------- game ----------
  const S = { round: 0, you: 0, basso: 0, items: [{ ans: C.ans, basso: C.basso }], answered: false, playing: false, heard: false };
  const item = () => S.items[S.round];
  const BASSO_SAYS = K.says;
  const pickOne = a => a[Math.floor(Math.random() * a.length)];

  function render() {
    const it = item(), app = $('app'), last = S.round === ROUNDS - 1;
    if (S.done) return renderFinal();
    const label = S.round === 0 ? (S.answered ? 'Answer' : 'Listen') : `Rematch · round ${S.round + 1} of ${ROUNDS}`;
    const right = S.answered && S.pick === it.ans, bassoRight = it.basso === it.ans;
    app.innerHTML = `
      <section class="card" aria-live="polite">
        <p class="eyebrow">${label}</p>
        ${S.answered
          ? `<h1 class="q ans"><span class="mark ${right ? 'ok' : 'no'}" aria-hidden="true">${right ? '✓' : '•'}</span>${K.title(it.ans)}</h1>
             <p class="count">${!it.piece && C.explain ? C.explain : K.explain(it.ans)}</p>
             ${it.piece ? `<p class="piece">♪ That was <b>${it.piece.p.composer}</b> · ${it.piece.p.title}${it.piece.p.work ? ` <span>(${it.piece.p.work})</span>` : ''}</p>` : ''}
             ${K.count ? `<div class="beats" id="beats" aria-hidden="true">${Array.from({ length: +it.ans }, (x, i) => `<i>${i + 1}</i>`).join('')}</div>` : ''}`
          : `<h1 class="q">${C.q}</h1><div class="bar"><i id="prog"></i></div>`}
      </section>
      <section class="stage">
        <div class="bubble" id="bubble" hidden></div>
        ${bassoSvg()}
      </section>
      <section class="below">
        ${S.answered ? '' : `<div class="opts">${C.opts.map(o => `<button class="opt" data-v="${o}" ${S.heard || S.playing ? '' : 'disabled'}>${K.opt(o)}</button>`).join('')}</div>`}
        <p class="caption" id="caption"></p>
        <div class="actions" id="actions"></div>
        ${S.round > 0 || S.answered ? `<p class="score"><span>You ${S.you}</span> · <span>Basso ${S.basso}</span></p>` : ''}
      </section>`;
    const cap = $('caption'), act = $('actions');
    if (!S.answered) {
      cap.innerHTML = S.round === 0 && !S.heard && !S.playing ? `<b>Sound on!</b> <span class="hl">${C.teaser}</span>` : S.playing ? 'Listen carefully…' : K.pick;
      act.innerHTML = `<button class="btn ${S.heard || S.playing ? 'ghost' : 'primary'}" id="play"${S.playing ? ' disabled' : ''}>${S.playing ? '♪ Playing…' : S.heard ? '↻ Hear it again' : '▶ Play the music'}</button>`;
      $('play').onclick = start;
      app.querySelectorAll('.opt').forEach(b => b.onclick = () => answer(b.dataset.v));
      pose('idle');
    } else {
      cap.textContent = right && !bassoRight ? 'You beat Basso!' : right ? 'You both got it.' : bassoRight ? 'Basso got this one.' : 'Tricky one. Next time, ' + K.hint + '.';
      act.innerHTML = `<button class="btn ghost" id="count">${K.again}</button><button class="btn primary" id="next">${S.round === 0 ? 'Rematch Basso →' : last ? 'See the final score →' : 'Next round →'}</button>` + (S.round === 0 ? '<p class="teasenext">3 more rounds with real music by Burgmüller, Schumann and Tchaikovsky.</p>' : '');
      $('count').onclick = () => { track('count'); playItem(it, K.count); };
      $('next').onclick = next;
      const b = $('bubble'); b.hidden = false;
      b.textContent = right && !bassoRight ? 'Wow, you heard it before me!' : right ? 'High five! We both heard it.' : bassoRight ? K.helpBubble : 'That one fooled me too!';
      pose(right ? (bassoRight ? 'happy' : 'wow') : 'happy');
    }
  }
  function lightBeat(i) { const bx = $('beats'); if (!bx) return; [...bx.children].forEach((c, j) => c.classList.toggle('on', j === i)); }

  function start() {
    unlock(); track(S.round === 0 ? (S.heard ? 'replay' : 'start') : 'r' + (S.round + 1) + '/start');
    const it = item(), btn = $('play'); if (btn) { btn.disabled = true; btn.textContent = 'Loading…'; }
    prepare(it).then(() => {
      if (S.answered || item() !== it) return;
      const len = playItem(it, false); S.playing = true; render();
      const pr = $('prog'); if (pr) { pr.style.transition = 'none'; pr.style.width = '0'; void pr.offsetWidth; pr.style.transition = `width ${len}s linear`; pr.style.width = '100%'; }
      // Basso can't help himself and blurts out a guess part-way through
      if (!S.heard) later(() => { const b = $('bubble'); if (!b) return; b.textContent = pickOne(BASSO_SAYS[it.basso]); b.hidden = false; pose('sure'); later(() => { if (!S.answered) { b.hidden = true; pose('idle'); } }, 2600); }, Math.min(2600, len * 400));
      later(() => { S.playing = false; S.heard = true; if (!S.answered) render(); }, len * 1000);
    });
  }
  function answer(v) {
    if (S.answered) return; stopAudio();
    const it = item(); S.answered = true; S.pick = v; S.playing = false; S.heard = true;
    if (v === it.ans) S.you++; if (it.basso === it.ans) S.basso++;
    track((S.round === 0 ? '' : 'r' + (S.round + 1) + '/') + (v === it.ans ? 'right' : 'wrong'));
    render(); chime(v === it.ans);
  }
  function chime(ok) { // after the question only: a small bell for right, nothing sad for wrong
    if (!ctx || !ok) return; const g0 = gen;
    [84, 88, 91].forEach((m, i) => loadSample(baseOf(m)).then(() => { if (g0 === gen) note(m, 0.05 + i * 0.09, 0.5, 0.5); }));
  }
  function next() {
    stopAudio();
    if (S.round === 0 && S.items.length === 1) { S.items = S.items.concat(rematchSet()); track('rematch'); }
    if (S.round >= ROUNDS - 1) { S.done = true; track('finish'); render(); return; }
    S.round++; S.answered = false; S.heard = false; S.playing = false; S.pick = null;
    render(); prepare(item());
  }

  function renderFinal() {
    const app = $('app'), won = S.you > S.basso, tie = S.you === S.basso;
    const shareText = `I scored ${S.you}–${S.basso} against Basso in Dottino Challenge #${C.n}. Can you beat him?`;
    const link = (path, extra) => path + (path.includes('?') ? '&' : '?') + 'ref=' + encodeURIComponent('c' + C.n + '-' + REF) + (extra || '');
    app.innerHTML = `
      <section class="card final">
        <p class="eyebrow">Final score</p>
        <h1 class="big"><span>You ${S.you}</span><em>·</em><span>Basso ${S.basso}</span></h1>
        <p class="count">${won ? 'You out-listened Basso. He wants a rematch.' : tie ? 'A draw! Basso says you’re a tough opponent.' : 'Basso wins this time. Try again and ' + K.hint + '.'}</p>
      </section>
      <section class="stage small">${bassoSvg()}</section>
      <section class="below">
        <div class="actions"><button class="btn primary" id="share">Challenge a friend</button><button class="btn ghost" id="again">Play again</button></div>
        <p class="share-note" id="shareNote" hidden></p>
        <div class="next">
          <a class="go" id="goWeek" href="${link('/aural.html?w=1')}"><b>Play Week 1 free</b><span>Three 10-minute listening lessons with Basso, built around the ABRSM aural tests.</span></a>
          <a class="go" id="goAbout" href="${link('/')}"><b>What is Dottino?</b><span>For parents and teachers.</span></a>
          <a class="go" href="/play?ref=${encodeURIComponent(REF)}"><b>More Basso Challenges</b><span>New ones every week.</span></a>
        </div>
        ${INAPP ? '<p class="tip">Tip: the full lessons work best in Safari or Chrome. Tap ••• and choose “Open in browser”.</p>' : ''}
        <form class="mail" id="mail" novalidate>
          <label for="mailIn"><b>Grown-ups: get the next challenge by email</b><span>For parents, teachers and adult learners. One email when a new challenge or Dottino opens. No spam.</span></label>
          <div class="row"><input id="mailIn" type="email" inputmode="email" autocomplete="email" placeholder="you@example.com" required><button class="btn primary" type="submit">Send it</button></div>
          <p class="mail-msg" id="mailMsg" role="status"></p>
        </form>
      </section>`;
    pose(won ? 'wow' : 'happy');
    $('again').onclick = () => { track('again'); Object.assign(S, { round: 0, you: 0, basso: 0, items: [{ ans: C.ans, basso: C.basso }], answered: false, playing: false, heard: false, done: false, pick: null }); render(); };
    $('goWeek').onclick = () => track('go/week1'); $('goAbout').onclick = () => track('go/about');
    $('share').onclick = async () => {
      track('share'); const url = location.origin + '/c/' + C.n + '?ref=share', note = $('shareNote');
      try { if (navigator.share) { await navigator.share({ title: 'Basso Challenge #' + C.n, text: shareText, url }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
      try { await navigator.clipboard.writeText(shareText + ' ' + url); note.textContent = 'Link copied. Paste it to a friend.'; } catch (e) { note.textContent = shareText + ' ' + url; }
      note.hidden = false;
    };
    $('mail').onsubmit = e => {
      e.preventDefault(); const v = $('mailIn').value.trim(), msg = $('mailMsg');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { msg.textContent = 'Please check the email address.'; return; }
      const body = new URLSearchParams({ 'form-name': 'waitlist', email: v, who: 'challenge', ref: REF, lang: 'en', best: S.you + '-' + S.basso, src: 'challenge-' + C.n });
      msg.textContent = 'Sending…';
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() })
        .then(r => { if (!r.ok) throw 0; track('email'); $('mail').innerHTML = '<p class="mail-done"><b>Thanks!</b> We’ll email you when the next challenge is up.</p>'; })
        .catch(() => { msg.textContent = 'That didn’t send. Please try again in a moment.'; });
    };
  }

  // ---------- Basso ----------
  function bassoSvg() {
    return `<svg class="basso" id="basso" viewBox="100 70 330 340" data-pose="idle" role="img" aria-label="Basso">
      <circle cx="256" cy="290" r="111" class="ink"/>
      <path d="M230 138 C224 118 247 91 270 91 C299 84 325 101 330 126 C338 154 318 179 289 198" fill="none" class="inks" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="231" cy="139" r="24" class="ink"/>
      <circle cx="360" cy="104" r="13" class="dot"/><circle cx="366" cy="149" r="13" class="dot"/>
      <g class="e-idle"><rect x="209" y="261" width="22" height="46" rx="11" class="eye"/><rect x="281" y="261" width="22" height="46" rx="11" class="eye"/></g>
      <g class="e-happy" fill="none" stroke-width="14" stroke-linecap="round"><path d="M200 298 A20 20 0 0 1 240 298" class="eyel"/><path d="M272 298 A20 20 0 0 1 312 298" class="eyel"/></g>
      <g class="e-sure" fill="none" stroke-width="10" stroke-linecap="round"><path d="M204 282 Q220 296 236 282" class="eyel"/><path d="M276 282 Q292 296 308 282" class="eyel"/></g>
      <g class="e-wow"><ellipse cx="220" cy="282" rx="15" ry="27" class="eye"/><ellipse cx="292" cy="282" rx="15" ry="27" class="eye"/></g>
    </svg>`;
  }
  function pose(p) { const b = $('basso'); if (!b) return; if (b.dataset.pose !== p) { b.dataset.pose = p; if (p === 'happy' || p === 'wow') { b.classList.remove('hop'); void b.getBoundingClientRect(); b.classList.add('hop'); } } }

  render();
  // warm up: the clip decodes on first touch; the piano for round 2 starts loading once the first answer is in
  addEventListener('pointerdown', () => loadClip(), { once: true, passive: true });
})();
