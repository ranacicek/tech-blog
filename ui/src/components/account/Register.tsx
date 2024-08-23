import React from 'react';
import { Button, Form, Segment, Message } from 'semantic-ui-react';
import { Formik, Field, ErrorMessage, Form as FormikForm } from 'formik';
import * as Yup from 'yup';
import { store } from '../../app/stores/store';
import { router } from '../../app/router/router';
import { RegisterUserModel } from '../../app/models/RegisterUserModel';
import {showAlert, showError} from '../utils/Toast';
import { Link } from 'react-router-dom';

const Register = () => {
  const { accountStore } = store;
  const initialValues = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

  const validationSchema = Yup.object({
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email format').required('Required'),
    password: Yup.string().required('Required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), ''], 'Passwords must match')
      .required('Required'),
  });

  const onSubmit = async (values: { firstName: string, lastName: string, email: string, password: string, confirmPassword: string }) => {
    console.log(values);

    const registerModel : RegisterUserModel = {
      firstName: values.firstName,
      surname: values.lastName,
      email: values.email,
      password: values.password,
      passwordConfirm: values.confirmPassword
    }

    try {
      // Form doğrulamasını kontrol et
      const errors = await validationSchema.validate(values, { abortEarly: false }).catch(err => err.inner);
      if (errors && errors.length > 0) {
        errors.forEach((error: any) => {
          showAlert('Validation Error', error.message, 'warning');
        });
        return; // Hatalar var, işlemi sonlandır
      }

      await accountStore.register(registerModel);
      showAlert('Success', 'Registration successful!', 'success');
    } catch (error) {
      showError('Error', 'Registration failed. Please try again.');
    }
  };
        
  return (
    <div className='register-page'>
      <Segment className='register-form'>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <FormikForm className='ui form'>
            <div className="field">
              <label htmlFor="firstName">First Name</label>
              <Field name="firstName" type="text" as={Form.Input} fluid />
              <ErrorMessage name="firstName" component={Message} />
            </div>
            <div className="field">
              <label htmlFor="lastName">Last Name</label>
              <Field name="lastName" type="text" as={Form.Input} fluid />
              <ErrorMessage name="lastName" component={Message} />
            </div>
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <Field name="email" type="email" as={Form.Input} fluid />
              <ErrorMessage name="email" component={Message} />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <Field name="password" type="password" as={Form.Input} fluid />
              <ErrorMessage name="password" component={Message} />
            </div>
            <div className="field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <Field name="confirmPassword" type="password" as={Form.Input} fluid />
              <ErrorMessage name="confirmPassword" component={Message} />
            </div>
            <Button type="submit" fluid>Register</Button>
          </FormikForm>
        </Formik>
        <hr/>
        <div style={{ display:'block' }}>
          Already have an account? <Link to='/login' style={{marginLeft:"5px"}}>Login</Link>
          <Link to='/' style={{float:"right"}}>Home</Link>
        </div>
      </Segment>
    </div>
  )
}

export default Register;
