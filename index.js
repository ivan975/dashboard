const express = require('express');
require('colors')
const cors = require('cors');
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

// mongodb connection
const uri = `mongodb+srv://crudTester:FZPHdzBwRh3dqdmw@cluster0.2f4txuh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

async function dbConnect() {
    try {
        await client.connect();
        console.log('database connected'.yellow.italic);

        const productCollection = client.db('session').collection('products');

        // endpoint
        app.post('/product', async (req, res) => {
            try {
                const result = await productCollection.insertOne(req.body);
                if (result.insertedId) {
                    res.send({
                        success: true,
                        message: `successfully added ${req.body.name} with id ${result.insertedId}`
                    })
                }
                else {
                    res.send({
                        success: false,
                        error: 'Could not add the product'
                    })
                }
            }
            catch (error) {
                console.log(error.name.bgRed, error.message.bold);
                res.send({
                    success: false,
                    error: error.message
                })
            }
        })

        app.get('/product', async (req, res) => {
            try {
                const cursor = await productCollection.find({}).toArray();
                res.send({
                    success: true,
                    data: cursor
                })
            }
            catch (err) {
                console.log(err.name.bgRed, err.message.bold);
                res.send({
                    success: false,
                    message: error.message
                })
            }
        })
    }
    catch (error) {
        console.log(error.name.bgRed, error.message.bold);
        res.send({
            success: false,
            error: error.message
        })
    }
}
dbConnect()

app.get('/', (req, res) => {
    res.send('cs crud mongodb running')
})

app.listen(port, (req, res) => {
    console.log(`server running on ${port}`.cyan.bold);
})

