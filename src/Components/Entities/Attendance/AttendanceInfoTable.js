import React from 'react';

const AttendanceInfoTable = (props) => {
    const subject = props.subject;
    return (
        <table className='table table-compact border'>
            <tbody>
                <tr>
                    <th colSpan={4} className='text-center'>
                        Attendance Info
                    </th>
                </tr>
                <tr className='border'>
                    <th>Total Classes</th>
                    <td className='border-r'>{subject.totalClass}</td>
                    <th className='text-success'>Present</th>
                    <td className='text-success'>{subject.present}</td>
                </tr>
                <tr className='border'>
                    <th className='text-error'>Absent</th>
                    <td className='border-r text-error'>{subject.absent}</td>
                    <th className='text-warning'>Leave</th>
                    <td className='text-warning'>{subject.leave}</td>
                </tr>
                <tr className='border'>
                    <th colSpan={2}>Percentage</th>
                    <th colSpan={2} className={subject.percentage <= 75.0 ? 'text-error' : 'text-success'}>
                        {parseFloat(subject.percentage).toFixed(2)} %
                    </th>
                </tr>
            </tbody>
        </table>
    );
};

export default AttendanceInfoTable;
