import React, { useState, useEffect } from 'react';
import "./CinemaSelectionPage.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Movie from '../../components/MovieList/Movie';
import Navbar from '../../components/Navbar';

const CinemaSelectionPage = () => {
    const { state } = useLocation();
    const { id } = useParams();
    const nav = useNavigate();
    const cinemas = state.movie.cinemas;

    const [favoriteCinemas, setFavoriteCinemas] = useState([]);

    // Load user's favorite cinemas from localStorage on component mount
    useEffect(() => {
        const storedFavorites = localStorage.getItem('favoriteCinemas');
        if (storedFavorites) {
            setFavoriteCinemas(JSON.parse(storedFavorites));
        }
    }, []);

    // Save favorite cinemas to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('favoriteCinemas', JSON.stringify(favoriteCinemas));
    }, [favoriteCinemas]);

    const movieSchedules = ['12:00', '18:00'];

    const toggleHeart = (cinemaId) => {
        setFavoriteCinemas((prevFavorites) => {
            if (prevFavorites.includes(cinemaId)) {
                return prevFavorites.filter((id) => id !== cinemaId);
            } else {
                return [...prevFavorites, cinemaId];
            }
        });
    };

    const isCinemaFavorite = (cinemaId) => {
        return favoriteCinemas.includes(cinemaId);
    };

    const handleProceedToBooking = (cinema, schedule) => {
        nav(`/${id}/cinema-list/buy`, { state: { movie: state.movie, cinema, schedule } });
    };

    return (
        <>
            <Navbar />
            <div className="ticket-plan text-light">
                <div className="container">
                    <div className="mb-5 pb-5"></div>
                    <Link to={`/${id}`} className="join-btn rounded p-2">&#11164; BACK</Link>
                    <div className="mt-4"></div>
                    <div className="row">
                        <Movie data={state.movie} />
                        <div className="col-md-9 border-left">
                            {cinemas.length === 0 ? (
                                <h3 className='h-100 d-flex align-items-center justify-content-center'>No show for this movie</h3>
                            ) : (
                                <ul className="cinema-scroll seat-plan-wrapper">
                                    {cinemas.map((cinema) => (
                                        <li key={cinema.id}>
                                            <div className="movie-name">
                                                <div className="like-icons">
                                                    <i onClick={() => toggleHeart(cinema.id)}>
                                                        {isCinemaFavorite(cinema.id) ? <FaHeart /> : <FaRegHeart />}
                                                    </i>
                                                </div>
                                                <p className="mb-0 name">{cinema.name}</p>
                                            </div>
                                            <div className="movie-schedule">
                                                {movieSchedules.map((schedule, index) => (
                                                    <div
                                                        key={index}
                                                        className="time"
                                                        onClick={() => handleProceedToBooking(cinema, schedule)}
                                                    >
                                                        {schedule}
                                                    </div>
                                                ))}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CinemaSelectionPage;
