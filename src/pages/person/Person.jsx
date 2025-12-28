import React from "react";
import { useParams } from "react-router-dom";
import "./style.scss";

import useFetch from "../../hooks/useFetch";
import PersonBanner from "./personBanner/PersonBanner";
import PersonCredits from "./personCredits/PersonCredits";

const Person = () => {
    const { id } = useParams();
    const { data, loading } = useFetch(`/person/${id}`);
    const { data: credits, loading: creditsLoading } = useFetch(`/person/${id}/combined_credits`);

    return (
        <div className="person-page">
            <PersonBanner data={data} loading={loading} />
            <PersonCredits credits={credits} loading={creditsLoading} />
        </div>
    );
};

export default Person;
