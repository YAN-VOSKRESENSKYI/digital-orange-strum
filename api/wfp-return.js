import { parseWfpBody, validPayment, checkPayment, getWfpSecret } from '../lib/wfp.js';

const PIPEDRIVE_BASE = 'https://api.pipedrive.com/v1';
const THANK_YOU_PATH = '/t3nx-8291';
const FAILED_PATH = '/failed-payment';
const FINAL_FAILURES = new Set(['Declined', 'Expired', 'Refunded', 'Voided', 'Unpaid']);

function safeQuery(query, omit = []) {
  const params = new URLSearchParams();
  for (const [key, raw] of Object.entries(query || {})) {
    if (omit.includes(key) || raw == null) continue;
    for (const value of Array.isArray(raw) ? raw : [raw]) params.append(key, String(value));
  }
  const value = params.toString();
  return value ? `?${value}` : '';
}

function paymentQuery(query, orderReference) {
  const params = new URLSearchParams(safeQuery(query, ['transactionStatus']));
  if (orderReference) params.set('order', orderReference);
  const value = params.toString();
  return value ? `?${value}` : '';
}

async function checkDealStatus(dealId, token) {
  const response = await fetch(`${PIPEDRIVE_BASE}/deals/${dealId}?api_token=${token}`, {
    signal: AbortSignal.timeout(1500),
  });
  if (!response.ok) throw new Error(`CRM status failed: ${response.status}`);
  const result = await response.json();
  return result.success ? result.data?.status || null : null;
}

export default async function handler(req, res) {
  if (!['GET', 'POST'].includes(req.method)) return res.status(405).send('Method Not Allowed');
  res.setHeader('Cache-Control', 'no-store');
  const body = parseWfpBody(req.body);
  const dealId = typeof req.query?.dealId === 'string' && /^\d+$/.test(req.query.dealId)
    ? req.query.dealId : null;
  const orderReference = req.query?.order || body.orderReference;
  const validOrder = typeof orderReference === 'string' &&
    /^(deal-\d+-\d+|order_\d+_[a-z0-9]+)$/.test(orderReference);
  if (orderReference != null && !validOrder) {
    return res.status(400).send('Не вдалося визначити замовлення. Зверніться до підтримки, якщо оплату списано.');
  }

  const secret = getWfpSecret();
  if (validOrder) {
    try {
      const status = validPayment(body, orderReference, secret)
        ? body.transactionStatus : await checkPayment(orderReference, secret);
      if (status === 'Approved') {
        return res.redirect(303, `${THANK_YOU_PATH}${paymentQuery(req.query, orderReference)}`);
      }
      if (FINAL_FAILURES.has(status)) {
        return res.redirect(303, `${FAILED_PATH}${paymentQuery(req.query, orderReference)}`);
      }
    } catch (error) { console.warn('WayForPay verification unavailable:', error.message); }
  } else if (dealId && process.env.PIPEDRIVE_API_TOKEN) {
    try {
      if (await checkDealStatus(dealId, process.env.PIPEDRIVE_API_TOKEN) === 'won') {
        return res.redirect(302, `${THANK_YOU_PATH}${safeQuery(req.query, ['transactionStatus'])}`);
      }
    } catch (error) { console.warn('Legacy CRM verification unavailable:', error.message); }
  }

  const retryQuery = validOrder ? paymentQuery(req.query, orderReference).slice(1)
    : dealId ? safeQuery(req.query, ['transactionStatus']).slice(1) : '';
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Retry-After', '5');
  return res.status(503).send(`<!doctype html><html lang="uk"><meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1"><title>Перевірка оплати</title>
    <body><h1>Уточнюємо статус оплати</h1>
    <p>Якщо кошти списано, не сплачуйте повторно. Напишіть менеджеру, якщо статус не змінюється.</p>
    ${retryQuery ? `<a href="/api/wfp-return?${retryQuery}">Перевірити оплату</a>` : ''}
    <p><a href="https://t.me/vlob_voskresensky_bot">Написати менеджеру</a></p><a href="/">На головну</a>
    </body></html>`);
}
