const express = require('express');
const {MongoClient} = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectID;
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.budis.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('database connected successfully');
        const database = client.db('tour_bus');
        const servicesCollection = database.collection('services');
        const bookingsCollection = database.collection('bookings');

        // GET Services API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            // console.log(services);
            res.send(services);
        });

        // POST API
        app.post('/booking', async (req, res) => {
            console.log('hitting the post', req.body);
            const newBooking = req.body;
            const result = await bookingsCollection.insertOne(newBooking);
            console.log(result);
            res.send('hit the post');
        });

        // GET Confirmed Booking API
        app.get('/confirmedbooking', async (req, res) => {
            const confirmedBookingCursor = bookingsCollection.find({});
            const allConfirmedBookings = await confirmedBookingCursor.toArray();
            res.send(allConfirmedBookings);
        });

        // DELETE API
        app.delete('/deletebooking/:id', async (req, res) => {
            const id = req.params.id;
            console.log('delete request confirmed for id', id);
            const query = {_id:ObjectId(id)};
            const result = await bookingsCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running tour bus server');
});

app.listen(port, () => {
    console.log('Running server on port', port);
});