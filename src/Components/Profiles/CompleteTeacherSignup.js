import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AppContext from '../Context/AppContext';
import axios from 'axios';

const CompleteTeacherSignup = () => {
  const ctx = useContext(AppContext);
  const [btnState, setBtnState] = useState('');

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    // TODO: Add alert for welcome and ask to complete profile
  }, []);

  const submitForm = (data) => {
    setBtnState('loading');
    axios
      .post(`${ctx.baseURL}/user/completeProfile`, data, {
        credentials: 'include',
        headers: {
          Authorization: 'Bearer ' + ctx.token
        }
      })
      .then(() => {
        setBtnState('');

        ctx.navigate('/login?profileCompleted=true', { replace: true });
      })
      .catch((error) => {
        setBtnState('');
        if (error.response) ctx.showSwal(0, error.response.data.message);
        else ctx.showSwal(0, error.message);
      });
  };

  return (
    <div className="flex justify-center">
      <div className="w-full md:w-1/3">
        <form className="flex flex-col space-y-2" onSubmit={handleSubmit(submitForm)}>
          <div>
            <label className="label">
              <span className="label-text">Name</span>
              {errors.name && <span className="label-text text-error">{errors.name.message}</span>}
            </label>
            <input
              className={`${ctx.inputClasses} ${errors.name && 'input-error'}`}
              type="text"
              placeholder="Full Name"
              defaultValue={ctx.userData.name}
              {...register('name', {
                required: {
                  value: true,
                  message: 'Please provide your full name'
                },
                minLength: {
                  value: 3,
                  message: 'Minimum 3 characters required'
                },
                maxLength: {
                  value: 20,
                  message: 'Maximum length is exceeded (20)'
                }
              })}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Gender</span>
              {errors.gender && (
                <span className="label-text text-error">{errors.gender.message}</span>
              )}
            </label>
            <select
              className={`${ctx.selectClasses} ${errors.gender && 'select-error'}`}
              defaultValue={ctx.userData.gender}
              {...register('gender', {
                required: {
                  value: true,
                  message: 'Please select an option'
                }
              })}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div>
            <label className="label">
              <span className="label-text">New Password</span>
              {errors.password && (
                <span className="label-text text-error">{errors.password.message}</span>
              )}
            </label>
            <input
              className={`${ctx.inputClasses} ${errors.password && 'input-error'}`}
              type="password"
              placeholder="********"
              {...register('password', {
                required: {
                  value: true,
                  message: 'Password is required'
                },
                minLength: {
                  value: 8,
                  message: 'Password should at least be be 9 characters'
                },
                maxLength: {
                  value: 25,
                  message: 'Maximum length of password exceeded (25)'
                }
              })}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Confirm Password</span>
              {errors.passwordConfirm && (
                <span className="label-text text-error">{errors.passwordConfirm.message}</span>
              )}
            </label>
            <input
              className={`${ctx.inputClasses} ${errors.passwordConfirm && 'input-error'}`}
              type="password"
              placeholder="********"
              {...register('passwordConfirm', {
                required: {
                  value: true,
                  message: 'Enter password again'
                },
                validate: (val) => {
                  if (watch('password') !== val) {
                    return 'Passwords do no match';
                  }
                }
              })}
            />
          </div>
          <div className="form-control flex items-center">
            <button
              className={` btn btn-sm btn-neutral w-fit font-medium rounded-lg ${btnState}`}
              type="submit">
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteTeacherSignup;
