export default function handler(req, res) {
    // Якщо WayForPay повідомляє про відхилений платіж
    if (req.method === 'POST' && req.body && req.body.transactionStatus === 'Declined') {
        return res.redirect(302, '/');
    }
    
    // Інакше успішно перенаправляємо на сторінку подяки
    res.redirect(302, '/t3nx-8291');
}
