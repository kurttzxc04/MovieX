import React from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { HiPlay } from "react-icons/hi";

import "./style.scss";
import Img from "../lazyLoadImage/Img";
import CircleRating from "../circleRating/CircleRating";
import Genres from "../genres/Genres";
import PosterFallback from "../../assets/no-poster.png";

const MovieCard = ({ data, fromSearch, mediaType }) => {
    const { url } = useSelector((state) => state.home);
    const navigate = useNavigate();
    const posterUrl = data.poster_path
        ? url.poster + data.poster_path
        : PosterFallback;

    const handleClick = () => {
        navigate(`/${data.media_type || mediaType}/${data.id}`);
    };

    return (
        <div
            className="movie-card"
            onClick={handleClick}
        >
            <div className="movie-card__poster">
                <Img className="movie-card__image" src={posterUrl} />
                <div className="movie-card__overlay">
                    <div className="movie-card__play-btn">
                        <HiPlay />
                    </div>
                </div>
                
                {!fromSearch && (
                    <>
                        <div className="movie-card__rating">
                            <CircleRating rating={data.vote_average.toFixed(1)} />
                        </div>
                        <div className="movie-card__genres">
                            <Genres data={data.genre_ids.slice(0, 2)} />
                        </div>
                    </>
                )}
            </div>
            <div className="movie-card__info">
                <h3 className="movie-card__title">{data.title || data.name}</h3>
                <p className="movie-card__date">
                    {dayjs(data.release_date).format("MMM D, YYYY")}
                </p>
            </div>
        </div>
    );
};

export default MovieCard;
