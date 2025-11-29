// Import the Prisma Client, giving access to the Prisma ORM.
const { PrismaClient } = require('@prisma/client');
// Initializes the Prisma Client object
const prisma = new PrismaClient();

// Exports the prisma client to routes requiring ORM functionality
module.exports = prisma;