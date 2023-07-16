import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import AppContext from '../../Context/AppContext';
import Message from '../../Main/Message';
import SubjectInfoTable from '../../Entities/Attendance/SubjectInfoTable';
import AttendanceInfoTable from '../../Entities/Attendance/AttendanceInfoTable';
import AttendanceTable from '../../Entities/Attendance/AttendanceTable';
import { useParams } from 'react-router-dom';
import Form, { FormControl, FormField, FormGroup, FormLabel, FormWrapper } from '../../Utils/Form';
import Table from '../../Utils/Table';

const ViewStudent = () => {
    const ctx = useContext(AppContext);
    const params = useParams();
    const [data, setData] = useState([]);
    const [alert, setAlert] = useState(false);
    const [loading, isLoading] = useState(true);
    const [student, setStudent] = useState(null);
    const semesterRef = useRef('');
    const subjectRef = useRef('');
    const [subjects, setSubjects] = useState([]);
    const [subject, setSubject] = useState(null);

    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const getData = async () => {
            await axios
                .get(`${ctx.baseURL}/users/students/${params.studentId}`, {
                    credentials: 'include',
                    headers: {
                        Authorization: 'Bearer ' + ctx.token,
                    },
                })
                .then((response) => {
                    setStudent(response.data.data.student);
                })
                .catch((error) => {
                    if (error.response) setErrorMessage(error.response.data.message);
                    else setErrorMessage(error.message);
                    setAlert(true);
                })
                .finally(() => {
                    isLoading(false);
                });

            await axios
                .get(`${ctx.baseURL}/attendances/student/${params.studentId}`, {
                    credentials: 'include',
                    headers: {
                        Authorization: 'Bearer ' + ctx.token,
                    },
                })
                .then((response) => {
                    console.log(response.data);
                    setData(response.data.attendances);
                    if (response.data.attendances.length === 0) {
                        setErrorMessage('No attendances found');
                    }
                })
                .catch((error) => {
                    if (error.response) setErrorMessage(error.response.data.message);
                    else setErrorMessage(error.message);
                    setAlert(true);
                })
                .finally(() => {
                    isLoading(false);
                });
        };

        getData();
    }, []);

    const semesterHandler = () => {
        let semesterIndex = semesterRef.current.value;

        if (semesterIndex === '') {
            setSubjects([]);
            setSubject(null);
        } else {
            setSubjects(data[semesterIndex].subjects);
        }
    };

    const subjectHandler = () => {
        let semesterIndex = semesterRef.current.value;
        let subjectIndex = subjectRef.current.value;

        if (subjectIndex === '') {
            setSubject(null);
        } else {
            setSubject(data[semesterIndex].subjects[subjectIndex]);
        }
    };

    return (
        <>
            {alert && (
                <Message
                    type='error'
                    text={errorMessage}
                    hideAlert={() => {
                        setAlert(false);
                    }}
                    showBtn={true}
                />
            )}
            {loading && (
                <div className='flex justify-center items-center mt-44'>
                    <svg className='spinner-ring' viewBox='25 25 50 50' strokeWidth='5'>
                        <circle cx='50' cy='50' r='20' />
                    </svg>
                </div>
            )}
            {!loading && (
                <div className='flex flex-col justify-center p-2 items-center'>
                    <div>
                        <Table className='table-compact'>
                            <thead>
                                <tr className='border'>
                                    <th colSpan={2} className='text-center normal-case'>
                                        Student Info
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {student !== null && (
                                    <>
                                        <tr className='border'>
                                            <th>Name</th>
                                            <td>{student.name}</td>
                                        </tr>
                                        <tr className='border'>
                                            <th>Roll No</th>
                                            <td>{student.rollNo}</td>
                                        </tr>
                                        <tr className='border'>
                                            <th>Email</th>
                                            <td>{student.email}</td>
                                        </tr>
                                        <tr className='border'>
                                            <th>Registration No</th>
                                            <td>{student.registrationNo}</td>
                                        </tr>
                                    </>
                                )}
                            </tbody>
                        </Table>
                    </div>
                    <div className='m-3 w-full lg:w-2/3'>
                        <p className='text-lg font-medium text-center'>
                            Select Semester and Subject to see <span className='text-primary'>{student.name}'s</span>{' '}
                            attendance
                        </p>
                        <FormWrapper>
                            <FormGroup>
                                <FormField>
                                    <FormLabel>Semester</FormLabel>
                                    <FormControl>
                                        <select
                                            className={ctx.selectClasses}
                                            ref={semesterRef}
                                            onChange={semesterHandler}
                                        >
                                            <option value=''>Select Semester</option>

                                            {data.map((semester, index) => {
                                                return (
                                                    <option key={semester.semester._id} value={index}>
                                                        Semester {semester.semester.name}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </FormControl>
                                </FormField>
                                <FormField>
                                    <FormLabel>Subject</FormLabel>
                                    <FormControl>
                                        <select
                                            className={ctx.selectClasses}
                                            ref={subjectRef}
                                            onChange={subjectHandler}
                                            disabled={subjects.length === 0}
                                        >
                                            {subjects.length === 0 && <option value=''>Select Subject</option>}
                                            {subjects.length > 0 && (
                                                <>
                                                    <option value=''>Select Subject</option>
                                                    {subjects.length > 0 && (
                                                        <>
                                                            {subjects.map((subject, index) => {
                                                                return (
                                                                    <option key={subject.subject} value={index}>
                                                                        {subject.subjectName}
                                                                    </option>
                                                                );
                                                            })}
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </select>
                                    </FormControl>
                                </FormField>
                            </FormGroup>
                        </FormWrapper>
                    </div>

                    <div className='m-3 w-full lg:w-2/3'>
                        {subject !== null && (
                            <>
                                <div className='flex flex-col items-center sm:items-start space-y-3 sm:space-y-0 sm:flex-row justify-between'>
                                    <div>
                                        <SubjectInfoTable subject={subject} />
                                    </div>
                                    <div>
                                        <AttendanceInfoTable subject={subject} />
                                    </div>
                                </div>

                                <div className='flex justify-center m-2'>
                                    <AttendanceTable subject={subject} />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ViewStudent;
