const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/database.sqlite');
const jwt = require('jsonwebtoken');

const dbAuth = {
    registerUser: (user) => {
        return new Promise((resolve, reject) => {
            db.run("INSERT INTO users (id, email, password, name, coins) VALUES (?, ?, ?, ?, ?);",
                [
                    user.id,
                    user.email,
                    user.password,
                    user.name,
                    5000
                ],
                (err) => {
                    if (err) {
                        reject({
                            status: err.status,
                            msg: err.msg
                        });
                    }
                })
        })
    },
    getUserHashedPassword: (email) => {
        return new Promise((resolve, reject) => {
            db.get("SELECT password FROM users where email = ?;",
                email,
                (err, row) => {
                    if (err) {
                        reject({
                            status: 500,
                            msg: err
                        });
                    }
                    resolve(row);
                })
        })
    },
    createToken: (email) => {
        return new Promise((resolve, reject) => {
            const payload = email;
            //const secret = process.env.JWT_SECRET;
            const secret = "^KnhWjjqncjgYZ%RDpHZkeD6$#*hZPD0slP3IzLk";
            const token = jwt.sign(payload, secret);
            resolve(token);
        })
    },
    verifyToken: (token) => {
        const secret = "^KnhWjjqncjgYZ%RDpHZkeD6$#*hZPD0slP3IzLk";
        return new Promise((resolve, reject) => {
            jwt.verify(token, secret, function (err, decoded) {
                if (err) {
                    reject({
                        status: 400,
                        msg: "Could't verify user, try to logout and in again."
                    });
                }

                resolve(decoded);
            });
        })
    },
    getUserId: (email) => {
        return new Promise((resolve, reject) => {
            db.get("SELECT id FROM users where email = ?;",
                email,
                (err, row) => {
                    if (err) {
                        reject({
                            status: 500,
                            msg: err
                        });
                    }
                    resolve(row);
                })
        })
    },
    getUserData: (userId) => {
        return new Promise((resolve, reject) => {
            db.get("SELECT id, name, email, coins FROM users where id = ?;",
                userId,
                (err, rows) => {
                    if (err) {
                        reject({
                            status: 500,
                            msg: err
                        });
                    }
                    resolve(rows);
                })
        })
    },
    getUserDataByEmail: (email) => {
        return new Promise((resolve, reject) => {
            db.get("SELECT id, name, email, coins FROM users where email = ?;",
            email,
                (err, rows) => {
                    if (err) {
                        reject({
                            status: 500,
                            msg: err
                        });
                    }
                    resolve(rows);
                })
        })
    },


}

module.exports = dbAuth;