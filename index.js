const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;



const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.yetxo.mongodb.net:27017,cluster0-shard-00-01.yetxo.mongodb.net:27017,cluster0-shard-00-02.yetxo.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-8altey-shard-0&authSource=admin&retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json());
app.use(cors());

MongoClient.connect(uri, {useUnifiedTopology: true}, function(err, client)  {
  const products = client.db("emaJohnStore").collection("products");
  const orders = client.db("emaJohnStore").collection("orders");
  
  app.post('/addProduct', (req, res) => {
    const product = req.body;
    products.insertOne(product)
    .then(result => {
        res.send(result.insertedCount)
    })
  })

  app.get('/product', (req, res) => {
      products.find()
      .toArray((err, documents) => {
          res.send(documents)
      })
  })

  app.get('/product/:key', (req, res) => {
    products.find({key: req.params.key})
    .toArray((err, documents) => {
        res.send(documents[0])
    })
  })

  app.post('/productsReview', (req, res) => {
    const productsKey = req.body;
    products.find({key:  {$in:productsKey}})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  app.post('/getOrder', (req, res) => {
    const orderInfo = req.body;
    orders.insertOne(orderInfo)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
  })

});


app.get('/', (req, res) => {
    res.send('Yes I am working!')
})

app.listen(process.env.PORT || 5000);