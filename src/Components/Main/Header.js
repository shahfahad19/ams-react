import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppContext from '../Context/AppContext';
import ThemeSelector from './ThemeSelector';

const Header = () => {
    const navigate = useNavigate();
    const ctx = useContext(AppContext);
    const [dropdownOpen, setdropdownOpen] = useState(false);

    useEffect(() => {
        if (dropdownOpen) {
            setdropdownOpen(false);
        }
    }, [window.location.href]);

    const logout = () => {
        ctx.logout();
        navigate('/');
    };

    const dropdownHandler = () => {
        setdropdownOpen(!dropdownOpen);
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
                            <div className='dropdown-container'>
                                <div className={`dropdown ${dropdownOpen ? 'dropdown-open' : ''}`}>
                                    <label className='cursor-pointer' onClick={dropdownHandler}>
                                        {!dropdownOpen ? (
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                fill='none'
                                                viewBox='0 0 24 24'
                                                strokeWidth={1.5}
                                                stroke='currentColor'
                                                className='w-6 h-6'
                                            >
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                fill='none'
                                                viewBox='0 0 24 24'
                                                strokeWidth={1.5}
                                                stroke='currentColor'
                                                className='w-6 h-6'
                                            >
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    d='M6 18L18 6M6 6l12 12'
                                                />
                                            </svg>
                                        )}
                                    </label>

                                    <div className='dropdown-menu dropdown-menu-bottom-left'>
                                        <Link className='dropdown-item text-sm' to='/profile' tabIndex='-1'>
                                            Profile
                                        </Link>
                                        <Link to={'/'} className='dropdown-item text-sm' tabIndex='-1' onClick={logout}>
                                            Logout
                                        </Link>
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
