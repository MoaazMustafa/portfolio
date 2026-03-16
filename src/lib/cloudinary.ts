export const checkCloudinaryConfig = () => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    console.warn('Cloudinary is not configured in environment variables');
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
    console.error('Cloudinary upload failed:', errorData);
    throw new Error(errorData.error?.message || 'Upload failed');
  }

  const json = (await response.json()) as { secure_url?: string };

  if (!json.secure_url) {
    throw new Error('Upload URL missing from response');
  }

  return json.secure_url;
};
