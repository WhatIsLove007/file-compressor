const cardElement = document.querySelectorAll('.account-main__card')

if (cardElement) {

   let time = 0

   cardElement.forEach( element => {
      time = time + 100

      setTimeout(() => {

      element.classList.remove('_disabled')
      
      }, time)
   })
}



const changePasswordFirstPage = document.querySelector('.card__change-password-first-page')
const changePasswordSecondPage = document.querySelector('.card__change-password-second-page')
const changePasswordBtn = document.querySelector('#change')
const closeChangePasswordBtn = document.querySelector('#close-change-password')

if (changePasswordBtn && closeChangePasswordBtn) {
   changePasswordBtn.addEventListener('click', () => {
      scrollChangePasswordCard()
   })
   closeChangePasswordBtn.addEventListener('click', () => {
      scrollChangePasswordCard()
   })
}

function scrollChangePasswordCard() {

   if (changePasswordFirstPage && changePasswordSecondPage) {
      setTimeout(() => {
         changePasswordFirstPage.classList.toggle('change-password-card-first-page_disabled')
         changePasswordSecondPage.classList.toggle('change-password-card-second-page_disabled')

      }, 0);
   }
   
}


const oldPasswordInput = document.querySelector('#old-password')
const newPasswordInput = document.querySelector('#new-password')
const changePasswordOutput = document.querySelector('#change-password-output')
const sendChangePasswordBtn = document.querySelector('#send-change-password-btn')


if (oldPasswordInput && newPasswordInput && sendChangePasswordBtn) {

   window.addEventListener('keyup', event => {
      if (event.code === 'Enter') {
         event.preventDefault()
         if (!document.querySelector('.change-password-card-second-page_disabled')) {
            sendChangePasswordBtn.click()
         }  
      }
   })

   sendChangePasswordBtn.addEventListener('click', () => {

      const oldPassword = oldPasswordInput.value
      const newPassword = newPasswordInput.value
      const changePasswordBlock = document.querySelector('#change-password-card')

      if (oldPassword.length < 4 || oldPassword.length > 16) {
         showChangePasswordMessage('Incorrect password length', true, oldPasswordInput)
      } else if (newPassword.length < 4 || newPassword.length > 16) {
         showChangePasswordMessage('Incorrect password length', true, newPasswordInput)
      } else if (oldPassword.match(/[^Aa-z-Z0-9_]/)) {
         showChangePasswordMessage('Only a-z, A-Z, digits and underscore', true, oldPasswordInput)
      } else if (newPassword.match(/[^Aa-z-Z0-9_]/)) {
         showChangePasswordMessage('Only a-z, A-Z, digits and underscore', true, newPasswordInput)
      } else if (newPassword === oldPassword) {
         showChangePasswordMessage('Passwords are identical', true, newPasswordInput)
      } else {
         fetch('/api/account/change-password', {
            method: 'PUT',
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({
               oldPassword: oldPassword,
               newPassword: newPassword,
            })
         })
            .then(response => {
               if (response.ok === true) {
                  showChangePasswordMessage('The password has been changed!', false, changePasswordBlock)
                  throw null
               }
               return response.json()
            })
            .then(response => {
               switch (response.message) {
                  case 'No data body received':
                     showChangePasswordMessage('Email was not sent, try again', true, changePasswordBlock)
                     break
                  case 'Incorrect current password length':
                     showChangePasswordMessage(response.message, true, oldPasswordInput)
                     break
                  case 'Incorrect current password syntax':
                     showChangePasswordMessage(response.message, true, oldPasswordInput)
                     break
                  case 'Incorrect new password length':
                     showChangePasswordMessage(response.message, true, newPasswordInput)
                     break
                  case 'Incorrect new password syntax':
                     showChangePasswordMessage(response.message, true, newPasswordInput)
                     break
                  case 'User is unauthorized':
                     window.location.replace('/')
                     break
                  case 'Wrong current password':
                     showChangePasswordMessage(response.message, true, oldPasswordInput)
                     break
                  case 'Server error':
                     showChangePasswordMessage(response.message, true, changePasswordBlock)
                     break
                  default:
                     showChangePasswordMessage('Something went wrong, try again', true, changePasswordBlock)
                     break
               }
            })
            .catch(error => {
               if (error) console.log(error)
            })

      }

   })

}

function showChangePasswordMessage(textMessage, error = true, animatedElement) {

   animatedElement.style.transition = 'all 0.8s'

   if (error === true) {
      changePasswordOutput.style.color = '#ce0e0e'
      changePasswordOutput.innerHTML = textMessage
      animatedElement.focus()
      animatedElement.style.boxShadow = 'inset 0 0 15px -4px #ff0000'   
   }

   if (error === false) {
      changePasswordOutput.style.color = '#077a07'
      changePasswordOutput.innerHTML = textMessage
      oldPasswordInput.value = ''
      newPasswordInput.value = ''
      animatedElement.style.boxShadow = 'inset 0 0 15px -4px #008000'   
   }

   setTimeout(() => {
      animatedElement.style.boxShadow = ''
   }, 800);

}



async function getAccountPageData() {
   const response = await fetch('/api/site-elements/account-page-data', {
      method: "GET",
      headers: { "Accept": "application/json" }
  })
  if (response.ok === true) {
      const accountData = await response.json()
      const emailElement = document.querySelector('#email')

      if (emailElement) {
         emailElement.innerHTML = accountData.email
      }
  } else {
     window.location.replace('/')
  }
}
getAccountPageData()


const deleteButton = document.querySelector('#delete')

if (deleteButton) {
   deleteButton.addEventListener('click', () => {
   deleteAccount()
   })
}

async function deleteAccount() {
   const response = await fetch('/api/account', {
      method: "DELETE",
      headers: { "Accept": "application/json" }
  })
  if (response.ok === true) {
      const data = await response.json()

      if (cardElement) {

         let time = 0
      
         cardElement.forEach( element => {
            time = time + 100
      
            setTimeout(() => {
      
            element.classList.add('_disabled')
            
            }, time)
         })
      }

      setTimeout(() => {
         window.location.replace('/')
            
         }, 1000);
   
  }
}




const logoutButton = document.querySelector('#logout')
logoutButton.addEventListener('click', () => {

   fetch('/api/account/logout', {
      method: "DELETE",
      headers: { "Accept": "application/json" }   
   })
      .then(response => {
         if (response.ok === true) {
            return response.json()
         }
      })
      .then(response => {
            window.location.replace('/')
      })
      .catch(error => console.log(error))



})



