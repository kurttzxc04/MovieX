import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { HiPlay } from "react-icons/hi";
import "./style.scss";

import useFetch from "../../../hooks/useFetch";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";

const HeroBanner = () => {
    const [background, setBackground] = useState("");
    const [query, setQuery] = useState("");
    const [movie, setMovie] = useState(null);
    const navigate = useNavigate();
    const { url } = useSelector((state) => state.home);
    const { data, loading } = useFetch("/movie/upcoming");

    useEffect(() => {
        if (data?.results?.length) {
            const randomMovie = data.results[Math.floor(Math.random() * 20)];
            setMovie(randomMovie);
            const bg = url.backdrop + randomMovie.backdrop_path;
            setBackground(bg);
        }
    }, [data]);

    const searchQueryHandler = (event) => {
        if (event.key === "Enter" && query.length > 0) {
            navigate(`/search/${query}`);
        }
    };

    const handleWatchNow = () => {
        if (movie) {
            navigate(`/movie/${movie.id}`);
        }
    };

    return (
        <div className="hero-banner" style={background ? { backgroundImage: `url(${background})` } : {}}>
            <div className="hero-banner__gradient"></div>

            <ContentWrapper>
                <div className="hero-banner__content">
                    <div className="hero-banner__text" data-aos="fade-up">
                        <h1 className="hero-banner__title">
                            {movie?.title || "Discover Amazing Content"}
                        </h1>
                        <p className="hero-banner__description">
                            {movie?.overview
                                ? movie.overview.slice(0, 200) + "..."
                                : "Millions of movies, TV shows and people to discover. Explore now."}
                        </p>

                        <div className="hero-banner__actions">
                            <button
                                className="hero-banner__btn hero-banner__btn--primary"
                                onClick={handleWatchNow}
                            >
                                <HiPlay />
                                <span>Watch Now</span>
                            </button>
                            <button
                                className="hero-banner__btn hero-banner__btn--secondary"
                                onClick={handleWatchNow}
                            >
                                <span>Details</span>
                            </button>
                        </div>

                        {movie?.vote_average && (
                            <div className="hero-banner__rating">
                                <span className="rating-badge">
                                    ⭐ {movie.vote_average.toFixed(1)}/10
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </ContentWrapper>

            <div className="hero-banner__search">
                <ContentWrapper>
                    <div className="hero-banner__search-box">
                        <input
                            type="text"
                            placeholder="Search for a movie or series..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyUp={searchQueryHandler}
                        />
                        <button onClick={() => {
                            if (query.length > 0) {
                                navigate(`/search/${query}`);
                            }
                        }}>
                            Search
                        </button>
                    </div>
                </ContentWrapper>
            </div>
        </div>
    );
};

export default HeroBanner;
