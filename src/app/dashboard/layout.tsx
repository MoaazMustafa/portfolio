// eslint-disable-next-line import/order
import { getServerSession } from 'next-auth/next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { MobileNav } from '@/components/dashboard/mobile-nav';
import { UserNav } from '@/components/dashboard/user-nav';
import { authOptions } from '@/lib/auth';

// import { ScrollArea } from "@/components/ui/scroll-area" // Optional, if scroll area exists, else use div

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
    <div className="flex h-screen overflow-hidden flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="bg-muted/40 hidden h-full w-full border-r lg:flex lg:w-64 flex-col">
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
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="bg-muted/40 flex h-14 items-center gap-4 border-b px-4 lg:hidden">
          <MobileNav />
          <Link href="/" className="font-semibold">
            Moaaz Mustafa
          </Link>
          <div className="ml-auto">
            <UserNav email={session.user?.email} />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
