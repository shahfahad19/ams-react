import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../../../Context/AppContext';
import axios from 'axios';

const SubjectInfoTable = (props) => {
    const ctx = useContext(AppContext);
    const subject = props.subject;
    const [teacher, setTeacher] = useState({
        email: '',
        name: '',
    });

    useEffect(() => {
        setTeacher({
            name: 'Loading...',
            email: '',
        });
        if (subject.teacher !== null) {
            axios
                .get(`${ctx.baseURL}/users/teachers/${subject.teacher}`, {
                    credentials: 'include',
                    headers: {
                        Authorization: 'Bearer ' + ctx.token,
                    },
                })
                .then((response) => {
                    setTeacher(response.data.data.teacher);
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            setTeacher({
                name: 'Not Assigned',
                email: '',
            });
        }
    }, [subject]);
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
                    <td>{teacher.name}</td>
                </tr>
                <tr>
                    {ctx.userData.role === 'student' && <th colSpan={2} className='select-none'></th>}
                    {ctx.userData.role !== 'student' && (
                        <>
                            <th>Teacher Email</th>
                            <td>{teacher.email}</td>
                        </>
                    )}
                </tr>
            </tbody>
        </table>
    );
};

export default SubjectInfoTable;
