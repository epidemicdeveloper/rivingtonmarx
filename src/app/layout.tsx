import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';
export const metadata: Metadata = {
  title: {
    default: 'Rivington Marx Interiors | Denver Interior Design',
    template: '%s | Rivington Marx Interiors',
  },
  description:
    'A Denver-based boutique interior architecture and design firm. Explore residential interiors, services, and the Rivington Marx studio.',
  robots: { index: false, follow: false },
  openGraph: { type: 'website', siteName: 'Rivington Marx Interiors' },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
