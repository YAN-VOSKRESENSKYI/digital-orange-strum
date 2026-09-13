import crypto from 'crypto';
import { WFP_CONFIG, getWfpSecret } from '../lib/wfp.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const secretKey = getWfpSecret();
    
    if (!secretKey) {
      console.error('WAYFORPAY_SECRET environment variable is not set');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const { merchantAccount, merchantDomainName, orderReference, orderDate, amount, currency, productName, productCount, productPrice } = req.body;
    const host = String(req.headers?.['x-forwarded-host'] || req.headers?.host || '').split(',')[0].trim().split(':')[0];
    if (merchantAccount !== WFP_CONFIG.merchant || merchantDomainName !== host ||
        Number(amount) !== WFP_CONFIG.amount || currency !== WFP_CONFIG.currency ||
        productName !== WFP_CONFIG.product || Number(productCount) !== 1 ||
        Number(productPrice) !== WFP_CONFIG.amount ||
        !/^(deal-\d+-\d+|order_\d+_[a-z0-9]+)$/.test(String(orderReference || ''))) {
      return res.status(400).json({ message: 'Invalid payment parameters' });
    }
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
      productPrice
    ].join(';');

    const signature = crypto.createHmac('md5', secretKey).update(signatureString).digest('hex');

    return res.status(200).json({ signature });
  } catch (error) {
    console.error('Signature error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
