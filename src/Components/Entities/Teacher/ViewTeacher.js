import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Menu, { MenuItems, MenuItem } from '../../Utils/Menu';
import DepartmentName from '../Department/DepartmentName';
import { BreadCrumb, BreadCrumbs } from '../../Utils/BreadCrumbs';

const ViewTeacher = () => {
    const params = useParams();
    const ctx = useContext(AppContext);

    const [teacher, setTeacher] = useState();

    useEffect(() => {
        axios
            .get(`${ctx.baseURL}/users/teachers/${params.teacherId}`, {
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
    }, []);

    return (
        <>
            <DepartmentName name={ctx.userData.department} />

            <BreadCrumbs>
                <BreadCrumb to='/'>Home</BreadCrumb>
                <BreadCrumb to='../teachers'>Teachers</BreadCrumb>
                {!teacher && <BreadCrumb>Loading...</BreadCrumb>}
                {teacher && <BreadCrumb>{teacher.name}</BreadCrumb>}
            </BreadCrumbs>
            <Menu>
                <MenuItems>
                    <>
                        <MenuItem text='Info' tab='info' />
                        <MenuItem text='Subjects' tab='subjects' />
                        <MenuItem text='Edit' tab='edit' />
                    </>
                </MenuItems>
            </Menu>
            <Outlet context={[teacher, setTeacher]} />
        </>
    );
};

export default ViewTeacher;
