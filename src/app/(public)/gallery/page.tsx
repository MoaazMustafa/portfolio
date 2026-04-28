import type { Metadata } from 'next';

import { GalleryGrid } from '@/components/sections/gallery-grid';
import { getGalleryImages } from '@/lib/actions/gallery';
import { generatePageMetadata } from '@/lib/metadata';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = generatePageMetadata({
  title: 'Gallery',
  description:
    'From code to innovation - explore the gallery of Moaaz Mustafa showcasing professional journey, creative work, and tech community involvement.',
  keywords: [
    'Moaaz Mustafa gallery',
    'portfolio gallery',
    'professional photos',
    'tech events',
    'developer journey',
  ],
  canonical: '/gallery',
});

export default async function GalleryPage() {
  const images = await getGalleryImages();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: 'Moaaz Mustafa - Gallery',
    description:
      'Professional journey, creative work, and tech community involvement.',
    image: images.map((img) => ({
      '@type': 'ImageObject',
      url: img.url,
      name: img.title,
      description: img.alt,
      ...(img.width && { width: img.width }),
      ...(img.height && { height: img.height }),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="mx-auto max-w-7xl px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h1 className="text-foreground mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Gallery
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            From code to innovation — discover my professional journey, creative
            work, and tech community involvement.
          </p>
        </div>

        {images.length === 0 ? (
          <div className="text-muted-foreground py-20 text-center">
            <p className="text-lg">Gallery coming soon — stay tuned!</p>
          </div>
        ) : (
          <GalleryGrid images={images} />
        )}
      </section>
    </>
  );
}
