import crypto from 'node:crypto';

export const WFP_CONFIG = Object.freeze({
  merchant: 'online_ed_fun',
  amount: 390,
  currency: 'UAH',
  product: '5-ТИ ДЕННИЙ МАРАФОН "В ЛОБ"',
});

export function getWfpSecret() {
  return process.env.WAYFORPAY_SECRET || process.env.WFP_MERCHANT_SECRET_KEY;
}

export function parseWfpBody(body) {
  try {
    if (typeof body === 'string') {
      try { body = JSON.parse(body); }
      catch { body = Object.fromEntries(new URLSearchParams(body)); }
    }
    if (body && Object.keys(body).length === 1 && Object.keys(body)[0].startsWith('{')) {
      body = JSON.parse(Object.keys(body)[0]);
    }
    return body && typeof body === 'object' && !Array.isArray(body) ? body : {};
  } catch { return {}; }
}

export function validPayment(data, orderReference, secret) {
  if (!secret || !data || data.merchantAccount !== WFP_CONFIG.merchant ||
      data.orderReference !== orderReference || Number(data.amount) !== WFP_CONFIG.amount ||
      data.currency !== WFP_CONFIG.currency || typeof data.merchantSignature !== 'string' ||
      !/^[a-f0-9]{32}$/i.test(data.merchantSignature)) return false;
  const signed = ['merchantAccount', 'orderReference', 'amount', 'currency',
    'authCode', 'cardPan', 'transactionStatus', 'reasonCode']
    .map(key => data[key] ?? '').join(';');
  const expected = crypto.createHmac('md5', secret).update(signed).digest();
  return crypto.timingSafeEqual(expected, Buffer.from(data.merchantSignature, 'hex'));
}

export async function checkPayment(orderReference, secret) {
  if (!secret) throw new Error('Missing WayForPay secret');
  const merchantSignature = crypto.createHmac('md5', secret)
    .update(`${WFP_CONFIG.merchant};${orderReference}`).digest('hex');
  const response = await fetch('https://api.wayforpay.com/api', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(5000),
    body: JSON.stringify({ transactionType: 'CHECK_STATUS', apiVersion: 1,
      merchantAccount: WFP_CONFIG.merchant, orderReference, merchantSignature }),
  });
  if (!response.ok) throw new Error('WayForPay status request failed');
  const data = await response.json();
  if ([1127, 1151].includes(Number(data?.reasonCode)) && !data?.transactionStatus) return 'Unpaid';
  if (!validPayment(data, orderReference, secret)) throw new Error('Invalid WayForPay status response');
  return data.transactionStatus;
}

export function signedAccept(orderReference, secret) {
  const time = Math.floor(Date.now() / 1000);
  const status = 'accept';
  const signature = crypto.createHmac('md5', secret)
    .update(`${orderReference};${status};${time}`).digest('hex');
  return { orderReference, status, time, signature };
}
