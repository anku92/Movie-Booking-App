
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../images/logo.png'
import './Navbar.css';

const Navbar = () => {
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [isHeaderHidden, setHeaderHidden] = useState(false);


    const [loginStatus, setLoginStatus] = useState(false);

    useEffect(() => {
        let token = localStorage.getItem("access_token")
        if (!token) {
            setLoginStatus(false);
        } else {
            setLoginStatus(true);
        }
    }, [loginStatus]);

    const onLogoutHandler = () => {
        localStorage.clear();
        setLoginStatus(false);
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
                                <Link className="navlink text-white" to="/profile">Profile</Link>
                            ) : (
                                <Link className="navlink text-white" to="/login">Login</Link>
                            )
                        }
                        {
                            loginStatus ? (
                                <Link className="join-btn" onClick={onLogoutHandler}>Log Out</Link>
                            ) : (
                                <Link className="join-btn" to="/signup">Join Us</Link>
                            )
                        }
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;