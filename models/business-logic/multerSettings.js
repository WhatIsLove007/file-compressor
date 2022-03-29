const multer = require('multer')
const path = require('path')
const fs = require('fs')
const token = require('../../models/business-logic/token')
const roleFunctions = require('./roleFunctions')

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      const folderName = token.generateToken(30)
      // req.body['destination-folder'] = folderName
      req['destination-folder'] = folderName
      const filePath = path.join(__dirname, `../../tmp-uploaded-user-files/${folderName}`)
      fs.mkdirSync(path.join(__dirname, `../../tmp-uploaded-user-files/${folderName}`))
      cb(null, filePath)
   },
   filename: (req, file, cb) => {
      const originaleFileName = file.originalname
      const fileName = 'compressed_image'
      let ext = file.mimetype
      if (ext === 'image/jpeg') ext = '.jpg'
      if (ext === 'image/png') ext = '.png'
      cb(null, fileName + ext)
   },
   
})
const multerSettings = multer({
   storage: storage,
   limits: {
      fileSize: 10000000, // 10mb
   },
   fileFilter: (req, file, cb) => {
      const ext = file.mimetype
      if (ext === 'image/jpeg' || ext === 'image/png') cb(null, true)
      else cb(null, false)
   }
})




module.exports = multerSettings.single('file') 