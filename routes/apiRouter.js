const express = require('express')
const apiRouter = express.Router()
const urlEncodedParser = express.urlencoded({extended: false})
const jsonParser = express.json()
const apiController = require('../controllers/apiController')
const multerSettings = require('../models/business-logic/multerSettings')


apiRouter.post('/account', jsonParser, apiController.createAccount)

apiRouter.delete('/account', apiController.deleteAccount)

apiRouter.post('/account/signin', jsonParser, apiController.signin)

apiRouter.delete('/account/logout', apiController.logout)

apiRouter.get('/account/confirm-email/:token', apiController.confirmAccount)

apiRouter.post('/account/send-password-recovery-code', jsonParser, apiController.sendPasswordRecoveryCode)

apiRouter.post('/account/password/recover', jsonParser, apiController.recoverPassword)

apiRouter.put('/account/change-password', jsonParser, apiController.changePassword)

apiRouter.get('/site-elements/header-data', apiController.sendHeaderData)

apiRouter.get('/site-elements/account-page-data', apiController.sendAccountPageData)

apiRouter.post('/tools/compress-image', multerSettings, apiController.compressImage)

apiRouter.post('/middleware/access-key-verification', jsonParser, apiController.verifyAccessKey)




module.exports = apiRouter