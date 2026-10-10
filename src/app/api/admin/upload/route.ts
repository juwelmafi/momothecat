import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { verifyAdminSession } from '@/lib/auth';
import { getStoreSettings } from '@/lib/store';

// Helper to get active Cloudinary config from env or database StoreSettings
async function getActiveCloudinaryConfig() {
  const envCloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const envApiKey = process.env.CLOUDINARY_API_KEY;
  const envApiSecret = process.env.CLOUDINARY_API_SECRET;
  const envPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (envCloudName && envApiKey && envApiSecret) {
    return {
      cloudName: envCloudName,
      apiKey: envApiKey,
      apiSecret: envApiSecret,
      uploadPreset: envPreset || '',
      source: 'environment' as const,
    };
  }

  // Fallback to database StoreSettings
  try {
    const settings = await getStoreSettings();
    if (settings.cloudinaryCloudName && settings.cloudinaryApiKey && settings.cloudinaryApiSecret) {
      return {
        cloudName: settings.cloudinaryCloudName,
        apiKey: settings.cloudinaryApiKey,
        apiSecret: settings.cloudinaryApiSecret,
        uploadPreset: settings.cloudinaryUploadPreset || '',
        source: 'settings' as const,
      };
    }
    // Partial configuration (e.g. only preset/cloudName)
    if (settings.cloudinaryCloudName) {
      return {
        cloudName: settings.cloudinaryCloudName,
        apiKey: settings.cloudinaryApiKey || '',
        apiSecret: settings.cloudinaryApiSecret || '',
        uploadPreset: settings.cloudinaryUploadPreset || '',
        source: 'settings' as const,
      };
    }
  } catch (err) {
    console.error('Failed to retrieve settings for Cloudinary:', err);
  }

  return {
    cloudName: envCloudName || '',
    apiKey: envApiKey || '',
    apiSecret: envApiSecret || '',
    uploadPreset: envPreset || '',
    source: 'none' as const,
  };
}

// GET: Check Cloudinary configuration and connection status
export async function GET(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session.authenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const config = await getActiveCloudinaryConfig();
    const isConfigured = Boolean(config.cloudName && config.apiKey && config.apiSecret);

    return NextResponse.json({
      success: true,
      configured: isConfigured,
      cloudName: config.cloudName ? `${config.cloudName.slice(0, 3)}***` : '',
      fullCloudName: config.cloudName || '',
      uploadPreset: config.uploadPreset || '',
      source: config.source,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Upload file directly to Cloudinary
export async function POST(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session.authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin session required' },
        { status: 401 }
      );
    }

    const config = await getActiveCloudinaryConfig();
    if (!config.cloudName || !config.apiKey || !config.apiSecret) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Cloudinary credentials are not configured. Please enter your Cloud Name, API Key, and API Secret in the Admin Dashboard "Images & Media" tab or configure them in your environment variables.',
        },
        { status: 400 }
      );
    }

    // Configure Cloudinary SDK instance
    cloudinary.config({
      cloud_name: config.cloudName,
      api_key: config.apiKey,
      api_secret: config.apiSecret,
      secure: true,
    });

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'momothecat';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file was provided in the upload request' },
        { status: 400 }
      );
    }

    // Convert file to buffer and Base64 Data URI
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || 'image/jpeg';
    const base64Data = `data:${mimeType};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64Data, {
      folder,
      resource_type: 'auto',
      transformation: [
        { quality: 'auto', fetch_format: 'auto' }
      ],
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
    });
  } catch (error: any) {
    console.error('Cloudinary upload failure:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to upload image to Cloudinary',
      },
      { status: 500 }
    );
  }
}
