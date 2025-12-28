import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./style.scss";

import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import MovieCard from "../../../components/movieCard/MovieCard";

const PersonCredits = ({ credits, loading }) => {
    const navigate = useNavigate();
    const { url } = useSelector((state) => state.home);

    if (loading) {
        return (
            <div className="person-credits">
                <ContentWrapper>
                    <div className="person-credits__heading">Filmography</div>
                    <div className="person-credits__skeleton">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="skeleton-card skeleton"></div>
                        ))}
                    </div>
                </ContentWrapper>
            </div>
        );
    }

    // Combine and sort credits by popularity and release date
    const allCredits = credits?.cast || [];
    const sortedCredits = [...allCredits]
        .filter((item) => item.poster_path) // Only show items with posters
        .sort((a, b) => {
            const dateA = a.release_date || a.first_air_date || "0";
            const dateB = b.release_date || b.first_air_date || "0";
            return dateB.localeCompare(dateA); // Most recent first
        })
        .slice(0, 20); // Limit to 20 items

    if (!sortedCredits || sortedCredits.length === 0) {
        return (
            <div className="person-credits">
                <ContentWrapper>
                    <div className="person-credits__heading">Filmography</div>
                    <p className="person-credits__empty">No credits available</p>
                </ContentWrapper>
            </div>
        );
    }

    return (
        <div className="person-credits">
            <ContentWrapper>
                <div className="person-credits__heading">Filmography</div>
                <div className="person-credits__grid">
                    {sortedCredits.map((item) => (
                        <MovieCard
                            key={`${item.media_type}-${item.id}`}
                            data={item}
                            mediaType={item.media_type}
                        />
                    ))}
                </div>
            </ContentWrapper>
        </div>
    );
};

export default PersonCredits;
