import React, { useEffect, useState } from 'react'
import { Sidebar } from 'flowbite-react'
import { HiArrowSmRight, HiArrowSmUp, HiUser } from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom';

const DashSideBar = () => {
  const location = useLocation();
  const [tab, setTab] = useState('');
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
            <Sidebar.Item className="text-primary font-bold cursor-pointer" active={tab === "profile"} icon={HiUser} label={"User"} as="div">
              Profile
            </Sidebar.Item>
          </Link>
          <Sidebar.Item className="text-primary font-bold cursor-pointer" icon={HiArrowSmRight} >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSideBar