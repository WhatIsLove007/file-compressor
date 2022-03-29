const mongoose = require('mongoose')

const Schema = mongoose.Schema

const guestScheme = new Schema({
   SESSION_GUEST_ID: {
      type: String,
      required: true,
      minlength: 1, // refactor it
      maxlength: 100, ///////////////////////////// refactor
   },
})

module.exports = mongoose.model('guest', guestScheme)