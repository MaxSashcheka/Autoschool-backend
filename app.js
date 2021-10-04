// load our app server using express somehow ...
const express = require('express')
const app = express()
const morgan = require('morgan')
const mysql = require('mysql')

const bodyParser = require('body-parser')

const router = require('./routes/user.js')

function getConnection() {
  return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Eh6QSAMjCt',
    database: 'mysql_first'
  })
}

// nodemon app.js
app.use(morgan('short'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('./public'))
app.use(router)

app.post('/user_create', (req,res) => {
  console.log('Trying to create a new user...')

  const connection = getConnection()

  const firstName = req.body.create_first_name
  const lastName = req.body.create_last_name

  const queryString = "INSERT INTO users (first_name, last_name) VALUES (?, ?)"
  getConnection().query(queryString, [firstName, lastName], (err, results, fields) => {
    if (err) {
      console.log("Failed to insert new user: ", err)
      res.sendStatus(500)
      return
    }

    console.log("Inserted a new user with id: ", results.insertId)
    res.end

  })
 
})

app.get("/user/:id", (req, res) =>{
  console.log("Fetching user with id:" + req.params.id)
  const connection = getConnection()


  const userID = req.params.id
  const queryString = "Select * FROM users WHERE id = ?"

  connection.query(queryString, [req.params.id], (error, rows, fields) => {
    if (error) {
      console.log("Failed to query for users: " + error)
      res.sendStatus(500)
      res.end()
    }

    console.log("I think we fetched user successfully")
    res.json(rows)
  })

  // res.end()
})

app.get("/", (req, res) => {
  console.log("Responding to root route")
  res.send("Hello from ROOOOT")
})

app.get("/users", (req,res) => {
  console.log("Fetching all users")
  const connection = getConnection()


  const queryString = "Select * FROM users"
  connection.query(queryString, (error, rows, fields) => {
    if (error) {
      console.log("Failed to query for users: " + error)
      res.sendStatus(500)
      res.end()
    }

    const users = rows.map((row) => {
      return {
        userID: row.id,
        firstName: row.first_name,
        lastName: row.last_name
      }
    })

    console.log("I think we fetched users successfully")
    res.json(users)
  })
})

// localhost:3003
app.listen(3003, () => {
  console.log("Server is up and listening on 3003 ...")
})
