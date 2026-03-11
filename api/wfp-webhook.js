// api/wfp-webhook.js
export default async function handler(req, res) {
    console.log('--- WFP Webhook Received ---');

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        let wfpData = req.body;

        // WayForPay іноді відправляє дані у дивному форматі, де JSON-рядок є ключем об'єкта.
        // Перевіряємо, чи є в нас такий випадок:
        if (wfpData && typeof wfpData === 'object' && Object.keys(wfpData).length === 1 && Object.keys(wfpData)[0].startsWith('{')) {
            try {
                console.log('Detected JSON-in-key format. Parsing...');
                wfpData = JSON.parse(Object.keys(wfpData)[0]);
            } catch (e) {
                console.log('Failed to parse JSON key:', e.message);
            }
        } else if (typeof wfpData === 'string') {
            try {
                wfpData = JSON.parse(wfpData);
            } catch (e) {
                console.log('Body is raw string, but not valid JSON');
            }
        }

        console.log('Final Parsed WFP Body:', JSON.stringify(wfpData, null, 2));

        // Перевіряємо статус платежу
        if (wfpData.transactionStatus !== 'Approved') {
            console.log('Payment NOT Approved. Status:', wfpData.transactionStatus);
            return res.status(200).json({ status: 'Ignored', reason: 'Not Approved' });
        }

        const customerEmail = wfpData.email || wfpData.clientEmail;
        const customerPhone = wfpData.phone || wfpData.clientPhone;

        console.log(`Customer info: Email: ${customerEmail}, Phone: ${customerPhone}`);

        if (!customerEmail && !customerPhone) {
            console.log('Error: No email or phone found in WFP response');
            return res.status(200).json({ status: 'Ignored', reason: 'No email or phone' });
        }

        const PIPEDRIVE_API_TOKEN = process.env.PIPEDRIVE_API_TOKEN;
        if (!PIPEDRIVE_API_TOKEN) {
            console.error('CRITICAL ERROR: Missing PIPEDRIVE_API_TOKEN in Vercel settings');
            return res.status(500).json({ error: 'Server misconfiguration' });
        }

        // 1. Шукаємо людину (Person) в Pipedrive
        const searchTerm = customerEmail || customerPhone;
        console.log(`Searching Pipedrive for: ${searchTerm}`);

        const searchUrl = `https://api.pipedrive.com/v1/persons/search?term=${encodeURIComponent(searchTerm)}&api_token=${PIPEDRIVE_API_TOKEN}`;
        const searchResponse = await fetch(searchUrl);
        const searchResult = await searchResponse.json();

        if (!searchResult.success || !searchResult.data.items || searchResult.data.items.length === 0) {
            console.log('Person not found in Pipedrive for term:', searchTerm);
            return res.status(200).json({ status: 'Ignored', reason: 'Person not found' });
        }

        const personId = searchResult.data.items[0].item.id;
        console.log(`Found Person ID: ${personId}`);

        // 2. Шукаємо відкриту угоду (Deal)
        const dealsUrl = `https://api.pipedrive.com/v1/persons/${personId}/deals?status=open&api_token=${PIPEDRIVE_API_TOKEN}`;
        const dealsResponse = await fetch(dealsUrl);
        const dealsResult = await dealsResponse.json();

        if (!dealsResult.success || !dealsResult.data || dealsResult.data.length === 0) {
            console.log(`No open deals found for person ID: ${personId}`);
            return res.status(200).json({ status: 'Ignored', reason: 'No open deals found' });
        }

        // Беремо останню відкриту угоду (вона зазвичай перша в списку)
        const dealId = dealsResult.data[0].id;
        console.log(`Found Deal ID: ${dealId}. Attempting to update to 'won'...`);

        // 3. Оновлюємо статус угоди на "Виграно"
        const updateDealUrl = `https://api.pipedrive.com/v1/deals/${dealId}?api_token=${PIPEDRIVE_API_TOKEN}`;
        const updatePayload = {
            status: 'won',
            stage_id: 12, // Переміщуємо в колонку "Оплачено"
            value: wfpData.amount
        };

        const updateResponse = await fetch(updateDealUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatePayload)
        });
        const updateResult = await updateResponse.json();

        if (!updateResult.success) {
            console.error('Failed to update deal in Pipedrive:', updateResult);
        } else {
            console.log(`SUCCESS: Deal #${dealId} updated to 'won' status!`);
        }

        // Відповідь для WayForPay
        const time = Math.floor(Date.now() / 1000);
        return res.status(200).json({
            orderReference: wfpData.orderReference || 'ref',
            status: "accept",
            time: time
        });

    } catch (error) {
        console.error('FATAL Webhook error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
