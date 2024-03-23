import HomePage from "./pages/HomePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ErrorPage from "./pages/ErrorPage";
import MovieDetailPage from "./pages/MovieDetailPage";
import TicketBookingPage from "./pages/TicketBookingPage";
import CinemaSelectionPage from './pages/CinemaSelectionPage'
import UserProfilePage from "./pages/UserProfilePage";
import AddMoviePage from "./pages/AddMoviePage";
import TicketPage from "./pages/TicketPage";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:id" element={<MovieDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/:id/cinema-list/buy" element={<TicketBookingPage />} />
        <Route path="*" element={<ErrorPage />} />
        <Route path="/:id/cinema-list" element={<CinemaSelectionPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/add-movie" element={<AddMoviePage />} />
        <Route path="/tickets" element={<TicketPage />} />
      </Routes>
    </Router>
  );
}

export default App;
