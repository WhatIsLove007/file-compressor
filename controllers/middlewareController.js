const Cookies = require('cookies')

module.exports.middleware = (request, response, next) => {

   const cookies = new Cookies(request, response)

   const SESSION_GUEST_ID = cookies.get('SESSION_GUEST_ID')
   
   if (SESSION_GUEST_ID) {
      if (SESSION_GUEST_ID === 'YGHkCsAQIBH0F5cS') {
         return next()
      }
   }

   if (request._parsedUrl.pathname === '/api/middleware/access-key-verification') return next()

   return response.render('html/middleware')
   


}

