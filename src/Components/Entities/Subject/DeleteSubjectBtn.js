import axios from 'axios';
import React from 'react';

const DeleteSubjectBtn = ({ ctx, MySwal, navigate, subject, params }) => {
    const deleteSubject = () => {
        MySwal.fire({
            html: `
                <div className="swal2-title">Are you sure?</div>
                <div className="swal2-content">This subject and all its data will be deleted permanently from the database.
                <br/>
                <span className="text-info">If you want to keep this subject, archive it instead!</span></div>
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
                    <div className="swal2-content">Confirm Subject Name</div>
                <input id="subject-name" className="swal2-input" placeholder="Subject Name">
            `,
                    showCancelButton: true,
                    confirmButtonText: 'Submit',
                    showLoaderOnConfirm: true, // Show loading spinner

                    preConfirm: () => {
                        const subjectName = document.getElementById('subject-name').value;

                        // Check if fields are not selected
                        if (!subjectName) {
                            MySwal.showValidationMessage('Enter subject name');
                            return false; // Prevent closing the modal
                        } else if (subjectName !== subject.name) {
                            MySwal.showValidationMessage(
                                'Subject name does not match, make sure you are deleting the intended subject!'
                            );
                            return false; // Prevent closing the modal
                        }

                        return { subjectName };
                    },
                }).then((result) => {
                    if (result.isConfirmed) {
                        MySwal.fire({
                            title: 'Deleting Subject',
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
                                        MySwal.close();

                                        if (error.response) ctx.showSwal(0, error.response.data.message);
                                        else ctx.showSwal(0, error.message);
                                    });
                            },
                        });
                    }
                });
            }
        });
    };
    return (
        <button className={`${ctx.btnClasses} btn-error`} onClick={deleteSubject}>
            Delete Subject
        </button>
    );
};

export default DeleteSubjectBtn;
