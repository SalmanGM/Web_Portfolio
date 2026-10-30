/**
 * Mudad Payroll story player: three tabs, three scenes each. A scene holds for SCENE_MS, then the
 * next one plays; after a tab's last scene the player moves on to the next tab and loops.
 * Each caption is a proof point from the case study, and doubles as the timeline under the stage.
 * The scene ids map to the illustrated scenes in src/components/lab/story-player.tsx.
 */
type T = { en: string; ar: string };
export type StoryScene = { id: string; title: T; body: T };
export type StoryTab = { id: string; label: T; scenes: StoryScene[] };

export const SCENE_MS = 3800;

export const STORY: StoryTab[] = [
  {
    id: 'payroll', label: { en: 'Payroll', ar: 'الرواتب' },
    scenes: [
      {
        id: 'auto',
        title: { en: 'Set it once', ar: 'جهّزها مرة واحدة' },
        body: { en: 'Turning Autopayroll on adds one field: the month it stops.', ar: 'تفعيل الرواتب التلقائية يضيف حقلاً واحداً: الشهر الذي تتوقف فيه.' }
      },
      {
        id: 'code',
        title: { en: 'One code, five months', ar: 'رمز واحد، خمسة أشهر' },
        body: { en: 'A single verification code confirms January to May.', ar: 'رمز تحقق واحد يؤكد الرواتب من يناير إلى مايو.' }
      },
      {
        id: 'warn',
        title: { en: 'Warnings first', ar: 'التنبيه أولاً' },
        body: { en: 'Wage protection issues show on each employee before you submit.', ar: 'تظهر مشكلات حماية الأجور على كل موظف قبل الإرسال.' }
      }
    ]
  },
  {
    id: 'financing', label: { en: 'Financing', ar: 'التمويل' },
    scenes: [
      {
        id: 'request',
        title: { en: 'One request', ar: 'طلب واحد' },
        body: { en: 'One standard request goes to every eligible provider at once.', ar: 'طلب موحّد يُرسل إلى جميع جهات التمويل المؤهلة دفعة واحدة.' }
      },
      {
        id: 'offers',
        title: { en: 'Offers side by side', ar: 'العروض جنباً إلى جنب' },
        body: { en: 'The offers come back together, ready to compare.', ar: 'تعود العروض معاً، جاهزة للمقارنة.' }
      },
      {
        id: 'sign',
        title: { en: 'Sign with a code', ar: 'وقّع برمز' },
        body: { en: 'Pick one, then sign the contract with a one-time code.', ar: 'اختر عرضاً، ثم وقّع العقد برمز لمرة واحدة.' }
      }
    ]
  },
  {
    id: 'ewa', label: { en: 'Early wage access', ar: 'الأجر المبكر' },
    scenes: [
      {
        id: 'earned',
        title: { en: 'Pay already earned', ar: 'أجر مكتسب' },
        body: { en: 'Employees can ask for part of what they’ve earned this month.', ar: 'يمكن للموظف طلب جزء مما اكتسبه هذا الشهر.' }
      },
      {
        id: 'approve',
        title: { en: 'One list, 48 hours', ar: 'قائمة واحدة، 48 ساعة' },
        body: { en: 'Employers see every request in one list, with 48 hours to decide.', ar: 'ترى المنشأة كل الطلبات في قائمة واحدة، ولديها 48 ساعة للقرار.' }
      },
      {
        id: 'settle',
        title: { en: 'Settled in payroll', ar: 'تُسوّى في المسيرة' },
        body: { en: 'The deduction settles inside the normal run, marked as not a violation.', ar: 'يُسوّى الاستقطاع داخل المسيرة المعتادة، موسوماً بأنه ليس مخالفة.' }
      }
    ]
  }
];
