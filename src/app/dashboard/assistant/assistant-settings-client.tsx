'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { AssistantKnowledge } from '@prisma/client';
import {
  Bot,
  Loader2,
  Plus,
  Power,
  PowerOff,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  createKnowledgeEntry,
  deleteKnowledgeEntry,
  updateAssistantConfig,
  updateKnowledgeEntry,
} from '@/lib/actions/assistant';
import {
  assistantConfigSchema,
  assistantKnowledgeSchema,
  type AssistantConfigFormValues,
  type AssistantKnowledgeFormValues,
} from '@/lib/validations/assistant';

// ── Types ──

interface AssistantSettingsClientProps {
  initialConfig: AssistantConfigFormValues | null;
  initialKnowledge: AssistantKnowledge[];
}

// ── Defaults ──

const defaultConfig: AssistantConfigFormValues = {
  enabled: true,
  name: 'Moaaz',
  greeting:
    "Hey! I'm Moaaz's AI twin. Ask me anything about him — skills, projects, experience, or what he's working on.",
  systemPrompt: '',
  refusalMessage:
    "I can only answer questions about Moaaz — his work, skills, projects, and experience. Try asking something about him!",
  suggestedPrompts: [
    'Who is Moaaz?',
    'What tech stack does he use?',
    'Tell me about his projects',
    'How can I contact him?',
  ],
  providerMode: 'hosted',
};

// ── Main Component ──

export function AssistantSettingsClient({
  initialConfig,
  initialKnowledge,
}: AssistantSettingsClientProps) {
  const [saving, setSaving] = useState(false);
  const [knowledge, setKnowledge] =
    useState<AssistantKnowledge[]>(initialKnowledge);
  const [showKnowledgeForm, setShowKnowledgeForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<AssistantKnowledge | null>(
    null,
  );

  const configForm = useForm<AssistantConfigFormValues>({
    resolver: zodResolver(assistantConfigSchema),
    defaultValues: initialConfig ?? defaultConfig,
  });

  const isEnabled = configForm.watch('enabled');

  async function onConfigSubmit(values: AssistantConfigFormValues) {
    setSaving(true);
    try {
      const result = await updateAssistantConfig(values);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success('Assistant settings saved');
    } catch {
      toast.error('Failed to save assistant settings');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Config Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="text-primary h-5 w-5" />
              <CardTitle>Assistant Configuration</CardTitle>
            </div>
            <Badge variant={isEnabled ? 'default' : 'secondary'}>
              {isEnabled ? (
                <>
                  <Power className="mr-1 h-3 w-3" /> Enabled
                </>
              ) : (
                <>
                  <PowerOff className="mr-1 h-3 w-3" /> Disabled
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...configForm}>
            <form
              onSubmit={configForm.handleSubmit(onConfigSubmit)}
              className="space-y-5"
            >
              <FormField
                control={configForm.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Enable Ask Moaaz
                      </FormLabel>
                      <FormDescription>
                        Toggle the floating chat widget on the public site.
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

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={configForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Moaaz" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={configForm.control}
                  name="providerMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provider Mode</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="hosted">
                            Hosted (OpenRouter / Groq)
                          </SelectItem>
                          <SelectItem value="local">
                            Local (Ollama)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={configForm.control}
                name="greeting"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Greeting Message</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-20" {...field} />
                    </FormControl>
                    <FormDescription>
                      First message visitors see when they open the chat.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={configForm.control}
                name="refusalMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Refusal Message</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-20" {...field} />
                    </FormControl>
                    <FormDescription>
                      Included in the system prompt to guide off-topic refusals.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={configForm.control}
                name="systemPrompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>System Prompt Override (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-32 font-mono text-xs"
                        placeholder="Leave empty to use the default system prompt..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      If set, completely replaces the default system prompt.
                      Use {'{KNOWLEDGE_BLOCK}'} to inject knowledge entries.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={configForm.control}
                name="suggestedPrompts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Suggested Prompts</FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-20"
                        placeholder="One per line"
                        value={field.value.join('\n')}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              .split('\n')
                              .filter((s) => s.trim()),
                          )
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      One per line. Shown to visitors as quick-start buttons.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Configuration
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Knowledge Base */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Knowledge Base</CardTitle>
            <Button
              size="sm"
              onClick={() => {
                setEditingEntry(null);
                setShowKnowledgeForm(true);
              }}
            >
              <Plus className="mr-1 h-4 w-4" /> Add Entry
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showKnowledgeForm && (
            <>
              <KnowledgeEntryForm
                initialValues={
                  editingEntry
                    ? {
                        category: editingEntry.category as AssistantKnowledgeFormValues['category'],
                        title: editingEntry.title,
                        content: editingEntry.content,
                        priority: editingEntry.priority,
                        enabled: editingEntry.enabled,
                      }
                    : undefined
                }
                entryId={editingEntry?.id}
                onDone={(entry) => {
                  if (editingEntry && entry) {
                    setKnowledge((prev) =>
                      prev.map((k) =>
                        k.id === editingEntry.id ? { ...k, ...entry } : k,
                      ),
                    );
                  } else if (entry) {
                    // Reload would be ideal; for now just close the form
                  }
                  setShowKnowledgeForm(false);
                  setEditingEntry(null);
                }}
              />
              <Separator className="my-4" />
            </>
          )}

          {knowledge.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center text-sm">
              No knowledge entries yet. The assistant will use built-in
              defaults until you add entries here.
            </p>
          ) : (
            <div className="space-y-3">
              {knowledge.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start justify-between gap-4 rounded-lg border p-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{entry.title}</span>
                      <Badge variant="outline" className="text-xs">
                        {entry.category}
                      </Badge>
                      <Badge
                        variant={entry.enabled ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {entry.enabled ? 'Active' : 'Disabled'}
                      </Badge>
                      <span className="text-muted-foreground text-xs">
                        P{entry.priority}
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                      {entry.content}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingEntry(entry);
                        setShowKnowledgeForm(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={async () => {
                        const res = await deleteKnowledgeEntry(entry.id);
                        if (res.error) {
                          toast.error(res.error);
                        } else {
                          setKnowledge((prev) =>
                            prev.filter((k) => k.id !== entry.id),
                          );
                          toast.success('Entry deleted');
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ── Knowledge Entry Form ──

function KnowledgeEntryForm({
  initialValues,
  entryId,
  onDone,
}: {
  initialValues?: AssistantKnowledgeFormValues;
  entryId?: string;
  onDone: (entry?: AssistantKnowledgeFormValues) => void;
}) {
  const [saving, setSaving] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<AssistantKnowledgeFormValues, any, AssistantKnowledgeFormValues>({
    resolver: zodResolver(assistantKnowledgeSchema),
    defaultValues: initialValues ?? {
      category: 'custom',
      title: '',
      content: '',
      priority: 0,
      enabled: true,
    },
  });

  async function onSubmit(values: AssistantKnowledgeFormValues) {
    setSaving(true);
    try {
      const result = entryId
        ? await updateKnowledgeEntry(entryId, values)
        : await createKnowledgeEntry(values);

      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(entryId ? 'Entry updated' : 'Entry created');
      onDone(values);
    } catch {
      toast.error('Failed to save entry');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {['bio', 'skills', 'projects', 'experience', 'faq', 'custom'].map(
                      (c) => (
                        <SelectItem key={c} value={c}>
                          {c.charAt(0).toUpperCase() + c.slice(1)}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Entry title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-end">
                  <FormLabel>Active</FormLabel>
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
        </div>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  className="min-h-28"
                  placeholder="Knowledge content the assistant will use..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {entryId ? 'Update' : 'Create'} Entry
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onDone()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
