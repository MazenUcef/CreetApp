import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Table, Button } from 'flowbite-react';
import {Link} from 'react-router-dom';

const DashPosts = () => {
  const { currentUser } = useSelector(state => state.user)
  const [userPosts, setUserPosts] = useState([])
  console.log(userPosts);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/display?userId=${currentUser._id}`)
        const data = await res.json()
        // console.log(data);
        if (res.ok) {
          setUserPosts(data.Posts)
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (currentUser.isAdmin) {
      fetchPosts()
    }
  }, [currentUser._id])
  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-thumb-secondary scrollbar-track-primary'>
      {currentUser.isAdmin && userPosts.length > 0 ?
        (
          <>
            <Table hoverable className='w-[70vw] shadow-md rounded '>
              <Table.Head className='bg-primary text-secondary'>
                <Table.HeadCell className='bg-primary'>Updated Date</Table.HeadCell>
                <Table.HeadCell className='bg-primary'>IMAGE</Table.HeadCell>
                <Table.HeadCell className='bg-primary'>TITLE</Table.HeadCell>
                <Table.HeadCell className='bg-primary'>CATEGORY</Table.HeadCell>
                <Table.HeadCell className='bg-primary'>DELETE</Table.HeadCell>
                <Table.HeadCell className='bg-primary'>
                  <span>EDIT</span>
                </Table.HeadCell>
              </Table.Head>
              {userPosts.map((post) =>(
                <Table.Body className='text-secondary divide-y font-bold text-xs'>
                  <Table.Row>
                    <Table.Cell className='text-sm'>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                    <Table.Cell>
                      <Link to={`/post/${post.slug}`}>
                      <img src={post.image} alt={post.title} className='rounded h-14 w-20 object-cover bg-third' />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link className='text-sm' to={`/post/${post.slug}`}>{post.title}</Link>
                    </Table.Cell>
                    <Table.Cell className='text-sm'>{post.category}</Table.Cell>
                    <Table.Cell>
                      <span className='text-sm text-third hover:text-red-700'>
                        Delete
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/update-post/${post._id}`}>
                        <span className='text-sm hover:text-green-700 text-third'>Edit</span>
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
          </>
        )
        :
        (<h1>You Have No Posts </h1>)
      }
    </div>
  )
}

export default DashPosts