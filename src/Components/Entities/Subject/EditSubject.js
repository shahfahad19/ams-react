import axios from 'axios';
import React, { useContext, useRef, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import SubjectDeleteBtn from './DeleteSubjectBtn';

const EditSubject = (props) => {
    const navigate = useNavigate();
    const [subject, setSubject] = useOutletContext();
    const [btnState, setBtnState] = useState();
    const params = useParams();
    const archived = useRef();
    const MySwal = withReactContent(Swal);
    const ctx = useContext(AppContext);

    const submitForm = async (event) => {
        event.preventDefault();
        setBtnState('loading');
        const subjectData = {
            archived: archived.current.value === 'True',
        };
        await axios
            .patch(`${ctx.baseURL}/subjects/${params.subjectId}`, subjectData, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + ctx.token,
                },
            })
            .then((response) => {
                setSubject(response.data.data.subject);
                ctx.showSwal(1, 'Subject updated');
            })
            .catch((error) => {
                if (error.response) ctx.showSwal(0, error.response.data.message);
                else ctx.showSwal(0, error.message);
            });
        setBtnState('');
    };

    return (
        <div className='flex-grow'>
            <SubSectionHeader text='Edit subject' />
            {subject.name && (
                <div className='flex justify-center'>
                    <div className='rounded shadow-xl p-3 w-11/12 md:w-8/12 lg:w-3/5 mb-6'>
                        <form className='font-medium w-full' onSubmit={submitForm}>
                            <div className='form-control'>
                                <label className='label'>Subject Name</label>
                                <input
                                    className={ctx.inputClasses}
                                    type='text'
                                    disabled
                                    defaultValue={subject.name}
                                ></input>
                            </div>
                            <br />
                            <div className='flex justify-between items-center border border-solid rounded-full border-neutral'>
                                <p className='pl-4'>Archived</p>
                                <div className='form-control'>
                                    <select
                                        className='select select-bordered select-sm md:select-md rounded-full'
                                        defaultValue={subject.archived ? 'True' : 'False'}
                                        ref={archived}
                                        required
                                    >
                                        <option>True</option>
                                        <option>False</option>
                                    </select>
                                </div>
                            </div>
                            <label className='label'>
                                <span className='label-text-alt'></span>
                                <span className='label-text-alt'>
                                    If this subject's classes are finished, archive it.
                                </span>
                            </label>

                            <div className='form-control flex items-center flex-row justify-center'>
                                <button className={`${ctx.btnClasses} ${btnState}`} type='submit'>
                                    Update
                                </button>
                            </div>
                        </form>
                        <div className='form-control flex items-center flex-row justify-center mt-3'>
                            <SubjectDeleteBtn
                                ctx={ctx}
                                params={params}
                                MySwal={MySwal}
                                subject={subject}
                                navigate={navigate}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditSubject;
