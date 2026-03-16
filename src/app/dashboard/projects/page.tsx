import type { Category, Project, Technology, User } from '@prisma/client';

import { ProjectDialog } from '@/components/dashboard/project-dialog';
import { ProjectsView } from '@/components/dashboard/projects-view';
import { prisma } from '@/lib/prisma';

export default async function ProjectsPage() {
  if (!prisma) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <h2 className="text-destructive text-xl font-semibold">
          Database Connection Error
        </h2>
        <p className="text-muted-foreground mt-2">
          Unable to connect to the database. Please ensure the Prisma client is
          generated (`npx prisma generate`).
        </p>
      </div>
    );
  }

  const [projectsData, technologies, categories, users] = await Promise.all([
    prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        coverImage: true,
        startDate: true,
        endDate: true,
        status: true,
        isFeatured: true,
        isVisible: true,
        createdAt: true,
        updatedAt: true,
        technologies: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
        categories: {
          select: {
            id: true,
            name: true,
          },
        },
        collaborators: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    }),
    prisma.technology.findMany({
      orderBy: { name: 'asc' },
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
    }),
    prisma.user.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    }),
  ]);

  const projects = projectsData as (Project & {
    technologies: Technology[];
    categories: Category[];
    collaborators: Pick<User, 'id' | 'name' | 'email' | 'image'>[];
  })[];

  // Format dates for client components
  const formattedProjects = projects.map((project) => ({
    ...project,
    startDate: project.startDate.toISOString(),
    endDate: project.endDate?.toISOString() || null,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <ProjectDialog
          technologies={technologies}
          categories={categories}
          users={users}
        />
      </div>

      <ProjectsView
        projects={formattedProjects}
        technologies={technologies}
        categories={categories}
        users={users}
      />
    </div>
  );
}
