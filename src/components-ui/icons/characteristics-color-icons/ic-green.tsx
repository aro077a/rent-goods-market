import React, { FC } from "react";

export const IcGreen: FC = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="10" cy="10" r="10" fill="#63CD70" />
      <rect y="10" width="10" height="10" fill="white" fillOpacity="0.3" />
      <rect width="10" height="10" fill="black" fillOpacity="0.1" />
      <rect
        x="10"
        y="10"
        width="10"
        height="10"
        fill="black"
        fillOpacity="0.5"
      />
      <rect x="10" width="10" height="10" fill="black" fillOpacity="0.3" />
    </svg>
  );
};
