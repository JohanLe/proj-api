
CREATE TABLE IF NOT EXISTS users(
    id VARCHAR(12),
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    coins int,
    UNIQUE(email)
);

CREATE TABLE IF NOT EXISTS user_inventory ( 
    id VARCHAR(12),
    user_id VARCHAR(12) NOT NULL,
    product_id VARCHAR(12) NOT NULL,
    amount int NOT NULL,
    unit_price int
);

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(12),
    name VARCHAR(255),
    price int,
    stock int,
    type VARCHAR(25),
    UNIQUE(id)
);

INSERT INTO products (id, name, price, stock, type) VALUES ("1234abcd", "Microsoft", 20, 60000, "Stock");
INSERT INTO products (id, name, price, stock, type) VALUES ("3456abcd", "Apple", 10, 2500, "Stock");
INSERT INTO products (id, name, price, stock, type) VALUES ("4567abcd", "Berkshire Bond", 66, 10000, "Bond");
