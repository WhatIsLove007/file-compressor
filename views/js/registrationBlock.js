const registrationBlock = document.querySelector('.registration-block')

if (registrationBlock) {
   setTimeout(() => {
      registrationBlock.classList.remove('_disabled')
   }, 0);
}