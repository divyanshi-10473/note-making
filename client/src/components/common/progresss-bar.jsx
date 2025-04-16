import React from "react";
import {
  CircularProgressbar,
  buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CircleProgress = ({ percentage }) => {
  return (
    <div style={{ width: 50, height: 50 }}>
      <CircularProgressbar
        value={percentage}
        text={`${percentage}%`}
        styles={buildStyles({
          pathColor: "rgb(255 175 87)", // warm orange
          textColor: "white", // dark brown
          trailColor: "rgb(135 100 60)", // light cream
          textSize: "28px",
          strokeLinecap: "round",
        })}
      />
    </div>
  );
};

export default CircleProgress;
