import crypto from 'crypto';

const PIPEDRIVE_BASE = 'https://api.pipedrive.com/v1';
const FIELD_PAYMENT_URL = 'bc1184cf3a3373748118a7816d595cd652be6d30'; // Платежная ссылка

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
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [FIELD_PAYMENT_URL]: invoiceUrl }),
    });
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
      clientPhone: rawPhone,
      returnUrl,
      serviceUrl,
    } = req.body;

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
      returnUrl,
      serviceUrl,
    };

    console.log('Creating WFP invoice for:', clientEmail, clientPhone);

    const wfpResponse = await fetch('https://api.wayforpay.com/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoiceData),
    });

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
