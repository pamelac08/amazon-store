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
          "Exit"
        ]
      }
    ])
    .then(function(answer) {
      switch (answer.action) {
        case "View Product Sales by Department":
          showProductSales();
          break;
        case "Create New Department":
          newDepartment();
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
        supervisorPrompt();
      } else {
        console.log("ok, see you next time!");
        connection.end();
      }
    });
}

function showProductSales() {
  var tableAll = new Table({
    head: [
      "Department ID",
      "Department Name",
      "Over Head Costs",
      "Product Sales",
      "Total Profit"
    ]
  });

  var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, sum(products.product_sales), count(departments.department_id) ";
  query += "over (partition by departments.department_name) ";
  query += "FROM departments LEFT OUTER JOIN products ON departments.department_name = products.department_name ";
  query += "group by departments.department_id ";
  query += "order by departments.department_id; ";

  connection.query(query, function(err, res) {
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
        totalProfit
      ]);
    }
    console.log(tableAll.toString());
    reset();
  });
}

function newDepartment() {
  inquirer
    .prompt([
      {
        name: "departmentId",
        message: "What is the id of the new department?"
      },
      {
        name: "department_name",
        message: "What is the new department's name?"
      },
      {
        name: "overheadCosts",
        message: "What is the department's over-head costs?"
      }
    ])
    .then(function(answer) {
      connection.query(
        "INSERT INTO departments SET ?",
        {
          department_id: answer.departmentId,
          department_name: answer.department_name,
          over_head_costs: answer.overheadCosts
        },
        function(err) {
          if (err) throw err;
          console.log("New department was created successfully!");
          reset();
        }
      );
    });
}
