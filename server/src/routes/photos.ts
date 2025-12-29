import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '../lib/s3Client';
import express, { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest, authenticateToken } from '../middleware/auth';
import { triggerAsyncId } from 'async_hooks';

interface File {
  name: string;
  type: string;
}

const router = express.Router();

// GET all photos (requires authentication)
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
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
router.post('/presigned-urls', authenticateToken, async (req: AuthRequest, res: Response) => {
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


// POST a new photo (requires authentication)
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
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
    await prisma.photo.createMany({
      data: photos.map(photo => ({
        issue_id: parseInt(issueId),
        file_path: photo.fileUrl,
        file_name: photo.fileName,
        file_size: photo.fileSize,
        mime_type: photo.mimeType,
        caption: photo.caption || ''
      }))
    });

    const savedPhotos = await prisma.photo.findMany({
      where: {
        issue_id: parseInt(issueId)
      },
      orderBy: {
        uploaded_at: 'desc'
      },
      take: photos.length
    });
    res.json(savedPhotos);

  } catch (error: any) {
    console.error('Error saving photos:', error);
    res.status(500).json({ error: error.message });
  }
});
// PUT a photo (requires authentication)
router.put("/:photoId", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const uniquePhoto = await prisma.photo.findUnique({
      where: {
        id: Number(req.body.id)
      }
    })

    // Validates photo's existence
    if(uniquePhoto === null){
      return res.status(404).json({
        message: "There is no photo with the ID: " + req.body.id
      })
    }

    const updatedPhoto = await prisma.photo.update({
      data: req.body,
      where: {
        id: Number(req.body.id)
      },
      select: {
        id: true,
        issue_id: true,
        file_path: true,
        file_name: true,
        file_size: true,
        mime_type: true,
        caption: true,
        uploaded_at:true
      }
    })

    return res.status(201).json({
      message: "Photo successfully updated",
      photo: updatedPhoto
    })
  } catch(error: any) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: "ERROR: " + error.message
    })
  }
})

// DELETE a photo (requires authentication)
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
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
