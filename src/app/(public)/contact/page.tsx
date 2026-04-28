import type { Metadata } from 'next';

import { ContactSection } from '@/components/sections/contact-section';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Contact',
  description:
    "Get in touch with Moaaz Mustafa for collaboration, project inquiries, or just to say hello. Book a meeting or send a message — let's build something amazing together!",
  keywords: [
    'contact Moaaz Mustafa',
    'hire developer',
    'book meeting',
    'freelance developer Pakistan',
    'project inquiry',
  ],
  canonical: '/contact',
});

export default function ContactPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Moaaz Mustafa',
    description: 'Get in touch for collaboration or project inquiries.',
    url: 'https://www.moaazmustafa.dev/contact',
    mainEntity: {
      '@type': 'Person',
      name: 'Moaaz Mustafa',
      email: 'contactwithmoaaz@gmail.com',
      url: 'https://www.moaazmustafa.dev',
      jobTitle: 'Software Engineer',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'PK',
        addressLocality: 'Lahore',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactSection />
    </>
  );
}
