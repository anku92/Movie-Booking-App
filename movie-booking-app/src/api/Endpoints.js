import Constants from "./Constants";

const Endpoints = {
    MOVIES_FILTER: `${Constants.BASE_API_URL}movies/filter/`,
    MOVIES_LIST: `${Constants.BASE_API_URL}movies/`,
    CINEMA_LIST: `${Constants.BASE_API_URL}cinemas/`,
    USERS: `${Constants.BASE_API_URL}users/`,
    LOGIN: `${Constants.BASE_API_URL}login/`,
    SIGNUP: `${Constants.BASE_API_URL}signup/`,
    CREATE_TICKET: `${Constants.BASE_API_URL}ticket/add/`,
    ADD_MOVIE: `${Constants.BASE_API_URL}movie/add/`,
}

export default Endpoints;