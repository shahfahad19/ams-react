import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import BackButton from '../../Utils/BackButton';

const AddSemester = () => {
    const [btnState, setBtnState] = useState('');
    const [semester, setSemester] = useState('');
    const params = useParams();
    const ctx = useContext(AppContext);

    const semesterNameHandler = (event) => {
        setSemester(event.target.value);
    };

    const submitForm = async (event) => {
        event.preventDefault();

        setBtnState('loading');

        await axios
            .post(
                `${ctx.baseURL}/semesters?batch=${params.batchId}`,
                { name: semester },
                {
                    headers: {
                        Authorization: 'Bearer ' + ctx.token,
                    },
                }
            )
            .then((response) => {
                setSemester('');
                ctx.showSwal(1, 'Semester created successfully!');
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
        <>
            <div className='flex-grow'>
                <SubSectionHeader text='Add Semester' />
                <div className='semesters mt-2 flex justify-center'>
                    <div className='rounded shadow-xl p-3 w-11/12 md:w-8/12 lg:w-3/5'>
                        <form className='font-medium w-full' onSubmit={submitForm}>
                            <div className='flex justify-between items-center border border-solid rounded-full border-neutral'>
                                <p className='pl-4'>Semester</p>
                                <div className='form-control'>
                                    <select
                                        className='select select-bordered select-sm md:select-md rounded-full'
                                        value={semester}
                                        onChange={(event) => semesterNameHandler(event)}
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
                            <div className='form-control flex items-center'>
                                <button className={`${ctx.btnClasses} ${btnState}`} type='submit'>
                                    Add Semester
                                </button>
                            </div>
                        </form>

                        <BackButton to={'/admin/batch/' + params.batchId + '/semesters'} text='Semesters' />
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddSemester;
