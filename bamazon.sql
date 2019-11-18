CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products
(
    item_id INT IDENTITY(1,1)  ,
    product_name VARCHAR(65) NOT NULL,
    department_name VARCHAR(40) NOT NULL,
    price DECIMAL(6,2) NOT NULL,
    stock_quantity INT,
    PRIMARY KEY (item_id)
);

INSERT INTO products
    (product_name, department_name, price, stock_quantity)
VALUES
    ("Apple iPhone", "Electronics", 1099.00, 45),
    ("Samsung 55in 4k QLED TV", "Electronics", 497.99, 16),
    ("Apple iPad 10.5in 7th Gen", "Electronics", 249.00, 24),
    ("LG 5.5 Qft Washer", "Appliences", 699.99, 8),
    ("Dewalt Impact Drill-Driver", "Tools", 149.97, 75),
    ("Work Boot size 12", "Footware", 47.25, 15),
    ("LG 9 Qft Dryer", "Appliences", 749.99, 9),
    ("Craftsman 25ft Extention Cord", "Cables", 24.99, 56),
    ("GE Soft White 60w LED Bulbs- Pack of 4", "Electric", 17.99, 110),
    ("Avengers Endgame 4K - DVD", "Movies", 29.99, 5);
