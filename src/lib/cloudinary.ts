import { toast } from "sonner";

export const checkCloudinaryConfig = () => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    toast.warning('Cloudinary is not configured in environment variables');
    return false;
  }
  return true;
};

export const uploadToCloudinary = async (fileOrDataUri: File | string) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary is not configured');
  }

  const formData = new FormData();
  formData.append('file', fileOrDataUri);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    toast.error(`Cloudinary upload failed: ${errorData.error?.message || 'Upload failed'}`);
    throw new Error(errorData.error?.message || 'Upload failed');
  }

  const json = (await response.json()) as { secure_url?: string };

  if (!json.secure_url) {
    toast.error('Cloudinary upload failed: Upload URL missing from response');
    throw new Error('Upload URL missing from response');
  }

  return json.secure_url;
};
