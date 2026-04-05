'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { Post } from '@prisma/client';
import { Loader2, Pencil, Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useLocalStorage } from '@/hooks';
import { createPost, updatePost } from '@/lib/actions/post';
import {
  DASHBOARD_PREFERENCES_STORAGE_KEY,
  defaultDashboardPreferences,
} from '@/lib/dashboard-preferences';
import { slugify } from '@/lib/utils';
import { postSchema, type PostFormValues } from '@/lib/validations/post';

type SerializedPost = Omit<Post, 'createdAt' | 'updatedAt'> & {
  createdAt: string | Date;
  updatedAt: string | Date;
};

interface PostDialogProps {
  post?: SerializedPost;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function PostDialog({
  post,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: PostDialogProps) {
  const [preferences] = useLocalStorage(
    DASHBOARD_PREFERENCES_STORAGE_KEY,
    defaultDashboardPreferences,
  );
  const [internalOpen, setInternalOpen] = useState(false);
  const [slugEdited, setSlugEdited] = useState(
    Boolean(post) || !preferences.autoGenerateSlugs,
  );
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange : setInternalOpen;
  const titleDebounceRef = useRef<number | null>(null);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      id: post?.id,
      title: post?.title || '',
      slug: post?.slug || '',
      content: post?.content || '',
      published: post?.published ?? preferences.defaultPostPublished,
    },
  });

  const titleValue = form.watch('title');

  useEffect(() => {
    if (!preferences.autoGenerateSlugs) {
      return;
    }

    if (slugEdited) {
      return;
    }

    if (titleDebounceRef.current) {
      window.clearTimeout(titleDebounceRef.current);
    }

    titleDebounceRef.current = window.setTimeout(() => {
      form.setValue('slug', slugify(titleValue), {
        shouldValidate: true,
      });
    }, 200);

    return () => {
      if (titleDebounceRef.current) {
        window.clearTimeout(titleDebounceRef.current);
      }
    };
  }, [form, preferences.autoGenerateSlugs, slugEdited, titleValue]);

  async function onSubmit(values: PostFormValues) {
    try {
      const result = post ? await updatePost(values) : await createPost(values);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(
        post ? 'Post updated successfully' : 'Post created successfully',
      );
      setOpen?.(false);

      if (!post) {
        form.reset({
          title: '',
          slug: '',
          content: '',
          published: false,
        });
        setSlugEdited(false);
      }
    } catch {
      toast.error('Something went wrong');
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            variant={post ? 'ghost' : 'default'}
            size={post ? 'icon' : 'default'}
          >
            {post ? (
              <Pencil className="h-4 w-4" />
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" /> Add Post
              </>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{post ? 'Edit Post' : 'Create Post'}</DialogTitle>
          <DialogDescription>
            {post
              ? 'Update your post details and publishing state.'
              : 'Create a new post for your portfolio blog.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Introducing my dashboard architecture"
                      {...field}
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
                      placeholder="introducing-my-dashboard-architecture"
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

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write the full post content here..."
                      className="min-h-52"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <FormLabel>Published</FormLabel>
                    <p className="text-muted-foreground text-sm">
                      Show this post on public pages.
                    </p>
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

            <div className="flex justify-end">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {post ? 'Save changes' : 'Create post'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
