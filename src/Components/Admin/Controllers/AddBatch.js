import axios from 'axios';
import React, { useContext, useState } from 'react';
import AppContext from '../../Context/AppContext';
import Message from '../../Main/Message';

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
                `${ctx.baseURL}/admin/batches`,
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
                console.log(error);
                setAlert({
                    show: true,
                    type: 'error',
                    message: error.message,
                    showBtn: true,
                });
            });
        setBtnState('');
    };

    return (
        <>
            <div className='add-batch'>
                <div className='md:bg-primary md:p-2 text-xl text-primary font-medium text-center md:flex-grow md:text-primary-content'>
                    Add Batch
                </div>
                <div className='semesters mt-2 flex justify-center'>
                    <div className='rounded shadow-xl p-3 w-11/12 md:w-8/12 lg:w-3/5'>
                        <form className='font-medium w-full' onSubmit={submitForm}>
                            <div className='form-control'>
                                <input
                                    className='input w-full input-bordered input-sm md:input-md'
                                    type='text'
                                    placeholder='Batch Name'
                                    value={batch}
                                    onChange={batchNameHandler}
                                    required
                                ></input>
                            </div>

                            <br />
                            <div className='form-control'>
                                <button
                                    className={` btn btn-primary w-full font-bold btn-sm md:btn-md ${btnState}`}
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
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddBatch;
