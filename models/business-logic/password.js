const bcrypt = require('bcrypt') // WRITE DOCUMENTATION


module.exports.generateHash = (password, salt) => {
   bcrypt.hash(password, salt, (error, hash) => {
      if (error) return console.log(error)
      return hash
   })
}

module.exports.generateHashSync = (password, salt) => {
   return bcrypt.hashSync(password, salt)
}


module.exports.compareHash = (password, hashedPassword) => {
   bcrypt.compare(password, hashedPassword, (error, result) => {    // FOR DOCUMENTATION ALWAYS RETURNS BOOLEAN TRUE OR FALSE
      if (error) return console.log(error)
      return result
   })  
}

module.exports.compareHashSync = (password, hashedPassword) => {
   return bcrypt.compareSync(password, hashedPassword)
}