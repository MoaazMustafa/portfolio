'use client';

import type { GalleryImage } from '@prisma/client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

interface GalleryGridProps {
  images: GalleryImage[];
}

const categories = [
  { value: 'all', label: 'All' },
  { value: 'photography', label: 'Photography' },
  { value: 'events', label: 'Events' },
  { value: 'work', label: 'Work' },
  { value: 'general', label: 'General' },
];

export function GalleryGrid({ images }: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const filtered =
    activeCategory === 'all'
      ? images
      : images.filter((img) => img.category === activeCategory);

  const availableCategories = categories.filter(
    (cat) =>
      cat.value === 'all' || images.some((img) => img.category === cat.value),
  );

  // Close lightbox on Escape
  useEffect(() => {
    if (!selectedImage) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedImage(null);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [selectedImage]);

  return (
    <>
      {/* Category filter */}
      {availableCategories.length > 2 && (
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {availableCategories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-all',
                activeCategory === cat.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80',
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Masonry grid with parallax */}
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {filtered.map((image, index) => (
          <ParallaxImageCard
            key={image.id}
            image={image}
            index={index}
            onClick={() => setSelectedImage(image)}
          />
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <Lightbox
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  );
}

function ParallaxImageCard({
  image,
  index,
  onClick,
}: {
  image: GalleryImage;
  index: number;
  onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="mb-4 break-inside-avoid"
    >
      <motion.div
        style={{ y }}
        className="group relative cursor-pointer overflow-hidden rounded-xl"
        onClick={onClick}
      >
        <Image
          src={image.url}
          alt={image.alt}
          width={image.width || 600}
          height={image.height || 400}
          className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading={index < 6 ? 'eager' : 'lazy'}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/40" />
        <div className="absolute inset-x-0 bottom-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
          <h3 className="text-sm font-semibold text-white">{image.title}</h3>
          {image.description && (
            <p className="mt-1 text-xs text-white/80">{image.description}</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function Lightbox({
  image,
  onClose,
}: {
  image: GalleryImage;
  onClose: () => void;
}) {
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-label={`Viewing: ${image.title}`}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
        aria-label="Close lightbox"
      >
        <X className="h-6 w-6" />
      </button>
      <div className="relative max-h-[90vh] max-w-[90vw]">
        <Image
          src={image.url}
          alt={image.alt}
          width={image.width || 1200}
          height={image.height || 800}
          className="max-h-[85vh] w-auto rounded-lg object-contain"
          priority
        />
        {(image.title || image.description) && (
          <div className="absolute inset-x-0 bottom-0 rounded-b-lg bg-black/60 p-4">
            <h2 className="text-lg font-semibold text-white">{image.title}</h2>
            {image.description && (
              <p className="mt-1 text-sm text-white/80">{image.description}</p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
