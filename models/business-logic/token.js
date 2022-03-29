const crypto = require('crypto')  // DESCRIBE DOCUMENTATION ABOUT THIS MODULE


module.exports.generateToken = (size) => {
   return crypto.randomBytes(size).toString('base64url')
}


