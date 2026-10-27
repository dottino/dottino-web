// shared helpers for the Paddle functions (env: PADDLE_API_KEY, PADDLE_ENV=sandbox|live, UNLOCK_SECRET, PRICE_G4)
const crypto = require('crypto');
const API = () => (process.env.PADDLE_ENV === 'live' ? 'https://api.paddle.com' : 'https://sandbox-api.paddle.com');
const PRICE_GRADE = () => ({ [process.env.PRICE_G4 || 'pri_01m5y173swe9wpr5538rp338ee']: 4 });
async function paddle(path) {
  const r = await fetch(API() + path, { headers: { Authorization: 'Bearer ' + process.env.PADDLE_API_KEY } });
  if (!r.ok) throw new Error('paddle ' + r.status);
  return r.json();
}
const DAYS_ACCESS = 183; // 6 months
// turn paid transactions into a license: which grades, until when
function licenseFrom(txns, email) {
  const grades = new Set(); let exp = 0; const map = PRICE_GRADE();
  txns.forEach(t => {
    if (['completed', 'paid'].indexOf(t.status) < 0) return;
    const when = Date.parse(t.billed_at || t.created_at) || Date.now();
    (t.items || []).forEach(it => { const g = map[it.price && it.price.id]; if (g) { grades.add(g); exp = Math.max(exp, when + DAYS_ACCESS * 864e5); } });
  });
  if (!grades.size || exp < Date.now()) return null;
  const lic = { grades: [...grades], exp, email: email || '', verified: true };
  lic.sig = crypto.createHmac('sha256', process.env.UNLOCK_SECRET || 'dev').update(JSON.stringify([lic.grades, lic.exp, lic.email])).digest('hex').slice(0, 32);
  return lic;
}
const json = (code, body) => ({ statusCode: code, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: JSON.stringify(body) });
module.exports = { paddle, licenseFrom, json };
