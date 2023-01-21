import React, { useEffect, useState } from 'react';
import SubSectionHeader from '../../Utils/SubSectionHeader';

const InviteLink = (props) => {
    const [batchCode, setBatchCode] = useState(props.batch.batchCode);
    useEffect(() => {
        setBatchCode(props.batch.batchCode);
    }, [props]);

    function formChanged() {}

    const shareLink = async () => {
        const share = await navigator.share({
            title: 'SignUp in AMS App',
            text: 'Click the following link to signup for Attendance Managment System',
            url: 'http://localhost:3000/signup',
        });
    };

    const copyLink = () => {
        if (batchCode === undefined) return;
        navigator.clipboard.writeText('http://localhost:3000/signup?code=' + batchCode);
    };

    return (
        <div className='flex-grow'>
            <SubSectionHeader text='Invite Link' />
            {props.batch.batchCode && (
                <div className='flex flex-col md:flex-row md:space-x-10 mt-4 space-y-4 md:space-y-10 items-center justify-center'>
                    <div className='qr hidden md:block'>
                        <img
                            src={` https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${batchCode}`}
                            alt='QR'
                        />
                    </div>
                    <div className='qr md:hidden'>
                        <img
                            src={` https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${batchCode}`}
                            alt='QR'
                        />
                    </div>
                    <div className='flex flex-col text-sm md:text-lg'>
                        <div>
                            Share the code <span className='code font-bold text-primary'>{batchCode}</span> with
                            students
                        </div>
                        <div className='flex items-center space-x-2'>
                            <div className=' h-0.5 bg-base-300 w-full rounded'></div>

                            <p>OR</p>
                            <div className=' h-0.5 bg-base-300 w-full rounded'></div>
                        </div>

                        <div className>Share the link below</div>
                        <div className='input-group flex flex-col sm:flex-row items-center mt-5'>
                            <div className='w-full'>
                                <input
                                    id='link'
                                    onChange={formChanged}
                                    value={batchCode ? 'http://localhost:3000/signup?code=' + batchCode : '...'}
                                    className='input input-disabled input-sm md:input-md w-full'
                                />
                            </div>
                            <div className='w-full'>
                                <button className='btn btn-neutral btn-sm md:btn-md w-1/2' onClick={copyLink}>
                                    Copy
                                </button>
                                <button className='btn btn-accent btn-sm md:btn-md w-1/2' onClick={shareLink}>
                                    Share
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InviteLink;
