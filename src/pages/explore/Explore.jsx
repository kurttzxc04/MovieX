import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
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
    const [pageNum, setPageNum] = useState(1);
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

    const fetchInitialData = () => {
        setLoading(true);
        let fetchFilters = { ...filters };

        // Add kids genre filter if on kids page
        if (isKidsPage) {
            const kidsGenreId = mediaTypeState === "movie" ? KIDS_MOVIE_ID : KIDS_TV_ID;
            fetchFilters.with_genres = kidsGenreId;
        }

        fetchDataFromApi(`/discover/${currentMediaType}`, fetchFilters).then((res) => {
            setData(res);
            setPageNum((prev) => prev + 1);
            setLoading(false);
        });
    };

    const fetchNextPageData = () => {
        let fetchFilters = { ...filters };

        // Add kids genre filter if on kids page
        if (isKidsPage) {
            const kidsGenreId = mediaTypeState === "movie" ? KIDS_MOVIE_ID : KIDS_TV_ID;
            fetchFilters.with_genres = kidsGenreId;
        }

        fetchDataFromApi(
            `/discover/${currentMediaType}?page=${pageNum}`,
            fetchFilters
        ).then((res) => {
            if (data?.results) {
                setData({
                    ...data,
                    results: [...data?.results, ...res.results],
                });
            } else {
                setData(res);
            }
            setPageNum((prev) => prev + 1);
        });
    };

    useEffect(() => {
        filters = {};
        setData(null);
        setPageNum(1);
        setSortby(null);
        setGenre(null);
        if (isKidsPage) {
            setMediaTypeState("movie");
        }
        fetchInitialData();
    }, [mediaType, isKidsPage]);

    useEffect(() => {
        // Refetch when kids page switches between movie/tv
        if (isKidsPage) {
            setData(null);
            setPageNum(1);
            fetchInitialData();
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

        setPageNum(1);
        fetchInitialData();
    };

    return (
        <div className="explorePage">
            <ContentWrapper>
                <div className="pageHeader">
                    <div className="pageTitle">
                        {isKidsPage
                            ? "Kids & Family"
                            : mediaType === "tv"
                            ? "Explore TV Shows"
                            : "Explore Movies"}
                    </div>
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
                            <InfiniteScroll
                                className="content"
                                dataLength={data?.results?.length || []}
                                next={fetchNextPageData}
                                hasMore={pageNum <= data?.total_pages}
                                loader={<Spinner />}
                            >
                                {data?.results?.map((item, index) => {
                                    if (item.media_type === "person") return;
                                    return (
                                        <MovieCard
                                            key={index}
                                            data={item}
                                            mediaType={currentMediaType}
                                        />
                                    );
                                })}
                            </InfiniteScroll>
                        ) : (
                            <span className="resultNotFound">
                                Sorry, Results not found!
                            </span>
                        )}
                    </>
                )}
            </ContentWrapper>
        </div>
    );
};

export default Explore;
