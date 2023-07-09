import axios from 'axios';
import React from 'react';

const BatchDeleteBtn = ({ ctx, MySwal, navigate, batchData, params }) => {
    const deleteBatch = () => {
        MySwal.fire({
            html: `
                <div class="swal2-title">Are you sure?</div>
                <div class="swal2-content">This batch and all its data will be deleted permanently from the database.
                <br/>
                <span class="text-info">If you want to keep this batch, archive it instead!</span></div>
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
                         <div class="swal2-content">Confirm Batch Name</div>
                        <input id="batch-name" class="swal2-input" placeholder="Batch Name">
                    `,
                    showCancelButton: true,
                    showLoaderOnConfirm: true, // Show loading spinner

                    preConfirm: () => {
                        const batchName = document.getElementById('batch-name').value;

                        // Check if fields are not selected
                        if (!batchName) {
                            MySwal.showValidationMessage('Enter semester name');
                            return false; // Prevent closing the modal
                        } else if (batchName !== 'Batch ' + batchData.name) {
                            MySwal.showValidationMessage(
                                'Batch name does not match, make sure you are deleting the intended batch!'
                            );
                            return false; // Prevent closing the modal
                        }

                        return { batchName };
                    },
                }).then((result) => {
                    if (result.isConfirmed) {
                        MySwal.fire({
                            title: 'Deleting Batch',
                            allowOutsideClick: false,
                            didOpen: () => {
                                MySwal.showLoading();

                                // axios req
                                axios
                                    .delete(`${ctx.baseURL}/batches/${params.batchId}`, {
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
                                            text: 'Batch Deleted successfully',
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
        <button className={`${ctx.btnClasses} btn-error`} onClick={deleteBatch}>
            Delete Batch
        </button>
    );
};

export default BatchDeleteBtn;
