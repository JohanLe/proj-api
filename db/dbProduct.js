const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/database.sqlite');

const dbProduct = {
    /**
     * Data : Array of values listed in order - id,name,price,stock,type
     */
    createProduct: (data) => {
        return new Promise((resolve, reject) => {
            db.run("INSERT INTO products (id, name, price, stock, type) VALUES (?, ?, ?, ?, ?);",
                data,
                (err) => {
                    reject("Something went wrong");
                })
            resolve("Product created");
        })
    },
    getAllProducts: () => {
        return new Promise((resolve, reject) => {
            db.all("select * from products",
                (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    else if (rows === undefined) {
                        reject(undefined);
                    }
                    resolve(rows);
                })
        })
    },
    getProduct: (product_id) => {
        return new Promise((resolve, reject) => {
            db.get("select * from products where id = ? ",
                product_id,
                (err, row) => {
                    if (err) {
                        reject(err);
                    }
                    else if (row === undefined) {
                        reject(undefined);
                    }
                    resolve(row);
                });
        });
    },
    productPurchase: (productId, amount) => {
        return new Promise((resolve, reject) => {
            db.run("UPDATE products SET stock = stock - ? WHERE id = ? ",
                [
                    amount,
                    productId
                ],
                (err) => {
                    if (err) {
                        reject({
                            status: 500,
                            msg: err
                        });
                    }
                })
            resolve("Success");
        })
    },
    productTradeIn: (productId, amount) => {
        return new Promise((resolve, reject) => {
            db.run("UPDATE products SET stock = stock + ? WHERE id = ? ",
                [
                    amount,
                    productId
                ],
                (err) => {
                    if (err) {
                        reject({
                            status: 500,
                            msg: err
                        });
                    }
                })
            resolve("Success");
        })
    },
    getUserInventory: (userId) => {
        return new Promise((resolve, reject) => {
            db.all(
                "select " +
                "products.name," +
                "products.id," +
                "products.type," +
                "user_inventory.unit_price as unit_price," +
                "user_inventory.amount," +
                "user_inventory.id as inventoryId" +
                " from user_inventory " +
                "INNER JOIN products on products.id = user_inventory.product_id " +
                "where user_id = ?;",
                userId,
                (err, rows) => {
                    if (err) {
                        reject({
                            status: 500,
                            msg: err
                        });
                    } else if (rows === undefined) {
                        reject({
                            status: 400,
                            msg: "User has no inventory"
                        });
                    }
                    console.log(rows);
                    resolve(rows);
                })

        })
    },
    getAllProductPrices: () => {
        return new Promise((resolve, reject) => {
            db.all("select id, price from products;",
                (err, rows) => {
                    if (err) {
                        reject({
                            status: 500,
                            msg: err
                        })
                    }
                    resolve({
                        status: 200,
                        data: rows
                    })

                })
        })
    }

}

module.exports = dbProduct;