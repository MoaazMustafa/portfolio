'use client';

import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';

export function ImageGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!images || images.length === 0) return null;

  const collapsedHeightClass = 'max-h-[640px]';
  const expandedHeightClass = 'max-h-[9999px]';

  return (
    <>
      <div
        className={`group border-border/40 bg-background/60 relative overflow-hidden rounded-2xl border shadow-sm transition-[max-height] duration-500 ease-in-out ${
          isExpanded ? expandedHeightClass : collapsedHeightClass
        }`}
      >
        <div className="columns-1 gap-4 space-y-4 px-4 py-4 sm:columns-2">
          {/* Image items */}
          {images.map((img, i) => (
            <div
              key={i}
              className="group/item relative break-inside-avoid overflow-hidden rounded-xl"
            >
              <button
                type="button"
                className="relative block w-full cursor-pointer overflow-hidden text-left"
                onClick={() => setSelectedImage(img)}
              >
                <Image
                  src={img}
                  alt={`${title} screenshot ${i + 1}`}
                  width={0}
                  height={0}
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="h-auto w-full transition-transform duration-300 group-hover/item:scale-[1.01]"
                />
              </button>
            </div>
          ))}
        </div>

        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-linear-to-t from-black/90 via-black/45 to-transparent transition-opacity duration-300 ${
            isExpanded ? 'opacity-0' : 'opacity-100'
          }`}
        />

        <div className="absolute inset-x-0 bottom-0 flex justify-center p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Button
            type="button"
            size="sm"
            className="pointer-events-auto border border-white/15 bg-black/80 px-5 text-white shadow-lg backdrop-blur-md hover:bg-black/90"
            onClick={() => setIsExpanded((current) => !current)}
          >
            {isExpanded ? 'Collapse' : 'View'}
          </Button>
        </div>
      </div>

      <Dialog
        open={!!selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
      >
        <DialogContent className="flex w-full max-w-7xl items-center justify-center border-none bg-transparent p-1 shadow-none">
          <DialogTitle className="sr-only">Image preview</DialogTitle>
          <DialogDescription className="sr-only">
            Preview of {title}
          </DialogDescription>

          {selectedImage && (
            <div className="relative h-[85vh] w-full">
              <Image
                src={selectedImage}
                alt={`${title} preview`}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
