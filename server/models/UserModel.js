import mongoose from "mongoose";



const Schema = mongoose.Schema;

const userSchemna = new Schema({
username:{
    type:String,
    required:true,
    unique:true
},
email:{
    type:String,
    required:true,
    unique:true
},
password:{
    type:String,
    required:true
}
},{timestamps:true}
);

const User = mongoose.model('User' , userSchemna);
export default User;