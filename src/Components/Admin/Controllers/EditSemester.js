import axios from 'axios';
import React, { useContext, useRef, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Message from '../../Main/Message';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

const EditSemester = () => {
    const navigate = useNavigate();
    const [btnState, setBtnState] = useState();
    const [semester, setSemester] = useOutletContext();
    const params = useParams();
    const semesterName = useRef();
    const archived = useRef();
    const [alert, setAlert] = useState({
        show: false,
    });
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
                setAlert({
                    show: true,
                    type: 'success',
                    message: 'Edited Successfully',
                    showBtn: true,
                });
            })
            .catch((error) => {
                if (error.response.data.error.code === 11000)
                    setAlert({
                        show: true,
                        type: 'error',
                        message: 'A semester with this name already exists in this batch',
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

    const deleteSemster = () => {
        MySwal.fire({
            html: `
                <div class="swal2-title">Are you sure?</div>
                <div class="swal2-content">This semester, its subjects and its attendances will be deleted permanently from the database.
                <br/>
                <span class="text-info">If you want to keep this semester, archive it instead!</span></div>
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
                    <div class="swal2-content">Confirm Semester Name</div>
                <input id="semester-name" class="swal2-input" placeholder="Subject Name">
            `,
                    showCancelButton: true,
                    confirmButtonText: 'Submit',
                    showLoaderOnConfirm: true, // Show loading spinner

                    preConfirm: () => {
                        const semesterName = document.getElementById('semester-name').value;

                        // Check if fields are not selected
                        if (!semesterName) {
                            Swal.showValidationMessage('Enter semester name');
                            return false; // Prevent closing the modal
                        } else if (semesterName !== 'Semester ' + semester.name) {
                            Swal.showValidationMessage(
                                'Semester name does not match, make sure you are deleting the intended semester!'
                            );
                            return false; // Prevent closing the modal
                        }

                        return { semesterName };
                    },
                }).then((result) => {
                    if (result.isConfirmed) {
                        MySwal.fire({
                            title: 'Deleting Semester',
                            allowOutsideClick: false,
                            didOpen: () => {
                                MySwal.showLoading();

                                // axios req
                                axios
                                    .delete(`${ctx.baseURL}/semesters/${params.semesterId}`, {
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
                                            text: 'Semester Deleted successfully',
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
                            <button className={`${ctx.btnClasses} btn-error`} onClick={deleteSemster}>
                                Delete Semester
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

export default EditSemester;
