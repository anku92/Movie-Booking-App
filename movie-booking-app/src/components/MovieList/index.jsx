import { useEffect, useState } from "react";
import axios from "axios";
import Movie from "./Movie";
import { MdErrorOutline } from "react-icons/md";

const MovieList = ({ filters }) => {
  const { keyword, city, cinema, genre } = filters;
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCinema, setSelectedCinema] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/movies/filter/", {
          params: { keyword, city, cinema, genre },
        });
  
        if (response.status === 200) {
          const responseData = response.data;
  
          if (responseData.movies) {
            setMovies(responseData.movies);
            setCinemas([]);
          } else if (responseData.cinemas) {
            let filteredMovies = [];
            if (city || cinema) {
              const filteredCinemas = responseData.cinemas && Array.isArray(responseData.cinemas)
                ? responseData.cinemas.filter(
                  (cinemaData) =>
                    (!city || cinemaData.city.toLowerCase() === city.toLowerCase()) &&
                    (!cinema || cinemaData.name.toLowerCase() === cinema.toLowerCase())
                )
                : [];
  
              if (filteredCinemas.length > 0) {
                // Collect movies from all filtered cinemas
                const allMovies = filteredCinemas.map((cinemaData) => cinemaData.movies).flat();
                // Remove duplicates from movies
                const uniqueMovies = allMovies.filter((movie, index, self) =>
                  index === self.findIndex((m) => (
                    m.title.toLowerCase() === movie.title.toLowerCase()
                  ))
                );
                filteredMovies = uniqueMovies;
                setSelectedCity(city);
                setSelectedCinema(cinema);
              }
            }
  
            // Filter movies based on the keyword
            const keywordFilteredMovies = responseData.movies && Array.isArray(responseData.movies)
              ? responseData.movies.filter((movie) =>
                movie.title.toLowerCase().includes(keyword.toLowerCase())
              )
              : [];
  
            // Set the final list of movies
            setMovies(keywordFilteredMovies.length > 0 ? keywordFilteredMovies : filteredMovies);
            setCinemas(filteredMovies.length > 0 ? filteredMovies : []);
          }
        } else {
          setError(`Failed to fetch movies: ${response.statusText}`);
        }
      } catch (error) {
        setError(`Error during API request: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
  
    fetchMovies();
  }, [keyword, city, cinema, genre]);

  if (loading) {
    return (
      <div className="font-weight-bold text-primary pb-3 d-flex align-items-center">
        <p className="m-0">Loading</p>
        <div className="ml-1 spinner-border spinner-border-sm"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ fontSize: "16px" }} className="text-danger pb-4 text-center">
        <p className="m-0">
          <MdErrorOutline size="30px" />
        </p>
        {error}
      </div>
    );
  }

  if (movies.length > 0) {
    return (
      <div className="container">
        <h1 className="font-weight-bold text-light">MOVIES</h1>
        <hr style={{ border: "1px solid #31D7A9" }} />
        <div className="row movie-list">
          {movies.map((movie, i) => (
            <Movie data={movie} key={i} />
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div style={{ fontSize: "16px" }} className="filter-msg text-warning pb-4 text-center">
        <p className="m-0">No Data Found.</p>
        {selectedCity && <p className="m-0">Selected City: {selectedCity}</p>}
        {selectedCinema && <p>Selected Cinema: {selectedCinema}</p>}
      </div>
    );
  }
};

export default MovieList;
