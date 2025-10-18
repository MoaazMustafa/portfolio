import type { Metadata } from 'next';

import { pageMetadata } from '@/lib/metadata';
import { ThemeToggle } from '@/components';
import ComingSoon from '@/components/sections/coming-soon';


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
