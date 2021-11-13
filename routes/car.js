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
  
    const queryString = "Select * FROM car"
    connection.query(queryString, (error, rows, fields) => {
      if (error) {
        res.sendStatus(500)
        res.end()
      }
  
      const cars = rows.map((row) => {
        return {
          carId: row.car_id,
          number: row.number,
          name: row.name,
          color: row.color
        }
      })
      res.json(cars)
    })
  })

  router.post("/create", (req, res) => {
    const connection = getConnection()
  
    const queryString = "INSERT INTO car (number, name, color) VALUES (?, ?, ?)"
    getConnection().query(queryString, [req.body.number, req.body.name, req.body.color], (err, results, fields) => {
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
    const queryString = "DELETE FROM car WHERE car_id = ?"
  
    connection.query(queryString, [req.params.id], (error, rows, fields) => {
      if (error) {
        res.sendStatus(500)
      }
      res.end()

    })
  })

  router.put("/update/:id", (req, res) => {
    const connection = getConnection()


    console.log("something")

    const queryString = "UPDATE car SET number = ?, name = ?, color = ? WHERE car_id = ?"
    getConnection().query(queryString, [req.body.number, req.body.name, req.body.color, req.params.id], (err, results, fields) => {
      if (err) {
        console.log(err)
        res.sendStatus(500)
        return
      }
      res.end()
    })
  })


module.exports = router