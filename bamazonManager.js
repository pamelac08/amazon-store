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
  managerPrompt();
});

function managerPrompt() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          "View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Product",
          "Exit"
        ]
      }
    ])
    .then(function(answer) {
      switch (answer.action) {
        case "View Products for Sale":
          showProducts();
          break;
        case "View Low Inventory":
          showLowInventory();
          break;
        case "Add to Inventory":
          addInventory();
          break;
        case "Add New Product":
          addProduct();
          break;
        case "Exit":
          connection.end();
          break;
      }
    });
}

function reset() {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "reset",
        message: "Do you want to perform another action?"
      }
    ])
    .then(function(answer) {
      if (answer.reset) {
        managerPrompt();
      } else {
        console.log("ok, see you next time!");
        connection.end();
      }
    });
}

function showProducts() {
  var tableAll = new Table({
    head: ["Product Id", "Product Name", "Price ($)", "Quantity in Stock"]
  });

  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    console.log("\n" + "All  Products: \n");
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
    reset();
  });
}

function showLowInventory() {
  var tableAll = new Table({
    head: ["Product Id", "Product Name", "Price ($)", "Quantity in Stock"]
  });

  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    console.log("\n" + "Products with stock below 5: \n");

    for (let i = 0; i < res.length; i++) {
      if (parseInt(res[i].stock_quantity) < 5) {
        tableAll.push([
          res[i].item_id,
          res[i].product_name,
          res[i].price,
          res[i].stock_quantity
        ]);
      }
    }
    console.log(tableAll.toString());
    console.log("\n");
    reset();
  });
}

function addInventory() {
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].product_name);
            }
            return choiceArray;
          },
          message: "What product would you like to add inventory to?"
        },
        {
          name: "addStock",
          type: "input",
          message: "How much would you like to add?"
        }
      ])
      .then(function(answer) {
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].product_name === answer.choice) {
            chosenItem = results[i];

            connection.query(
              "UPDATE products SET ? WHERE ?",
              [
                {
                  stock_quantity:
                    parseInt(chosenItem.stock_quantity) +
                    parseInt(answer.addStock)
                },
                {
                  product_name: chosenItem.product_name
                }
              ],
              function(error) {
                if (error) throw error;
                console.log("Inventory updated successfully!");
                reset();
              }
            );
          }
        }
      });
  });
}

function addProduct() {
  inquirer
    .prompt([
      {
        name: "itemId",
        type: "input",
        message: "What is the item id of the new product?"
      },
      {
        name: "product",
        type: "input",
        message: "What is the new product's name?"
      },
      {
        name: "department",
        type: "input",
        message: "What department is the product in?"
      },
      {
        name: "price",
        type: "input",
        message: "What is the price of the new product?"
        // validate: function(value) {
        //   if (isNaN(value) === false) {
        //     return true;
        //   }
        //   return false;
        // }
      },
      {
        name: "stock",
        type: "input",
        message: "What is the starting inventory?"
        // validate: function(value) {
        //   if (isNaN(value) === false) {
        //     return true;
        //   }
        //   return false;
        // }
      }
    ])
    .then(function(answer) {
      connection.query(
        "INSERT INTO products SET ?",
        {
          item_id: answer.itemId,
          product_name: answer.product,
          department_name: answer.department,
          price: answer.price,
          stock_quantity: answer.stock
        },
        function(err) {
          if (err) throw err;
          console.log("New product was created successfully!");
          reset();
        }
      );
    });
}

