import type { Metadata } from 'next';
import { Geist, Geist_Mono, Orbitron } from 'next/font/google';

import {
  ClientLayoutProvider,
  DevToolsProvider,
  Footer,
  ScrollBar,
  ThemeProvider,
} from '@/components';
import { Navbar } from '@/components/navbar';
import { Preloader } from '@/components/preloader';
import { defaultMetadata } from '@/lib/metadata';

import '@/styles/globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

const orbitron = Orbitron({
  variable: '--font-orbitron',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  ...defaultMetadata,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || 'https://moaazmustafa.dev',
  ),
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon-16x16.png',
    apple: '/favicon/favicon-apple.png',
  },
};

interface RootLayoutProps {
  readonly children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <DevToolsProvider>
            <ScrollBar />
            <Preloader>
              <ClientLayoutProvider>
                <Navbar />
                <main role="main" id="main-content">
                  {children}
                </main>
                <Footer />
              </ClientLayoutProvider>
            </Preloader>
          </DevToolsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
