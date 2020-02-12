const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/database.sqlite');

const fn = require('../generalFunctions');

const dbTrade = {

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
    withdrawCoins: (userId, amount) => {
        return new Promise((resolve, reject) => {
            db.run("UPDATE users SET coins = coins - ? WHERE id = ?;",
                [
                    amount,
                    userId
                ],
                (err) => {
                    if (err) {
                        console.log("WITHDRAW FAILED");
                        reject({
                            status: 500,
                            msg: err
                        });
                    }
                })
            resolve({
                status: 200,
                msg: "Coins withdrawn"
            });
        })
    },
    depositCoins: (userId, amount) => {
        return new Promise((resolve, reject) => {
            db.run("UPDATE users SET coins = coins + ? WHERE id = ?;",
                [
                    amount,
                    userId
                ],
                (err) => {
                    if (err) {
                        console.log("DEPOSIT FAILED");
                        reject({
                            status: 500,
                            msg: err
                        });
                    }
                })
            resolve({
                status: 200,
                msg: "Coins deposited"
            });
        })
    },
    addToUserInventory: (userId, productId, amount, unitPrice, id) => {
        return new Promise((resolve, reject) => {
            db.run("INSERT INTO user_inventory (id, user_id, product_id, amount, unit_price) VALUES (?, ?, ?, ?, ?);",
                [
                    id,
                    userId,
                    productId,
                    amount,
                    unitPrice,
                ],
                (err) => {
                    if (err) {
                        console.log("FAILED");
                        reject({
                            status: 500,
                            msg: err
                        });
                    }
                })
            resolve({
                status: 200,
                msg: "Added to inventory"
            });
        })
    },
    removeFromUserInventory: (id) => {
        return new Promise((resolve, reject) => {
            db.run("DELETE from user_inventory where id = ?;",
                id,
                (err) => {
                    if (err) {
                        console.log("FAILED");
                        reject({
                            status: 500,
                            msg: err
                        });
                    }
                })
            resolve({
                status: 200,
                msg: "Removed from user_inventory"
            });
        })
    }

}

module.exports = dbTrade;