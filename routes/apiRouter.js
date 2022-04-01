const express = require('express')
const apiRouter = express.Router()
const urlEncodedParser = express.urlencoded({extended: false})
const jsonParser = express.json()
const apiController = require('../controllers/apiController')
const multerSettings = require('../models/business-logic/multerSettings')

                                       // CREATE DOCUMENTATION WHERE YOU EXPLAIN AND DESCRIBE ABOUT YOUR API AND API ROUTES
apiRouter.post('/account/create', jsonParser, apiController.createAccount)

apiRouter.get('/account/confirm-email/:token', apiController.confirmAccount)

apiRouter.post('/account/send-password-recovery-code', urlEncodedParser, apiController.sendPasswordRecoveryCode)

apiRouter.post('/account/password/recover', urlEncodedParser, apiController.recoverPassword)

apiRouter.delete('/account/delete', apiController.deleteAccount)

apiRouter.put('/account/change-password', jsonParser, apiController.changePassword)

apiRouter.post('/tools/compress-image', multerSettings, apiController.compressImage)

apiRouter.post('/middleware/access-key-verification', jsonParser, apiController.verifyAccessKey)

apiRouter.get('/site-elements/header-data', apiController.sendHeaderData)

apiRouter.get('/site-elements/account-page-data', apiController.sendAccountPageData)

apiRouter.delete('/account/logout', apiController.logout)

apiRouter.post('/account/signin', jsonParser, apiController.signin)





module.exports = apiRouter