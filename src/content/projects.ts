import type { Bi } from './site';

export type RoleKey = 'strategy' | 'research' | 'visual';

export const ROLES: { k: RoleKey; en: string; ar: string }[] = [
  { k: 'strategy', en: 'Strategy', ar: 'استراتيجية' },
  { k: 'research', en: 'Research', ar: 'بحث' },
  { k: 'visual', en: 'Visual', ar: 'بصري' }
];

export type Figure = { src: string; alt: string };

const FIG: Record<string, [string, string]> = {
  '01': ['01-auto-payroll-off-on', 'Two payroll screens side by side: auto payroll off, and on with a new end-month field.'],
  '02': ['02-warn-before-submit', 'Payroll summary with wage protection warnings on employee rows and the expected compliance rate.'],
  '03': ['03-one-code-five-months', 'Verification dialog confirming auto payroll from January to May 2024 with one code.'],
  '04': ['04-dashboard-status', 'Payroll dashboard card showing the next transfer, next deduction date and when auto payroll ends.'],
  '05': ['05-earned-wage-access', 'Earned wage access request list with statuses, and a request detail panel.'],
  '06': ['06-ewa-in-payroll', 'Payroll history with early-pay deductions inside the payroll run, marked as not a wage protection violation.'],
  '07': ['07-financing-offers', 'Payroll financing request with offers from five providers compared side by side.'],
  '08': ['08-financing-onboarding', 'Payroll financing onboarding explaining the four steps before the first request.'],
  '09': ['09-old-to-new-system', 'Mudad before and after: the old blue top-navigation dashboard and the new side-navigation design system.']
};
const figOf = (id: string): Figure => ({ src: '/assets/mudad/' + FIG[id][0] + '.webp', alt: FIG[id][1] });

export type Beat = { h: string; p: string; k?: string };
export type CaseCopy = {
  tag: string;
  org: string;
  role: string;
  summary: string;
  metrics: { v: string; l: string }[];
  beats: Beat[];
};
export type ProjectCopy = { title: string; client: string; blurb: string; cs: CaseCopy };

export type Project = {
  key: string;
  slot: string;
  bg: string;
  frame: 'browser' | 'phone';
  roles: RoleKey[];
  ph: string;
  beatPh: string[];
  /** Finished figures per beat: first is the lead, the rest go in the 2-up grid. */
  figures?: Figure[][];
  hero?: Figure;
  en: ProjectCopy;
  ar: ProjectCopy;
};

export const PROJECTS: Project[] = [
  {
    key: 'payroll', slot: 'work-payroll', bg: '#2E5547', frame: 'browser', roles: ['strategy', 'research'],
    hero: { src: '/assets/mudad/hero-auto-payroll.webp', alt: 'Mudad payroll dashboard showing the auto payroll card, with the verification code dialog in front.' },
    figures: [['09'], ['02', '01', '03'], ['07', '08', '05', '06'], ['04']].map((b) => b.map(figOf)),
    ph: 'Drop a Mudad Payroll screenshot (full-page works best)',
    beatPh: ['Drop the old 3-step flow', 'Drop the 2-step payroll flow', 'Drop the salary financing screen'],
    en: {
      title: 'Mudad Payroll', client: 'Masdr',
      blurb: 'Payroll used to take three steps and a bit of hoping. We got it to two, added Autopayroll, moved the warnings to before you submit, and put salary financing right where cash gets tight.',
      cs: {
        tag: 'Business thinking', org: 'Masdr', role: 'Sole product designer in the squad',
        summary: 'Mudad runs Saudi Arabia’s wage protection program: more than 900,000 private-sector establishments and 8.5 million employees, about SAR 35 billion in wages a month. As the only product designer on the payroll squad, I worked on making payday less of a gamble: fewer steps, warnings before submission, and financing right where cash runs short.',
        metrics: [{ v: '79% → 82%', l: 'CSAT' }, { v: '43 → 50.9', l: 'NPS' }, { v: '3 → 2', l: 'Steps to run payroll' }],
        beats: [
          { h: 'Three steps and a bit of hoping', p: 'Running payroll took three steps, and most problems only showed up after you’d submitted. By then, fixing them meant support tickets and late salaries.' },
          { h: 'Two steps, warnings first', p: 'I folded the flow into two steps, added Autopayroll for companies that pay the same way every month, and moved the checks up front. Salary financing sits right where a company sees it can’t cover the run.' },
          { h: 'Money before payday', k: 'Move', p: '[Body text to come]' },
          { h: 'Calmer paydays', p: 'CSAT went from 79% to 82% and NPS from 43 to 50.9. Three steps became two, which is the number I’m proudest of.' }
        ]
      }
    },
    ar: {
      title: 'مُدد: الرواتب', client: 'مصدر',
      blurb: 'كانت مسيرة الرواتب ثلاث خطوات وشيئاً من الأمل. اختصرناها إلى خطوتين، وأضفنا الرواتب التلقائية، ونقلنا التنبيهات إلى ما قبل الإرسال، ووضعنا تمويل الرواتب في اللحظة التي تضيق فيها السيولة.',
      cs: {
        tag: 'تفكير تجاري', org: 'مصدر', role: 'المصمم الوحيد للمنتج في الفريق',
        summary: 'تشغّل مُدد برنامج حماية الأجور في السعودية: أكثر من 900 ألف منشأة في القطاع الخاص و8.5 مليون موظف، ونحو 35 مليار ريال من الأجور شهرياً. بصفتي المصمم الوحيد في فريق الرواتب، عملت على جعل يوم الرواتب أقل مخاطرة: خطوات أقل، وتنبيهات قبل الإرسال، وتمويل في اللحظة التي تنقص فيها السيولة.',
        metrics: [{ v: '79% ← 82%', l: 'رضا العملاء' }, { v: '43 ← 50.9', l: 'NPS' }, { v: '3 ← 2', l: 'خطوات مسيرة الرواتب' }],
        beats: [
          { h: 'ثلاث خطوات وشيء من الأمل', p: 'كانت المسيرة ثلاث خطوات، ومعظم المشاكل لا تظهر إلا بعد الإرسال. وحينها يعني إصلاحها تذاكر دعم ورواتب متأخرة.' },
          { h: 'خطوتان، والتنبيه أولاً', p: 'اختصرت التدفق إلى خطوتين، وأضفت الرواتب التلقائية للمنشآت التي تدفع بالطريقة نفسها كل شهر، ونقلت الفحوصات إلى البداية. ويظهر تمويل الرواتب في اللحظة التي ترى فيها المنشأة أنها لا تستطيع تغطية المسيرة.' },
          { h: 'المال قبل يوم الرواتب', k: 'الحل', p: '[النص لاحقاً]' },
          { h: 'أيام رواتب أهدأ', p: 'ارتفع رضا العملاء من 79% إلى 82%، وNPS من 43 إلى 50.9. وأصبحت الخطوات الثلاث خطوتين، وهو الرقم الذي أفخر به أكثر.' }
        ]
      }
    }
  },
  {
    key: 'subs', slot: 'work-subs-1', bg: '#4E5A86', frame: 'browser', roles: ['strategy'],
    ph: 'Drop the plans / billing screen',
    beatPh: ['Drop a renewal charge / statement', 'Drop the proration / plan change screen', 'Drop the renewal notice'],
    en: {
      title: 'Mudad Subscriptions', client: 'Masdr · Self-initiated',
      blurb: 'Nobody asked for this one. Renewals felt like a trap, so I rewrote the rules: you’re told before you’re charged, and upgrades or downgrades are prorated to the day.',
      cs: {
        tag: 'Strategy', org: 'Masdr · self-initiated', role: 'Product Designer',
        summary: 'Nobody assigned this one. Renewals felt like a trap to the companies paying for them, so I redesigned how auto-renewal, upgrades and downgrades work.',
        metrics: [{ v: 'Fair', l: 'Auto-renewal, announced ahead' }, { v: 'Prorated', l: 'Upgrades & downgrades' }],
        beats: [
          { h: 'Found out from the bank statement', p: 'A plan renewed, money moved, and the company found out later. I kept hearing it while working on payroll, so I picked it up without a brief.' },
          { h: 'Rules before screens', p: 'You’re told before you’re charged. Upgrades and downgrades are prorated to the day, and the screen shows the math so nobody has to take my word for it.' },
          { h: 'From proposal to roadmap', p: 'I presented it to the team and it moved into active work while I was there. It shows how I work without a brief: find the pain, set the rules, then design.' }
        ]
      }
    },
    ar: {
      title: 'مُدد: الاشتراكات', client: 'مصدر · بمبادرة شخصية',
      blurb: 'لم يطلب أحد هذا المشروع. كان التجديد يبدو كالفخ، فأعدت كتابة القواعد: تُنبَّه قبل أن يُخصم منك، والترقية أو التخفيض محسوبان بالأيام.',
      cs: {
        tag: 'استراتيجية', org: 'مصدر · بمبادرة شخصية', role: 'مصمم منتجات',
        summary: 'لم يكلّفني أحد بهذا المشروع. كان التجديد يبدو كالفخ للمنشآت التي تدفع، فأعدت تصميم طريقة عمل التجديد التلقائي والترقية والتخفيض.',
        metrics: [{ v: 'عادل', l: 'تجديد تلقائي بإشعار مسبق' }, { v: 'بالتناسب', l: 'الترقية والتخفيض' }],
        beats: [
          { h: 'عرفوا من كشف الحساب', p: 'تتجدد الباقة، ويُخصم المبلغ، وتعرف المنشأة لاحقاً. سمعت هذه الشكوى مراراً أثناء عملي على الرواتب، فبدأت فيها دون موجز.' },
          { h: 'القواعد قبل الشاشات', p: 'تُنبَّه قبل أن يُخصم منك. والترقية والتخفيض محسوبان بالأيام، والشاشة تعرض الحساب فلا أحد يحتاج أن يصدّقني على كلمتي.' },
          { h: 'من مقترح إلى خطة عمل', p: 'عرضته على الفريق وبدأ العمل عليه خلال فترة وجودي. يوضح كيف أعمل دون موجز: أجد الألم، أضع القواعد، ثم أصمّم.' }
        ]
      }
    }
  },
  {
    key: 'saned', slot: 'work-saned', bg: '#9C3F2C', frame: 'browser', roles: ['research'],
    ph: 'Drop the Saned dispatch screen',
    beatPh: ['Drop the old multi-tab setup', 'Drop the single-screen dispatch view', 'Drop the audit log screen'],
    en: {
      title: 'Saned Dispatch', client: 'Jahez',
      blurb: 'Call-center agents were jumping between tabs to dispatch one order. I folded them into a single screen and added an audit log, so anyone can see who changed what and when.',
      cs: {
        tag: 'Planning & systems', org: 'Jahez', role: 'Product Designer',
        summary: 'Saned is the tool Jahez’s call-center agents use to dispatch orders. Agents were jumping between tabs to handle one call, so I folded them into one screen and added an audit log.',
        metrics: [{ v: 'Tabs → 1', l: 'Screen per call' }, { v: 'Audit log', l: 'Who changed what, and when' }],
        beats: [
          { h: 'Silence on the line', p: 'Agents jumped between tabs to handle one order while a hungry customer waited. Every second hunting for a tab was a second of silence.' },
          { h: 'One screen, in call order', p: 'I mapped what agents look at during a call, in order, then put order, customer, courier and actions on one screen in that sequence.' },
          { h: 'Faster calls, clear history', p: 'One screen per call, plus an audit log that shows who changed what and when, so nobody gets blamed for an edit they didn’t make.' }
        ]
      }
    },
    ar: {
      title: 'سانِد: التوزيع', client: 'جاهز',
      blurb: 'كان موظفو مركز الاتصال يتنقلون بين عدة تبويبات لتوزيع طلب واحد. جمعتها في شاشة واحدة وأضفت سجل تدقيق يوضح من غيّر ماذا ومتى.',
      cs: {
        tag: 'تخطيط وأنظمة', org: 'جاهز', role: 'مصمم منتجات',
        summary: 'سانِد هي الأداة التي يستخدمها موظفو مركز الاتصال في جاهز لتوزيع الطلبات. كانوا يتنقلون بين تبويبات لمعالجة مكالمة واحدة، فجمعتها في شاشة واحدة وأضفت سجل تدقيق.',
        metrics: [{ v: 'شاشة واحدة', l: 'لكل مكالمة' }, { v: 'سجل تدقيق', l: 'من غيّر ماذا ومتى' }],
        beats: [
          { h: 'صمت على الخط', p: 'كان الموظفون يتنقلون بين التبويبات لمعالجة طلب واحد بينما ينتظر عميل جائع. كل ثانية في البحث عن تبويب هي ثانية صمت.' },
          { h: 'شاشة واحدة بترتيب المكالمة', p: 'رسمت ما ينظر إليه الموظفون أثناء المكالمة وبالترتيب، ثم وضعت الطلب والعميل والمندوب والإجراءات في شاشة واحدة بهذا التسلسل.' },
          { h: 'مكالمات أسرع وسجل واضح', p: 'شاشة واحدة لكل مكالمة، وسجل تدقيق يوضح من غيّر ماذا ومتى، فلا يُلام أحد على تعديل لم يقم به.' }
        ]
      }
    }
  },
  {
    key: 'onetox', slot: 'work-onetox-1', bg: '#7D9572', frame: 'phone', roles: ['visual', 'strategy'],
    ph: 'Drop the batch-scan screen',
    beatPh: ['Drop a group-expense moment', 'Drop a batch-scan screen', 'Drop a split / balance screen'],
    en: {
      title: 'One To X', client: 'Co-founder',
      blurb: 'A shared-expense app I’m co-founding. Batch receipt scanning used to take 30–50 seconds. Now it’s 15–20, and splitting the bill is the easy part of the night.',
      cs: {
        tag: 'Visual & product craft', org: 'One To X', role: 'Co-Founder & Product Designer',
        summary: 'A shared-expense app I’m co-founding. The goal is simple: splitting the bill should be the easiest part of the night out.',
        metrics: [{ v: '30–50s → 15–20s', l: 'Batch receipt scan' }],
        beats: [
          { h: 'Nobody wants to chase money', p: 'Splitting costs with friends gets awkward because the math is tedious and nobody wants to be the one asking.' },
          { h: 'Scan the whole stack', p: 'Batch receipt scanning with progress on each receipt, in a warm, calm look that feels closer to the group chat than a spreadsheet.' },
          { h: 'Half the wait', p: 'Batch scan went from 30–50 seconds to 15–20. As co-founder I also make the product calls, which mostly means saying no to features I’d love to design.' }
        ]
      }
    },
    ar: {
      title: 'One To X', client: 'شريك مؤسس',
      blurb: 'تطبيق لتقسيم المصاريف المشتركة أشارك في تأسيسه. كان مسح الفواتير دفعة واحدة يستغرق 30–50 ثانية، وأصبح 15–20 ثانية، وصار تقسيم الحساب أسهل جزء في السهرة.',
      cs: {
        tag: 'حِرفة بصرية', org: 'One To X', role: 'شريك مؤسس ومصمم منتجات',
        summary: 'تطبيق لتقسيم المصاريف المشتركة أشارك في تأسيسه. الهدف بسيط: أن يكون تقسيم الحساب أسهل جزء في السهرة.',
        metrics: [{ v: '15–20 ثانية', l: 'المسح الجماعي للفواتير (كان 30–50)' }],
        beats: [
          { h: 'لا أحد يريد ملاحقة المال', p: 'تقسيم المصاريف مع الأصدقاء محرج، لأن الحساب ممل ولا أحد يريد أن يكون من يطالب.' },
          { h: 'امسح الفواتير دفعة واحدة', p: 'مسح جماعي للفواتير مع مؤشر تقدّم لكل فاتورة، بشكل دافئ وهادئ أقرب إلى مجموعة الدردشة منه إلى جدول بيانات.' },
          { h: 'نصف وقت الانتظار', p: 'انخفض المسح الجماعي من 30–50 ثانية إلى 15–20. وبصفتي شريكاً مؤسساً أتخذ قرارات المنتج أيضاً، وهذا يعني غالباً رفض ميزات كنت سأستمتع بتصميمها.' }
        ]
      }
    }
  }
];

export const BEAT_KICKER: Record<'en' | 'ar', [string, string, string]> = {
  en: ['Problem', 'Move', 'Result'],
  ar: ['المشكلة', 'الحل', 'النتيجة']
};
export const MENU: Record<'en' | 'ar', string[]> = {
  en: ['Overview', 'Problem', 'Move', 'Result'],
  ar: ['نظرة عامة', 'المشكلة', 'الحل', 'النتيجة']
};

export const bi = (en: string, ar: string): Bi => ({ en, ar });
