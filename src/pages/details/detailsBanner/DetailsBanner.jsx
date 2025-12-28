import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { HiPlay } from "react-icons/hi";

import "./style.scss";

import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import useFetch from "../../../hooks/useFetch";
import Genres from "../../../components/genres/Genres";
import CircleRating from "../../../components/circleRating/CircleRating";
import Img from "../../../components/lazyLoadImage/Img.jsx";
import PosterFallback from "../../../assets/no-poster.png";
import { PlayIcon } from "../Playbtn";
import VideoPopup from "../../../components/videoPopup/VideoPopup";

const DetailsBanner = ({ video, crew }) => {
    const [show, setShow] = useState(false);
    const [videoId, setVideoId] = useState(null);

    const { mediaType, id } = useParams();
    const { data, loading } = useFetch(`/${mediaType}/${id}`);
    const { data: watchProviders } = useFetch(`/${mediaType}/${id}/watch/providers`);
    const { data: externalIds } = useFetch(`/${mediaType}/${id}/external_ids`);

    const { url } = useSelector((state) => state.home);

    const _genres = data?.genres?.map((g) => g.id);

    const director = crew?.filter((f) => f.job === "Director");
    const writer = crew?.filter(
        (f) => f.job === "Screenplay" || f.job === "Story" || f.job === "Writer"
    );

    const toHoursAndMinutes = (totalMinutes) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
    };

    // Get direct platform URL based on provider ID
    const getPlatformUrl = (providerId, providerName) => {
        const imdbId = externalIds?.imdb_id;
        
        // Platform-specific URL mapping based on TMDB provider IDs
        const platformUrls = {
            8: 'https://www.netflix.com', // Netflix
            9: 'https://www.primevideo.com', // Amazon Prime Video
            337: 'https://www.disneyplus.com', // Disney+
            384: 'https://www.max.com', // HBO Max
            15: 'https://www.hulu.com', // Hulu
            350: 'https://tv.apple.com', // Apple TV+
            531: 'https://www.paramountplus.com', // Paramount+
            386: 'https://www.peacocktv.com', // Peacock
            1899: 'https://www.max.com', // Max
            2: imdbId ? `https://www.primevideo.com/detail/${imdbId}` : 'https://www.primevideo.com', // Apple TV (rent/buy)
            3: imdbId ? `https://play.google.com/store/movies` : 'https://play.google.com/store/movies', // Google Play
        };

        return platformUrls[providerId] || `https://www.google.com/search?q=${encodeURIComponent(data?.title || data?.name)} ${providerName} watch online`;
    };

    return (
        <div className="detailsBanner">
            {!loading ? (
                <>
                    {!!data && (
                        <React.Fragment>
                            <div className="backdrop-img">
                                <Img src={url.backdrop + data.backdrop_path} />
                            </div>
                            <div className="opacity-layer"></div>
                            <ContentWrapper>
                                <div className="content">
                                    <div className="left">
                                        <div className="poster-container">
                                            {data.poster_path ? (
                                                <Img
                                                    className="posterImg"
                                                    src={
                                                        url.backdrop +
                                                        data.poster_path
                                                    }
                                                />
                                            ) : (
                                                <Img
                                                    className="posterImg"
                                                    src={PosterFallback}
                                                />
                                            )}
                                            {video && (
                                                <div 
                                                    className="trailer-overlay"
                                                    onClick={() => {
                                                        setShow(true);
                                                        setVideoId(video.key);
                                                    }}
                                                >
                                                    <HiPlay className="play-icon" />
                                                    <span className="trailer-text">Watch Trailer</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="right">
                                        <div className="title">
                                            {`${
                                                data.name || data.title
                                            } (${dayjs(
                                                data?.release_date
                                            ).format("YYYY")})`}
                                        </div>
                                        <div className="subtitle">
                                            {data.tagline}
                                        </div>

                                        <Genres data={_genres} />

                                        <div className="row">
                                            <CircleRating
                                                rating={data.vote_average.toFixed(
                                                    1
                                                )}
                                            />
                                            <div
                                                className="playbtn"
                                                onClick={() => {
                                                    setShow(true);
                                                    setVideoId(video.key);
                                                }}
                                            >
                                                <PlayIcon />
                                                <span className="text">
                                                    Watch Trailer
                                                </span>
                                            </div>
                                        </div>

                                        <div className="overview">
                                            <div className="heading">
                                                Overview
                                            </div>
                                            <div className="description">
                                                {data.overview}
                                            </div>
                                        </div>

                                        <div className="info">
                                            {data.status && (
                                                <div className="infoItem">
                                                    <span className="text bold">
                                                        Status:{" "}
                                                    </span>
                                                    <span className="text">
                                                        {data.status}
                                                    </span>
                                                </div>
                                            )}
                                            {data.release_date && (
                                                <div className="infoItem">
                                                    <span className="text bold">
                                                        Release Date:{" "}
                                                    </span>
                                                    <span className="text">
                                                        {dayjs(
                                                            data.release_date
                                                        ).format("MMM D, YYYY")}
                                                    </span>
                                                </div>
                                            )}
                                            {data.runtime && (
                                                <div className="infoItem">
                                                    <span className="text bold">
                                                        Runtime:{" "}
                                                    </span>
                                                    <span className="text">
                                                        {toHoursAndMinutes(
                                                            data.runtime
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {director?.length > 0 && (
                                            <div className="info">
                                                <span className="text bold">
                                                    Director:{" "}
                                                </span>
                                                <span className="text">
                                                    {director?.map((d, i) => (
                                                        <span key={i}>
                                                            {d.name}
                                                            {director.length -
                                                                1 !==
                                                                i && ", "}
                                                        </span>
                                                    ))}
                                                </span>
                                            </div>
                                        )}

                                        {writer?.length > 0 && (
                                            <div className="info">
                                                <span className="text bold">
                                                    Writer:{" "}
                                                </span>
                                                <span className="text">
                                                    {writer?.map((d, i) => (
                                                        <span key={i}>
                                                            {d.name}
                                                            {writer.length -
                                                                1 !==
                                                                i && ", "}
                                                        </span>
                                                    ))}
                                                </span>
                                            </div>
                                        )}

                                        {data?.created_by?.length > 0 && (
                                            <div className="info">
                                                <span className="text bold">
                                                    Creator:{" "}
                                                </span>
                                                <span className="text">
                                                    {data?.created_by?.map(
                                                        (d, i) => (
                                                            <span key={i}>
                                                                {d.name}
                                                                {data
                                                                    ?.created_by
                                                                    .length -
                                                                    1 !==
                                                                    i && ", "}
                                                            </span>
                                                        )
                                                    )}
                                                </span>
                                            </div>
                                        )}

                                        {/* Where to Watch Section */}
                                        {watchProviders?.results?.US?.flatrate && (
                                            <div className="whereToWatch">
                                                <div className="heading">Available On</div>
                                                <div className="platforms">
                                                    {watchProviders.results.US.flatrate.map((provider) => {
                                                        const platformUrl = getPlatformUrl(provider.provider_id, provider.provider_name);
                                                        
                                                        return (
                                                            <a 
                                                                key={provider.provider_id} 
                                                                href={platformUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="platform"
                                                            >
                                                                <Img
                                                                    src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                                                    alt={provider.provider_name}
                                                                    className="platform-logo"
                                                                />
                                                                <span className="platform-name">{provider.provider_name}</span>
                                                            </a>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                        {watchProviders?.results && !watchProviders.results.US?.flatrate && (
                                            <div className="whereToWatch">
                                                <div className="heading">Available On</div>
                                                <p className="not-available">Streaming availability not found</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <VideoPopup
                                    show={show}
                                    setShow={setShow}
                                    videoId={videoId}
                                    setVideoId={setVideoId}
                                />
                            </ContentWrapper>
                        </React.Fragment>
                    )}
                </>
            ) : (
                <div className="detailsBannerSkeleton">
                    <ContentWrapper>
                        <div className="left skeleton"></div>
                        <div className="right">
                            <div className="row skeleton"></div>
                            <div className="row skeleton"></div>
                            <div className="row skeleton"></div>
                            <div className="row skeleton"></div>
                            <div className="row skeleton"></div>
                            <div className="row skeleton"></div>
                            <div className="row skeleton"></div>
                        </div>
                    </ContentWrapper>
                </div>
            )}
        </div>
    );
};

export default DetailsBanner;
