import React, { useContext } from 'react';
import AppContext from '../../Context/AppContext';

const SubjectInfoTable = (props) => {
    const ctx = useContext(AppContext);
    const subject = props.subject;
    return (
        <table className='table table-compact border'>
            <tbody>
                <tr className='border'>
                    <th colSpan={2}>
                        <p className='text-center'>Subject</p>
                    </th>
                </tr>
                <tr className='border'>
                    <th>Name</th>
                    <td>{subject.subjectName}</td>
                </tr>
                <tr className='border'>
                    <th>Teacher</th>
                    <td>{subject.teacherName}</td>
                </tr>
                <tr>
                    {ctx.userData.role === 'student' && <th colSpan={2} className='select-none'></th>}
                    {ctx.userData.role !== 'student' && (
                        <>
                            <th>Teacher Email</th>
                            <td>{subject.teacherEmail}</td>
                        </>
                    )}
                </tr>
            </tbody>
        </table>
    );
};

export default SubjectInfoTable;
