const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const PORT = process.env.PORT || 3000

const homeRouter = require('./routes/homeRouter')
const apiRouter = require('./routes/apiRouter')
const toolsRouter = require('./routes/toolsRouter')
const middlewareRouter = require('./routes/middlewareRouter')


app.set('view engine', 'hbs')

app.use(express.static(path.join(__dirname, 'views')))


app.use('/', middlewareRouter)

app.use('/', homeRouter)

app.use('/tools', toolsRouter)

app.use('/api', apiRouter)





mongoose.connect('mongodb+srv://VladAdmin:54dz02rCyzBkAJgN@cluster0.ex92g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
   useUnifiedTopology: true,
   useNewUrlParser: true })
   .then(() => app.listen(PORT, () => console.log(`Server has been started on PORT ${PORT}...`)))
   .catch(err => console.log(err))