import axios from 'axios';
import React, { useContext, useRef, useState } from 'react';
import AppContext from '../../Context/AppContext';
import Message from '../../Main/Message';

const AddDepartment = () => {
    const [btnState, setBtnState] = useState('');
    const [department, setDepartment] = useState('');
    const [alert, setAlert] = useState({
        show: false,
    });
    const ctx = useContext(AppContext);

    const emailRef = useRef();
    const departmentRef = useRef();

    const submitForm = async (event) => {
        event.preventDefault();
        setBtnState('loading');
        setAlert({ show: false });
        let token = ctx.token;

        const reqBody = {
            department: departmentRef.current.value,
            email: emailRef.current.value,
        };
        await axios
            .post(`${ctx.baseURL}/users/departments`, reqBody, {
                headers: {
                    Authorization: 'Bearer ' + token,
                },
            })
            .then((response) => {
                setDepartment('');
                setAlert({
                    show: true,
                    type: 'success',
                    message: 'Added Successfully',
                    showBtn: true,
                });
                setTimeout(() => {
                    setAlert({ show: false });
                }, 3000);
            })
            .catch((error) => {
                console.log(error);
                if (error.response) {
                    if (error.response.data.message.includes('department'))
                        setAlert({
                            show: true,
                            type: 'error',
                            message: reqBody.department + ' department already exists',
                            showBtn: true,
                        });
                    else if (error.response.data.message.includes('email'))
                        setAlert({
                            show: true,
                            type: 'error',
                            message: reqBody.email + ' already has an account',
                            showBtn: true,
                        });
                    else
                        setAlert({
                            show: true,
                            type: 'error',
                            message: error.response.data.message,
                            showBtn: true,
                        });
                } else
                    setAlert({
                        show: true,
                        type: 'error',
                        message: error.message,
                        showBtn: true,
                    });
            });
        setBtnState('');
    };

    return (
        <>
            <div className='add-department'>
                <div className='md:p-2 text-xl text-neutral font-medium text-center md:flex-grow border-b-2'>
                    Add Department
                </div>
                <div className='semesters mt-2 flex justify-center'>
                    <div className='rounded shadow-xl p-3 w-11/12 md:w-8/12 lg:w-3/5'>
                        <form className='font-medium w-full' onSubmit={submitForm}>
                            <div className='form-control'>
                                <input
                                    className={ctx.inputClasses}
                                    type='email'
                                    required
                                    ref={emailRef}
                                    placeholder='Department Admin Email'
                                />
                            </div>
                            <br />
                            <div className='form-control'>
                                <select
                                    className='select select-bordered select-sm md:select-md rounded-full'
                                    type='number'
                                    ref={departmentRef}
                                    required
                                    placeholder='Enter department no.'
                                    min='1'
                                >
                                    <option value=''>Select Department</option>
                                    <option value='Agriculture'>Agriculture</option>
                                    <option value='Computer Science'>Computer Science</option>
                                    <option value='Economics'>Economics</option>
                                    <option value='English'>English</option>
                                    <option value='Geology'>Geology</option>
                                    <option value='Management Sciences'>Management Sciences</option>
                                    <option value='Microbiology'>Microbiology</option>
                                    <option value='Pharmacy'>Pharmacy</option>
                                    <option value='Sociology'>Sociology</option>
                                    <option value='Zoology'>Zoology</option>
                                    <option value='PCRS'>PCRS</option>
                                    <option value='Chemistry'>Chemistry</option>
                                    <option value='Physics'>Physics</option>
                                    <option value='Botany'>Botany</option>
                                    <option value='Biotechnology'>Biotechnology</option>
                                    <option value='Law'>Law</option>
                                    <option value='Education'>Education</option>
                                    <option value='Environmental Sciences'>Environmental Sciences</option>
                                    <option value='Geography'>Geography</option>
                                    <option value='Journalism & Mass Communication'>
                                        Journalism & Mass Communication
                                    </option>
                                    <option value='Library & Information Sciences'>
                                        Library & Information Sciences
                                    </option>
                                    <option value='Mathematics'>Mathematics</option>
                                    <option value='Pashto'>Pashto</option>
                                    <option value='Political Science'>Political Science</option>
                                    <option value='Psychology'>Psychology</option>
                                    <option value='Tourism & Hotel Management'>Tourism & Hotel Management</option>
                                    <option value='Urdu'>Urdu</option>
                                    <option value='Islamic & Arabic Studies'>Islamic & Arabic Studies</option>
                                </select>
                            </div>

                            <br />
                            <div className='form-control flex items-center'>
                                <button
                                    className={`btn btn-neutral w-fit rounded-lg btn-sm font-medium ${btnState}`}
                                    type='submit'
                                >
                                    Add Department
                                </button>
                            </div>
                        </form>
                        {alert.show === true && (
                            <div className='my-2'>
                                <Message
                                    type={alert.type}
                                    text={alert.message}
                                    showBtn={alert.showBtn}
                                    hideAlert={() => {
                                        setAlert({ show: false });
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddDepartment;
