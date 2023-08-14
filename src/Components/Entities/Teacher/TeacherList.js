import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Table from '../../Utils/Table';
import TickMark from '../../Utils/TickMark';
import CrossMark from '../../Utils/CrossMark';

import SubSectionHeader from '../../Utils/SubSectionHeader';

const TeacherList = (props) => {
    const params = useParams();
    const [teachers, setTeachers] = useState([]);
    const [loading, isLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const ctx = useContext(AppContext);

    useEffect(() => {
        const url =
            ctx.userData.role === 'super-admin'
                ? `${ctx.baseURL}/users/teachers?dept=${params.departmentId}&sort=name`
                : `${ctx.baseURL}/users/teachers?sort=name`;
        axios
            .get(url, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + ctx.token,
                },
            })
            .then((response) => {
                setErrorMessage('');
                isLoading(false);
                setTeachers(response.data.data.teachers);
                if (response.data.data.teachers.length === 0) {
                    setErrorMessage('No teachers found');
                }
            })
            .catch((error) => {
                if (error.response) setErrorMessage(error.response.data.message);
                else setErrorMessage(error.message);
                isLoading(false);
            });
    }, []);

    const viewTeacher = (teacherId) => {
        ctx.navigate(ctx.userData.role + '/teacher/' + teacherId);
    };
    return (
        <div className='flex-grow'>
            <SubSectionHeader text='Teachers' showBtn={true} btnLink='../add-teacher' btnText='Add Teacher' />
            <Table loading={loading} error={errorMessage}>
                <thead>
                    <tr>
                        <th></th>
                        <th className='normal-case font-medium text-sm'>Photo</th>
                        <th className='normal-case font-medium text-sm'>Name</th>
                        <th className='normal-case font-medium text-sm'>Email</th>

                        <th className='normal-case font-medium text-sm'>Gender</th>
                        <th className='normal-case font-medium text-sm'>Designation</th>
                        <th className='normal-case font-medium text-sm'>Approved</th>
                    </tr>
                </thead>
                <tbody>
                    {teachers.length > 0 &&
                        teachers.map((teacher, index) => {
                            return (
                                <tr
                                    className='cursor-pointer'
                                    key={index}
                                    onClick={() => {
                                        viewTeacher(teacher._id);
                                    }}
                                >
                                    <th>{index + 1}</th>
                                    <td>
                                        <label className='avatar'>
                                            <div className='w-10 rounded-full'>
                                                <img src={teacher.photo} alt='profile_pic' />
                                            </div>
                                        </label>
                                    </td>
                                    <td>{teacher.name}</td>
                                    <td>{teacher.email}</td>
                                    <td>{teacher.gender === 'male' ? 'Male' : 'Female'}</td>
                                    <td>{teacher.designation}</td>
                                    <td>
                                        {teacher.approved && <TickMark />}
                                        {!teacher.approved && <CrossMark />}
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </Table>
        </div>
    );
};

export default TeacherList;
