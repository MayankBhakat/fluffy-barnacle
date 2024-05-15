const express = require('express');
const app = express();

const userRoutes = require('./userRoutes');
const houseRoutes = require('./houseRoutes');
const paymentRoutes = require('./paymentRoutes');

app.use('/users', userRoutes);
app.use('/houses', houseRoutes);
app.use('/payments', paymentRoutes);

module.exports = app;
