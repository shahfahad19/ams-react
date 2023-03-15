import axios from 'axios';
import React, { useContext, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Link } from 'react-router-dom';
import AppContext from '../Context/AppContext';

const ForgotPassword = () => {
    const [btnState, setBtnState] = useState('');

    const ctx = useContext(AppContext);

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

        await axios
            .post(`${ctx.baseURL}/user/forgotPassword?token=${captcha.current.getValue()}`, loginData)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });

        setBtnState('');
    };

    return (
        <>
            <div className='flex items-center flex-col'>
                <div className='rounded-xl shadow-xl p-3 w-11/12 md:w-4/12'>
                    <div className='font-medium text-2xl text-center mb-3 text-primary'>Reset Password</div>

                    <form className='font-medium w-full' onSubmit={submitForm}>
                        <div className='form-control'>
                            <input
                                className='input w-full input-bordered rounded-full border-neutral'
                                type='email'
                                placeholder='Email'
                                required
                                ref={email}
                            ></input>
                        </div>
                        <br />
                        <div className='flex justify-center'>
                            <ReCAPTCHA sitekey={ctx.captchaKey} required ref={captcha} />
                        </div>
                        <br />

                        <div className='form-control flex items-center'>
                            <button
                                className={` btn btn-neutral btn-sm rounded-lg w-fit font-bold ${btnState}`}
                                type='submit'
                            >
                                Reset
                            </button>
                        </div>

                        <div className='text-sm m-2 text-center font-bold'>
                            <Link className='link link-info ' to='/signup'>
                                Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;
