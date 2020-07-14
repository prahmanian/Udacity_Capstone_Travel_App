// import required modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
// import required functions
const countdown = require('./countdown');
const fetchGeonamesApi = require('./geonamesAPI');
const restcountriesApi = require('./restcountriesAPI');

// variables: trip details, env variables
const trip = {
    departure: 'from',
    destination: {
        city: 'to',
        country: '',
        country_code: '',
        latitude: '',
        longitude: ''
    },
    countdown: 'no data',
    weather: {
        min: '10',
        max: '30',
        precipitation: 'cloudy'
    },
    flight: {
        minprice: '100',
        carrier: 'horns'
    },
    image: 'some URL'
};

dotenv.config();
// process.env.API_ID

// app set up
const app = express();
app.use(express.static('dist'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
console.log(__dirname);

// designates what port the app will listen to for incoming requests
app.listen(8081, function() {
    console.log('Travel App is listening on port 8081!');
    console.log('Base trip variable:\n', trip);
});

// post request about trip
app.post('/trip', async (req, res) => {
    console.log(req.body);
    // set departure city
    trip.departure = req.body.departure;
    // get countdown number
    trip.countdown = countdown(req.body.date).toString();
    // fetch destination data by GeonamesAPI
    let destinationData = await fetchGeonamesApi(req.body.destination);
    trip.destination.city = destinationData.city;
    trip.destination.country_code = destinationData.country_code;
    trip.destination.latitude = destinationData.latitude;
    trip.destination.longitude = destinationData.longitude;
    // console.log('destination data:\n', destinationData);
    // fetch country using country_code by Rest Countries API
    trip.destination.country = await restcountriesApi(trip.destination.country_code);

    console.log(trip);

    res.send(trip);
});