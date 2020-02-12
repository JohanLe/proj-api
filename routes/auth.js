const express = require('express');
const router = express.Router();
const fn = require("../generalFunctions");
const dbAuth = require("../db/dbAuth");
const dbTrade = require("../db/dbTrade");


/**
 * Register user
 * 
 */
router.post("/register", async (req, res, next) => {
    var hashedPass = "";
    var userId = "";
    try {
        hashedPass = await fn.hashPass(req.body.password);
        userId = fn.createRandomId(10);
        const formData = {
            "id": userId,
            "password": hashedPass,
            "email": req.body.email,
            "name": req.body.name
        }
        await dbAuth.registerUser(formData);

        res.json({
            "status": 200,
            "token": token,
            "user": user
        });
    } catch (err) {
        console.log(err);
        res.json({
            status: err.status,
            msg: err.msg
        });
    }

});

router.post("/login", async (req, res) => {
    /* 
    jwt = ^KnhWjjqncjgYZ%RDpHZkeD6$#*hZPD0slP3IzLk
    */

    try {
        var hashedPass = await dbAuth.getUserHashedPassword(req.body.email);
        var user = await dbAuth.getUserDataByEmail(req.body.email);
        await fn.deCryptPassword(req.body.password, hashedPass.password);

        const token = await dbAuth.createToken(req.body.email);

        // TODO fixa till cookies. Läs på o fix!
        //res.cookie('cookieName',"randomNumber", { maxAge: 900000, httpOnly: true });
        console.log(user);
        res.json({
            "status": 200,
            "token": token,
            "user": user
        });
    } catch (err) {
        console.log(err);
        res.json({
            status: err.status,
            msg: err.msg
        });
    }

});
router.get("/user/:userId", async (req, res) => {
    /* 
    jwt = ^KnhWjjqncjgYZ%RDpHZkeD6$#*hZPD0slP3IzLk
    */

    try {
        console.log(req.params.userId)
        var user = await dbAuth.getUserData(req.params.userId);
        
        console.log(user);
        res.json({
            "status": 200,
            "user": user
        });
    } catch (err) {
        console.log(err);
        res.json({
            status: err.status,
            msg: err.msg
        });
    }

});


router.get("/", (req, res) => {
    res.send('Did you mean auth/login ? :D')
});


module.exports = router;