'use server';

import { prisma } from '@/lib/prisma';

export async function getPublicProjects() {
  return prisma.project.findMany({
    where: { isVisible: true },
    include: {
      technologies: { select: { id: true, name: true, icon: true } },
      categories: { select: { id: true, name: true } },
    },
    orderBy: [{ isFeatured: 'desc' }, { updatedAt: 'desc' }],
  });
}

export async function getFeaturedProjects() {
  return prisma.project.findMany({
    where: { isVisible: true, isFeatured: true },
    include: {
      technologies: { select: { id: true, name: true, icon: true } },
      categories: { select: { id: true, name: true } },
    },
    orderBy: { updatedAt: 'desc' },
    take: 6,
  });
}

export async function getPublicProjectBySlug(slug: string) {
  return prisma.project.findUnique({
    where: { slug, isVisible: true },
    include: {
      technologies: { select: { id: true, name: true, icon: true } },
      categories: { select: { id: true, name: true } },
      collaborators: { select: { id: true, name: true, image: true } },
    },
  });
}
