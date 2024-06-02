import { Alert, Button, TextInput } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../Firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';




const DashProfile = () => {
  const photoPicker = useRef()
  const { currentUser } = useSelector(state => state.user)
  const [photoFile, setPhotoFile] = useState(null);
  const [photoFileUrl, setPhotoFileUrl] = useState(null);
  const [photoFileUploadprogress, setphotoFileUploadprogress] = useState(null);
  const [photoUploadError, setphotoUploadError] = useState(null);

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
        })
      })
  }
  console.log(photoFile, photoFileUrl);
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <input hidden ref={photoPicker} type='file' accept='image/*' onChange={handlePhotoChange} />
        <div className='relative w-32 h-32 self-center rounded-full cursor-pointer shadow-md overflow-hidden '>
          {photoFileUploadprogress &&(
            <CircularProgressbar
              value={photoFileUploadprogress || 0}
              text={`${photoFileUploadprogress}%`}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position:"absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(12,74,96,${photoFileUploadprogress/100})`,
                }
              }}
            />
          )}
          <img onClick={() => photoPicker.current.click()} src={photoFileUrl || currentUser.photoURL} alt='userPhoto' className='h-full w-full object-cover rounded-full' />
        </div>
        {/* <progress value={photoFileUploadprogress}></progress> */}
        
          {photoUploadError &&(
            <Alert color={failure}>
              {photoFileUploadprogress}
            </Alert>
          )}
        
        <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} />
        <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email} />
        <TextInput type='password' id='password' placeholder='password' />
        <Button type='submit'>Update</Button>
      </form>
      <div className='text-secondary flex justify-between mt-5'>
        <span className='cursor-pointer font-semibold'>Delete Account</span>
        <span className='cursor-pointer font-semibold'>Sign Out</span>
      </div>
    </div>
  )
}

export default DashProfile