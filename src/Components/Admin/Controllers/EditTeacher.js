import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Message from '../../Main/Message';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import Table from '../../Utils/Table';

const EditTeacher = (props) => {
    const [teachers, setTeachers] = useState([]);
    const [loading, isLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [subject, setSubject] = useOutletContext();
    const [assignbtnState, setassignBtnState] = useState();
    const [dltbtnState, setdltBtnState] = useState();
    const params = useParams();
    const [alert, setAlert] = useState({
        show: false,
    });
    const [showTeacherList, setTeacherListShow] = useState(false);
    const [teacher, setTeacher] = useState({
        show: false,
    });
    const ctx = useContext(AppContext);

    useEffect(() => {
        setTeacherListShow(false);
        if (subject.teacher === undefined || subject.teacher === null) {
            setTeacherListShow(true);
            axios
                .get(`${ctx.baseURL}/users/teachers?sort=name`, {
                    credentials: 'include',
                    headers: {
                        Authorization: 'Bearer ' + ctx.token,
                    },
                })
                .then((response) => {
                    setErrorMessage('');
                    isLoading(false);
                    setTeachers(response.data.data.teachers);
                    if (response.data.data.teachers.length === 0) {
                        setErrorMessage('No teachers found');
                    }
                })
                .catch((error) => {
                    if (error.response) setErrorMessage(error.response.data.message);
                    else setErrorMessage(error.message);
                    isLoading(false);
                    console.log(error);
                });
        } else {
            setTeacher({
                show: true,
                search: false,
                data: subject.teacher,
            });
        }
    }, []);

    const assignTeacher = async (teacherId) => {
        setassignBtnState('loading');
        await axios
            .patch(
                `${ctx.baseURL}/subjects/${params.subjectId}`,
                {
                    teacher: teacherId,
                },
                {
                    credentials: 'include',
                    headers: {
                        Authorization: 'Bearer ' + ctx.token,
                    },
                }
            )
            .then((response) => {
                console.log(response);
                setSubject(response.data.data.subject);
                setAlert({
                    show: true,
                    type: 'success',
                    message: 'Teacher assigned successfully',
                    showBtn: true,
                });
                setTeacherListShow(false);
                setTeacher({
                    show: true,
                    search: false,
                    data: response.data.data.subject.teacher,
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
                setTeacherListShow(true);

                setAlert({
                    show: true,
                    type: 'success',
                    message: 'Teacher removed successfully',
                    showBtn: true,
                });
                axios
                    .get(`${ctx.baseURL}/users/teachers?sort=name`, {
                        credentials: 'include',
                        headers: {
                            Authorization: 'Bearer ' + ctx.token,
                        },
                    })
                    .then((response) => {
                        setErrorMessage('');
                        isLoading(false);
                        setTeachers(response.data.data.teachers);
                        if (response.data.data.teachers.length === 0) {
                            setErrorMessage('No teachers found');
                        }
                    })
                    .catch((error) => {
                        if (error.response) setErrorMessage(error.response.data.message);
                        else setErrorMessage(error.message);
                        isLoading(false);
                        console.log(error);
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
            {showTeacherList && (
                <>
                    <div className='p-2 font-semibold text-center text-xl'>Assign a teacher from the list</div>
                    <Table loading={loading} error={errorMessage} className='table-compact'>
                        <thead>
                            <tr>
                                <th></th>
                                <th></th>
                                <th className='normal-case font-medium text-sm'>Name</th>
                                <th className='normal-case font-medium text-sm'>Gender</th>
                                <th className='normal-case font-medium text-sm'>Designation</th>
                                <th className='normal-case font-medium text-sm'>Assign</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teachers.length > 0 &&
                                teachers.map((teacher, index) => {
                                    return (
                                        <tr key={index} className=''>
                                            <th>{index + 1}</th>
                                            <td>
                                                <label tabIndex={0} className='rounded-full avatar'>
                                                    <div className='w-10 rounded-full'>
                                                        <img src={teacher.photo} alt='profile_pic' />
                                                    </div>
                                                </label>
                                            </td>
                                            <td>{teacher.name}</td>
                                            <td>{teacher.gender}</td>
                                            <td>{teacher.designation}</td>
                                            <td>
                                                <button
                                                    onClick={() => {
                                                        assignTeacher(teacher._id);
                                                    }}
                                                    className={`btn btn-sm rounded-full ${assignbtnState}`}
                                                >
                                                    Assign
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </Table>
                </>
            )}
            {subject.name && (
                <div className='flex justify-center'>
                    <div className='rounded shadow-xl p-3 w-11/12 md:w-8/12 lg:w-3/5'>
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
