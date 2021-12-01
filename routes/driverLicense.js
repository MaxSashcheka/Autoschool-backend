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
  
    const queryString = "Select * FROM driver_license"
    connection.query(queryString, (error, rows, fields) => {
      if (error) {
        console.log(error)

        res.sendStatus(500)
        res.end()
      }
  
      const driverLicenses = rows.map((row) => {
        return {
          driverLicenseId: row.driver_license_id,
          issueDate: row.issue_date,
          number: row.number,
          validity: row.validity
        }
      })
      res.json(driverLicenses)
    })
  })

  router.post("/create", (req, res) => {
    const connection = getConnection()
  
    const queryString = "INSERT INTO driver_license (issue_date, number, validity) VALUES (?, ?, ?)"
    getConnection().query(queryString, [req.body.issue_date, req.body.number, req.body.validity], (err, results, fields) => {
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
    const queryString = "DELETE FROM driver_license WHERE driver_license_id = ?"
  
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
  
    const queryString = "UPDATE driver_license SET issue_date = ?, number = ?, validity = ? WHERE driver_license_id = ?"
    getConnection().query(queryString, [req.body.issue_date, req.body.number, req.body.validity, req.params.id], (err, results, fields) => {
      if (err) {
        console.log(err)
        res.sendStatus(500)
        return
      }
      res.end()
    })
  })


module.exports = router