import React from "react";

export default ({
  className,
  size = "24",
  fill,
}: {
  className?: string;
  size?: string;
  fill?: string;
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.09091 3.5C5.91172 3.5 5 4.4369 5 5.53846V18.4615C5 19.5631 5.91172 20.5 7.09091 20.5H16.9091C18.0883 20.5 19 19.5631 19 18.4615V7.98984L14.4518 3.5H7.09091ZM19.1157 8.10402C19.1158 8.10419 19.1155 8.10385 19.1157 8.10402V8.10402ZM3 5.53846C3 3.30808 4.83156 1.5 7.09091 1.5H14.5949C15.0289 1.5 15.4451 1.67019 15.752 1.97314L20.5207 6.68071C20.8276 6.98365 21 7.39453 21 7.82296V18.4615C21 20.6919 19.1684 22.5 16.9091 22.5H7.09091C4.83156 22.5 3 20.6919 3 18.4615V5.53846Z"
      fill={!className ? fill : ""}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.5 6.42857V3H14.5V6.42857C14.5 7.29645 15.2036 8 16.0714 8H19.5V10H16.0714C14.099 10 12.5 8.40102 12.5 6.42857Z"
      fill={!className ? fill : ""}
    />
    <path
      d="M7 12C7 11.4477 7.44772 11 8 11H14C14.5523 11 15 11.4477 15 12C15 12.5523 14.5523 13 14 13H8C7.44772 13 7 12.5523 7 12Z"
      fill={!className ? fill : ""}
    />
    <path
      d="M7 16C7 15.4477 7.44772 15 8 15H16C16.5523 15 17 15.4477 17 16C17 16.5523 16.5523 17 16 17H8C7.44772 17 7 16.5523 7 16Z"
      fill={!className ? fill : ""}
    />
  </svg>
);
