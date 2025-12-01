import express, { Request, Response } from 'express';
import prisma from '../lib/prisma';
import jwt from 'jsonwebtoken';
const router = express.Router();

router.post('/login', async (req: Request, res: Response) => {
  // Does user exist in database?
  try {
    const result = await prisma.user.findUnique({
      where: {
        email: req.body.email,
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

    // Yes, user exists in database

    // Creates user token
    const secret = process.env.JWT_SECRET;
    console.log(process.env)
    if (!secret) {
      return res.status(500).json({ status: "Error", message: "JWT secret not configured on server" });
    }

    const token = jwt.sign(
      {
        userId: result?.id,
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
    const result = await prisma.user.create({
      data: req.body,
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
        userId: result?.id,
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
