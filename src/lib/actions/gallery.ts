'use server';

import { revalidatePath } from 'next/cache';

import { prisma } from '@/lib/prisma';

export async function getGalleryImages() {
  return prisma.galleryImage.findMany({
    where: { isVisible: true },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });
}

export async function getAllGalleryImages() {
  return prisma.galleryImage.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });
}

export async function createGalleryImage(data: {
  title: string;
  description?: string;
  alt: string;
  url: string;
  width?: number;
  height?: number;
  category?: string;
  order?: number;
  isVisible?: boolean;
}) {
  const image = await prisma.galleryImage.create({ data });
  revalidatePath('/gallery');
  revalidatePath('/dashboard/gallery');
  return image;
}

export async function updateGalleryImage(
  id: string,
  data: {
    title?: string;
    description?: string;
    alt?: string;
    url?: string;
    width?: number;
    height?: number;
    category?: string;
    order?: number;
    isVisible?: boolean;
  },
) {
  const image = await prisma.galleryImage.update({ where: { id }, data });
  revalidatePath('/gallery');
  revalidatePath('/dashboard/gallery');
  return image;
}

export async function deleteGalleryImage(id: string) {
  await prisma.galleryImage.delete({ where: { id } });
  revalidatePath('/gallery');
  revalidatePath('/dashboard/gallery');
}
