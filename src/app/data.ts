/**
 * Static data arrays extracted from the В ЛОБ 3.0 landing page.
 *
 * Centralising copy here makes it easy to update text, add translations,
 * or drive A/B tests without touching component layout code.
 */

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export interface FaqItem {
  /** 2-digit display number, e.g. "01" */
  number: string;
  question: string;
  /** Pixel height of the outer container in the original Figma design */
  containerHeight: number;
  /** Whether the question text wraps (affects internal span height) */
  multiLine: boolean;
}

export const faqItems: FaqItem[] = [
  {
    number: "01",
    question: "А якщо моя тема надто вузька — її ніхто не купить?",
    containerHeight: 70.531,
    multiLine: true,
  },
  {
    number: "02",
    question: "А якщо в мене немає аудиторії?",
    containerHeight: 66.125,
    multiLine: false,
  },
  {
    number: "03",
    question: "Скільки часу потрібно щодня?",
    containerHeight: 66.125,
    multiLine: false,
  },
  {
    number: "04",
    question: "Я не технічна людина — впораюся?",
    containerHeight: 66.125,
    multiLine: false,
  },
  {
    number: "05",
    question: "Як зрозуміти чи піде моя тема?",
    containerHeight: 66.125,
    multiLine: false,
  },
  {
    number: "06",
    question: "Мені потрібна команда, щоб все це запустити?",
    containerHeight: 88.727,
    multiLine: false,
  },
  {
    number: "07",
    question:
      "Якщо у мене немає розуміння, яке велике дороге навчання продавати, чи можу я заробляти лише на міні-курсах?",
    containerHeight: 106.923,
    multiLine: true,
  },
  {
    number: "08",
    question: "Чому ми одразу не продаємо дороге навчання В ЛОБ?",
    containerHeight: 70.531,
    multiLine: false,
  },
  {
    number: "09",
    question: "Як скористатися допомогою кураторів?",
    containerHeight: 70.531,
    multiLine: false,
  },
  {
    number: "10",
    question: "Як скористатися вашою AI-системою?",
    containerHeight: 70.531,
    multiLine: false,
  },
];

// ─── Course Content Features ──────────────────────────────────────────────────

export interface CourseFeature {
  title: string;
  description: string;
  /** Pixel height of the card container in the Figma design */
  cardHeight: number;
  /** Pixel height of the text content area */
  textHeight: number;
  /** Icon identifier — matches export names in FeatureIcons.tsx */
  iconKey:
    | "BookCircleIcon"
    | "PlusVerticalIcon"
    | "AICalendarIcon"
    | "ChatBubbleIcon";
}

export const courseFeatures: CourseFeature[] = [
  {
    title: "Покроковий шлях",
    description:
      "Покроковий шлях від фундаменту до автоматичних продажів на $15,000+.",
    cardHeight: 96.412,
    textHeight: 62.274,
    iconKey: "BookCircleIcon",
  },
  {
    title: "Готові шаблони",
    description:
      "Шаблони офферів, структура лендінга на Weblium, готові схеми копірайтингу для реклами.",
    cardHeight: 116.559,
    textHeight: 82.42,
    iconKey: "PlusVerticalIcon",
  },
  {
    title: "Секретний AI-модуль",
    description:
      "Секретний AI-модуль (треновані моделі для розробки методології та написання текстів).",
    cardHeight: 116.559,
    textHeight: 82.42,
    iconKey: "AICalendarIcon",
  },
  {
    title: "Підтримка кураторів",
    description:
      "3 запити до кураторів протягом 7 днів (вперше на марафоні!).",
    cardHeight: 96.412,
    textHeight: 62.274,
    iconKey: "ChatBubbleIcon",
  },
];

// ─── Target Audience ("For Whom") ─────────────────────────────────────────────

export interface TargetCard {
  title: string;
  titleWidth: string;
  description: string;
  descriptionWidth: string;
  /** Icon identifier — matches export names in FeatureIcons.tsx */
  iconKey: "FlashIcon" | "LayersIcon" | "BarChartIcon";
}

export const targetCards: TargetCard[] = [
  {
    title: "Ти — майстер з «золотими руками»",
    titleWidth: "w-[197px]",
    description:
      "Але заробляєш, тільки поки стоїш біля кушетки. Більше клієнтів означає лише вбиту спину, а не свободу.",
    descriptionWidth: "w-[239px]",
    iconKey: "FlashIcon",
  },
  {
    title: "Ти — фрілансер, який втомився від правок і дедлайнів",
    titleWidth: "w-[235px]",
    description:
      "Хочеться вийти з ролі «рук» замовника і нарешті стати автором власної методики.",
    descriptionWidth: "w-[246px]",
    iconKey: "LayersIcon",
  },
  {
    title: "Ти — експерт або блогер, який потрапив у рабство контенту",
    titleWidth: "w-[229px]",
    description:
      "Не зняв сторіз — не продав. Гроші залежать від алгоритмів, а не від системи.",
    descriptionWidth: "w-[207px]",
    iconKey: "BarChartIcon",
  },
];

// ─── Transformation ("What Changes") ─────────────────────────────────────────

export interface TransformationItem {
  number: string;
  title: string;
  description: string;
  descriptionWidth: string;
  /** Icon identifier — matches export names in FeatureIcons.tsx */
  iconKey: "LockRectIcon" | "BarChartMdIcon" | "TargetMdIcon";
}

export const transformationItems: TransformationItem[] = [
  {
    number: "01",
    title: "Вихід із контентного рабства",
    description:
      "Система працює і приносить гроші, навіть якщо ти не виходиш у сторіз тижнями.",
    descriptionWidth: "w-[219px]",
    iconKey: "LockRectIcon",
  },
  {
    number: "02",
    title: "Дохід, що не залежить від кількості клієнтів",
    description:
      "Один раз створив курс — він продається сотні разів. Час відв'язаний від грошей.",
    descriptionWidth: "w-[219px]",
    iconKey: "BarChartMdIcon",
  },
  {
    number: "03",
    title: "Статус Гравця",
    description:
      "Ти перетворишся з ремісника на власника онлайн-школи з доходом $10,000+.",
    descriptionWidth: "w-[216px]",
    iconKey: "TargetMdIcon",
  },
];

// ─── Author Stats ─────────────────────────────────────────────────────────────

export interface AuthorStat {
  value: string;
  label: string;
  /** Icon identifier — matches export names in FeatureIcons.tsx */
  iconKey: "TrendArrowsIcon" | "UsersGroupIcon" | "TargetIcon";
}

export const authorStats: AuthorStat[] = [
  {
    value: "$4 000 000+",
    label: "продажів без вебінарів та прогрівів",
    iconKey: "TrendArrowsIcon",
  },
  {
    value: "40 000+",
    label: "людей пройшли мої навчальні програми",
    iconKey: "UsersGroupIcon",
  },
  {
    value: "$72 000",
    label: "рекорд учня з одного мінікурсу за місяць",
    iconKey: "TargetIcon",
  },
];

// ─── Bonuses ──────────────────────────────────────────────────────────────────

export interface BonusItem {
  title: string;
  description: string;
}

export const bonusItems: BonusItem[] = [
  {
    title: "АІ-платформа, яка напише сильні тексти",
    description: "",
  },
  {
    title: "Інструкція по роботі з Zenedu",
    description: "",
  },
  {
    title: "Відеоурок: 7 важливих питань перед запуском",
    description: "",
  },
  {
    title: "Калькулятор доходу з запуску міні-курсу",
    description: "",
  },
  {
    title: "Таблиця-план запуску по дням і крокам",
    description: "",
  },
  {
    title: "Відеоінструкція з створення лендингу",
    description: "",
  },
  {
    title: "А ще додаткові інструкції, посилання на корисні ресурси і промокоди спеціально для вас",
    description: "",
  },
];
