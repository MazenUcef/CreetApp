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
},
photoURL:{
    type:String,
    default:'https://filestore.community.support.microsoft.com/api/images/0ce956b2-9787-4756-a580-299568810730?upload=true'
}
},{timestamps:true}
);

const User = mongoose.model('User' , userSchemna);
export default User;