import type { Metadata } from 'next';

import { PageComingSoon } from '@/components/sections/page-coming-soon';

export const metadata: Metadata = {
  title: 'Gallery | Moaaz Mustafa',
  description:
    'From code to innovation - explore the gallery of Moaaz Mustafa showcasing professional journey, creative work, and tech community involvement.',
};

export default function ExperiencePage() {
  return (
    <PageComingSoon
      title="Gallery"
      description="From code to innovation - discover my professional journey, technical expertise, and career milestones."
    />
  );
}
