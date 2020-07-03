const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Loggers123",
    database: "employees_db"
  });

  // connection.connect(function(err) {
  //   if (err) throw err;
  //   console.log("connected as " + connection.threadId + "\n");
  //   runApp();
  // });
  module.exports = connection;