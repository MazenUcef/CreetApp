import User from "../models/UserModel.js";
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js";




export const signUp = async(req,res , next)=>{
    // console.log(req.body);
    const {username , email,password} = req.body;
    if(! username || !email || !password || username ===''|| email ==='' || password === ''){
        // return res.status(400).json({message:"All fields are required!"})
        next(errorHandler(400 , 'All fields are required'));
    }
    let newUser;
    const hashedPassword = bcryptjs.hashSync(password , 10)
        try {
            newUser = new User({
                username,
                email,
                password:hashedPassword
            })
            await newUser.save();
            return res.status(200).json({message:"User is Created successfully"})
        } catch (error) {
            // console.log(error.message);
            next(error)
            // return res.status(500).json({message:"Something went wrong while creating New User!" , error: error.message})
        }
}