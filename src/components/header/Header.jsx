import React, { useState, useEffect, useRef } from "react";
import { HiOutlineSearch, HiBell, HiUser } from "react-icons/hi";
import { SlMenu } from "react-icons/sl";
import { VscChromeClose } from "react-icons/vsc";
import { useNavigate, useLocation } from "react-router-dom";

import "./style.scss";

import ContentWrapper from "../contentWrapper/ContentWrapper";
import logo from "../../assets/movix-logo.png";
import { fetchDataFromApi } from "../../utils/api";

// Constant for TMDB image base URL
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w342";

const Header = () => {
    const [show, setShow] = useState("top");
    const [lastScrollY, setLastScrollY] = useState(0);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [query, setQuery] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [imageError, setImageError] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [trendingResults, setTrendingResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const searchTimeoutRef = useRef(null);
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

    // Fetch trending data
    const fetchTrending = async () => {
        try {
            const [trendingMovies, trendingTV] = await Promise.all([
                fetchDataFromApi("/trending/movie/week"),
                fetchDataFromApi("/trending/tv/week"),
            ]);

            const combined = [
                ...trendingMovies.results.slice(0, 5).map((item) => ({ ...item, media_type: "movie" })),
                ...trendingTV.results.slice(0, 5).map((item) => ({ ...item, media_type: "tv" })),
            ]
                .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
                .slice(0, 10);

            setTrendingResults(combined);
        } catch (error) {
            console.error("Error fetching trending:", error);
        }
    };

    // Sort and rank results by relevance
    const rankResults = (results, searchQuery) => {
        const lowerQuery = searchQuery.toLowerCase();

        return results.sort((a, b) => {
            const titleA = (a.title || a.name || "").toLowerCase();
            const titleB = (b.title || b.name || "").toLowerCase();

            // Exact match scores higher
            const exactA = titleA === lowerQuery ? 3 : 0;
            const exactB = titleB === lowerQuery ? 3 : 0;

            // Starts with query scores higher than contains
            const startsA = titleA.startsWith(lowerQuery) ? 2 : titleA.includes(lowerQuery) ? 1 : 0;
            const startsB = titleB.startsWith(lowerQuery) ? 2 : titleB.includes(lowerQuery) ? 1 : 0;

            const scoreA = exactA || startsA;
            const scoreB = exactB || startsB;

            if (scoreA !== scoreB) return scoreB - scoreA;

            // Then sort by popularity
            return (b.popularity || 0) - (a.popularity || 0);
        });
    };

    // Debounced live search
    const performSearch = (searchQuery) => {
        if (searchQuery.length < 2) {
            setSearchResults([]);
            return;
        }

        setSearchLoading(true);
        fetchDataFromApi("/search/multi", { query: searchQuery })
            .then((res) => {
                // Filter out person results
                const filtered = res.results.filter((item) => item.media_type !== "person");
                // Rank and limit to 10 results
                const ranked = rankResults(filtered, searchQuery).slice(0, 10);
                setSearchResults(ranked);
                setSearchLoading(false);
            })
            .catch(() => {
                setSearchResults([]);
                setSearchLoading(false);
            });
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        // Clear previous timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Set new timeout for debounced search
        searchTimeoutRef.current = setTimeout(() => {
            performSearch(value);
        }, 300);
    };

    const searchQueryHandler = (event) => {
        if (event.key === "Enter" && query.length > 0) {
            navigate(`/search/${query}`);
            setShowSearch(false);
            setQuery("");
            setSearchResults([]);
        } else if (event.key === "Escape") {
            closeSearch();
        }
    };

    const closeSearch = () => {
        setShowSearch(false);
        setQuery("");
        setSearchResults([]);
    };

    const selectResult = (item) => {
        const mediaType = item.media_type;
        const id = item.id;
        navigate(`/${mediaType}/${id}`);
        closeSearch();
    };

    const openSearch = () => {
        setMobileMenu(false);
        setShowSearch(true);
        if (trendingResults.length === 0) {
            fetchTrending();
        }
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
        } else if (type === "kids") {
            navigate("/explore/kids");
        } else {
            navigate("/");
        }
        setMobileMenu(false);
    };

    // Get poster image with fallbacks
    const getPosterImage = (item) => {
        // Try poster_path first (most common)
        if (item.poster_path) {
            return `${TMDB_IMAGE_BASE}${item.poster_path}`;
        }
        // Fallback to backdrop_path if poster missing
        if (item.backdrop_path) {
            return `${TMDB_IMAGE_BASE}${item.backdrop_path}`;
        }
        // Return null if no image available (will show placeholder div)
        return null;
    };

    // Close search when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (showSearch && !e.target.closest(".navbar__search-container")) {
                closeSearch();
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [showSearch]);

    // Display results: search results if query exists, otherwise trending
    const displayResults = query.length > 0 ? searchResults : trendingResults;
    const isLoadingOrEmpty = query.length > 0 ? searchLoading : false;
    const hasNoResults = query.length > 0 && !searchLoading && searchResults.length === 0;

    return (
        <>
            {showSearch && <div className="navbar__search-overlay" onClick={closeSearch} />}
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
                                onClick={() => navigationHandler("kids")}
                            >
                                Kids
                            </button>
                        </nav>
                    </div>

                    <div className="navbar__right">
                        <div className="navbar__search-container">
                            <div 
                                className={`navbar__search-trigger ${showSearch ? "active" : ""}`}
                                onClick={openSearch}
                            >
                                <HiOutlineSearch />
                            </div>
                            {showSearch && (
                                <div className="navbar__search-expanded">
                                    <input
                                        type="text"
                                        placeholder="Search movies, series..."
                                        autoFocus
                                        value={query}
                                        onChange={handleSearchChange}
                                        onKeyUp={searchQueryHandler}
                                    />
                                    <VscChromeClose
                                        onClick={closeSearch}
                                    />
                                    {(displayResults.length > 0 || isLoadingOrEmpty || hasNoResults) && (
                                        <div className="navbar__search-results">
                                            {isLoadingOrEmpty ? (
                                                <div className="search-loading">Searching...</div>
                                            ) : hasNoResults ? (
                                                <div className="no-results">No results found for "{query}"</div>
                                            ) : displayResults.length > 0 ? (
                                                <>
                                                    {query.length === 0 && (
                                                        <div className="results-heading">Trending Now</div>
                                                    )}
                                                    {displayResults.map((item) => (
                                                        <div
                                                            key={`${item.media_type}-${item.id}`}
                                                            className="search-result-item"
                                                            onClick={() => selectResult(item)}
                                                        >
                                                            <div className="result-poster">
                                                                {getPosterImage(item) ? (
                                                                    <img
                                                                        src={getPosterImage(item)}
                                                                        alt={item.title || item.name}
                                                                        onError={(e) => {
                                                                            e.target.style.display = "none";
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <div className="result-poster-placeholder">
                                                                        <span>No Poster</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="result-info">
                                                                <div className="result-title">
                                                                    {item.title || item.name}
                                                                </div>
                                                                <div className="result-meta">
                                                                    <span className="result-type">
                                                                        {item.media_type === "movie" ? "Movie" : "TV"}
                                                                    </span>
                                                                    {item.release_date && (
                                                                        <span className="result-year">
                                                                            ({new Date(item.release_date).getFullYear()})
                                                                        </span>
                                                                    )}
                                                                    {item.first_air_date && (
                                                                        <span className="result-year">
                                                                            ({new Date(item.first_air_date).getFullYear()})
                                                                        </span>
                                                                    )}
                                                                    {item.vote_average > 0 && (
                                                                        <span className="result-rating">
                                                                            ★ {item.vote_average.toFixed(1)}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </>
                                            ) : null}
                                        </div>
                                    )}
                                </div>
                            )}
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
            </header>
        </>
    );
};

export default Header;
