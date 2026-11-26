// shared helpers for the Paddle functions (env: PADDLE_API_KEY, PADDLE_ENV=sandbox|live|production, UNLOCK_SECRET, PRICE_G3/G4/G5)
const crypto = require('crypto');
const LIVE = () => ['live', 'production'].includes((process.env.PADDLE_ENV || '').trim().toLowerCase());
const API = () => (LIVE() ? 'https://api.paddle.com' : 'https://sandbox-api.paddle.com');
const PRICE_GRADE = () => ({
  [process.env.PRICE_G3 || 'pri_01m8bg0tj57y48h8kyngp5wdvg']: 3,
  [process.env.PRICE_G4 || (LIVE() ? 'pri_01m65ffd1mtr2r0fgsz558c3f5' : 'pri_01m5y173swe9wpr5538rp338ee')]: 4,
  [process.env.PRICE_G5 || 'pri_01m8bfzmqphjj50jy12eykbgkx']: 5
});
const PROD_GRADE = {
  pro_01m8bfv4np85bspsgkjb4jfxvk: 3,
  pro_01m65fe6fwa0yxvcv4ym9qq5wv: 4,
  pro_01m8bfvp20s6fvn98sd6gy1g75: 5
};
async function paddle(path) {
  const r = await fetch(API() + path, { headers: { Authorization: 'Bearer ' + process.env.PADDLE_API_KEY } });
  if (!process.env.PADDLE_API_KEY) throw new Error('no api key set');
  if (!r.ok) throw new Error('paddle ' + r.status + ' ' + (process.env.PADDLE_ENV || 'sandbox'));
  return r.json();
}
const DAYS_ACCESS = 183; // 6 months
// turn paid transactions into a license: per-grade expiry dates (6 months from each grade's own purchase)
function licenseFrom(txns, email) {
  const expByGrade = {}; const map = PRICE_GRADE(); const now = Date.now();
  txns.forEach(t => {
    if (['completed', 'paid'].indexOf(t.status) < 0) return;
    const when = Date.parse(t.billed_at || t.created_at) || now;
    (t.items || []).forEach(it => {
      const g = map[it.price && it.price.id] || PROD_GRADE[it.price && it.price.product_id];
      if (g) {
        const until = when + DAYS_ACCESS * 864e5;
        if (until > now) expByGrade[g] = Math.max(expByGrade[g] || 0, until);
      }
    });
  });
  const grades = Object.keys(expByGrade).map(Number).sort((a, b) => a - b);
  if (!grades.length) return null;
  const exp = Math.max(...Object.values(expByGrade));
  const lic = { grades, exp, expByGrade, email: email || '', verified: true };
  lic.sig = crypto.createHmac('sha256', process.env.UNLOCK_SECRET || 'dev').update(JSON.stringify([lic.grades, lic.exp, lic.expByGrade, lic.email])).digest('hex').slice(0, 32);
  return lic;
}
const json = (code, body) => ({ statusCode: code, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: JSON.stringify(body) });
module.exports = { paddle, licenseFrom, json };
