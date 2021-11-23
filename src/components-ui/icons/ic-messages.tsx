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
      d="M20.9938 12.0052L20.9938 12L20.9938 11.411C20.8604 9.2262 19.9324 7.16484 18.3838 5.6162C16.8352 4.06755 14.7738 3.13958 12.589 3.00623H11.9607C10.575 3.00261 9.2352 3.32492 7.98687 3.95546L7.97926 3.9593C6.48551 4.70585 5.22909 5.85353 4.35076 7.27381C3.47243 8.69408 3.00687 10.3309 3.00623 12.0008L3.00622 12.0052C3.00259 13.3973 3.32783 14.7706 3.95546 16.0131C4.15799 16.4141 4.22009 16.8715 4.1318 17.3119L3.49096 20.509L6.68809 19.8682C7.12855 19.7799 7.58589 19.842 7.98687 20.0445C9.22944 20.6722 10.6027 20.9974 11.9948 20.9938L11.9992 20.9938C13.6691 20.9931 15.3059 20.5276 16.7262 19.6492C18.1465 18.7709 19.2942 17.5145 20.0407 16.0207L20.0445 16.0131C20.6722 14.7706 20.9974 13.3973 20.9938 12.0052ZM12.6471 1.00004C15.3444 1.14885 17.8922 2.28737 19.8024 4.19761C21.7126 6.10785 22.8512 8.65556 23 11.3529V12C23.0044 13.7081 22.6054 15.393 21.8353 16.9176C20.9222 18.7446 19.5185 20.2813 17.7814 21.3555C16.0443 22.4298 14.0424 22.9992 12 23C10.2919 23.0044 8.60698 22.6053 7.08237 21.8353L2.40858 22.7721C1.7064 22.9128 1.08716 22.2936 1.22791 21.5914L2.16474 16.9176C1.39465 15.393 0.995583 13.7081 1.00004 12C1.00083 9.95758 1.57024 7.9557 2.64449 6.21861C3.71874 4.48152 5.25541 3.07782 7.08237 2.16474C8.60698 1.39465 10.2579 0.995583 11.966 1.00004H12.6471ZM7 10C7 9.44771 7.44772 9 8 9H16C16.5523 9 17 9.44771 17 10C17 10.5523 16.5523 11 16 11H8C7.44772 11 7 10.5523 7 10ZM8 13C7.44772 13 7 13.4477 7 14C7 14.5523 7.44772 15 8 15H13C13.5523 15 14 14.5523 14 14C14 13.4477 13.5523 13 13 13H8Z"
      fill={fill || "#1A1A1A"}
    />
  </svg>
);
