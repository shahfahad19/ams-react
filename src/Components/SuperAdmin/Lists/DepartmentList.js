import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Message from '../../Main/Message';
import ListTitleBar, { ListTitle, ListTitleButton } from '../../Utils/ListTitleBar';
import Table from '../../Utils/Table';

const DepartmentList = (props) => {
    const [departments, setDepartments] = useState([]);
    const [loading, isLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const ctx = useContext(AppContext);

    useEffect(() => {
        axios
            .get(`${ctx.baseURL}/users/departments?sort=department`, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + ctx.token,
                },
            })
            .then((response) => {
                setErrorMessage('');
                isLoading(false);
                setDepartments(response.data.data.departments);
                if (response.data.data.departments.length === 0) {
                    setErrorMessage('No departments found');
                }
            })
            .catch((error) => {
                if (error.response) setErrorMessage(error.response.data.message);
                else setErrorMessage(error.message);
                isLoading(false);
                console.log(error);
            });
    }, []);

    return (
        <div className='departments'>
            <ListTitleBar>
                <ListTitle text='Departments List' />
                <ListTitleButton to='add-department' />
            </ListTitleBar>

            <Table loading={loading} error={errorMessage}>
                <thead>
                    <tr>
                        <th></th>
                        <th className='normal-case font-medium text-sm'>Department</th>
                        <th className='normal-case font-medium text-sm'>Admin</th>
                    </tr>
                </thead>
                <tbody>
                    {departments.length > 0 &&
                        departments.map((department, index) => {
                            return (
                                <tr key={index}>
                                    <th>{index + 1}</th>
                                    <td>
                                        <Link
                                            className='underline underline-offset-2'
                                            to={`/super-admin/department/${department._id}`}
                                            key={department._id}
                                        >
                                            {department.department}
                                        </Link>
                                    </td>
                                    <td>{department.email}</td>
                                </tr>
                            );
                        })}
                </tbody>
            </Table>
        </div>
    );
};

export default DepartmentList;
