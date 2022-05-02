const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.jauhp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect()
        const collections = client.db('fruitsBuddy').collection('fruits');
        // get all items api
        app.get('/fruits', async (req, res) => {
            const query = {}
            const cursor = collections.find(query)
            const fruits = await cursor.toArray()
            res.send(fruits)
     
        })
        // Single item info api
        app.get('/fruits/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const fruit = await collections.findOne(query)
            res.send(fruit)
        })

        // create new item api
        app.post('/fruits', async (req, res) => {
            const data = req.body
            const result =await collections.insertOne(data)
            res.send(result)
        })
        // delete a item 
        app.delete('/fruit/:id', async (req, res) => {
            const id = req.params.id
            const query = {_id:ObjectId(id)}
            const result = await collections.deleteOne(query)
            res.send(result)
        })
    }
   
    finally {
        
    }
}
run()

app.get('/', (req, res) => {
    res.send('Server is running')
})


app.listen(port, () => {
    console.log('Listening port ', port)
})

