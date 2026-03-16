'use server';

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export type CloudinaryResource = {
  public_id: string;
  format: string;
  version: number;
  resource_type: string;
  type: string;
  created_at: string;
  bytes: number;
  width: number;
  height: number;
  folder: string;
  url: string;
  secure_url: string;
};

export type GetResourcesResponse = {
  resources: CloudinaryResource[];
  next_cursor?: string;
  total_count: number;
};

export async function getCloudinaryResources(
  cursor?: string,
): Promise<GetResourcesResponse | { error: string }> {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return {
        error:
          'Cloudinary is not fully configured (Missing API Key or Secret). Cannot list resources.',
      };
    }

    const result = await cloudinary.api.resources({
      max_results: 30,
      next_cursor: cursor,
      direction: 'desc',
      sort_by: 'created_at',
      type: 'upload',
      prefix: '', // Can be used to filter by folder
    });

    return {
      resources: result.resources,
      next_cursor: result.next_cursor,
      total_count: result.resources.length, // Providing length of current batch
    };
  } catch (error) {
    console.error('Error fetching Cloudinary resources:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch resources';
    return { error: errorMessage };
  }
}

export async function deleteCloudinaryResource(public_id: string) {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return { error: 'Cloudinary configuration missing' };
    }

    const result = await cloudinary.uploader.destroy(public_id);
    return { success: true, result };
  } catch (error) {
    console.error('Error deleting resource:', error);
    return { error: 'Failed to delete resource' };
  }
}
