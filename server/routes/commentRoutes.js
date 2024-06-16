import express from "express";
import { verifyToken } from '../utils/verifyUserToken.js';
import { createComment, getPostComments } from "../controllers/commentController.js";


const router = express.Router();



router.post('/create' , verifyToken , createComment)
router.get('/displayPostComment/:postId' , getPostComments)




export default router