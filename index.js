const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const jwt = require('jsonwebtoken');


// middle ware
app.use(cors())
app.use(express.json())

function verifyJWT(req,res,next) {
    const authHeader = req.headers.authorization
   
    if (!authHeader) {
        return res.status(401).send({message:'Forbidden Access'})
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(403).send({message:'Forbidden Access'})
        }
        req.decoded = decoded
        next()
    })
  
}



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
        // update item
        app.put('/fruit/:id', async (req,res)=>{
            const id = req.params.id
            const updateQuantity = req.body
            const  filter = {_id:ObjectId(id)}
            const options = {upsert:true}
            const updateDoc = {
                $set: {
                    quantity:updateQuantity.quantity
                }
            }
            const result = await collections.updateOne(filter, updateDoc, options)
            res.send(result)
        })
        // specific items api for specific users
        app.get('/orderItems', verifyJWT, async (req, res) => {
            const decodedEmail = req.decoded.email
            const email = req.query.email
            if (email === decodedEmail) {
                const query = {email:email}
                const cursor = collections.find(query)
                const orders = await cursor.toArray()
                res.send(orders)
            }
            else {
                return res.status(403).send({message:'Forbidden Access'})
            }
        })

        // auth 

        app.post('/login',async (req, res) => {
            const email = req.body
            const token =  jwt.sign(email, process.env.ACCESS_TOKEN, {
                expiresIn:'1d'
            })
            res.send({token})
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

