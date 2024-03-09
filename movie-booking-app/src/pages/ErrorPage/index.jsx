import React from 'react'
import error_img from '../../images/404.png';
import "./ErrorPage.css";
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className="container">
      <div className="error-container text-center">
        <img className="mb-3" src={error_img} alt="" />
        <h3>Oops.. Looks Like You Got Lost :&#40;</h3>
        <Link to="/" className="join-btn m-3 py-3 px-4 rounded-pill" href="#">BACK TO HOME &nbsp; &#11157;</Link>
      </div>
    </div>
  )
}

export default ErrorPage