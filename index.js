const express = require('express')
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId

const cors = require('cors')
const bodyParser = require('body-parser')


const app = express()
app.use(bodyParser.json())
app.use(cors())
const port = 5000


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.db_User}:${process.env.db_pass}@cluster0.nngak.mongodb.net/${process.env.db_name}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
client.connect(err => {
  const collection = client.db("volunterdb").collection("event");
  console.log("database connection")




  app.post("/addUserEvent", (req, res) => {
    const newEvent = req.body;
    console.log(newEvent)
    collection.insertOne(newEvent)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
    console.log(newEvent)
  })




  // read from database connection
  app.get("/registerdEvent", (req, res) => {
    collection.find({email: req.query.email})
    .toArray((err, documents) =>{
      res.send(documents)
    })
  })

  // delete api 
  app.delete('/delete/:id', (req, res) =>{
    console.log("paras id",req.params.id)
    collection.deleteOne({ _id: ObjectId(req.params.id) })
    .then(result =>{
      console.log("deleted ", result)
    })
  })



   app.get("/loadEvents", (req, res) => {
     collection.find({})
     .toArray((err, documents) =>{
       res.send(documents)
     })
   })









  // for posting all data from fakedata to mongo database  
  app.post("/addEvent", (req, res) => {
    const event = req.body;
    console.log(event)
    collection.insertMany(event)
    .then(result =>{
      console.log(result  )
      res.send(result.insertedCount)
      console.log(result.insertedCount)
    })
  })
  
});


console.log(process.env.db_user)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen( process.env.PORT || port)