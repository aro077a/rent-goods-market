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
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 10C0 9.44772 0.447715 9 1 9H23C23.5523 9 24 9.44772 24 10C24 10.5523 23.5523 11 23 11H22L20.5729 21.2751C20.4356 22.2639 19.5902 23 18.5919 23H5.40809C4.40983 23 3.56443 22.2639 3.4271 21.2751L2 11H1C0.447716 11 0 10.5523 0 10ZM20 11H4L5.21762 20.1322C5.28386 20.629 5.70765 21 6.20885 21H17.7911C18.2924 21 18.7161 20.629 18.7824 20.1322L20 11Z"
      fill={fill || "var(--f7-text-color)"}
    />
    <path
      d="M7 14C7 13.4477 7.44772 13 8 13C8.55228 13 9 13.4477 9 14V18C9 18.5523 8.55228 19 8 19C7.44772 19 7 18.5523 7 18V14Z"
      fill={fill || "var(--f7-text-color)"}
    />
    <path
      d="M15 14C15 13.4477 15.4477 13 16 13C16.5523 13 17 13.4477 17 14V18C17 18.5523 16.5523 19 16 19C15.4477 19 15 18.5523 15 18V14Z"
      fill={fill || "var(--f7-text-color)"}
    />
    <path
      d="M11 14C11 13.4477 11.4477 13 12 13C12.5523 13 13 13.4477 13 14V18C13 18.5523 12.5523 19 12 19C11.4477 19 11 18.5523 11 18V14Z"
      fill={fill || "var(--f7-text-color)"}
    />
    <path
      d="M19.0005 8C19.0005 4.13401 15.8665 1 12.0005 1C8.13452 1 5.00052 4.13401 5.00052 8H7.00052C7.00052 5.23858 9.23909 3 12.0005 3C14.7619 3 17.0005 5.23858 17.0005 8H19.0005Z"
      fill={fill || "var(--f7-text-color)"}
    />
  </svg>
);
