'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Trash2, Upload, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Textarea } from '@/components/ui/textarea';
import { createUser } from '@/lib/actions/user';
import { uploadToCloudinary } from '@/lib/cloudinary';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  title: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  githubUrl: z.string().optional().nullable(),
  linkedinUrl: z.string().optional().nullable(),
  websiteUrl: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
});

export function CreateUserDialog() {
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      title: '',
      bio: '',
      githubUrl: '',
      linkedinUrl: '',
      websiteUrl: '',
      image: null,
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('File must be an image');
        e.target.value = '';
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error('Image size must be less than 5MB');
        e.target.value = '';
        return;
      }

      try {
        setUploading(true);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        const url = await uploadToCloudinary(file);
        form.setValue('image', url);
        toast.success('Image uploaded successfully');
      } catch (error) {
        toast.error('Failed to upload image to Cloudinary');
        console.error(error);
        setImagePreview(null);
      } finally {
        setUploading(false);
      }
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    form.setValue('image', null);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await createUser(values);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success('User created successfully');
      setOpen(false);
      form.reset();
      setImagePreview(null);
    } catch {
      toast.error('Something went wrong');
    }
  }

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      form.reset();
      setImagePreview(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>Manually create a user account.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <Avatar className="h-24 w-24">
                <AvatarImage src={imagePreview || undefined} />
                <AvatarFallback className="text-xl">
                  {uploading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    (form.watch('name') || form.watch('email') || 'U')
                      .slice(0, 2)
                      .toUpperCase()
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="relative"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="mr-2 h-4 w-4" />
                    )}
                    {uploading ? 'Uploading...' : 'Upload Avatar'}
                    <input
                      type="file"
                      className="absolute inset-0 cursor-pointer opacity-0"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Button>
                  {imagePreview && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={removeImage}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-muted-foreground text-xs">
                  Recommended size: 400x400px. Max 5MB.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="user@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title / Role</FormLabel>
                    <FormControl>
                      <Input
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="Frontend Developer"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      value={field.value || ''}
                      onChange={field.onChange}
                      placeholder="Short bio..."
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="githubUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub</FormLabel>
                    <FormControl>
                      <Input
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="https://github.com/..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="linkedinUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <Input
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="https://linkedin.com/..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="https://..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create User
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
