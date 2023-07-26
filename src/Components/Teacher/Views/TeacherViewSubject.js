import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Menu, { MenuItems, MenuItem } from '../../Utils/Menu';
import SideBarTitle from '../../Utils/SideBarTitle';
import { BreadCrumb, BreadCrumbs } from '../../Utils/BreadCrumbs';

const TeacherViewSubject = () => {
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
            <BreadCrumbs>
                <BreadCrumb to='/'>Home</BreadCrumb>
                <BreadCrumb to='/teacher'>Subjects</BreadCrumb>
                {subject.name && (
                    <>
                        <BreadCrumb>{subject.name}</BreadCrumb>
                    </>
                )}
                {!subject.name && <BreadCrumb>Loading...</BreadCrumb>}
            </BreadCrumbs>
            <Menu>
                <MenuItems>
                    <MenuItem text='Attendances' tab='attendance' />
                    <MenuItem text='Take Attendance' tab='take-attendance' />
                    <MenuItem text='Remove Subject' tab='remove' />
                </MenuItems>
            </Menu>
            <Outlet context={[subject, setSubject]} />
        </>
    );
};

export default TeacherViewSubject;
