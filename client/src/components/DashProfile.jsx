import { Alert, Button, Modal, TextInput } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../Firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, updateFailure, updateStart, updateSuccess } from '../redux/user/userSlice';
import {HiOutlineExclamationCircle} from 'react-icons/hi';



const DashProfile = () => {
  const dispatch = useDispatch()
  const photoPicker = useRef()
  const { currentUser , error } = useSelector(state => state.user)
  const [photoFile, setPhotoFile] = useState(null);
  const [photoFileUrl, setPhotoFileUrl] = useState(null);
  const [photoFileUploadprogress, setphotoFileUploadprogress] = useState(null);
  const [photoUploadError, setphotoUploadError] = useState(null);
  const [profielUpdateStatus, setProfileUploadStatus] = useState(null)
  const [formData, setFormData] = useState({})
  const [showModal, setShowModal] = useState(false)

  // console.log(photoFileUploadprogress, photoUploadError);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file)
      setPhotoFileUrl(URL.createObjectURL(file))
    }
  }

  useEffect(() => {
    if (photoFile) {
      uploadImage()
    }
  }, [photoFile])


  const uploadImage = async () => {
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read; 
    //       allow write:if
    //       request.resource.size < 2 *1024 *1024 &&
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }
    // console.log("uploring image");
    const storage = getStorage(app);
    const fileName = new Date().getTime() + photoFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, photoFile);
    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setphotoFileUploadprogress(progress.toFixed(0))

    },
      (error) => {
        setphotoUploadError('Upload image failed (file must be less than 2mb')
        setphotoFileUploadprogress(null);
        setPhotoFile(null);
        setPhotoFileUrl(null)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setPhotoFileUrl(url)
          setFormData({ ...formData, photoURL: url })
          onchange = { handelChange }
        })
      })
  }
  console.log(photoFile, photoFileUrl);
  const handelChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData, [id]: value.trim()
    })
  }
  console.log(formData);

  const handelSubmit = async (e) => {
    e.preventDefault();
    if (formData.length <= 0) {
      return;
    }

    try {
      dispatch(updateStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (!res.ok) {
        dispatch(updateFailure(data.message))
      } else {
        dispatch(updateSuccess(data))
        setProfileUploadStatus('Profile Updated Successfully')
      }
    } catch (error) {
      dispatch(updateFailure(error.message))
    }
  }
  const handleDeleteUser =async ()=>{
    // console.log('delete user');
    setShowModal(false)
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method:'DELETE',
      })
      const data = await res.json()
      if(!res.ok){
        dispatch(deleteUserFailure(data.message))
      }else{
        dispatch(deleteUserSuccess(data))
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form onSubmit={handelSubmit} className='flex flex-col gap-4'>
        <input hidden ref={photoPicker} type='file' accept='image/*' onChange={handlePhotoChange} />
        <div className='relative w-32 h-32 self-center rounded-full cursor-pointer shadow-md overflow-hidden '>
          {photoFileUploadprogress && (
            <CircularProgressbar
              value={photoFileUploadprogress || 0}
              text={`${photoFileUploadprogress}%`}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(12,74,96,${photoFileUploadprogress / 100})`,
                }
              }}
            />
          )}
          <img onClick={() => photoPicker.current.click()} src={photoFileUrl || currentUser.photoURL} alt='userPhoto' className='h-full w-full object-cover rounded-full' />
        </div>
        {/* <progress value={photoFileUploadprogress}></progress> */}

        {photoUploadError && (
          <Alert color={failure}>
            {photoFileUploadprogress}
          </Alert>
        )}

        <TextInput onChange={handelChange} type='text' id='username' placeholder='username' defaultValue={currentUser.username} />
        <TextInput onChange={handelChange} type='email' id='email' placeholder='email' defaultValue={currentUser.email} />
        <TextInput onChange={handelChange} type='password' id='password' placeholder='password' />
        <Button type='submit'>Update</Button>
      </form>
      {
        profielUpdateStatus && (
          <Alert className='bg-primary text-secondary font-bold mt-5'>
            {profielUpdateStatus}
          </Alert>
        )
      }
      {
        error && (
          <Alert className='bg-primary text-secondary font-bold mt-5'>
            {error}
          </Alert>
        )
      }
      <div className='text-secondary flex justify-between mt-5'>
        <span onClick={() => setShowModal(true)} className='cursor-pointer font-semibold'>Delete Account</span>
        <span className='cursor-pointer font-semibold'>Sign Out</span>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size={'md'} >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-primary mb-4 mx-auto'/>
          </div>
          <p className='mb-5 text-lg font-bold text-primary '>Are you sure you want to delete your account?</p>
           <div className=' flex justify-around items-center '>
            <button className='bg-secondary py-2 px-8 font-bold rounded-full' onClick={handleDeleteUser}>Yes I'm Sure</button>
            <button className='bg-primary py-2 px-5 rounded-full font-bold text-third' onClick={()=>setShowModal(false)}>Cancel</button>
           </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default DashProfile