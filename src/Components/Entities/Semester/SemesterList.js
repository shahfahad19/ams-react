import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import Table from '../../Utils/Table';
import TickMark from '../../Utils/TickMark';
import CrossMark from '../../Utils/CrossMark';

const BatchList = () => {
    const [semesters, setSemesters] = useState([]);
    const [loading, isLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const ctx = useContext(AppContext);

    const params = useParams();
    useEffect(() => {
        const batch = ctx.userData.role === 'student' ? ctx.userData.batch : params.batchId;
        console.log(batch);
        axios
            .get(`${ctx.baseURL}/semesters?batch=${batch}&sort=archived,name`, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + ctx.token,
                },
            })
            .then((response) => {
                setErrorMessage('');
                isLoading(false);
                setSemesters(response.data.data.semesters);
                if (response.data.data.semesters.length === 0) setErrorMessage('No semesters found');
            })
            .catch((error) => {
                if (error.response) setErrorMessage(error.response.data.message);
                else setErrorMessage(error.message);
                isLoading(false);
                console.log(error);
            });
    }, []);

    const viewSemester = (semesterId) => {
        ctx.navigate(`/${ctx.userData.role}/semester/${semesterId}`);
    };
    return (
        <div className='flex-grow'>
            <SubSectionHeader text='Semester List' showBtn={true} btnText='Add Semester' btnLink='../add-semester' />

            <Table loading={loading} error={errorMessage}>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Name</th>
                        <th>Active</th>
                    </tr>
                </thead>
                <tbody>
                    {semesters.length > 0 &&
                        semesters.map((semester, index) => {
                            return (
                                <tr key={index} className='cursor-pointer' onClick={() => viewSemester(semester._id)}>
                                    <th>{index + 1}</th>
                                    <td>Semester {semester.name}</td>
                                    <td>
                                        {!semester.archived && <TickMark />}
                                        {semester.archived && <CrossMark />}
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </Table>
        </div>
    );
};

export default BatchList;
