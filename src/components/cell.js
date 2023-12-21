import React from "react";
import "../App.css";

const Cell = ({ isInitial, number, onChange }) => {
  return (
    <div
      className={`cell ${isInitial ? "initial" : ""}`}
      onClick={(e) => {
        if (isInitial) {
          return;
        }
        onChange((number + 1) % 5);
      }}
    >
      {number !== 0 && number}
    </div>
  );
};

export default Cell;
