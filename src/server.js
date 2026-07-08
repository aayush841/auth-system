import "./config/env.js";
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectDB from './config/db.js';

import authRoutes from './routes/auth.routes.js'
import adminRoutes from './routes/admin.routes.js'
import productRoutes from './routes/product.routes.js'


//dotenv.config();
connectDB();

import "./config/passport.js";

const app = express();


app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true 
}));

app.use(express.json()); 
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/product',productRoutes);


app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running in production-ready environment on port ${PORT}`);
});