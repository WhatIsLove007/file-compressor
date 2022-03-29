const toolsBlock = document.querySelector('.tools')
const imgCompressionBlock = document.querySelector('.tools__image-compression')
const inDevelopingBlock = document.querySelector('.tools__in-developing')
const imgCompression = document.querySelector('.image-compression')
const imgRotation = document.querySelector('.image-rotation')


// if (imgCompressionBlock) {
//    imgCompressionBlock.addEventListener('mouseover', () => {
//       imgCompression.style.transform = 'scale(0.8)'
//    })
// }

// if (imgCompressionBlock) {
//    imgCompressionBlock.addEventListener('mouseleave', () => {
//       imgCompression.style.transform = 'scale(1)'
//    })
// }

// if (inDevelopingBlock) {
//    inDevelopingBlock.addEventListener('mouseover', () => {
//       imgRotation.style.transform = 'rotateZ(40deg)'
//    })
// }

// if (inDevelopingBlock) {
//    inDevelopingBlock.addEventListener('mouseleave', () => {
//       imgRotation.style.transform = 'rotateZ(0)'
//    })
// }


if (imgCompressionBlock) {
   setTimeout(() => {
      imgCompressionBlock.classList.remove('_disabled')
   }, 100)
   imgCompressionBlock.addEventListener('mouseover', () => {
      imgCompression.style.transform = 'scale(0.8)'
   })
   imgCompressionBlock.addEventListener('mouseleave', () => {
      imgCompression.style.transform = 'scale(1)'
   })
}

if (inDevelopingBlock) {
   setTimeout(() => {
      inDevelopingBlock.classList.remove('_disabled')
   }, 200)

   inDevelopingBlock.addEventListener('mouseover', () => {
      imgRotation.style.transform = 'rotateZ(40deg)'
   })
   inDevelopingBlock.addEventListener('mouseleave', () => {
      imgRotation.style.transform = 'rotateZ(0)'
   })
}
