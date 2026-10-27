// POST { transactionId } → checks the transaction with Paddle (server side, with the secret API key) → license
const { paddle, licenseFrom, json } = require('./_lib');
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { ok: false });
  try {
    const { transactionId } = JSON.parse(event.body || '{}');
    if (!/^txn_[a-z0-9]{10,40}$/i.test(transactionId || '')) return json(400, { ok: false, error: 'bad id' });
    const t = (await paddle('/transactions/' + transactionId)).data;
    let email = '';
    try { if (t.customer_id) email = (await paddle('/customers/' + t.customer_id)).data.email || ''; } catch (e) { /* ignore */ }
    const license = licenseFrom([t], email);
    return json(200, license ? { ok: true, license } : { ok: false, error: 'not paid' });
  } catch (e) { return json(500, { ok: false, error: 'server', detail: String(e && e.message || e).slice(0, 80) }); }
};
