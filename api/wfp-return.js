export default function handler(req, res) {
    // Формуємо рядок параметрів (UTM-мітки тощо)
    const params = new URLSearchParams(req.query).toString();
    const queryStr = params ? '?' + params : '';

    // Цей API обробляє POST-запит від WayForPay і перенаправляє користувача.
    // На сторінку подяки (де спрацьовує Meta Pixel Purchase) відправляємо
    // ТІЛЬКИ при підтвердженій оплаті (Approved).
    // Всі інші статуси (Waiting, Processing, Declined, Expired або порожній) —
    // на сторінку помилки, щоб уникнути фантомних подій Purchase у Facebook.
    const status = req.body?.transactionStatus;

    if (status === 'Approved') {
        return res.redirect(302, '/t3nx-8291' + queryStr);
    }

    return res.redirect(302, '/failed-payment' + queryStr);
}
