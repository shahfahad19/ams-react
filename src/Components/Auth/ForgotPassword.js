import axios from 'axios';
import React, { useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const ForgotPassword = () => {
    const [account, setAccount] = useState('Change Account');
    const [btnState, setBtnState] = useState('');

    const email = useRef();
    const password = useRef();
    const role = useRef();
    const captcha = useRef();

    const submitForm = async (event) => {
        event.preventDefault();
        setBtnState('loading');
        const baseURL = process.env.REACT_APP_API;

        const loginData = {
            email: email.current.value,
            password: password.current.value,
        };

        if (role.current.value === 'Admin') {
            await axios
                .post(`${baseURL}/admin/forgotPassword?token=${captcha.current.getValue()}`, loginData)
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    console.log(error);
                });
        } else if (role.current.value === 'Teacher') {
            await axios
                .post(`${baseURL}/teacher/forgotPassword?token=${captcha.current.getValue()}`, loginData)
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    console.log(error);
                });
        } else if (role.current.value === 'Student') {
            await axios
                .post(`${baseURL}/student/forgotPassword?token=${captcha.current.getValue()}`, loginData)
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            console.log('error');
        }
        setBtnState('');
    };

    const changeAccount = () => {
        setAccount(role.current.value);
    };

    return (
        <>
            <div className='flex items-center flex-col'>
                <div className='rounded shadow-xl p-3 w-11/12 md:w-8/12 lg:w-3/5'>
                    <div className='font-bold text-2xl text-center mb-3 text-primary'>Reset Password</div>

                    <form className='font-medium w-full' onSubmit={submitForm}>
                        <div className='form-control'>
                            <select
                                className='select w-full select-bordered'
                                name='role'
                                type='role'
                                required
                                ref={role}
                                onChange={changeAccount}
                            >
                                <option>Account Type</option>
                                <option>Admin</option>
                                <option>Teacher</option>
                                <option>Student</option>
                            </select>
                        </div>
                        <br />

                        {account !== 'Account Type' && (
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
                                <div className='flex justify-center'>
                                    <ReCAPTCHA sitekey={process.env.REACT_APP_CAPTCHA_KEY} required ref={captcha} />
                                </div>
                                <br />

                                <div className='form-control'>
                                    <button className={` btn btn-primary w-full font-bold ${btnState}`} type='submit'>
                                        Reset
                                    </button>
                                </div>
                            </>
                        )}

                        <div className='text-sm m-2 text-center font-bold'>
                            <a className='link link-info ' href='/signup'>
                                Login
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;
