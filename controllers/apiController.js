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
const entryDataValidation = require('../models/business-logic/entryDataValidation')


exports.createAccount = (request, response) => {

   if (!request.body) return response.status(400).send({message: 'No data body received'})

   const emailIsValidated = entryDataValidation.validateEmail(request.body.email)
   const passwordIsValidated = entryDataValidation.validatePassword(request.body.password)

   if (emailIsValidated) return response.status(400).send({message: emailIsValidated})
   if (passwordIsValidated) return response.status(400).send({message: passwordIsValidated})

   const email = request.body.email
   const password = Password.generateHashSync(request.body.password, 10)
   const confirmationCode = token.generateToken(21)

   User.findOne({email: email})
      .then(result => {
         if (result) {
            response.status(401).send({message: 'Email already exists'})
            throw null
         }
         return Candidate.findOneAndUpdate({
            email: email}, 
            {$set: {password: password, confirmationCode: confirmationCode}
         })
      })
      .then(result => {
         if (result === null) {
            return Candidate.create({email: email, password: password, confirmationCode: confirmationCode})
         }
      })
      .then(() => {
         Email.sendConfirmationEmail(email, confirmationCode)
         response.sendStatus(200)

      })
      .catch(error => {
         if (error) {
            console.log(error)
            response.status(500).send({message: 'Server error'})
         }
      })

}


exports.confirmAccount = (request, response) => {

   const confirmationCode = request.params.token

   if (!confirmationCode) return response.status(400).send({message: 'No code received'})

   const codeIsValidated = entryDataValidation.validateCode(confirmationCode)
   if (codeIsValidated) return response.status(400).send({message: codeIsValidated})

   const cookies = new Cookies(request, response)

   Candidate.findOne({confirmationCode: confirmationCode})
      .then(result => {
         if (!result) {
            response.status(401).send({message: 'Wrong confirmation code'})
            throw null
         }
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
         response.redirect('/')
      })
      .catch(error => {
         if (error) {
            console.log(error)
            response.status(500).send({message: 'Server error'})
         }
      })
}


exports.sendPasswordRecoveryCode = (request, response) => {

   const email = request.body.email

   if (!email) return response.status(400).send({message: 'No data body received'})

   const emailIsValidated = entryDataValidation.validateEmail(email)
   if (emailIsValidated) return response.status(400).send({message: emailIsValidated})

   User.findOne({email: email})
   .then(result => {
      if (!result) {
         response.status(401).send({message: 'Email does not exist'})
         throw null
      }
      const recoveryCode = token.generateToken(21)
      Email.sendRecoveryPassword(result.email, recoveryCode)
      return User.findOneAndUpdate({'_id': result['_id']}, {$set: {passwordRecoveryCode: recoveryCode}})
   })
   .then(() => {
      response.sendStatus(200)
   })
   .catch(error => {
      if (error) {
         console.log(error)
         response.status(500).send({message: 'Server error'})
      }
   })
}

exports.recoverPassword = (request, response) => {

   if (!request.body.code || !request.body.password) {
      return response.status(400).send({message: 'No data body received'})
   }

   const codeIsValidated = entryDataValidation.validateCode(request.body.code)
   const passwordIsValidated = entryDataValidation.validatePassword(request.body.password)

   if (codeIsValidated) return response.status(400).send({message: codeIsValidated})
   if (passwordIsValidated) return response.status(400).send({message: passwordIsValidated})

   const code = request.body.code
   const newPassword = Password.generateHashSync(request.body.password, 10)
   const cookies = new Cookies(request, response)
   const SESSION_ID = token.generateToken(16)

   User.findOneAndUpdate({passwordRecoveryCode: code}, {$set: {password: newPassword, SESSION_ID: SESSION_ID}})
      .then(result => {
         if (!result) {
            response.status(401).send({message: 'Wrong recovery code'})
            throw null
         }
         cookies.set('SESSION_ID', SESSION_ID)
         return User.updateOne({'_id': result['id']}, {$unset: {passwordRecoveryCode: 1}})
      })
      .then(() => {
         response.sendStatus(200)
      })
      .catch(error => {
         if (error) {
            console.log(error)
            response.status(500).send({message: 'Server error'})
         }
      })
}

exports.signin = (request, response) => {

   if (!request.body) return response.status(400).send({message: 'No data body received'})

   const email = request.body.email
   const password = request.body.password

   const emailIsValidated = entryDataValidation.validateEmail(email)
   const passwordIsValidated = entryDataValidation.validatePassword(password)

   if (emailIsValidated) return response.status(400).send({message: emailIsValidated})
   if (passwordIsValidated) return response.status(400).send({message: passwordIsValidated})

   const SESSION_ID = token.generateToken(16)

   User.findOne({email: email})
      .then(data => {
         if (!data) {
            response.status(401).send({message: 'Email does not exist'})
            throw null 
         }
         const isAuthenticated  = Password.compareHashSync(password, data.password)
         if (!isAuthenticated) {
            response.status(401).send({message: 'Wrong password'})
            throw null 
         }
         return User.findOneAndUpdate({email: email}, {$set: {SESSION_ID: SESSION_ID}})
      })
      .then(() => {
         const cookies = new Cookies(request, response)
         cookies.set('SESSION_ID', SESSION_ID)
         response.sendStatus(200)
      })
      .catch(error => {
         if (error) {
            console.log(error)
            response.status(500).send({message: 'Server error'})
         }
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


exports.deleteAccount = (request, response) => {

   const cookies = new Cookies(request, response)
   const userSessionId = cookies.get('SESSION_ID')

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


exports.changePassword = (request, response) => {

   const oldPassword = request.body.oldPassword
   const newPassword = request.body.newPassword

   if (!oldPassword || !newPassword) return response.status(400).send({message: 'No data body received'})

   const oldPasswordIsValidated = entryDataValidation.validatePassword(oldPassword)
   const newPasswordIsValidated = entryDataValidation.validatePassword(newPassword)

   if (oldPasswordIsValidated) return response.status(400).send({message: oldPasswordIsValidated})
   if (newPasswordIsValidated) return response.status(400).send({message: newPasswordIsValidated})


   const cookies = new Cookies(request, response)
   const userSessionId = cookies.get('SESSION_ID')

   User.findOne({SESSION_ID: userSessionId})
      .then(data => {
         if (!data) {
            cookies.set('SESSION_ID')
            response.status(403).send({message: 'User is unauthorized'})
            throw null
         }

         const isAuthenticated = Password.compareHashSync(oldPassword, data.password)
         if (!isAuthenticated) {
            response.status(403).send({message: 'Wrong current password'})
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
            response.status(500).send({message: 'Server error'})
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
   const key1 = 'Xt4rZMBvEoW9W2mW'
   const key2 = 'russianWarshipGoFuckYourself'

   if (!entryKey) return response.sendStatus(400)

   if (entryKey === key1 || entryKey === key2) {
      const cookies = new Cookies(request, response)
      cookies.set('SESSION_GUEST_ID', 'YGHkCsAQIBH0F5cS')
      return response.sendStatus(200)
   }
   
   return response.sendStatus(401)
}


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

   if (!SESSION_ID) return response.sendStatus(401)

   User.findOne({SESSION_ID: SESSION_ID})
      .then(data => {
         if (!data) {
            cookies.set('SESSION_ID')
            response.sendStatus(403)
            throw null
         }
         response.send({email: data.email})
      })
      .catch(error => {
         if (error) {
            console.log(error)
            response.sendStatus(500)
         }
      })
}