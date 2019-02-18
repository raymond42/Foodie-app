// mongodb+srv://ray:<PASSWORD>@cluster0-vyafr.mongodb.net/test?retryWrites=true
//password: emFS1X1reDH6WLZb

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user');
const foodRoutes = require('./routes/food');
const path = require('path');

const app = express();

mongoose.connect('mongodb+srv://ray:emFS1X1reDH6WLZb@cluster0-vyafr.mongodb.net/test?retryWrites=true',{ useNewUrlParser: true }, function(error){console.log(error)})
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });

app.use(cors());
app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', foodRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;