import type { Metadata } from 'next';

import MediaManager from '@/components/dashboard/media-manager';
import { Separator } from '@/components/ui/separator';

export const metadata: Metadata = {
  title: 'Media Library | Dashboard',
  description: 'Manage your uploaded images and assets.',
};

export default function MediaPage() {
  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col gap-8 p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Media Library</h2>
          <p className="text-muted-foreground">
            Manage images uploaded to your Cloudinary storage.
          </p>
        </div>
      </div>
      <Separator className="my-0" />
      <MediaManager />
    </div>
  );
}
