import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, Outlet, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import AddSubject from '../Controllers/AddSubject';
import EditSemester from '../Controllers/EditSemester';
import SubjectList from '../Lists/SubjectList';

const ViewSemester = (props) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const params = useParams();
    const [activeTab, setActiveTab] = useState('');
    const ctx = useContext(AppContext);
    const [title, setTitle] = useState('Semester');

    useEffect(() => {
        let tab = searchParams.get('i') || '';
        if (tab.length < 1) tab = 'subjects';
        setActiveTab(tab);
    }, [window.location.href]);

    const [semesterData, setSemesterData] = useState([]);

    useEffect(() => {
        const baseURL = 'http://localhost:5000/admin/semester/' + params.semesterId;

        axios
            .get(`${baseURL}`, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + ctx.token,
                },
            })
            .then((response) => {
                setSemesterData(response.data.data.semester);
                setTitle(response.data.data.semester.batchId.name + ' - ' + response.data.data.semester.name);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [ctx.token]);

    const semesterEdited = (data) => {
        setSemesterData(data);
        setTitle(data.batchId.name + ' - ' + data.name);
    };
    return (
        <>
            <div className='batch flex flex-col md:flex-row'>
                <div className='batch-info w-auto flex flex-col space-y-1 shadow-md rounded-xl p-2 md:p-0 md:shadow-none border border-solid md:border-none mb-5 md:mb-0'>
                    <p className='text-md md:text-lg font-medium bg-primary text-primary-content p-1 md:p-2 md:text-left mb-1 rounded-xl md:rounded-none text-center'>
                        {title}
                    </p>
                    <div>
                        <p className='font-medium text-center mb-2'>
                            <span className='text-primary underline underline-offset-4 md:no-underline md:bg-primary rounded-box text-md md:text-primary-content px-3 py-1'>
                                Menu
                            </span>
                        </p>
                        <div className='flex justify-center md:block'>
                            <ul className='w-full menu border border-solid md:shadow-none md:border-none menu-horizontal rounded-box menu-compact bg-base-100 md:menu-vertical md:rounded-none'>
                                <li className='w-1/2 md:w-auto'>
                                    <Link
                                        to={'?i=subjects'}
                                        onClick={() => {
                                            setActiveTab('subjects');
                                        }}
                                        className={`w-full text-xs sm:text-sm ${
                                            activeTab === 'subjects' ? 'active' : ''
                                        }`}
                                    >
                                        Subjects
                                    </Link>
                                </li>
                                <li className='w-1/2 md:w-auto'>
                                    <Link
                                        to={'?i=add-subject'}
                                        onClick={() => {
                                            setActiveTab('add-subject');
                                        }}
                                        className={`w-full text-xs sm:text-sm ${
                                            activeTab === 'add-subject' ? 'active' : ''
                                        }`}
                                    >
                                        Add Subject
                                    </Link>
                                </li>
                                <li className='w-1/2 md:w-auto'>
                                    <Link
                                        to={'?i=edit'}
                                        onClick={() => {
                                            setActiveTab('edit');
                                        }}
                                        className={`w-full text-xs sm:text-sm ${activeTab === 'edit' ? 'active' : ''}`}
                                    >
                                        Edit Semester
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                {activeTab === 'subjects' && <SubjectList semester={semesterData} />}
                {activeTab === 'add-subject' && <AddSubject />}
                {activeTab === 'edit' && <EditSemester semester={semesterData} semesterEdited={semesterEdited} />}
            </div>
        </>
    );
};

export default ViewSemester;
