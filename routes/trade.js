const express = require('express');
const router = express.Router();
const fn = require("../generalFunctions");
const dbTrade = require("../db/dbTrade");
const dbAuth = require("../db/dbAuth");

router.get("/", (req, res) => {
    res.send('Trade the birdies !')
});

router.post("/buy", async (req, res) => {
    /**
        - Hämta pris från produkt.
       -  TODO Autentisera användare.
     */


    try {
        console.log(req.body);

        var totalPrice = (req.body.amount * req.body.unitPrice),
            inventoryId = fn.createRandomId(12);

        await dbAuth.verifyToken(req.body.token);
        await dbTrade.productPurchase(req.body.productId, req.body.amount);
        await dbTrade.withdrawCoins(req.body.userId, totalPrice);
        await dbTrade.addToUserInventory(req.body.userId, req.body.productId, req.body.amount, req.body.unitPrice, inventoryId);

        res.json({
            status: 200,
            msg: "Purchase made!"
        })
    } catch (err) {
        console.log("ERROR!: " + err);
        res.json({
            status: err.status,
            msg: "Trade "
        });
    }
})
router.post("/sell", async (req, res) => {

    /**
        - Hämta pris från produkt.
        UserID, inventoryID, amount, price, 
     */
    try {
        var totalPrice = (parseInt(req.body.amount) * parseInt(req.body.unitPrice));

        await dbAuth.verifyToken(req.body.token);
        await dbTrade.removeFromUserInventory(req.body.inventoryId);
        await dbTrade.productTradeIn(req.body.productId, req.body.amount);
        await dbTrade.depositCoins(req.body.userId, totalPrice);

        res.json({
            status: 200,
            msg: "Success"
        })
    } catch (err) {
        console.log("ERROR!: " + err);
        res.json({
            status: err.status,
            msg: err.msg
        });
    }
})

router.post("/deposit", async (req, res) => {
    /* 
    jwt = ^KnhWjjqncjgYZ%RDpHZkeD6$#*hZPD0slP3IzLk
    */

    console.log(req.body);
    try {
        await dbAuth.verifyToken(req.body.token);
        await dbTrade.depositCoins(req.body.id, req.body.amount);
        res.json({
            "status": 200,
            "msg": req.body.amount + " : coins deposited.",
        });
    } catch (err) {
        res.json({
            status: err.status,
            msg: err.msg
        });
    }

});



module.exports = router;