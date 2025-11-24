import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';

import { ThemeProvider } from '@/components';

import '@/styles/globals.css';
import ClickSpark from '../components/ui/Spark';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Moaaz Mustafa Portfolio - Software Engineer & Tech Enthusiast',
  description:
    "Welcome to Moaaz Mustafa's portfolio. Explore projects, skills, and experiences of a passionate software engineer and tech enthusiast.",
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon-16x16.png',
    apple: '/favicon/favicon-apple.png',
  },
  keywords: [
    'Moaaz Mustafa',
    'Maaz Mustafa Portfolio',
    'Moaaz',
    'Mustafa',
    'Maaz',
    'Mustafa',
    'Maaz Mustafa',
    'Muaz Mustafa Portfolio',
    'Muaz Mustafa',
    'Portfolio',
    'Software Developer',
    'Web Developer',
    'Full-Stack Developer',
    'Next.js',
    'TypeScript',
    'Tailwind CSS',
    'React',
    'JavaScript',
    'Frontend Developer',
    'Backend Developer',
    'Open Source',
    'GitHub',
    'Projects',
    'Tech Stack',
    'Testimonials',
    'Contact',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader
          color="#acec00"
          shadow="0 0 10px #acec00, 0 0 5px #acec00"
          height={4}
          showSpinner={true}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ClickSpark
            sparkColor="#ACEC00"
            sparkSize={10}
            sparkRadius={15}
            sparkCount={8}
            duration={400}
          >
            {children}
            {/* <Toaster position="top-right" richColors /> */}

            {/* Footer */}
            <div data-footer>{/* <Footer /> */}</div>
          </ClickSpark>
        </ThemeProvider>
      </body>
    </html>
  );
}
