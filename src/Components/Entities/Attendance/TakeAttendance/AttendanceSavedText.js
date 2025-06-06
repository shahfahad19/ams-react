import React from 'react';
import BackButton from '../../../Utils/BackButton';

const AttendanceSavedText = () => {
  return (
    <div className="flex items-center justify-center text-xl flex-col mt-5 space-y-5">
      <div className="flex justify-center">
        <svg
          width="64"
          height="64"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM18.58 32.58L11.4 25.4C10.62 24.62 10.62 23.36 11.4 22.58C12.18 21.8 13.44 21.8 14.22 22.58L20 28.34L33.76 14.58C34.54 13.8 35.8 13.8 36.58 14.58C37.36 15.36 37.36 16.62 36.58 17.4L21.4 32.58C20.64 33.36 19.36 33.36 18.58 32.58Z"
            fill="#00BA34"
          />
        </svg>
      </div>
      <p className="text-success">Attendance Saved</p>

      <BackButton to={'../attendance'} text="attendances" className="justify-self-start" />
    </div>
  );
};

export default AttendanceSavedText;
