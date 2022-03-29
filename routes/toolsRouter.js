const express = require('express')
const toolsRouter = express.Router()
const toolsController = require('../controllers/toolsController')


toolsRouter.get('/image-compression', toolsController.sendImageCompressionPage)



module.exports = toolsRouter