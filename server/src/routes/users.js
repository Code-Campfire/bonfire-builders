const express = require('express')
const userServices = require("../services/userServices.js")

const router = express.Router()

router.get('/health', async (req, res) => {
    try {
        res.json({
            status: 'ok',
            message: 'You are now at the users route in the API',
            timestamp: new Date().toISOString()
        })
    }
    catch(error) {
        console.log("There has been an error connecting to this route within the API:", error)
        res.status(500).json({
            status: "Internal Server Error",
            message: "There was error in the server, see here:" + " " + error,
            timestamp: new Date().toISOString()
        })
    }
})

router.get('/', async (req, res) => {
    return await userServices.getUserInDB(req, res)
})

router.post('/create', async (req, res) => {
    return await userServices.createUserInDB(req, res)
})

// Exports all routes registered in this file.
module.exports = router