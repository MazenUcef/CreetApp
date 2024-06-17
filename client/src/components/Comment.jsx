import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';



const Comment = ({ comment, onLike }) => {
    const { currentUser } = useSelector(state => state.user)
    const [user, setUser] = useState({})
    // console.log(user);
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/user/${comment.userId}`)
                const data = await res.json()
                if (res.ok) {
                    setUser(data)
                } else {
                    console.log(data.message);
                }

            } catch (error) {
                console.log(error.message);
            }
        }
        getUser()
    }, [comment])
    return (
        <div className='flex p-4 border-b border-primary w-full'>
            <div className='flex-shrink-0 mr-3'>
                <img className='w-10 h-10 rounded-full' src={user.photoURL} alt={user.username} />
            </div>
            <div className='flex-1'>
                <div className='flex items-center mb-1'>
                    <span className='text-secondary font-bold mr-1 text-xs truncate'>{user ? `@${user.username}` : `Anonymous user`}</span>
                    <span className='text-xs text-primary'>{moment(comment.createdAt).fromNow()}</span>
                </div>
                <p className='text-primary mb-2 break-words'>{comment.content}</p>
                <div className='flex items-center pt-2 text-xs  max-w-fit gap-2 '>
                    <button onClick={()=>onLike(comment._id)} className={`text-third hover:text-secondary ${currentUser && comment.likes.includes(currentUser._id) ? '!text-secondary':'!text-third'}`}>
                        <FaThumbsUp className='text-sm' />
                    </button>
                    <p className='text-secondary text-xs'>
                        {
                            comment.numberOfLikes > 0 && comment.numberOfLikes + " " + (comment.numberOfLikes === 1? "like" : "likes")
                        }
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Comment