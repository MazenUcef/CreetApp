import { Button, Spinner } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

const PostPage = () => {
    const { postSlug } = useParams()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(true)
    const [post, setPost] = useState(null)

    console.log(post);

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
    if (loading) return (
        <div className=' flex justify-center items-center min-h-screen'>
            <Spinner
                size='xl'
            />
        </div>
    )
    return (
        <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
            <h1 className='text-center text-4xl my-7 font-serif lg:text-4xl font-bold max-w-2xl mx-auto p-3 text-primary'>{post && post.title}</h1>
            <Link className='self-center mt-5' to={`/search?category=${post && post.category}`}>
                <Button className='text-xs bg-primary text-secondary'>{post && post.category}</Button>
            </Link>
            <img style={{borderRadius:"20px"}} src={post && post.photo} alt={post && post.title} className='mt-10 p-3 max-h-[full] w-full object-cover' />
            <div className='mx-auto w-full max-w-2xl text-xs flex justify-between items-center p-3 border-b boder-third'>
                <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
                <span className='italic'>{post && (post.content.length /1000).toFixed(0)} mins read</span>
            </div>
            <div className='p-3 max-w-2xl mx-auto w-full post-content' dangerouslySetInnerHTML={{__html:post && post.content}}>

            </div>
        </main>
    )
}

export default PostPage