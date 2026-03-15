'use client';

import { Icon } from '@iconify/react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { TechnologyDialog } from '@/components/dashboard/technology-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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
      } catch {
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
      {categories.map((category, index) => (
        <div key={category} className="space-y-4">
          {index > 0 && <Separator />}
          <h2 className="text-xl font-semibold tracking-tight">{category}</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {grouped[category].map((tech) => (
              <Card
                key={tech.id}
                className="group border-muted relative overflow-hidden transition-all hover:shadow-md"
              >
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  {tech.icon ? (
                    <div className="bg-muted/30 mb-4 flex h-16 w-16 items-center justify-center rounded-xl p-3">
                      <Icon
                        icon={tech.icon}
                        className="text-foreground h-10 w-10 transition-transform group-hover:scale-110"
                      />
                    </div>
                  ) : (
                    <div className="bg-muted/30 mb-4 flex h-16 w-16 items-center justify-center rounded-xl p-3">
                      <span className="text-muted-foreground text-2xl font-bold">
                        {tech.name.charAt(0)}
                      </span>
                    </div>
                  )}

                  <h3 className="font-semibold tracking-tight">{tech.name}</h3>
                  <p className="text-muted-foreground mt-1 truncate font-mono text-xs opacity-70">
                    {tech.slug}
                  </p>

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
