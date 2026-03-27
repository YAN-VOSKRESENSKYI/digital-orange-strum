export default function handler(req, res) {
    // Цей API обробляє POST-запит від WayForPay і прозоро перенаправляє користувача
    // на статичну сторінку подяки звичайним GET-запитом, обходячи помилку 405 на Vercel.
    const v = req.query.v;
    const url = v ? `/t3nx-8291?v=${v}` : '/t3nx-8291';
    res.redirect(302, url);
}
