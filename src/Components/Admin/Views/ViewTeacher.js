import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Menu, { MenuItems, MenuItem } from '../../Utils/Menu';
import SideBarTitle from '../../Utils/SideBarTitle';
import DepartmentName from '../../Entities/Department/DepartmentName';
import { BreadCrumb, BreadCrumbs } from '../../Utils/BreadCrumbs';

const ViewTeacher = () => {
    const params = useParams();
    const ctx = useContext(AppContext);

    const [teacher, setTeacher] = useState([]);

    useEffect(() => {
        console.log('sendigb');
        axios
            .get(`${ctx.baseURL}/users/teachers/${params.teacherId}`, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + ctx.token,
                },
            })
            .then((response) => {
                setTeacher(response.data.data);
                console.log(response.data.data);
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
                <BreadCrumb to='../batches'>Batches</BreadCrumb>
            </BreadCrumbs>
            <Menu>
                <MenuItems>
                    <>
                        <MenuItem text='Attendance' tab='attendance' />
                        <MenuItem text='Teacher' tab='teacher' />
                        <MenuItem text='Edit Subject' tab='edit' />
                    </>
                </MenuItems>
            </Menu>
            <Outlet />
        </>
    );
};

export default ViewTeacher;
