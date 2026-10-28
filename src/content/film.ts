/**
 * Mudad Payroll device film: an ordered list of shots. Each shot crops the UI out of one of the
 * finished figure boards (3200×2000). `crop` is [left, top, right, bottom] as fractions of the board.
 * Consecutive shots on the same board pan the camera; a new board crossfades with a blur.
 * Tune crops live at /lab/showcase?edit and paste the copied JSON back here.
 */
export type Shot = {
  id: string;
  fig: string;
  crop: [number, number, number, number];
  chapter: { en: string; ar: string };
  chip?: { en: string; ar: string };
  caption: { en: string; ar: string };
  url: string;
};

export const BOARD = { w: 3200, h: 2000 };
export const figSrc = (fig: string) => `/assets/mudad/${fig}.webp`;

export const FILM: Shot[] = [
  {
    id: 'ds-before', fig: '09-old-to-new-system', crop: [0.04, 0.255, 0.45, 0.745],
    chapter: { en: 'Design system', ar: 'نظام التصميم' }, chip: { en: 'Before', ar: 'قبل' },
    caption: { en: 'Where it started: the old blue top-navigation dashboard.', ar: 'نقطة البداية: لوحة التحكم القديمة بشريط التنقل العلوي الأزرق.' },
    url: 'mudad.com.sa/payroll'
  },
  {
    id: 'ds-after', fig: '09-old-to-new-system', crop: [0.545, 0.22, 0.96, 0.78],
    chapter: { en: 'Design system', ar: 'نظام التصميم' }, chip: { en: 'After', ar: 'بعد' },
    caption: { en: 'The same payroll product on the new design system: side navigation, lighter chrome, more room for the numbers.', ar: 'منتج الرواتب نفسه على نظام التصميم الجديد: تنقّل جانبي، وإطار أخف، ومساحة أكبر للأرقام.' },
    url: 'mudad.com.sa/payroll'
  },
  {
    id: 'auto-off', fig: '01-auto-payroll-off-on', crop: [0.035, 0.215, 0.49, 0.8],
    chapter: { en: 'Autopayroll', ar: 'الرواتب التلقائية' }, chip: { en: 'Off', ar: 'متوقف' },
    caption: { en: 'Payroll as it was: set up again by hand, every month.', ar: 'الرواتب كما كانت: تُجهَّز يدوياً من جديد كل شهر.' },
    url: 'mudad.com.sa/payroll/new'
  },
  {
    id: 'auto-on', fig: '01-auto-payroll-off-on', crop: [0.51, 0.215, 0.965, 0.8],
    chapter: { en: 'Autopayroll', ar: 'الرواتب التلقائية' }, chip: { en: 'On', ar: 'مفعّل' },
    caption: { en: 'Turning auto payroll on adds one field: the month it stops. Everything else stays where people expect it.', ar: 'تفعيل الرواتب التلقائية يضيف حقلاً واحداً: الشهر الذي تتوقف فيه. وكل شيء آخر يبقى حيث يتوقعه الناس.' },
    url: 'mudad.com.sa/payroll/new'
  },
  {
    id: 'one-code', fig: '03-one-code-five-months', crop: [0.27, 0.16, 0.73, 0.84],
    chapter: { en: 'Autopayroll', ar: 'الرواتب التلقائية' },
    caption: { en: 'One code confirms five months of payroll, January to May.', ar: 'رمز واحد يؤكد خمسة أشهر من الرواتب، من يناير إلى مايو.' },
    url: 'mudad.com.sa/payroll/confirm'
  },
  {
    id: 'warnings', fig: '02-warn-before-submit', crop: [0.225, 0.11, 0.775, 0.86],
    chapter: { en: 'Warnings first', ar: 'التنبيه أولاً' },
    caption: { en: 'Wage protection warnings appear on each employee before you submit, beside the month’s expected compliance rate.', ar: 'تظهر تنبيهات حماية الأجور على كل موظف قبل الإرسال، بجانب نسبة الالتزام المتوقعة للشهر.' },
    url: 'mudad.com.sa/payroll/summary'
  },
  {
    id: 'dashboard', fig: '04-dashboard-status', crop: [0.035, 0.295, 0.965, 0.68],
    chapter: { en: 'Calmer paydays', ar: 'أيام رواتب أهدأ' },
    caption: { en: 'Once it’s running, the dashboard leads with what happens next: the next transfer, the next deduction date, and when auto payroll ends.', ar: 'حين يعمل، تبدأ لوحة التحكم بما سيحدث تالياً: التحويل القادم، وتاريخ الاستقطاع القادم، وموعد انتهاء الرواتب التلقائية.' },
    url: 'mudad.com.sa/dashboard'
  },
  {
    id: 'financing', fig: '07-financing-offers', crop: [0.225, 0.11, 0.775, 0.855],
    chapter: { en: 'Money before payday', ar: 'المال قبل يوم الرواتب' },
    caption: { en: 'One financing request goes to every eligible provider at once. Offers come back side by side.', ar: 'طلب تمويل واحد يصل إلى جميع الجهات المؤهلة دفعة واحدة، وتعود العروض جنباً إلى جنب.' },
    url: 'mudad.com.sa/financing'
  },
  {
    id: 'onboarding', fig: '08-financing-onboarding', crop: [0.045, 0.11, 0.955, 0.855],
    chapter: { en: 'Money before payday', ar: 'المال قبل يوم الرواتب' },
    caption: { en: 'Before the first request, four steps show how it works: start, add details, submit, then compare offers and sign.', ar: 'قبل الطلب الأول، أربع خطوات توضح الطريقة: ابدأ، أضف التفاصيل، أرسل، ثم قارن العروض ووقّع.' },
    url: 'mudad.com.sa/financing/how-it-works'
  },
  {
    id: 'ewa', fig: '05-earned-wage-access', crop: [0.035, 0.11, 0.975, 0.86],
    chapter: { en: 'Money before payday', ar: 'المال قبل يوم الرواتب' },
    caption: { en: 'Employers see every early-pay request in one list, with its status and the 48-hour window to approve or reject.', ar: 'ترى المنشأة كل طلبات الأجر المبكر في قائمة واحدة، مع حالتها ومهلة 48 ساعة للموافقة أو الرفض.' },
    url: 'mudad.com.sa/early-wage'
  },
  {
    id: 'ewa-payroll', fig: '06-ewa-in-payroll', crop: [0.205, 0.105, 0.795, 0.86],
    chapter: { en: 'Money before payday', ar: 'المال قبل يوم الرواتب' },
    caption: { en: 'Early-pay deductions settle inside the normal payroll run, each marked as not a wage protection violation.', ar: 'تُسوّى استقطاعات الأجر المبكر داخل مسيرة الرواتب المعتادة، وكل منها موسوم بأنه ليس مخالفة لحماية الأجور.' },
    url: 'mudad.com.sa/payroll/history'
  }
];
