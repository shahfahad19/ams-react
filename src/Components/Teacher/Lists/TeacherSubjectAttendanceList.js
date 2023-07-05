import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Message from '../../Main/Message';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import Table from '../../Utils/Table';

const TeacherSubjectAttendanceList = () => {
    const [attendances, setAttendances] = useState([]);
    const [loading, isLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const ctx = useContext(AppContext);

    const params = useParams();
    useEffect(() => {
        axios
            .get(`${ctx.baseURL}/attendances?subject=${params.subjectId}`, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + ctx.token,
                },
            })
            .then((response) => {
                setErrorMessage('');
                setAttendances(response.data.data.attendances);
                if (response.data.data.attendances.length === 0) setErrorMessage('No Attendances found');
                isLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setErrorMessage(error.response.data.message || error.message);
                isLoading(false);
            });
    }, []);

    return (
        <div className='flex-grow'>
            <SubSectionHeader text='Attendance List' />

            {!errorMessage && attendances.length === 0 && (
                <div className='flex justify-center items-center h-60'>
                    <div className='loader'></div>
                </div>
            )}
            {attendances.length > 0 && (
                <table className='table w-full table-compact'>
                    <thead>
                        <tr>
                            <th className='normal-case font-semibold border border-neutral'>R.no</th>
                            <th className='normal-case font-semibold border border-neutral'>Name</th>
                            {attendances.length > 0 &&
                                attendances[0].dates.map((date) => (
                                    <th
                                        key={date}
                                        className='text-center text-xs normal-case font-semibold border border-neutral'
                                    >
                                        <div>
                                            {new Date(date).toLocaleDateString('en-UK', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: '2-digit',
                                            })}
                                        </div>
                                        <div className='border border-neutral border-b-0'></div>
                                        <div>
                                            {new Date(date).toLocaleTimeString('en-UK', {
                                                hour: 'numeric',
                                                minute: '2-digit',
                                                hour12: true,
                                            })}
                                        </div>
                                    </th>
                                ))}
                            <th className='text-center normal-case font-semibold border border-neutral'>Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendances.map((attendance) => (
                            <tr key={attendance._id}>
                                <td className='border border-neutral'>{attendance.rollNo}</td>
                                <td className='border border-neutral text-bold'>{attendance.name}</td>
                                {attendance.attendance.map((att, i) => (
                                    <td
                                        key={i}
                                        className={`${
                                            att.status[0] === 'p'
                                                ? 'text-success'
                                                : att.status[0] === 'a'
                                                ? 'text-error'
                                                : 'text-warning'
                                        } text-center font-bold border border-neutral`}
                                    >
                                        {att.status[0].toUpperCase()}
                                    </td>
                                ))}
                                <td
                                    className={`${
                                        parseFloat(attendance.percentage) < 75.0 ? 'text-error' : 'text-success'
                                    } text-center border border-neutral font-semibold`}
                                >
                                    {attendance.percentage === '100%'
                                        ? attendance.percentage
                                        : parseFloat(attendance.percentage).toFixed(2) + '%'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {errorMessage && (
                <div className='text-center mt-16 text-error text-xl'>No attendances found for this subject</div>
            )}
        </div>
    );
};

export default TeacherSubjectAttendanceList;
