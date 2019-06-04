var mysql = require('mysql');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'node',
	password : 'nodepass',
	database : 'kiln'
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

connection.end();