import type { Metadata, Viewport } from 'next';
import {
  Amiri,
  Aref_Ruqaa,
  Bowlby_One_SC,
  Grenze_Gotisch,
  Hanken_Grotesk,
  JetBrains_Mono,
  Newsreader,
  Noto_Naskh_Arabic
} from 'next/font/google';
import { STORAGE_KEY } from '@/lib/prefs';
import './globals.css';

const bowlby = Bowlby_One_SC({ weight: '400', subsets: ['latin'], variable: '--f-bowlby', display: 'swap' });
const grenze = Grenze_Gotisch({ weight: ['600', '800'], subsets: ['latin'], variable: '--f-grenze', display: 'swap' });
const newsreader = Newsreader({ style: ['normal', 'italic'], subsets: ['latin'], axes: ['opsz'], variable: '--f-newsreader', display: 'swap' });
const hanken = Hanken_Grotesk({ weight: ['400', '500', '600'], subsets: ['latin'], variable: '--f-hanken', display: 'swap' });
const mono = JetBrains_Mono({ weight: ['400', '500'], subsets: ['latin'], variable: '--f-mono', display: 'swap' });
const amiri = Amiri({ weight: ['400', '700'], style: ['normal', 'italic'], subsets: ['arabic', 'latin'], variable: '--f-amiri', display: 'swap' });
const ruqaa = Aref_Ruqaa({ weight: ['400', '700'], subsets: ['arabic', 'latin'], variable: '--f-ruqaa', display: 'swap' });
const naskh = Noto_Naskh_Arabic({ weight: ['400', '500', '600'], subsets: ['arabic'], variable: '--f-naskh', display: 'swap' });

const fontVars = [bowlby, grenze, newsreader, hanken, mono, amiri, ruqaa, naskh].map((f) => f.variable).join(' ');

export const metadata: Metadata = {
  title: 'Salman Binmandeel · Product Designer',
  description:
    'Salman Binmandeel, product designer in Riyadh. Payroll, subscriptions and dispatch tools for Mudad, Masdr, Jahez and One To X.'
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

// Runs before paint so the saved theme / language never flash. Dark is the default theme.
const prePaint = `try{var s=JSON.parse(localStorage.getItem('${STORAGE_KEY}')||'{}');var d=document.documentElement;d.dataset.theme=s.theme||'dark';d.dataset.lang=s.lang||'en';}catch(e){document.documentElement.dataset.theme='dark';document.documentElement.dataset.lang='en';}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" data-lang="en" className={fontVars} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: prePaint }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
