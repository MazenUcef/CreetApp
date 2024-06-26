import express from "express";
import { verifyToken } from '../utils/verifyUserToken.js';
import { createComment, deleteComment, editComment, getComments, getPostComments, likeComment } from "../controllers/commentController.js";


const router = express.Router();



router.post('/create' , verifyToken , createComment)
router.get('/displayPostComment/:postId' , getPostComments)
router.put('/likeComment/:commentId' ,verifyToken, likeComment)
router.put('/editComment/:commentId' ,verifyToken, editComment)
router.delete('/deleteComment/:commentId' ,verifyToken, deleteComment)
router.get('/getComments', verifyToken ,getComments)




export default router