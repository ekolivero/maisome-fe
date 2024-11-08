import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from '@vercel/analytics/react';
import { VercelToolbar } from '@vercel/toolbar/next';
import { IubendaProvider, IubendaCookieSolutionBannerConfigInterface } from '@mep-agency/next-iubenda';
import { GeistSans } from 'geist/font/sans';


const iubendaBannerConfig: IubendaCookieSolutionBannerConfigInterface = {
  siteId: 3761822, // Your site ID
  cookiePolicyId: 63674272, // Your cookie policy ID
  lang: 'it',
  // See https://www.iubenda.com/en/help/1205-how-to-configure-your-cookie-solution-advanced-guide
};


export const metadata: Metadata = {
  title: "Maisome - Case in vendita",
  description: "Stai cercando la casa perfetta? Maisome.it è la soluzione che fa per te. Abbiamo raccolto migliaia di annunci da tutti i principali portali immobiliari in un'unica piattaforma facile da usare.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const shouldInjectToolbar = process.env.NODE_ENV === 'development';
  return (
    <html lang="it" className={GeistSans.className}>
      <body
        className={`antialiased`}
      >
        <IubendaProvider bannerConfig={iubendaBannerConfig}>
          {children}
          {shouldInjectToolbar && <VercelToolbar />}
          <Analytics />
        </IubendaProvider>
      </body>
    </html>
  );
}
