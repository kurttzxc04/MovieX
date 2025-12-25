import React, { useState } from "react";
import "./style.scss";

const CategoryPills = ({ onSelect }) => {
    const [activeCategory, setActiveCategory] = useState("All");

    const categories = [
        "All",
        "Action",
        "Animation",
        "Adventure",
        "Horror",
        "Documentary",
        "Romance",
        "Kids",
    ];

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
        onSelect?.(category);
    };

    return (
        <div className="category-pills">
            {categories.map((category) => (
                <button
                    key={category}
                    className={`category-pill ${
                        activeCategory === category ? "active" : ""
                    }`}
                    onClick={() => handleCategoryClick(category)}
                >
                    {category}
                </button>
            ))}
        </div>
    );
};

export default CategoryPills;
