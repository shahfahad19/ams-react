import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import BackButton from '../../Utils/BackButton';

const AddSubject = () => {
    const [btnState, setBtnState] = useState('');
    const subject = useRef();

    const [newSubject, setNewSubject] = useState();
    const params = useParams();
    const ctx = useContext(AppContext);
    const [subjectList, setSubjectList] = useState({
        loaded: false,
        subjects: [],
    });

    useEffect(() => {
        axios
            .get(
                `${ctx.baseURL}/subjects/defaultSubjects?department=${ctx.userData._id}&semester=${params.semesterId}&sort=name`,
                {
                    credentials: 'include',
                    headers: {
                        Authorization: 'Bearer ' + ctx.token,
                    },
                }
            )
            .then((response) => {
                setSubjectList({
                    loaded: true,
                    subjects: response.data.data.subjects,
                });

                if (response.data.data.subjects.length === 0) {
                    ctx.showSwal(0, 'No Subjects Available!');
                }
            })

            .catch((error) => {
                if (error.response) ctx.showSwal(0, error.response.data.message);
                else ctx.showSwal(0, error.message);
            });
    }, [newSubject]);

    const submitForm = async (event) => {
        event.preventDefault();
        setBtnState('loading');
        await axios
            .post(
                `${ctx.baseURL}/subjects?semester=${params.semesterId}`,
                {
                    subject: subject.current.value,
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + ctx.token,
                    },
                }
            )
            .then((response) => {
                subject.current.value = '';
                ctx.showSwal(1, 'Subject added successfully!');
                setNewSubject(response.data.data.subject);
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.data.error.code === 11000) ctx.showSwal(0, 'Subject already exists!');
                    else ctx.showSwal(0, error.response.data.message);
                } else ctx.showSwal(0, error.message);
            });
        setBtnState('');
    };

    return (
        <>
            <div className='flex-grow'>
                <SubSectionHeader text='Add Subject' />
                <div className='semesters mt-2 flex justify-center'>
                    <div className='rounded shadow-xl p-3 w-11/12 md:w-8/12 lg:w-3/5'>
                        <form className='font-medium w-full' onSubmit={submitForm}>
                            <div className='form-control'>
                                <label className='label'>
                                    <span className='label-text'>Subject Name</span>
                                </label>
                                <select className={ctx.selectClasses} ref={subject} required>
                                    {!subjectList.loaded && <option value=''>Loading Subjects...</option>}
                                    {subjectList.loaded && <option value=''>Select Subject</option>}
                                    {subjectList.loaded &&
                                        subjectList.subjects.map((subject, index) => {
                                            return (
                                                <option key={index} value={subject._id}>
                                                    {subject.name} ({subject.creditHours} credit hrs)
                                                </option>
                                            );
                                        })}
                                </select>
                            </div>

                            <br />

                            <div className='form-control flex items-center'>
                                <button className={`${ctx.btnClasses} ${btnState}`} type='submit'>
                                    Add Subject
                                </button>
                            </div>
                        </form>

                        <BackButton to={'/admin/semester/' + params.semesterId + '/subjects'} text='Subjects' />
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddSubject;
