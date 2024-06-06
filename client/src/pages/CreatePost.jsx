import { Button, FileInput, Select, TextInput } from 'flowbite-react';
import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreatePost = () => {
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
                    <FileInput type='file' accept='image/*'/>
                    <Button type='button' className='bg-primary text-secondary' size='sm'>Upload Image</Button>
                </div>
                <ReactQuill required theme="snow" placeholder='write something...' className='h-72 mb-12' />
                <Button type='submit' className='bg-primary text-secondary'>Create Post</Button>
            </form>
        </div>
    )
}

export default CreatePost