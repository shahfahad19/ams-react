import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import AppContext from '../Context/AppContext';
import Message from '../Main/Message';

const StudentAttendance = () => {
    const ctx = useContext(AppContext);
    const [data, setData] = useState([]);
    const [alert, setAlert] = useState(false);
    const [loading, isLoading] = useState(true);
    const semesterRef = useRef('');
    const subjectRef = useRef('');
    const [subjects, setSubjects] = useState([]);

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
                console.log(response.data.attendances);
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
        } else {
            setSubjects(data[semesterIndex].subjects);
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
                <div>
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
                        <select className={ctx.selectClasses} ref={subjectRef}>
                            {subjects.length === 0 && <option value=''>- - - - - - - - - -</option>}
                            {subjects.length > 0 && (
                                <>
                                    <option value=''>Select Subject</option>
                                    {subjects.length > 0 && (
                                        <>
                                            {subjects.map((subject, index) => {
                                                return <option key={subject.subject}>{subject.subjectName}</option>;
                                            })}
                                        </>
                                    )}
                                </>
                            )}
                        </select>
                    </div>
                </div>
            )}
        </>
    );
};

export default StudentAttendance;
