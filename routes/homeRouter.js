const express = require('express')
const homeRouter = express.Router()
const homeController = require('../controllers/homeController')


homeRouter.get('/', homeController.home)

homeRouter.get('/about', homeController.about)

homeRouter.get('/signup', homeController.signup)

homeRouter.get('/signup/confirm', homeController.confirmEmail)

homeRouter.get('/signin', homeController.signin)

homeRouter.get('/signin/password-reset', homeController.resetPassword)

homeRouter.get('/signin/password-restore', homeController.restorePassword)  // refactor on getRecoveryPasswordPage, getresetPassPage etc

homeRouter.get('/account', homeController.sendAccountPage)


module.exports = homeRouter