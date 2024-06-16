import React, { useEffect, useState } from 'react'
import moment from 'moment'

const Comment = ({ comment }) => {
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
            </div>
        </div>
    )
}

export default Comment