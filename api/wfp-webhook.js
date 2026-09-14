import { getWfpSecret, parseWfpBody, signedAccept, validPayment } from '../lib/wfp.js';

const FIELD_PAYMENT_DATE = '1941e16f9de4f10de63ff13881129bd61906c132';
const FIELD_PAYMENT_TIME = 'af1206e5f28d114f74098240bf4381f4b7ca7fec';
const TIMEZONE = 'Europe/Kyiv';
const MIDNIGHT_WINDOW_MINUTES = 15;

function computePaymentDateTime(dealAddTimeStr) {
  const nowUtc = new Date();
  const dealCreatedUtc = new Date(String(dealAddTimeStr).replace(' ', 'T') + 'Z');
  const minutesDiff = (nowUtc.getTime() - dealCreatedUtc.getTime()) / 60000;
  const dateOpts = { timeZone: TIMEZONE, year: 'numeric', month: '2-digit', day: '2-digit' };
  const dealKyivDate = dealCreatedUtc.toLocaleDateString('en-CA', dateOpts);
  const nowKyivDate = nowUtc.toLocaleDateString('en-CA', dateOpts);
  const paymentTime = nowUtc.toLocaleTimeString('uk-UA', {
    timeZone: TIMEZONE, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  });
  const crossedMidnight = minutesDiff >= 0 && minutesDiff <= MIDNIGHT_WINDOW_MINUTES &&
    dealKyivDate !== nowKyivDate;
  return { paymentDate: crossedMidnight ? dealKyivDate : nowKyivDate, paymentTime };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const secret = getWfpSecret();
  const data = parseWfpBody(req.body);
  const orderReference = data.orderReference || '';

  if (!/^(deal-\d+-\d+|order_\d+_[a-z0-9]+)$/.test(orderReference) ||
      !validPayment(data, orderReference, secret)) {
    return res.status(400).json({ error: 'Invalid payment signature or product' });
  }
if (data.transactionStatus !== 'Approved') {
    return res.status(200).json(signedAccept(orderReference, secret));
  }
  if (orderReference.startsWith('order_')) {
    console.error('PAYMENT_RECONCILIATION_REQUIRED', { orderReference, reason: 'crm_deal_missing' });
    return res.status(200).json(signedAccept(orderReference, secret));
  }

  const token = process.env.PIPEDRIVE_API_TOKEN;
  if (!token) return res.status(500).json({ error: 'Server misconfiguration' });
  const dealId = orderReference.match(/^deal-(\d+)-/)[1];
  const signal = AbortSignal.timeout(8000);
  try {
    const checkResponse = await fetch(`https://api.pipedrive.com/v1/deals/${dealId}?api_token=${token}`, { signal });
    if ([404, 410].includes(checkResponse.status)) {
      console.error(`Permanent CRM reconciliation failure for deal #${dealId}: ${checkResponse.status}`);
      return res.status(200).json(signedAccept(orderReference, secret));
    }
    if (!checkResponse.ok) throw new Error(`CRM deal check failed: ${checkResponse.status}`);
    const checkResult = await checkResponse.json();
    if (!checkResult.success) return res.status(503).json({ error: 'Deal not found' });
    if (checkResult.data?.status === 'won') {
      return res.status(200).json(signedAccept(orderReference, secret));
    }

    const { paymentDate, paymentTime } = computePaymentDateTime(checkResult.data.add_time);
    const updateResponse = await fetch(`https://api.pipedrive.com/v1/deals/${dealId}?api_token=${token}`, {
      signal, method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'won', stage_id: 12, value: data.amount,
        [FIELD_PAYMENT_DATE]: paymentDate, [FIELD_PAYMENT_TIME]: paymentTime }),
    });
    if (!updateResponse.ok) throw new Error(`CRM deal update failed: ${updateResponse.status}`);
    const updateResult = await updateResponse.json();
    if (!updateResult.success) return res.status(503).json({ error: 'CRM update failed' });
    return res.status(200).json(signedAccept(orderReference, secret));
  } catch (error) {
    console.error('Webhook CRM error:', error.message);
    return res.status(503).json({ error: 'CRM unavailable' });
  }
}
