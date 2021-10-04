// load our app server using express somehow ...
const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const router = require('./routes/user.js')

// nodemon app.js
app.use(morgan('short'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('./public'))
app.use(router)

app.get("/", (req, res) => {
  console.log("Responding to root route")
  res.send("Hello from ROOOOT")
})

const PORT = process.env.PORT || 5000
// localhost:3003
app.listen(PORT, () => {
  console.log("Server is up and listening on: " + PORT)
})
