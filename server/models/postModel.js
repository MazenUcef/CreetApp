import mongoose from "mongoose";




const Schema = mongoose.Schema;



const postSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    photo: {
        type: String,
        default: 'https://www.blogtyrant.com/wp-content/uploads/2017/02/how-to-write-a-good-blog-post.png',
    },
    category: {
        type: String,
        default: "other"
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
}, { timestamps: true })




const Post  = mongoose.model('Post' , postSchema)


export default Post
