import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req: Request, res: Response) => {
  try {
    // Fetch all users from the database
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// OTHER ENDPOINTS TO ADD:

// GET a specific user
// GET all users for a specific complex
// POST a new user
router.post('/', async (req: Request, res: Response) => {
  try {
    const result = await prisma.user.create({
      data: req.body
    })
    res.json({
      status: "Ok",
      message: "User successfully created in database.",
      result: "Result of request: " + " " + result
    })
  }
  catch(error){
    res.json({
      status: "Bad Request",
      message: "There was an error creating the user in the database",
      error: error,
    })
  }
})
// PUT a user
// DELETE a user

export default router;
