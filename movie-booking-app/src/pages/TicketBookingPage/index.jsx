import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import SeatGrid from '../../components/SeatGrid';
import './TicketBookingPage.css';
import screen from '../../images/screen-thumb.png';
import Navbar from '../../components/Navbar';
import BookingDetailsModal from '../../components/BookingDetailModal';
import Endpoints from '../../api/Endpoints';


const TicketBookingPage = () => {
    const nav = useNavigate()
    const { id } = useParams();
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [numSeats, setNumSeats] = useState(1);
    const { state: { movie, cinema, schedule } } = useLocation()
    const currentDateTime = new Date();
    const [selectedDate, setSelectedDate] = useState(currentDateTime);
    const unselectableSeatsGrid1 = ['A1', 'B2'];
    const unselectableSeatsGrid2 = ['B3', 'A6', 'C5'];
    const unselectableSeatsGrid3 = ['A7', 'B8'];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const price = 250


    useEffect(() => {
        const token = localStorage.getItem('access_token');
        setIsLoggedIn(!!token);
    }, []);

    const handleSelectSeat = (seat) => {
        const index = selectedSeats.indexOf(seat);
        if (index === -1 && selectedSeats.length < numSeats) {
            setSelectedSeats([...selectedSeats, seat]);
        } else if (index !== -1) {
            const updatedSeats = [...selectedSeats];
            updatedSeats.splice(index, 1);
            setSelectedSeats(updatedSeats);
        }
    };

    const handleNumSeatsChange = (e) => {
        const newNumSeats = parseInt(e.target.value, 10);
        setNumSeats(newNumSeats);
        setSelectedSeats([]);
    };

    const backToCinemaList = () => {
        nav(`/${id}/cinema-list`, { state: { movie, cinema, schedule } });
    }

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };


    const handleBookTicket = async () => {
        if (!isLoggedIn) {
            // Redirect user to login page if not logged in
            nav('/login');
            return;
        }
    
        if (selectedSeats.length > 0) {
            try {
                const userId = localStorage.getItem('user_id'); // Retrieve user ID from localStorage
                const formattedDate = `${selectedDate.getDate()}-${(selectedDate.getMonth() + 1)}-${selectedDate.getFullYear()}`
    
                const ticketData = {
                    cinema: cinema.name,
                    movie: movie.title,
                    seats: selectedSeats,
                    num_seats: selectedSeats.length,
                    schedule: schedule,
                    show_date: formattedDate,
                    ticket_price: selectedSeats.length * price,
                    user: userId // Include user ID here
                };
                console.log(ticketData)
    
                const response = await fetch(Endpoints.CREATE_TICKET, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(ticketData),
                });
    
                if (response.ok) {
                    openModal();
                } else {
                    console.error('Failed to create ticket');
                }
            } catch (error) {
                console.error('Error creating ticket:', error);
            }
        } else {
            setSelectedSeats([]);
            setNumSeats(1);
            openModal();
        }
    };

    const renderDateOptions = () => {
        const options = [];
        const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

        for (let i = 0; i < 5; i++) {
            const date = new Date(currentDateTime);
            date.setDate(date.getDate() + i);
            const dayOfMonth = date.getDate();
            const month = months[date.getMonth()];
            const year = date.getFullYear();
            options.push(
                <option className='text-dark' key={i} value={date.toDateString()}>
                    {`${dayOfMonth}/${month}/${year}`}
                </option>
            );
        }
        return options;
    };

    const formatDate = (date) => {
        const current_day = new Date();
        const weekDay = date.toDateString().toUpperCase().split(" ")[0]
        const day = date.toDateString().toUpperCase().split(" ").splice(1).join(" ")

        if (
            date.getDate() === current_day.getDate() &&
            date.getMonth() === current_day.getMonth()
        ) {
            return 'TODAY';
        } else {
            return `${weekDay}, ${day}`
        }
    };

    const renderSeatGrids = () => {
        const grids = [
            { rows: ['A', 'B', 'C'], columns: ['1', '2'], unselectableSeats: unselectableSeatsGrid1 },
            { rows: ['A', 'B', 'C'], columns: ['3', '4', '5', '6'], unselectableSeats: unselectableSeatsGrid2 },
            { rows: ['A', 'B', 'C'], columns: ['7', '8'], unselectableSeats: unselectableSeatsGrid3 }
        ];

        return grids.map((grid, index) => (
            <SeatGrid
                key={index}
                rows={grid.rows}
                columns={grid.columns}
                onSelectSeat={handleSelectSeat}
                selectedSeats={selectedSeats}
                unselectableSeats={grid.unselectableSeats}
            />
        ));
    };

    return (
        <>
            <Navbar />
            <div className="ticket-upper">
                <div className="banner-bg">
                    <div className="banner-text">
                        <h2>{cinema.name}</h2>
                        <div className="bottom-border mt-0 mb-2"></div>
                        <h3>{movie.title}</h3>
                        <h5>{movie.genre} | {movie.language}</h5>
                    </div>
                </div>

                <div className="timing-container">
                    <button
                        style={{ position: "relative", right: "250px" }}
                        onClick={backToCinemaList}
                        className="join-btn rounded px-2 py-1"
                    >
                        &#11164; BACK
                    </button>
                    <div className="timing">
                        <div>{formatDate(selectedDate)}</div>
                        <hr style={{ width: "220px", border: "teal 1px solid" }} className='mt-1 mb-2' />
                        <div>
                            <span className='teal font-weight-bold'>Selected Showtime: </span>
                            {schedule} hr
                        </div>
                    </div>
                </div>
                <div className="screen-area">
                    <div className='top-border'></div>
                    <h4>SCREEN</h4>
                    <div className='bottom-border mb-5'></div>
                    <img src={screen} alt="screen" width='650' className='img-fluid' />
                    <div className='top-border mt-5'></div>
                    <h5 className="teal">SILVER PLUS</h5>
                    <div className='bottom-border'></div>
                </div>
            </div>

            <div className="ticket-lower text-white">

                <div className="show-schedule">
                    <div className="seat-number">
                        <span>Number of Seats:</span>
                        <select id="numSeats" value={numSeats} onChange={handleNumSeatsChange}>
                            {[1, 2, 3, 4, 5].map((num) => (
                                <option className='text-dark' key={num} value={num}>
                                    {num}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className=" ml-4 date-selector">
                        <span>Date:</span>
                        <select value={selectedDate.toDateString()} onChange={(e) => setSelectedDate(new Date(e.target.value))}>
                            {renderDateOptions()}
                        </select>
                    </div>

                </div>
                <div className='seat-grid'>
                    {renderSeatGrids()}
                </div>
                <ul className="showcase">
                    <li>
                        <div className="na"></div>
                        <small >Available</small>
                    </li>
                    <li>
                        <div className="sl"></div>
                        <small>Selected</small>
                    </li>
                    <li>
                        <div className="oc"></div>
                        <small>Booked</small>
                    </li>
                </ul>

                <div className="info-card">
                    <div className="info">

                        <div className="choosed">
                            <p className='m-0'>You have Choosed Seat</p>
                            <span className='teal'>{selectedSeats.join(', ')}</span>
                        </div>

                        <div className="total">
                            <p className='m-0'>Total Price</p>
                            <span className='teal'>{selectedSeats.length * price}</span>
                        </div>
                        <button disabled={numSeats !== selectedSeats.length} className='join-btn mt-3' onClick={handleBookTicket}>PROCEED</button>
                    </div>
                </div>
            </div>
            <BookingDetailsModal
                isOpen={isModalOpen}
                closeModal={closeModal}
                cinema={cinema}
                movie={movie}
                selectedSeats={selectedSeats}
                numSeats={numSeats}
                schedule={schedule}
                showDate={selectedDate.toDateString()}
                price={price}
            />
        </>
    );
};

export default TicketBookingPage;