const registrationBlock = document.querySelector('.registration-block')

if (registrationBlock) {
   setTimeout(() => {
      registrationBlock.classList.remove('_disabled')
   }, 0);
}







// ===============================================================

const signinEmailInput = document.querySelector('#signin-email')
const signinPasswordInput = document.querySelector('#signin-password')
const signinErrorMessageOutput = document.querySelector('.signin-error-message-output')
const signinErrorMessageText = document.querySelector('.signin-error-message-text')
const signinBtn = document.querySelector('#signin-btn')

if (signinEmailInput && signinPasswordInput && signinBtn) {


   signinBtn.addEventListener('mouseover', () => {
      signinBtn.style.backgroundColor = 'rgb(0, 211, 105)'

   })
   signinBtn.addEventListener('mouseout', () => {
      signinBtn.style.backgroundColor = 'rgb(111, 214, 163)'

   })


   window.addEventListener('keyup', event => {
      if (event.code === 'Enter') {
         event.preventDefault()
         signinBtn.click()
      }
   })


   signinBtn.addEventListener('click', () => {

      signinBtn.style.backgroundColor = 'rgb(1, 185, 93)'
      setTimeout(() => {
         signinBtn.style.backgroundColor = 'rgb(111, 214, 163)'
      }, 300);

      if (validateData(signinEmailInput.value, signinPasswordInput.value) === false) return null
      fetch('/api/account/signin', {
         method: 'POST',
         headers: { "Accept": "application/json", "Content-Type": "application/json" },
         body: JSON.stringify({
            email: signinEmailInput.value,
            password: signinPasswordInput.value,
         })
      })
         .then(response => {
            if (response.ok === true) throw window.location.replace('/')
            else return response.json()
         })
         .then(response => {
            if (response.ok === true && response.isAuthorised === true) {
               window.location.replace('/')
            }  else if (response.authenticatedEmail === false) {
               return showErrorMessage('This email is not registered', signinEmailInput)
            }  else if (response.authenticatedPassword === false) {
               return showErrorMessage('Wrong password', signinPasswordInput)
            }  else {
               showErrorMessage('Server error')
            }
            
         })
   })

}


function validateData(email, password) {
   if (email.length < 3 || email.length > 40) {
      return showErrorMessage('Email was entered incorrectly', signinEmailInput)
   }
   if (password.length < 4 || password.length > 16) {
      return showErrorMessage('Password length must be between 4 and 16 characters', signinPasswordInput)
   }

   emailByCharacters = email.split('')

   if (emailByCharacters.indexOf('@') === -1) {
      return showErrorMessage('Email must contain <b class="bold-text">@</b> character', signinEmailInput)
   }
   if (emailByCharacters.indexOf('@') === 0) {
      return showErrorMessage('The <b class="bold-text">@</b> character must not appear at the beginning of the line', 
      signinEmailInput)
   }
   if (emailByCharacters[emailByCharacters.length-1] === '@') {
      return showErrorMessage('The <b class="bold-text">@</b> character must not appear at the end of the line', 
      signinEmailInput)
   }

   for (let i = 0; i < emailByCharacters.length; i++) {

      // if (emailByCharacters[i] === ' ') return showErrorMessage('Password must not contain a <b>space</b> character.')
      // refactor this, because registration form doesn't check on space character

      for (let j = 0; j < emailByCharacters.length; j++) {
         if (i === j) continue         
         if (emailByCharacters[i] === '@' && emailByCharacters[j] === '@') {
            return showErrorMessage('There must be one <b class="bold-text">@</b> character in the email string', 
            signinEmailInput)
         }    
      }
   }
   return true

}


function showErrorMessage(message, inputError) {

   if (inputError) {
      inputError.style.transition = 'box-shadow 0.2s'
      inputError.style.boxShadow = '0 0 20px red'
      setTimeout(() => {
      inputError.style.transition = 'box-shadow 1s'
      inputError.style.boxShadow = 'none'
      }, 4000);
   }
   if (signinErrorMessageOutput) {
      signinErrorMessageText.innerHTML = message
      signinErrorMessageOutput.style.opacity = '100%'
   }
   return false
}