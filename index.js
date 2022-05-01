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
        app.get('/fruits', async (req, res) => {
            const query = {}
            const cursor = collections.find(query)
            const fruits = await cursor.toArray()
            res.send(fruits)
     
        })
       
    }
   
    finally {
        
    }
}
run()

app.get('/home', (req, res) => {
    res.send('Server is running')
})


app.listen(port, () => {
    console.log('Listening port ', port)
})

