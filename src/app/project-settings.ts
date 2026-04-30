// src/app/project-settings.ts

export type ProjectConfig = {
  theme: string;
  dealName: string;
  pixelIds: string[];
  clarityId: string;
};

const ORANGE_CONFIG: ProjectConfig = {
  theme: 'theme-orange', // або пуста строка, якщо тема за замовчуванням
  dealName: '3.0_Digital_K_390UA',
  pixelIds: ['833707622469977', '1909344792819122'],
  clarityId: 'wjzu1lqutb',
};

const GREEN_CONFIG: ProjectConfig = {
  theme: 'theme-green',
  dealName: '3.0_Expert_K_390UA',
  pixelIds: ['1574987896925082', '1909344792819122'],
  clarityId: 'vv2vgzxz4o',
};

/**
 * Визначає, яку конфігурацію використовувати, базуючись на URL.
 * Повертає GREEN_CONFIG, якщо в URL є ?v=2 або якщо ми знаходимось на шляху /v2 чи /green.
 */
export function getProjectConfig(): ProjectConfig {
  if (typeof window === 'undefined') return ORANGE_CONFIG;
  
  const searchParams = new URLSearchParams(window.location.search);
  const isV2Query = searchParams.get('v') === '2';
  const isV2Path = window.location.pathname.startsWith('/v2') || window.location.pathname.startsWith('/green');

  if (isV2Query || isV2Path) {
    return GREEN_CONFIG;
  }
  
  return ORANGE_CONFIG;
}
