import React from "react";

export default ({ fill }: { fill?: string }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.0158 8.57703C15.3901 8.20732 15.895 8 16.4212 8H25.5789C26.105 8 26.6099 8.20732 26.9843 8.57703L30 11.5556H35.4C37.38 11.5556 39 13.1556 39 15.1111V29.0164C38.8348 29.0055 38.668 29 38.5 29C34.3579 29 31 32.3579 31 36.5C31 37.7641 31.3127 38.9551 31.8651 40H6.6C4.62 40 3 38.4 3 36.4445V15.1111C3 13.1556 4.62 11.5556 6.6 11.5556H12L15.0158 8.57703ZM12 25.7777C12 30.6844 16.032 34.6666 21 34.6666C25.968 34.6666 30 30.6844 30 25.7777C30 20.8711 25.968 16.8889 21 16.8889C16.032 16.8889 12 20.8711 12 25.7777ZM20.9998 31.2C24.1009 31.2 26.7272 28.8719 26.7272 26C26.7272 23.1281 24.1009 20.8 20.9998 20.8C17.8988 20.8 15.2726 23.1281 15.2726 26C15.2726 28.8719 17.8988 31.2 20.9998 31.2ZM37 33.5C37 32.6716 37.6716 32 38.5 32C39.3284 32 40 32.6716 40 33.5V35H41.5C42.3284 35 43 35.6716 43 36.5C43 37.3284 42.3284 38 41.5 38H40V39.5C40 40.3284 39.3284 41 38.5 41C37.6716 41 37 40.3284 37 39.5V38H35.5C34.6716 38 34 37.3284 34 36.5C34 35.6716 34.6716 35 35.5 35H37V33.5Z"
      fill={fill || "#C4C4C4"}
    />
  </svg>
);
