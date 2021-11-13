// will contain all of my user related routes
const express = require('express')
const mysql = require('mysql')
const router = express.Router()

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'Eh6QSAMjCt',
    database: 'autoschool'
})

function getConnection() {
    return pool
}

  router.get("/", (req,res) => {
    const connection = getConnection()
  
    const queryString = "Select * FROM administrator"
    connection.query(queryString, (error, rows, fields) => {
      if (error) {
        res.sendStatus(500)
        res.end()
      }
  
      const administrators = rows.map((row) => {
        return {
          administratorId: row.administrator_id,
          firstName: row.first_name,
          lastName: row.last_name,
          middleName: row.middle_name,
          phoneNumber: row.phone_number,
          email: row.email,
        }
      })
      res.json(administrators)
    })
  })

  router.post("/create", (req, res) => {
    const connection = getConnection()
  
    var phoneNumber = req.body.phone_number
    phoneNumber = phoneNumber.substring(1, 20)
    phoneNumber = "+" + phoneNumber
    const queryString = "INSERT INTO administrator (first_name, last_name, middle_name, phone_number, email) VALUES (?, ?, ?, ?, ?)"
    getConnection().query(queryString, [req.body.first_name, req.body.last_name, req.body.middle_name, phoneNumber, req.body.email], (err, results, fields) => {
      if (err) {
        res.sendStatus(500)
        return
      }
      res.end()
    })
  })

  router.delete("/delete/:id", (req, res) =>{
    const connection = getConnection()

    const groupId = req.params.id
    const queryString = "DELETE FROM administrator WHERE administrator_id = ?"
  
    connection.query(queryString, [req.params.id], (error, rows, fields) => {
      if (error) {
        res.sendStatus(500)
      }
      res.end()

    })
  })

  router.put("/update/:id", (req, res) => {
    const connection = getConnection()

    var phoneNumber = req.body.phone_number
    phoneNumber = phoneNumber.substring(1, 20)
    phoneNumber = "+" + phoneNumber
    const queryString = "UPDATE administrator SET first_name = ?, last_name = ?, middle_name = ?, phone_number = ?, email = ? WHERE administrator_id = ?"
    getConnection().query(queryString, [req.body.first_name, req.body.last_name, req.body.middle_name, phoneNumber, req.body.email, req.params.id], (err, results, fields) => {
      if (err) {
        console.log(err)
        res.sendStatus(500)
        return
      }
      res.end()
    })
  })


module.exports = router