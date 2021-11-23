import React from "react";

export default ({ fill, slot }: { fill?: string; slot?: string }) => (
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
      d="M7 7H5L5 9H7V7ZM5 5C3.89543 5 3 5.89543 3 7V9C3 10.1046 3.89543 11 5 11H7C8.10457 11 9 10.1046 9 9V7C9 5.89543 8.10457 5 7 5H5Z"
      fill={fill || "var(--f7-text-color)"}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 15H5L5 17H7V15ZM5 13C3.89543 13 3 13.8954 3 15V17C3 18.1046 3.89543 19 5 19H7C8.10457 19 9 18.1046 9 17V15C9 13.8954 8.10457 13 7 13H5Z"
      fill={fill || "var(--f7-text-color)"}
    />
    <path
      d="M11 8C11 7.44772 11.4477 7 12 7H20C20.5523 7 21 7.44772 21 8C21 8.55228 20.5523 9 20 9H12C11.4477 9 11 8.55228 11 8Z"
      fill={fill || "var(--f7-text-color)"}
    />
    <path
      d="M11 16C11 15.4477 11.4477 15 12 15H20C20.5523 15 21 15.4477 21 16C21 16.5523 20.5523 17 20 17H12C11.4477 17 11 16.5523 11 16Z"
      fill={fill || "var(--f7-text-color)"}
    />
  </svg>
);
