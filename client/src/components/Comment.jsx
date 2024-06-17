import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Button, Textarea } from 'flowbite-react'



const Comment = ({ comment, onLike, onEdit }) => {
    const { currentUser } = useSelector(state => state.user)
    const [user, setUser] = useState({})
    const [editedContent, setEditedContent] = useState(comment.content)
    const [isEditing, setIsEditing] = useState(false)
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


    const handleEdit = () => {

        setIsEditing(true)
        setEditedContent(comment.content)
    }


    const handleSave = async () => {
        try {
            const res = await fetch(`/api/comment/editComment/${comment._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: editedContent,
                }),
            });
            if (res.ok) {
                setIsEditing(false);
                onEdit(comment, editedContent);
            }
        } catch (error) {
            console.log(error.message);
        }
    }
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
                {
                    isEditing && (
                        <>
                            <Textarea
                                className='mb-2'
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                            />
                            <div className='flex justify-end gap-2'>
                                <Button onClick={handleSave} size='sm' className='bg-primary text-secondary rounded-full text-xs' type='button'>
                                    save
                                </Button>
                                <Button onClick={() => setIsEditing(false)} size='sm' className='bg-primary text-secondary rounded-full text-xs' type='button'>
                                    cancel
                                </Button>
                            </div>
                        </>
                    )
                }
                <p className='text-primary mb-2 break-words'>{comment.content}</p>
                <div className='flex items-center pt-2 text-xs  max-w-fit gap-2 '>
                    <button onClick={() => onLike(comment._id)} className={`text-third hover:text-secondary ${currentUser && comment.likes.includes(currentUser._id) ? '!text-secondary' : '!text-third'}`}>
                        <FaThumbsUp className='text-sm' />
                    </button>
                    <p className='text-secondary text-xs'>
                        {
                            comment.numberOfLikes > 0 && comment.numberOfLikes + " " + (comment.numberOfLikes === 1 ? "like" : "likes")
                        }
                    </p>
                    {
                        currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                            <button onClick={handleEdit} type='button' className='text-secondary hover:text-third'>
                                Edit
                            </button>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Comment