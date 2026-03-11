import crypto from 'crypto';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const secretKey = process.env.WAYFORPAY_SECRET;
    
    if (!secretKey) {
      console.error('WAYFORPAY_SECRET environment variable is not set');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const { merchantAccount, merchantDomainName, orderReference, orderDate, amount, currency, productName, productCount, productPrice } = req.body;
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

    return res.status(200).json({ signature, signatureString });
  } catch (error) {
    console.error('Signature error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
