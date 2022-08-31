const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors');
const app = express()
const port = process.env.PORT || 4000
require('dotenv').config()

// Middletare
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.7cbwvw4.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function run() {
  try {
    client.connect()
    const inventoryCollection = client.db("Inventory").collection("inventories");
    const blogsCollection = client.db("Inventory").collection("Blogs");

    // Load  Inventory
    app.get("/inventorys", async (req, res) => {
      const query = {};
      const cursor = inventoryCollection.find(query);
      const result = await cursor.toArray()
      res.send(result);
    })

    // Spacipice Id Load Inventory

    app.get("/inventory/:id", async (req, res) => {
      const requset = req.params.id;
      const quary = { _id: ObjectId(requset) }
      const result = await inventoryCollection.findOne(quary);
      res.send(result)
    })

    // Update Delevary incresse and decrease Data

    app.put("/inventory/:id", async (req, res) => {
      const reqRecive = req.body;
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          quantity: reqRecive?.quantity,
        },
      };
      const result = await inventoryCollection.updateOne(query, updateDoc, options);
      res.send(result)
    })


    // Add Items

    app.post("/inventorys", async (req, res) => {
      const recive = req.body;
      const result = await inventoryCollection.insertOne(recive);
      res.send(result)
    })

    // Peruser aded data
    app.get("/inventory", async (req, res) => {
      const email = req.query.email;
      const filter = { email: email }
      const cursor = inventoryCollection.find(filter);
      const result = await cursor.toArray()
      res.send(result);
    })

    // Get Blogs Data
    app.get("/blogs", async (req, res) => {
      const query = {};
      const cursor = blogsCollection.find(query);
      const result = await cursor.toArray()
      res.send(result);
    })

    // Get Blogs Details Data
    app.get("/blog/:id", async (req, res) => {
      const requset = req.params.id;
      const quary = { _id: ObjectId(requset) }
      const result = await blogsCollection.findOne(quary);
      res.send(result)
    })


    // Delete Data
    app.delete("/inventory/:id", async (req, res) => {
      const deleteReq = req.params.id;
      const query = { _id: ObjectId(deleteReq) }
      const result = await inventoryCollection.deleteOne(query);
      res.send(result)
    })


  }
  catch {

  }

}

run()

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})