import type { Metadata } from 'next';

import ComingSoon from '@/components/sections/coming-soon';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata.home;

// Enable static generation with revalidation
export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  return (
    <div className="bg-background min-h-screen">
      <ComingSoon />
    </div>
  );
}
