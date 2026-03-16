import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  FolderOpen,
  Layers,
  Tag,
} from 'lucide-react';
import { getServerSession } from 'next-auth/next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma'; // Ensure correct import

export const metadata = {
  title: 'Dashboard',
  description: 'Manage your portfolio content.',
};

function getRelativeTimeLabel(date: Date): string {
  const diffMs = date.getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (Math.abs(diffMinutes) < 60) {
    return rtf.format(diffMinutes, 'minute');
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) {
    return rtf.format(diffHours, 'hour');
  }

  const diffDays = Math.round(diffHours / 24);
  return rtf.format(diffDays, 'day');
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/signin');
  }

  const [
    projectCount,
    postCount,
    technologyCount,
    categoryCount,
    featuredProjects,
    visibleProjects,
    activeProjects,
    completedProjects,
    publishedPosts,
    draftPosts,
    recentProjects,
    recentPosts,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.post.count(),
    prisma.technology.count(),
    prisma.category.count(),
    prisma.project.count({ where: { isFeatured: true } }),
    prisma.project.count({ where: { isVisible: true } }),
    prisma.project.count({ where: { status: 'Under_Development' } }),
    prisma.project.count({ where: { status: 'Completed' } }),
    prisma.post.count({ where: { published: true } }),
    prisma.post.count({ where: { published: false } }),
    prisma.project.findMany({
      select: {
        id: true,
        title: true,
        status: true,
        isVisible: true,
        isFeatured: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    }),
    prisma.post.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    }),
  ]);

  const completionRate =
    projectCount > 0 ? Math.round((completedProjects / projectCount) * 100) : 0;
  const publishRate =
    postCount > 0 ? Math.round((publishedPosts / postCount) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground text-sm">
            Welcome back{session.user?.name ? `, ${session.user.name}` : ''}.{' '}
            You have {projectCount} projects and {postCount} posts in your
            workspace.
          </p>
        </div>
        <div className="text-muted-foreground text-sm">
          {new Date().toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <FolderOpen className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectCount}</div>
            <p className="text-muted-foreground text-xs">
              {activeProjects} active, {completedProjects} completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posts</CardTitle>
            <FileText className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{postCount}</div>
            <p className="text-muted-foreground text-xs">
              {publishedPosts} published, {draftPosts} drafts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxonomy</CardTitle>
            <Layers className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{technologyCount}</div>
            <p className="text-muted-foreground text-xs">
              {categoryCount} categories available
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highlights</CardTitle>
            <Tag className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{featuredProjects}</div>
            <p className="text-muted-foreground text-xs">
              {visibleProjects} visible projects live
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Content Pipeline</CardTitle>
            <CardDescription>
              Track delivery and publishing progress at a glance.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <p className="font-medium">Project completion rate</p>
                <span className="text-muted-foreground">{completionRate}%</span>
              </div>
              <div className="bg-muted h-2 overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full rounded-full"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <p className="text-muted-foreground text-xs">
                Completed {completedProjects} out of {projectCount} projects.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <p className="font-medium">Post publish rate</p>
                <span className="text-muted-foreground">{publishRate}%</span>
              </div>
              <div className="bg-muted h-2 overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full rounded-full"
                  style={{ width: `${publishRate}%` }}
                />
              </div>
              <p className="text-muted-foreground text-xs">
                Published {publishedPosts} out of {postCount} posts.
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <div className="bg-muted/50 rounded-md p-3">
                <p className="text-muted-foreground text-xs">In development</p>
                <p className="text-lg font-semibold">{activeProjects}</p>
              </div>
              <div className="bg-muted/50 rounded-md p-3">
                <p className="text-muted-foreground text-xs">Draft posts</p>
                <p className="text-lg font-semibold">{draftPosts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Jump directly to content management.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              asChild
              className="w-full justify-between"
              variant="outline"
            >
              <Link href="/dashboard/projects">
                Manage Projects <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              className="w-full justify-between"
              variant="outline"
            >
              <Link href="/dashboard/posts">
                Manage Posts <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              className="w-full justify-between"
              variant="outline"
            >
              <Link href="/dashboard/users">
                Manage Collaborators <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              className="w-full justify-between"
              variant="outline"
            >
              <Link href="/dashboard/technologies">
                Update Technologies <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              className="w-full justify-between"
              variant="outline"
            >
              <Link href="/dashboard/settings">
                Edit Settings <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Project Updates</CardTitle>
            <CardDescription>
              Latest project changes in your workspace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentProjects.length === 0 ? (
              <p className="text-muted-foreground text-sm">No projects yet.</p>
            ) : (
              <div className="space-y-3">
                {recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-start justify-between gap-3 rounded-md border p-3"
                  >
                    <div className="space-y-1">
                      <p className="leading-none font-medium">
                        {project.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge variant="secondary">{project.status}</Badge>
                        {project.isFeatured ? (
                          <Badge className="bg-amber-500 hover:bg-amber-600">
                            Featured
                          </Badge>
                        ) : null}
                        <Badge
                          variant={project.isVisible ? 'outline' : 'secondary'}
                        >
                          {project.isVisible ? 'Visible' : 'Hidden'}
                        </Badge>
                      </div>
                    </div>
                    <span className="text-muted-foreground text-xs whitespace-nowrap">
                      {getRelativeTimeLabel(project.updatedAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Post Updates</CardTitle>
            <CardDescription>
              Publishing activity and draft progress.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentPosts.length === 0 ? (
              <p className="text-muted-foreground text-sm">No posts yet.</p>
            ) : (
              <div className="space-y-3">
                {recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-start justify-between gap-3 rounded-md border p-3"
                  >
                    <div className="space-y-1">
                      <p className="leading-none font-medium">{post.title}</p>
                      <div className="flex items-center gap-1.5">
                        <Badge
                          className={
                            post.published
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : ''
                          }
                          variant={post.published ? 'default' : 'secondary'}
                        >
                          {post.published ? (
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                          ) : (
                            <Clock3 className="mr-1 h-3 w-3" />
                          )}
                          {post.published ? 'Published' : 'Draft'}
                        </Badge>
                        <span className="text-muted-foreground text-xs">
                          /{post.slug}
                        </span>
                      </div>
                    </div>
                    <span className="text-muted-foreground text-xs whitespace-nowrap">
                      {getRelativeTimeLabel(post.updatedAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
