var mysql = require("mysql");

var connection;

// Connect with JawsDB database on our Heroku app
// 	If not found, then run locally
if (process.env.JAWSDB_URL) {
	connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
	connection = mysql.createConnection({
      port: 3306,  
	  host: "192.168.99.100",
	  user: "root",
	  password: "docker",
	  database: "burgers_db"
	});
}

connection.connect(function(error) {
  if (error) {
    console.error("error connecting: " + error.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

// Export our MySQL connection
module.exports = connection;