import { useRouteError } from 'react-router-dom';

export default function Error() {
    const error = useRouteError();
    console.error(error);

    return (
        <div className='min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center justify-center'>
            <div className='bg-white shadow-lg rounded-lg p-8'>
                <h1 className='text-3xl font-bold text-center text-gray-800 mb-4'>Oops!</h1>
                <p className='text-lg text-center text-gray-600 mb-4'>Sorry, an unexpected error has occurred.</p>
                <p className='text-center text-gray-600 mb-4'>
                    <p>{error.response && error.response.data.message}</p>
                    <p>{!error.response && error.statusText}</p>
                </p>
            </div>
        </div>
    );
}
