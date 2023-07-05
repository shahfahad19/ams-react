import axios from 'axios';
import React, { useContext, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Message from '../../Main/Message';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import BackButton from '../../Utils/BackButton';

const AddSubject = () => {
    const [btnState, setBtnState] = useState('');
    const subject = useRef();
    const creditHours = useRef();

    const [alert, setAlert] = useState({
        show: false,
    });
    const params = useParams();
    const ctx = useContext(AppContext);

    const submitForm = async (event) => {
        event.preventDefault();
        setBtnState('loading');
        await axios
            .post(
                `${ctx.baseURL}/subjects?semester=${params.semesterId}`,
                {
                    name: subject.current.value,
                    creditHours: creditHours.current.value,
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + ctx.token,
                    },
                }
            )
            .then((response) => {
                subject.current.value = '';
                creditHours.current.value = '';
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
                if (error.response.data.error.code === 11000)
                    setAlert({
                        show: true,
                        type: 'error',
                        message: 'A subject with this name already exists in this semester',
                        showBtn: true,
                    });
                else
                    setAlert({
                        show: true,
                        type: 'error',
                        message: error.response.data.message,
                        showBtn: true,
                    });
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
                                <input
                                    className={ctx.inputClasses}
                                    type='text'
                                    placeholder='Subject Name'
                                    ref={subject}
                                    required
                                ></input>
                            </div>

                            <br />

                            <div className='form-control'>
                                <label className='label'>
                                    <span className='label-text'>Credit Hours</span>
                                </label>
                                <select className={ctx.selectClasses} ref={creditHours} required>
                                    <option value=''>Select Credit Hours</option>
                                    <option value='3'>3 Hours</option>
                                    <option value='4'>4 Hours</option>
                                </select>
                            </div>

                            <br />
                            <div className='form-control flex items-center'>
                                <button className={`${ctx.btnClasses} ${btnState}`} type='submit'>
                                    Add Subject
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
                        <BackButton to={'/admin/semester/' + params.semesterId + '/subjects'} text='Subjects' />
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddSubject;
