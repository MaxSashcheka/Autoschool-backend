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
  
    const queryString = "SELECT * FROM exam JOIN exam_type ON exam_type.exam_type_id = exam.exam_type_id"
    connection.query(queryString, (error, rows, fields) => {
      if (error) {
        console.log(error)

        res.sendStatus(500)
        res.end()
      }
  
      const exams = rows.map((row) => {
        return {
          examId: row.exam_id,
          date: row.date,
          examTypeId: row.exam_type_id,
          examType: {
            examTypeId: row.exam_type_id,
            examTypeName: row.exam_name
          },
          groupId: row.group_id
        }
      })
      res.json(exams)
    })
  })

  router.post("/create", (req, res) => {
    const connection = getConnection()
  
    const queryString = "INSERT INTO exam (date, exam_type_id, group_id) VALUES (?, ?, ?)"
    getConnection().query(queryString, [req.body.date, req.body.exam_type_id, req.body.group_id], (err, results, fields) => {
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
    const queryString = "DELETE FROM exam WHERE exam_id = ?"
  
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
  
    const queryString = "UPDATE exam SET date = ?, exam_type_id = ?, group_id = ? WHERE exam_id = ?"
    getConnection().query(queryString, [req.body.date, req.body.exam_type_id, req.body.group_id, req.params.id], (err, results, fields) => {
      if (err) {
        console.log(err)
        res.sendStatus(500)
        return
      }
      res.end()
    })
  })


module.exports = router