var mysql = require("mysql");
require("dotenv").config();

const password = process.env.PASSWORD;

var connection = mysql.createConnection({
  host: "localhost",
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  user: process.env.USER,
});

module.exports = connection;
