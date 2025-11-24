import type { Metadata } from 'next';
import { Suspense } from 'react';

import ComingSoon from '@/components/sections/coming-soon';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata.home;

// Enable static generation with revalidation
export const revalidate = 3600; // Revalidate every hour

function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-muted-foreground animate-pulse">Loading...</div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ComingSoon
        title="Welcome to My Portfolio"
        description="I'm currently working on something amazing. This portfolio will showcase my projects, skills, and experiences as a software engineer and tech enthusiast."
        expectedDate="Q1 2025"
        notifyEmail="contactwithmoaaz@gmail.com"
      />
    </Suspense>
  );
}
