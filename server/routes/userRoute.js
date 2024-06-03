import express from 'express';
import { deleteUser, signOut, test, updateUser } from '../controllers/userController.js';
import { verifyToken } from '../utils/verifyUserToken.js';




const router = express.Router();



router.get('/test'  , test)
router.put('/update/:userId' ,verifyToken , updateUser)
router.delete('/delete/:userId' ,verifyToken , deleteUser)
router.post('/signout' , signOut)


 
export default router;