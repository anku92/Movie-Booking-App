import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import './MovieDetailStyles.css';
import { useParams, useNavigate } from 'react-router-dom';
import { FaRegClock } from "react-icons/fa6";
import { BsCalendar2Date } from "react-icons/bs";

const MovieDetailPage = () => {
  const [movie, setMovie] = useState({});
  const { id } = useParams();
  const nav = useNavigate();


  const handleBookTickets = () => {
    nav(`/${id}/cinema-list`, { state: { movie } })
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/movies/filter/');

        if (response.status === 200) {
          const filteredMovie = response.data.movies.find((m) => m.id === parseInt(id, 10));

          if (filteredMovie) {
            setMovie(filteredMovie);
          } else {
            console.error('Movie not found.');
          }
        } else {
          console.error('Failed to fetch movies:', response.statusText);
        }
      } catch (error) {
        console.error('Error during API request:', error.message);
      }
    };

    fetchData();
  }, [id]);

  const { title, language, genre, release_date, duration, poster } = movie;

  return (
    <>
      <Navbar />
      <div className="container no-gutters">
        <div className="row">
          <div className="col-md-12">
            <div className="movie-detail-wrapper">
              <div className="ml-2 left-sec">
                <img src={poster} alt="" className="img-fluid" />
              </div>
              <div className="ml-4 right-sec">
                <h1 className="text-light">{title}</h1>
                <div className="movie-meta">
                  <p className='mb-1'>{language}</p>
                  <h6>{genre}</h6>
                  <div className="duration-area">
                    <div className='item'>
                      <BsCalendar2Date />
                      <span className='ml-1'>{release_date} </span>
                    </div>
                    <div className="item">
                      <FaRegClock />
                      <span className='ml-1'>{duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ "backgroundColor": "#032055", "height": "20vh" }} className="p-4 d-flex align-items-center justify-content-end">
        <button style={{ position: "relative", zIndex: "5" }} onClick={handleBookTickets} className="join-btn">BOOK TICKETS</button>
      </div>
    </>
  );
}

export default MovieDetailPage;
