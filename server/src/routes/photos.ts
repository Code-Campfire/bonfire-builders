import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '../lib/s3Client';
import express, { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest, authenticateToken } from '../middleware/auth';

interface File {
  name: string;
  type: string;
}

const router = express.Router();

// GET all photos
router.get('/', async (req: Request, res: Response) => {
  try {
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
        });

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
// DELETE a photo
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const photoId = parseInt(req.params.id);

    // Get the photo from database to get the S3 URL
    const photo = await prisma.photo.findUnique({
      where: { id: photoId }
    });

    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    // Extract S3 key from the file_path URL
    const urlParts = new URL(photo.file_path);
    const s3Key = urlParts.pathname.substring(1); // Remove leading slash

    // Delete from S3
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: s3Key
    });

    await s3Client.send(deleteCommand);

    // Delete from database
    await prisma.photo.delete({
      where: { id: photoId }
    });

    res.json({
      success: true,
      message: 'Photo deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting photo:', error);
    res.status(500).json({ error: error.message });
  }
});


export default router;
