import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import AppContext from '../Context/AppContext';
import Form, {
  FormControl,
  FormField,
  FormGroup,
  FormLabel,
  FormLabelAlt,
  FormSubmitBtn,
  FormTitle,
  FormWrapper
} from '../Utils/Form';
import Alert from '../Utils/Alert';
import { AlertModal } from '../Utils/Modal';

const UpdatePassword = () => {
  const ctx = useContext(AppContext);
  const [btnState, setBtnState] = useState('');
  const [alert, setAlert] = useState({
    show: false
  });
  const [alertModal, setAlertModal] = useState({
    show: false,
    text: ''
  });

  const {
    register,

    handleSubmit,
    formState: { errors }
  } = useForm();

  const submitForm = (data) => {
    setAlert({
      show: false
    });
    setBtnState('btn-loading');
    axios
      .patch(`${ctx.baseURL}/user/updatePassword`, data, {
        credentials: 'include',
        headers: {
          Authorization: 'Bearer ' + ctx.token
        }
      })
      .then(() => {
        setBtnState('');
        setAlertModal({
          show: true,
          text: 'Password has been updated! Please login with your new password'
        });
        ctx.logout();
      })
      .catch((error) => {
        setBtnState('');
        setAlert({
          show: true,
          type: 'error',
          title: 'Update failed',
          text: ctx.computeError(error)
        });
      });
  };

  const successModalHandler = () => {
    window.location.assign('/login');
  };

  return (
    <>
      <FormWrapper>
        <Form onSubmit={handleSubmit(submitForm)}>
          <FormTitle>Update Password</FormTitle>
          <FormGroup>
            <FormField>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <input
                  className={`${ctx.inputClasses} ${errors.passwordCurrent && 'input-error'}`}
                  type="password"
                  placeholder="********"
                  {...register('passwordCurrent', {
                    required: {
                      value: true,
                      message: 'Current Password is required'
                    },
                    minLength: {
                      value: 8,
                      message: 'Password should at least be be 6 characters'
                    },
                    maxLength: {
                      value: 25,
                      message: 'Maximum length of password exceeded (25)'
                    }
                  })}
                />
              </FormControl>
              {errors.passwordCurrent && (
                <FormLabelAlt>{errors.passwordCurrent.message}</FormLabelAlt>
              )}
            </FormField>
            <FormField>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <input
                  className={`${ctx.inputClasses} ${errors.password && 'input-error'}`}
                  type="password"
                  placeholder="********"
                  {...register('password', {
                    required: {
                      value: true,
                      message: 'Enter new password'
                    },
                    minLength: {
                      value: 8,
                      message: 'Password should at least be be 6 characters'
                    },
                    maxLength: {
                      value: 25,
                      message: 'Maximum length of password exceeded (25)'
                    }
                  })}
                />
              </FormControl>
              {errors.password && <FormLabelAlt>{errors.password.message}</FormLabelAlt>}
            </FormField>

            <FormField>
              <FormLabel>Re-enter Password</FormLabel>
              <FormControl>
                <input
                  className={`${ctx.inputClasses} ${errors.passwordConfirm && 'input-error'}`}
                  type="password"
                  placeholder="********"
                  {...register('passwordConfirm', {
                    required: {
                      value: true,
                      message: 'Enter new password again'
                    },
                    minLength: {
                      value: 6,
                      message: 'Password should at least be be 6 characters'
                    },
                    maxLength: {
                      value: 25,
                      message: 'Maximum length of password exceeded (25)'
                    }
                  })}
                />
              </FormControl>
              {errors.passwordConfirm && (
                <FormLabelAlt> {errors.passwordConfirm.message}</FormLabelAlt>
              )}
            </FormField>
            <FormSubmitBtn className={btnState}>Update</FormSubmitBtn>
          </FormGroup>
        </Form>
        <Alert alert={alert} closeAlert={() => setAlert({ show: false })} />
      </FormWrapper>
      {alertModal.show && (
        <AlertModal type="success" text={alertModal.text} handler={successModalHandler} />
      )}
    </>
  );
};

export default UpdatePassword;
