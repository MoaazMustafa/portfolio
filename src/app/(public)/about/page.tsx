import type { Metadata } from 'next';

import { AboutPage as AboutPageContent } from '@/components/sections/about-page';

export const metadata: Metadata = {
  title: 'About | Moaaz Mustafa',
  description:
    'Learn more about Moaaz Mustafa - Software Engineer, Tech Enthusiast, and Digital Solutions Expert.',
};

export default function AboutPage() {
  return <AboutPageContent />;
}
