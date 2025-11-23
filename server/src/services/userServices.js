/*
This module will be responsible for handling all
user resource manipulation. This will include 
user creation, user updating, and user deleting.
*/

// Imports the Prisma Client, accessing the ORM
const prisma = require("../../prisma/client.js")

// These functions will be operating asynchronously
// and will require that we use the async...await keys
async function createUserInDB(req, res){
    // This operation will handle the creation of users
    // in the PostGreSQL database.

    // Passes the user sent registration credentials to
    // the prisma client. Maps the user sent data to the
    // user model found in the schema.prisma file.
    try{
        const user = await prisma.user.create({ 
            data: {
                name: req.body.name,
            }
        })
        return res.json({
            message: {
                id: user.id,
                name: user.name,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        })

    }
    catch(error){
        return res.status(500).json({
            status: "Method not allowed",
            message: "The POST method for this resource has not yet been implemented" + " " + error,
            timestamp: new Date().toISOString()
        })
    }
}

async function getUserInDB(req, res){
    try {
        const users = await prisma.user.findMany()
        return res.status(200).json({
            status: "Ok",
            message: "Successfully retrieved data from database",
            length: "# of entries:" + " " + users.length,
            users: users,
        })
    }
    catch(error) {
        return res.status(400).json({
            status: "Bad Request",
            message: "There was an issue retrieving data at this endpoint:" + " " + error,
            timestamp: new Date().toISOString()
        })
    }
}

module.exports = { createUserInDB, getUserInDB }
