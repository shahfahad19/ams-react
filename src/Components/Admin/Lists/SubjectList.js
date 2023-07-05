import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import Table from '../../Utils/Table';

const SubjectList = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, isLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const ctx = useContext(AppContext);

    const params = useParams();
    useEffect(() => {
        axios
            .get(`${ctx.baseURL}/subjects?semester=${params.semesterId}&sort=archived,name`, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + ctx.token,
                },
            })
            .then((response) => {
                setErrorMessage('');
                isLoading(false);
                setSubjects(response.data.data.subjects);
                if (response.data.data.subjects.length === 0) setErrorMessage('No subjects found');
            })
            .catch((error) => {
                if (error.response) setErrorMessage(error.response.data.message);
                else setErrorMessage(error.message);
                isLoading(false);
                console.log(error);
            });
    }, []);
    return (
        <div className='flex-grow'>
            <SubSectionHeader text='Subject List' showBtn={true} btnLink='../add-subject' btnText='Add Subject' />

            <Table loading={loading} error={errorMessage}>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Name</th>
                        <th>Credit Hours</th>
                        <th>Teacher</th>
                        <th>Archived</th>
                    </tr>
                </thead>
                <tbody>
                    {subjects.length > 0 &&
                        subjects.map((subject, index) => {
                            return (
                                <tr key={index}>
                                    <th>{index + 1}</th>
                                    <td>
                                        <Link
                                            className='underline underline-offset-2'
                                            to={`/admin/subject/${subject._id}/attendance`}
                                        >
                                            {subject.name}
                                        </Link>
                                    </td>
                                    <td>{subject.creditHours}</td>
                                    <td>{subject.teacher ? subject.teacher.name : 'Not Assigned'}</td>
                                    <td>{`${subject.archived.toString().slice(0, 1).toUpperCase()}${subject.archived
                                        .toString()
                                        .slice(1)}`}</td>
                                </tr>
                            );
                        })}
                </tbody>
            </Table>
        </div>
    );
};

export default SubjectList;
