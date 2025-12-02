import type { Metadata } from 'next';

import { PageComingSoon } from '@/components/sections/page-coming-soon';

export const metadata: Metadata = {
  title: 'Contact | Moaaz Mustafa',
  description:
    "Get in touch with Moaaz Mustafa for collaboration, project inquiries, or just to say hello. Let's build something amazing together!",
};

export default function ContactPage() {
  return (
    <PageComingSoon
      title="Let's Connect"
      description="Building a seamless way for us to connect. Meanwhile, reach out at contactwithmoaaz@gmail.com"
    />
  );
}
