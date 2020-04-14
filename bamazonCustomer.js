var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require("colors");
var Table = require("cli-table3");

var orderTotal = 0;

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon_db",
});

connection.connect(function (err) {
  if (err) throw err;
  showProducts();
});

function showProducts() {
  var tableAll = new Table({
    head: [
      "Product Id".green,
      "Product Name".green,
      "Price ($)".blue,
      "Quantity in Stock".blue,
    ],
  });

  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;

    console.log("\n" + "Products Available for Purchase: \n");
    for (let i = 0; i < res.length; i++) {
      tableAll.push([
        res[i].item_id,
        res[i].product_name,
        res[i].price,
        res[i].stock_quantity,
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
        type: "list",
        name: "name",
        message: "What product you would like to buy?",
        choices: function () {
          var choiceArray = [];
          for (var i = 0; i < results.length; i++) {
            choiceArray.push(results[i].product_name);
          }
          return choiceArray;
        },
      },
      {
        name: "quantity",
        message: "How many would you like to buy?",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        },
      },
    ])
    .then(function (answer) {
      item = answer.name;
      quantity = parseFloat(answer.quantity);

      console.log("\nItem: " + item + "\n" + "Quantity: " + quantity + "\n");

      inquirer
        .prompt([
          {
            type: "confirm",
            name: "confirm",
            message: "Is this correct?",
          },
        ])
        .then(function (ans) {
          if (ans.confirm) {
            var chosenItem;
            for (var i = 0; i < results.length; i++) {
              if (item === results[i].product_name) {
                chosenItem = results[i];
              }
            }

            if (chosenItem.stock_quantity === 0) {
              console.log("\nSorry, we are all out of stock for that item.\n");
              reset();
            } else if (chosenItem.stock_quantity - quantity < 0) {
              console.log(
                "\nSorry, there are not enough in stock at this time.\n"
              );
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
                      chosenItem.product_sales + chosenItem.price * quantity,
                  },
                  {
                    item_id: chosenItem.item_id,
                  },
                ],
                function (error) {
                  if (error) throw err;
                  console.log("\nOrder placed successfully!");
                  console.log(
                    "\nYour total for this item is:  $" +
                      chosenItem.price * quantity +
                      "\n"
                  );
                  console.log("\n");
                  orderTotal = orderTotal + chosenItem.price * quantity;
                  reset();
                }
              );
            }
          } else {
            reset();
          }
        });
    });
}

function reset() {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "reset",
        message: "Would you like to order another item?",
      },
    ])
    .then(function (answer) {
      if (answer.reset) {
        showProducts();
      } else {
        console.log("\nYour Grand Total for all items: $" + orderTotal);
        console.log("\nSee you next time!\n");
        connection.end();
      }
    });
}
