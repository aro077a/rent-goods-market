import React from "react";

export default ({
  fill,
  width = "52",
  height = "48",
}: {
  fill?: string;
  width?: string;
  height?: string;
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 52 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="51.0612" height="48" rx="18" fill="#8E79CB" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13 17C13 15.3431 14.3431 14 16 14H27C28.6569 14 30 15.3431 30 17V27C30 28.1046 29.1046 29 28 29H15C13.8954 29 13 28.1046 13 27V17ZM16 16C15.4477 16 15 16.4477 15 17V27H28V17C28 16.4477 27.5523 16 27 16H16Z"
      fill="white"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M28 20C28 19.4477 28.4477 19 29 19H31.7574C32.8182 19 33.8356 19.4214 34.5858 20.1716L35.8284 21.4142C36.5786 22.1644 37 23.1818 37 24.2426V27C37 28.1046 36.1046 29 35 29H29C28.4477 29 28 28.5523 28 28V20ZM30 21V27H35V24.2426C35 23.7122 34.7893 23.2035 34.4142 22.8284L33.1716 21.5858C32.7965 21.2107 32.2878 21 31.7574 21H30Z"
      fill={fill || "white"}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.1004 27.2004C17.542 27.5321 17.6311 28.159 17.2994 28.6006C17.1111 28.8512 17 29.1612 17 29.5C17 30.3284 17.6716 31 18.5 31C19.3284 31 20 30.3284 20 29.5C20 29.1612 19.8889 28.8512 19.7006 28.6006C19.3689 28.159 19.458 27.5321 19.8996 27.2004C20.3412 26.8687 20.9681 26.9578 21.2997 27.3994C21.7392 27.9845 22 28.7132 22 29.5C22 31.433 20.433 33 18.5 33C16.567 33 15 31.433 15 29.5C15 28.7132 15.2608 27.9845 15.7003 27.3994C16.0319 26.9578 16.6588 26.8687 17.1004 27.2004Z"
      fill={fill || "white"}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M30.1004 27.2004C30.542 27.5321 30.6311 28.159 30.2994 28.6006C30.1111 28.8512 30 29.1612 30 29.5C30 30.3284 30.6716 31 31.5 31C32.3284 31 33 30.3284 33 29.5C33 29.1612 32.8889 28.8512 32.7006 28.6006C32.3689 28.159 32.458 27.5321 32.8996 27.2004C33.3412 26.8687 33.9681 26.9578 34.2997 27.3994C34.7392 27.9845 35 28.7132 35 29.5C35 31.433 33.433 33 31.5 33C29.567 33 28 31.433 28 29.5C28 28.7132 28.2608 27.9845 28.7003 27.3994C29.0319 26.9578 29.6588 26.8687 30.1004 27.2004Z"
      fill={fill || "white"}
    />
  </svg>
);