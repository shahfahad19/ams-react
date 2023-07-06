import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import Table from '../../Utils/Table';

const BatchList = () => {
    const [semesters, setSemesters] = useState([]);
    const [loading, isLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const ctx = useContext(AppContext);

    const params = useParams();
    useEffect(() => {
        axios
            .get(`${ctx.baseURL}/semesters?batch=${params.batchId}&sort=archived,name`, {
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
    return (
        <div className='flex-grow'>
            <SubSectionHeader text='Semester List' showBtn={true} btnText='Add Semester' btnLink='../add-semester' />

            <Table loading={loading} error={errorMessage}>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Name</th>
                        <th>Archived</th>
                    </tr>
                </thead>
                <tbody>
                    {semesters.length > 0 &&
                        semesters.map((semester, index) => {
                            return (
                                <tr key={index}>
                                    <th>{index + 1}</th>
                                    <td>
                                        <Link to={`/${ctx.userData.role}/semester/${semester._id}/subjects`}>
                                            Semester {semester.name}
                                        </Link>
                                    </td>
                                    <td>{`${semester.archived.toString().slice(0, 1).toUpperCase()}${semester.archived
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

export default BatchList;
