import React from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import "./style.scss";

import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import Img from "../../../components/lazyLoadImage/Img";
import avatar from "../../../assets/avatar.png";

const PersonBanner = ({ data, loading }) => {
    const { url } = useSelector((state) => state.home);

    if (loading) {
        return (
            <div className="person-banner">
                <ContentWrapper>
                    <div className="person-banner__skeleton">
                        <div className="person-banner__image skeleton"></div>
                        <div className="person-banner__info">
                            <div className="skeleton" style={{ height: 40, marginBottom: 20 }}></div>
                            <div className="skeleton" style={{ height: 20, marginBottom: 10 }}></div>
                            <div className="skeleton" style={{ height: 20, marginBottom: 10 }}></div>
                            <div className="skeleton" style={{ height: 100 }}></div>
                        </div>
                    </div>
                </ContentWrapper>
            </div>
        );
    }

    const profileImg = data?.profile_path ? url.profile + data.profile_path : avatar;

    return (
        <div className="person-banner">
            <ContentWrapper>
                <div className="person-banner__content">
                    <div className="person-banner__image">
                        <Img src={profileImg} alt={data?.name} />
                    </div>
                    <div className="person-banner__info">
                        <h1 className="person-banner__name">{data?.name}</h1>
                        
                        {data?.birthday && (
                            <div className="person-banner__detail">
                                <span className="label">Born:</span>
                                <span className="value">
                                    {dayjs(data.birthday).format("MMMM D, YYYY")}
                                    {data.place_of_birth && ` in ${data.place_of_birth}`}
                                </span>
                            </div>
                        )}

                        {data?.deathday && (
                            <div className="person-banner__detail">
                                <span className="label">Died:</span>
                                <span className="value">
                                    {dayjs(data.deathday).format("MMMM D, YYYY")}
                                </span>
                            </div>
                        )}

                        {data?.known_for_department && (
                            <div className="person-banner__detail">
                                <span className="label">Known For:</span>
                                <span className="value">{data.known_for_department}</span>
                            </div>
                        )}

                        {data?.biography && (
                            <div className="person-banner__biography">
                                <h2>Biography</h2>
                                <p>{data.biography}</p>
                            </div>
                        )}
                    </div>
                </div>
            </ContentWrapper>
        </div>
    );
};

export default PersonBanner;
