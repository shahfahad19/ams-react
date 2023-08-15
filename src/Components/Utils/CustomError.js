import React from 'react';

const CustomError = (props) => {
  const error = props.error;
  return (
    <>
      <div className="flex items-center justify-center h-80">
        <div className="text-center">
          <p className="text-error font-bold">
            {error.response ? (
              <>
                <span className="text-6xl">{error.response.status}</span>
                <br />
                <span className="text-2xl">{error.response.statusText}</span>
              </>
            ) : (
              <>
                <span className="text-3xl">{error.code}</span>
                <br />
                <span className="text-lg">{error.message}</span>
              </>
            )}
            <br />
          </p>

          {error.response && <p className="font-semibold mt-5">{error.response.data.message}</p>}
        </div>
      </div>
    </>
  );
};

export default CustomError;
