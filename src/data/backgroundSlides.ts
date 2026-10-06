export interface BackgroundSlide {
  id: number;
  theme: 'poly_crystal' | 'luminous_ribbon' | 'diagonal_stripes' | 'dotted_wave' | 'angular_beams';
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
}

export const BACKGROUND_SLIDES: BackgroundSlide[] = [
  {
    id: 0,
    theme: 'poly_crystal',
    titleAr: 'المنصة المتكاملة لفرق الصيانة الحديثة',
    titleEn: 'The platform built for modern maintenance teams',
    subtitleAr: 'سجّل دخولك لمتابعة سير العمل، تقليل فترات التوقف، واستمرارية العمليات التشغيلية.',
    subtitleEn: 'Log in to stay on top of work, reduce downtime, and keep operations moving.',
  },
  {
    id: 1,
    theme: 'luminous_ribbon',
    titleAr: 'المكان الموحد لإدارة أوامر العمل والأصول والتشغيل',
    titleEn: 'One place for work orders, assets, and uptime',
    subtitleAr: 'سجّل دخولك لتوحيد فريقك وإبقاء كافة أعمال الصيانة في مسارها الصحيح.',
    subtitleEn: 'Sign in to keep your team aligned and your maintenance work on track.',
  },
  {
    id: 2,
    theme: 'diagonal_stripes',
    titleAr: 'إدارة صيانة متطورة، صُممت لاستمرار تدفق العمل',
    titleEn: 'Maintenance management, built to keep work moving',
    subtitleAr: 'سجّل دخولك للوصول إلى فريقك، المهام، الأصول، والعمليات اليومية بكل سلاسة.',
    subtitleEn: 'Log in to access your team, tasks, assets, and daily operations.',
  },
  {
    id: 3,
    theme: 'dotted_wave',
    titleAr: 'استمرارية الصيانة بكل كفاءة وبدون فوضى',
    titleEn: 'Keep maintenance running without the chaos',
    subtitleAr: 'سجّل دخولك لإدارة أوامر العمل، الأصول، الفحوصات الدورية، والعمليات في مكان واحد.',
    subtitleEn: 'Sign in to manage work orders, assets, inspections, and operations in one place.',
  },
  {
    id: 4,
    theme: 'angular_beams',
    titleAr: 'موثوق به من قِبل آلاف منشآت الصيانة والتشغيل',
    titleEn: 'Trusted by thousands of maintenance teams',
    subtitleAr: 'سجّل دخولك لتبسيط أوامر العمل، الفحوصات التشغيلية، وإدارة الأصول المؤسسية.',
    subtitleEn: 'Sign in to simplify work orders, inspections, and asset management.',
  },
];
