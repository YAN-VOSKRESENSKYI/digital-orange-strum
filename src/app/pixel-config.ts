import { getProjectConfig } from "./project-settings";

/**
 * Ініціалізує всі пікселі з конфігурації (залежно від URL).
 * Цю функцію потрібно викликати один раз при старті додатку (наприклад, у main.tsx).
 */
export const initPixels = () => {
  if (typeof window !== 'undefined') {
    const config = getProjectConfig();
    
    // Init Meta Pixels
    if (typeof (window as any).fbq === 'function') {
      config.pixelIds.forEach((id) => {
        (window as any).fbq('init', id);
      });
    }

    // Init Microsoft Clarity
    (function(c:any,l:any,a:any,r:any,i:any,t?:any,y?:any){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];if(y)y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", config.clarityId);
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
