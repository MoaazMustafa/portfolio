'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Trash2, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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
import { submitOnboarding } from '@/lib/actions/invitation';
import { uploadToCloudinary } from '@/lib/cloudinary';

const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  title: z.string().optional(),
  bio: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  image: z.string().optional().nullable(),
});

interface OnboardingFormProps {
  token: string;
  email: string;
}

export function OnboardingForm({ token, email }: OnboardingFormProps) {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      title: '',
      bio: '',
      linkedinUrl: '',
      githubUrl: '',
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
      if (file.size > 5 * 1024 * 1024) {
        // 5MB
        toast.error('Image size must be less than 5MB');
        e.target.value = '';
        return;
      }
      
      try {
        setUploading(true);
        const url = await uploadToCloudinary(file);
        setImagePreview(url);
        form.setValue('image', url);
        toast.success('Image uploaded successfully');
      } catch (error) {
        toast.error('Failed to upload image');
        console.error(error);
        e.target.value = '';
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
      const result = await submitOnboarding(token, values);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success('Profile created successfully! Please sign in.');
      router.push('/signin');
    } catch {
      toast.error('Something went wrong');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2 text-center sm:text-left">
          <h2 className="text-xl font-semibold">Welcome!</h2>
          <p className="text-muted-foreground text-sm">
            You&apos;ve been invited as{' '}
            <span className="text-foreground font-medium">{email}</span>. Please
            complete your profile to continue.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={imagePreview || ''} />
            <AvatarFallback className="text-lg">
              {form.watch('name')?.charAt(0) || email.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            {uploading ? (
              <Button type="button" variant="outline" size="sm" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="cursor-pointer"
                asChild
              >
                <label>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Photo
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </Button>
            )}
            {imagePreview && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={removeImage}
                className="text-destructive hover:text-destructive/90"
                disabled={uploading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title / Role</FormLabel>
              <FormControl>
                <Input placeholder="Software Engineer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a bit about yourself..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="linkedinUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://linkedin.com/in/..." {...field} />
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

        <FormField
          control={form.control}
          name="websiteUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Personal Website</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Complete Setup
        </Button>
      </form>
    </Form>
  );
}
