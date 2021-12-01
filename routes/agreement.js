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
  
    const queryString = "Select * FROM agreement"
    connection.query(queryString, (error, rows, fields) => {
      if (error) {
        console.log(error)

        res.sendStatus(500)
        res.end()
      }
  
      const agreements = rows.map((row) => {
        return {
          agreementId: row.agreement_id,
          amount: row.amount,
          signingDate: row.signing_date,
          administratorId: row.administrator_id,
          studentId: row.student_id
        }
      })
      res.json(agreements)
    })
  })

  router.post("/create", (req, res) => {
    const connection = getConnection()
  
    const queryString = "INSERT INTO agreement (amount, signing_date, administrator_id, student_id) VALUES (?, ?, ?, ?)"
    getConnection().query(queryString, [req.body.amount, req.body.signing_date, req.body.administrator_id, req.body.student_id], (err, results, fields) => {
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
    const queryString = "DELETE FROM agreement WHERE agreement_id = ?"
  
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
    console.log(req.params.id)
    console.log(req.body.amount)
    console.log(req.body.signing_date)
    console.log(req.body.administrator_id)
    console.log(req.body.student_id)



    const queryString = "UPDATE agreement SET amount = ?, signing_date = ?, administrator_id = ?, student_id = ? WHERE agreement_id = ?"
    getConnection().query(queryString, [req.body.amount, req.body.signing_date, req.body.administrator_id, req.body.student_id, req.params.id], (err, results, fields) => {
      if (err) {
        console.log(err)
        res.sendStatus(500)
        return
      }
      res.end()
    })
  })


module.exports = router