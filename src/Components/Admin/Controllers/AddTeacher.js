import axios from 'axios';
import React, { useContext, useRef, useState } from 'react';
import AppContext from '../../Context/AppContext';
import BackButton from '../../Utils/BackButton';

const AddTeacher = () => {
    const [btnState, setBtnState] = useState('');

    const ctx = useContext(AppContext);

    const name = useRef();
    const designation = useRef();
    const email = useRef();
    const gender = useRef();

    const submitForm = async (event) => {
        event.preventDefault();
        const formData = {
            name: name.current.value,
            designation: designation.current.value,
            email: email.current.value,
            gender: gender.current.value,
            department: ctx.userData.department,
            departmentId: ctx.userData._id,
        };
        setBtnState('loading');
        let token = ctx.token;
        await axios
            .post(`${ctx.baseURL}/users/teachers`, formData, {
                headers: {
                    Authorization: 'Bearer ' + token,
                },
            })
            .then((response) => {
                name.current.value = '';
                gender.current.value = '';
                email.current.value = '';
                designation.current.value = '';
                ctx.showSwal(1, 'Teacher added successfully!');
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.data.error.code === 11000)
                        ctx.showSwal(0, 'This email is linked to another account');
                    else ctx.showSwal(0, error.response.data.message);
                } else ctx.showSwal(0, error.message);
            });
        setBtnState('');
    };

    return (
        <>
            <div className='add-teacher'>
                <div className='md:p-2 text-xl text-neutral font-medium text-center md:flex-grow border-b-2'>
                    Add Teacher
                </div>
                <div className='semesters mt-2 flex justify-center'>
                    <div className='rounded shadow-xl p-3 w-11/12 md:w-8/12 lg:w-3/5'>
                        <form className='font-medium w-full' onSubmit={submitForm}>
                            <div className='form-control'>
                                <input
                                    className={ctx.inputClasses}
                                    ref={name}
                                    type='text'
                                    required
                                    placeholder="Enter Teacher's Name"
                                />
                            </div>

                            <br />
                            <div className='form-control'>
                                <input
                                    className={ctx.inputClasses}
                                    ref={email}
                                    type='email'
                                    required
                                    placeholder="Enter Teacher's Email"
                                />
                            </div>

                            <br />

                            <div className='form-control'>
                                <select ref={designation} className={ctx.selectClasses} required>
                                    <option value=''>Select Designation</option>
                                    <option value='Assistant Professor'>Assistant Professor</option>
                                    <option value='Associate Professor'>Associate Professor</option>
                                    <option value='Lecturer'>Lecturer</option>
                                </select>
                            </div>

                            <br />

                            <div className='form-control'>
                                <select ref={gender} className={ctx.selectClasses} required>
                                    <option value=''>Gender</option>
                                    <option value='male'>Male</option>
                                    <option value='female'>Female</option>
                                </select>
                            </div>

                            <br />
                            <div className='form-control flex items-center'>
                                <button className={`${ctx.btnClasses} ${btnState}`} type='submit'>
                                    Add teacher
                                </button>
                            </div>
                        </form>

                        <BackButton to='/admin/teachers' text='Teachers List' className='text-sm' />
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddTeacher;
