import axios from 'axios';
import React, { useContext, useRef, useState } from 'react';
import Message from '../../Main/Message';
import AppContext from '../../Context/AppContext';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import { useForm } from 'react-hook-form';

const UpdatePassword = () => {
    const ctx = useContext(AppContext);
    const [btnState, setBtnState] = useState('');
    const [alert, setAlert] = useState({
        show: false,
    });

    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const oldpass = useRef();
    const newpass = useRef();
    const newpassagain = useRef();

    const submitForm = (data) => {
        setAlert({
            show: false,
        });
        setBtnState('loading');
        axios
            .patch(`${ctx.baseURL}/user/updatePassword`, data, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + ctx.token,
                },
            })
            .then((response) => {
                setBtnState('');
                setAlert({
                    show: true,
                    type: 'success',
                    message: 'Updated successfully!',
                });
            })
            .catch((error) => {
                setBtnState('');
                console.log(error);
                setAlert({
                    show: true,
                    type: 'error',
                    message: error.response.data.message,
                });
                //window.grecaptcha.reset();
            });
    };

    return (
        <>
            <div className='flex-grow'>
                <SubSectionHeader text='Update Password' />
                <div className='flex justify-center'>
                    <div className='rounded shadow-xl p-3 w-11/12 md:w-8/12 lg:w-3/5'>
                        <form className='w-full' onSubmit={handleSubmit(submitForm)}>
                            <div>
                                <label className='label'>
                                    <span className='label-text'>Current Password</span>
                                    {errors.passwordCurrent && (
                                        <span className='label-text text-error'>{errors.passwordCurrent.message}</span>
                                    )}
                                </label>
                                <input
                                    className={`input input-bordered w-full border-neutral rounded-full ${
                                        errors.passwordCurrent && 'input-error'
                                    }`}
                                    type='password'
                                    placeholder='********'
                                    {...register('passwordCurrent', {
                                        required: {
                                            value: true,
                                            message: 'Current Password is required',
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
                                    <span className='label-text'>New Password</span>
                                    {errors.password && (
                                        <span className='label-text text-error'>{errors.password.message}</span>
                                    )}
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
                                            message: 'Enter new password',
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
                                    <span className='label-text'>Re-enter Password</span>
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
                                            message: 'Enter new password again',
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

                            <br />
                            <div className='form-control flex items-center'>
                                <button
                                    className={` btn btn-neutral font-medium btn-sm rounded-lg w-fit ${btnState}`}
                                    type='submit'
                                >
                                    Update Password
                                </button>
                            </div>
                            {alert.show === true && (
                                <div className='my-2'>
                                    <Message type={alert.type} text={alert.message} showBtn={false} />
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpdatePassword;
