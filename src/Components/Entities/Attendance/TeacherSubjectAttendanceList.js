import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import Table from '../../Utils/Table';

const TeacherSubjectAttendanceList = () => {
    const [attendances, setAttendances] = useState([]);
    const [loading, isLoading] = useState(true);
    const [dates, setDates] = useState([]);
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
                setDates(response.data.data.dates);

                if (response.data.data.attendances.length === 0) setErrorMessage('No Attendances found');
                isLoading(false);
            })
            .catch((error) => {
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
                <Table>
                    <thead>
                        <tr>
                            <th>R.no</th>
                            <th>Name</th>
                            {attendances.length > 0 &&
                                attendances[0].dates.map((date) => (
                                    <th key={date}>
                                        <p className='text-xs text-center border-none'>
                                            {new Date(date).toLocaleDateString('en-UK', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: '2-digit',
                                            })}
                                        </p>
                                        <p className='text-center text-xs border-none'>
                                            {new Date(date).toLocaleTimeString('en-UK', {
                                                hour: 'numeric',
                                                minute: '2-digit',
                                                hour12: true,
                                            })}
                                        </p>
                                    </th>
                                ))}
                            <th>Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendances.map((attendance, index) => (
                            <tr key={attendance._id}>
                                <td>{attendance.rollNo}</td>
                                <td className='text-bold'>{attendance.name}</td>

                                {dates.map((date, index) => (
                                    <React.Fragment key={index}>
                                        {attendance.dates.indexOf(date) === -1 && (
                                            <td className='border border-neutral bg-stone-200 text-center font-medium'>
                                                X
                                            </td>
                                        )}
                                        {attendance.dates.indexOf(date) > -1 && (
                                            <td key={index}>
                                                <p
                                                    className={`${
                                                        attendance.attendance[attendance.dates.indexOf(date)]
                                                            .status[0] === 'p'
                                                            ? 'text-success'
                                                            : attendance.attendance[attendance.dates.indexOf(date)]
                                                                  .status[0] === 'a'
                                                            ? 'text-error'
                                                            : 'text-warning'
                                                    } text-center font-medium `}
                                                >
                                                    {attendance.attendance[
                                                        attendance.dates.indexOf(date)
                                                    ].status[0].toUpperCase()}
                                                </p>
                                            </td>
                                        )}
                                    </React.Fragment>
                                ))}

                                <td>
                                    <p
                                        className={`${
                                            parseFloat(attendance.percentage) < 75.0 ? 'text-error' : 'text-success'
                                        } text-center font-semibold`}
                                    >
                                        {attendance.percentage === '100%'
                                            ? attendance.percentage
                                            : parseFloat(attendance.percentage).toFixed(2) + '%'}
                                    </p>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
            {errorMessage && (
                <div className='text-center mt-16 text-error text-xl'>No attendances found for this subject</div>
            )}
        </div>
    );
};

export default TeacherSubjectAttendanceList;
