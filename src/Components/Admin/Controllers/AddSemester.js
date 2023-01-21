import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Message from '../../Main/Message';
import SubSectionHeader from '../../Utils/SubSectionHeader';

const AddSemester = () => {
    const [btnState, setBtnState] = useState('');
    const [semester, setSemester] = useState('');
    const [alert, setAlert] = useState({
        show: false,
    });
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
                `${ctx.baseURL}admin/batch/${params.batchId}/semesters`,
                { name: semester },
                {
                    headers: {
                        Authorization: 'Bearer ' + ctx.token,
                    },
                }
            )
            .then((response) => {
                setSemester('');
                setAlert({
                    show: true,
                    type: 'success',
                    message: 'Added Successfully',
                    showBtn: true,
                });
                setTimeout(() => {
                    setAlert({ show: false });
                }, 3000);
            })
            .catch((error) => {
                console.log(error);
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
                            <div className='form-control'>
                                <input
                                    className='input w-full input-bordered input-sm md:input-md'
                                    type='text'
                                    placeholder='Semester Name'
                                    value={semester}
                                    onChange={semesterNameHandler}
                                    required
                                ></input>
                            </div>

                            <br />
                            <div className='form-control'>
                                <button
                                    className={` btn btn-primary w-full font-bold btn-sm md:btn-md ${btnState}`}
                                    type='submit'
                                >
                                    Add Semester
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
            </div>
        </>
    );
};

export default AddSemester;
