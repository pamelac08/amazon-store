# Amazon Store
Coding Bootcamp
Unit 12: Node &amp; MySQL 


##  Technical Description

**Overview:**
An Amazon-like storefront utilizing MySQL for data storage and Node for user interface
- The app will take in orders from customers and deplete stock from the store's inventory  
- The app also tracks product sales across the store's departments and provides a summary of the highest-grossing departments in the store


**How it works**
There are three different functionalities utilizing three different node files:

* As a Customer, run the bamazonCustomer.js file:
    - Running this application will first display all of the items available for sale
    - The app will then prompt users with two messages:
        * The first will ask the name of the product they would like to buy (from a list).
        * The second message will ask how many units of the product they would like to buy.
        * Before continuing, the user will be asked to confirm the selection.  If yes, the user will proceed to checkout. If no, the user will be asked if they want to place another order.    
    - Once the user has placed the order, the app will check if the store has enough of the product to meet the customer's request
        * If not, the user will get the appropriate error message and be asked if they want to place another order
        * If the store does have enough of the product, the user's order will be fulfilled and show the user the total cost of the item ordered
    - The user will be prompted if they would like to place another order.  If yes, they are able to add as many items to the order as they like.  Once finished, the app will show the total of all items ordered.

* As a Manager, run the bamazonManager.js file:
    - Running this application will display a list menu options:
        * View Products for Sale: the app will list every available item by item ID, name, price, and current quantity
        * View Low Inventory: the app will list all items with an inventory count lower than five
        * Add to Inventory: the app will display a prompt that will let the user add to the inventory of any item currently in the store
            - Before continuing, the user will be asked to confirm the change.  If yes, the inventory will be updated. If no, the user will be asked if they want to perform another action
        * Add New Product: the app will allow the user to add a completely new product to the store
            - Before continuing, the user will be asked to confirm the entry.  If yes, the item will be added to the available items to purchase. If no, the user will be asked if they want to perform another action 

* As a Supervisor, run the bamazonSupervisor.js file:
    - Running this application will list a set of menu options:
        * View Product Sales by Department: when selected, the app will display a summarized table of departments by id and for each department: name, overhead costs, current total product sales, and total profit for the department
        * Create New Department: user is prompted to add a new department with id, name, and overhead costs 
            - Before continuing, the user will be asked to confirm the entry.  If yes, the department will be added to the database. If no, the user will be asked if they want to perform another action
        * Delete a Department: the user will be given a choice of all departments in database to delete.  Once selected, the user will be asked to confirm the entry.  If yes, the department will be deleted from the database. If no, the user will be asked if they want to perform another action
        * Delete a Product from Inventory: the user will be given a choice of all products currently in the inventory to delete.  Once selected, the user will be asked to confirm the entry.  If yes, the product and all information associated with it will be deleted from the database. If no, the user will be asked if they want to perform another action

    

* Technologies used:

    - MYSQL for data storage
    - Inquirer/prompt, colors, cli-table3 npm packages
    - JS constructors (for displaying tables)
    - Javascript/jQuery 
       - data validation
       - conditional statements
       - for loops


* Technical Approach:

MySQL database: 
- A table called products (starting with ~10 rows of test data) with columns: item_id (unique id for each product), product_name (Name of product), department_name, price (cost to customer), stock_quantity (how much of the product is available in stores), product_sales
- A table called departments with columns: department_id, department_name, over_head_costs (A number you set for each department)

Upon connection to the database from the node app, the customer will be shown a table of all available products then prompted with a list of questions to complete.  Depending on the response, the app runs the appropriate function until completion by the user.  Upon connection, both the manager and supervisor are given a menu of choices.  Each option once selected will then run the appropriate function until the user is finished and exits the app.



* Further development:

I added in a delete department and delete product function for the supervisor to have flexibility in functionality without having to access the database.  Also included confirmations any time data was entered before the app updated the database to allow for termination if there was an error in the inputs.  With more time, I would add more data validation on some of the inputs, 



 
    

## GIFs of functionality

#### Customer View

Gif: Customer View - Successful Order
![Gif-Customer-successful-order](./gifs/amazonStore_Customer_order.gif)

Gif: Customer View - Order with errors
![Gif-Customer-errors-with-ordering](./gifs/amazonStore_Customer_errors.gif)


#### Manager View

Gif: Manager View - Display Products/Low Inventory & Add inventory
![Gif-Manager-first-three-options](./gifs/amazonStore_manager_1-3.gif)

Gif: Manager View - Add a new product to inventory
![Gif-Manager-new-product](./gifs/amazonStore_manager_newProduct.gif)

Gif: Manager View - Display Products/Low Inventory & Add inventory
![Gif-Manager-negative-responses](./gifs/amazonStore_manager_neg-responses.gif)


#### Supervisor View

Gif: Supervisor View - Display department summary & create new department
![Gif-Supervisor-displayDepts-newDept](./gifs/amazonStore_supervisor_display-newDept.gif)

Gif: Supervisor View - Delete a Department and Product, confirm deleted department
![Gif-Supervisor-delete-DeptProd](./gifs/amazonStore_supervisor_delete-Dept-Prod.gif)

Gif: Supervisor View - confirming the deleted product
![Gif-Supervisor-confirm-deletedProduct](./gifs/amazonStore_supervisor_confirm-del-prod.gif)

Gif: Supervisor View - confirm negative responses
![Gif-Supervisor-negative-responses](./gifs/amazonStore_supervisor_confirm-negatives.gif)

