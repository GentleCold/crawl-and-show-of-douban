const express = require('express')
const app = express()

// 1. start server
app.listen(80, () => {
  console.log('server is running at http://127.0.0.1')
})

// 2. cors middleware
const cors = require('cors')

app.use(cors())

// 3. package send function
app.use((req, res, next) => {
  res.cc = (err, status = 1) => {
    res.send({
      status: status,
      message: err instanceof Error ? err.message : err
    })
  }
  next()
})

// 4. parse data
app.use(express.urlencoded({ extended:false }))

// 5. static file
app.use('/', express.static('./'))
app.use('/index', express.static('./'))
app.use('/index.html', express.static('./'))

// 6. use router
const booksRouter = require('./router/books')
app.use('/api', booksRouter)