
/* DESCRIBE IN GITHUB DOCUMENTATATION ABOUT YOUR API, ABOUT WHO ARE USERS AND CANDIDATES AND MANY OTHER

INFORMATION ETC....... */


const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
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
      minlength: 60,    //
      maxlength: 60,   // LOOK WHAT IS FIXING LENGTH OF HASH !!!!!!!!!!!
   },
   SESSION_ID: {
      type: String,
      minlength: 10,
      maxlength: 50,
   },
   passwordRecoveryCode: {
      type: String,
      minlength: 38,
      maxlength: 42,
   }
}, {versionKey: false})


module.exports = mongoose.model('user', userSchema)