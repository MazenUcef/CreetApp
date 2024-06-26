import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoute.js'
import authRoutes from './routes/authRoute.js'
import postRoutes from './routes/post.routes.js'
import commentRoutes from './routes/commentRoutes.js'
import cookieParser from 'cookie-parser';
import path from 'path'


dotenv.config();

const __dirname = path.resolve()

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser())


mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO)
    .then(() => console.log('Database Connected Successfully'))
    .catch(err => console.log('Error happened while connecting to database', err.message))

app.listen(5000, () => {
    console.log('server is running on port 5000');
})



app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/post', postRoutes)
app.use('/api/comment', commentRoutes)


app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})