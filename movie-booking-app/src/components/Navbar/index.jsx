
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../images/logo.png'
import './Navbar.css';
import axios from 'axios';

const Navbar = () => {
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [isHeaderHidden, setHeaderHidden] = useState(false);
    const [loginStatus, setLoginStatus] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        let token = localStorage.getItem("access_token")
        if (!token) {
            setLoginStatus(false);
        } else {
            setLoginStatus(true);
            fetchUserProfile()
        }
    }, [loginStatus]);

    const fetchUserProfile = async () => {
        try {
            const user_id = localStorage.getItem('user_id');
            const access_token = localStorage.getItem('access_token');
            const response = await axios.get(`http://127.0.0.1:8000/api/users/${user_id}/`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });

            if (response.status === 200) {
                const user = response.data;
                setIsAdmin(user.is_staff && user.is_superuser);
            } else {
                console.error('Error fetching user profile');
            }
        } catch (error) {
            console.error('Error fetching user profile', error);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > lastScrollTop) {
                setHeaderHidden(true);
            } else {
                setHeaderHidden(false);
            }
            setLastScrollTop(scrollTop);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [lastScrollTop]);

    const onLogoutHandler = () => {
        localStorage.clear();
        setLoginStatus(false);
        setIsAdmin(false)
    };

    return (
        <>
            <nav className={`header navbar fixed-top navbar-dark navbar-expand-sm navbar-light ${isHeaderHidden ? 'hidden' : ''}`}>
                <div className='navbar-brand'>
                    <Link to="/"><img src={logo} alt="logo" /></Link>
                </div>
                <button
                    className="navbar-toggler"
                    type="button" data-toggle="collapse"
                    data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <div className="nav-links">
                        {
                            loginStatus ? (
                                <>
                                    <div className='d-flex align-items-center justify-content-center'>
                                        <Link className="navlink mr-3 text-white" to="/profile">Profile</Link>
                                        {isAdmin && <Link className="navlink text-white" to="/add-movie">Add Movie</Link>}

                                    </div>
                                    <Link className="join-btn" onClick={onLogoutHandler}>Log Out</Link>
                                </>
                            ) : (
                                <>
                                    <Link className="navlink text-white" to="/login">Login</Link>
                                    <Link className="join-btn" to="/signup">Join Us</Link>
                                </>
                            )
                        }
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;