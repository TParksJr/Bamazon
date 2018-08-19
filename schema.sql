drop database if exists bamazon;
create database bamazon;
use bamazon;
create table products (
id integer(10) not null auto_increment,
name varchar(100),
department varchar(100),
price decimal(10, 2),
stock integer(10),
primary key (id)
);

insert into products (name, department, price, stock)
values ("Beats Headphones", "Electronics", 29.99, 50),
("Lightning Charger", "Electronics", 9.99, 80),
("Apple Headphones", "Electronics", 29.99, 50),
("USB Charger", "Electronics", 9.99, 100),
("USB-C Charger", "Electronics", 9.99, 70),
("Lipstick", "Beauty Products", 9.99, 60),
("Potato Chips", "Food", 4.99, 70),
("Beef Jerky", "Food", 9.99, 60),
("Mascara", "Beauty Products", 9.99, 70),
("Eye Liner", "Electronics", 9.99, 60);

select * from bamazon.products;

UPDATE bamazon.products SET stock = 9 WHERE id = 10;

SELECT * FROM bamazon.products WHERE stock < 10;