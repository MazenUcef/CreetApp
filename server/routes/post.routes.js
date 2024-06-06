import express from 'express';
import { verifyToken } from '../utils/verifyUserToken.js';
import { create, displayPosts } from '../controllers/post.controller.js';


const router = express.Router()



router.post('/create' , verifyToken , create)
router.get('/display' , displayPosts)


export default router