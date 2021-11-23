import React from "react";

import { IcIcon } from "@/types/shared/icons";

export const IcLocation: IcIcon = ({ fill, ...props }) => (
  <svg
    width="12"
    height="15"
    viewBox="0 0 12 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.54808 14.5954C8.02902 13.4506 12 10.0191 12 6.13636C12 4.5089 11.3679 2.94809 10.2426 1.7973C9.11742 0.646508 7.5913 0 6 0C4.4087 0 2.88258 0.646508 1.75736 1.7973C0.632141 2.94809 0 4.5089 0 6.13636C0 10.0191 3.97098 13.4506 5.45192 14.5954C5.77733 14.8469 6.22267 14.8469 6.54808 14.5954ZM9 6C9 7.65685 7.65685 9 6 9C4.34315 9 3 7.65685 3 6C3 4.34315 4.34315 3 6 3C7.65685 3 9 4.34315 9 6Z"
      fill={fill || "#949494"}
    />
  </svg>
);
