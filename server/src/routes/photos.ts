import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '../lib/s3Client';
import express, { Request, Response } from 'express';
import prisma from '../lib/prisma';

interface File {
  name: string;
  type: string;
}

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    // Fetch all photos from the database
    const photos = await prisma.photo.findMany();
    res.json(photos);
  } catch (error: any) {
    console.error('Error fetching photos:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// Get presigned URLs (temporary URL that allows the client to upload to S3 directly)
router.post('/presigned-urls', async (req: Request, res: Response) => {
  try {
    const { files }: { files: File[] } = req.body;
    const presignedUrls = await Promise.all(
  files.map(async (file: File, index: Number) => {
    const key = `uploads/${Date.now()}-${index}-${file.name}`;
    
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      ContentType: file.type
    });  // Close the PutObjectCommand here
    
    const uploadUrl = await getSignedUrl(s3Client, command, { 
      expiresIn: 300
    });
    
    // Return what the frontend needs
    return {
      uploadUrl,
      key,
      fileUrl: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    };
  })
);
  res.json({ presignedUrls });
  } catch (error: any) {
    console.error('Error generating presigned URLs:', error);
    res.status(500).json({ error: error.message });
  }
});

// OTHER ENDPOINTS TO ADD:

// GET all photos for a specific issue
// POST a new photo
router.post('/', async (req: Request, res: Response) => {
  try {
    const { photos, issueId } = req.body;
    
    // Validate input
    if (!photos || !Array.isArray(photos) || photos.length === 0) {
      return res.status(400).json({ error: 'Photos array is required' });
    }
    
    if (!issueId) {
      return res.status(400).json({ error: 'Issue ID is required' });
    }
    
    // Save photos to database
    const savedPhotos = await prisma.photo.createMany({
      data: photos.map(photo => ({
        issue_id: parseInt(issueId),
        file_path: photo.fileUrl,
        file_name: photo.fileName,
        file_size: photo.fileSize,
        mime_type: photo.mimeType,
        caption: photo.caption || ''
      }))
    });
    
    res.json({ 
      success: true, 
      count: savedPhotos.count 
    });
    
  } catch (error: any) {
    console.error('Error saving photos:', error);
    res.status(500).json({ error: error.message });
  }
});
// PUT a photo
// DELETE a photo

export default router;
