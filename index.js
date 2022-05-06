const express = require('express');
const app = express();
const port = process.env.PORT || 7100;
const cors = require('cors');
require('dotenv').config();

// for mongodb
const { MongoClient,ObjectId, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://hrmeheraj:hrmeheraj2007@cluster0.cv5my.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
	useNewUrlParser: true, 
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1
});

// Comment Added 
async function run() {
  try {
    await client.connect();
    const eCommerceDb = client.db("e-commerce")
    const products = eCommerceDb.collection("products");
		const orders = eCommerceDb.collection("orders");
		app.get('/products', async (req,res) => {
			const query = {};
			const page = parseInt(req.query.page);
			const size = parseInt(req.query.size);
			const result = await 
            products.find(query).skip(size * page).limit(size).toArray();
			res.send(result);
		});

		app.get('/productsCount', async(req,res) => {
			const count =await products.estimatedDocumentCount();
			res.send({count});
		})
		// Delete a product from UI 
		app.delete('/products/:id', async (req,res) => {
			const id = req.params.id;
			const result = await products.deleteOne({ _id : new ObjectId(id)});
			res.send({message : "Deleted one"});
		})

		// Post and insert one product 
		app.post('/products', async (req,res) => {
			const product = req.body;
			const result = await products.insertOne(product);
			res.send(result); 
		});
		console.log('db connected');

		// Order data insert new collection
		app.get('/orders', async (req,res) => {
			const query = req.query;
			console.log(query);
			
			const response = await orders.find(query).toArray();
			console.log(response);
			res.send(response);
		});

		app.post('/orders', async(req,res) => {
			// {email : "hr@h.com", name : "I phone", price : 2000}
			const body = req.body;
			console.log(body);
			const response = await orders.insertOne(body);
			res.send(response);
		});
			// for pagination 
			// Secure with Json web Token => 
		  app.get('/login', (req,res) => {
				
			});

		
  } finally {
   // await client.close();
  }
}
run().catch(console.dir);

// basic middleware 
app.use(cors());
app.use(express.json());



app.get('/', (req, res) => {
  res.send(`
		 <h2> Welcome to API </h2>
		 <a href='products'>Products </a>

       `);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})