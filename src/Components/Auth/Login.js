import axios from 'axios';
import React, { useContext, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Link, useNavigate } from 'react-router-dom';
import AppContext from '../Context/AppContext';
import Message from '../Main/Message';

const Login = () => {
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
        const loginData = {
            email: email.current.value,
            password: password.current.value,
        };
        let data = {};
        await axios
            .post(`${ctx.baseURL}/user/login?token=${captcha.current.getValue()}`, loginData, {
                credentials: 'include',
            })
            .then((response) => {
                data = response.data;
                ctx.isLoggedIn = true;
                ctx.loggedInAs = response.data.data.user.role;
                ctx.userData = response.data.data;
            })
            .catch((error) => {
                console.log(error);
                setError(error.response.data.message.toString());
                setAlert(true);
                window.grecaptcha.reset();
                return;
            });

        const loggedIn = saveToken(`${data.token}`);

        if (loggedIn === true) {
            navigate('/');
        }
    };

    const saveToken = (token) => {
        if (token !== '') {
            try {
                localStorage.setItem('ams-token', token);
                return true;
            } catch (err) {
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
                            <ReCAPTCHA sitekey={ctx.captchaKey} required ref={captcha} />
                        </div>
                        <br />

                        <div className='form-control'>
                            <button className={` btn btn-primary w-full font-bold ${btnState}`} type='submit'>
                                Login
                            </button>
                        </div>
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
