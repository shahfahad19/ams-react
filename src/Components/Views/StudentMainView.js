import React, { useContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import AppContext from '../Context/AppContext';
import Menu, { MenuItems, MenuItem } from '../Utils/Menu';
import DepartmentName from '../Entities/Department/DepartmentName';
import { BreadCrumb, BreadCrumbs } from '../Utils/BreadCrumbs';
import axios from 'axios';

const StudentMainView = () => {
    const ctx = useContext(AppContext);
    const [batch, setBatch] = useState();
    useEffect(() => {
        axios
            .get(`${ctx.baseURL}/batches/${ctx.userData.batch}`, {
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
                if (error.response) {
                    if (error.response.status === 404) {
                        ctx.navigate('/404', { replace: true });
                    }
                }
            });
    }, []);

    return (
        <>
            {batch && <DepartmentName name={batch.admin.department} />}
            <Outlet />
        </>
    );
};

export default StudentMainView;
