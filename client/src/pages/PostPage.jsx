import { Button, Spinner } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CommentSection from '../components/CommentSection'
import PostCard from '../components/PostCard'

const PostPage = () => {
    const { postSlug } = useParams()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(true)
    const [post, setPost] = useState(null)
    const [recentPosts, setRecentPosts] = useState(null)

    console.log(post);
    console.log(post?._id);

    useEffect(() => {
        // console.log(postSlug);
        const fetchPost = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/post/display?slug=${postSlug}`)
                const data = await res.json()
                if (!res.ok) {
                    setLoading(false)
                    setError(true)
                    return;
                }
                if (res.ok) {
                    setPost(data.Posts[0])
                    setLoading(false)
                    setError(false)
                }
            } catch (error) {
                setError(true)
                setLoading(false)
            }
        }
        fetchPost()
    }, [postSlug])

    useEffect(() => {
        try {
            const fetchRecentPost = async () => {
                const res = await fetch(`/api/post/display?limit=3`);
                const data = await res.json()
                if (res.ok) {
                    setRecentPosts(data.Posts)
                }
            }
            fetchRecentPost()
        } catch (error) {
            console.log(error.message);
        }
    }, [])
    if (loading) return (
        <div className=' flex justify-center items-center min-h-screen'>
            <Spinner
                size='xl'
            />
        </div>
    )
    console.log(recentPosts);
    return (
        <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
            <h1 className='text-center text-4xl my-7 font-serif lg:text-4xl font-bold max-w-2xl mx-auto p-3 text-primary'>{post && post.title}</h1>
            <Link className='self-center mt-5' to={`/search?category=${post && post.category}`}>
                <Button className='text-xs rounded-full bg-primary text-secondary'>{post && post.category}</Button>
            </Link>
            <img style={{ borderRadius: "20px" }} src={post && post.photo} alt={post && post.title} className='mt-10 p-3 max-h-[full] w-full object-cover' />
            <div className='mx-auto w-full max-w-2xl text-xs flex justify-between items-center p-3 border-b boder-third'>
                <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
                <span className='italic'>{post && (post.content.length / 1000).toFixed(0)} mins read</span>
            </div>
            <div className='p-3 max-w-2xl mx-auto w-full post-content' dangerouslySetInnerHTML={{ __html: post && post.content }}>

            </div>
            <CommentSection postId={post?._id} />

            <div className='flex flex-col justify-center items-center mb-5'>
                <h1 className='text-2xl hover:text-secondary font-bold text-primary mt-5'>Recent articles</h1>
                <div className='flex flex-wrap gap-5 mt-5 justify-center'>
                    {recentPosts &&
                        recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
                </div>
            </div>
        </main>
    )
}

export default PostPage