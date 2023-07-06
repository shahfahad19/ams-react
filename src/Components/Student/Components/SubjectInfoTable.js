import React from 'react';

const SubjectInfoTable = (props) => {
    const subject = props.subject;
    return (
        <table className='table table-compact border'>
            <tbody>
                <tr className='border'>
                    <th colSpan={2} className='text-center'>
                        Subject Info
                    </th>
                </tr>
                <tr className='border'>
                    <th>Subject Name</th>
                    <td>{subject.subjectName}</td>
                </tr>
                <tr className='border'>
                    <th>Teacher Name</th>
                    <td>{subject.teacherName}</td>
                </tr>
                <tr>
                    <th colSpan={2} className='select-none'>
                        &nbsp;
                    </th>
                </tr>
            </tbody>
        </table>
    );
};

export default SubjectInfoTable;
