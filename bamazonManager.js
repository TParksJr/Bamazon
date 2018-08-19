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

function displayProducts() {
    connection.query("SELECT * FROM bamazon.products;", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            products.push(res[i]);
            console.log("Product ID: " + res[i].id + "\nProduct Name: " + res[i].name + "\nDepartment: " + res[i].department
                + "\nPrice: $" + res[i].price + "\nStock: " + res[i].stock + "\n**********************************************");
        };
    });
    setTimeout(initialPrompt, 1000);
};

function displayLowInventory() {
    connection.query("SELECT * FROM bamazon.products WHERE stock < 5;", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            products.push(res[i]);
            console.log("Product ID: " + res[i].id + "\nProduct Name: " + res[i].name + "\nDepartment: " + res[i].department
                + "\nPrice: $" + res[i].price + "\nStock: " + res[i].stock + "\n**********************************************");
        };
    });
    setTimeout(initialPrompt, 1000);
};

function addInventory() {
    inquirer.prompt([
        {
            type: "input",
            name: "product",
            message: "Enter the ID of the product you would like to add stock to.",
        },
        {
            type: "input",
            name: "quantity",
            message: "How many units would you like to add?",
        }
    ]).then(function (answers) {
        for (var i = 0; i < products.length; i++) {
            if (products[i].id === parseInt(answers.product)) {
                var query = "UPDATE bamazon.products SET stock = (stock + ?) WHERE id = ?;";
                connection.query(query, [parseInt(answers.quantity), parseInt(answers.product)], function (err, res) {
                    if (err) throw err;
                });
                setTimeout(initialPrompt, 1000);
            } else {
                console.log("Product ID not found.");
                addInventory();
            };
        }
    });
};

function addProduct() {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Enter the name of the product you would like to add.",
        },
        {
            type: "input",
            name: "department",
            message: "Enter the department of the product you would like to add.",
        },
        {
            type: "input",
            name: "price",
            message: "Enter the price of the product you would like to add.",
        },
        {
            type: "input",
            name: "stock",
            message: "How much stock would you like to add?",
        }
    ]).then(function (answers) {
        if (answers.name && answers.department && answers.price && answers.stock) {
            var query = "INSERT INTO bamazon.products (name, department, price, stock) VALUES (?, ?, ?, ?);";
            connection.query(query, [answers.name, answers.department, parseFloat(answers.price), parseInt(answers.stock)], function (err, res) {
                if (err) throw err;
                initialPrompt();
            });
        } else {
            console.log("Invalid entry.");
            addProduct();
        };
    });
};

function removeProduct() {
    inquirer.prompt([
        {
            type: "input",
            name: "product",
            message: "Enter the ID of the product you would like to remove.",
        }
    ]).then(function (answer) {
        for (i = 0; i < products.length; i++) {
            if (product[i].id === parseInt(answer.product)) {
                var query = "DELETE FROM bamazon.products WHERE id = ?;";
                connection.query(query, answer.product, function (err, res) {
                    if (err) throw err;
                    initialPrompt();
                });
            } else {
                console.log("Cannot find specified product ID.");
                removeProduct();
            };
        };
    });
};

function initialPrompt() {
    inquirer.prompt([
        {
            type: "list",
            name: "options",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Remove Product"]
        }
    ]).then(function (answer) {
        switch (answer.options) {
            case "View Products for Sale":
                displayProducts();
                break;
            case "View Low Inventory":
                displayLowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addProduct();
                break;
            case "Remove Product":
                removeProduct();
                break;
            default:
                console.log("Invalid selection!");
                break;
        };
    });
};
initialPrompt();