const express = require('express')
const middlewareRouter = express.Router()
const middlewareController = require('../controllers/middlewareController')


middlewareRouter.use('/', middlewareController.middleware)



module.exports = middlewareRouter