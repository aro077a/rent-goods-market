import React from "react";

// @ts-ignore
export default ({ fill, slot }: { fill?: string; slot?: string }) => (
  <svg
    width="32"
    height="24"
    viewBox="0 0 32 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill={fill || "var(--base-30)"}
      d="M0 4C0 1.79086 1.79086 0 4 0H28C30.2091 0 32 1.79086 32 4V20C32 22.2091 30.2091 24 28 24H4C1.79086 24 0 22.2091 0 20V4Z"
    />
    <rect
      fill={fill || "var(--base-60)"}
      x="4"
      y="4"
      width="12"
      height="8"
      rx="1"
    />
    <rect
      fill={fill || "var(--base-60)"}
      x="4"
      y="18"
      width="4"
      height="2"
      rx="1"
    />
    <rect
      fill={fill || "var(--base-60)"}
      x="10"
      y="18"
      width="4"
      height="2"
      rx="1"
    />
    <rect
      fill={fill || "var(--base-60)"}
      x="16"
      y="18"
      width="4"
      height="2"
      rx="1"
    />
    <rect
      fill={fill || "var(--base-60)"}
      x="22"
      y="18"
      width="4"
      height="2"
      rx="1"
    />
  </svg>
);
