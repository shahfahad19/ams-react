import axios from 'axios';
import React, { useContext, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Message from '../../Main/Message';
import AppContext from '../../Context/AppContext';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { showAlert } from '../../Utils/sweetAlert';

const EditPic = () => {
    const MySwal = withReactContent(Swal);
    const ctx = useContext(AppContext);
    const [btnState, setBtnState] = useState('');
    const [alert, setAlert] = useState({
        show: false,
    });

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
        try {
            setImagePreview(URL.createObjectURL(e.target.files[0]));
        } catch (err) {}
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlert({
            show: false,
        });
        setBtnState('loading');
        const formData = new FormData();
        formData.append('image', image);
        axios
            .post(`${ctx.baseURL}/user/updatePhoto`, formData, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + ctx.token,
                },
            })
            .then((response) => {
                setBtnState('');
                setAlert({
                    show: true,
                    type: 'success',
                    message: 'Updated successfully!',
                });
            })
            .catch((error) => {
                console.log(error.response.data);
                setBtnState('');
                setAlert({
                    show: true,
                    type: 'error',
                    message: error.response.data.message,
                });
                window.grecaptcha.reset();
            });
    };

    return (
        <>
            <div className='flex-grow'>
                <SubSectionHeader text='Edit Profile' />
                <div className='flex justify-center'>
                    <div className='rounded shadow-xl p-3 w-11/12 md:w-8/12 lg:w-3/5'>
                        <form className='w-full' onSubmit={handleSubmit}>
                            <div>
                                <label className='label'>
                                    <span className='label-text'>Photo</span>
                                </label>
                                <input
                                    className='file-input-bordered file-input w-full border-neutral rounded-full'
                                    type='file'
                                    alt='Select Image'
                                    accept='image/jpeg'
                                    onChange={handleImageChange}
                                />
                            </div>

                            {image !== null && (
                                <>
                                    <br />
                                    <div className='flex justify-center'>
                                        <img
                                            src={imagePreview || ''}
                                            className='w-48 h-48 rounded-full'
                                            alt='img'
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                </>
                            )}
                            <br />
                            <div className='form-control flex items-center'>
                                <button
                                    className={` btn btn-neutral font-medium btn-sm rounded-lg w-fit ${btnState}`}
                                    type='submit'
                                >
                                    Update Picture
                                </button>
                            </div>
                            {alert.show === true && (
                                <div className='my-2'>
                                    <Message type={alert.type} text={alert.message} showBtn={false} />
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditPic;
