import express, { Request, Response } from 'express';
import prisma from '../lib/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const router = express.Router();

router.post('/login', async (req: Request, res: Response) => {
  // Does user exist in database?
  try {
    console.log(req.body.email)
    // First, find the user by email only
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email
      }
    });

    // Validates that a user was found
    if(user === null) {
      return res.status(403).json({ status: "Error", message: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password
    // Accept both 'password' and 'password_hash' from client for backwards compatibility
    const plainPassword = req.body.password || req.body.password_hash;
    const isPasswordValid = await bcrypt.compare(plainPassword, user.password_hash);
    
    if (!isPasswordValid) {
      return res.status(403).json({ status: "Error", message: "Invalid email or password" });
    }

    // Prepare user result without password
    const result = {
      id: user.id,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      apartment_number: user.apartment_number,
      building_name: user.building_name,
      complex_id: user.complex_id,
      move_in_date: user.move_in_date,
    };

    // Yes, user exists in database
    // Creates user token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ status: "Error", message: "JWT secret not configured on server" });
    }

    const token = jwt.sign(
      {
        id: result?.id,
        email: result?.email,
        role: result?.role,
        first_name: result?.first_name,
        last_name: result?.last_name,
        phone: result?.phone,
        apartment_number: result?.apartment_number,
        building_name: result?.building_name,
        complex_id: result?.complex_id,
        move_in_date: result?.move_in_date
      },
      secret,
      { expiresIn: '1h' }
    )

    // Send necessary user information and token to client
    res.status(200).json({
      status: "Ok",
      message: "User successfully retrieved from the database.",
      user: result,
      token
    })
  }
  catch (error: any) {
    res.status(400).json({
      status: "Bad Request",
      message: "There was an error retrieving the user from the database",
      error: error.message,
    })
  }
})

router.post('/register', async (req: Request, res: Response) => {
  try {
    console.log(req.body)
    
    // Hash the password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password_hash, saltRounds);
    
    const result = await prisma.user.create({
      data: {
        ...req.body,
        password_hash: hashedPassword
      },
      // Excludes the user password in the response.
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

    // Creates user token
    const secret = process.env.JWT_SECRET;
    console.log(process.env)
    if (!secret) {
      return res.status(500).json({ status: "Error", message: "JWT secret not configured on server" });
    }

    const token = jwt.sign(
      {
        id: result?.id,
        email: result?.email,
        role: result?.role,
        first_name: result?.first_name,
        last_name: result?.last_name,
        phone: result?.phone,
        apartment_number: result?.apartment_number,
        building_name: result?.building_name,
        complex_id: result?.complex_id,
        move_in_date: result?.move_in_date
      },
      secret,
      { expiresIn: '1h' }
    )
    res.status(201).json({
      status: "Created",
      message: "User successfully created in database.",
      user: result,
      token
    })
  }
  catch (error: any) {
    res.status(400).json({
      status: "Bad Request",
      message: "There was an error creating the user in the database",
      error: error.message,
    })
  }
})
export default router
