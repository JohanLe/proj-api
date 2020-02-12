const express = require('express');
const router = express.Router();
const dbProduct = require("../db/dbProduct");



/** 
 * Get all products from database
 * Returns JSON
 */
router.get("/all", async (req, res, next) => {
    try {
        var products = await dbProduct.getAllProducts();
        res.status(200).json({
            "status": 200,
            "data": products
        })
    } catch (error) {
        if (error == undefined) {
            res.status(400).json({
                "status": 400,
                "msg": "Could't find product: " + error
            })
        } else {
            res.status(500).json({
                "status": 500,
                "msg": "Error: " + error
            })
        }
    }
});

/**
 * Get a single product via ID from database
 * Returns JSON
 */
router.get("/:product", async (req, res, next) => {
    var pId = req.params.product;
    try {
        var product = await dbProduct.getProduct(pId);
        res.status(200).json({
            "status": 200,
            "data": product
        })
    } catch (err) {
        if (err == undefined) {
            res.status(400).json({
                "status": 400,
                "msg": "Could't find product: " + err
            })
        } else {
            res.status(500).json({
                "status": 500,
                "msg": "err: " + err
            })
        }
    }
});
/**
 * Get all products connected to a single user
 * Returns JSON
 */
router.get("/myinventory/:userId", async (req, res, next) => {
    var userId = req.params.userId;
    try {
        var products = await dbProduct.getUserInventory(userId);
        res.status(200).json({
            "status": 200,
            "data": products
        })
    } catch (err) {
        console.log("errrr");
        if (err == undefined) {
            res.status(400).json({
                "status": 400,
                "msg": "Could't find products: " + err
            })
        } else {
            res.status(500).json({
                "status": 500,
                "msg": "err: " + err
            })
        }
    }
});

/** 
 * - Insert a new product
 * (id), name, price, stock, type.
 */

router.post("/create", async (req, res, next) => {
    try {
        //const data = req.body.data;
        var testData = ["9876dcba", "Tee peg Wood. x100", 39, 1000, "Pegs"];
        var result = await dbProduct.createProduct(testData);
    
        res.status(200).json({
            msg: "Product created!",
            result: result
        })
    } catch (err) {
        // Does product allready exist? Maybe update current or atleast give waring. 
        res.status(500).json({
            "status": 500,
            "msg": "Error: " + err
        })
    }

});



/*
*   If no subpage was specified.
*/
router.get("/", (req, res) => {
    res.status(300).json({
        data: {
            msg: "Could not find what you were looking for. Wrong url",
            status: 300
        }
    });
});
module.exports = router;