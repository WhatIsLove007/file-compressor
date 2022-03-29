const nodemailer = require('nodemailer')  // MAKE DOCUMENTATION ABOUT THIS AND USE OOP CLASSES

const transporter = nodemailer.createTransport({ 
   service: 'gmail',
   auth: {
      user: 'filecompressorproject@gmail.com',
      pass: 'UDGkO2mNNc4m5gXw',
   }
})


   
module.exports.sendConfirmationEmail = (email, code) => {

   const mailOptions = {
      from: 'filecompressorproject@gmail.com',
      to: `${email}`,
      subject: `Email conformation from File Compressor.`,
      html: `<div style="font-size: 1.4em;"><h2>Greetings from File Compressor!</i></h2>
      <p>Almost done! To complete your File Compressor sign up, we just need to verify your email address: 
      <strong>${email}</strong>.</p><p>To sign up, just enter this code: <strong>${code}</strong> 
      or follow the link: <a href="http://localhost:3000/api/account/confirm-email/${code}">click here</a>.</p>
      <p>If you didn't plan to register on this service - just ignore this letter!</p></div>`
   }
   
   transporter.sendMail(mailOptions, (error, info) => {
      if (error) return console.log(error)
   })
}


module.exports.sendRecoveryPassword = (email, code) => {

   const mailOptions = {
      from: 'filecompressorproject@gmail.com',
      to: `${email}`,
      subject: `Recovery password for File Compressor.`,
      html: `<div style="font-size: 1.4em;"><h2>Greetings from File Compressor!</i></h2>
      <p>File Compressor received a request to recover your password at this email address: <strong>${email}
      </strong>.</p><p>To restore your password, just enter this code: <strong>${code}</strong></p>
      <p>If you didn't make this request, you can ignore this letter or contact support at this address.</p></div>`
   }
   
   transporter.sendMail(mailOptions, (error, info) => {
      if (error) return console.log(error)
   })
}