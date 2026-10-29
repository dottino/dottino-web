// Builds the Basso Challenge pages and share images from challenge/challenges.js.
//   node tools/make_challenges.js            pages only
//   node tools/make_challenges.js --images   pages + share images (needs Playwright and the two fonts, see FONTS)
// Output: c/<n>/index.html, play/index.html, img/og/c<n>.png, img/og/play.png, img/og/home.png
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), SITE = 'https://dottino.app';
global.window = {}; require(path.join(ROOT, 'challenge/challenges.js'));
const LIST = window.CHALLENGES.slice().sort((a, b) => a.n - b.n);
// each challenge goes live on its date at 19:00 UK time (when the video is scheduled), so pages can be deployed ahead of the videos
function releaseAt(d) {
  const guess = Date.parse(d + 'T19:00:00Z');
  const london = new Date(guess).toLocaleString('en-GB', { timeZone: 'Europe/London', hour: '2-digit', hour12: false });
  return guess - (parseInt(london, 10) - 19) * 3600e3; // shift by the BST offset in summer
}
LIST.forEach(c => { c.rel = releaseAt(c.date); });
const BUILT = Date.now(), LIVE = LIST.filter(c => c.rel <= BUILT), LATEST = (LIVE.length ? LIVE : LIST)[(LIVE.length ? LIVE : LIST).length - 1];
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmt = d => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

function head({ title, desc, url, img }) {
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Dottino">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(title)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${img}">
<meta name="theme-color" content="#F2EEE6">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Atkinson+Hyperlegible:wght@400;700&display=swap">
<link rel="stylesheet" href="/challenge/challenge.css">
</head>`;
}
const FOOT = `<footer class="foot"><span>Piano: Salamander Grand Piano by Alexander Holm (CC-BY 3.0). Pieces: Mutopia Project editions.</span><span><a href="/">Dottino</a> · <a href="/privacy.html">Privacy</a></span></footer>`;
const GC = `<script data-goatcounter="https://dottino.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>`;

function challengePage(c) {
  const title = `Basso Challenge #${c.n}: ${c.q}`, desc = `${c.teaser} A 30-second listening game from Dottino.`;
  return `${head({ title, desc, url: `${SITE}/c/${c.n}/`, img: `${SITE}/img/og/c${c.n}.png` })}
<body>
<div class="wrap">
  <header class="top"><a class="badge" href="/play">Basso Challenge <em>#${c.n}</em></a><a class="brand" href="/">dottino<i>.</i></a></header>
  <main id="app">
    <section class="card"><p class="eyebrow">Listen</p><h1 class="q">${esc(c.q)}</h1><div class="bar"><i></i></div></section>
    <section class="below"><p class="caption"><b>Sound on!</b> <span class="hl">${esc(c.teaser)}</span></p><noscript><p>This game needs JavaScript turned on.</p></noscript></section>
  </main>
  ${FOOT}
</div>
<script src="/challenge/challenges.js"></script>
<script src="/pieces.js"></script>
<script>window.CH_N = ${c.n};</script>
<script src="/challenge/challenge.js"></script>
${GC}
</body>
</html>
`;
}

function playPage() {
  const title = 'Basso Challenges · Dottino', desc = 'Short listening games with Basso. Can you hear it before he does? New challenges every week.';
  const items = LIST.slice().reverse();
  return `${head({ title, desc, url: `${SITE}/play/`, img: `${SITE}/img/og/play.png` })}
<body>
<div class="wrap">
  <header class="top"><span class="badge">Basso Challenges</span><a class="brand" href="/" data-ref>dottino<i>.</i></a></header>
  <section class="hero"><h1>Can you hear it before Basso does?</h1><p>Short listening games from the videos. New challenges every week.</p></section>
  <h2 class="sec">Latest</h2>
  ${items.map(c => `<a class="card latest" href="/c/${c.n}" data-ref data-rel="${c.rel}"${c === LATEST ? '' : ' hidden'}>
    <p class="eyebrow">Basso Challenge #${c.n}</p>
    <h1 class="q">${esc(c.q)}</h1>
    <span class="play">▶ Play</span>
  </a>`).join('\n  ')}
  <h2 class="sec" id="allh"${LIVE.length > 1 ? '' : ' hidden'}>All challenges</h2>
  <ul class="list">${items.map(c => `<li data-rel="${c.rel}"${c.rel <= BUILT ? '' : ' hidden'}><a href="/c/${c.n}" data-ref><span class="n">#${c.n}</span><span class="t">${esc(c.q)}</span><span class="d">${fmt(c.date)}</span></a></li>`).join('')}</ul>
  <h2 class="sec">More from Dottino</h2>
  <div class="next">
    <a class="go" href="/aural.html?w=1" data-ref><b>Play Week 1 free</b><span>Three 10-minute listening lessons with Basso, built around the ABRSM aural tests.</span></a>
    <a class="go" href="/" data-ref><b>What is Dottino?</b><span>For parents and teachers.</span></a>
  </div>
  ${FOOT}
</div>
<script>
// show only challenges whose video is already out (19:00 UK on their date); the newest of those is the big card
(function () { const now = Date.now(), live = [...document.querySelectorAll('.list li')].filter(li => +li.dataset.rel <= now);
  document.querySelectorAll('.list li').forEach(li => { li.hidden = +li.dataset.rel > now; });
  const cards = [...document.querySelectorAll('a.latest')].filter(a => +a.dataset.rel <= now);
  if (cards.length) document.querySelectorAll('a.latest').forEach(a => { a.hidden = a !== cards[0]; });
  const h = document.getElementById('allh'); if (h) h.hidden = live.length < 2; })();
// keep the source (?ref=tiktok, ?ref=instagram) on every link, so we can see which bio link brought people in
(function () { try { const r = (new URLSearchParams(location.search).get('ref') || '').replace(/[^\\w-]/g, '').slice(0, 30); if (!r) return;
  document.querySelectorAll('a[data-ref]').forEach(a => { const u = new URL(a.getAttribute('href'), location.origin); u.searchParams.set('ref', r); a.setAttribute('href', u.pathname + u.search); });
  setTimeout(() => { try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: 'event/play/from/' + r, title: 'play from ' + r, event: true }); } catch (e) {} }, 1500);
} catch (e) {} })();
</script>
${GC}
</body>
</html>
`;
}

for (const c of LIST) { const dir = path.join(ROOT, 'c', String(c.n)); fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(path.join(dir, 'index.html'), challengePage(c)); }
fs.mkdirSync(path.join(ROOT, 'play'), { recursive: true }); fs.writeFileSync(path.join(ROOT, 'play', 'index.html'), playPage());
console.log('pages:', LIST.map(c => 'c/' + c.n).join(' '), 'play/');

// ---------- share images (1200 x 630) ----------
if (process.argv.includes('--images')) (async () => {
  const FONTS = process.env.FONTS || '/tmp/claude-0/fonts/node_modules/@fontsource';
  const font = (fam, file, w) => `@font-face{font-family:'${fam}';font-weight:${w};src:url(data:font/woff2;base64,${fs.readFileSync(path.join(FONTS, file)).toString('base64')}) format('woff2')}`;
  const css = font('Bricolage Grotesque', 'bricolage-grotesque/files/bricolage-grotesque-latin-800-normal.woff2', 800) + font('Atkinson Hyperlegible', 'atkinson-hyperlegible/files/atkinson-hyperlegible-latin-700-normal.woff2', 700);
  const basso = (eyes) => `<svg viewBox="100 70 330 340" width="430"><circle cx="256" cy="290" r="111" fill="#1E1B2E"/><path d="M230 138 C224 118 247 91 270 91 C299 84 325 101 330 126 C338 154 318 179 289 198" fill="none" stroke="#1E1B2E" stroke-width="24" stroke-linecap="round"/><circle cx="231" cy="139" r="24" fill="#1E1B2E"/><circle cx="360" cy="104" r="13" fill="#F36C51"/><circle cx="366" cy="149" r="13" fill="#F36C51"/>${eyes === 'happy' ? '<g fill="none" stroke="#F5F1E8" stroke-width="14" stroke-linecap="round"><path d="M200 298 A20 20 0 0 1 240 298"/><path d="M272 298 A20 20 0 0 1 312 298"/></g>' : '<rect x="209" y="261" width="22" height="46" rx="11" fill="#F5F1E8"/><rect x="281" y="261" width="22" height="46" rx="11" fill="#F5F1E8"/>'}</svg>`;
  const card = ({ badge, big, small, eyes }) => `<!doctype html><html><head><style>${css}
    *{box-sizing:border-box}body{margin:0;width:1200px;height:630px;background:#F2EEE6;font-family:'Atkinson Hyperlegible',sans-serif;color:#1E1B2E;display:grid;grid-template-columns:1fr 470px;align-items:center;padding:0 40px 0 80px;overflow:hidden}
    .badge{display:inline-block;background:#1E1B2E;color:#F2EEE6;border-radius:12px;padding:10px 18px;font:800 26px 'Bricolage Grotesque';letter-spacing:.05em;text-transform:uppercase}.badge em{font-style:normal;color:#F36C51}
    h1{font:800 76px/1.04 'Bricolage Grotesque';margin:28px 0 22px;letter-spacing:-.015em;text-wrap:balance}p{font-size:32px;margin:0;color:#E9553A;font-weight:700}
    .brand{position:absolute;left:80px;bottom:44px;font:800 34px 'Bricolage Grotesque'}.brand i{font-style:normal;color:#F36C51}.url{position:absolute;right:56px;bottom:50px;font-size:24px;color:#6A6475}
    .bub{position:absolute;top:70px;right:60px;background:#FFFDF9;border:3px solid #1E1B2E;border-radius:20px;padding:12px 20px;font:800 28px 'Bricolage Grotesque'}</style></head>
    <body><div><span class="badge">${badge}</span><h1>${big}</h1><p>${small}</p></div><div>${basso(eyes)}</div><span class="brand">dottino<i>.</i></span><span class="url">dottino.app</span></body></html>`;
  const { chromium } = require('playwright');
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  const out = path.join(ROOT, 'img/og'); fs.mkdirSync(out, { recursive: true });
  const shot = async (html, name) => { await p.setContent(html, { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready); await p.screenshot({ path: path.join(out, name), type: 'png' }); };
  for (const c of LIST) await shot(card({ badge: `Basso Challenge <em>#${c.n}</em>`, big: esc(c.q), small: esc(c.teaser), eyes: 'idle' }), `c${c.n}.png`);
  await shot(card({ badge: 'Basso Challenges', big: 'Can you hear it before Basso does?', small: 'New listening games every week', eyes: 'happy' }), 'play.png');
  await shot(card({ badge: 'Dottino', big: 'Hear what you play', small: 'Ear-training games for young pianists', eyes: 'happy' }), 'home.png');
  await b.close(); console.log('images: img/og/');
})();
