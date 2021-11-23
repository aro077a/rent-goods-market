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
      d="M16 8C16 7.44772 16.4477 7 17 7L20 7C20.5523 7 21 7.44772 21 8C21 8.55229 20.5523 9 20 9L17 9C16.4477 9 16 8.55228 16 8Z"
      fill={fill || "#1A1A1A"}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 8C3 7.44772 3.44772 7 4 7H13C13.5523 7 14 7.44772 14 8C14 8.55228 13.5523 9 13 9H4C3.44772 9 3 8.55228 3 8Z"
      fill={fill || "#1A1A1A"}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15 9C15.5523 9 16 8.55228 16 8C16 7.44772 15.5523 7 15 7C14.4477 7 14 7.44772 14 8C14 8.55228 14.4477 9 15 9ZM15 11C16.6569 11 18 9.65685 18 8C18 6.34315 16.6569 5 15 5C13.3431 5 12 6.34315 12 8C12 9.65685 13.3431 11 15 11Z"
      fill={fill || "#1A1A1A"}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 16C8 16.5523 7.55228 17 7 17H4C3.44772 17 3 16.5523 3 16C3 15.4477 3.44772 15 4 15H7C7.55228 15 8 15.4477 8 16Z"
      fill={fill || "#1A1A1A"}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21 16C21 16.5523 20.5523 17 20 17H11C10.4477 17 10 16.5523 10 16C10 15.4477 10.4477 15 11 15H20C20.5523 15 21 15.4477 21 16Z"
      fill={fill || "#1A1A1A"}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9 15C8.44772 15 8 15.4477 8 16C8 16.5523 8.44772 17 9 17C9.55228 17 10 16.5523 10 16C10 15.4477 9.55228 15 9 15ZM9 13C7.34315 13 6 14.3431 6 16C6 17.6569 7.34315 19 9 19C10.6569 19 12 17.6569 12 16C12 14.3431 10.6569 13 9 13Z"
      fill={fill || "#1A1A1A"}
    />
  </svg>
);
