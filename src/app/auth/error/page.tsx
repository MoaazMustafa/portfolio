'use client';

import { AuroraBackground } from '@/components/ui/aurora-background';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="z-10 w-full max-w-md overflow-hidden rounded-xl border border-red-500/30 bg-black/40 p-8 shadow-[0_8px_16px_rgb(0_0_0/0.4)] backdrop-blur-md">
      <div className="mb-6 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 text-red-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      </div>
      <h1 className="mb-2 text-center text-2xl font-bold text-white">
        Authentication Error
      </h1>
      <p className="mb-6 text-center text-gray-300">
        {error === 'AccessDenied'
          ? 'You do not have permission to access this area. Only authorized administrators can log in.'
          : 'An unexpected error occurred during authentication. Please try again.'}
      </p>

      <div className="flex justify-center">
        <Button
          asChild
          variant="outline"
          className="border-white/20 text-black hover:bg-white/10 hover:text-white"
        >
          <Link href="/signin">Return to Sign In</Link>
        </Button>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <AuroraBackground className="flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <ErrorContent />
      </Suspense>
    </AuroraBackground>
  );
}
