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

function displayInventory() {
	connection.query("SELECT item_id, product_name, price, department_name FROM products", function(err, results) {
		if (err) throw err;

		console.log("==================INVENTORY==================");
		for (var i = 0; i < results.length; i++) {
			console.log(results[i].item_id + ": " + results[i].product_name + " ($" + results[i].price + ", " + results[i].department_name + ")");

		}

		console.log("===============END OF INVENTORY==============");
	});
}

function customerChoice() {
	connection.query("SELECT * FROM products", function(err, results) {
		if (err) throw err;

		inquirer
			.prompt([
				{
					name: "pickAnItem",
					type: "input",
					// choices: function() {
						// var choiceArray = [];
						// for (var j = 0; j < results.length; j++) {
						// 	choiceArray.push(results[j].product_name);
						// }
					// 	return choiceArray;
					// },
					message: "Which item would you like to buy?",
					validate: function(value) {
						var choiceArray = [];
						for (var j = 0; j < results.length; j++) {
							choiceArray.push(results[j].item_id);
						}

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

				for (var k = 0; k < results.length; k++) {
					if (results[k].item_id === parseInt(answer.pickAnItem)) {
						chosenItem = results[k];
						// console.log("chosenItem", chosenItem);
					}
				}

				if (chosenItem.stock_quantity < parseInt(answer.pickAQuantity)) {
					console.log("Insufficient quantity!! Only " + chosenItem.stock_quantity + " units left!");
					displayInventory();
					customerChoice();
				}

				// console.log("chosenItem", chosenItem);

			});
	});
}

// function customerChoice() {
// 	inquirer
// 		.prompt({
// 			name: "pickAnItem",
// 			type: "input",
// 			messages: "Which item would you like to buy?"
// 			// choices: [1,2,3,4,5,6,7,8,]
// 		},
// 		{
// 			name: "pickAQuantity",
// 			type: "input",
// 			messages: "How many would you like to buy?"
// 		})
// 		.then();
// }