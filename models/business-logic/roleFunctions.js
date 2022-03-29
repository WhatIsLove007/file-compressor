const mongoose = require('mongoose')
const User = require('../../models/user')

module.exports.isUser = (SESSION_ID) => {
   User.findOne({SESSION_ID: SESSION_ID})
      .then(data => {
         if (!data) return false
         return true
      })
      .catch(error => console.log(error))
}