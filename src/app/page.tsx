import type { Metadata } from 'next';

import { Hero } from '@/components/sections/hero';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata.home;

// Enable static generation with revalidation
export const revalidate = 3600; // Revalidate every hour

export default function Home() {
  return <Hero />;
}
