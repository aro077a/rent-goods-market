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
      d="M15.2929 4.29289C14.9024 4.68342 14.9024 5.31658 15.2929 5.70711L19.2929 9.70711C19.6834 10.0976 20.3166 10.0976 20.7071 9.70711C21.0976 9.31658 21.0976 8.68342 20.7071 8.29289L16.7071 4.29289C16.3166 3.90237 15.6834 3.90237 15.2929 4.29289Z"
      fill={fill || "var(--f7-text-color)"}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 9C3 8.44772 3.44772 8 4 8H20C20.5523 8 21 8.44772 21 9C21 9.55228 20.5523 10 20 10H4C3.44772 10 3 9.55228 3 9Z"
      fill={fill || "var(--f7-text-color)"}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.70711 19.7071C9.09763 19.3166 9.09763 18.6834 8.70711 18.2929L4.70711 14.2929C4.31658 13.9024 3.68342 13.9024 3.29289 14.2929C2.90237 14.6834 2.90237 15.3166 3.29289 15.7071L7.29289 19.7071C7.68342 20.0976 8.31658 20.0976 8.70711 19.7071Z"
      fill={fill || "var(--f7-text-color)"}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21 15C21 15.5523 20.5523 16 20 16H4C3.44772 16 3 15.5523 3 15C3 14.4477 3.44772 14 4 14H20C20.5523 14 21 14.4477 21 15Z"
      fill={fill || "var(--f7-text-color)"}
    />
  </svg>
);
