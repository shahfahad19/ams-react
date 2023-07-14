import axios from 'axios';
import React, { useContext, useRef, useState } from 'react';
import AppContext from '../../Context/AppContext';
import BackButton from '../../Utils/BackButton';
import DepartmentName from '../Department/DepartmentName';
import {
    FormControl,
    FormField,
    FormGroup,
    FormLabel,
    FormLabelAlt,
    FormSubmitBtn,
    FormTitle,
    FormWrapper,
} from '../../Utils/Form';
import Alert from '../../Utils/Alert';
import { BreadCrumb, BreadCrumbs } from '../../Utils/BreadCrumbs';
import { useForm } from 'react-hook-form';

const AddTeacher = () => {
    const [btnState, setBtnState] = useState('');

    const ctx = useContext(AppContext);

    const [alert, setAlert] = useState({ show: false });
    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const submitForm = async (data) => {
        setBtnState('btn-loading');

        setAlert({ show: false });

        let token = ctx.token;
        await axios
            .post(`${ctx.baseURL}/users/teachers`, data, {
                headers: {
                    Authorization: 'Bearer ' + token,
                },
            })
            .then((response) => {
                reset();
                setAlert({
                    show: true,
                    type: 'success',
                    text: 'Teacher added successfully',
                });
            })
            .catch((error) => {
                let errorMessage = error.message;
                if (error.response) {
                    if (error.response.data.error.code === 11000)
                        errorMessage = 'This email is linked to another account';
                    else errorMessage = error.response.data.message;
                }
                setAlert({
                    show: true,
                    type: 'error',
                    text: errorMessage,
                });
            });
        setBtnState('');
    };

    return (
        <>
            <DepartmentName name={ctx.userData.department} />
            <BreadCrumbs>
                <BreadCrumb to='/'>Home</BreadCrumb>
                <BreadCrumb to='../teachers'>Teachers</BreadCrumb>
                <BreadCrumb>Add Teacher</BreadCrumb>
            </BreadCrumbs>
            <FormWrapper>
                <form className='font-medium w-full' onSubmit={handleSubmit(submitForm)}>
                    <FormTitle>Add Teacher</FormTitle>
                    <FormGroup>
                        <FormField>
                            <FormLabel>Teacher Name</FormLabel>
                            <FormControl>
                                <input
                                    className={`${ctx.inputClasses}${errors.name ? ' input-error' : ''}`}
                                    type='text'
                                    placeholder="Enter Teacher's Name"
                                    {...register('name', {
                                        required: {
                                            value: true,
                                            message: 'Teacher name required',
                                        },
                                        minLength: {
                                            value: 3,
                                            message: 'Minimum 3 characters required',
                                        },
                                        maxLength: {
                                            value: 35,
                                            message: 'Maximum length is exceeded (35)',
                                        },
                                    })}
                                />
                            </FormControl>
                            {errors.name && <FormLabelAlt>{errors.name.message}</FormLabelAlt>}
                        </FormField>

                        <FormField>
                            <FormLabel>Teacher Email</FormLabel>
                            <FormControl>
                                <input
                                    className={`${ctx.inputClasses}${errors.email ? ' input-error' : ''}`}
                                    type='email'
                                    placeholder="Enter Teacher's Email"
                                    {...register('email', {
                                        required: {
                                            value: true,
                                            message: 'Email required',
                                        },
                                        pattern: {
                                            value: /^[\S-]+@([\S-]+\.)+\S{2,4}$/g,
                                            message: 'Email is not valid',
                                        },
                                    })}
                                />
                            </FormControl>
                            {errors.email && <FormLabelAlt>{errors.email.message}</FormLabelAlt>}
                        </FormField>

                        <FormField>
                            <FormLabel>Designation</FormLabel>
                            <FormControl>
                                <select
                                    className={`${ctx.selectClasses}${errors.designation ? ' select-error' : ''}`}
                                    {...register('designation', {
                                        required: {
                                            value: true,
                                            message: 'Designation required',
                                        },
                                    })}
                                >
                                    <option value=''>Select Designation</option>
                                    <option value='Assistant Professor'>Assistant Professor</option>
                                    <option value='Associate Professor'>Associate Professor</option>
                                    <option value='Lecturer'>Lecturer</option>
                                </select>
                            </FormControl>
                            {errors.designation && <FormLabelAlt>{errors.designation.message}</FormLabelAlt>}
                        </FormField>

                        <FormField>
                            <FormLabel>Gender</FormLabel>
                            <FormControl>
                                <select
                                    className={`${ctx.selectClasses}${errors.gender ? ' select-error' : ''}`}
                                    {...register('gender', {
                                        required: {
                                            value: true,
                                            message: 'Gender required',
                                        },
                                    })}
                                >
                                    <option value=''>Gender</option>
                                    <option value='male'>Male</option>
                                    <option value='female'>Female</option>
                                </select>
                            </FormControl>
                            {errors.gender && <FormLabelAlt>{errors.gender.message}</FormLabelAlt>}
                        </FormField>

                        <FormSubmitBtn className={btnState}>Add Teacher</FormSubmitBtn>
                    </FormGroup>
                </form>

                <Alert
                    alert={alert}
                    closeAlert={() => {
                        setAlert({ show: false });
                    }}
                />
                <BackButton to='/admin/teachers' text='Teachers List' />
            </FormWrapper>
        </>
    );
};

export default AddTeacher;
