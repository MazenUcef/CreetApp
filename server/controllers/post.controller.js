import Post from "../models/postModel.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You do not have permission to create a post'))
    }
    if (!req.body.title || !req.body.content) {
        return next(errorHandler(400, 'All fields are required'))
    }

    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '-')
    
    // Log the request body to ensure it contains the correct data
    // console.log('Received request body:', req.body);

    const newPost = new Post({
        photo: req.body.photo,
        ...req.body,
        slug,
        userId: req.user.id
    })
    try {
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)
    } catch (error) {
        next(error.message)
    }
}




export const displayPosts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === "asc" ? 1 : -1;
        const Posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { userId: req.query.category }),
            ...(req.query.slug && { userId: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: 'i' } },
                    { content: { $regex: req.query.searchTerm, $options: 'i' } },
                ],
            })

        }).sort({ updateAt: sortDirection }).skip(startIndex).limit(limit);

        const countPosts = await Post.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate(),
        )

        const lastMonthPosts = await Post.countDocuments({
            createdAt: {$gte:oneMonthAgo}
        })
        res.status(200).json({
            Posts,
            countPosts,
            lastMonthPosts
        })

    } catch (error) {
        next(error)
    }
} 





export const deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return next(errorHandler(404, 'Post not found'));
        }

        // Check if the user is the author of the post or an admin
        if (!req.user.isAdmin && req.user.id !== post.userId.toString()) {
            return next(errorHandler(403, 'You are not allowed to delete this post'));
        }

        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        next(error);
    }
};
