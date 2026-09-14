import test, { afterEach, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import createDealHandler from '../api/create-deal.js';
import invoiceHandler from '../api/wayforpay-invoice.js';
import returnHandler from '../api/wfp-return.js';
import webhookHandler from '../api/wfp-webhook.js';
import { WFP_CONFIG, parseWfpBody, signedAccept, validPayment } from '../lib/wfp.js';

const secret = 'test-secret';
const order = 'order_123456789_abcde';
const dealOrder = 'deal-42-123456789';
const originalFetch = globalThis.fetch;
const originalEnv = { ...process.env };

function response() {
  return { statusCode: 200, headers: {}, body: undefined, redirectArgs: undefined,
    status(code) { this.statusCode = code; return this; },
    json(value) { this.body = value; return this; },
    send(value) { this.body = value; return this; },
    setHeader(key, value) { this.headers[key] = value; },
    redirect(code, value) { this.statusCode = code; this.redirectArgs = [code, value]; return this; } };
}

function payment(orderReference = order, overrides = {}) {
  const data = { merchantAccount: WFP_CONFIG.merchant, orderReference,
    amount: String(WFP_CONFIG.amount), currency: WFP_CONFIG.currency, authCode: '12345',
    cardPan: '42****4242', transactionStatus: 'Approved', reasonCode: 1100, ...overrides };
  data.merchantSignature = crypto.createHmac('md5', secret).update([
    data.merchantAccount, data.orderReference, data.amount, data.currency, data.authCode,
    data.cardPan, data.transactionStatus, data.reasonCode,
  ].join(';')).digest('hex');
  return data;
}

function invoiceBody(overrides = {}) {
  return { merchantAccount: WFP_CONFIG.merchant, merchantDomainName: 'shop.example',
    orderReference: order, orderDate: 123456789, amount: String(WFP_CONFIG.amount),
    currency: WFP_CONFIG.currency, productName: WFP_CONFIG.product, productCount: '1',
    productPrice: String(WFP_CONFIG.amount), clientEmail: 'buyer@example.com',
    clientPhone: '0501234567', returnUrl: 'https://shop.example/api/wfp-return?v=2&utm_source=ad',
    serviceUrl: 'https://shop.example/api/wfp-webhook', ...overrides };
}

function request(body, method = 'POST') {
  return { method, headers: { host: 'shop.example' }, body };
}

async function returned(query = { order }, body, method = 'GET') {
  const res = response();
  await returnHandler({ method, headers: {}, query, body }, res);
  return res;
}

function mockStatus(data) {
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://api.wayforpay.com/api');
    assert.ok(options.signal);
    const sent = JSON.parse(options.body);
    assert.equal(sent.transactionType, 'CHECK_STATUS');
    assert.equal(sent.orderReference, order);
    return { ok: true, json: async () => data };
  };
}

beforeEach(() => {
  process.env.WAYFORPAY_SECRET = secret;
  process.env.WFP_MERCHANT_SECRET_KEY = secret;
  process.env.PIPEDRIVE_API_TOKEN = 'crm-token';
  globalThis.fetch = async () => { throw new Error('Unexpected network request'); };
});
afterEach(() => { globalThis.fetch = originalFetch; process.env = { ...originalEnv }; });

function frontendFiles() {
  const files = [];
  if (existsSync('index.html')) files.push('index.html');
  function walk(dir) {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const target = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(target);
      else if (/\.(?:js|jsx|ts|tsx|html)$/.test(entry.name)) files.push(target);
    }
  }
  walk('src');
  return files;
}

function frontendConstant(name) {
  const expression = new RegExp(`\\b${name}\\s*(?::[^=;]+)?=\\s*(["'])(.*)\\1`);
  for (const file of frontendFiles()) {
    for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
      const match = line.match(expression);
      if (match) return match[2].replace(/\\(["'])/g, '$1');
    }
  }
  return null;
}

test('server payment config matches the landing constants', () => {
  assert.equal(frontendConstant('WFP_MERCHANT'), WFP_CONFIG.merchant);
  assert.equal(Number(frontendConstant('WFP_AMOUNT')), WFP_CONFIG.amount);
  assert.equal(frontendConstant('WFP_CURRENCY'), WFP_CONFIG.currency);
  assert.equal(frontendConstant('WFP_PRODUCT'), WFP_CONFIG.product);
});

test('unused signature endpoint is absent and tests are deployment-ignored', () => {
  assert.equal(existsSync('api/wayforpay-signature.js'), false);
  assert.match(readFileSync('.vercelignore', 'utf8'), /(^|\n)test\/(\r?\n|$)/);
});

for (const [name, body] of [
  ['object', payment()], ['JSON', JSON.stringify(payment())],
  ['form', new URLSearchParams(payment()).toString()], ['JSON-key', { [JSON.stringify(payment())]: '' }],
]) test(`body parser accepts ${name}`, () => assert.equal(parseWfpBody(body).orderReference, order));

for (const body of [null, [], 'null', '{bad', { '{bad': '' }]) {
  test(`body parser safely rejects malformed ${JSON.stringify(body)}`, () => assert.deepEqual(parseWfpBody(body), {}));
}

test('valid payment signature is accepted', () => assert.equal(validPayment(payment(), order, secret), true));
for (const overrides of [{ merchantAccount: 'other' }, { amount: '1' }, { currency: 'USD' },
  { orderReference: 'order_999_other' }, { merchantSignature: '0'.repeat(32) }]) {
  test(`payment mismatch is rejected: ${Object.keys(overrides)[0]}`, () => {
    const data = payment(order, overrides);
    if ('merchantSignature' in overrides) data.merchantSignature = overrides.merchantSignature;
    assert.equal(validPayment(data, order, secret), false);
  });
}

test('WayForPay accept response is signed', () => {
  const result = signedAccept(order, secret);
  assert.equal(result.status, 'accept');
  assert.equal(result.signature, crypto.createHmac('md5', secret)
    .update(`${order};accept;${result.time}`).digest('hex'));
});

for (const [format, body] of [['object', payment()], ['JSON', JSON.stringify(payment())],
  ['form', new URLSearchParams(payment()).toString()], ['JSON-key', { [JSON.stringify(payment())]: '' }]]) {
  test(`signed Approved return succeeds as ${format}`, async () => {
    const res = await returned({ v: '2' }, body, 'POST');
    assert.equal(res.statusCode, 303);
    assert.match(res.redirectArgs[1], /[?&]order=order_123456789_abcde/);
    assert.match(res.redirectArgs[1], /[?&]v=2/);
  });
}

for (const status of ['Declined', 'Expired', 'Refunded', 'Voided']) {
  test(`signed ${status} return goes to failure without network`, async () => {
    const res = await returned({ order }, payment(order, { transactionStatus: status }), 'POST');
    assert.equal(res.statusCode, 303);
    assert.match(res.redirectArgs[1], /[?&]order=order_123456789_abcde/);
  });
}

for (const status of ['Pending', 'InProcessing', 'WaitingAuthComplete', 'RefundInProcessing']) {
  test(`${status} return remains unverified`, async () => {
    const res = await returned({ order }, payment(order, { transactionStatus: status }), 'POST');
    assert.equal(res.statusCode, 503);
    assert.match(String(res.body), /не сплачуйте повторно/);
  });
}

test('verification retry preserves order, variant and attribution', async () => {
  const res = await returned({ order, v: '2', utm_source: 'ad', utm_campaign: 'launch' },
    payment(order, { transactionStatus: 'Pending' }), 'POST');
  assert.equal(res.statusCode, 503);
  assert.match(String(res.body), /order=order_123456789_abcde/);
  assert.match(String(res.body), /v=2/);
  assert.match(String(res.body), /utm_source=ad/);
  assert.match(String(res.body), /utm_campaign=launch/);
});

test('GET checks WayForPay and grants a verified payment', async () => {
  delete process.env.PIPEDRIVE_API_TOKEN;
  mockStatus(payment());
  const res = await returned();
  assert.equal(res.statusCode, 303);
  assert.match(res.redirectArgs[1], /[?&]order=order_123456789_abcde/);
  assert.equal(res.headers['Cache-Control'], 'no-store');
});

for (const reasonCode of [1127, 1151]) {
  test(`CHECK_STATUS ${reasonCode} permits a new attempt`, async () => {
    mockStatus({ reasonCode });
    const res = await returned();
    assert.equal(res.statusCode, 303);
  });
}

for (const bad of [{}, { reasonCode: 1109 }, { transactionStatus: 'Approved' }]) {
  test(`incomplete CHECK_STATUS remains unverified: ${JSON.stringify(bad)}`, async () => {
    mockStatus(bad);
    assert.equal((await returned()).statusCode, 503);
  });
}

test('invalid return method and order are rejected', async () => {
  assert.equal((await returned({}, null, 'DELETE')).statusCode, 405);
  assert.equal((await returned({ order: ['bad'] })).statusCode, 400);
  assert.equal((await returned({ order: '../bad' })).statusCode, 400);
});

test('legacy won deal reaches thank-you without WayForPay', async () => {
  globalThis.fetch = async url => {
    assert.match(url, /pipedrive.*deals\/42/);
    return { ok: true, json: async () => ({ success: true, data: { status: 'won' } }) };
  };
  const res = await returned({ dealId: '42', utm_source: 'legacy' });
  assert.equal(res.statusCode, 302);
  assert.match(res.redirectArgs[1], /dealId=42/);
});

test('legacy open or offline CRM never grants access', async () => {
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ success: true, data: { status: 'open' } }) });
  assert.equal((await returned({ dealId: '42' })).statusCode, 503);
  globalThis.fetch = async () => { throw new Error('offline'); };
  assert.equal((await returned({ dealId: '42' })).statusCode, 503);
});

test('standalone webhook is signed and CRM-independent', async () => {
  delete process.env.PIPEDRIVE_API_TOKEN;
  const res = response();
  await webhookHandler({ method: 'POST', body: payment() }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.status, 'accept');
  assert.ok(res.body.signature);
});

for (const status of ['Declined', 'Pending', 'Refunded']) {
  test(`${status} webhook is acknowledged without CRM`, async () => {
    delete process.env.PIPEDRIVE_API_TOKEN;
    const res = response();
    await webhookHandler({ method: 'POST', body: payment(order, { transactionStatus: status }) }, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.status, 'accept');
  });
}

test('forged webhook is rejected before network access', async () => {
  let calls = 0;
  globalThis.fetch = async () => { calls++; throw new Error('must not run'); };
  const data = payment(dealOrder); data.merchantSignature = '0'.repeat(32);
  const res = response();
  await webhookHandler({ method: 'POST', body: data }, res);
  assert.equal(res.statusCode, 400);
  assert.equal(calls, 0);
});

test('webhook rejects wrong method and malformed order', async () => {
  const methodRes = response();
  await webhookHandler({ method: 'GET', body: {} }, methodRes);
  assert.equal(methodRes.statusCode, 405);
  const orderRes = response();
  await webhookHandler({ method: 'POST', body: payment('../42') }, orderRes);
  assert.equal(orderRes.statusCode, 400);
});

test('already-won deal webhook is idempotent', async () => {
  let calls = 0;
  globalThis.fetch = async () => { calls++; return { ok: true,
    json: async () => ({ success: true, data: { status: 'won' } }) }; };
  const res = response();
  await webhookHandler({ method: 'POST', body: payment(dealOrder) }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(calls, 1);
});

for (const status of [404, 410]) {
  test(`permanently missing CRM deal ${status} stops futile webhook retries`, async () => {
    globalThis.fetch = async () => ({ ok: false, status });
    const res = response();
    await webhookHandler({ method: 'POST', body: payment(dealOrder) }, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.status, 'accept');
    assert.ok(res.body.signature);
  });
}

test('deal webhook updates only its referenced deal', async () => {
  const calls = [];
  globalThis.fetch = async (url, options = {}) => {
    calls.push([url, options]);
    return options.method === 'PUT' ? { ok: true, json: async () => ({ success: true }) }
      : { ok: true, json: async () => ({ success: true,
        data: { status: 'open', add_time: '2026-09-13 10:00:00' } }) };
  };
  const res = response();
  await webhookHandler({ method: 'POST', body: payment(dealOrder) }, res);
  assert.equal(res.statusCode, 200);
  assert.match(calls[0][0], /\/deals\/42\?/);
  assert.match(calls[1][0], /\/deals\/42\?/);
  assert.equal(JSON.parse(calls[1][1].body).status, 'won');
});

for (const failure of ['check-http', 'check-json', 'update-http', 'update-json']) {
  test(`CRM ${failure} leaves webhook for retry`, async () => {
    globalThis.fetch = async (_url, options = {}) => {
      if (!options.method) return failure === 'check-http' ? { ok: false, status: 429 }
        : { ok: true, json: async () => failure === 'check-json' ? ({ success: false })
          : ({ success: true, data: { status: 'open', add_time: '2026-09-13 10:00:00' } }) };
      return failure === 'update-http' ? { ok: false, status: 503 }
        : { ok: true, json: async () => ({ success: failure !== 'update-json' }) };
    };
    const res = response();
    await webhookHandler({ method: 'POST', body: payment(dealOrder) }, res);
    assert.ok(res.statusCode >= 500 && res.statusCode < 600);
    assert.notEqual(res.body?.status, 'accept');
  });
}

test('invoice rejects wrong method and missing secret', async () => {
  let res = response();
  await invoiceHandler(request({}, 'GET'), res);
  assert.equal(res.statusCode, 405);
  delete process.env.WAYFORPAY_SECRET; delete process.env.WFP_MERCHANT_SECRET_KEY;
  res = response();
  await invoiceHandler(request(invoiceBody()), res);
  assert.equal(res.statusCode, 500);
});

for (const [field, value] of [['merchantAccount', 'other'], ['merchantDomainName', 'evil.example'],
  ['amount', '1'], ['currency', 'USD'], ['productName', 'other'], ['productCount', '2'],
  ['productPrice', '1'], ['orderReference', '../bad']]) {
  test(`invoice rejects invalid ${field}`, async () => {
    const res = response();
    await invoiceHandler(request(invoiceBody({ [field]: value })), res);
    assert.equal(res.statusCode, 400);
  });
}

for (const [field, value] of [['returnUrl', 'http://shop.example/api/wfp-return'],
  ['returnUrl', 'https://evil.example/api/wfp-return'],
  ['returnUrl', 'https://shop.example/wrong'],
  ['serviceUrl', 'http://shop.example/api/wfp-webhook'],
  ['serviceUrl', 'https://evil.example/api/wfp-webhook'],
  ['serviceUrl', 'https://shop.example/wrong']]) {
  test(`invoice rejects unsafe ${field}: ${value}`, async () => {
    const res = response();
    await invoiceHandler(request(invoiceBody({ [field]: value })), res);
    assert.equal(res.statusCode, 400);
  });
}

test('invoice preserves order and bounded allowed tracking data', async () => {
  let sent;
  globalThis.fetch = async (_url, options) => {
    sent = JSON.parse(options.body);
    return { ok: true, json: async () => ({ invoiceUrl: 'https://pay.example/invoice' }) };
  };
  const res = response();
  await invoiceHandler(request(invoiceBody({ returnUrl:
    `https://shop.example/api/wfp-return?v=2&utm_source=${encodeURIComponent('😀'.repeat(300))}` })), res);
  assert.equal(res.statusCode, 200);
  assert.ok(sent.returnUrl.length <= 250);
  const url = new URL(sent.returnUrl);
  assert.equal(url.searchParams.get('order'), order);
  assert.equal(url.searchParams.get('v'), '2');
});

for (const [phone, normalized] of [['0501234567', '380501234567'],
  ['501234567', '380501234567'], ['380501234567', '380501234567']]) {
  test(`invoice normalizes phone ${phone}`, async () => {
    let sent;
    globalThis.fetch = async (_url, options) => { sent = JSON.parse(options.body);
      return { ok: true, json: async () => ({ invoiceUrl: 'https://pay.example/invoice' }) }; };
    const res = response();
    await invoiceHandler(request(invoiceBody({ clientPhone: phone })), res);
    assert.equal(res.statusCode, 200);
    assert.equal(sent.clientPhone, normalized);
  });
}

test('WayForPay HTTP failure is not presented as an invoice', async () => {
  globalThis.fetch = async () => ({ ok: false, status: 503 });
  const res = response();
  await invoiceHandler(request(invoiceBody()), res);
  assert.equal(res.statusCode, 500);
});

test('CRM payment-link failure cannot discard a created invoice', async () => {
  globalThis.fetch = async (url) => url.includes('pipedrive')
    ? (() => { throw new Error('CRM offline'); })()
    : { ok: true, json: async () => ({ invoiceUrl: 'https://pay.example/invoice' }) };
  const res = response();
  await invoiceHandler(request(invoiceBody({ orderReference: dealOrder })), res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.invoiceUrl, 'https://pay.example/invoice');
});

test('create-deal validates method, configuration and payload', async () => {
  let res = response();
  await createDealHandler({ method: 'GET', body: {} }, res);
  assert.equal(res.statusCode, 405);
  delete process.env.PIPEDRIVE_API_TOKEN;
  res = response(); await createDealHandler({ method: 'POST', body: {} }, res);
  assert.equal(res.statusCode, 500);
  process.env.PIPEDRIVE_API_TOKEN = 'crm-token';
  res = response(); await createDealHandler({ method: 'POST', body: {} }, res);
  assert.equal(res.statusCode, 400);
});

test('CRM HTTP failure returns quickly so frontend can use standalone order', async () => {
  let calls = 0;
  globalThis.fetch = async () => { calls++; return { ok: false, status: 429 }; };
  const res = response();
  await createDealHandler({ method: 'POST', body: {
    email: 'a@b.c', phone: '380501234567', deal_name: 'x', amount: WFP_CONFIG.amount,
  } }, res);
  assert.equal(res.statusCode, 503);
  assert.equal(calls, 1);
});

function createBody(overrides = {}) {
  return { email: 'buyer@example.com', phone: '380501234567', deal_name: 'Course order',
    product: WFP_CONFIG.product, amount: WFP_CONFIG.amount, currency: WFP_CONFIG.currency,
    utm_source: 'ad', ...overrides };
}

test('create-deal uses one shared deadline and survives a failed note', async () => {
  const signals = [];
  globalThis.fetch = async (url, options = {}) => {
    if (options.signal) signals.push(options.signal);
    if (url.includes('/persons/search')) return { ok: true,
      json: async () => ({ success: true, data: { items: [] } }) };
    if (/\/persons\?/.test(url)) return { ok: true,
      json: async () => ({ success: true, data: { id: 7 } }) };
    if (url.includes('/persons/7/deals')) return { ok: true,
      json: async () => ({ success: true, data: [] }) };
    if (/\/deals\?/.test(url) && options.method === 'POST') return { ok: true,
      json: async () => ({ success: true, data: { id: 42 } }) };
    if (url.includes('/deals/42')) return { ok: true,
      json: async () => ({ success: true }) };
    if (url.includes('/notes')) throw new Error('notes offline');
    throw new Error(`Unexpected URL ${url}`);
  };
  const res = response();
  await createDealHandler({ method: 'POST', headers: {}, body: createBody() }, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { dealId: 42, deduped: false });
  assert.ok(signals.length >= 5);
  assert.equal(new Set(signals).size, 1);
});

test('create-deal returns a fresh exact duplicate instead of creating another deal', async () => {
  let created = false;
  globalThis.fetch = async (url, options = {}) => {
    if (url.includes('/persons/search')) return { ok: true,
      json: async () => ({ success: true, data: { items: [{ item: { id: 7, name: 'buyer@example.com' } }] } }) };
    if (url.includes('/persons/7/deals')) return { ok: true, json: async () => ({ success: true,
      data: [{ id: 55, value: WFP_CONFIG.amount,
        add_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
        ['15f60a0ce63e0a5036ec1de32dec0893cd6dc687']: WFP_CONFIG.product }] }) };
    if (url.includes('/deals/55')) return { ok: true, json: async () => ({ success: true }) };
    if (options.method === 'POST') created = true;
    throw new Error(`Unexpected URL ${url}`);
  };
  const res = response();
  await createDealHandler({ method: 'POST', headers: {}, body: createBody() }, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { dealId: 55, deduped: true });
  assert.equal(created, false);
});

test('a hanging CRM request is cut off by the create-deal deadline', async () => {
  const originalTimeout = AbortSignal.timeout;
  const controller = new AbortController();
  AbortSignal.timeout = ms => { assert.equal(ms, 6000); return controller.signal; };
  try {
    globalThis.fetch = async (_url, options = {}) => new Promise((resolve, reject) => {
      assert.equal(options.signal, controller.signal);
      options.signal.addEventListener('abort', () => reject(options.signal.reason), { once: true });
    });
    const res = response();
    const pending = createDealHandler({ method: 'POST', headers: {}, body: createBody() }, res);
    await Promise.resolve();
    controller.abort(new DOMException('Timed out', 'TimeoutError'));
    await pending;
    assert.equal(res.statusCode, 503);
    assert.equal(res.body.error, 'CRM timeout');
  } finally { AbortSignal.timeout = originalTimeout; }
});

test('CRM success:false is sanitized and retryable', async () => {
  globalThis.fetch = async (url, options = {}) => {
    if (url.includes('/persons/search')) return { ok: true,
      json: async () => ({ success: true, data: { items: [{ item: { id: 7, name: 'buyer@example.com' } }] } }) };
    if (url.includes('/persons/7/deals')) return { ok: true, json: async () => ({ success: true, data: [] }) };
    if (/\/deals\?/.test(url) && options.method === 'POST') return { ok: true,
      json: async () => ({ success: false, error: 'private CRM details' }) };
    throw new Error(`Unexpected URL ${url}`);
  };
  const res = response();
  await createDealHandler({ method: 'POST', headers: {}, body: createBody() }, res);
  assert.equal(res.statusCode, 503);
  assert.deepEqual(res.body, { error: 'CRM unavailable' });
});
