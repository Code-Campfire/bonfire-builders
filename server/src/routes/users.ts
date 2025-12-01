import express, { Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    // Fetch all users from the database
    const users = await prisma.user.findMany();
    console.log(users)
    res.json(users);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// GET a specific user
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const uniqueUser = await prisma.user.findUnique({
      where: {
        id: Number(req.params.id)
      },
      select: {
        id: true,
        email: true,
        role: true,
        first_name: true,
        last_name: true,
        phone: true,
        apartment_number: true,
        building_name: true,
        complex_id: true,
        move_in_date: true,
      }
    })

    // Checks that user is not null
    // Required, given TypeScript's property chaining
    // See lines 57 - 66, character "?"
    if(uniqueUser === null) {
      return res.status(404).json({
        message: "There is no user in the database with this ID: " + req.params.id,
        error: "User does not exist"
      })
    }

    res.status(200).json({
      message: "Unique user found by user ID",
      user: {
        id: uniqueUser?.id,
        email: uniqueUser?.email,
        role: uniqueUser?.role,
        first_name: uniqueUser?.first_name,
        last_name: uniqueUser?.last_name,
        phone: uniqueUser?.phone,
        apartment_number: uniqueUser?.apartment_number,
        building_name: uniqueUser?.building_name,
        address: uniqueUser?.complex_id,
        move_in_date: uniqueUser?.move_in_date,
      }
    })
  }
  catch(error: any){
    res.status(500).json({
      message: "Internal Server Error",
      error: "ERROR: " + error.message
    })
  }
})
// GET all users for a specific complex
router.get('/in-apartment/:apartmentId', async (req: Request, res: Response) => {
  try {
    const usersByApartmentId = await prisma.user.findMany({
      where: {
        complex_id: Number(req.params.apartmentId)
      },
      select: {
        id: true,
        email: true,
        role: true,
        first_name: true,
        last_name: true,
        phone: true,
        apartment_number: true,
        building_name: true,
        complex_id: true,
        move_in_date: true,
      }
    })

    if(usersByApartmentId.length === 0) {
      return res.status(404).json({
        message: "Not found",
        error: "No users in apartment: " + req.params.apartmentId // Keep in mind, this apartment may not exist.
                                                                  // We are looking for relationships of users to apartment
      })
    }

    res.json(usersByApartmentId)
  }
  catch(error: any){
    res.status(500).json({
      message: "Internal Server Error",
      error: "ERROR: " + error.message
    })
  }
})

// PUT a user
router.put('/:id', async (req: Request, res: Response) => {
  try {
    // Verifies that user first exists before update
    const uniqueUser = await prisma.user.findUnique({
      where: {
        id: Number(req.params.id)
      }
    })

    // User does not exist, quits query and responds
    if (uniqueUser === null) {
      res.status(404).json({
        message: "There was an error updating the user",
        error: "ERROR: No user found with ID: " + req.params.id
      })
    }

    // User exists, performs update and responds
    const result = await prisma.user.update({
      data: req.body,
      where: {
        id: Number(req.params.id)
      },
      // Excludes password and metadata from response
      select: {
        id: true,
        email: true,
        role: true,
        first_name: true,
        last_name: true,
        phone: true,
        apartment_number: true,
        building_name: true,
        complex_id: true,
        move_in_date: true,
      }
    })
        
    res.status(200).json({
      message: "User successfully updated",
      user: result
    })
  }
  catch(error: any) {
    res.status(500).json({
      message: "Internal Server Error",
      error: "ERROR: " + error.message
    })
  }
})

// DELETE a user
router.delete("/:id", async (req: Request, res: Response) => {
  try {
     // Verifies that user first exists before update
    const uniqueUser = await prisma.user.findUnique({
      where: {
        id: Number(req.params.id)
      }
    })

    // User does not exist, quits query and responds
    if (uniqueUser === null) {
      res.status(404).json({
        message: "There was an error deleting the user",
        error: "ERROR: No user found with ID: " + req.params.id
      })
    }

    // Users exists in the database, deletes and responds
    const userToDelete = await prisma.user.delete({
      where: {
        id: Number(req.params.id)
      }
    })

    res.status(204).json({})
  }
  catch(error: any) {
    res.status(500).json({
      message: "Internal Server Error",
      error: "ERROR: " + error.message
    })
  }
})

export default router;
