'use strict'


if (window.location.pathname === '/signup') {

   const registrationBlock = document.querySelector('.registration-block')
   const signupEmailInput = document.querySelector('#signup-email')
   const signupPasswordInput = document.querySelector('#signup-password')
   const signupBtn = document.querySelector('#signup-btn')


   if (registrationBlock) {
      animateBlockElement(registrationBlock)
   }


   if (signupEmailInput && signupPasswordInput && signupBtn) {


      animateSubmitButton(signupBtn)

      signupBtn.addEventListener('click', () => {

         signupBtn.style.backgroundColor = 'rgb(1, 185, 93)'
         setTimeout(() => {
            signupBtn.style.backgroundColor = 'rgb(111, 214, 163)'
         }, 300);

         if (validateData(signupEmailInput, signupPasswordInput) === false) return null

         const email = signupEmailInput.value.toLowerCase()
         const password = signupPasswordInput.value
   
         fetch('/api/account/create', {
            method: 'POST',
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({
               email: email,
               password: password,
            })
         })
            .then(response => {
               if (response.ok === true) throw window.location.replace('/signup/confirm')
               return response.json()
            })
            .then(response => {
               if (response.emailExists === true) {
                  showErrorMessage('This email already exists', signupEmailInput)
               }  else if (response.badRequest === true) {
                  showErrorMessage('Client error', signupEmailInput)
               }  else {
                  showErrorMessage('Server error', signupPasswordInput)
               }
               
            })
            .catch(error => {
               if (error) console.log(error)
            })
   
      })

   }


}


if (window.location.pathname === '/signin') {

   const authorizationBlock = document.querySelector('.authorization-block')
   const signinEmailInput = document.querySelector('#signin-email')
   const signinPasswordInput = document.querySelector('#signin-password')
   const signinBtn = document.querySelector('#signin-btn')


   if (authorizationBlock) {
      animateBlockElement(authorizationBlock)
   }


   if (signinEmailInput && signinPasswordInput && signinBtn) {


      animateSubmitButton(signinBtn)


      signinBtn.addEventListener('click', () => {

         signinBtn.style.backgroundColor = 'rgb(1, 185, 93)'
         setTimeout(() => {
            signinBtn.style.backgroundColor = 'rgb(111, 214, 163)'
         }, 300);

         if (validateData(signinEmailInput, signinPasswordInput) === false) return null

         const email = signinEmailInput.value.toLowerCase()
         const password = signinPasswordInput.value

         fetch('/api/account/signin', {
            method: 'POST',
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({
               email: email,
               password: password,
            })
         })
            .then(response => {
               if (response.ok === true) throw window.location.replace('/')
               else return response.json()
            })
            .then(response => {
               if (response.authenticatedEmail === false) {
                  showErrorMessage('This email is not registered', signinEmailInput)
               }  else if (response.authenticatedPassword === false) {
                  return showErrorMessage('Wrong password', signinPasswordInput)
               }  else if (response.badRequest === true) {
                  showErrorMessage('Client error', signinEmailInput)
               }  else {
                  showErrorMessage('Server error', signinPasswordInput)
               }
               
            })
            .catch(error => {
               if (error) console.log(error)
            })
   
      })

   }
}

// ---------------------------------------================----------------------------------------------------------

if (window.location.pathname === '/signup/confirm') {

   const emailConfirmationBlock = document.querySelector('.email-confirmation-block')
   const confirmationCodeInput = document.querySelector('#confirmation-code')
   const emailConfirmationBtn = document.querySelector('#email-conformation-btn')


   if (emailConfirmationBlock) {
      animateBlockElement(emailConfirmationBlock)
   }


   if (confirmationCodeInput && emailConfirmationBtn) {


      animateSubmitButton(emailConfirmationBtn)

      emailConfirmationBtn.addEventListener('click', () => {

         emailConfirmationBtn.style.backgroundColor = 'rgb(1, 185, 93)'
         setTimeout(() => {
            emailConfirmationBtn.style.backgroundColor = 'rgb(111, 214, 163)'
         }, 300);

         if (validateConfirmationCode(confirmationCodeInput) === false) return null

         fetch(`/api/account/confirm-email/${confirmationCodeInput.value}`, {
            method: 'GET',
            headers: { "Accept": "application/json" },
         })
            .then(response => {
               if (response.ok === true) {
                  window.location.replace(`/`)
                  throw null
               }
               else showErrorMessage('Wrong confirmation code', confirmationCodeInput)
            })
            .catch(error => {
               if (error) console.log(error)
            })



      })

   }

}

// -----------------------------------------------------------------------------------------------------------

if (document.querySelector('title').innerHTML === 'Get access to resource') {

   const entryKeyInput = document.querySelector('#entry-key')
   const getAccessBtn = document.querySelector('#get-access-btn')


   window.addEventListener('keyup', event => {
      if (event.code === 'Enter') {
         event.preventDefault()
         getAccessBtn.click()
      }
   })


   getAccessBtn.addEventListener('click', () => {

      
      if ( validateEntryKey(entryKeyInput) === false ) return null

      fetch('/api/middleware/access-key-verification', {
         method: 'POST',
         headers: { "Accept": "application/json", "Content-Type": "application/json" },
         body: JSON.stringify({
            'entry-key': entryKeyInput.value
         })
      })
         .then(response => {
            if (response.ok === true) throw window.location.replace('/')
            if (response.status === 401) throw showErrorMessage('Wrong key', entryKeyInput)
            if (response.status === 400) throw showErrorMessage('Client error', entryKeyInput)
            showErrorMessage('Server error', entryKeyInput)
         })
         .catch(error => {
            if (error) console.log(error)
         })

   })
}






// ==================== FUNCTIONS ====================


function animateBlockElement(blockElement) {
   setTimeout(() => {
      blockElement.classList.remove('_disabled')
   }, 0);

}


function animateSubmitButton(button) {
   button.addEventListener('mouseover', () => {
      button.style.backgroundColor = 'rgb(0, 211, 105)'

   })
   button.addEventListener('mouseout', () => {
      button.style.backgroundColor = 'rgb(111, 214, 163)'

   })
   window.addEventListener('keyup', event => {
      if (event.code === 'Enter') {
         event.preventDefault()
         button.click()
      }
   })
}


function validateData(emailInput, passwordInput) {

   const email = emailInput.value.toLowerCase()
   const password = passwordInput.value

   if (email.length < 3 || email.length > 40) {
      return showErrorMessage('Email length must be between 3 and 40 characters', emailInput)
   }
   if (password.length < 4 || password.length > 16) {
      return showErrorMessage('Password length must be between 4 and 16 characters', passwordInput)
   }

   if ( !(/@/.test(email)) ) {
      return showErrorMessage('Email must contain @ character', emailInput)
   }

   if (email.match(/@/g)[1]) {
      return showErrorMessage('There must be one @ character in the email string', emailInput)
   }    

   if (email.startsWith('@') || email.endsWith('@')) { // email.match(/^@/) or /@&/
      return showErrorMessage(
         'The @ character must not appear at the beginning or at the end of the string', 
         emailInput
      )
   }

   if (email.startsWith('.') || email.match(/[a-z0-9.-]+\.@/i)) {
      return showErrorMessage(
         'The dot character must not appear at the beginning or at the end of the string', 
         emailInput
      )
   }

   if (email.match(/\.\./)) return showErrorMessage('Email cannot have a sequence of dot characters', emailInput)

   if (email.match(/--/)) return showErrorMessage('Email cannot have a sequence of dash characters', emailInput)

   if (email.match(/\s/)) return showErrorMessage('Email should not contain space', emailInput)

   if (email.startsWith('-') || email.match(/[a-z0-9.-]+-@/i)) {
      return showErrorMessage(
         'The dash character must not appear at the beginning or at the end of the string', 
         emailInput
      )
   }

   if (password.match(/[^a-zA-Z0-9_]/)) {
      return showErrorMessage('Password must contain only a-z, A-Z, digits and underscore', passwordInput)
   }

   if (email.match(/[^a-zA-Z0-9.@-]/)) {
      return showErrorMessage('Allowed characters only a-z, digits, dot, dash and at sign', emailInput)
   }

   return true
}


function validateEntryKey(keyInput) {

   const key = keyInput.value
   
   if (key.length < 8 || key.length >  32) {
      return showErrorMessage('The key length must be between 8 and 32 characters.', keyInput)
   }

   if (key.match(/[^a-z0-9_-]/i)) {
      return showErrorMessage('The key must contain only a-z, A-Z, underscore and dash', keyInput)
   }

   return true
}

function validateConfirmationCode(input) {

   const code = input.value

   if ( !(/^.{28}$/.test(code)) ) return showErrorMessage('Code length must be 28 characters', input)

   // ------CODE LENGTH MUST BE BETWEEN 28 AND 28
   // Contains: uppercase  lowercase  digits  _  -

   if (code.match(/[^a-zA-Z0-9_-]/)) return showErrorMessage('Code must contain only a-z, A-Z, digits, underscore and dash', input)

   return true
}

function showErrorMessage(message, input) {

   const errorMessageOutput = document.querySelector('.error-message-output')
   const errorMessageText = document.querySelector('.error-message-text')

   if (input) {
      input.focus()
      input.style.transition = 'box-shadow 0.2s'
      input.style.boxShadow = '0 0 20px red'
      setTimeout(() => {
      input.style.transition = 'box-shadow 1s'
      input.style.boxShadow = 'none'
      }, 4000);
   }
   if (errorMessageOutput) {
      errorMessageText.innerHTML = message
      errorMessageOutput.style.opacity = '100%'
   }
   return false
}