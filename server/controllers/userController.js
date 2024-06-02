import User from "../models/UserModel.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs'

export const test = async (req, res) => {
    res.json({ message: "test1" })
}


export const updateUser = async (req, res, next) => {
    // console.log(req.user);
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, "You are not allowed to update this user"));
    }
    if (req.body.password) {
        if (req.body.password.length < 6) {
            return next(errorHandler(400, "Password must be at least 6 characters"));
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    if (req.body.username) {
        if (req.body.username.length < 7 || req.body.username.length > 20) {
            return next(errorHandler(400, "Username must be at least 7 between 20  characters"));
        }
        if (req.body.username.includes(' ')) {
            return next(errorHandler(400, "Username must not contain spaces"));
        }
        if (req.body.username !== req.body.username.toLowerCase()) {
            return next(errorHandler(400, "Username must be lowercase"));
        }
        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
            return next(errorHandler(400, "Username must only contain letters and numbers"));
        }
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId , {
            $set:{
                username:req.body.username,
                email:req.body.email,
                password:req.body.password,
                photoURL:req.body.photoURL
            }
        },{new:true}
    );
    
    res.status(200).json(updatedUser)
    } catch (error) {
        next(error)
    }
}