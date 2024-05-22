import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';


dotenv.config();





const app = express();
app.use(cors());
app.use(express.json());


mongoose.set('strictQuery' , false);
mongoose.connect(process.env.MONGO)
.then(()=>console.log('Database Connected Successfully'))
.catch(err=> console.log('Error happened while connecting to database' , err.message))

app.listen(5000,()=>{
    console.log('server is running on port 5000');
})