import React from "react";

export default ({ fill }: { fill?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill={fill || "var(--f7-text-color)"}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.49012e-08 8C1.49012e-08 7.44772 0.447715 7 1 7H15C15.5523 7 16 7.44772 16 8C16 8.55228 15.5523 9 15 9H1C0.447715 9 1.49012e-08 8.55228 1.49012e-08 8Z"
    />
    <path
      fill={fill || "var(--f7-text-color)"}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.70711 0.292893C9.09763 0.683417 9.09763 1.31658 8.70711 1.70711L2.41421 8L8.70711 14.2929C9.09763 14.6834 9.09763 15.3166 8.70711 15.7071C8.31658 16.0976 7.68342 16.0976 7.29289 15.7071L0.292893 8.70711C-0.0976311 8.31658 -0.0976311 7.68342 0.292893 7.29289L7.29289 0.292893C7.68342 -0.0976311 8.31658 -0.0976311 8.70711 0.292893Z"
    />
  </svg>
);