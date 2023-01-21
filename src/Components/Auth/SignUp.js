import axios from 'axios';
import React, { useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../Context/AppContext';

const SignUp = () => {
    const [signup, signupAs] = useState('Signup As');
    const [btnState, setBtnState] = useState('');
    const navigate = useNavigate();
    const name = useRef();
    const email = useRef();
    const rollno = useRef();
    const batch = useRef();
    const department = useRef();
    const password = useRef();
    const confirmPassword = useRef();
    const role = useRef();

    const ctx = useContext(AppContext);

    // REDIRECTING IF USER IS ALREADY LOGGED IN
    if (ctx.isLoggedIn === true) {
        navigate('/');
    }

    const submitForm = async (event) => {
        event.preventDefault();
        setBtnState('loading');
        //const baseURL = 'https://amsapi.vercel.app';
        const baseURL = 'https://amsapi.vercel.app';
        let data = {};
        let code = 0;

        if (role.current.value === 'Admin') {
            await axios
                .post(`${baseURL}/admin/signup`, {
                    name: name.current.value,
                    email: email.current.value,
                    department: department.current.value,
                    password: password.current.value,
                    passwordConfirm: confirmPassword.current.value,
                })
                .then((response) => {
                    data = response.data;
                    code = 1;
                })
                .catch((error) => {
                    console.log(error);
                });
        } else if (role.current.value === 'Teacher') {
            await axios
                .post(`${baseURL}/teacher/signup`, {
                    name: name.current.value,
                    email: email.current.value,
                    password: password.current.value,
                    confirmPassword: confirmPassword.current.value,
                })
                .then((response) => {
                    data = response.data;
                    code = 2;
                })
                .catch((error) => {
                    console.log(error);
                });
        } else if (role.current.value === 'Student') {
            await axios
                .post(`${baseURL}/student/signup`, {
                    name: name.current.value,
                    email: email.current.value,
                    rollNo: rollno.current.value,
                    batchCode: batch.current.value,
                    password: password.current.value,
                    passwordConfirm: confirmPassword.current.value,
                })
                .then((response) => {
                    data = response.data;
                    code = 3;
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            console.log('error');
        }
        setBtnState('');
        if (code === 0) return;
        const signedup = saveToken(`${data.token}${code}`);

        setBtnState('');
        if (signedup) {
            ctx.login();
            //navigate('/');
        }
    };

    const changeSignup = () => {
        signupAs(role.current.value);
    };

    const saveToken = (token) => {
        if (token !== '') {
            try {
                localStorage.setItem('ams-token', token);
                localStorage.setItem('role', 'a');
                return true;
            } catch (err) {
                localStorage.setItem('ams-token', '');
                return false;
            }
        } else {
            return false;
        }
    };

    return (
        <>
            <div className='flex items-center flex-col m-3'>
                <div className='rounded shadow-xl p-3 w-11/12 md:w-8/12 lg:w-3/5'>
                    <div className='font-bold text-2xl text-center mb-3 text-primary'>Sign Up</div>

                    <form className='font-medium w-full' onSubmit={submitForm}>
                        <div className='form-control'>
                            <select
                                className='select w-full select-bordered'
                                name='role'
                                type='role'
                                required
                                ref={role}
                                onChange={changeSignup}
                            >
                                <option>Signup As</option>
                                <option>Admin</option>
                                <option>Teacher</option>
                                <option>Student</option>
                            </select>
                        </div>
                        <br />
                        {signup !== 'Signup As' && (
                            <>
                                <div className='form-control'>
                                    <input
                                        className='input w-full input-bordered'
                                        type='name'
                                        placeholder='Full Name'
                                        required
                                        ref={name}
                                    ></input>
                                </div>
                                <br />
                                {signup === 'Student' && (
                                    <>
                                        <div className='form-control'>
                                            <input
                                                className='input w-full input-bordered'
                                                type='number'
                                                placeholder='Roll No'
                                                required
                                                ref={rollno}
                                            ></input>
                                        </div>
                                        <br />
                                        <div className='form-control'>
                                            <input
                                                className='input w-full input-bordered'
                                                type='text'
                                                placeholder='Batch Code'
                                                required
                                                ref={batch}
                                            ></input>
                                        </div>
                                        <br />
                                    </>
                                )}
                                {signup === 'Admin' && (
                                    <>
                                        <div className='form-control'>
                                            <input
                                                className='input w-full input-bordered'
                                                type='text'
                                                placeholder='Department'
                                                required
                                                ref={department}
                                            ></input>
                                        </div>
                                        <br />
                                    </>
                                )}
                                <div className='form-control'>
                                    <input
                                        className='input w-full input-bordered'
                                        type='email'
                                        placeholder='Email'
                                        required
                                        ref={email}
                                    ></input>
                                </div>
                                <br />
                                <div className='form-control'>
                                    <input
                                        className='input w-full input-bordered'
                                        type='password'
                                        placeholder='Password'
                                        required
                                        ref={password}
                                    ></input>
                                </div>
                                <br />
                                <div className='form-control'>
                                    <input
                                        className='input w-full input-bordered'
                                        type='password'
                                        placeholder='Confirm Password'
                                        required
                                        ref={confirmPassword}
                                    ></input>
                                </div>

                                <br />
                                <div className='form-control'>
                                    <button className={` btn btn-primary w-full font-bold ${btnState}`} type='submit'>
                                        Create Account
                                    </button>
                                </div>
                            </>
                        )}
                        <div className='text-sm m-2 text-center font-bold'>
                            Already have an account?&nbsp;
                            <a className='link link-info ' href='/login'>
                                Login!
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default SignUp;
