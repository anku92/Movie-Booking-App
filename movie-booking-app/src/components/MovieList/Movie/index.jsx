import { Link } from "react-router-dom";
import cake_icon from '../../../images/cake.png';
import tomato_icon from '../../../images/tomato.png';
import './Movie.css';



const Movie = (props) => {
    const { id, title, poster, tomato_meter, audience_meter } = props.data

    return (
        <div className="col-md-3">
            <div className="mov-card mb-4">
                <div className="poster">
                    <Link to={'/' + id}>
                        <img src={poster} className="poster-img" alt="..." />
                    </Link>
                </div>
                <div className="card-body">
                    <h5 className="font-weight-bold card-title">
                        <Link to={'/' + id}>{title}</Link>
                    </h5>
                    {/* <div className="dropdown-divider"></div> */}
                    <div className="w-100 top-border"></div>
                    <div className="rating-percent">
                        <div className="rating">
                            <img src={tomato_icon} alt="tomato" />
                            <span>{tomato_meter}%</span>
                        </div>
                        <div className="rating">
                            <img src={cake_icon} alt="cake" />
                            <span>{audience_meter}%</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Movie;