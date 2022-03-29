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

   sendChangePasswordBtn.addEventListener('click', () => {

      if (oldPasswordInput.value.length < 4 || oldPasswordInput.value.length > 16
         || newPasswordInput.value.length < 4 || newPasswordInput.value.length > 16) {

         changePasswordOutput.style.color = '#ce0e0e'
         changePasswordOutput.innerHTML = 'Incorrect password length'

      } else {

         fetch('/api/account/change-password', {
            method: 'PUT',
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({
               oldPassword: oldPasswordInput.value,
               newPassword: newPasswordInput.value,
            })
         })
            .then(response => {
               if (response.ok === true) {

                  changePasswordOutput.style.color = '#077a07'
                  changePasswordOutput.innerHTML = 'The password has been changed!'
                  oldPasswordInput.value = ''
                  newPasswordInput.value = ''
         
               } else {
                  if (response.status === 403) {
                     changePasswordOutput.style.color = '#ce0e0e'
                     changePasswordOutput.innerHTML = 'Incorrect current password'         
   
                  } else {
                     changePasswordOutput.style.color = '#ce0e0e'
                     changePasswordOutput.innerHTML = 'Server error'            
                  }
               }

            })

      }

   })

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
   const response = await fetch('/api/account/delete', {
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



