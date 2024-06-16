import Comment from "../models/commentModel.js";

export const createComment = async (req,res ,next)=>{
    try {
        const {postId , userId , content} = req.body

        if(userId !== req.user.id){
            return next(errorHandler(403, 'You are not allowed to comment'))
        }
        const newComment = new Comment({
            userId,
            postId,
            content
        })
        await newComment.save()
        res.status(200).json(newComment)
    } catch (error) {
        next(error);
    }
}