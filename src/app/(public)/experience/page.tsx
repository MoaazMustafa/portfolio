import type { Metadata } from 'next';

import { PageComingSoon } from '@/components/sections/page-coming-soon';

export const metadata: Metadata = {
  title: 'Experience | Moaaz Mustafa',
  description:
    'Professional experience, skills, and career journey of Moaaz Mustafa in software engineering and technology.',
};

export default function ExperiencePage() {
  return (
    <PageComingSoon
      title="My Experience"
      description="From code to innovation - discover my professional journey, technical expertise, and career milestones."
    />
  );
}
