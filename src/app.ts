import express from 'express';
import bodyParser from 'body-parser';

import { connectToDatabase } from './config/db';
const app = express();

// middleware
app.use(bodyParser.json());

connectToDatabase();

// server
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server running at port ${PORT}`);
});
