// src/app/pixel-config.ts
//
// ⚠️ TODO: Замінити PIXEL_IDS на реальні ID пікселів цього (зеленого) проекту.
// Це ІНШІ пікселі, ніж у lend-orange.

export const PIXEL_IDS = [
  '1574987896925082', // Основний піксель (Катя експерти)
  '1909344792819122', // Технічний піксель для ретаргету
];

/**
 * Ініціалізує всі пікселі з масиву PIXEL_IDS.
 * Викликається один раз при старті у main.tsx.
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
 *
 * @param eventName Назва події ('PageView', 'Lead', 'Purchase', тощо)
 * @param data      Додаткові параметри події
 */
export const trackPixelEvent = (eventName: string, data: any = {}) => {
  if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
    (window as any).fbq('track', eventName, data);
  }
};
