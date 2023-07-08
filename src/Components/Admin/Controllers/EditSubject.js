import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Message from '../../Main/Message';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

const EditSubject = (props) => {
    const navigate = useNavigate();
    const [subject, setSubject] = useOutletContext();
    const [btnState, setBtnState] = useState();
    const params = useParams();
    const archived = useRef();
    const MySwal = withReactContent(Swal);
    const [alert, setAlert] = useState({
        show: false,
    });
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
                setAlert({
                    show: true,
                    type: 'success',
                    text: 'Edited Successfully',
                    showBtn: true,
                });
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

    const deleteSubject = () => {
        MySwal.fire({
            html: `
                <div class="swal2-title">Are you sure?</div>
                <div class="swal2-content">This subject and its attendances will be deleted permanently from the database.
                <br/>
                <span class="text-info">If you want to keep this subject, archive it instead!</span></div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                MySwal.fire({
                    title: 'Add Subject',
                    html: `
                    <div class="swal2-content">Confirm Subject Name</div>
                <input id="subject-name" class="swal2-input" placeholder="Subject Name">
            `,
                    showCancelButton: true,
                    confirmButtonText: 'Submit',
                    showLoaderOnConfirm: true, // Show loading spinner

                    preConfirm: () => {
                        const subjectName = document.getElementById('subject-name').value;

                        // Check if fields are not selected
                        if (!subjectName) {
                            Swal.showValidationMessage('Enter subject name');
                            return false; // Prevent closing the modal
                        } else if (subjectName !== subject.name) {
                            Swal.showValidationMessage(
                                'Subject name does not match, make sure you are deleting the intended subject!'
                            );
                            return false; // Prevent closing the modal
                        }

                        return { subjectName };
                    },
                }).then((result) => {
                    if (result.isConfirmed) {
                        MySwal.fire({
                            title: 'Removing subject',
                            allowOutsideClick: false,
                            didOpen: () => {
                                MySwal.showLoading();

                                // axios req
                                axios
                                    .delete(`${ctx.baseURL}/subjects/${params.subjectId}`, {
                                        credentials: 'include',
                                        headers: {
                                            Authorization: 'Bearer ' + ctx.token,
                                        },
                                    })
                                    .then((response) => {
                                        console.log(response.data);
                                        MySwal.close();

                                        MySwal.fire({
                                            icon: 'success',
                                            title: 'Deleted!',
                                            text: 'Subject Deleted successfully',
                                            showConfirmButton: true,
                                        }).then(() => {
                                            navigate(-1, { replace: true });
                                        });
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                        MySwal.close();

                                        if (error.response) {
                                            MySwal.fire({
                                                icon: 'error',
                                                title: 'Something went wrong!',
                                                text: error.response.data.message,
                                                showConfirmButton: true,
                                                confirmButtonText: 'Ok',
                                            });
                                        } else {
                                            MySwal.fire({
                                                icon: 'error',
                                                title: 'Something went wrong!',
                                                text: error.message,
                                                showConfirmButton: true,
                                                confirmButtonText: 'Ok',
                                            });
                                        }
                                    });
                            },
                        });
                    }
                });
            }
        });
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
                            <button className={`${ctx.btnClasses} btn-error`} onClick={deleteSubject}>
                                Delete Subject
                            </button>
                        </div>

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
