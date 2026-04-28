
import { GalleryManager } from '@/components/dashboard/gallery-manager';
import { getAllGalleryImages } from '@/lib/actions/gallery';

export const metadata = {
  title: 'Gallery - Dashboard',
  description: 'Manage gallery images',
};

export default async function GalleryDashboardPage() {
  const images = await getAllGalleryImages();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gallery</h1>
          <p className="text-muted-foreground">
            Manage your portfolio gallery images
          </p>
        </div>
      </div>
      <GalleryManager initialImages={images} />
    </div>
  );
}
