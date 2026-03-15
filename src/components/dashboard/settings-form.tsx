'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
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
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useLocalStorage } from '@/hooks';
import { updateCurrentUserSettings } from '@/lib/actions/user';
import {
  DASHBOARD_PREFERENCES_STORAGE_KEY,
  defaultDashboardPreferences,
  type DashboardPreferences,
} from '@/lib/dashboard-preferences';
import {
  settingsSchema,
  type SettingsFormValues,
} from '@/lib/validations/settings';

interface SettingsFormProps {
  initialValues: SettingsFormValues;
  email: string;
}

export function SettingsForm({ initialValues, email }: SettingsFormProps) {
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useLocalStorage<DashboardPreferences>(
    DASHBOARD_PREFERENCES_STORAGE_KEY,
    defaultDashboardPreferences,
  );

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values: SettingsFormValues) {
    setSaving(true);
    try {
      const result = await updateCurrentUserSettings(values);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success('Settings saved successfully');
    } catch {
      toast.error('Something went wrong while saving settings');
    } finally {
      setSaving(false);
    }
  }

  function resetWorkflowPreferences() {
    setPreferences(defaultDashboardPreferences);
    toast.success('Workflow preferences reset to defaults');
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile Settings</h3>
        <p className="text-muted-foreground text-sm">
          Update your public profile details and social links.
        </p>
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input value={email} disabled />
              </FormControl>
              <FormDescription>
                Email is managed by your sign-in provider.
              </FormDescription>
            </FormItem>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Full Stack Developer"
                      value={field.value || ''}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://..."
                      value={field.value || ''}
                      onChange={field.onChange}
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
                    placeholder="Tell visitors about your experience and focus areas..."
                    className="min-h-28"
                    value={field.value || ''}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="githubUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://github.com/username"
                      value={field.value || ''}
                      onChange={field.onChange}
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
                  <FormLabel>LinkedIn URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://linkedin.com/in/username"
                      value={field.value || ''}
                      onChange={field.onChange}
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
                  <FormLabel>Website URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://yourwebsite.com"
                      value={field.value || ''}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save changes
          </Button>
        </form>
      </Form>

      <Separator />

      <div className="space-y-4">
        <div>
          <h4 className="text-base font-medium">Owner Workflow Preferences</h4>
          <p className="text-muted-foreground text-sm">
            Local device preferences to speed up your content workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">Auto-generate slugs</p>
              <p className="text-muted-foreground text-sm">
                Fill slug from title while typing.
              </p>
            </div>
            <Switch
              checked={preferences.autoGenerateSlugs}
              onCheckedChange={(checked) =>
                setPreferences((prev) => ({
                  ...prev,
                  autoGenerateSlugs: checked,
                }))
              }
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">Default new post as published</p>
              <p className="text-muted-foreground text-sm">
                Turn off to keep new posts as drafts.
              </p>
            </div>
            <Switch
              checked={preferences.defaultPostPublished}
              onCheckedChange={(checked) =>
                setPreferences((prev) => ({
                  ...prev,
                  defaultPostPublished: checked,
                }))
              }
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">Default new project visible</p>
              <p className="text-muted-foreground text-sm">
                Makes new projects public by default.
              </p>
            </div>
            <Switch
              checked={preferences.defaultProjectVisible}
              onCheckedChange={(checked) =>
                setPreferences((prev) => ({
                  ...prev,
                  defaultProjectVisible: checked,
                }))
              }
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">Default new project featured</p>
              <p className="text-muted-foreground text-sm">
                Highlight new projects by default.
              </p>
            </div>
            <Switch
              checked={preferences.defaultProjectFeatured}
              onCheckedChange={(checked) =>
                setPreferences((prev) => ({
                  ...prev,
                  defaultProjectFeatured: checked,
                }))
              }
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">Show collaborators field</p>
              <p className="text-muted-foreground text-sm">
                Keep off for single-owner setup.
              </p>
            </div>
            <Switch
              checked={preferences.showCollaboratorsField}
              onCheckedChange={(checked) =>
                setPreferences((prev) => ({
                  ...prev,
                  showCollaboratorsField: checked,
                }))
              }
            />
          </div>

          <div className="rounded-lg border p-4">
            <p className="mb-2 font-medium">Default posts view mode</p>
            <Select
              value={preferences.postsViewMode}
              onValueChange={(value) =>
                setPreferences((prev) => ({
                  ...prev,
                  postsViewMode: value as DashboardPreferences['postsViewMode'],
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="table">Table</SelectItem>
                <SelectItem value="cards">Cards</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border p-4">
            <p className="mb-2 font-medium">Default projects view mode</p>
            <Select
              value={preferences.projectsViewMode}
              onValueChange={(value) =>
                setPreferences((prev) => ({
                  ...prev,
                  projectsViewMode:
                    value as DashboardPreferences['projectsViewMode'],
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="table">Table</SelectItem>
                <SelectItem value="cards">Cards</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={resetWorkflowPreferences}
          >
            Reset workflow preferences
          </Button>
        </div>
      </div>
    </div>
  );
}
