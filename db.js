const mysql = require('mysql'), fs = require('fs')
const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'webwork'
})

db.query = db.query

module.exports = db
