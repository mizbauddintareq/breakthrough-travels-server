const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rvmjj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("offersCollections");
    const offerCollections = database.collection("offer");
    const userOrders = client.db("ordersCollections");
    const orderCollections = userOrders.collection("order");

    //   POST offer
    app.post("/addOffer", async (req, res) => {
      const offer = req.body;
      const result = await offerCollections.insertOne(offer);
      res.json(result);
    });

    // POST order
    app.post("/addOrder", async (req, res) => {
      const order = req.body;
      const result = await orderCollections.insertOne(order);
      res.json(result);
      console.log(order);
      console.log(result);
    });

    // GET all offers
    app.get("/offers", async (req, res) => {
      const cursor = await offerCollections.find({}).toArray();
      res.send(cursor);
    });
    // GET all order
    app.get("/allOrders", async (req, res) => {
      const cursor = await orderCollections.find({}).toArray();
      res.send(cursor);
    });

    // GET my order
    app.get("/myOrder/:email", async (req, res) => {
      const email = req.params.email;
      const result = await orderCollections.find({ email }).toArray();
      res.send(result);
    });

    app.put("/status/:id", async (req, res) => {
      const updateId = req.params.id;
      const updatedStatus = req.body;
      console.log(updatedStatus);
      const filter = { _id: ObjectId(updateId) };

      const updateDoc = {
        $set: {
          status: updatedStatus.status,
        },
      };
      const approveStatus = await orderCollections.updateOne(filter, updateDoc);
      res.json(approveStatus);
    });
    // GET single offer
    app.get("/order/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await offerCollections.findOne(query);
      res.send(result);
    });

    app.delete("/delOrder/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollections.deleteOne(query);
      res.json(result);
      console.log(result);
    });
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
