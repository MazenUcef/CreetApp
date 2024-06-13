import React, { useEffect, useState } from 'react'
import { Sidebar } from 'flowbite-react'
import { HiArrowSmRight, HiArrowSmUp, HiDocumentText, HiUser } from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signOutSuccess } from '../redux/user/userSlice';
import { FaUsers } from "react-icons/fa6";

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
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
          <Link to={'/dashboard?tab=profile'}>
            <Sidebar.Item className="text-primary font-bold cursor-pointer" as={'div'} active={tab === "profile"} icon={HiUser} label={currentUser.isAdmin? `Admin` : `User`}>
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser.isAdmin && (
          <Link to='/dashboard?tab=posts'>
            <Sidebar.Item active={tab === 'posts'} icon={HiDocumentText} as={'div'}>
              Posts
            </Sidebar.Item>
          </Link>
          )}
          {currentUser.isAdmin && (
          <Link to='/dashboard?tab=users'>
            <Sidebar.Item active={tab === 'users'} icon={FaUsers} as={'div'}>
              Users
            </Sidebar.Item>
          </Link>
          )}
          <Link onClick={handleSignOut}>
            <Sidebar.Item className="text-primary font-bold cursor-pointer" as={'div'} icon={HiArrowSmRight} >
              Sign Out
            </Sidebar.Item>
          </Link>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSideBar