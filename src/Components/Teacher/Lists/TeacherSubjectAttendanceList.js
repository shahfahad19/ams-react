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

            {attendances.length > 0 && (
                <Table loading={loading} error={errorMessage}>
                    <thead>
                        <tr>
                            <th colSpan='2'>Dates</th>
                            <th colSpan={attendances[0].dates.length + 1}>Date</th>
                        </tr>
                        <tr>
                            <th>R.no</th>
                            <th>Name</th>
                            {attendances.length > 0 &&
                                attendances[0].dates.map((date) => (
                                    <th key={date}>
                                        {new Date(date).toLocaleDateString('en-UK', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: '2-digit',
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true,
                                        })}
                                    </th>
                                ))}
                            <th>Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendances.map((attendance) => (
                            <tr key={attendance._id}>
                                <td className='py-2 px-4 border-b'>{attendance.rollNo}</td>
                                <td className='py-2 px-4 border-b'>{attendance.name}</td>
                                {attendance.attendance.map((att, i) => (
                                    <td
                                        key={i}
                                        className={`${
                                            att.status[0] === 'p'
                                                ? 'text-success'
                                                : att.status[0] === 'a'
                                                ? 'text-error'
                                                : 'text-warning'
                                        } text-center`}
                                    >
                                        {att.status[0].toUpperCase()}
                                    </td>
                                ))}
                                <td
                                    className={parseFloat(attendance.percentage) < 75.0 ? 'text-error' : 'text-neutral'}
                                >
                                    {attendance.percentage === '100%'
                                        ? attendance.percentage
                                        : parseFloat(attendance.percentage).toFixed(2) + '%'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default TeacherSubjectAttendanceList;
