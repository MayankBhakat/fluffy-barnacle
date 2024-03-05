import express from 'express';
const app = express();

import userRoutes from './userRoutes';
import houseRoutes from './houseRoutes';

app.use('/users', userRoutes);
app.use('/houses', houseRoutes);

export default app;
