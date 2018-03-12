	# bamazon

### Objective 
Create a CLI application that functions as an Amazon-like storefront, using MySQL and Inquirer node.js packages. 

### Installation
1. Clone the repository to a local folder via `git clone https://github.com/sashikers/bamazon.git`. 
2. Install the relevant libraries via `npm install`. 
3. Run the program via `node bamazonCustomer.js`. 

### Overview
The user is shown the available inventory, including units available, price, and category. 
![first view](/screenshots/intro.png)

If there is not sufficient inventory, the user is shown an error message. 
![insufficient inventory](/screenshots/insufficient.png)

If ther is sufficient inventory, the user total goes up, and item inventory goes down (see #3, Friends), and user gets prompted for another purchase. 
![sufficient inventory](/screenshots/sufficient.png)



