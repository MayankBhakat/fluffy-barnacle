const dotenv = require('dotenv');
const express = require('express');
const apiRoutes = require('./routes/apiRoutes');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

const port = 5050;
const app = express();

// Middleware to parse JSON payloads
app.use(express.json());

// Middleware for enabling CORS
app.use(cors());

// Middleware to serve static files from the 'public' directory
app.use(express.static('public'));

// Middleware to parse cookies
app.use(cookieParser());

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

// Middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true}));

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Route handler for API routes
app.use('/api', apiRoutes);

// Route handler for the root URL
app.get('/', (req, res) => {
  res.send('poke45');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

// Start the server
app.listen(port, () => {
  console.log(`now listening on port ${port}`);
});
