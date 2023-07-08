import axios from 'axios';
import React, { useContext, useState } from 'react';
import AppContext from '../../Context/AppContext';
import Message from '../../Main/Message';
import { Link } from 'react-router-dom';
import BackButton from '../../Utils/BackButton';

const AddBatch = () => {
    const [btnState, setBtnState] = useState('');
    const [batch, setBatch] = useState('');
    const [alert, setAlert] = useState({
        show: false,
    });
    const ctx = useContext(AppContext);

    const batchNameHandler = (event) => {
        setBatch(event.target.value);
    };

    const submitForm = async (event) => {
        event.preventDefault();
        setBtnState('loading');
        setAlert({ show: false });
        let token = ctx.token;
        await axios
            .post(
                `${ctx.baseURL}/batches`,
                { name: batch },
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    },
                }
            )
            .then((response) => {
                setBatch('');
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
                        message: 'A batch with this name already exists in your department',
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
            <div className='add-batch'>
                <div className='md:p-2 text-xl text-neutral font-medium text-center md:flex-grow border-b-2'>
                    Add Batch
                </div>
                <div className='semesters mt-2 flex justify-center'>
                    <div className='rounded shadow-xl p-3 w-11/12 md:w-8/12 lg:w-3/5'>
                        <form className='font-medium w-full' onSubmit={submitForm}>
                            <div className='form-control'>
                                <input
                                    className={ctx.inputClasses}
                                    value={batch}
                                    type='number'
                                    onChange={(event) => batchNameHandler(event)}
                                    required
                                    placeholder='Enter batch no.'
                                    min='1'
                                />
                            </div>

                            <br />
                            <div className='form-control flex items-center'>
                                <button
                                    className={`btn btn-neutral w-fit rounded-lg btn-sm font-medium ${btnState}`}
                                    type='submit'
                                >
                                    Add Batch
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
                        <BackButton to='/admin/batches' text='Batch List' />
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddBatch;
