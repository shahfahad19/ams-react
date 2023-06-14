import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Message from '../../Main/Message';
import { useForm } from 'react-hook-form';
import AppContext from '../../Context/AppContext';
import SubSectionHeader from '../../Utils/SubSectionHeader';

const EditProfile = () => {
    const ctx = useContext(AppContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const [signup, signupAs] = useState('signup');
    const [btnState, setBtnState] = useState('');
    const [alert, setAlert] = useState(false);
    const [err, setError] = useState('');
    const role = useRef();
    const navigate = useNavigate();
    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        data.role = signup;
        setBtnState('loading');
        axios
            .post(`${ctx.baseURL}/user/updateProfile`, data)
            .then((response) => {
                setBtnState('');
                console.log(response);
            })
            .catch((error) => {
                setBtnState('');
                console.log(error.response.data);
                setError(error.response.data.message);
                setAlert(true);
            });
    };

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
            <div className='flex-grow'>
                <SubSectionHeader text='Edit Profile' />
                <div className='flex justify-center'>
                    <div className='rounded shadow-xl p-3 w-11/12 md:w-8/12 lg:w-3/5'>
                        <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label className='label'>
                                    <span className='label-text'>Name</span>
                                    {errors.name && (
                                        <span className='label-text text-error'>{errors.name.message}</span>
                                    )}
                                </label>
                                <input
                                    className={`input input-bordered w-full ${errors.name && 'input-error'}`}
                                    type='text'
                                    defaultValue={ctx.userData.approved ? ctx.userData.name : ''}
                                    placeholder='Full Name'
                                    {...register('name', {
                                        required: {
                                            value: true,
                                            message: 'Please provide your full name',
                                        },
                                        minLength: {
                                            value: 3,
                                            message: 'Minimum 3 characters required',
                                        },
                                        maxLength: {
                                            value: 20,
                                            message: 'Maximum length is exceeded (20)',
                                        },
                                    })}
                                />
                            </div>
                            <br />
                            <div>
                                <label className='label'>
                                    <span className='label-text'>Email</span>
                                    {errors.email && (
                                        <span className='label-text text-error'>{errors.email.message}</span>
                                    )}
                                </label>
                                <input
                                    className={`input input-bordered w-full ${errors.email && 'input-error'}`}
                                    type='email'
                                    defaultValue={ctx.userData.email}
                                    placeholder='name@example.com'
                                    {...register('email', {
                                        required: {
                                            value: true,
                                            message: 'Please enter your email',
                                        },
                                        pattern: {
                                            value: /^[\S-]+@([\S-]+\.)+\S{2,4}$/g,
                                            message: 'Email is not valid',
                                        },
                                    })}
                                />
                            </div>
                            <br />
                            {ctx.userData.role === 'admin' && (
                                <>
                                    <div>
                                        <label className='label'>
                                            <span className='label-text'>Department</span>
                                            {errors.department && (
                                                <span className='label-text text-error'>
                                                    {errors.department.message}
                                                </span>
                                            )}
                                        </label>
                                        <input
                                            className={`input input-bordered w-full ${
                                                errors.department && 'input-error'
                                            }`}
                                            defaultValue={ctx.userData.department}
                                            type='text'
                                            placeholder='e.g Computer Science'
                                            {...register('department', {
                                                required: {
                                                    value: true,
                                                    message: 'Department name is required',
                                                },
                                                minLength: {
                                                    value: 4,
                                                    message: 'Minimum 4 characters required',
                                                },
                                                maxLength: {
                                                    value: 25,
                                                    message: 'Maximum length is exceeded (25)',
                                                },
                                                pattern: {
                                                    value: /^(?!Department of)/g,
                                                    message: 'Write department name only',
                                                },
                                            })}
                                        />
                                    </div>
                                    <br />
                                </>
                            )}

                            <br />
                            <div className='form-control'>
                                <button className={` btn btn-primary w-full font-bold ${btnState}`} type='submit'>
                                    Update Profile
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
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditProfile;
