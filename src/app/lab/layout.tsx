import type { Metadata } from 'next';

// Sandboxes for trying ideas before they reach the real page. Kept out of search results.
export const metadata: Metadata = { title: 'Lab · Salman Binmandeel', robots: { index: false, follow: false } };

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return children;
}
