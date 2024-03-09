import MovieList from "../../components/MovieList";
import Navbar from "../../components/Navbar";
import './HomePage.css';
import SearchTab from "../../components/SearchTab";
import { useState } from "react";

const HomePage = () => {
    const [filters, setFilters] = useState({});

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    return (
        <>
            <Navbar />
            <div className="home-bg">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="home mt-5">
                                <h1 className="display-3 font-weight-bold">
                                    GET <span className="teal">MOVIE</span> TICKETS
                                </h1>
                                <p className="m-0">
                                    Buy movie tickets in advance, find movie times, watch trailers
                                </p>
                                <p className="m-0">
                                    Read movie reviews and much more
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* FILTER TAB */}
            <div className="bottom">
                <SearchTab onFilterChange={handleFilterChange} />
            </div>

            {/* MOVIE LIST */}
            <div className="bottom-list">
                <MovieList filters={filters} />
            </div>
        </>
    );
};

export default HomePage;
