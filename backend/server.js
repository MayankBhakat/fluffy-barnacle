const dotenv = require('dotenv');
const express = require('express');
const apiRoutes = require('./routes/apiRoutes');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const {Server} = require("socket.io");
const {createServer} = require("http");

const port = 5050;
const app = express();


const httpServer = createServer(app);
global.io = new Server(httpServer);

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
// app.listen(port, () => {
//   console.log(`now listening on port ${port}`);
// });

httpServer.listen(port,()=>console.log(`Server running on port ${port}`))


// io.on("connection", (socket) => {
//   socket.on("admin connected with server", (adminName) => {
//     admins.push({ id: socket.id, admin: adminName });
//     console.log(admins);
//   });
//   socket.on("client sends message", (msg) => {
//     if (admins.length === 0) {
//       socket.emit("no admin", "");
//     } else {
//       socket.broadcast.emit("server sends message from client to admin", {
//         message: msg,
//       });
//     }
//   });

//   socket.on("admin sends message", ({ message }) => {
//     socket.broadcast.emit("server sends message from admin to client", message);
//   });

//   socket.on("disconnect", (reason) => {
//     // admin disconnected
//     const removeIndex = admins.findIndex((item) => item.id === socket.id);
//     if (removeIndex !== -1) {
//       admins.splice(removeIndex, 1);
//     }
//   });
// });

io.on("connection", (socket) => {
  console.log("A client connected");

  
  socket.on("client sends message", (msg) => {
  
    socket.broadcast.emit("server sends message from client to admin", {
      message: msg, 
   })
   
  
  });

  socket.on("admin sends message", (msg) => {
  
    socket.broadcast.emit("server sends message from admin to client",{
      message:msg,
    });
})

  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});

