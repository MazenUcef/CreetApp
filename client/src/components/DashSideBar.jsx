import React, { useEffect, useState } from 'react'
import { Sidebar } from 'flowbite-react'
import { HiArrowSmRight, HiArrowSmUp, HiUser } from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signOutSuccess } from '../redux/user/userSlice';

const DashSideBar = () => {
  const location = useLocation();
  const {currentUser} = useSelector(state=>state.user)
  const [tab, setTab] = useState('');
  const dispatch = useDispatch()
  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: "POST"
      })
      const data = await res.json()
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess())
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromURL = urlParams.get('tab')
    // const tabFromURL2 = urlParams.get('user')
    // console.log(urlParams);
    // console.log(tabFromURL);
    if (tabFromURL) {
      setTab(tabFromURL)
    }
    // console.log(tabFromURL2);
  }, [location.search])
  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to={'/dashboard?tab=profile'}>
            <Sidebar.Item className="text-primary font-bold cursor-pointer" active={tab === "profile"} icon={HiUser} label={currentUser.username} as="div">
              Profile
            </Sidebar.Item>
          </Link>
          <Link onClick={handleSignOut}>
            <Sidebar.Item className="text-primary font-bold cursor-pointer" icon={HiArrowSmRight} >
              Sign Out
            </Sidebar.Item>
          </Link>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSideBar