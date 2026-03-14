import { DeleteProjectDialog } from '@/components/dashboard/delete-project-dialog';
import { ProjectDialog } from '@/components/dashboard/project-dialog';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { prisma } from '@/lib/prisma';

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      technologies: true,
      categories: true,
    },
  });

  // Format dates for client components
  const formattedProjects = projects.map((project) => ({
    ...project,
    startDate: project.startDate.toISOString(),
    endDate: project.endDate?.toISOString() || null,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  }));

  const technologies = await prisma.technology.findMany({
    orderBy: { name: 'asc' },
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <ProjectDialog technologies={technologies} categories={categories} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Visible</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formattedProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No projects found. Add one to get started.
                </TableCell>
              </TableRow>
            ) : (
              formattedProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    {project.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="bg-muted h-10 w-16 rounded-md object-cover"
                      />
                    ) : (
                      <div className="bg-muted text-muted-foreground flex h-10 w-16 items-center justify-center rounded-md text-xs">
                        No img
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        project.status === 'Completed' ? 'default' : 'secondary'
                      }
                    >
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {project.isFeatured ? (
                      <Badge
                        variant="default"
                        className="bg-amber-500 hover:bg-amber-600"
                      >
                        Featured
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">No</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {project.isVisible ? (
                      <Badge
                        variant="outline"
                        className="border-green-500 text-green-500"
                      >
                        Visible
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-red-500 text-red-500"
                      >
                        Hidden
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="space-x-2 text-right">
                    <div className="flex justify-end gap-2">
                      <ProjectDialog
                        project={project}
                        technologies={technologies}
                        categories={categories}
                      />
                      <DeleteProjectDialog
                        id={project.id}
                        title={project.title}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
