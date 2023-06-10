import React, { useContext, useRef, useState } from 'react';
import Message from '../Main/Message';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import AppContext from '../Context/AppContext';
import { useSearchParams } from 'react-router-dom';

const SignupAsTeacher = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const ctx = useContext(AppContext);
    const [btnState, setBtnState] = useState('');
    const [alert, setAlert] = useState(false);
    const [err, setError] = useState('');
    const captcha = useRef();
    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const submitForm = (data) => {
        setBtnState('loading');
        axios
            .post(`${ctx.baseURL}/user/signup?token=${captcha.current.getValue()}`, data)
            .then((response) => {
                setBtnState('');
                data = response.data;

                const signedup = saveToken(`${data.token}`);
                if (signedup) {
                    window.location.assign('/');
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

    let code = searchParams.get('code');

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
            <form className='flex flex-col space-y-2' onSubmit={handleSubmit(submitForm)}>
                <div>
                    <label className='label'>
                        <span className='label-text'>Name</span>
                        {errors.name && <span className='label-text text-error'>{errors.name.message}</span>}
                    </label>
                    <input
                        className={`input input-bordered w-full border-neutral rounded-full ${
                            errors.name && 'input-error'
                        }`}
                        type='text'
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

                <div>
                    <label className='label'>
                        <span className='label-text'>Email</span>
                        {errors.email && <span className='label-text text-error'>{errors.email.message}</span>}
                    </label>
                    <input
                        className={`input input-bordered w-full border-neutral rounded-full ${
                            errors.email && 'input-error'
                        }`}
                        type='email'
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

                <div>
                    <label className='label'>
                        <span className='label-text'>Gender</span>
                        {errors.gender && <span className='label-text text-error'>{errors.gender.message}</span>}
                    </label>
                    <select
                        className={`select select-bordered w-full font-normal border-neutral rounded-full ${
                            errors.gender && 'input-error'
                        }`}
                        {...register('gender', {
                            required: {
                                value: true,
                                message: 'Please select your gender',
                            },
                        })}
                    >
                        <option value=''>Select your gender</option>
                        <option value='male'>Male</option>
                        <option value='female'>Female</option>
                    </select>
                </div>

                <div>
                    <label className='label'>
                        <span className='label-text'>Department</span>
                        {errors.department && (
                            <span className='label-text text-error'>{errors.department.message}</span>
                        )}
                    </label>
                    <select
                        className={`select select-bordered w-full font-normal border-neutral rounded-full ${
                            errors.department && 'input-error'
                        }`}
                        {...register('department', {
                            required: {
                                value: true,
                                message: 'Please select a department',
                            },
                        })}
                    >
                        <option value=''>Select a department</option>
                        <option value='Computer Science'>Computer Science</option>
                        <option value='Engineering'>Engineering</option>
                    </select>
                </div>

                <div>
                    <label className='label'>
                        <span className='label-text'>Designation</span>
                        {errors.designation && (
                            <span className='label-text text-error'>{errors.designation.message}</span>
                        )}
                    </label>
                    <select
                        className={`select select-bordered w-full font-normal border-neutral rounded-full ${
                            errors.designation && 'input-error'
                        }`}
                        {...register('designation', {
                            required: {
                                value: true,
                                message: 'Please select a designation',
                            },
                        })}
                    >
                        <option value=''>Select your designation</option>
                    </select>
                </div>

                <div>
                    <label className='label'>
                        <span className='label-text'>Password</span>
                        {errors.password && <span className='label-text text-error'>{errors.password.message}</span>}
                    </label>
                    <input
                        className={`input input-bordered w-full border-neutral rounded-full ${
                            errors.password && 'input-error'
                        }`}
                        type='password'
                        placeholder='********'
                        {...register('password', {
                            required: {
                                value: true,
                                message: 'Password is required',
                            },
                            minLength: {
                                value: 6,
                                message: 'Password should at least be be 6 characters',
                            },
                            maxLength: {
                                value: 25,
                                message: 'Maximum length of password exceeded (25)',
                            },
                        })}
                    />
                </div>

                <div>
                    <label className='label'>
                        <span className='label-text'>Confirm Password</span>
                        {errors.passwordConfirm && (
                            <span className='label-text text-error'>{errors.passwordConfirm.message}</span>
                        )}
                    </label>
                    <input
                        className={`input input-bordered w-full border-neutral rounded-full ${
                            errors.passwordConfirm && 'input-error'
                        }`}
                        type='password'
                        placeholder='********'
                        {...register('passwordConfirm', {
                            required: {
                                value: true,
                                message: 'Enter password again',
                            },
                            validate: (val) => {
                                if (watch('password') !== val) {
                                    return 'Passwords do no match';
                                }
                            },
                        })}
                    />
                </div>

                <div className='flex justify-center'>
                    <ReCAPTCHA
                        theme={ctx.theme === 'dark' ? 'dark' : 'light'}
                        sitekey={ctx.captchaKey}
                        required
                        ref={captcha}
                    />
                </div>

                <div className='form-control flex items-center'>
                    <button
                        className={` btn btn-sm btn-neutral w-fit font-medium rounded-lg ${btnState}`}
                        type='submit'
                    >
                        Create Account
                    </button>
                </div>
            </form>
            {alert === true && (
                <>
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
        </>
    );
};

export default SignupAsTeacher;
