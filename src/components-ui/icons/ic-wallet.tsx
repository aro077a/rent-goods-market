import React, { ReactElement } from "react";

const IcWallet = ({ fill }: { fill?: string }): ReactElement => (
  <svg
    width="23"
    height="20"
    viewBox="0 0 23 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill={fill || "var(--f7-text-color)"}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.5 2H6.5C4.29086 2 2.5 3.79086 2.5 6V14C2.5 16.2091 4.29086 18 6.5 18H16.5C18.7091 18 20.5 16.2091 20.5 14V6C20.5 3.79086 18.7091 2 16.5 2ZM6.5 0C3.18629 0 0.5 2.68629 0.5 6V14C0.5 17.3137 3.18629 20 6.5 20H16.5C19.8137 20 22.5 17.3137 22.5 14V6C22.5 2.68629 19.8137 0 16.5 0H6.5Z"
    />
    <path
      fill={fill || "var(--f7-text-color)"}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20.5 8H16.5C15.3954 8 14.5 8.89543 14.5 10C14.5 11.1046 15.3954 12 16.5 12H20.5V8ZM16.5 6C14.2909 6 12.5 7.79086 12.5 10C12.5 12.2091 14.2909 14 16.5 14H22.5V6H16.5Z"
    />
    <path
      fill={fill || "var(--f7-text-color)"}
      d="M17.5 10C17.5 10.5523 17.0523 11 16.5 11C15.9477 11 15.5 10.5523 15.5 10C15.5 9.44771 15.9477 9 16.5 9C17.0523 9 17.5 9.44771 17.5 10Z"
    />
  </svg>
);

export default IcWallet;
