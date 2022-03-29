"use strict"


const headerLeftSide = document.querySelector('.header__header-left-side')
const headerRightSide = document.querySelector('.header__header-right-side')

if (headerLeftSide) {
   setTimeout(() => {
      headerLeftSide.classList.remove('_inactive') 
   }, 0);
}
if (headerRightSide) {
   setTimeout(() => {
      headerRightSide.classList.remove('_inactive')
   }, 100);
}


const headerMenuIcon = document.querySelector('.header__menu-icon')
const menuIconList = document.querySelector('.menu-icon__list')

if (headerMenuIcon) {

   headerMenuIcon.addEventListener('click', () => {

      menuIconList.classList.toggle('_active')

      if (headerMenuIcon.getAttribute('src') === '../img/menu-button.png') {
         headerMenuIcon.setAttribute('src', '../img/menu-button-close.png')
      } else {
         headerMenuIcon.setAttribute('src', '../img/menu-button.png')
      }
   })

}

// ===================================================

async function getHeaderData() {

   const response = await fetch('/api/site-elements/header-data', {
       method: "GET",
       headers: { "Accept": "application/json" }
   })
   if (response.ok === true) {
       const header = await response.json()
       if (header.isUser) {
         const headerAccountAction = document.querySelector('#header-account-action')
         const headerAccountActionNarrowScreen = document.querySelector('#header-account-action-narrow-screen')
         
         if (headerAccountAction) {
            headerAccountAction.innerHTML = `<a href="/account" id="header__account">Account</a>`
         }
         
         if (headerAccountActionNarrowScreen) {
            headerAccountActionNarrowScreen.innerHTML = `<a href="/account">Account</a>`
         }
         
       }
   }
}
getHeaderData()