'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
// import { Button } from "@/components/ui/button"
// import { ScrollArea } from "@/components/ui/scroll-area" // Should check if this exists
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet" // Should check if this exists
import {
  Cpu,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Settings,
  Tags,
  Users,
} from 'lucide-react';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

const sidebarNavItems = [
  {
    title: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Projects',
    href: '/dashboard/projects',
    icon: FolderOpen,
  },
  {
    title: 'Collaborators',
    href: '/dashboard/users',
    icon: Users,
  },
  {
    title: 'Technologies',
    href: '/dashboard/technologies',
    icon: Cpu,
  },
  {
    title: 'Categories',
    href: '/dashboard/categories',
    icon: Tags,
  },
  {
    title: 'Blog Posts',
    href: '/dashboard/posts',
    icon: FileText,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export function DashboardNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        'flex space-x-2 lg:flex-col lg:space-y-1 lg:space-x-0',
        className,
      )}
      {...props}
    >
      {sidebarNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'hover:text-primary justify-start text-sm font-medium transition-colors',
            pathname === item.href
              ? 'bg-primary/50 hover:bg-muted'
              : 'hover:bg-transparent hover:underline',
            'flex items-center rounded-md px-3 py-2',
          )}
        >
          <item.icon className="mr-2 h-4 w-4" />
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
