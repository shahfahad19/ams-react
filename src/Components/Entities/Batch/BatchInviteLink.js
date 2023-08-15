import React, { useContext } from 'react';
import { useOutletContext } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import SubSectionHeader from '../../Utils/SubSectionHeader';

const BatchInviteLink = () => {
  const [batch] = useOutletContext();
  const batchCode = batch.batchCode || undefined;
  const ctx = useContext(AppContext);

  function formChanged() {}

  const shareLink = async () => {
    await navigator.share({
      title: 'SignUp in AMS App',
      text: 'Click the following link to signup for Attendance Managment System',
      url: `${ctx.baseURL}/signup?code=${batchCode}`
    });
  };

  const copyLink = () => {
    if (batchCode === undefined) return;
    navigator.clipboard.writeText(`${ctx.baseURL}/signup?code=${batchCode}`);
  };

  return (
    <div className="pb-20">
      <SubSectionHeader text="Invite Link" />
      {batchCode !== undefined && (
        <div className="flex flex-col md:flex-row md:space-x-10 my-4 space-y-5 md:space-y-0 items-center justify-center">
          <div className="md:block">
            <img
              src={` https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://amsapp.vercel.app/signup?code=${batchCode}`}
              alt="QR"
            />
          </div>
          <div className="flex flex-col text-sm md:text-lg">
            <div>
              Share the code <span className="code font-bold text-primary">{batchCode}</span> with
              students
            </div>
            <div className="divider divider-horizontal sm:w-72 md:w-80">OR</div>

            <div>Share the link below</div>
            <div className="input-group flex flex-col items-center mt-2">
              <div className="w-full">
                <input
                  id="link"
                  onChange={formChanged}
                  value={batchCode ? `https://amsapp.vercel.app/signup?code=${batchCode}` : '...'}
                  className="input input-sm md:input-md w-full rounded-none"
                  disabled
                />
              </div>
              <div className="w-full">
                <button
                  className="btn btn-primary btn-sm md:btn-md w-1/2 rounded-none"
                  onClick={copyLink}>
                  Copy
                </button>
                <button
                  className="btn btn-success btn-sm md:btn-md w-1/2 rounded-none"
                  onClick={shareLink}>
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

export default BatchInviteLink;
