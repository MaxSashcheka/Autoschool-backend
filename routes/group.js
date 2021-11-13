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
    console.log("Fetching all groups")
    const connection = getConnection()
  
    const queryString = "SELECT * FROM `group` JOIN lessons_time ON lessons_time.lessons_time_id = `group`.lessons_time_id JOIN category ON category.category_id = `group`.category_id"
    connection.query(queryString, (error, rows, fields) => {
      if (error) {
        console.log("Failed to query for groups: " + error)
        res.sendStatus(500)
        res.end()
      }
     
      const groups = rows.map((row) => {
        return {
          groupId: row.group_id,
          name: row.name,
          lessonsStartDate: row.lessons_start_date,
          lessonsEndDate: row.lessons_end_date,
          categoryId: row.category_id,
          category: {
            categoryId: row.category_id,
            categoryName: row.category_name
          },
          teacherId: row.teacher_id,
          lessonsTimeId: row.lessons_time_id,
          lessonsTime: {
            lessonsTimeId: row.lessons_time_id,
            lessonsTimeName: row.lessons_time_name
          }
          
        }
      })
  
      console.log("I think we fetched groups successfully")
      res.json(groups)
    })
  })

  router.post("/create", (req, res) => {
    const connection = getConnection()
  
    const queryString = "INSERT INTO `group` (name, lessons_start_date, lessons_end_date, category_id, teacher_id, lessons_time_id) VALUES (?, ?, ?, ?, ?, ?)"
    getConnection().query(queryString, [req.body.name, req.body.lessons_start_date, req.body.lessons_end_date, req.body.category_id, req.body.teacher_id, req.body.lessons_time_id], (err, results, fields) => {
      if (err) {
        res.sendStatus(500)
        return
      }
      res.end()
    })
  })

  router.get("/:id", (req, res) =>{
    console.log("Fetching user with id:" + req.params.id)
    const connection = getConnection()

    const groupId = req.params.id
    const queryString = "Select * FROM `group` WHERE group_id = ?"
  
    connection.query(queryString, [req.params.id], (error, rows, fields) => {
      if (error) {
        console.log("Failed to query for group: " + error)
        res.sendStatus(500)
        res.end()
      }
  
      console.log("I think we fetched group successfully")
      res.json(rows)
    })
  })

  router.put("/update/:id", (req, res) => {
    const connection = getConnection()
  
    const queryString = "UPDATE `group` SET name = ?, lessons_start_date = ?, lessons_end_date = ?, category_id = ?, teacher_id = ?, lessons_time_id = ? WHERE group_id = ?"
    getConnection().query(queryString, [req.body.name, req.body.lessons_start_date, req.body.lessons_end_date, req.body.category_id, req.body.teacher_id, req.body.lessons_time_id, req.params.id], (err, results, fields) => {
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
    const queryString = "DELETE FROM `group` WHERE group_id = ?"
  
    connection.query(queryString, [req.params.id], (error, rows, fields) => {
      if (error) {
        res.sendStatus(500)
      }
      res.end()

    })
  })

module.exports = router