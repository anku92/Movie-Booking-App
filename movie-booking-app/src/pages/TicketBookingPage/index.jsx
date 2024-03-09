import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import SeatGrid from '../../components/SeatGrid';
import './TicketBookingPage.css';
import screen from '../../images/screen-thumb.png';
import Navbar from '../../components/Navbar';
import BookingDetailsModal from '../../components/BookingDetailModal';


const TicketBookingPage = () => {
    const nav = useNavigate()
    const { id } = useParams();
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [numSeats, setNumSeats] = useState(1);
    const { state } = useLocation()
    const { movie, cinema, schedule } = state
    const currentDateTime = new Date();
    const [selectedDate, setSelectedDate] = useState(currentDateTime);
    const unselectableSeatsGrid1 = ['A1', 'B2'];
    const unselectableSeatsGrid2 = ['B3', 'A6', 'C5'];
    const unselectableSeatsGrid3 = ['A7', 'B8'];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const price = 250


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
        if (selectedSeats.length > 0) {
            try {
                const ticketData = {
                    cinema: cinema.name,
                    movie: movie.title,
                    seats: selectedSeats,
                    num_seats: selectedSeats.length,
                    schedule: schedule,
                    show_date: selectedDate.toJSON().split("T")[0],
                    ticket_price: selectedSeats.length * price
                };

                const response = await fetch('http://127.0.0.1:8000/api/ticket/add/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(ticketData),
                });

                console.log(ticketData)

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

    return (
        <>
            <Navbar />
            <div className="booking">
                <div className="banner-bg text-center">
                    <h3>{movie.title}</h3>
                    <h5>{cinema.name} | {movie.genre} | {movie.language}</h5>
                </div>

                <div className="timings">
                    <button
                        style={{ position: "relative", right: "250px" }}
                        onClick={backToCinemaList}
                        className="join-btn rounded px-2 py-1"
                    >
                        &#11164; BACK
                    </button>
                    <div className="timing">
                        <div className='mb-1'>{selectedDate.toDateString()}</div>
                        <hr style={{ width: "200px", border: "teal 1px solid" }} className='m-0 p-0' />
                        <div className='mt-2'><span className='teal'>Selected Showtime: </span>{schedule}</div>
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

            <div className="ticket-bottom text-white">
                <div className='seat-selector'>
                    <div className="seat-number">
                        <span>Select Number of Seats:</span>
                        <select id="numSeats" value={numSeats} onChange={handleNumSeatsChange}>
                            {[1, 2, 3, 4, 5].map((num) => (
                                <option className='text-dark font-weight-bold' key={num} value={num}>
                                    {num}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className='seat-grid'>
                    <SeatGrid
                        rows={['A', 'B', 'C']}
                        columns={['1', '2']}
                        onSelectSeat={handleSelectSeat}
                        selectedSeats={selectedSeats}
                        unselectableSeats={unselectableSeatsGrid1}
                    />

                    <SeatGrid
                        rows={['A', 'B', 'C']}
                        columns={['3', '4', '5', '6']}
                        onSelectSeat={handleSelectSeat}
                        selectedSeats={selectedSeats}
                        unselectableSeats={unselectableSeatsGrid2}
                    />

                    <SeatGrid
                        rows={['A', 'B', 'C']}
                        columns={['7', '8']}
                        onSelectSeat={handleSelectSeat}
                        selectedSeats={selectedSeats}
                        unselectableSeats={unselectableSeatsGrid3}
                    />
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