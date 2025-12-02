import type { Metadata } from 'next';

import { PageComingSoon } from '@/components/sections/page-coming-soon';

export const metadata: Metadata = {
  title: 'About | Moaaz Mustafa',
  description:
    'Learn more about Moaaz Mustafa - Software Engineer, Tech Enthusiast, and Digital Solutions Expert.',
};

export default function AboutPage() {
  return (
    <PageComingSoon
      title="About Me"
      description="I'm crafting an engaging story about my journey, skills, and passion for technology. Stay tuned!"
    />
  );
}
