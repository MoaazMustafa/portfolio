import type { MetadataRoute } from 'next';

import { prisma } from '@/lib/prisma';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.moaazmustafa.dev';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/experience`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
  ];

  // Dynamic project pages
  try {
    const projects = await prisma.project.findMany({
      where: { isVisible: true },
      select: { slug: true, updatedAt: true },
    });

    for (const project of projects) {
      routes.push({
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified: project.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  } catch {
    // DB not available during build - skip dynamic routes
  }

  return routes;
}
