import React from 'react'
import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react'
import { Link, useLocation } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux'
import { signOutSuccess } from '../redux/user/userSlice';


const Header = () => {
    const pathname = useLocation().pathname
    const dispatch = useDispatch()
    const { currentUser } = useSelector(state => state.user)
    // console.log(currentUser.photoURL);
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
    return (
        <Navbar className='border-b-2 bg-primary'>
            <Link to={'/'} className='self-center whitespace-nowrap text-secondary text-sm sm:text-2xl font-bold'>
                _Creet
            </Link>

            <form>
                <TextInput rightIcon={AiOutlineSearch} type='text' placeholder='Search...' className='bg-third rounded-full outline-secondary lg:inline' />
            </form>
            <Button className='w-12 rounded-xl h-10 lg:hidden xl:hidden hover:text-third bg-secondary text-primary'>
                <AiOutlineSearch color='#0c4a60' size={20} />
            </Button>
            <Navbar.Collapse>
                <Navbar.Link active={pathname === '/'} className='text-secondary' as={'div'}>
                    <Link to={'/'}>
                        Home
                    </Link>
                </Navbar.Link>
                <Navbar.Link active={pathname === '/about'} className='text-secondary' as={'div'}>
                    <Link to={'/about'}>
                        About
                    </Link>
                </Navbar.Link>
                <Navbar.Link active={pathname === '/projects'} className='text-secondary' as={'div'}>
                    <Link to={'/projects'}>
                        Projects
                    </Link>
                </Navbar.Link>
            </Navbar.Collapse>
            <div className='flex gap-2'>
                {
                    currentUser ?
                        (
                            <Dropdown
                                arrowIcon={false}
                                inline
                                label={<Avatar alt='user' img={currentUser.photoURL} rounded className='w-10 h-6' />}
                            >
                                <Dropdown.Header>
                                    <span className='block text-sm'>@{currentUser.username}</span>
                                    <span className='block text-sm font-medium truncate'>@{currentUser.email}</span>
                                </Dropdown.Header>
                                <Link to={'/dashboard?tab=profile'}>
                                    <Dropdown.Item>Profile</Dropdown.Item>
                                </Link>
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
                            </Dropdown>
                        )
                        :
                        (
                            <Link to={'/sign-in'}>
                                <Button className='font-bold hover:text-third bg-secondary text-primary'>
                                    Sign In
                                </Button>
                            </Link>

                        )
                }
                <Navbar.Toggle />
            </div>
        </Navbar>
    )
}

export default Header