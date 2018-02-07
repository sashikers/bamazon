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
	customerChoice();
});

// displays the current inventory
function displayInventory() {
	// queries the columns to be displayed
	connection.query("SELECT item_id, product_name, price, department_name, stock_quantity FROM products", function(err, results) {
		if (err) throw err;

		// puts it into a palatable format
		console.log("=============================INVENTORY=============================");
		for (var i = 0; i < results.length; i++) {
			console.log(results[i].item_id + ": " + results[i].product_name + " ($" + results[i].price + ", " + results[i].department_name + ", " + results[i].stock_quantity + " left)");

		}

		console.log("==========================END OF INVENTORY=========================");
	});
}

// prompts the user for choices (which item to buy, quantity)
function customerChoice() {
	connection.query("SELECT * FROM products", function(err, results) {
		if (err) throw err;

		inquirer
			.prompt([
				{
					name: "pickAnItem",
					type: "input",
					message: "Which item would you like to buy?",
					// validates the user input against the database list of user_ids
					validate: function(value) {
						var choiceArray = [];

						// creates an array of database entries
						for (var j = 0; j < results.length; j++) {
							choiceArray.push(results[j].item_id);
						}

						// checks if the user answer is present in the choicearray and returns false if user choice is not valid
						if (choiceArray.indexOf(parseInt(value)) < 0) {
							return false;
						}
						return true;
					}
				},
				{
					name: "pickAQuantity",
					type: "input",
					message: "How many would you like to buy?"
				}
			])
			.then(function(answer) {
				console.log("answer", answer);
				var chosenItem;

				// pulls in the database info for selected item 
				for (var k = 0; k < results.length; k++) {
					if (results[k].item_id === parseInt(answer.pickAnItem)) {
						chosenItem = results[k];
					}
				}

				// checks the selected amount against user amt choice
				if (chosenItem.stock_quantity < parseInt(answer.pickAQuantity)) {
					console.log("Insufficient quantity!! Only " + chosenItem.stock_quantity + " units of " + chosenItem.product_name + " left!");
					// prompts the customer for another choice if inventory is insufficient
					customerChoice();
				}
				else {
					// console.log("Good buy!");

					var newQuantity = chosenItem.stock_quantity - answer.pickAQuantity;
					console.log("newQuantity", newQuantity);

					connection.query(
						"UPDATE products SET ? WHERE ?",
						[
							{
								stock_quantity: newQuantity
							},
							{
								item_id: chosenItem.id
							}
						],   
						function(error) {
							if (error) throw err;
							console.log("Good buy!!");

							displayInventory();
						}
					);
				}


				// console.log("chosenItem", chosenItem);

			});
	});
}