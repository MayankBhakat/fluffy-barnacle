import dotenv from 'dotenv';
import express, { Express, Request, Response,NextFunction } from 'express';
import apiRoutes from './routes/apiRoutes';
import connectDB from './config/db';
import cookieParser from "cookie-parser";
import bodyParser from 'body-parser'; // Import body-parser

import cors from 'cors';


const port = 5050;
const app: Express = express();

//This middleware is very imp as it parses incoming requests with JSON payloads.
//Without this we get 
//TypeError: Cannot destructure property 'name' of 'req.body' as it is undefined.
app.use(express.json({ limit: '50mb' }));
app.use(cors());
app.use(express.static('public'));

//Express doesnot handle cookies so we use cokkieparser to handle cookies
app.use(cookieParser());

//The dotenv package is to use the environmental variables
dotenv.config();
connectDB();
app.use(bodyParser.urlencoded({  extended: false }));
app.use(bodyParser.json());

//It connects to apiRoutes
app.use('/api', apiRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('poke45');
});


// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});


app.listen(port, () => {
  console.log(`now listening on port ${port}`);
});
