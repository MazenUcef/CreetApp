import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { Alert, Button, Modal, Textarea, TextInput } from 'flowbite-react';
import Comment from './Comment';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const CommentSection = ({ postId }) => {
    const [comment, setComment] = useState("")
    const navigate = useNavigate()
    const [commentToDelete, setCommentToDelete] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const { currentUser } = useSelector(state => state.user)
    const [commentError, setCommentError] = useState(null)
    const [comments, setComments] = useState([])
    console.log(comments);



    const handleSubmit = async (e) => {
        e.preventDefault()
        if (comment.length > 200) {
            setCommentError("Comment must be less than 200 characters")
            return
        }
        if (comment.length <= 0) {
            setCommentError("Comment cannot be empty")
            return
        }
        // setComment('')
        try {
            const res = await fetch(`/api/comment/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    postId,
                    content: comment,
                    userId: currentUser._id
                })
            })
            const data = await res.json()
            if (res.ok) {
                setComments((prev) => [...prev, data])
                setComment("")
                setCommentError(null)
            }
            // setComment('')
        } catch (error) {
            setCommentError(error.message)
            console.log(error.message);
        }
        console.log(comment)
    }




    useEffect(() => {
        const getComments = async () => {
            try {
                const res = await fetch(`/api/comment/displayPostComment/${postId}`)
                if (res.ok) {
                    const data = await res.json()
                    setComments(data)
                }

            } catch (error) {
                console.log(error.message);
            }
        }
        getComments()
    }, [postId])



    const handleLike = async (commentId) => {
        try {
            if (!currentUser) {
                navigate('/sign-in')
                return;
            }
            const res = await fetch(`/api/comment/likeComment/${commentId}`, {
                method: 'PUT',
            });
            if (res.ok) {
                const data = await res.json()
                setComments(comments.map((comment) => {
                    if (comment._id === commentId) {
                        return {
                            ...comment,
                            likes: data.likes,
                            numberOfLikes: data.likes.length
                        }
                    }
                    return comment
                }))
            }
        } catch (error) {
            console.log(error.message);
        }
    };



    const handleEdit = async (comment, editedContent) => {
        setComments(
            comments.map((com) =>
                com._id === comment._id ? { ...com, content: editedContent } : com)
        )
    };


    const handleDelete = async (commentId) => {
        setShowModal(false)
        try {
            if (!currentUser) {
                navigate('/sign-in')
                return;
            }
            const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
                method: 'DELETE'
            })
            if (res.ok) {
                const data = await res.json();
                // setComments(comment.filter((comment) => comment._id !== commentId))
                setComments(comments => comments.filter(comment => comment._id !== commentId));
                // setCommentToDelete(null)

            }
        } catch (error) {
            console.log(error.message);
        }
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
                            onChange={(e) => setComment(e.target.value)}
                            className='rounded-lg w-full outline-secondary'
                        />
                        <div className='flex justify-between items-center mt-5'>
                            <p className='text-third text-xs'>{200 - comment.length} charachters left</p>
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
            {
                comments.length === 0 ? (
                    <p className='text-sm text-secondary'>No comments yet</p>
                ) : (
                    <>
                        <div className='text-sm my-5 flex items-center gap-1'>
                            <p className='text-primary'>comments</p>
                            <div className='text-secondary'>
                                <p>{comments.length}</p>
                            </div>
                        </div>
                        {
                            comments.map((comment) => (
                                <Comment
                                    key={comment._id}
                                    comment={comment}
                                    onLike={handleLike}
                                    onEdit={handleEdit}
                                    onDelete={(commentId) => {
                                        setCommentToDelete(commentId)
                                        setShowModal(true)
                                    }}
                                />
                            ))
                        }
                    </>
                )
            }
            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                popup
                size='md'
            >
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Are you sure you want to delete this comment?
                        </h3>
                        <div className='flex justify-center gap-4'>
                            <Button color='failure' onClick={() => handleDelete(commentToDelete)}>
                                Yes, I'm sure
                            </Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default CommentSection