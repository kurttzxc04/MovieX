import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Select from "react-select";

import "./style.scss";

import useFetch from "../../hooks/useFetch";
import { fetchDataFromApi } from "../../utils/api";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import MovieCard from "../../components/movieCard/MovieCard";
import Spinner from "../../components/spinner/Spinner";

let filters = {};

const sortbyData = [
    { value: "popularity.desc", label: "Popularity Descending" },
    { value: "popularity.asc", label: "Popularity Ascending" },
    { value: "vote_average.desc", label: "Rating Descending" },
    { value: "vote_average.asc", label: "Rating Ascending" },
    {
        value: "primary_release_date.desc",
        label: "Release Date Descending",
    },
    { value: "primary_release_date.asc", label: "Release Date Ascending" },
    { value: "original_title.asc", label: "Title (A-Z)" },
];

const Explore = () => {
    const [data, setData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [genre, setGenre] = useState(null);
    const [sortby, setSortby] = useState(null);
    const [mediaTypeState, setMediaTypeState] = useState("movie");
    const { mediaType } = useParams();

    // Determine if this is a Kids browse
    const isKidsPage = mediaType === "kids";
    const KIDS_MOVIE_ID = 10751;
    const KIDS_TV_ID = 10762;

    // For kids page, dynamically switch between movie and TV
    const currentMediaType = isKidsPage ? mediaTypeState : mediaType;

    const { data: genresData } = useFetch(
        !isKidsPage ? `/genre/${mediaType}/list` : `/genre/movie/list`
    );

    const fetchPageData = (pageNumber) => {
        setLoading(true);
        let fetchFilters = { ...filters };

        // Add kids genre filter if on kids page
        if (isKidsPage) {
            const kidsGenreId = mediaTypeState === "movie" ? KIDS_MOVIE_ID : KIDS_TV_ID;
            fetchFilters.with_genres = kidsGenreId;
        }

        fetchDataFromApi(
            `/discover/${currentMediaType}?page=${pageNumber}`,
            fetchFilters
        ).then((res) => {
            setData(res);
            setTotalPages(res.total_pages > 500 ? 500 : res.total_pages);
            setLoading(false);
            // Scroll to top of page
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    };

    useEffect(() => {
        filters = {};
        setCurrentPage(1);
        setSortby(null);
        setGenre(null);
        if (isKidsPage) {
            setMediaTypeState("movie");
        }
    }, [mediaType, isKidsPage]);

    useEffect(() => {
        // Fetch data when currentPage, mediaType, or filters change
        fetchPageData(currentPage);
    }, [currentPage, currentMediaType]);

    useEffect(() => {
        // When switching between movie/tv on kids page, reset to page 1
        if (isKidsPage) {
            setCurrentPage(1);
        }
    }, [mediaTypeState]);

    const onChange = (selectedItems, action) => {
        if (action.name === "sortby") {
            setSortby(selectedItems);
            if (action.action !== "clear") {
                filters.sort_by = selectedItems.value;
            } else {
                delete filters.sort_by;
            }
        }

        if (action.name === "genres") {
            setGenre(selectedItems);
            if (action.action !== "clear") {
                let genreId = selectedItems.map((g) => g.id);
                genreId = JSON.stringify(genreId).slice(1, -1);
                filters.with_genres = genreId;
            } else {
                delete filters.with_genres;
            }
        }

        setCurrentPage(1);
        fetchPageData(1);
    };

    const getPageTitle = () => {
        if (isKidsPage) {
            return "Kids & Family";
        }
        return mediaType === "tv" ? "Explore TV Shows" : "Explore Movies";
    };

    // Generate page numbers to display (show max 5 pages at a time)
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };


    return (
        <div className="explorePage">
            <ContentWrapper>
                <div className="pageHeader">
                    <div className="pageTitle">{getPageTitle()}</div>
                    <div className="filters">
                        {isKidsPage ? (
                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                <button
                                    onClick={() => setMediaTypeState("movie")}
                                    style={{
                                        padding: "8px 16px",
                                        borderRadius: "6px",
                                        border: "1px solid",
                                        background:
                                            mediaTypeState === "movie"
                                                ? "rgba(229, 73, 130, 0.2)"
                                                : "transparent",
                                        borderColor:
                                            mediaTypeState === "movie"
                                                ? "#E54982"
                                                : "rgba(255, 255, 255, 0.1)",
                                        color:
                                            mediaTypeState === "movie"
                                                ? "#E54982"
                                                : "rgba(255, 255, 255, 0.7)",
                                        cursor: "pointer",
                                        fontWeight: 600,
                                        transition: "all 0.3s ease",
                                    }}
                                >
                                    Movies
                                </button>
                                <button
                                    onClick={() => setMediaTypeState("tv")}
                                    style={{
                                        padding: "8px 16px",
                                        borderRadius: "6px",
                                        border: "1px solid",
                                        background:
                                            mediaTypeState === "tv"
                                                ? "rgba(229, 73, 130, 0.2)"
                                                : "transparent",
                                        borderColor:
                                            mediaTypeState === "tv"
                                                ? "#E54982"
                                                : "rgba(255, 255, 255, 0.1)",
                                        color:
                                            mediaTypeState === "tv"
                                                ? "#E54982"
                                                : "rgba(255, 255, 255, 0.7)",
                                        cursor: "pointer",
                                        fontWeight: 600,
                                        transition: "all 0.3s ease",
                                    }}
                                >
                                    TV Shows
                                </button>
                            </div>
                        ) : (
                            <Select
                                isMulti
                                name="genres"
                                value={genre}
                                closeMenuOnSelect={false}
                                options={genresData?.genres}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.id}
                                onChange={onChange}
                                placeholder="Select genres"
                                className="react-select-container genresDD"
                                classNamePrefix="react-select"
                            />
                        )}
                        <Select
                            name="sortby"
                            value={sortby}
                            options={sortbyData}
                            onChange={onChange}
                            isClearable={true}
                            placeholder="Sort by"
                            className="react-select-container sortbyDD"
                            classNamePrefix="react-select"
                        />
                    </div>
                </div>
                {loading && <Spinner initial={true} />}
                {!loading && (
                    <>
                        {data?.results?.length > 0 ? (
                            <>
                                <div className="content">
                                    {data?.results?.map((item, index) => {
                                        if (item.media_type === "person") return null;
                                        return (
                                            <MovieCard
                                                key={index}
                                                data={item}
                                                mediaType={currentMediaType}
                                            />
                                        );
                                    })}
                                </div>

                                {/* Pagination Controls */}
                                <div className="pagination">
                                    <button
                                        className="pagination__btn pagination__btn--first"
                                        onClick={() => setCurrentPage(1)}
                                        disabled={currentPage === 1 || loading}
                                        title="First page"
                                    >
                                        «
                                    </button>
                                    <button
                                        className="pagination__btn pagination__btn--prev"
                                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1 || loading}
                                        title="Previous page"
                                    >
                                        ‹
                                    </button>

                                    <div className="pagination__numbers">
                                        {getPageNumbers().map((page) => (
                                            <button
                                                key={page}
                                                className={`pagination__number ${
                                                    page === currentPage ? "active" : ""
                                                }`}
                                                onClick={() => setCurrentPage(page)}
                                                disabled={loading}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        className="pagination__btn pagination__btn--next"
                                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages || loading}
                                        title="Next page"
                                    >
                                        ›
                                    </button>
                                    <button
                                        className="pagination__btn pagination__btn--last"
                                        onClick={() => setCurrentPage(totalPages)}
                                        disabled={currentPage === totalPages || loading}
                                        title="Last page"
                                    >
                                        »
                                    </button>
                                </div>

                                <div className="pagination__info">
                                    Page {currentPage} of {totalPages}
                                </div>
                            </>
                        ) : (
                            <span className="resultNotFound">
                                Sorry, couldn't find the movies you are looking for!
                            </span>
                        )}
                    </>
                )}
            </ContentWrapper>
        </div>
    );
};

export default Explore;
