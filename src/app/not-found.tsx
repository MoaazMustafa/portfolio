import { Home } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { CrowdCanvas } from '@/components/ui/skiper-ui/skiper39';

export const metadata: Metadata = {
  title: '404 - Page Not Found | Moaaz Mustafa',
  description:
    'The page you are looking for could not be found. Return to the homepage or browse other sections.',
  robots: 'noindex, nofollow',
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      {/* Canvas Crowd Background */}
      <CrowdCanvas src="/images/peeps/all-peeps.png" rows={15} cols={7} />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <div className="animate-fade-in-up space-y-8">
          {/* 404 Display */}
          <div className="relative">
            <h1
              className="font-orbitron text-primary text-[12rem] leading-none font-black sm:text-[16rem]"
              role="img"
              aria-label="Error 404"
            >
              404
            </h1>
            <div className="bg-primary/20 absolute inset-0 -z-10 animate-pulse rounded-full blur-3xl" />
          </div>

          {/* Subheading */}
          <h2 className="text-foreground text-3xl font-bold sm:text-4xl md:text-5xl">
            You are lost
          </h2>

          {/* Home Button */}
          <div className="flex items-center justify-center pt-4">
            <Link href="/" aria-label="Return to homepage">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 text-lg"
              >
                <Home className="h-5 w-5" aria-hidden="true" />
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
