// api/wfp-return.js
// Редірект після оплати: подяка / fail.
// Логіка: перевіряємо стан угоди в Pipedrive по dealId з URL.
// won → подяка. Все інше → fail.
// Якщо dealId немає в URL — fallback: тільки явний Approved → подяка.

const PIPEDRIVE_BASE = 'https://api.pipedrive.com/v1';
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1000;

const THANK_YOU_PATH = '/t3nx-8291';
const FAILED_PATH = '/failed-payment';

function queryToSearchString(query) {
  if (!query || typeof query !== 'object') return '';
  const params = new URLSearchParams();
  for (const [key, raw] of Object.entries(query)) {
    if (raw === undefined || raw === null) continue;
    const values = Array.isArray(raw) ? raw : [raw];
    for (const v of values) {
      if (v === undefined || v === null) continue;
      params.append(key, String(v));
    }
  }
  const s = params.toString();
  return s ? `?${s}` : '';
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkDealStatus(dealId, token) {
  const url = `${PIPEDRIVE_BASE}/deals/${dealId}?api_token=${token}`;
  const res = await fetch(url);
  const json = await res.json();
  if (!json.success) return null;
  return json.data?.status || null;
}

export default async function handler(req, res) {
  const queryStr = queryToSearchString(req.query);

  console.log('--- WFP Return ---');
  console.log('Method:', req.method);
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Body:', JSON.stringify(req.body));
  console.log('Query:', JSON.stringify(req.query));

  const dealId = req.query?.dealId;
  const status = req.body?.transactionStatus || req.query?.transactionStatus;
  console.log('Extracted dealId:', dealId);
  console.log('Extracted status:', status);

  // Якщо dealId є — перевіряємо CRM
  if (dealId) {
    const TOKEN = process.env.PIPEDRIVE_API_TOKEN;
    if (!TOKEN) {
      console.error('CRITICAL: PIPEDRIVE_API_TOKEN не встановлено');
      // Fallback на статус від WFP
      if (status === 'Approved') {
        return res.redirect(302, `${THANK_YOU_PATH}${queryStr}`);
      }
      return res.redirect(302, `${FAILED_PATH}${queryStr}`);
    }

    // 3 спроби з паузами — ловимо race condition з webhook
    for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt++) {
      const dealStatus = await checkDealStatus(dealId, TOKEN);
      console.log(`Attempt ${attempt}/${RETRY_ATTEMPTS}: deal #${dealId} status = ${dealStatus}`);

      if (dealStatus === 'won') {
        return res.redirect(302, `${THANK_YOU_PATH}${queryStr}`);
      }

      // Останньої спроби чекати немає сенсу
      if (attempt < RETRY_ATTEMPTS) {
        await sleep(RETRY_DELAY_MS);
      }
    }

    console.log(`Deal #${dealId} not won after ${RETRY_ATTEMPTS} attempts → fail page`);
    return res.redirect(302, `${FAILED_PATH}${queryStr}`);
  }

  // dealId не прийшов в URL → fallback на статус від WayForPay
  console.log('No dealId in URL, falling back to transactionStatus check');
  if (status === 'Approved') {
    return res.redirect(302, `${THANK_YOU_PATH}${queryStr}`);
  }

  return res.redirect(302, `${FAILED_PATH}${queryStr}`);
}
