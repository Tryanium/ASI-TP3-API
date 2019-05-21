var express = require('express');
var router = express.Router();

const mariadb = require('mariadb');
const dotenv = require('dotenv');
dotenv.config();

const pool = mariadb.createPool({
  host: process.env.MariaHost,
  user: process.env.MariaUser,
  password: process.env.MariaPassword,
  connectionLimit: 5
});

/* GET home page. */
router.get('/', function(req, res, next) {
  let section = req.query.section;
  pool.getConnection()
  .then(conn => {
    conn.query("USE TP3")
      .then((rows) => {
        return conn.query("SELECT * FROM articles WHERE section = '" + section + "' AND status='published'");
      })
      .then((response) => {
        conn.end();
        return res.send(response);
      })
      .catch(err => {
        //handle error
        console.log(err);
        conn.end();
      })
  }).catch(err => {
    //not connected
  });
});

module.exports = router;
