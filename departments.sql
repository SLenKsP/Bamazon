USE bamazon_db;

CREATE TABLE departments
(
    department_id INT NOT NULL DEFAULT 123456789,
    department_name VARCHAR(35) NOT NULL DEFAULT "Misc",
    over_head_cost DECIMAL(8,2) NOT NULL DEFAULT 9999.99
);
INSERT INTO departments
    (department_id,department_name, over_head_cost)
values(001, "Electronics", 12000),
    (002, "Appliences", 15000),
    (005, "Tools", 8000),
    (029, "Footware", 4000),
    (025, "Cables", 200),
    (015, "Movies", 400),
    (011, "Electric", 900);

ALTER TABLE products
ADD product_sales DECIMAL(8,2) NOT NULL DEFAULT 0;