import axios from 'axios';
import React, { useContext, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Link } from 'react-router-dom';
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

const ForgotPassword = () => {
  const [btnState, setBtnState] = useState('');

  const ctx = useContext(AppContext);

  const email = useRef();
  const captcha = useRef();

  const submitForm = async (event) => {
    event.preventDefault();
    setBtnState('loading');
    await axios.post(`${ctx.baseURL}/user/forgotPassword?token=${captcha.current.getValue()}`, {
      email: email.current.value
    });
    //TODO: handle response

    setBtnState('');
  };

  return (
    <>
      <FormWrapper>
        <Form onSubmit={submitForm}>
          <FormTitle>Reset Password</FormTitle>
          <FormGroup>
            <FormField>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <input
                  className={`${ctx.inputClasses}`}
                  type="email"
                  placeholder="Email"
                  required
                  ref={email}></input>
              </FormControl>
              <FormLabelAlt></FormLabelAlt>
            </FormField>
            <FormField>
              <FormLabel>Captcha</FormLabel>

              <FormControl>
                <ReCAPTCHA sitekey={ctx.captchaKey} required ref={captcha} />
              </FormControl>
            </FormField>
            <FormSubmitBtn className={btnState}>Reset</FormSubmitBtn>
          </FormGroup>
        </Form>
        <div className="p-3 text-center font-regular flex justify-center items-center">
          <Link className="link link-ghost-primary text-sm" to="/login">
            Login
          </Link>
          <div className="divided divider-horizontal w-10"></div>
          <Link className="link link-ghost-primary text-sm" to="/signup">
            Signup
          </Link>
        </div>
      </FormWrapper>
    </>
  );
};

export default ForgotPassword;
