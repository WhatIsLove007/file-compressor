
/* DESCRIBE IN GITHUB DOCUMENTATATION ABOUT YOUR API, ABOUT WHO ARE USERS AND CANDIDATES AND MANY OTHER

INFORMATION ETC....... */

// W R I T E    D O C U M E N T A T I O N  ! ! !

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const candidateSchema = new Schema({
   email: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 40,
   },
   password: {
      type: String,
      required: true,
      minlength: 60,
      maxlength: 60,
   },
   confirmationCode: {
      type: String,
      required: true,
      unique: true,
      minlength: 28,
      maxlength: 28,
   },

}, {versionKey: false})


module.exports = mongoose.model('candidate', candidateSchema)