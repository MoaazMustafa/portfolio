import { Button } from '@/components/ui/button';

export default function PostsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">posts</h1>
        <Button>Add post</Button>
      </div>
      <div className="text-muted-foreground flex items-center justify-center rounded-lg border border-dashed p-8 shadow-sm">
        Manage blog posts.
      </div>
    </div>
  );
}
