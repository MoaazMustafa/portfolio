'use client';

import type { Category, Project, Technology, User } from '@prisma/client';
import {
  CalendarDays,
  ExternalLink,
  FolderOpen,
  Github,
  Grid3X3,
  List,
  UserRound,
  Wrench,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { DeleteProjectDialog } from '@/components/dashboard/delete-project-dialog';
import { ProjectDialog } from '@/components/dashboard/project-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useLocalStorage } from '@/hooks';
import {
  DASHBOARD_PREFERENCES_STORAGE_KEY,
  defaultDashboardPreferences,
} from '@/lib/dashboard-preferences';

type SerializedProject = Omit<
  Project,
  'startDate' | 'endDate' | 'createdAt' | 'updatedAt'
> & {
  startDate: string | Date;
  endDate: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  technologies: Technology[];
  categories: Category[];
  collaborators: User[];
};

type ViewMode = 'table' | 'cards';
type StatusFilter = 'all' | Project['status'];
type VisibilityFilter = 'all' | 'visible' | 'hidden';
type FeaturedFilter = 'all' | 'featured' | 'not-featured';

interface ProjectsViewProps {
  projects: SerializedProject[];
  technologies: Technology[];
  categories: Category[];
  users: User[];
}

function formatDate(date: string | Date | null) {
  if (!date) return 'Ongoing';
  return new Date(date).toLocaleDateString();
}

export function ProjectsView({
  projects,
  technologies,
  categories,
  users,
}: ProjectsViewProps) {
  const [preferences, setPreferences] = useLocalStorage(
    DASHBOARD_PREFERENCES_STORAGE_KEY,
    defaultDashboardPreferences,
  );
  const [viewMode, setViewMode] = useState<ViewMode>(
    preferences.projectsViewMode,
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [visibilityFilter, setVisibilityFilter] =
    useState<VisibilityFilter>('all');
  const [featuredFilter, setFeaturedFilter] = useState<FeaturedFilter>('all');

  const hasProjects = projects.length > 0;
  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    statusFilter !== 'all' ||
    visibilityFilter !== 'all' ||
    featuredFilter !== 'all';

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return projects.filter((project) => {
      const statusMatches =
        statusFilter === 'all' || project.status === statusFilter;

      const visibilityMatches =
        visibilityFilter === 'all' ||
        (visibilityFilter === 'visible'
          ? project.isVisible
          : !project.isVisible);

      const featuredMatches =
        featuredFilter === 'all' ||
        (featuredFilter === 'featured'
          ? project.isFeatured
          : !project.isFeatured);

      const searchMatches =
        query.length === 0 ||
        [
          project.title,
          project.description,
          project.status,
          ...(project.technologies?.map((tech) => tech.name) ?? []),
          ...(project.categories?.map((category) => category.name) ?? []),
          ...(project.collaborators?.map(
            (collaborator) => collaborator.name || collaborator.email,
          ) ?? []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(query);

      return (
        statusMatches && visibilityMatches && featuredMatches && searchMatches
      );
    });
  }, [featuredFilter, projects, searchQuery, statusFilter, visibilityFilter]);

  const sortedProjects = useMemo(
    () =>
      [...filteredProjects].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [filteredProjects],
  );

  const hasFilteredProjects = sortedProjects.length > 0;

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setVisibilityFilter('all');
    setFeaturedFilter('all');
  };

  const updateViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    setPreferences((prev) => ({
      ...prev,
      projectsViewMode: mode,
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-muted-foreground text-sm">
          {hasProjects
            ? `${sortedProjects.length} of ${projects.length} project${projects.length === 1 ? '' : 's'} shown`
            : 'No projects yet'}
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateViewMode('table')}
            aria-pressed={viewMode === 'table'}
          >
            <List className="h-4 w-4" /> Table
          </Button>
          <Button
            type="button"
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateViewMode('cards')}
            aria-pressed={viewMode === 'cards'}
          >
            <Grid3X3 className="h-4 w-4" /> Cards
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 rounded-md border p-3 md:grid-cols-12">
        <div className="md:col-span-4">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search title, status, tech, category..."
          />
        </div>
        <div className="md:col-span-3">
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as StatusFilter)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Planned">Planned</SelectItem>
              <SelectItem value="Under_Development">
                Under Development
              </SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="On_Hold">On Hold</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Select
            value={visibilityFilter}
            onValueChange={(value) =>
              setVisibilityFilter(value as VisibilityFilter)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Visibility</SelectItem>
              <SelectItem value="visible">Visible</SelectItem>
              <SelectItem value="hidden">Hidden</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Select
            value={featuredFilter}
            onValueChange={(value) =>
              setFeaturedFilter(value as FeaturedFilter)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Featured" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Featured</SelectItem>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="not-featured">Not Featured</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-1">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={clearFilters}
            disabled={!hasActiveFilters}
          >
            Reset
          </Button>
        </div>
      </div>

      {viewMode === 'table' ? (
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
              {!hasProjects ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No projects found. Add one to get started.
                  </TableCell>
                </TableRow>
              ) : !hasFilteredProjects ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No projects match the current filters.
                  </TableCell>
                </TableRow>
              ) : (
                sortedProjects.map((project) => (
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
                    <TableCell className="font-medium">
                      {project.title}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          project.status === 'Completed'
                            ? 'default'
                            : 'secondary'
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
                        <span className="text-muted-foreground text-sm">
                          No
                        </span>
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
                          users={users}
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
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {!hasProjects ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">
                  No projects found. Add one to get started.
                </p>
              </CardContent>
            </Card>
          ) : !hasFilteredProjects ? (
            <Card className="lg:col-span-2">
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">
                  No projects match the current filters.
                </p>
              </CardContent>
            </Card>
          ) : (
            sortedProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                {project.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="bg-muted aspect-[16/7] w-full object-cover"
                  />
                ) : null}

                <CardHeader className="space-y-3 pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-xl leading-tight">
                      {project.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {project.isFeatured ? (
                        <Badge
                          variant="default"
                          className="bg-amber-500 hover:bg-amber-600"
                        >
                          Featured
                        </Badge>
                      ) : null}
                      <Badge
                        variant={
                          project.status === 'Completed'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                  </div>

                  {project.description ? (
                    <p className="text-muted-foreground line-clamp-3 text-sm">
                      {project.description}
                    </p>
                  ) : null}
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <CalendarDays className="h-4 w-4" />
                      <span>
                        {formatDate(project.startDate)} -{' '}
                        {formatDate(project.endDate)}
                      </span>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <FolderOpen className="h-4 w-4" />
                      <span>{project.isVisible ? 'Visible' : 'Hidden'}</span>
                    </div>
                  </div>

                  {project.technologies.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
                        <Wrench className="h-3.5 w-3.5" /> Technologies
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.map((tech) => (
                          <Badge key={tech.id} variant="outline">
                            {tech.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {project.categories.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                        Categories
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.categories.map((category) => (
                          <Badge key={category.id} variant="secondary">
                            {category.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {project.collaborators.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
                        <UserRound className="h-3.5 w-3.5" /> Collaborators
                      </p>
                      <div className="flex flex-wrap gap-2 text-sm">
                        {project.collaborators.map((collaborator) => (
                          <span
                            key={collaborator.id}
                            className="bg-muted rounded-md px-2 py-1"
                          >
                            {collaborator.name || collaborator.email}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex"
                      >
                        <Button type="button" variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4" /> Live
                        </Button>
                      </a>
                    ) : null}
                    {project.githubUrl ? (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex"
                      >
                        <Button type="button" variant="outline" size="sm">
                          <Github className="h-4 w-4" /> GitHub
                        </Button>
                      </a>
                    ) : null}

                    <div className="ml-auto flex items-center gap-2">
                      <ProjectDialog
                        project={project}
                        technologies={technologies}
                        categories={categories}
                        users={users}
                      />
                      <DeleteProjectDialog
                        id={project.id}
                        title={project.title}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
