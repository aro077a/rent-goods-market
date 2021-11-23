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
      d="M4.73346 3.68807L2.54756 17.5321C2.26005 19.353 3.6674 21 5.51085 21H18.4891C20.3326 21 21.7399 19.353 21.4524 17.5321L19.2665 3.68807C19.113 2.71597 18.2752 2 17.291 2H6.70899C5.72484 2 4.88695 2.71597 4.73346 3.68807Z"
      stroke={fill || "var(--f7-text-color)"}
      strokeWidth="2"
    />
    <path
      d="M8 7V7C8 9.20914 9.79086 11 12 11V11C14.2091 11 16 9.20914 16 7V7"
      stroke={fill || "var(--f7-text-color)"}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
