import React, { useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import AppContext from '../Context/AppContext';
import Message from '../Main/Message';

const TeacherDashboard = () => {
    const ctx = useContext(AppContext);
    return (
        <>
            {ctx.isLoggedIn === 'wait' && (
                <div className='flex absolute flex-col justify-center h-auto bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 items-center'>
                    <p className='text-lg font-bold text-primary text-center p-3'>Please wait</p>
                    <progress className='progress progress-primary w-56'></progress>
                </div>
            )}
            {!ctx.userData.confirmed && (
                <div className='alert alert-warning shadow-lg flex flex-row'>
                    <div>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='stroke-current flex-shrink-0 h-6 w-6'
                            fill='none'
                            viewBox='0 0 24 24'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                            />
                        </svg>

                        <span className='text-sm md:text-md'>
                            Please confirm your account. If you haven't received confirmation email, check spam folder.
                            <br />
                            <Link to={'/resendConfirmationEmail?r=1'} className='link'>
                                Click here to resend confirmation email
                            </Link>
                        </span>
                    </div>
                </div>
            )}

            {ctx.isLoggedIn === true && (
                <>
                    <Outlet />
                </>
            )}
        </>
    );
};

export default TeacherDashboard;
