const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// middleware

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jod42.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const reviewCollection = client.db('reviewDB').collection('review');
    const watchlistCollection = client.db('watchlistDB').collection('watchlist');

    app.get('/reviews', async(req, res)=> {
        const cursor = reviewCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })

    app.get('/reviews/:id', async(req,res)=> {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await reviewCollection.findOne(query);
      res.send(result);
    })


    // my review
    app.get('/myReviews', async(req,res)=>{
      const email = req.query.email;
      const query = {email: email};
      const result = await reviewCollection.find(query).toArray();
      res.send(result);
    })

    // app.post('/gamewatchlist', async(req,res)=> {
    //   const email = req.body;
    //   const query = {email:email}
    //   const result = await reviewCollection.find(query);
    //   res.send(result)
    //   // console.log(result)
    // })

    app.post('/gamewatchlist', async(req,res) => {
      const data = req.body;
      const result = await reviewCollection.insertOne(data)
      res.send(result)
    })

      

    app.post('/reviews', async(req,res)=> {
        const newReview = req.body;
        const result = await reviewCollection.insertOne(newReview);
        res.send(result)
    })




   

    app.delete('/myReviews/:id', async(req,res)=> {
      const id =  req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await reviewCollection.deleteOne(query);
      res.send(result);
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req,res)=> {
    res.send('Game reviewing server is running')
});


app.listen(port, () => {
    console.log(`Game review server is running on port:${port}` )
})