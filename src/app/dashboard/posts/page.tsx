import { PostDialog } from '@/components/dashboard/post-dialog';
import { PostsView } from '@/components/dashboard/posts-view';
import { prisma } from '@/lib/prisma';

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const formattedPosts = posts.map((post) => ({
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
        <PostDialog />
      </div>

      <PostsView posts={formattedPosts} />
    </div>
  );
}
