import type { RoleKey } from './projects';

export type Chapter = {
  k: RoleKey;
  art: 'monet' | 'slot';
  ph?: string;
  credit: string;
  line: { en: string; ar: string };
};

export const CHAPTERS: Chapter[] = [
  { k: 'strategy', art: 'slot', ph: 'Drop Hiroshige, Fireworks at Ryōgoku (1858), public domain on Wikimedia Commons', credit: 'Utagawa Hiroshige · Fireworks at Ryōgoku · 1858',
    line: { en: 'Choosing the problem worth solving, then the smallest change that solves it.', ar: 'اختيار المشكلة التي تستحق الحل، ثم أصغر تغيير يحلّها.' } },
  { k: 'research', art: 'monet', credit: 'Claude Monet · Water Lilies · 1906',
    line: { en: 'Sitting with the people who use it until the real problem shows up.', ar: 'الجلوس مع من يستخدم المنتج حتى تظهر المشكلة الحقيقية.' } },
  { k: 'visual', art: 'slot', ph: 'Drop Alphonse Mucha, The Seasons: Spring (1896), public domain on Wikimedia Commons', credit: 'Alphonse Mucha · The Seasons: Spring · 1896',
    line: { en: 'Making the calm version look as calm as it is.', ar: 'أن تبدو النسخة الهادئة بالهدوء الذي هي عليه.' } }
];

type ExpCopy = { date: string; co: string; sub?: string; role: string; back: string; cta: string };
/** `i` is the index of the project the swipe-reveal opens. Most recent first. */
export const EXP: { i: number; cur?: boolean; en: ExpCopy; ar: ExpCopy }[] = [
  { i: 3, cur: true,
    en: { date: 'Nov 2025 — Present', co: 'One To X', role: 'Co-Founder & Product Designer', back: 'Batch scan: 30–50s → 15–20s', cta: 'One To X' },
    ar: { date: 'نوفمبر 2025 — الآن', co: 'One To X', role: 'شريك مؤسس ومصمم منتجات', back: 'المسح الجماعي: من 30–50 إلى 15–20 ثانية', cta: 'One To X' } },
  { i: 1,
    en: { date: 'May 2025 — Nov 2025', co: 'Masdr', role: 'Senior Product Designer', back: 'Sole designer on Mudad Payroll; subscriptions proposal taken into development', cta: 'Subscriptions' },
    ar: { date: 'مايو 2025 — نوفمبر 2025', co: 'مصدر', role: 'مصمم منتجات أول', back: 'رواتب مُدد ومقترح اشتراكات بمبادرة شخصية', cta: 'الاشتراكات' } },
  { i: 0,
    en: { date: 'Oct 2023 — May 2025', co: 'Masdr', sub: 'Formerly GOSI Business Development', role: 'Product Designer / UX Analyst', back: 'CSAT 79% → 82%, NPS 43 → 50.9', cta: 'Mudad Payroll' },
    ar: { date: 'أكتوبر 2023 — مايو 2025', co: 'مصدر', sub: 'تطوير أعمال التأمينات الاجتماعية سابقاً', role: 'مصمم منتجات / محلل تجربة مستخدم', back: 'رضا العملاء من 79% إلى 82%، وNPS من 43 إلى 50.9', cta: 'مُدد: الرواتب' } },
  { i: 2,
    en: { date: 'Mar 2023 — Sep 2023', co: 'Jahez', role: 'Product Designer', back: 'Five tabs folded into one dispatch screen', cta: 'Saned Dispatch' },
    ar: { date: 'مارس 2023 — سبتمبر 2023', co: 'جاهز', role: 'مصمم منتجات', back: 'تبويبات متعددة في شاشة توزيع واحدة', cta: 'سانِد' } }
];

type Skill = { t: string; b: string; seen: string };
export const SKILLS: { en: Skill[]; ar: Skill[] } = {
  en: [
    { t: 'Product strategy', b: 'Figuring out what’s worth building before anyone opens Figma. Salary financing ended up inside Mudad Payroll because that’s where companies actually run short.', seen: 'Mudad Payroll' },
    { t: 'Flow surgery', b: 'Taking steps out instead of adding screens. Payroll went from three steps to two, and CSAT moved from 79% to 82%.', seen: 'Mudad Payroll' },
    { t: 'Billing & pricing logic', b: 'Proration, renewals, downgrades mid-cycle. The edge cases that decide whether people trust you with their card.', seen: 'Subscriptions' },
    { t: 'Ops & internal tools', b: 'Dense screens for people who use them for an entire shift. Fewer tabs, a clear history, faster calls.', seen: 'Saned' },
    { t: 'Arabic-first interfaces', b: 'RTL layouts that don’t feel like a mirrored English site, with type that holds up in both scripts. Hit ع in the menu.', seen: 'This site' },
    { t: 'Interaction & motion', b: 'Making waiting feel shorter. Batch scan in One To X dropped from 30–50 seconds to 15–20, and the motion covers the rest.', seen: 'One To X' }
  ],
  ar: [
    { t: 'استراتيجية المنتج', b: 'أحدد ما يستحق البناء قبل أن يفتح أحد فيغما. وُضع تمويل الرواتب داخل مسيرة الرواتب لأن هناك تحديداً تنقص السيولة.', seen: 'مُدد: الرواتب' },
    { t: 'جراحة التدفقات', b: 'أحذف خطوات بدل أن أضيف شاشات. انتقلت الرواتب من ثلاث خطوات إلى خطوتين، وارتفع رضا العملاء من 79% إلى 82%.', seen: 'مُدد: الرواتب' },
    { t: 'منطق الفوترة والتسعير', b: 'التناسب، والتجديد، والتخفيض في منتصف الدورة. الحالات الحدّية التي تحدد إن كان الناس سيأتمنونك على بطاقتهم.', seen: 'الاشتراكات' },
    { t: 'الأدوات الداخلية', b: 'شاشات كثيفة لأشخاص يستخدمونها طوال المناوبة. تبويبات أقل، وسجل واضح، ومكالمات أسرع.', seen: 'سانِد' },
    { t: 'واجهات عربية أولاً', b: 'تخطيطات من اليمين لليسار لا تبدو كموقع إنجليزي معكوس، وخطوط تصمد في اللغتين. جرّب زر EN في القائمة.', seen: 'هذا الموقع' },
    { t: 'التفاعل والحركة', b: 'أجعل الانتظار يبدو أقصر. انخفض المسح الجماعي في One To X من 30–50 ثانية إلى 15–20، والحركة تتكفّل بالباقي.', seen: 'One To X' }
  ]
};

export type Team =
  | { kind: 'logo'; logo: string; w: number; h: number; name: string; yrs: string }
  | { kind: 'word'; word: string; name: string; yrs: string };

export const TEAMS: Team[] = [
  { kind: 'logo', logo: '/assets/jahez.svg', w: 118, h: 52, name: 'Jahez', yrs: '2023' },
  { kind: 'logo', logo: '/assets/masdr.svg', w: 42, h: 62, name: 'Masdr', yrs: '2025' },
  { kind: 'word', word: 'GOSI', name: 'GOSI Business Dev.', yrs: '2023–25' },
  { kind: 'word', word: 'One To X', name: 'Co-founder', yrs: '2025–' }
];

export const PRINCIPLES = [
  { n: '01', h: { en: 'Follow the money through the flow.', ar: 'تتبّع المال داخل التجربة.' },
    p: { en: 'Payroll and subscriptions taught me that every extra step costs someone real cash or real time. I map where that happens before I open Figma.', ar: 'علّمتني الرواتب والاشتراكات أن كل خطوة زائدة تكلّف أحدهم مالاً أو وقتاً. أحدد أين يحدث ذلك قبل أن أفتح فيغما.' } },
  { n: '02', h: { en: 'Warn before, not after.', ar: 'نبّه قبل، لا بعد.' },
    p: { en: 'The most useful error message shows up before you hit submit. That’s where Mudad’s pre-submission alerts came from.', ar: 'أنفع رسالة خطأ هي التي تظهر قبل أن تضغط إرسال. من هنا جاءت تنبيهات ما قبل الإرسال في مُدد.' } },
  { n: '03', h: { en: 'One screen beats five tabs.', ar: 'شاشة واحدة أفضل من خمسة تبويبات.' },
    p: { en: 'If someone needs a second monitor to do their job, that’s a design bug. Saned is the example I keep coming back to.', ar: 'إذا احتاج أحدهم شاشة ثانية ليؤدي عمله، فهذه مشكلة تصميم. سانِد هو المثال الذي أعود إليه دائماً.' } },
  { n: '04', h: { en: 'Read the numbers first.', ar: 'اقرأ الأرقام أولاً.' },
    p: { en: 'I came up as a UX analyst, so I’d rather look at CSAT and NPS than argue about a redesign in a meeting.', ar: 'بدأت محللاً لتجربة المستخدم، لذا أفضّل النظر في رضا العملاء وNPS على الجدال حول إعادة التصميم في اجتماع.' } }
];
