'use client';

import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { TechnologyDialog } from '@/components/dashboard/technology-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { deleteTechnology } from '@/lib/actions/technology';

interface Technology {
  id: string;
  name: string;
  slug: string;
  category: string;
  icon: string | null;
}

interface TechnologyListProps {
  technologies: Technology[];
}

export function TechnologyList({ technologies }: TechnologyListProps) {
  // Group by category
  const grouped = technologies.reduce(
    (acc, tech) => {
      const cat = tech.category || 'Other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(tech);
      return acc;
    },
    {} as Record<string, Technology[]>,
  );

  const categories = Object.keys(grouped).sort();

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        const result = await deleteTechnology(id);
        if (result.success) {
          toast.success('Technology deleted');
        } else {
          toast.error('Failed to delete');
        }
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  if (technologies.length === 0) {
    return (
      <div className="text-muted-foreground flex flex-col items-center justify-center rounded-lg border border-dashed p-8">
        <h3 className="mb-2 text-lg font-medium">No technologies found</h3>
        <p className="mb-4 max-w-sm text-center text-sm">
          Get started by adding a technology manually or seeding defaults.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <div key={category} className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">{category}</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {grouped[category].map((tech) => (
              <Card
                key={tech.id}
                className="group border-muted relative overflow-hidden transition-all hover:shadow-md"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                  <CardTitle
                    className="truncate pr-6 text-sm font-medium"
                    title={tech.name}
                  >
                    {tech.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="text-muted-foreground mb-2 truncate font-mono text-xs">
                    {tech.slug}
                  </div>
                  {tech.icon && (
                    <div
                      className="text-muted-foreground truncate text-xs"
                      title={tech.icon}
                    >
                      Icon: {tech.icon}
                    </div>
                  )}

                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <TechnologyDialog technology={tech} />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDelete(tech.id, tech.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
