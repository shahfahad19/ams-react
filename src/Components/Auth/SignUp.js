import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AppContext from '../Context/AppContext';
import SignupAsTeacher from './SignupAsTeacher';
import SignupAsStudent from './SignupAsStudent';

const SignUp = () => {
    const ctx = useContext(AppContext);
    const [signup, signupAs] = useState('signup');
    const [searchParams, setSearchParams] = useSearchParams();
    const role = useRef();
    const navigate = useNavigate();

    let code = searchParams.get('code');
    if (code === null || code === undefined) code = '';
    else code = code.toUpperCase();
    useEffect(() => {
        if (code.length === 4) {
            signupAs('student');
        } else {
            signupAs('signup');
        }
    }, []);

    // REDIRECTING IF USER IS ALREADY LOGGED IN
    if (ctx.isLoggedIn === true) {
        navigate('/');
    }

    const changeSignup = () => {
        signupAs(role.current.value);
    };

    return (
        <>
            <div className='flex items-center flex-col m-3'>
                <div className='shadow-xl p-3 w-11/12 md:w-4/12 rounded-xl'>
                    <div className='font-medium text-2xl text-center mb-3 text-primary'>Sign Up</div>

                    {code.length !== 4 && (
                        <>
                            <div className='form-control'>
                                <select
                                    className='select w-full select-bordered border-neutral rounded-full'
                                    ref={role}
                                    onChange={changeSignup}
                                >
                                    <option value='signup'>Signup As</option>
                                    <option value='teacher'>Teacher</option>
                                    <option value='student'>Student</option>
                                </select>
                            </div>
                        </>
                    )}

                    {signup === 'teacher' && <SignupAsTeacher />}
                    {signup === 'student' && <SignupAsStudent />}

                    <div className='text-sm m-2 text-center font-regular'>
                        Already have an account?&nbsp;
                        <Link className='link link-info font-medium' to='/login'>
                            Login!
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignUp;
