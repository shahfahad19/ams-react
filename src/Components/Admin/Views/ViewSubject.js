import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import EditSubject from '../Controllers/EditSubject';
import AttendanceList from '../Lists/AttendanceList';
import SemesterList from '../Lists/SemesterList';

const ViewSubject = (props) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const params = useParams();
    const [activeTab, setActiveTab] = useState('');
    const ctx = useContext(AppContext);

    useEffect(() => {
        let tab = searchParams.get('i') || '';
        if (tab.length < 1) tab = 'attendance';
        setActiveTab(tab);
    }, [window.location.href]);

    const [subjectData, setSubjectData] = useState([]);

    useEffect(() => {
        const baseURL = 'http://localhost:5000/admin/subject/' + params.subjectId;

        axios
            .get(`${baseURL}`, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + ctx.token,
                },
            })
            .then((response) => {
                setSubjectData(response.data.data.subject);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [props.token]);

    const subjectEdited = (data) => {
        setSubjectData(data);
    };
    return (
        <>
            <div className='batch flex flex-col md:flex-row'>
                <div className='batch-info w-auto flex flex-col space-y-1 shadow-md rounded-xl p-2 md:p-0 md:shadow-none border border-solid md:border-none mb-5 md:mb-0'>
                    <p className='text-md md:text-lg font-medium bg-primary text-primary-content p-1 md:p-2 md:text-left mb-1 rounded-xl md:rounded-none text-center'>
                        {subjectData.name || 'Subject'}
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
                                        to={'?i=attendance'}
                                        onClick={() => {
                                            setActiveTab('attendance');
                                        }}
                                        className={`w-full text-xs sm:text-sm ${
                                            activeTab === 'attendance' ? 'active' : ''
                                        }`}
                                    >
                                        Attendances
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
                                        Edit Subject
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className='mt-5'>
                            <Link
                                to={'/admin'}
                                onClick={() => {
                                    setActiveTab('get-link');
                                }}
                                className={` p-2 w-full text-xs sm:text-sm ${activeTab === 'get-link' ? 'active' : ''}`}
                            >
                                Back to Batch List
                            </Link>
                        </div>
                    </div>
                </div>
                {activeTab === 'edit' && <EditSubject subject={subjectData} subjectEdited={subjectEdited} />}
                {activeTab === 'attendance' && <AttendanceList subject={subjectData} />}
            </div>
        </>
    );
};

export default ViewSubject;
