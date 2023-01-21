import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppContext from '../Context/AppContext';

const Header = () => {
    const navigate = useNavigate();
    const ctx = useContext(AppContext);
    const logout = () => {
        ctx.logout();
        navigate('/');
    };

    return (
        <div className='navbar bg-base-200'>
            <div className='flex-1'>
                <a href='/' className='normal-case text-xl font-bold '>
                    AMS
                </a>
            </div>
            <div className='flex-none'>
                <div className='dropdown dropdown-end'>
                    <label tabIndex={0} className='btn btn-ghost btn-circle avatar'>
                        <div className='w-10 rounded-full'>
                            <img src='https://placeimg.com/80/80/people' />
                        </div>
                    </label>
                    <ul
                        tabIndex={0}
                        className='menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52'
                    >
                        {ctx.isLoggedIn && (
                            <>
                                <li>
                                    <a>Profile</a>
                                </li>
                                <li>
                                    <a onClick={logout}>Logout</a>
                                </li>
                            </>
                        )}
                        {!ctx.isLoggedIn && (
                            <>
                                <li>
                                    <Link to={'/login'}>Login</Link>
                                    <Link to={'/signup'}>Signup</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Header;
