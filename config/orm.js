// Dependencies
var connection = require("../config/connection");

// Object Relational Mapper
// 	Here we pass in query parameters for all 3 methods, including callbacks, to receive the data from the model
function printQuestionMarks(num) {
	var array = [];

	for (var i = 0; i < num; i++) {
		array.push('?');
	}

	return array.toString();
}

function objToSql(ob) {
	// column1=value, column2=value2,...
	var array = [];

	for (var key in ob) {
		if (ob.hasOwnProperty(key)) {
			array.push(key + '=' + ob[key]);
		}
	}

	return array.toString();
}

var orm = {
	// orm to show all values in the burger database.
	all: function (tableInput, callback) {
		var queryString = 'SELECT * FROM ' + tableInput + ';';
		connection.query(queryString, function (error, result) {
			if (error) throw error;
			callback(result);
		});
	},
	// orm to add values to the burger database
	// vals is an array of values that we want to save to cols
	// cols are the columns we want to insert the values into
	create: function (table, cols, vals, callback) {
		var queryString = 'INSERT INTO ' + table;

		queryString = queryString + ' (';queryString = queryString + cols.toString();queryString = queryString + ') ';
		queryString = queryString + 'VALUES (';queryString = queryString + printQuestionMarks(vals.length);queryString = queryString + ') ';

		console.log(queryString);

		connection.query(queryString, vals, function (error, result) {
			if (error) throw error;
			callback(result);
		});
	},
	// orm to update values in the burger database
	// objColVals would be the columns and values that you want to update
	update: function (table, objColVals, condition, callback) {
		var queryString = 'UPDATE ' + table;

		queryString = queryString + ' SET ';
		queryString = queryString + objToSql(objColVals);
		queryString = queryString + ' WHERE ';
		queryString = queryString + condition;

		console.log(queryString);
		connection.query(queryString, function (error, result) {
			if (error) throw error;
			callback(result);
		});
	},
	// orm to delete from the burger database - future use
	delete: function (table, condition, callback) {
		var queryString = 'DELETE FROM ' + table;
		queryString = queryString + ' WHERE ';
		queryString = queryString + condition;

		connection.query(queryString, function (error, result) {
			if (error) throw error;
			callback(result);
		});
	}
};

module.exports = orm;