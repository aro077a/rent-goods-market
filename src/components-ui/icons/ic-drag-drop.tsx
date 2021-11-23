import React from "react";

export default ({ fill }: { fill?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="9.5" cy="6.5" r="1.5" fill={fill || "#676767"} />
    <circle cx="15.5" cy="6.5" r="1.5" fill={fill || "#676767"} />
    <circle cx="9.5" cy="12.5" r="1.5" fill={fill || "#676767"} />
    <circle cx="15.5" cy="12.5" r="1.5" fill={fill || "#676767"} />
    <circle cx="9.5" cy="18.5" r="1.5" fill={fill || "#676767"} />
    <circle cx="15.5" cy="18.5" r="1.5" fill={fill || "#676767"} />
  </svg>
);
