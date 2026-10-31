import crypto from 'crypto';

interface CloudinaryConfig {
  cloudName?: string;
  apiKey?: string;
  apiSecret?: string;
}

export function getCloudinaryConfig(): CloudinaryConfig {
  let cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  let apiKey = process.env.CLOUDINARY_API_KEY;
  let apiSecret = process.env.CLOUDINARY_API_SECRET;

  // Support CLOUDINARY_URL format: cloudinary://api_key:api_secret@cloud_name
  if ((!cloudName || !apiKey || !apiSecret) && process.env.CLOUDINARY_URL) {
    try {
      const parsed = new URL(process.env.CLOUDINARY_URL);
      apiKey = parsed.username;
      apiSecret = parsed.password;
      cloudName = parsed.hostname;
    } catch (e) {
      console.warn('[Cloudinary] Failed to parse CLOUDINARY_URL:', e);
    }
  }

  return { cloudName, apiKey, apiSecret };
}

export function isCloudinaryConfigured(): boolean {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  return Boolean(cloudName && apiKey && apiSecret);
}

export interface UploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  format?: string;
  bytes?: number;
}

/**
 * Uploads an image (base64 data URL or URL) to Cloudinary via REST API.
 * Uses standard Node.js crypto and fetch with zero extra npm dependencies.
 */
export async function uploadToCloudinary(
  file: string,
  folder = 'cvcraft_photos'
): Promise<UploadResult> {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary credentials (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) not configured.');
  }

  const timestamp = Math.floor(Date.now() / 1000);
  
  // Sorted parameters for signing
  const stringToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

  const formData = new URLSearchParams();
  formData.append('file', file);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp.toString());
  formData.append('signature', signature);
  formData.append('folder', folder);

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || `Cloudinary upload failed with status ${response.status}`);
  }

  return {
    url: data.url,
    secureUrl: data.secure_url,
    publicId: data.public_id,
    format: data.format,
    bytes: data.bytes,
  };
}
