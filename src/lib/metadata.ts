import type { Metadata } from 'next';

interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  noIndex?: boolean;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://moaazmustafa.dev';
const defaultOgImage = `${baseUrl}/img/og-default.png`;

export function generatePageMetadata({
  title,
  description,
  keywords = [],
  ogImage = defaultOgImage,
  canonical,
  noIndex = false,
}: PageMetadata): Metadata {
  const fullTitle = title.includes('Moaaz Mustafa')
    ? title
    : `${title} | Moaaz Mustafa`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords.join(', ') : undefined,
    authors: [{ name: 'Moaaz Mustafa' }],
    creator: 'Moaaz Mustafa',
    publisher: 'Moaaz Mustafa',
    robots: noIndex ? 'noindex, nofollow' : 'index, follow',
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: canonical ? `${baseUrl}${canonical}` : baseUrl,
      title: fullTitle,
      description,
      siteName: 'MOAAZ MUSTAFA',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      creator: '@moaazmustafa',
    },
    alternates: {
      canonical: canonical ? `${baseUrl}${canonical}` : undefined,
    },
  };
}

export const defaultMetadata: Metadata = generatePageMetadata({
  title: 'Moaaz Mustafa - Software Engineer & Tech Enthusiast',
  description: 'Innovative Digital Solutions by Moaaz Mustafa',
  keywords: [
    'Moaaz Mustafa',
    'Moaaz Mustafa Portfolio',
    'Moaz Mustafa',
    'Muaz Mustafa',
    'Moaaz',
    'MOAAZ',
    'moaazmustafa.dev',
    'moaazmustafa',
    'maaz',
    'Muaz',
  ],
  canonical: '/',
});

// Reusable metadata for common pages
export const pageMetadata = {
  home: generatePageMetadata({
    title: 'Moaaz Mustafa - Software Engineer & Tech Enthusiast',
    description:
      'Explore the portfolio of Moaaz Mustafa — a software engineer crafting innovative digital solutions with modern web technologies. Discover projects, skills, and experiences.',
    keywords: [
      'Moaaz Mustafa',
      'Moaaz Mustafa Portfolio',
      'Software Engineer',
      'Full Stack Developer',
      'Web Developer',
      'Moaz Mustafa',
      'Muaz Mustafa',
      'Moaaz',
      'MOAAZ',
      'moaazmustafa.dev',
      'moaazmustafa',
      'maaz',
      'Muaz',
      'Next.js',
      'React',
      'TypeScript',
    ],
    ogImage: `${baseUrl}/opengraph-image`,
    canonical: '/',
  }),
};
