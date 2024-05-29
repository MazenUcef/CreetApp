import axios from 'axios';
import { Button, Label, Spinner, TextInput } from 'flowbite-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';



const SignUp = () => {
  const navigate = useNavigate()
  const [loading , setloading] = useState(false)
  const [errorMessage , setErrorMessage] = useState(null)


// First type if i have like a specefic fields i knew ity from the beg

const [formData , setFormData] = useState({
  username: '',
  email: '',
  password: ''
})

// second type if i know that i can my make another field in teh future

// const [formData , setFormData] = useState({})



const onChangeHandler = (e)=>{
  const {id ,value , name}  = e.target;
  setFormData({
    ...formData , [id]: value.trim()
  })
}

console.log(formData);
  


const handleSubmit = async (e)=>{
  e.preventDefault();
  if(!formData.username || !formData.email || !formData.password){
    return setErrorMessage('Please fill out all fields')
  }
  try {
    setloading(true);
    const res = await axios.post('/api/auth/signup',{
      username: formData.username,
      email: formData.email,
      password:  formData.password
    })
    const result  = await res.data
    if(result){
      setloading(false);
      navigate('/sign-in')
    }
    console.log(result);
  } catch (error) {
    setloading(false);
    setErrorMessage(error.message);  
  }
}

  return (
    <div className='min-h-screen mt-20'>
      <div className='flex gap-5 p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center'>
        {/* left Side */}
        <div className='flex-1'>
          <Link to={'/'} className='text-secondary text-5xl font-bold'>
            _Creet
          </Link>
          <p className='text-sm hover:text-primary hover:font-extrabold mt-5 text-secondary font-semibold'>
            This is a Blog App to know all news in the world ,
            let's go and signup Now!!!
          </p>
        </div>
        {/* right Side */}
        <div className='flex-1'>
          <h1 className='font-bold text-4xl mb-11 text-secondary'>Sign Up</h1>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div>
              <Label value='Your username'/>
              <TextInput
                onChange={onChangeHandler}
                value={formData.username}
                id='username'
                name='username'
                type='text'
                placeholder='Enter Your Name'
                className='rounded-lg w-full outline-secondary'
              />
            </div>
            <div>
              <Label value='Your email'/>
              <TextInput
                onChange={onChangeHandler}
                value={formData.email}
                id='email'
                name='email'
                type='email'
                placeholder='Enter Your Email'
                className='rounded-lg w-full outline-secondary'
              />
            </div>
            <div>
              <Label value='Your password'/>
              <TextInput
                onChange={onChangeHandler}
                value={formData.password}
                id='password'
                name='password'
                type='password'
                placeholder='Enter Your Password'
                className='rounded-lg w-full outline-secondary'
              />
            </div>
            <Button disabled={loading} type='submit' className='bg-primary text-secondary'>{loading ?<> <Spinner color={'#0c4a60'} size={"sm"}/>
              <span className='pl-3'> Loading...</span></>: "Sign Up"}
            </Button>
            <OAuth/>
          </form>
          <div className='flex gap-2'>
            <span className='text-sm'>Have an account?</span>
            <Link to={'/sign-in'} className='text-secondary hover:text-primary font-semibold text-sm'> Sign In</Link>
          </div>
          {
            errorMessage && <p className='text-sm text-red-500'>{errorMessage}</p>
          }
        </div>
      </div>
    </div>
  )
}

export default SignUp