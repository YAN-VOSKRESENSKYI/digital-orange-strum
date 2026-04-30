import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const secretKey = process.env.WAYFORPAY_SECRET;
    
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
      clientPhone: rawPhone
    } = req.body;

    // Нормалізація телефону (має бути без + та у міжнародному форматі)
    const clientPhone = rawPhone.replace(/\D/g, '');

    // Формуємо рядок для підпису (згідно документації CREATE_INVOICE)
    // merchantAccount;merchantDomainName;orderReference;orderDate;amount;currency;productName[];productCount[];productPrice[]
    const signatureString = [
      merchantAccount,
      merchantDomainName,
      orderReference,
      orderDate,
      amount,
      currency,
      productName, // для одного продукту це просто рядок
      productCount,
      productPrice
    ].join(';');

    const signature = crypto.createHmac('md5', secretKey).update(signatureString).digest('hex');

    const invoiceData = {
      transactionType: "CREATE_INVOICE",
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
      clientFirstName: "Клієнт",
      clientLastName: " ",
      clientEmail,
      clientPhone,
      notifyMethod: "all"
    };

    const wfpResponse = await fetch("https://api.wayforpay.com/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invoiceData),
    });

    const data = await wfpResponse.json();

    if (data.reasonCode !== 1100 && data.invoiceUrl) {
       // Wayforpay повертає 1100 як успіх для деяких операцій, але для CREATE_INVOICE треба дивитись на invoiceUrl
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Invoice error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
