const compressionButton = document.querySelector('#compression-btn')
const maxCompressionButton = document.querySelector('#max-compression-btn')
const dropZone = document.querySelector('.drop-zone')
const textZone = document.querySelector('.text-zone')



if (dropZone && textZone) {
  setTimeout(() => {
    textZone.classList.remove('_text-zone_disabled')
    dropZone.classList.remove('_drop-zone_disabled')
    
  }, 150)
}



document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
  const dropZoneElement = inputElement.closest(".drop-zone")
dropZoneElement.addEventListener("click", (e) => {
    inputElement.click()
  })
inputElement.addEventListener("change", (e) => {
    if (inputElement.files.length) {
      updateThumbnail(dropZoneElement, inputElement.files[0])
    }
  })
dropZoneElement.addEventListener("dragover", (e) => {
    e.preventDefault()
    dropZoneElement.classList.add("drop-zone--over")
  });
["dragleave", "dragend"].forEach((type) => {
    dropZoneElement.addEventListener(type, (e) => {
      dropZoneElement.classList.remove("drop-zone--over")
    })
  })
dropZoneElement.addEventListener("drop", (e) => {
    e.preventDefault()
if (e.dataTransfer.files.length) {
      inputElement.files = e.dataTransfer.files
      updateThumbnail(dropZoneElement, e.dataTransfer.files[0])
    }
dropZoneElement.classList.remove("drop-zone--over")
  })
})
function updateThumbnail(dropZoneElement, file) {
  let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb")

  if (dropZoneElement.querySelector(".drop-zone__prompt")) {
    dropZoneElement.querySelector(".drop-zone__prompt").remove()
  }

  if (!thumbnailElement) {
    thumbnailElement = document.createElement("div")
    thumbnailElement.classList.add("drop-zone__thumb")
    dropZoneElement.appendChild(thumbnailElement)
    compressionButton.removeAttribute('disabled')
    maxCompressionButton.removeAttribute('disabled')
  }
  thumbnailElement.dataset.label = file.name;
    
  if (file.type.startsWith("image/")) {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    // write here ==========================================
    reader.onload = () => {
      thumbnailElement.style.backgroundImage = `url('${reader.result}')`
    // or write here ==========================================

    }
  } else {
    thumbnailElement.style.backgroundImage = null
    }
} 