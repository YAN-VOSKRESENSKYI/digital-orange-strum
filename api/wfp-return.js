export default function handler(req, res) {
    // Формуємо рядок параметрів (UTM-мітки тощо)
    const params = new URLSearchParams(req.query).toString();
    const queryStr = params ? '?' + params : '';

    // Якщо WayForPay повідомляє про відхилений платіж
    if (req.method === 'POST' && req.body && req.body.transactionStatus === 'Declined') {
        return res.redirect(302, '/' + queryStr);
    }
    
    // Інакше успішно перенаправляємо на сторінку подяки із мітками
    res.redirect(302, '/t3nx-8291' + queryStr);
}
