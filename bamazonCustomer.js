var mysql = require("mysql");
var inquirer = require("inquirer");

// establishes the connection              
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "bamazon"
});

connection.connect(function(err) {
	if (err) throw err;
	displayInventory();
});

function displayInventory() {
	connection.query("SELECT item_id, product_name, price, department_name FROM products", function(err, results) {
		if (err) throw err;

		// console.log(results);
		for (var i = 0; i < results.length; i++) {
			console.log(results[i].item_id + ": " + results[i].product_name + " ($" + results[i].price + ", " + results[i].department_name + ")");
		}
	});
}