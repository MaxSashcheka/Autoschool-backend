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
  
    const queryString = "Select * FROM student"
    connection.query(queryString, (error, rows, fields) => {
      if (error) {
        console.log("Failed to query for students: " + error)
        res.sendStatus(500)
        res.end()
      }
  
      const students = rows.map((row) => {
        return {
          studentId: row.student_id,
          firstName: row.first_name,
          lastName: row.last_name,
          middleName: row.middle_name,
          passportNumber: row.passport_number,
          phoneNumber: row.phone_number,
          instructorId: row.instructor_id,
          groupId: row.group_id,
        }
      })
      res.json(students)
    })
  })

  router.post("/create", (req, res) => {
    const connection = getConnection()
  
    var phoneNumber = req.body.phone_number
    phoneNumber = phoneNumber.substring(1, 20)
    phoneNumber = "+" + phoneNumber

    const queryString = "INSERT INTO student (first_name, last_name, middle_name, passport_number, phone_number, instructor_id, group_id) VALUES (?, ?, ?, ?, ?, ?, ?)"
    getConnection().query(queryString, [req.body.first_name, req.body.last_name, req.body.middle_name, req.body.passport_number, phoneNumber, req.body.instructor_id, req.body.group_id], (err, results, fields) => {
      if (err) {
        console.log(err)

        res.sendStatus(500)
        return
      }
      res.end()
    })
  })

  router.get("/group/:id", (req, res) =>{
    const connection = getConnection()
    connection.pro
    console.log(req.params.id)
    
    const queryString = "SELECT * FROM student where group_id = ?"

    connection.query(queryString, [req.params.id], (error, rows, fields) => {
      console.log(fields)
      if (error) {

        console.log("Failed to query for group: " + error)
        res.sendStatus(500)
        res.end()
      }
      const students = rows.map((row) => {
        return {
          studentId: row.student_id,
          firstName: row.first_name,
          lastName: row.last_name,
          middleName: row.middle_name,
          passportNumber: row.passport_number,
          phoneNumber: row.phone_number,
          instructorId: row.instructor_id,
          groupId: row.group_id,
        }
      })
      res.json(students)

    })
  
  })

  router.delete("/delete/:id", (req, res) =>{
    const connection = getConnection()

    connection.query("DELETE FROM agreement WHERE student_id = ?", [req.params.id], (error, rows, fields) => {
      if (error) {
        console.log(error)
        res.sendStatus(500)
      }
      res.end()
    })



    connection.query("DELETE FROM student WHERE student_id = ?", [req.params.id], (error, rows, fields) => {
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
    const queryString = "UPDATE student SET first_name = ?, last_name = ?, middle_name = ?, passport_number = ?, phone_number = ?, instructor_id = ?, group_id = ? WHERE student_id = ?"
    getConnection().query(queryString, [req.body.first_name, req.body.last_name, req.body.middle_name, req.body.passport_number, phoneNumber, req.body.instructor_id, req.body.group_id, req.params.id], (err, results, fields) => {
      if (err) {
        console.log(err)
        res.sendStatus(500)
        return
      }
      res.end()
    })
  })

  


module.exports = router