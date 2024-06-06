import axios from 'axios'
import { Button, Label, TextInput, Spinner } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice'
import OAuth from '../components/OAuth'

const SignIn = () => {
  const {error} = useSelector(state=>state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)



  const onChangeHandler = (e) => {
    const { name, value, id } = e.target
    setFormData({
      ...formData, [id]: value.trim()
    })
  }
  console.log(formData);



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || formData.email === '' || formData.password === '') {
      // setErrorMessage("Please fill All Fields , All Fields are required")
      dispatch(signInFailure("Please fill All Fields , All Fields are required"))
    }

    try {
      setLoading(true);
      dispatch(signInStart())
      const response = await axios.post('/api/auth/signin', {
        email: formData.email,
        password: formData.password
      })
      const result = await response.data;
      if (result) {
        setLoading(false);
        dispatch(signInSuccess(result))
        navigate('/')
        console.log(result);
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.response.data.message)
      // console.log(error.response.data.message);
      dispatch(signInFailure(error.message))
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
          <h1 className='font-bold text-4xl mb-11 text-secondary'>Sign In</h1>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div>
              <Label value='Your email' />
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
              <Label value='Your password' />
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
            <Button disabled={loading} type='submit' className='bg-primary text-secondary'>{loading ? <> <Spinner color={'#0c4a60'} size={"sm"} />
              <span className='pl-3'> Loading...</span></> : "Sign In"}
            </Button>
            <OAuth />
          </form>
          <div className='flex gap-2 mt-3'>
            <span className='text-sm'>Don't have an account?</span>
            <Link to={'/sign-up'} className='text-secondary hover:text-primary font-semibold text-sm'> Sign Up</Link>

          </div>
          {
            error && <p className='text-sm text-red-500'>{error}</p>         
          }
          {
            errorMessage && <p className='text-sm text-red-500'>{errorMessage}</p>         
          }
        </div>
      </div>
    </div>
  )
}

export default SignIn