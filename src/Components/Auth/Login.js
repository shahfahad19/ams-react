import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AppContext from '../Context/AppContext';
import { useForm } from 'react-hook-form';
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

const Login = () => {
  const [btnState, setBtnState] = useState('');
  const [alert, setAlert] = useState({ show: false });
  const navigate = useNavigate();
  const ctx = useContext(AppContext);
  const [searchParams] = useSearchParams();

  // REDIRECTING IF USER IS ALREADY LOGGED IN
  if (ctx.isLoggedIn === true) {
    navigate('/');
  }

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  ctx.header = 'Login';
  const captcha = useRef();

  useEffect(() => {
    if (searchParams.get('profileCompleted') === 'true')
      setAlert(ctx.successAlert('Profile updated! Please login'));
  }, []);

  const submitForm = async (data) => {
    setBtnState('btn-loading');
    setAlert({ show: false });
    await axios
      .post(`${ctx.baseURL}/user/login?token=${captcha.current.getValue()}`, data, {
        credentials: 'include'
      })
      .then((response) => {
        setBtnState('');
        data = response.data;
        saveToken(`${data.token}`);
        window.location.assign('/');
      })
      .catch((error) => {
        setBtnState('');
        window.grecaptcha.reset();
        let errorMessage = ctx.computeError(error);
        setAlert(ctx.errorAlert(errorMessage));
      });
  };

  const saveToken = (token) => {
    if (token !== '') {
      try {
        localStorage.setItem('ams-token', token);
        return true;
      } catch (err) {
        return false;
      }
    } else {
      return false;
    }
  };

  return (
    <FormWrapper>
      <Form onSubmit={handleSubmit(submitForm)}>
        <FormTitle>Login</FormTitle>

        <FormGroup>
          <FormField>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <input
                className={`${ctx.inputClasses} ${errors.email && 'input-error'}`}
                type="email"
                placeholder="name@example.com"
                {...register('email', {
                  required: {
                    value: true,
                    message: 'Please enter your email'
                  },
                  pattern: {
                    value: /^[\S-]+@([\S-]+\.)+\S{2,4}$/g,
                    message: 'Email is not valid'
                  }
                })}
              />
            </FormControl>
            {errors.email && <FormLabelAlt>{errors.email.message}</FormLabelAlt>}
          </FormField>

          <FormField>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <input
                className={`${ctx.inputClasses} ${errors.password && 'input-error'}`}
                type="password"
                {...register('password', {
                  required: {
                    value: true,
                    message: 'Password is required'
                  }
                })}
              />
            </FormControl>
            {errors.password && <FormLabelAlt>{errors.password.message}</FormLabelAlt>}
          </FormField>

          <FormField>
            <FormLabel>Captcha</FormLabel>
            <FormControl>
              <ReCAPTCHA
                theme={ctx.theme === 'dark' ? 'dark' : 'light'}
                sitekey={ctx.captchaKey}
                required
                ref={captcha}
              />
            </FormControl>
            <FormLabelAlt></FormLabelAlt>
          </FormField>

          <FormSubmitBtn className={btnState}>Login</FormSubmitBtn>
        </FormGroup>
      </Form>
      <Alert alert={alert} closeAlert={() => setAlert({ show: false })} />

      <div className="m-2 text-center font-regular">
        <span>Don&#39;t have an account?</span>&nbsp;
        <Link className="link link-primary decoration-transparent font-medium" to="/signup">
          Signup!
        </Link>
        <br />
        <Link className="link link-error decoration-transparent font-medium" to="/forgot-password">
          Forgot Password
        </Link>
      </div>
    </FormWrapper>
  );
};

export default Login;
