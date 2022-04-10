/*
   If data has not been validated - function returns message about error (string)
   If data has been validated - function returns false (boolean)
 */

const validator = require('validator')



module.exports.validateEmail = (email) => {
   
   if (!validator.isEmail(email)) {
      return 'Incorrect email'
   }

   return false

}

module.exports.validatePassword = (password, minLenght = 4, maxLength = 16) => {
   
   if (!validator.isLength(password, {min: minLenght, max: maxLength})) {
      return 'Incorrect password length'
   }

   if (!validator.isAlphanumeric(password, 'en-US', {ignore: '_'})) {
      return 'Incorrect password syntax'
   }

   return false

}

module.exports.validateCode = (code, minLenght = 28, maxLength = 28) => {
   
   if (!validator.isLength(code, {min: minLenght, max: maxLength})) {
      return 'Incorrect code length'
   }

   if (!validator.isAlphanumeric(code, 'en-US', {ignore: '-_'})) {
      return 'Incorrect code syntax'
   }

   return false
}