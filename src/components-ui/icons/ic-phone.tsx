import React from "react";

export default ({ fill }: { fill?: string }) => (
  <svg
    width="14"
    height="21"
    viewBox="0 0 14 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 2H11C11.5523 2 12 2.44772 12 3V18C12 18.5523 11.5523 19 11 19H3C2.44772 19 2 18.5523 2 18V3C2 2.44772 2.44772 2 3 2ZM0 3C0 1.34315 1.34315 0 3 0H11C12.6569 0 14 1.34315 14 3V18C14 19.6569 12.6569 21 11 21H3C1.34315 21 0 19.6569 0 18V3ZM5 16C4.44772 16 4 16.4477 4 17C4 17.5523 4.44772 18 5 18H9C9.55228 18 10 17.5523 10 17C10 16.4477 9.55228 16 9 16H5Z"
      fill={fill || "#202020"}
    />
  </svg>
);
