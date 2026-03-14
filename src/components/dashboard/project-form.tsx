'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { createProject, updateProject } from '@/lib/actions';
import { ProjectFormValues, projectSchema } from '@/lib/validations/project';
import { Category, Project, Technology } from '@prisma/client';
import { toast } from 'sonner';

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

interface ProjectFormProps {
  project?: SerializedProject & {
    technologies: Technology[];
    categories: Category[];
  };
  technologies: Technology[];
  categories: Category[];
  onSuccess?: () => void;
}

export function ProjectForm({
  project,
  technologies,
  categories,
  onSuccess,
}: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const defaultValues: Partial<ProjectFormValues> = {
    title: project?.title || '',
    slug: project?.slug || '',
    description: project?.description || '',
    content: project?.content || '',
    coverImage: project?.coverImage || '',
    liveUrl: project?.liveUrl || '',
    githubUrl: project?.githubUrl || '',
    images: project?.images?.map((img) => ({ value: img })) || [],
    startDate: project?.startDate
      ? new Date(project.startDate).toISOString().split('T')[0]
      : '',
    endDate: project?.endDate
      ? new Date(project.endDate).toISOString().split('T')[0]
      : '',
    isFeatured: project?.isFeatured ?? false,
    isVisible: project?.isVisible ?? true,
    status: project?.status || 'Planned',
    technologies: project?.technologies.map((t) => t.id) || [],
    categories: project?.categories.map((c) => c.id) || [],
  };

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: defaultValues as ProjectFormValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'images',
  });

  async function onSubmit(data: ProjectFormValues) {
    setLoading(true);
    try {
      if (project) {
        await updateProject(project.id, data);
        toast.success('Project updated successfully');
      } else {
        await createProject(data);
        toast.success('Project created successfully');
      }
      router.refresh();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Project Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="project-slug" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Short description of the project"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content (Markdown)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Full project details..."
                  className="min-h-50"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="liveUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Live URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="githubUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://github.com/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Planned">Planned</SelectItem>
                    <SelectItem value="Under_Development">
                      Under Development
                    </SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="On_Hold">On Hold</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>Leave empty if ongoing</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-4">
          <FormLabel>Images</FormLabel>
          <FormField
            control={form.control}
            name="coverImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2">
            <FormLabel>Gallery Images</FormLabel>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <FormField
                  control={form.control}
                  name={`images.${index}.value`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="Image URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ value: '' })}
              className="mt-2"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Image
            </Button>
          </div>
        </div>

        <div className="flex gap-8">
          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Featured Project</FormLabel>
                  <FormDescription>
                    Pin this project to the home highlight reel.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isVisible"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Visible</FormLabel>
                  <FormDescription>
                    Show this project on the public site.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        {/* Technologies and Categories selection */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <FormLabel>Technologies</FormLabel>
            <div className="grid max-h-[300px] grid-cols-1 overflow-y-auto rounded-md border p-4">
              {technologies.map((tech) => (
                <FormField
                  key={tech.id}
                  control={form.control}
                  name="technologies"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={tech.id}
                        className="flex flex-row items-center space-y-0 space-x-3 py-2"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(tech.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([
                                    ...(field.value || []),
                                    tech.id,
                                  ])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== tech.id,
                                    ),
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="cursor-pointer font-normal">
                          {tech.name}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <FormLabel>Categories</FormLabel>
            <div className="grid max-h-[300px] grid-cols-1 overflow-y-auto rounded-md border p-4">
              {categories.map((cat) => (
                <FormField
                  key={cat.id}
                  control={form.control}
                  name="categories"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={cat.id}
                        className="flex flex-row items-center space-y-0 space-x-3 py-2"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(cat.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([
                                    ...(field.value || []),
                                    cat.id,
                                  ])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== cat.id,
                                    ),
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="cursor-pointer font-normal">
                          {cat.name}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {project ? 'Update Project' : 'Create Project'}
        </Button>
      </form>
    </Form>
  );
}
