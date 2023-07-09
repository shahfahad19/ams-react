import axios from 'axios';
import React from 'react';

const SemesterDeleteBtn = ({ ctx, MySwal, navigate, semester, params }) => {
    const deleteSemester = () => {
        MySwal.fire({
            html: `
                <div class="swal2-title">Are you sure?</div>
                <div class="swal2-content">This semester and all its data will be deleted permanently from the database.
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
                <input id="semester-name" class="swal2-input" placeholder="Semester Name">
            `,
                    showCancelButton: true,
                    confirmButtonText: 'Submit',
                    showLoaderOnConfirm: true,
                    

                    preConfirm: () => {
                        const semesterName = document.getElementById('semester-name').value;

                        // Check if fields are not selected
                        if (!semesterName) {
                            MySwal.showValidationMessage('Enter semester name');
                            return false; // Prevent closing the modal
                        } else if (semesterName !== 'Semester ' + semester.name) {
                            MySwal.showValidationMessage(
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
        <button className={`${ctx.btnClasses} btn-error`} onClick={deleteSemester}>
            Delete Semester
        </button>
    );
};

export default SemesterDeleteBtn;
