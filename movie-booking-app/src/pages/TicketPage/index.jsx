import React, { useState, useEffect } from 'react';
import TicketGrid from '../../components/TicketGrid';
import Navbar from '../../components/Navbar';
import './TicketPage.css';

const TicketPage = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const userId = localStorage.getItem('user_id');

                const response = await fetch(`http://127.0.0.1:8000/api/tickets/${userId}/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setTickets(data);
                } else {
                    console.error('Failed to fetch tickets');
                }
            } catch (error) {
                console.error('Error fetching tickets:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    return (
        <>
            <Navbar />
            <div className="container">
                <div className="tickets-container">
                    <div className="row">
                        <div className="col-md-2"></div>
                        <div className="col-md-8">
                            <h2 className="text-left movie-header">Ticket History</h2>
                            <hr style={{ border: "1px solid #31D7A9" }} />

                            {loading ? (
                                <div className="h-100 d-flex align-items-center justify-content-center">
                                    <span className='text-primary spinner-border'></span>
                                </div>
                            ) : (
                                <TicketGrid tickets={tickets} />

                            )}
                        </div>
                        <div className="col-md-2"></div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default TicketPage;