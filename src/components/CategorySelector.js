import React from "react";
import "../styles/CategorySelector.css";

const CategorySelector = ({ category, setCategory }) => {
  return (
    <div className="category-section">
      <label>분류:</label>
      <div className="category-options">
        <label>
          <input
            type="radio"
            name="category"
            value="origin"
            checked={category === "origin"}
            onChange={() => setCategory("origin")}
          />
          Origin
        </label>
        <label>
          <input
            type="radio"
            name="category"
            value="variant"
            checked={category === "variant"}
            onChange={() => setCategory("variant")}
          />
          Variant
        </label>
      </div>
    </div>
  );
};

export default CategorySelector;