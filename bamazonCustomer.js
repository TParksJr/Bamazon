var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});

var products = [];
var currentSelection;
var currentSelectionID;
var quantitySelected;
var newStock;
var total = 0;

connection.connect(function (err) {
    if (err) throw err;
});

function displayProducts() {
    connection.query("SELECT * FROM bamazon.products;", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            products.push(res[i]);
            console.log("Product ID: " + res[i].id + "\nProduct Name: " + res[i].name + "\nDepartment: " + res[i].department
                + "\nPrice: $" + res[i].price + "\nStock: " + res[i].stock + "\n**********************************************");
        };
    });
};
displayProducts();

function checkOut() {
    inquirer.prompt([
        {
            type: "input",
            name: "proceed",
            message: "Would you like to proceed with your purchase? yes/no?"
        }
    ]).then(function (answer) {
        if (answer.proceed === "yes" || "no") {
            if (answer.proceed === "yes") {
                var query = "UPDATE bamazon.products SET stock = ? WHERE id = ?;";
                connection.query(query, [newStock, currentSelectionID], function (err, res) {
                    if (err) throw err;
                    displayProducts();
                    setTimeout(productChoice, 1000);
                });
            } else {
                productChoice();
            };
        } else {
            console.log("Invalid entry.");
            checkOut();
        };
    });
};

function productQuantity() {
    inquirer.prompt([
        {
            type: "input",
            name: "quantity",
            message: "Please enter the quantity of the product that you would like to purchase."
        }
    ]).then(function (answer) {
        if (parseInt(answer.quantity) < currentSelection.stock) {
            quantitySelected = parseInt(answer.quantity);
            newStock = (currentSelection.stock - quantitySelected);
            total += (currentSelection.price * (parseInt(answer.quantity)));
            console.log("The total cost is $" + total);
            checkOut();
        } else {
            console.log("Insufficient quantity.");
            productQuantity();
        };
    });
};

function productChoice() {
    inquirer.prompt([
        {
            type: "input",
            name: "choice",
            message: "Please enter the id of the product you would like to purchase."
        }
    ]).then(function (answer) {
        for (var i = 0; i < products.length; i++) {
            if (products[i].id === parseInt(answer.choice)) {
                currentSelection = products[i];
                currentSelectionID = currentSelection.id;
                productQuantity();
            };
        };
    });
};

setTimeout(productChoice, 1000);