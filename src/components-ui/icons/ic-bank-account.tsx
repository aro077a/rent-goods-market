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
      d="M0 6C0 2.68629 2.68629 0 6 0H26C29.3137 0 32 2.68629 32 6V18C32 21.3137 29.3137 24 26 24H6C2.68629 24 0 21.3137 0 18V6Z"
    />
    <path
      fill={fill || "var(--base-60)"}
      opacity="0.5"
      d="M17 12C17 9.23858 19.2386 7 22 7H32V17H22C19.2386 17 17 14.7614 17 12Z"
    />
    <circle fill={fill || "var(--base-70)"} cx="22" cy="12" r="2" />
  </svg>
);
