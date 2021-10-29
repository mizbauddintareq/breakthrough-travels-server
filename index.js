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

    // GET offers
    app.get("/offers", async (req, res) => {
      const cursor = await offerCollections.find({}).toArray();
      res.send(cursor);
    });

    // GET single offer
    app.get("/order/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await offerCollections.findOne(query);
      res.send(result);
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
