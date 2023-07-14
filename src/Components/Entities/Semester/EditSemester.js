import axios from 'axios';
import React, { useContext, useRef, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import SemesterDeleteBtn from './DeleteSemesterBtn';

const EditSemester = () => {
    const navigate = useNavigate();
    const [btnState, setBtnState] = useState();
    const [semester, setSemester] = useOutletContext();
    const params = useParams();
    const semesterName = useRef();
    const archived = useRef();
    const ctx = useContext(AppContext);
    const MySwal = withReactContent(Swal);

    const submitForm = async (event) => {
        event.preventDefault();
        setBtnState('loading');
        const semesterData = {
            name: semesterName.current.value,
            archived: archived.current.value === 'True',
        };
        await axios
            .patch(`${ctx.baseURL}/semesters/${params.semesterId}`, semesterData, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + ctx.token,
                },
            })
            .then((response) => {
                setSemester(response.data.data.semester);
                ctx.baseURL(1, 'Semester updated!');
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.data.error.code === 11000) ctx.showSwal(0, 'Semester already exists!');
                    else ctx.showSwal(0, error.response.data.message);
                } else ctx.showSwal(0, error.message);
            });
        setBtnState('');
    };

    return (
        <div className='flex-grow'>
            <SubSectionHeader text='Edit semester' />
            {semester.name && (
                <div className='flex justify-center'>
                    <div className='rounded shadow-xl p-3 w-11/12 md:w-8/12 lg:w-3/5'>
                        <form className='font-medium w-full' onSubmit={submitForm}>
                            <div className='flex justify-between items-center border border-solid rounded-full border-neutral'>
                                <p className='pl-4'>Semester</p>
                                <div className='form-control'>
                                    <select
                                        className='select select-bordered select-sm md:select-md rounded-full'
                                        ref={semesterName}
                                        defaultValue={semester.name}
                                        required
                                    >
                                        <option value=''>Select</option>
                                        <option value='1'>1</option>
                                        <option value='2'>2</option>
                                        <option value='3'>3</option>
                                        <option value='4'>4</option>
                                        <option value='5'>5</option>
                                        <option value='6'>6</option>
                                        <option value='7'>7</option>
                                        <option value='8'>8</option>
                                    </select>
                                </div>
                            </div>
                            <br />
                            <div className='flex justify-between items-center border border-solid rounded-full border-neutral'>
                                <p className='pl-4'>Archived</p>
                                <div className='form-control'>
                                    <select
                                        className='select select-bordered select-sm md:select-md rounded-full'
                                        defaultValue={semester.archived ? 'True' : 'False'}
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
                                <span className='label-text-alt'>If a semester is finished, set it to True</span>
                            </label>
                            <div className='form-control flex items-center'>
                                <button className={`${ctx.btnClasses} ${btnState}`} type='submit'>
                                    Update
                                </button>
                            </div>
                        </form>
                        <div className='form-control flex items-center flex-row justify-center mt-3'>
                            <SemesterDeleteBtn
                                ctx={ctx}
                                params={params}
                                MySwal={MySwal}
                                semester={semester}
                                navigate={navigate}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditSemester;
