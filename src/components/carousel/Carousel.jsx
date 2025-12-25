import React, { useRef } from "react";
import {
    BsFillArrowLeftCircleFill,
    BsFillArrowRightCircleFill,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

import ContentWrapper from "../contentWrapper/ContentWrapper";
import Img from "../lazyLoadImage/Img";
import PosterFallback from "../../assets/no-poster.png";
import CircleRating from "../circleRating/CircleRating";
import Genres from "../genres/Genres";

import "./style.scss";

const Carousel = ({ data, loading, endpoint, title }) => {
    const carouselContainer = useRef();
    const { url } = useSelector((state) => state.home);
    const navigate = useNavigate();

    const navigation = (dir) => {
        const container = carouselContainer.current;

        const scrollAmount =
            dir === "left"
                ? container.scrollLeft - (container.offsetWidth + 20)
                : container.scrollLeft + (container.offsetWidth + 20);

        container.scrollTo({
            left: scrollAmount,
            behavior: "smooth",
        });
    };

    const skItem = () => {
        return (
            <div className="carousel__skeleton-item">
                <div className="carousel__skeleton-poster skeleton"></div>
                <div className="carousel__skeleton-text">
                    <div className="carousel__skeleton-title skeleton"></div>
                    <div className="carousel__skeleton-date skeleton"></div>
                </div>
            </div>
        );
    };

    return (
        <div className="carousel">
            <ContentWrapper>
                <div className="carousel__header">
                    {title && <h2 className="carousel__title">{title}</h2>}
                    <a href="#" className="carousel__see-more">See more →</a>
                </div>

                {!loading ? (
                    <div className="carousel__wrapper">
                        <button
                            className="carousel__nav carousel__nav--left"
                            onClick={() => navigation("left")}
                            aria-label="Scroll left"
                        >
                            <BsFillArrowLeftCircleFill />
                        </button>

                        <div className="carousel__items" ref={carouselContainer}>
                            {data?.map((item) => {
                                const posterUrl = item.poster_path
                                    ? url.poster + item.poster_path
                                    : PosterFallback;
                                return (
                                    <div
                                        key={item.id}
                                        className="carousel__item"
                                        onClick={() =>
                                            navigate(
                                                `/${item.media_type || endpoint}/${
                                                    item.id
                                                }`
                                            )
                                        }
                                    >
                                        <div className="carousel__poster">
                                            <Img src={posterUrl} />
                                            <div className="carousel__rating">
                                                <CircleRating
                                                    rating={item.vote_average.toFixed(
                                                        1
                                                    )}
                                                />
                                            </div>
                                            <div className="carousel__genres">
                                                <Genres
                                                    data={item.genre_ids.slice(0, 2)}
                                                />
                                            </div>
                                        </div>
                                        <div className="carousel__info">
                                            <span className="carousel__item-title">
                                                {item.title || item.name}
                                            </span>
                                            <span className="carousel__item-date">
                                                {dayjs(item.release_date || item.first_air_date).format(
                                                    "MMM D, YYYY"
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <button
                            className="carousel__nav carousel__nav--right"
                            onClick={() => navigation("right")}
                            aria-label="Scroll right"
                        >
                            <BsFillArrowRightCircleFill />
                        </button>
                    </div>
                ) : (
                    <div className="carousel__loading">
                        {skItem()}
                        {skItem()}
                        {skItem()}
                        {skItem()}
                        {skItem()}
                    </div>
                )}
            </ContentWrapper>
        </div>
    );
};

export default Carousel;
