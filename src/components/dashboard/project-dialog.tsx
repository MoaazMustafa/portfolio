'use client';

import type { Category, Project, Technology, User } from '@prisma/client';
import { Pencil, Plus } from 'lucide-react';
import { useState } from 'react';

import { ProjectForm } from '@/components/dashboard/project-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Helper type for serialized dates from Server Components
type SerializedProject = Omit<
  Project,
  'startDate' | 'endDate' | 'createdAt' | 'updatedAt'
> & {
  startDate: string | Date;
  endDate: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
};

interface ProjectDialogProps {
  project?: SerializedProject & {
    technologies: Technology[];
    categories: Category[];
    collaborators?: User[];
  };
  technologies: Technology[];
  categories: Category[];
  users: User[];
  trigger?: React.ReactNode;
}

export function ProjectDialog({
  project,
  technologies,
  categories,
  users,
  trigger,
}: ProjectDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            variant={project ? 'ghost' : 'default'}
            size={project ? 'icon' : 'default'}
          >
            {project ? (
              <Pencil className="h-4 w-4" />
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" /> Add Project
              </>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {project ? 'Edit Project' : 'Create Project'}
          </DialogTitle>
          <DialogDescription>
            {project
              ? 'Make changes to the project details.'
              : 'Add a new project to your portfolio.'}
          </DialogDescription>
        </DialogHeader>
        <ProjectForm
          project={project}
          technologies={technologies}
          categories={categories}
          users={users}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
