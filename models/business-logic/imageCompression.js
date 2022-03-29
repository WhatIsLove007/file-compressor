module.exports.compressImage = async function (filePath, fileDestination, jpegCompression = 75, pngCompression = [0.6, 0.8]) {  
      // Write Documentation about arguements etc... Two 1st params are required others if you didnt set it performs by default compression with minimum quality loss... and path must be absolute
      
      const path = require('path')
      const {default: imagemin} = await import('imagemin')
      const {default: imageminMozjpeg} = await import('imagemin-mozjpeg')
      const {default: imageminPngquant} = await import('imagemin-pngquant')


      // const filePath = path.join(__dirname, '../../tmp-uploaded-user-files', fileName)

      return await imagemin([filePath], {
         destination: fileDestination,
         plugins: [
            imageminMozjpeg({quality: jpegCompression}),
            imageminPngquant({quality: pngCompression})
         ]
      })
   }