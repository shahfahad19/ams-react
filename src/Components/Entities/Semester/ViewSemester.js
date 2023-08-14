import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Menu, { MenuItem, MenuItems } from '../../Utils/Menu';
import DepartmentName from '../Department/DepartmentName';
import { BreadCrumb, BreadCrumbs } from '../../Utils/BreadCrumbs';

const ViewSemester = (props) => {
    const params = useParams();
    const ctx = useContext(AppContext);
    const [semester, setSemester] = useState({
        name: '',
        batch: { name: '' },
    });

    useEffect(() => {
        axios
            .get(`${ctx.baseURL}/semesters/${params.semesterId}`, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + ctx.token,
                },
            })
            .then((response) => {
                setSemester(response.data.data.semester);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <>
            {semester.name && <DepartmentName name={semester.batch.admin.department} />}
            <BreadCrumbs>
                <BreadCrumb to='/'>Home</BreadCrumb>
                {ctx.userData.role !== 'student' && (
                    <>
                        {ctx.userData.role === 'admin' && <BreadCrumb to='../batches'>Batches</BreadCrumb>}
                        {semester.name && (
                            <>
                                {ctx.userData.role === 'super-admin' && (
                                    <BreadCrumb to={`/super-admin/department/${semester.batch.admin._id}/batches`}>
                                        Batches
                                    </BreadCrumb>
                                )}

                                <BreadCrumb to={'/' + ctx.userData.role + '/batch/' + semester.batch._id}>
                                    Batch {semester.batch.name}
                                </BreadCrumb>
                                <BreadCrumb
                                    to={'/' + ctx.userData.role + '/batch/' + semester.batch._id + '/semesters'}
                                >
                                    Semesters
                                </BreadCrumb>

                                <BreadCrumb>Semester {semester.name}</BreadCrumb>
                            </>
                        )}
                    </>
                )}
                {ctx.userData.role === 'student' && semester.name && (
                    <>
                        <BreadCrumb to='/student'>Semesters</BreadCrumb>
                        <BreadCrumb>Semester {semester.name}</BreadCrumb>
                    </>
                )}
                {!semester.name && <BreadCrumb>Loading...</BreadCrumb>}
            </BreadCrumbs>
            {ctx.userData.role !== 'student' && (
                <Menu>
                    <MenuItems>
                        <MenuItem text='Subjects' tab='subjects' />
                        <MenuItem text='Edit Semester' tab='edit' />
                    </MenuItems>
                </Menu>
            )}
            <Outlet context={[semester, setSemester]} />
        </>
    );
};

export default ViewSemester;
