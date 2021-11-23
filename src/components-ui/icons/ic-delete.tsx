import React from "react";

export default ({ fill }: { fill?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 6C6.55228 6 7 6.44772 7 7V19C7 19.5523 7.44772 20 8 20H16C16.5523 20 17 19.5523 17 19V7C17 6.44772 17.4477 6 18 6C18.5523 6 19 6.44772 19 7V19C19 20.6569 17.6569 22 16 22H8C6.34315 22 5 20.6569 5 19V7C5 6.44772 5.44772 6 6 6Z"
      fill={fill || "white"}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 6C3 5.44772 3.44772 5 4 5L20 5C20.5523 5 21 5.44772 21 6C21 6.55229 20.5523 7 20 7L4 7C3.44772 7 3 6.55228 3 6Z"
      fill={fill || "white"}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 3C10.4477 3 10 3.44772 10 4V5C10 5.55228 9.55228 6 9 6C8.44772 6 8 5.55228 8 5V4C8 2.34315 9.34315 1 11 1H13C14.6569 1 16 2.34315 16 4V5C16 5.55228 15.5523 6 15 6C14.4477 6 14 5.55228 14 5V4C14 3.44772 13.5523 3 13 3H11Z"
      fill={fill || "white"}
    />
  </svg>
);
