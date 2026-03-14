import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

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

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/signin');
  }

  // Fetch some stats, handling potential DB errors gracefully
  let projectCount = 0;
  let activeProjects = 0;
  let completedProjects = 0;

  try {
    // If prisma is somehow undefined, throw explicitly to catch below
    if (!prisma) throw new Error('Prisma client not initialized');

    // Check if project model exists before calling count
    if ((prisma as any).project) {
      projectCount = await (prisma as any).project.count();
      activeProjects = await (prisma as any).project.count({
        where: { status: 'Under_Development' },
      });
      completedProjects = await (prisma as any).project.count({
        where: { status: 'Completed' },
      });
    } else {
      console.error(
        'Prisma project model is undefined. Did you run `npx prisma generate`?',
      );
    }
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    // Fallback or just show 0
  }

  return (
    <div className="flex w-full flex-1 flex-col items-center space-y-4 p-8 pt-6">
      <div className="flex w-full items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          {session.user && (
            <div className="flex items-center gap-2">
              <span className="text-primary font-orbitron mr-2 text-2xl font-extrabold">
                Welcome, {session.user.name}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="text-muted-foreground h-4 w-4"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectCount}</div>
            <p className="text-muted-foreground text-xs">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Development
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="text-muted-foreground h-4 w-4"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
            <p className="text-muted-foreground text-xs">
              Currently being worked on
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="text-muted-foreground h-4 w-4"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedProjects}</div>
            <p className="text-muted-foreground text-xs">
              Successfully delivered
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Contributions (Placeholder)
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="text-muted-foreground h-4 w-4"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-muted-foreground text-xs">
              +201 since last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your recent project updates and changes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Placeholder activity items */}
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm leading-none font-medium">
                    Project Update
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Updated core dependencies for Portfolio project.
                  </p>
                </div>
                <div className="ml-auto font-medium">Just now</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm leading-none font-medium">
                    New Blog Post
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Drafted "Next.js 15 Features" article.
                  </p>
                </div>
                <div className="ml-auto font-medium">2 hours ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline">
              <span className="mr-2">+</span> Add New Project
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <span className="mr-2">📝</span> Write Blog Post
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <span className="mr-2">⚡</span> Update Status
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
