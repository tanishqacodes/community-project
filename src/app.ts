import express from 'express';
import bodyParser from 'body-parser';

import { connectToDatabase } from './config/db';

import authRoutes from './routes/Auth.Routes';
const app = express();

// swagger
const swaggerUi=require('swagger-ui-express');
const swaggerDocument=require('../swagger_output.json');

// middleware
app.use(bodyParser.json());

connectToDatabase();

// router
app.use('/v1/auth', authRoutes);


app.use('/swagger',swaggerUi.serve,swaggerUi.setup(swaggerDocument));

// server
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server running at port ${PORT}`);
});
