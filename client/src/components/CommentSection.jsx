import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { Alert, Button, Textarea, TextInput } from 'flowbite-react';

const CommentSection = ({ postId }) => {
    const [comments, setComments] = useState("")
    const { currentUser } = useSelector(state => state.user)
    const [commentError, setCommentError] = useState(null)





    const handleSubmit = async (e) => {
        e.preventDefault()
        if (comments.length > 200) {
            setCommentError("Comment must be less than 200 characters")
            return
        }
        if (comments.length <= 0) {
            setCommentError("Comment cannot be empty")
            return
        }
        try {
            const res = await fetch(`/api/comment/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    postId,
                    content: comments,
                    userId: currentUser._id
                })
            })
            const data = await res.json()
            if (res.ok) {
                setComments("")
                setCommentError(null)
            }
        } catch (error) {
            setCommentError(error.message)
            console.log(error.message);
        }
        console.log(comments)
    }
    return (
        <div className='max-w-2xl mx-auto w-full p-3'>
            {
                currentUser ?
                    (
                        <div className='flex items-center gap-1 my-5 text-third text-sm'>
                            <p>Signed in as:</p>
                            <img className='h-5 w-5 object-cover rounded-full' src={currentUser.photoURL} alt='' />
                            <Link to={'/dashboard?tab=profile'} className='text-xs text-secondary hover:underline'>
                                @{currentUser.username}
                            </Link>
                        </div>
                    )
                    :
                    (
                        <div className=' text-sm text-primary my-5 flex gap-1'>
                            You must be signed in to comment.
                            <Link className='text-secondary hover:underline' to={'/sign-in'}>
                                Sign In
                            </Link>
                        </div>
                    )
            }
            {
                currentUser && (
                    <form onSubmit={handleSubmit} className='border border-primary rounded-md p-3'>
                        <Textarea
                            placeholder='Add Your comment...'
                            rows='3'
                            maxLength='200'
                            onChange={(e) => setComments(e.target.value)}
                            className='rounded-lg w-full outline-secondary'
                        />
                        <div className='flex justify-between items-center mt-5'>
                            <p className='text-third text-xs'>{200 - comments.length} charachters left</p>
                            <Button type='submit' className='bg-primary text-secondary rounded-full'>Submit</Button>
                        </div>
                        {
                            commentError &&
                            <Alert type='error' className='mt-3'>
                                {commentError}
                            </Alert>
                        }
                    </form>
                )
            }
        </div>
    )
}

export default CommentSection