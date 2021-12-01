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
  
    const queryString = "Select * FROM teacher"
    connection.query(queryString, (error, rows, fields) => {
      if (error) {
        console.log(error)

        res.sendStatus(500)
        res.end()
      }
  
      const teachers = rows.map((row) => {
        return {
          teacherId: row.teacher_id,
          firstName: row.first_name,
          lastName: row.last_name,
          middleName: row.middle_name,
          passportNumber: row.passport_number,
          phoneNumber: row.phone_number,
        }
      })
      res.json(teachers)
    })
  })

  router.get("/:id", (req, res) =>{
    const connection = getConnection()
    const groupId = req.params.id
    const queryString = "Select * FROM teacher WHERE teacher_id = ?"
    connection.query(queryString, [req.params.id], (error, rows, fields) => {
      if (error) {
        console.log("Failed to query for teacher: " + error)
        res.sendStatus(500)
        res.end()
      }
      const teacher = rows.map((row) => {
        return {
          teacherId: row.teacher_id,
          firstName: row.first_name,
          lastName: row.last_name,
          middleName: row.middle_name,
          passportNumber: row.passport_number,
          phoneNumber: row.phone_number,
        }
      })
      res.json(teacher)

    })
  
  })

  router.post("/create", (req, res) => {
    const connection = getConnection()
  
    var phoneNumber = req.body.phone_number
    phoneNumber = phoneNumber.substring(1, 20)
    phoneNumber = "+" + phoneNumber
    const queryString = "INSERT INTO teacher (first_name, last_name, middle_name, passport_number, phone_number) VALUES (?, ?, ?, ?, ?)"
    getConnection().query(queryString, [req.body.first_name, req.body.last_name, req.body.middle_name, req.body.passport_number, phoneNumber], (err, results, fields) => {
      if (err) {
        console.log(err)

        res.sendStatus(500)
        return
      }
      res.end()
    })
  })

  router.delete("/delete/:id", (req, res) =>{
    const connection = getConnection()

    const groupId = req.params.id
    const queryString = "DELETE FROM teacher WHERE teacher_id = ?"
  
    connection.query(queryString, [req.params.id], (error, rows, fields) => {
      if (error) {
        console.log(error)

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
    const queryString = "UPDATE teacher SET first_name = ?, last_name = ?, middle_name = ?, passport_number = ?, phone_number = ? WHERE teacher_id = ?"
    getConnection().query(queryString, [req.body.first_name, req.body.last_name, req.body.middle_name, req.body.passport_number, phoneNumber, req.params.id], (err, results, fields) => {
      if (err) {
        console.log(err)
        res.sendStatus(500)
        return
      }
      res.end()
    })
  })


module.exports = router