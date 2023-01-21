import axios from 'axios';
import React, { useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../Context/AppContext';
import Message from '../Main/Message';

const Login = () => {
    const [login, loginAs] = useState('Login As');
    const [btnState, setBtnState] = useState('');
    const [showAlert, setAlert] = useState(false);
    const navigate = useNavigate();
    const ctx = useContext(AppContext);
    // REDIRECTING IF USER IS ALREADY LOGGED IN
    if (ctx.isLoggedIn === true) {
        navigate('/');
    }
    ctx.header = 'Login';
    const email = useRef();
    const password = useRef();
    const role = useRef();

    const submitForm = async (event) => {
        event.preventDefault();
        setBtnState('loading');
        const baseURL = 'https://amsapi.vercel.app';
        //const baseURL = 'http://localhost:5000';
        const loginData = {
            email: email.current.value,
            password: password.current.value,
        };
        let data = {};
        let code = 0;

        if (role.current.value === 'Admin') {
            await axios
                .post(`${baseURL}/admin/login`, loginData, {
                    credentials: 'include',
                })
                .then((response) => {
                    data = response.data;
                    code = 1;
                    console.log(data);
                })
                .catch((error) => {
                    console.log(error);
                    return;
                });
        } else if (role.current.value === 'Teacher') {
            await axios
                .post(`${baseURL}/teacher/login`, loginData)
                .then((response) => {
                    data = response.data;
                    code = 2;
                })
                .catch((error) => {
                    console.log(error);
                    setAlert(true);
                });
        } else if (role.current.value === 'Student') {
            await axios
                .post(`${baseURL}/student/login`, loginData)
                .then((response) => {
                    data = response.data;
                    code = 3;
                })
                .catch((error) => {
                    console.log(error.data);
                    setAlert(true);
                });
        } else {
            console.log('error');
            return;
        }

        const loggedIn = saveToken(`${data.token}${code}`);

        setBtnState('');
        if (code === 0) return;
        if (loggedIn === true) {
            ctx.login();
            navigate('/');
        }
    };

    const changeLogin = () => {
        loginAs(role.current.value);
    };

    const saveToken = (token) => {
        if (token !== '') {
            try {
                localStorage.setItem('ams-token', token);
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
            <div className='flex items-center flex-col'>
                <div className='rounded shadow-xl p-3 w-11/12 md:w-8/12 lg:w-3/5'>
                    <div className='font-bold text-2xl text-center mb-3 text-primary'>Login</div>

                    <form className='font-medium w-full' onSubmit={submitForm}>
                        <div className='form-control'>
                            <select
                                className='select w-full select-bordered'
                                name='role'
                                type='role'
                                required
                                ref={role}
                                onChange={changeLogin}
                            >
                                <option>Login As</option>
                                <option>Admin</option>
                                <option>Teacher</option>
                                <option>Student</option>
                            </select>
                        </div>
                        <br />

                        {login !== 'Login As' && (
                            <>
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
                                    <button className={` btn btn-primary w-full font-bold ${btnState}`} type='submit'>
                                        Login
                                    </button>
                                </div>
                            </>
                        )}

                        <div className='text-sm m-2 text-center font-bold'>
                            Don't have an account?&nbsp;
                            <a className='link link-info decoration-transparent' href='/signup'>
                                Signup!
                            </a>
                            <br />
                            <a className='link link-error decoration-transparent font-medium' href='/forgot-password'>
                                Forgot Password
                            </a>
                        </div>
                    </form>
                    {showAlert && (
                        <Message
                            type='warning'
                            text="You haven't added any semesters for this batch"
                            hideAlert={() => {
                                setAlert(false);
                            }}
                            showBtn={true}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default Login;
