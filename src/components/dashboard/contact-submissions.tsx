'use client';

import type { ContactSubmission } from '@prisma/client';
import { CheckCheck, Mail, MailOpen, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  deleteSubmission,
  markAllRead,
  markSubmissionRead,
} from '@/lib/actions/contact';

interface Props {
  initialSubmissions: ContactSubmission[];
}

export function ContactSubmissions({ initialSubmissions }: Props) {
  const router = useRouter();
  const unreadCount = initialSubmissions.filter((s) => !s.isRead).length;

  async function handleMarkRead(id: string) {
    await markSubmissionRead(id);
    router.refresh();
  }

  async function handleMarkAllRead() {
    await markAllRead();
    router.refresh();
  }

  async function handleDelete(id: string) {
    await deleteSubmission(id);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {unreadCount > 0 && (
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{unreadCount} unread</Badge>
          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all read
          </Button>
        </div>
      )}

      {initialSubmissions.length === 0 ? (
        <div className="text-muted-foreground py-20 text-center">
          <Mail className="mx-auto mb-4 h-12 w-12 opacity-50" />
          <p>No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {initialSubmissions.map((sub) => (
            <Card
              key={sub.id}
              className={sub.isRead ? 'opacity-75' : 'border-primary/30'}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {sub.isRead ? (
                      <MailOpen className="text-muted-foreground h-4 w-4" />
                    ) : (
                      <Mail className="text-primary h-4 w-4" />
                    )}
                    <CardTitle className="text-base">{sub.name}</CardTitle>
                    {!sub.isRead && (
                      <Badge variant="default" className="text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {!sub.isRead && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleMarkRead(sub.id)}
                        title="Mark read"
                      >
                        <CheckCheck className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive h-8 w-8"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Message</AlertDialogTitle>
                          <AlertDialogDescription>
                            Delete this message from {sub.name}? This cannot be
                            undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(sub.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-1 text-sm">
                  {sub.email}
                  {sub.subject && ` · ${sub.subject}`}
                </p>
                <p className="text-sm whitespace-pre-wrap">{sub.message}</p>
                <p className="text-muted-foreground mt-2 text-xs">
                  {new Date(sub.createdAt).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
