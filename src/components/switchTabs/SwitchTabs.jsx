import React, { useState, useRef, useEffect } from "react";

import "./style.scss";

const SwitchTabs = ({ data, onTabChange }) => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [left, setLeft] = useState(0);
    const [width, setWidth] = useState(0);
    const tabItemsRef = useRef([]);

    const updateMovingBg = (index) => {
        const activeTabElement = tabItemsRef.current[index];
        if (activeTabElement) {
            setLeft(activeTabElement.offsetLeft - 4);
            setWidth(activeTabElement.offsetWidth);
        }
    };

    const activeTab = (tab, index) => {
        setSelectedTab(index);
        updateMovingBg(index);
        onTabChange(tab, index);
    };

    const handleTabRef = (el, index) => {
        if (el) {
            tabItemsRef.current[index] = el;
        }
    };

    useEffect(() => {
        updateMovingBg(selectedTab);
    }, [selectedTab, data]);

    return (
        <div className="switchingTabs">
            <div className="tabItems">
                {data.map((tab, index) => (
                    <span
                        key={index}
                        ref={(el) => handleTabRef(el, index)}
                        className={`tabItem ${
                            selectedTab === index ? "active" : ""
                        }`}
                        onClick={() => activeTab(tab, index)}
                    >
                        {tab}
                    </span>
                ))}
                <span className="movingBg" style={{ left, width }} />
            </div>
        </div>
    );
};

export default SwitchTabs;
