import { Router, type Request, type Response } from 'express';
import { isCloudinaryConfigured, uploadToCloudinary } from '../services/cloudinary.ts';

const router = Router();

// 5MB limit
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

/**
 * GET /api/upload/status
 * Check if Cloudinary integration is active
 */
router.get('/status', (_req: Request, res: Response) => {
  const configured = isCloudinaryConfigured();
  res.json({
    success: true,
    provider: configured ? 'Cloudinary (Active)' : 'Base64 Inline Storage (Active Fallback)',
    isCloudinaryConfigured: configured,
    maxSizeBytes: MAX_UPLOAD_BYTES,
    message: configured
      ? 'Cloudinary CDN active for photo and asset uploads.'
      : 'Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in Render environment for CDN photo storage.',
  });
});

/**
 * POST /api/upload
 * Upload an image (data URL or base64) to Cloudinary or optimize for local storage
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { image, folder = 'cvcraft_photos' } = req.body;

    if (!image || typeof image !== 'string') {
      res.status(400).json({
        success: false,
        message: 'No image provided. Please send a base64 data URL or image string.',
      });
      return;
    }

    // Size check
    if (image.length > (MAX_UPLOAD_BYTES * 4) / 3) {
      res.status(400).json({
        success: false,
        message: 'Image size exceeds maximum 5MB limit.',
      });
      return;
    }

    if (isCloudinaryConfigured()) {
      try {
        const result = await uploadToCloudinary(image, folder);
        res.json({
          success: true,
          provider: 'cloudinary',
          url: result.secureUrl,
          publicId: result.publicId,
          bytes: result.bytes,
          format: result.format,
          message: 'Image uploaded to Cloudinary successfully.',
        });
        return;
      } catch (cloudErr: any) {
        console.warn('[Upload] Cloudinary upload error, falling back to data URL:', cloudErr?.message);
      }
    }

    // Fallback: return optimized data URL
    res.json({
      success: true,
      provider: 'inline',
      url: image,
      message: 'Stored as local inline photo URL (Cloudinary not configured or unreachable).',
    });
  } catch (err: any) {
    console.error('[Upload Error]:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Image upload failed.',
    });
  }
});

export default router;
