const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config()


const app = express();
const port = process.env.PORT || 5000;

// middleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tczvb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("deliveryService");
        const serviceCollection = database.collection("foodInfo");
        const usersCollection = database.collection('users');
        const ordersCollection = database.collection('orders');

        // Adding Service to Database 
        app.post('/addService', async (req, res) => {
            const result = await serviceCollection.insertOne(req.body);
            res.send(result);
        })

        // Getting all the Services from Database 
        app.get('/services', async (req, res) => {
            const result = await serviceCollection.find({}).toArray();
            res.send(result);
        })

         // Getting all Orders 
         app.get('/allOrders', async (req, res) => {
            const result = await ordersCollection.find({}).toArray();
            res.send(result);
        })
        
        // Getting single Product from Database 
        app.get('/purchase/:id', async (req, res) => {
            const result = await serviceCollection.find({ _id: ObjectId(req.params.id) }).toArray();
            res.send(result[0]);
        })

        //Sending Checkout/Confirm Order data to database
        app.post('/checkout/', async (req, res) => {
            const result = await ordersCollection.insertOne(req.body);
            res.send(result);
        })

        // Getting orders from database
        app.get('/orders/:email', async (req, res) => {
            const result = await ordersCollection.find({ email: req.params.email }).toArray();
            res.send(result);
        })


        // Delete Orders
        app.delete("/deleteOrder/:id", async (req, res) => {
            const result = await ordersCollection.deleteOne({ _id: ObjectId(req.params.id) });
            res.send(result);
        })

        // Delete Products
        app.delete("/deleteProduct/:id", async (req, res) => {
            const result = await productsCollection.deleteOne({ _id: ObjectId(req.params.id) });
            res.send(result);
        })

        // Updating Status
        app.put('/updateStatus/:id', (req, res) => {
            const id = req.params.id;
            const updatedStatus = req.body.status;
            const filter = { _id: ObjectId(id) }
            ordersCollection.updateOne(filter, {
                $set: { status: updatedStatus },
            })
                .then(result => {
                    res.send(result);
                })
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('running the genius server');
})

app.listen(port, () => {
    console.log('running genius server on port', port);
});
