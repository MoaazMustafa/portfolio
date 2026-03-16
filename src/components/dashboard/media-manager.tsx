'use client';

import {
  AlertTriangle,
  Copy,
  FolderOpen,
  Image as ImageIcon,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Upload,
} from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  type CloudinaryResource,
  deleteCloudinaryResource,
  getCloudinaryResources,
} from '@/lib/actions/media';
import { uploadToCloudinary } from '@/lib/cloudinary';

export default function MediaManager() {
  const [resources, setResources] = useState<CloudinaryResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<CloudinaryResource | null>(
    null,
  );
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const fetchImages = useCallback(async (cursor?: string) => {
    try {
      setLoading(true);
      setError(null);
      // @ts-ignore - The types on server actions can be tricky with simple imports
      const result = await getCloudinaryResources(cursor);

      if ('error' in result && result.error) {
        setError(result.error as string);
        return;
      }

      const data = result as {
        resources: CloudinaryResource[];
        next_cursor?: string;
      };

      if (cursor) {
        setResources((prev) => [...prev, ...data.resources]);
      } else {
        setResources(data.resources);
      }
      setNextCursor(data.next_cursor || null);
    } catch (err) {
      setError('Failed to load images');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  const handleDelete = async (publicId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const result = await deleteCloudinaryResource(publicId);
      if (result.error) {
        toast.error('Failed to delete image');
        return;
      }

      setResources((prev) => prev.filter((res) => res.public_id !== publicId));
      toast.success('Image deleted');
      if (selectedImage?.public_id === publicId) {
        setSelectedImage(null);
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      // Client-side upload using unsigned preset
      await uploadToCloudinary(file);

      toast.success('Upload successful');
      setIsUploadDialogOpen(false);
      // Refresh list
      fetchImages();
    } catch (err) {
      console.error(err);
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const filteredResources = resources.filter((res) =>
    res.public_id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col gap-4 md:flex-row">
      {/* Sidebar / List View */}
      <Card className="flex flex-1 flex-col overflow-hidden md:w-1/3 md:flex-none lg:w-1/4">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Media Library</CardTitle>
            <Dialog
              open={isUploadDialogOpen}
              onOpenChange={setIsUploadDialogOpen}
            >
              <DialogTrigger asChild>
                <Button size="sm" className="h-8 gap-1">
                  <Plus className="h-3.5 w-3.5" />
                  Upload
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Image</DialogTitle>
                  <DialogDescription>
                    Select an image to upload to your Cloudinary media library.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    {uploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
                        <p className="text-muted-foreground text-sm">
                          Uploading...
                        </p>
                      </div>
                    ) : (
                      <label className="flex cursor-pointer flex-col items-center gap-2">
                        <Upload className="text-muted-foreground h-8 w-8" />
                        <span className="text-sm font-medium">
                          Click to select file
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleUpload}
                          disabled={uploading}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="relative">
            <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
            <Input
              placeholder="Search files..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-1 p-2">
              {loading && resources.length === 0 ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-md p-2"
                  >
                    <Skeleton className="h-10 w-10 rounded" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))
              ) : error ? (
                <div className="text-muted-foreground flex flex-col items-center justify-center py-8 text-center">
                  <AlertTriangle className="text-destructive mb-2 h-8 w-8" />
                  <p className="text-sm">{error}</p>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => fetchImages()}
                  >
                    Try Again
                  </Button>
                </div>
              ) : filteredResources.length === 0 ? (
                <div className="text-muted-foreground flex flex-col items-center justify-center py-8 text-center">
                  <FolderOpen className="mb-2 h-8 w-8 opacity-50" />
                  <p className="text-sm">No images found</p>
                </div>
              ) : (
                filteredResources.map((resource) => (
                  <button
                    key={resource.public_id}
                    onClick={() => setSelectedImage(resource)}
                    className={`hover:bg-muted/50 flex items-center gap-3 rounded-md p-2 text-left transition-colors ${
                      selectedImage?.public_id === resource.public_id
                        ? 'bg-muted'
                        : ''
                    }`}
                  >
                    <div className="bg-muted/50 relative h-10 w-10 shrink-0 overflow-hidden rounded">
                      <Image
                        src={resource.url}
                        alt={resource.public_id}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {resource.public_id.split('/').pop()}
                      </p>
                      <p className="text-muted-foreground truncate text-xs">
                        {Math.round(resource.bytes / 1024)} KB •{' '}
                        {resource.format}
                      </p>
                    </div>
                    {selectedImage?.public_id === resource.public_id && (
                      <div className="bg-primary h-2 w-2 rounded-full" />
                    )}
                  </button>
                ))
              )}
              {nextCursor && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => fetchImages(nextCursor)}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  Load More
                </Button>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Main Content / Preview */}
      <Card className="flex flex-[2] flex-col overflow-hidden">
        {selectedImage ? (
          <div className="flex h-full flex-col">
            <div className="border-b p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Image Details</h3>
                  <p className="text-muted-foreground text-sm">
                    View and manage selected image
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyUrl(selectedImage.url)}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy URL
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(selectedImage.public_id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
            <div className="bg-muted/10 flex-1 overflow-auto p-4">
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                <div className="bg-background relative aspect-video w-full max-w-3xl overflow-hidden rounded-lg border shadow-sm">
                  <Image
                    src={selectedImage.url}
                    alt={selectedImage.public_id}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="grid w-full max-w-3xl grid-cols-2 gap-4 text-sm md:grid-cols-4">
                  <div className="bg-background rounded-lg border p-3">
                    <p className="text-muted-foreground text-xs">Dimensions</p>
                    <p className="font-medium">
                      {selectedImage.width} x {selectedImage.height}
                    </p>
                  </div>
                  <div className="bg-background rounded-lg border p-3">
                    <p className="text-muted-foreground text-xs">Size</p>
                    <p className="font-medium">
                      {(selectedImage.bytes / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <div className="bg-background rounded-lg border p-3">
                    <p className="text-muted-foreground text-xs">Format</p>
                    <p className="font-medium uppercase">
                      {selectedImage.format}
                    </p>
                  </div>
                  <div className="bg-background rounded-lg border p-3">
                    <p className="text-muted-foreground text-xs">Created</p>
                    <p className="font-medium">
                      {new Date(selectedImage.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="bg-background w-full max-w-3xl rounded-lg border p-3 text-left">
                  <p className="text-muted-foreground text-xs">Public ID</p>
                  <code className="block w-full overflow-hidden font-mono text-xs text-ellipsis">
                    {selectedImage.public_id}
                  </code>
                </div>
                <div className="bg-background w-full max-w-3xl rounded-lg border p-3 text-left">
                  <p className="text-muted-foreground text-xs">Secure URL</p>
                  <div className="flex items-center gap-2">
                    <code className="block flex-1 overflow-hidden font-mono text-xs text-ellipsis whitespace-nowrap">
                      {selectedImage.secure_url}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground flex h-full flex-col items-center justify-center">
            <ImageIcon className="mb-4 h-16 w-16 opacity-20" />
            <p className="text-lg font-medium">No image selected</p>
            <p className="text-sm">
              Select an image from the library to view details
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
