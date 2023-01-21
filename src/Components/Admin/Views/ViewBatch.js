import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, Outlet, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import AddSemester from '../Controllers/AddSemester';
import EditBatch from '../Controllers/EditBatch';
import SemesterList from '../Lists/SemesterList';
import InviteLink from './InviteLink';

const ViewBatch = (props) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const params = useParams();
    const [activeTab, setActiveTab] = useState('');
    const ctx = useContext(AppContext);

    useEffect(() => {
        let tab = searchParams.get('i') || '';
        if (tab.length < 1) tab = 'semesters';
        setActiveTab(tab);
    }, [window.location.href]);

    const [batchData, setBatchData] = useState([]);

    useEffect(() => {
        const baseURL = 'https://amsapi.vercel.app/admin/batch/' + params.batchId;

        axios
            .get(`${baseURL}`, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + ctx.token,
                },
            })
            .then((response) => {
                setBatchData(response.data.data.batch);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [props.token]);

    const batchEdited = (data) => {
        setBatchData(data);
    };
    return (
        <>
            <div className='batch flex flex-col md:flex-row'>
                <div className='batch-info w-auto md:w-40 flex flex-col space-y-1 shadow-md rounded-xl p-2 md:p-0 md:shadow-none border border-solid md:border-none mb-5 md:mb-0'>
                    <p className='text-md md:text-lg font-medium bg-primary text-primary-content p-1 md:p-2 md:text-left mb-1 rounded-xl md:rounded-none text-center'>
                        {batchData.name || 'Batch'}
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
                                        to={'?i=semesters'}
                                        onClick={() => {
                                            setActiveTab('semesters');
                                        }}
                                        className={`w-full text-xs sm:text-sm ${
                                            activeTab === 'semesters' ? 'active' : ''
                                        }`}
                                    >
                                        Semesters
                                    </Link>
                                </li>
                                <li className='w-1/2 md:w-auto'>
                                    <Link
                                        to={'?i=add-semester'}
                                        onClick={() => {
                                            setActiveTab('add-semester');
                                        }}
                                        className={`w-full text-xs sm:text-sm ${
                                            activeTab === 'add-semester' ? 'active' : ''
                                        }`}
                                    >
                                        Add Semester
                                    </Link>
                                </li>
                                <li className='w-1/2 md:w-auto'>
                                    <Link
                                        to={'?i=students'}
                                        onClick={() => {
                                            setActiveTab('students');
                                        }}
                                        className={`w-full text-xs sm:text-sm ${
                                            activeTab === 'students' ? 'active' : ''
                                        }`}
                                    >
                                        Students
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
                                        Edit Batch
                                    </Link>
                                </li>
                                <li className='w-1/2 md:w-auto'>
                                    <Link
                                        to={'?i=get-link'}
                                        onClick={() => {
                                            setActiveTab('get-link');
                                        }}
                                        className={`w-full text-xs sm:text-sm ${
                                            activeTab === 'get-link' ? 'active' : ''
                                        }`}
                                    >
                                        Invite Link
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
                {activeTab === 'semesters' && <SemesterList batch={batchData} token={props.token} />}
                {activeTab === 'add-semester' && <AddSemester />}
                {activeTab === 'get-link' && <InviteLink batch={batchData} token={props.token} />}
                {activeTab === 'edit' && <EditBatch batch={batchData} token={props.token} batchEdited={batchEdited} />}
            </div>
        </>
    );
};

export default ViewBatch;
