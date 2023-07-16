import React from 'react';

const AttendanceInfoTable = (props) => {
    const subject = props.subject;
    return (
        <table className='table table-compact border'>
            <tbody>
                <tr>
                    <th colSpan={4}>
                        <p className='text-center'>Attendance Info</p>
                    </th>
                </tr>
                <tr className='border'>
                    <th>Total Classes</th>
                    <td className='border-r'>{subject.totalClass}</td>
                    <th>Present</th>
                    <td>{subject.present}</td>
                </tr>
                <tr className='border'>
                    <th>Absent</th>
                    <td className='border-r'>{subject.absent}</td>
                    <th>Leave</th>
                    <td>{subject.leave}</td>
                </tr>
                <tr className='border'>
                    <th colSpan={2}>Percentage</th>
                    <th colSpan={2}>
                        <span className={subject.percentage <= 75.0 ? 'text-error' : 'text-success'}>
                            {parseFloat(subject.percentage).toFixed(2)} %
                        </span>
                    </th>
                </tr>
            </tbody>
        </table>
    );
};

export default AttendanceInfoTable;
