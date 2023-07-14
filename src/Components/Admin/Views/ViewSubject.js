import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Menu, { MenuItems, MenuItem } from '../../Utils/Menu';
import SideBarTitle from '../../Utils/SideBarTitle';
import DepartmentName from '../../Entities/Department/DepartmentName';
import { BreadCrumb, BreadCrumbs } from '../../Utils/BreadCrumbs';

const ViewSubject = () => {
    const params = useParams();
    const ctx = useContext(AppContext);

    const [subject, setSubject] = useState([]);

    useEffect(() => {
        axios
            .get(`${ctx.baseURL}/subjects/${params.subjectId}`, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + ctx.token,
                },
            })
            .then((response) => {
                setSubject(response.data.data.subject);
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
                {subject.name && (
                    <>
                        <BreadCrumb to={'/admin/batch/' + subject.semester.batch._id}>
                            Batch {subject.semester.batch.name}
                        </BreadCrumb>
                        <BreadCrumb to={'/admin/semester/' + subject.semester._id}>
                            Semester {subject.semester.name}
                        </BreadCrumb>
                        <BreadCrumb>{subject.name}</BreadCrumb>
                    </>
                )}
                {!subject.name && <BreadCrumb>Loading...</BreadCrumb>}
            </BreadCrumbs>
            <Menu>
                <MenuItems>
                    <>
                        <MenuItem text='Attendance' tab='attendance' />
                        <MenuItem text='Edit Subject' tab='edit' />
                        <MenuItem text='Teacher' tab='teacher' />
                    </>
                </MenuItems>
            </Menu>
            <Outlet context={[subject, setSubject]} />
        </>
    );
};

export default ViewSubject;
