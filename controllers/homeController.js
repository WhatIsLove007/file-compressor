const Cookies = require('cookies')
const User = require('../models/user')

exports.home = (request, response) => {
   response.render('index')
}

exports.about = (request, response) => {   
   response.render('html/about')
}

exports.sendAccountPage = (request, response) => {

   const cookies = new Cookies(request, response)
   const SESSION_ID = cookies.get('SESSION_ID')

   if (!SESSION_ID) return response.status(401).redirect('/')

   User.findOne({SESSION_ID: SESSION_ID})
      .then(data => {
         if (!data) {
            cookies.set('SESSION_ID')
            throw null
         }
         response.render('html/account')
      })
      .catch(error => {
         if (error) console.log(error)
         response.status(401).redirect('/')
      })

}

exports.signup = (request, response) => {
   response.render('html/registration')
}

exports.signin = (request, response) => {
   response.render('html/authorization')
}

exports.confirmEmail = (request, response) => {
   response.render('html/email-confirmation')

}

exports.resetPassword = (request, response) => {
   response.render('html/password-reset')
}

exports.restorePassword = (request, response) => {
   response.render('html/password-restore')
}