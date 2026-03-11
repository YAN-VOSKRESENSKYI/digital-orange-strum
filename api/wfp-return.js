export default function handler(req, res) {
    // Цей API обробляє POST-запит від WayForPay і прозоро перенаправляє користувача
    // на статичну сторінку подяки звичайним GET-запитом, обходячи помилку 405 на Vercel.
    res.redirect(302, '/t3nx-8291');
}
