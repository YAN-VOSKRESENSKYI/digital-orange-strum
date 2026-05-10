// api/wfp-webhook.js
import crypto from 'crypto';

// Custom field keys в Pipedrive
const FIELD_PAYMENT_DATE = '1941e16f9de4f10de63ff13881129bd61906c132'; // Дата оплати
const FIELD_PAYMENT_TIME = 'af1206e5f28d114f74098240bf4381f4b7ca7fec'; // Время оплаты

const TIMEZONE = 'Europe/Kyiv';
const MIDNIGHT_WINDOW_MINUTES = 15;

function signWfpResponse(orderReference, status, time, secretKey) {
  const stringToSign = [orderReference, status, time].join(';');
  return crypto.createHmac('md5', secretKey).update(stringToSign).digest('hex');
}

function wfpAccept(orderReference, secretKey) {
  const time = Math.floor(Date.now() / 1000);
  const status = 'accept';
  const signature = secretKey
    ? signWfpResponse(orderReference, status, time, secretKey)
    : undefined;

  return {
    orderReference: orderReference || 'ref',
    status,
    time,
    ...(signature ? { signature } : {}),
  };
}

/**
 * Обчислює правильні значення "Дата оплати" і "Время оплаты" з логікою півночі.
 * Якщо різниця між створенням угоди і моментом оплати <= 15 хв АЛЕ перетинає опівніч —
 * дату беремо з заявки (день створення угоди), час — реальний.
 * Інакше — і дата, і час реальні.
 */
function computePaymentDateTime(dealAddTimeStr) {
  const nowUtc = new Date();
  const dealCreatedUtc = new Date(String(dealAddTimeStr).replace(' ', 'T') + 'Z');

  const minutesDiff = (nowUtc.getTime() - dealCreatedUtc.getTime()) / 60000;

  // Дати в київському часовому поясі (формат YYYY-MM-DD)
  const dateOpts = { timeZone: TIMEZONE, year: 'numeric', month: '2-digit', day: '2-digit' };
  const dealKyivDate = dealCreatedUtc.toLocaleDateString('en-CA', dateOpts);
  const nowKyivDate = nowUtc.toLocaleDateString('en-CA', dateOpts);

  // Час оплати в київському часі (формат HH:MM:SS)
  const nowKyivTime = nowUtc.toLocaleTimeString('uk-UA', {
    timeZone: TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  // Опівнічна корекція: якщо в межах вікна і різні дні — беремо дату угоди
  const crossedMidnightInWindow =
    minutesDiff >= 0 &&
    minutesDiff <= MIDNIGHT_WINDOW_MINUTES &&
    dealKyivDate !== nowKyivDate;

  const paymentDate = crossedMidnightInWindow ? dealKyivDate : nowKyivDate;

  console.log(
    `Payment time calc: dealCreated=${dealAddTimeStr}, minutesDiff=${minutesDiff.toFixed(2)}, ` +
    `dealKyivDate=${dealKyivDate}, nowKyivDate=${nowKyivDate}, ` +
    `crossedMidnight=${crossedMidnightInWindow}, paymentDate=${paymentDate}, paymentTime=${nowKyivTime}`
  );

  return { paymentDate, paymentTime: nowKyivTime };
}

export default async function handler(req, res) {
  console.log('--- WFP Webhook Received ---');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const WFP_SECRET_KEY = process.env.WFP_MERCHANT_SECRET_KEY;

  try {
    let wfpData = req.body;

    if (
      wfpData &&
      typeof wfpData === 'object' &&
      Object.keys(wfpData).length === 1 &&
      Object.keys(wfpData)[0].startsWith('{')
    ) {
      try {
        console.log('Detected JSON-in-key format. Parsing...');
        wfpData = JSON.parse(Object.keys(wfpData)[0]);
      } catch (e) {
        console.log('Failed to parse JSON key:', e.message);
      }
    } else if (typeof wfpData === 'string') {
      try {
        wfpData = JSON.parse(wfpData);
      } catch (e) {
        console.log('Body is raw string, but not valid JSON');
      }
    }

    console.log('Final Parsed WFP Body:', JSON.stringify(wfpData, null, 2));

    if (wfpData.transactionStatus !== 'Approved') {
      console.log('Payment NOT Approved. Status:', wfpData.transactionStatus);
      return res.status(200).json({ status: 'Ignored', reason: 'Not Approved' });
    }

    const PIPEDRIVE_API_TOKEN = process.env.PIPEDRIVE_API_TOKEN;
    if (!PIPEDRIVE_API_TOKEN) {
      console.error('CRITICAL ERROR: Missing PIPEDRIVE_API_TOKEN in Vercel settings');
      return res.status(500).json({ error: 'Server misconfiguration' });
    }

    const orderReference = wfpData.orderReference || '';
    const dealMatch = orderReference.match(/^deal-(\d+)-/);

    if (!dealMatch) {
      console.log(`orderReference "${orderReference}" не у форматі deal-{id}-{timestamp}. Fallback на пошук по людині.`);
      return await fallbackByPerson(wfpData, PIPEDRIVE_API_TOKEN, res, WFP_SECRET_KEY);
    }

    const dealId = dealMatch[1];
    console.log(`Extracted dealId from orderReference: ${dealId}`);

    const checkUrl = `https://api.pipedrive.com/v1/deals/${dealId}?api_token=${PIPEDRIVE_API_TOKEN}`;
    const checkResponse = await fetch(checkUrl);
    const checkResult = await checkResponse.json();

    if (!checkResult.success) {
      console.log(`Deal #${dealId} not found in Pipedrive. Skipping.`);
      return res.status(200).json({ status: 'Ignored', reason: 'Deal not found' });
    }

    if (checkResult.data?.status === 'won') {
      console.log(`Deal #${dealId} already won. Skipping duplicate webhook.`);
      return res.status(200).json({ status: 'Ignored', reason: 'Already won' });
    }

    // Обчислюємо дату/час оплати з логікою півночі
    const { paymentDate, paymentTime } = computePaymentDateTime(checkResult.data.add_time);

    console.log(`Updating Deal #${dealId} to 'won'...`);
    const updateUrl = `https://api.pipedrive.com/v1/deals/${dealId}?api_token=${PIPEDRIVE_API_TOKEN}`;
    const updatePayload = {
      status: 'won',
      stage_id: 12,
      value: wfpData.amount,
      [FIELD_PAYMENT_DATE]: paymentDate,
      [FIELD_PAYMENT_TIME]: paymentTime,
    };

    const updateResponse = await fetch(updateUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload),
    });
    const updateResult = await updateResponse.json();

    if (!updateResult.success) {
      console.error('Failed to update deal in Pipedrive:', updateResult);
    } else {
      console.log(`SUCCESS: Deal #${dealId} updated to 'won' status!`);
    }

    return res.status(200).json(wfpAccept(orderReference, WFP_SECRET_KEY));
  } catch (error) {
    console.error('FATAL Webhook error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function fallbackByPerson(wfpData, PIPEDRIVE_API_TOKEN, res, WFP_SECRET_KEY) {
  const customerEmail = wfpData.email || wfpData.clientEmail;
  const customerPhone = wfpData.phone || wfpData.clientPhone;

  if (!customerEmail && !customerPhone) {
    console.log('Fallback: no email or phone');
    return res.status(200).json({ status: 'Ignored', reason: 'No email or phone' });
  }

  const searchTerm = customerEmail || customerPhone;
  const searchUrl = `https://api.pipedrive.com/v1/persons/search?term=${encodeURIComponent(searchTerm)}&api_token=${PIPEDRIVE_API_TOKEN}`;
  const searchResponse = await fetch(searchUrl);
  const searchResult = await searchResponse.json();

  if (!searchResult.success || !searchResult.data.items || searchResult.data.items.length === 0) {
    console.log('Fallback: person not found:', searchTerm);
    return res.status(200).json({ status: 'Ignored', reason: 'Person not found' });
  }

  const personId = searchResult.data.items[0].item.id;
  const dealsUrl = `https://api.pipedrive.com/v1/persons/${personId}/deals?status=open&api_token=${PIPEDRIVE_API_TOKEN}`;
  const dealsResponse = await fetch(dealsUrl);
  const dealsResult = await dealsResponse.json();

  if (!dealsResult.success || !dealsResult.data || dealsResult.data.length === 0) {
    console.log(`Fallback: no open deals for person ${personId}`);
    return res.status(200).json({ status: 'Ignored', reason: 'No open deals' });
  }

  const dealId = dealsResult.data[0].id;

  const checkUrl = `https://api.pipedrive.com/v1/deals/${dealId}?api_token=${PIPEDRIVE_API_TOKEN}`;
  const checkResponse = await fetch(checkUrl);
  const checkResult = await checkResponse.json();

  if (checkResult.success && checkResult.data?.status === 'won') {
    console.log(`Fallback: Deal #${dealId} already won. Skipping duplicate webhook.`);
    return res.status(200).json({ status: 'Ignored', reason: 'Already won' });
  }

  // Обчислюємо дату/час оплати з логікою півночі (так само як у головній гілці)
  const { paymentDate, paymentTime } = computePaymentDateTime(checkResult.data.add_time);

  console.log(`Fallback: updating Deal #${dealId} to 'won'...`);

  const updateUrl = `https://api.pipedrive.com/v1/deals/${dealId}?api_token=${PIPEDRIVE_API_TOKEN}`;
  const updateResponse = await fetch(updateUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: 'won',
      stage_id: 12,
      value: wfpData.amount,
      [FIELD_PAYMENT_DATE]: paymentDate,
      [FIELD_PAYMENT_TIME]: paymentTime,
    }),
  });
  const updateResult = await updateResponse.json();

  if (updateResult.success) {
    console.log(`Fallback SUCCESS: Deal #${dealId} updated to 'won'`);
  }

  return res.status(200).json(wfpAccept(wfpData.orderReference, WFP_SECRET_KEY));
}
