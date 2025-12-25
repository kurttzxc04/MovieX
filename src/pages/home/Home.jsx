import React, { useState } from "react";

import "./style.scss";

import HeroBanner from "./heroBanner/HeroBanner";
import Trending from "./trending/Trending";
import Popular from "./popular/Popular";
import TopRated from "./topRated/TopRated";
import CategoryPills from "../../components/categoryPills/CategoryPills";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";

// SEPARATE Genre ID mappings for MOVIES and TV
// Movies and TV have DIFFERENT genre IDs in TMDB!
const MOVIE_GENRE_MAP = {
    "All": null,
    "Action": 28,
    "Animation": 16,
    "Adventure": 12,
    "Horror": 27,
    "Documentary": 99,
    "Romance": 10749,
    "Kids": 10751,
};

const TV_GENRE_MAP = {
    "All": null,
    "Action": 10759, // Action & Adventure for TV
    "Animation": 16,
    "Adventure": 10759, // Action & Adventure for TV
    "Horror": 10765, // Sci-Fi & Fantasy (closest match)
    "Documentary": 99,
    "Romance": null, // Not available for TV
    "Kids": 10762,
};

const Home = () => {
    const [selectedGenre, setSelectedGenre] = useState("All");

    return (
        <div className="home-page">
            <HeroBanner />
            
            <ContentWrapper>
                <CategoryPills onSelect={setSelectedGenre} />
            </ContentWrapper>

            <Trending selectedGenre={selectedGenre} movieGenreMap={MOVIE_GENRE_MAP} tvGenreMap={TV_GENRE_MAP} />
            <Popular selectedGenre={selectedGenre} movieGenreMap={MOVIE_GENRE_MAP} tvGenreMap={TV_GENRE_MAP} />
            <TopRated selectedGenre={selectedGenre} movieGenreMap={MOVIE_GENRE_MAP} tvGenreMap={TV_GENRE_MAP} />
        </div>
    );
};

export default Home;
