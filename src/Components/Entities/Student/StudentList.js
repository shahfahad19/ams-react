import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import Table from '../../Utils/Table';
import TickMark from '../../Utils/TickMark';
import CrossMark from '../../Utils/CrossMark';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, isLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const ctx = useContext(AppContext);

    const params = useParams();

    useEffect(() => {
        axios
            .get(`${ctx.baseURL}/users/students?batch=${params.batchId}&sort=rollNo`, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + ctx.token,
                },
            })
            .then((response) => {
                setErrorMessage('');
                isLoading(false);
                setStudents(response.data.data.students);
                console.log(response.data.data);
                if (response.data.data.students.length === 0)
                    setErrorMessage('No student has signed up for this batch yet');
            })
            .catch((error) => {
                if (error.response) setErrorMessage(error.response.data.message);
                else setErrorMessage(error.message);
                isLoading(false);
                console.log(error);
            });
    }, []);

    const openStudentInfo = (student_id) => {
        ctx.navigate(`/${ctx.userData.role}/student/${student_id}`);
    };
    return (
        <div className='flex-grow'>
            <SubSectionHeader text='Student List' />

            <Table loading={loading} error={errorMessage}>
                <thead>
                    <tr>
                        <th>Roll No.</th>
                        <th>Photo</th>

                        <th>Name</th>
                        <th>Account Confirmed</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length > 0 &&
                        students.map((student, index) => {
                            return (
                                <tr key={index} onClick={() => openStudentInfo(student._id)} className='cursor-pointer'>
                                    <th>{student.rollNo}</th>

                                    <td>
                                        <label className='avatar'>
                                            <div className='w-12 rounded-md'>
                                                <img src={student.photo} alt='profile_pic' />
                                            </div>
                                        </label>
                                    </td>

                                    <td>{student.name}</td>
                                    <td>
                                        {student.confirmed && <TickMark />}
                                        {!student.confirmed && <CrossMark />}
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </Table>
        </div>
    );
};

export default StudentList;
