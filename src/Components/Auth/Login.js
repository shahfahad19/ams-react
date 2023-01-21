import axios from 'axios';
import React, { useContext, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Link, useNavigate } from 'react-router-dom';
import AppContext from '../Context/AppContext';
import Message from '../Main/Message';

const Login = () => {
    const [login, loginAs] = useState('Login As');
    const [btnState, setBtnState] = useState('');
    const [alert, setAlert] = useState(false);
    const [err, setError] = useState('');
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
    const captcha = useRef();

    const submitForm = async (event) => {
        event.preventDefault();
        setBtnState('loading');
        //const baseURL = 'https://amsapi.vercel.app';
        const baseURL = 'http://localhost:5000';
        const loginData = {
            email: email.current.value,
            password: password.current.value,
        };
        let data = {};
        let code = 0;

        if (role.current.value === 'Admin') {
            await axios
                .post(`${baseURL}/admin/login?token=${captcha.current.getValue()}`, loginData, {
                    credentials: 'include',
                })
                .then((response) => {
                    data = response.data;
                    code = 1;
                })
                .catch((error) => {
                    setError(error.response.data.message.toString());
                    setAlert(true);
                });
        } else if (role.current.value === 'Teacher') {
            await axios
                .post(`${baseURL}/teacher/login?token=${captcha.current.getValue()}`, loginData)
                .then((response) => {
                    data = response.data;
                    code = 2;
                })
                .catch((error) => {
                    console.log(error);
                });
        } else if (role.current.value === 'Student') {
            await axios
                .post(`${baseURL}/student/login?token=${captcha.current.getValue()}`, loginData)
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
        }
        console.log(alert);

        const loggedIn = saveToken(`${data.token}${code}`);

        setBtnState('');
        if (code === 0) {
            setAlert(true);
            return;
        }
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
                                        minLength={8}
                                    ></input>
                                </div>
                                <br />
                                <div className='flex justify-center'>
                                    <ReCAPTCHA
                                        sitekey='6Lc3CBYkAAAAAJU9k9WPIqo5l9lWT4K4J8jhjFip'
                                        required
                                        ref={captcha}
                                    />
                                </div>
                                <br />

                                <div className='form-control'>
                                    <button className={` btn btn-primary w-full font-bold ${btnState}`} type='submit'>
                                        Login
                                    </button>
                                </div>
                            </>
                        )}
                        {alert === true && (
                            <>
                                <br />
                                <Message
                                    type='error'
                                    text={err}
                                    hideAlert={() => {
                                        setAlert(false);
                                    }}
                                    showBtn={true}
                                />
                            </>
                        )}

                        <div className='text-sm m-2 text-center font-bold'>
                            Don't have an account?&nbsp;
                            <Link className='link link-info decoration-transparent' to='/signup'>
                                Signup!
                            </Link>
                            <br />
                            <Link className='link link-error decoration-transparent font-medium' to='/forgot-password'>
                                Forgot Password
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;
