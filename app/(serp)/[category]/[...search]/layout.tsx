import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import { CSPostHogProvider } from './providers'


const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
})

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="it">
            <CSPostHogProvider>
            <body
                className={cn(
                    "min-h-screen bg-background font-sans antialiased",
                    fontSans.variable
                )}
            >
                {children}    
                </body>
            </CSPostHogProvider>
        </html>
    );
}