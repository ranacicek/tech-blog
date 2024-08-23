import React, { useEffect, useState } from 'react'
import { store } from '../../app/stores/store';
import { Navigate } from 'react-router-dom';
import { Button, Form, Segment, Message } from 'semantic-ui-react';
import { Formik, Field, ErrorMessage, Form as FormikForm } from 'formik';
import UserDto from '../../app/models/UserDto';
import { showError, showInfo } from '../utils/Toast';

export default function MyProfile() { 

  const [userProfile, setUserProfile ]= useState({
    id: '',
    firstName: '',
    surname: '',
    email: '',
    password: '',
    passwordConfirm: '',
    about: ''
  });

  const {accountStore} = store;

  useEffect(()=> {

    //const userProfile = 
    const getUserProfile = async ()=> {
      const returnedProfile = await accountStore.getUserProfile();

      if(!returnedProfile.about)
        returnedProfile.about='';

      console.log(returnedProfile);  

      setUserProfile({...returnedProfile, password: '', passwordConfirm: ''});
    }

    getUserProfile();

  }, []);

  const onSubmit = async (values: { firstName: string, surname: string, email: string, password: string, passwordConfirm: string, about: string }) => {
    console.log(values);

    const request = {
      firstName: values.firstName,
      surname: values.surname,
      about: values.about,
      password: values.password,
      passwordConfirm: values.passwordConfirm
    };

    try{
      const response = await accountStore.updateUserProfile(request);

      showInfo("Updated", response );
    }
    catch(error) {
      showError("Error", "Failed to update profile.");
    }
  };

  return (
    <div>      
      <Formik
          initialValues={userProfile}
          enableReinitialize={true}
          onSubmit={onSubmit}
        >
        <FormikForm className='ui form'>
        <div className="field">
              <label htmlFor="firstName">First Name</label>
              <Field name="firstName" type="text" as={Form.Input} style={{maxWidth:'400px'}} />
              <ErrorMessage name="firstName" component={Message} />
            </div>
            <div className="field">
              <label htmlFor="surname">Last Name</label>
              <Field name="surname" type="text" as={Form.Input} style={{maxWidth:'400px'}} />
              <ErrorMessage name="surname" component={Message} />
            </div>
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <Field name="email" type="email" as={Form.Input} style={{maxWidth:'400px'}} disabled />
              <ErrorMessage name="email" component={Message} />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <Field name="password" type="password" as={Form.Input} style={{maxWidth:'400px'}} />
              <ErrorMessage name="password" component={Message} />
            </div>
            <div className="field">
              <label htmlFor="passwordConfirm">Password Confirm</label>
              <Field name="passwordConfirm" type="password" as={Form.Input} style={{maxWidth:'400px'}}/>
              <ErrorMessage name="passwordConfirm" component={Message} />
            </div>
            <div className="field">
              <label htmlFor="about">About</label>
              <Field name="about" type="text" as={Form.TextArea} />
              <ErrorMessage name="about" component={Message} />
            </div>
            <Button type="submit" fluid>Update</Button>
        </FormikForm>
        </Formik>    
    </div>
  )
}
