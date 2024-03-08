const express = require('express');
const app = express();

const userRoutes = require('./userRoutes');
const houseRoutes = require('./houseRoutes');

app.use('/users', userRoutes);
app.use('/houses', houseRoutes);

module.exports = app;
