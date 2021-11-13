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
  
    const queryString = "Select * FROM instructor"
    connection.query(queryString, (error, rows, fields) => {
      if (error) {
        res.sendStatus(500)
        res.end()
      }
  
      const instructors = rows.map((row) => {
        return {
          instructorId: row.instructor_id,
          firstName: row.first_name,
          lastName: row.last_name,
          middleName: row.middle_name,
          drivingExperience: row.driving_experience,
          passportNumber: row.passport_number,
          phoneNumber: row.phone_number,
          carId: row.car_id,
          driverLicenseId: row.driver_license_id,
        }
      })
      res.json(instructors)
    })
  })

  router.post("/create", (req, res) => {
    const connection = getConnection()

    var phoneNumber = req.body.phone_number
    phoneNumber = phoneNumber.substring(1, 20)
    phoneNumber = "+" + phoneNumber
    const queryString = "INSERT INTO instructor (first_name, last_name, middle_name, driving_experience, passport_number, phone_number, car_id, driver_license_id) VALUES (?, ?, ?, ?, ?, ?, ? ,?)"
    getConnection().query(queryString, [req.body.first_name, req.body.last_name, req.body.middle_name, req.body.driving_experience, req.body.passport_number, phoneNumber, req.body.car_id, req.body.driver_license_id], (err, results, fields) => {
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
    const queryString = "DELETE FROM instructor WHERE instructor_id = ?"
  
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
    const queryString = "UPDATE instructor SET first_name = ?, last_name = ?, middle_name = ?, driving_experience = ?, passport_number = ?, phone_number = ?, car_id = ?, driver_license_id = ? WHERE instructor_id = ?"
    getConnection().query(queryString, [req.body.first_name, req.body.last_name, req.body.middle_name, req.body.driving_experience, req.body.passport_number, phoneNumber, req.body.car_id, req.body.driver_license_id, req.params.id], (err, results, fields) => {
      if (err) {
        console.log(err)
        res.sendStatus(500)
        return
      }
      res.end()
    })
  })


module.exports = router