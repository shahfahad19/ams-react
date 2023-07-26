import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import axios from 'axios';
import Table from '../../Utils/Table';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import Spinner from '../../Utils/Spinner';
import BackButton from '../../Utils/BackButton';

const TakeAttendance = () => {
    const params = useParams();
    const ctx = useContext(AppContext);

    const [subject, setSubject] = useState({});
    const [students, setStudents] = useState([]);
    const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
    const [attendanceList, setAttendanceList] = useState([]);
    const [isAttendanceComplete, setAttendanceComplete] = useState(false);
    const [editingEnabled, enableEditing] = useState(false);
    const [attendanceSaved, saveAttendance] = useState(false);
    const [errorMessage, setErrorMessage] = useState();

    const MySwal = withReactContent(Swal);

    useEffect(() => {
        axios
            .get(`${ctx.baseURL}/subjects/${params.subjectId}`, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + ctx.token,
                },
            })
            .then((subjectRes) => {
                setSubject(subjectRes.data.data.subject);
                axios
                    .get(
                        `${ctx.baseURL}/users/students?batch=${subjectRes.data.data.subject.semester.batch.id}&sort=rollNo`,
                        {
                            credentials: 'include',
                            headers: {
                                Authorization: 'Bearer ' + ctx.token,
                            },
                        }
                    )
                    .then((studentsRes) => {
                        if (studentsRes.data.data.students.length === 0) {
                            setErrorMessage('No student have signed up for this batch yet');
                        }
                        setStudents(studentsRes.data.data.students);
                        setAttendanceList(
                            studentsRes.data.data.students.map((student) => ({
                                student: student._id,
                                status: '',
                            }))
                        );
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const handleAttendance = (studentId, status) => {
        const updatedAttendance = [...attendanceList];
        const existingAttendance = updatedAttendance.find((attendance) => attendance.student === studentId);
        if (existingAttendance) {
            existingAttendance.status = status;
        }
        setAttendanceList(updatedAttendance);

        if (currentStudentIndex === students.length - 1) {
            setAttendanceComplete(true);
        } else {
            setCurrentStudentIndex(currentStudentIndex + 1);
        }
    };

    const changeAttendance = (event, index) => {
        attendanceList[index].status = event.target.value;
    };

    const submitAttendance = async () => {
        const attendanceData = {
            subject: subject._id,
            attendance: attendanceList,
        };

        MySwal.fire({
            title: 'Saving Attendance',
            allowOutsideClick: false,
            didOpen: () => {
                MySwal.showLoading();
                axios
                    .post(`${ctx.baseURL}/attendances`, attendanceData, {
                        credentials: 'include',
                        headers: {
                            Authorization: 'Bearer ' + ctx.token,
                        },
                    })
                    .then((response) => {
                        saveAttendance(true);
                        MySwal.close();
                        MySwal.fire({
                            icon: 'success',
                            title: 'Success!',
                            text: 'Attendance saved successfully.',
                        });
                    })
                    .catch((error) => {
                        MySwal.close();

                        let errorMessage = error.message;

                        if (error.response) errorMessage = error.response.data.message;

                        MySwal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: errorMessage,
                        });
                    });
            },
        });
    };

    return (
        <div className='flex-grow relative'>
            <SubSectionHeader text='Take Attendance' />
            {!attendanceSaved && !isAttendanceComplete && students.length > 0 && (
                <div className='flex flex-col md:space-x-10 mt-4 space-y-4 md:space-y-10 items-center justify-center'>
                    <div className='flex flex-col items-center'>
                        <p className='text-lg md:text-xl font-semibold mb-4 text-center'>
                            Roll no.{students[currentStudentIndex].rollNo}
                        </p>
                        <p className='textxl md:text-2xl font-semibold mb-4 text-center'>
                            Student Name: {students[currentStudentIndex].name}
                        </p>
                    </div>
                    <div className='flex items-center align-middle justify-center'>
                        <button
                            className='btn btn-success mx-2'
                            onClick={() => handleAttendance(students[currentStudentIndex]._id, 'present')}
                        >
                            Present
                        </button>
                        <button
                            className='btn btn-error mx-2'
                            onClick={() => handleAttendance(students[currentStudentIndex]._id, 'absent')}
                        >
                            Absent
                        </button>
                        <button
                            className='btn btn-warning mx-2'
                            onClick={() => handleAttendance(students[currentStudentIndex]._id, 'leave')}
                        >
                            Leave
                        </button>
                    </div>
                </div>
            )}

            {!attendanceSaved && isAttendanceComplete && (
                <>
                    <h4 className='text-lg font-semibold mb-4 text-center p-2'>Attendance Complete</h4>
                    <Table>
                        <thead>
                            <tr>
                                <th>R.No</th>
                                <th>Name</th>
                                <th>Attendance</th>
                                {editingEnabled && <th>Edit</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceList.map((attendance, index) => (
                                <tr key={index}>
                                    <td>{students[index].rollNo}</td>
                                    <td>{students[index].name}</td>
                                    <td>{attendance.status[0].toUpperCase() + attendance.status.slice(1)}</td>
                                    {editingEnabled && (
                                        <td>
                                            <select
                                                className='select w-32 select-sm'
                                                defaultValue={attendance.status}
                                                onChange={(event) => changeAttendance(event, index)}
                                            >
                                                <option value='present'>Present</option>
                                                <option value='absent'>Absent</option>
                                                <option value='leave'>Leave</option>
                                            </select>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <div className='text-center m-5'>
                        {!editingEnabled && (
                            <>
                                <button className='btn mx-4 btn-warning' onClick={() => enableEditing(true)}>
                                    Edit Attendance
                                </button>
                                <button className='btn mx-4 btn-primary' onClick={submitAttendance}>
                                    Submit Attendance
                                </button>
                            </>
                        )}
                        {editingEnabled && (
                            <button className='btn mx-4 btn-primary' onClick={() => enableEditing(false)}>
                                Save Attendance
                            </button>
                        )}
                    </div>
                    <br />
                </>
            )}
            {!errorMessage && students.length === 0 && (
                <div className='flex items-center justify-center text-lg h-44'>
                    <Spinner className='mr-5' />
                    Loading students...
                </div>
            )}
            {attendanceSaved && (
                <div className='flex items-center justify-center text-xl flex-col mt-5 space-y-5'>
                    <div className='flex justify-center'>
                        <svg width='64' height='64' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <path
                                fillRule='evenodd'
                                clipRule='evenodd'
                                d='M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM18.58 32.58L11.4 25.4C10.62 24.62 10.62 23.36 11.4 22.58C12.18 21.8 13.44 21.8 14.22 22.58L20 28.34L33.76 14.58C34.54 13.8 35.8 13.8 36.58 14.58C37.36 15.36 37.36 16.62 36.58 17.4L21.4 32.58C20.64 33.36 19.36 33.36 18.58 32.58Z'
                                fill='#00BA34'
                            />
                        </svg>
                    </div>
                    <p className='text-success'>Attendance Saved</p>

                    <BackButton to={'../attendance'} text='attendances' className='justify-self-start' />
                </div>
            )}
            {errorMessage && <div className='text-center mt-16 text-error text-xl'>{errorMessage}</div>}
        </div>
    );
};

export default TakeAttendance;
