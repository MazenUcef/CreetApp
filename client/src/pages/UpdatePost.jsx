import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import { useSelector } from 'react-redux';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../Firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom'

const UpdatePost = () => {
    const { currentUser } = useSelector((state) => state.user);
    const { postId } = useParams()
    const navigate = useNavigate()
    const [file, setFile] = useState(null)
    const [photoUploadprogress, setphotoUploadprogress] = useState(null)
    const [photoUploadError, setphotoUploadError] = useState(null)
    const [formData, setFormData] = useState({})
    const [publishError, setPublishError] = useState(null)
    // console.log(formData);


    useEffect(() => {
        try {
            const fetchPost = async() =>{
                const res = await fetch(`/api/post/display?postId=${postId}`);
                const data = await res.json();
                if(!res.ok){
                    console.log(data.message);
                    setPublishError(data.message);
                    return;
                }
                if(res.ok){
                    setFormData(data.Posts[0]);
                    console.log(data);
                    setPublishError(null)
                }
            }
            fetchPost();
            
        } catch (error) {
            
        }
    }, [postId])



    // useEffect(() => {
    //     const fetchPosts = async () => {
    //         try {
    //             console.log(postId);
    //             const res = await fetch(`/api/post/display?postId=${postId}`);
    //             const data = await res.json();
    //             if (!res.ok) {
    //                 console.log(data.message);
    //                 setPublishError(data.message);
    //                 return;
    //             }
    //             if (res.ok) {
    //                 setFormData(data.Posts[0]);
    //                 console.log(data);
    //                 setPublishError(null)
                    
    //             }
    //         } catch (error) {
    //             console.log(error.message);
    //         }
    //     };
        
    //         fetchPosts();
        
    // }, [postId]);




    const handleOnChange = (e) => {
        const { id, value } = e.target
        setFormData({
            ...formData, [id]: value
        })
    }
    console.log(formData);


    const handelUploadImage = async () => {
        try {
            if (!file) {
                setphotoUploadError('Please provide an Image')
                return
            }
            const storage = getStorage(app)
            const fileName = new Date().getTime() + '-' + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                // console.log(progress);
                setphotoUploadprogress(progress.toFixed(0))
            },
                (error) => {
                    setphotoUploadError('Image Upload Error')
                    setphotoUploadprogress(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        // console.log(downloadURL);
                        setphotoUploadprogress(null);
                        setphotoUploadError(null);
                        setFormData(prevFormData => ({ ...prevFormData, photo: downloadURL }))
                    })
                }
            )
        } catch (error) {
            setphotoUploadError('Error uploading')
            setphotoUploadprogress(null)
            console.log(error);
        }
    }



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/post/updatepost/${postId}/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            // console.log(data);

            if (!res.ok) {
                setPublishError(data.message)
                return
            }
            if (res.ok) {
                setPublishError(null)
                navigate(`/post/${data.slug}`)
            }
        } catch (error) {
            setPublishError('Something went wrong', error)
        }
    }

    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
            <h1 className='text-center text-3xl my-7 font-bold text-third'>Let's Edit Your content</h1>
            <h1 className='text-center text-2xl my-7 font-bold text-primary'>Update Your Post</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
                <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                    <TextInput value={formData.title} onChange={handleOnChange} className='flex-1' type='text' placeholder='Title' required id='title' />
                    <Select value={formData.category} id='category' onChange={handleOnChange}>
                        <option value='Uncategorized'>Select topic</option>
                        <option value='Social'>Social</option>
                        <option value='Technology'>Technology</option>
                        <option value='Psychologically'>Psychologically</option>
                        <option value='Other'>Other</option>
                    </Select>
                </div>
                <div className='flex gap-4 items-center justify-between border-2 p-3 border-primary'>
                    <FileInput type='file' accept='image/*' onChange={(e) => setFile(e.target.files[0])} />
                    <Button onClick={handelUploadImage} type='button' className='bg-primary text-secondary' size='sm'>
                        {
                            photoUploadprogress ?
                                <CircularProgressbar
                                    value={photoUploadprogress}
                                    text={`${photoUploadprogress}%`}
                                    styles={{
                                        root: {
                                            width: '100px',
                                            height: '30px',
                                        }
                                    }}
                                />
                                : 'Upload Image'
                        }

                    </Button>
                </div>
                {
                    photoUploadError && <Alert className='text-sm text-secondary'>{photoUploadError}</Alert>
                }
                {
                    formData.photo && <img src={formData.photo} alt='' className='w-full h-full object-cover' />
                }
                <ReactQuill value={formData.content} onChange={(value) => setFormData({ ...formData, content: value })} required theme="snow" placeholder='write something...' className='h-72 mb-12' />
                <Button type='submit' className='bg-primary text-secondary'>Update Post</Button>
                {
                    publishError && <Alert className='text-sm text-secondary'>{publishError}</Alert>
                }
            </form>
        </div>
    )
}

export default UpdatePost