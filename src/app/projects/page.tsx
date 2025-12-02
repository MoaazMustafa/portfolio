import type { Metadata } from 'next';

import { PageComingSoon } from '@/components/sections/page-coming-soon';

export const metadata: Metadata = {
  title: 'Projects | Moaaz Mustafa',
  description:
    'Explore innovative projects and solutions built by Moaaz Mustafa. Web applications, mobile apps, and more.',
};

export default function ProjectsPage() {
  return (
    <PageComingSoon
      title="My Projects"
      description="I'm showcasing my best work and innovative solutions. A portfolio of cutting-edge projects is coming soon!"
    />
  );
}
