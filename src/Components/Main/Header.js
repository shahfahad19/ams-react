import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppContext from '../Context/AppContext';
import ThemeSelector from './ThemeSelector';

const Header = () => {
    const navigate = useNavigate();
    const ctx = useContext(AppContext);
    const logout = () => {
        ctx.logout();
        navigate('/');
    };

    return (
        <>
            <div className='navbar shadow-md mb-2.5'>
                <div className='navbar-start'>
                    <Link to='/' className='navbar-item font-medium'>
                        <span className='sm:hidden'>AMS</span>

                        <span className='hidden sm:block'>Attendance Management System</span>
                    </Link>
                </div>
                <div className='navbar-end'>
                    <div className='navbar-item'>
                        <ThemeSelector />
                    </div>
                    {ctx.isLoggedIn && (
                        <div className='navbar-item'>
                            <div className='avatar avatar-ring avatar-md'>
                                <div className='dropdown-container'>
                                    <div className='dropdown'>
                                        <label className='btn btn-ghost flex cursor-pointer px-0' tabIndex='0'>
                                            <img
                                                src={
                                                    ctx.userData.photo ||
                                                    'https://res.cloudinary.com/dbph73rvi/image/upload/v1675170781/mdqcinla4xkogsatvbr3.jpg'
                                                }
                                                alt='profile_pic'
                                            />
                                        </label>

                                        <div className='dropdown-menu dropdown-menu-bottom-left'>
                                            <Link className='dropdown-item text-sm' to={`/profile`}>
                                                Profile
                                            </Link>
                                            <Link
                                                to={'/'}
                                                className='dropdown-item text-sm'
                                                tabIndex='-1'
                                                onClick={logout}
                                            >
                                                Logout
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Header;
