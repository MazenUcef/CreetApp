import { Button } from 'flowbite-react'
import React from 'react';
import {AiFillGoogleCircle} from 'react-icons/ai'
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
import { app } from '../Firebase';
import axios from 'axios';
import { SignInSuccess } from '../redux/user/userSlice';
import {useDispatch} from 'react-redux'
import { useNavigate } from 'react-router-dom';


const OAuth = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleGoogleLogin = async()=>{
        const auth  =getAuth(app)
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({prompt:"select_account"})
        try {
            const resultsFromGoogle = await signInWithPopup(auth,provider)
            console.log(resultsFromGoogle);
            const response = await axios.post('/api/auth/google',{
                // tokenId:resultsFromGoogle.user.uid,
                name:resultsFromGoogle.user.displayName,
                email:resultsFromGoogle.user.email,
                photoURL:resultsFromGoogle.user.photoURL
            })
            const result = await response.data
            if(result){
                dispatch(SignInSuccess(result))
                navigate('/')
            }
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <Button onClick={handleGoogleLogin} type='button' className='bg-secondary text-primary hover:text-white'>
    <AiFillGoogleCircle className='w-6 h-6 mr-3'/>
    Continue with Google
    </Button>
  )
}

export default OAuth