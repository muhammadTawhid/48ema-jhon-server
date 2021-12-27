const express = require("express");
require('dotenv').config()
const bodyParser = require("body-parser")
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const dbName = process.env.DB_NAME
const user = process.env.DB_USER;
const password = process.env.DB_PASS;

const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${user}:${password}@cluster0.pp5w4.mongodb.net/${dbName}?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db(dbName).collection("products");
  const ordersCollection = client.db(dbName).collection("orders");

   app.post("/addProduct", (req, res) =>{
       const products = req.body 
       console.log(products);
       productsCollection.insertMany(products)
       .then(result => {
           console.log(result); 
       })
   })

    //  data get
   app.get("/products", (req, res) =>{
       productsCollection.find({})
       .toArray((err, document) =>{
            res.send(document)
       })
   })

    // get single data
   app.get("/product/:key", (req, res) =>{
       productsCollection.find({key: req.params.key})
       .toArray((err, document) =>{
           res.send(document[0])
       })
   })

   // find product in review page by product key
   app.post("/productByKeys", (req, res) =>{
        const productKeys = req.body
        productsCollection.find({key: {$in: productKeys}})
        .toArray((err, documents) => {
            res.send(documents)
        })
   })

    app.post("/addProduct", (req, res) =>{
        const products = req.body 
        console.log(products);
        productsCollection.insertMany(products)
        .then(result => {
            console.log(result); 
        })
    })

    app.post("/addOrder", (req, res) => {
        const order = req.body
        ordersCollection.insertOne(order)
        .then(result => {
            console.log(result)
            res.send(result.insertedId)
        })
    })
});


app.get("/", (req, res) =>{
    res.send("hello ema")
})

app.listen(5000)