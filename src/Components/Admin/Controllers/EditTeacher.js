import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Message from '../../Main/Message';
import SubSectionHeader from '../../Utils/SubSectionHeader';

const EditTeacher = (props) => {
    const [subject, setSubject] = useOutletContext();
    const [btnState, setBtnState] = useState();
    const [assignbtnState, setassignBtnState] = useState();
    const [dltbtnState, setdltBtnState] = useState();
    const params = useParams();
    const teacherEmail = useRef();
    const [alert, setAlert] = useState({
        show: false,
    });
    const [teacherAlert, setTeacherAlert] = useState({
        show: false,
        search: false,
    });
    const [teacher, setTeacher] = useState({
        show: false,
    });
    const ctx = useContext(AppContext);

    useEffect(() => {
        setTeacherAlert({
            show: false,
        });
        if (subject.teacher === undefined || subject.teacher === null) {
            setTeacherAlert({
                show: true,
            });
        } else {
            setTeacher({
                show: true,
                search: false,
                data: subject.teacher,
            });
        }
    }, []);

    const submitForm = async (event) => {
        event.preventDefault();
        setTeacher({
            show: false,
        });
        setAlert({
            show: false,
        });
        setBtnState('loading');
        await axios
            .get(`${ctx.baseURL}/users/teachers?email=${teacherEmail.current.value}`, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + ctx.token,
                },
            })
            .then((response) => {
                if (response.data.results > 0) {
                    setTeacher({
                        show: true,
                        search: true,
                        data: response.data.data.teachers[0],
                    });
                } else {
                    setAlert({
                        show: true,
                        type: 'error',
                        message: 'No teacher was found with this email',
                        showBtn: true,
                    });
                }
            })
            .catch((error) => {
                setAlert({
                    show: true,
                    type: 'error',
                    message: error.response.data.message,
                    showBtn: true,
                });
            });
        setBtnState('');
    };

    const assignTeacher = async () => {
        setassignBtnState('loading');
        await axios
            .patch(
                `${ctx.baseURL}/subjects/${params.subjectId}`,
                {
                    teacher: teacher.data._id,
                },
                {
                    credentials: 'include',
                    headers: {
                        Authorization: 'Bearer ' + ctx.token,
                    },
                }
            )
            .then((response) => {
                setSubject(response.data.data.subject);
                setAlert({
                    show: true,
                    type: 'success',
                    message: 'Teacher assigned successfully',
                    showBtn: true,
                });
                setTeacherAlert({ show: false });
                setTeacher({
                    show: true,
                    search: false,
                    data: teacher.data,
                });
            })
            .catch((error) => {
                setAlert({
                    show: true,
                    type: 'error',
                    message: error.response.data.message,
                    showBtn: true,
                });
            });
        setassignBtnState('');
    };

    const removeTeacher = async () => {
        setdltBtnState('loading');
        await axios
            .patch(
                `${ctx.baseURL}/subjects/${params.subjectId}`,
                {
                    teacher: null,
                },
                {
                    credentials: 'include',
                    headers: {
                        Authorization: 'Bearer ' + ctx.token,
                    },
                }
            )
            .then((response) => {
                setSubject(response.data.data.subject);
                setTeacher({
                    show: false,
                });
                setTeacherAlert({
                    show: true,
                });

                setAlert({
                    show: true,
                    type: 'success',
                    message: 'Teacher removed successfully',
                    showBtn: true,
                });
            })
            .catch((error) => {
                console.log(error);
                setAlert({
                    show: true,
                    type: 'error',
                    message: error.response.data.message,
                    showBtn: true,
                });
            });
        setdltBtnState('');
    };

    return (
        <div className='flex-grow'>
            <SubSectionHeader text='Teacher' />
            {subject.name && (
                <div className='flex justify-center'>
                    <div className='rounded shadow-xl p-3 w-11/12 md:w-8/12 lg:w-3/5'>
                        {teacherAlert.show && (
                            <form className='font-medium w-full' onSubmit={submitForm}>
                                <div className='form-control'>
                                    <label className='label'>Teacher Email</label>
                                    <div className='flex justify-between items-center border border-solid rounded-full border-neutral'>
                                        <input
                                            className='input rounded-full w-full border-none focus:outline-none active:outline-none outline-none'
                                            type='email'
                                            ref={teacherEmail}
                                            required
                                            placeholder='name@example.com'
                                        ></input>
                                        <button className={`btn rounded-full ${btnState}`} type='submit'>
                                            Search
                                        </button>
                                    </div>
                                </div>
                                <br />
                                <div className='form-control flex items-center'></div>
                            </form>
                        )}

                        {teacher.show && teacher.search && (
                            <div className='border border-base rounded-lg'>
                                <table className='table'>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <label tabIndex={0} className='rounded-full avatar'>
                                                    <div className='w-10 rounded-full'>
                                                        <img src={teacher.data.photo} alt='profile_pic' />
                                                    </div>
                                                </label>
                                            </td>
                                            <td className='w-full'>{teacher.data.name}</td>
                                            <td>
                                                <button
                                                    onClick={assignTeacher}
                                                    className={`btn btn-sm rounded-full ${assignbtnState}`}
                                                >
                                                    Assign
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {teacher.show && !teacher.search && (
                            <div className='border border-base rounded-lg p-4'>
                                <div className='flex flex-col sm:flex-row items-center space-x-5'>
                                    <div className='flex items-center space-x-5'>
                                        <div>
                                            <label tabIndex={0} className='rounded-full avatar'>
                                                <div className='w-10 rounded-full'>
                                                    <img src={teacher.data.photo} alt='profile_pic' />
                                                </div>
                                            </label>
                                        </div>
                                        <div>{teacher.data.name}</div>
                                    </div>
                                    <div>{teacher.data.email}</div>
                                </div>
                                <br />

                                <div className='w-full flex justify-center'>
                                    <div>
                                        <button onClick={removeTeacher} className={`${ctx.btnClasses} ${dltbtnState}`}>
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

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
            )}
        </div>
    );
};

export default EditTeacher;
