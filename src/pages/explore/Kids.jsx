import React, { useState, useEffect } from "react";
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

const Kids = () => {
    const [data, setData] = useState(null);
    const [pageNum, setPageNum] = useState(1);
    const [loading, setLoading] = useState(false);
    const [mediaType, setMediaType] = useState("movie");
    const [sortby, setSortby] = useState(null);

    // Kids genre IDs for both Movies and TV
    const KIDS_MOVIE_ID = 10751;
    const KIDS_TV_ID = 10762;
    const kidsGenreId = mediaType === "movie" ? KIDS_MOVIE_ID : KIDS_TV_ID;

    const fetchInitialData = () => {
        setLoading(true);
        // Always include kids genre filter
        const kidsFilters = {
            ...filters,
            with_genres: kidsGenreId,
        };
        fetchDataFromApi(`/discover/${mediaType}`, kidsFilters).then((res) => {
            setData(res);
            setPageNum((prev) => prev + 1);
            setLoading(false);
        });
    };

    const fetchNextPageData = () => {
        const kidsFilters = {
            ...filters,
            with_genres: kidsGenreId,
        };
        fetchDataFromApi(
            `/discover/${mediaType}?page=${pageNum}`,
            kidsFilters
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
        fetchInitialData();
    }, [mediaType]);

    const onChange = (selectedItems, action) => {
        if (action.name === "sortby") {
            setSortby(selectedItems);
            if (action.action !== "clear") {
                filters.sort_by = selectedItems.value;
            } else {
                delete filters.sort_by;
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
                        Kids & Family
                    </div>
                    <div className="filters">
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <button
                                onClick={() => setMediaType("movie")}
                                style={{
                                    padding: "8px 16px",
                                    borderRadius: "6px",
                                    border: "1px solid",
                                    background: mediaType === "movie" ? "rgba(229, 73, 130, 0.2)" : "transparent",
                                    borderColor: mediaType === "movie" ? "#E54982" : "rgba(255, 255, 255, 0.1)",
                                    color: mediaType === "movie" ? "#E54982" : "rgba(255, 255, 255, 0.7)",
                                    cursor: "pointer",
                                    fontWeight: 600,
                                    transition: "all 0.3s ease",
                                }}
                            >
                                Movies
                            </button>
                            <button
                                onClick={() => setMediaType("tv")}
                                style={{
                                    padding: "8px 16px",
                                    borderRadius: "6px",
                                    border: "1px solid",
                                    background: mediaType === "tv" ? "rgba(229, 73, 130, 0.2)" : "transparent",
                                    borderColor: mediaType === "tv" ? "#E54982" : "rgba(255, 255, 255, 0.1)",
                                    color: mediaType === "tv" ? "#E54982" : "rgba(255, 255, 255, 0.7)",
                                    cursor: "pointer",
                                    fontWeight: 600,
                                    transition: "all 0.3s ease",
                                }}
                            >
                                TV Shows
                            </button>
                        </div>
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
                                            mediaType={mediaType}
                                        />
                                    );
                                })}
                            </InfiniteScroll>
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

export default Kids;
