import type { DemoAccount, CountryCode } from '../types';

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: 'admin@assetflow.io',
    password: 'Password123!',
    role: 'admin',
    status: 'active',
    roleTitleAr: 'مدير المنظمة / مدير الصيانة',
    roleTitleEn: 'Organization Admin / Maintenance Manager',
    name: 'طارق النابلسي (Tariq Nabulsi)',
    organization: 'شركة الأمل للصناعات الهندسية',
  },
  {
    email: 'tech@assetflow.io',
    password: 'Password123!',
    role: 'technician',
    status: 'active',
    roleTitleAr: 'فني صيانة معتمد',
    roleTitleEn: 'Certified Maintenance Technician',
    name: 'أحمد خليل (Ahmad Khalil)',
    organization: 'شركة الأمل للصناعات الهندسية',
  },
  {
    email: 'reporter@assetflow.io',
    password: 'Password123!',
    role: 'reporter',
    status: 'active',
    roleTitleAr: 'مبلّغ / موظف تشغيل ميداني',
    roleTitleEn: 'Operational Issue Reporter',
    name: 'سارة الحسن (Sarah Hassan)',
    organization: 'شركة الأمل للصناعات الهندسية',
  },
  {
    email: 'inactive@assetflow.io',
    password: 'Password123!',
    role: 'technician',
    status: 'inactive',
    roleTitleAr: 'حساب معطّل (غير نشط)',
    roleTitleEn: 'Inactive Account (Blocked)',
    name: 'خالد عمر (Khaled Omar)',
    organization: 'شركة الأمل للصناعات الهندسية',
  },
];

export const COUNTRY_CODES: CountryCode[] = [
  { code: 'PS', dial_code: '+970', name_en: 'Palestine', name_ar: 'فلسطين', flag: '🇵🇸' },
  { code: 'SA', dial_code: '+966', name_en: 'Saudi Arabia', name_ar: 'المملكة العربية السعودية', flag: '🇸🇦' },
  { code: 'AE', dial_code: '+971', name_en: 'United Arab Emirates', name_ar: 'الإمارات العربية المتحدة', flag: '🇦🇪' },
  { code: 'JO', dial_code: '+962', name_en: 'Jordan', name_ar: 'الأردن', flag: '🇯🇴' },
  { code: 'EG', dial_code: '+20', name_en: 'Egypt', name_ar: 'مصر', flag: '🇪🇬' },
  { code: 'QA', dial_code: '+974', name_en: 'Qatar', name_ar: 'قطر', flag: '🇶🇦' },
  { code: 'KW', dial_code: '+965', name_en: 'Kuwait', name_ar: 'الكويت', flag: '🇰🇼' },
  { code: 'US', dial_code: '+1', name_en: 'United States', name_ar: 'الولايات المتحدة', flag: '🇺🇸' },
  { code: 'GB', dial_code: '+44', name_en: 'United Kingdom', name_ar: 'المملكة المتحدة', flag: '🇬🇧' },
  { code: 'DE', dial_code: '+49', name_en: 'Germany', name_ar: 'ألمانيا', flag: '🇩🇪' },
];

export interface Testimonial {
  id: string;
  name: string;
  titleEn: string;
  titleAr: string;
  source: string;
  quoteEn: string;
  quoteAr: string;
  image: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'michael',
    name: 'Michael W.',
    titleEn: 'Director of Maintenance Operations',
    titleAr: 'مدير عمليات الصيانة',
    source: 'Capterra Verified Review',
    quoteEn: '"I have been using the platform for several years now and have found it to be a game-changer for our maintenance operations. What I appreciate most is the seamless asset-to-service mapping and fast team adoption."',
    quoteAr: '"لقد أحدثت منصة AssetFlow تحولاً جذرياً في إدارة أصولنا وخطط الصيانة الوقائية. ما يميزها حقاً هو ربط الأصول الحيوية بالخدمات الحرجة وسرعة تفاعل الفريق الميداني معها."',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'melissa',
    name: 'Melissa R.',
    titleEn: 'Senior Facilities Manager',
    titleAr: 'مديرة إدارة المرافق والمنشآت',
    source: 'G2 Crowd Reviewer',
    quoteEn: '"AssetFlow streamlined all our technician work requests and reduced downtime by 38% in the first quarter alone. The Arabic and English switching makes it perfect for our diverse regional teams."',
    quoteAr: '"ساعدتنا المنصة في تنظيم طلبات الصيانة وتقليص فترات التوقف بنسبة 38% في الربع الأول. التبديل الفوري بين العربية والإنجليزية سهل العمل لفرقنا المتنوعة."',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'ken',
    name: 'Ken S.',
    titleEn: 'Plant Operations Lead',
    titleAr: 'رئيس تشغيل المحطات والمعدات',
    source: 'Gartner Insights',
    quoteEn: '"The mobile readiness and straightforward asset tracking saved us hundreds of hours previously lost to manual spreadsheets and chaotic communication."',
    quoteAr: '"سهولة تسجيل المعدات وتتبع حالتها التشغيلية بدقة وفرت علينا مئات الساعات التي كانت تضيع في الجداول اليدوية والفوضى."',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'jessica',
    name: 'Jessica T.',
    titleEn: 'EAM Systems Administrator',
    titleAr: 'مشرفة نظم إدارة الأصول المؤسسية',
    source: 'Software Advice',
    quoteEn: '"Setting up our sites and linking critical services took less than 2 days. Customer support is world-class and proactive at every step."',
    quoteAr: '"ربط المواقع والخدمات الحرجة لم يستغرق سوى يومين. الدعم الفني استثنائي وتصميم الواجهات واضح ومريح جداً."',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'mark',
    name: 'Mark B.',
    titleEn: 'VP of Manufacturing Engineering',
    titleAr: 'نائب رئيس الهندسة والتصنيع',
    source: 'TrustRadius',
    quoteEn: '"Unrivaled value. The best CMMS platform we have deployed across 12 manufacturing facilities worldwide."',
    quoteAr: '"قيمة لا تضاهى. إنها أفضل منصة لإدارة الصيانة طبقناها في أكثر من 12 منشأة صناعية حتى الآن."',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
  },
];
