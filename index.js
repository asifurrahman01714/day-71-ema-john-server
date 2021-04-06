const express = require('express');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
console.log(process.env.DB_USER, process.env.DB_PASS, process.env.DB_NAME);

const port = 5000;

const app = express();

//set up middle ware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0oc6t.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db(`${process.env.DB_NAME}`).collection("products");
  const ordersCollection = client.db(`${process.env.DB_NAME}`).collection("orders");
  console.log('databasae connected successfully');

  //post or send data to databasae
  app.post('/addProduct', (req, res) => {
      const products = req.body;
    //   console.log(products);
    productsCollection.insertOne(products)
      .then(result =>{
          console.log(result);
          console.log(result.insertedCount);
          res.send(result.insertedCount);
      })
  });


  // Read data from database.r noi fakedata er upor nirvhorota..akhn amra real data use korbo database theke
  app.get('/products', (req, res)=>{
      productsCollection.find({})
      .toArray((err,documents) =>{
          res.send(documents);
      })
  });


  app.get('/product/:key', (req, res)=>{
    productsCollection.find({key: req.params.key})
    .toArray((err,documents) =>{
        res.send(documents[0]);
    })
});


app.post('/productsByKeys', (req, res)=>{
    const productKeys = req.body;
    productsCollection.find({key: {$in: productKeys}})
    .toArray((err,documents)=>{
        res.send(documents);
    })
});

her
 //post or send data to databasae
 app.post('/addOrder', (req, res) => {
    const order = req.body;
  //   console.log(products);
  ordersCollection.insertOne(order)
    .then(result =>{
        console.log(result);
        console.log(result.insertedCount);
        res.send(result.insertedCount > 0);
    })
});




});



app.get('/', (req, res) => {
  res.send('Hello ema watson!!')
})

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})