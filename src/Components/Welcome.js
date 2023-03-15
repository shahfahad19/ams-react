import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AppContext from './Context/AppContext';

const Welcome = () => {
    const ctx = useContext(AppContext);
    return (
        <div className='w-full mt-32 flex flex-col items-center justify-center'>
            <div className='text-3xl font-medium text-primary align-middle text-center px-2 sm:text-4xl md:text-5xl'>
                Attendance Managment System
            </div>
            <div className='text-md font-regular text-center my-3 px-2 md:text-2xl'>
                Welcome to the Attendance Managment System
                {!ctx.isLoggedIn && (
                    <>
                        <br />
                        Create an account or Login to continue!
                    </>
                )}
            </div>
            <div className='p-3 flex flex-col justify-center items-center md:flex-row'>
                {ctx.isLoggedIn === 'wait' && (
                    <div>
                        <p className='text-lg font-medium text-primary text-center p-3'>Please wait</p>
                        <progress className='progress progress-primary w-56'></progress>
                    </div>
                )}
                {!ctx.isLoggedIn && (
                    <>
                        <Link className='btn btn-neutral rounded-full m-2 w-32 btn-sm md:btn-md md:w-48' to='/login'>
                            Login
                        </Link>
                        <Link className='btn btn-neutral rounded-full m-2 w-32 btn-sm md:btn-md md:w-48' to='/signup'>
                            Sign Up
                        </Link>
                    </>
                )}
                {ctx.isLoggedIn === true && (
                    <>
                        <Link
                            className='btn btn-primary rounded-full btn-outline m-2 w-52 btn-sm md:btn-md'
                            to={'/' + ctx.loggedInAs}
                        >
                            Go to Dashboard
                        </Link>
                        <br />
                        <Link
                            className='btn btn-error rounded-full btn-outline m-2 w-44 btn-sm md:btn-md'
                            onClick={() => {
                                ctx.logout();
                            }}
                        >
                            Logout
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default Welcome;
