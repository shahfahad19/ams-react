import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Message from '../../Main/Message';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import Table from '../../Utils/Table';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

const EditTeacher = (props) => {
    const [teachers, setTeachers] = useState([]);
    const [data, setData] = useState([]);

    const [loading, isLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [subject, setSubject] = useOutletContext();
    const params = useParams();
    const MySwal = withReactContent(Swal);
    const department = useRef();
    const [alert, setAlert] = useState({
        show: false,
    });
    const [teacher, setTeacher] = useState({
        show: false,
    });
    const ctx = useContext(AppContext);

    useEffect(() => {
        if (subject.teacher === undefined || subject.teacher === null) {
            axios
                .get(`${ctx.baseURL}/users/teachersByDepartments`, {
                    credentials: 'include',
                    headers: {
                        Authorization: 'Bearer ' + ctx.token,
                    },
                })
                .then((response) => {
                    changeTeachers(0);
                    isLoading(false);
                    setData(response.data.data.teachers);
                })
                .catch((error) => {
                    if (error.response) setErrorMessage(error.response.data.message);
                    else setErrorMessage(error.message);
                    isLoading(false);
                    console.log(error);
                })
                .finally(() => {});
        } else {
            setTeacher({
                show: true,
                search: false,
                data: subject.teacher,
            });
        }
    }, [subject]);

    const assignTeacher = async (teacherId) => {
        MySwal.fire({
            title: 'Assigning Teacher',
            allowOutsideClick: false,
            didOpen: () => {
                MySwal.showLoading();
                axios
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
                        MySwal.close();

                        console.log(response);
                        setSubject(response.data.data.subject);
                        MySwal.fire({
                            icon: 'success',
                            title: 'Success!',
                            text: 'Teacher assigned successfully',
                        });
                        setTeacher({
                            show: true,
                            search: false,
                            data: response.data.data.subject.teacher,
                        });
                    })
                    .catch((error) => {
                        MySwal.close();
                        MySwal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: 'Something went wrong',
                        });
                    });
            },
        });
    };

    const removeTeacher = async () => {
        MySwal.fire({
            title: 'Are you sure?',
            text: 'Do you want to remove this teacher from the subject?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel!',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                MySwal.fire({
                    title: 'Removing',
                    allowOutsideClick: false,
                    didOpen: () => {
                        MySwal.showLoading();

                        axios
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
                                MySwal.close();

                                setSubject(response.data.data.subject);
                                setTeacher({
                                    show: false,
                                });

                                MySwal.fire({
                                    icon: 'success',
                                    title: 'Success!',
                                    text: 'Teacher removed successfully',
                                });
                            })
                            .catch((error) => {
                                MySwal.close();

                                let errorMessage = '';
                                if (error.response) errorMessage = error.response.data.message;
                                errorMessage = error.message;
                                if (error.response)
                                    MySwal.fire({
                                        icon: 'error',
                                        title: 'Error!',
                                        text: errorMessage,
                                    });
                            });
                    },
                });
            }
        });
    };

    const changeTeachers = (event) => {
        setErrorMessage('');

        let dataIndex = '';
        try {
            dataIndex = event.target.value;
        } catch (error) {
            dataIndex = '';
        }
        if (dataIndex === '') {
            setTeachers([]);
            setErrorMessage('Select a department to view its teachers');
            return;
        }
        setTeachers(data[dataIndex].teachers);
    };

    return (
        <div className='flex-grow'>
            <SubSectionHeader text='Teacher' />
            {!subject.name && (
                <div className='mt-12 flex items-center justify-center'>
                    <div className='loader'></div>
                </div>
            )}
            {subject.name && subject.teacher == (undefined || null) && (
                <>
                    <div className='p-2 font-semibold text-center text-xl'>Assign a teacher from the list</div>
                    <select ref={department} className={ctx.selectClasses + ' mb-2'} onChange={changeTeachers}>
                        <option value=''>Select department</option>
                        {data.map((teacher, index) => {
                            return (
                                <option value={index} key={teacher.departmentName}>
                                    {teacher.departmentName}
                                </option>
                            );
                        })}
                    </select>

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
                                                    className={`btn btn-sm rounded-full`}
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
            {teacher.show && (
                <div className='flex justify-center'>
                    <div className='rounded p-3 w-11/12 md:w-8/12 lg:w-3/5'>
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
                            <div className='m-2'>Department: {teacher.data.departmentId.department}</div>
                            <div className='m-2'>Designation: {teacher.data.designation}</div>

                            <br />

                            <div className='w-full flex justify-center'>
                                <div>
                                    <button onClick={removeTeacher} className={`${ctx.btnClasses}`}>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>

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
