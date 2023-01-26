import axios from 'axios';
import React, { useContext, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Link, useNavigate } from 'react-router-dom';
import AppContext from '../Context/AppContext';
import Message from '../Main/Message';

const SignUp = () => {
    const [signup, signupAs] = useState('Signup As');
    const [btnState, setBtnState] = useState('');
    const [alert, setAlert] = useState(false);
    const [err, setError] = useState('');

    const navigate = useNavigate();
    const name = useRef();
    const email = useRef();
    const rollno = useRef();
    const batch = useRef();
    const department = useRef();
    const password = useRef();
    const confirmPassword = useRef();
    const role = useRef();
    const captcha = useRef();

    const ctx = useContext(AppContext);

    // REDIRECTING IF USER IS ALREADY LOGGED IN
    if (ctx.isLoggedIn === true) {
        navigate('/');
    }

    const submitForm = (event) => {
        event.preventDefault();
        setBtnState('loading');

        let data = {
            name: name.current.value,
            email: email.current.value,
            role: role.current.value.toLowerCase(),
            department: undefined,
            rollNo: undefined,
            batchCode: undefined,
            password: password.current.value,
            passwordConfirm: confirmPassword.current.value,
        };
        if (role.current.value === 'Student') {
            data.batchCode = batch.current.value;
            data.rollNo = rollno.current.value;
        } else if (role.current.value === 'Admin') {
            data.department = department.current.value;
        }

        axios
            .post(`${ctx.baseURL}/user/signup?token=${captcha.current.getValue()}`, data)
            .then((response) => {
                setBtnState('');
                data = response.data;
                ctx.isLoggedIn = true;
                ctx.loggedInAs = response.data.data.user.role;
                ctx.userData = response.data.data;
                const signedup = saveToken(`${data.token}`);
                if (signedup) {
                    navigate('/');
                } else {
                    setError(`Account created but couldn't login`);
                    setAlert(true);
                }
            })
            .catch((error) => {
                setBtnState('');
                console.log(error.response.data);
                setError(error.response.data.message);
                setAlert(true);
                window.grecaptcha.reset();
            });
    };

    const changeSignup = () => {
        signupAs(role.current.value);
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
                                        minLength={3}
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
                                                minLength={4}
                                                maxLength={4}
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
                                        minLength={8}
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
                                        Create Account
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
                            Already have an account?&nbsp;
                            <Link className='link link-info ' to='/login'>
                                Login!
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default SignUp;
