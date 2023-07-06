import React from 'react';

const AttendanceTable = (props) => {
    const subject = props.subject;

    return (
        <table className='table table-compact w-full'>
            <thead>
                <tr>
                    <th colSpan={3} className='text-center normal-case'>
                        Attendance
                    </th>
                </tr>
                <tr>
                    <th className='normal-case font-medium'>Date</th>
                    <th className='normal-case font-medium'>Time</th>
                    <th className='normal-case font-medium'>Status</th>
                </tr>
            </thead>
            <tbody>
                {subject.attendances.map((attendance, index) => {
                    return (
                        <tr key={index}>
                            <td>
                                {new Date(subject.dates[index]).toLocaleDateString('en-UK', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: '2-digit',
                                })}
                            </td>
                            <td>
                                {new Date(subject.dates[index]).toLocaleTimeString('en-UK', {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true,
                                })}
                            </td>
                            <td
                                className={`font-medium ${
                                    attendance.status === 'present'
                                        ? 'text-success'
                                        : attendance.status === 'absent'
                                        ? 'text-error'
                                        : 'text-warning'
                                }`}
                            >
                                {attendance.status.toUpperCase()}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default AttendanceTable;
