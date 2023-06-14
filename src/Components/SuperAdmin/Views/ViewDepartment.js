import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Menu, { MenuItems, MenuItem } from '../../Utils/Menu';
import SideBarTitle from '../../Utils/SideBarTitle';

const ViewDepartment = () => {
    const params = useParams();
    const ctx = useContext(AppContext);

    const [department, setDepartment] = useState({
        department: '',
    });

    useEffect(() => {
        axios
            .get(`${ctx.baseURL}/users/department/${params.departmentId}`, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + ctx.token,
                },
            })
            .then((response) => {
                setDepartment(response.data.data.department);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <>
            <div className='batch flex flex-col md:flex-row'>
                <div className='batch-info w-auto md:w-40 flex flex-col space-y-1 shadow-md rounded-xl p-2 md:p-0 md:shadow-none border border-solid md:border-none mb-5 md:mb-0'>
                    {department.department === '' ? (
                        <SideBarTitle title='Loading...' />
                    ) : (
                        <SideBarTitle title={department.department || 'Department'} />
                    )}

                    <Menu>
                        <MenuItems>
                            <MenuItem text='Info' tab='info' />
                            <MenuItem text='Batches' tab='batches' />
                            <MenuItem text='Subjects' tab='subjects' />
                            <MenuItem text='Teachers' tab='teachers' />
                        </MenuItems>
                    </Menu>
                </div>
                <Outlet context={[department, setDepartment]} />
            </div>
        </>
    );
};

export default ViewDepartment;
