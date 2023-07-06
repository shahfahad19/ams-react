import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import AppContext from '../Context/AppContext';
import Message from '../Main/Message';
import AttendanceInfoTable from './Components/AttendanceInfoTable';
import SubjectInfoTable from './Components/SubjectInfoTable';
import AttendanceTable from './Components/AttendanceTable';

const StudentAttendance = () => {
    const ctx = useContext(AppContext);
    const [data, setData] = useState([]);
    const [alert, setAlert] = useState(false);
    const [loading, isLoading] = useState(true);
    const semesterRef = useRef('');
    const subjectRef = useRef('');
    const [subjects, setSubjects] = useState([]);
    const [subject, setSubject] = useState(null);

    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        axios
            .get(`${ctx.baseURL}/attendances/student/${ctx.userData._id}`, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + ctx.token,
                },
            })
            .then((response) => {
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
                <div className='flex justify-center items-center mt-20'>
                    <div className='loader'></div>
                </div>
            )}
            {!loading && (
                <div className='flex flex-col justify-center p-2 items-center'>
                    <div className='m-3 w-full lg:w-2/3'>
                        <p className='text-xl font-semibold text-center'>Select Semester and Subject</p>
                        <div className='form-control'>
                            <label className='label'>
                                <span className='label-text'>Semester</span>
                            </label>
                            <select className={ctx.selectClasses} ref={semesterRef} onChange={semesterHandler}>
                                <option value=''>Select Semester</option>

                                {data.map((semester, index) => {
                                    return (
                                        <option key={semester.semester._id} value={index}>
                                            Semester {semester.semester.name}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className='form-control'>
                            <label className='label'>
                                <span className='label-text'>Subject</span>
                            </label>
                            <select className={ctx.selectClasses} ref={subjectRef} onChange={subjectHandler}>
                                {subjects.length === 0 && <option value=''>- - - - - - - - - -</option>}
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
                        </div>
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

export default StudentAttendance;
