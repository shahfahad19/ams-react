import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Menu, { MenuItems, MenuItem } from '../../Utils/Menu';
import SideBarTitle from '../../Utils/SideBarTitle';
import BackButton from '../../Utils/BackButton';
import DepartmentName from '../../Entities/Department/DepartmentName';
import { BreadCrumb, BreadCrumbs } from '../../Utils/BreadCrumbs';

const ViewBatch = () => {
    const params = useParams();
    const ctx = useContext(AppContext);

    const [batch, setBatch] = useState();

    useEffect(() => {
        axios
            .get(`${ctx.baseURL}/batches/${params.batchId}`, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + ctx.token,
                },
            })
            .then((response) => {
                setBatch(response.data.data.batch);
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
                <BreadCrumb to='/admin/batches'>Batches</BreadCrumb>
                <BreadCrumb>{batch ? 'Batch ' + batch.name : 'Loading...'}</BreadCrumb>
            </BreadCrumbs>
            <Menu>
                <MenuItems>
                    <MenuItem text='Semesters' tab='semesters' />
                    <MenuItem text='Students' tab='students' />
                    {ctx.userData.role === 'admin' && <MenuItem text='Edit Batch' tab='edit' />}
                    <MenuItem text='Invite Link' tab='invite' />
                </MenuItems>
            </Menu>
            <Outlet context={[batch, setBatch]} />
        </>
    );
};

export default ViewBatch;
