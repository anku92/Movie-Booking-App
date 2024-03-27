import React, { useEffect, useState } from 'react';
import './SearchTab.css';
import { FaSearch } from 'react-icons/fa';
import city_icon from '../../images/city.png';
import cinema_icon from '../../images/cinema.png';
import genre_icon from '../../images/ticket-tab01.png';
import axios from 'axios';
import Endpoints from '../../api/Endpoints';

const SearchTab = ({ onFilterChange }) => {
    const [keyword, setKeyword] = useState('');
    const [city, setCity] = useState('');
    const [cinema, setCinema] = useState('');
    const [genre, setGenre] = useState('');
    const [cityOptions, setCityOptions] = useState([]);
    const [cinemaOptions, setCinemaOptions] = useState([]);
    const [genreOptions, setGenreOptions] = useState([]);

    useEffect(() => {
        fetchCinemaOptions();
        fetchGenreOptions();
    }, []);

    const fetchCinemaOptions = async () => {
        try {
            const response = await axios.get(Endpoints.CINEMA_LIST);
            if (response.status === 200) {
                const cinemaData = response.data;
                const uniqueCities = [...new Set(cinemaData.map((cinema) => cinema.city))];
                const uniqueCinemaNames = [...new Set(cinemaData.map((cinema) => cinema.name))];

                setCityOptions(uniqueCities);
                setCinemaOptions(uniqueCinemaNames);
            } else {
                console.error('Failed to fetch cinema options:', response.statusText);
            }
        } catch (error) {
            console.error('Error during cinema options fetch:', error.message);
        }
    };

    const fetchGenreOptions = async () => {
        try {
            const response = await axios.get(Endpoints.MOVIES_LIST);
            if (response.status === 200) {
                const genreData = response.data;
                const uniqueGenres = [...new Set(genreData.map((movie) => movie.genre))];
                setGenreOptions(uniqueGenres);
            } else {
                console.error('Failed to fetch genre options:', response.statusText);
            }
        } catch (error) {
            console.error('Error during genre options fetch:', error.message);
        }
    };

    const handleOptionChange = async (e, setterFunction, option) => {
        const selectedValue = e.target.value;
        setterFunction(selectedValue);

        onFilterChange({
            keyword, city: option === 'city' ?
                selectedValue : city, cinema: option === 'cinema' ?
                    selectedValue : cinema, genre: option === 'genre' ?
                        selectedValue : genre
        });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        onFilterChange({ keyword, city, cinema, genre });
    };

    return (
        <div className="image-card">
            <div className="search-tab">
                <form onSubmit={handleSearchSubmit} className="search-form">
                    <div className="search-bar">
                        <div className="form-group m-0">
                            <input
                                className="form-control"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                type="text"
                                placeholder="Search for Movies"
                            />
                            <button className="search-btn" type="submit">
                                <FaSearch />
                            </button>
                        </div>
                    </div>

                    <div className="selectors">
                        {['city', 'genre', 'cinema'].map((option) => (
                            <div key={option} className={`${option} form-group m-0`}>
                                <img src={option === 'city' ? city_icon : option === 'cinema' ? cinema_icon : genre_icon} alt={option} />
                                <label htmlFor={option} className="teal">
                                    {option.charAt(0).toUpperCase() + option.slice(1)}
                                </label>
                                <select
                                    id={option}
                                    value={option === 'city' ? city : option === 'genre' ? genre : cinema}
                                    onChange={(e) => handleOptionChange(e, option === 'city' ? setCity : option === 'genre' ? setGenre : setCinema, option)}
                                    className="select-bar"
                                >
                                    <option value="">Select</option>
                                    {option === 'city'
                                        ? cityOptions.map((city, index) => (
                                            <option key={index} value={city}>
                                                {city}
                                            </option>
                                        ))
                                        : option === 'genre'
                                            ? genreOptions.map((genre, index) => (
                                                <option key={index} value={genre}>
                                                    {genre}
                                                </option>
                                            ))
                                            : cinemaOptions.map((cinema, index) => (
                                                <option key={index} value={cinema}>
                                                    {cinema}
                                                </option>
                                            ))}
                                </select>
                            </div>
                        ))}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SearchTab;
