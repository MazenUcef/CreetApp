import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaUsers } from "react-icons/fa6";
import { FaComments } from "react-icons/fa";
import { HiArrowNarrowUp, HiArrowSmRight, HiArrowSmUp, HiDocumentText, HiOutlineUserGroup, HiUser } from 'react-icons/hi';
import { BsFillSignpostSplitFill } from "react-icons/bs";
import { Button, Table } from 'flowbite-react';
import { Link } from 'react-router-dom';




const DashBoardComp = () => {
    const [users, setUsers] = useState([])
    const [comments, setComments] = useState([])
    const [posts, setPosts] = useState([])
    const [totalUsers, setTotalUsers] = useState(0)
    const [totalComments, setTotalComments] = useState(0)
    const [totalPosts, setTotalPosts] = useState(0)
    const [lastMonthUsers, setLastMonthUsers] = useState(0)
    const [lastMonthComments, setLastMonthComments] = useState(0)
    const [lastMonthPosts, setLastMonthPosts] = useState(0)
    const { currentUser } = useSelector(state => state.user)




    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`/api/user/displayusers?limit=5`)
                const data = await res.json()
                if (res.ok) {
                    setUsers(data.users)
                    setTotalUsers(data.totalUsers)
                    setLastMonthUsers(data.lastMonthUsers)
                }
            } catch (error) {
                console.log(error.message);
            }

        }
        const fetchPosts = async () => {
            try {
                const res = await fetch(`/api/post/display?limit=5`)
                const data = await res.json()
                if (res.ok) {
                    setPosts(data.Posts)
                    setTotalPosts(data.countPosts)
                    setLastMonthPosts(data.lastMonthPosts)
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        const fetchComments = async () => {
            try {
                const res = await fetch(`/api/comment/getComments?limit=5`)
                const data = await res.json()
                if (res.ok) {
                    setComments(data.comments)
                    setTotalComments(data.totalComments)
                    setLastMonthComments(data.lastMonthComments)
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        if (currentUser.isAdmin) {
            fetchUsers()
            fetchPosts()
            fetchComments()
        }
    }, [currentUser])
    return (
        <div className='p-3 md:mx-auto'>
            <div className='flex flex-wrap gap-4 justify-center'>
                <div className='gap-4 md:w-72 w-full rounded-md shadow-md flex flex-col p-3 '>
                    <div className='flex justify-between'>
                        <div className=''>
                            <h3 className='text-third text-md uppercase'>Total Users</h3>
                            <p className='text-2xl'>{totalUsers}</p>
                        </div>
                        <FaUsers className='bg-primary text-secondary rounded-full text-4xl p-2 shadow-lg' />
                    </div>
                    <div className='flex gap-2 items-center text-[10px]'>
                        <span className='text-secondary flex items-center'>
                            <HiArrowNarrowUp />
                            {lastMonthUsers}
                        </span>
                        <div className='text-third font-bold '>Last month</div>
                    </div>
                </div>
                <div className='gap-4 md:w-72 w-full rounded-md shadow-md flex flex-col p-3 '>
                    <div className='flex justify-between'>
                        <div className=''>
                            <h3 className='text-third text-md uppercase'>Total Comments</h3>
                            <p className='text-2xl'>{totalComments}</p>
                        </div>
                        <FaComments className='bg-primary text-secondary rounded-full text-4xl p-2 shadow-lg' />
                    </div>
                    <div className='flex gap-2 items-center text-[10px]'>
                        <span className='text-secondary flex items-center'>
                            <HiArrowNarrowUp />
                            {lastMonthComments}
                        </span>
                        <div className='text-third font-bold'>Last month</div>
                    </div>
                </div>
                <div className='gap-4 md:w-72 w-full rounded-md shadow-md flex flex-col p-3 '>
                    <div className='flex justify-between'>
                        <div className=''>
                            <h3 className='text-third text-md uppercase'>Total Posts</h3>
                            <p className='text-2xl'>{totalPosts}</p>
                        </div>
                        <BsFillSignpostSplitFill className='bg-primary text-secondary rounded-full text-4xl p-2 shadow-lg' />
                    </div>
                    <div className='flex gap-2 items-center text-[10px]'>
                        <span className='text-secondary flex items-center'>
                            <HiArrowNarrowUp />
                            {lastMonthPosts}
                        </span>
                        <div className='text-third font-bold'>Last month</div>
                    </div>
                </div>
            </div>
            <div className='flex-wrap flex gap-4 py-3 mx-auto justify-center'>
                <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md'>
                    <div className='flex justify-between p-3 text-sm font-semibold'>
                        <h1 className='text-center p-2 text-primary'>Recent Users</h1>
                        <Button className='bg-primary rounded-full text-secondary'>
                            <Link to={'/dashboard?tab=users'}>
                                See More
                            </Link>
                        </Button>
                    </div>
                    <Table hoverable>
                        <Table.Head className='text-secondary'>
                            <Table.HeadCell>User Image</Table.HeadCell>
                            <Table.HeadCell>Username</Table.HeadCell>
                        </Table.Head>
                        {
                            users && users.map((user) => (
                                <Table.Body key={user._id} className='divide-y'>
                                    <Table.Row className='bg-white'>
                                        <Table.Cell>
                                            <img src={user.photoURL} alt={'user'} className='rounded-full bg-third w-10 h-10' />
                                        </Table.Cell>
                                        <Table.Cell>{user.username}</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ))
                        }
                    </Table>
                </div>
                <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md'>
                    <div className='flex justify-between p-3 text-sm font-semibold'>
                        <h1 className='text-center p-2 text-primary'>Recent Comments</h1>
                        <Button className='bg-primary rounded-full text-secondary'>
                            <Link to={'/dashboard?tab=comments'}>
                                See More
                            </Link>
                        </Button>
                    </div>
                    <Table hoverable>
                        <Table.Head className='text-secondary'>
                            <Table.HeadCell>Comment Content</Table.HeadCell>
                            <Table.HeadCell>Likes</Table.HeadCell>
                        </Table.Head>
                        {
                            comments && comments.map((comment) => (
                                <Table.Body key={comment._id} className='divide-y'>
                                    <Table.Row className='bg-white'>
                                        <Table.Cell className='w-96'>
                                            <p className='truncate'>{comment.content}</p>
                                        </Table.Cell>
                                        <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ))
                        }
                    </Table>
                </div>
                <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md'>
                    <div className='flex justify-between p-3 text-sm font-semibold'>
                        <h1 className='text-center p-2 text-primary'>Recent Posts</h1>
                        <Button className='bg-primary rounded-full text-secondary'>
                            <Link to={'/dashboard?tab=users'}>
                                See More
                            </Link>
                        </Button>
                    </div>
                    <Table hoverable>
                        <Table.Head className='text-secondary'>
                            <Table.HeadCell>Post Imaage</Table.HeadCell>
                            <Table.HeadCell>Post Title</Table.HeadCell>
                            <Table.HeadCell>Category</Table.HeadCell>
                        </Table.Head>
                        {
                            posts && posts.map((post) => (
                                <Table.Body key={post._id} className='divide-y'>
                                    <Table.Row className='bg-white'>
                                        <Table.Cell>
                                            <img src={post.photo} alt={'user'} className='rounded-md bg-third w-14 h-14' />
                                        </Table.Cell>
                                        <Table.Cell className='w-96'>{post.title}</Table.Cell>
                                        <Table.Cell className='w-5'>{post.category}</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ))
                        }
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default DashBoardComp