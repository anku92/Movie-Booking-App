import React, { useState } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Navbar from '../../components/Navbar';
import './AddMoviePage.css';
import Endpoints from '../../api/Endpoints';

const AddMoviePage = () => {
    const [loading, setLoading] = useState(false);
    const [requestResponse, setRequestResponse] = useState({
        textMessage: '',
        alertClass: ''
    });

    const getToken = () => localStorage.getItem("access_token");

    const initialValues = {
        title: '',
        description: '',
        release_date: '',
        genre: '',
        duration: '',
        poster: '',
        rating: '',
        starring_actor: '',
        director: '',
        language: '',
        tomato_meter: '',
        audience_meter: ''
    };

    const onSubmit = async (values, {resetForm}) => {
        try {
            setLoading(true);
            const token = getToken();
            await axios.post(Endpoints.ADD_MOVIE, values, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setRequestResponse({
                textMessage: "Movie added successfully",
                alertClass: 'alert alert-success px-2 py-1 font-weight-bold'
            });
            resetForm();

            setTimeout(() => {
                setRequestResponse({
                    textMessage: '',
                    alertClass:''
                })
            }, 3000);

        } catch (error) {
            let errorMessage;
            if (error.response) {
                errorMessage = 'Error occurred while adding movie.';
            } else if (error.request) {
                errorMessage = 'No response from server. Please try again later.';
            } else {
                errorMessage = 'An unexpected error occurred. Please try again later.';
            }
            setRequestResponse({
                textMessage: errorMessage,
                alertClass: 'alert alert-danger px-2 py-1 font-weight-bold'
            });
        } finally {
            setLoading(false);
        }
    };

    const validationSchema = Yup.object({
        title: Yup.string().required('Field is required')
            .min(3, 'Add atleast 3 char')
            .max(20, 'Max char limit is 20'),
        description: Yup.string().required('Field is required')
            .min(20, 'Add atleast 20 characters'),
        release_date: Yup.date().required('Date is required')
            .nullable(false)
            .typeError('Invalid date format'),
        genre: Yup.string().required('Genre is required'),
        duration: Yup.number().required('Field is required')
            .positive('Duration must be positive')
            .integer('Duration must be an integer')
            .min(30, "Duration must be ≥ 30")
            .max(200, 'Duration must be ≤ 200')
            .typeError('Provide a valid number'),
        poster: Yup.string().required('Field is required')
            .url('Invalid URL format'),
        rating: Yup.number().required('Field is required')
            .min(1.0, 'Rating must be at least 1.0')
            .max(10.0, 'Rating must be at most 10.0')
            .typeError("Provide a valid number"),
        starring_actor: Yup.string().required('Field is required')
            .min(3, 'Add atleast 3 char')
            .matches(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/, 'Field accepts only alphabets'),
        director: Yup.string().required('Field is required')
            .min(3, 'Add atleast 3 char')
            .matches(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/, 'Field accepts only alphabets'),
        language: Yup.string().required('Field is required')
            .min(5, 'Add atleast 5 char')
            .matches(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/, 'Alphabets only'),
        tomato_meter: Yup.number().required('Field is required')
            .positive('Value must be positive')
            .integer('Value must be an integer')
            .max(100, 'Value must be ≤ 100')
            .typeError('Provide a valid number'),
        audience_meter: Yup.number().required('Field is required')
            .positive('Value must be positive')
            .integer('Value must be an integer')
            .max(100, 'Value must be ≤ 100')
            .typeError('Provide a valid number')
    });

    return (
        <>
            <Navbar />
            <div className='account-bg h-100'>
                <div className="container">
                    <div className="row">
                        <div className="col"></div>
                        <div className="col-md-7">
                            <div className='wrapper mb-5'>
                                <div className={requestResponse.alertClass}>
                                    {requestResponse.textMessage}
                                    {loading && (<span className="spinner-border spinner-border-sm text-primary"></span>)}
                                </div>
                                <h4 className='teal font-weight-bold mb-4'>Add Movie</h4>
                                <Formik
                                    initialValues={initialValues}
                                    onSubmit={onSubmit}
                                    validationSchema={validationSchema}
                                    validateOnMount
                                >
                                    {(formik) => (
                                        <Form>
                                            <div className="form-group acc-group">
                                                    <label htmlFor="title">TITLE</label>
                                                    <Field
                                                        type="text" name='title' id='title' placeholder='Harry Potter'
                                                        className={formik.touched.title && formik.errors.title ? 'form-control is-invalid' : 'form-control'}
                                                    />
                                                    <ErrorMessage name='title'>
                                                        {(errorMessage) => (<small className='text-danger'>{errorMessage}</small>)}
                                                    </ErrorMessage>
                                                </div>
                                                <div className="form-group acc-group">
                                                    <label htmlFor="description">DESCRIPTION</label>
                                                    <Field
                                                        as="textarea"
                                                        name='description'
                                                        id='description'
                                                        placeholder='Lorem ipsum dolor sit...'
                                                        rows="2"
                                                        maxLength={100}
                                                        className={formik.touched.description && formik.errors.description ? 'form-control is-invalid' : 'form-control'}
                                                    />
                                                    <small className='text-muted mr-2'>({formik.values.description.length}/100)</small>
                                                    <ErrorMessage name='description'>
                                                        {(errorMessage) => (<small className='text-danger'>{errorMessage}</small>)}
                                                    </ErrorMessage>
                                                </div>
                                                <div className="row">
                                                    <div className="col">
                                                        <div className="form-group acc-group">
                                                            <label htmlFor="release_date">RELEASE DATE</label>
                                                            <Field
                                                                type="date" name='release_date' id='release_date'
                                                                className={formik.touched.release_date && formik.errors.release_date ? 'form-control release-date is-invalid' : 'form-control release-date'}
                                                            />
                                                            <ErrorMessage name='release_date'>
                                                                {(errorMessage) => (<small className='text-danger'>{errorMessage}</small>)}
                                                            </ErrorMessage>
                                                        </div>
                                                    </div>
                                                    <div className="col">
                                                        <div className="form-group acc-group">
                                                            <label htmlFor="genre">GENRE</label>
                                                            <Field as="select" name="genre" id="genre"
                                                                className={formik.touched.genre && formik.errors.genre ? 'form-control is-invalid' : 'form-control'}
                                                            >
                                                                <option value="">Select Genre</option>
                                                                <option value="Action">Action</option>
                                                                <option value="Adventure">Adventure</option>
                                                                <option value="Biography">Biography</option>
                                                                <option value="Comedy">Comedy</option>
                                                                <option value="Crime">Crime</option>
                                                                <option value="Drama">Drama</option>
                                                                <option value="Horror">Horror</option>
                                                                <option value="Sci-fi">Sci-Fi</option>
                                                            </Field>
                                                            <ErrorMessage name='genre'>
                                                                {(errorMessage) => (<small className='text-danger'>{errorMessage}</small>)}
                                                            </ErrorMessage>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col">
                                                        <div className="form-group acc-group">
                                                            <label htmlFor="poster">POSTER URL</label>
                                                            <Field
                                                                type="text" name='poster' id='poster' placeholder='Image url here'
                                                                className={formik.touched.poster && formik.errors.poster ? 'form-control is-invalid' : 'form-control'}
                                                            />
                                                            <ErrorMessage name='poster'>
                                                                {(errorMessage) => (<small className='text-danger'>{errorMessage}</small>)}
                                                            </ErrorMessage>
                                                        </div>
                                                    </div>
                                                    <div className="col">
                                                        <div className="form-group acc-group">
                                                            <label htmlFor="language">LANGUAGE</label>
                                                            <Field as="select" name="language" id="language"
                                                                className={formik.touched.language && formik.errors.language ? 'form-control is-invalid' : 'form-control'}
                                                            >
                                                                <option value="">Select Language</option>
                                                                <option value="English">English</option>
                                                                <option value="Hindi">Hindi</option>
                                                                <option value="Tamil">Tamil</option>
                                                                <option value="Malayalam">Malayalam</option>
                                                                <option value="Telugu">Telugu</option>
                                                            </Field>
                                                            <ErrorMessage name='language'>
                                                                {(errorMessage) => (<small className='text-danger'>{errorMessage}</small>)}
                                                            </ErrorMessage>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col">
                                                        <div className="form-group acc-group">
                                                            <label htmlFor="duration">DURATION</label>
                                                            <Field type="integer" name='duration' id='duration' placeholder='30 - 200 (in min)'
                                                                className={formik.touched.duration && formik.errors.duration ? 'form-control is-invalid' : 'form-control'}
                                                            />
                                                            <ErrorMessage name='duration'>
                                                                {(errorMessage) => (<small className='text-danger'>{errorMessage}</small>)}
                                                            </ErrorMessage>
                                                        </div>
                                                    </div>
                                                    <div className="col">
                                                        <div className="form-group acc-group">
                                                            <label htmlFor="rating">RATING</label>
                                                            <Field
                                                                type='text' name='rating' id='rating' placeholder='1 - 10'
                                                                className={formik.touched.rating && formik.errors.rating ? 'form-control is-invalid' : 'form-control'}
                                                            />
                                                            <ErrorMessage name='rating'>
                                                                {(errorMessage) => (<small className='text-danger'>{errorMessage}</small>)}
                                                            </ErrorMessage>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col">
                                                        <div className="form-group acc-group">
                                                            <label htmlFor="starring_actor">STARRING ACTOR</label>
                                                            <Field
                                                                type="text" name='starring_actor' id='starring_actor' placeholder='Robert Downey Jr.' maxLength={22}
                                                                className={formik.touched.starring_actor && formik.errors.starring_actor ? 'form-control is-invalid' : 'form-control'}
                                                            />
                                                            <ErrorMessage name='starring_actor'>
                                                                {(errorMessage) => (<small className='text-danger'>{errorMessage}</small>)}
                                                            </ErrorMessage>
                                                        </div>
                                                    </div>
                                                    <div className="col">
                                                        <div className="form-group acc-group">
                                                            <label htmlFor="director">DIRECTOR</label>
                                                            <Field
                                                                type="text" name='director' id='director' placeholder='Christopher Nolan' maxLength={22}
                                                                className={formik.touched.director && formik.errors.director ? 'form-control is-invalid' : 'form-control'}
                                                            />
                                                            <ErrorMessage name='director'>
                                                                {(errorMessage) => (<small className='text-danger'>{errorMessage}</small>)}
                                                            </ErrorMessage>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col">
                                                        <div className="form-group acc-group">
                                                            <label htmlFor="tomato_meter">TOMATOMETER</label>
                                                            <Field
                                                                type='integer' name='tomato_meter' id='tomato_meter' placeholder='1 - 100 (%)'
                                                                className={formik.touched.tomato_meter && formik.errors.tomato_meter ? 'form-control is-invalid' : 'form-control'}
                                                            />
                                                            <ErrorMessage name='tomato_meter'>
                                                                {(errorMessage) => (<small className='text-danger'>{errorMessage}</small>)}
                                                            </ErrorMessage>
                                                        </div>
                                                    </div>
                                                    <div className="col">
                                                        <div className="form-group acc-group">
                                                            <label htmlFor="audience_meter">AUDIENCEMETER</label>
                                                            <Field
                                                                type='integer' name='audience_meter' id='audience_meter' placeholder='1 - 100 (%)'
                                                                className={formik.touched.audience_meter && formik.errors.audience_meter ? 'form-control is-invalid' : 'form-control'}
                                                            />
                                                            <ErrorMessage name='audience_meter'>
                                                                {(errorMessage) => (<small className='text-danger'>{errorMessage}</small>)}
                                                            </ErrorMessage>
                                                        </div>
                                                    </div>
                                                </div>
                                            <div className="account-container">
                                                <input type="submit" disabled={!formik.isValid} className="join-btn" value='Add Movie' />
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                        <div className="col"></div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddMoviePage;
