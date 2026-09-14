// /api/create-deal.js
// Створює нову угоду в Pipedrive напряму, без pipepanel.
// Дедуплікація: якщо в межах 15 хв є відкрита угода з тим самим email + продукт + сума,
// повертаємо її dealId. Інакше — створюємо нову.

const PIPEDRIVE_BASE = 'https://api.pipedrive.com/v1';

// Воронка і початковий стейдж — взято з аналізу угод pipepanel
const PIPELINE_ID = 2;       // "Марафон"
const STAGE_ID = 8;          // "Нова марафон"
const OWNER_ID = 12715674;   // Ян (за замовчуванням)
const DEDUP_WINDOW_MIN = 15; // Дедуплікація: вікно у хвилинах

// Custom field keys в Pipedrive (з угоди-зразка #68843)
const FIELD = {
  product:      '15f60a0ce63e0a5036ec1de32dec0893cd6dc687',
  tariff:       '22031a07921bb7b95f071dec5dddc285085a74c2',
  utm_source:   'edc2b44788b4dced9fad25d8518e0a8f30a945ef',
  utm_medium:   '0b693d0640e1b9a05c30fb184e3acd4022e269f3',
  utm_campaign: '5a28b454a38c14dd17005ddb395ebc523a760cab',
  utm_content:  '4c2c6a142a9c5ef0d425c5462b8eac84d6f8a544',
  utm_term:     'c86a565b11ce5492ca4466ef024701686b2710ab',
  payment_url:  'bc1184cf3a3373748118a7816d595cd652be6d30',
  email:        'df3cd1ea999bb6345c531b76e0579baf54997902',
  phone:        'fa4e7a34894809412ff970dddc90fe9adf6d566c',
  payment_sys:  'bd698b5befe703a156d01a34f0ad8d7064343379', // 15 = WFP
};

export default async function handler(req, res) {
  console.log('--- /api/create-deal ---');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const TOKEN = process.env.PIPEDRIVE_API_TOKEN;
  if (!TOKEN) {
    console.error('CRITICAL: PIPEDRIVE_API_TOKEN не встановлено в Vercel');
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  // Парсимо тіло (Vercel зазвичай парсить JSON автоматично, але страхуємось)
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) {
      console.error('Failed to parse body as JSON:', e.message);
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
  }

  console.log('Payload received and validated');

  const {
    email,
    phone,
    deal_name,
    product,
    product_pay,
    amount,
    currency,
    redirectUrl,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
  } = body || {};

  // Мінімально потрібні поля
  if (!email || !deal_name || !amount) {
    console.error('Missing required fields:', { email, deal_name, amount });
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const productName = product || product_pay || '';
  const dealValue = parseFloat(amount) || 0;

  const signal = AbortSignal.timeout(6000);
  try {
    // ---------- 1. Дедуплікація ----------
    // Шукаємо контакт по email; якщо знайшли — перевіряємо його угоди.
    const personId = await findOrCreatePerson(TOKEN, email, phone, signal);
    console.log(`Person resolved: ${personId}`);

    const existing = await findRecentOpenDeal(TOKEN, personId, productName, dealValue, signal);
    if (existing) {
      console.log(`Дедуп: повертаємо існуючу угоду #${existing.id}`);
      return res.status(200).json({ dealId: existing.id, deduped: true });
    }

    // ---------- 2. Створюємо нову угоду ----------
    const dealPayload = {
      title: deal_name,
      value: dealValue,
      currency: currency || 'UAH',
      person_id: personId,
      pipeline_id: PIPELINE_ID,
      stage_id: STAGE_ID,
      user_id: OWNER_ID,
      status: 'open',
      [FIELD.product]:      productName,
      [FIELD.email]:        email,
      [FIELD.phone]:        phone || '',
      [FIELD.payment_url]:  redirectUrl || '',
      [FIELD.payment_sys]:  15, // WFP
      [FIELD.utm_source]:   utm_source || '',
      [FIELD.utm_medium]:   utm_medium || '',
      [FIELD.utm_campaign]: utm_campaign || '',
      [FIELD.utm_content]:  utm_content || '',
      [FIELD.utm_term]:     utm_term || '',
    };

    const createRes = await fetch(`${PIPEDRIVE_BASE}/deals?api_token=${TOKEN}`, {
      signal,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dealPayload),
    });
    if (!createRes.ok) throw new Error(`CRM deal create failed: ${createRes.status}`);
    const createJson = await createRes.json();

    if (!createJson.success) {
      console.error('Failed to create deal:', createJson);
      return res.status(503).json({ error: 'CRM unavailable' });
    }

    const dealId = createJson.data.id;
    console.log(`Створено нову угоду #${dealId}`);

    // ---------- 3. Додаємо нотатку "Контакт залишив заявку" ----------
    // Не критично, тому помилку логуємо, але не падаємо
    try {
      await fetch(`${PIPEDRIVE_BASE}/notes?api_token=${TOKEN}`, {
        signal,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deal_id: dealId,
          content: 'Контакт залишив заявку',
        }),
      });
    } catch (noteErr) {
      console.error('Failed to add note (non-fatal):', noteErr.message);
    }

    return res.status(200).json({ dealId, deduped: false });
  } catch (err) {
    console.error('FATAL in /api/create-deal:', err);
    const timedOut = err?.name === 'TimeoutError' || err?.name === 'AbortError';
    return res.status(503).json({ error: timedOut ? 'CRM timeout' : 'CRM unavailable' });
  }
}

// --- helpers ---

async function findOrCreatePerson(token, email, phone, signal) {
  // 1. Шукаємо контакт по email
  const searchUrl = `${PIPEDRIVE_BASE}/persons/search?term=${encodeURIComponent(email)}&fields=email&exact_match=true&api_token=${token}`;
  const searchRes = await fetch(searchUrl, { signal });
  if (!searchRes.ok) throw new Error(`CRM person search failed: ${searchRes.status}`);
  const searchJson = await searchRes.json();

  if (searchJson.success && searchJson.data?.items?.length > 0) {
    const foundPerson = searchJson.data.items[0].item;
    const personId = foundPerson.id;
    const currentName = (foundPerson.name || '').trim();

    // Якщо ім'я — placeholder "Новий контакт" або порожнє,
    // оновлюємо на email, щоб у списку угод було видно кого це.
    if (!currentName || currentName === 'Новий контакт') {
      try {
        await fetch(`${PIPEDRIVE_BASE}/persons/${personId}?api_token=${token}`, {
          signal,
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: email }),
        });
        console.log(`Updated person #${personId} name from "${currentName}" to "${email}"`);
      } catch (err) {
        // Помилка оновлення імені не критична, продовжуємо
        console.error('Failed to update person name (non-fatal):', err.message);
      }
    }

    return personId;
  }

  // 2. Не знайшли — створюємо
  const createPayload = {
    name: email, // pipepanel ставить "Новий контакт" — ми ставимо email, інформативніше
    email: [{ value: email, primary: true, label: 'work' }],
    owner_id: OWNER_ID,
  };
  if (phone) {
    createPayload.phone = [{ value: phone, primary: true, label: '' }];
  }

  const createRes = await fetch(`${PIPEDRIVE_BASE}/persons?api_token=${token}`, {
    signal,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(createPayload),
  });
  if (!createRes.ok) throw new Error(`CRM person create failed: ${createRes.status}`);
  const createJson = await createRes.json();

  if (!createJson.success) {
    throw new Error(`Failed to create person: ${JSON.stringify(createJson)}`);
  }

  return createJson.data.id;
}

async function findRecentOpenDeal(token, personId, productName, value, signal) {
  const dealsUrl = `${PIPEDRIVE_BASE}/persons/${personId}/deals?status=open&api_token=${token}`;
  const res = await fetch(dealsUrl, { signal });
  if (!res.ok) throw new Error(`CRM deal search failed: ${res.status}`);
  const json = await res.json();

  if (!json.success || !json.data || json.data.length === 0) {
    return null;
  }

  const cutoff = Date.now() - DEDUP_WINDOW_MIN * 60 * 1000;

  for (const deal of json.data) {
    // Парсимо add_time — Pipedrive повертає у форматі "2026-05-08 07:38:41" (UTC)
    const addTime = new Date((deal.add_time || '').replace(' ', 'T') + 'Z').getTime();
    if (isNaN(addTime) || addTime < cutoff) continue;

    const dealProduct = deal[FIELD.product] || '';
    const dealValue = parseFloat(deal.value) || 0;

    if (dealProduct === productName && dealValue === value) {
      return deal;
    }
  }

  return null;
}
