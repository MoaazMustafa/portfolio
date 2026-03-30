import type { Metadata } from 'next';

import { pageMetadata } from '@/lib/metadata';

import { AtAGlance, Hero, ProjectShowcase } from '../../components';
import { TechStack } from '../../components/sections/techStack';

export const metadata: Metadata = pageMetadata.home;

// Enable static generation with revalidation
export const revalidate = 3600; // Revalidate every hour

export default function Home() {
  return (
    <>
      <Hero />
      <AtAGlance />
      <TechStack />
      <ProjectShowcase />
    </>
  );
}
