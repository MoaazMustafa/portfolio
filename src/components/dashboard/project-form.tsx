'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { Category, Project, Technology, User } from '@prisma/client';
import { Loader2, Plus, Trash, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

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
import {
  projectSchema,
  type ProjectFormValues,
} from '@/lib/validations/project';

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
    collaborators?: User[];
  };
  technologies: Technology[];
  categories: Category[];
  users: User[];
  onSuccess?: () => void;
}

export function ProjectForm({
  project,
  technologies,
  categories,
  users,
  onSuccess,
}: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    project?.coverImage || null,
  );

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
    collaborators: project?.collaborators?.map((c) => c.id) || [],
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        form.setValue('coverImage', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (files) {
      if (files.length > 5) {
        toast.error('Maximum 5 images allowed at once');
        return;
      }

      Array.from(files).forEach((file) => {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`Image ${file.name} is too large (>5MB)`);
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          append({ value: reader.result as string });
        };
        reader.readAsDataURL(file);
      });
    }
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
          <div className="space-y-4 rounded-md border p-4">
            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>Cover Image</FormLabel>
                  <div className="flex flex-col gap-2 md:flex-row md:items-center">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={loading}
                      className="max-w-sm cursor-pointer"
                    />
                    <span className="text-muted-foreground text-xs">
                      or enter URL
                    </span>
                    {!imagePreview ? (
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                    ) : (
                      <FormControl>
                        <Input type="hidden" {...field} />
                      </FormControl>
                    )}
                  </div>
                  {imagePreview && (
                    <div className="relative mt-2 aspect-video w-40 overflow-hidden rounded-md border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => {
                          setImagePreview(null);
                          form.setValue('coverImage', '');
                        }}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Gallery Images</FormLabel>
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name={`images.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          {field.value && field.value.startsWith('data:') ? (
                            <div className="relative h-20 w-32 overflow-hidden rounded-md border">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={field.value}
                                alt="Thumb"
                                className="h-full w-full object-cover"
                              />
                              <input type="hidden" {...field} />
                            </div>
                          ) : (
                            <Input placeholder="Image URL" {...field} />
                          )}
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
              <div className="mt-2 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ value: '' })}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add URL
                </Button>
                <div className="relative">
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    onChange={handleGalleryUpload}
                  />
                  <Button type="button" variant="secondary" size="sm">
                    <Upload className="mr-2 h-4 w-4" /> Upload Images
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          <FormField
            control={form.control}
            name="collaborators"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-3">
                <FormLabel>Collaborators</FormLabel>
                <div className="flex flex-wrap gap-4">
                  {users?.map((user) => (
                    <FormField
                      key={user.id}
                      control={form.control}
                      name="collaborators"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={user.id}
                            className="flex flex-row items-start space-y-0 space-x-3"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(user.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...(field.value || []),
                                        user.id,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== user.id,
                                        ),
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {user.name || user.email}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  {(!users || users.length === 0) && (
                    <p className="text-muted-foreground text-sm">
                      No users found.
                    </p>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
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
