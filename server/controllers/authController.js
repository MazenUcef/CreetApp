import User from "../models/UserModel.js";
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';




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
export const signIn = async(req , res , next)=>{
    const {email , password} = req.body;

    if(!email || !password || email === '' || password === ''){
        next(errorHandler(400 , "All fields are required"))
    }


    try {
    const validUser = await User.findOne({email});
    if(!validUser){
        return next(errorHandler(404 , 'User not found'))
    }    
    const validPassword = bcryptjs.compareSync(password,validUser.password);
    if(!validPassword){
        return next(errorHandler(401 , 'Invalid Password'))
    }

    const token = jwt.sign({id:validUser._id} , process.env.SECRET_KEY);
    const {password:pass , ...rest} = validUser._doc;
    return res.status(200).cookie("access_token" , token , {httpOnly: true}).json(rest)
    } catch (error) {
        next(error)
    }
}