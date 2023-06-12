import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import axios from 'axios';
import Table from '../../Utils/Table';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

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

        console.log('Editing' + editingEnabled);

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
                            className='btn-sm md:btn-md px-4 py-2 mx-2 bg-green-500 text-white rounded hover:bg-green-600'
                            onClick={() => handleAttendance(students[currentStudentIndex]._id, 'present')}
                        >
                            Present
                        </button>
                        <button
                            className='btn-sm md:btn-md px-4 py-2 mx-2 bg-red-500 text-white rounded hover:bg-red-600'
                            onClick={() => handleAttendance(students[currentStudentIndex]._id, 'absent')}
                        >
                            Absent
                        </button>
                        <button
                            className='btn-sm md:btn-md px-4 py-2 mx-2 bg-yellow-500 text-white rounded hover:bg-yellow-600'
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
                                    <td>{attendance.status}</td>
                                    {editingEnabled && (
                                        <td>
                                            <select
                                                className='form-control select-sm'
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
                    <div className='text-center'>
                        {!editingEnabled && (
                            <>
                                <button
                                    className='btn-sm md:btn-md px-4 py-2 mx-4 bg-yellow-500 text-white rounded hover:bg-yellow-600'
                                    onClick={() => enableEditing(true)}
                                >
                                    Edit Attendance
                                </button>
                                <button
                                    className='btn-sm md:btn-md mt-4 px-4 mx-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                                    onClick={submitAttendance}
                                >
                                    Submit Attendance
                                </button>
                            </>
                        )}
                        {editingEnabled && (
                            <>
                                <button
                                    className='btn-sm md:btn-md px-4 py-2 mx-4 bg-yellow-500 text-white rounded hover:bg-yellow-600'
                                    onClick={() => enableEditing(false)}
                                >
                                    Save Attendance
                                </button>
                            </>
                        )}
                    </div>
                </>
            )}
            {!errorMessage && students.length === 0 && (
                <div className='flex items-center justify-center text-xl h-44'>Loading students...</div>
            )}
            {attendanceSaved && (
                <div className='flex items-center justify-center text-xl h-44'>
                    <p className='text-green-500'>Attendance Saved</p>
                </div>
            )}
            {errorMessage && <div className='text-center mt-16 text-error text-xl'>{errorMessage}</div>}
        </div>
    );
};

export default TakeAttendance;
