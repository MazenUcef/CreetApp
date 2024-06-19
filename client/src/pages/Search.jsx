import { TextInput, Select, Button } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PostCard from '../components/PostCard'

const Search = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [sidebarData, setSideBarData] = useState({
        searchTerm: '',
        sort: 'desc',
        category: 'other'
    })
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const [showMore, setShowMore] = useState(false)

    console.log(sidebarData);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')
        const sortFromUrl = urlParams.get('sort')
        const categoryFromUrl = urlParams.get('category')
        if (searchTermFromUrl) {
            setSideBarData({
                ...sidebarData,
                searchTerm: searchTermFromUrl,
                sort: sortFromUrl,
                category: categoryFromUrl,
            })
        }
        console.log(sidebarData);



        const fetchPosts = async () => {
            setLoading(true);
            try {
                const searchQuery = urlParams.toString()
                const res = await fetch(`/api/post/display?${searchQuery}`)
                if (!res.ok) {
                    setLoading(false);
                    return;
                }
                if (res.ok) {
                    const data = await res.json();
                    setPosts(data.Posts);
                    setLoading(false);
                    if (data.Posts.length === 9) {
                        setShowMore(true);
                    } else {
                        setShowMore(false);
                    }
                }
            } catch (error) {

            }
        }
        fetchPosts()
    }, [location.search])


    const handleChange = (e) => {
        if (e.target.id === 'searchTerm') {
            setSideBarData({
                ...sidebarData,
                searchTerm: e.target.value
            })
        }
        if (e.target.id === 'sort') {
            const order = e.target.value || 'desc'
            setSideBarData({
                ...sidebarData,
                sort: order
            })
        }
        if (e.target.id === 'category') {
            const category = e.target.value || 'other'
            setSideBarData({
                ...sidebarData,
                category: category
            })
        }
    }



    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search)
        urlParams.set('searchTerm', sidebarData.searchTerm)
        urlParams.set('sort', sidebarData.sort)
        urlParams.set('category', sidebarData.category)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }



    const handleShowMore = async () => {
        const numberOfPosts = posts.length;
        const startIndex = numberOfPosts;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/post/display?${searchQuery}`)
        if (!res.ok) {
            return
        }
        if (res.ok) {
            const data = await res.json();
            setPosts((prev) => [...prev, ...data.Posts]);
            if (data.Posts.length === 9) {
                setShowMore(true);
            } else {
                setShowMore(false);
            }
        }
    }
    return (
        <div className='flex flex-col md:flex-row'>
            <div className='p-7 border-b md:border-r md:min-h-screen border-third'>
                <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
                    <div className='flex items-center gap-2'>
                        <label className='font-semibold whitespace-nowrap'>Search Term</label>
                        <TextInput
                            placeholder='search...'
                            id='searchTerm'
                            type='text'
                            value={sidebarData.searchTerm}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className='font-semibold'>Sort:</label>
                        <Select
                            onChange={handleChange}
                            value={sidebarData.sort}
                            id='sort'
                        >
                            <option value='desc'>Latest</option>
                            <option value='asc'>Oldest</option>
                        </Select>
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className='font-semibold'>Category:</label>
                        <Select
                            onChange={handleChange}
                            value={sidebarData.category}
                            id='category'
                        >
                            <option value='Other'>Other</option>
                            <option value='Social'>Social</option>
                            <option value='Technology'>Technology</option>
                            <option value='Psychologically'>Psychologically</option>
                        </Select>
                    </div>
                    <Button className='bg-primary text-secondary' type='submit'>
                        Filter
                    </Button>
                </form>
            </div>
            <div className='w-full'>
                <h1 className='text-3xl font-semibold sm:border-b border-third p-3 mt-5'>
                    Posts results:
                </h1>
                <div className='p-7 flex flex-wrap gap-4'>
                    {
                        !loading && posts.length === 0 && <p className='text-xl text-third'>No posts found.</p>
                    }
                    {
                        loading && <p className='text-xl text-third'>Loading...</p>
                    }
                    {
                        !loading && posts && posts.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))
                    }
                </div>
                {
                    showMore && <button onClick={handleShowMore} className='text-primary w-full p-7 text-lg hover:underline'>show more</button>
                }
            </div>
        </div>
    )
}

export default Search