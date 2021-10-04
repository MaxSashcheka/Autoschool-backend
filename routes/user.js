// will contain all of my user related routes
const express = require('express')
const mysql = require('mysql')
const router = express.Router()

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'us-cdbr-east-04.cleardb.com',
    user: 'b70aede9c774e7',
    password: '42b2b84b',
    database: 'heroku_2561508c30613de'
})

function getConnection() {
    return pool
}

router.get('/messages', (req,res) => {
  console.log("Show some messages or whatever...")
  res.end()
})

router.get("/users", (req,res) => {
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

  router.get("/user/:id", (req, res) =>{
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
  
  })

  router.post('/user_create', (req,res) => {
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
      res.end()
    })
  })

module.exports = router