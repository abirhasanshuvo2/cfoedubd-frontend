import type { Metadata } from 'next';
import { Hind_Siliguri, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { CfoProvider } from '@/context/CfoContext';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';

const hindSiliguri = Hind_Siliguri({
  subsets: ['bengali', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-hind',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Chartered Officer Limited | CFO Bangladesh - cfoedubd.com',
  description: "Chartered Officer Limited (COL) & The CFO Foundation of Bangladesh. Premier professional skill development institute for Chartered Financial Officer (CFO), Customs, VAT & TAX, Fintech, and Supply Chain programs.",
  openGraph: {
    title: 'Chartered Officer Limited | CFO Bangladesh',
    description: "Empowering Financial Leaders & Corporate Executives in Bangladesh. BTEB registered professional diplomas and certifications.",
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chartered Officer Limited | CFO Bangladesh',
    description: "Empowering Financial Leaders & Corporate Executives in Bangladesh. BTEB registered professional diplomas and certifications.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className={`${hindSiliguri.variable} ${plusJakarta.variable}`}>
      <body className="font-sans antialiased bg-[#F8FAFC] text-slate-900 selection:bg-[#c8963e] selection:text-white" suppressHydrationWarning>
        <CfoProvider>
          {children}
          <WhatsAppFloatingButton />
        </CfoProvider>
      </body>
    </html>
  );
}

