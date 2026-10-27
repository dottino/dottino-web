// POST { email } → finds this customer's paid Grade Pack transactions at Paddle → license (to unlock on a new device)
// note: email-only restore is simple but anyone who knows a buyer's email could use it; a magic-link email can replace it later
const { paddle, licenseFrom, json } = require('./_lib');
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { ok: false });
  try {
    const { email } = JSON.parse(event.body || '{}');
    const e = String(email || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return json(400, { ok: false, error: 'bad email' });
    const cs = (await paddle('/customers?email=' + encodeURIComponent(e))).data || [];
    let txns = [];
    for (const c of cs.slice(0, 3)) txns = txns.concat((await paddle('/transactions?customer_id=' + c.id + '&status=completed,paid&per_page=50')).data || []);
    const license = licenseFrom(txns, e);
    return json(200, license ? { ok: true, license } : { ok: false, error: 'none' });
  } catch (err) { return json(500, { ok: false, error: 'server', detail: String(err && err.message || err).slice(0, 80) }); }
};
