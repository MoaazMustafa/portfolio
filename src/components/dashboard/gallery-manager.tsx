'use client';

import type { GalleryImage } from '@prisma/client';
import { EyeOff, ImagePlus, Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  createGalleryImage,
  deleteGalleryImage,
  updateGalleryImage,
} from '@/lib/actions/gallery';

interface GalleryManagerProps {
  initialImages: GalleryImage[];
}

const imageCategories = [
  { value: 'general', label: 'General' },
  { value: 'photography', label: 'Photography' },
  { value: 'events', label: 'Events' },
  { value: 'work', label: 'Work' },
];

function ImageFormDialog({
  image,
  onClose,
}: {
  image?: GalleryImage;
  onClose: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: image?.title ?? '',
    description: image?.description ?? '',
    alt: image?.alt ?? '',
    url: image?.url ?? '',
    width: image?.width ?? undefined as number | undefined,
    height: image?.height ?? undefined as number | undefined,
    category: image?.category ?? 'general',
    order: image?.order ?? 0,
    isVisible: image?.isVisible ?? true,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (image) {
        await updateGalleryImage(image.id, formData);
      } else {
        await createGalleryImage(formData);
      }
      router.refresh();
      onClose();
    } catch {
      // Error handling
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData((p) => ({ ...p, title: e.target.value }))
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="alt">Alt Text (SEO)</Label>
          <Input
            id="alt"
            value={formData.alt}
            onChange={(e) =>
              setFormData((p) => ({ ...p, alt: e.target.value }))
            }
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="url">Image URL</Label>
        <Input
          id="url"
          value={formData.url}
          onChange={(e) =>
            setFormData((p) => ({ ...p, url: e.target.value }))
          }
          placeholder="https://res.cloudinary.com/..."
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData((p) => ({ ...p, description: e.target.value }))
          }
          rows={2}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(v) => setFormData((p) => ({ ...p, category: v }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {imageCategories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="width">Width (px)</Label>
          <Input
            id="width"
            type="number"
            value={formData.width ?? ''}
            onChange={(e) =>
              setFormData((p) => ({
                ...p,
                width: e.target.value ? parseInt(e.target.value) : undefined,
              }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="height">Height (px)</Label>
          <Input
            id="height"
            type="number"
            value={formData.height ?? ''}
            onChange={(e) =>
              setFormData((p) => ({
                ...p,
                height: e.target.value ? parseInt(e.target.value) : undefined,
              }))
            }
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="space-y-2">
          <Label htmlFor="order">Display Order</Label>
          <Input
            id="order"
            type="number"
            value={formData.order}
            onChange={(e) =>
              setFormData((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))
            }
            className="w-24"
          />
        </div>
        <div className="flex items-center gap-2 pt-6">
          <Switch
            checked={formData.isVisible}
            onCheckedChange={(v) =>
              setFormData((p) => ({ ...p, isVisible: v }))
            }
          />
          <Label>Visible</Label>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : image ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}

export function GalleryManager({ initialImages }: GalleryManagerProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editImage, setEditImage] = useState<GalleryImage | undefined>();

  async function handleDelete(id: string) {
    await deleteGalleryImage(id);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditImage(undefined);
        }}
      >
        <DialogTrigger asChild>
          <Button>
            <ImagePlus className="mr-2 h-4 w-4" />
            Add Image
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editImage ? 'Edit Image' : 'Add Gallery Image'}
            </DialogTitle>
          </DialogHeader>
          <ImageFormDialog
            image={editImage}
            onClose={() => {
              setDialogOpen(false);
              setEditImage(undefined);
            }}
          />
        </DialogContent>
      </Dialog>

      {initialImages.length === 0 ? (
        <div className="text-muted-foreground py-20 text-center">
          <ImagePlus className="mx-auto mb-4 h-12 w-12 opacity-50" />
          <p>No gallery images yet. Add your first image above.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {initialImages.map((image) => (
            <div
              key={image.id}
              className="border-border group relative overflow-hidden rounded-lg border"
            >
              <div className="relative aspect-video">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {!image.isVisible && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Badge variant="secondary">
                      <EyeOff className="mr-1 h-3 w-3" /> Hidden
                    </Badge>
                  </div>
                )}
              </div>
              <div className="p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-medium">{image.title}</h3>
                    <p className="text-muted-foreground text-xs">
                      {image.category} · Order: {image.order}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setEditImage(image);
                        setDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
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
                          <AlertDialogTitle>Delete Image</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete &quot;{image.title}
                            &quot;? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(image.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
