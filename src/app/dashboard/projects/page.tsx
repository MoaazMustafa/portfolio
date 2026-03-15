import type { Category, Project, Technology, User } from '@prisma/client';

import { ProjectDialog } from '@/components/dashboard/project-dialog';
import { ProjectsView } from '@/components/dashboard/projects-view';
import { prisma } from '@/lib/prisma';

export default async function ProjectsPage() {
  if (!prisma || !(prisma as any).project) {
    const availableKeys = prisma
      ? Object.keys(prisma).join(', ')
      : 'prisma is undefined';
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <h2 className="text-destructive text-xl font-semibold">
          Database Connection Error
        </h2>
        <p className="text-muted-foreground mt-2">
          Unable to connect to the database. Please ensure the Prisma client is
          generated (`npx prisma generate`).
        </p>
        <div className="bg-muted/50 mx-auto mt-4 max-w-xl overflow-auto rounded p-4 text-left font-mono text-xs">
          <p>
            <strong>Debug Info:</strong>
          </p>
          <p>Prisma Instance: {prisma ? 'Present' : 'Missing'}</p>
          <p>
            Project Model: {(prisma as any)?.project ? 'Present' : 'Missing'}
          </p>
          <p>Available Keys: {availableKeys}</p>
        </div>
      </div>
    );
  }

  const projects = (await (prisma as any).project.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      technologies: true,
      categories: true,
      collaborators: true,
    },
  })) as (Project & {
    technologies: Technology[];
    categories: Category[];
    collaborators: User[];
  })[];

  // Format dates for client components
  const formattedProjects = projects.map((project) => ({
    ...project,
    startDate: project.startDate.toISOString(),
    endDate: project.endDate?.toISOString() || null,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  }));

  const technologies = (await (prisma as any).technology.findMany({
    orderBy: { name: 'asc' },
  })) as Technology[];

  const categories = (await (prisma as any).category.findMany({
    orderBy: { name: 'asc' },
  })) as Category[];

  const users = await (prisma as any).user.findMany({
    orderBy: { name: 'asc' },
  });

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
