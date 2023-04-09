const express = require("express");
const app = express();
const port = 6969;
const mysql = require("mysql");


//store orders
let orders = [];


//CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



//post endpoint, selected orderds to db
app.post("/send-to-db", express.json(), (req, res) => {
  const selectedOrders = req.body;
  saveOrdersToDatabase(selectedOrders);
  orders = deleteOrders(orders, selectedOrders); // Update the global orders array
  console.log("selectedOrders: ", selectedOrders);
  console.log("orders: ", orders);
  console.log("Remaining orders:", orders); // Log the remaining orders
  res.sendStatus(200);
});


app.use(express.json());

//post enpoint, incoming orda
app.post("/", (req, res) => {
  const orderData = req.body;
  orders.push(orderData);
  console.log(JSON.stringify(orders, null, 2)); // Pretty print the JSON data
  res.sendStatus(200);
});


//get endpoint orders
app.get("/", (req, res) => {
  res.json(orders);
});

//server listen port 
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
