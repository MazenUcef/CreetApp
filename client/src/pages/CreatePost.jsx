import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage , ref , uploadBytesResumable  } from 'firebase/storage'
import { app } from '../Firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const CreatePost = () => {
    const [file, setFile] = useState(null)
    const [photoUploadprogress, setphotoUploadprogress] = useState(null)
    const [photoUploadError, setphotoUploadError] = useState(null)
    const [formData, setformData] = useState({})


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
                console.log(progress);
                setphotoUploadprogress(progress.toFixed(0))
            },
                (error) => {
                    setphotoUploadError('Image Upload Error')
                    setphotoUploadprogress(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log(downloadURL);
                        setphotoUploadprogress(null);
                        setphotoUploadError(null);
                        setformData({ ...formData, photo: downloadURL })
                    })
                }
            )
        } catch (error) {
            setphotoUploadError('Error uploading')
            setphotoUploadprogress(null)
            console.log(error);
        }
    }
    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
            <h1 className='text-center text-3xl my-7 font-bold text-third'>Let's Get In Touch</h1>
            <h1 className='text-center text-2xl my-7 font-bold text-primary'>Create a new post</h1>
            <form className='flex flex-col gap-5'>
                <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                    <TextInput className='flex-1' type='text' placeholder='Title' required id='title' />
                    <Select>
                        <option value='uncategorized'>Select topic</option>
                        <option value='social'>Social</option>
                        <option value='technology'>Technology</option>
                        <option value='psychologically'>Psychologically</option>
                        <option value='other'>Other</option>
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
                <ReactQuill required theme="snow" placeholder='write something...' className='h-72 mb-12' />
                <Button type='submit' className='bg-primary text-secondary'>Create Post</Button>
            </form>
        </div>
    )
}

export default CreatePost