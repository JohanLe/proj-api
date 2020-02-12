const bodyParser = require("body-parser");
const cors = require('cors');
const morgan = require('morgan');
const express = require("express");
const cookieParser = require("cookie-parser");



const app = express();
const server = require('http').createServer(app);
var io = require('socket.io')(server);
const dbProduct = require("./db/dbProduct");

const port = 8888;

const products = require("./routes/products");
const auth = require("./routes/auth");
const trade = require("./routes/trade");

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


const changePrices = (priceList) => {
    var newPrices = priceList.map(product => {
        if (Math.random() < 0.5) {
            product.price = product.price + 1;
        } else {
            product.price = product.price - 1;
        }
        return product;
    });
    return newPrices;
}

const managePrices = async () => {
    var priceData = await dbProduct.getAllProductPrices();
    var priceList = priceData.data;
    io.on('connection', (socket) => {
        console.log("Coneccted to : " + socket.id)

    })
    try {
        setInterval(async () => {
            priceList = await changePrices(priceList);
            io.emit("newPrices", priceList);
            console.log("EMIT");
        }, 5000);

    } catch (err) {
        console.log(err);
    }




}




managePrices();


if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
}
app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.path);
    next();
});

app.use("/products", products);
app.use("/auth", auth);
app.use("/trade", trade);
app.use("/", (req, res) => {
    res.send("HELLO WORLD !");
});




app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    res.status(err.status || 500 || 502).json({
        "errors": [
            {
                "status": err.status,
                "title": err.message,
                "detail": err.message
            }
        ]
    });
});

server.listen(port, () => console.log(`Example API listening on port ${port}!`));