import test, { afterEach, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import invoiceHandler from '../api/wayforpay-invoice.js';
import returnHandler from '../api/wfp-return.js';
import webhookHandler from '../api/wfp-webhook.js';
import createDealHandler from '../api/create-deal.js';
import { WFP_CONFIG } from '../lib/wfp.js';

const originalFetch = globalThis.fetch;
const originalEnv = { ...process.env };
const secret = 'test-secret';

function response() {
  return { statusCode: 200, headers: {}, body: undefined, redirectArgs: undefined,
    status(code) { this.statusCode = code; return this; }, json(value) { this.body = value; return this; },
    send(value) { this.body = value; return this; }, setHeader(key, value) { this.headers[key] = value; },
    redirect(code, value) { this.statusCode = code; this.redirectArgs = [code, value]; return this; } };
}

function payment(orderReference, overrides = {}) {
  const data = { merchantAccount: WFP_CONFIG.merchant, orderReference,
    amount: String(WFP_CONFIG.amount), currency: WFP_CONFIG.currency, authCode: '123',
    cardPan: '42****42', transactionStatus: 'Approved', reasonCode: 1100, ...overrides };
  data.merchantSignature = crypto.createHmac('md5', secret).update([
    data.merchantAccount, data.orderReference, data.amount, data.currency, data.authCode,
    data.cardPan, data.transactionStatus, data.reasonCode,
  ].join(';')).digest('hex');
  return data;
}

beforeEach(() => {
  process.env.WAYFORPAY_SECRET = secret;
  delete process.env.WFP_MERCHANT_SECRET_KEY;
  process.env.PIPEDRIVE_API_TOKEN = 'crm-token';
  globalThis.fetch = async () => { throw new Error('Unexpected network request'); };
});
afterEach(() => { globalThis.fetch = originalFetch; process.env = { ...originalEnv }; });

test('invoice adds exact order and preserves the green landing variant', async () => {
  const orderReference = 'order_123456789_abcde';
  let sent;
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://api.wayforpay.com/api');
    sent = JSON.parse(options.body);
    return { ok: true, json: async () => ({ invoiceUrl: 'https://pay.example/invoice' }) };
  };
  const res = response();
  await invoiceHandler({ method: 'POST', headers: { host: 'shop.example' }, body: {
    merchantAccount: WFP_CONFIG.merchant, merchantDomainName: 'shop.example', orderReference,
    orderDate: 123, amount: '390', currency: 'UAH', productName: WFP_CONFIG.product,
    productCount: '1', productPrice: '390', clientEmail: 'buyer@example.com', clientPhone: '0501234567',
    returnUrl: 'https://shop.example/api/wfp-return?v=2&utm_source=ad',
    serviceUrl: 'https://shop.example/api/wfp-webhook',
  } }, res);
  assert.equal(res.statusCode, 200);
  const url = new URL(sent.returnUrl);
  assert.equal(url.searchParams.get('order'), orderReference);
  assert.equal(url.searchParams.get('v'), '2');
  assert.ok(sent.returnUrl.length <= 250);
});

test('standalone webhook verifies payment without CRM', async () => {
  delete process.env.PIPEDRIVE_API_TOKEN;
  const res = response();
  await webhookHandler({ method: 'POST', body: payment('order_123456789_abcde') }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.status, 'accept');
});

test('forged deal webhook does not contact CRM', async () => {
  let calls = 0;
  globalThis.fetch = async () => { calls++; throw new Error('must not run'); };
  const body = payment('deal-42-123456789');
  body.merchantSignature = '0'.repeat(32);
  const res = response();
  await webhookHandler({ method: 'POST', body }, res);
  assert.equal(res.statusCode, 400);
  assert.equal(calls, 0);
});

test('signed return reaches the React thank-you route and keeps v=2', async () => {
  delete process.env.PIPEDRIVE_API_TOKEN;
  const order = 'order_123456789_abcde';
  const res = response();
  await returnHandler({ method: 'POST', query: { v: '2' }, body: payment(order) }, res);
  assert.deepEqual(res.redirectArgs, [303, `/t3nx-8291?v=2&order=${order}`]);
});

test('valid deal webhook updates the referenced deal', async () => {
  const calls = [];
  globalThis.fetch = async (url, options = {}) => {
    calls.push([url, options]);
    return options.method === 'PUT' ? { ok: true, json: async () => ({ success: true }) }
      : { ok: true, json: async () => ({ success: true,
        data: { status: 'open', add_time: '2026-09-13 10:00:00' } }) };
  };
  const res = response();
  await webhookHandler({ method: 'POST', body: payment('deal-42-123456789') }, res);
  assert.equal(res.body.status, 'accept');
  assert.match(calls[0][0], /\/deals\/42\?/);
  assert.equal(JSON.parse(calls[1][1].body).status, 'won');
});

test('failed required CRM update is left for WayForPay retry', async () => {
  globalThis.fetch = async (url, options = {}) => options.method === 'PUT'
    ? { ok: true, json: async () => ({ success: false }) }
    : { ok: true, json: async () => ({ success: true,
      data: { status: 'open', add_time: '2026-09-13 10:00:00' } }) };
  const res = response();
  await webhookHandler({ method: 'POST', body: payment('deal-42-123456789') }, res);
  assert.equal(res.statusCode, 503);
  assert.equal(res.body.status, undefined);
});

test('CRM 429 returns quickly so the unchanged form can create a standalone invoice', async () => {
  let calls = 0;
  globalThis.fetch = async () => { calls++; return { ok: false, status: 429 }; };
  const res = response();
  await createDealHandler({ method: 'POST', body: {
    email: 'a@b.c', phone: '380501234567', deal_name: 'x', amount: 390,
  } }, res);
  assert.equal(res.statusCode, 503);
  assert.equal(calls, 1);
});
