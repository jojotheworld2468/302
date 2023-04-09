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

//db connection
const dbConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "orders",
  port: 3306,
});

//dc db
dbConnection.connect(function (err) {
  if (err) throw err;
  console.log("Connected to the MySQL database");
});

//save to db
function saveOrdersToDatabase(orders) {
  orders.forEach((order) => {
    const sql = `INSERT INTO orders (customer_name, customer_contact, customer_address, delivery_date, product_model, product_qty) VALUES (
      '${order.customer.name}',
      '${order.customer.contact}',
      '${order.customer.address}',
      '${order.delivery.date}',
      '${order.product.model}',
      ${order.product.qty}
    )`;

    dbConnection.query(sql, function (err) {
      if (err) throw err;
      console.log("Order saved to the database");
    });
  });
}

// function deleteOrders(orders, sentOrders) {
//   return orders.filter((order) => {
//     // console.log("sentOrders: ", sentOrders);
//     // console.log("order: ", order);
//     return !sentOrders.some(
//       (sentOrder) => JSON.stringify(sentOrder) === JSON.stringify(order)
//     );
//   });
// }

//delete orders after sent to db
function deleteOrders(orders, sentOrders) {
  const updatedOrders = [];
  for (let i = 0; i < orders.length; i++) {
    let shouldDelete = false;
    for (let j = 0; j < sentOrders.length; j++) {
      if (JSON.stringify(sentOrders[j]) === JSON.stringify(orders[i])) {
        shouldDelete = true;
        break;
      }
    }
    if (!shouldDelete) {
      updatedOrders.push(orders[i]);
    }
  }
  return updatedOrders;
}

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
