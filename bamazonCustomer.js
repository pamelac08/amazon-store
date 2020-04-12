var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  showProducts();
});

function showProducts() {
  var tableAll = new Table({
    head: ["Product Id", "Product Name", "Price ($)", "Quantity in Stock"]
  });

  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    console.log("\n" + "Products Available for Purchase: \n");
    for (let i = 0; i < res.length; i++) {
      tableAll.push([
        res[i].item_id,
        res[i].product_name,
        res[i].price,
        res[i].stock_quantity
      ]);
    }
    console.log(tableAll.toString());

    console.log("\n");
    promptCustomer(res);
  });
}

function promptCustomer(results) {
  inquirer
    .prompt([
      {
        name: "id",
        message: "What is the id of the product you would like to buy?"
      },
      {
        name: "quantity",
        message: "How many you would like to buy?"
      }
    ])
    .then(function(answer) {
      item = parseInt(answer.id);
      quantity = parseFloat(answer.quantity);

      var chosenItem;
      for (var i = 0; i < results.length; i++) {
        if (item === results[i].item_id) {
          chosenItem = results[i];
        }
      }

      if (chosenItem.stock_quantity === 0) {
        console.log("Sorry, we are all out of stock of that item.");
        console.log("\n");
        reset();
      } else if (chosenItem.stock_quantity - quantity < 0) {
        console.log("there are not enough in stock at this time");
        console.log("\n");
        reset();
      } else if (
        quantity <= chosenItem.stock_quantity &&
        chosenItem.stock_quantity - quantity >= 0
      ) {
        connection.query(
          "UPDATE products SET ? WHERE ?",
          [
            {
              stock_quantity: chosenItem.stock_quantity - quantity,
              product_sales:
                chosenItem.product_sales + chosenItem.price * quantity
            },
            {
              item_id: chosenItem.item_id
            }
          ],
          function(error) {
            if (error) throw err;
            console.log("Order placed successfully!");
            console.log(
              "Your total is:  $" + chosenItem.price * quantity + "\n"
            );
            console.log("\n");
            reset();
          }
        );
      }
    });
}

function reset() {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "reset",
        message: "Would you like to order another item?"
      }
    ])
    .then(function(answer) {
      if (answer.reset) {
        showProducts();
      } else {
        console.log("ok, see you next time!");
        connection.end();
      }
    });
}
