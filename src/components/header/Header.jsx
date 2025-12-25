import React, { useState, useEffect } from "react";
import { HiOutlineSearch, HiBell, HiUser } from "react-icons/hi";
import { SlMenu } from "react-icons/sl";
import { VscChromeClose } from "react-icons/vsc";
import { useNavigate, useLocation } from "react-router-dom";

import "./style.scss";

import ContentWrapper from "../contentWrapper/ContentWrapper";
import logo from "../../assets/movix-logo.png";

const Header = () => {
    const [show, setShow] = useState("top");
    const [lastScrollY, setLastScrollY] = useState(0);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [query, setQuery] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [imageError, setImageError] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    const controlNavbar = () => {
        if (window.scrollY > 100) {
            if (window.scrollY > lastScrollY && !mobileMenu) {
                setShow("hide");
            } else {
                setShow("show");
            }
        } else {
            setShow("top");
        }
        setLastScrollY(window.scrollY);
    };

    useEffect(() => {
        window.addEventListener("scroll", controlNavbar);
        return () => {
            window.removeEventListener("scroll", controlNavbar);
        };
    }, [lastScrollY]);

    const searchQueryHandler = (event) => {
        if (event.key === "Enter" && query.length > 0) {
            navigate(`/search/${query}`);
            setTimeout(() => {
                setShowSearch(false);
            }, 1000);
        }
    };

    const openSearch = () => {
        setMobileMenu(false);
        setShowSearch(true);
    };

    const openMobileMenu = () => {
        setMobileMenu(true);
        setShowSearch(false);
    };

    const navigationHandler = (type) => {
        if (type === "movie") {
            navigate("/explore/movie");
        } else if (type === "tv") {
            navigate("/explore/tv");
        } else {
            navigate("/");
        }
        setMobileMenu(false);
    };

    return (
        <header className={`navbar ${mobileMenu ? "mobileView" : ""} ${show}`}>
            <ContentWrapper>
                <div className="navbar__left">
                    <div className="navbar__logo" onClick={() => navigationHandler("home")}>
                        <img src={logo} alt="Movix" />
                    </div>
                    <nav className="navbar__menu">
                        <button 
                            className="navbar__menu-item"
                            onClick={() => navigationHandler("home")}
                        >
                            Home
                        </button>
                        <button 
                            className="navbar__menu-item"
                            onClick={() => navigationHandler("movie")}
                        >
                            Movies
                        </button>
                        <button 
                            className="navbar__menu-item"
                            onClick={() => navigationHandler("tv")}
                        >
                            Series
                        </button>
                        <button 
                            className="navbar__menu-item"
                            onClick={() => navigationHandler("tv")}
                        >
                            Kids
                        </button>
                    </nav>
                </div>

                <div className="navbar__right">
                    <div className="navbar__search-trigger" onClick={openSearch}>
                        <HiOutlineSearch />
                    </div>
                    <div className="navbar__notification">
                        <HiBell />
                    </div>
                    <div className="navbar__avatar">
                        {!imageError ? (
                            <img 
                                src={profileImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"}
                                alt="Profile" 
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className="navbar__avatar-fallback">
                                <HiUser />
                            </div>
                        )}
                    </div>
                </div>

                <div className="navbar__mobile-actions">
                    <HiOutlineSearch onClick={openSearch} />
                    {mobileMenu ? (
                        <VscChromeClose onClick={() => setMobileMenu(false)} />
                    ) : (
                        <SlMenu onClick={openMobileMenu} />
                    )}
                </div>
            </ContentWrapper>

            {showSearch && (
                <div className="navbar__searchbar">
                    <ContentWrapper>
                        <div className="navbar__searchbar-input">
                            <HiOutlineSearch />
                            <input
                                type="text"
                                placeholder="Search movies, series, genres..."
                                autoFocus
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyUp={searchQueryHandler}
                            />
                            <VscChromeClose
                                onClick={() => {
                                    setShowSearch(false);
                                    setQuery("");
                                }}
                            />
                        </div>
                    </ContentWrapper>
                </div>
            )}
        </header>
    );
};

export default Header;
