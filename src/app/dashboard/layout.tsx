import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { UserNav } from '@/components/dashboard/user-nav';
import { authOptions } from '@/lib/auth';
// import { ScrollArea } from "@/components/ui/scroll-area" // Optional, if scroll area exists, else use div
import Link from 'next/link';

export const metadata = {
  title: 'Dashboard',
  description: 'Manage portfolio content',
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/signin');
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="bg-muted/40 hidden w-full border-r md:flex md:w-64 md:flex-col">
        <div className="flex h-14 items-center border-b px-4 lg:h-15 lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="">Moaaz Mustafa</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <div className="mt-4">
              <DashboardNav />
            </div>
          </nav>
        </div>
        <div className="mt-auto border-t p-4">
          <div className="flex items-center gap-4">
            <UserNav email={session.user?.email} />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <header className="bg-muted/40 flex h-14 items-center gap-4 border-b px-4 md:hidden lg:h-15 lg:px-6">
          {/* Mobile Menu Trigger would go here */}
          <Link href="/" className="font-semibold">
            Moaaz Mustafa
          </Link>
          <div className="ml-auto">
            <UserNav email={session.user?.email} />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
