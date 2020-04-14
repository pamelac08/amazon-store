var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require("colors");
var Table = require("cli-table3");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon_db",
});

connection.connect(function (err) {
  if (err) throw err;
  supervisorPrompt();
});

function supervisorPrompt() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          "View Product Sales by Department",
          "Create New Department",
          "Delete a Department",
          "Delete a Product from Inventory",
          "Exit",
        ],
      },
    ])
    .then(function (answer) {
      switch (answer.action) {
        case "View Product Sales by Department":
          showProductSales();
          break;
        case "Create New Department":
          newDepartment();
          break;
        case "Delete a Department":
          deleteDepartment();
          break;
        case "Delete a Product from Inventory":
          deleteProduct();
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
        message: "Do you want to perform another action?",
      },
    ])
    .then(function (answer) {
      if (answer.reset) {
        supervisorPrompt();
      } else {
        console.log("\nOk, see you next time!\n");
        connection.end();
      }
    });
}

function showProductSales() {
  var tableAll = new Table({
    head: [
      "Department ID".magenta,
      "Department Name".magenta,
      "Over Head Costs".yellow,
      "Product Sales".blue,
      "Total Profit".green,
    ],
  });

  var query =
    "SELECT departments.department_id, departments.department_name, departments.over_head_costs, sum(products.product_sales), count(departments.department_id) ";
  query += "over (partition by departments.department_name) ";
  query +=
    "FROM departments LEFT OUTER JOIN products ON departments.department_name = products.department_name ";
  query += "group by departments.department_id ";
  query += "order by departments.department_id; ";

  connection.query(query, function (err, res) {
    if (err) throw err;

    for (var i = 0; i < res.length; i++) {
      if (res[i]["sum(products.product_sales)"] === null) {
        res[i]["sum(products.product_sales)"] = 0;
      }

      var totalProfit =
        res[i]["sum(products.product_sales)"] - res[i].over_head_costs;

      tableAll.push([
        res[i].department_id,
        res[i].department_name,
        res[i].over_head_costs,
        res[i]["sum(products.product_sales)"],
        totalProfit,
      ]);
    }
    console.log(tableAll.toString() + "\n");
    reset();
  });
}

function newDepartment() {
  inquirer
    .prompt([
      {
        name: "departmentId",
        message: "What is the id of the new department?",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        },
      },
      {
        name: "department_name",
        message: "What is the new department's name?",
      },
      {
        name: "overheadCosts",
        message: "What is the department's over-head costs?",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        },
      },
    ])
    .then(function (answer) {
      console.log(
        "\nNew Department ID: " +
          answer.departmentId +
          "\n" +
          "New Department Name: " +
          answer.department_name +
          "\n" +
          "New Department Over-head Costs: " +
          answer.overheadCosts +
          "\n"
      );

      inquirer
        .prompt([
          {
            type: "confirm",
            name: "confirm",
            message: "Is this new department information correct?",
          },
        ])
        .then(function (ans) {
          if (ans.confirm) {
            connection.query(
              "INSERT INTO departments SET ?",
              {
                department_id: answer.departmentId,
                department_name: answer.department_name,
                over_head_costs: answer.overheadCosts,
              },
              function (err) {
                if (err) throw err;
                console.log("New department was created!");
                reset();
              }
            );
          } else {
            reset();
          }
        });
    });
}

function deleteDepartment() {
  connection.query("SELECT * FROM departments", function (err, results) {
    if (err) throw err;

    inquirer
      .prompt([
        {
          type: "rawlist",
          name: "deleteDept",
          message: "What department to you want to delete from record?",
          choices: function () {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].department_name);
            }
            return choiceArray;
          },
        },
      ])
      .then(function (answer) {
        console.log("\nDepartment to delete: [" + answer.deleteDept + "] \n");

        inquirer
          .prompt([
            {
              type: "confirm",
              name: "confirm",
              message:
                "Are you sure you want to delete this department from record?",
            },
          ])
          .then(function (ans) {
            if (ans.confirm) {
              connection.query(
                "DELETE FROM departments WHERE ?",
                {
                  department_name: answer.deleteDept,
                },
                function (err, res) {
                  if (err) throw err;
                  console.log(
                    "The department [ " +
                      answer.deleteDept +
                      " ] has been deleted.\n"
                  );
                  reset();
                }
              );
            } else {
              console.log("Department not deleted.\n");
              reset();
            }
          });
      });
  });
}

function deleteProduct() {
  connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;

    inquirer
      .prompt([
        {
          type: "rawlist",
          name: "deleteProduct",
          message: "What product to you want to delete from inventory?",
          choices: function () {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].product_name);
            }
            return choiceArray;
          },
        },
      ])
      .then(function (answer) {
        console.log("\nProduct to delete: [" + answer.deleteProduct + "] \n");

        inquirer
          .prompt([
            {
              type: "confirm",
              name: "confirm",
              message: "Are you sure you want to delete this product?",
            },
          ])
          .then(function (ans) {
            if (ans.confirm) {
              connection.query(
                "DELETE FROM products WHERE ?",
                {
                  product_name: answer.deleteProduct,
                },
                function (err, res) {
                  if (err) throw err;
                  console.log(
                    "The product [ " +
                      answer.deleteProduct +
                      " ] has been deleted!\n"
                  );
                  reset();
                }
              );
            } else {
              console.log("Product not deleted.\n");
              reset();
            }
          });
      });
  });
}
