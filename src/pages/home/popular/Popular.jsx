import React, { useState } from "react";

import Carousel from "../../../components/carousel/Carousel";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import SwitchTabs from "../../../components/switchTabs/SwitchTabs";

import useFetch from "../../../hooks/useFetch";

const Popular = ({ selectedGenre, movieGenreMap, tvGenreMap }) => {
    const [mediaType, setMediaType] = useState("movie");

    // Get the correct genre ID based on media type
    const genreMap = mediaType === "movie" ? movieGenreMap : tvGenreMap;
    const genreId = genreMap[selectedGenre];

    // Build endpoint with genre filtering
    let endpoint = `/discover/${mediaType}?sort_by=popularity.desc`;
    if (genreId) {
        endpoint += `&with_genres=${genreId}`;
    }

    const { data, loading } = useFetch(endpoint);

    const onTabChange = (tab) => {
        setMediaType(tab === "Movies" ? "movie" : "tv");
    };

    return (
        <div className="carousel-section">
            <ContentWrapper>
                <div className="carousel-section__header">
                    <h2 className="carousel-title">What's Popular</h2>
                    <SwitchTabs
                        data={["Movies", "TV Shows"]}
                        onTabChange={onTabChange}
                    />
                </div>
            </ContentWrapper>
            <Carousel
                data={data?.results}
                loading={loading}
                endpoint={mediaType}
            />
        </div>
    );
};

export default Popular;
