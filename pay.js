// Dottino payments (Paddle Billing). Shared by aural.html (and later index.html).
// SELLING = false: the public site shows no buy button and nothing is locked.
// Add ?paytest=1 to a page to try the whole flow in Paddle's sandbox (test cards, no real money).
(function () {
  const CFG = {
    SELLING: true,
    env: 'production',
    token: 'live_479830012ec48cd95f2ec833528',       // live client-side token (public by design)
    prices: {
      g3: 'pri_01m8bg0tj57y48h8kyngp5wdvg',          // Grade 3 Aural Pack, £15 one-time (live)
      g4: 'pri_01m65ffd1mtr2r0fgsz558c3f5',          // Grade 4 Aural Pack, £15 one-time (live)
      g5: 'pri_01m8bfzmqphjj50jy12eykbgkx'           // Grade 5 Aural Pack, £15 one-time (live)
    }
  };
  // sandbox values, kept for reference: token test_71993bc3ba8caec8a5d63f51608, price pri_01m5y173swe9wpr5538rp338ee
  const LIVE = {
    prices: { g3: 'pri_01m8bg0tj57y48h8kyngp5wdvg', g4: 'pri_01m65ffd1mtr2r0fgsz558c3f5', g5: 'pri_01m8bfzmqphjj50jy12eykbgkx' },
    products: { g3: 'pro_01m8bfv4np85bspsgkjb4jfxvk', g4: 'pro_01m65fe6fwa0yxvcv4ym9qq5wv', g5: 'pro_01m8bfvp20s6fvn98sd6gy1g75' }
  };
  const LKEY = 'dottino:license';
  let testMode = false, pendingGrade = 4;
  try { const sp = new URLSearchParams(location.search); if (sp.get('paytest') === '1') sessionStorage.setItem('dottino:paytest', '1'); testMode = sessionStorage.getItem('dottino:paytest') === '1'; } catch (e) { /* ignore */ }
  const active = () => CFG.SELLING || testMode;

  function readLicense() {
    try {
      const l = JSON.parse(localStorage.getItem(LKEY) || 'null');
      if (!l) return null;
      const now = Date.now();
      if (l.expByGrade) {
        const activeGrades = Object.keys(l.expByGrade).map(Number).filter(g => l.expByGrade[g] > now).sort((a, b) => a - b);
        return activeGrades.length ? Object.assign({}, l, { grades: activeGrades }) : null;
      }
      return l.exp > now ? l : null;
    } catch (e) { return null; }
  }
  function saveLicense(l) { try { localStorage.setItem(LKEY, JSON.stringify(l)); } catch (e) { /* private window */ } }
  function mergeLicense(lic) {
    const prev = readLicense();
    const expByGrade = {};
    if (prev) {
      if (prev.expByGrade) Object.assign(expByGrade, prev.expByGrade);
      else (prev.grades || []).forEach(g => { expByGrade[g] = prev.exp || 0; });
    }
    if (lic.expByGrade) {
      Object.keys(lic.expByGrade).forEach(g => { expByGrade[g] = Math.max(expByGrade[g] || 0, lic.expByGrade[g] || 0); });
    } else {
      (lic.grades || []).forEach(g => { expByGrade[g] = Math.max(expByGrade[g] || 0, lic.exp || 0); });
    }
    const now = Date.now();
    lic.expByGrade = expByGrade;
    lic.grades = Object.keys(expByGrade).map(Number).filter(g => expByGrade[g] > now).sort((a, b) => a - b);
    lic.exp = Math.max(0, ...Object.values(expByGrade));
    saveLicense(lic);
  }
  function hasAccess(grade) {
    const l = readLicense(), g = +grade;
    if (!l) return false;
    if (l.expByGrade) return (l.expByGrade[g] || 0) > Date.now();
    return (l.grades || []).indexOf(g) >= 0;
  }

  let ready = null, onDone = null;
  function load() {
    if (ready) return ready;
    ready = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
      s.onload = () => {
        try {
          if (CFG.env === 'sandbox') window.Paddle.Environment.set('sandbox');
          window.Paddle.Initialize({ token: CFG.token, eventCallback: ev => { if (ev && ev.name === 'checkout.completed') completed(ev.data); } });
          resolve(window.Paddle);
        } catch (e) { reject(e); }
      };
      s.onerror = () => reject(new Error('paddle.js failed to load'));
      document.head.appendChild(s);
    });
    return ready;
  }
  async function post(fn, body) {
    const r = await fetch('/.netlify/functions/' + fn, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!r.ok) throw new Error(fn + ' ' + r.status);
    return r.json();
  }
  // after payment: ask our server to confirm the transaction with Paddle, then unlock
  async function completed(data) {
    const txn = data && (data.transaction_id || (data.transaction && data.transaction.id));
    let lic = null;
    try { const r = await post('paddle-verify', { transactionId: txn }); if (r.ok) lic = r.license; } catch (e) { /* server not available yet */ }
    if (!lic && CFG.env === 'sandbox' && txn) { // sandbox only: unlock on this device so the flow can be tested before the server is live
      lic = { grades: [pendingGrade], exp: Date.now() + 183 * 864e5, email: (data.customer && data.customer.email) || '', txn, verified: false };
    }
    if (lic) mergeLicense(lic);
    try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: 'event/purchase-g' + pendingGrade, title: 'purchase', event: true }); } catch (e) { /* ignore */ }
    if (onDone) onDone(!!lic);
  }
  async function buy(grade, opts) {
    pendingGrade = +grade || 4;
    onDone = opts && opts.onDone;
    try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: 'event/checkout/open-g' + pendingGrade, title: 'checkout open g' + pendingGrade, event: true }); } catch (e) { /* ignore */ }
    const P = await load();
    P.Checkout.open({
      items: [{ priceId: CFG.prices['g' + pendingGrade], quantity: 1 }],
      customData: { grade: String(pendingGrade), ref: (opts && opts.ref) || '' },
      settings: { displayMode: 'overlay', theme: 'light', locale: (opts && opts.lang === 'zh') ? 'zh-Hans' : 'en' }
    });
  }
  async function restore(email) {
    const r = await post('paddle-restore', { email });
    if (r.ok && r.license) { mergeLicense(r.license); return true; }
    return false;
  }
  window.DottinoPay = { CFG, active, hasAccess, readLicense, buy, restore, testMode: () => testMode };
})();
