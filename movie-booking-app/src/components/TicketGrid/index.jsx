import React, { useState } from 'react';

const TicketGrid = ({ tickets }) => {
    const [sortOrder, setSortOrder] = useState('latest'); // 'latest' or 'oldest'
    const [buttonText, setButtonText] = useState('Sort ⭳');

    const toggleSortOrder = () => {
        if (sortOrder === 'latest') {
            setSortOrder('oldest');
            setButtonText('Sort ⭱');
        } else {
            setSortOrder('latest');
            setButtonText('Sort ⭳');
        }
    };

    let sortedTickets = tickets.slice(); // Create a copy of the tickets array

    if (sortOrder === 'latest') {
        sortedTickets.sort((a, b) => new Date(b.show_date) - new Date(a.show_date));
    } else {
        sortedTickets.sort((a, b) => new Date(a.show_date) - new Date(b.show_date));
    }

    if (sortedTickets.length === 0) {
        return (
            <div className="container">
                <p className='text-white text-center'>No booking history available.</p>
            </div>
        );
    }

    return (
        <>

            <button className="btn btn-primary mb-3" onClick={toggleSortOrder}>
                {buttonText}
            </button>

            {sortedTickets.map((ticket, i) => {
                const formattedDate = ticket.show_date.split('-').reverse().join('-');
                const sortedSeat = ticket.seats.toString().split(',').sort().join(', ')
                return (
                    <div key={ticket.id} className="card mb-4">
                        <div className="card-header bg-secondary text-white">
                            <div className="row">
                                <div className="col-sm-2"></div>
                                <div className="col-sm-5">
                                    <h6 className="card-text font-weight-bold">TICKET ID #{ticket.id}</h6>
                                </div>
                                <div className="col-sm-5">
                                    <h6 className='card-text'>
                                        <span className='font-weight-bold'>DATE: </span>
                                        {formattedDate}
                                    </h6>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="text-uppercase">
                                <strong>Cinema: </strong>{ticket.cinema}
                            </div>
                            <div className="text-uppercase">
                                <strong>Movie:</strong> {ticket.movie}
                            </div>

                            <div className="row">
                                <div className="col-sm-7">
                                    <div className="text-uppercase">
                                        <strong>Seats: </strong>{sortedSeat}
                                    </div>
                                </div>
                                <div className="col-sm-5">
                                    <div className="text-uppercase">
                                        <strong>Show Time: </strong>{ticket.schedule.slice(0, 5)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-center text-uppercase card-header">
                            <strong>Total: </strong>&#8377; {ticket.ticket_price}
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default TicketGrid;
