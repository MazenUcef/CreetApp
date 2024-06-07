import express from 'express';
import { verifyToken } from '../utils/verifyUserToken.js';
import { create, deletePost, displayPosts } from '../controllers/post.controller.js';


const router = express.Router()



router.post('/create' , verifyToken , create)
router.get('/display' , displayPosts)
router.delete('/delete/:postId', verifyToken, deletePost);


export default router