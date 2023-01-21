import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Message from '../../Main/Message';
import SubSectionHeader from '../../Utils/SubSectionHeader';

const EditSubject = (props) => {
    const [subject, setSubject] = useOutletContext();
    const [btnState, setBtnState] = useState();
    const params = useParams();
    const subjectName = useRef();
    const archived = useRef();
    const [alert, setAlert] = useState({
        show: false,
    });
    const ctx = useContext(AppContext);

    const submitForm = async (event) => {
        event.preventDefault();
        setBtnState('loading');
        const subjectData = {
            name: subjectName.current.value,
            archived: archived.current.value === 'True',
        };
        const baseURL = 'http://localhost:5000/admin/subject/' + params.subjectId;

        await axios
            .patch(`${baseURL}`, subjectData, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + ctx.token,
                },
            })
            .then((response) => {
                setSubject(response.data.data.subject);
                props.subjectEdited(response.data.data.subject);
                setAlert({
                    show: true,
                    type: 'success',
                    message: 'Edited Successfully',
                    showBtn: true,
                });
            })
            .catch((error) => {
                console.log(error);
            });
        setBtnState('');
    };

    return (
        <div className='flex-grow'>
            <SubSectionHeader text='Edit subject' />
            {subject.name && (
                <div className='flex justify-center'>
                    <div className='rounded shadow-xl p-3 w-11/12 md:w-8/12 lg:w-3/5'>
                        <form className='font-medium w-full' onSubmit={submitForm}>
                            <div className='form-control'>
                                <label className='label'>Subject Name</label>
                                <input
                                    className='input w-full input-bordered input-sm md:input-md'
                                    type='text'
                                    ref={subjectName}
                                    required
                                    defaultValue={subject.name}
                                ></input>
                            </div>
                            <br />
                            <div className='flex justify-between items-center border border-solid rounded-lg border-base-300'>
                                <p className='pl-4'>Archived</p>
                                <div className='form-control'>
                                    <select
                                        className='select select-bordered select-sm md:select-md'
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
                            <br />

                            <div className='form-control'>
                                <button
                                    className={` btn btn-primary w-full font-bold btn-sm md:btn-md ${btnState}`}
                                    type='submit'
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                        {alert.show === true && (
                            <div className='my-2'>
                                <Message
                                    type={alert.type}
                                    text={alert.message}
                                    showBtn={alert.showBtn}
                                    hideAlert={() => {
                                        setAlert({ show: false });
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditSubject;
