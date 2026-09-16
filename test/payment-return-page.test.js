import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import handler from '../api/wfp-return.js';
import * as wfp from '../lib/wfp.js';

const config = wfp.WFP_CONFIG || { merchant: 'vlob_online', amount: 390, currency: 'UAH' };
const secret = 'test-only-secret';
const order = 'order_12345_abc';
const originalFetch = globalThis.fetch;
const originalEnv = { ...process.env };
const source = readFileSync(new URL('../api/wfp-return.js', import.meta.url), 'utf8');
const failedPath = source.match(/const FAILED_PATH = '([^']+)'/)[1];
const successPath = source.match(/const THANK_YOU_PATH = '([^']+)'/)[1];
beforeEach(() => {
  process.env.WAYFORPAY_SECRET = process.env.WFP_MERCHANT_SECRET_KEY = secret;
  delete process.env.PIPEDRIVE_API_TOKEN;
  globalThis.fetch = async () => { throw new Error('Provider offline'); };
});
afterEach(() => { globalThis.fetch = originalFetch; process.env = { ...originalEnv }; });

function payment(status) {
  const data = { merchantAccount: config.merchant, amount: config.amount, currency: config.currency,
    orderReference: order, authCode: '123', cardPan: '42****42', transactionStatus: status, reasonCode: 1100 };
  data.merchantSignature = crypto.createHmac('md5', secret).update([
    data.merchantAccount, data.orderReference, data.amount, data.currency,
    data.authCode, data.cardPan, data.transactionStatus, data.reasonCode,
  ].join(';')).digest('hex');
  return data;
}
async function returned(query = {}, body) {
  const res = { headers: {}, setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.code = code; return this; }, send(data) { this.data = data; return this; },
    redirect(code, url) { this.code = code; this.url = url; return this; } };
  await handler({ method: body ? 'POST' : 'GET', headers: {}, query, body }, res);
  assert.equal(res.code, 303);
  assert.equal(res.headers['Cache-Control'], 'no-store');
  return new URL(res.url, 'https://example.com');
}
const attribution = { v: '2', utm_source: 'тест & source', utm_campaign: 'return' };
for (const status of ['Pending', 'InProcessing', 'WaitingAuthComplete', 'RefundInProcessing', 'Approved', 'Declined', 'Expired', 'Refunded', 'Voided', 'Unpaid']) {
  test(`designed return page: ${status} preserves context and replaces stale UI state`, async () => {
    const url = await returned({ order, ...attribution, paymentState: 'unverified', transactionStatus: 'Approved' }, payment(status));
    assert.equal(url.pathname, status === 'Approved' ? successPath : failedPath);
    const pending = ['Pending', 'InProcessing', 'WaitingAuthComplete', 'RefundInProcessing'].includes(status);
    assert.equal(url.searchParams.get('paymentState'), pending ? 'unverified' : null);
    assert.equal(url.searchParams.get('transactionStatus'), null);
    assert.equal(url.searchParams.get('order'), order);
    for (const [key, value] of Object.entries(attribution)) assert.equal(url.searchParams.get(key), value);
  });
}
test('provider outage, bare return and legacy IDs use the designed unresolved page', async () => {
  for (const query of [{ order }, { dealId: '42' }, {}]) {
    const url = await returned({ ...query, ...attribution });
    assert.equal(url.pathname, failedPath);
    assert.equal(url.searchParams.get('paymentState'), 'unverified');
    for (const [key, value] of Object.entries({ ...query, ...attribution })) assert.equal(url.searchParams.get(key), value);
  }
});
test('POST-only order survives redirect and later Approved retry', async () => {
  const pending = await returned(attribution, payment('Pending'));
  assert.equal(pending.searchParams.get('order'), order);
  globalThis.fetch = async () => ({ ok: true, json: async () => payment('Approved') });
  const approved = await returned(Object.fromEntries(pending.searchParams));
  assert.equal(approved.pathname, successPath);
  assert.equal(approved.searchParams.get('paymentState'), null);
  assert.equal(approved.searchParams.get('utm_source'), attribution.utm_source);
});

if (failedPath.endsWith('.html')) {
  const html = readFileSync(new URL('..' + failedPath, import.meta.url), 'utf8');
  const script = html.match(/<script id="payment-return-state">([\s\S]*?)<\/script>/)[1];
  function page(query) {
    const nodes = {};
    const document = { querySelector(selector) { return nodes[selector] ||= { href: selector.includes('ghost') ? 'https://t.me/karine_vlob' : 'index.html', textContent: '', hidden: false }; } };
    vm.runInNewContext(script, { URLSearchParams, window: { location: { search: '?' + new URLSearchParams(query) } }, document });
    return nodes;
  }
  test('unresolved page verifies the same order with attribution and never links to a new charge', () => {
    const nodes = page({ order, dealId: '42', ...attribution, paymentState: 'unverified', transactionStatus: 'Approved' });
    const retry = new URL(nodes['a.cta'].href, 'https://example.com');
    assert.equal(retry.pathname, '/api/wfp-return');
    assert.equal(retry.searchParams.get('order'), order);
    assert.equal(retry.searchParams.get('dealId'), '42');
    assert.equal(retry.searchParams.get('paymentState'), null);
    assert.equal(retry.searchParams.get('transactionStatus'), null);
    assert.equal(retry.searchParams.get('utm_source'), attribution.utm_source);
    assert.match(nodes['.lead'].textContent, /не сплачуйте повторно/);
  });
  test('bare unresolved page offers support, legacy link offers verification, failure drops old IDs', () => {
    assert.match(page({ paymentState: 'unverified' })['a.cta'].href, /^https:\/\/t.me\//);
    assert.match(page({ paymentState: 'unverified', dealId: '42' })['a.cta'].href, /dealId=42/);
    const nodes = page({ order, dealId: '42', ...attribution });
    const form = new URL(nodes['a.cta'].href, 'https://example.com');
    assert.equal(form.searchParams.get('order'), null);
    assert.equal(form.searchParams.get('dealId'), null);
    assert.equal(form.searchParams.get('v'), '2');
    assert.equal(form.searchParams.get('utm_source'), attribution.utm_source);
  });
}
