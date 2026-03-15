'use client';

import type { Post } from '@prisma/client';
import {
  CalendarDays,
  CheckCircle2,
  Grid3X3,
  List,
  Search,
  XCircle,
} from 'lucide-react';
import { useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';

import { DeletePostDialog } from '@/components/dashboard/delete-post-dialog';
import { PostDialog } from '@/components/dashboard/post-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useLocalStorage } from '@/hooks';
import { togglePostPublished } from '@/lib/actions/post';
import {
  DASHBOARD_PREFERENCES_STORAGE_KEY,
  defaultDashboardPreferences,
} from '@/lib/dashboard-preferences';

type SerializedPost = Omit<Post, 'createdAt' | 'updatedAt'> & {
  createdAt: string | Date;
  updatedAt: string | Date;
};

type ViewMode = 'table' | 'cards';
type PublishFilter = 'all' | 'published' | 'draft';

interface PostsViewProps {
  posts: SerializedPost[];
}

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString();
}

export function PostsView({ posts }: PostsViewProps) {
  const [preferences, setPreferences] = useLocalStorage(
    DASHBOARD_PREFERENCES_STORAGE_KEY,
    defaultDashboardPreferences,
  );
  const [viewMode, setViewMode] = useState<ViewMode>(preferences.postsViewMode);
  const [query, setQuery] = useState('');
  const [publishFilter, setPublishFilter] = useState<PublishFilter>('all');
  const [isPending, startTransition] = useTransition();

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return [...posts]
      .filter((post) => {
        const searchMatches =
          normalizedQuery.length === 0 ||
          `${post.title} ${post.slug} ${post.content}`
            .toLowerCase()
            .includes(normalizedQuery);

        const publishMatches =
          publishFilter === 'all' ||
          (publishFilter === 'published' ? post.published : !post.published);

        return searchMatches && publishMatches;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [posts, publishFilter, query]);

  const hasPosts = posts.length > 0;
  const hasFilteredPosts = filteredPosts.length > 0;

  const clearFilters = () => {
    setQuery('');
    setPublishFilter('all');
  };

  const updateViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    setPreferences((prev) => ({
      ...prev,
      postsViewMode: mode,
    }));
  };

  const updatePublishState = (postId: string, published: boolean) => {
    startTransition(async () => {
      const result = await togglePostPublished(postId, published);
      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(published ? 'Post published' : 'Post moved to drafts');
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <p className="text-muted-foreground text-sm">
          {hasPosts
            ? `${filteredPosts.length} of ${posts.length} post${posts.length === 1 ? '' : 's'} shown`
            : 'No posts yet'}
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant={viewMode === 'table' ? 'default' : 'outline'}
            onClick={() => updateViewMode('table')}
          >
            <List className="h-4 w-4" /> Table
          </Button>
          <Button
            type="button"
            size="sm"
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            onClick={() => updateViewMode('cards')}
          >
            <Grid3X3 className="h-4 w-4" /> Cards
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 rounded-md border p-3 md:grid-cols-12">
        <div className="relative md:col-span-8">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, slug, content..."
            className="pl-9"
          />
        </div>
        <div className="md:col-span-3">
          <Select
            value={publishFilter}
            onValueChange={(value) => setPublishFilter(value as PublishFilter)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Publish status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Posts</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Drafts</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-1">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={clearFilters}
            disabled={query.trim().length === 0 && publishFilter === 'all'}
          >
            Reset
          </Button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Publish</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!hasPosts ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No posts found. Create your first one.
                  </TableCell>
                </TableRow>
              ) : !hasFilteredPosts ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No posts match the current filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{post.slug}</TableCell>
                    <TableCell>
                      {post.published ? (
                        <Badge className="bg-green-600 text-white hover:bg-green-700">
                          Published
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(post.updatedAt)}</TableCell>
                    <TableCell>
                      <Switch
                        checked={post.published}
                        disabled={isPending}
                        onCheckedChange={(checked) =>
                          updatePublishState(post.id, checked)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <PostDialog post={post} />
                        <DeletePostDialog id={post.id} title={post.title} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {!hasPosts ? (
            <Card className="lg:col-span-2">
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">
                  No posts found. Create your first one.
                </p>
              </CardContent>
            </Card>
          ) : !hasFilteredPosts ? (
            <Card className="lg:col-span-2">
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">
                  No posts match the current filters.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredPosts.map((post) => (
              <Card key={post.id}>
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-2 text-xl">
                      {post.title}
                    </CardTitle>
                    {post.published ? (
                      <Badge className="bg-green-600 text-white hover:bg-green-700">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Published
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <XCircle className="h-3.5 w-3.5" /> Draft
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">/{post.slug}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-muted-foreground line-clamp-5 text-sm">
                    {post.content}
                  </p>

                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <CalendarDays className="h-4 w-4" />
                    Updated {formatDate(post.updatedAt)}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Publish</span>
                      <Switch
                        checked={post.published}
                        disabled={isPending}
                        onCheckedChange={(checked) =>
                          updatePublishState(post.id, checked)
                        }
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <PostDialog post={post} />
                      <DeletePostDialog id={post.id} title={post.title} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
