import type { Metadata } from 'next';

import { pageMetadata } from '@/lib/metadata';

import { AtAGlance, Hero, ProjectShowcase } from '../../components';
import { TechStack } from '../../components/sections/techStack';

export const metadata: Metadata = pageMetadata.home;

export const dynamic = 'force-dynamic';

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
