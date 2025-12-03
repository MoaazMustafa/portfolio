import type { Metadata } from 'next';

import { pageMetadata } from '@/lib/metadata';

import ComingSoon from '../components/sections/coming-soon';

export const metadata: Metadata = pageMetadata.home;

// Enable static generation with revalidation
export const revalidate = 3600; // Revalidate every hour

export default function Home() {
  return <ComingSoon />;
}
