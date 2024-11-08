import { CSPostHogProvider } from './providers'
import { GeistSans } from 'geist/font/sans';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="it" className={GeistSans.className}>
            <CSPostHogProvider>
                <body
                    className={`antialiased`}
                >
                    {children}
                </body>
            </CSPostHogProvider>
        </html>
    );
}