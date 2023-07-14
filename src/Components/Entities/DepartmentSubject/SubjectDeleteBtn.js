import axios from 'axios';
import React, { useContext } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import AppContext from '../../Context/AppContext';

const SubjectDeleteBtn = (props) => {
    const ctx = useContext(AppContext);
    const MySwal = withReactContent(Swal);
    const subject = props.subject;

    const deleteSubject = () => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel!',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                MySwal.fire({
                    title: 'Removing subject',
                    allowOutsideClick: false,
                    didOpen: () => {
                        MySwal.showLoading();

                        // axios req
                        axios
                            .delete(`${ctx.baseURL}/subjects/defaultSubjects/${subject._id}`, {
                                credentials: 'include',
                                headers: {
                                    Authorization: 'Bearer ' + ctx.token,
                                },
                            })
                            .then((response) => {
                                MySwal.close();

                                MySwal.fire({
                                    icon: 'success',
                                    title: 'Removed!',
                                    text: 'Subject deleted successfully',
                                    showConfirmButton: true,
                                });
                                props.subjectDeleted(Math.random());
                            })
                            .catch((error) => {
                                MySwal.close();

                                if (error.response) {
                                    MySwal.fire({
                                        icon: 'error',
                                        title: 'Something went wrong!',
                                        message: error.response.data.message,
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
    };

    return (
        <button className='btn btn-error btn-sm mr-2' onClick={deleteSubject}>
            Delete
        </button>
    );
};

export default SubjectDeleteBtn;
