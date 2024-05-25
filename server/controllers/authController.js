import User from "../models/UserModel.js";
import bcryptjs from 'bcryptjs'




export const signUp = async(req,res)=>{
    // console.log(req.body);
    const {username , email,password} = req.body;
    if(! username || !email || !password || username ===''|| email ==='' || password === ''){
        return res.status(401).json({message:"All fields are required!"})
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
            console.log(error.message);
            return res.status(500).json({message:"Something went wrong while creating New User!" , error: error.message})
        }
}