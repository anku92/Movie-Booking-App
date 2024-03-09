import React, { useState } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Navbar from '../../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import './SignupPage.css';


const SignupPage = () => {
    const nav = useNavigate()
    const [loading, setLoading] = useState(false);
    const [requestResponse, setRequestResponse] = useState({
        textMessage: '',
        alertClass: ''
    })

    const initialValues = {
        name: '',
        email: '',
        mobile: '',
        username: '',
        password: ''
    }

    const onSubmit = (values) => {
        axios.post('http://127.0.0.1:8000/api/signup/', values)
            .then((response) => {
                setRequestResponse({
                    textMessage: "Registeration Successful ",
                    alertClass: "alert alert-primary px-2 py-1 font-weight-bold"
                })

                setLoading(true)
                setTimeout(() => {
                    setLoading(false)
                    nav("/login")
                }, 2000);
            }, (error) => {
                setRequestResponse({
                    textMessage: "Registeration Failed, please try again.",
                    alertClass: "alert alert-danger px-2 py-1 font-weight-bold"
                })
            })
            .catch(error => console.log(error))
    }

    const validationSchema = Yup.object({
        name: Yup.string().required('name is required')
            .min(3, 'add atleast 3 char')
            .max(20, 'max char limit is 20'),
        email: Yup.string().required('email is required')
            .email('please provide valid email'),
        mobile: Yup.string().required('mobile number is required')
            .matches(/^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/, "Invalid phone number"),
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
                            <div className='wrapper'>
                            <div className={requestResponse.alertClass}>
                                    {requestResponse.textMessage}
                                    {loading && (<span className="spinner-border spinner-border-sm text-primary"></span>)}
                                </div>
                                <h6 className='teal'>WELCOME</h6>
                                <h4 className='font-weight-bold mb-4'>TO BOLETO</h4>
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
                                                        <label htmlFor="name">NAME</label>
                                                        <Field
                                                            type="text"
                                                            name='name'
                                                            id='name'
                                                            className={formik.touched.name && formik.errors.name ? 'form-control is-invalid' : 'form-control'}
                                                            placeholder='John Doe'
                                                        />
                                                        <ErrorMessage name='name'>
                                                            {(errorMessage) => (<small className='text-danger'>{errorMessage}</small>)}
                                                        </ErrorMessage>
                                                    </div>
                                                    <div className="form-group acc-group">
                                                        <label htmlFor="name">EMAIL</label>
                                                        <Field
                                                            type="email"
                                                            name='email'
                                                            id='email'
                                                            className={formik.touched.email && formik.errors.email ? 'form-control is-invalid' : 'form-control'}
                                                            placeholder='abc@domain.com'
                                                        />
                                                        <ErrorMessage name='email'>
                                                            {(errorMessage) => (<small className='text-danger'>{errorMessage}</small>)}
                                                        </ErrorMessage>
                                                    </div>
                                                    <div className="form-group acc-group">
                                                        <label htmlFor="mobile">MOBILE</label>
                                                        <Field
                                                            type="mobile"
                                                            name='mobile'
                                                            id='mobile'
                                                            className={formik.touched.mobile && formik.errors.mobile ? 'form-control is-invalid' : 'form-control'}
                                                            placeholder='9999999999'
                                                        />
                                                        <ErrorMessage name='mobile'>
                                                            {(errorMessage) => (<small className='text-danger'>{errorMessage}</small>)}
                                                        </ErrorMessage>
                                                    </div>
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
                                                        <input type="submit" disabled={!formik.isValid} className="join-btn" value='SIGN UP' />
                                                        <Link to='/login' className='account-link'>Already have an account? <span className='teal'>Login</span></Link>
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

export default SignupPage;