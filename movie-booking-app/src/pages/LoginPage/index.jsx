import React, { useState } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Navbar from '../../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {

    const nav = useNavigate()
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState(null);

    const [requestResponse, setRequestResponse] = useState({
        textMessage: '',
        alertClass: ''
    })

    const initialValues = {
        username: '',
        password: ''
    }

    const onSubmit = (values) => {
        axios
          .post('http://127.0.0.1:8000/api/login/', values)
          .then((response) => {
            const { access, refresh, user_id } = response.data;
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('user_id', user_id)
    
            setRequestResponse({
              textMessage: 'Login Successful',
              alertClass: 'alert alert-success px-2 py-1 font-weight-bold',
            });
            setLoading(true);
    
            // Fetch user profile using the user's ID obtained from the login response
            axios
              .get(`http://127.0.0.1:8000/api/users/${user_id}/`, {
                headers: {
                  Authorization: `Bearer ${access}`,
                },
              })
              .then((profileResponse) => {
                const userProfile = profileResponse.data;
                setProfile(userProfile);
              })
              .catch((profileError) => {
                console.error('Error fetching user profile', profileError);
              })
              .finally(() => {
                setLoading(false);
                nav('/');
              });
          })
          .catch((error) => {
            setRequestResponse({
              textMessage: 'Login Failed. Try again !!!',
              alertClass: 'alert alert-danger px-2 py-1 font-weight-bold',
            });
          });
      };

    const validationSchema = Yup.object({
        username: Yup.string().required('username is required')
            .min(5, 'add atleast 5 char')
            .max(8, 'max char limit is 12'),
        password: Yup.string().required('password is required')
            .min(5, 'add atleast 5 char')
            .max(12, 'max char limit is 12')
    })

    return (
        <>
            <Navbar />
            <div className='account-bg'>
                <div className="container">
                    <div className="row">
                        <div className="col-md-3"></div>
                        <div className="col-md-6">
                            <div className="wrapper">
                                <div className={requestResponse.alertClass}>
                                    {requestResponse.textMessage}
                                    {loading && (<span className="spinner-border spinner-border-sm text-success"></span>)}
                                </div>
                                <h6 className='teal'>HELLO</h6>
                                <h4 className='font-weight-bold mb-4'>WELCOME BACK</h4>
                                <Formik
                                    initialValues={initialValues}
                                    onSubmit={onSubmit}
                                    validationSchema={validationSchema}
                                    validateOnMount
                                >
                                    {
                                        (formik) => {
                                            return (
                                                <Form>
                                                    <div className="form-group acc-group">
                                                        <label htmlFor="username">USERNAME</label>
                                                        <Field
                                                            type="text"
                                                            name='username'
                                                            id='username'
                                                            className={formik.touched.username && formik.errors.username ? 'form-control is-invalid' : 'form-control'}
                                                            placeholder='john01'
                                                        />
                                                        <ErrorMessage name='username'>
                                                            {(errorMessage) => (<small className='text-danger'>{errorMessage}</small>)}
                                                        </ErrorMessage>
                                                    </div>
                                                    <div className="form-group acc-group">
                                                        <label htmlFor="password">PASSWORD</label>
                                                        <Field
                                                            type="password"
                                                            name='password'
                                                            id='password'
                                                            className={formik.touched.password && formik.errors.password ? 'form-control is-invalid' : 'form-control'}
                                                            placeholder='**********'
                                                        />
                                                        <ErrorMessage name='password'>
                                                            {(errorMessage) => (<small className='text-danger'>{errorMessage}</small>)}
                                                        </ErrorMessage>
                                                    </div>

                                                    <div className="account-container">
                                                        <input type="submit" disabled={!formik.isValid} className="join-btn account-btn" value='LOG IN' />
                                                        <Link to='/signup' className='account-link'>Don't have an account? <span className='teal'>Sign up now</span></Link>
                                                    </div>

                                                </Form>
                                            )
                                        }
                                    }
                                </Formik>
                            </div>
                        </div>
                        <div className="col-md-3"></div>
                    </div>
                </div>
            </div>
        </>
    );
}


export default LoginPage;