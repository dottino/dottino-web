// Dottino payments (Paddle Billing). Shared by aural.html (and later index.html).
// SELLING = false: the public site shows no buy button and nothing is locked.
// Add ?paytest=1 to a page to try the whole flow in Paddle's sandbox (test cards, no real money).
(function () {
  const CFG = {
    SELLING: false,
    env: 'sandbox',
    token: 'test_71993bc3ba8caec8a5d63f51608',       // client-side token (public by design)
    prices: { g4: 'pri_01m5y173swe9wpr5538rp338ee' }   // Grade 4 Aural Pack, £15 one-time
  };
  const LKEY = 'dottino:license';
  let testMode = false;
  try { const sp = new URLSearchParams(location.search); if (sp.get('paytest') === '1') sessionStorage.setItem('dottino:paytest', '1'); testMode = sessionStorage.getItem('dottino:paytest') === '1'; } catch (e) { /* ignore */ }
  const active = () => CFG.SELLING || testMode;

  function readLicense() { try { const l = JSON.parse(localStorage.getItem(LKEY) || 'null'); return l && l.exp > Date.now() ? l : null; } catch (e) { return null; } }
  function saveLicense(l) { try { localStorage.setItem(LKEY, JSON.stringify(l)); } catch (e) { /* private window */ } }
  function hasAccess(grade) { const l = readLicense(); return !!(l && (l.grades || []).indexOf(grade) >= 0); }

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
      lic = { grades: [4], exp: Date.now() + 183 * 864e5, email: (data.customer && data.customer.email) || '', txn, verified: false };
    }
    if (lic) saveLicense(lic);
    try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: 'event/purchase-g4', title: 'purchase', event: true }); } catch (e) { /* ignore */ }
    if (onDone) onDone(!!lic);
  }
  async function buy(grade, opts) {
    onDone = opts && opts.onDone;
    const P = await load();
    P.Checkout.open({
      items: [{ priceId: CFG.prices['g' + grade], quantity: 1 }],
      customData: { grade: String(grade), ref: (opts && opts.ref) || '' },
      settings: { displayMode: 'overlay', theme: 'light', locale: (opts && opts.lang === 'zh') ? 'zh-Hans' : 'en' }
    });
  }
  async function restore(email) {
    const r = await post('paddle-restore', { email });
    if (r.ok && r.license) { saveLicense(r.license); return true; }
    return false;
  }
  window.DottinoPay = { CFG, active, hasAccess, readLicense, buy, restore, testMode: () => testMode };
})();
