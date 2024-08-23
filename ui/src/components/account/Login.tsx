import { Button, Form, Segment, Message } from 'semantic-ui-react';
import { Formik, Field, ErrorMessage, Form as FormikForm } from 'formik';
import * as Yup from 'yup';
import { store } from '../../app/stores/store';
import { Link } from 'react-router-dom';

const Login = () => {
  const { accountStore } = store;
  const initialValues = { email: '', password: '' };
  
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Required'),
    password: Yup.string().required('Required'),
  });

  const onSubmit = (values: { email: string, password: string }) => {
    console.log(values);
    accountStore.login(values.email, values.password);    
  };

  return (
    <div className='login-page'>
      <Segment className='login-form'>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <FormikForm className='ui form'>
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
            <Button type="submit" fluid>Login</Button>
          </FormikForm>
        </Formik>
        <hr/>
        <div style={{ display:'block' }}>
          No account? <Link to='/register' style={{marginLeft:"5px"}}>Register</Link>
          <Link to='/' style={{float:"right"}}>Home</Link>
        </div>
      </Segment>
    </div>
  );
}

export default Login;
