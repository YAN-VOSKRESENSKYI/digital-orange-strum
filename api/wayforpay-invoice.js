import crypto from 'crypto';
import { WFP_CONFIG, getWfpSecret } from '../lib/wfp.js';

const PIPEDRIVE_BASE = 'https://api.pipedrive.com/v1';
const FIELD_PAYMENT_URL = 'bc1184cf3a3373748118a7816d595cd652be6d30'; // Платежная ссылка
const RETURN_URL_MAX = 250;
const ALLOWED_QUERY = ['dealId', 'v', 'utm_source', 'utm_medium', 'utm_campaign',
  'utm_content', 'utm_term', 'utm_placement'];

function requestHost(req) {
  return String(req.headers?.['x-forwarded-host'] || req.headers?.host || '').split(',')[0].trim();
}

function validateCallback(raw, req, pathname) {
  const url = new URL(raw);
  if (url.protocol !== 'https:' || url.host !== requestHost(req) || url.pathname !== pathname) {
    throw new Error(`Invalid callback URL: ${pathname}`);
  }
  return url;
}

function buildReturnUrl(raw, orderReference, req) {
  const source = validateCallback(raw, req, '/api/wfp-return');
  const target = new URL(`${source.origin}${source.pathname}`);
  target.searchParams.set('order', orderReference);
  for (const key of ALLOWED_QUERY) {
    const value = source.searchParams.get(key);
    if (!value) continue;
    const candidate = new URL(target);
    candidate.searchParams.set(key, value);
    if (candidate.href.length <= RETURN_URL_MAX) {
      target.searchParams.set(key, value);
      continue;
    }
    if (!key.startsWith('utm_')) continue;
    for (const char of Array.from(value)) {
      const shortened = `${target.searchParams.get(key) || ''}${char}`;
      const next = new URL(target);
      next.searchParams.set(key, shortened);
      if (next.href.length > RETURN_URL_MAX) break;
      target.searchParams.set(key, shortened);
    }
  }
  if (target.href.length > RETURN_URL_MAX) throw new Error('Return URL is too long');
  return target.href;
}

/**
 * Записує invoice URL у поле "Платежная ссылка" у Pipedrive.
 * Викликається після отримання invoiceUrl від WayForPay.
 * Помилки не пропагуються — це додатковий крок, який не має ламати оплату.
 */
async function updateDealPaymentUrl(orderReference, invoiceUrl) {
  try {
    const TOKEN = process.env.PIPEDRIVE_API_TOKEN;
    if (!TOKEN) {
      console.warn('Skipping payment URL update: PIPEDRIVE_API_TOKEN is not set');
      return;
    }

    const dealMatch = String(orderReference || '').match(/^deal-(\d+)-/);
    if (!dealMatch) {
      console.log(`Skipping payment URL update: orderReference "${orderReference}" не у форматі deal-{id}-{timestamp}`);
      return;
    }

    const dealId = dealMatch[1];
    const url = `${PIPEDRIVE_BASE}/deals/${dealId}?api_token=${TOKEN}`;
    const updateRes = await fetch(url, {
      signal: AbortSignal.timeout(2000),
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [FIELD_PAYMENT_URL]: invoiceUrl }),
    });
    if (!updateRes.ok) throw new Error(`CRM payment URL update failed: ${updateRes.status}`);
    const updateJson = await updateRes.json();

    if (updateJson.success) {
      console.log(`Updated Deal #${dealId} with invoice URL: ${invoiceUrl}`);
    } else {
      console.error(`Failed to update Deal #${dealId} with invoice URL:`, updateJson);
    }
  } catch (err) {
    console.error('Error updating deal payment URL:', err.message);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const secretKey = getWfpSecret();

    if (!secretKey) {
      console.error('WAYFORPAY_SECRET environment variable is not set');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const {
      merchantAccount,
      merchantDomainName,
      orderReference,
      orderDate,
      amount,
      currency,
      productName,
      productCount,
      productPrice,
      clientEmail,
      clientPhone: rawPhone,
      returnUrl,
      serviceUrl,
    } = req.body;

    if (merchantAccount !== WFP_CONFIG.merchant || merchantDomainName !== requestHost(req).split(':')[0] ||
        Number(amount) !== WFP_CONFIG.amount || productName !== WFP_CONFIG.product ||
        currency !== WFP_CONFIG.currency || Number(productCount) !== 1 ||
        Number(productPrice) !== WFP_CONFIG.amount ||
        !/^(deal-\d+-\d+|order_\d+_[a-z0-9]+)$/.test(String(orderReference || ''))) {
      return res.status(400).json({ message: 'Invalid payment parameters' });
    }

    let safeReturnUrl;
    let safeServiceUrl;
    try {
      safeReturnUrl = buildReturnUrl(returnUrl, orderReference, req);
      safeServiceUrl = validateCallback(serviceUrl, req, '/api/wfp-webhook').href;
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }

    // Нормалізація телефону (має бути без + та у міжнародному форматі)
    let clientPhone = String(rawPhone || '').replace(/\D/g, '');
    if (clientPhone.length === 10 && clientPhone.startsWith('0')) {
      clientPhone = '38' + clientPhone;
    } else if (clientPhone.length === 12 && clientPhone.startsWith('380')) {
      // already good
    } else if (clientPhone.length === 9) {
      clientPhone = '380' + clientPhone;
    }

    // Формуємо рядок для підпису (згідно документації CREATE_INVOICE)
    // merchantAccount;merchantDomainName;orderReference;orderDate;amount;currency;productName[];productCount[];productPrice[]
    const signatureString = [
      merchantAccount,
      merchantDomainName,
      orderReference,
      orderDate,
      amount,
      currency,
      productName,
      productCount,
      productPrice,
    ].join(';');

    const signature = crypto.createHmac('md5', secretKey).update(signatureString).digest('hex');

    const invoiceData = {
      transactionType: 'CREATE_INVOICE',
      merchantAccount,
      merchantDomainName,
      merchantSignature: signature,
      apiVersion: 1,
      orderReference,
      orderDate,
      amount,
      currency,
      productName: [productName],
      productCount: [productCount],
      productPrice: [productPrice],
      clientFirstName: 'Клієнт',
      clientLastName: ' ',
      clientEmail,
      clientPhone,
      notifyMethod: 'all',
      returnUrl: safeReturnUrl,
      serviceUrl: safeServiceUrl,
    };

    console.log('Creating WFP invoice for:', clientEmail, clientPhone);

    const wfpResponse = await fetch('https://api.wayforpay.com/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify(invoiceData),
    });

    if (!wfpResponse.ok) throw new Error(`WayForPay invoice failed: ${wfpResponse.status}`);
    const data = await wfpResponse.json();
    console.log('WFP Invoice response:', JSON.stringify(data));

    // Якщо WFP повернув invoiceUrl — записуємо його у "Платежная ссылка" в Pipedrive.
    // Робимо це до повернення відповіді лендингу, щоб людина не встигла оплатити
    // раніше, ніж посилання з'явиться в CRM.
    if (data?.invoiceUrl) {
      await updateDealPaymentUrl(orderReference, data.invoiceUrl);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Invoice creation error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
