import type { Metadata } from 'next';
import { Geist, Geist_Mono, Orbitron } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';

import { ThemeProvider } from '@/components';
import { Navbar } from '@/components/navbar';
import { Preloader } from '@/components/preloader';
import ClickSpark from '@/components/ui/Spark';
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
        <NextTopLoader
          color="#acec00"
          shadow="0 0 10px #acec00, 0 0 5px #acec00"
          height={4}
          showSpinner
          showForHashAnchor
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Preloader />
          <ClickSpark
            sparkColor="#ACEC00"
            sparkSize={10}
            sparkRadius={15}
            sparkCount={8}
            duration={400}
          >
            <Navbar />
            <main role="main" id="main-content">
              {children}
            </main>

            <footer role="contentinfo" data-footer>
              {/* Footer component will be added here */}
            </footer>
          </ClickSpark>
        </ThemeProvider>
      </body>
    </html>
  );
}
