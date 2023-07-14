import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Menu, { MenuItem, MenuItems } from '../../Utils/Menu';
import SideBarTitle from '../../Utils/SideBarTitle';
import BackButton from '../../Utils/BackButton';
import DepartmentName from '../../Entities/Department/DepartmentName';
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
            <DepartmentName name={ctx.userData.department} />

            <BreadCrumbs>
                <BreadCrumb to='/'>Home</BreadCrumb>
                <BreadCrumb to='../Batches'>Batches</BreadCrumb>
                {semester.name && (
                    <>
                        <BreadCrumb to={'/admin/batch/' + semester.batch._id}>Batch {semester.batch.name}</BreadCrumb>
                        <BreadCrumb>Semester {semester.name}</BreadCrumb>
                    </>
                )}
                {!semester.name && <BreadCrumb>Loading...</BreadCrumb>}
            </BreadCrumbs>

            <Menu>
                <MenuItems>
                    <MenuItem text='Subjects' tab='subjects' />
                    <MenuItem text='Edit Semester' tab='edit' />
                </MenuItems>
            </Menu>
            <Outlet context={[semester, setSemester]} />
        </>
    );
};

export default ViewSemester;
