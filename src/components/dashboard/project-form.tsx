'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { Category, Project, Technology, User } from '@prisma/client';
import { Loader2, Plus, Trash, Upload } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
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
import { useLocalStorage } from '@/hooks';
import { createProject, getProject, updateProject } from '@/lib/actions';
import { uploadToCloudinary } from '@/lib/cloudinary';
import {
  DASHBOARD_PREFERENCES_STORAGE_KEY,
  defaultDashboardPreferences,
} from '@/lib/dashboard-preferences';
import { slugify } from '@/lib/utils';
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
    collaborators?: Pick<User, 'id' | 'name' | 'email' | 'image'>[];
  };
  technologies: Technology[];
  categories: Category[];
  users: Pick<User, 'id' | 'name' | 'email' | 'image'>[];
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
  const [preferences] = useLocalStorage(
    DASHBOARD_PREFERENCES_STORAGE_KEY,
    defaultDashboardPreferences,
  );
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    project?.coverImage || null,
  );
  const [slugEdited, setSlugEdited] = useState(
    Boolean(project) || !preferences.autoGenerateSlugs,
  );
  const slugDebounceRef = useRef<number | null>(null);

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
    isFeatured: project?.isFeatured ?? preferences.defaultProjectFeatured,
    isVisible: project?.isVisible ?? preferences.defaultProjectVisible,
    status: project?.status || 'Planned',
    technologies: project?.technologies.map((t) => t.id) || [],
    categories: project?.categories.map((c) => c.id) || [],
    collaborators: project?.collaborators?.map((c) => c.id) || [],
  };

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: defaultValues as ProjectFormValues,
  });

  const { fields, append, remove } = useFieldArray({
    name: 'images',
    control: form.control,
  });

  useEffect(() => {
    // If we have a project ID but missing critical fields (like content or full images list)
    // we should fetch the complete project data.
    if (project && !project.content && !project.images) {
      setLoading(true);
      getProject(project.id)
        .then((result) => {
          if (result.project) {
            const p = result.project as unknown as Project & {
              technologies: Technology[];
              categories: Category[];
              collaborators: User[];
            }; // Explicit cast to help TS
            form.reset({
              title: p.title,
              slug: p.slug,
              description: p.description,
              content: p.content || '',
              coverImage: p.coverImage || '',
              liveUrl: p.liveUrl || '',
              githubUrl: p.githubUrl || '',
              images: p.images?.map((img) => ({ value: img })) || [],
              startDate: p.startDate
                ? new Date(p.startDate).toISOString().split('T')[0]
                : '',
              endDate: p.endDate
                ? new Date(p.endDate).toISOString().split('T')[0]
                : '',
              isFeatured: p.isFeatured,
              isVisible: p.isVisible,
              status: p.status,
              technologies: p.technologies?.map((t) => t.id) || [],
              categories: p.categories?.map((c) => c.id) || [],
              collaborators: p.collaborators?.map((c) => c.id) || [],
            });
            // Update preview if needed
            if (p.coverImage) setImagePreview(p.coverImage);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [project, form]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      try {
        setUploadingImages(true);
        const uploadedUrl = await uploadToCloudinary(file);
        setImagePreview(uploadedUrl);
        form.setValue('coverImage', uploadedUrl);
        toast.success('Cover image uploaded');
      } catch {
        toast.error('Failed to upload cover image');
      } finally {
        setUploadingImages(false);
        e.target.value = '';
      }
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

      try {
        setUploadingImages(true);
        const uploadPromises: Promise<string>[] = [];

        for (const file of Array.from(files)) {
          if (file.size > 5 * 1024 * 1024) {
            toast.error(`Image ${file.name} is too large (>5MB)`);
            continue;
          }
          uploadPromises.push(uploadToCloudinary(file));
        }

        const uploadedUrls = await Promise.all(uploadPromises);

        uploadedUrls.forEach((url) => append({ value: url }));
        toast.success(`${uploadedUrls.length} gallery images uploaded`);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Failed to upload gallery images';
        toast.error(message);
      } finally {
        setUploadingImages(false);
        e.target.value = '';
      }
    }
  };

  const titleValue = form.watch('title');

  useEffect(() => {
    if (!preferences.autoGenerateSlugs) {
      return;
    }

    if (slugEdited) {
      return;
    }

    if (slugDebounceRef.current) {
      window.clearTimeout(slugDebounceRef.current);
    }

    slugDebounceRef.current = window.setTimeout(() => {
      form.setValue('slug', slugify(titleValue), {
        shouldValidate: true,
      });
    }, 200);

    return () => {
      if (slugDebounceRef.current) {
        window.clearTimeout(slugDebounceRef.current);
      }
    };
  }, [form, preferences.autoGenerateSlugs, slugEdited, titleValue]);

  async function onSubmit(data: ProjectFormValues) {
    setLoading(true);
    try {
      const payload: ProjectFormValues = {
        ...data,
      };

      if (project) {
        const result = await updateProject(project.id, payload);

        if (result?.error) {
          throw new Error(
            Array.isArray(result.error)
              ? result.error[0]?.message || 'Failed to update project'
              : result.error,
          );
        }

        toast.success('Project updated successfully');
      } else {
        const result = await createProject(payload);

        if (result?.error) {
          throw new Error(
            Array.isArray(result.error)
              ? result.error[0]?.message || 'Failed to create project'
              : result.error,
          );
        }

        toast.success('Project created successfully');
      }
      router.refresh();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Project Title"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      if (!slugEdited) {
                        form.setValue('slug', slugify(e.target.value));
                      }
                    }}
                  />
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
                  <Input
                    placeholder="project-slug"
                    {...field}
                    onChange={(e) => {
                      setSlugEdited(true);
                      field.onChange(slugify(e.target.value));
                    }}
                  />
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
                  {!imagePreview ? (
                    <div className="flex flex-col gap-2 md:flex-row md:items-center">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={loading || uploadingImages}
                        className="max-w-sm cursor-pointer"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-xs text-nowrap">
                          or enter URL
                        </span>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                      </div>
                    </div>
                  ) : null}
                  {imagePreview && (
                    <div className="relative mt-2 aspect-video h-auto w-full overflow-hidden rounded-md border">
                      {}
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        className="h-full! w-full! object-cover"
                        fill
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
                    disabled={loading || uploadingImages}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={loading || uploadingImages}
                  >
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
            render={() => (
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

        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-4">
            <FormLabel>Technologies</FormLabel>
            <div className="grid grid-cols-1 gap-6 overflow-y-auto rounded-md border p-4">
              {Object.entries(
                technologies.reduce(
                  (acc, tech) => {
                    const cat = tech.category || 'Other';
                    if (!acc[cat]) acc[cat] = [];
                    acc[cat].push(tech);
                    return acc;
                  },
                  {} as Record<string, Technology[]>,
                ),
              )
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([category, techs]) => (
                  <div key={category} className="space-y-3">
                    <h4 className="bg-background text-muted-foreground sticky top-0 z-10 py-1 text-sm font-medium">
                      {category}
                    </h4>
                    <div className="grid grid-cols-3 gap-2 pl-2 sm:grid-cols-6">
                      {techs.map((tech) => (
                        <FormField
                          key={tech.id}
                          control={form.control}
                          name="technologies"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={tech.id}
                                className="flex flex-row items-center space-y-0 space-x-3"
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
                ))}
            </div>
          </div>
          <div className="space-y-4">
            <FormLabel>Categories</FormLabel>
            <div className="grid max-h-75 grid-cols-1 overflow-y-auto rounded-md border p-4">
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

        <Button type="submit" disabled={loading || uploadingImages}>
          {(loading || uploadingImages) && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {uploadingImages
            ? 'Uploading Images...'
            : project
              ? 'Update Project'
              : 'Create Project'}
        </Button>
      </form>
    </Form>
  );
}
