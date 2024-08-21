import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google"
import "./globals.css";
import { cn } from "@/lib/utils"
import { Analytics } from '@vercel/analytics/react';

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Maisome - Case in vendita",
  description: "Stai cercando la casa perfetta? Maisome.it è la soluzione che fa per te. Abbiamo raccolto migliaia di annunci da tutti i principali portali immobiliari in un'unica piattaforma facile da usare.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
