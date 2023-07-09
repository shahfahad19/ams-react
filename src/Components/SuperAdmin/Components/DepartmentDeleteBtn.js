import axios from 'axios';
import React from 'react';
const DepartmentDeleteBtn = ({ department, navigate, params, ctx, MySwal }) => {
    const deleteDepartment = () => {
        MySwal.fire({
            html: `
                <div class="swal2-title">Are you sure?</div>
                <div class="swal2-content">This department and all its data will be deleted permanently from the database.
                <br/>
                <span class="text-info">This action cannot be undone later</span></div>
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
                    html: `
                    <div class="swal2-content">Confirm Department Name</div>
                <input id="department-name" class="swal2-input" placeholder="Department Name">
            `,
                    showCancelButton: true,
                    confirmButtonText: 'Submit',
                    showLoaderOnConfirm: true, // Show loading spinner

                    preConfirm: () => {
                        const departmentName = document.getElementById('department-name').value;

                        // Check if fields are not selected
                        if (!departmentName) {
                            MySwal.showValidationMessage('Enter department name');
                            return false; // Prevent closing the modal
                        } else if (departmentName !== department.department) {
                            MySwal.showValidationMessage(
                                'Department name does not match, make sure you are deleting the intended department!'
                            );
                            return false; // Prevent closing the modal
                        }

                        return { departmentName };
                    },
                }).then((result) => {
                    if (result.isConfirmed) {
                        MySwal.fire({
                            title: 'Deleting Department',
                            allowOutsideClick: false,
                            didOpen: () => {
                                MySwal.showLoading();

                                // axios req
                                axios
                                    .delete(`${ctx.baseURL}/users/department/${params.departmentId}`, {
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
                                            text: 'Department Deleted successfully',
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
        <button className='btn btn-error' onClick={deleteDepartment}>
            Delete Department
        </button>
    );
};

export default DepartmentDeleteBtn;
