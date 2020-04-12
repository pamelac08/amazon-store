-- Create a MySQL Database called bamazon.
DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
  item_id INT NOT NULL,
  product_name VARCHAR(50) not null,
  department_name VARCHAR(50) null,
  price DECIMAL(10,2) null, 
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);


INSERT INTO products (id, product_name, department_name, price, stock_quantity)
VALUES  (101, "shorts", "clothing", 5.00, 30), 
        (102, "shirt", "clothing", 6.00, 30), 
        (103, "jacket", "clothing", 8.50, 20),

        (201, "notebook", "stationary", 3.25, 70),
        (202, "pens", "stationary", 2.00, 50),
        (203, "folder", "stationary", 1.00, 100),

        (301, "cards", "games", 5.00, 35),
        (302, "puzzle", "games", 10.00, 15),
        (303, "monopoly", "games", 25.75, 10),

        (401, "calulator", "technology", 40.00, 15),
        (402, "headphones", "technology", 75.00, 7),
        (403, "power cord", "technology", 12.00, 25);



CREATE TABLE departments (
  department_id INT NOT NULL,
  department_name VARCHAR(50),
  over_head_costs DECIMAL(20,2), 
  PRIMARY KEY (department_id)
);

-- add a "product_sales" column to products table
alter table products
add column product_sales int(20,2) after stock_quantity;


INSERT INTO departments (department_id, department_name, over_head_costs)
VALUES  (01, "clothing", 500), 
        (02, "stationary", 600), 
        (03, "games", 400), 
        (04, "technology", 1000),
        (05, "grocery", 300);