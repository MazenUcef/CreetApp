import React, { useEffect, useState } from 'react'
import {useLocation} from 'react-router-dom';
import DashSideBar from '../components/DashSideBar';
import DashProfile from '../components/DashProfile';
import DashPosts from '../components/DashPosts';
import DashUsers from '../components/DashUsers';

const DashBoard = () => {
  const location = useLocation();
  const [tab,setTab] = useState('');
  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const tabFromURL = urlParams.get('tab')
    // const tabFromURL2 = urlParams.get('user')
    // console.log(urlParams);
    // console.log(tabFromURL);
    if(tabFromURL){
      setTab(tabFromURL)
    }
    // console.log(tabFromURL2);
  },[location.search])
  return (
    <div className='min-h-screen flex flex-col md:flex-row'> 
      {/* sideBar */}
      <div className='md:w-56'>
        <DashSideBar/>
      </div>
      {/* Profile */}
      {tab === "profile" && <DashProfile/>}
      {tab === "posts" && <DashPosts/>}
      {tab === "users" && <DashUsers/>}
    </div>
  )
}

export default DashBoard