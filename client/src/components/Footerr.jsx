import React from 'react';
import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';

const Footerr = () => {
    return (
        <Footer container={true} className="border border-t-8 border-primary">
            <div className='w-full flex justify-around items-center'>
                <div className=''>
                    <Link to={'/'} className='self-center whitespace-nowrap text-secondary text-sm sm:text-2xl font-bold'>
                        _Creet
                    </Link>
                </div>
                <div className=''>
                <p className='text-primary font-semibold'>&copy; 2024 Project1976. All rights reserved.</p>
                </div>
            </div>
        </Footer>
    )
}

export default Footerr