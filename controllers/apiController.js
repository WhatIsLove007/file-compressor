const crypto = require('crypto')
const Cookies = require('cookies')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

const User = require('../models/user')
const Candidate = require('../models/candidate')
const Email = require('../models/business-logic/email')
const token = require('../models/business-logic/token')
const Password = require('../models/business-logic/password')
const imageCompression = require('../models/business-logic/imageCompression')


exports.createAccount = (request, response) => {

   if (!request.body) return response.sendStatus(400)

   const email = request.body.email
   const password = Password.generateHashSync(request.body.password, 10)

   User.findOne({email: email})
      .then(result => {
         if (result) return console.log('ERROR. This email exists...')  // to inform user in frontend that this account exist !!!
         const confirmationCode = token.generateToken(21)
         return Candidate.create({email: email, password: password, confirmationCode: confirmationCode})
      })
      .then((data) => {
         Email.sendConfirmationEmail(email, data.confirmationCode)
         response.redirect('/signup/confirm')

      })
      .catch(error => console.log(error))

}


exports.processConfirmationAccount = (request, response) => {

   const confirmationCode = request.body.code

   if (!confirmationCode) return response.sendStatus(400)

   response.redirect(`/api/account/confirm-email/${confirmationCode}`)

}


exports.confirmAccount = (request, response) => {

   const confirmationCode = request.params.token
   if (!confirmationCode) return response.sendStatus(400)

   const cookies = new Cookies(request, response)

   Candidate.findOne({confirmationCode: confirmationCode})
      .then(result => {
         if (!result) throw response.redirect('/signup/confirm')
         return User.create({_id: result._id, email: result.email, password: result.password})
      })
      .then(result => {
         const SESSION_ID = token.generateToken(16)
         cookies.set('SESSION_ID', SESSION_ID)

         return User.findByIdAndUpdate({'_id': result['_id']}, {$set: {SESSION_ID: SESSION_ID}})
      })
      .then((result) => {
         return Candidate.findByIdAndDelete({_id: result._id})
      })
      .then((result) => {
         // fs.mkdirSync(path.join(__dirname, '/../user-files', result.email))
         response.redirect('/')
      })
      .catch(error => {
         if (error) console.log(error)
      })
}


exports.sendPasswordRecoveryCode = (request, response) => {

   const email = request.body.email
   if (!email) return response.sendStatus(400)

   User.findOne({email: email})
   .then(result => {
      if (!result) throw response.redirect('/signin/password-reset')
      const recoveryCode = token.generateToken(30)
      Email.sendRecoveryPassword(result.email, recoveryCode)
      return User.findOneAndUpdate({'_id': result['_id']}, {$set: {passwordRecoveryCode: recoveryCode}})
   })
   .then(() => {
      response.redirect('/signin/password-restore')
   })
   .catch(error => console.log(error))
}

exports.recoverPassword = (request, response) => {
   if (!request.body) return response.redirect('/signin/password-restore')
   const code = request.body.code
   const newPassword = Password.generateHashSync(request.body.password, 10)       // AFTER ALL REFACTOR IT TO ASYNC PROMISE AND THIS OPERATION ABOVE
   const cookies = new Cookies(request, response)
   const SESSION_ID = token.generateToken(16)

   User.findOneAndUpdate({passwordRecoveryCode: code}, {$set: {password: newPassword, SESSION_ID: SESSION_ID}})
      .then(result => {
         if (!result) throw response.redirect('/signin/password-restore')
         cookies.set('SESSION_ID', SESSION_ID)
         return User.updateOne({'_id': result['id']}, {$unset: {passwordRecoveryCode: 1}})
      })
      .then(() => {
         response.redirect('/')
      })
      .catch(error => {
         if (error) console.log(error)
      })
}

exports.signin = (request, response) => {

   if (!request.body) return response.status(400).redirect('/')

   const email = request.body.email
   const password = request.body.password

   const SESSION_ID = token.generateToken(16)

   User.findOne({email: email})
      .then(data => {
         if (!data) throw null
         const isAuthenticated  = Password.compareHashSync(password, data.password)
         if (!isAuthenticated) throw null
         return User.findOneAndUpdate({email: email}, {$set: {SESSION_ID: SESSION_ID}})
      })
      .then(data => {
         const cookies = new Cookies(request, response)
         cookies.set('SESSION_ID', SESSION_ID)
         response.redirect('/')
      })
      .catch(error => {
         if (error) console.log()
         response.status(400).redirect('/signin')
      })
}

exports.logout = (request, response) => {

   const cookies = new Cookies(request, response)
   const SESSION_ID = cookies.get('SESSION_ID')

   if (!SESSION_ID) return response.status(401).redirect('/')

   User.findOneAndUpdate({SESSION_ID: SESSION_ID}, {$unset: {SESSION_ID: 1}})
      .then(data => {
         if (!data) {
            throw cookies.set('SESSION_ID')
         }
         cookies.set('SESSION_ID')
         response.send({isLogouted: true})
      })
      .catch(error => {
         if (error) console.log(error)
      })

}


exports.deleteAccount = (request, response) => {  // !!!!!!!!!!! NOT POST USE DELETE | ADD FUNCTION TO CHANGE PASSWORD

   const cookies = new Cookies(request, response)
   const userSessionId = cookies.get('SESSION_ID')  // and after all delete cookie in user browser

   if (!userSessionId) return response.sendStatus(401)

   User.findOneAndDelete({SESSION_ID: userSessionId})
      .then(data => {
         if (!data) {
            response.sendStatus(401)
            throw null
         }
      })
      .then(() => {
         cookies.set('SESSION_ID')
         response.send({isDeleted: true})
      })
      .catch(error => {
         if (error) {
            console.log(error)
            response.sendStatus(400)
         }
      })
}


exports.changePassword = (request, response) => {  // We get old password compare it with pass DB and we get new pass

   const oldPassword = request.body.oldPassword
   const newPassword = request.body.newPassword

   if (!oldPassword || !newPassword) return response.sendStatus(400)

   const cookies = new Cookies(request, response)
   const userSessionId = cookies.get('SESSION_ID')

   User.findOne({SESSION_ID: userSessionId})
      .then(data => {
         if (!data) {
            response.sendStatus(403)
            throw null
         }

         const isAuthenticated = Password.compareHashSync(oldPassword, data.password)
         if (!isAuthenticated) {
            response.sendStatus(403)
            throw null
         }

         const hashedNewPassword = Password.generateHashSync(newPassword, 10)
         return User.findOneAndUpdate({email: data.email}, {$set: {password: hashedNewPassword}})
      })
      .then(() => {
         response.sendStatus(200)
      })
      .catch(error => {
         if (error) {
            console.log(error)
            response.sendStatus(500)
         }
      })
}


exports.compressImage = (request, response) => {


   if (!request.file) return response.status(400).send('You can use only JPEG and PNG. Try again.')

   const file = request.file
   const fileName = request.file.filename
   const filePath = request.file.path
   const fileDestination = request.file.destination
   const destinationFolder = request['destination-folder']

   if (!file || !destinationFolder) return response.sendStatus(400)

   const compression = request.body.compression
   let jpegCompression, pngCompression

   switch (compression) {
      case 'COMPRESS':
         jpegCompression = 75
         pngCompression = [0.6, 0.8]
         break
      case 'MAX COMPRESSION':
         jpegCompression = 5
         pngCompression = [0, 0.1]
         break
      default:
         return response.sendStatus(400)
   }


   imageCompression.compressImage(filePath, fileDestination, jpegCompression, pngCompression)
      .then(() => {
         response.download(filePath, error => {
            if (error) console.log(error)
            fs.unlink(filePath, error => {
               if (error) console.log(error)
               fs.rmdir(fileDestination, error => {
                  if (error) console.log(error)
               })

            })
         })

      })
      .catch(error => {
         console.log(error)
         response.sendStatus(500)
      })

}

exports.verifyAccessKey = (request, response) => {

   const entryKey = request.body['entry-key']
   const key1 = 'GermanLovesUkraine'
   const key2 = 'russianWarshipGoFuckYourself'

   if (!entryKey) return response.sendStatus(400)

   if (entryKey === key1 || entryKey === key2) {
      const cookies = new Cookies(request, response)
      cookies.set('SESSION_GUEST_ID', 'YGHkCsAQIBH0F5cS')
      return response.redirect('/')
   }
   
   return response.status(400).redirect('/')
}



// ================================= AJAX =================================
module.exports.sendHeaderData = (request, response) => {

   const cookies = new Cookies(request, response)
   const SESSION_ID = cookies.get('SESSION_ID')
   if (!SESSION_ID) return response.send({isUser: false})

   User.findOne({SESSION_ID: SESSION_ID})
      .then(data => {
         if (!data) response.send({isUser: false})
         else response.send({isUser: true})
      })
      .catch(error => console.log(error))
}

module.exports.sendAccountPageData = (request, response) => {

   const cookies = new Cookies(request, response)
   const SESSION_ID = cookies.get('SESSION_ID')

   if (!SESSION_ID) return response // ============== refactor

   User.findOne({SESSION_ID: SESSION_ID})
      .then(data => {
         if (!data) throw null
         response.send({email: data.email})
      })
      .catch(error => {
         if (error) console.log()
         response.sendStatus(401)
      })
}
// ================================ /AJAX =================================
