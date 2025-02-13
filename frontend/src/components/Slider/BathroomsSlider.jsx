import React, { useState } from "react";


const BathroomInputSlider = ({value, onChange}) => {

  return (
    <div className="bathroom-group">
      <div className="bathroom-slider-container">
        <input
          id="bathroom-slider"
          className="bathroom-slider"
          type="range"
          min="0"
          max="20"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default BathroomInputSlider;
