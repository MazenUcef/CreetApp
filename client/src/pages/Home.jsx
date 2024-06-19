import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard'

const Home = () => {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/post/display')
      const data = await res.json()
      setPosts(data.Posts)
    }
    fetchPosts()
  }, [])
  return (
    <div>
      <div className='flex flex-col gap-6 px-3 max-w-6xl mx-auto p-28 '>
        <h1 className='text-4xl md:text-7xl lg:text-7xl font-bold text-primary'>Welcome To _Creet <span className='text-base text-secondary font-bold'>For Blogs</span></h1>
        <p className='text-third text-xs sm:text-sm'> Here You Will find a lot of news About Mazen and his life regarding his Tech Journey Stay Tuned!!!...</p>
        <Link to='/search' className='text-xs sm:text-sm text-primary font-bold hover:underline'>
          View all posts
        </Link>
      </div>
      <div className='max-w-6xl mx-auto flex flex-col p-3 gap-8 py-7'>
        {
          posts && posts.length > 0 && (
            <div className='flex flex-col gap-6'>
              <h2 className='text-2xl font-semibold text-center text-primary'>Recent Posts</h2>
              <div className='flex flex-wrap justify-center gap-4'>
                {
                  posts.map((post)=>(
                    <PostCard key={post._id} post={post}/>
                  ))
                }
              </div>
              <Link to={'/search'} className='text-lg hover:underline text-primary text-center'>
              View all posts
              </Link>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Home