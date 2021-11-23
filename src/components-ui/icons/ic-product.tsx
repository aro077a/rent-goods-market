import React, { ReactElement } from "react";

const IcProduct = ({
  fill,
  slot,
}: {
  fill?: string;
  slot?: string;
}): ReactElement => (
  <svg
    width="22"
    height="21"
    viewBox="0 0 22 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.73346 2.68807L1.54756 16.5321C1.26005 18.353 2.6674 20 4.51085 20H17.4891C19.3326 20 20.7399 18.353 20.4524 16.5321L18.2665 2.68807C18.113 1.71597 17.2752 1 16.291 1H5.70899C4.72484 1 3.88695 1.71597 3.73346 2.68807Z"
      stroke={fill || "var(--f7-text-color)"}
      strokeWidth="2"
    />
    <path
      d="M7 6V6C7 8.20914 8.79086 10 11 10V10C13.2091 10 15 8.20914 15 6V6"
      stroke={fill || "var(--f7-text-color)"}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default IcProduct;
