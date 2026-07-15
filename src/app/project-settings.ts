// src/app/project-settings.ts

export type ProjectConfig = {
  theme: string;
  dealName: string;
  pixelIds: string[];
  clarityId: string;
};

const CONFIG: ProjectConfig = {
  theme: '',
  dealName: '3.0_Digital_ST_390UA',
  pixelIds: ['3209746859167569', '1909344792819122'], // Перетяка, ретаргет
  clarityId: 'wjzu1lqutb',
};

export function getProjectConfig(): ProjectConfig {
  return CONFIG;
}
