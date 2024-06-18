import React from 'react'
import { Link } from 'react-router-dom'

const PostCard = ({ post }) => {
    return (
        <div className='group relative w-full border h-[400px] overflow-hidden rounded-lg sm:w-[430px]'>
            <Link to={`/post/${post.slug}`}>
                <img src={post.photo} alt='post cover' className='h-[260px] transition-all duration-300 z-20 w-full object-cover group-hover:h-[200px]' />
            </Link>
            <div className='p-3 flex flex-col gap-2'>
                <p className='text-lg font-semibold text-primary'>{post.title}</p>
                <span className='italic text-sm text-secondary'>{post.category}</span>
                <Link to={`/post/${post.slug}`} className='z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-third text-primary font-bold bg-secondary text-center py-2 rounded-md'>
                    Read more
                </Link>
            </div>
        </div>
    )
}

export default PostCard