// src/app/pixel-config.ts

// Додайте всі ваші ID пікселів Meta у цей масив
export const PIXEL_IDS = [
  '833707622469977', // Піксель Катя фрілансери
  '1909344792819122', // Технічний піксель для ретаргету
];

/**
 * Ініціалізує всі пікселі з масиву PIXEL_IDS.
 * Цю функцію потрібно викликати один раз при старті додатку (наприклад, у main.tsx).
 */
export const initPixels = () => {
  if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
    PIXEL_IDS.forEach((id) => {
      (window as any).fbq('init', id);
    });
  }
};

/**
 * Відправляє подію у всі ініціалізовані пікселі.
 * Meta Pixel автоматично розсилає track-події до всіх ініціалізованих ID.
 * 
 * @param eventName Назва події (наприклад, 'PageView', 'Purchase')
 * @param data Додаткові дані для події
 */
export const trackPixelEvent = (eventName: string, data: any = {}) => {
  if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
    (window as any).fbq('track', eventName, data);
  }
};
